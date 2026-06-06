import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true } });
app.set('io', io);
io.on('connection', (socket) => {
  socket.on('join:user', (userId) => { if (userId) socket.join(`user:${userId}`); });
});
server.listen(port, () => console.log(`MonsoonBites API running on port ${port}`));
