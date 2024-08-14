import { TextEncoder } from 'util';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const API_SPEC_ID = 'your-api-spec-id-here'; // Replace this with your actual API Spec ID

        const resultService = {
            apiSpecId: API_SPEC_ID,

            getRequestHandler(request) {
                console.log("Received request from Lens:", request);
                
                return (reply) => {
                    console.log("Replying to Lens:", reply);
                    reply({
                        status: "success",
                        metadata: {},
                        body: new TextEncoder().encode("Data received successfully"),
                    });
                };
            },
        };

        try {
            // Simulating the request processing using the resultService
            const requestData = req.body;  // Assuming data is sent as JSON
            const handler = resultService.getRequestHandler(requestData);
            
            // Simulating a reply to the incoming request
            handler((reply) => {
                console.log("Replying with:", reply);
                res.status(200).json({ message: 'Data received successfully', reply });
            });
        } catch (error) {
            console.error('Error processing data:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}