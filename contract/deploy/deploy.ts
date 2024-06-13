import { deployContract } from "./utils";

export default async function () {
  const contractArtifactName = "Fundraising";
  await deployContract(contractArtifactName);
}
