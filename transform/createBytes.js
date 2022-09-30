const ethers = require("ethers");

//Created a function that takes in a string and returns the bytes32 representation of that string
async function createBytes(args) {
	const name = args[0];
	// const wallet = ethers.Wallet.createRandom();
	const bytes = ethers.utils.formatBytes32String(name);
	console.log("bytes:", bytes);
}

createBytes(process.argv.slice(2));
