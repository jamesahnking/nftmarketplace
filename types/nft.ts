// Type of traits available
export type Trait = "cuteness" | "attack" | "bite" | "hunger" | "jealousy" | "thirst"; 

// Attribute Export
export type NftAttribute = {
    trait_type: Trait;
    value: string;
}

// Each NFTs Metadata Export
export type NftMeta = {
    name: string;
    description: string;
    image: string; 
    attributes: NftAttribute[];
}

// NFT Object Export
export type NftCore = {
    tokenId: number;
    price: number;
    creator: string;
    isListed: boolean
}

//Core and Meta Export
export type Nft = {
    meta: NftMeta 
} & NftCore


//Byte Array Export
export type FileReq = {
    bytes: Uint8Array;
    contentType: string;
    fileName: string;
  }