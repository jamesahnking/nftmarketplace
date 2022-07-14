// Test intended for use with with Truffle
const { assert } = require("console");

const NftMarket = artifacts.require("NftMarket");

contract("NftMarket", accounts => {
    let _contract = null;

    before(async() => {
        _contract = await NftMarket.deployed();
        console.log(accounts);    
    })

    describe("Mint token", () => {
        it("Should resolve into true value", () => {
            assert(true, "Value is NOT true");
        })
    })
}) 