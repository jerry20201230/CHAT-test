const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {

  maxHttpBufferSize: 1e8
});
const port = process.env.PORT || 3000;

app.get(/js|icon/, (req, res) => {
  res.sendFile(`${__dirname}/${req.path}`);
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
var user = {"__MAIN":[]}
var nickname = {"__MAIN":[]}

var people = {"__MAIN":0}
var typeing = []
var RoomList = ["__MAIN"]


var lastmsg = ""
var msgCount = 0
var lastID = ""

var fileID= 0

function arrayRemove(arr, value) {

  return arr.filter(function (ele) {
    return ele != value;
  });

}

function arrayRemove_val(arr, value) {
  var b = '';
  for (b in arr) {
    if (arr[b] === value) {
      arr.splice(b, 1);
      break;
    }
  }
  return arr;
};

Math.getRandomInt = function (max) {
  return Math.floor(Math.random() * max);
}





io.on('connection', (socket) => {

  socket.on('chat message', msg => {


    i = socket.id

    if (msg === "!DEV /_") {
      io.to(i).emit("sys-info chat message", "[伺服器回應][重要!]你已經是開發人員")
      io.to(i).emit('typeing', "開發人員模式已啟用")
    } else {


      console.log(nickname[user.indexOf(i)] + " (" + i + ") 發布了: " + msg)


      io.emit('chat message', nickname[user.indexOf(i)] + " (" + i + ") 發布了: " + msg);
      if (lastmsg == msg && i == lastID) {
        msgCount += 1
        if (msgCount == 2) {
          io.to(i).emit('sys-warn chat message', "[伺服器警告!] " + nickname[user.indexOf(i)] + " (" + i + ") 請勿洗版，否則我們將斷開你的連線!")
        } else if (msgCount == 3) {
          io.to(i).emit("BAN", "byebye");
          io.emit("sys-info chat message", nickname[user.indexOf(i)] + " (" + i + ") 因大量發送相同訊息/洗版，已被伺服器中斷連線")
        }
      }
      else {
        lastmsg = msg
        msgCount = 0
        lastID = i
      }
    }
  });

  i = socket.id
  console.log('user ' + i + ' connected');
  people += 1
  socket.join("__MAIN")
  console.log(i);
  user.push(i)
  r = Math.getRandomInt(9999)
  while (nickname.includes(r)) {
    r = Math.getRandomInt(9999)
    console.log("X")
  }
  nickname.push("User" + (r))
  console.log(user)
  console.log(nickname)
  io.to(i).emit('nickname', nickname.at(-1))

  io.emit('sys-info chat message', nickname[user.indexOf(i)] + " (" + i + ") 已加入");
  io.emit('people online', people.__MAIN)

  io.to(i).emit("sys-info chat message", "[伺服器回應] " + nickname.at(-1) + " (" + i + ") 歡迎來到聊天室~")

  socket.on('typeing', msg => {
    i = socket.id || msg
    _display = ""

    if (typeing.indexOf(i) == -1) {
      typeing.push(i)
    }
    console.log(typeing)
    if (typeing === []) {
      console.log("no one is typeing")
      io.emit('typeing', " ")
    } else {

      for (let a = 0; a < typeing.length; a++) {

        _display = _display + nickname[user.indexOf(typeing[a])] + " (" + typeing[a] + ")<br>"
      }

      if (_display + " 正在輸入..." == " 正在輸入...") {
        io.emit('typeing', "&nbsp;")
      } else {
        console.log(_display + " 正在輸入...")
        io.emit('typeing', _display + " 正在輸入...")
      }

    }





  });
  socket.on('typeing-end', function (msg) {
    _display = ""
    typeing = arrayRemove(typeing, msg)
    console.log(typeing)
    for (let a = 0; a < typeing.length; a++) {

      _display = _display + nickname[user.indexOf(typeing[a])] + " (" + typeing[a] + ")<br>"
    }

    console.log(_display + " 正在輸入...")
    io.emit('typeing', _display + " 正在輸入...")
  });




  socket.on('send img', function (msg) {
    i = socket.id
    fileID++
    io.emit('send img', { "text": (nickname[(user.indexOf(i))] + " (" + i + ") 發送了圖片:"), "src": msg, "id": 'img-' + fileID })

    if (lastmsg == msg && i == lastID) {
      msgCount += 1
      if (msgCount == 2) {
        io.to(i).emit('sys-warn chat message', "[伺服器警告!] " + nickname[user.indexOf(i)] + " (" + i + ") 請勿洗版，否則我們將斷開你的連線!")
      } else if (msgCount == 3) {
        io.to(i).emit("BAN", "byebye");
        io.emit("sys-info chat message", nickname[user.indexOf(i)] + " (" + i + ") 因大量發送相同訊息/洗版，已被伺服器中斷連線")
      }
    }
    else {
      lastmsg = msg
      msgCount = 0
      lastID = i
    }
  });




  socket.on('send txt', function (msg) {
    i = socket.id
    fileID++
    io.emit('send txt', { "text": (nickname[(user.indexOf(i))] + " (" + i + ") 發送了文字檔:"), "src": msg, "id": 'txt-' + fileID })

    if (lastmsg == msg && i == lastID) {
      msgCount += 1
      if (msgCount == 2) {
        io.to(i).emit('sys-warn chat message', "[伺服器警告!] " + nickname[user.indexOf(i)] + " (" + i + ") 請勿洗版，否則我們將斷開你的連線!")
      } else if (msgCount == 3) {
        io.to(i).emit("BAN", "byebye");
        io.emit("sys-info chat message", nickname[user.indexOf(i)] + " (" + i + ") 因大量發送相同訊息/洗版，已被伺服器中斷連線")
      }
    }
    else {
      lastmsg = msg
      msgCount = 0
      lastID = i
    }
  });


  /*********************/
  socket.on('MyUA', function (msg) {

    UA.push(msg.OS + "/" + msg.BR)
    io.emit("UserList", { "userID": user, "nickname": nickname, "UA": UA })
  });

  socket.on('join', function (msg) {
    if ((Object.keys(RoomList).indexOf(msg.room)) == -1){
      io.to(msg.id).emit("room not found",msg.room)
    }
    else{
      socket.join(msg.room)
      io.to(msg.id).emit("joined",msg.room)
      socket.leave("__MAIN")
    }
    
  })




  socket.on('GetUsers', msg => {
    io.to(i).emit("UserList", { "userID": user[msg], "nickname": nickname[msg]})
  })
  socket.on('rename_nickname', msg => {
    i = socket.id
    _nic = nickname[user.indexOf(i)]
    if (nickname.includes(msg)) {
      io.to(i).emit("sys-info chat message", "[伺服器回應] " + _nic + " (" + i + ") 請勿使用與別人相同的暱稱")
    } else {
      _nic = nickname[user.indexOf(i)]
      console.log(_nic + " (" + i + ") 已更改暱稱為: " + msg)
      nickname[user.indexOf(i)] = msg
      io.emit("NM", user + nickname)
      io.emit('sys-info chat message', _nic + " (" + i + ") 已更改暱稱為: " + msg);
      io.emit("UserList", { "userID": user[msg], "nickname": nickname[msg]})
    }

  });


  socket.on('disconnect', function () {
    i = socket.id

    typeing = arrayRemove(typeing, i)

    _display = ""

    console.log(typeing)
    for (let a = 0; a < typeing.length; a++) {

      _display = _display + nickname[user.indexOf(typeing[a])] + " (" + typeing[a] + ")"
    }

    console.log(_display + " 正在輸入...")
    io.emit('typeing', _display + " 正在輸入...")




    console.log(`user[${socket.id}] disconnected`);
    io.emit("sys-info chat message", nickname[user.indexOf(i)] + " (" + i + ") 已離線")
    people -= 1
    io.emit('people online', people)
    let _nickname = nickname[user.indexOf(i)]

    user = arrayRemove(user, socket.id)
    nickname = arrayRemove(nickname, _nickname)
    UA = arrayRemove_val(UA, user.indexOf(i))

    console.log(user)
    console.log(nickname)
    console.log(UA)
    io.emit("UserList", { "userID": user, "nickname": nickname, "UA": UA })

  })

});

http.listen(port, () => {
  console.log("Hi,There!")
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
