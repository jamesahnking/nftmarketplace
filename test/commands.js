// run 
// node commands.js


// Deploy Contract
const instance = await NftMarket.deployed();

// Fuurzlz 1
instance.mintToken("https://gateway.pinata.cloud/ipfs/QmaitkDtdBZToPrMhMRTivDRNQnLCtgmUzrowTzuHtu6qv","500000000000000000", {value: "25000000000000000",from: accounts[0]});
// Fuurzlz 2
instance.mintToken("https://gateway.pinata.cloud/ipfs/QmZcRwcmuwTCsphtBp1NXLgVXME3Eo2iS29H3ayZ7YPK7x","300000000000000000", {value: "25000000000000000",from: accounts[0]});