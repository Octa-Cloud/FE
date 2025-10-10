const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', function open() {
  console.log('WebSocket 연결됨');
  
  // fd2x6uql 채널의 디자인 정보 요청
  const request = {
    type: 'get_design',
    channel: 'fd2x6uql',
    nodeId: '682-34'
  };
  
  ws.send(JSON.stringify(request));
});

ws.on('message', function message(data) {
  try {
    const response = JSON.parse(data);
    console.log('=== fd2x6uql 채널 디자인 정보 ===');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.log('응답 데이터:', data.toString());
  }
  
  ws.close();
});

ws.on('error', function error(err) {
  console.error('WebSocket 오류:', err);
});

ws.on('close', function close() {
  console.log('WebSocket 연결 종료');
});
