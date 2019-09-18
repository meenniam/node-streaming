const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 8080;
const io = require('socket.io')(server);
app.use(express.static(__dirname + '/public'));
let broadcaster;
io.sockets.on('error', e => console.log(e));
io.sockets.on('connection', function (socket) {
  socket.on('broadcaster', function () {
    console.log('broadcaster', socket.id)
    broadcaster = socket.id;
    socket.broadcast.emit('broadcaster');
  });
  socket.on('watcher', function () {
    console.log('watcher', socket.id)
    console.log('broadcaster',broadcaster)
    broadcaster && socket.to(broadcaster).emit('watcher', socket.id);
  });
  socket.on('offer', function (id /* of the watcher */, message) {
    console.log('offer', socket.id )
    socket.to(id).emit('offer', socket.id /* of the broadcaster */, message);
  });
  socket.on('answer', function (id /* of the broadcaster */, message) {
    console.log('answer', socket.id )
    socket.to(id).emit('answer', socket.id /* of the watcher */, message);
  });
  socket.on('candidate', function (id, message) {
    console.log('candidate', socket.id )
    socket.to(id).emit('candidate', socket.id, message);
  });
  socket.on('disconnect', function() {
    console.log('disconnect', socket.id )
    broadcaster && socket.to(broadcaster).emit('bye', socket.id);
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));