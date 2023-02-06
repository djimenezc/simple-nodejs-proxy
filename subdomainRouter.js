// reverseProxy.js
 
var proxy = require('subdomain-router');
var http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
 
const PORT = 3001;
const HOST = 'davidproxy.com';
const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";


var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer(options);

var simpleServer = function (text) {
  return http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(text + '\n');
  });
};
 
simpleServer('this is from the home page').listen(10000);
simpleServer(createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/json_placeholder`]: '',
    },
})).listen(10001);
simpleServer('this is from couponxchange').listen(10003);
simpleServer('this is from gallery').listen(10004);
 
var proxyServer = proxy({
  host: HOST,
  messages: {
    home: 'This is my fancy home page',
    invalid: 'I don\'t know about this subdomain',
    down: 'This app or service is down right now',
    error: 'There was a weird connection error'
  },
  subdomains: {
    '':  10000, // This is for the home page
    om: 10001,
    couponxchange: 10003,
    gallery: 10004  // This server is "down" since we didn't start anything up on port 10003
  }
});
 
// proxyServer.listen(3001); // Requires sudo access, could be any other port

// Start Proxy
proxyServer.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});