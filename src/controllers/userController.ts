import { Request, Response, Router } from "express";
import { User } from "../services/User";
import { verifyEmail } from "../security/verifyLogin";
const router = Router();

export class UserController {
    public routes() {
        router.get("/getAllUsers", this.getAllUsers);
        router.post("/login", this.login);
        router.post("/createUser", this.createUser);

        return router;
    }

    private async getAllUsers(req: Request, res: Response):Promise<Response> {
        return res.status(200).json({ users: await User.getAllUsers() });
    }

    private async login (req: Request, res: Response) {
        const { email, pass } = req.body;

        if(!email || !pass) return res.status(400).json({ error: "Email ou senha não informados.", status: 400 });

        try {
            const user = await User.getUserByEmail(email);

            if (user) {
                const auth =  await verifyEmail(user.name, user.email, pass);

                if(auth) return res.status(200).json({ token: auth, status: 200 });

            } else {
                return res.status(401).json({ message: "Usuário ou senha inválido", status: 401 });
            }

        } catch (error) {
            if((error as nodemailerErrors).responseCode === 535) return res.status(401).json({ message: "Usuário ou senha inválido", status: 401 });
            else return res.status(500).json({ error: "Erro desconhecido.", status: 500 });
        }
    }

    private async createUser(req: Request, res: Response) {
        const { name, email } = req.body;

        try {
            const user = new User(name, email);

            await user.createUser();

            return res.status(201).json({ message: "Usuário criado com sucesso.", status: 201 });
        } catch (error) {
            if(!name || !email) return res.status(400).json({ error: "Email ou nome não informados", status: 400 });
            else return res.status(500).json({ error: "erro desconhecido.", status: 500 });
        }
    }
}
