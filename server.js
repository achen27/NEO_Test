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
/* 
private net:
'http://localhost:30333';

neo-python node:
'https://pyrpc2.narrative.network:443';

china neo nodekey: "value", 
http://api.otcgo.cn:10332

http://seed3.cityofzion.io:8080
http://seed2.neo.org:10332
*/

const client = Neon.create.rpcClient(rpcserver, '2.3.2');
const sb = Neon.create.scriptBuilder();

var currentBlock = 0;
var rpcId = 0;

async function checkBlock () {

	let blockCount = await client.getBlockCount();
	console.log("Current Block:", blockCount);

	if (blockCount > currentBlock) {

		

		try {
			var block = await client.getBlock(currentBlock-1, 1);
	    	for (var i = block.tx.length - 1; i >= 0; i--) {
	    		if (block.tx[i].type === "ContractTransaction") {
	    			console.log("Contract Transaction Detected!");
	    			console.log(block.tx[i].vout);
	    		}
	    		if (block.tx[i].type === "InvocationTransaction") {
	    			console.log("Invocation Transaction Detected!");
	    			console.log("Txid:", block.tx[i].txid);
	    			parseScript(block.tx[i].script);
	    		}
	    	}
	    	currentBlock = blockCount;

		} catch (err) {
			console.log(err);
		}


	}

}

function parseScript (script) {
/*
 *  Prints the details of the InvocationTransaction script
 *  @param {string} script - bytecode in hexstring format
 */	
 	try {
		const sb1 = Neon.create.scriptBuilder(script);
		const params = sb1.toScriptParams();
		if (params[0].scriptHash) {
			try {
				console.log("---Invocation Details---");
				console.log("Script Hash:", params[0].scriptHash);
				console.log("Method Call:", Neon.u.hexstring2str(params[0].args[0]))	;
				console.log("From Address:", Neon.get.addressFromScriptHash(Neon.u.reverseHex(params[0].args[1][2])));
				console.log("To Address:", Neon.get.addressFromScriptHash(Neon.u.reverseHex(params[0].args[1][1])));
				console.log("Amount:", Neon.u.Fixed8.fromReverseHex(params[0].args[1][0]));
			} catch (err) {
				console.log("Not a NEP-5 call!");
			}
		} else {
			console.log("No script hash specified for this transaction!")
		}
	} catch (err) {
		console.log("Script bytecode not parseable!");
		console.log("Script:", script);
	}


}

async function testRPC () {
/*
 *
 * Tests out any RPC queries on the rpcserver, this is to check whether the method works on this speific node
 *
 */

	try {
		const query1 = Neon.create.query({method: "getapplicationlog", params: ["0xce42d818929c622e4cff7a14bf78db571a633635cec608bddbcd900f785809f9"] });
		const response1 = await query1.execute(rpcserver);
		console.log(response1);
	} catch (err) {
		console.log(err);
	}
}

function testScriptBuilder (script) {

	// test script:
	// '0800fd5bc3d904000014dd81ecdfcf4104972b48f85b811cdf598d7d815814ed7516751a2e004bd1bbad32399a3e761265817353c1087472616e7366657267187fc13bec8ff0906c079e7f4cc8276709472913'
	// first arg: '7472616e73666572' (transfer)
	// second arg: array, [0] = amount, [1] = to, [2] = from (basically flipped)

	const sb1 = Neon.create.scriptBuilder(script);
	const params = sb1.toScriptParams();
	console.log("---PARAMS---");
	console.log("Script Hash:", params[0].scriptHash);
	console.log("Method Call:", Neon.u.hexstring2str(params[0].args[0]))	;
	console.log("From Address:", Neon.get.addressFromScriptHash(Neon.u.reverseHex(params[0].args[1][2])));
	console.log("To Address:", Neon.get.addressFromScriptHash(Neon.u.reverseHex(params[0].args[1][1])));
	console.log("Amount:", Neon.u.Fixed8.fromReverseHex(params[0].args[1][0]));

}

async function testGetTx (txid) {
	try {
		let res = await client.getRawTransaction(txid, 1);
		console.log(res);
		testScriptBuilder(res.script);
	} catch (err) {
		console.log(err);
	}
}
/* testGetTx('a058c2278c932224892e179e7f32ff3874d3470711fd00b86af344ca41cb2e0b');
testGetTx('c5b5050c69ecd2ee71f483cb2064bee4eb1dc3f4c983027d3965894055cdfc77');
*/
// testScriptBuilder();

checkBlock();

setInterval(checkBlock, 3000);


