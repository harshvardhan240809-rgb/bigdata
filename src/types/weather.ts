export type Severity = 'low' | 'moderate' | 'high' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type IncidentStatus = 'open' | 'monitoring' | 'resolved';
export type ReportType = 'Daily' | 'Weekly' | 'Monthly' | 'Preparedness';

export interface StateInfo {
  id: string;
  name: string;
  region: string;
  capital: string;
  population: string;
}

export interface CityWeather {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  temperature: number;
  rainfall: number;
  humidity: number;
  windSpeed: number;
  aqi: number;
  condition: string;
  alertCount: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: Severity;
  state: string;
  district: string;
  issuedAt: string;
  description: string;
  type: 'Cyclone' | 'Flood' | 'Heatwave' | 'Rainfall' | 'Thunderstorm';
  status: AlertStatus;
}

export interface Incident {
  id: string;
  location: string;
  category: 'Flood' | 'Cyclone' | 'Heatwave' | 'Thunderstorm' | 'Landslide';
  severity: Severity;
  reportedAt: string;
  status: IncidentStatus;
  assignedAgency: string;
  impact: string;
  responseTimeHours: number;
}

export interface TrendEntry {
  day: string;
  temperature: number;
  rainfall: number;
  humidity: number;
}

export interface RegionCondition {
  id: string;
  name: string;
  temperature: number;
  rainfall: number;
  windSpeed: number;
  aqi: number;
  condition: string;
  alertCount: number;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  description: string;
  delta: string;
  trend: 'up' | 'down' | 'neutral';
  tone: 'blue' | 'red' | 'green' | 'amber' | 'orange';
  icon: string;
}

export interface ReportItem {
  id: string;
  title: string;
  date: string;
  type: ReportType;
  fileType: string;
}

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'rain' | 'heat' | 'storm' | 'alert';
  intensity: number;
  label: string;
}
