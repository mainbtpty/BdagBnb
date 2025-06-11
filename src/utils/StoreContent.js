import Moralis from 'moralis';

export const StoreContent = async (files) => {
  console.log("Uploading files to IPFS with Moralis....");
  
  try {
    const file = new Moralis.File(files.name, files);
    await file.saveIPFS();
    const ipfsUrl = file.ipfs();
    console.log("Stored file with IPFS URL:", ipfsUrl);
    return ipfsUrl;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};