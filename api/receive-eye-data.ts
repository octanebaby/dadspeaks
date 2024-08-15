export default async function handler(req, res) {
  console.log("Function triggered");  // Confirm function is called

  if (req.method === 'POST') {
      const apiSpecId = req.body.apiSpecId || req.headers['x-api-spec-id'];
      const apiToken = req.body.apiToken || req.headers['Authorization'];

      console.log("API Spec ID:", apiSpecId);
      console.log("API Token:", apiToken);

      if (!apiSpecId || !apiToken) {
          res.status(400).json({ message: 'Missing API Spec ID or Token' });
          return;
      }

      console.log("Received request body:", JSON.stringify(req.body));

      res.status(200).json({ message: 'Data received successfully', receivedData: req.body });
  } else {
      res.status(405).json({ message: 'Method not allowed' });
  }
}