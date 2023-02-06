const http = require("http");
const httpProxy = require("http-proxy");
const fs = require('fs')

// reverse proxy
const proxy = httpProxy.createProxyServer();

http.createServer({
    ssl: {
        key: fs.readFileSync('./cert/client.key', 'utf8'),
        cert: fs.readFileSync('./cert/client.pem', 'utf8')
    },
    secure: true
}, function (req, res) {
    let target;
    const domain = req.headers.host;
    const host = domain.split(":")[0];

    if (host === "davidproxy.com") {
        target = {host: "www.google.com", port: "443"};
    } else if (host === "om.davidproxy.com") {
        target = {host: "dev.valassis.eu", port: "443"};
    } else if (host === "couponxchange.davidproxy.com") target = {
        host: "couponxchange.de",
        port: "443"
    };

    proxy.web(req, res, {
        target: target
    }, function (e) {
        console.log(`Error: ${e}`)
    });
}).listen(443);

