Albert's NEO Demo
=================

This is a simple Node.JS script that queries a NEO JSON-RPC service and announces whenever a ContractInvocation transaction is detected. The details of the transaction are then logged to the server console.

This is to showcase the research on how to interact with the NEO Blockchain.

Getting Started
------------

```
git clone https://github.com/achen27/NEO_Test
cd NEO_Test
npm install
node server.js
```

That's it!

Settings
------------

Depending on what nodes are up, you may have to adjust the settings for the RPC server. The best way to test it for development is to do it under a privnet.

Just uncomment and recomment the relevant server.

```
var rpcserver = 'http://localhost:30333';
```


Made by [Albert Chen]
-------------------

\ ゜o゜)ノ
