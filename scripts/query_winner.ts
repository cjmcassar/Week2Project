import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const CONTRACT_ADDRESS = "0xe35640bf3D0Ae7a3c4F70562A1451528Cf9E19cA";

async function main() {
	const options = {
		alchemy: process.env.ALCHEMY_API_KEY,
		infura: process.env.INFURA_API_KEY,
	};

	const provider = ethers.getDefaultProvider("goerli", options);
	//connect to Metamask wallet using seed phrase
	const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
	const signer = wallet.connect(provider);
	//make sure wallet contains ether
	const balanceBN = await signer.getBalance();
	const balance = Number(ethers.utils.formatEther(balanceBN));
	if (balance < 0.01) {
		throw new Error("Not enough ether");
	}
	//Get the deployed contract
	const ballotFactory = new Ballot__factory(signer);
	const ballotContract = await ballotFactory.attach(CONTRACT_ADDRESS);

	//Query winning proposal
	console.log("Query winning proposal");
	const winningProposal = await ballotContract.winnerName();
	console.log({ winningProposal });
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
