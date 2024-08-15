import { bootstrapCameraKit, Injectable, remoteApiServicesFactory } from "@snap/camera-kit";

const eyeExpressionsService = {
    apiSpecId: "dcd787d7-7658-4b2c-92e3-feb8ef061fa6", // Replace with your actual API spec ID

    getRequestHandler(request) {
        if (request.endpointId !== "receive-eye-data") return;

        return (reply) => {
            const eyeData = new TextDecoder().decode(request.body);
            console.log("Received eye expressions:", eyeData);

            // Process the eyeData as needed
            // You can add your logic here to store, analyze, or forward the data

            reply({
                status: "success",
                metadata: {},
                body: new TextEncoder().encode("Eye data received"),
            });
        };
    },
};

const configuration = {
    apiToken: process.env.CAMERA_KIT_API_TOKEN, // Ensure this environment variable is set
};

const cameraKit = await bootstrapCameraKit(configuration, (container) =>
    container.provides(
        Injectable(
            remoteApiServicesFactory.token,
            [remoteApiServicesFactory.token] as const,
            (existing) => [...existing, eyeExpressionsService]
        )
    )
);

export default function handler(req, res) {
    res.status(200).json({ message: 'API is set up and ready to receive eye data.' });
}