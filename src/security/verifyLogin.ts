import mailTransporter from "../utils/mailTransporter";
import { sign, verify } from "jsonwebtoken";
import { PutMemoryCache } from "../utils/serverCache";
import { AES } from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

export const verifyEmail = async (name: string, email: string, pass: string) => {
    const verification = await mailTransporter(email, pass).verify();

    if (verification) {
        const encryptedPass = cryptPassword(pass);
        if(encryptedPass) PutMemoryCache(email, encryptedPass);

        return generateJwt({ email, name });
    }
    else return verification;
};

interface payload {
    name: string;
    email: string;
}

const generateJwt = (payload: payload, ) => {
    if(process.env.JTW_SECRET) return sign(payload,  process.env.JTW_SECRET, { expiresIn: "5m", algorithm: "HS512" });
};

const cryptPassword = (pass: string) => {
    if(process.env.AES_SECRET) return AES.encrypt(JSON.stringify(pass), process.env.AES_SECRET).toString();
};
