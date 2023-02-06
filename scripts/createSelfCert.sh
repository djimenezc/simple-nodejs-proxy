#!/usr/bin/env bash

cd cert;

openssl genrsa -aes256 -passout pass:xxxx -out client.pass.key 4096
openssl rsa -passin pass:xxxx -in client.pass.key -out client.key
rm client.pass.key
openssl req -new -key client.key -out client.csr
openssl x509 -req -days 365 -in client.csr -CA ca.pem -CAkey ca.key \
-set_serial "01" -extfile <(printf "extendedKeyUsage=clientAuth") \
-out client.pem

cat client.key client.pem ca.pem > client.full.pem
