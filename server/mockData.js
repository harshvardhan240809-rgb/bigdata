export const states = [
  { id: 'mh', name: 'Maharashtra', region: 'West India', capital: 'Mumbai', population: '12.4 Cr' },
  { id: 'kl', name: 'Kerala', region: 'South India', capital: 'Thiruvananthapuram', population: '3.5 Cr' },
  { id: 'tn', name: 'Tamil Nadu', region: 'South India', capital: 'Chennai', population: '7.6 Cr' },
  { id: 'ka', name: 'Karnataka', region: 'South India', capital: 'Bengaluru', population: '6.8 Cr' },
  { id: 'gj', name: 'Gujarat', region: 'West India', capital: 'Gandhinagar', population: '7.2 Cr' },
  { id: 'rj', name: 'Rajasthan', region: 'North India', capital: 'Jaipur', population: '7.8 Cr' },
  { id: 'wb', name: 'West Bengal', region: 'East India', capital: 'Kolkata', population: '10.0 Cr' },
  { id: 'or', name: 'Odisha', region: 'East India', capital: 'Bhubaneswar', population: '4.7 Cr' },
  { id: 'as', name: 'Assam', region: 'Northeast India', capital: 'Dispur', population: '3.4 Cr' },
  { id: 'dl', name: 'Delhi', region: 'North India', capital: 'New Delhi', population: '2.1 Cr' },
  { id: 'up', name: 'Uttar Pradesh', region: 'North India', capital: 'Lucknow', population: '24.0 Cr' },
  { id: 'br', name: 'Bihar', region: 'East India', capital: 'Patna', population: '12.3 Cr' },
  { id: 'ap', name: 'Andhra Pradesh', region: 'South India', capital: 'Amaravati', population: '5.2 Cr' },
  { id: 'ts', name: 'Telangana', region: 'South India', capital: 'Hyderabad', population: '3.8 Cr' },
  { id: 'mp', name: 'Madhya Pradesh', region: 'Central India', capital: 'Bhopal', population: '8.5 Cr' },
];

export const cities = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777, temperature: 29, rainfall: 82, humidity: 79, windSpeed: 18, aqi: 52, condition: 'Cloudy', alertCount: 2 },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, temperature: 31, rainfall: 96, humidity: 82, windSpeed: 22, aqi: 44, condition: 'Rain', alertCount: 1 },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, temperature: 33, rainfall: 62, humidity: 68, windSpeed: 20, aqi: 71, condition: 'Humid', alertCount: 2 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, temperature: 26, rainfall: 54, humidity: 61, windSpeed: 14, aqi: 39, condition: 'Clear', alertCount: 0 },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, temperature: 35, rainfall: 22, humidity: 44, windSpeed: 17, aqi: 87, condition: 'Hot', alertCount: 2 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, temperature: 37, rainfall: 8, humidity: 32, windSpeed: 11, aqi: 98, condition: 'Heatwave', alertCount: 3 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, temperature: 32, rainfall: 74, humidity: 77, windSpeed: 21, aqi: 67, condition: 'Storm', alertCount: 2 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, temperature: 31, rainfall: 90, humidity: 74, windSpeed: 25, aqi: 58, condition: 'Rain', alertCount: 4 },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, temperature: 28, rainfall: 76, humidity: 80, windSpeed: 16, aqi: 41, condition: 'Cloudy', alertCount: 1 },
  { id: 'delhi', name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209, temperature: 36, rainfall: 12, humidity: 41, windSpeed: 12, aqi: 162, condition: 'Heatwave', alertCount: 3 },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, temperature: 34, rainfall: 18, humidity: 49, windSpeed: 10, aqi: 82, condition: 'Dry', alertCount: 1 },
  { id: 'patna', name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, temperature: 33, rainfall: 54, humidity: 66, windSpeed: 13, aqi: 74, condition: 'Humid', alertCount: 2 },
  { id: 'amaravati', name: 'Amaravati', state: 'Andhra Pradesh', lat: 16.5032, lng: 80.512, temperature: 30, rainfall: 58, humidity: 70, windSpeed: 19, aqi: 61, condition: 'Windy', alertCount: 2 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867, temperature: 31, rainfall: 49, humidity: 64, windSpeed: 17, aqi: 57, condition: 'Cloudy', alertCount: 1 },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, temperature: 29, rainfall: 36, humidity: 52, windSpeed: 15, aqi: 73, condition: 'Sunny', alertCount: 1 },
];

