'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var http__namespace = /*#__PURE__*/_interopNamespace(http);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__namespace = /*#__PURE__*/_interopNamespace(path);

const hostname = "0.0.0.0";
const port = 3000;
const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".svg": "application/image/svg+xml",
};
const DEFAULT_MIMETYPE = "application/octet-stream";
const server = http__namespace.createServer((req, res) => {
    console.log("request: ", req.url);
    let filePath = "." + (req.url || '').replace(/\?.*$/, "");
    if (filePath == "./") {
        filePath = "./index.html";
    }
    const extname = String(path__namespace.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || DEFAULT_MIMETYPE;
    fs__namespace.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == "ENOENT") {
                fs__namespace.readFile("./404.html", (_error, content) => {
                    res.writeHead(200, { "Content-Type": contentType });
                    res.end(content, "utf-8");
                });
            }
            else {
                res.writeHead(500);
                res.end("Sorry, check with the site admin for error: " + error.code + " ..\n");
                res.end();
            }
        }
        else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
