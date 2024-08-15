import { TextEncoder } from 'util';
import { bootstrapCameraKit, Injectable, remoteApiServicesFactory } from "@snap/camera-kit";

export default async function handler(req, res) {
    const API_SPEC_ID = 'dcd787d7-7658-4b2c-92e3-feb8ef061fa6'; // Replace with your actual API Spec ID

    console.log("Request received with method:", req.method);

    if (req.method === 'POST') {
        try {
            // Setup CameraKit with API Spec ID
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

            const cameraKit = await bootstrapCameraKit(
                {
                    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjkxOTQxNDcyLCJzdWIiOiIwMmRlOTFiNC1iOGU5LTRhYTItYTM0Ni1kYWQ4YWVkNjU0NGJ-U1RBR0lOR35iOTUyOWExZS1lMDZhLTQ2OWQtYmZhNi1iNjZjZjFlZTUyNzMifQ.GQ_DJ4DMa5-Kj8GmEvoY39YbgHIcDxBCR306SkWhmCw', // Ensure this is set in your Vercel environment
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

            // Process the incoming request using the CameraKit setup
            const requestData = req.body;
            const handler = resultService.getRequestHandler(requestData);
            
            // Simulate a reply to the incoming request
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