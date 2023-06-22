import cities from "../../citiesOfBrazil.json";
import states from "../../statesOfBrasil.json";

export class broadcastersValidations {
    public static city(city: string) {
        const test = cities.filter(name => name.Nome === city);

        if (test.length > 0) return true;
        else return false;
    }

    public static state(state: string) {
        const test = states.filter(uf => uf.Sigla === state);

        if (test.length > 0) return true;
        else return false;
    }

    public static codec(codec: string) {
        const validCodecs = ["mxf", "mov", "mp4"];
        const validate = validCodecs.includes(codec.toLowerCase());

        return validate;
    }
}
