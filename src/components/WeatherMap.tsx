import { MapContainer, Marker, Popup, TileLayer, Circle, Polygon, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { getMapMarkers } from '../services/weatherService';
import type { MapMarker } from '../types/weather';

interface WeatherMapProps {
  selectedRegion?: string;
}

const markerStyles = {
  rain: { color: '#38bdf8', fillColor: '#38bdf8', opacity: 0.9 },
  heat: { color: '#f97316', fillColor: '#f97316', opacity: 0.9 },
  storm: { color: '#facc15', fillColor: '#facc15', opacity: 0.9 },
  alert: { color: '#f43f5e', fillColor: '#f43f5e', opacity: 0.95 },
};

const customIcon = (type: 'rain' | 'heat' | 'storm' | 'alert') =>
  new L.DivIcon({
    className: 'custom-marker',
    html: `<span style="display:flex; align-items:center; justify-content:center; width:16px; height:16px; border-radius:50%; background:${markerStyles[type].fillColor}; border:2px solid rgba(255,255,255,0.8); box-shadow:0 0 0 8px ${markerStyles[type].fillColor}22;"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

const indiaOutline: [number, number][] = [
  [8.5, 68.2], [12.4, 72], [16.7, 73.9], [19.2, 77.6], [23.4, 81.4], [28.1, 88.5], [31.1, 97.4], [27.1, 97.8], [25.3, 94.2], [20.7, 90.3], [18.2, 85.1], [15.2, 81.5], [12.8, 77.5], [9.6, 73.2], [8.5, 68.2],
];

export default function WeatherMap({ selectedRegion = 'All India' }: WeatherMapProps) {
  const [selectedLayer, setSelectedLayer] = useState<'Rainfall' | 'Temperature' | 'Wind' | 'Satellite'>('Rainfall');
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    let active = true;

    const loadMarkers = async () => {
      const nextMarkers = await getMapMarkers();
      if (active) {
        setMapMarkers(nextMarkers);
      }
    };

    void loadMarkers();

    return () => {
      active = false;
    };
  }, []);

  const layerColors = {
    Rainfall: '#38bdf8',
    Temperature: '#f97316',
    Wind: '#22c55e',
    Satellite: '#a78bfa',
  } as const;

  const regionMarkers = useMemo(() => {
    if (selectedRegion === 'All India') {
      return mapMarkers;
    }

    const regionKey = selectedRegion.toLowerCase();
    return mapMarkers.filter((marker) => {
      const candidate = `${marker.name} ${marker.label}`.toLowerCase();
      return candidate.includes(regionKey) || candidate.includes(regionKey.replace(/\s+/g, ''));
    });
  }, [mapMarkers, selectedRegion]);

  const regionTitle = selectedRegion === 'All India' ? 'India' : selectedRegion;

  return (
    <div className="h-[420px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{regionTitle} Weather Map</h3>
          <p className="text-xs text-slate-400">Rainfall, heat, cyclone and alerts</p>
        </div>
        <div className="flex gap-2 text-xs text-slate-300">
          {['Rainfall', 'Temperature', 'Wind', 'Satellite'].map((layer) => (
            <button
              key={layer}
              onClick={() => setSelectedLayer(layer as keyof typeof layerColors)}
              className={`rounded-full border px-2 py-1 transition ${selectedLayer === layer ? 'border-sky-500/40 bg-sky-500/10 text-sky-200' : 'border-slate-700 hover:border-sky-500/40 hover:text-white'}`}
              type="button"
            >
              {layer}
            </button>
          ))}
        </div>
      </div>
      <MapContainer center={[22.5, 78.5]} zoom={5} scrollWheelZoom className="h-[360px] w-full" style={{ background: '#020817' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon positions={indiaOutline} pathOptions={{ color: layerColors[selectedLayer], fillColor: '#0f172a', fillOpacity: 0.2, weight: 1.2 }} />
        {regionMarkers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={customIcon(marker.type)}>
            <Popup>
              <div className="text-sm text-slate-800">
                <strong>{marker.name}</strong>
                <div>{marker.label}</div>
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -10]}>{marker.name}</Tooltip>
          </Marker>
        ))}
        <Circle center={[19.5, 87.5]} radius={250000} pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.12 }} />
        <Polyline positions={[[18.3, 85.2], [19.8, 85.9], [21.7, 86.8], [22.8, 88.5]]} pathOptions={{ color: layerColors[selectedLayer], weight: 3 }} />
      </MapContainer>
    </div>
  );
}
