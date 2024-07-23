import { expect } from "chai";
import { getWallet, deployContract } from "../deploy/utils";
import { ethers } from "ethers";

let currentCampaignId = 0n;

function parseEther(amount: string) {
  return ethers.parseEther(amount);
}

export function prettifyCampaign(
  id: bigint,
  campaign: readonly [
    string,
    bigint,
    bigint,
    bigint,
    boolean,
    boolean,
    string,
  ],
) {
  return {
    id,
    organizer: campaign[0],
    goalAmount: campaign[1],
    createdAt: campaign[2],
    raised: campaign[3],
    isOpen: campaign[4],
    isWithdrawn: campaign[5],
    ipfsHash: campaign[6],
  };
}

async function createAndGetCampaign(fundraising, owner, amount, ipfsHash, filters) {
  const txResponse = await fundraising.connect(owner).createCampaign(parseEther(amount), ipfsHash, filters);
  const receipt = await txResponse.wait();
  
  const result = await fundraising.campaigns(currentCampaignId);
  const prettifiedCampaign = prettifyCampaign(currentCampaignId, result);

  currentCampaignId += 1n;
  return prettifiedCampaign;
}

describe("Fundraising", function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let fundraising;
  let filters;

  before(async function () {
    owner = getWallet(process.env.WALLET_PRIVATE_KEY);
    addr1 = getWallet(process.env.ADDR1_PRIVATE_KEY);
    addr2 = getWallet(process.env.ADDR2_PRIVATE_KEY);
    addrs = [owner, addr1, addr2]; // Example setup

    fundraising = await deployContract("Fundraising", [], { wallet: owner });

    filters = await fundraising.getAllCampaignFilters().then(res => Array.from(res));
  });

  describe("Deployment", function () {
    it("Should track each campaign created", async function () {
      const campaign = await createAndGetCampaign(fundraising, owner, "10.0", "Sample IPFS Hash 1", filters);
      expect(campaign.organizer).to.equal(owner.address);
      expect(campaign.goalAmount).to.equal(parseEther("10.0"));
    });
  });

  describe("Contributions", function () {
    it("Should accept contributions", async function () {
      const campaign = await createAndGetCampaign(fundraising, owner, "5.0", "Sample IPFS Hash 2", filters);
      
      const txResponse = await fundraising.connect(addr1).contribute(campaign.id, { value: parseEther("1.0") });
      const receipt = await txResponse.wait();

      await expect(txResponse)
        .to.emit(fundraising, "ContributionReceived");

      const updatedCampaign = await fundraising.campaigns(campaign.id);
      expect(updatedCampaign.raisedAmount).to.equal(parseEther("1.0"));
    });
  });

  describe("Withdrawals", function () {
    it("Should allow organizer to withdraw when goal is met", async function () {
      const campaign = await createAndGetCampaign(fundraising, owner, "2.0", "Sample IPFS Hash 3", filters);

      await fundraising.connect(addr1).contribute(campaign.id, { value: parseEther("2.0") });

      await expect(fundraising.connect(owner).withdrawFunds(campaign.id))
        .to.emit(fundraising, "FundsWithdrawn")
        .withArgs(campaign.id, parseEther("2.0"));
    });
  });

  describe("Stopping a Campaign", function () {
    it("Should let organizer stop the campaign", async function () {
      const campaign = await createAndGetCampaign(fundraising, owner, "2.0", "Sample IPFS Hash 4", filters);

      await expect(fundraising.connect(owner).stopCampaign(campaign.id))
        .to.emit(fundraising, "CampaignStopped")
        .withArgs(campaign.id);

      const updatedCampaign = await fundraising.campaigns(campaign.id);
      expect(updatedCampaign.isOpen).to.be.false;
    });
  });

  describe("Errors", function () {
    it("Should fail if non-organizer tries to stop the campaign", async function () {
      const campaign = await createAndGetCampaign(fundraising, owner, "2.0", "Sample IPFS Hash 5", filters);

      await expect(fundraising.connect(addr1).stopCampaign(campaign.id))
        .to.be.revertedWith("Only the campaign organizer can stop the campaign");
    });
  });
});