export const overviewStats = [
  { id: 'alerts', label: 'Active Alerts', value: '18', description: 'Across 9 regions', delta: '+5%', trend: 'up', tone: 'red', icon: 'AlertTriangle' },
  { id: 'incidents', label: 'Critical Incidents', value: '07', description: 'Updated this hour', delta: '-2%', trend: 'down', tone: 'amber', icon: 'TriangleAlert' },
  { id: 'states', label: 'States Affected', value: '12', description: 'of 15 monitored states', delta: '+3%', trend: 'up', tone: 'blue', icon: 'MapPinned' },
  { id: 'rainfall', label: 'Rainfall Deviation', value: '+18%', description: 'Compared with normal', delta: 'Above normal', trend: 'up', tone: 'green', icon: 'CloudRain' },
  { id: 'people', label: 'People Impacted', value: '2.8M', description: 'Across vulnerable districts', delta: '+11%', trend: 'up', tone: 'orange', icon: 'Users' },
  { id: 'resolved', label: 'Resolved Incidents', value: '31', description: 'In last 24 hours', delta: '+9%', trend: 'up', tone: 'green', icon: 'CheckCircle2' },
];

export const weatherAlerts = [
  { id: 'A-1101', title: 'Severe Cyclone Warning', severity: 'critical', state: 'Odisha', district: 'Ganjam', issuedAt: '08:15 IST', description: 'Very severe cyclonic storm expected to intensify near coastal Odisha with gale-force winds.', type: 'Cyclone', status: 'active' },
  { id: 'A-1102', title: 'Flash Flood Alert', severity: 'high', state: 'Kerala', district: 'Wayanad', issuedAt: '07:50 IST', description: 'Intense rainfall may trigger sudden flash floods and landslips in vulnerable slopes.', type: 'Flood', status: 'active' },
  { id: 'A-1103', title: 'Extreme Heatwave', severity: 'critical', state: 'Rajasthan', district: 'Jaipur', issuedAt: '06:30 IST', description: 'Heat index above 48°C persists across western districts and urban settlements.', type: 'Heatwave', status: 'acknowledged' },
  { id: 'A-1104', title: 'Heavy Rainfall Warning', severity: 'moderate', state: 'Maharashtra', district: 'Konkan', issuedAt: '05:45 IST', description: 'Heavy spells likely with isolated extremely heavy rainfall in coastal belts.', type: 'Rainfall', status: 'active' },
  { id: 'A-1105', title: 'Thunderstorm Alert', severity: 'high', state: 'Bihar', district: 'Patna', issuedAt: '04:15 IST', description: 'Thunderstorm and lightning risk likely in eastern plains during evening hours.', type: 'Thunderstorm', status: 'active' },
];

export const trendData = [
  { day: 'Mon', temperature: 30, rainfall: 42, humidity: 58 },
  { day: 'Tue', temperature: 31, rainfall: 46, humidity: 62 },
  { day: 'Wed', temperature: 29, rainfall: 58, humidity: 68 },
  { day: 'Thu', temperature: 32, rainfall: 55, humidity: 70 },
  { day: 'Fri', temperature: 34, rainfall: 63, humidity: 76 },
  { day: 'Sat', temperature: 33, rainfall: 71, humidity: 80 },
  { day: 'Sun', temperature: 35, rainfall: 66, humidity: 78 },
];

