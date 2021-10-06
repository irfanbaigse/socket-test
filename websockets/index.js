import WebSocket from "ws";
import queryString from "query-string";

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export default async (expressServer) => {
  const websocketServer = new WebSocket.Server({
    noServer: true,
    path: "/websockets",
  });

  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  });

  websocketServer.on(
    "connection",
    function connection(websocketConnection, connectionRequest) {
      const [_path, params] = connectionRequest?.url?.split("?");
      const connectionParams = queryString.parse(params);

      // NOTE: connectParams are not used here but good to understand how to get
      // to them if you need to pass data with the connection to identify it (e.g., a userId).
      console.log(connectionParams);

      websocketConnection.on("message", (message) => {
        if(!IsJsonString(message)) {
            websocketConnection.send(JSON.stringify({ message: 'invalid json :(' }));

        } else {

          const parsedMessage = JSON.parse(message);
          console.log(parsedMessage);
          websocketConnection.send(JSON.stringify({ message: 'There be gold in them thar hills.' }));

        }
      });
    }
  );

  return websocketServer;
};
