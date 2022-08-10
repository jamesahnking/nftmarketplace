import { withIronSessionApiRoute } from "iron-session/next";
import contract from "../../public/contracts/NftMarket.json";

const NETWORKS = {
    "5777" : "Ganache"
}

type NETWORK = typeof NETWORKS;

const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

export const contractAddress = contract["networks"][targetNetwork]["address"];

// set session // save to cookies to browser
export function withSession(handler: any) {
    return withIronSessionApiRoute (handler, {
        password: process.env.SECRET_COOKIE_PASSWORD as string, 
        cookieName: "nft-auth-session",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production" ? true : false
        }
    })
}