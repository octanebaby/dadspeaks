import { bootstrapCameraKit, remoteApiServicesFactory } from "@snap/camera-kit";

const API_SPEC_ID = process.env.API_SPEC_ID;
const CAMERA_KIT_API_TOKEN = process.env.CAMERA_KIT_API_TOKEN;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log('Received data:', req.body);

        const eyeDataService = {
            apiSpecId: API_SPEC_ID,

            getRequestHandler(request) {
                console.log("Received request from Lens:", request);

                return (reply) => {
                    console.log("Replying to Lens:", request);

                    const responseBody = {
                        status: "success",
                        receivedData: req.body,
                    };

                    reply({
                        status: "success",
                        metadata: {},
                        body: new TextEncoder().encode(JSON.stringify(responseBody)),
                    });
                };
            },
        };

        try {
            const cameraKit = await bootstrapCameraKit(
                { apiToken: CAMERA_KIT_API_TOKEN },
                (container) => {
                    return container.provides(
                        remoteApiServicesFactory.token,
                        [remoteApiServicesFactory.token],
                        (existing) => [...existing, eyeDataService]
                    );
                }
            );

            const requestHandler = eyeDataService.getRequestHandler(req);
            if (requestHandler) {
                requestHandler((response) => {
                    console.log("Sending response:", response);
                    res.status(200).json(response);
                });
            } else {
                res.status(400).json({ message: 'Invalid request' });
            }
        } catch (error) {
            console.error("Error processing data:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}