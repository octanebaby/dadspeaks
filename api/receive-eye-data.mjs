export default async function handler(req, res) {
    console.log("Function triggered"); // This log ensures that the function is being called

    if (req.method === 'POST') {
        try {
            // Log the received data
            console.log("Received POST request with data:", req.body);

            // Respond with a success message
            res.status(200).json({ message: 'Data received successfully', data: req.body });
        } catch (error) {
            // Log any errors that occur during processing
            console.error('Error processing request:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        // Handle non-POST requests
        console.log("Received non-POST request");
        res.status(405).json({ message: 'Method not allowed' });
    }
}