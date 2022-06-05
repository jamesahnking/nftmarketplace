// Type of traits available
export type Trait = "attack" | "health" | "speed"; 

// Descirption of trait and how much of the trait is posessed
export type NftAttribute = {
    trait_type: Trait;
    value: string;
}

// Each NFTs Meta Data packaged up along with traits and values 
export type NftMeta = {
    name: string;
    description: string;
    image: string; 
    attributes: NftAttribute[];
}