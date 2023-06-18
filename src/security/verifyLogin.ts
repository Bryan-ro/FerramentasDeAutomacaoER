import mailTransporter from "../utils/mailTransporter";
import { sign, verify } from "jsonwebtoken";
import { PutMemoryCache, getMemoryCache } from "../utils/serverCache";
import CryptoJS from "crypto-js";
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
    if(process.env.AES_SECRET) return CryptoJS.AES.encrypt(JSON.stringify(pass), process.env.AES_SECRET).toString();
};

export const decryptPassword = (email: string) => {
    if (process.env.AES_SECRET) {
        const hash = getMemoryCache(email);

        const bytes  = CryptoJS.AES.decrypt(hash, process.env.AES_SECRET);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
};
