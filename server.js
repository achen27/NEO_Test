// init project
var express = require('express');
var app = express();
const http = require('http');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


var neonjs = require('@cityofzion/neon-js');
var Neon = neonjs.default;


var rpcserver = 'https://pyrpc2.narrative.network:443';
// private net
// var rpcserver = 'http://localhost:30333';



const client = Neon.create.rpcClient(rpcserver, '2.3.2')



var currentBlock = 0;
var rpcId = 0;

async function checkBlock () {

	let blockCount = await client.getBlockCount();
	console.log("Current Block:", blockCount);

	if (blockCount > currentBlock) {

		currentBlock = blockCount;
		var block = await client.getBlock(currentBlock-1, 1);
    	for (var i = block.tx.length - 1; i >= 0; i--) {
    		if (block.tx[i].type === "ContractTransaction") {
    			console.log("Contract Transaction Detected!");
    			console.log(block.tx[i].vout);
    		}
    	}
		    	


	}

}

checkBlock();

setInterval(checkBlock, 3000);