import { bootstrapCameraKit, RemoteApiService, RemoteApiRequest, RemoteApiReply } from '@snap/camera-kit';

const eyeExpressionsService: RemoteApiService = {
  apiSpecId: "dcd787d7-7658-4b2c-92e3-feb8ef061fa6",  // Replace with your actual API spec ID

  getRequestHandler(request: RemoteApiRequest) {
    if (request.endpointId !== "eye_expressions_endpoint") return;

    return (reply: RemoteApiReply) => {
      console.log("Received request from Lens:", request);
      reply({
        status: "success",
        metadata: {},
        body: new TextEncoder().encode(JSON.stringify({ message: "Eye expressions received" })),
      });
    };
  },
};

(async function () {
  const cameraKit = await bootstrapCameraKit({
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjkxOTQxNDcyLCJzdWIiOiIwMmRlOTFiNC1iOGU5LTRhYTItYTM0Ni1kYWQ4YWVkNjU0NGJ-U1RBR0lOR35iOTUyOWExZS1lMDZhLTQ2OWQtYmZhNi1iNjZjZjFlZTUyNzMifQ.GQ_DJ4DMa5-Kj8GmEvoY39YbgHIcDxBCR306SkWhmCw',  // Replace with your actual API token
    logger: 'console',
  });

  // Register the eyeExpressionsService with CameraKit
  cameraKit.provides(eyeExpressionsService);

  // Set up the live render target and media stream for the lens
  const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
  const session = await cameraKit.createSession({ liveRenderTarget });
  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });

  await session.setSource(mediaStream);
  await session.play();

  // Load and apply the lens
  const lens = await cameraKit.lensRepository.loadLens(
    '1fc3ff92-832c-4d76-bf47-5af26b3cf034',     // Replace with your actual Lens ID
    'edbb7369-1f9b-4b19-92f2-93f6f1de3f56'     // Replace with your actual Group ID
  );

  await session.applyLens(lens);
})();