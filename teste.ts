import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transport = createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: "bryan.rocha8ballpool@gmail.com",
        pass: "Inicialacbb06241234"
    },
    tls:{
        rejectUnauthorized: false
    }
});


transport.verify().then(() => {
    console.log(true);
}).catch(err => {
    console.log(false);
});
