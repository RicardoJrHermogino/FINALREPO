import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { locationCoordinates } from '@/pages/components/locationCoordinates';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const tasks = ['Harvesting coconuts', 'Cleaning coconut trees', 'Applying fertilizer'];

// Convert the locationCoordinates object to an array of location names
const locations = Object.keys(locationCoordinates); // This will give you an array of the keys

const CheckTaskFeasibility = ({ open, handleClose }) => {
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      task: selectedTask,
      location: selectedLocation,
      date: selectedDate.format('YYYY-MM-DD'),
      time: selectedTime,
    });
    handleClose(); // Close the modal after submission
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Add New Task
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Task Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="task-select-label">Task</InputLabel>
                <Select
                  labelId="task-select-label"
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  label="Task"
                >
                  {tasks.map((task, index) => (
                    <MenuItem key={index} value={task}>
                      {task}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Location Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="location-select-label">Location</InputLabel>
                <Select
                  labelId="location-select-label"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  label="Location"
                >
                  {locations.map((location, index) => (
                    <MenuItem key={index} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Date Picker */}
            <Grid item xs={12}>
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                disablePast
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            {/* Time Input */}
            <Grid item xs={12}>
              <TextField
                label="Time"
                type="time"
                fullWidth
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min step
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default CheckTaskFeasibility;
