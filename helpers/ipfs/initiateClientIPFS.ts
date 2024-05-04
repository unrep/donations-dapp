import { CarReader } from "@ipld/car";
import { importDAG } from "@ucanto/core/delegation";
import * as Signer from "@ucanto/principal/ed25519";
import * as Client from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import { Buffer } from "buffer";

// eslint-disable-next-line import/no-mutable-exports
export let client: Client.Client | null = null;
const runtimeConfig = useRuntimeConfig();

async function main() {
  // Load client with specific private key
  const principal = Signer.parse(runtimeConfig.public.KEY);
  const store = new StoreMemory();
  client = await Client.create({ principal, store });
  // Add proof that this agent has been delegated capabilities on the space
  const proof = await parseProof(runtimeConfig.public.PROOF);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());
}

async function parseProof(data: string) {
  const blocks: any[] = [];

  const reader = await CarReader.fromBytes(Buffer.from(data, "base64"));
  for await (const block of reader.blocks()) {
    blocks.push(block);
  }
  return importDAG(blocks);
}

main();
