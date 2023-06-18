import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../security/verifyLogin";
import { User } from "../services/User";
import { Payload } from "@prisma/client/runtime";

export class AuthMiddleware {
    public ifUserIsAuthenticated(req: Request, res: Response, next: NextFunction) {
        const { token } = req.headers;

        try {

            if(typeof token === "string") {
                const auth = verifyJwt(token);

                if(auth) {
                    req.user = {
                        email: (auth as jsonWebtoken.payload).email,
                        name: (auth as jsonWebtoken.payload).name
                    };

                    return next();
                }
            } else return res.status(401).json({ error: "A autentificação não foi fornecida.", redirected: "tela de login", status: 401 });

        } catch (error) {
            return res.status(401).json({ error: "Usuário não está logado.", redirected: "tela de login" , status: 401 });
        }
    }

    public async ifUserIsAdmin(req: Request, res: Response, next: NextFunction) {
        const { token } = req.headers;

        try {

            if(typeof token === "string") {
                const auth = verifyJwt(token);

                const user = await User.getUserByEmail((auth as jsonWebtoken.payload).email);

                if(user?.admin) return next();
                else if(!user?.admin) return res.status(401).json({ error: "Você não tem permissão para acessar está área.", redirected: "home page", status: 401 });
            } else return res.status(401).json({ error: "A autentificação não foi fornecida.", redirected: "tela de login", status: 401 });

        } catch (error) {
            return res.status(401).json({ error: "Usuário não está logado.", redirected: "tela de login" , status: 401 });
        }


    }
}
