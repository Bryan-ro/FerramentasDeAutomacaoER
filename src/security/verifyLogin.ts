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

const generateJwt = (payload: jsonWebtoken.payload ) => {
    if(process.env.JTW_SECRET) return sign(payload,  process.env.JTW_SECRET, { expiresIn: "90m", algorithm: "HS512" });
};

export const verifyJwt = (token: string) => {
    if(process.env.JTW_SECRET) return verify(token, process.env.JTW_SECRET);
};

const cryptPassword = (pass: string) => {
    if(process.env.AES_SECRET) return AES.encrypt(JSON.stringify(pass), process.env.AES_SECRET).toString();
};
