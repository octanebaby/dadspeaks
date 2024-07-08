export default function handler(req, res) {
    if (req.method === 'POST') {
        console.log('Received data:', req.body);
        res.status(200).json({ message: 'Data received successfully' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
