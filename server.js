const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = 8000;
const root = __dirname;
const contentTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript"
};

const server = http.createServer((request, response) => {
  const requestedPath = request.url === "/" ? "/index.html" : request.url;
  const filePath = path.join(root, decodeURIComponent(requestedPath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "text/plain"
    });
    response.end(file);
  });
});

server.listen(port, () => {
  console.log(`Northstar is running at http://localhost:${port}`);
});