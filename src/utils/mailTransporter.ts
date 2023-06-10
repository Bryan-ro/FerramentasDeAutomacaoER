import { createTransport } from "nodemailer";


export default (email: string, pass: string) => createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: email,
        pass: pass
    },
    tls:{
        rejectUnauthorized: false
    }
});
