var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var count = 0
var mrt = {
  rnd: Math.floor(Math.random()*10)
}

var players = {};
var dirs = {};
io.on('connection', function(socket) {

  socket.on('new player', function() {
  
    count = 0
       dirs[socket.id] = {
      x: 0,
      y: 0,
         rnd: Math.floor(Math.random()*10)
    }
    setInterval(function(){
  count += 1
  if(count == 4){
  io.sockets.emit('online', dirs[socket.id].rnd);
  }
}, 1000)
    
    players[socket.id] = {
      x: dirs[socket.id].x,
      y: dirs[socket.id].y,
      rnd: Math.random()*5,
      mesh: null,
      color: 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')'
    };
    
 
    
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    var dir = dirs[socket.id] || {};
    if (data.left) {
      player.x -= 5;
      dir.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
      dir.y -= 5;
    }
    if (data.right) {
      player.x += 5;
      dir.x += 5;
    }
    if (data.down) {
      player.y += 5;
      dir.y += 5;
    }
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  })
   
});

setInterval(function(){
  count += 1
  if(count == 2){
  io.sockets.emit('online', mrt.rnd);
  }
}, 1000)



// setInterval(function() {
 io.sockets.emit('state', players);

document.addEventListener("keydown", function(ev){
  if(ev.which == 32){
  io.sockets.emit('state', players);
  }
})
//}, 1000 / 60);

setInterval(function() {
   
  io.sockets.emit('directions', dirs);
  
}, 1000 / 60);


http.listen(port, function(){
  console.log('listening on *:' + port);
});
