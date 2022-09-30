const ethers = require("ethers");

//Created a function that takes in a string and returns the bytes32 representation of that string
async function parseBytes(args) {
	const bytes = args[0];

	const name = ethers.utils.parseBytes32String(bytes);
	console.log("name:", name);
}

parseBytes(process.argv.slice(2));
