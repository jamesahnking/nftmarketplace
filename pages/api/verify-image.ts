import { v4 as uuidv4 } from "uuid";
import { FileReq } from "@_types/nft";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import { withSession, addressCheckMiddleware, pinataApiKey, pinataSecretApiKey } from "./utils";
import FormData from "form-data";
import axios from "axios";


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

            // Pin to IPFS  
            const buffer = Buffer.from(Object.values(bytes));
            const formData = new FormData();

            // Construct filename amd id 
            formData.append(
                "file",
                buffer, {
                    contentType,
                    filename: fileName + "-" + uuidv4()  
                }
            );

            const fileRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", 
            formData, {
                maxBodyLength: Infinity,
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
                    pinata_api_key: pinataApiKey,
                    pinata_secret_api_key: pinataSecretApiKey
                }
            });
            
            return res.status(200).send(fileRes.data);
        } else {
            return res.status(422).send({message:" Invalid endpoint"});
        }
    })
