import pkg from '@snap/camera-kit';

const { bootstrapCameraKit, Injectable, remoteApiServicesFactory } = pkg;

export default async function handler(req, res) {
    const API_SPEC_ID = 'your-api-spec-id-here'; // Replace with your actual API Spec ID

    if (req.method === 'POST') {
        try {
            const resultService = {
                apiSpecId: 'dcd787d7-7658-4b2c-92e3-feb8ef061fa6',

                getRequestHandler(request) {
                    console.log("Received data from Lens:", request.body);

                    return (reply) => {
                        const processedData = `Received data: ${new TextDecoder().decode(request.body)}`;
                        reply({
                            status: "success",
                            metadata: {},
                            body: new TextEncoder().encode(processedData),
                        });
                    };
                },
            };

            const cameraKit = await bootstrapCameraKit(
                { apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjkxOTQxNDcyLCJzdWIiOiIwMmRlOTFiNC1iOGU5LTRhYTItYTM0Ni1kYWQ4YWVkNjU0NGJ-U1RBR0lOR35iOTUyOWExZS1lMDZhLTQ2OWQtYmZhNi1iNjZjZjFlZTUyNzMifQ.GQ_DJ4DMa5-Kj8GmEvoY39YbgHIcDxBCR306SkWhmCw' },
                (container) => container.provides(
                    Injectable(
                        remoteApiServicesFactory.token,
                        [remoteApiServicesFactory.token],
                        (existing) => [...existing, resultService]
                    )
                )
            );

            res.status(200).json({ message: 'CameraKit initialized successfully' });
        } catch (error) {
            console.error('Error processing data:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
