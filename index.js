var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var count = 0
var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    count = 0
    players[socket.id] = {
      x: 0,
      y: 0,
      mesh: null,
      color: 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')'
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  })
   
});


 setInterval(function() {
   count += 1
   if(count == 2){
  io.sockets.emit('state', players.mesh);
   }else{
     io.sockets.emit('state', {players.x, players.y});
   }
}, 1000 / 60);



http.listen(port, function(){
  console.log('listening on *:' + port);
});
