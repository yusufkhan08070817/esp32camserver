const path = require("path");
const express = require("express");
const WebSocket = require("ws");
const os = require('os');


const app = express();
const WS_PORT = process.env.WS_PORT || 8888;


const wsServer = new WebSocket.Server({ port: WS_PORT }, () =>
  console.log(`WebSocket server is listening at ${WS_PORT}`)
);

const networkInterfaces = os.networkInterfaces();


// Find and print IPv4 addresses
for (const interfaceName in networkInterfaces) {
  const addresses = networkInterfaces[interfaceName];
  for (const address of addresses) {
    if (address.family === 'IPv4' && !address.internal) {
      console.log('IP Address:', address.address);
    }
  }
}
let connectedClients = [];

wsServer.on("connection", (ws, req) => {
  console.log("Client connected");

  connectedClients.push(ws);
 console.log( connectedClients);
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

