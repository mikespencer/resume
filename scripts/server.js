const http = require('http');
const handler = require('serve-handler');

class Server {
  constructor({ port }) {
    this.port = port;
    this.server = http.createServer((request, response) =>
      handler(request, response)
    );
  }

  start() {
    return new Promise(resolve => {
      this.server.listen(this.port, () => {
        resolve();
      });
    });
  }

  stop() {
    return new Promise(resolve => {
      this.server.close(() => {
        resolve();
      });
    });
  }
}

module.exports = Server;
