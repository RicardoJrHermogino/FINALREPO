import { useState, useEffect } from 'react';
import {
  CssBaseline,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  Badge
} from "@mui/material";
import Navbar from "../../components/navbar";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationOnIcon from '@mui/icons-material/LocationOn'; 

// Sample coconut tasks (move this to a separate file or fetch from a backend)
const coconut_tasks = [
  {
    id: 1,
    task: "Harvesting coconuts",
    weatherRestrictions: [
      { main: "Clear", description: "clear sky" }
    ],
    requiredTemperature: { min: 25, max: 32 },
    idealHumidity: { min: 60, max: 90 }
  },
  // Add other tasks similarly
];

const RecommendedTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  
  const locations = [
    { id: 'Sorsogon City', name: 'Sorsogon City' },
    { id: 'Barcelona', name: 'Barcelona' },
    { id: 'Bulan', name: 'Bulan' },
    { id: 'Bulusan', name: 'Bulusan' },
    { id: 'Castilla', name: 'Castilla' },
    { id: 'Donsol', name: 'Donsol' },
    { id: 'Gubat', name: 'Gubat' },
    { id: 'Irosin', name: 'Irosin' },
    { id: 'Juban', name: 'Juban' },
    { id: 'Magallanes', name: 'Magallanes' },
    { id: 'Matnog', name: 'Matnog' },
    { id: 'Pilar', name: 'Pilar' },
    { id: 'Prieto Diaz', name: 'Prieto Diaz' },
    { id: 'Santa Magdalena', name: 'Santa Magdalena' },
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://ricardojrhermogino.github.io/json_server_host_api/tasksdb.json');
        const data = await response.json();
        setTasks(data.tasks || coconut_tasks); // Fetch from API or fallback to local coconut_tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleLocationChange = async (event) => {
    const selectedLocation = event.target.value;
    setLocation(selectedLocation);
    const { lat, lon } = getLocationCoordinates(selectedLocation);

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=588741f0d03717db251890c0ec9fd071&units=metric`);
      const data = await response.json();
      setWeatherData(data.list);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const getLocationCoordinates = (locationId) => {
    const coordinates = {
      "Sorsogon City": { lat: 12.9742, lon: 124.0058 },
      "Barcelona": { lat: 12.8694, lon: 124.1419 },
      "Bulan": { lat: 12.6697, lon: 123.8758 },
      "Bulusan": { lat: 12.7522, lon: 124.1356 },
      "Castilla": { lat: 12.9553, lon: 123.8764 },
      "Donsol": { lat: 12.9083, lon: 123.5980 },
      "Gubat": { lat: 12.9189, lon: 124.1231 },
      "Irosin": { lat: 12.7050, lon: 124.0320 },
      "Juban": { lat: 12.8477, lon: 123.9894 },
      "Magallanes": { lat: 12.8284, lon: 123.8344 },
      "Matnog": { lat: 12.5855, lon: 124.0855 },
      "Pilar": { lat: 12.9245, lon: 123.6756 },
      "Prieto Diaz": { lat: 13.0458, lon: 124.1929 },
      "Santa Magdalena": { lat: 12.6489, lon: 124.1083 }
    };
    return coordinates[locationId] || { lat: 0, lon: 0 };
  };

  const recommendTasks = () => {
    return weatherData.map((data) => {
      const recommendedTasks = coconut_tasks.filter(task => {
        const weatherConditionMatches = task.weatherRestrictions.some(restriction => {
          if (!data.weather || !data.weather[0]) return false;

          const weatherMainMatches = restriction.main.toLowerCase() === data.weather[0].main.toLowerCase();
          const weatherDescriptionMatches = restriction.description.toLowerCase() === data.weather[0].description.toLowerCase();

          return weatherMainMatches || weatherDescriptionMatches;
        });

        const tempConditionMatches = data.main.temp >= task.requiredTemperature.min && data.main.temp <= task.requiredTemperature.max;
        const humidityConditionMatches = data.main.humidity >= task.idealHumidity.min && data.main.humidity <= task.idealHumidity.max;

        return weatherConditionMatches && tempConditionMatches && humidityConditionMatches;
      });

      const formattedTime = new Date(data.dt_txt).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      return {
        time: formattedTime,
        recommendedTasks,
      };
    });
  };

  const recommendations = recommendTasks();

  return (
    <>
      <CssBaseline />
      <Navbar />

      <Grid container mb={15} spacing={2} style={{ padding: "20px" }}>
        <Grid item xs={6} >
          <Typography variant="h6"><strong>TaskWeatherSync</strong></Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <IconButton>
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </div>
        </Grid>
        
        <Grid item xs={12} mt={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="location-select-label" sx={{ display: 'flex', alignItems: 'center' }}>
               Select Location
            </InputLabel>
            <Select
              labelId="location-select-label"
              value={location}
              onChange={handleLocationChange}
              input={<OutlinedInput label="Location" />}
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 500 },
                },
              }}
              sx={{ backgroundColor: '#f5f7fa', borderRadius: '10px' }}
            >
              {locations.map(loc => (
                <MenuItem key={loc.id} value={loc.id}>
                  <LocationOnIcon sx={{ marginRight: 2 }} />
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <h2 style={{ textAlign: 'center' }}>Weather-Based Task Recommendations</h2>
          <Grid container spacing={2}>
            {recommendations.length > 0 ? (
              recommendations.map((recommendation, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ borderRadius: 7, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom style={{ textAlign: 'center' }}>
                        {recommendation.time}
                      </Typography>
                      {recommendation.recommendedTasks.length > 0 ? (
                        recommendation.recommendedTasks.map((task) => (
                          <div key={task.id} style={{ marginBottom: '10px' }}>
                            <Typography variant="body2" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                              {task.task}
                            </Typography>
                          </div>
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary" style={{ textAlign: 'center' }}>
                          No suitable tasks for this time.
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography textAlign={'center'}>No recommendations available. Please select a location.</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RecommendedTaskPage;
