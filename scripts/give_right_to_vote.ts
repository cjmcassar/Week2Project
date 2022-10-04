import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const CONTRACT_ADDRESS = "0xe35640bf3D0Ae7a3c4F70562A1451528Cf9E19cA";
const ADDRESSES = [
	"0xf7602a8c78D167E15E56bF84f6e49E98f8000cea",
	"0xF54c4046226886eA8cd25E5D3f0ae8f085aA27CC",
];

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

	//give right to vote. Can only be called by the chairperson
	console.log("give right to vote to authorized addresses");
	for (let index = 0; index < ADDRESSES.length; index++) {
		const giveRightToVoteTx = await ballotContract.giveRightToVote(
			ADDRESSES[index],
			{ gasLimit: 3e7 }
		);
		const giveRightToVoteTxReceipt = await giveRightToVoteTx.wait();
		console.log({ giveRightToVoteTxReceipt });
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
