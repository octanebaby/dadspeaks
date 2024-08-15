import { bootstrapCameraKit, Injectable, remoteApiServicesFactory } from "@snap/camera-kit";

// Define the Remote API Service
const lensDataService = {
    apiSpecId: "dcd787d7-7658-4b2c-92e3-feb8ef061fa6", // Replace with your actual API Spec ID

    getRequestHandler(request) {
        if (request.endpointId !== "your-endpoint-id-here") return; // Replace with your actual endpoint ID

        return (reply) => {
            // Log the incoming request data
            console.log("Received data from Lens:", request.body);

            // Example processing of the data
            const processedData = `Received data: ${new TextDecoder().decode(request.body)}`;

            // Reply back to the Lens with a success message
            reply({
                status: "success",
                metadata: {},
                body: new TextEncoder().encode(processedData),
            });
        };
    },
};

// Set up CameraKit with the Remote API Service
const cameraKit = await bootstrapCameraKit(
    { apiToken: "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjkxOTQxNDcyLCJzdWIiOiIwMmRlOTFiNC1iOGU5LTRhYTItYTM0Ni1kYWQ4YWVkNjU0NGJ-U1RBR0lOR35iOTUyOWExZS1lMDZhLTQ2OWQtYmZhNi1iNjZjZjFlZTUyNzMifQ.GQ_DJ4DMa5-Kj8GmEvoY39YbgHIcDxBCR306SkWhmCw" }, // Ensure your API token is set up in Vercel environment
    (container) => container.provides(
        Injectable(
            remoteApiServicesFactory.token,
            [remoteApiServicesFactory.token],
            (existing) => [...existing, lensDataService]
        )
    )
);