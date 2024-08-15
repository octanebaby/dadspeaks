const {
    bootstrapCameraKit,
    Transform2D,
    createMediaStreamSource,
    Injectable,
    remoteApiServicesFactory,
  } = await import("@snap/camera-kit");

  const ref = input;
  const cameraKit = await bootstrapCameraKit(
    {
      apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjkxOTQxNDcyLCJzdWIiOiIwMmRlOTFiNC1iOGU5LTRhYTItYTM0Ni1kYWQ4YWVkNjU0NGJ-U1RBR0lOR35iOTUyOWExZS1lMDZhLTQ2OWQtYmZhNi1iNjZjZjFlZTUyNzMifQ.GQ_DJ4DMa5-Kj8GmEvoY39YbgHIcDxBCR306SkWhmCw'
    },
    (container) => {
      return container.provides(
        Injectable(
          remoteApiServicesFactory.token,
          [remoteApiServicesFactory.token] as const,
          (existing: RemoteApiServices) => [...existing, resultService]
        )
      );
    }
  );


const resultService: RemoteApiService = {
apiSpecId: 'dcd787d7-7658-4b2c-92e3-feb8ef061fa6',

getRequestHandler(request) {
    console.log("received request from Lens", request);
    console.log("received request from Lens", request);
    console.log("received request from Lens", request);
return (reply) => {
    console.log("replying to lens", reply);
    console.log("replying to lens", reply);
    console.log("replying to lens", reply);
reply({
    status: "success",
    metadata: {},
    body: new TextEncoder().encode("Hello World"),
    });
    };
    },
};
