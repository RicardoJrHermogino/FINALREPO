// src/pages/api/tasks.js
import pool from '../../lib/db'; // Assuming you have your MySQL connection set up in lib/db.js

export default async function handler(req, res) {
  
  // Handle GET requests for specific user tasks
  if (req.method === 'GET' && req.query.userId) {
    const { userId } = req.query;

    try {
      // Fetch tasks for the specific userId
      const [tasks] = await pool.query('SELECT * FROM scheduled_tasks WHERE userId = ?', [userId]);
      return res.status(200).json({ tasks });
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }

  // Handle POST requests to create a new task
  if (req.method === 'POST') {
    const { userId, taskID, task, date, time, location, lat, lon, weatherRestrictions, details, requiredTemperature, idealHumidity } = req.body;

    try {
      // Insert a new task into the database
      const [result] = await pool.query(
        'INSERT INTO scheduled_tasks (userId, taskID, task, date, time, location, lat, lon, weatherRestrictions, details, requiredTemperature, idealHumidity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [userId, taskID, task, date, time, location, lat, lon, JSON.stringify(weatherRestrictions), details, JSON.stringify(requiredTemperature), JSON.stringify(idealHumidity)]
      );
      return res.status(201).json({ message: 'Task created successfully', taskId: result.insertId });
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({ error: 'Failed to create task' }); 
    }
  }

  // Handle PUT requests to update a task
  if (req.method === 'PUT') {
    const { taskID, task, date, time, location, lat, lon, weatherRestrictions, details, requiredTemperature, idealHumidity } = req.body;

    try {
      // Update the task in the database
      const [result] = await pool.query(
        'UPDATE scheduled_tasks SET task = ?, date = ?, time = ?, location = ?, lat = ?, lon = ?, weatherRestrictions = ?, details = ?, requiredTemperature = ?, idealHumidity = ? WHERE taskID = ?', 
        [task, date, time, location, lat, lon, JSON.stringify(weatherRestrictions), details, JSON.stringify(requiredTemperature), JSON.stringify(idealHumidity), taskID]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
      console.error("Error updating task:", error);
      return res.status(500).json({ error: 'Failed to update task' });
    }
  }

  // Handle DELETE requests to delete a task
  if (req.method === 'DELETE') {
    const { taskID } = req.query;

    try {
      // Delete the task from the database
      const [result] = await pool.query('DELETE FROM scheduled_tasks WHERE taskID = ?', [taskID]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ error: 'Failed to delete task' });
    }
  }

  // If the request method is not allowed, respond with 405
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
