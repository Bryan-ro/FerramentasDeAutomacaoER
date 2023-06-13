import { Request, Response, Router } from "express";
import { User } from "../services/User";
import { verifyEmail } from "../security/verifyLogin";
import { AuthMiddleware } from "../middlewares/authMiddleware";
const router = Router();
const auth = new AuthMiddleware();

export class UserController {
    public routes() {
        router.get("/getAllUsers", auth.ifUserIsAdmin, this.getAllUsers);
        router.post("/login", this.login);
        router.post("/createUser", auth.ifUserIsAdmin, this.createUser);

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

                if(auth) return res.status(200).json({ token: auth, user: user.email, name: user.name , redirected: "Home page", status: 200 });

            } else {
                return res.status(401).json({ message: "Usuário ou senha inválido", status: 401 });
            }

        } catch (error) {
            if((error as errors).responseCode === 535) return res.status(401).json({ message: "Usuário ou senha inválido", status: 401 });
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
            else if((error as errors).message === "invalid fields") return res.status(400).json({ error: "Os campos nome ou email foram preenchidos incorrectamente. \n Nome não pode conter caracteres especiais ou numeros,. Verifique se está usando o e-mail corporativo para criar o cadastro.", status: 400 });
            else if ((error as errors).code === "P2002") return res.status(409).json({ error: "Usuário já existente.", status: 409 });
            else return res.status(500).json({ error: "erro desconhecido.", status: 500 });
        }
    }
}
