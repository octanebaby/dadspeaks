import pkg from '@snap/camera-kit';
const { bootstrapCameraKit, Injectable, remoteApiServicesFactory } = pkg;

export default async function handler(req, res) {
    const API_SPEC_ID = 'dcd787d7-7658-4b2c-92e3-feb8ef061fa6';  // Replace with your actual API Spec ID
    const API_TOKEN = process.env.CAMERA_KIT_API_TOKEN;  // Make sure this is set in your environment variables

    if (req.method === 'POST') {
        try {
            // Initialize the Camera Kit with your API Token
            const cameraKit = await bootstrapCameraKit(
                { apiToken: API_TOKEN },
                (container) => container.provides(
                    Injectable(
                        remoteApiServicesFactory.token,
                        [remoteApiServicesFactory.token],
                        (existing) => [...existing, resultService]
                    )
                )
            );

            // Define a Remote API service to handle requests from Lens Studio
            const resultService = {
                apiSpecId: API_SPEC_ID,
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

            // Register the result service
            cameraKit.provides(
                Injectable(
                    remoteApiServicesFactory.token,
                    [remoteApiServicesFactory.token],
                    (existing) => [...existing, resultService]
                )
            );

            // Simulate the processing of data
            const data = req.body;
            console.log("Processing data:", JSON.stringify(data));
            res.status(200).json({ message: 'Data processed successfully', receivedData: data });

        } catch (error) {
            console.error('Error processing request:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        console.log("Received non-POST request");
        res.status(405).json({ message: 'Method not allowed' });
    }
}
