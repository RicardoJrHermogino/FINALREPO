import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/router';

const RecommendedTask = () => {
  const [recommendedTasks, setRecommendedTasks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRecommendedTasks = async () => {
      const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=12.9742&lon=124.0058&appid=588741f0d03717db251890c0ec9fd071&units=metric';
      
      try {
        const weatherResponse = await fetch(weatherApiUrl);
        const weatherData = await weatherResponse.json();
        
        // Extract necessary weather info
        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed; // Wind speed in m/s
        const windGust = weatherData.wind.gust || 0; // Wind gust in m/s (may be undefined)
        const cloudCover = weatherData.clouds.all; // Cloud cover percentage
        const pressure = weatherData.main.pressure; // Atmospheric pressure in hPa
        const weatherConditionMain = weatherData.weather[0].main.toLowerCase(); // e.g., "clear"
        const weatherConditionDesc = weatherData.weather[0].description.toLowerCase(); // e.g., "clear sky"
    
        // Fetch tasks
        const tasksResponse = await fetch('https://ricardojrhermogino.github.io/json_server_host_api/tasksdb.json');
        const tasksData = await tasksResponse.json();
    
        // Debug: Log fetched weather data and tasks
        console.log("Weather Data:", weatherData);
        console.log("Tasks Data:", tasksData);
    
        // Check for the correct structure
        if (!tasksData.coconut_tasks || !Array.isArray(tasksData.coconut_tasks)) {
          console.error("Invalid tasks data structure:", tasksData);
          setRecommendedTasks([]);
          return;
        }
    
        // Find all matching tasks based on weather conditions
        const matchingTasks = tasksData.coconut_tasks.filter(task => {
          const tempConditionMatches = temperature >= task.requiredTemperature.min && temperature <= task.requiredTemperature.max;
          const humidityConditionMatches = humidity >= task.idealHumidity.min && humidity <= task.idealHumidity.max;
    
          // Check if any of the weather restrictions match the current weather
          const weatherConditionMatches = task.weatherRestrictions.some(restriction =>
            restriction.main.toLowerCase() === weatherConditionMain || 
            restriction.description.toLowerCase() === weatherConditionDesc
          );
    
          const windSpeedMatches = windSpeed <= task.requiredWindSpeed.max;
          const windGustMatches = windGust <= task.requiredWindGust.max;
          const cloudCoverMatches = cloudCover <= task.requiredCloudCover.max;
          const pressureMatches = pressure >= task.requiredPressure.min && pressure <= task.requiredPressure.max;
    
          // Debug: Log the conditions for each task
          console.log(`Task: ${task.task}, Matches:`, {
            tempConditionMatches,
            humidityConditionMatches,
            weatherConditionMatches,
            windSpeedMatches,
            windGustMatches,
            cloudCoverMatches,
            pressureMatches,
          });
    
          return (
            tempConditionMatches &&
            humidityConditionMatches &&
            weatherConditionMatches &&
            windSpeedMatches &&
            windGustMatches &&
            cloudCoverMatches &&
            pressureMatches
          );
        });
    
        // Debug: Log matching tasks
        console.log("Matching Tasks:", matchingTasks);
        setRecommendedTasks(matchingTasks);
      } catch (error) {
        console.error("Error fetching tasks or weather data:", error);
      }
    };
    

    fetchRecommendedTasks();
  }, []);

  const handleSeeMore = () => {
    router.push('/dashboard/dashboardcomp/RecommendedTaskPage');
  };

  return (
    <>
      <Grid item xs={12} textAlign="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Recommended Tasks for Today
        </Typography>
      </Grid>

      <Grid item xs={12} md={12} lg={12} >
        <Grid >
          <Card sx={{ borderRadius: 7, boxShadow: 2 }} >
            <CardContent>
                <Grid item xs={12} textAlign="center">
                <Typography variant="body1">asdasds</Typography>
                <Typography variant="body1">asdasds</Typography>
                  {recommendedTasks.length > 0 ? (
                    recommendedTasks.map((task, index) => (
                      <Typography key={index} variant="body1">{task.task}</Typography>
                      
                    ))
                  ) : (
                    <Typography variant="body1">No tasks available for today.</Typography>
                  )}
                </Grid>
                <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSeeMore}
              sx={{ 
                    width:'100%',
                    borderRadius:'15px',
                    backgroundColor:'black' }}
            >
              See More
            </Button>

               
            </CardContent>
            
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default RecommendedTask;
