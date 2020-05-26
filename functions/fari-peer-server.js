const { PeerServer } = require("peer");

const port = process.env.PORT || 9000;
const path = "/";

console.log("Starting...");
const peerServer = PeerServer({ port: 9000, path: path });
console.log(`🚀 Started Peer Server http://localhost:${port}${path}`);
