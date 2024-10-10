// src/lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',       // e.g., 'localhost'
  user: 'root',   // e.g., 'root'
  password: '',// your MySQL password
  database: 'coconut_users_tasks_db' // your database name
});

export default pool;
