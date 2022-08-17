import { FileReq } from "@_types/nft";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import {  addressCheckMiddleware,withSession } from "./utils";

export default withSession (async(
    req: NextApiRequest & {session: Session}, 
    res: NextApiResponse
    ) => {
        if (req.method === "POST") {
         const {
            bytes,
            fileName,
            contentType,
         } = req.body as FileReq;
           // Verify / Check if image bytes have been created
           if (!bytes || !fileName|| !contentType) {
            return res.status(422).send({message: "Image Data are missing!"});
            }
            await addressCheckMiddleware(req, res);
            
            console.log(fileName);
            console.log(contentType);
            console.log(bytes);

            return res.status(200).send({message: "Image has been created!"});
        } else {
            return res.status(422).send({message:" Invalid endpoint"});
        }

    })
