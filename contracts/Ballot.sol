// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
/// @title Voting with delegation.
contract Ballot {
    // this is a new complex type which will be used for variables later to represent a single voter
    struct Voter {
        uint weight; // weight which is increased by delegation
        bool voted;  // becomes true if the voter has voted
        address delegate; // the person delegated to
        uint vote;   // represents the index of the voted proposal
    }


    struct Proposal {
        bytes32 name;   // name (up to 32 bytes)
        uint voteCount; // int of total votes
    }

    address public chairperson;

    // This declares a state variable that stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    // Creates a new ballot that will be used to choose one of the proposals
    constructor(bytes32[] memory proposalNames) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        // for each proposal name a new proposal object is created and added to the end of the array
        for (uint i = 0; i < proposalNames.length; i++) {

            // Proposal creates a temp object and append it to the end of the 'proposals'
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    // The chairperson allows address to vote on this ballot.
    function giveRightToVote(address voter) external {

        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }

    /// Delegate your vote to the voter `to`.
    function delegate(address to) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "You can't vote");
        require(!sender.voted, "You already voted.");

        require(to != msg.sender, "You cannot delegate yourself");

        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;


            require(to != msg.sender, "There is a loop in delegation.");
        }

        Voter storage delegate_ = voters[to];

        require(delegate_.weight >= 1);

        sender.voted = true;
        sender.delegate = to;

        if (delegate_.voted) {

            proposals[delegate_.vote].voteCount += sender.weight;
        } else {

            delegate_.weight += sender.weight;
        }
    }

    // Give your vote (including votes delegated to you) to proposal.
    function vote(uint proposal) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;


        proposals[proposal].voteCount += sender.weight;
    }

    // Computes the winning proposal taking all previous votes into account.
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index of the winner contained in the proposals array and then returns the name of the winner
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}