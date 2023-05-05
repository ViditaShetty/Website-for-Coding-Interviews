const express = require('express')

//ADED THIS FOR IDE########################
var http = require('http')
var bodyParser= require('body-parser');
var fs,fs1= require('fs');
var path = require('path');
var cmd = require('node-cmd');
const execSync = require('child_process').execSync;
//titt here


const app = express()
app.use(express.static(__dirname+'/public')) //**********************CONVERT EJS TO HTML AND USE DIRNAME */

// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')
 
var roomId=uuidV4//ADDED THISSSSSSSSS

app.use('/peerjs', peerServer);


//app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  //res.redirect(`/${uuidV4()}`)
  res.send("hii");
  app.use(express.static(__dirname+'/public'));
})

//app.get('/:room', (req, res) => {
//  res.render('room', { roomId: req.params.room })
//})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

//ADED THIS FOR IDE########################

app.use(bodyParser.urlencoded({ extended: true }));
console.log(__dirname+'/res');

app.get('/res', function(req, res){ 
   ///ADDED THID FOR DEPLOYED APP*********
   res.send("/RES")
})

app.post('/res', function(req, res){  ///ADDED THID FOR DEPLOYED APP*********
  var code = req.body.code;
  //console.log("code*************************",code);
  var lang= req.body.lang;
  var input = req.body.input;
  switch(lang)
  {
      case "C++" : 
         
         require('fs').writeFileSync(__dirname+"/code.cpp",code);
          require('fs').writeFileSync(__dirname+"/input.txt",input);
          execSync("g++ code.cpp -o code.exe &> err.txt");
          var error= require('fs').readFileSync(__dirname+"/error.txt",'utf-8');
          require('fs').writeFileSync(__dirname+"/error.txt","");
          if(error=="")
          {
          execSync("./code.exe < input.txt > output.txt");
             var output = require('fs').readFileSync(__dirname+"/output.txt",'utf-8');
           res.send(output);
           }
           else
           {
             res.send(error);
           }           
      break;
      case "C":
         require('fs').writeFileSync(__dirname+"/code.c",code);
          require('fs').writeFileSync(__dirname+"/input.txt",input);
          execSync("gcc code.c -o code.exe &> err.txt");
          var error= require('fs').readFileSync(__dirname+"/error.txt",'utf-8');
          require('fs').writeFileSync(__dirname+"/error.txt","");
          if(error=="")
          {
          execSync("./code.exe < input.txt > output.txt");
             var output = require('fs').readFileSync(__dirname+"/output.txt",'utf-8');
           res.send(output);
           }
           else
           {
             res.send(error);
           }            
         
      break;
      case "Python 2":
        require('fs').writeFileSync(__dirname+"/codec.py",code);
          require('fs').writeFileSync(__dirname+"/input.txt",input);
          execSync("python codec.py &> err.txt < input.txt > output.txt");
          
          
             var error= require('fs').readFileSync(__dirname+"/error.txt",'utf-8');
          require('fs').writeFileSync(__dirname+"/error.txt","");
          if(error=="")
          {
          
             var output = require('fs').readFileSync(__dirname+"/output.txt",'utf-8');
           res.send(output);
           }
           else
           {
             res.send(error);
           }          
         
     
      break;
      case "Python 3":
         // get temp directory
          const os = require("os");
          const tempDir = os.tmpdir();
        //added in prohect seeting cd /tmp   npm install ptyhon3****************
          execSync("cd "+tempDir);
          execSync("npm install python3");
          console.log(tempDir) 
          require('fs').writeFileSync(tempDir+"/codec.py",code);
          require('fs').writeFileSync(tempDir+"/input.txt",input);
          var exec="python3 /tmp/codec.py < /tmp/input.txt > /tmp/outputp.txt";
          console.log(exec);
          execSync(exec);
         
          ///ADDED THESE 2 LINES****************** 
          var output = require('fs').readFileSync(tempDir+"/outputp.txt",'utf-8');
          console.log("read",output);
          res.send(output);
          
          //require('fs').writeFileSync(tempDir+"/tmp/error.txt","");
          //var error= require('fs').readFileSync(tempDir+"/error.txt",'utf-8');
          var error="";


          if(error=="")
          {
             var output = require('fs').readFileSync(tempDir+"/outputp.txt",'utf-8');
             res.send();
           }
           else
           {
             res.send(error);
           }      
      break;
  }
   });
//TILL HERE#######################################################
server.listen(3030||process.env.PORT)
      