const http = require('http'); //creates a variable called http, then assigns to it an instance of the HTTP module. This is what imports the HTTP module and allows you to use its function createServer().
const fs = require('fs');
const url = require('url');

http.createServer((request, response) => { // the two arguments inside the inner-most function will be called every time a request is made against the sever (name:request handler)
  let addr = request.url,
    q = url.parse(addr, true),
    filePath = '';
    if (q.pathname.includes('documentation')) {
      filePath = (__dirname + '/documentation.html');
    } else {
      filePath = 'index.html';
    }
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }
      
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
  });

  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });
  
}).listen(8080);
console.log('My test server is running on Port 8080.');