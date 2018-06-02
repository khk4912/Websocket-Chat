
var ws = new WebSocket("input websocket address here");
var tt = 0;
var tn = 0;

if(confirm("채팅을 이용하시면서 일어나는 일은 개발자가 책임지지 않습니다.\n동의하십니까?") == false) {
  history.back();
  throw stop;

} else {
  var name = prompt("채팅에서 사용할 닉네임을 입력하십시오.");
  if (name == ""){
    alert("빈 이름은 사용하실 수 없습니다.");
    window.location.reload();
    throw stop;
  };

  if (name == "null" || name==null) {
    alert("이름을 입력하지 않으셨습니다.");
    window.location.reload();
    throw stop;
  };

};

name = name.substring(0,10);


ws.onopen = function() {
ws.send('{"type":"name", "name":"' + name +'"}')
};

ws.onmessage = function (evt) {
  var data = evt.data;
  data = JSON.parse(data)
 document.getElementById('content').value = document.getElementById('content').value + data.chat + "\r\n";
 var textarea = document.getElementById('content');
 textarea.scrollTop = textarea.scrollHeight;
};

ws.onclose = function() {
  document.getElementById('content').value = document.getElementById('content').value +  "\r\n서버와 연결이 끊어졌습니다. 새로고침하여 연결을 재시도하십시오.";

};
ws.onerror = function() {
  document.getElementById('content').value = document.getElementById('content').value +  "\r\n오류가 발생하였습니다. 새로고침하여 연결을 재시도하십시오.";

}

function enterkey() {
  if (window.event.keyCode == 13) {
      send_chat();
  };
};

set_times = setInterval(function() {
  tt = 0;
}, 5000);

set_tn = setInterval(function(){
  tn = 0
}, 12000);

function send_chat (){

  if (tn > 7) {
    alert("지속적인 도배로 서버와의 연결이 종료됩니다.");
    ws.close();
  };

  if (tt > 5) {
    tn = tn + 1
    alert("너무 빠른 속도로 메시지를 보내고 계십니다. 나중에 다시 시도해주세요.")
  } else {
  var chat_content = document.getElementById('chat').value
  };

  if (chat_content ==  ""){
    alert("빈 메시지는 보낼 수 없습니다.");
  }
  else {
    tt = tt + 1;
    var chat = chat_content.substring(0,100);
    ws.send('{"type":"chat", "chat":"' + chat +'"}')
    document.getElementById('chat').value = '';

  };

};
