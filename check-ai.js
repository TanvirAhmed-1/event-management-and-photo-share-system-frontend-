const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    console.log(`BODY: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`AI service connection failed: ${e.message}`);
  console.error('This means your Python Flask server is NOT running or not listening on Port 5000!');
});

req.end();
