import hardhat from "hardhat";
import { expect } from "chai";

const { ethers, networkHelpers } = await hardhat.network.connect();
const { parseEther, id, ZeroHash, ZeroAddress } = ethers;

const DAY = 24 * 60 * 60;
const VOTING_DELAY = 1 * DAY;
const VOTING_PERIOD = 7 * DAY;
const TIMELOCK_DELAY = 2 * DAY;
const PROPOSAL_STATE = { PENDING: 0, ACTIVE: 1, CANCELED: 2, DEFEATED: 3, SUCCEEDED: 4, QUEUED: 5, EXPIRED: 6, EXECUTED: 7 };
const VOTE_TYPE = { AGAINST: 0, FOR: 1, ABSTAIN: 2 };

const fixture = async () => {
    const [owner, voter1, voter2] = await ethers.getSigners();
    const token = await ethers.deployContract("DaoToken", [owner.address]);
    const timelock = await ethers.deployContract("TimelockController", [2 * DAY, [], [], owner.address]);
    const governor = await ethers.deployContract("DaoGovernor", [token.target, timelock.target]);
    const box = await ethers.deployContract("Box", [owner.address]);
    await timelock.grantRole(await timelock.PROPOSER_ROLE(), governor.target);
    await timelock.grantRole(await timelock.EXECUTOR_ROLE(), ZeroAddress);
    await timelock.revokeRole(ZeroHash, owner.address);
    await box.transferOwnership(timelock.target);
    await token.transfer(voter1.address, parseEther("50000"));
    await token.transfer(voter2.address, parseEther("5000"));
    return { governor, token, timelock, box, voter1, voter2 };
};

const buildProposal = (governor, description, box, value) => {
    const targets = [box.target];
    const values = [0];
    const calldatas = [box.interface.encodeFunctionData("store", [value])];
    const descriptionHash = id(description);
    const proposalId = governor.hashProposal(targets, values, calldatas, descriptionHash);

    return {
        id: proposalId,
        propose: (signer) => governor.connect(signer).propose(targets, values, calldatas, description),
        voteFor: (signer) => governor.connect(signer).castVote(proposalId, VOTE_TYPE.FOR),
        voteAgainst: (signer) => governor.connect(signer).castVote(proposalId, VOTE_TYPE.AGAINST),
        queue: () => governor.queue(targets, values, calldatas, descriptionHash),
        execute: () => governor.execute(targets, values, calldatas, descriptionHash),
        state: () => governor.state(proposalId)
    };
};

describe("DAO", () => {
    it("Contract", async () => {
        const { governor, timelock, box } = await networkHelpers.loadFixture(fixture);
        expect(await governor.name()).to.equal("DAO");
        expect(await box.owner()).to.equal(timelock.target);
    });

    it("Delegate", async () => {
        const { token, voter1 } = await networkHelpers.loadFixture(fixture);
        expect(await token.getVotes(voter1.address)).to.equal(0);
        await token.connect(voter1).delegate(voter1.address);
        expect(await token.getVotes(voter1.address)).to.equal(parseEther("50000"));
    });

    it("ProposeReverted", async () => {
        const { governor, token, box, voter2 } = await networkHelpers.loadFixture(fixture);
        await token.connect(voter2).delegate(voter2.address);
        const proposal = buildProposal(governor, "Proposal", box, 50);
        await expect(proposal.propose(voter2)).to.be.revertedWithCustomError(governor, "GovernorInsufficientProposerVotes");
    });

    it("ExecuteCycle", async () => {
        const { governor, token, box, voter1 } = await networkHelpers.loadFixture(fixture);
        await token.connect(voter1).delegate(voter1.address);
        const proposal = buildProposal(governor, "Store 100 in Box", box, 100);
        await proposal.propose(voter1);
        await networkHelpers.mine(VOTING_DELAY);
        await expect(proposal.voteFor(voter1)).to.emit(governor, "VoteCast");
        await networkHelpers.mine(VOTING_PERIOD);
        expect(await proposal.state()).to.equal(PROPOSAL_STATE.SUCCEEDED);
        await proposal.queue();
        expect(await proposal.state()).to.equal(PROPOSAL_STATE.QUEUED);
        await networkHelpers.time.increase(TIMELOCK_DELAY);
        await proposal.execute();
        expect(await proposal.state()).to.equal(PROPOSAL_STATE.EXECUTED);
        expect(await box.retrieve()).to.equal(100);
    });

    it("DefeatedCycle", async () => {
        const { governor, token, box, voter1 } = await networkHelpers.loadFixture(fixture);
        await token.connect(voter1).delegate(voter1.address);
        const proposal = buildProposal(governor, "Store 50 in Box", box, 50);
        await proposal.propose(voter1);
        await networkHelpers.mine(VOTING_DELAY);
        await proposal.voteAgainst(voter1);
        await networkHelpers.mine(VOTING_PERIOD);
        expect(await proposal.state()).to.equal(PROPOSAL_STATE.DEFEATED);
        await expect(proposal.queue()).to.be.revertedWithCustomError(governor, "GovernorUnexpectedProposalState");
    });
});
