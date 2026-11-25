/* eslint-disable @typescript-eslint/no-require-imports -- The hosting startup file uses CommonJS. */
const { createServer } = require("node:http");
const next = require("next");

process.env.NODE_ENV = "production";

const port = Number(process.env.PORT || 3000);
const app = next({ dev: false, dir: __dirname, port });
const handle = app.getRequestHandler();

function failToStart(error) {
  console.error(error);
  process.exitCode = 1;
}

app.prepare().then(() => {
  const server = createServer((request, response) => {
    handle(request, response).catch((error) => {
      console.error(error);
      if (response.headersSent) {
        response.destroy();
        return;
      }
      response.statusCode = 500;
      response.end("Internal Server Error");
    });
  });

  server.once("error", failToStart);
  server.listen(port);
}).catch(failToStart);
