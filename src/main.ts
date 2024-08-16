import { bootstrapCameraKit, Injectable, remoteApiServicesFactory } from '@snap/camera-kit';

(async function () {
  const cameraKit = await bootstrapCameraKit({
    apiToken: process.env.CAMERA_KIT_API_TOKEN,
    logger: 'console',
  });

  const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
  const session = await cameraKit.createSession({ liveRenderTarget });

  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  await session.setSource(mediaStream);
  await session.play();

  const lens = await cameraKit.lensRepository.loadLens(
    '1fc3ff92-832c-4d76-bf47-5af26b3cf034',
    'edbb7369-1f9b-4b19-92f2-93f6f1de3f56'
  );

  await session.applyLens(lens);

  // Define your Remote API service
  const receiveEyeDataService: RemoteApiService = {
    apiSpecId: "dcd787d7-7658-4b2c-92e3-feb8ef061fa6", // Replace with your actual API spec ID

    getRequestHandler(request: any) {
      if (request.endpointId !== "eye_expressions_endpoint") return;

      return async (reply: any) => {
        try {
          const response = await fetch('/api/receive-eye-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.body),
          });

          if (response.ok) {
            const responseData = await response.json();
            console.log('Data received successfully:', responseData);

            reply({
              status: "success",
              metadata: {},
              body: new TextEncoder().encode(JSON.stringify(responseData)),
            });
          } else {
            console.error('Error receiving data:', response.statusText);
            reply({
              status: "failure",
              metadata: {},
              body: new TextEncoder().encode('Failed to receive data'),
            });
          }
        } catch (error) {
          console.error('Fetch error:', error);
          reply({
            status: "failure",
            metadata: {},
            body: new TextEncoder().encode('Error processing request'),
          });
        }
      };
    },
  };

  // Inject the service into the container
  cameraKit.getContainer().provides(
    Injectable(
      remoteApiServicesFactory.token,
      [remoteApiServicesFactory.token] as const,
      (existing: RemoteApiServices) => [...existing, receiveEyeDataService]
    )
  );
})();