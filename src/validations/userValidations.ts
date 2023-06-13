export class UserValidations {
    public static emailValidation(email: string) {
        const emailRegex = /@extremereach\.com$/;
        return emailRegex.test(email);
    }

    public static nameValidation(name: string) {
        const nomeRegex = /^[a-zA-Z\s]+$/;
        return nomeRegex.test(name);
    }
}
