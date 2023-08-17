const path = require("path");
const express = require("express");
const WebSocket = require("ws");

const app = express();
const WS_PORT = 8888||process.env.port;
const HTTP_PORT = 8000||process.env.port;

const wsServer = new WebSocket.Server({ port: WS_PORT }, () =>
  console.log(`WebSocket server is listening at ${WS_PORT}`)
);

let connectedClients = [];

wsServer.on("connection", (ws, req) => {
  console.log("Client connected");
  connectedClients.push(ws);

  ws.on("message", (data) => {
    connectedClients.forEach((ws, i) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      } else {
        connectedClients.splice(i, 1);
      }
    });
  });
});

app.get("/client", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client.html"));
});

app.listen(HTTP_PORT, () => {
  console.log(`HTTP server listening at ${HTTP_PORT}`);
});
