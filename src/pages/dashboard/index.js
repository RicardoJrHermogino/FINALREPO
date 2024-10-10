import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CssBaseline, Button, CircularProgress, IconButton, Badge } from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import Navbar from "../components/navbar";
import { useRouter } from 'next/router';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import greeting from 'greeting-time';
import axios from 'axios';
import WeatherDisplay from './dashboardcomp/weatherdisplay';
import RecommendedTask from './dashboardcomp/rectaskdisplay';
import WeatherData from './dashboardcomp/weatherdata';
import LocationSelect from './dashboardcomp/LocationSelect';
import DatePicker from './dashboardcomp/DatePicker';
import CustomTimePicker from './dashboardcomp/TimePicker'; // Import the new TimePicker component
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import getOrCreateUUID from '@/utils/uuid';
import CheckTaskFeasibility from './dashboardcomp/CheckTaskFeasibility';
import {locationCoordinates} from "../components/locationCoordinates";



const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 380,
      width: 310,
      borderRadius: 12,
      padding: '20px',
    },
  },
};

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState("");
  
  const [temperature, setTemperature] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState("");
  const [location, setLocation] = useState("Sorsogon City");
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTime, setSelectedTime] = useState(dayjs().format("HH:mm"));
  const [forecast, setForecast] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(getOrCreateUUID()); // Get or create user ID

  const apiKey = "588741f0d03717db251890c0ec9fd071";

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const { lat, lon } = locationCoordinates[location];
      
      // Fetch current weather
      const currentWeatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      const currentWeather = currentWeatherResponse.data;
      
      // Fetch the 5-day forecast
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      const forecastData = forecastResponse.data.list.filter(item => item.dt_txt.startsWith(selectedDate)); // Filter by selected date
  
      // If the selected date is today and the selected time is now
      const isToday = selectedDate === dayjs().format("YYYY-MM-DD");
      if (isToday) {
        const currentTime = dayjs().format("HH:mm");
        if (selectedTime === currentTime) {
          setTemperature(Math.round(currentWeather.main.temp)); // Use current temperature
          setWeatherCondition(currentWeather.weather[0].description); // Use current weather condition
        } else {
          // If selected time is in the future, find the forecast for the closest time
          let closestWeather = forecastData[0]; // Default to the first forecast
          let closestTimeDifference = Math.abs(dayjs(forecastData[0].dt_txt).diff(dayjs(`${selectedDate} ${selectedTime}`))); // Initial time difference
          
          for (let i = 1; i < forecastData.length; i++) {
            const forecastTime = dayjs(forecastData[i].dt_txt);
            const timeDifference = Math.abs(forecastTime.diff(dayjs(`${selectedDate} ${selectedTime}`))); // Calculate the time difference
  
            // Check if this forecast is closer
            if (timeDifference < closestTimeDifference) {
              closestWeather = forecastData[i]; // Update closest weather
              closestTimeDifference = timeDifference; // Update closest time difference
            }
          }
  
          setTemperature(Math.round(closestWeather.main.temp));
          setWeatherCondition(closestWeather.weather[0].description);
        }
      } else {
        // For future dates or times, just use the first available forecast
        const closestWeather = forecastData[0]; // Use the first forecast data
        setTemperature(Math.round(closestWeather.main.temp));
        setWeatherCondition(closestWeather.weather[0].description);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };
  


  useEffect(() => {
    fetchWeatherData();
    const currentGreeting = greeting(new Date());
    setGreetingMessage(currentGreeting);
  }, [location, selectedDate, selectedTime]); 

  // The following lines for fetching tasks from JSON server are removed
  // as requested. This function can be used to fetch tasks from your SQLite database
  // using your API route.

  const fetchUserTasks = async () => {
    try {
      // Replace the URL with your API route
      const response = await axios.get(`/api/tasks?userId=${userId}`); // Assuming this API route exists
      // Handle user tasks here (e.g., set tasks in state)
      console.log('User Tasks:', response.data); // For debugging
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };

  useEffect(() => {
    fetchUserTasks(); // Fetch user tasks when the component mounts
  }, [userId]); // Depend on userId

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <Navbar />
      <Grid container mb={15} spacing={4} style={{ padding: "20px" }}>
        <Grid item xs={6}>
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
        <Grid item xs={12}>
          <Typography variant="body2" color="#757575">
            {greetingMessage}, 
          </Typography>
          <Typography letterSpacing={4}><strong>Coconut Farmer!</strong></Typography>
        </Grid>



        <LocationSelect 
          location={location}
          setLocation={setLocation}
          locationCoordinates={locationCoordinates}
        /> 
        <DatePicker 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <CustomTimePicker 
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
        
        <WeatherDisplay
          currentDate={dayjs(`${selectedDate} ${selectedTime}`).format('dddd, MMMM D, YYYY HH:mm')}
          weatherCondition={weatherCondition}
          temperature={temperature}
        />

        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpenModal}
            sx={{
              backgroundColor: 'black', 
              borderRadius: '20px', 
              width: '100%',
              height: '60px', // Increase the height here
            }}
          >
            Check Task Feasibility
          </Button>
        </Grid>

        <CheckTaskFeasibility 
          open={openModal} 
          handleClose={handleCloseModal}
          forecast={forecast}
          currentDate={dayjs(`${selectedDate} ${selectedTime}`).format('dddd, MMMM D, YYYY HH:mm')}
          locationCoordinates={locationCoordinates}
         />

        <RecommendedTask 
          location={location}           
          forecast={forecast}
          currentDate={dayjs(`${selectedDate} ${selectedTime}`).format('dddd, MMMM D, YYYY HH:mm')}
          weatherCondition={weatherCondition}
          temperature={temperature}
        />

        <WeatherData 
          forecast={forecast} 
          selectedDate={selectedDate}
        />
      </Grid>
    </LocalizationProvider>
  );
};

export default Dashboard;
