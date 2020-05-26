const { PeerServer } = require("peer");
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");

const port = process.env.PORT || 9000;
const path = "/";
const peerServer = PeerServer({ port, path: path });

const app = express();

app.use(bodyParser);
app.use("/peerjs", peerServer);
module.exports.handler = serverless(app);
console.log(`🚀 Started Peer Server http://localhost:${port}${path}`);
