import pkg from "@snap/camera-kit";
const { bootstrapCameraKit, remoteApiServicesFactory, Injectable } = pkg;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Log to see if the request is received
            console.log('Request received with method:', req.method);

            // Initialize the CameraKit
            const cameraKit = await bootstrapCameraKit({
                apiToken: process.env.CAMERA_KIT_API_TOKEN
            }, (container) => {
                return container.provides(
                    Injectable(
                        remoteApiServicesFactory.token,
                        [remoteApiServicesFactory.token] as const,
                        (existing) => [...existing, /* your services */]
                    )
                );
            });

            // Handle the request from Lens (you can customize this part)
            const { EyeBlinkLeft, EyeBlinkRight } = req.body;

            console.log('Received Eye Data:', { EyeBlinkLeft, EyeBlinkRight });

            res.status(200).json({ message: 'Data received successfully' });
        } catch (error) {
            console.error('Error processing data:', error);
            res.status(500).json({ message: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}