export const regionConditions = [
  { id: 'north', name: 'North India', temperature: 34, rainfall: 14, windSpeed: 12, aqi: 129, condition: 'Heatwave', alertCount: 3 },
  { id: 'south', name: 'South India', temperature: 29, rainfall: 72, windSpeed: 18, aqi: 46, condition: 'Rainy', alertCount: 4 },
  { id: 'east', name: 'East India', temperature: 31, rainfall: 67, windSpeed: 20, aqi: 71, condition: 'Stormy', alertCount: 6 },
  { id: 'west', name: 'West India', temperature: 30, rainfall: 64, windSpeed: 19, aqi: 63, condition: 'Cloud Burst', alertCount: 4 },
  { id: 'northeast', name: 'Northeast India', temperature: 27, rainfall: 78, windSpeed: 15, aqi: 41, condition: 'Monsoon', alertCount: 2 },
  { id: 'central', name: 'Central India', temperature: 28, rainfall: 38, windSpeed: 14, aqi: 68, condition: 'Humid', alertCount: 2 },
];

export const incidents = [
  { id: 'INC-2048', location: 'Kochi, Kerala', category: 'Flood', severity: 'high', reportedAt: '2026-09-26 06:10', status: 'open', assignedAgency: 'NDRF', impact: '3 villages cut off', responseTimeHours: 1.7 },
  { id: 'INC-2049', location: 'Jaipur, Rajasthan', category: 'Heatwave', severity: 'critical', reportedAt: '2026-09-26 05:30', status: 'monitoring', assignedAgency: 'State Health Dept', impact: 'High heat risk for commuters', responseTimeHours: 2.2 },
  { id: 'INC-2050', location: 'Puri, Odisha', category: 'Cyclone', severity: 'critical', reportedAt: '2026-09-26 04:45', status: 'open', assignedAgency: 'ODRAF', impact: 'Coastal evacuation underway', responseTimeHours: 1.1 },
  { id: 'INC-2051', location: 'Patna, Bihar', category: 'Thunderstorm', severity: 'moderate', reportedAt: '2026-09-25 21:20', status: 'resolved', assignedAgency: 'District Control Room', impact: 'Power lines affected', responseTimeHours: 3.6 },
  { id: 'INC-2052', location: 'Guwahati, Assam', category: 'Landslide', severity: 'high', reportedAt: '2026-09-25 19:00', status: 'open', assignedAgency: 'Assam Police', impact: 'Road closure near hill roads', responseTimeHours: 2.8 },
  { id: 'INC-2053', location: 'Mumbai, Maharashtra', category: 'Flood', severity: 'moderate', reportedAt: '2026-09-25 17:05', status: 'resolved', assignedAgency: 'MMC', impact: 'Waterlogging in low-lying areas', responseTimeHours: 4.2 },
];

export const mapMarkers = [
  { id: 'm1', name: 'Cyclone Zone', lat: 19.5, lng: 87.5, type: 'alert', intensity: 88, label: 'Severe' },
  { id: 'm2', name: 'Flood Risk', lat: 11.2, lng: 76.3, type: 'rain', intensity: 72, label: 'High' },
  { id: 'm3', name: 'Heatwave', lat: 26.9, lng: 75.8, type: 'heat', intensity: 90, label: 'Extreme' },
  { id: 'm4', name: 'Thunderstorm', lat: 25.6, lng: 85.1, type: 'storm', intensity: 66, label: 'Moderate' },
  { id: 'm5', name: 'Rainfall Watch', lat: 22.7, lng: 88.4, type: 'rain', intensity: 76, label: 'Heavy' },
];

export const reports = [
  { id: 'r1', title: 'Daily Weather Report', date: '2026-09-26', type: 'Daily', fileType: 'PDF' },
  { id: 'r2', title: 'Weekly Incident Summary', date: '2026-09-19', type: 'Weekly', fileType: 'DOCX' },
  { id: 'r3', title: 'Monthly Climate Analytics', date: '2026-08', type: 'Monthly', fileType: 'PDF' },
  { id: 'r4', title: 'Disaster Preparedness Report', date: '2026-09', type: 'Preparedness', fileType: 'XLSX' },
];

