export function createIPFSLink(cid: string) {
  return `https://${cid}.ipfs.w3s.link/content`;
}

export function getContentByCid(cid: string) {
  return fetch(createIPFSLink(cid))
    .then((res) => res.json())
    .catch(() => {
      return {};
    });
}
