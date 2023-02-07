
const proxy = require('redbird')({
  port: 80,
  xfwd: true,
  letsencrypt: {
    path: __dirname + "certs",
    port: 9999
  },
  ssl: {
    http2: false,
    port: 443, // SSL port used to serve registered https routes with LetsEncrypt certificate.
  }
});

let connectionInfo = {
  ssl: {
    letsencrypt: {
      email: 'my@davidproxy.com',
      production: false,
    }
  }
};

const DOMAIN = "davidproxy.com";

proxy.register(`example.${DOMAIN}`, "http://example.com", connectionInfo);

proxy.register(`google.${DOMAIN}`, "http://google.com");

proxy.register(`om.${DOMAIN}`, "http://dev.valassis.eu/capi");

proxy.register(`couponxchange.${DOMAIN}`, "http://couponxchange.de");
