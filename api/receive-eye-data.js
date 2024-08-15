import { TextEncoder } from 'util';

export default async function handler(req, res) {
    // Replace these with your actual API Spec ID and CameraKit API token
    const API_SPEC_ID = 'dcd787d7-7658-4b2c-92e3-feb8ef061fa6';
    const apiToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjkxOTQxNDcyLCJzdWIiOiIwMmRlOTFiNC1iOGU5LTRhYTItYTM0Ni1kYWQ4YWVkNjU0NGJ-U1RBR0lOR35iOTUyOWExZS1lMDZhLTQ2OWQtYmZhNi1iNjZjZjFlZTUyNzMifQ.GQ_DJ4DMa5-Kj8GmEvoY39YbgHIcDxBCR306SkWhmCw';

    // Log the method of the incoming request
    console.log("Request received with method:", req.method);

    if (req.method === 'POST') {
        try {
            // Dynamically import CameraKit dependencies
            const {
                bootstrapCameraKit,
                Transform2D,
                createMediaStreamSource,
                Injectable,
                remoteApiServicesFactory,
            } = await import("@snap/camera-kit");

            // Setup result service with your API Spec ID
            const resultService = {
                apiSpecId: 'dcd787d7-7658-4b2c-92e3-feb8ef061fa6',

                getRequestHandler(request) {
                    console.log("Received request from Lens:", request);

                    return (reply) => {
                        console.log("Replying to Lens:", reply);
                        reply({
                            status: "success",
                            metadata: {},
                            body: new TextEncoder().encode("Hello World"),
                        });
                    };
                },
            };

            // Bootstrap CameraKit with API token and result service
            const cameraKit = await bootstrapCameraKit(
                {
                    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjkxOTQxNDcyLCJzdWIiOiIwMmRlOTFiNC1iOGU5LTRhYTItYTM0Ni1kYWQ4YWVkNjU0NGJ-U1RBR0lOR35iOTUyOWExZS1lMDZhLTQ2OWQtYmZhNi1iNjZjZjFlZTUyNzMifQ.GQ_DJ4DMa5-Kj8GmEvoY39YbgHIcDxBCR306SkWhmCw',
                },
                (container) => {
                    return container.provides(
                        Injectable(
                            remoteApiServicesFactory.token,
                            [remoteApiServicesFactory.token],
                            (existing) => [...existing, resultService]
                        )
                    );
                }
            );

            // Simulate handling a request
            const requestData = req.body;
            const handler = resultService.getRequestHandler(requestData);
            
            // Simulate replying to the incoming request
            handler((reply) => {
                console.log("Replying with:", reply);
                res.status(200).json({ message: 'Data received successfully', reply });
            });

        } catch (error) {
            console.error('Error processing data:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        console.log("Received a non-POST request");
        res.status(405).json({ message: 'Method not allowed' });
    }
}
