import {
  bootstrapCameraKit,
  Injectable,
  remoteApiServicesFactory,
} from '@snap/camera-kit';

async function main() {
  const cameraKit = await bootstrapCameraKit({
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjkxOTQxNDcyLCJzdWIiOiIwMmRlOTFiNC1iOGU5LTRhYTItYTM0Ni1kYWQ4YWVkNjU0NGJ-U1RBR0lOR35iOTUyOWExZS1lMDZhLTQ2OWQtYmZhNi1iNjZjZjFlZTUyNzMifQ.GQ_DJ4DMa5-Kj8GmEvoY39YbgHIcDxBCR306SkWhmCw',
  }, (container: any) => {
    return container.provides(
      Injectable(
        remoteApiServicesFactory.token,
        [remoteApiServicesFactory.token] as const,
        (existing: any) => [...existing, resultService]
      )
    );
  });

  const resultService = {
    apiSpecId: 'dcd787d7-7658-4b2c-92e3-feb8ef061fa6',
    getRequestHandler(request: any) {
      if (request.endpointId !== 'eye_expressions_endpoint') return;

      return (reply: any) => {
        reply({
          status: 'success',
          metadata: {},
          body: new TextEncoder().encode('Data received'),
        });
      };
    },
  };

  const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
  const session = await cameraKit.createSession({ liveRenderTarget });
  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
  
  await session.setSource(mediaStream);
  await session.play();
  
  const lens = await cameraKit.lensRepository.loadLens(
    '1fc3ff92-832c-4d76-bf47-5af26b3cf034',
    'edbb7369-1f9b-4b19-92f2-93f6f1de3f56'
  );
  
  await session.applyLens(lens);
}

main().catch(console.error);