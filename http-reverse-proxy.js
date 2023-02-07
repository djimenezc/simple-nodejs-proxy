const https = require("https");
const httpProxy = require("http-proxy");
const fs = require('fs')
const path = require('path');

const SERVER_PORT = 443
const DOMAIN = "davidproxy.com";

// reverse proxy
const proxy = httpProxy.createProxyServer();

const options = {
  key: fs.readFileSync("./cert/server.key", 'utf8'),
  cert: fs.readFileSync("./cert/server.cert", 'utf8'),
  // ssl: {
  // key: fs.readFileSync('./cert/client.key', 'utf8'),
  // cert: fs.readFileSync('./cert/client.pem', 'utf8'),
  // },
  // secure: true
};

function sendHtml(res, filePath, errorCode = 200) {
  const html = fs.readFileSync(path.resolve(filePath), 'utf8')
  res.writeHeader(errorCode, {"Content-Type": "text/html"});
  res.write(html);
  res.end();
}
https.createServer(options, function (req, res) {

  const domain = req.headers.host;
  const host = domain.split(":")[0];

  const targets = {
    [`om.${DOMAIN}`]: {host: "dev.valassis.eu", port: "443"},
    [`couponxchange.${DOMAIN}`]: {host: "couponxchange.de", port: "443"},
    [`example.${DOMAIN}`]: {host: "example.com", port: "80"}
  }

  console.log(`Request to domain ${host}`)

  if (host === DOMAIN) {
    sendHtml(res, "html/index.html", 200)
  } else if (targets[host]) {
    proxy.web(req, res, {
      target: targets[host],
      // ssl: {
      //   key: fs.readFileSync("./cert/server.key", 'utf8'),
      //   cert: fs.readFileSync("./cert/server.cert", 'utf8'),
      // },
      secure: false
    }, function (e) {
      console.error(`${e}`)
    });
  } else {
    sendHtml(res, "html/error.html", 200)
  }

}).listen(SERVER_PORT, function (req, res) {
  console.log(`Server started at port ${SERVER_PORT}`);
});

