import { Search } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer, Circle, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { getCities, getMapMarkers } from '../services/weatherService';
import type { CityWeather, MapMarker } from '../types/weather';

const markerStyles = {
  rain: '#38bdf8',
  heat: '#f97316',
  storm: '#facc15',
  alert: '#f43f5e',
} as const;

const layerOptions = ['Rainfall', 'Temperature', 'Wind', 'Satellite'] as const;
type LayerOption = (typeof layerOptions)[number];

const customIcon = (type: keyof typeof markerStyles) => new L.DivIcon({
  className: 'custom-marker',
  html: `<span style="display:flex; align-items:center; justify-content:center; width:18px; height:18px; border-radius:50%; background:${markerStyles[type]}; border:2px solid rgba(255,255,255,0.8); box-shadow:0 0 0 8px ${markerStyles[type]}22;"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function MapPage() {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityWeather | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLayer, setSelectedLayer] = useState<LayerOption>('Rainfall');
  const [selectedRegion, setSelectedRegion] = useState('All states');

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const [cityData, markerData] = await Promise.all([getCities(), getMapMarkers()]);
      if (!active) {
        return;
      }

      setCities(cityData);
      setMapMarkers(markerData);
      if (cityData.length > 0) {
        setSelectedCity(cityData[0]);
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const filteredCities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let nextCities = cities;

    if (selectedRegion !== 'All states') {
      nextCities = nextCities.filter((city) => city.state === selectedRegion);
    }

    if (!query) {
      return nextCities;
    }

    return nextCities.filter((city) => {
      return city.name.toLowerCase().includes(query) || city.state.toLowerCase().includes(query);
    });
  }, [cities, searchQuery, selectedRegion]);

  useEffect(() => {
    if (!selectedCity || filteredCities.length === 0) {
      return;
    }

    if (!filteredCities.some((city) => city.id === selectedCity.id)) {
      setSelectedCity(filteredCities[0]);
    }
  }, [filteredCities, selectedCity]);

  const visibleCities = filteredCities.slice(0, 5);
  const visibleMarkers = useMemo(() => {
    const allowedNames = new Set(filteredCities.map((city) => city.name));
    return mapMarkers.filter((marker) => allowedNames.has(marker.name));
  }, [filteredCities, mapMarkers]);

  if (!selectedCity) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-300">
        Loading live weather map data...
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-3 shadow-xl shadow-slate-950/20">
        <div className="mb-3 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
            <Search size={15} className="text-sky-300" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="Search state or city"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
            {['All states', 'Maharashtra', 'Odisha', 'Delhi', 'Kerala'].map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`rounded-full border px-2 py-1.5 transition ${selectedRegion === region ? 'border-sky-500/40 bg-sky-500/10 text-sky-200' : 'border-slate-700 hover:border-sky-500/40'}`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-200">
            {layerOptions.map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => setSelectedLayer(layer)}
                className={`rounded-full border px-2 py-1.5 transition ${selectedLayer === layer ? 'border-sky-500/40 bg-sky-500/10 text-sky-200' : 'border-slate-700 hover:border-sky-500/40'}`}
              >
                {layer}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[620px] overflow-hidden rounded-2xl border border-slate-800">
          <MapContainer center={[22.5, 78.5]} zoom={5} scrollWheelZoom className="h-full w-full" style={{ background: '#020817' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {visibleMarkers.map((marker, index) => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={customIcon(index % 2 === 0 ? 'rain' : 'heat')}
                eventHandlers={{
                  click: () => setSelectedCity(cities.find((city) => city.name === marker.name) ?? cities[0] ?? selectedCity),
                }}
              >
                <Popup>
                  <div className="text-sm text-slate-800">
                    <strong>{marker.name}</strong>
                    <div>{marker.label}</div>
                    <div>{marker.intensity} intensity</div>
                  </div>
                </Popup>
                <Tooltip>{marker.name}</Tooltip>
              </Marker>
            ))}
            {filteredCities.length === 0 && (
              <Circle center={[22.5, 78.5]} radius={500000} pathOptions={{ color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.08 }} />
            )}
            <Circle center={[19.5, 87.5]} radius={260000} pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.1 }} />
            <Polyline positions={[[15.7, 73.8],[18.8,76.6],[20.4,81.9],[22.9,88.4]]} pathOptions={{ color: '#f97316', weight: 3 }} />
          </MapContainer>
        </div>
      </section>

      <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/20">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Weather details</h2>
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[10px] font-medium text-sky-200">{selectedLayer}</span>
        </div>

        <div className="space-y-4">
          {filteredCities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-4 text-sm text-slate-400">
              No cities match your search. Try another city or state name.
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500">Selected location</div>
                <div className="text-2xl font-bold text-white">{selectedCity.name}</div>
                <div className="text-sm text-slate-400">{selectedCity.state}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3"><div className="text-xs text-slate-500">Temp</div><div className="mt-1 text-xl font-semibold text-white">{selectedCity.temperature}°C</div></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3"><div className="text-xs text-slate-500">Rain</div><div className="mt-1 text-xl font-semibold text-white">{selectedCity.rainfall} mm</div></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3"><div className="text-xs text-slate-500">Wind</div><div className="mt-1 text-xl font-semibold text-white">{selectedCity.windSpeed} km/h</div></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3"><div className="text-xs text-slate-500">AQI</div><div className="mt-1 text-xl font-semibold text-white">{selectedCity.aqi}</div></div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Weather condition</span>
                  <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-sky-200">{selectedCity.condition}</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Time slider</div>
                <input type="range" min="0" max="100" defaultValue="58" className="mt-3 w-full accent-sky-500" />
                <div className="mt-2 flex justify-between text-xs text-slate-400"><span>12:00</span><span>Now</span><span>18:00</span></div>
              </div>

              <div className="space-y-2">
                {visibleCities.map((city) => (
                  <button key={city.id} type="button" onClick={() => setSelectedCity(city)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${selectedCity.id === city.id ? 'border-sky-500/40 bg-sky-500/10 text-white' : 'border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-600'}`}>
                    <span>{city.name}</span>
                    <span className="text-xs text-slate-400">{city.temperature}°C</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
