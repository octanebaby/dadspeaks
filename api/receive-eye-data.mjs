import cameraKit from "@snap/camera-kit";
const { bootstrapCameraKit, remoteApiServicesFactory, Injectable } = cameraKit;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            console.log('Request received with method:', req.method);

            // Define your custom service for handling incoming requests
            const eyeExpressionsService = {
                apiSpecId: "your-api-spec-id-here", // Replace with your actual API Spec ID

                getRequestHandler(request) {
                    if (request.endpointId !== "eye_expressions_endpoint") return;

                    return (reply) => {
                        // You can process the request here and send a response
                        const { EyeBlinkLeft, EyeBlinkRight } = request.body;
                        console.log("Processing Eye Data:", { EyeBlinkLeft, EyeBlinkRight });

                        reply({
                            status: "success",
                            metadata: {},
                            body: new TextEncoder().encode(JSON.stringify({ message: "Data processed successfully" })),
                        });
                    };
                },
            };

            // Initialize CameraKit with your custom service
            const cameraKitInstance = await bootstrapCameraKit({
                apiToken: process.env.CAMERA_KIT_API_TOKEN
            }, (container) =>
                container.provides(
                    Injectable(
                        remoteApiServicesFactory.token,
                        [remoteApiServicesFactory.token],
                        (existing) => [...existing, eyeExpressionsService]
                    )
                )
            );

            res.status(200).json({ message: 'CameraKit initialized and ready' });

        } catch (error) {
            console.error('Error processing data:', error);
            res.status(500).json({ message: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
