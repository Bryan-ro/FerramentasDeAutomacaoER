import { Request, Response, Router } from "express";
import { RecordBroadcaster } from "../services/RecordBroadcaster";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { decryptPassword } from "../security/verifyLogin";
import sendMail from "../utils/sendMail";

const auth = new AuthMiddleware();
const router = Router();

export class RecordBroadcasterController {
    public routes () {
        router.post("/teste", auth.ifUserIsAuthenticated, this.sendLinks);
        router.post("/create-broadcaster", auth.ifUserIsAdmin, this.createBroadcaster);

        return router;
    }

    private async sendLinks (req: Request, res: Response) {
        const infos: emailFormtat.emailProps = req.body;
        const { email, name } = req.user;


        try {
            if(!infos.mediaInfos[0].advertiser || !infos.mediaInfos[0].title || !infos.mediaInfos[0].clock || !infos.mediaInfos[0].duration || !infos.mediaInfos[0].link) return res.status(400).json({ error: "Preencha todos os campos para enviar o material." });
            if(infos.broadcasters.length === 0) return res.status(400).json({ error: "Nenhuma emissora selecionada." });

            for(const i in infos.broadcasters) {
                const broadcaster = await RecordBroadcaster.getBroadcasterById(infos.broadcasters[i]);
                const pass = decryptPassword(email);

                if(broadcaster) sendMail(email, pass, name, `${name} <${email}>`, broadcaster.emails , infos.mediaInfos[0].advertiser, broadcaster.broadcasterName, infos.mediaInfos[0].title, infos.mediaInfos[0].clock, infos.mediaInfos[0].duration, infos.mediaInfos[0].link, infos.mediaInfos[1].title, infos.mediaInfos[2].clock, infos.mediaInfos[2].duration, infos.mediaInfos[2].link, infos.mediaInfos[1].title, infos.mediaInfos[2].clock, infos.mediaInfos[2].duration, infos.mediaInfos[2].link);
            }
        } catch (error) {
            if((error as errors).message === "Cannot read properties of null (reading 'salt')") return res.status(500).json({ error: "Erro ao enviar e-mails. Necessário refazer login." });
            else return console.log(error);
        }
    }

    private async createBroadcaster (req: Request, res: Response) {
        const { broadcasterName, city, state, codec, emails } = req.body;

        try {
            const broadcasters = new RecordBroadcaster(broadcasterName, state, city, codec, emails);
            await broadcasters.createBroadcaster();
            return res.status(201).json({ message: "Emissora cadastrada com sucesso.", broadcaster: broadcasterName, status: 201 });
        } catch (error) {
            if(!broadcasterName || !state || !codec || !emails) return res.status(400).json({ error: "Campo obrigatório não informado.", status: 400 });
            else if ((error as errors).code === "P2002") return res.status(409).json({ error: "Emissora já cadastrada anteriormente.", status: 409 });
            else return res.status(500).json({ error: "erro desconhecido.", status: 500 });
        }

    }
}
