import { expect } from "chai";

import { getWallet, deployContract, getProvider } from "../../deploy/utils";
import { ethers, parseEther } from "ethers";

async function createAndGetCampaign(
  fundraising,
  owner,
  amount: string,
  ipfsHash: string,
  filters: string[]
) {
  const txResponse = await fundraising
    .connect(owner)
    .createCampaign(parseEther(amount), ipfsHash, filters);

    console.log({txResponse})

  await txResponse.wait();

  return fundraising.campaigns(0);
}

describe("Fundraising", async function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let fundraising;
  let filters;

  this.beforeAll(async function () {
    owner = getWallet(process.env.WALLET_PRIVATE_KEY);
    addr1 = getWallet(process.env.ADDR1_PRIVATE_KEY);
    addr2 = getWallet(process.env.ADDR2_PRIVATE_KEY);
    addrs = [owner, addr1, addr2]; // Just an example setup

    // Deploying the contract using custom deployContract function
    fundraising = await deployContract("Fundraising", [], {
      wallet: owner,
    });

    filters = await fundraising
      .getAllCampaignFilters()
      .then((res) => Array.from(res));

    console.log(filters);
  });

  describe("Deployment", function () {
    it("Should track each campaign created", async function () {
      const campaign = await createAndGetCampaign(
        fundraising,
        owner,
        "10.0",
        "Sample IPFS Hash 1",
        filters
      );

      expect(campaign.organizer).to.equal(owner.address);
      expect(campaign.goalAmount).to.equal(parseEther("10.0"));
    });
  });

  describe("Contributions", function () {
    it("Should accept contributions and emit event", async function () {
      await createAndGetCampaign(
        fundraising,
        owner,
        "5.0",
        "Sample IPFS Hash 2",
        filters
      );

      await expect(
        await fundraising
          .connect(addr1)
          .contribute(0, { value: parseEther("1.0") })
      ).to.emit(fundraising, "ContributionReceived");

      const campaign = await fundraising.campaigns(0);
      expect(campaign.raisedAmount).to.equal(parseEther("1.0"));
    });
  });

  describe("Withdrawals", function () {
    it("Should allow organizer to withdraw when goal is met", async function () {
      // Create a campaign and capture the emitted event to get the campaign ID
      const txResponse = await fundraising
        .connect(owner)
        .createCampaign(parseEther("2.0"), "Sample IPFS Hash 3", filters);

      const receipt = await txResponse.wait(); // Wait for the transaction to be mined
      const campaignCreatedEvent = receipt.events.find(
        (event) => event.event === "CampaignCreated"
      );
      console.log(campaignCreatedEvent, "campaignCreatedEvent");
      const campaignId = campaignCreatedEvent.args.campaignId;

      // Contribute to the campaign using the captured campaign ID
      await (
        await fundraising
          .connect(addr1)
          .contribute(campaignId, { value: parseEther("2.0") })
      ).wait();

      // Check for withdrawal and event emission
      await expect(fundraising.connect(owner).withdrawFunds(campaignId))
        .to.emit(fundraising, "FundsWithdrawn")
        .withArgs(campaignId, parseEther("2.0"));
    });
  });

  // describe("Stopping a Campaign", function () {
  //   it("Should let organizer stop the campaign", async function () {
  //     await createAndGetCampaign(
  //       fundraising,
  //       owner,
  //       "2.0",
  //       "Sample IPFS Hash 4",
  //       filters
  //     );

  //     await expect(fundraising.connect(owner).stopCampaign(0))
  //       .to.emit(fundraising, "CampaignStopped")
  //       .withArgs(0);
  //     const campaign = await fundraising.campaigns(0);
  //     expect(campaign.isOpen).to.equal(false);
  //   });
  // });

  // describe("Errors", function () {
  //   it("Should fail if non-organizer tries to stop the campaign", async function () {
  //     await createAndGetCampaign(
  //       fundraising,
  //       owner,
  //       "2.0",
  //       "Sample IPFS Hash 5",
  //       filters
  //     );

  //     await expect(
  //       fundraising.connect(addr1).stopCampaign(0)
  //     ).to.be.revertedWith("Only the campaign organizer can stop the campaign");
  //   });
  // });
});
