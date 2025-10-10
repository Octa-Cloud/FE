const WebSocket = require('ws');

const CHANNEL = 'wsri8qna';
const ws = new WebSocket('ws://localhost:3055');

ws.on('open', function open() {
  console.log('Connected to WebSocket server');
  
  // Join channel
  const joinMessage = {
    type: 'join',
    channel: CHANNEL,
    id: 'join-' + Date.now()
  };
  
  console.log('Joining channel:', CHANNEL);
  ws.send(JSON.stringify(joinMessage));
  
  // Wait a bit then send read_my_design command
  setTimeout(() => {
    const readCommand = {
      type: 'message',
      channel: CHANNEL,
      message: {
        id: 'read-' + Date.now(),
        command: 'read_my_design',
        params: {}
      }
    };
    
    console.log('Requesting design data...');
    ws.send(JSON.stringify(readCommand));
  }, 1000);
});

ws.on('message', function message(data) {
  console.log('Received:');
  console.log(data.toString());
  
  try {
    const parsed = JSON.parse(data.toString());
    if (parsed.type === 'broadcast' && parsed.message && parsed.message.result) {
      console.log('\n=== DESIGN DATA ===');
      console.log(JSON.stringify(parsed.message.result, null, 2));
      ws.close();
    }
  } catch (e) {
    // Keep listening
  }
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});

ws.on('close', function close() {
  console.log('Disconnected from WebSocket server');
  process.exit(0);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('Timeout - closing connection');
  ws.close();
}, 10000);

