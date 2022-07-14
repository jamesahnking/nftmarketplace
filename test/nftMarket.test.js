// Test intended for use with with Truffle
const { assert } = require("console");
const { Contract } = require("ethers");
const { idText } = require("typescript");

const NftMarket = artifacts.require("NftMarket");

Contract("NftMarket", accounts => {
    let _contract = null;

    before(async() => {
        _contract = await NftMarket.deployed();
        console.log(accounts);    
    })

    describe("Mint token", () => {
        it("Should resolve into true value", () => {
            let numberOfNfts = 12;
            assert(numberOfNfts == 12, "Value is NOT true");
        })
    })
}) 