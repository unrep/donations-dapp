import { client } from "./initiateClientIPFS";

export function uploadFile(object: any, image: File | null) {
  const dataToSend = [new File([object], "content")];
  if (image) dataToSend.push(new File([image], "image"));

  return (
    client
      ?.uploadDirectory(dataToSend)
      // return the CID of the uploaded file
      .then((res) => res.toString())
  );
}
