import { Request, Response, Router } from "express";
import { SbtBroadcaster } from "../services/SbtBroadcaster";
// import { RecordHistory } from "../services/RecordHistory";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { decryptPassword } from "../security/verifyLogin";
import sendMail from "../utils/sendMailSbt";

const auth = new AuthMiddleware();
const router = Router();

export class SbtBroadcasterController {
    public routes () {
        router.get("/get-broadcaster", auth.ifUserIsAuthenticated, this.getFilteredBroadcaster);
        // router.get("/get-history", auth.ifUserIsAuthenticated, this.getFilteredHistory);
        router.post("/send-links", auth.ifUserIsAuthenticated, this.sendLinks);
        router.post("/create-broadcaster", auth.ifUserIsAdmin, this.createBroadcaster);
        router.put("/update/:id", auth.ifUserIsAdmin, this.updateBroadcaster);

        return router;
    }

    private async getFilteredBroadcaster(req: Request, res: Response) {
        const { filter } = req.query;

        const broadcaster = await SbtBroadcaster.getBroadcasterFiltered(filter?.toString());

        return res.status(200).json({ broadcasters: broadcaster });
    }

    private async sendLinks (req: Request, res: Response) {
        const infos: emailFormat.emailProps = req.body;
        const { email, name, token } = req.user;

        try {
            if(!infos.mediaInfos[0].title || !infos.mediaInfos[0].clock || !infos.mediaInfos[0].duration || !infos.mediaInfos[0].link) return res.status(400).json({ error: "Preencha todos os campos para enviar o material." });
            if(infos.broadcasters.length === 0) return res.status(400).json({ error: "Nenhuma emissora selecionada." });

            // const history: history.history = {
            //     destinations: [],
            //     clock: [],
            //     user: name
            // };

            for(const i in infos.broadcasters) {
                const broadcaster = await SbtBroadcaster.getBroadcasterById(infos.broadcasters[i]);
                const pass = decryptPassword(token);

                if(broadcaster) {
                    const camelCaseName = name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

                    await sendMail(email, pass, camelCaseName, `${camelCaseName}<${email}>`, broadcaster.emails, infos.advertiser, broadcaster.broadcasterName, infos);

                    // history.destinations.push(broadcaster.broadcasterName);
                }
            }

            // infos.mediaInfos.forEach((media) => {
            //     history.clock.push(media.clock);
            // });

            // const recordHistory = new RecordHistory(
            //     history.destinations.join(","),
            //     history.clock.join(","),
            //     history.user
            // );

            // await recordHistory.RecordHistory();

            return res.status(200).json({ message: "E-mails enviados com sucesso.", status: 200 });

        } catch (error) {
            if((error as errors).message === "Preencha todos os campos para enviar os materiais aos destinos.") return res.status(400).json({ error: (error as errors).message, status: 400 });
            else return res.status(500).json({ error: "Erro desconhecido. Se persistir entre em contato com o Bryan.", status: 500 });
        }
    }

    private async createBroadcaster (req: Request, res: Response) {
        const { broadcasterName, city, state, codec, emails } = req.body;

        try {
            const broadcasters = new SbtBroadcaster(broadcasterName, city, state, codec, emails);
            await broadcasters.createBroadcaster();
            return res.status(201).json({ message: "Emissora cadastrada com sucesso.", broadcaster: broadcasterName, status: 201 });
        } catch (error) {
            if(!broadcasterName || !state || !codec || !emails) return res.status(400).json({ error: "Campo obrigatório não informado.", status: 400 });
            else if ((error as errors).code === "P2002") return res.status(409).json({ error: "Emissora já cadastrada anteriormente.", status: 409 });
            else if ((error as errors).message === "Invalid Fields") return res.status(400).json({ error: "Campo digitado incorretamente. Verifique se digitou uma cidade ou um estado valido. As cidades devem ser escritas com letra maiuscula e acentuação. Exemplo: 'São Paulo' e os estados precisam ser siglas. exemplo: 'SP'. Já o codec, precisa ser: 'mxf', 'mov' ou 'mp4'", status: 400 });
            else return res.status(500).json({ error: "erro desconhecido.", status: 500 });
        }

    }

    private async updateBroadcaster (req: Request, res: Response) {
        const id = req.params.id;
        const { broadcasterName, city, state, codec, emails } = req.body;

        try {
            const broadcaster = await SbtBroadcaster.getBroadcasterById(Number(id));

            const updateBroadcaster = new SbtBroadcaster(broadcasterName ?? broadcaster?.broadcasterName, city ?? broadcaster?.city, state ?? broadcaster?.state, codec ?? broadcaster?.codec, emails ?? broadcaster?.emails);

            await updateBroadcaster.updateBroadcaster(Number(id));

            return res.status(200).json({ message: "Emissora atualizada com sucesso." });
        } catch (error) {
            if(!id) return res.status(400).json({ error: "Id da emissora não informado." });

            if((error as errors).code === "P2025") return res.status(400).json({ error: "Emissora inexistente." });

            if((error as errors).message === "Invalid Fields") return res.status(400).json({ error: "Campo digitado incorretamente. Verifique se digitou uma cidade ou um estado valido. As cidades devem ser escritas com letra maiuscula e acentuação. Exemplo: 'São Paulo' e os estados precisam ser siglas. exemplo: 'SP'. Já o codec, precisa ser: 'mxf', 'mov' ou 'mp4'"});
        }


    }

    // private async getFilteredHistory (req: Request, res: Response) {
    //     const { filter } = req.query;

    //     const history = await RecordHistory.getDestinationsFiltered(filter?.toString());

    //     return res.status(200).json({ history: history });
    // }
}
