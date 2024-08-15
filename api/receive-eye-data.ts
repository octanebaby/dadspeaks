export default function handler(req, res) {
  console.log("Function triggered");  // Log to confirm function is called

  if (req.method === 'POST') {
      console.log("Received POST request body:", req.body);
      res.status(200).json({ message: 'Data received successfully' });
  } else {
      console.log("Received non-POST request");
      res.status(405).json({ message: 'Method not allowed' });
  }
}