export async function pinDirectoryToIPFS(
  object: any,
  image: File | null | undefined,
): Promise<
  | {
      IpfsHash: string;
      PinSize: number;
      Timestamp: Date;
    }
  | undefined
> {
  try {
    const config = useRuntimeConfig();
    const IPFS_TOKEN = config.public.ipfs.TOKEN;
    if (!IPFS_TOKEN) throw new Error("IPFS_TOKEN is not defined");

    const folder = "json";
    const files = [new File([object], "content")];
    if (image) files.push(new File([image], "image"));

    const data = new FormData();

    Array.from(files).forEach((file) => {
      // If you are not using `fs` you might need to specify the folder path along with the filename
      data.append("file", file, `${folder}/${file.name}`);
    });

    const pinataMetadata = JSON.stringify({
      name: `${folder}`,
    });
    data.append("pinataMetadata", pinataMetadata);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${IPFS_TOKEN}`,
      },
      body: data,
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export async function getContentByCid(cid: string) {
  const content = await fetch(`https://ipfs.io/ipfs/${cid}/content`).then(
    (res) => res.json(),
  );
  const image = await fetch(`https://ipfs.io/ipfs/${cid}/image`).then(
    (res) => res.url,
  );
  return {
    ...content,
    image,
  };
}
