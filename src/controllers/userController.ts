import { Request, Response, Router } from "express";
import { User } from "../services/User";
import { verifyEmail } from "../security/verifyLogin";
import { AuthMiddleware } from "../middlewares/authMiddleware";
const router = Router();
const auth = new AuthMiddleware();

export class UserController {
    public routes() {
        router.get("/get-users", auth.ifUserIsAdmin, this.getAllUsers);
        router.get("/get-user", auth.ifUserIsAdmin, this.getUserByEmail);
        router.post("/login", this.login);
        router.post("/create-user", auth.ifUserIsAdmin, this.createUser);
        router.post("/verify-login", auth.ifUserIsAuthenticated, this.verifyLogin);
        router.delete("/delete-user/:id", auth.ifUserIsAdmin, this.deleteUser);

        return router;
    }

    private async getAllUsers(req: Request, res: Response):Promise<Response> {
        return res.status(200).json({ users: await User.getAllUsers() });
    }

    private async getUserByEmail(req: Request, res: Response) {
        const { email } =  req.query;

        if(email) {
            const user = await User.getUserByEmail(email.toString());

            return res.status(200).json({ user: user ?? "O úsuario não existe." });
        } else return res.status(400).json({ error: "E-mail não informado." });
    }

    private async login (req: Request, res: Response) {
        const { email, pass } = req.body;

        if(!email || !pass) return res.status(400).json({ error: "Email ou senha não informados.", status: 400 });

        try {
            const user = await User.getUserByEmail(email);

            if (user) {
                const auth =  await verifyEmail(user.name, user.email, pass);

                if(auth) return res.status(200).json({ token: auth, user: user.email, name: user.name, admin: user.admin, redirected: "Home page", status: 200 });

            } else {
                return res.status(401).json({ message: "Usuário ou senha inválido", status: 401 });
            }

        } catch (error) {
            console.log(error);
            if((error as errors).responseCode === 535) return res.status(401).json({ message: "Usuário ou senha inválido", status: 401 });
            else return res.status(500).json({ error: "Erro desconhecido.", status: 500 });
        }
    }

    private async verifyLogin(req: Request, res: Response) {
        return res.status(200).json({ redirected: "Home page", status: 200 });
    }

    private async createUser(req: Request, res: Response) {
        const { name, email, admin } = req.body;

        try {
            const user = new User(name, email, admin);

            await user.createUser();

            return res.status(201).json({ message: "Usuário criado com sucesso.", status: 201 });
        } catch (error) {
            if(!name || !email) return res.status(400).json({ error: "Email ou nome não informados", status: 400 });
            else if((error as errors).message === "invalid fields") return res.status(400).json({ error: "Os campos nome ou email foram preenchidos incorrectamente. \n Nome não pode conter caracteres especiais ou numeros,. Verifique se está usando o e-mail corporativo para criar o cadastro.", status: 400 });
            else if ((error as errors).code === "P2002") return res.status(409).json({ error: "Usuário já existente.", status: 409 });
            else return res.status(500).json({ error: "erro desconhecido.", status: 500 });
        }
    }

    private async deleteUser(req: Request, res: Response) {
        const id = req.params.id;
        const { email } = req.user;
        try {
            if(Number.isNaN(Number(id))) {
                return res.status(400).json({ error: "Id inválido", status: 400 });
            }

            const userWillBeDeleted = await User.getUserById(Number(id));

            if(email === userWillBeDeleted?.email) return res.status(403).json({ error: "Você não pode deletar seu próprio usuário.", status: 403 });
            if(userWillBeDeleted?.email === "bryan.rocha@extremereach.com") return res.status(403).json({ error: "Você não tem permissão para deletar o usuário 'Bryan Rocha'", status: 401 });
            else {
                await User.deleteUser(Number(id));
                return res.status(200).json({ message: "Usuário deletado", status: 200 });
            }

        } catch (error) {
            if((error as errors).code === "P2025") return res.status(400).json({ error: "O usuário não existe ou já foi deletado."});
            else return res.status(500).json({ error: "Erro desconhecido. Se persistir, entre em contato com o Bryan." });
        }

    }
}
