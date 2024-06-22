import { Buffer } from "buffer";
import { CarReader } from "@ipld/car";
import { importDAG } from "@ucanto/core/delegation";
import * as Signer from "@ucanto/principal/ed25519";
import * as Client from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";

let client: Client.Client | null = null;

export function useWeb3Storage() {
  async function getClient() {
    if (!client) {
      const runtimeConfig = useRuntimeConfig();
      // Load client with specific private key
      const principal = Signer.parse(runtimeConfig.public.ipfs.KEY);
      const store = new StoreMemory();
      client = await Client.create({ principal, store });
      // Add proof that this agent has been delegated capabilities on the space
      const proof = await parseProof(runtimeConfig.public.ipfs.PROOF);
      const space = await client.addSpace(proof);
      await client.setCurrentSpace(space.did());
    }

    return client;
  }

  async function parseProof(data: string) {
    const blocks: any[] = [];
    const reader = await CarReader.fromBytes(Buffer.from(data, "base64"));
    for await (const block of reader.blocks()) {
      blocks.push(block);
    }
    return importDAG(blocks);
  }

  async function uploadFile(object: any, image: File | null | undefined) {
    if (!client) await getClient();
    const dataToSend = [new File([object], "content")];
    if (image) dataToSend.push(new File([image], "image"));

    return client
      ?.uploadDirectory(dataToSend)
      .then((res) => res.toString() as string);
  }

  async function getContentByCid(cid: string) {
    const content = await fetch(`${createIPFSLink(cid)}/content`).then((res) =>
      res.json(),
    );
    const image = await fetch(`${createIPFSLink(cid)}/image`).then(
      (res) => res.url,
    );
    return {
      ...content,
      image,
    };
  }

  function createIPFSLink(cid: string) {
    return `https://${cid}.ipfs.w3s.link`;
  }

  return {
    getClient,
    uploadFile,
    getContentByCid,
  };
}
