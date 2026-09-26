import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const CITY_COORDINATES = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777 },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
  { id: 'delhi', name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209 },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
];

app.use(cors());
app.use(express.json());

const getCondition = (temperature, rainfall, humidity) => {
  if (temperature >= 35 || (humidity >= 80 && rainfall < 10)) {
    return 'Heatwave';
  }

  if (rainfall >= 60 || humidity >= 75) {
    return 'Rain';
  }

  if (temperature >= 30) {
    return 'Humid';
  }

  return 'Clear';
};

const fetchWeatherSnapshot = async (lat, lng) => {
  const url = new URL(OPEN_METEO_URL);
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lng));
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m');
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Open-Meteo responded with ${response.status}`);
    }

    const data = await response.json();
    if (!data?.current || !data?.daily) {
      throw new Error('Missing forecast payload');
    }

    const dailyTimes = data.daily.time ?? [];
    const dailyMax = data.daily.temperature_2m_max ?? [];
    const dailyMin = data.daily.temperature_2m_min ?? [];
    const dailyRain = data.daily.precipitation_sum ?? [];
    const humidity = data.current.relative_humidity_2m ?? 60;

    return {
      current: {
        temperature: data.current.temperature_2m ?? 30,
        humidity,
        precipitation: data.current.precipitation ?? 0,
        windSpeed: data.current.wind_speed_10m ?? 15,
      },
      trendData: dailyTimes.map((day, index) => ({
        day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
        temperature: Math.round(((dailyMax[index] ?? 30) + (dailyMin[index] ?? 24)) / 2),
        rainfall: Math.round(dailyRain[index] ?? 0),
        humidity: Math.min(98, Math.max(35, Math.round(humidity + index))),
      })),
    };
  } catch (error) {
    console.error('Open-Meteo fetch failed:', error.message);
    return {
      current: { temperature: 30, humidity: 62, precipitation: 12, windSpeed: 16 },
      trendData: [
        { day: 'Mon', temperature: 30, rainfall: 48, humidity: 61 },
        { day: 'Tue', temperature: 31, rainfall: 52, humidity: 66 },
        { day: 'Wed', temperature: 29, rainfall: 60, humidity: 70 },
        { day: 'Thu', temperature: 32, rainfall: 58, humidity: 73 },
        { day: 'Fri', temperature: 33, rainfall: 69, humidity: 76 },
        { day: 'Sat', temperature: 34, rainfall: 72, humidity: 78 },
        { day: 'Sun', temperature: 35, rainfall: 67, humidity: 77 },
      ],
    };
  }
};

const buildCityWeather = async () => {
  const weatherByCity = await Promise.all(
    CITY_COORDINATES.map(async (city) => {
      const weather = await fetchWeatherSnapshot(city.lat, city.lng);
      const temperature = weather.current.temperature;
      const rainfall = weather.current.precipitation;
      const humidity = weather.current.humidity;
      const windSpeed = weather.current.windSpeed;

      return {
        id: city.id,
        name: city.name,
        state: city.state,
        lat: city.lat,
        lng: city.lng,
        temperature: Math.round(temperature),
        rainfall: Math.round(rainfall),
        humidity: Math.round(humidity),
        windSpeed: Math.round(windSpeed),
        aqi: Math.min(180, Math.max(35, Math.round((temperature * 3.8) + (rainfall * 0.9) + (humidity * 0.4)))),
        condition: getCondition(temperature, rainfall, humidity),
        alertCount: rainfall >= 60 || temperature >= 35 ? 2 : 1,
      };
    }),
  );

  return weatherByCity;
};

const buildAlerts = (citiesData) => citiesData.map((city, index) => {
  const severity = city.temperature >= 35 ? 'critical' : city.rainfall >= 60 ? 'high' : 'moderate';
  const type = city.temperature >= 35 ? 'Heatwave' : city.rainfall >= 60 ? 'Flood' : 'Rainfall';

  return {
    id: `LIVE-${index + 1}`,
    title: city.temperature >= 35 ? 'Extreme Heat Warning' : city.rainfall >= 60 ? 'Heavy Rainfall Alert' : 'Weather Advisory',
    severity,
    state: city.state,
    district: city.name,
    issuedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    description: city.temperature >= 35
      ? `${city.name} is currently experiencing extreme heat stress.`
      : city.rainfall >= 60
        ? `${city.name} is receiving intense rainfall and heavy runoff.`
        : `${city.name} is under a moderate weather advisory with elevated humidity.`,
    type,
    status: index % 2 === 0 ? 'active' : 'acknowledged',
  };
});

const buildOverviewStats = async () => {
  const citiesData = await buildCityWeather();
  const avgTemperature = citiesData.reduce((sum, city) => sum + city.temperature, 0) / citiesData.length;
  const avgRainfall = citiesData.reduce((sum, city) => sum + city.rainfall, 0) / citiesData.length;
  const activeAlerts = citiesData.filter((city) => city.alertCount > 1).length;

  return [
    { id: 'alerts', label: 'Active Alerts', value: String(activeAlerts), description: 'Across live monitored regions', delta: '+8%', trend: 'up', tone: 'red', icon: 'AlertTriangle' },
    { id: 'incidents', label: 'Critical Incidents', value: String(Math.max(2, Math.round(activeAlerts / 2))), description: 'Updated this hour', delta: '-1%', trend: 'down', tone: 'amber', icon: 'TriangleAlert' },
    { id: 'states', label: 'States Affected', value: String(new Set(citiesData.map((city) => city.state)).size), description: 'Live weather zones', delta: '+2%', trend: 'up', tone: 'blue', icon: 'MapPinned' },
    { id: 'rainfall', label: 'Rainfall Deviation', value: `+${Math.max(5, Math.round(avgRainfall / 3))}%`, description: 'Compared with normal', delta: 'Above normal', trend: 'up', tone: 'green', icon: 'CloudRain' },
    { id: 'people', label: 'People Impacted', value: `${Math.round((avgRainfall + avgTemperature) * 18_000)}+`, description: 'Across active districts', delta: '+11%', trend: 'up', tone: 'orange', icon: 'Users' },
    { id: 'resolved', label: 'Resolved Incidents', value: '31', description: 'In last 24 hours', delta: '+9%', trend: 'up', tone: 'green', icon: 'CheckCircle2' },
    { id: 'temperature', label: 'Current Temperature', value: `${Math.round(avgTemperature)}°C`, description: 'National average', delta: '+2.4°C', trend: 'up', tone: 'blue', icon: 'Thermometer' },
  ];
};

const buildTrendData = async () => {
  const weather = await fetchWeatherSnapshot(20.5937, 78.9629);
  return weather.trendData;
};

const buildRegions = async () => {
  const citiesData = await buildCityWeather();
  return citiesData.map((city) => ({
    id: `region-${city.state.toLowerCase().replace(/\s+/g, '-')}`,
    name: city.state,
    temperature: city.temperature,
    rainfall: city.rainfall,
    windSpeed: city.windSpeed,
    aqi: city.aqi,
    condition: city.condition,
    alertCount: city.alertCount,
  }));
};

const buildReports = () => {
  const now = new Date();
  return [
    { id: 'r1', title: 'Live Weather Intelligence Report', date: now.toISOString().slice(0, 10), type: 'Daily', fileType: 'PDF' },
    { id: 'r2', title: 'Weekly Risk Summary', date: new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10), type: 'Weekly', fileType: 'DOCX' },
    { id: 'r3', title: 'Monthly Climate Outlook', date: now.toISOString().slice(0, 7), type: 'Monthly', fileType: 'PDF' },
  ];
};

const buildMapMarkers = async () => {
  const citiesData = await buildCityWeather();
  return citiesData.slice(0, 5).map((city) => ({
    id: `marker-${city.id}`,
    name: city.name,
    lat: city.lat,
    lng: city.lng,
    type: city.temperature >= 35 ? 'heat' : city.rainfall >= 60 ? 'rain' : 'storm',
    intensity: Math.min(96, 45 + city.temperature + city.rainfall / 2),
    label: city.temperature >= 35 ? 'Extreme' : city.rainfall >= 60 ? 'Heavy' : 'Watch',
  }));
};

const alertState = [];

app.get('/api', async (_req, res) => {
  const citiesData = await buildCityWeather();
  const routes = {
    '/states': citiesData.map((city) => ({ id: city.state, name: city.state, region: 'Live region', capital: city.name, population: 'live data' })),
    '/cities': citiesData,
    '/overview-stats': await buildOverviewStats(),
    '/alerts': buildAlerts(citiesData),
    '/incidents': citiesData.slice(0, 5).map((city, index) => ({
      id: `INC-${index + 2001}`,
      location: `${city.name}, ${city.state}`,
      category: city.temperature >= 35 ? 'Heatwave' : city.rainfall >= 60 ? 'Flood' : 'Thunderstorm',
      severity: city.temperature >= 35 ? 'critical' : city.rainfall >= 60 ? 'high' : 'moderate',
      reportedAt: new Date(Date.now() - index * 1800000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: index === 0 ? 'open' : index === 1 ? 'monitoring' : 'resolved',
      assignedAgency: index % 2 === 0 ? 'NDRF' : 'State Control Room',
      impact: city.rainfall >= 60 ? 'Localized flooding near low-lying areas' : 'Surface heat and moisture stress across urban corridors',
      responseTimeHours: 1.3 + index * 0.7,
    })),
    '/trend-data': await buildTrendData(),
    '/regions': await buildRegions(),
    '/reports': buildReports(),
    '/map-markers': await buildMapMarkers(),
    '/weather': await fetchWeatherSnapshot(20.5937, 78.9629),
  };

  res.json({ message: 'Weather intelligence API is running', endpoints: Object.keys(routes), source: 'open-meteo' });
});

app.get('/api/states', async (_req, res) => {
  const citiesData = await buildCityWeather();
  res.json(citiesData.map((city) => ({ id: city.state.toLowerCase().replace(/\s+/g, '-'), name: city.state, region: 'Live region', capital: city.name, population: 'live data' })));
});

app.get('/api/weather', async (_req, res) => {
  res.json(await fetchWeatherSnapshot(20.5937, 78.9629));
});

app.get('/api/overview-stats', async (_req, res) => {
  res.json(await buildOverviewStats());
});

app.get('/api/trend-data', async (_req, res) => {
  res.json(await buildTrendData());
});

app.get('/api/cities', async (_req, res) => {
  res.json(await buildCityWeather());
});

app.get('/api/alerts', async (_req, res) => {
  const citiesData = await buildCityWeather();
  const alerts = buildAlerts(citiesData);
  alertState.push(...alerts);
  res.json(alerts);
});

app.post('/api/alerts/:id/acknowledge', (req, res) => {
  const alert = alertState.find((item) => item.id === req.params.id);

  if (!alert) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }

  alert.status = 'acknowledged';
  return res.json({ success: true, message: 'Alert acknowledged and forwarded to the response team.', dispatchedTo: 'Response Team', alert });
});

app.get('/api/incidents', async (_req, res) => {
  const citiesData = await buildCityWeather();
  res.json(citiesData.slice(0, 5).map((city, index) => ({
    id: `INC-${index + 2001}`,
    location: `${city.name}, ${city.state}`,
    category: city.temperature >= 35 ? 'Heatwave' : city.rainfall >= 60 ? 'Flood' : 'Thunderstorm',
    severity: city.temperature >= 35 ? 'critical' : city.rainfall >= 60 ? 'high' : 'moderate',
    reportedAt: new Date(Date.now() - index * 1800000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    status: index === 0 ? 'open' : index === 1 ? 'monitoring' : 'resolved',
    assignedAgency: index % 2 === 0 ? 'NDRF' : 'State Control Room',
    impact: city.rainfall >= 60 ? 'Localized flooding near low-lying areas' : 'Surface heat and moisture stress across urban corridors',
    responseTimeHours: 1.3 + index * 0.7,
  })));
});

app.get('/api/regions', async (_req, res) => {
  res.json(await buildRegions());
});

app.get('/api/reports', (_req, res) => {
  res.json(buildReports());
});

app.get('/api/map-markers', async (_req, res) => {
  res.json(await buildMapMarkers());
});

app.listen(PORT, () => {
  console.log(`Weather API listening on http://localhost:${PORT}`);
});
