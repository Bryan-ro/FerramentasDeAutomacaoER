declare namespace Express {
    interface Request {
        user: {
            email: string;
            name: string;
            token: string;
        }
    }
}
