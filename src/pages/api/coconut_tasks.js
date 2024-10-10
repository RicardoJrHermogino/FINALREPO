import { db } from '@/lib/db'; // Assuming you've set up the MySQL connection here

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [tasks] = await db.query('SELECT * FROM coconut_tasks');
      res.status(200).json({ tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Error fetching tasks from the database." });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
