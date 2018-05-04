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
var cnts = 0;
var tgh = 0;
//avoid duplicates
function inArray(arr, el) {
    for(var i = 0 ; i < arr.length; i++) 
            if(arr[i] == el) return true;
    return false;
}

function getRandomIntNoDuplicates(min, max, DuplicateArr) {
    var RandomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    if (DuplicateArr.length > (max-min) ) return false;  // break endless recursion
    if(!inArray(DuplicateArr, RandomInt)) {
       DuplicateArr.push(RandomInt); 
       return RandomInt;
    }
    return getRandomIntNoDuplicates(min, max, DuplicateArr); //recurse
}
var duplicates  =[];
var rndnum = []

for (var i = 1; i <= 1 ; i++) { 
    //console.log(getRandomIntNoDuplicates(1,10,duplicates));
  rndnum.push(getRandomIntNoDuplicates(1,10,duplicates))
}
/////////////////
io.on('connection', function(socket) {

  socket.on('new player', function() {
    cnts += 1
    
       dirs[socket.id] = {
      x: 0,
      y: 0,
      rnd: tgh,
      move: false
    }
    
    
    
    
    players[socket.id] = {
      x: 0,
      y: 0,
      rnd: Math.floor(Math.random()*10),
      mesh: null,
      color: 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')'
    };
    
 
    
  });
   socket.on('shift', function(data) {
      var dir = dirs[socket.id] || {};
     dir.y = data;
     dir.rnd = 34;
   })
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    var dir = dirs[socket.id] || {};
    if (data.left) {
      player.x -= 5;
      dir.x -= 5;
    }
    if (data.up) {
      dir.move = true
      player.y -= 5;
      dir.y -= 5;
    }
    if (data.right) {
      player.x += 5;
      dir.x += 5;
    }
    if (data.down) {
      dir.move = true
      player.y += 5;
      dir.y += 5;
    }
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  })
   
});

setInterval(function(){


  io.sockets.emit('state', players);
    
  
}, 1000/60)



// setInterval(function() {
 
//}, 1000 / 60);

setInterval(function() {
  
   io.sockets.emit('directions', dirs);
  io.sockets.emit('online', cnts);
  
}, 1000 / 60);


http.listen(port, function(){
  console.log('listening on *:' + port);
});
