import { Move } from "cubing/alg";

export function startServer(onMove: (move: Move) => void) {
  // From https://bun.sh/docs/api/websockets
  Bun.serve({
    port: 4001,
    fetch(req, server) {
      if (new URL(req.url).pathname === "/register-sender") {
        // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
          console.log("Client connected!");
          return; // do not return a Response
        }

        return new Response("Upgrade failed :(", { status: 500 });
      }
    },
    websocket: {
      message: (ws, message) => {
        const move = Move.fromString(
          (
            JSON.parse(message as string) as {
              data: { latestAlgLeaf: string };
            }
          ).data.latestAlgLeaf,
        );
        console.log(`Received move: ${move.toString()}`);
        onMove(move);
      },
    }, // handlers
  });

  console.log("Serving…");
}
