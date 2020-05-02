
const ws = new WebSocket("ws://ip_address:8000");


let name = prompt("채팅에서 사용할 닉네임을 입력하십시오.")
if (name == "") {
  alert("빈 이름은 사용하실 수 없습니다.")
  window.location.reload()
  throw stop;
}

if (name == "null" || name == null) {
  alert("이름을 입력하지 않으셨습니다.")
  window.location.reload()
  throw stop;
};



name = name.substring(0, 10)


ws.onopen = function () {
  ws.send('{"type":"name", "name":"' + name + '"}')
}

ws.onmessage = function (evt) {
  let data = evt.data;
  data = JSON.parse(data)
  document.getElementById('content').value = document.getElementById('content').value + data.chat + "\r\n"
  let textarea = document.getElementById('content');
  textarea.scrollTop = textarea.scrollHeight;
};

ws.onclose = function () {
  document.getElementById('content').value = document.getElementById('content').value + "\r\n서버와 연결이 끊어졌습니다. 새로고침하여 연결을 재시도하십시오."

};
ws.onerror = function () {
  document.getElementById('content').value = document.getElementById('content').value + "\r\n오류가 발생하였습니다. 새로고침하여 연결을 재시도하십시오."

}

function enterkey() {
  if (window.event.keyCode == 13) {
    send_chat();
  }
}

function send_chat() {
  let chat_content = document.getElementById('chat').value
  if (chat_content == "") {
    alert("빈 메시지는 보낼 수 없습니다.")
  }
  else {
    var chat = chat_content.substring(0, 100)
    ws.send('{"type":"chat", "chat":"' + chat + '"}')
    document.getElementById('chat').value = ''

  }
}