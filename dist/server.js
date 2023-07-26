"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// ../../../../../node_modules/dotenv/package.json
var require_package = __commonJS({
  "../../../../../node_modules/dotenv/package.json"(exports, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.0.3",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          require: "./lib/main.js",
          types: "./lib/main.d.ts",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^17.0.9",
        decache: "^4.6.1",
        dtslint: "^3.7.0",
        sinon: "^12.0.1",
        standard: "^16.0.4",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.3.2",
        tap: "^15.1.6",
        tar: "^6.1.11",
        typescript: "^4.5.4"
      },
      engines: {
        node: ">=12"
      }
    };
  }
});

// ../../../../../node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "../../../../../node_modules/dotenv/lib/main.js"(exports, module2) {
    "use strict";
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _log(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function config(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (options) {
        if (options.path != null) {
          dotenvPath = _resolveHome(options.path);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
      }
      try {
        const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }));
        Object.keys(parsed).forEach(function(key) {
          if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            process.env[key] = parsed[key];
          } else {
            if (override === true) {
              process.env[key] = parsed[key];
            }
            if (debug) {
              if (override === true) {
                _log(`"${key}" is already defined in \`process.env\` and WAS overwritten`);
              } else {
                _log(`"${key}" is already defined in \`process.env\` and was NOT overwritten`);
              }
            }
          }
        });
        return { parsed };
      } catch (e) {
        if (debug) {
          _log(`Failed to load ${dotenvPath} ${e.message}`);
        }
        return { error: e };
      }
    }
    var DotenvModule = {
      config,
      parse
    };
    module2.exports.config = DotenvModule.config;
    module2.exports.parse = DotenvModule.parse;
    module2.exports = DotenvModule;
  }
});

// src/app.ts
var import_express4 = __toESM(require("express"));

// src/controllers/userController.ts
var import_express = require("express");

// src/services/User.ts
var import_client = require("@prisma/client");

// src/validations/userValidations.ts
var UserValidations = class {
  static emailValidation(email) {
    const emailRegex = /@extremereach\.com$/;
    return emailRegex.test(email);
  }
  static nameValidation(name) {
    const nomeRegex = /^[a-zA-Z\s]+$/;
    return nomeRegex.test(name);
  }
};

// src/services/User.ts
var prisma = new import_client.PrismaClient();
var User = class {
  constructor(name, email, admin = false) {
    this.name = name;
    this.email = email;
    this.admin = admin;
  }
  static getAllUsers() {
    return __async(this, null, function* () {
      return yield prisma.user.findMany();
    });
  }
  static getUserByEmail(email) {
    return __async(this, null, function* () {
      return yield prisma.user.findUnique({
        where: {
          email
        }
      });
    });
  }
  static getUserById(id) {
    return __async(this, null, function* () {
      const user = yield prisma.user.findUnique({
        where: {
          id
        }
      });
      return user;
    });
  }
  createUser() {
    return __async(this, null, function* () {
      const nameValidation = UserValidations.nameValidation(this.name);
      const emailValidation = UserValidations.emailValidation(this.email);
      if (nameValidation && emailValidation)
        yield prisma.user.create({
          data: {
            name: this.name.toUpperCase(),
            email: this.email.toLowerCase(),
            admin: this.admin
          }
        });
      else
        throw new Error("invalid fields");
    });
  }
  static deleteUser(id) {
    return __async(this, null, function* () {
      yield prisma.user.delete({
        where: {
          id
        }
      });
    });
  }
};

// src/utils/mailTransporter.ts
var import_nodemailer = require("nodemailer");
var mailTransporter_default = (email, pass) => (0, import_nodemailer.createTransport)({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: email,
    pass
  },
  tls: {
    rejectUnauthorized: false
  }
});

// src/security/verifyLogin.ts
var import_jsonwebtoken = require("jsonwebtoken");
var import_crypto_js = __toESM(require("crypto-js"));
var import_dotenv = __toESM(require_main());
import_dotenv.default.config();
var verifyEmail = (name, email, pass) => __async(void 0, null, function* () {
  const verification = yield mailTransporter_default(email, pass).verify();
  if (verification) {
    const encryptedPass = cryptPassword(pass);
    if (encryptedPass)
      return generateJwt({ email, name, token: encryptedPass });
  } else
    return verification;
});
var generateJwt = (payload) => {
  if (process.env.JTW_SECRET)
    return (0, import_jsonwebtoken.sign)(payload, process.env.JTW_SECRET, { expiresIn: "90m", algorithm: "HS512" });
};
var verifyJwt = (token) => {
  if (process.env.JTW_SECRET)
    return (0, import_jsonwebtoken.verify)(token, process.env.JTW_SECRET);
};
var cryptPassword = (pass) => {
  if (process.env.AES_SECRET)
    return import_crypto_js.default.AES.encrypt(JSON.stringify(pass), process.env.AES_SECRET).toString();
};
var decryptPassword = (hash) => {
  if (process.env.AES_SECRET) {
    const bytes = import_crypto_js.default.AES.decrypt(hash, process.env.AES_SECRET);
    return JSON.parse(bytes.toString(import_crypto_js.default.enc.Utf8));
  }
};

// src/middlewares/authMiddleware.ts
var AuthMiddleware = class {
  ifUserIsAuthenticated(req, res, next) {
    const { token } = req.headers;
    try {
      if (typeof token === "string") {
        const auth3 = verifyJwt(token);
        if (auth3) {
          req.user = {
            email: auth3.email,
            name: auth3.name,
            token: auth3.token
          };
          return next();
        }
      } else
        return res.status(401).json({ error: "A autentifica\xE7\xE3o n\xE3o foi fornecida.", redirected: "tela de login", status: 401 });
    } catch (error) {
      return res.status(401).json({ error: "Usu\xE1rio n\xE3o est\xE1 logado.", redirected: "tela de login", status: 401 });
    }
  }
  ifUserIsAdmin(req, res, next) {
    return __async(this, null, function* () {
      const { token } = req.headers;
      try {
        if (typeof token === "string") {
          const auth3 = verifyJwt(token);
          const user = yield User.getUserByEmail(auth3.email);
          if (user == null ? void 0 : user.admin) {
            req.user = {
              email: auth3.email,
              name: auth3.name,
              token: auth3.token
            };
            return next();
          } else if (!(user == null ? void 0 : user.admin))
            return res.status(401).json({ error: "Voc\xEA n\xE3o tem permiss\xE3o para acessar est\xE1 \xE1rea.", redirected: "home page", status: 401 });
        } else
          return res.status(401).json({ error: "A autentifica\xE7\xE3o n\xE3o foi fornecida.", redirected: "tela de login", status: 401 });
      } catch (error) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o est\xE1 logado.", redirected: "tela de login", status: 401 });
      }
    });
  }
};

// src/controllers/userController.ts
var router = (0, import_express.Router)();
var auth = new AuthMiddleware();
var UserController = class {
  routes() {
    router.get("/get-users", auth.ifUserIsAdmin, this.getAllUsers);
    router.get("/get-user", auth.ifUserIsAdmin, this.getUserByEmail);
    router.post("/login", this.login);
    router.post("/create-user", auth.ifUserIsAdmin, this.createUser);
    router.post("/verify-login", auth.ifUserIsAuthenticated, this.verifyLogin);
    router.delete("/delete-user/:id", auth.ifUserIsAdmin, this.deleteUser);
    return router;
  }
  getAllUsers(req, res) {
    return __async(this, null, function* () {
      return res.status(200).json({ users: yield User.getAllUsers() });
    });
  }
  getUserByEmail(req, res) {
    return __async(this, null, function* () {
      const { email } = req.query;
      if (email) {
        const user = yield User.getUserByEmail(email.toString());
        return res.status(200).json({ user: user != null ? user : "O \xFAsuario n\xE3o existe." });
      } else
        return res.status(400).json({ error: "E-mail n\xE3o informado." });
    });
  }
  login(req, res) {
    return __async(this, null, function* () {
      const { email, pass } = req.body;
      if (!email || !pass)
        return res.status(400).json({ error: "Email ou senha n\xE3o informados.", status: 400 });
      try {
        const user = yield User.getUserByEmail(email);
        if (user) {
          const auth3 = yield verifyEmail(user.name, user.email, pass);
          if (auth3)
            return res.status(200).json({ token: auth3, user: user.email, name: user.name, admin: user.admin, redirected: "Home page", status: 200 });
        } else {
          return res.status(401).json({ message: "Usu\xE1rio ou senha inv\xE1lido", status: 401 });
        }
      } catch (error) {
        console.log(error);
        if (error.responseCode === 535)
          return res.status(401).json({ message: "Usu\xE1rio ou senha inv\xE1lido", status: 401 });
        else
          return res.status(500).json({ error: "Erro desconhecido.", status: 500 });
      }
    });
  }
  verifyLogin(req, res) {
    return __async(this, null, function* () {
      return res.status(200).json({ redirected: "Home page", status: 200 });
    });
  }
  createUser(req, res) {
    return __async(this, null, function* () {
      const { name, email, admin } = req.body;
      try {
        const user = new User(name, email, admin);
        yield user.createUser();
        return res.status(201).json({ message: "Usu\xE1rio criado com sucesso.", status: 201 });
      } catch (error) {
        if (!name || !email)
          return res.status(400).json({ error: "Email ou nome n\xE3o informados", status: 400 });
        else if (error.message === "invalid fields")
          return res.status(400).json({ error: "Os campos nome ou email foram preenchidos incorrectamente. \n Nome n\xE3o pode conter caracteres especiais ou numeros,. Verifique se est\xE1 usando o e-mail corporativo para criar o cadastro.", status: 400 });
        else if (error.code === "P2002")
          return res.status(409).json({ error: "Usu\xE1rio j\xE1 existente.", status: 409 });
        else
          return res.status(500).json({ error: "erro desconhecido.", status: 500 });
      }
    });
  }
  deleteUser(req, res) {
    return __async(this, null, function* () {
      const id = req.params.id;
      const { email } = req.user;
      try {
        if (Number.isNaN(Number(id))) {
          return res.status(400).json({ error: "Id inv\xE1lido", status: 400 });
        }
        const userWillBeDeleted = yield User.getUserById(Number(id));
        if (email === (userWillBeDeleted == null ? void 0 : userWillBeDeleted.email))
          return res.status(403).json({ error: "Voc\xEA n\xE3o pode deletar seu pr\xF3prio usu\xE1rio.", status: 403 });
        if ((userWillBeDeleted == null ? void 0 : userWillBeDeleted.email) === "bryan.rocha@extremereach.com")
          return res.status(403).json({ error: "Voc\xEA n\xE3o tem permiss\xE3o para deletar o usu\xE1rio 'Bryan Rocha'", status: 401 });
        else {
          yield User.deleteUser(Number(id));
          return res.status(200).json({ message: "Usu\xE1rio deletado", status: 200 });
        }
      } catch (error) {
        if (error.code === "P2025")
          return res.status(400).json({ error: "O usu\xE1rio n\xE3o existe ou j\xE1 foi deletado." });
        else
          return res.status(500).json({ error: "Erro desconhecido. Se persistir, entre em contato com o Bryan." });
      }
    });
  }
};

// src/controllers/recordBroadcasterController.ts
var import_express2 = require("express");

// src/services/RecordBroadcaster.ts
var import_client2 = require("@prisma/client");

// citiesOfBrazil.json
var citiesOfBrazil_default = [
  {
    ID: "1",
    Nome: "Afonso Cl\xE1udio",
    Estado: "8"
  },
  {
    ID: "2",
    Nome: "\xC1gua Doce do Norte",
    Estado: "8"
  },
  {
    ID: "3",
    Nome: "\xC1guia Branca",
    Estado: "8"
  },
  {
    ID: "4",
    Nome: "Alegre",
    Estado: "8"
  },
  {
    ID: "5",
    Nome: "Alfredo Chaves",
    Estado: "8"
  },
  {
    ID: "6",
    Nome: "Alto Rio Novo",
    Estado: "8"
  },
  {
    ID: "7",
    Nome: "Anchieta",
    Estado: "8"
  },
  {
    ID: "8",
    Nome: "Apiac\xE1",
    Estado: "8"
  },
  {
    ID: "9",
    Nome: "Aracruz",
    Estado: "8"
  },
  {
    ID: "10",
    Nome: "Atilio Vivacqua",
    Estado: "8"
  },
  {
    ID: "11",
    Nome: "Baixo Guandu",
    Estado: "8"
  },
  {
    ID: "12",
    Nome: "Barra de S\xE3o Francisco",
    Estado: "8"
  },
  {
    ID: "13",
    Nome: "Boa Esperan\xE7a",
    Estado: "8"
  },
  {
    ID: "14",
    Nome: "Bom Jesus do Norte",
    Estado: "8"
  },
  {
    ID: "15",
    Nome: "Brejetuba",
    Estado: "8"
  },
  {
    ID: "16",
    Nome: "Cachoeiro de Itapemirim",
    Estado: "8"
  },
  {
    ID: "17",
    Nome: "Cariacica",
    Estado: "8"
  },
  {
    ID: "18",
    Nome: "Castelo",
    Estado: "8"
  },
  {
    ID: "19",
    Nome: "Colatina",
    Estado: "8"
  },
  {
    ID: "20",
    Nome: "Concei\xE7\xE3o da Barra",
    Estado: "8"
  },
  {
    ID: "21",
    Nome: "Concei\xE7\xE3o do Castelo",
    Estado: "8"
  },
  {
    ID: "22",
    Nome: "Divino de S\xE3o Louren\xE7o",
    Estado: "8"
  },
  {
    ID: "23",
    Nome: "Domingos Martins",
    Estado: "8"
  },
  {
    ID: "24",
    Nome: "Dores do Rio Preto",
    Estado: "8"
  },
  {
    ID: "25",
    Nome: "Ecoporanga",
    Estado: "8"
  },
  {
    ID: "26",
    Nome: "Fund\xE3o",
    Estado: "8"
  },
  {
    ID: "27",
    Nome: "Governador Lindenberg",
    Estado: "8"
  },
  {
    ID: "28",
    Nome: "Gua\xE7u\xED",
    Estado: "8"
  },
  {
    ID: "29",
    Nome: "Guarapari",
    Estado: "8"
  },
  {
    ID: "30",
    Nome: "Ibatiba",
    Estado: "8"
  },
  {
    ID: "31",
    Nome: "Ibira\xE7u",
    Estado: "8"
  },
  {
    ID: "32",
    Nome: "Ibitirama",
    Estado: "8"
  },
  {
    ID: "33",
    Nome: "Iconha",
    Estado: "8"
  },
  {
    ID: "34",
    Nome: "Irupi",
    Estado: "8"
  },
  {
    ID: "35",
    Nome: "Itagua\xE7u",
    Estado: "8"
  },
  {
    ID: "36",
    Nome: "Itapemirim",
    Estado: "8"
  },
  {
    ID: "37",
    Nome: "Itarana",
    Estado: "8"
  },
  {
    ID: "38",
    Nome: "I\xFAna",
    Estado: "8"
  },
  {
    ID: "39",
    Nome: "Jaguar\xE9",
    Estado: "8"
  },
  {
    ID: "40",
    Nome: "Jer\xF4nimo Monteiro",
    Estado: "8"
  },
  {
    ID: "41",
    Nome: "Jo\xE3o Neiva",
    Estado: "8"
  },
  {
    ID: "42",
    Nome: "Laranja da Terra",
    Estado: "8"
  },
  {
    ID: "43",
    Nome: "Linhares",
    Estado: "8"
  },
  {
    ID: "44",
    Nome: "Manten\xF3polis",
    Estado: "8"
  },
  {
    ID: "45",
    Nome: "Marata\xEDzes",
    Estado: "8"
  },
  {
    ID: "46",
    Nome: "Marechal Floriano",
    Estado: "8"
  },
  {
    ID: "47",
    Nome: "Maril\xE2ndia",
    Estado: "8"
  },
  {
    ID: "48",
    Nome: "Mimoso do Sul",
    Estado: "8"
  },
  {
    ID: "49",
    Nome: "Montanha",
    Estado: "8"
  },
  {
    ID: "50",
    Nome: "Mucurici",
    Estado: "8"
  },
  {
    ID: "51",
    Nome: "Muniz Freire",
    Estado: "8"
  },
  {
    ID: "52",
    Nome: "Muqui",
    Estado: "8"
  },
  {
    ID: "53",
    Nome: "Nova Ven\xE9cia",
    Estado: "8"
  },
  {
    ID: "54",
    Nome: "Pancas",
    Estado: "8"
  },
  {
    ID: "55",
    Nome: "Pedro Can\xE1rio",
    Estado: "8"
  },
  {
    ID: "56",
    Nome: "Pinheiros",
    Estado: "8"
  },
  {
    ID: "57",
    Nome: "Pi\xFAma",
    Estado: "8"
  },
  {
    ID: "58",
    Nome: "Ponto Belo",
    Estado: "8"
  },
  {
    ID: "59",
    Nome: "Presidente Kennedy",
    Estado: "8"
  },
  {
    ID: "60",
    Nome: "Rio Bananal",
    Estado: "8"
  },
  {
    ID: "61",
    Nome: "Rio Novo do Sul",
    Estado: "8"
  },
  {
    ID: "62",
    Nome: "Santa Leopoldina",
    Estado: "8"
  },
  {
    ID: "63",
    Nome: "Santa Maria de Jetib\xE1",
    Estado: "8"
  },
  {
    ID: "64",
    Nome: "Santa Teresa",
    Estado: "8"
  },
  {
    ID: "65",
    Nome: "S\xE3o Domingos do Norte",
    Estado: "8"
  },
  {
    ID: "66",
    Nome: "S\xE3o Gabriel da Palha",
    Estado: "8"
  },
  {
    ID: "67",
    Nome: "S\xE3o Jos\xE9 do Cal\xE7ado",
    Estado: "8"
  },
  {
    ID: "68",
    Nome: "S\xE3o Mateus",
    Estado: "8"
  },
  {
    ID: "69",
    Nome: "S\xE3o Roque do Cana\xE3",
    Estado: "8"
  },
  {
    ID: "70",
    Nome: "Serra",
    Estado: "8"
  },
  {
    ID: "71",
    Nome: "Sooretama",
    Estado: "8"
  },
  {
    ID: "72",
    Nome: "Vargem Alta",
    Estado: "8"
  },
  {
    ID: "73",
    Nome: "Venda Nova do Imigrante",
    Estado: "8"
  },
  {
    ID: "74",
    Nome: "Viana",
    Estado: "8"
  },
  {
    ID: "75",
    Nome: "Vila Pav\xE3o",
    Estado: "8"
  },
  {
    ID: "76",
    Nome: "Vila Val\xE9rio",
    Estado: "8"
  },
  {
    ID: "77",
    Nome: "Vila Velha",
    Estado: "8"
  },
  {
    ID: "78",
    Nome: "Vit\xF3ria",
    Estado: "8"
  },
  {
    ID: "79",
    Nome: "Acrel\xE2ndia",
    Estado: "1"
  },
  {
    ID: "80",
    Nome: "Assis Brasil",
    Estado: "1"
  },
  {
    ID: "81",
    Nome: "Brasil\xE9ia",
    Estado: "1"
  },
  {
    ID: "82",
    Nome: "Bujari",
    Estado: "1"
  },
  {
    ID: "83",
    Nome: "Capixaba",
    Estado: "1"
  },
  {
    ID: "84",
    Nome: "Cruzeiro do Sul",
    Estado: "1"
  },
  {
    ID: "85",
    Nome: "Epitaciol\xE2ndia",
    Estado: "1"
  },
  {
    ID: "86",
    Nome: "Feij\xF3",
    Estado: "1"
  },
  {
    ID: "87",
    Nome: "Jord\xE3o",
    Estado: "1"
  },
  {
    ID: "88",
    Nome: "M\xE2ncio Lima",
    Estado: "1"
  },
  {
    ID: "89",
    Nome: "Manoel Urbano",
    Estado: "1"
  },
  {
    ID: "90",
    Nome: "Marechal Thaumaturgo",
    Estado: "1"
  },
  {
    ID: "91",
    Nome: "Pl\xE1cido de Castro",
    Estado: "1"
  },
  {
    ID: "92",
    Nome: "Porto Acre",
    Estado: "1"
  },
  {
    ID: "93",
    Nome: "Porto Walter",
    Estado: "1"
  },
  {
    ID: "94",
    Nome: "Rio Branco",
    Estado: "1"
  },
  {
    ID: "95",
    Nome: "Rodrigues Alves",
    Estado: "1"
  },
  {
    ID: "96",
    Nome: "Santa Rosa do Purus",
    Estado: "1"
  },
  {
    ID: "97",
    Nome: "Sena Madureira",
    Estado: "1"
  },
  {
    ID: "98",
    Nome: "Senador Guiomard",
    Estado: "1"
  },
  {
    ID: "99",
    Nome: "Tarauac\xE1",
    Estado: "1"
  },
  {
    ID: "100",
    Nome: "Xapuri",
    Estado: "1"
  },
  {
    ID: "101",
    Nome: "\xC1gua Branca",
    Estado: "2"
  },
  {
    ID: "102",
    Nome: "Anadia",
    Estado: "2"
  },
  {
    ID: "103",
    Nome: "Arapiraca",
    Estado: "2"
  },
  {
    ID: "104",
    Nome: "Atalaia",
    Estado: "2"
  },
  {
    ID: "105",
    Nome: "Barra de Santo Ant\xF4nio",
    Estado: "2"
  },
  {
    ID: "106",
    Nome: "Barra de S\xE3o Miguel",
    Estado: "2"
  },
  {
    ID: "107",
    Nome: "Batalha",
    Estado: "2"
  },
  {
    ID: "108",
    Nome: "Bel\xE9m",
    Estado: "2"
  },
  {
    ID: "109",
    Nome: "Belo Monte",
    Estado: "2"
  },
  {
    ID: "110",
    Nome: "Boca da Mata",
    Estado: "2"
  },
  {
    ID: "111",
    Nome: "Branquinha",
    Estado: "2"
  },
  {
    ID: "112",
    Nome: "Cacimbinhas",
    Estado: "2"
  },
  {
    ID: "113",
    Nome: "Cajueiro",
    Estado: "2"
  },
  {
    ID: "114",
    Nome: "Campestre",
    Estado: "2"
  },
  {
    ID: "115",
    Nome: "Campo Alegre",
    Estado: "2"
  },
  {
    ID: "116",
    Nome: "Campo Grande",
    Estado: "2"
  },
  {
    ID: "117",
    Nome: "Canapi",
    Estado: "2"
  },
  {
    ID: "118",
    Nome: "Capela",
    Estado: "2"
  },
  {
    ID: "119",
    Nome: "Carneiros",
    Estado: "2"
  },
  {
    ID: "120",
    Nome: "Ch\xE3 Preta",
    Estado: "2"
  },
  {
    ID: "121",
    Nome: "Coit\xE9 do N\xF3ia",
    Estado: "2"
  },
  {
    ID: "122",
    Nome: "Col\xF4nia Leopoldina",
    Estado: "2"
  },
  {
    ID: "123",
    Nome: "Coqueiro Seco",
    Estado: "2"
  },
  {
    ID: "124",
    Nome: "Coruripe",
    Estado: "2"
  },
  {
    ID: "125",
    Nome: "Cra\xEDbas",
    Estado: "2"
  },
  {
    ID: "126",
    Nome: "Delmiro Gouveia",
    Estado: "2"
  },
  {
    ID: "127",
    Nome: "Dois Riachos",
    Estado: "2"
  },
  {
    ID: "128",
    Nome: "Estrela de Alagoas",
    Estado: "2"
  },
  {
    ID: "129",
    Nome: "Feira Grande",
    Estado: "2"
  },
  {
    ID: "130",
    Nome: "Feliz Deserto",
    Estado: "2"
  },
  {
    ID: "131",
    Nome: "Flexeiras",
    Estado: "2"
  },
  {
    ID: "132",
    Nome: "Girau do Ponciano",
    Estado: "2"
  },
  {
    ID: "133",
    Nome: "Ibateguara",
    Estado: "2"
  },
  {
    ID: "134",
    Nome: "Igaci",
    Estado: "2"
  },
  {
    ID: "135",
    Nome: "Igreja Nova",
    Estado: "2"
  },
  {
    ID: "136",
    Nome: "Inhapi",
    Estado: "2"
  },
  {
    ID: "137",
    Nome: "Jacar\xE9 dos Homens",
    Estado: "2"
  },
  {
    ID: "138",
    Nome: "Jacu\xEDpe",
    Estado: "2"
  },
  {
    ID: "139",
    Nome: "Japaratinga",
    Estado: "2"
  },
  {
    ID: "140",
    Nome: "Jaramataia",
    Estado: "2"
  },
  {
    ID: "141",
    Nome: "Jequi\xE1 da Praia",
    Estado: "2"
  },
  {
    ID: "142",
    Nome: "Joaquim Gomes",
    Estado: "2"
  },
  {
    ID: "143",
    Nome: "Jundi\xE1",
    Estado: "2"
  },
  {
    ID: "144",
    Nome: "Junqueiro",
    Estado: "2"
  },
  {
    ID: "145",
    Nome: "Lagoa da Canoa",
    Estado: "2"
  },
  {
    ID: "146",
    Nome: "Limoeiro de Anadia",
    Estado: "2"
  },
  {
    ID: "147",
    Nome: "Macei\xF3",
    Estado: "2"
  },
  {
    ID: "148",
    Nome: "Major Isidoro",
    Estado: "2"
  },
  {
    ID: "149",
    Nome: "Mar Vermelho",
    Estado: "2"
  },
  {
    ID: "150",
    Nome: "Maragogi",
    Estado: "2"
  },
  {
    ID: "151",
    Nome: "Maravilha",
    Estado: "2"
  },
  {
    ID: "152",
    Nome: "Marechal Deodoro",
    Estado: "2"
  },
  {
    ID: "153",
    Nome: "Maribondo",
    Estado: "2"
  },
  {
    ID: "154",
    Nome: "Mata Grande",
    Estado: "2"
  },
  {
    ID: "155",
    Nome: "Matriz de Camaragibe",
    Estado: "2"
  },
  {
    ID: "156",
    Nome: "Messias",
    Estado: "2"
  },
  {
    ID: "157",
    Nome: "Minador do Negr\xE3o",
    Estado: "2"
  },
  {
    ID: "158",
    Nome: "Monteir\xF3polis",
    Estado: "2"
  },
  {
    ID: "159",
    Nome: "Murici",
    Estado: "2"
  },
  {
    ID: "160",
    Nome: "Novo Lino",
    Estado: "2"
  },
  {
    ID: "161",
    Nome: "Olho d`\xC1gua das Flores",
    Estado: "2"
  },
  {
    ID: "162",
    Nome: "Olho d`\xC1gua do Casado",
    Estado: "2"
  },
  {
    ID: "163",
    Nome: "Olho d`\xC1gua Grande",
    Estado: "2"
  },
  {
    ID: "164",
    Nome: "Oliven\xE7a",
    Estado: "2"
  },
  {
    ID: "165",
    Nome: "Ouro Branco",
    Estado: "2"
  },
  {
    ID: "166",
    Nome: "Palestina",
    Estado: "2"
  },
  {
    ID: "167",
    Nome: "Palmeira dos \xCDndios",
    Estado: "2"
  },
  {
    ID: "168",
    Nome: "P\xE3o de A\xE7\xFAcar",
    Estado: "2"
  },
  {
    ID: "169",
    Nome: "Pariconha",
    Estado: "2"
  },
  {
    ID: "170",
    Nome: "Paripueira",
    Estado: "2"
  },
  {
    ID: "171",
    Nome: "Passo de Camaragibe",
    Estado: "2"
  },
  {
    ID: "172",
    Nome: "Paulo Jacinto",
    Estado: "2"
  },
  {
    ID: "173",
    Nome: "Penedo",
    Estado: "2"
  },
  {
    ID: "174",
    Nome: "Pia\xE7abu\xE7u",
    Estado: "2"
  },
  {
    ID: "175",
    Nome: "Pilar",
    Estado: "2"
  },
  {
    ID: "176",
    Nome: "Pindoba",
    Estado: "2"
  },
  {
    ID: "177",
    Nome: "Piranhas",
    Estado: "2"
  },
  {
    ID: "178",
    Nome: "Po\xE7o das Trincheiras",
    Estado: "2"
  },
  {
    ID: "179",
    Nome: "Porto Calvo",
    Estado: "2"
  },
  {
    ID: "180",
    Nome: "Porto de Pedras",
    Estado: "2"
  },
  {
    ID: "181",
    Nome: "Porto Real do Col\xE9gio",
    Estado: "2"
  },
  {
    ID: "182",
    Nome: "Quebrangulo",
    Estado: "2"
  },
  {
    ID: "183",
    Nome: "Rio Largo",
    Estado: "2"
  },
  {
    ID: "184",
    Nome: "Roteiro",
    Estado: "2"
  },
  {
    ID: "185",
    Nome: "Santa Luzia do Norte",
    Estado: "2"
  },
  {
    ID: "186",
    Nome: "Santana do Ipanema",
    Estado: "2"
  },
  {
    ID: "187",
    Nome: "Santana do Munda\xFA",
    Estado: "2"
  },
  {
    ID: "188",
    Nome: "S\xE3o Br\xE1s",
    Estado: "2"
  },
  {
    ID: "189",
    Nome: "S\xE3o Jos\xE9 da Laje",
    Estado: "2"
  },
  {
    ID: "190",
    Nome: "S\xE3o Jos\xE9 da Tapera",
    Estado: "2"
  },
  {
    ID: "191",
    Nome: "S\xE3o Lu\xEDs do Quitunde",
    Estado: "2"
  },
  {
    ID: "192",
    Nome: "S\xE3o Miguel dos Campos",
    Estado: "2"
  },
  {
    ID: "193",
    Nome: "S\xE3o Miguel dos Milagres",
    Estado: "2"
  },
  {
    ID: "194",
    Nome: "S\xE3o Sebasti\xE3o",
    Estado: "2"
  },
  {
    ID: "195",
    Nome: "Satuba",
    Estado: "2"
  },
  {
    ID: "196",
    Nome: "Senador Rui Palmeira",
    Estado: "2"
  },
  {
    ID: "197",
    Nome: "Tanque d`Arca",
    Estado: "2"
  },
  {
    ID: "198",
    Nome: "Taquarana",
    Estado: "2"
  },
  {
    ID: "199",
    Nome: "Teot\xF4nio Vilela",
    Estado: "2"
  },
  {
    ID: "200",
    Nome: "Traipu",
    Estado: "2"
  },
  {
    ID: "201",
    Nome: "Uni\xE3o dos Palmares",
    Estado: "2"
  },
  {
    ID: "202",
    Nome: "Vi\xE7osa",
    Estado: "2"
  },
  {
    ID: "203",
    Nome: "Amap\xE1",
    Estado: "4"
  },
  {
    ID: "204",
    Nome: "Cal\xE7oene",
    Estado: "4"
  },
  {
    ID: "205",
    Nome: "Cutias",
    Estado: "4"
  },
  {
    ID: "206",
    Nome: "Ferreira Gomes",
    Estado: "4"
  },
  {
    ID: "207",
    Nome: "Itaubal",
    Estado: "4"
  },
  {
    ID: "208",
    Nome: "Laranjal do Jari",
    Estado: "4"
  },
  {
    ID: "209",
    Nome: "Macap\xE1",
    Estado: "4"
  },
  {
    ID: "210",
    Nome: "Mazag\xE3o",
    Estado: "4"
  },
  {
    ID: "211",
    Nome: "Oiapoque",
    Estado: "4"
  },
  {
    ID: "212",
    Nome: "Pedra Branca do Amapar\xED",
    Estado: "4"
  },
  {
    ID: "213",
    Nome: "Porto Grande",
    Estado: "4"
  },
  {
    ID: "214",
    Nome: "Pracu\xFAba",
    Estado: "4"
  },
  {
    ID: "215",
    Nome: "Santana",
    Estado: "4"
  },
  {
    ID: "216",
    Nome: "Serra do Navio",
    Estado: "4"
  },
  {
    ID: "217",
    Nome: "Tartarugalzinho",
    Estado: "4"
  },
  {
    ID: "218",
    Nome: "Vit\xF3ria do Jari",
    Estado: "4"
  },
  {
    ID: "219",
    Nome: "Alvar\xE3es",
    Estado: "3"
  },
  {
    ID: "220",
    Nome: "Amatur\xE1",
    Estado: "3"
  },
  {
    ID: "221",
    Nome: "Anam\xE3",
    Estado: "3"
  },
  {
    ID: "222",
    Nome: "Anori",
    Estado: "3"
  },
  {
    ID: "223",
    Nome: "Apu\xED",
    Estado: "3"
  },
  {
    ID: "224",
    Nome: "Atalaia do Norte",
    Estado: "3"
  },
  {
    ID: "225",
    Nome: "Autazes",
    Estado: "3"
  },
  {
    ID: "226",
    Nome: "Barcelos",
    Estado: "3"
  },
  {
    ID: "227",
    Nome: "Barreirinha",
    Estado: "3"
  },
  {
    ID: "228",
    Nome: "Benjamin Constant",
    Estado: "3"
  },
  {
    ID: "229",
    Nome: "Beruri",
    Estado: "3"
  },
  {
    ID: "230",
    Nome: "Boa Vista do Ramos",
    Estado: "3"
  },
  {
    ID: "231",
    Nome: "Boca do Acre",
    Estado: "3"
  },
  {
    ID: "232",
    Nome: "Borba",
    Estado: "3"
  },
  {
    ID: "233",
    Nome: "Caapiranga",
    Estado: "3"
  },
  {
    ID: "234",
    Nome: "Canutama",
    Estado: "3"
  },
  {
    ID: "235",
    Nome: "Carauari",
    Estado: "3"
  },
  {
    ID: "236",
    Nome: "Careiro",
    Estado: "3"
  },
  {
    ID: "237",
    Nome: "Careiro da V\xE1rzea",
    Estado: "3"
  },
  {
    ID: "238",
    Nome: "Coari",
    Estado: "3"
  },
  {
    ID: "239",
    Nome: "Codaj\xE1s",
    Estado: "3"
  },
  {
    ID: "240",
    Nome: "Eirunep\xE9",
    Estado: "3"
  },
  {
    ID: "241",
    Nome: "Envira",
    Estado: "3"
  },
  {
    ID: "242",
    Nome: "Fonte Boa",
    Estado: "3"
  },
  {
    ID: "243",
    Nome: "Guajar\xE1",
    Estado: "3"
  },
  {
    ID: "244",
    Nome: "Humait\xE1",
    Estado: "3"
  },
  {
    ID: "245",
    Nome: "Ipixuna",
    Estado: "3"
  },
  {
    ID: "246",
    Nome: "Iranduba",
    Estado: "3"
  },
  {
    ID: "247",
    Nome: "Itacoatiara",
    Estado: "3"
  },
  {
    ID: "248",
    Nome: "Itamarati",
    Estado: "3"
  },
  {
    ID: "249",
    Nome: "Itapiranga",
    Estado: "3"
  },
  {
    ID: "250",
    Nome: "Japur\xE1",
    Estado: "3"
  },
  {
    ID: "251",
    Nome: "Juru\xE1",
    Estado: "3"
  },
  {
    ID: "252",
    Nome: "Juta\xED",
    Estado: "3"
  },
  {
    ID: "253",
    Nome: "L\xE1brea",
    Estado: "3"
  },
  {
    ID: "254",
    Nome: "Manacapuru",
    Estado: "3"
  },
  {
    ID: "255",
    Nome: "Manaquiri",
    Estado: "3"
  },
  {
    ID: "256",
    Nome: "Manaus",
    Estado: "3"
  },
  {
    ID: "257",
    Nome: "Manicor\xE9",
    Estado: "3"
  },
  {
    ID: "258",
    Nome: "Mara\xE3",
    Estado: "3"
  },
  {
    ID: "259",
    Nome: "Mau\xE9s",
    Estado: "3"
  },
  {
    ID: "260",
    Nome: "Nhamund\xE1",
    Estado: "3"
  },
  {
    ID: "261",
    Nome: "Nova Olinda do Norte",
    Estado: "3"
  },
  {
    ID: "262",
    Nome: "Novo Air\xE3o",
    Estado: "3"
  },
  {
    ID: "263",
    Nome: "Novo Aripuan\xE3",
    Estado: "3"
  },
  {
    ID: "264",
    Nome: "Parintins",
    Estado: "3"
  },
  {
    ID: "265",
    Nome: "Pauini",
    Estado: "3"
  },
  {
    ID: "266",
    Nome: "Presidente Figueiredo",
    Estado: "3"
  },
  {
    ID: "267",
    Nome: "Rio Preto da Eva",
    Estado: "3"
  },
  {
    ID: "268",
    Nome: "Santa Isabel do Rio Negro",
    Estado: "3"
  },
  {
    ID: "269",
    Nome: "Santo Ant\xF4nio do I\xE7\xE1",
    Estado: "3"
  },
  {
    ID: "270",
    Nome: "S\xE3o Gabriel da Cachoeira",
    Estado: "3"
  },
  {
    ID: "271",
    Nome: "S\xE3o Paulo de Oliven\xE7a",
    Estado: "3"
  },
  {
    ID: "272",
    Nome: "S\xE3o Sebasti\xE3o do Uatum\xE3",
    Estado: "3"
  },
  {
    ID: "273",
    Nome: "Silves",
    Estado: "3"
  },
  {
    ID: "274",
    Nome: "Tabatinga",
    Estado: "3"
  },
  {
    ID: "275",
    Nome: "Tapau\xE1",
    Estado: "3"
  },
  {
    ID: "276",
    Nome: "Tef\xE9",
    Estado: "3"
  },
  {
    ID: "277",
    Nome: "Tonantins",
    Estado: "3"
  },
  {
    ID: "278",
    Nome: "Uarini",
    Estado: "3"
  },
  {
    ID: "279",
    Nome: "Urucar\xE1",
    Estado: "3"
  },
  {
    ID: "280",
    Nome: "Urucurituba",
    Estado: "3"
  },
  {
    ID: "281",
    Nome: "Aba\xEDra",
    Estado: "5"
  },
  {
    ID: "282",
    Nome: "Abar\xE9",
    Estado: "5"
  },
  {
    ID: "283",
    Nome: "Acajutiba",
    Estado: "5"
  },
  {
    ID: "284",
    Nome: "Adustina",
    Estado: "5"
  },
  {
    ID: "285",
    Nome: "\xC1gua Fria",
    Estado: "5"
  },
  {
    ID: "286",
    Nome: "Aiquara",
    Estado: "5"
  },
  {
    ID: "287",
    Nome: "Alagoinhas",
    Estado: "5"
  },
  {
    ID: "288",
    Nome: "Alcoba\xE7a",
    Estado: "5"
  },
  {
    ID: "289",
    Nome: "Almadina",
    Estado: "5"
  },
  {
    ID: "290",
    Nome: "Amargosa",
    Estado: "5"
  },
  {
    ID: "291",
    Nome: "Am\xE9lia Rodrigues",
    Estado: "5"
  },
  {
    ID: "292",
    Nome: "Am\xE9rica Dourada",
    Estado: "5"
  },
  {
    ID: "293",
    Nome: "Anag\xE9",
    Estado: "5"
  },
  {
    ID: "294",
    Nome: "Andara\xED",
    Estado: "5"
  },
  {
    ID: "295",
    Nome: "Andorinha",
    Estado: "5"
  },
  {
    ID: "296",
    Nome: "Angical",
    Estado: "5"
  },
  {
    ID: "297",
    Nome: "Anguera",
    Estado: "5"
  },
  {
    ID: "298",
    Nome: "Antas",
    Estado: "5"
  },
  {
    ID: "299",
    Nome: "Ant\xF4nio Cardoso",
    Estado: "5"
  },
  {
    ID: "300",
    Nome: "Ant\xF4nio Gon\xE7alves",
    Estado: "5"
  },
  {
    ID: "301",
    Nome: "Apor\xE1",
    Estado: "5"
  },
  {
    ID: "302",
    Nome: "Apuarema",
    Estado: "5"
  },
  {
    ID: "303",
    Nome: "Ara\xE7as",
    Estado: "5"
  },
  {
    ID: "304",
    Nome: "Aracatu",
    Estado: "5"
  },
  {
    ID: "305",
    Nome: "Araci",
    Estado: "5"
  },
  {
    ID: "306",
    Nome: "Aramari",
    Estado: "5"
  },
  {
    ID: "307",
    Nome: "Arataca",
    Estado: "5"
  },
  {
    ID: "308",
    Nome: "Aratu\xEDpe",
    Estado: "5"
  },
  {
    ID: "309",
    Nome: "Aurelino Leal",
    Estado: "5"
  },
  {
    ID: "310",
    Nome: "Baian\xF3polis",
    Estado: "5"
  },
  {
    ID: "311",
    Nome: "Baixa Grande",
    Estado: "5"
  },
  {
    ID: "312",
    Nome: "Banza\xEA",
    Estado: "5"
  },
  {
    ID: "313",
    Nome: "Barra",
    Estado: "5"
  },
  {
    ID: "314",
    Nome: "Barra da Estiva",
    Estado: "5"
  },
  {
    ID: "315",
    Nome: "Barra do Cho\xE7a",
    Estado: "5"
  },
  {
    ID: "316",
    Nome: "Barra do Mendes",
    Estado: "5"
  },
  {
    ID: "317",
    Nome: "Barra do Rocha",
    Estado: "5"
  },
  {
    ID: "318",
    Nome: "Barreiras",
    Estado: "5"
  },
  {
    ID: "319",
    Nome: "Barro Alto",
    Estado: "5"
  },
  {
    ID: "320",
    Nome: "Barro Preto (antigo Gov. Lomanto Jr.)",
    Estado: "5"
  },
  {
    ID: "321",
    Nome: "Barrocas",
    Estado: "5"
  },
  {
    ID: "322",
    Nome: "Belmonte",
    Estado: "5"
  },
  {
    ID: "323",
    Nome: "Belo Campo",
    Estado: "5"
  },
  {
    ID: "324",
    Nome: "Biritinga",
    Estado: "5"
  },
  {
    ID: "325",
    Nome: "Boa Nova",
    Estado: "5"
  },
  {
    ID: "326",
    Nome: "Boa Vista do Tupim",
    Estado: "5"
  },
  {
    ID: "327",
    Nome: "Bom Jesus da Lapa",
    Estado: "5"
  },
  {
    ID: "328",
    Nome: "Bom Jesus da Serra",
    Estado: "5"
  },
  {
    ID: "329",
    Nome: "Boninal",
    Estado: "5"
  },
  {
    ID: "330",
    Nome: "Bonito",
    Estado: "5"
  },
  {
    ID: "331",
    Nome: "Boquira",
    Estado: "5"
  },
  {
    ID: "332",
    Nome: "Botupor\xE3",
    Estado: "5"
  },
  {
    ID: "333",
    Nome: "Brej\xF5es",
    Estado: "5"
  },
  {
    ID: "334",
    Nome: "Brejol\xE2ndia",
    Estado: "5"
  },
  {
    ID: "335",
    Nome: "Brotas de Maca\xFAbas",
    Estado: "5"
  },
  {
    ID: "336",
    Nome: "Brumado",
    Estado: "5"
  },
  {
    ID: "337",
    Nome: "Buerarema",
    Estado: "5"
  },
  {
    ID: "338",
    Nome: "Buritirama",
    Estado: "5"
  },
  {
    ID: "339",
    Nome: "Caatiba",
    Estado: "5"
  },
  {
    ID: "340",
    Nome: "Cabaceiras do Paragua\xE7u",
    Estado: "5"
  },
  {
    ID: "341",
    Nome: "Cachoeira",
    Estado: "5"
  },
  {
    ID: "342",
    Nome: "Cacul\xE9",
    Estado: "5"
  },
  {
    ID: "343",
    Nome: "Ca\xE9m",
    Estado: "5"
  },
  {
    ID: "344",
    Nome: "Caetanos",
    Estado: "5"
  },
  {
    ID: "345",
    Nome: "Caetit\xE9",
    Estado: "5"
  },
  {
    ID: "346",
    Nome: "Cafarnaum",
    Estado: "5"
  },
  {
    ID: "347",
    Nome: "Cairu",
    Estado: "5"
  },
  {
    ID: "348",
    Nome: "Caldeir\xE3o Grande",
    Estado: "5"
  },
  {
    ID: "349",
    Nome: "Camacan",
    Estado: "5"
  },
  {
    ID: "350",
    Nome: "Cama\xE7ari",
    Estado: "5"
  },
  {
    ID: "351",
    Nome: "Camamu",
    Estado: "5"
  },
  {
    ID: "352",
    Nome: "Campo Alegre de Lourdes",
    Estado: "5"
  },
  {
    ID: "353",
    Nome: "Campo Formoso",
    Estado: "5"
  },
  {
    ID: "354",
    Nome: "Can\xE1polis",
    Estado: "5"
  },
  {
    ID: "355",
    Nome: "Canarana",
    Estado: "5"
  },
  {
    ID: "356",
    Nome: "Canavieiras",
    Estado: "5"
  },
  {
    ID: "357",
    Nome: "Candeal",
    Estado: "5"
  },
  {
    ID: "358",
    Nome: "Candeias",
    Estado: "5"
  },
  {
    ID: "359",
    Nome: "Candiba",
    Estado: "5"
  },
  {
    ID: "360",
    Nome: "C\xE2ndido Sales",
    Estado: "5"
  },
  {
    ID: "361",
    Nome: "Cansan\xE7\xE3o",
    Estado: "5"
  },
  {
    ID: "362",
    Nome: "Canudos",
    Estado: "5"
  },
  {
    ID: "363",
    Nome: "Capela do Alto Alegre",
    Estado: "5"
  },
  {
    ID: "364",
    Nome: "Capim Grosso",
    Estado: "5"
  },
  {
    ID: "365",
    Nome: "Cara\xEDbas",
    Estado: "5"
  },
  {
    ID: "366",
    Nome: "Caravelas",
    Estado: "5"
  },
  {
    ID: "367",
    Nome: "Cardeal da Silva",
    Estado: "5"
  },
  {
    ID: "368",
    Nome: "Carinhanha",
    Estado: "5"
  },
  {
    ID: "369",
    Nome: "Casa Nova",
    Estado: "5"
  },
  {
    ID: "370",
    Nome: "Castro Alves",
    Estado: "5"
  },
  {
    ID: "371",
    Nome: "Catol\xE2ndia",
    Estado: "5"
  },
  {
    ID: "372",
    Nome: "Catu",
    Estado: "5"
  },
  {
    ID: "373",
    Nome: "Caturama",
    Estado: "5"
  },
  {
    ID: "374",
    Nome: "Central",
    Estado: "5"
  },
  {
    ID: "375",
    Nome: "Chorroch\xF3",
    Estado: "5"
  },
  {
    ID: "376",
    Nome: "C\xEDcero Dantas",
    Estado: "5"
  },
  {
    ID: "377",
    Nome: "Cip\xF3",
    Estado: "5"
  },
  {
    ID: "378",
    Nome: "Coaraci",
    Estado: "5"
  },
  {
    ID: "379",
    Nome: "Cocos",
    Estado: "5"
  },
  {
    ID: "380",
    Nome: "Concei\xE7\xE3o da Feira",
    Estado: "5"
  },
  {
    ID: "381",
    Nome: "Concei\xE7\xE3o do Almeida",
    Estado: "5"
  },
  {
    ID: "382",
    Nome: "Concei\xE7\xE3o do Coit\xE9",
    Estado: "5"
  },
  {
    ID: "383",
    Nome: "Concei\xE7\xE3o do Jacu\xEDpe",
    Estado: "5"
  },
  {
    ID: "384",
    Nome: "Conde",
    Estado: "5"
  },
  {
    ID: "385",
    Nome: "Conde\xFAba",
    Estado: "5"
  },
  {
    ID: "386",
    Nome: "Contendas do Sincor\xE1",
    Estado: "5"
  },
  {
    ID: "387",
    Nome: "Cora\xE7\xE3o de Maria",
    Estado: "5"
  },
  {
    ID: "388",
    Nome: "Cordeiros",
    Estado: "5"
  },
  {
    ID: "389",
    Nome: "Coribe",
    Estado: "5"
  },
  {
    ID: "390",
    Nome: "Coronel Jo\xE3o S\xE1",
    Estado: "5"
  },
  {
    ID: "391",
    Nome: "Correntina",
    Estado: "5"
  },
  {
    ID: "392",
    Nome: "Cotegipe",
    Estado: "5"
  },
  {
    ID: "393",
    Nome: "Cravol\xE2ndia",
    Estado: "5"
  },
  {
    ID: "394",
    Nome: "Cris\xF3polis",
    Estado: "5"
  },
  {
    ID: "395",
    Nome: "Crist\xF3polis",
    Estado: "5"
  },
  {
    ID: "396",
    Nome: "Cruz das Almas",
    Estado: "5"
  },
  {
    ID: "397",
    Nome: "Cura\xE7\xE1",
    Estado: "5"
  },
  {
    ID: "398",
    Nome: "D\xE1rio Meira",
    Estado: "5"
  },
  {
    ID: "399",
    Nome: "Dias d`\xC1vila",
    Estado: "5"
  },
  {
    ID: "400",
    Nome: "Dom Bas\xEDlio",
    Estado: "5"
  },
  {
    ID: "401",
    Nome: "Dom Macedo Costa",
    Estado: "5"
  },
  {
    ID: "402",
    Nome: "El\xEDsio Medrado",
    Estado: "5"
  },
  {
    ID: "403",
    Nome: "Encruzilhada",
    Estado: "5"
  },
  {
    ID: "404",
    Nome: "Entre Rios",
    Estado: "5"
  },
  {
    ID: "405",
    Nome: "\xC9rico Cardoso",
    Estado: "5"
  },
  {
    ID: "406",
    Nome: "Esplanada",
    Estado: "5"
  },
  {
    ID: "407",
    Nome: "Euclides da Cunha",
    Estado: "5"
  },
  {
    ID: "408",
    Nome: "Eun\xE1polis",
    Estado: "5"
  },
  {
    ID: "409",
    Nome: "F\xE1tima",
    Estado: "5"
  },
  {
    ID: "410",
    Nome: "Feira da Mata",
    Estado: "5"
  },
  {
    ID: "411",
    Nome: "Feira de Santana",
    Estado: "5"
  },
  {
    ID: "412",
    Nome: "Filad\xE9lfia",
    Estado: "5"
  },
  {
    ID: "413",
    Nome: "Firmino Alves",
    Estado: "5"
  },
  {
    ID: "414",
    Nome: "Floresta Azul",
    Estado: "5"
  },
  {
    ID: "415",
    Nome: "Formosa do Rio Preto",
    Estado: "5"
  },
  {
    ID: "416",
    Nome: "Gandu",
    Estado: "5"
  },
  {
    ID: "417",
    Nome: "Gavi\xE3o",
    Estado: "5"
  },
  {
    ID: "418",
    Nome: "Gentio do Ouro",
    Estado: "5"
  },
  {
    ID: "419",
    Nome: "Gl\xF3ria",
    Estado: "5"
  },
  {
    ID: "420",
    Nome: "Gongogi",
    Estado: "5"
  },
  {
    ID: "421",
    Nome: "Governador Mangabeira",
    Estado: "5"
  },
  {
    ID: "422",
    Nome: "Guajeru",
    Estado: "5"
  },
  {
    ID: "423",
    Nome: "Guanambi",
    Estado: "5"
  },
  {
    ID: "424",
    Nome: "Guaratinga",
    Estado: "5"
  },
  {
    ID: "425",
    Nome: "Heli\xF3polis",
    Estado: "5"
  },
  {
    ID: "426",
    Nome: "Ia\xE7u",
    Estado: "5"
  },
  {
    ID: "427",
    Nome: "Ibiassuc\xEA",
    Estado: "5"
  },
  {
    ID: "428",
    Nome: "Ibicara\xED",
    Estado: "5"
  },
  {
    ID: "429",
    Nome: "Ibicoara",
    Estado: "5"
  },
  {
    ID: "430",
    Nome: "Ibicu\xED",
    Estado: "5"
  },
  {
    ID: "431",
    Nome: "Ibipeba",
    Estado: "5"
  },
  {
    ID: "432",
    Nome: "Ibipitanga",
    Estado: "5"
  },
  {
    ID: "433",
    Nome: "Ibiquera",
    Estado: "5"
  },
  {
    ID: "434",
    Nome: "Ibirapitanga",
    Estado: "5"
  },
  {
    ID: "435",
    Nome: "Ibirapu\xE3",
    Estado: "5"
  },
  {
    ID: "436",
    Nome: "Ibirataia",
    Estado: "5"
  },
  {
    ID: "437",
    Nome: "Ibitiara",
    Estado: "5"
  },
  {
    ID: "438",
    Nome: "Ibitit\xE1",
    Estado: "5"
  },
  {
    ID: "439",
    Nome: "Ibotirama",
    Estado: "5"
  },
  {
    ID: "440",
    Nome: "Ichu",
    Estado: "5"
  },
  {
    ID: "441",
    Nome: "Igapor\xE3",
    Estado: "5"
  },
  {
    ID: "442",
    Nome: "Igrapi\xFAna",
    Estado: "5"
  },
  {
    ID: "443",
    Nome: "Igua\xED",
    Estado: "5"
  },
  {
    ID: "444",
    Nome: "Ilh\xE9us",
    Estado: "5"
  },
  {
    ID: "445",
    Nome: "Inhambupe",
    Estado: "5"
  },
  {
    ID: "446",
    Nome: "Ipecaet\xE1",
    Estado: "5"
  },
  {
    ID: "447",
    Nome: "Ipia\xFA",
    Estado: "5"
  },
  {
    ID: "448",
    Nome: "Ipir\xE1",
    Estado: "5"
  },
  {
    ID: "449",
    Nome: "Ipupiara",
    Estado: "5"
  },
  {
    ID: "450",
    Nome: "Irajuba",
    Estado: "5"
  },
  {
    ID: "451",
    Nome: "Iramaia",
    Estado: "5"
  },
  {
    ID: "452",
    Nome: "Iraquara",
    Estado: "5"
  },
  {
    ID: "453",
    Nome: "Irar\xE1",
    Estado: "5"
  },
  {
    ID: "454",
    Nome: "Irec\xEA",
    Estado: "5"
  },
  {
    ID: "455",
    Nome: "Itabela",
    Estado: "5"
  },
  {
    ID: "456",
    Nome: "Itaberaba",
    Estado: "5"
  },
  {
    ID: "457",
    Nome: "Itabuna",
    Estado: "5"
  },
  {
    ID: "458",
    Nome: "Itacar\xE9",
    Estado: "5"
  },
  {
    ID: "459",
    Nome: "Itaet\xE9",
    Estado: "5"
  },
  {
    ID: "460",
    Nome: "Itagi",
    Estado: "5"
  },
  {
    ID: "461",
    Nome: "Itagib\xE1",
    Estado: "5"
  },
  {
    ID: "462",
    Nome: "Itagimirim",
    Estado: "5"
  },
  {
    ID: "463",
    Nome: "Itagua\xE7u da Bahia",
    Estado: "5"
  },
  {
    ID: "464",
    Nome: "Itaju do Col\xF4nia",
    Estado: "5"
  },
  {
    ID: "465",
    Nome: "Itaju\xEDpe",
    Estado: "5"
  },
  {
    ID: "466",
    Nome: "Itamaraju",
    Estado: "5"
  },
  {
    ID: "467",
    Nome: "Itamari",
    Estado: "5"
  },
  {
    ID: "468",
    Nome: "Itamb\xE9",
    Estado: "5"
  },
  {
    ID: "469",
    Nome: "Itanagra",
    Estado: "5"
  },
  {
    ID: "470",
    Nome: "Itanh\xE9m",
    Estado: "5"
  },
  {
    ID: "471",
    Nome: "Itaparica",
    Estado: "5"
  },
  {
    ID: "472",
    Nome: "Itap\xE9",
    Estado: "5"
  },
  {
    ID: "473",
    Nome: "Itapebi",
    Estado: "5"
  },
  {
    ID: "474",
    Nome: "Itapetinga",
    Estado: "5"
  },
  {
    ID: "475",
    Nome: "Itapicuru",
    Estado: "5"
  },
  {
    ID: "476",
    Nome: "Itapitanga",
    Estado: "5"
  },
  {
    ID: "477",
    Nome: "Itaquara",
    Estado: "5"
  },
  {
    ID: "478",
    Nome: "Itarantim",
    Estado: "5"
  },
  {
    ID: "479",
    Nome: "Itatim",
    Estado: "5"
  },
  {
    ID: "480",
    Nome: "Itiru\xE7u",
    Estado: "5"
  },
  {
    ID: "481",
    Nome: "Iti\xFAba",
    Estado: "5"
  },
  {
    ID: "482",
    Nome: "Itoror\xF3",
    Estado: "5"
  },
  {
    ID: "483",
    Nome: "Itua\xE7u",
    Estado: "5"
  },
  {
    ID: "484",
    Nome: "Ituber\xE1",
    Estado: "5"
  },
  {
    ID: "485",
    Nome: "Iui\xFA",
    Estado: "5"
  },
  {
    ID: "486",
    Nome: "Jaborandi",
    Estado: "5"
  },
  {
    ID: "487",
    Nome: "Jacaraci",
    Estado: "5"
  },
  {
    ID: "488",
    Nome: "Jacobina",
    Estado: "5"
  },
  {
    ID: "489",
    Nome: "Jaguaquara",
    Estado: "5"
  },
  {
    ID: "490",
    Nome: "Jaguarari",
    Estado: "5"
  },
  {
    ID: "491",
    Nome: "Jaguaripe",
    Estado: "5"
  },
  {
    ID: "492",
    Nome: "Janda\xEDra",
    Estado: "5"
  },
  {
    ID: "493",
    Nome: "Jequi\xE9",
    Estado: "5"
  },
  {
    ID: "494",
    Nome: "Jeremoabo",
    Estado: "5"
  },
  {
    ID: "495",
    Nome: "Jiquiri\xE7\xE1",
    Estado: "5"
  },
  {
    ID: "496",
    Nome: "Jita\xFAna",
    Estado: "5"
  },
  {
    ID: "497",
    Nome: "Jo\xE3o Dourado",
    Estado: "5"
  },
  {
    ID: "498",
    Nome: "Juazeiro",
    Estado: "5"
  },
  {
    ID: "499",
    Nome: "Jucuru\xE7u",
    Estado: "5"
  },
  {
    ID: "500",
    Nome: "Jussara",
    Estado: "5"
  },
  {
    ID: "501",
    Nome: "Jussari",
    Estado: "5"
  },
  {
    ID: "502",
    Nome: "Jussiape",
    Estado: "5"
  },
  {
    ID: "503",
    Nome: "Lafaiete Coutinho",
    Estado: "5"
  },
  {
    ID: "504",
    Nome: "Lagoa Real",
    Estado: "5"
  },
  {
    ID: "505",
    Nome: "Laje",
    Estado: "5"
  },
  {
    ID: "506",
    Nome: "Lajed\xE3o",
    Estado: "5"
  },
  {
    ID: "507",
    Nome: "Lajedinho",
    Estado: "5"
  },
  {
    ID: "508",
    Nome: "Lajedo do Tabocal",
    Estado: "5"
  },
  {
    ID: "509",
    Nome: "Lamar\xE3o",
    Estado: "5"
  },
  {
    ID: "510",
    Nome: "Lap\xE3o",
    Estado: "5"
  },
  {
    ID: "511",
    Nome: "Lauro de Freitas",
    Estado: "5"
  },
  {
    ID: "512",
    Nome: "Len\xE7\xF3is",
    Estado: "5"
  },
  {
    ID: "513",
    Nome: "Lic\xEDnio de Almeida",
    Estado: "5"
  },
  {
    ID: "514",
    Nome: "Livramento de Nossa Senhora",
    Estado: "5"
  },
  {
    ID: "515",
    Nome: "Lu\xEDs Eduardo Magalh\xE3es",
    Estado: "5"
  },
  {
    ID: "516",
    Nome: "Macajuba",
    Estado: "5"
  },
  {
    ID: "517",
    Nome: "Macarani",
    Estado: "5"
  },
  {
    ID: "518",
    Nome: "Maca\xFAbas",
    Estado: "5"
  },
  {
    ID: "519",
    Nome: "Macurur\xE9",
    Estado: "5"
  },
  {
    ID: "520",
    Nome: "Madre de Deus",
    Estado: "5"
  },
  {
    ID: "521",
    Nome: "Maetinga",
    Estado: "5"
  },
  {
    ID: "522",
    Nome: "Maiquinique",
    Estado: "5"
  },
  {
    ID: "523",
    Nome: "Mairi",
    Estado: "5"
  },
  {
    ID: "524",
    Nome: "Malhada",
    Estado: "5"
  },
  {
    ID: "525",
    Nome: "Malhada de Pedras",
    Estado: "5"
  },
  {
    ID: "526",
    Nome: "Manoel Vitorino",
    Estado: "5"
  },
  {
    ID: "527",
    Nome: "Mansid\xE3o",
    Estado: "5"
  },
  {
    ID: "528",
    Nome: "Marac\xE1s",
    Estado: "5"
  },
  {
    ID: "529",
    Nome: "Maragogipe",
    Estado: "5"
  },
  {
    ID: "530",
    Nome: "Mara\xFA",
    Estado: "5"
  },
  {
    ID: "531",
    Nome: "Marcion\xEDlio Souza",
    Estado: "5"
  },
  {
    ID: "532",
    Nome: "Mascote",
    Estado: "5"
  },
  {
    ID: "533",
    Nome: "Mata de S\xE3o Jo\xE3o",
    Estado: "5"
  },
  {
    ID: "534",
    Nome: "Matina",
    Estado: "5"
  },
  {
    ID: "535",
    Nome: "Medeiros Neto",
    Estado: "5"
  },
  {
    ID: "536",
    Nome: "Miguel Calmon",
    Estado: "5"
  },
  {
    ID: "537",
    Nome: "Milagres",
    Estado: "5"
  },
  {
    ID: "538",
    Nome: "Mirangaba",
    Estado: "5"
  },
  {
    ID: "539",
    Nome: "Mirante",
    Estado: "5"
  },
  {
    ID: "540",
    Nome: "Monte Santo",
    Estado: "5"
  },
  {
    ID: "541",
    Nome: "Morpar\xE1",
    Estado: "5"
  },
  {
    ID: "542",
    Nome: "Morro do Chap\xE9u",
    Estado: "5"
  },
  {
    ID: "543",
    Nome: "Mortugaba",
    Estado: "5"
  },
  {
    ID: "544",
    Nome: "Mucug\xEA",
    Estado: "5"
  },
  {
    ID: "545",
    Nome: "Mucuri",
    Estado: "5"
  },
  {
    ID: "546",
    Nome: "Mulungu do Morro",
    Estado: "5"
  },
  {
    ID: "547",
    Nome: "Mundo Novo",
    Estado: "5"
  },
  {
    ID: "548",
    Nome: "Muniz Ferreira",
    Estado: "5"
  },
  {
    ID: "549",
    Nome: "Muqu\xE9m de S\xE3o Francisco",
    Estado: "5"
  },
  {
    ID: "550",
    Nome: "Muritiba",
    Estado: "5"
  },
  {
    ID: "551",
    Nome: "Mutu\xEDpe",
    Estado: "5"
  },
  {
    ID: "552",
    Nome: "Nazar\xE9",
    Estado: "5"
  },
  {
    ID: "553",
    Nome: "Nilo Pe\xE7anha",
    Estado: "5"
  },
  {
    ID: "554",
    Nome: "Nordestina",
    Estado: "5"
  },
  {
    ID: "555",
    Nome: "Nova Cana\xE3",
    Estado: "5"
  },
  {
    ID: "556",
    Nome: "Nova F\xE1tima",
    Estado: "5"
  },
  {
    ID: "557",
    Nome: "Nova Ibi\xE1",
    Estado: "5"
  },
  {
    ID: "558",
    Nome: "Nova Itarana",
    Estado: "5"
  },
  {
    ID: "559",
    Nome: "Nova Reden\xE7\xE3o",
    Estado: "5"
  },
  {
    ID: "560",
    Nome: "Nova Soure",
    Estado: "5"
  },
  {
    ID: "561",
    Nome: "Nova Vi\xE7osa",
    Estado: "5"
  },
  {
    ID: "562",
    Nome: "Novo Horizonte",
    Estado: "5"
  },
  {
    ID: "563",
    Nome: "Novo Triunfo",
    Estado: "5"
  },
  {
    ID: "564",
    Nome: "Olindina",
    Estado: "5"
  },
  {
    ID: "565",
    Nome: "Oliveira dos Brejinhos",
    Estado: "5"
  },
  {
    ID: "566",
    Nome: "Ouri\xE7angas",
    Estado: "5"
  },
  {
    ID: "567",
    Nome: "Ourol\xE2ndia",
    Estado: "5"
  },
  {
    ID: "568",
    Nome: "Palmas de Monte Alto",
    Estado: "5"
  },
  {
    ID: "569",
    Nome: "Palmeiras",
    Estado: "5"
  },
  {
    ID: "570",
    Nome: "Paramirim",
    Estado: "5"
  },
  {
    ID: "571",
    Nome: "Paratinga",
    Estado: "5"
  },
  {
    ID: "572",
    Nome: "Paripiranga",
    Estado: "5"
  },
  {
    ID: "573",
    Nome: "Pau Brasil",
    Estado: "5"
  },
  {
    ID: "574",
    Nome: "Paulo Afonso",
    Estado: "5"
  },
  {
    ID: "575",
    Nome: "P\xE9 de Serra",
    Estado: "5"
  },
  {
    ID: "576",
    Nome: "Pedr\xE3o",
    Estado: "5"
  },
  {
    ID: "577",
    Nome: "Pedro Alexandre",
    Estado: "5"
  },
  {
    ID: "578",
    Nome: "Piat\xE3",
    Estado: "5"
  },
  {
    ID: "579",
    Nome: "Pil\xE3o Arcado",
    Estado: "5"
  },
  {
    ID: "580",
    Nome: "Pinda\xED",
    Estado: "5"
  },
  {
    ID: "581",
    Nome: "Pindoba\xE7u",
    Estado: "5"
  },
  {
    ID: "582",
    Nome: "Pintadas",
    Estado: "5"
  },
  {
    ID: "583",
    Nome: "Pira\xED do Norte",
    Estado: "5"
  },
  {
    ID: "584",
    Nome: "Pirip\xE1",
    Estado: "5"
  },
  {
    ID: "585",
    Nome: "Piritiba",
    Estado: "5"
  },
  {
    ID: "586",
    Nome: "Planaltino",
    Estado: "5"
  },
  {
    ID: "587",
    Nome: "Planalto",
    Estado: "5"
  },
  {
    ID: "588",
    Nome: "Po\xE7\xF5es",
    Estado: "5"
  },
  {
    ID: "589",
    Nome: "Pojuca",
    Estado: "5"
  },
  {
    ID: "590",
    Nome: "Ponto Novo",
    Estado: "5"
  },
  {
    ID: "591",
    Nome: "Porto Seguro",
    Estado: "5"
  },
  {
    ID: "592",
    Nome: "Potiragu\xE1",
    Estado: "5"
  },
  {
    ID: "593",
    Nome: "Prado",
    Estado: "5"
  },
  {
    ID: "594",
    Nome: "Presidente Dutra",
    Estado: "5"
  },
  {
    ID: "595",
    Nome: "Presidente J\xE2nio Quadros",
    Estado: "5"
  },
  {
    ID: "596",
    Nome: "Presidente Tancredo Neves",
    Estado: "5"
  },
  {
    ID: "597",
    Nome: "Queimadas",
    Estado: "5"
  },
  {
    ID: "598",
    Nome: "Quijingue",
    Estado: "5"
  },
  {
    ID: "599",
    Nome: "Quixabeira",
    Estado: "5"
  },
  {
    ID: "600",
    Nome: "Rafael Jambeiro",
    Estado: "5"
  },
  {
    ID: "601",
    Nome: "Remanso",
    Estado: "5"
  },
  {
    ID: "602",
    Nome: "Retirol\xE2ndia",
    Estado: "5"
  },
  {
    ID: "603",
    Nome: "Riach\xE3o das Neves",
    Estado: "5"
  },
  {
    ID: "604",
    Nome: "Riach\xE3o do Jacu\xEDpe",
    Estado: "5"
  },
  {
    ID: "605",
    Nome: "Riacho de Santana",
    Estado: "5"
  },
  {
    ID: "606",
    Nome: "Ribeira do Amparo",
    Estado: "5"
  },
  {
    ID: "607",
    Nome: "Ribeira do Pombal",
    Estado: "5"
  },
  {
    ID: "608",
    Nome: "Ribeir\xE3o do Largo",
    Estado: "5"
  },
  {
    ID: "609",
    Nome: "Rio de Contas",
    Estado: "5"
  },
  {
    ID: "610",
    Nome: "Rio do Ant\xF4nio",
    Estado: "5"
  },
  {
    ID: "611",
    Nome: "Rio do Pires",
    Estado: "5"
  },
  {
    ID: "612",
    Nome: "Rio Real",
    Estado: "5"
  },
  {
    ID: "613",
    Nome: "Rodelas",
    Estado: "5"
  },
  {
    ID: "614",
    Nome: "Ruy Barbosa",
    Estado: "5"
  },
  {
    ID: "615",
    Nome: "Salinas da Margarida",
    Estado: "5"
  },
  {
    ID: "616",
    Nome: "Salvador",
    Estado: "5"
  },
  {
    ID: "617",
    Nome: "Santa B\xE1rbara",
    Estado: "5"
  },
  {
    ID: "618",
    Nome: "Santa Br\xEDgida",
    Estado: "5"
  },
  {
    ID: "619",
    Nome: "Santa Cruz Cabr\xE1lia",
    Estado: "5"
  },
  {
    ID: "620",
    Nome: "Santa Cruz da Vit\xF3ria",
    Estado: "5"
  },
  {
    ID: "621",
    Nome: "Santa In\xEAs",
    Estado: "5"
  },
  {
    ID: "622",
    Nome: "Santa Luzia",
    Estado: "5"
  },
  {
    ID: "623",
    Nome: "Santa Maria da Vit\xF3ria",
    Estado: "5"
  },
  {
    ID: "624",
    Nome: "Santa Rita de C\xE1ssia",
    Estado: "5"
  },
  {
    ID: "625",
    Nome: "Santa Teresinha",
    Estado: "5"
  },
  {
    ID: "626",
    Nome: "Santaluz",
    Estado: "5"
  },
  {
    ID: "627",
    Nome: "Santana",
    Estado: "5"
  },
  {
    ID: "628",
    Nome: "Santan\xF3polis",
    Estado: "5"
  },
  {
    ID: "629",
    Nome: "Santo Amaro",
    Estado: "5"
  },
  {
    ID: "630",
    Nome: "Santo Ant\xF4nio de Jesus",
    Estado: "5"
  },
  {
    ID: "631",
    Nome: "Santo Est\xEAv\xE3o",
    Estado: "5"
  },
  {
    ID: "632",
    Nome: "S\xE3o Desid\xE9rio",
    Estado: "5"
  },
  {
    ID: "633",
    Nome: "S\xE3o Domingos",
    Estado: "5"
  },
  {
    ID: "634",
    Nome: "S\xE3o Felipe",
    Estado: "5"
  },
  {
    ID: "635",
    Nome: "S\xE3o F\xE9lix",
    Estado: "5"
  },
  {
    ID: "636",
    Nome: "S\xE3o F\xE9lix do Coribe",
    Estado: "5"
  },
  {
    ID: "637",
    Nome: "S\xE3o Francisco do Conde",
    Estado: "5"
  },
  {
    ID: "638",
    Nome: "S\xE3o Gabriel",
    Estado: "5"
  },
  {
    ID: "639",
    Nome: "S\xE3o Gon\xE7alo dos Campos",
    Estado: "5"
  },
  {
    ID: "640",
    Nome: "S\xE3o Jos\xE9 da Vit\xF3ria",
    Estado: "5"
  },
  {
    ID: "641",
    Nome: "S\xE3o Jos\xE9 do Jacu\xEDpe",
    Estado: "5"
  },
  {
    ID: "642",
    Nome: "S\xE3o Miguel das Matas",
    Estado: "5"
  },
  {
    ID: "643",
    Nome: "S\xE3o Sebasti\xE3o do Pass\xE9",
    Estado: "5"
  },
  {
    ID: "644",
    Nome: "Sapea\xE7u",
    Estado: "5"
  },
  {
    ID: "645",
    Nome: "S\xE1tiro Dias",
    Estado: "5"
  },
  {
    ID: "646",
    Nome: "Saubara",
    Estado: "5"
  },
  {
    ID: "647",
    Nome: "Sa\xFAde",
    Estado: "5"
  },
  {
    ID: "648",
    Nome: "Seabra",
    Estado: "5"
  },
  {
    ID: "649",
    Nome: "Sebasti\xE3o Laranjeiras",
    Estado: "5"
  },
  {
    ID: "650",
    Nome: "Senhor do Bonfim",
    Estado: "5"
  },
  {
    ID: "651",
    Nome: "Sento S\xE9",
    Estado: "5"
  },
  {
    ID: "652",
    Nome: "Serra do Ramalho",
    Estado: "5"
  },
  {
    ID: "653",
    Nome: "Serra Dourada",
    Estado: "5"
  },
  {
    ID: "654",
    Nome: "Serra Preta",
    Estado: "5"
  },
  {
    ID: "655",
    Nome: "Serrinha",
    Estado: "5"
  },
  {
    ID: "656",
    Nome: "Serrol\xE2ndia",
    Estado: "5"
  },
  {
    ID: "657",
    Nome: "Sim\xF5es Filho",
    Estado: "5"
  },
  {
    ID: "658",
    Nome: "S\xEDtio do Mato",
    Estado: "5"
  },
  {
    ID: "659",
    Nome: "S\xEDtio do Quinto",
    Estado: "5"
  },
  {
    ID: "660",
    Nome: "Sobradinho",
    Estado: "5"
  },
  {
    ID: "661",
    Nome: "Souto Soares",
    Estado: "5"
  },
  {
    ID: "662",
    Nome: "Tabocas do Brejo Velho",
    Estado: "5"
  },
  {
    ID: "663",
    Nome: "Tanha\xE7u",
    Estado: "5"
  },
  {
    ID: "664",
    Nome: "Tanque Novo",
    Estado: "5"
  },
  {
    ID: "665",
    Nome: "Tanquinho",
    Estado: "5"
  },
  {
    ID: "666",
    Nome: "Tapero\xE1",
    Estado: "5"
  },
  {
    ID: "667",
    Nome: "Tapiramut\xE1",
    Estado: "5"
  },
  {
    ID: "668",
    Nome: "Teixeira de Freitas",
    Estado: "5"
  },
  {
    ID: "669",
    Nome: "Teodoro Sampaio",
    Estado: "5"
  },
  {
    ID: "670",
    Nome: "Teofil\xE2ndia",
    Estado: "5"
  },
  {
    ID: "671",
    Nome: "Teol\xE2ndia",
    Estado: "5"
  },
  {
    ID: "672",
    Nome: "Terra Nova",
    Estado: "5"
  },
  {
    ID: "673",
    Nome: "Tremedal",
    Estado: "5"
  },
  {
    ID: "674",
    Nome: "Tucano",
    Estado: "5"
  },
  {
    ID: "675",
    Nome: "Uau\xE1",
    Estado: "5"
  },
  {
    ID: "676",
    Nome: "Uba\xEDra",
    Estado: "5"
  },
  {
    ID: "677",
    Nome: "Ubaitaba",
    Estado: "5"
  },
  {
    ID: "678",
    Nome: "Ubat\xE3",
    Estado: "5"
  },
  {
    ID: "679",
    Nome: "Uiba\xED",
    Estado: "5"
  },
  {
    ID: "680",
    Nome: "Umburanas",
    Estado: "5"
  },
  {
    ID: "681",
    Nome: "Una",
    Estado: "5"
  },
  {
    ID: "682",
    Nome: "Urandi",
    Estado: "5"
  },
  {
    ID: "683",
    Nome: "Uru\xE7uca",
    Estado: "5"
  },
  {
    ID: "684",
    Nome: "Utinga",
    Estado: "5"
  },
  {
    ID: "685",
    Nome: "Valen\xE7a",
    Estado: "5"
  },
  {
    ID: "686",
    Nome: "Valente",
    Estado: "5"
  },
  {
    ID: "687",
    Nome: "V\xE1rzea da Ro\xE7a",
    Estado: "5"
  },
  {
    ID: "688",
    Nome: "V\xE1rzea do Po\xE7o",
    Estado: "5"
  },
  {
    ID: "689",
    Nome: "V\xE1rzea Nova",
    Estado: "5"
  },
  {
    ID: "690",
    Nome: "Varzedo",
    Estado: "5"
  },
  {
    ID: "691",
    Nome: "Vera Cruz",
    Estado: "5"
  },
  {
    ID: "692",
    Nome: "Vereda",
    Estado: "5"
  },
  {
    ID: "693",
    Nome: "Vit\xF3ria da Conquista",
    Estado: "5"
  },
  {
    ID: "694",
    Nome: "Wagner",
    Estado: "5"
  },
  {
    ID: "695",
    Nome: "Wanderley",
    Estado: "5"
  },
  {
    ID: "696",
    Nome: "Wenceslau Guimar\xE3es",
    Estado: "5"
  },
  {
    ID: "697",
    Nome: "Xique-Xique",
    Estado: "5"
  },
  {
    ID: "698",
    Nome: "Abaiara",
    Estado: "6"
  },
  {
    ID: "699",
    Nome: "Acarape",
    Estado: "6"
  },
  {
    ID: "700",
    Nome: "Acara\xFA",
    Estado: "6"
  },
  {
    ID: "701",
    Nome: "Acopiara",
    Estado: "6"
  },
  {
    ID: "702",
    Nome: "Aiuaba",
    Estado: "6"
  },
  {
    ID: "703",
    Nome: "Alc\xE2ntaras",
    Estado: "6"
  },
  {
    ID: "704",
    Nome: "Altaneira",
    Estado: "6"
  },
  {
    ID: "705",
    Nome: "Alto Santo",
    Estado: "6"
  },
  {
    ID: "706",
    Nome: "Amontada",
    Estado: "6"
  },
  {
    ID: "707",
    Nome: "Antonina do Norte",
    Estado: "6"
  },
  {
    ID: "708",
    Nome: "Apuiar\xE9s",
    Estado: "6"
  },
  {
    ID: "709",
    Nome: "Aquiraz",
    Estado: "6"
  },
  {
    ID: "710",
    Nome: "Aracati",
    Estado: "6"
  },
  {
    ID: "711",
    Nome: "Aracoiaba",
    Estado: "6"
  },
  {
    ID: "712",
    Nome: "Ararend\xE1",
    Estado: "6"
  },
  {
    ID: "713",
    Nome: "Araripe",
    Estado: "6"
  },
  {
    ID: "714",
    Nome: "Aratuba",
    Estado: "6"
  },
  {
    ID: "715",
    Nome: "Arneiroz",
    Estado: "6"
  },
  {
    ID: "716",
    Nome: "Assar\xE9",
    Estado: "6"
  },
  {
    ID: "717",
    Nome: "Aurora",
    Estado: "6"
  },
  {
    ID: "718",
    Nome: "Baixio",
    Estado: "6"
  },
  {
    ID: "719",
    Nome: "Banabui\xFA",
    Estado: "6"
  },
  {
    ID: "720",
    Nome: "Barbalha",
    Estado: "6"
  },
  {
    ID: "721",
    Nome: "Barreira",
    Estado: "6"
  },
  {
    ID: "722",
    Nome: "Barro",
    Estado: "6"
  },
  {
    ID: "723",
    Nome: "Barroquinha",
    Estado: "6"
  },
  {
    ID: "724",
    Nome: "Baturit\xE9",
    Estado: "6"
  },
  {
    ID: "725",
    Nome: "Beberibe",
    Estado: "6"
  },
  {
    ID: "726",
    Nome: "Bela Cruz",
    Estado: "6"
  },
  {
    ID: "727",
    Nome: "Boa Viagem",
    Estado: "6"
  },
  {
    ID: "728",
    Nome: "Brejo Santo",
    Estado: "6"
  },
  {
    ID: "729",
    Nome: "Camocim",
    Estado: "6"
  },
  {
    ID: "730",
    Nome: "Campos Sales",
    Estado: "6"
  },
  {
    ID: "731",
    Nome: "Canind\xE9",
    Estado: "6"
  },
  {
    ID: "732",
    Nome: "Capistrano",
    Estado: "6"
  },
  {
    ID: "733",
    Nome: "Caridade",
    Estado: "6"
  },
  {
    ID: "734",
    Nome: "Carir\xE9",
    Estado: "6"
  },
  {
    ID: "735",
    Nome: "Cariria\xE7u",
    Estado: "6"
  },
  {
    ID: "736",
    Nome: "Cari\xFAs",
    Estado: "6"
  },
  {
    ID: "737",
    Nome: "Carnaubal",
    Estado: "6"
  },
  {
    ID: "738",
    Nome: "Cascavel",
    Estado: "6"
  },
  {
    ID: "739",
    Nome: "Catarina",
    Estado: "6"
  },
  {
    ID: "740",
    Nome: "Catunda",
    Estado: "6"
  },
  {
    ID: "741",
    Nome: "Caucaia",
    Estado: "6"
  },
  {
    ID: "742",
    Nome: "Cedro",
    Estado: "6"
  },
  {
    ID: "743",
    Nome: "Chaval",
    Estado: "6"
  },
  {
    ID: "744",
    Nome: "Chor\xF3",
    Estado: "6"
  },
  {
    ID: "745",
    Nome: "Chorozinho",
    Estado: "6"
  },
  {
    ID: "746",
    Nome: "Corea\xFA",
    Estado: "6"
  },
  {
    ID: "747",
    Nome: "Crate\xFAs",
    Estado: "6"
  },
  {
    ID: "748",
    Nome: "Crato",
    Estado: "6"
  },
  {
    ID: "749",
    Nome: "Croat\xE1",
    Estado: "6"
  },
  {
    ID: "750",
    Nome: "Cruz",
    Estado: "6"
  },
  {
    ID: "751",
    Nome: "Deputado Irapuan Pinheiro",
    Estado: "6"
  },
  {
    ID: "752",
    Nome: "Erer\xEA",
    Estado: "6"
  },
  {
    ID: "753",
    Nome: "Eus\xE9bio",
    Estado: "6"
  },
  {
    ID: "754",
    Nome: "Farias Brito",
    Estado: "6"
  },
  {
    ID: "755",
    Nome: "Forquilha",
    Estado: "6"
  },
  {
    ID: "756",
    Nome: "Fortaleza",
    Estado: "6"
  },
  {
    ID: "757",
    Nome: "Fortim",
    Estado: "6"
  },
  {
    ID: "758",
    Nome: "Frecheirinha",
    Estado: "6"
  },
  {
    ID: "759",
    Nome: "General Sampaio",
    Estado: "6"
  },
  {
    ID: "760",
    Nome: "Gra\xE7a",
    Estado: "6"
  },
  {
    ID: "761",
    Nome: "Granja",
    Estado: "6"
  },
  {
    ID: "762",
    Nome: "Granjeiro",
    Estado: "6"
  },
  {
    ID: "763",
    Nome: "Groa\xEDras",
    Estado: "6"
  },
  {
    ID: "764",
    Nome: "Guai\xFAba",
    Estado: "6"
  },
  {
    ID: "765",
    Nome: "Guaraciaba do Norte",
    Estado: "6"
  },
  {
    ID: "766",
    Nome: "Guaramiranga",
    Estado: "6"
  },
  {
    ID: "767",
    Nome: "Hidrol\xE2ndia",
    Estado: "6"
  },
  {
    ID: "768",
    Nome: "Horizonte",
    Estado: "6"
  },
  {
    ID: "769",
    Nome: "Ibaretama",
    Estado: "6"
  },
  {
    ID: "770",
    Nome: "Ibiapina",
    Estado: "6"
  },
  {
    ID: "771",
    Nome: "Ibicuitinga",
    Estado: "6"
  },
  {
    ID: "772",
    Nome: "Icapu\xED",
    Estado: "6"
  },
  {
    ID: "773",
    Nome: "Ic\xF3",
    Estado: "6"
  },
  {
    ID: "774",
    Nome: "Iguatu",
    Estado: "6"
  },
  {
    ID: "775",
    Nome: "Independ\xEAncia",
    Estado: "6"
  },
  {
    ID: "776",
    Nome: "Ipaporanga",
    Estado: "6"
  },
  {
    ID: "777",
    Nome: "Ipaumirim",
    Estado: "6"
  },
  {
    ID: "778",
    Nome: "Ipu",
    Estado: "6"
  },
  {
    ID: "779",
    Nome: "Ipueiras",
    Estado: "6"
  },
  {
    ID: "780",
    Nome: "Iracema",
    Estado: "6"
  },
  {
    ID: "781",
    Nome: "Irau\xE7uba",
    Estado: "6"
  },
  {
    ID: "782",
    Nome: "Itai\xE7aba",
    Estado: "6"
  },
  {
    ID: "783",
    Nome: "Itaitinga",
    Estado: "6"
  },
  {
    ID: "784",
    Nome: "Itapag\xE9",
    Estado: "6"
  },
  {
    ID: "785",
    Nome: "Itapipoca",
    Estado: "6"
  },
  {
    ID: "786",
    Nome: "Itapi\xFAna",
    Estado: "6"
  },
  {
    ID: "787",
    Nome: "Itarema",
    Estado: "6"
  },
  {
    ID: "788",
    Nome: "Itatira",
    Estado: "6"
  },
  {
    ID: "789",
    Nome: "Jaguaretama",
    Estado: "6"
  },
  {
    ID: "790",
    Nome: "Jaguaribara",
    Estado: "6"
  },
  {
    ID: "791",
    Nome: "Jaguaribe",
    Estado: "6"
  },
  {
    ID: "792",
    Nome: "Jaguaruana",
    Estado: "6"
  },
  {
    ID: "793",
    Nome: "Jardim",
    Estado: "6"
  },
  {
    ID: "794",
    Nome: "Jati",
    Estado: "6"
  },
  {
    ID: "795",
    Nome: "Jijoca de Jericoacoara",
    Estado: "6"
  },
  {
    ID: "796",
    Nome: "Juazeiro do Norte",
    Estado: "6"
  },
  {
    ID: "797",
    Nome: "Juc\xE1s",
    Estado: "6"
  },
  {
    ID: "798",
    Nome: "Lavras da Mangabeira",
    Estado: "6"
  },
  {
    ID: "799",
    Nome: "Limoeiro do Norte",
    Estado: "6"
  },
  {
    ID: "800",
    Nome: "Madalena",
    Estado: "6"
  },
  {
    ID: "801",
    Nome: "Maracana\xFA",
    Estado: "6"
  },
  {
    ID: "802",
    Nome: "Maranguape",
    Estado: "6"
  },
  {
    ID: "803",
    Nome: "Marco",
    Estado: "6"
  },
  {
    ID: "804",
    Nome: "Martin\xF3pole",
    Estado: "6"
  },
  {
    ID: "805",
    Nome: "Massap\xEA",
    Estado: "6"
  },
  {
    ID: "806",
    Nome: "Mauriti",
    Estado: "6"
  },
  {
    ID: "807",
    Nome: "Meruoca",
    Estado: "6"
  },
  {
    ID: "808",
    Nome: "Milagres",
    Estado: "6"
  },
  {
    ID: "809",
    Nome: "Milh\xE3",
    Estado: "6"
  },
  {
    ID: "810",
    Nome: "Mira\xEDma",
    Estado: "6"
  },
  {
    ID: "811",
    Nome: "Miss\xE3o Velha",
    Estado: "6"
  },
  {
    ID: "812",
    Nome: "Momba\xE7a",
    Estado: "6"
  },
  {
    ID: "813",
    Nome: "Monsenhor Tabosa",
    Estado: "6"
  },
  {
    ID: "814",
    Nome: "Morada Nova",
    Estado: "6"
  },
  {
    ID: "815",
    Nome: "Mora\xFAjo",
    Estado: "6"
  },
  {
    ID: "816",
    Nome: "Morrinhos",
    Estado: "6"
  },
  {
    ID: "817",
    Nome: "Mucambo",
    Estado: "6"
  },
  {
    ID: "818",
    Nome: "Mulungu",
    Estado: "6"
  },
  {
    ID: "819",
    Nome: "Nova Olinda",
    Estado: "6"
  },
  {
    ID: "820",
    Nome: "Nova Russas",
    Estado: "6"
  },
  {
    ID: "821",
    Nome: "Novo Oriente",
    Estado: "6"
  },
  {
    ID: "822",
    Nome: "Ocara",
    Estado: "6"
  },
  {
    ID: "823",
    Nome: "Or\xF3s",
    Estado: "6"
  },
  {
    ID: "824",
    Nome: "Pacajus",
    Estado: "6"
  },
  {
    ID: "825",
    Nome: "Pacatuba",
    Estado: "6"
  },
  {
    ID: "826",
    Nome: "Pacoti",
    Estado: "6"
  },
  {
    ID: "827",
    Nome: "Pacuj\xE1",
    Estado: "6"
  },
  {
    ID: "828",
    Nome: "Palhano",
    Estado: "6"
  },
  {
    ID: "829",
    Nome: "Palm\xE1cia",
    Estado: "6"
  },
  {
    ID: "830",
    Nome: "Paracuru",
    Estado: "6"
  },
  {
    ID: "831",
    Nome: "Paraipaba",
    Estado: "6"
  },
  {
    ID: "832",
    Nome: "Parambu",
    Estado: "6"
  },
  {
    ID: "833",
    Nome: "Paramoti",
    Estado: "6"
  },
  {
    ID: "834",
    Nome: "Pedra Branca",
    Estado: "6"
  },
  {
    ID: "835",
    Nome: "Penaforte",
    Estado: "6"
  },
  {
    ID: "836",
    Nome: "Pentecoste",
    Estado: "6"
  },
  {
    ID: "837",
    Nome: "Pereiro",
    Estado: "6"
  },
  {
    ID: "838",
    Nome: "Pindoretama",
    Estado: "6"
  },
  {
    ID: "839",
    Nome: "Piquet Carneiro",
    Estado: "6"
  },
  {
    ID: "840",
    Nome: "Pires Ferreira",
    Estado: "6"
  },
  {
    ID: "841",
    Nome: "Poranga",
    Estado: "6"
  },
  {
    ID: "842",
    Nome: "Porteiras",
    Estado: "6"
  },
  {
    ID: "843",
    Nome: "Potengi",
    Estado: "6"
  },
  {
    ID: "844",
    Nome: "Potiretama",
    Estado: "6"
  },
  {
    ID: "845",
    Nome: "Quiterian\xF3polis",
    Estado: "6"
  },
  {
    ID: "846",
    Nome: "Quixad\xE1",
    Estado: "6"
  },
  {
    ID: "847",
    Nome: "Quixel\xF4",
    Estado: "6"
  },
  {
    ID: "848",
    Nome: "Quixeramobim",
    Estado: "6"
  },
  {
    ID: "849",
    Nome: "Quixer\xE9",
    Estado: "6"
  },
  {
    ID: "850",
    Nome: "Reden\xE7\xE3o",
    Estado: "6"
  },
  {
    ID: "851",
    Nome: "Reriutaba",
    Estado: "6"
  },
  {
    ID: "852",
    Nome: "Russas",
    Estado: "6"
  },
  {
    ID: "853",
    Nome: "Saboeiro",
    Estado: "6"
  },
  {
    ID: "854",
    Nome: "Salitre",
    Estado: "6"
  },
  {
    ID: "855",
    Nome: "Santa Quit\xE9ria",
    Estado: "6"
  },
  {
    ID: "856",
    Nome: "Santana do Acara\xFA",
    Estado: "6"
  },
  {
    ID: "857",
    Nome: "Santana do Cariri",
    Estado: "6"
  },
  {
    ID: "858",
    Nome: "S\xE3o Benedito",
    Estado: "6"
  },
  {
    ID: "859",
    Nome: "S\xE3o Gon\xE7alo do Amarante",
    Estado: "6"
  },
  {
    ID: "860",
    Nome: "S\xE3o Jo\xE3o do Jaguaribe",
    Estado: "6"
  },
  {
    ID: "861",
    Nome: "S\xE3o Lu\xEDs do Curu",
    Estado: "6"
  },
  {
    ID: "862",
    Nome: "Senador Pompeu",
    Estado: "6"
  },
  {
    ID: "863",
    Nome: "Senador S\xE1",
    Estado: "6"
  },
  {
    ID: "864",
    Nome: "Sobral",
    Estado: "6"
  },
  {
    ID: "865",
    Nome: "Solon\xF3pole",
    Estado: "6"
  },
  {
    ID: "866",
    Nome: "Tabuleiro do Norte",
    Estado: "6"
  },
  {
    ID: "867",
    Nome: "Tamboril",
    Estado: "6"
  },
  {
    ID: "868",
    Nome: "Tarrafas",
    Estado: "6"
  },
  {
    ID: "869",
    Nome: "Tau\xE1",
    Estado: "6"
  },
  {
    ID: "870",
    Nome: "Teju\xE7uoca",
    Estado: "6"
  },
  {
    ID: "871",
    Nome: "Tiangu\xE1",
    Estado: "6"
  },
  {
    ID: "872",
    Nome: "Trairi",
    Estado: "6"
  },
  {
    ID: "873",
    Nome: "Tururu",
    Estado: "6"
  },
  {
    ID: "874",
    Nome: "Ubajara",
    Estado: "6"
  },
  {
    ID: "875",
    Nome: "Umari",
    Estado: "6"
  },
  {
    ID: "876",
    Nome: "Umirim",
    Estado: "6"
  },
  {
    ID: "877",
    Nome: "Uruburetama",
    Estado: "6"
  },
  {
    ID: "878",
    Nome: "Uruoca",
    Estado: "6"
  },
  {
    ID: "879",
    Nome: "Varjota",
    Estado: "6"
  },
  {
    ID: "880",
    Nome: "V\xE1rzea Alegre",
    Estado: "6"
  },
  {
    ID: "881",
    Nome: "Vi\xE7osa do Cear\xE1",
    Estado: "6"
  },
  {
    ID: "882",
    Nome: "Bras\xEDlia",
    Estado: "7"
  },
  {
    ID: "883",
    Nome: "Abadia de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "884",
    Nome: "Abadi\xE2nia",
    Estado: "9"
  },
  {
    ID: "885",
    Nome: "Acre\xFAna",
    Estado: "9"
  },
  {
    ID: "886",
    Nome: "Adel\xE2ndia",
    Estado: "9"
  },
  {
    ID: "887",
    Nome: "\xC1gua Fria de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "888",
    Nome: "\xC1gua Limpa",
    Estado: "9"
  },
  {
    ID: "889",
    Nome: "\xC1guas Lindas de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "890",
    Nome: "Alex\xE2nia",
    Estado: "9"
  },
  {
    ID: "891",
    Nome: "Alo\xE2ndia",
    Estado: "9"
  },
  {
    ID: "892",
    Nome: "Alto Horizonte",
    Estado: "9"
  },
  {
    ID: "893",
    Nome: "Alto Para\xEDso de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "894",
    Nome: "Alvorada do Norte",
    Estado: "9"
  },
  {
    ID: "895",
    Nome: "Amaralina",
    Estado: "9"
  },
  {
    ID: "896",
    Nome: "Americano do Brasil",
    Estado: "9"
  },
  {
    ID: "897",
    Nome: "Amorin\xF3polis",
    Estado: "9"
  },
  {
    ID: "898",
    Nome: "An\xE1polis",
    Estado: "9"
  },
  {
    ID: "899",
    Nome: "Anhanguera",
    Estado: "9"
  },
  {
    ID: "900",
    Nome: "Anicuns",
    Estado: "9"
  },
  {
    ID: "901",
    Nome: "Aparecida de Goi\xE2nia",
    Estado: "9"
  },
  {
    ID: "902",
    Nome: "Aparecida do Rio Doce",
    Estado: "9"
  },
  {
    ID: "903",
    Nome: "Apor\xE9",
    Estado: "9"
  },
  {
    ID: "904",
    Nome: "Ara\xE7u",
    Estado: "9"
  },
  {
    ID: "905",
    Nome: "Aragar\xE7as",
    Estado: "9"
  },
  {
    ID: "906",
    Nome: "Aragoi\xE2nia",
    Estado: "9"
  },
  {
    ID: "907",
    Nome: "Araguapaz",
    Estado: "9"
  },
  {
    ID: "908",
    Nome: "Aren\xF3polis",
    Estado: "9"
  },
  {
    ID: "909",
    Nome: "Aruan\xE3",
    Estado: "9"
  },
  {
    ID: "910",
    Nome: "Auril\xE2ndia",
    Estado: "9"
  },
  {
    ID: "911",
    Nome: "Avelin\xF3polis",
    Estado: "9"
  },
  {
    ID: "912",
    Nome: "Baliza",
    Estado: "9"
  },
  {
    ID: "913",
    Nome: "Barro Alto",
    Estado: "9"
  },
  {
    ID: "914",
    Nome: "Bela Vista de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "915",
    Nome: "Bom Jardim de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "916",
    Nome: "Bom Jesus de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "917",
    Nome: "Bonfin\xF3polis",
    Estado: "9"
  },
  {
    ID: "918",
    Nome: "Bon\xF3polis",
    Estado: "9"
  },
  {
    ID: "919",
    Nome: "Brazabrantes",
    Estado: "9"
  },
  {
    ID: "920",
    Nome: "Brit\xE2nia",
    Estado: "9"
  },
  {
    ID: "921",
    Nome: "Buriti Alegre",
    Estado: "9"
  },
  {
    ID: "922",
    Nome: "Buriti de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "923",
    Nome: "Buritin\xF3polis",
    Estado: "9"
  },
  {
    ID: "924",
    Nome: "Cabeceiras",
    Estado: "9"
  },
  {
    ID: "925",
    Nome: "Cachoeira Alta",
    Estado: "9"
  },
  {
    ID: "926",
    Nome: "Cachoeira de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "927",
    Nome: "Cachoeira Dourada",
    Estado: "9"
  },
  {
    ID: "928",
    Nome: "Ca\xE7u",
    Estado: "9"
  },
  {
    ID: "929",
    Nome: "Caiap\xF4nia",
    Estado: "9"
  },
  {
    ID: "930",
    Nome: "Caldas Novas",
    Estado: "9"
  },
  {
    ID: "931",
    Nome: "Caldazinha",
    Estado: "9"
  },
  {
    ID: "932",
    Nome: "Campestre de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "933",
    Nome: "Campina\xE7u",
    Estado: "9"
  },
  {
    ID: "934",
    Nome: "Campinorte",
    Estado: "9"
  },
  {
    ID: "935",
    Nome: "Campo Alegre de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "936",
    Nome: "Campo Limpo de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "937",
    Nome: "Campos Belos",
    Estado: "9"
  },
  {
    ID: "938",
    Nome: "Campos Verdes",
    Estado: "9"
  },
  {
    ID: "939",
    Nome: "Carmo do Rio Verde",
    Estado: "9"
  },
  {
    ID: "940",
    Nome: "Castel\xE2ndia",
    Estado: "9"
  },
  {
    ID: "941",
    Nome: "Catal\xE3o",
    Estado: "9"
  },
  {
    ID: "942",
    Nome: "Catura\xED",
    Estado: "9"
  },
  {
    ID: "943",
    Nome: "Cavalcante",
    Estado: "9"
  },
  {
    ID: "944",
    Nome: "Ceres",
    Estado: "9"
  },
  {
    ID: "945",
    Nome: "Cezarina",
    Estado: "9"
  },
  {
    ID: "946",
    Nome: "Chapad\xE3o do C\xE9u",
    Estado: "9"
  },
  {
    ID: "947",
    Nome: "Cidade Ocidental",
    Estado: "9"
  },
  {
    ID: "948",
    Nome: "Cocalzinho de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "949",
    Nome: "Colinas do Sul",
    Estado: "9"
  },
  {
    ID: "950",
    Nome: "C\xF3rrego do Ouro",
    Estado: "9"
  },
  {
    ID: "951",
    Nome: "Corumb\xE1 de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "952",
    Nome: "Corumba\xEDba",
    Estado: "9"
  },
  {
    ID: "953",
    Nome: "Cristalina",
    Estado: "9"
  },
  {
    ID: "954",
    Nome: "Cristian\xF3polis",
    Estado: "9"
  },
  {
    ID: "955",
    Nome: "Crix\xE1s",
    Estado: "9"
  },
  {
    ID: "956",
    Nome: "Crom\xEDnia",
    Estado: "9"
  },
  {
    ID: "957",
    Nome: "Cumari",
    Estado: "9"
  },
  {
    ID: "958",
    Nome: "Damian\xF3polis",
    Estado: "9"
  },
  {
    ID: "959",
    Nome: "Damol\xE2ndia",
    Estado: "9"
  },
  {
    ID: "960",
    Nome: "Davin\xF3polis",
    Estado: "9"
  },
  {
    ID: "961",
    Nome: "Diorama",
    Estado: "9"
  },
  {
    ID: "962",
    Nome: "Divin\xF3polis de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "963",
    Nome: "Doverl\xE2ndia",
    Estado: "9"
  },
  {
    ID: "964",
    Nome: "Edealina",
    Estado: "9"
  },
  {
    ID: "965",
    Nome: "Ed\xE9ia",
    Estado: "9"
  },
  {
    ID: "966",
    Nome: "Estrela do Norte",
    Estado: "9"
  },
  {
    ID: "967",
    Nome: "Faina",
    Estado: "9"
  },
  {
    ID: "968",
    Nome: "Fazenda Nova",
    Estado: "9"
  },
  {
    ID: "969",
    Nome: "Firmin\xF3polis",
    Estado: "9"
  },
  {
    ID: "970",
    Nome: "Flores de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "971",
    Nome: "Formosa",
    Estado: "9"
  },
  {
    ID: "972",
    Nome: "Formoso",
    Estado: "9"
  },
  {
    ID: "973",
    Nome: "Gameleira de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "974",
    Nome: "Goian\xE1polis",
    Estado: "9"
  },
  {
    ID: "975",
    Nome: "Goiandira",
    Estado: "9"
  },
  {
    ID: "976",
    Nome: "Goian\xE9sia",
    Estado: "9"
  },
  {
    ID: "977",
    Nome: "Goi\xE2nia",
    Estado: "9"
  },
  {
    ID: "978",
    Nome: "Goianira",
    Estado: "9"
  },
  {
    ID: "979",
    Nome: "Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "980",
    Nome: "Goiatuba",
    Estado: "9"
  },
  {
    ID: "981",
    Nome: "Gouvel\xE2ndia",
    Estado: "9"
  },
  {
    ID: "982",
    Nome: "Guap\xF3",
    Estado: "9"
  },
  {
    ID: "983",
    Nome: "Guara\xEDta",
    Estado: "9"
  },
  {
    ID: "984",
    Nome: "Guarani de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "985",
    Nome: "Guarinos",
    Estado: "9"
  },
  {
    ID: "986",
    Nome: "Heitora\xED",
    Estado: "9"
  },
  {
    ID: "987",
    Nome: "Hidrol\xE2ndia",
    Estado: "9"
  },
  {
    ID: "988",
    Nome: "Hidrolina",
    Estado: "9"
  },
  {
    ID: "989",
    Nome: "Iaciara",
    Estado: "9"
  },
  {
    ID: "990",
    Nome: "Inaciol\xE2ndia",
    Estado: "9"
  },
  {
    ID: "991",
    Nome: "Indiara",
    Estado: "9"
  },
  {
    ID: "992",
    Nome: "Inhumas",
    Estado: "9"
  },
  {
    ID: "993",
    Nome: "Ipameri",
    Estado: "9"
  },
  {
    ID: "994",
    Nome: "Ipiranga de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "995",
    Nome: "Ipor\xE1",
    Estado: "9"
  },
  {
    ID: "996",
    Nome: "Israel\xE2ndia",
    Estado: "9"
  },
  {
    ID: "997",
    Nome: "Itabera\xED",
    Estado: "9"
  },
  {
    ID: "998",
    Nome: "Itaguari",
    Estado: "9"
  },
  {
    ID: "999",
    Nome: "Itaguaru",
    Estado: "9"
  },
  {
    ID: "1000",
    Nome: "Itaj\xE1",
    Estado: "9"
  },
  {
    ID: "1001",
    Nome: "Itapaci",
    Estado: "9"
  },
  {
    ID: "1002",
    Nome: "Itapirapu\xE3",
    Estado: "9"
  },
  {
    ID: "1003",
    Nome: "Itapuranga",
    Estado: "9"
  },
  {
    ID: "1004",
    Nome: "Itarum\xE3",
    Estado: "9"
  },
  {
    ID: "1005",
    Nome: "Itau\xE7u",
    Estado: "9"
  },
  {
    ID: "1006",
    Nome: "Itumbiara",
    Estado: "9"
  },
  {
    ID: "1007",
    Nome: "Ivol\xE2ndia",
    Estado: "9"
  },
  {
    ID: "1008",
    Nome: "Jandaia",
    Estado: "9"
  },
  {
    ID: "1009",
    Nome: "Jaragu\xE1",
    Estado: "9"
  },
  {
    ID: "1010",
    Nome: "Jata\xED",
    Estado: "9"
  },
  {
    ID: "1011",
    Nome: "Jaupaci",
    Estado: "9"
  },
  {
    ID: "1012",
    Nome: "Jes\xFApolis",
    Estado: "9"
  },
  {
    ID: "1013",
    Nome: "Jovi\xE2nia",
    Estado: "9"
  },
  {
    ID: "1014",
    Nome: "Jussara",
    Estado: "9"
  },
  {
    ID: "1015",
    Nome: "Lagoa Santa",
    Estado: "9"
  },
  {
    ID: "1016",
    Nome: "Leopoldo de Bulh\xF5es",
    Estado: "9"
  },
  {
    ID: "1017",
    Nome: "Luzi\xE2nia",
    Estado: "9"
  },
  {
    ID: "1018",
    Nome: "Mairipotaba",
    Estado: "9"
  },
  {
    ID: "1019",
    Nome: "Mamba\xED",
    Estado: "9"
  },
  {
    ID: "1020",
    Nome: "Mara Rosa",
    Estado: "9"
  },
  {
    ID: "1021",
    Nome: "Marzag\xE3o",
    Estado: "9"
  },
  {
    ID: "1022",
    Nome: "Matrinch\xE3",
    Estado: "9"
  },
  {
    ID: "1023",
    Nome: "Mauril\xE2ndia",
    Estado: "9"
  },
  {
    ID: "1024",
    Nome: "Mimoso de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1025",
    Nome: "Mina\xE7u",
    Estado: "9"
  },
  {
    ID: "1026",
    Nome: "Mineiros",
    Estado: "9"
  },
  {
    ID: "1027",
    Nome: "Moipor\xE1",
    Estado: "9"
  },
  {
    ID: "1028",
    Nome: "Monte Alegre de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1029",
    Nome: "Montes Claros de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1030",
    Nome: "Montividiu",
    Estado: "9"
  },
  {
    ID: "1031",
    Nome: "Montividiu do Norte",
    Estado: "9"
  },
  {
    ID: "1032",
    Nome: "Morrinhos",
    Estado: "9"
  },
  {
    ID: "1033",
    Nome: "Morro Agudo de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1034",
    Nome: "Moss\xE2medes",
    Estado: "9"
  },
  {
    ID: "1035",
    Nome: "Mozarl\xE2ndia",
    Estado: "9"
  },
  {
    ID: "1036",
    Nome: "Mundo Novo",
    Estado: "9"
  },
  {
    ID: "1037",
    Nome: "Mutun\xF3polis",
    Estado: "9"
  },
  {
    ID: "1038",
    Nome: "Naz\xE1rio",
    Estado: "9"
  },
  {
    ID: "1039",
    Nome: "Ner\xF3polis",
    Estado: "9"
  },
  {
    ID: "1040",
    Nome: "Niquel\xE2ndia",
    Estado: "9"
  },
  {
    ID: "1041",
    Nome: "Nova Am\xE9rica",
    Estado: "9"
  },
  {
    ID: "1042",
    Nome: "Nova Aurora",
    Estado: "9"
  },
  {
    ID: "1043",
    Nome: "Nova Crix\xE1s",
    Estado: "9"
  },
  {
    ID: "1044",
    Nome: "Nova Gl\xF3ria",
    Estado: "9"
  },
  {
    ID: "1045",
    Nome: "Nova Igua\xE7u de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1046",
    Nome: "Nova Roma",
    Estado: "9"
  },
  {
    ID: "1047",
    Nome: "Nova Veneza",
    Estado: "9"
  },
  {
    ID: "1048",
    Nome: "Novo Brasil",
    Estado: "9"
  },
  {
    ID: "1049",
    Nome: "Novo Gama",
    Estado: "9"
  },
  {
    ID: "1050",
    Nome: "Novo Planalto",
    Estado: "9"
  },
  {
    ID: "1051",
    Nome: "Orizona",
    Estado: "9"
  },
  {
    ID: "1052",
    Nome: "Ouro Verde de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1053",
    Nome: "Ouvidor",
    Estado: "9"
  },
  {
    ID: "1054",
    Nome: "Padre Bernardo",
    Estado: "9"
  },
  {
    ID: "1055",
    Nome: "Palestina de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1056",
    Nome: "Palmeiras de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1057",
    Nome: "Palmelo",
    Estado: "9"
  },
  {
    ID: "1058",
    Nome: "Palmin\xF3polis",
    Estado: "9"
  },
  {
    ID: "1059",
    Nome: "Panam\xE1",
    Estado: "9"
  },
  {
    ID: "1060",
    Nome: "Paranaiguara",
    Estado: "9"
  },
  {
    ID: "1061",
    Nome: "Para\xFAna",
    Estado: "9"
  },
  {
    ID: "1062",
    Nome: "Perol\xE2ndia",
    Estado: "9"
  },
  {
    ID: "1063",
    Nome: "Petrolina de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1064",
    Nome: "Pilar de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1065",
    Nome: "Piracanjuba",
    Estado: "9"
  },
  {
    ID: "1066",
    Nome: "Piranhas",
    Estado: "9"
  },
  {
    ID: "1067",
    Nome: "Piren\xF3polis",
    Estado: "9"
  },
  {
    ID: "1068",
    Nome: "Pires do Rio",
    Estado: "9"
  },
  {
    ID: "1069",
    Nome: "Planaltina",
    Estado: "9"
  },
  {
    ID: "1070",
    Nome: "Pontalina",
    Estado: "9"
  },
  {
    ID: "1071",
    Nome: "Porangatu",
    Estado: "9"
  },
  {
    ID: "1072",
    Nome: "Porteir\xE3o",
    Estado: "9"
  },
  {
    ID: "1073",
    Nome: "Portel\xE2ndia",
    Estado: "9"
  },
  {
    ID: "1074",
    Nome: "Posse",
    Estado: "9"
  },
  {
    ID: "1075",
    Nome: "Professor Jamil",
    Estado: "9"
  },
  {
    ID: "1076",
    Nome: "Quirin\xF3polis",
    Estado: "9"
  },
  {
    ID: "1077",
    Nome: "Rialma",
    Estado: "9"
  },
  {
    ID: "1078",
    Nome: "Rian\xE1polis",
    Estado: "9"
  },
  {
    ID: "1079",
    Nome: "Rio Quente",
    Estado: "9"
  },
  {
    ID: "1080",
    Nome: "Rio Verde",
    Estado: "9"
  },
  {
    ID: "1081",
    Nome: "Rubiataba",
    Estado: "9"
  },
  {
    ID: "1082",
    Nome: "Sanclerl\xE2ndia",
    Estado: "9"
  },
  {
    ID: "1083",
    Nome: "Santa B\xE1rbara de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1084",
    Nome: "Santa Cruz de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1085",
    Nome: "Santa F\xE9 de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1086",
    Nome: "Santa Helena de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1087",
    Nome: "Santa Isabel",
    Estado: "9"
  },
  {
    ID: "1088",
    Nome: "Santa Rita do Araguaia",
    Estado: "9"
  },
  {
    ID: "1089",
    Nome: "Santa Rita do Novo Destino",
    Estado: "9"
  },
  {
    ID: "1090",
    Nome: "Santa Rosa de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1091",
    Nome: "Santa Tereza de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1092",
    Nome: "Santa Terezinha de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1093",
    Nome: "Santo Ant\xF4nio da Barra",
    Estado: "9"
  },
  {
    ID: "1094",
    Nome: "Santo Ant\xF4nio de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1095",
    Nome: "Santo Ant\xF4nio do Descoberto",
    Estado: "9"
  },
  {
    ID: "1096",
    Nome: "S\xE3o Domingos",
    Estado: "9"
  },
  {
    ID: "1097",
    Nome: "S\xE3o Francisco de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1098",
    Nome: "S\xE3o Jo\xE3o d`Alian\xE7a",
    Estado: "9"
  },
  {
    ID: "1099",
    Nome: "S\xE3o Jo\xE3o da Para\xFAna",
    Estado: "9"
  },
  {
    ID: "1100",
    Nome: "S\xE3o Lu\xEDs de Montes Belos",
    Estado: "9"
  },
  {
    ID: "1101",
    Nome: "S\xE3o Lu\xEDz do Norte",
    Estado: "9"
  },
  {
    ID: "1102",
    Nome: "S\xE3o Miguel do Araguaia",
    Estado: "9"
  },
  {
    ID: "1103",
    Nome: "S\xE3o Miguel do Passa Quatro",
    Estado: "9"
  },
  {
    ID: "1104",
    Nome: "S\xE3o Patr\xEDcio",
    Estado: "9"
  },
  {
    ID: "1105",
    Nome: "S\xE3o Sim\xE3o",
    Estado: "9"
  },
  {
    ID: "1106",
    Nome: "Senador Canedo",
    Estado: "9"
  },
  {
    ID: "1107",
    Nome: "Serran\xF3polis",
    Estado: "9"
  },
  {
    ID: "1108",
    Nome: "Silv\xE2nia",
    Estado: "9"
  },
  {
    ID: "1109",
    Nome: "Simol\xE2ndia",
    Estado: "9"
  },
  {
    ID: "1110",
    Nome: "S\xEDtio d`Abadia",
    Estado: "9"
  },
  {
    ID: "1111",
    Nome: "Taquaral de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1112",
    Nome: "Teresina de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1113",
    Nome: "Terez\xF3polis de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1114",
    Nome: "Tr\xEAs Ranchos",
    Estado: "9"
  },
  {
    ID: "1115",
    Nome: "Trindade",
    Estado: "9"
  },
  {
    ID: "1116",
    Nome: "Trombas",
    Estado: "9"
  },
  {
    ID: "1117",
    Nome: "Turv\xE2nia",
    Estado: "9"
  },
  {
    ID: "1118",
    Nome: "Turvel\xE2ndia",
    Estado: "9"
  },
  {
    ID: "1119",
    Nome: "Uirapuru",
    Estado: "9"
  },
  {
    ID: "1120",
    Nome: "Urua\xE7u",
    Estado: "9"
  },
  {
    ID: "1121",
    Nome: "Uruana",
    Estado: "9"
  },
  {
    ID: "1122",
    Nome: "Uruta\xED",
    Estado: "9"
  },
  {
    ID: "1123",
    Nome: "Valpara\xEDso de Goi\xE1s",
    Estado: "9"
  },
  {
    ID: "1124",
    Nome: "Varj\xE3o",
    Estado: "9"
  },
  {
    ID: "1125",
    Nome: "Vian\xF3polis",
    Estado: "9"
  },
  {
    ID: "1126",
    Nome: "Vicentin\xF3polis",
    Estado: "9"
  },
  {
    ID: "1127",
    Nome: "Vila Boa",
    Estado: "9"
  },
  {
    ID: "1128",
    Nome: "Vila Prop\xEDcio",
    Estado: "9"
  },
  {
    ID: "1129",
    Nome: "A\xE7ail\xE2ndia",
    Estado: "10"
  },
  {
    ID: "1130",
    Nome: "Afonso Cunha",
    Estado: "10"
  },
  {
    ID: "1131",
    Nome: "\xC1gua Doce do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1132",
    Nome: "Alc\xE2ntara",
    Estado: "10"
  },
  {
    ID: "1133",
    Nome: "Aldeias Altas",
    Estado: "10"
  },
  {
    ID: "1134",
    Nome: "Altamira do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1135",
    Nome: "Alto Alegre do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1136",
    Nome: "Alto Alegre do Pindar\xE9",
    Estado: "10"
  },
  {
    ID: "1137",
    Nome: "Alto Parna\xEDba",
    Estado: "10"
  },
  {
    ID: "1138",
    Nome: "Amap\xE1 do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1139",
    Nome: "Amarante do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1140",
    Nome: "Anajatuba",
    Estado: "10"
  },
  {
    ID: "1141",
    Nome: "Anapurus",
    Estado: "10"
  },
  {
    ID: "1142",
    Nome: "Apicum-A\xE7u",
    Estado: "10"
  },
  {
    ID: "1143",
    Nome: "Araguan\xE3",
    Estado: "10"
  },
  {
    ID: "1144",
    Nome: "Araioses",
    Estado: "10"
  },
  {
    ID: "1145",
    Nome: "Arame",
    Estado: "10"
  },
  {
    ID: "1146",
    Nome: "Arari",
    Estado: "10"
  },
  {
    ID: "1147",
    Nome: "Axix\xE1",
    Estado: "10"
  },
  {
    ID: "1148",
    Nome: "Bacabal",
    Estado: "10"
  },
  {
    ID: "1149",
    Nome: "Bacabeira",
    Estado: "10"
  },
  {
    ID: "1150",
    Nome: "Bacuri",
    Estado: "10"
  },
  {
    ID: "1151",
    Nome: "Bacurituba",
    Estado: "10"
  },
  {
    ID: "1152",
    Nome: "Balsas",
    Estado: "10"
  },
  {
    ID: "1153",
    Nome: "Bar\xE3o de Graja\xFA",
    Estado: "10"
  },
  {
    ID: "1154",
    Nome: "Barra do Corda",
    Estado: "10"
  },
  {
    ID: "1155",
    Nome: "Barreirinhas",
    Estado: "10"
  },
  {
    ID: "1156",
    Nome: "Bela Vista do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1157",
    Nome: "Bel\xE1gua",
    Estado: "10"
  },
  {
    ID: "1158",
    Nome: "Benedito Leite",
    Estado: "10"
  },
  {
    ID: "1159",
    Nome: "Bequim\xE3o",
    Estado: "10"
  },
  {
    ID: "1160",
    Nome: "Bernardo do Mearim",
    Estado: "10"
  },
  {
    ID: "1161",
    Nome: "Boa Vista do Gurupi",
    Estado: "10"
  },
  {
    ID: "1162",
    Nome: "Bom Jardim",
    Estado: "10"
  },
  {
    ID: "1163",
    Nome: "Bom Jesus das Selvas",
    Estado: "10"
  },
  {
    ID: "1164",
    Nome: "Bom Lugar",
    Estado: "10"
  },
  {
    ID: "1165",
    Nome: "Brejo",
    Estado: "10"
  },
  {
    ID: "1166",
    Nome: "Brejo de Areia",
    Estado: "10"
  },
  {
    ID: "1167",
    Nome: "Buriti",
    Estado: "10"
  },
  {
    ID: "1168",
    Nome: "Buriti Bravo",
    Estado: "10"
  },
  {
    ID: "1169",
    Nome: "Buriticupu",
    Estado: "10"
  },
  {
    ID: "1170",
    Nome: "Buritirana",
    Estado: "10"
  },
  {
    ID: "1171",
    Nome: "Cachoeira Grande",
    Estado: "10"
  },
  {
    ID: "1172",
    Nome: "Cajapi\xF3",
    Estado: "10"
  },
  {
    ID: "1173",
    Nome: "Cajari",
    Estado: "10"
  },
  {
    ID: "1174",
    Nome: "Campestre do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1175",
    Nome: "C\xE2ndido Mendes",
    Estado: "10"
  },
  {
    ID: "1176",
    Nome: "Cantanhede",
    Estado: "10"
  },
  {
    ID: "1177",
    Nome: "Capinzal do Norte",
    Estado: "10"
  },
  {
    ID: "1178",
    Nome: "Carolina",
    Estado: "10"
  },
  {
    ID: "1179",
    Nome: "Carutapera",
    Estado: "10"
  },
  {
    ID: "1180",
    Nome: "Caxias",
    Estado: "10"
  },
  {
    ID: "1181",
    Nome: "Cedral",
    Estado: "10"
  },
  {
    ID: "1182",
    Nome: "Central do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1183",
    Nome: "Centro do Guilherme",
    Estado: "10"
  },
  {
    ID: "1184",
    Nome: "Centro Novo do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1185",
    Nome: "Chapadinha",
    Estado: "10"
  },
  {
    ID: "1186",
    Nome: "Cidel\xE2ndia",
    Estado: "10"
  },
  {
    ID: "1187",
    Nome: "Cod\xF3",
    Estado: "10"
  },
  {
    ID: "1188",
    Nome: "Coelho Neto",
    Estado: "10"
  },
  {
    ID: "1189",
    Nome: "Colinas",
    Estado: "10"
  },
  {
    ID: "1190",
    Nome: "Concei\xE7\xE3o do Lago-A\xE7u",
    Estado: "10"
  },
  {
    ID: "1191",
    Nome: "Coroat\xE1",
    Estado: "10"
  },
  {
    ID: "1192",
    Nome: "Cururupu",
    Estado: "10"
  },
  {
    ID: "1193",
    Nome: "Davin\xF3polis",
    Estado: "10"
  },
  {
    ID: "1194",
    Nome: "Dom Pedro",
    Estado: "10"
  },
  {
    ID: "1195",
    Nome: "Duque Bacelar",
    Estado: "10"
  },
  {
    ID: "1196",
    Nome: "Esperantin\xF3polis",
    Estado: "10"
  },
  {
    ID: "1197",
    Nome: "Estreito",
    Estado: "10"
  },
  {
    ID: "1198",
    Nome: "Feira Nova do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1199",
    Nome: "Fernando Falc\xE3o",
    Estado: "10"
  },
  {
    ID: "1200",
    Nome: "Formosa da Serra Negra",
    Estado: "10"
  },
  {
    ID: "1201",
    Nome: "Fortaleza dos Nogueiras",
    Estado: "10"
  },
  {
    ID: "1202",
    Nome: "Fortuna",
    Estado: "10"
  },
  {
    ID: "1203",
    Nome: "Godofredo Viana",
    Estado: "10"
  },
  {
    ID: "1204",
    Nome: "Gon\xE7alves Dias",
    Estado: "10"
  },
  {
    ID: "1205",
    Nome: "Governador Archer",
    Estado: "10"
  },
  {
    ID: "1206",
    Nome: "Governador Edison Lob\xE3o",
    Estado: "10"
  },
  {
    ID: "1207",
    Nome: "Governador Eug\xEAnio Barros",
    Estado: "10"
  },
  {
    ID: "1208",
    Nome: "Governador Luiz Rocha",
    Estado: "10"
  },
  {
    ID: "1209",
    Nome: "Governador Newton Bello",
    Estado: "10"
  },
  {
    ID: "1210",
    Nome: "Governador Nunes Freire",
    Estado: "10"
  },
  {
    ID: "1211",
    Nome: "Gra\xE7a Aranha",
    Estado: "10"
  },
  {
    ID: "1212",
    Nome: "Graja\xFA",
    Estado: "10"
  },
  {
    ID: "1213",
    Nome: "Guimar\xE3es",
    Estado: "10"
  },
  {
    ID: "1214",
    Nome: "Humberto de Campos",
    Estado: "10"
  },
  {
    ID: "1215",
    Nome: "Icatu",
    Estado: "10"
  },
  {
    ID: "1216",
    Nome: "Igarap\xE9 do Meio",
    Estado: "10"
  },
  {
    ID: "1217",
    Nome: "Igarap\xE9 Grande",
    Estado: "10"
  },
  {
    ID: "1218",
    Nome: "Imperatriz",
    Estado: "10"
  },
  {
    ID: "1219",
    Nome: "Itaipava do Graja\xFA",
    Estado: "10"
  },
  {
    ID: "1220",
    Nome: "Itapecuru Mirim",
    Estado: "10"
  },
  {
    ID: "1221",
    Nome: "Itinga do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1222",
    Nome: "Jatob\xE1",
    Estado: "10"
  },
  {
    ID: "1223",
    Nome: "Jenipapo dos Vieiras",
    Estado: "10"
  },
  {
    ID: "1224",
    Nome: "Jo\xE3o Lisboa",
    Estado: "10"
  },
  {
    ID: "1225",
    Nome: "Josel\xE2ndia",
    Estado: "10"
  },
  {
    ID: "1226",
    Nome: "Junco do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1227",
    Nome: "Lago da Pedra",
    Estado: "10"
  },
  {
    ID: "1228",
    Nome: "Lago do Junco",
    Estado: "10"
  },
  {
    ID: "1229",
    Nome: "Lago dos Rodrigues",
    Estado: "10"
  },
  {
    ID: "1230",
    Nome: "Lago Verde",
    Estado: "10"
  },
  {
    ID: "1231",
    Nome: "Lagoa do Mato",
    Estado: "10"
  },
  {
    ID: "1232",
    Nome: "Lagoa Grande do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1233",
    Nome: "Lajeado Novo",
    Estado: "10"
  },
  {
    ID: "1234",
    Nome: "Lima Campos",
    Estado: "10"
  },
  {
    ID: "1235",
    Nome: "Loreto",
    Estado: "10"
  },
  {
    ID: "1236",
    Nome: "Lu\xEDs Domingues",
    Estado: "10"
  },
  {
    ID: "1237",
    Nome: "Magalh\xE3es de Almeida",
    Estado: "10"
  },
  {
    ID: "1238",
    Nome: "Maraca\xE7um\xE9",
    Estado: "10"
  },
  {
    ID: "1239",
    Nome: "Maraj\xE1 do Sena",
    Estado: "10"
  },
  {
    ID: "1240",
    Nome: "Maranh\xE3ozinho",
    Estado: "10"
  },
  {
    ID: "1241",
    Nome: "Mata Roma",
    Estado: "10"
  },
  {
    ID: "1242",
    Nome: "Matinha",
    Estado: "10"
  },
  {
    ID: "1243",
    Nome: "Mat\xF5es",
    Estado: "10"
  },
  {
    ID: "1244",
    Nome: "Mat\xF5es do Norte",
    Estado: "10"
  },
  {
    ID: "1245",
    Nome: "Milagres do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1246",
    Nome: "Mirador",
    Estado: "10"
  },
  {
    ID: "1247",
    Nome: "Miranda do Norte",
    Estado: "10"
  },
  {
    ID: "1248",
    Nome: "Mirinzal",
    Estado: "10"
  },
  {
    ID: "1249",
    Nome: "Mon\xE7\xE3o",
    Estado: "10"
  },
  {
    ID: "1250",
    Nome: "Montes Altos",
    Estado: "10"
  },
  {
    ID: "1251",
    Nome: "Morros",
    Estado: "10"
  },
  {
    ID: "1252",
    Nome: "Nina Rodrigues",
    Estado: "10"
  },
  {
    ID: "1253",
    Nome: "Nova Colinas",
    Estado: "10"
  },
  {
    ID: "1254",
    Nome: "Nova Iorque",
    Estado: "10"
  },
  {
    ID: "1255",
    Nome: "Nova Olinda do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1256",
    Nome: "Olho d`\xC1gua das Cunh\xE3s",
    Estado: "10"
  },
  {
    ID: "1257",
    Nome: "Olinda Nova do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1258",
    Nome: "Pa\xE7o do Lumiar",
    Estado: "10"
  },
  {
    ID: "1259",
    Nome: "Palmeir\xE2ndia",
    Estado: "10"
  },
  {
    ID: "1260",
    Nome: "Paraibano",
    Estado: "10"
  },
  {
    ID: "1261",
    Nome: "Parnarama",
    Estado: "10"
  },
  {
    ID: "1262",
    Nome: "Passagem Franca",
    Estado: "10"
  },
  {
    ID: "1263",
    Nome: "Pastos Bons",
    Estado: "10"
  },
  {
    ID: "1264",
    Nome: "Paulino Neves",
    Estado: "10"
  },
  {
    ID: "1265",
    Nome: "Paulo Ramos",
    Estado: "10"
  },
  {
    ID: "1266",
    Nome: "Pedreiras",
    Estado: "10"
  },
  {
    ID: "1267",
    Nome: "Pedro do Ros\xE1rio",
    Estado: "10"
  },
  {
    ID: "1268",
    Nome: "Penalva",
    Estado: "10"
  },
  {
    ID: "1269",
    Nome: "Peri Mirim",
    Estado: "10"
  },
  {
    ID: "1270",
    Nome: "Peritor\xF3",
    Estado: "10"
  },
  {
    ID: "1271",
    Nome: "Pindar\xE9-Mirim",
    Estado: "10"
  },
  {
    ID: "1272",
    Nome: "Pinheiro",
    Estado: "10"
  },
  {
    ID: "1273",
    Nome: "Pio XII",
    Estado: "10"
  },
  {
    ID: "1274",
    Nome: "Pirapemas",
    Estado: "10"
  },
  {
    ID: "1275",
    Nome: "Po\xE7\xE3o de Pedras",
    Estado: "10"
  },
  {
    ID: "1276",
    Nome: "Porto Franco",
    Estado: "10"
  },
  {
    ID: "1277",
    Nome: "Porto Rico do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1278",
    Nome: "Presidente Dutra",
    Estado: "10"
  },
  {
    ID: "1279",
    Nome: "Presidente Juscelino",
    Estado: "10"
  },
  {
    ID: "1280",
    Nome: "Presidente M\xE9dici",
    Estado: "10"
  },
  {
    ID: "1281",
    Nome: "Presidente Sarney",
    Estado: "10"
  },
  {
    ID: "1282",
    Nome: "Presidente Vargas",
    Estado: "10"
  },
  {
    ID: "1283",
    Nome: "Primeira Cruz",
    Estado: "10"
  },
  {
    ID: "1284",
    Nome: "Raposa",
    Estado: "10"
  },
  {
    ID: "1285",
    Nome: "Riach\xE3o",
    Estado: "10"
  },
  {
    ID: "1286",
    Nome: "Ribamar Fiquene",
    Estado: "10"
  },
  {
    ID: "1287",
    Nome: "Ros\xE1rio",
    Estado: "10"
  },
  {
    ID: "1288",
    Nome: "Samba\xEDba",
    Estado: "10"
  },
  {
    ID: "1289",
    Nome: "Santa Filomena do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1290",
    Nome: "Santa Helena",
    Estado: "10"
  },
  {
    ID: "1291",
    Nome: "Santa In\xEAs",
    Estado: "10"
  },
  {
    ID: "1292",
    Nome: "Santa Luzia",
    Estado: "10"
  },
  {
    ID: "1293",
    Nome: "Santa Luzia do Paru\xE1",
    Estado: "10"
  },
  {
    ID: "1294",
    Nome: "Santa Quit\xE9ria do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1295",
    Nome: "Santa Rita",
    Estado: "10"
  },
  {
    ID: "1296",
    Nome: "Santana do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1297",
    Nome: "Santo Amaro do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1298",
    Nome: "Santo Ant\xF4nio dos Lopes",
    Estado: "10"
  },
  {
    ID: "1299",
    Nome: "S\xE3o Benedito do Rio Preto",
    Estado: "10"
  },
  {
    ID: "1300",
    Nome: "S\xE3o Bento",
    Estado: "10"
  },
  {
    ID: "1301",
    Nome: "S\xE3o Bernardo",
    Estado: "10"
  },
  {
    ID: "1302",
    Nome: "S\xE3o Domingos do Azeit\xE3o",
    Estado: "10"
  },
  {
    ID: "1303",
    Nome: "S\xE3o Domingos do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1304",
    Nome: "S\xE3o F\xE9lix de Balsas",
    Estado: "10"
  },
  {
    ID: "1305",
    Nome: "S\xE3o Francisco do Brej\xE3o",
    Estado: "10"
  },
  {
    ID: "1306",
    Nome: "S\xE3o Francisco do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1307",
    Nome: "S\xE3o Jo\xE3o Batista",
    Estado: "10"
  },
  {
    ID: "1308",
    Nome: "S\xE3o Jo\xE3o do Car\xFA",
    Estado: "10"
  },
  {
    ID: "1309",
    Nome: "S\xE3o Jo\xE3o do Para\xEDso",
    Estado: "10"
  },
  {
    ID: "1310",
    Nome: "S\xE3o Jo\xE3o do Soter",
    Estado: "10"
  },
  {
    ID: "1311",
    Nome: "S\xE3o Jo\xE3o dos Patos",
    Estado: "10"
  },
  {
    ID: "1312",
    Nome: "S\xE3o Jos\xE9 de Ribamar",
    Estado: "10"
  },
  {
    ID: "1313",
    Nome: "S\xE3o Jos\xE9 dos Bas\xEDlios",
    Estado: "10"
  },
  {
    ID: "1314",
    Nome: "S\xE3o Lu\xEDs",
    Estado: "10"
  },
  {
    ID: "1315",
    Nome: "S\xE3o Lu\xEDs Gonzaga do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1316",
    Nome: "S\xE3o Mateus do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1317",
    Nome: "S\xE3o Pedro da \xC1gua Branca",
    Estado: "10"
  },
  {
    ID: "1318",
    Nome: "S\xE3o Pedro dos Crentes",
    Estado: "10"
  },
  {
    ID: "1319",
    Nome: "S\xE3o Raimundo das Mangabeiras",
    Estado: "10"
  },
  {
    ID: "1320",
    Nome: "S\xE3o Raimundo do Doca Bezerra",
    Estado: "10"
  },
  {
    ID: "1321",
    Nome: "S\xE3o Roberto",
    Estado: "10"
  },
  {
    ID: "1322",
    Nome: "S\xE3o Vicente Ferrer",
    Estado: "10"
  },
  {
    ID: "1323",
    Nome: "Satubinha",
    Estado: "10"
  },
  {
    ID: "1324",
    Nome: "Senador Alexandre Costa",
    Estado: "10"
  },
  {
    ID: "1325",
    Nome: "Senador La Rocque",
    Estado: "10"
  },
  {
    ID: "1326",
    Nome: "Serrano do Maranh\xE3o",
    Estado: "10"
  },
  {
    ID: "1327",
    Nome: "S\xEDtio Novo",
    Estado: "10"
  },
  {
    ID: "1328",
    Nome: "Sucupira do Norte",
    Estado: "10"
  },
  {
    ID: "1329",
    Nome: "Sucupira do Riach\xE3o",
    Estado: "10"
  },
  {
    ID: "1330",
    Nome: "Tasso Fragoso",
    Estado: "10"
  },
  {
    ID: "1331",
    Nome: "Timbiras",
    Estado: "10"
  },
  {
    ID: "1332",
    Nome: "Timon",
    Estado: "10"
  },
  {
    ID: "1333",
    Nome: "Trizidela do Vale",
    Estado: "10"
  },
  {
    ID: "1334",
    Nome: "Tufil\xE2ndia",
    Estado: "10"
  },
  {
    ID: "1335",
    Nome: "Tuntum",
    Estado: "10"
  },
  {
    ID: "1336",
    Nome: "Turia\xE7u",
    Estado: "10"
  },
  {
    ID: "1337",
    Nome: "Turil\xE2ndia",
    Estado: "10"
  },
  {
    ID: "1338",
    Nome: "Tut\xF3ia",
    Estado: "10"
  },
  {
    ID: "1339",
    Nome: "Urbano Santos",
    Estado: "10"
  },
  {
    ID: "1340",
    Nome: "Vargem Grande",
    Estado: "10"
  },
  {
    ID: "1341",
    Nome: "Viana",
    Estado: "10"
  },
  {
    ID: "1342",
    Nome: "Vila Nova dos Mart\xEDrios",
    Estado: "10"
  },
  {
    ID: "1343",
    Nome: "Vit\xF3ria do Mearim",
    Estado: "10"
  },
  {
    ID: "1344",
    Nome: "Vitorino Freire",
    Estado: "10"
  },
  {
    ID: "1345",
    Nome: "Z\xE9 Doca",
    Estado: "10"
  },
  {
    ID: "1346",
    Nome: "Acorizal",
    Estado: "13"
  },
  {
    ID: "1347",
    Nome: "\xC1gua Boa",
    Estado: "13"
  },
  {
    ID: "1348",
    Nome: "Alta Floresta",
    Estado: "13"
  },
  {
    ID: "1349",
    Nome: "Alto Araguaia",
    Estado: "13"
  },
  {
    ID: "1350",
    Nome: "Alto Boa Vista",
    Estado: "13"
  },
  {
    ID: "1351",
    Nome: "Alto Gar\xE7as",
    Estado: "13"
  },
  {
    ID: "1352",
    Nome: "Alto Paraguai",
    Estado: "13"
  },
  {
    ID: "1353",
    Nome: "Alto Taquari",
    Estado: "13"
  },
  {
    ID: "1354",
    Nome: "Apiac\xE1s",
    Estado: "13"
  },
  {
    ID: "1355",
    Nome: "Araguaiana",
    Estado: "13"
  },
  {
    ID: "1356",
    Nome: "Araguainha",
    Estado: "13"
  },
  {
    ID: "1357",
    Nome: "Araputanga",
    Estado: "13"
  },
  {
    ID: "1358",
    Nome: "Aren\xE1polis",
    Estado: "13"
  },
  {
    ID: "1359",
    Nome: "Aripuan\xE3",
    Estado: "13"
  },
  {
    ID: "1360",
    Nome: "Bar\xE3o de Melga\xE7o",
    Estado: "13"
  },
  {
    ID: "1361",
    Nome: "Barra do Bugres",
    Estado: "13"
  },
  {
    ID: "1362",
    Nome: "Barra do Gar\xE7as",
    Estado: "13"
  },
  {
    ID: "1363",
    Nome: "Bom Jesus do Araguaia",
    Estado: "13"
  },
  {
    ID: "1364",
    Nome: "Brasnorte",
    Estado: "13"
  },
  {
    ID: "1365",
    Nome: "C\xE1ceres",
    Estado: "13"
  },
  {
    ID: "1366",
    Nome: "Campin\xE1polis",
    Estado: "13"
  },
  {
    ID: "1367",
    Nome: "Campo Novo do Parecis",
    Estado: "13"
  },
  {
    ID: "1368",
    Nome: "Campo Verde",
    Estado: "13"
  },
  {
    ID: "1369",
    Nome: "Campos de J\xFAlio",
    Estado: "13"
  },
  {
    ID: "1370",
    Nome: "Canabrava do Norte",
    Estado: "13"
  },
  {
    ID: "1371",
    Nome: "Canarana",
    Estado: "13"
  },
  {
    ID: "1372",
    Nome: "Carlinda",
    Estado: "13"
  },
  {
    ID: "1373",
    Nome: "Castanheira",
    Estado: "13"
  },
  {
    ID: "1374",
    Nome: "Chapada dos Guimar\xE3es",
    Estado: "13"
  },
  {
    ID: "1375",
    Nome: "Cl\xE1udia",
    Estado: "13"
  },
  {
    ID: "1376",
    Nome: "Cocalinho",
    Estado: "13"
  },
  {
    ID: "1377",
    Nome: "Col\xEDder",
    Estado: "13"
  },
  {
    ID: "1378",
    Nome: "Colniza",
    Estado: "13"
  },
  {
    ID: "1379",
    Nome: "Comodoro",
    Estado: "13"
  },
  {
    ID: "1380",
    Nome: "Confresa",
    Estado: "13"
  },
  {
    ID: "1381",
    Nome: "Conquista d`Oeste",
    Estado: "13"
  },
  {
    ID: "1382",
    Nome: "Cotrigua\xE7u",
    Estado: "13"
  },
  {
    ID: "1383",
    Nome: "Cuiab\xE1",
    Estado: "13"
  },
  {
    ID: "1384",
    Nome: "Curvel\xE2ndia",
    Estado: "13"
  },
  {
    ID: "1386",
    Nome: "Denise",
    Estado: "13"
  },
  {
    ID: "1387",
    Nome: "Diamantino",
    Estado: "13"
  },
  {
    ID: "1388",
    Nome: "Dom Aquino",
    Estado: "13"
  },
  {
    ID: "1389",
    Nome: "Feliz Natal",
    Estado: "13"
  },
  {
    ID: "1390",
    Nome: "Figueir\xF3polis d`Oeste",
    Estado: "13"
  },
  {
    ID: "1391",
    Nome: "Ga\xFAcha do Norte",
    Estado: "13"
  },
  {
    ID: "1392",
    Nome: "General Carneiro",
    Estado: "13"
  },
  {
    ID: "1393",
    Nome: "Gl\xF3ria d`Oeste",
    Estado: "13"
  },
  {
    ID: "1394",
    Nome: "Guarant\xE3 do Norte",
    Estado: "13"
  },
  {
    ID: "1395",
    Nome: "Guiratinga",
    Estado: "13"
  },
  {
    ID: "1396",
    Nome: "Indiava\xED",
    Estado: "13"
  },
  {
    ID: "1397",
    Nome: "Ipiranga do Norte",
    Estado: "13"
  },
  {
    ID: "1398",
    Nome: "Itanhang\xE1",
    Estado: "13"
  },
  {
    ID: "1399",
    Nome: "Ita\xFAba",
    Estado: "13"
  },
  {
    ID: "1400",
    Nome: "Itiquira",
    Estado: "13"
  },
  {
    ID: "1401",
    Nome: "Jaciara",
    Estado: "13"
  },
  {
    ID: "1402",
    Nome: "Jangada",
    Estado: "13"
  },
  {
    ID: "1403",
    Nome: "Jauru",
    Estado: "13"
  },
  {
    ID: "1404",
    Nome: "Juara",
    Estado: "13"
  },
  {
    ID: "1405",
    Nome: "Ju\xEDna",
    Estado: "13"
  },
  {
    ID: "1406",
    Nome: "Juruena",
    Estado: "13"
  },
  {
    ID: "1407",
    Nome: "Juscimeira",
    Estado: "13"
  },
  {
    ID: "1408",
    Nome: "Lambari d`Oeste",
    Estado: "13"
  },
  {
    ID: "1409",
    Nome: "Lucas do Rio Verde",
    Estado: "13"
  },
  {
    ID: "1410",
    Nome: "Luci\xE1ra",
    Estado: "13"
  },
  {
    ID: "1411",
    Nome: "Marcel\xE2ndia",
    Estado: "13"
  },
  {
    ID: "1412",
    Nome: "Matup\xE1",
    Estado: "13"
  },
  {
    ID: "1413",
    Nome: "Mirassol d`Oeste",
    Estado: "13"
  },
  {
    ID: "1414",
    Nome: "Nobres",
    Estado: "13"
  },
  {
    ID: "1415",
    Nome: "Nortel\xE2ndia",
    Estado: "13"
  },
  {
    ID: "1416",
    Nome: "Nossa Senhora do Livramento",
    Estado: "13"
  },
  {
    ID: "1417",
    Nome: "Nova Bandeirantes",
    Estado: "13"
  },
  {
    ID: "1418",
    Nome: "Nova Brasil\xE2ndia",
    Estado: "13"
  },
  {
    ID: "1419",
    Nome: "Nova Cana\xE3 do Norte",
    Estado: "13"
  },
  {
    ID: "1420",
    Nome: "Nova Guarita",
    Estado: "13"
  },
  {
    ID: "1421",
    Nome: "Nova Lacerda",
    Estado: "13"
  },
  {
    ID: "1422",
    Nome: "Nova Maril\xE2ndia",
    Estado: "13"
  },
  {
    ID: "1423",
    Nome: "Nova Maring\xE1",
    Estado: "13"
  },
  {
    ID: "1424",
    Nome: "Nova Monte verde",
    Estado: "13"
  },
  {
    ID: "1425",
    Nome: "Nova Mutum",
    Estado: "13"
  },
  {
    ID: "1426",
    Nome: "Nova Ol\xEDmpia",
    Estado: "13"
  },
  {
    ID: "1427",
    Nome: "Nova Santa Helena",
    Estado: "13"
  },
  {
    ID: "1428",
    Nome: "Nova Ubirat\xE3",
    Estado: "13"
  },
  {
    ID: "1429",
    Nome: "Nova Xavantina",
    Estado: "13"
  },
  {
    ID: "1430",
    Nome: "Novo Horizonte do Norte",
    Estado: "13"
  },
  {
    ID: "1431",
    Nome: "Novo Mundo",
    Estado: "13"
  },
  {
    ID: "1432",
    Nome: "Novo Santo Ant\xF4nio",
    Estado: "13"
  },
  {
    ID: "1433",
    Nome: "Novo S\xE3o Joaquim",
    Estado: "13"
  },
  {
    ID: "1434",
    Nome: "Parana\xEDta",
    Estado: "13"
  },
  {
    ID: "1435",
    Nome: "Paranatinga",
    Estado: "13"
  },
  {
    ID: "1436",
    Nome: "Pedra Preta",
    Estado: "13"
  },
  {
    ID: "1437",
    Nome: "Peixoto de Azevedo",
    Estado: "13"
  },
  {
    ID: "1438",
    Nome: "Planalto da Serra",
    Estado: "13"
  },
  {
    ID: "1439",
    Nome: "Pocon\xE9",
    Estado: "13"
  },
  {
    ID: "1440",
    Nome: "Pontal do Araguaia",
    Estado: "13"
  },
  {
    ID: "1441",
    Nome: "Ponte Branca",
    Estado: "13"
  },
  {
    ID: "1442",
    Nome: "Pontes e Lacerda",
    Estado: "13"
  },
  {
    ID: "1443",
    Nome: "Porto Alegre do Norte",
    Estado: "13"
  },
  {
    ID: "1444",
    Nome: "Porto dos Ga\xFAchos",
    Estado: "13"
  },
  {
    ID: "1445",
    Nome: "Porto Esperidi\xE3o",
    Estado: "13"
  },
  {
    ID: "1446",
    Nome: "Porto Estrela",
    Estado: "13"
  },
  {
    ID: "1447",
    Nome: "Poxor\xE9o",
    Estado: "13"
  },
  {
    ID: "1448",
    Nome: "Primavera do Leste",
    Estado: "13"
  },
  {
    ID: "1449",
    Nome: "Quer\xEAncia",
    Estado: "13"
  },
  {
    ID: "1450",
    Nome: "Reserva do Caba\xE7al",
    Estado: "13"
  },
  {
    ID: "1451",
    Nome: "Ribeir\xE3o Cascalheira",
    Estado: "13"
  },
  {
    ID: "1452",
    Nome: "Ribeir\xE3ozinho",
    Estado: "13"
  },
  {
    ID: "1453",
    Nome: "Rio Branco",
    Estado: "13"
  },
  {
    ID: "1454",
    Nome: "Rondol\xE2ndia",
    Estado: "13"
  },
  {
    ID: "1455",
    Nome: "Rondon\xF3polis",
    Estado: "13"
  },
  {
    ID: "1456",
    Nome: "Ros\xE1rio Oeste",
    Estado: "13"
  },
  {
    ID: "1457",
    Nome: "Salto do C\xE9u",
    Estado: "13"
  },
  {
    ID: "1458",
    Nome: "Santa Carmem",
    Estado: "13"
  },
  {
    ID: "1459",
    Nome: "Santa Cruz do Xingu",
    Estado: "13"
  },
  {
    ID: "1460",
    Nome: "Santa Rita do Trivelato",
    Estado: "13"
  },
  {
    ID: "1461",
    Nome: "Santa Terezinha",
    Estado: "13"
  },
  {
    ID: "1462",
    Nome: "Santo Afonso",
    Estado: "13"
  },
  {
    ID: "1463",
    Nome: "Santo Ant\xF4nio do Leste",
    Estado: "13"
  },
  {
    ID: "1464",
    Nome: "Santo Ant\xF4nio do Leverger",
    Estado: "13"
  },
  {
    ID: "1465",
    Nome: "S\xE3o F\xE9lix do Araguaia",
    Estado: "13"
  },
  {
    ID: "1466",
    Nome: "S\xE3o Jos\xE9 do Povo",
    Estado: "13"
  },
  {
    ID: "1467",
    Nome: "S\xE3o Jos\xE9 do Rio Claro",
    Estado: "13"
  },
  {
    ID: "1468",
    Nome: "S\xE3o Jos\xE9 do Xingu",
    Estado: "13"
  },
  {
    ID: "1469",
    Nome: "S\xE3o Jos\xE9 dos Quatro Marcos",
    Estado: "13"
  },
  {
    ID: "1470",
    Nome: "S\xE3o Pedro da Cipa",
    Estado: "13"
  },
  {
    ID: "1471",
    Nome: "Sapezal",
    Estado: "13"
  },
  {
    ID: "1472",
    Nome: "Serra Nova Dourada",
    Estado: "13"
  },
  {
    ID: "1473",
    Nome: "Sinop",
    Estado: "13"
  },
  {
    ID: "1474",
    Nome: "Sorriso",
    Estado: "13"
  },
  {
    ID: "1475",
    Nome: "Tabapor\xE3",
    Estado: "13"
  },
  {
    ID: "1476",
    Nome: "Tangar\xE1 da Serra",
    Estado: "13"
  },
  {
    ID: "1477",
    Nome: "Tapurah",
    Estado: "13"
  },
  {
    ID: "1478",
    Nome: "Terra Nova do Norte",
    Estado: "13"
  },
  {
    ID: "1479",
    Nome: "Tesouro",
    Estado: "13"
  },
  {
    ID: "1480",
    Nome: "Torixor\xE9u",
    Estado: "13"
  },
  {
    ID: "1481",
    Nome: "Uni\xE3o do Sul",
    Estado: "13"
  },
  {
    ID: "1482",
    Nome: "Vale de S\xE3o Domingos",
    Estado: "13"
  },
  {
    ID: "1483",
    Nome: "V\xE1rzea Grande",
    Estado: "13"
  },
  {
    ID: "1484",
    Nome: "Vera",
    Estado: "13"
  },
  {
    ID: "1485",
    Nome: "Vila Bela da Sant\xEDssima Trindade",
    Estado: "13"
  },
  {
    ID: "1486",
    Nome: "Vila Rica",
    Estado: "13"
  },
  {
    ID: "1487",
    Nome: "\xC1gua Clara",
    Estado: "12"
  },
  {
    ID: "1488",
    Nome: "Alcin\xF3polis",
    Estado: "12"
  },
  {
    ID: "1489",
    Nome: "Amamba\xED",
    Estado: "12"
  },
  {
    ID: "1490",
    Nome: "Anast\xE1cio",
    Estado: "12"
  },
  {
    ID: "1491",
    Nome: "Anauril\xE2ndia",
    Estado: "12"
  },
  {
    ID: "1492",
    Nome: "Ang\xE9lica",
    Estado: "12"
  },
  {
    ID: "1493",
    Nome: "Ant\xF4nio Jo\xE3o",
    Estado: "12"
  },
  {
    ID: "1494",
    Nome: "Aparecida do Taboado",
    Estado: "12"
  },
  {
    ID: "1495",
    Nome: "Aquidauana",
    Estado: "12"
  },
  {
    ID: "1496",
    Nome: "Aral Moreira",
    Estado: "12"
  },
  {
    ID: "1497",
    Nome: "Bandeirantes",
    Estado: "12"
  },
  {
    ID: "1498",
    Nome: "Bataguassu",
    Estado: "12"
  },
  {
    ID: "1499",
    Nome: "Bataipor\xE3",
    Estado: "12"
  },
  {
    ID: "1500",
    Nome: "Bela Vista",
    Estado: "12"
  },
  {
    ID: "1501",
    Nome: "Bodoquena",
    Estado: "12"
  },
  {
    ID: "1502",
    Nome: "Bonito",
    Estado: "12"
  },
  {
    ID: "1503",
    Nome: "Brasil\xE2ndia",
    Estado: "12"
  },
  {
    ID: "1504",
    Nome: "Caarap\xF3",
    Estado: "12"
  },
  {
    ID: "1505",
    Nome: "Camapu\xE3",
    Estado: "12"
  },
  {
    ID: "1506",
    Nome: "Campo Grande",
    Estado: "12"
  },
  {
    ID: "1507",
    Nome: "Caracol",
    Estado: "12"
  },
  {
    ID: "1508",
    Nome: "Cassil\xE2ndia",
    Estado: "12"
  },
  {
    ID: "1509",
    Nome: "Chapad\xE3o do Sul",
    Estado: "12"
  },
  {
    ID: "1510",
    Nome: "Corguinho",
    Estado: "12"
  },
  {
    ID: "1511",
    Nome: "Coronel Sapucaia",
    Estado: "12"
  },
  {
    ID: "1512",
    Nome: "Corumb\xE1",
    Estado: "12"
  },
  {
    ID: "1513",
    Nome: "Costa Rica",
    Estado: "12"
  },
  {
    ID: "1514",
    Nome: "Coxim",
    Estado: "12"
  },
  {
    ID: "1515",
    Nome: "Deod\xE1polis",
    Estado: "12"
  },
  {
    ID: "1516",
    Nome: "Dois Irm\xE3os do Buriti",
    Estado: "12"
  },
  {
    ID: "1517",
    Nome: "Douradina",
    Estado: "12"
  },
  {
    ID: "1518",
    Nome: "Dourados",
    Estado: "12"
  },
  {
    ID: "1519",
    Nome: "Eldorado",
    Estado: "12"
  },
  {
    ID: "1520",
    Nome: "F\xE1tima do Sul",
    Estado: "12"
  },
  {
    ID: "1521",
    Nome: "Figueir\xE3o",
    Estado: "12"
  },
  {
    ID: "1522",
    Nome: "Gl\xF3ria de Dourados",
    Estado: "12"
  },
  {
    ID: "1523",
    Nome: "Guia Lopes da Laguna",
    Estado: "12"
  },
  {
    ID: "1524",
    Nome: "Iguatemi",
    Estado: "12"
  },
  {
    ID: "1525",
    Nome: "Inoc\xEAncia",
    Estado: "12"
  },
  {
    ID: "1526",
    Nome: "Itapor\xE3",
    Estado: "12"
  },
  {
    ID: "1527",
    Nome: "Itaquira\xED",
    Estado: "12"
  },
  {
    ID: "1528",
    Nome: "Ivinhema",
    Estado: "12"
  },
  {
    ID: "1529",
    Nome: "Japor\xE3",
    Estado: "12"
  },
  {
    ID: "1530",
    Nome: "Jaraguari",
    Estado: "12"
  },
  {
    ID: "1531",
    Nome: "Jardim",
    Estado: "12"
  },
  {
    ID: "1532",
    Nome: "Jate\xED",
    Estado: "12"
  },
  {
    ID: "1533",
    Nome: "Juti",
    Estado: "12"
  },
  {
    ID: "1534",
    Nome: "Lad\xE1rio",
    Estado: "12"
  },
  {
    ID: "1535",
    Nome: "Laguna Carap\xE3",
    Estado: "12"
  },
  {
    ID: "1536",
    Nome: "Maracaju",
    Estado: "12"
  },
  {
    ID: "1537",
    Nome: "Miranda",
    Estado: "12"
  },
  {
    ID: "1538",
    Nome: "Mundo Novo",
    Estado: "12"
  },
  {
    ID: "1539",
    Nome: "Navira\xED",
    Estado: "12"
  },
  {
    ID: "1540",
    Nome: "Nioaque",
    Estado: "12"
  },
  {
    ID: "1541",
    Nome: "Nova Alvorada do Sul",
    Estado: "12"
  },
  {
    ID: "1542",
    Nome: "Nova Andradina",
    Estado: "12"
  },
  {
    ID: "1543",
    Nome: "Novo Horizonte do Sul",
    Estado: "12"
  },
  {
    ID: "1544",
    Nome: "Parana\xEDba",
    Estado: "12"
  },
  {
    ID: "1545",
    Nome: "Paranhos",
    Estado: "12"
  },
  {
    ID: "1546",
    Nome: "Pedro Gomes",
    Estado: "12"
  },
  {
    ID: "1547",
    Nome: "Ponta Por\xE3",
    Estado: "12"
  },
  {
    ID: "1548",
    Nome: "Porto Murtinho",
    Estado: "12"
  },
  {
    ID: "1549",
    Nome: "Ribas do Rio Pardo",
    Estado: "12"
  },
  {
    ID: "1550",
    Nome: "Rio Brilhante",
    Estado: "12"
  },
  {
    ID: "1551",
    Nome: "Rio Negro",
    Estado: "12"
  },
  {
    ID: "1552",
    Nome: "Rio Verde de Mato Grosso",
    Estado: "12"
  },
  {
    ID: "1553",
    Nome: "Rochedo",
    Estado: "12"
  },
  {
    ID: "1554",
    Nome: "Santa Rita do Pardo",
    Estado: "12"
  },
  {
    ID: "1555",
    Nome: "S\xE3o Gabriel do Oeste",
    Estado: "12"
  },
  {
    ID: "1556",
    Nome: "Selv\xEDria",
    Estado: "12"
  },
  {
    ID: "1557",
    Nome: "Sete Quedas",
    Estado: "12"
  },
  {
    ID: "1558",
    Nome: "Sidrol\xE2ndia",
    Estado: "12"
  },
  {
    ID: "1559",
    Nome: "Sonora",
    Estado: "12"
  },
  {
    ID: "1560",
    Nome: "Tacuru",
    Estado: "12"
  },
  {
    ID: "1561",
    Nome: "Taquarussu",
    Estado: "12"
  },
  {
    ID: "1562",
    Nome: "Terenos",
    Estado: "12"
  },
  {
    ID: "1563",
    Nome: "Tr\xEAs Lagoas",
    Estado: "12"
  },
  {
    ID: "1564",
    Nome: "Vicentina",
    Estado: "12"
  },
  {
    ID: "1565",
    Nome: "Abadia dos Dourados",
    Estado: "11"
  },
  {
    ID: "1566",
    Nome: "Abaet\xE9",
    Estado: "11"
  },
  {
    ID: "1567",
    Nome: "Abre Campo",
    Estado: "11"
  },
  {
    ID: "1568",
    Nome: "Acaiaca",
    Estado: "11"
  },
  {
    ID: "1569",
    Nome: "A\xE7ucena",
    Estado: "11"
  },
  {
    ID: "1570",
    Nome: "\xC1gua Boa",
    Estado: "11"
  },
  {
    ID: "1571",
    Nome: "\xC1gua Comprida",
    Estado: "11"
  },
  {
    ID: "1572",
    Nome: "Aguanil",
    Estado: "11"
  },
  {
    ID: "1573",
    Nome: "\xC1guas Formosas",
    Estado: "11"
  },
  {
    ID: "1574",
    Nome: "\xC1guas Vermelhas",
    Estado: "11"
  },
  {
    ID: "1575",
    Nome: "Aimor\xE9s",
    Estado: "11"
  },
  {
    ID: "1576",
    Nome: "Aiuruoca",
    Estado: "11"
  },
  {
    ID: "1577",
    Nome: "Alagoa",
    Estado: "11"
  },
  {
    ID: "1578",
    Nome: "Albertina",
    Estado: "11"
  },
  {
    ID: "1579",
    Nome: "Al\xE9m Para\xEDba",
    Estado: "11"
  },
  {
    ID: "1580",
    Nome: "Alfenas",
    Estado: "11"
  },
  {
    ID: "1581",
    Nome: "Alfredo Vasconcelos",
    Estado: "11"
  },
  {
    ID: "1582",
    Nome: "Almenara",
    Estado: "11"
  },
  {
    ID: "1583",
    Nome: "Alpercata",
    Estado: "11"
  },
  {
    ID: "1584",
    Nome: "Alpin\xF3polis",
    Estado: "11"
  },
  {
    ID: "1585",
    Nome: "Alterosa",
    Estado: "11"
  },
  {
    ID: "1586",
    Nome: "Alto Capara\xF3",
    Estado: "11"
  },
  {
    ID: "1587",
    Nome: "Alto Jequitib\xE1",
    Estado: "11"
  },
  {
    ID: "1588",
    Nome: "Alto Rio Doce",
    Estado: "11"
  },
  {
    ID: "1589",
    Nome: "Alvarenga",
    Estado: "11"
  },
  {
    ID: "1590",
    Nome: "Alvin\xF3polis",
    Estado: "11"
  },
  {
    ID: "1591",
    Nome: "Alvorada de Minas",
    Estado: "11"
  },
  {
    ID: "1592",
    Nome: "Amparo do Serra",
    Estado: "11"
  },
  {
    ID: "1593",
    Nome: "Andradas",
    Estado: "11"
  },
  {
    ID: "1594",
    Nome: "Andrel\xE2ndia",
    Estado: "11"
  },
  {
    ID: "1595",
    Nome: "Angel\xE2ndia",
    Estado: "11"
  },
  {
    ID: "1596",
    Nome: "Ant\xF4nio Carlos",
    Estado: "11"
  },
  {
    ID: "1597",
    Nome: "Ant\xF4nio Dias",
    Estado: "11"
  },
  {
    ID: "1598",
    Nome: "Ant\xF4nio Prado de Minas",
    Estado: "11"
  },
  {
    ID: "1599",
    Nome: "Ara\xE7a\xED",
    Estado: "11"
  },
  {
    ID: "1600",
    Nome: "Aracitaba",
    Estado: "11"
  },
  {
    ID: "1601",
    Nome: "Ara\xE7ua\xED",
    Estado: "11"
  },
  {
    ID: "1602",
    Nome: "Araguari",
    Estado: "11"
  },
  {
    ID: "1603",
    Nome: "Arantina",
    Estado: "11"
  },
  {
    ID: "1604",
    Nome: "Araponga",
    Estado: "11"
  },
  {
    ID: "1605",
    Nome: "Arapor\xE3",
    Estado: "11"
  },
  {
    ID: "1606",
    Nome: "Arapu\xE1",
    Estado: "11"
  },
  {
    ID: "1607",
    Nome: "Ara\xFAjos",
    Estado: "11"
  },
  {
    ID: "1608",
    Nome: "Arax\xE1",
    Estado: "11"
  },
  {
    ID: "1609",
    Nome: "Arceburgo",
    Estado: "11"
  },
  {
    ID: "1610",
    Nome: "Arcos",
    Estado: "11"
  },
  {
    ID: "1611",
    Nome: "Areado",
    Estado: "11"
  },
  {
    ID: "1612",
    Nome: "Argirita",
    Estado: "11"
  },
  {
    ID: "1613",
    Nome: "Aricanduva",
    Estado: "11"
  },
  {
    ID: "1614",
    Nome: "Arinos",
    Estado: "11"
  },
  {
    ID: "1615",
    Nome: "Astolfo Dutra",
    Estado: "11"
  },
  {
    ID: "1616",
    Nome: "Atal\xE9ia",
    Estado: "11"
  },
  {
    ID: "1617",
    Nome: "Augusto de Lima",
    Estado: "11"
  },
  {
    ID: "1618",
    Nome: "Baependi",
    Estado: "11"
  },
  {
    ID: "1619",
    Nome: "Baldim",
    Estado: "11"
  },
  {
    ID: "1620",
    Nome: "Bambu\xED",
    Estado: "11"
  },
  {
    ID: "1621",
    Nome: "Bandeira",
    Estado: "11"
  },
  {
    ID: "1622",
    Nome: "Bandeira do Sul",
    Estado: "11"
  },
  {
    ID: "1623",
    Nome: "Bar\xE3o de Cocais",
    Estado: "11"
  },
  {
    ID: "1624",
    Nome: "Bar\xE3o de Monte Alto",
    Estado: "11"
  },
  {
    ID: "1625",
    Nome: "Barbacena",
    Estado: "11"
  },
  {
    ID: "1626",
    Nome: "Barra Longa",
    Estado: "11"
  },
  {
    ID: "1627",
    Nome: "Barroso",
    Estado: "11"
  },
  {
    ID: "1628",
    Nome: "Bela Vista de Minas",
    Estado: "11"
  },
  {
    ID: "1629",
    Nome: "Belmiro Braga",
    Estado: "11"
  },
  {
    ID: "1630",
    Nome: "Belo Horizonte",
    Estado: "11"
  },
  {
    ID: "1631",
    Nome: "Belo Oriente",
    Estado: "11"
  },
  {
    ID: "1632",
    Nome: "Belo Vale",
    Estado: "11"
  },
  {
    ID: "1633",
    Nome: "Berilo",
    Estado: "11"
  },
  {
    ID: "1634",
    Nome: "Berizal",
    Estado: "11"
  },
  {
    ID: "1635",
    Nome: "Bert\xF3polis",
    Estado: "11"
  },
  {
    ID: "1636",
    Nome: "Betim",
    Estado: "11"
  },
  {
    ID: "1637",
    Nome: "Bias Fortes",
    Estado: "11"
  },
  {
    ID: "1638",
    Nome: "Bicas",
    Estado: "11"
  },
  {
    ID: "1639",
    Nome: "Biquinhas",
    Estado: "11"
  },
  {
    ID: "1640",
    Nome: "Boa Esperan\xE7a",
    Estado: "11"
  },
  {
    ID: "1641",
    Nome: "Bocaina de Minas",
    Estado: "11"
  },
  {
    ID: "1642",
    Nome: "Bocai\xFAva",
    Estado: "11"
  },
  {
    ID: "1643",
    Nome: "Bom Despacho",
    Estado: "11"
  },
  {
    ID: "1644",
    Nome: "Bom Jardim de Minas",
    Estado: "11"
  },
  {
    ID: "1645",
    Nome: "Bom Jesus da Penha",
    Estado: "11"
  },
  {
    ID: "1646",
    Nome: "Bom Jesus do Amparo",
    Estado: "11"
  },
  {
    ID: "1647",
    Nome: "Bom Jesus do Galho",
    Estado: "11"
  },
  {
    ID: "1648",
    Nome: "Bom Repouso",
    Estado: "11"
  },
  {
    ID: "1649",
    Nome: "Bom Sucesso",
    Estado: "11"
  },
  {
    ID: "1650",
    Nome: "Bonfim",
    Estado: "11"
  },
  {
    ID: "1651",
    Nome: "Bonfin\xF3polis de Minas",
    Estado: "11"
  },
  {
    ID: "1652",
    Nome: "Bonito de Minas",
    Estado: "11"
  },
  {
    ID: "1653",
    Nome: "Borda da Mata",
    Estado: "11"
  },
  {
    ID: "1654",
    Nome: "Botelhos",
    Estado: "11"
  },
  {
    ID: "1655",
    Nome: "Botumirim",
    Estado: "11"
  },
  {
    ID: "1656",
    Nome: "Br\xE1s Pires",
    Estado: "11"
  },
  {
    ID: "1657",
    Nome: "Brasil\xE2ndia de Minas",
    Estado: "11"
  },
  {
    ID: "1658",
    Nome: "Bras\xEDlia de Minas",
    Estado: "11"
  },
  {
    ID: "1659",
    Nome: "Bras\xF3polis",
    Estado: "11"
  },
  {
    ID: "1660",
    Nome: "Bra\xFAnas",
    Estado: "11"
  },
  {
    ID: "1661",
    Nome: "Brumadinho",
    Estado: "11"
  },
  {
    ID: "1662",
    Nome: "Bueno Brand\xE3o",
    Estado: "11"
  },
  {
    ID: "1663",
    Nome: "Buen\xF3polis",
    Estado: "11"
  },
  {
    ID: "1664",
    Nome: "Bugre",
    Estado: "11"
  },
  {
    ID: "1665",
    Nome: "Buritis",
    Estado: "11"
  },
  {
    ID: "1666",
    Nome: "Buritizeiro",
    Estado: "11"
  },
  {
    ID: "1667",
    Nome: "Cabeceira Grande",
    Estado: "11"
  },
  {
    ID: "1668",
    Nome: "Cabo Verde",
    Estado: "11"
  },
  {
    ID: "1669",
    Nome: "Cachoeira da Prata",
    Estado: "11"
  },
  {
    ID: "1670",
    Nome: "Cachoeira de Minas",
    Estado: "11"
  },
  {
    ID: "1671",
    Nome: "Cachoeira de Paje\xFA",
    Estado: "11"
  },
  {
    ID: "1672",
    Nome: "Cachoeira Dourada",
    Estado: "11"
  },
  {
    ID: "1673",
    Nome: "Caetan\xF3polis",
    Estado: "11"
  },
  {
    ID: "1674",
    Nome: "Caet\xE9",
    Estado: "11"
  },
  {
    ID: "1675",
    Nome: "Caiana",
    Estado: "11"
  },
  {
    ID: "1676",
    Nome: "Cajuri",
    Estado: "11"
  },
  {
    ID: "1677",
    Nome: "Caldas",
    Estado: "11"
  },
  {
    ID: "1678",
    Nome: "Camacho",
    Estado: "11"
  },
  {
    ID: "1679",
    Nome: "Camanducaia",
    Estado: "11"
  },
  {
    ID: "1680",
    Nome: "Cambu\xED",
    Estado: "11"
  },
  {
    ID: "1681",
    Nome: "Cambuquira",
    Estado: "11"
  },
  {
    ID: "1682",
    Nome: "Campan\xE1rio",
    Estado: "11"
  },
  {
    ID: "1683",
    Nome: "Campanha",
    Estado: "11"
  },
  {
    ID: "1684",
    Nome: "Campestre",
    Estado: "11"
  },
  {
    ID: "1685",
    Nome: "Campina Verde",
    Estado: "11"
  },
  {
    ID: "1686",
    Nome: "Campo Azul",
    Estado: "11"
  },
  {
    ID: "1687",
    Nome: "Campo Belo",
    Estado: "11"
  },
  {
    ID: "1688",
    Nome: "Campo do Meio",
    Estado: "11"
  },
  {
    ID: "1689",
    Nome: "Campo Florido",
    Estado: "11"
  },
  {
    ID: "1690",
    Nome: "Campos Altos",
    Estado: "11"
  },
  {
    ID: "1691",
    Nome: "Campos Gerais",
    Estado: "11"
  },
  {
    ID: "1692",
    Nome: "Cana Verde",
    Estado: "11"
  },
  {
    ID: "1693",
    Nome: "Cana\xE3",
    Estado: "11"
  },
  {
    ID: "1694",
    Nome: "Can\xE1polis",
    Estado: "11"
  },
  {
    ID: "1695",
    Nome: "Candeias",
    Estado: "11"
  },
  {
    ID: "1696",
    Nome: "Cantagalo",
    Estado: "11"
  },
  {
    ID: "1697",
    Nome: "Capara\xF3",
    Estado: "11"
  },
  {
    ID: "1698",
    Nome: "Capela Nova",
    Estado: "11"
  },
  {
    ID: "1699",
    Nome: "Capelinha",
    Estado: "11"
  },
  {
    ID: "1700",
    Nome: "Capetinga",
    Estado: "11"
  },
  {
    ID: "1701",
    Nome: "Capim Branco",
    Estado: "11"
  },
  {
    ID: "1702",
    Nome: "Capin\xF3polis",
    Estado: "11"
  },
  {
    ID: "1703",
    Nome: "Capit\xE3o Andrade",
    Estado: "11"
  },
  {
    ID: "1704",
    Nome: "Capit\xE3o En\xE9as",
    Estado: "11"
  },
  {
    ID: "1705",
    Nome: "Capit\xF3lio",
    Estado: "11"
  },
  {
    ID: "1706",
    Nome: "Caputira",
    Estado: "11"
  },
  {
    ID: "1707",
    Nome: "Cara\xED",
    Estado: "11"
  },
  {
    ID: "1708",
    Nome: "Carana\xEDba",
    Estado: "11"
  },
  {
    ID: "1709",
    Nome: "Caranda\xED",
    Estado: "11"
  },
  {
    ID: "1710",
    Nome: "Carangola",
    Estado: "11"
  },
  {
    ID: "1711",
    Nome: "Caratinga",
    Estado: "11"
  },
  {
    ID: "1712",
    Nome: "Carbonita",
    Estado: "11"
  },
  {
    ID: "1713",
    Nome: "Carea\xE7u",
    Estado: "11"
  },
  {
    ID: "1714",
    Nome: "Carlos Chagas",
    Estado: "11"
  },
  {
    ID: "1715",
    Nome: "Carm\xE9sia",
    Estado: "11"
  },
  {
    ID: "1716",
    Nome: "Carmo da Cachoeira",
    Estado: "11"
  },
  {
    ID: "1717",
    Nome: "Carmo da Mata",
    Estado: "11"
  },
  {
    ID: "1718",
    Nome: "Carmo de Minas",
    Estado: "11"
  },
  {
    ID: "1719",
    Nome: "Carmo do Cajuru",
    Estado: "11"
  },
  {
    ID: "1720",
    Nome: "Carmo do Parana\xEDba",
    Estado: "11"
  },
  {
    ID: "1721",
    Nome: "Carmo do Rio Claro",
    Estado: "11"
  },
  {
    ID: "1722",
    Nome: "Carm\xF3polis de Minas",
    Estado: "11"
  },
  {
    ID: "1723",
    Nome: "Carneirinho",
    Estado: "11"
  },
  {
    ID: "1724",
    Nome: "Carrancas",
    Estado: "11"
  },
  {
    ID: "1725",
    Nome: "Carvalh\xF3polis",
    Estado: "11"
  },
  {
    ID: "1726",
    Nome: "Carvalhos",
    Estado: "11"
  },
  {
    ID: "1727",
    Nome: "Casa Grande",
    Estado: "11"
  },
  {
    ID: "1728",
    Nome: "Cascalho Rico",
    Estado: "11"
  },
  {
    ID: "1729",
    Nome: "C\xE1ssia",
    Estado: "11"
  },
  {
    ID: "1730",
    Nome: "Cataguases",
    Estado: "11"
  },
  {
    ID: "1731",
    Nome: "Catas Altas",
    Estado: "11"
  },
  {
    ID: "1732",
    Nome: "Catas Altas da Noruega",
    Estado: "11"
  },
  {
    ID: "1733",
    Nome: "Catuji",
    Estado: "11"
  },
  {
    ID: "1734",
    Nome: "Catuti",
    Estado: "11"
  },
  {
    ID: "1735",
    Nome: "Caxambu",
    Estado: "11"
  },
  {
    ID: "1736",
    Nome: "Cedro do Abaet\xE9",
    Estado: "11"
  },
  {
    ID: "1737",
    Nome: "Central de Minas",
    Estado: "11"
  },
  {
    ID: "1738",
    Nome: "Centralina",
    Estado: "11"
  },
  {
    ID: "1739",
    Nome: "Ch\xE1cara",
    Estado: "11"
  },
  {
    ID: "1740",
    Nome: "Chal\xE9",
    Estado: "11"
  },
  {
    ID: "1741",
    Nome: "Chapada do Norte",
    Estado: "11"
  },
  {
    ID: "1742",
    Nome: "Chapada Ga\xFAcha",
    Estado: "11"
  },
  {
    ID: "1743",
    Nome: "Chiador",
    Estado: "11"
  },
  {
    ID: "1744",
    Nome: "Cipot\xE2nea",
    Estado: "11"
  },
  {
    ID: "1745",
    Nome: "Claraval",
    Estado: "11"
  },
  {
    ID: "1746",
    Nome: "Claro dos Po\xE7\xF5es",
    Estado: "11"
  },
  {
    ID: "1747",
    Nome: "Cl\xE1udio",
    Estado: "11"
  },
  {
    ID: "1748",
    Nome: "Coimbra",
    Estado: "11"
  },
  {
    ID: "1749",
    Nome: "Coluna",
    Estado: "11"
  },
  {
    ID: "1750",
    Nome: "Comendador Gomes",
    Estado: "11"
  },
  {
    ID: "1751",
    Nome: "Comercinho",
    Estado: "11"
  },
  {
    ID: "1752",
    Nome: "Concei\xE7\xE3o da Aparecida",
    Estado: "11"
  },
  {
    ID: "1753",
    Nome: "Concei\xE7\xE3o da Barra de Minas",
    Estado: "11"
  },
  {
    ID: "1754",
    Nome: "Concei\xE7\xE3o das Alagoas",
    Estado: "11"
  },
  {
    ID: "1755",
    Nome: "Concei\xE7\xE3o das Pedras",
    Estado: "11"
  },
  {
    ID: "1756",
    Nome: "Concei\xE7\xE3o de Ipanema",
    Estado: "11"
  },
  {
    ID: "1757",
    Nome: "Concei\xE7\xE3o do Mato Dentro",
    Estado: "11"
  },
  {
    ID: "1758",
    Nome: "Concei\xE7\xE3o do Par\xE1",
    Estado: "11"
  },
  {
    ID: "1759",
    Nome: "Concei\xE7\xE3o do Rio Verde",
    Estado: "11"
  },
  {
    ID: "1760",
    Nome: "Concei\xE7\xE3o dos Ouros",
    Estado: "11"
  },
  {
    ID: "1761",
    Nome: "C\xF4nego Marinho",
    Estado: "11"
  },
  {
    ID: "1762",
    Nome: "Confins",
    Estado: "11"
  },
  {
    ID: "1763",
    Nome: "Congonhal",
    Estado: "11"
  },
  {
    ID: "1764",
    Nome: "Congonhas",
    Estado: "11"
  },
  {
    ID: "1765",
    Nome: "Congonhas do Norte",
    Estado: "11"
  },
  {
    ID: "1766",
    Nome: "Conquista",
    Estado: "11"
  },
  {
    ID: "1767",
    Nome: "Conselheiro Lafaiete",
    Estado: "11"
  },
  {
    ID: "1768",
    Nome: "Conselheiro Pena",
    Estado: "11"
  },
  {
    ID: "1769",
    Nome: "Consola\xE7\xE3o",
    Estado: "11"
  },
  {
    ID: "1770",
    Nome: "Contagem",
    Estado: "11"
  },
  {
    ID: "1771",
    Nome: "Coqueiral",
    Estado: "11"
  },
  {
    ID: "1772",
    Nome: "Cora\xE7\xE3o de Jesus",
    Estado: "11"
  },
  {
    ID: "1773",
    Nome: "Cordisburgo",
    Estado: "11"
  },
  {
    ID: "1774",
    Nome: "Cordisl\xE2ndia",
    Estado: "11"
  },
  {
    ID: "1775",
    Nome: "Corinto",
    Estado: "11"
  },
  {
    ID: "1776",
    Nome: "Coroaci",
    Estado: "11"
  },
  {
    ID: "1777",
    Nome: "Coromandel",
    Estado: "11"
  },
  {
    ID: "1778",
    Nome: "Coronel Fabriciano",
    Estado: "11"
  },
  {
    ID: "1779",
    Nome: "Coronel Murta",
    Estado: "11"
  },
  {
    ID: "1780",
    Nome: "Coronel Pacheco",
    Estado: "11"
  },
  {
    ID: "1781",
    Nome: "Coronel Xavier Chaves",
    Estado: "11"
  },
  {
    ID: "1782",
    Nome: "C\xF3rrego Danta",
    Estado: "11"
  },
  {
    ID: "1783",
    Nome: "C\xF3rrego do Bom Jesus",
    Estado: "11"
  },
  {
    ID: "1784",
    Nome: "C\xF3rrego Fundo",
    Estado: "11"
  },
  {
    ID: "1785",
    Nome: "C\xF3rrego Novo",
    Estado: "11"
  },
  {
    ID: "1786",
    Nome: "Couto de Magalh\xE3es de Minas",
    Estado: "11"
  },
  {
    ID: "1787",
    Nome: "Cris\xF3lita",
    Estado: "11"
  },
  {
    ID: "1788",
    Nome: "Cristais",
    Estado: "11"
  },
  {
    ID: "1789",
    Nome: "Crist\xE1lia",
    Estado: "11"
  },
  {
    ID: "1790",
    Nome: "Cristiano Otoni",
    Estado: "11"
  },
  {
    ID: "1791",
    Nome: "Cristina",
    Estado: "11"
  },
  {
    ID: "1792",
    Nome: "Crucil\xE2ndia",
    Estado: "11"
  },
  {
    ID: "1793",
    Nome: "Cruzeiro da Fortaleza",
    Estado: "11"
  },
  {
    ID: "1794",
    Nome: "Cruz\xEDlia",
    Estado: "11"
  },
  {
    ID: "1795",
    Nome: "Cuparaque",
    Estado: "11"
  },
  {
    ID: "1796",
    Nome: "Curral de Dentro",
    Estado: "11"
  },
  {
    ID: "1797",
    Nome: "Curvelo",
    Estado: "11"
  },
  {
    ID: "1798",
    Nome: "Datas",
    Estado: "11"
  },
  {
    ID: "1799",
    Nome: "Delfim Moreira",
    Estado: "11"
  },
  {
    ID: "1800",
    Nome: "Delfin\xF3polis",
    Estado: "11"
  },
  {
    ID: "1801",
    Nome: "Delta",
    Estado: "11"
  },
  {
    ID: "1802",
    Nome: "Descoberto",
    Estado: "11"
  },
  {
    ID: "1803",
    Nome: "Desterro de Entre Rios",
    Estado: "11"
  },
  {
    ID: "1804",
    Nome: "Desterro do Melo",
    Estado: "11"
  },
  {
    ID: "1805",
    Nome: "Diamantina",
    Estado: "11"
  },
  {
    ID: "1806",
    Nome: "Diogo de Vasconcelos",
    Estado: "11"
  },
  {
    ID: "1807",
    Nome: "Dion\xEDsio",
    Estado: "11"
  },
  {
    ID: "1808",
    Nome: "Divin\xE9sia",
    Estado: "11"
  },
  {
    ID: "1809",
    Nome: "Divino",
    Estado: "11"
  },
  {
    ID: "1810",
    Nome: "Divino das Laranjeiras",
    Estado: "11"
  },
  {
    ID: "1811",
    Nome: "Divinol\xE2ndia de Minas",
    Estado: "11"
  },
  {
    ID: "1812",
    Nome: "Divin\xF3polis",
    Estado: "11"
  },
  {
    ID: "1813",
    Nome: "Divisa Alegre",
    Estado: "11"
  },
  {
    ID: "1814",
    Nome: "Divisa Nova",
    Estado: "11"
  },
  {
    ID: "1815",
    Nome: "Divis\xF3polis",
    Estado: "11"
  },
  {
    ID: "1816",
    Nome: "Dom Bosco",
    Estado: "11"
  },
  {
    ID: "1817",
    Nome: "Dom Cavati",
    Estado: "11"
  },
  {
    ID: "1818",
    Nome: "Dom Joaquim",
    Estado: "11"
  },
  {
    ID: "1819",
    Nome: "Dom Silv\xE9rio",
    Estado: "11"
  },
  {
    ID: "1820",
    Nome: "Dom Vi\xE7oso",
    Estado: "11"
  },
  {
    ID: "1821",
    Nome: "Dona Eus\xE9bia",
    Estado: "11"
  },
  {
    ID: "1822",
    Nome: "Dores de Campos",
    Estado: "11"
  },
  {
    ID: "1823",
    Nome: "Dores de Guanh\xE3es",
    Estado: "11"
  },
  {
    ID: "1824",
    Nome: "Dores do Indai\xE1",
    Estado: "11"
  },
  {
    ID: "1825",
    Nome: "Dores do Turvo",
    Estado: "11"
  },
  {
    ID: "1826",
    Nome: "Dores\xF3polis",
    Estado: "11"
  },
  {
    ID: "1827",
    Nome: "Douradoquara",
    Estado: "11"
  },
  {
    ID: "1828",
    Nome: "Durand\xE9",
    Estado: "11"
  },
  {
    ID: "1829",
    Nome: "El\xF3i Mendes",
    Estado: "11"
  },
  {
    ID: "1830",
    Nome: "Engenheiro Caldas",
    Estado: "11"
  },
  {
    ID: "1831",
    Nome: "Engenheiro Navarro",
    Estado: "11"
  },
  {
    ID: "1832",
    Nome: "Entre Folhas",
    Estado: "11"
  },
  {
    ID: "1833",
    Nome: "Entre Rios de Minas",
    Estado: "11"
  },
  {
    ID: "1834",
    Nome: "Erv\xE1lia",
    Estado: "11"
  },
  {
    ID: "1835",
    Nome: "Esmeraldas",
    Estado: "11"
  },
  {
    ID: "1836",
    Nome: "Espera Feliz",
    Estado: "11"
  },
  {
    ID: "1837",
    Nome: "Espinosa",
    Estado: "11"
  },
  {
    ID: "1838",
    Nome: "Esp\xEDrito Santo do Dourado",
    Estado: "11"
  },
  {
    ID: "1839",
    Nome: "Estiva",
    Estado: "11"
  },
  {
    ID: "1840",
    Nome: "Estrela Dalva",
    Estado: "11"
  },
  {
    ID: "1841",
    Nome: "Estrela do Indai\xE1",
    Estado: "11"
  },
  {
    ID: "1842",
    Nome: "Estrela do Sul",
    Estado: "11"
  },
  {
    ID: "1843",
    Nome: "Eugen\xF3polis",
    Estado: "11"
  },
  {
    ID: "1844",
    Nome: "Ewbank da C\xE2mara",
    Estado: "11"
  },
  {
    ID: "1845",
    Nome: "Extrema",
    Estado: "11"
  },
  {
    ID: "1846",
    Nome: "Fama",
    Estado: "11"
  },
  {
    ID: "1847",
    Nome: "Faria Lemos",
    Estado: "11"
  },
  {
    ID: "1848",
    Nome: "Fel\xEDcio dos Santos",
    Estado: "11"
  },
  {
    ID: "1849",
    Nome: "Felisburgo",
    Estado: "11"
  },
  {
    ID: "1850",
    Nome: "Felixl\xE2ndia",
    Estado: "11"
  },
  {
    ID: "1851",
    Nome: "Fernandes Tourinho",
    Estado: "11"
  },
  {
    ID: "1852",
    Nome: "Ferros",
    Estado: "11"
  },
  {
    ID: "1853",
    Nome: "Fervedouro",
    Estado: "11"
  },
  {
    ID: "1854",
    Nome: "Florestal",
    Estado: "11"
  },
  {
    ID: "1855",
    Nome: "Formiga",
    Estado: "11"
  },
  {
    ID: "1856",
    Nome: "Formoso",
    Estado: "11"
  },
  {
    ID: "1857",
    Nome: "Fortaleza de Minas",
    Estado: "11"
  },
  {
    ID: "1858",
    Nome: "Fortuna de Minas",
    Estado: "11"
  },
  {
    ID: "1859",
    Nome: "Francisco Badar\xF3",
    Estado: "11"
  },
  {
    ID: "1860",
    Nome: "Francisco Dumont",
    Estado: "11"
  },
  {
    ID: "1861",
    Nome: "Francisco S\xE1",
    Estado: "11"
  },
  {
    ID: "1862",
    Nome: "Francisc\xF3polis",
    Estado: "11"
  },
  {
    ID: "1863",
    Nome: "Frei Gaspar",
    Estado: "11"
  },
  {
    ID: "1864",
    Nome: "Frei Inoc\xEAncio",
    Estado: "11"
  },
  {
    ID: "1865",
    Nome: "Frei Lagonegro",
    Estado: "11"
  },
  {
    ID: "1866",
    Nome: "Fronteira",
    Estado: "11"
  },
  {
    ID: "1867",
    Nome: "Fronteira dos Vales",
    Estado: "11"
  },
  {
    ID: "1868",
    Nome: "Fruta de Leite",
    Estado: "11"
  },
  {
    ID: "1869",
    Nome: "Frutal",
    Estado: "11"
  },
  {
    ID: "1870",
    Nome: "Funil\xE2ndia",
    Estado: "11"
  },
  {
    ID: "1871",
    Nome: "Galil\xE9ia",
    Estado: "11"
  },
  {
    ID: "1872",
    Nome: "Gameleiras",
    Estado: "11"
  },
  {
    ID: "1873",
    Nome: "Glaucil\xE2ndia",
    Estado: "11"
  },
  {
    ID: "1874",
    Nome: "Goiabeira",
    Estado: "11"
  },
  {
    ID: "1875",
    Nome: "Goian\xE1",
    Estado: "11"
  },
  {
    ID: "1876",
    Nome: "Gon\xE7alves",
    Estado: "11"
  },
  {
    ID: "1877",
    Nome: "Gonzaga",
    Estado: "11"
  },
  {
    ID: "1878",
    Nome: "Gouveia",
    Estado: "11"
  },
  {
    ID: "1879",
    Nome: "Governador Valadares",
    Estado: "11"
  },
  {
    ID: "1880",
    Nome: "Gr\xE3o Mogol",
    Estado: "11"
  },
  {
    ID: "1881",
    Nome: "Grupiara",
    Estado: "11"
  },
  {
    ID: "1882",
    Nome: "Guanh\xE3es",
    Estado: "11"
  },
  {
    ID: "1883",
    Nome: "Guap\xE9",
    Estado: "11"
  },
  {
    ID: "1884",
    Nome: "Guaraciaba",
    Estado: "11"
  },
  {
    ID: "1885",
    Nome: "Guaraciama",
    Estado: "11"
  },
  {
    ID: "1886",
    Nome: "Guaran\xE9sia",
    Estado: "11"
  },
  {
    ID: "1887",
    Nome: "Guarani",
    Estado: "11"
  },
  {
    ID: "1888",
    Nome: "Guarar\xE1",
    Estado: "11"
  },
  {
    ID: "1889",
    Nome: "Guarda-Mor",
    Estado: "11"
  },
  {
    ID: "1890",
    Nome: "Guaxup\xE9",
    Estado: "11"
  },
  {
    ID: "1891",
    Nome: "Guidoval",
    Estado: "11"
  },
  {
    ID: "1892",
    Nome: "Guimar\xE2nia",
    Estado: "11"
  },
  {
    ID: "1893",
    Nome: "Guiricema",
    Estado: "11"
  },
  {
    ID: "1894",
    Nome: "Gurinhat\xE3",
    Estado: "11"
  },
  {
    ID: "1895",
    Nome: "Heliodora",
    Estado: "11"
  },
  {
    ID: "1896",
    Nome: "Iapu",
    Estado: "11"
  },
  {
    ID: "1897",
    Nome: "Ibertioga",
    Estado: "11"
  },
  {
    ID: "1898",
    Nome: "Ibi\xE1",
    Estado: "11"
  },
  {
    ID: "1899",
    Nome: "Ibia\xED",
    Estado: "11"
  },
  {
    ID: "1900",
    Nome: "Ibiracatu",
    Estado: "11"
  },
  {
    ID: "1901",
    Nome: "Ibiraci",
    Estado: "11"
  },
  {
    ID: "1902",
    Nome: "Ibirit\xE9",
    Estado: "11"
  },
  {
    ID: "1903",
    Nome: "Ibiti\xFAra de Minas",
    Estado: "11"
  },
  {
    ID: "1904",
    Nome: "Ibituruna",
    Estado: "11"
  },
  {
    ID: "1905",
    Nome: "Icara\xED de Minas",
    Estado: "11"
  },
  {
    ID: "1906",
    Nome: "Igarap\xE9",
    Estado: "11"
  },
  {
    ID: "1907",
    Nome: "Igaratinga",
    Estado: "11"
  },
  {
    ID: "1908",
    Nome: "Iguatama",
    Estado: "11"
  },
  {
    ID: "1909",
    Nome: "Ijaci",
    Estado: "11"
  },
  {
    ID: "1910",
    Nome: "Ilic\xEDnea",
    Estado: "11"
  },
  {
    ID: "1911",
    Nome: "Imb\xE9 de Minas",
    Estado: "11"
  },
  {
    ID: "1912",
    Nome: "Inconfidentes",
    Estado: "11"
  },
  {
    ID: "1913",
    Nome: "Indaiabira",
    Estado: "11"
  },
  {
    ID: "1914",
    Nome: "Indian\xF3polis",
    Estado: "11"
  },
  {
    ID: "1915",
    Nome: "Inga\xED",
    Estado: "11"
  },
  {
    ID: "1916",
    Nome: "Inhapim",
    Estado: "11"
  },
  {
    ID: "1917",
    Nome: "Inha\xFAma",
    Estado: "11"
  },
  {
    ID: "1918",
    Nome: "Inimutaba",
    Estado: "11"
  },
  {
    ID: "1919",
    Nome: "Ipaba",
    Estado: "11"
  },
  {
    ID: "1920",
    Nome: "Ipanema",
    Estado: "11"
  },
  {
    ID: "1921",
    Nome: "Ipatinga",
    Estado: "11"
  },
  {
    ID: "1922",
    Nome: "Ipia\xE7u",
    Estado: "11"
  },
  {
    ID: "1923",
    Nome: "Ipui\xFAna",
    Estado: "11"
  },
  {
    ID: "1924",
    Nome: "Ira\xED de Minas",
    Estado: "11"
  },
  {
    ID: "1925",
    Nome: "Itabira",
    Estado: "11"
  },
  {
    ID: "1926",
    Nome: "Itabirinha de Mantena",
    Estado: "11"
  },
  {
    ID: "1927",
    Nome: "Itabirito",
    Estado: "11"
  },
  {
    ID: "1928",
    Nome: "Itacambira",
    Estado: "11"
  },
  {
    ID: "1929",
    Nome: "Itacarambi",
    Estado: "11"
  },
  {
    ID: "1930",
    Nome: "Itaguara",
    Estado: "11"
  },
  {
    ID: "1931",
    Nome: "Itaip\xE9",
    Estado: "11"
  },
  {
    ID: "1932",
    Nome: "Itajub\xE1",
    Estado: "11"
  },
  {
    ID: "1933",
    Nome: "Itamarandiba",
    Estado: "11"
  },
  {
    ID: "1934",
    Nome: "Itamarati de Minas",
    Estado: "11"
  },
  {
    ID: "1935",
    Nome: "Itambacuri",
    Estado: "11"
  },
  {
    ID: "1936",
    Nome: "Itamb\xE9 do Mato Dentro",
    Estado: "11"
  },
  {
    ID: "1937",
    Nome: "Itamogi",
    Estado: "11"
  },
  {
    ID: "1938",
    Nome: "Itamonte",
    Estado: "11"
  },
  {
    ID: "1939",
    Nome: "Itanhandu",
    Estado: "11"
  },
  {
    ID: "1940",
    Nome: "Itanhomi",
    Estado: "11"
  },
  {
    ID: "1941",
    Nome: "Itaobim",
    Estado: "11"
  },
  {
    ID: "1942",
    Nome: "Itapagipe",
    Estado: "11"
  },
  {
    ID: "1943",
    Nome: "Itapecerica",
    Estado: "11"
  },
  {
    ID: "1944",
    Nome: "Itapeva",
    Estado: "11"
  },
  {
    ID: "1945",
    Nome: "Itatiaiu\xE7u",
    Estado: "11"
  },
  {
    ID: "1946",
    Nome: "Ita\xFA de Minas",
    Estado: "11"
  },
  {
    ID: "1947",
    Nome: "Ita\xFAna",
    Estado: "11"
  },
  {
    ID: "1948",
    Nome: "Itaverava",
    Estado: "11"
  },
  {
    ID: "1949",
    Nome: "Itinga",
    Estado: "11"
  },
  {
    ID: "1950",
    Nome: "Itueta",
    Estado: "11"
  },
  {
    ID: "1951",
    Nome: "Ituiutaba",
    Estado: "11"
  },
  {
    ID: "1952",
    Nome: "Itumirim",
    Estado: "11"
  },
  {
    ID: "1953",
    Nome: "Iturama",
    Estado: "11"
  },
  {
    ID: "1954",
    Nome: "Itutinga",
    Estado: "11"
  },
  {
    ID: "1955",
    Nome: "Jaboticatubas",
    Estado: "11"
  },
  {
    ID: "1956",
    Nome: "Jacinto",
    Estado: "11"
  },
  {
    ID: "1957",
    Nome: "Jacu\xED",
    Estado: "11"
  },
  {
    ID: "1958",
    Nome: "Jacutinga",
    Estado: "11"
  },
  {
    ID: "1959",
    Nome: "Jaguara\xE7u",
    Estado: "11"
  },
  {
    ID: "1960",
    Nome: "Ja\xEDba",
    Estado: "11"
  },
  {
    ID: "1961",
    Nome: "Jampruca",
    Estado: "11"
  },
  {
    ID: "1962",
    Nome: "Jana\xFAba",
    Estado: "11"
  },
  {
    ID: "1963",
    Nome: "Janu\xE1ria",
    Estado: "11"
  },
  {
    ID: "1964",
    Nome: "Japara\xEDba",
    Estado: "11"
  },
  {
    ID: "1965",
    Nome: "Japonvar",
    Estado: "11"
  },
  {
    ID: "1966",
    Nome: "Jeceaba",
    Estado: "11"
  },
  {
    ID: "1967",
    Nome: "Jenipapo de Minas",
    Estado: "11"
  },
  {
    ID: "1968",
    Nome: "Jequeri",
    Estado: "11"
  },
  {
    ID: "1969",
    Nome: "Jequita\xED",
    Estado: "11"
  },
  {
    ID: "1970",
    Nome: "Jequitib\xE1",
    Estado: "11"
  },
  {
    ID: "1971",
    Nome: "Jequitinhonha",
    Estado: "11"
  },
  {
    ID: "1972",
    Nome: "Jesu\xE2nia",
    Estado: "11"
  },
  {
    ID: "1973",
    Nome: "Joa\xEDma",
    Estado: "11"
  },
  {
    ID: "1974",
    Nome: "Joan\xE9sia",
    Estado: "11"
  },
  {
    ID: "1975",
    Nome: "Jo\xE3o Monlevade",
    Estado: "11"
  },
  {
    ID: "1976",
    Nome: "Jo\xE3o Pinheiro",
    Estado: "11"
  },
  {
    ID: "1977",
    Nome: "Joaquim Fel\xEDcio",
    Estado: "11"
  },
  {
    ID: "1978",
    Nome: "Jord\xE2nia",
    Estado: "11"
  },
  {
    ID: "1979",
    Nome: "Jos\xE9 Gon\xE7alves de Minas",
    Estado: "11"
  },
  {
    ID: "1980",
    Nome: "Jos\xE9 Raydan",
    Estado: "11"
  },
  {
    ID: "1981",
    Nome: "Josen\xF3polis",
    Estado: "11"
  },
  {
    ID: "1982",
    Nome: "Juatuba",
    Estado: "11"
  },
  {
    ID: "1983",
    Nome: "Juiz de Fora",
    Estado: "11"
  },
  {
    ID: "1984",
    Nome: "Juramento",
    Estado: "11"
  },
  {
    ID: "1985",
    Nome: "Juruaia",
    Estado: "11"
  },
  {
    ID: "1986",
    Nome: "Juven\xEDlia",
    Estado: "11"
  },
  {
    ID: "1987",
    Nome: "Ladainha",
    Estado: "11"
  },
  {
    ID: "1988",
    Nome: "Lagamar",
    Estado: "11"
  },
  {
    ID: "1989",
    Nome: "Lagoa da Prata",
    Estado: "11"
  },
  {
    ID: "1990",
    Nome: "Lagoa dos Patos",
    Estado: "11"
  },
  {
    ID: "1991",
    Nome: "Lagoa Dourada",
    Estado: "11"
  },
  {
    ID: "1992",
    Nome: "Lagoa Formosa",
    Estado: "11"
  },
  {
    ID: "1993",
    Nome: "Lagoa Grande",
    Estado: "11"
  },
  {
    ID: "1994",
    Nome: "Lagoa Santa",
    Estado: "11"
  },
  {
    ID: "1995",
    Nome: "Lajinha",
    Estado: "11"
  },
  {
    ID: "1996",
    Nome: "Lambari",
    Estado: "11"
  },
  {
    ID: "1997",
    Nome: "Lamim",
    Estado: "11"
  },
  {
    ID: "1998",
    Nome: "Laranjal",
    Estado: "11"
  },
  {
    ID: "1999",
    Nome: "Lassance",
    Estado: "11"
  },
  {
    ID: "2000",
    Nome: "Lavras",
    Estado: "11"
  },
  {
    ID: "2001",
    Nome: "Leandro Ferreira",
    Estado: "11"
  },
  {
    ID: "2002",
    Nome: "Leme do Prado",
    Estado: "11"
  },
  {
    ID: "2003",
    Nome: "Leopoldina",
    Estado: "11"
  },
  {
    ID: "2004",
    Nome: "Liberdade",
    Estado: "11"
  },
  {
    ID: "2005",
    Nome: "Lima Duarte",
    Estado: "11"
  },
  {
    ID: "2006",
    Nome: "Limeira do Oeste",
    Estado: "11"
  },
  {
    ID: "2007",
    Nome: "Lontra",
    Estado: "11"
  },
  {
    ID: "2008",
    Nome: "Luisburgo",
    Estado: "11"
  },
  {
    ID: "2009",
    Nome: "Luisl\xE2ndia",
    Estado: "11"
  },
  {
    ID: "2010",
    Nome: "Lumin\xE1rias",
    Estado: "11"
  },
  {
    ID: "2011",
    Nome: "Luz",
    Estado: "11"
  },
  {
    ID: "2012",
    Nome: "Machacalis",
    Estado: "11"
  },
  {
    ID: "2013",
    Nome: "Machado",
    Estado: "11"
  },
  {
    ID: "2014",
    Nome: "Madre de Deus de Minas",
    Estado: "11"
  },
  {
    ID: "2015",
    Nome: "Malacacheta",
    Estado: "11"
  },
  {
    ID: "2016",
    Nome: "Mamonas",
    Estado: "11"
  },
  {
    ID: "2017",
    Nome: "Manga",
    Estado: "11"
  },
  {
    ID: "2018",
    Nome: "Manhua\xE7u",
    Estado: "11"
  },
  {
    ID: "2019",
    Nome: "Manhumirim",
    Estado: "11"
  },
  {
    ID: "2020",
    Nome: "Mantena",
    Estado: "11"
  },
  {
    ID: "2021",
    Nome: "Mar de Espanha",
    Estado: "11"
  },
  {
    ID: "2022",
    Nome: "Maravilhas",
    Estado: "11"
  },
  {
    ID: "2023",
    Nome: "Maria da F\xE9",
    Estado: "11"
  },
  {
    ID: "2024",
    Nome: "Mariana",
    Estado: "11"
  },
  {
    ID: "2025",
    Nome: "Marilac",
    Estado: "11"
  },
  {
    ID: "2026",
    Nome: "M\xE1rio Campos",
    Estado: "11"
  },
  {
    ID: "2027",
    Nome: "Marip\xE1 de Minas",
    Estado: "11"
  },
  {
    ID: "2028",
    Nome: "Marli\xE9ria",
    Estado: "11"
  },
  {
    ID: "2029",
    Nome: "Marmel\xF3polis",
    Estado: "11"
  },
  {
    ID: "2030",
    Nome: "Martinho Campos",
    Estado: "11"
  },
  {
    ID: "2031",
    Nome: "Martins Soares",
    Estado: "11"
  },
  {
    ID: "2032",
    Nome: "Mata Verde",
    Estado: "11"
  },
  {
    ID: "2033",
    Nome: "Materl\xE2ndia",
    Estado: "11"
  },
  {
    ID: "2034",
    Nome: "Mateus Leme",
    Estado: "11"
  },
  {
    ID: "2035",
    Nome: "Mathias Lobato",
    Estado: "11"
  },
  {
    ID: "2036",
    Nome: "Matias Barbosa",
    Estado: "11"
  },
  {
    ID: "2037",
    Nome: "Matias Cardoso",
    Estado: "11"
  },
  {
    ID: "2038",
    Nome: "Matip\xF3",
    Estado: "11"
  },
  {
    ID: "2039",
    Nome: "Mato Verde",
    Estado: "11"
  },
  {
    ID: "2040",
    Nome: "Matozinhos",
    Estado: "11"
  },
  {
    ID: "2041",
    Nome: "Matutina",
    Estado: "11"
  },
  {
    ID: "2042",
    Nome: "Medeiros",
    Estado: "11"
  },
  {
    ID: "2043",
    Nome: "Medina",
    Estado: "11"
  },
  {
    ID: "2044",
    Nome: "Mendes Pimentel",
    Estado: "11"
  },
  {
    ID: "2045",
    Nome: "Merc\xEAs",
    Estado: "11"
  },
  {
    ID: "2046",
    Nome: "Mesquita",
    Estado: "11"
  },
  {
    ID: "2047",
    Nome: "Minas Novas",
    Estado: "11"
  },
  {
    ID: "2048",
    Nome: "Minduri",
    Estado: "11"
  },
  {
    ID: "2049",
    Nome: "Mirabela",
    Estado: "11"
  },
  {
    ID: "2050",
    Nome: "Miradouro",
    Estado: "11"
  },
  {
    ID: "2051",
    Nome: "Mira\xED",
    Estado: "11"
  },
  {
    ID: "2052",
    Nome: "Mirav\xE2nia",
    Estado: "11"
  },
  {
    ID: "2053",
    Nome: "Moeda",
    Estado: "11"
  },
  {
    ID: "2054",
    Nome: "Moema",
    Estado: "11"
  },
  {
    ID: "2055",
    Nome: "Monjolos",
    Estado: "11"
  },
  {
    ID: "2056",
    Nome: "Monsenhor Paulo",
    Estado: "11"
  },
  {
    ID: "2057",
    Nome: "Montalv\xE2nia",
    Estado: "11"
  },
  {
    ID: "2058",
    Nome: "Monte Alegre de Minas",
    Estado: "11"
  },
  {
    ID: "2059",
    Nome: "Monte Azul",
    Estado: "11"
  },
  {
    ID: "2060",
    Nome: "Monte Belo",
    Estado: "11"
  },
  {
    ID: "2061",
    Nome: "Monte Carmelo",
    Estado: "11"
  },
  {
    ID: "2062",
    Nome: "Monte Formoso",
    Estado: "11"
  },
  {
    ID: "2063",
    Nome: "Monte Santo de Minas",
    Estado: "11"
  },
  {
    ID: "2064",
    Nome: "Monte Si\xE3o",
    Estado: "11"
  },
  {
    ID: "2065",
    Nome: "Montes Claros",
    Estado: "11"
  },
  {
    ID: "2066",
    Nome: "Montezuma",
    Estado: "11"
  },
  {
    ID: "2067",
    Nome: "Morada Nova de Minas",
    Estado: "11"
  },
  {
    ID: "2068",
    Nome: "Morro da Gar\xE7a",
    Estado: "11"
  },
  {
    ID: "2069",
    Nome: "Morro do Pilar",
    Estado: "11"
  },
  {
    ID: "2070",
    Nome: "Munhoz",
    Estado: "11"
  },
  {
    ID: "2071",
    Nome: "Muria\xE9",
    Estado: "11"
  },
  {
    ID: "2072",
    Nome: "Mutum",
    Estado: "11"
  },
  {
    ID: "2073",
    Nome: "Muzambinho",
    Estado: "11"
  },
  {
    ID: "2074",
    Nome: "Nacip Raydan",
    Estado: "11"
  },
  {
    ID: "2075",
    Nome: "Nanuque",
    Estado: "11"
  },
  {
    ID: "2076",
    Nome: "Naque",
    Estado: "11"
  },
  {
    ID: "2077",
    Nome: "Natal\xE2ndia",
    Estado: "11"
  },
  {
    ID: "2078",
    Nome: "Nat\xE9rcia",
    Estado: "11"
  },
  {
    ID: "2079",
    Nome: "Nazareno",
    Estado: "11"
  },
  {
    ID: "2080",
    Nome: "Nepomuceno",
    Estado: "11"
  },
  {
    ID: "2081",
    Nome: "Ninheira",
    Estado: "11"
  },
  {
    ID: "2082",
    Nome: "Nova Bel\xE9m",
    Estado: "11"
  },
  {
    ID: "2083",
    Nome: "Nova Era",
    Estado: "11"
  },
  {
    ID: "2084",
    Nome: "Nova Lima",
    Estado: "11"
  },
  {
    ID: "2085",
    Nome: "Nova M\xF3dica",
    Estado: "11"
  },
  {
    ID: "2086",
    Nome: "Nova Ponte",
    Estado: "11"
  },
  {
    ID: "2087",
    Nome: "Nova Porteirinha",
    Estado: "11"
  },
  {
    ID: "2088",
    Nome: "Nova Resende",
    Estado: "11"
  },
  {
    ID: "2089",
    Nome: "Nova Serrana",
    Estado: "11"
  },
  {
    ID: "2090",
    Nome: "Nova Uni\xE3o",
    Estado: "11"
  },
  {
    ID: "2091",
    Nome: "Novo Cruzeiro",
    Estado: "11"
  },
  {
    ID: "2092",
    Nome: "Novo Oriente de Minas",
    Estado: "11"
  },
  {
    ID: "2093",
    Nome: "Novorizonte",
    Estado: "11"
  },
  {
    ID: "2094",
    Nome: "Olaria",
    Estado: "11"
  },
  {
    ID: "2095",
    Nome: "Olhos-d`\xC1gua",
    Estado: "11"
  },
  {
    ID: "2096",
    Nome: "Ol\xEDmpio Noronha",
    Estado: "11"
  },
  {
    ID: "2097",
    Nome: "Oliveira",
    Estado: "11"
  },
  {
    ID: "2098",
    Nome: "Oliveira Fortes",
    Estado: "11"
  },
  {
    ID: "2099",
    Nome: "On\xE7a de Pitangui",
    Estado: "11"
  },
  {
    ID: "2100",
    Nome: "Orat\xF3rios",
    Estado: "11"
  },
  {
    ID: "2101",
    Nome: "Oriz\xE2nia",
    Estado: "11"
  },
  {
    ID: "2102",
    Nome: "Ouro Branco",
    Estado: "11"
  },
  {
    ID: "2103",
    Nome: "Ouro Fino",
    Estado: "11"
  },
  {
    ID: "2104",
    Nome: "Ouro Preto",
    Estado: "11"
  },
  {
    ID: "2105",
    Nome: "Ouro Verde de Minas",
    Estado: "11"
  },
  {
    ID: "2106",
    Nome: "Padre Carvalho",
    Estado: "11"
  },
  {
    ID: "2107",
    Nome: "Padre Para\xEDso",
    Estado: "11"
  },
  {
    ID: "2108",
    Nome: "Pai Pedro",
    Estado: "11"
  },
  {
    ID: "2109",
    Nome: "Paineiras",
    Estado: "11"
  },
  {
    ID: "2110",
    Nome: "Pains",
    Estado: "11"
  },
  {
    ID: "2111",
    Nome: "Paiva",
    Estado: "11"
  },
  {
    ID: "2112",
    Nome: "Palma",
    Estado: "11"
  },
  {
    ID: "2113",
    Nome: "Palm\xF3polis",
    Estado: "11"
  },
  {
    ID: "2114",
    Nome: "Papagaios",
    Estado: "11"
  },
  {
    ID: "2115",
    Nome: "Par\xE1 de Minas",
    Estado: "11"
  },
  {
    ID: "2116",
    Nome: "Paracatu",
    Estado: "11"
  },
  {
    ID: "2117",
    Nome: "Paragua\xE7u",
    Estado: "11"
  },
  {
    ID: "2118",
    Nome: "Parais\xF3polis",
    Estado: "11"
  },
  {
    ID: "2119",
    Nome: "Paraopeba",
    Estado: "11"
  },
  {
    ID: "2120",
    Nome: "Passa Quatro",
    Estado: "11"
  },
  {
    ID: "2121",
    Nome: "Passa Tempo",
    Estado: "11"
  },
  {
    ID: "2122",
    Nome: "Passab\xE9m",
    Estado: "11"
  },
  {
    ID: "2123",
    Nome: "Passa-Vinte",
    Estado: "11"
  },
  {
    ID: "2124",
    Nome: "Passos",
    Estado: "11"
  },
  {
    ID: "2125",
    Nome: "Patis",
    Estado: "11"
  },
  {
    ID: "2126",
    Nome: "Patos de Minas",
    Estado: "11"
  },
  {
    ID: "2127",
    Nome: "Patroc\xEDnio",
    Estado: "11"
  },
  {
    ID: "2128",
    Nome: "Patroc\xEDnio do Muria\xE9",
    Estado: "11"
  },
  {
    ID: "2129",
    Nome: "Paula C\xE2ndido",
    Estado: "11"
  },
  {
    ID: "2130",
    Nome: "Paulistas",
    Estado: "11"
  },
  {
    ID: "2131",
    Nome: "Pav\xE3o",
    Estado: "11"
  },
  {
    ID: "2132",
    Nome: "Pe\xE7anha",
    Estado: "11"
  },
  {
    ID: "2133",
    Nome: "Pedra Azul",
    Estado: "11"
  },
  {
    ID: "2134",
    Nome: "Pedra Bonita",
    Estado: "11"
  },
  {
    ID: "2135",
    Nome: "Pedra do Anta",
    Estado: "11"
  },
  {
    ID: "2136",
    Nome: "Pedra do Indai\xE1",
    Estado: "11"
  },
  {
    ID: "2137",
    Nome: "Pedra Dourada",
    Estado: "11"
  },
  {
    ID: "2138",
    Nome: "Pedralva",
    Estado: "11"
  },
  {
    ID: "2139",
    Nome: "Pedras de Maria da Cruz",
    Estado: "11"
  },
  {
    ID: "2140",
    Nome: "Pedrin\xF3polis",
    Estado: "11"
  },
  {
    ID: "2141",
    Nome: "Pedro Leopoldo",
    Estado: "11"
  },
  {
    ID: "2142",
    Nome: "Pedro Teixeira",
    Estado: "11"
  },
  {
    ID: "2143",
    Nome: "Pequeri",
    Estado: "11"
  },
  {
    ID: "2144",
    Nome: "Pequi",
    Estado: "11"
  },
  {
    ID: "2145",
    Nome: "Perdig\xE3o",
    Estado: "11"
  },
  {
    ID: "2146",
    Nome: "Perdizes",
    Estado: "11"
  },
  {
    ID: "2147",
    Nome: "Perd\xF5es",
    Estado: "11"
  },
  {
    ID: "2148",
    Nome: "Periquito",
    Estado: "11"
  },
  {
    ID: "2149",
    Nome: "Pescador",
    Estado: "11"
  },
  {
    ID: "2150",
    Nome: "Piau",
    Estado: "11"
  },
  {
    ID: "2151",
    Nome: "Piedade de Caratinga",
    Estado: "11"
  },
  {
    ID: "2152",
    Nome: "Piedade de Ponte Nova",
    Estado: "11"
  },
  {
    ID: "2153",
    Nome: "Piedade do Rio Grande",
    Estado: "11"
  },
  {
    ID: "2154",
    Nome: "Piedade dos Gerais",
    Estado: "11"
  },
  {
    ID: "2155",
    Nome: "Pimenta",
    Estado: "11"
  },
  {
    ID: "2156",
    Nome: "Pingo-d`\xC1gua",
    Estado: "11"
  },
  {
    ID: "2157",
    Nome: "Pint\xF3polis",
    Estado: "11"
  },
  {
    ID: "2158",
    Nome: "Piracema",
    Estado: "11"
  },
  {
    ID: "2159",
    Nome: "Pirajuba",
    Estado: "11"
  },
  {
    ID: "2160",
    Nome: "Piranga",
    Estado: "11"
  },
  {
    ID: "2161",
    Nome: "Pirangu\xE7u",
    Estado: "11"
  },
  {
    ID: "2162",
    Nome: "Piranguinho",
    Estado: "11"
  },
  {
    ID: "2163",
    Nome: "Pirapetinga",
    Estado: "11"
  },
  {
    ID: "2164",
    Nome: "Pirapora",
    Estado: "11"
  },
  {
    ID: "2165",
    Nome: "Pira\xFAba",
    Estado: "11"
  },
  {
    ID: "2166",
    Nome: "Pitangui",
    Estado: "11"
  },
  {
    ID: "2167",
    Nome: "Piumhi",
    Estado: "11"
  },
  {
    ID: "2168",
    Nome: "Planura",
    Estado: "11"
  },
  {
    ID: "2169",
    Nome: "Po\xE7o Fundo",
    Estado: "11"
  },
  {
    ID: "2170",
    Nome: "Po\xE7os de Caldas",
    Estado: "11"
  },
  {
    ID: "2171",
    Nome: "Pocrane",
    Estado: "11"
  },
  {
    ID: "2172",
    Nome: "Pomp\xE9u",
    Estado: "11"
  },
  {
    ID: "2173",
    Nome: "Ponte Nova",
    Estado: "11"
  },
  {
    ID: "2174",
    Nome: "Ponto Chique",
    Estado: "11"
  },
  {
    ID: "2175",
    Nome: "Ponto dos Volantes",
    Estado: "11"
  },
  {
    ID: "2176",
    Nome: "Porteirinha",
    Estado: "11"
  },
  {
    ID: "2177",
    Nome: "Porto Firme",
    Estado: "11"
  },
  {
    ID: "2178",
    Nome: "Pot\xE9",
    Estado: "11"
  },
  {
    ID: "2179",
    Nome: "Pouso Alegre",
    Estado: "11"
  },
  {
    ID: "2180",
    Nome: "Pouso Alto",
    Estado: "11"
  },
  {
    ID: "2181",
    Nome: "Prados",
    Estado: "11"
  },
  {
    ID: "2182",
    Nome: "Prata",
    Estado: "11"
  },
  {
    ID: "2183",
    Nome: "Prat\xE1polis",
    Estado: "11"
  },
  {
    ID: "2184",
    Nome: "Pratinha",
    Estado: "11"
  },
  {
    ID: "2185",
    Nome: "Presidente Bernardes",
    Estado: "11"
  },
  {
    ID: "2186",
    Nome: "Presidente Juscelino",
    Estado: "11"
  },
  {
    ID: "2187",
    Nome: "Presidente Kubitschek",
    Estado: "11"
  },
  {
    ID: "2188",
    Nome: "Presidente Oleg\xE1rio",
    Estado: "11"
  },
  {
    ID: "2189",
    Nome: "Prudente de Morais",
    Estado: "11"
  },
  {
    ID: "2190",
    Nome: "Quartel Geral",
    Estado: "11"
  },
  {
    ID: "2191",
    Nome: "Queluzito",
    Estado: "11"
  },
  {
    ID: "2192",
    Nome: "Raposos",
    Estado: "11"
  },
  {
    ID: "2193",
    Nome: "Raul Soares",
    Estado: "11"
  },
  {
    ID: "2194",
    Nome: "Recreio",
    Estado: "11"
  },
  {
    ID: "2195",
    Nome: "Reduto",
    Estado: "11"
  },
  {
    ID: "2196",
    Nome: "Resende Costa",
    Estado: "11"
  },
  {
    ID: "2197",
    Nome: "Resplendor",
    Estado: "11"
  },
  {
    ID: "2198",
    Nome: "Ressaquinha",
    Estado: "11"
  },
  {
    ID: "2199",
    Nome: "Riachinho",
    Estado: "11"
  },
  {
    ID: "2200",
    Nome: "Riacho dos Machados",
    Estado: "11"
  },
  {
    ID: "2201",
    Nome: "Ribeir\xE3o das Neves",
    Estado: "11"
  },
  {
    ID: "2202",
    Nome: "Ribeir\xE3o Vermelho",
    Estado: "11"
  },
  {
    ID: "2203",
    Nome: "Rio Acima",
    Estado: "11"
  },
  {
    ID: "2204",
    Nome: "Rio Casca",
    Estado: "11"
  },
  {
    ID: "2205",
    Nome: "Rio do Prado",
    Estado: "11"
  },
  {
    ID: "2206",
    Nome: "Rio Doce",
    Estado: "11"
  },
  {
    ID: "2207",
    Nome: "Rio Espera",
    Estado: "11"
  },
  {
    ID: "2208",
    Nome: "Rio Manso",
    Estado: "11"
  },
  {
    ID: "2209",
    Nome: "Rio Novo",
    Estado: "11"
  },
  {
    ID: "2210",
    Nome: "Rio Parana\xEDba",
    Estado: "11"
  },
  {
    ID: "2211",
    Nome: "Rio Pardo de Minas",
    Estado: "11"
  },
  {
    ID: "2212",
    Nome: "Rio Piracicaba",
    Estado: "11"
  },
  {
    ID: "2213",
    Nome: "Rio Pomba",
    Estado: "11"
  },
  {
    ID: "2214",
    Nome: "Rio Preto",
    Estado: "11"
  },
  {
    ID: "2215",
    Nome: "Rio Vermelho",
    Estado: "11"
  },
  {
    ID: "2216",
    Nome: "Rit\xE1polis",
    Estado: "11"
  },
  {
    ID: "2217",
    Nome: "Rochedo de Minas",
    Estado: "11"
  },
  {
    ID: "2218",
    Nome: "Rodeiro",
    Estado: "11"
  },
  {
    ID: "2219",
    Nome: "Romaria",
    Estado: "11"
  },
  {
    ID: "2220",
    Nome: "Ros\xE1rio da Limeira",
    Estado: "11"
  },
  {
    ID: "2221",
    Nome: "Rubelita",
    Estado: "11"
  },
  {
    ID: "2222",
    Nome: "Rubim",
    Estado: "11"
  },
  {
    ID: "2223",
    Nome: "Sabar\xE1",
    Estado: "11"
  },
  {
    ID: "2224",
    Nome: "Sabin\xF3polis",
    Estado: "11"
  },
  {
    ID: "2225",
    Nome: "Sacramento",
    Estado: "11"
  },
  {
    ID: "2226",
    Nome: "Salinas",
    Estado: "11"
  },
  {
    ID: "2227",
    Nome: "Salto da Divisa",
    Estado: "11"
  },
  {
    ID: "2228",
    Nome: "Santa B\xE1rbara",
    Estado: "11"
  },
  {
    ID: "2229",
    Nome: "Santa B\xE1rbara do Leste",
    Estado: "11"
  },
  {
    ID: "2230",
    Nome: "Santa B\xE1rbara do Monte Verde",
    Estado: "11"
  },
  {
    ID: "2231",
    Nome: "Santa B\xE1rbara do Tug\xFArio",
    Estado: "11"
  },
  {
    ID: "2232",
    Nome: "Santa Cruz de Minas",
    Estado: "11"
  },
  {
    ID: "2233",
    Nome: "Santa Cruz de Salinas",
    Estado: "11"
  },
  {
    ID: "2234",
    Nome: "Santa Cruz do Escalvado",
    Estado: "11"
  },
  {
    ID: "2235",
    Nome: "Santa Efig\xEAnia de Minas",
    Estado: "11"
  },
  {
    ID: "2236",
    Nome: "Santa F\xE9 de Minas",
    Estado: "11"
  },
  {
    ID: "2237",
    Nome: "Santa Helena de Minas",
    Estado: "11"
  },
  {
    ID: "2238",
    Nome: "Santa Juliana",
    Estado: "11"
  },
  {
    ID: "2239",
    Nome: "Santa Luzia",
    Estado: "11"
  },
  {
    ID: "2240",
    Nome: "Santa Margarida",
    Estado: "11"
  },
  {
    ID: "2241",
    Nome: "Santa Maria de Itabira",
    Estado: "11"
  },
  {
    ID: "2242",
    Nome: "Santa Maria do Salto",
    Estado: "11"
  },
  {
    ID: "2243",
    Nome: "Santa Maria do Sua\xE7u\xED",
    Estado: "11"
  },
  {
    ID: "2244",
    Nome: "Santa Rita de Caldas",
    Estado: "11"
  },
  {
    ID: "2245",
    Nome: "Santa Rita de Ibitipoca",
    Estado: "11"
  },
  {
    ID: "2246",
    Nome: "Santa Rita de Jacutinga",
    Estado: "11"
  },
  {
    ID: "2247",
    Nome: "Santa Rita de Minas",
    Estado: "11"
  },
  {
    ID: "2248",
    Nome: "Santa Rita do Itueto",
    Estado: "11"
  },
  {
    ID: "2249",
    Nome: "Santa Rita do Sapuca\xED",
    Estado: "11"
  },
  {
    ID: "2250",
    Nome: "Santa Rosa da Serra",
    Estado: "11"
  },
  {
    ID: "2251",
    Nome: "Santa Vit\xF3ria",
    Estado: "11"
  },
  {
    ID: "2252",
    Nome: "Santana da Vargem",
    Estado: "11"
  },
  {
    ID: "2253",
    Nome: "Santana de Cataguases",
    Estado: "11"
  },
  {
    ID: "2254",
    Nome: "Santana de Pirapama",
    Estado: "11"
  },
  {
    ID: "2255",
    Nome: "Santana do Deserto",
    Estado: "11"
  },
  {
    ID: "2256",
    Nome: "Santana do Garamb\xE9u",
    Estado: "11"
  },
  {
    ID: "2257",
    Nome: "Santana do Jacar\xE9",
    Estado: "11"
  },
  {
    ID: "2258",
    Nome: "Santana do Manhua\xE7u",
    Estado: "11"
  },
  {
    ID: "2259",
    Nome: "Santana do Para\xEDso",
    Estado: "11"
  },
  {
    ID: "2260",
    Nome: "Santana do Riacho",
    Estado: "11"
  },
  {
    ID: "2261",
    Nome: "Santana dos Montes",
    Estado: "11"
  },
  {
    ID: "2262",
    Nome: "Santo Ant\xF4nio do Amparo",
    Estado: "11"
  },
  {
    ID: "2263",
    Nome: "Santo Ant\xF4nio do Aventureiro",
    Estado: "11"
  },
  {
    ID: "2264",
    Nome: "Santo Ant\xF4nio do Grama",
    Estado: "11"
  },
  {
    ID: "2265",
    Nome: "Santo Ant\xF4nio do Itamb\xE9",
    Estado: "11"
  },
  {
    ID: "2266",
    Nome: "Santo Ant\xF4nio do Jacinto",
    Estado: "11"
  },
  {
    ID: "2267",
    Nome: "Santo Ant\xF4nio do Monte",
    Estado: "11"
  },
  {
    ID: "2268",
    Nome: "Santo Ant\xF4nio do Retiro",
    Estado: "11"
  },
  {
    ID: "2269",
    Nome: "Santo Ant\xF4nio do Rio Abaixo",
    Estado: "11"
  },
  {
    ID: "2270",
    Nome: "Santo Hip\xF3lito",
    Estado: "11"
  },
  {
    ID: "2271",
    Nome: "Santos Dumont",
    Estado: "11"
  },
  {
    ID: "2272",
    Nome: "S\xE3o Bento Abade",
    Estado: "11"
  },
  {
    ID: "2273",
    Nome: "S\xE3o Br\xE1s do Sua\xE7u\xED",
    Estado: "11"
  },
  {
    ID: "2274",
    Nome: "S\xE3o Domingos das Dores",
    Estado: "11"
  },
  {
    ID: "2275",
    Nome: "S\xE3o Domingos do Prata",
    Estado: "11"
  },
  {
    ID: "2276",
    Nome: "S\xE3o F\xE9lix de Minas",
    Estado: "11"
  },
  {
    ID: "2277",
    Nome: "S\xE3o Francisco",
    Estado: "11"
  },
  {
    ID: "2278",
    Nome: "S\xE3o Francisco de Paula",
    Estado: "11"
  },
  {
    ID: "2279",
    Nome: "S\xE3o Francisco de Sales",
    Estado: "11"
  },
  {
    ID: "2280",
    Nome: "S\xE3o Francisco do Gl\xF3ria",
    Estado: "11"
  },
  {
    ID: "2281",
    Nome: "S\xE3o Geraldo",
    Estado: "11"
  },
  {
    ID: "2282",
    Nome: "S\xE3o Geraldo da Piedade",
    Estado: "11"
  },
  {
    ID: "2283",
    Nome: "S\xE3o Geraldo do Baixio",
    Estado: "11"
  },
  {
    ID: "2284",
    Nome: "S\xE3o Gon\xE7alo do Abaet\xE9",
    Estado: "11"
  },
  {
    ID: "2285",
    Nome: "S\xE3o Gon\xE7alo do Par\xE1",
    Estado: "11"
  },
  {
    ID: "2286",
    Nome: "S\xE3o Gon\xE7alo do Rio Abaixo",
    Estado: "11"
  },
  {
    ID: "2287",
    Nome: "S\xE3o Gon\xE7alo do Rio Preto",
    Estado: "11"
  },
  {
    ID: "2288",
    Nome: "S\xE3o Gon\xE7alo do Sapuca\xED",
    Estado: "11"
  },
  {
    ID: "2289",
    Nome: "S\xE3o Gotardo",
    Estado: "11"
  },
  {
    ID: "2290",
    Nome: "S\xE3o Jo\xE3o Batista do Gl\xF3ria",
    Estado: "11"
  },
  {
    ID: "2291",
    Nome: "S\xE3o Jo\xE3o da Lagoa",
    Estado: "11"
  },
  {
    ID: "2292",
    Nome: "S\xE3o Jo\xE3o da Mata",
    Estado: "11"
  },
  {
    ID: "2293",
    Nome: "S\xE3o Jo\xE3o da Ponte",
    Estado: "11"
  },
  {
    ID: "2294",
    Nome: "S\xE3o Jo\xE3o das Miss\xF5es",
    Estado: "11"
  },
  {
    ID: "2295",
    Nome: "S\xE3o Jo\xE3o del Rei",
    Estado: "11"
  },
  {
    ID: "2296",
    Nome: "S\xE3o Jo\xE3o do Manhua\xE7u",
    Estado: "11"
  },
  {
    ID: "2297",
    Nome: "S\xE3o Jo\xE3o do Manteninha",
    Estado: "11"
  },
  {
    ID: "2298",
    Nome: "S\xE3o Jo\xE3o do Oriente",
    Estado: "11"
  },
  {
    ID: "2299",
    Nome: "S\xE3o Jo\xE3o do Pacu\xED",
    Estado: "11"
  },
  {
    ID: "2300",
    Nome: "S\xE3o Jo\xE3o do Para\xEDso",
    Estado: "11"
  },
  {
    ID: "2301",
    Nome: "S\xE3o Jo\xE3o Evangelista",
    Estado: "11"
  },
  {
    ID: "2302",
    Nome: "S\xE3o Jo\xE3o Nepomuceno",
    Estado: "11"
  },
  {
    ID: "2303",
    Nome: "S\xE3o Joaquim de Bicas",
    Estado: "11"
  },
  {
    ID: "2304",
    Nome: "S\xE3o Jos\xE9 da Barra",
    Estado: "11"
  },
  {
    ID: "2305",
    Nome: "S\xE3o Jos\xE9 da Lapa",
    Estado: "11"
  },
  {
    ID: "2306",
    Nome: "S\xE3o Jos\xE9 da Safira",
    Estado: "11"
  },
  {
    ID: "2307",
    Nome: "S\xE3o Jos\xE9 da Varginha",
    Estado: "11"
  },
  {
    ID: "2308",
    Nome: "S\xE3o Jos\xE9 do Alegre",
    Estado: "11"
  },
  {
    ID: "2309",
    Nome: "S\xE3o Jos\xE9 do Divino",
    Estado: "11"
  },
  {
    ID: "2310",
    Nome: "S\xE3o Jos\xE9 do Goiabal",
    Estado: "11"
  },
  {
    ID: "2311",
    Nome: "S\xE3o Jos\xE9 do Jacuri",
    Estado: "11"
  },
  {
    ID: "2312",
    Nome: "S\xE3o Jos\xE9 do Mantimento",
    Estado: "11"
  },
  {
    ID: "2313",
    Nome: "S\xE3o Louren\xE7o",
    Estado: "11"
  },
  {
    ID: "2314",
    Nome: "S\xE3o Miguel do Anta",
    Estado: "11"
  },
  {
    ID: "2315",
    Nome: "S\xE3o Pedro da Uni\xE3o",
    Estado: "11"
  },
  {
    ID: "2316",
    Nome: "S\xE3o Pedro do Sua\xE7u\xED",
    Estado: "11"
  },
  {
    ID: "2317",
    Nome: "S\xE3o Pedro dos Ferros",
    Estado: "11"
  },
  {
    ID: "2318",
    Nome: "S\xE3o Rom\xE3o",
    Estado: "11"
  },
  {
    ID: "2319",
    Nome: "S\xE3o Roque de Minas",
    Estado: "11"
  },
  {
    ID: "2320",
    Nome: "S\xE3o Sebasti\xE3o da Bela Vista",
    Estado: "11"
  },
  {
    ID: "2321",
    Nome: "S\xE3o Sebasti\xE3o da Vargem Alegre",
    Estado: "11"
  },
  {
    ID: "2322",
    Nome: "S\xE3o Sebasti\xE3o do Anta",
    Estado: "11"
  },
  {
    ID: "2323",
    Nome: "S\xE3o Sebasti\xE3o do Maranh\xE3o",
    Estado: "11"
  },
  {
    ID: "2324",
    Nome: "S\xE3o Sebasti\xE3o do Oeste",
    Estado: "11"
  },
  {
    ID: "2325",
    Nome: "S\xE3o Sebasti\xE3o do Para\xEDso",
    Estado: "11"
  },
  {
    ID: "2326",
    Nome: "S\xE3o Sebasti\xE3o do Rio Preto",
    Estado: "11"
  },
  {
    ID: "2327",
    Nome: "S\xE3o Sebasti\xE3o do Rio Verde",
    Estado: "11"
  },
  {
    ID: "2328",
    Nome: "S\xE3o Thom\xE9 das Letras",
    Estado: "11"
  },
  {
    ID: "2329",
    Nome: "S\xE3o Tiago",
    Estado: "11"
  },
  {
    ID: "2330",
    Nome: "S\xE3o Tom\xE1s de Aquino",
    Estado: "11"
  },
  {
    ID: "2331",
    Nome: "S\xE3o Vicente de Minas",
    Estado: "11"
  },
  {
    ID: "2332",
    Nome: "Sapuca\xED-Mirim",
    Estado: "11"
  },
  {
    ID: "2333",
    Nome: "Sardo\xE1",
    Estado: "11"
  },
  {
    ID: "2334",
    Nome: "Sarzedo",
    Estado: "11"
  },
  {
    ID: "2335",
    Nome: "Sem-Peixe",
    Estado: "11"
  },
  {
    ID: "2336",
    Nome: "Senador Amaral",
    Estado: "11"
  },
  {
    ID: "2337",
    Nome: "Senador Cortes",
    Estado: "11"
  },
  {
    ID: "2338",
    Nome: "Senador Firmino",
    Estado: "11"
  },
  {
    ID: "2339",
    Nome: "Senador Jos\xE9 Bento",
    Estado: "11"
  },
  {
    ID: "2340",
    Nome: "Senador Modestino Gon\xE7alves",
    Estado: "11"
  },
  {
    ID: "2341",
    Nome: "Senhora de Oliveira",
    Estado: "11"
  },
  {
    ID: "2342",
    Nome: "Senhora do Porto",
    Estado: "11"
  },
  {
    ID: "2343",
    Nome: "Senhora dos Rem\xE9dios",
    Estado: "11"
  },
  {
    ID: "2344",
    Nome: "Sericita",
    Estado: "11"
  },
  {
    ID: "2345",
    Nome: "Seritinga",
    Estado: "11"
  },
  {
    ID: "2346",
    Nome: "Serra Azul de Minas",
    Estado: "11"
  },
  {
    ID: "2347",
    Nome: "Serra da Saudade",
    Estado: "11"
  },
  {
    ID: "2348",
    Nome: "Serra do Salitre",
    Estado: "11"
  },
  {
    ID: "2349",
    Nome: "Serra dos Aimor\xE9s",
    Estado: "11"
  },
  {
    ID: "2350",
    Nome: "Serrania",
    Estado: "11"
  },
  {
    ID: "2351",
    Nome: "Serran\xF3polis de Minas",
    Estado: "11"
  },
  {
    ID: "2352",
    Nome: "Serranos",
    Estado: "11"
  },
  {
    ID: "2353",
    Nome: "Serro",
    Estado: "11"
  },
  {
    ID: "2354",
    Nome: "Sete Lagoas",
    Estado: "11"
  },
  {
    ID: "2355",
    Nome: "Setubinha",
    Estado: "11"
  },
  {
    ID: "2356",
    Nome: "Silveir\xE2nia",
    Estado: "11"
  },
  {
    ID: "2357",
    Nome: "Silvian\xF3polis",
    Estado: "11"
  },
  {
    ID: "2358",
    Nome: "Sim\xE3o Pereira",
    Estado: "11"
  },
  {
    ID: "2359",
    Nome: "Simon\xE9sia",
    Estado: "11"
  },
  {
    ID: "2360",
    Nome: "Sobr\xE1lia",
    Estado: "11"
  },
  {
    ID: "2361",
    Nome: "Soledade de Minas",
    Estado: "11"
  },
  {
    ID: "2362",
    Nome: "Tabuleiro",
    Estado: "11"
  },
  {
    ID: "2363",
    Nome: "Taiobeiras",
    Estado: "11"
  },
  {
    ID: "2364",
    Nome: "Taparuba",
    Estado: "11"
  },
  {
    ID: "2365",
    Nome: "Tapira",
    Estado: "11"
  },
  {
    ID: "2366",
    Nome: "Tapira\xED",
    Estado: "11"
  },
  {
    ID: "2367",
    Nome: "Taquara\xE7u de Minas",
    Estado: "11"
  },
  {
    ID: "2368",
    Nome: "Tarumirim",
    Estado: "11"
  },
  {
    ID: "2369",
    Nome: "Teixeiras",
    Estado: "11"
  },
  {
    ID: "2370",
    Nome: "Te\xF3filo Otoni",
    Estado: "11"
  },
  {
    ID: "2371",
    Nome: "Tim\xF3teo",
    Estado: "11"
  },
  {
    ID: "2372",
    Nome: "Tiradentes",
    Estado: "11"
  },
  {
    ID: "2373",
    Nome: "Tiros",
    Estado: "11"
  },
  {
    ID: "2374",
    Nome: "Tocantins",
    Estado: "11"
  },
  {
    ID: "2375",
    Nome: "Tocos do Moji",
    Estado: "11"
  },
  {
    ID: "2376",
    Nome: "Toledo",
    Estado: "11"
  },
  {
    ID: "2377",
    Nome: "Tombos",
    Estado: "11"
  },
  {
    ID: "2378",
    Nome: "Tr\xEAs Cora\xE7\xF5es",
    Estado: "11"
  },
  {
    ID: "2379",
    Nome: "Tr\xEAs Marias",
    Estado: "11"
  },
  {
    ID: "2380",
    Nome: "Tr\xEAs Pontas",
    Estado: "11"
  },
  {
    ID: "2381",
    Nome: "Tumiritinga",
    Estado: "11"
  },
  {
    ID: "2382",
    Nome: "Tupaciguara",
    Estado: "11"
  },
  {
    ID: "2383",
    Nome: "Turmalina",
    Estado: "11"
  },
  {
    ID: "2384",
    Nome: "Turvol\xE2ndia",
    Estado: "11"
  },
  {
    ID: "2385",
    Nome: "Ub\xE1",
    Estado: "11"
  },
  {
    ID: "2386",
    Nome: "Uba\xED",
    Estado: "11"
  },
  {
    ID: "2387",
    Nome: "Ubaporanga",
    Estado: "11"
  },
  {
    ID: "2388",
    Nome: "Uberaba",
    Estado: "11"
  },
  {
    ID: "2389",
    Nome: "Uberl\xE2ndia",
    Estado: "11"
  },
  {
    ID: "2390",
    Nome: "Umburatiba",
    Estado: "11"
  },
  {
    ID: "2391",
    Nome: "Una\xED",
    Estado: "11"
  },
  {
    ID: "2392",
    Nome: "Uni\xE3o de Minas",
    Estado: "11"
  },
  {
    ID: "2393",
    Nome: "Uruana de Minas",
    Estado: "11"
  },
  {
    ID: "2394",
    Nome: "Uruc\xE2nia",
    Estado: "11"
  },
  {
    ID: "2395",
    Nome: "Urucuia",
    Estado: "11"
  },
  {
    ID: "2396",
    Nome: "Vargem Alegre",
    Estado: "11"
  },
  {
    ID: "2397",
    Nome: "Vargem Bonita",
    Estado: "11"
  },
  {
    ID: "2398",
    Nome: "Vargem Grande do Rio Pardo",
    Estado: "11"
  },
  {
    ID: "2399",
    Nome: "Varginha",
    Estado: "11"
  },
  {
    ID: "2400",
    Nome: "Varj\xE3o de Minas",
    Estado: "11"
  },
  {
    ID: "2401",
    Nome: "V\xE1rzea da Palma",
    Estado: "11"
  },
  {
    ID: "2402",
    Nome: "Varzel\xE2ndia",
    Estado: "11"
  },
  {
    ID: "2403",
    Nome: "Vazante",
    Estado: "11"
  },
  {
    ID: "2404",
    Nome: "Verdel\xE2ndia",
    Estado: "11"
  },
  {
    ID: "2405",
    Nome: "Veredinha",
    Estado: "11"
  },
  {
    ID: "2406",
    Nome: "Ver\xEDssimo",
    Estado: "11"
  },
  {
    ID: "2407",
    Nome: "Vermelho Novo",
    Estado: "11"
  },
  {
    ID: "2408",
    Nome: "Vespasiano",
    Estado: "11"
  },
  {
    ID: "2409",
    Nome: "Vi\xE7osa",
    Estado: "11"
  },
  {
    ID: "2410",
    Nome: "Vieiras",
    Estado: "11"
  },
  {
    ID: "2411",
    Nome: "Virgem da Lapa",
    Estado: "11"
  },
  {
    ID: "2412",
    Nome: "Virg\xEDnia",
    Estado: "11"
  },
  {
    ID: "2413",
    Nome: "Virgin\xF3polis",
    Estado: "11"
  },
  {
    ID: "2414",
    Nome: "Virgol\xE2ndia",
    Estado: "11"
  },
  {
    ID: "2415",
    Nome: "Visconde do Rio Branco",
    Estado: "11"
  },
  {
    ID: "2416",
    Nome: "Volta Grande",
    Estado: "11"
  },
  {
    ID: "2417",
    Nome: "Wenceslau Braz",
    Estado: "11"
  },
  {
    ID: "2418",
    Nome: "Abaetetuba",
    Estado: "14"
  },
  {
    ID: "2419",
    Nome: "Abel Figueiredo",
    Estado: "14"
  },
  {
    ID: "2420",
    Nome: "Acar\xE1",
    Estado: "14"
  },
  {
    ID: "2421",
    Nome: "Afu\xE1",
    Estado: "14"
  },
  {
    ID: "2422",
    Nome: "\xC1gua Azul do Norte",
    Estado: "14"
  },
  {
    ID: "2423",
    Nome: "Alenquer",
    Estado: "14"
  },
  {
    ID: "2424",
    Nome: "Almeirim",
    Estado: "14"
  },
  {
    ID: "2425",
    Nome: "Altamira",
    Estado: "14"
  },
  {
    ID: "2426",
    Nome: "Anaj\xE1s",
    Estado: "14"
  },
  {
    ID: "2427",
    Nome: "Ananindeua",
    Estado: "14"
  },
  {
    ID: "2428",
    Nome: "Anapu",
    Estado: "14"
  },
  {
    ID: "2429",
    Nome: "Augusto Corr\xEAa",
    Estado: "14"
  },
  {
    ID: "2430",
    Nome: "Aurora do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2431",
    Nome: "Aveiro",
    Estado: "14"
  },
  {
    ID: "2432",
    Nome: "Bagre",
    Estado: "14"
  },
  {
    ID: "2433",
    Nome: "Bai\xE3o",
    Estado: "14"
  },
  {
    ID: "2434",
    Nome: "Bannach",
    Estado: "14"
  },
  {
    ID: "2435",
    Nome: "Barcarena",
    Estado: "14"
  },
  {
    ID: "2436",
    Nome: "Bel\xE9m",
    Estado: "14"
  },
  {
    ID: "2437",
    Nome: "Belterra",
    Estado: "14"
  },
  {
    ID: "2438",
    Nome: "Benevides",
    Estado: "14"
  },
  {
    ID: "2439",
    Nome: "Bom Jesus do Tocantins",
    Estado: "14"
  },
  {
    ID: "2440",
    Nome: "Bonito",
    Estado: "14"
  },
  {
    ID: "2441",
    Nome: "Bragan\xE7a",
    Estado: "14"
  },
  {
    ID: "2442",
    Nome: "Brasil Novo",
    Estado: "14"
  },
  {
    ID: "2443",
    Nome: "Brejo Grande do Araguaia",
    Estado: "14"
  },
  {
    ID: "2444",
    Nome: "Breu Branco",
    Estado: "14"
  },
  {
    ID: "2445",
    Nome: "Breves",
    Estado: "14"
  },
  {
    ID: "2446",
    Nome: "Bujaru",
    Estado: "14"
  },
  {
    ID: "2447",
    Nome: "Cachoeira do Arari",
    Estado: "14"
  },
  {
    ID: "2448",
    Nome: "Cachoeira do Piri\xE1",
    Estado: "14"
  },
  {
    ID: "2449",
    Nome: "Camet\xE1",
    Estado: "14"
  },
  {
    ID: "2450",
    Nome: "Cana\xE3 dos Caraj\xE1s",
    Estado: "14"
  },
  {
    ID: "2451",
    Nome: "Capanema",
    Estado: "14"
  },
  {
    ID: "2452",
    Nome: "Capit\xE3o Po\xE7o",
    Estado: "14"
  },
  {
    ID: "2453",
    Nome: "Castanhal",
    Estado: "14"
  },
  {
    ID: "2454",
    Nome: "Chaves",
    Estado: "14"
  },
  {
    ID: "2455",
    Nome: "Colares",
    Estado: "14"
  },
  {
    ID: "2456",
    Nome: "Concei\xE7\xE3o do Araguaia",
    Estado: "14"
  },
  {
    ID: "2457",
    Nome: "Conc\xF3rdia do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2458",
    Nome: "Cumaru do Norte",
    Estado: "14"
  },
  {
    ID: "2459",
    Nome: "Curion\xF3polis",
    Estado: "14"
  },
  {
    ID: "2460",
    Nome: "Curralinho",
    Estado: "14"
  },
  {
    ID: "2461",
    Nome: "Curu\xE1",
    Estado: "14"
  },
  {
    ID: "2462",
    Nome: "Curu\xE7\xE1",
    Estado: "14"
  },
  {
    ID: "2463",
    Nome: "Dom Eliseu",
    Estado: "14"
  },
  {
    ID: "2464",
    Nome: "Eldorado dos Caraj\xE1s",
    Estado: "14"
  },
  {
    ID: "2465",
    Nome: "Faro",
    Estado: "14"
  },
  {
    ID: "2466",
    Nome: "Floresta do Araguaia",
    Estado: "14"
  },
  {
    ID: "2467",
    Nome: "Garraf\xE3o do Norte",
    Estado: "14"
  },
  {
    ID: "2468",
    Nome: "Goian\xE9sia do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2469",
    Nome: "Gurup\xE1",
    Estado: "14"
  },
  {
    ID: "2470",
    Nome: "Igarap\xE9-A\xE7u",
    Estado: "14"
  },
  {
    ID: "2471",
    Nome: "Igarap\xE9-Miri",
    Estado: "14"
  },
  {
    ID: "2472",
    Nome: "Inhangapi",
    Estado: "14"
  },
  {
    ID: "2473",
    Nome: "Ipixuna do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2474",
    Nome: "Irituia",
    Estado: "14"
  },
  {
    ID: "2475",
    Nome: "Itaituba",
    Estado: "14"
  },
  {
    ID: "2476",
    Nome: "Itupiranga",
    Estado: "14"
  },
  {
    ID: "2477",
    Nome: "Jacareacanga",
    Estado: "14"
  },
  {
    ID: "2478",
    Nome: "Jacund\xE1",
    Estado: "14"
  },
  {
    ID: "2479",
    Nome: "Juruti",
    Estado: "14"
  },
  {
    ID: "2480",
    Nome: "Limoeiro do Ajuru",
    Estado: "14"
  },
  {
    ID: "2481",
    Nome: "M\xE3e do Rio",
    Estado: "14"
  },
  {
    ID: "2482",
    Nome: "Magalh\xE3es Barata",
    Estado: "14"
  },
  {
    ID: "2483",
    Nome: "Marab\xE1",
    Estado: "14"
  },
  {
    ID: "2484",
    Nome: "Maracan\xE3",
    Estado: "14"
  },
  {
    ID: "2485",
    Nome: "Marapanim",
    Estado: "14"
  },
  {
    ID: "2486",
    Nome: "Marituba",
    Estado: "14"
  },
  {
    ID: "2487",
    Nome: "Medicil\xE2ndia",
    Estado: "14"
  },
  {
    ID: "2488",
    Nome: "Melga\xE7o",
    Estado: "14"
  },
  {
    ID: "2489",
    Nome: "Mocajuba",
    Estado: "14"
  },
  {
    ID: "2490",
    Nome: "Moju",
    Estado: "14"
  },
  {
    ID: "2491",
    Nome: "Monte Alegre",
    Estado: "14"
  },
  {
    ID: "2492",
    Nome: "Muan\xE1",
    Estado: "14"
  },
  {
    ID: "2493",
    Nome: "Nova Esperan\xE7a do Piri\xE1",
    Estado: "14"
  },
  {
    ID: "2494",
    Nome: "Nova Ipixuna",
    Estado: "14"
  },
  {
    ID: "2495",
    Nome: "Nova Timboteua",
    Estado: "14"
  },
  {
    ID: "2496",
    Nome: "Novo Progresso",
    Estado: "14"
  },
  {
    ID: "2497",
    Nome: "Novo Repartimento",
    Estado: "14"
  },
  {
    ID: "2498",
    Nome: "\xD3bidos",
    Estado: "14"
  },
  {
    ID: "2499",
    Nome: "Oeiras do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2500",
    Nome: "Oriximin\xE1",
    Estado: "14"
  },
  {
    ID: "2501",
    Nome: "Our\xE9m",
    Estado: "14"
  },
  {
    ID: "2502",
    Nome: "Ouril\xE2ndia do Norte",
    Estado: "14"
  },
  {
    ID: "2503",
    Nome: "Pacaj\xE1",
    Estado: "14"
  },
  {
    ID: "2504",
    Nome: "Palestina do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2505",
    Nome: "Paragominas",
    Estado: "14"
  },
  {
    ID: "2506",
    Nome: "Parauapebas",
    Estado: "14"
  },
  {
    ID: "2507",
    Nome: "Pau d`Arco",
    Estado: "14"
  },
  {
    ID: "2508",
    Nome: "Peixe-Boi",
    Estado: "14"
  },
  {
    ID: "2509",
    Nome: "Pi\xE7arra",
    Estado: "14"
  },
  {
    ID: "2510",
    Nome: "Placas",
    Estado: "14"
  },
  {
    ID: "2511",
    Nome: "Ponta de Pedras",
    Estado: "14"
  },
  {
    ID: "2512",
    Nome: "Portel",
    Estado: "14"
  },
  {
    ID: "2513",
    Nome: "Porto de Moz",
    Estado: "14"
  },
  {
    ID: "2514",
    Nome: "Prainha",
    Estado: "14"
  },
  {
    ID: "2515",
    Nome: "Primavera",
    Estado: "14"
  },
  {
    ID: "2516",
    Nome: "Quatipuru",
    Estado: "14"
  },
  {
    ID: "2517",
    Nome: "Reden\xE7\xE3o",
    Estado: "14"
  },
  {
    ID: "2518",
    Nome: "Rio Maria",
    Estado: "14"
  },
  {
    ID: "2519",
    Nome: "Rondon do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2520",
    Nome: "Rur\xF3polis",
    Estado: "14"
  },
  {
    ID: "2521",
    Nome: "Salin\xF3polis",
    Estado: "14"
  },
  {
    ID: "2522",
    Nome: "Salvaterra",
    Estado: "14"
  },
  {
    ID: "2523",
    Nome: "Santa B\xE1rbara do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2524",
    Nome: "Santa Cruz do Arari",
    Estado: "14"
  },
  {
    ID: "2525",
    Nome: "Santa Isabel do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2526",
    Nome: "Santa Luzia do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2527",
    Nome: "Santa Maria das Barreiras",
    Estado: "14"
  },
  {
    ID: "2528",
    Nome: "Santa Maria do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2529",
    Nome: "Santana do Araguaia",
    Estado: "14"
  },
  {
    ID: "2530",
    Nome: "Santar\xE9m",
    Estado: "14"
  },
  {
    ID: "2531",
    Nome: "Santar\xE9m Novo",
    Estado: "14"
  },
  {
    ID: "2532",
    Nome: "Santo Ant\xF4nio do Tau\xE1",
    Estado: "14"
  },
  {
    ID: "2533",
    Nome: "S\xE3o Caetano de Odivelas",
    Estado: "14"
  },
  {
    ID: "2534",
    Nome: "S\xE3o Domingos do Araguaia",
    Estado: "14"
  },
  {
    ID: "2535",
    Nome: "S\xE3o Domingos do Capim",
    Estado: "14"
  },
  {
    ID: "2536",
    Nome: "S\xE3o F\xE9lix do Xingu",
    Estado: "14"
  },
  {
    ID: "2537",
    Nome: "S\xE3o Francisco do Par\xE1",
    Estado: "14"
  },
  {
    ID: "2538",
    Nome: "S\xE3o Geraldo do Araguaia",
    Estado: "14"
  },
  {
    ID: "2539",
    Nome: "S\xE3o Jo\xE3o da Ponta",
    Estado: "14"
  },
  {
    ID: "2540",
    Nome: "S\xE3o Jo\xE3o de Pirabas",
    Estado: "14"
  },
  {
    ID: "2541",
    Nome: "S\xE3o Jo\xE3o do Araguaia",
    Estado: "14"
  },
  {
    ID: "2542",
    Nome: "S\xE3o Miguel do Guam\xE1",
    Estado: "14"
  },
  {
    ID: "2543",
    Nome: "S\xE3o Sebasti\xE3o da Boa Vista",
    Estado: "14"
  },
  {
    ID: "2544",
    Nome: "Sapucaia",
    Estado: "14"
  },
  {
    ID: "2545",
    Nome: "Senador Jos\xE9 Porf\xEDrio",
    Estado: "14"
  },
  {
    ID: "2546",
    Nome: "Soure",
    Estado: "14"
  },
  {
    ID: "2547",
    Nome: "Tail\xE2ndia",
    Estado: "14"
  },
  {
    ID: "2548",
    Nome: "Terra Alta",
    Estado: "14"
  },
  {
    ID: "2549",
    Nome: "Terra Santa",
    Estado: "14"
  },
  {
    ID: "2550",
    Nome: "Tom\xE9-A\xE7u",
    Estado: "14"
  },
  {
    ID: "2551",
    Nome: "Tracuateua",
    Estado: "14"
  },
  {
    ID: "2552",
    Nome: "Trair\xE3o",
    Estado: "14"
  },
  {
    ID: "2553",
    Nome: "Tucum\xE3",
    Estado: "14"
  },
  {
    ID: "2554",
    Nome: "Tucuru\xED",
    Estado: "14"
  },
  {
    ID: "2555",
    Nome: "Ulian\xF3polis",
    Estado: "14"
  },
  {
    ID: "2556",
    Nome: "Uruar\xE1",
    Estado: "14"
  },
  {
    ID: "2557",
    Nome: "Vigia",
    Estado: "14"
  },
  {
    ID: "2558",
    Nome: "Viseu",
    Estado: "14"
  },
  {
    ID: "2559",
    Nome: "Vit\xF3ria do Xingu",
    Estado: "14"
  },
  {
    ID: "2560",
    Nome: "Xinguara",
    Estado: "14"
  },
  {
    ID: "2561",
    Nome: "\xC1gua Branca",
    Estado: "15"
  },
  {
    ID: "2562",
    Nome: "Aguiar",
    Estado: "15"
  },
  {
    ID: "2563",
    Nome: "Alagoa Grande",
    Estado: "15"
  },
  {
    ID: "2564",
    Nome: "Alagoa Nova",
    Estado: "15"
  },
  {
    ID: "2565",
    Nome: "Alagoinha",
    Estado: "15"
  },
  {
    ID: "2566",
    Nome: "Alcantil",
    Estado: "15"
  },
  {
    ID: "2567",
    Nome: "Algod\xE3o de Janda\xEDra",
    Estado: "15"
  },
  {
    ID: "2568",
    Nome: "Alhandra",
    Estado: "15"
  },
  {
    ID: "2569",
    Nome: "Amparo",
    Estado: "15"
  },
  {
    ID: "2570",
    Nome: "Aparecida",
    Estado: "15"
  },
  {
    ID: "2571",
    Nome: "Ara\xE7agi",
    Estado: "15"
  },
  {
    ID: "2572",
    Nome: "Arara",
    Estado: "15"
  },
  {
    ID: "2573",
    Nome: "Araruna",
    Estado: "15"
  },
  {
    ID: "2574",
    Nome: "Areia",
    Estado: "15"
  },
  {
    ID: "2575",
    Nome: "Areia de Bara\xFAnas",
    Estado: "15"
  },
  {
    ID: "2576",
    Nome: "Areial",
    Estado: "15"
  },
  {
    ID: "2577",
    Nome: "Aroeiras",
    Estado: "15"
  },
  {
    ID: "2578",
    Nome: "Assun\xE7\xE3o",
    Estado: "15"
  },
  {
    ID: "2579",
    Nome: "Ba\xEDa da Trai\xE7\xE3o",
    Estado: "15"
  },
  {
    ID: "2580",
    Nome: "Bananeiras",
    Estado: "15"
  },
  {
    ID: "2581",
    Nome: "Bara\xFAna",
    Estado: "15"
  },
  {
    ID: "2582",
    Nome: "Barra de Santa Rosa",
    Estado: "15"
  },
  {
    ID: "2583",
    Nome: "Barra de Santana",
    Estado: "15"
  },
  {
    ID: "2584",
    Nome: "Barra de S\xE3o Miguel",
    Estado: "15"
  },
  {
    ID: "2585",
    Nome: "Bayeux",
    Estado: "15"
  },
  {
    ID: "2586",
    Nome: "Bel\xE9m",
    Estado: "15"
  },
  {
    ID: "2587",
    Nome: "Bel\xE9m do Brejo do Cruz",
    Estado: "15"
  },
  {
    ID: "2588",
    Nome: "Bernardino Batista",
    Estado: "15"
  },
  {
    ID: "2589",
    Nome: "Boa Ventura",
    Estado: "15"
  },
  {
    ID: "2590",
    Nome: "Boa Vista",
    Estado: "15"
  },
  {
    ID: "2591",
    Nome: "Bom Jesus",
    Estado: "15"
  },
  {
    ID: "2592",
    Nome: "Bom Sucesso",
    Estado: "15"
  },
  {
    ID: "2593",
    Nome: "Bonito de Santa F\xE9",
    Estado: "15"
  },
  {
    ID: "2594",
    Nome: "Boqueir\xE3o",
    Estado: "15"
  },
  {
    ID: "2595",
    Nome: "Borborema",
    Estado: "15"
  },
  {
    ID: "2596",
    Nome: "Brejo do Cruz",
    Estado: "15"
  },
  {
    ID: "2597",
    Nome: "Brejo dos Santos",
    Estado: "15"
  },
  {
    ID: "2598",
    Nome: "Caapor\xE3",
    Estado: "15"
  },
  {
    ID: "2599",
    Nome: "Cabaceiras",
    Estado: "15"
  },
  {
    ID: "2600",
    Nome: "Cabedelo",
    Estado: "15"
  },
  {
    ID: "2601",
    Nome: "Cachoeira dos \xCDndios",
    Estado: "15"
  },
  {
    ID: "2602",
    Nome: "Cacimba de Areia",
    Estado: "15"
  },
  {
    ID: "2603",
    Nome: "Cacimba de Dentro",
    Estado: "15"
  },
  {
    ID: "2604",
    Nome: "Cacimbas",
    Estado: "15"
  },
  {
    ID: "2605",
    Nome: "Cai\xE7ara",
    Estado: "15"
  },
  {
    ID: "2606",
    Nome: "Cajazeiras",
    Estado: "15"
  },
  {
    ID: "2607",
    Nome: "Cajazeirinhas",
    Estado: "15"
  },
  {
    ID: "2608",
    Nome: "Caldas Brand\xE3o",
    Estado: "15"
  },
  {
    ID: "2609",
    Nome: "Camala\xFA",
    Estado: "15"
  },
  {
    ID: "2610",
    Nome: "Campina Grande",
    Estado: "15"
  },
  {
    ID: "2611",
    Nome: "Campo de Santana",
    Estado: "15"
  },
  {
    ID: "2612",
    Nome: "Capim",
    Estado: "15"
  },
  {
    ID: "2613",
    Nome: "Cara\xFAbas",
    Estado: "15"
  },
  {
    ID: "2614",
    Nome: "Carrapateira",
    Estado: "15"
  },
  {
    ID: "2615",
    Nome: "Casserengue",
    Estado: "15"
  },
  {
    ID: "2616",
    Nome: "Catingueira",
    Estado: "15"
  },
  {
    ID: "2617",
    Nome: "Catol\xE9 do Rocha",
    Estado: "15"
  },
  {
    ID: "2618",
    Nome: "Caturit\xE9",
    Estado: "15"
  },
  {
    ID: "2619",
    Nome: "Concei\xE7\xE3o",
    Estado: "15"
  },
  {
    ID: "2620",
    Nome: "Condado",
    Estado: "15"
  },
  {
    ID: "2621",
    Nome: "Conde",
    Estado: "15"
  },
  {
    ID: "2622",
    Nome: "Congo",
    Estado: "15"
  },
  {
    ID: "2623",
    Nome: "Coremas",
    Estado: "15"
  },
  {
    ID: "2624",
    Nome: "Coxixola",
    Estado: "15"
  },
  {
    ID: "2625",
    Nome: "Cruz do Esp\xEDrito Santo",
    Estado: "15"
  },
  {
    ID: "2626",
    Nome: "Cubati",
    Estado: "15"
  },
  {
    ID: "2627",
    Nome: "Cuit\xE9",
    Estado: "15"
  },
  {
    ID: "2628",
    Nome: "Cuit\xE9 de Mamanguape",
    Estado: "15"
  },
  {
    ID: "2629",
    Nome: "Cuitegi",
    Estado: "15"
  },
  {
    ID: "2630",
    Nome: "Curral de Cima",
    Estado: "15"
  },
  {
    ID: "2631",
    Nome: "Curral Velho",
    Estado: "15"
  },
  {
    ID: "2632",
    Nome: "Dami\xE3o",
    Estado: "15"
  },
  {
    ID: "2633",
    Nome: "Desterro",
    Estado: "15"
  },
  {
    ID: "2634",
    Nome: "Diamante",
    Estado: "15"
  },
  {
    ID: "2635",
    Nome: "Dona In\xEAs",
    Estado: "15"
  },
  {
    ID: "2636",
    Nome: "Duas Estradas",
    Estado: "15"
  },
  {
    ID: "2637",
    Nome: "Emas",
    Estado: "15"
  },
  {
    ID: "2638",
    Nome: "Esperan\xE7a",
    Estado: "15"
  },
  {
    ID: "2639",
    Nome: "Fagundes",
    Estado: "15"
  },
  {
    ID: "2640",
    Nome: "Frei Martinho",
    Estado: "15"
  },
  {
    ID: "2641",
    Nome: "Gado Bravo",
    Estado: "15"
  },
  {
    ID: "2642",
    Nome: "Guarabira",
    Estado: "15"
  },
  {
    ID: "2643",
    Nome: "Gurinh\xE9m",
    Estado: "15"
  },
  {
    ID: "2644",
    Nome: "Gurj\xE3o",
    Estado: "15"
  },
  {
    ID: "2645",
    Nome: "Ibiara",
    Estado: "15"
  },
  {
    ID: "2646",
    Nome: "Igaracy",
    Estado: "15"
  },
  {
    ID: "2647",
    Nome: "Imaculada",
    Estado: "15"
  },
  {
    ID: "2648",
    Nome: "Ing\xE1",
    Estado: "15"
  },
  {
    ID: "2649",
    Nome: "Itabaiana",
    Estado: "15"
  },
  {
    ID: "2650",
    Nome: "Itaporanga",
    Estado: "15"
  },
  {
    ID: "2651",
    Nome: "Itapororoca",
    Estado: "15"
  },
  {
    ID: "2652",
    Nome: "Itatuba",
    Estado: "15"
  },
  {
    ID: "2653",
    Nome: "Jacara\xFA",
    Estado: "15"
  },
  {
    ID: "2654",
    Nome: "Jeric\xF3",
    Estado: "15"
  },
  {
    ID: "2655",
    Nome: "Jo\xE3o Pessoa",
    Estado: "15"
  },
  {
    ID: "2656",
    Nome: "Juarez T\xE1vora",
    Estado: "15"
  },
  {
    ID: "2657",
    Nome: "Juazeirinho",
    Estado: "15"
  },
  {
    ID: "2658",
    Nome: "Junco do Serid\xF3",
    Estado: "15"
  },
  {
    ID: "2659",
    Nome: "Juripiranga",
    Estado: "15"
  },
  {
    ID: "2660",
    Nome: "Juru",
    Estado: "15"
  },
  {
    ID: "2661",
    Nome: "Lagoa",
    Estado: "15"
  },
  {
    ID: "2662",
    Nome: "Lagoa de Dentro",
    Estado: "15"
  },
  {
    ID: "2663",
    Nome: "Lagoa Seca",
    Estado: "15"
  },
  {
    ID: "2664",
    Nome: "Lastro",
    Estado: "15"
  },
  {
    ID: "2665",
    Nome: "Livramento",
    Estado: "15"
  },
  {
    ID: "2666",
    Nome: "Logradouro",
    Estado: "15"
  },
  {
    ID: "2667",
    Nome: "Lucena",
    Estado: "15"
  },
  {
    ID: "2668",
    Nome: "M\xE3e d`\xC1gua",
    Estado: "15"
  },
  {
    ID: "2669",
    Nome: "Malta",
    Estado: "15"
  },
  {
    ID: "2670",
    Nome: "Mamanguape",
    Estado: "15"
  },
  {
    ID: "2671",
    Nome: "Mana\xEDra",
    Estado: "15"
  },
  {
    ID: "2672",
    Nome: "Marca\xE7\xE3o",
    Estado: "15"
  },
  {
    ID: "2673",
    Nome: "Mari",
    Estado: "15"
  },
  {
    ID: "2674",
    Nome: "Mariz\xF3polis",
    Estado: "15"
  },
  {
    ID: "2675",
    Nome: "Massaranduba",
    Estado: "15"
  },
  {
    ID: "2676",
    Nome: "Mataraca",
    Estado: "15"
  },
  {
    ID: "2677",
    Nome: "Matinhas",
    Estado: "15"
  },
  {
    ID: "2678",
    Nome: "Mato Grosso",
    Estado: "15"
  },
  {
    ID: "2679",
    Nome: "Matur\xE9ia",
    Estado: "15"
  },
  {
    ID: "2680",
    Nome: "Mogeiro",
    Estado: "15"
  },
  {
    ID: "2681",
    Nome: "Montadas",
    Estado: "15"
  },
  {
    ID: "2682",
    Nome: "Monte Horebe",
    Estado: "15"
  },
  {
    ID: "2683",
    Nome: "Monteiro",
    Estado: "15"
  },
  {
    ID: "2684",
    Nome: "Mulungu",
    Estado: "15"
  },
  {
    ID: "2685",
    Nome: "Natuba",
    Estado: "15"
  },
  {
    ID: "2686",
    Nome: "Nazarezinho",
    Estado: "15"
  },
  {
    ID: "2687",
    Nome: "Nova Floresta",
    Estado: "15"
  },
  {
    ID: "2688",
    Nome: "Nova Olinda",
    Estado: "15"
  },
  {
    ID: "2689",
    Nome: "Nova Palmeira",
    Estado: "15"
  },
  {
    ID: "2690",
    Nome: "Olho d`\xC1gua",
    Estado: "15"
  },
  {
    ID: "2691",
    Nome: "Olivedos",
    Estado: "15"
  },
  {
    ID: "2692",
    Nome: "Ouro Velho",
    Estado: "15"
  },
  {
    ID: "2693",
    Nome: "Parari",
    Estado: "15"
  },
  {
    ID: "2694",
    Nome: "Passagem",
    Estado: "15"
  },
  {
    ID: "2695",
    Nome: "Patos",
    Estado: "15"
  },
  {
    ID: "2696",
    Nome: "Paulista",
    Estado: "15"
  },
  {
    ID: "2697",
    Nome: "Pedra Branca",
    Estado: "15"
  },
  {
    ID: "2698",
    Nome: "Pedra Lavrada",
    Estado: "15"
  },
  {
    ID: "2699",
    Nome: "Pedras de Fogo",
    Estado: "15"
  },
  {
    ID: "2700",
    Nome: "Pedro R\xE9gis",
    Estado: "15"
  },
  {
    ID: "2701",
    Nome: "Pianc\xF3",
    Estado: "15"
  },
  {
    ID: "2702",
    Nome: "Picu\xED",
    Estado: "15"
  },
  {
    ID: "2703",
    Nome: "Pilar",
    Estado: "15"
  },
  {
    ID: "2704",
    Nome: "Pil\xF5es",
    Estado: "15"
  },
  {
    ID: "2705",
    Nome: "Pil\xF5ezinhos",
    Estado: "15"
  },
  {
    ID: "2706",
    Nome: "Pirpirituba",
    Estado: "15"
  },
  {
    ID: "2707",
    Nome: "Pitimbu",
    Estado: "15"
  },
  {
    ID: "2708",
    Nome: "Pocinhos",
    Estado: "15"
  },
  {
    ID: "2709",
    Nome: "Po\xE7o Dantas",
    Estado: "15"
  },
  {
    ID: "2710",
    Nome: "Po\xE7o de Jos\xE9 de Moura",
    Estado: "15"
  },
  {
    ID: "2711",
    Nome: "Pombal",
    Estado: "15"
  },
  {
    ID: "2712",
    Nome: "Prata",
    Estado: "15"
  },
  {
    ID: "2713",
    Nome: "Princesa Isabel",
    Estado: "15"
  },
  {
    ID: "2714",
    Nome: "Puxinan\xE3",
    Estado: "15"
  },
  {
    ID: "2715",
    Nome: "Queimadas",
    Estado: "15"
  },
  {
    ID: "2716",
    Nome: "Quixab\xE1",
    Estado: "15"
  },
  {
    ID: "2717",
    Nome: "Rem\xEDgio",
    Estado: "15"
  },
  {
    ID: "2718",
    Nome: "Riach\xE3o",
    Estado: "15"
  },
  {
    ID: "2719",
    Nome: "Riach\xE3o do Bacamarte",
    Estado: "15"
  },
  {
    ID: "2720",
    Nome: "Riach\xE3o do Po\xE7o",
    Estado: "15"
  },
  {
    ID: "2721",
    Nome: "Riacho de Santo Ant\xF4nio",
    Estado: "15"
  },
  {
    ID: "2722",
    Nome: "Riacho dos Cavalos",
    Estado: "15"
  },
  {
    ID: "2723",
    Nome: "Rio Tinto",
    Estado: "15"
  },
  {
    ID: "2724",
    Nome: "Salgadinho",
    Estado: "15"
  },
  {
    ID: "2725",
    Nome: "Salgado de S\xE3o F\xE9lix",
    Estado: "15"
  },
  {
    ID: "2726",
    Nome: "Santa Cec\xEDlia",
    Estado: "15"
  },
  {
    ID: "2727",
    Nome: "Santa Cruz",
    Estado: "15"
  },
  {
    ID: "2728",
    Nome: "Santa Helena",
    Estado: "15"
  },
  {
    ID: "2729",
    Nome: "Santa In\xEAs",
    Estado: "15"
  },
  {
    ID: "2730",
    Nome: "Santa Luzia",
    Estado: "15"
  },
  {
    ID: "2731",
    Nome: "Santa Rita",
    Estado: "15"
  },
  {
    ID: "2732",
    Nome: "Santa Teresinha",
    Estado: "15"
  },
  {
    ID: "2733",
    Nome: "Santana de Mangueira",
    Estado: "15"
  },
  {
    ID: "2734",
    Nome: "Santana dos Garrotes",
    Estado: "15"
  },
  {
    ID: "2735",
    Nome: "Santar\xE9m",
    Estado: "15"
  },
  {
    ID: "2736",
    Nome: "Santo Andr\xE9",
    Estado: "15"
  },
  {
    ID: "2737",
    Nome: "S\xE3o Bentinho",
    Estado: "15"
  },
  {
    ID: "2738",
    Nome: "S\xE3o Bento",
    Estado: "15"
  },
  {
    ID: "2739",
    Nome: "S\xE3o Domingos de Pombal",
    Estado: "15"
  },
  {
    ID: "2740",
    Nome: "S\xE3o Domingos do Cariri",
    Estado: "15"
  },
  {
    ID: "2741",
    Nome: "S\xE3o Francisco",
    Estado: "15"
  },
  {
    ID: "2742",
    Nome: "S\xE3o Jo\xE3o do Cariri",
    Estado: "15"
  },
  {
    ID: "2743",
    Nome: "S\xE3o Jo\xE3o do Rio do Peixe",
    Estado: "15"
  },
  {
    ID: "2744",
    Nome: "S\xE3o Jo\xE3o do Tigre",
    Estado: "15"
  },
  {
    ID: "2745",
    Nome: "S\xE3o Jos\xE9 da Lagoa Tapada",
    Estado: "15"
  },
  {
    ID: "2746",
    Nome: "S\xE3o Jos\xE9 de Caiana",
    Estado: "15"
  },
  {
    ID: "2747",
    Nome: "S\xE3o Jos\xE9 de Espinharas",
    Estado: "15"
  },
  {
    ID: "2748",
    Nome: "S\xE3o Jos\xE9 de Piranhas",
    Estado: "15"
  },
  {
    ID: "2749",
    Nome: "S\xE3o Jos\xE9 de Princesa",
    Estado: "15"
  },
  {
    ID: "2750",
    Nome: "S\xE3o Jos\xE9 do Bonfim",
    Estado: "15"
  },
  {
    ID: "2751",
    Nome: "S\xE3o Jos\xE9 do Brejo do Cruz",
    Estado: "15"
  },
  {
    ID: "2752",
    Nome: "S\xE3o Jos\xE9 do Sabugi",
    Estado: "15"
  },
  {
    ID: "2753",
    Nome: "S\xE3o Jos\xE9 dos Cordeiros",
    Estado: "15"
  },
  {
    ID: "2754",
    Nome: "S\xE3o Jos\xE9 dos Ramos",
    Estado: "15"
  },
  {
    ID: "2755",
    Nome: "S\xE3o Mamede",
    Estado: "15"
  },
  {
    ID: "2756",
    Nome: "S\xE3o Miguel de Taipu",
    Estado: "15"
  },
  {
    ID: "2757",
    Nome: "S\xE3o Sebasti\xE3o de Lagoa de Ro\xE7a",
    Estado: "15"
  },
  {
    ID: "2758",
    Nome: "S\xE3o Sebasti\xE3o do Umbuzeiro",
    Estado: "15"
  },
  {
    ID: "2759",
    Nome: "Sap\xE9",
    Estado: "15"
  },
  {
    ID: "2760",
    Nome: "Serid\xF3",
    Estado: "15"
  },
  {
    ID: "2761",
    Nome: "Serra Branca",
    Estado: "15"
  },
  {
    ID: "2762",
    Nome: "Serra da Raiz",
    Estado: "15"
  },
  {
    ID: "2763",
    Nome: "Serra Grande",
    Estado: "15"
  },
  {
    ID: "2764",
    Nome: "Serra Redonda",
    Estado: "15"
  },
  {
    ID: "2765",
    Nome: "Serraria",
    Estado: "15"
  },
  {
    ID: "2766",
    Nome: "Sert\xE3ozinho",
    Estado: "15"
  },
  {
    ID: "2767",
    Nome: "Sobrado",
    Estado: "15"
  },
  {
    ID: "2768",
    Nome: "Sol\xE2nea",
    Estado: "15"
  },
  {
    ID: "2769",
    Nome: "Soledade",
    Estado: "15"
  },
  {
    ID: "2770",
    Nome: "Soss\xEAgo",
    Estado: "15"
  },
  {
    ID: "2771",
    Nome: "Sousa",
    Estado: "15"
  },
  {
    ID: "2772",
    Nome: "Sum\xE9",
    Estado: "15"
  },
  {
    ID: "2773",
    Nome: "Tapero\xE1",
    Estado: "15"
  },
  {
    ID: "2774",
    Nome: "Tavares",
    Estado: "15"
  },
  {
    ID: "2775",
    Nome: "Teixeira",
    Estado: "15"
  },
  {
    ID: "2776",
    Nome: "Ten\xF3rio",
    Estado: "15"
  },
  {
    ID: "2777",
    Nome: "Triunfo",
    Estado: "15"
  },
  {
    ID: "2778",
    Nome: "Uira\xFAna",
    Estado: "15"
  },
  {
    ID: "2779",
    Nome: "Umbuzeiro",
    Estado: "15"
  },
  {
    ID: "2780",
    Nome: "V\xE1rzea",
    Estado: "15"
  },
  {
    ID: "2781",
    Nome: "Vieir\xF3polis",
    Estado: "15"
  },
  {
    ID: "2782",
    Nome: "Vista Serrana",
    Estado: "15"
  },
  {
    ID: "2783",
    Nome: "Zabel\xEA",
    Estado: "15"
  },
  {
    ID: "2784",
    Nome: "Abati\xE1",
    Estado: "18"
  },
  {
    ID: "2785",
    Nome: "Adrian\xF3polis",
    Estado: "18"
  },
  {
    ID: "2786",
    Nome: "Agudos do Sul",
    Estado: "18"
  },
  {
    ID: "2787",
    Nome: "Almirante Tamandar\xE9",
    Estado: "18"
  },
  {
    ID: "2788",
    Nome: "Altamira do Paran\xE1",
    Estado: "18"
  },
  {
    ID: "2789",
    Nome: "Alto Para\xEDso",
    Estado: "18"
  },
  {
    ID: "2790",
    Nome: "Alto Paran\xE1",
    Estado: "18"
  },
  {
    ID: "2791",
    Nome: "Alto Piquiri",
    Estado: "18"
  },
  {
    ID: "2792",
    Nome: "Alt\xF4nia",
    Estado: "18"
  },
  {
    ID: "2793",
    Nome: "Alvorada do Sul",
    Estado: "18"
  },
  {
    ID: "2794",
    Nome: "Amapor\xE3",
    Estado: "18"
  },
  {
    ID: "2795",
    Nome: "Amp\xE9re",
    Estado: "18"
  },
  {
    ID: "2796",
    Nome: "Anahy",
    Estado: "18"
  },
  {
    ID: "2797",
    Nome: "Andir\xE1",
    Estado: "18"
  },
  {
    ID: "2798",
    Nome: "\xC2ngulo",
    Estado: "18"
  },
  {
    ID: "2799",
    Nome: "Antonina",
    Estado: "18"
  },
  {
    ID: "2800",
    Nome: "Ant\xF4nio Olinto",
    Estado: "18"
  },
  {
    ID: "2801",
    Nome: "Apucarana",
    Estado: "18"
  },
  {
    ID: "2802",
    Nome: "Arapongas",
    Estado: "18"
  },
  {
    ID: "2803",
    Nome: "Arapoti",
    Estado: "18"
  },
  {
    ID: "2804",
    Nome: "Arapu\xE3",
    Estado: "18"
  },
  {
    ID: "2805",
    Nome: "Araruna",
    Estado: "18"
  },
  {
    ID: "2806",
    Nome: "Arauc\xE1ria",
    Estado: "18"
  },
  {
    ID: "2807",
    Nome: "Ariranha do Iva\xED",
    Estado: "18"
  },
  {
    ID: "2808",
    Nome: "Assa\xED",
    Estado: "18"
  },
  {
    ID: "2809",
    Nome: "Assis Chateaubriand",
    Estado: "18"
  },
  {
    ID: "2810",
    Nome: "Astorga",
    Estado: "18"
  },
  {
    ID: "2811",
    Nome: "Atalaia",
    Estado: "18"
  },
  {
    ID: "2812",
    Nome: "Balsa Nova",
    Estado: "18"
  },
  {
    ID: "2813",
    Nome: "Bandeirantes",
    Estado: "18"
  },
  {
    ID: "2814",
    Nome: "Barbosa Ferraz",
    Estado: "18"
  },
  {
    ID: "2815",
    Nome: "Barra do Jacar\xE9",
    Estado: "18"
  },
  {
    ID: "2816",
    Nome: "Barrac\xE3o",
    Estado: "18"
  },
  {
    ID: "2817",
    Nome: "Bela Vista da Caroba",
    Estado: "18"
  },
  {
    ID: "2818",
    Nome: "Bela Vista do Para\xEDso",
    Estado: "18"
  },
  {
    ID: "2819",
    Nome: "Bituruna",
    Estado: "18"
  },
  {
    ID: "2820",
    Nome: "Boa Esperan\xE7a",
    Estado: "18"
  },
  {
    ID: "2821",
    Nome: "Boa Esperan\xE7a do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "2822",
    Nome: "Boa Ventura de S\xE3o Roque",
    Estado: "18"
  },
  {
    ID: "2823",
    Nome: "Boa Vista da Aparecida",
    Estado: "18"
  },
  {
    ID: "2824",
    Nome: "Bocai\xFAva do Sul",
    Estado: "18"
  },
  {
    ID: "2825",
    Nome: "Bom Jesus do Sul",
    Estado: "18"
  },
  {
    ID: "2826",
    Nome: "Bom Sucesso",
    Estado: "18"
  },
  {
    ID: "2827",
    Nome: "Bom Sucesso do Sul",
    Estado: "18"
  },
  {
    ID: "2828",
    Nome: "Borraz\xF3polis",
    Estado: "18"
  },
  {
    ID: "2829",
    Nome: "Braganey",
    Estado: "18"
  },
  {
    ID: "2830",
    Nome: "Brasil\xE2ndia do Sul",
    Estado: "18"
  },
  {
    ID: "2831",
    Nome: "Cafeara",
    Estado: "18"
  },
  {
    ID: "2832",
    Nome: "Cafel\xE2ndia",
    Estado: "18"
  },
  {
    ID: "2833",
    Nome: "Cafezal do Sul",
    Estado: "18"
  },
  {
    ID: "2834",
    Nome: "Calif\xF3rnia",
    Estado: "18"
  },
  {
    ID: "2835",
    Nome: "Cambar\xE1",
    Estado: "18"
  },
  {
    ID: "2836",
    Nome: "Camb\xE9",
    Estado: "18"
  },
  {
    ID: "2837",
    Nome: "Cambira",
    Estado: "18"
  },
  {
    ID: "2838",
    Nome: "Campina da Lagoa",
    Estado: "18"
  },
  {
    ID: "2839",
    Nome: "Campina do Sim\xE3o",
    Estado: "18"
  },
  {
    ID: "2840",
    Nome: "Campina Grande do Sul",
    Estado: "18"
  },
  {
    ID: "2841",
    Nome: "Campo Bonito",
    Estado: "18"
  },
  {
    ID: "2842",
    Nome: "Campo do Tenente",
    Estado: "18"
  },
  {
    ID: "2843",
    Nome: "Campo Largo",
    Estado: "18"
  },
  {
    ID: "2844",
    Nome: "Campo Magro",
    Estado: "18"
  },
  {
    ID: "2845",
    Nome: "Campo Mour\xE3o",
    Estado: "18"
  },
  {
    ID: "2846",
    Nome: "C\xE2ndido de Abreu",
    Estado: "18"
  },
  {
    ID: "2847",
    Nome: "Cand\xF3i",
    Estado: "18"
  },
  {
    ID: "2848",
    Nome: "Cantagalo",
    Estado: "18"
  },
  {
    ID: "2849",
    Nome: "Capanema",
    Estado: "18"
  },
  {
    ID: "2850",
    Nome: "Capit\xE3o Le\xF4nidas Marques",
    Estado: "18"
  },
  {
    ID: "2851",
    Nome: "Carambe\xED",
    Estado: "18"
  },
  {
    ID: "2852",
    Nome: "Carl\xF3polis",
    Estado: "18"
  },
  {
    ID: "2853",
    Nome: "Cascavel",
    Estado: "18"
  },
  {
    ID: "2854",
    Nome: "Castro",
    Estado: "18"
  },
  {
    ID: "2855",
    Nome: "Catanduvas",
    Estado: "18"
  },
  {
    ID: "2856",
    Nome: "Centen\xE1rio do Sul",
    Estado: "18"
  },
  {
    ID: "2857",
    Nome: "Cerro Azul",
    Estado: "18"
  },
  {
    ID: "2858",
    Nome: "C\xE9u Azul",
    Estado: "18"
  },
  {
    ID: "2859",
    Nome: "Chopinzinho",
    Estado: "18"
  },
  {
    ID: "2860",
    Nome: "Cianorte",
    Estado: "18"
  },
  {
    ID: "2861",
    Nome: "Cidade Ga\xFAcha",
    Estado: "18"
  },
  {
    ID: "2862",
    Nome: "Clevel\xE2ndia",
    Estado: "18"
  },
  {
    ID: "2863",
    Nome: "Colombo",
    Estado: "18"
  },
  {
    ID: "2864",
    Nome: "Colorado",
    Estado: "18"
  },
  {
    ID: "2865",
    Nome: "Congonhinhas",
    Estado: "18"
  },
  {
    ID: "2866",
    Nome: "Conselheiro Mairinck",
    Estado: "18"
  },
  {
    ID: "2867",
    Nome: "Contenda",
    Estado: "18"
  },
  {
    ID: "2868",
    Nome: "Corb\xE9lia",
    Estado: "18"
  },
  {
    ID: "2869",
    Nome: "Corn\xE9lio Proc\xF3pio",
    Estado: "18"
  },
  {
    ID: "2870",
    Nome: "Coronel Domingos Soares",
    Estado: "18"
  },
  {
    ID: "2871",
    Nome: "Coronel Vivida",
    Estado: "18"
  },
  {
    ID: "2872",
    Nome: "Corumbata\xED do Sul",
    Estado: "18"
  },
  {
    ID: "2873",
    Nome: "Cruz Machado",
    Estado: "18"
  },
  {
    ID: "2874",
    Nome: "Cruzeiro do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "2875",
    Nome: "Cruzeiro do Oeste",
    Estado: "18"
  },
  {
    ID: "2876",
    Nome: "Cruzeiro do Sul",
    Estado: "18"
  },
  {
    ID: "2877",
    Nome: "Cruzmaltina",
    Estado: "18"
  },
  {
    ID: "2878",
    Nome: "Curitiba",
    Estado: "18"
  },
  {
    ID: "2879",
    Nome: "Curi\xFAva",
    Estado: "18"
  },
  {
    ID: "2880",
    Nome: "Diamante d`Oeste",
    Estado: "18"
  },
  {
    ID: "2881",
    Nome: "Diamante do Norte",
    Estado: "18"
  },
  {
    ID: "2882",
    Nome: "Diamante do Sul",
    Estado: "18"
  },
  {
    ID: "2883",
    Nome: "Dois Vizinhos",
    Estado: "18"
  },
  {
    ID: "2884",
    Nome: "Douradina",
    Estado: "18"
  },
  {
    ID: "2885",
    Nome: "Doutor Camargo",
    Estado: "18"
  },
  {
    ID: "2886",
    Nome: "Doutor Ulysses",
    Estado: "18"
  },
  {
    ID: "2887",
    Nome: "En\xE9as Marques",
    Estado: "18"
  },
  {
    ID: "2888",
    Nome: "Engenheiro Beltr\xE3o",
    Estado: "18"
  },
  {
    ID: "2889",
    Nome: "Entre Rios do Oeste",
    Estado: "18"
  },
  {
    ID: "2890",
    Nome: "Esperan\xE7a Nova",
    Estado: "18"
  },
  {
    ID: "2891",
    Nome: "Espig\xE3o Alto do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "2892",
    Nome: "Farol",
    Estado: "18"
  },
  {
    ID: "2893",
    Nome: "Faxinal",
    Estado: "18"
  },
  {
    ID: "2894",
    Nome: "Fazenda Rio Grande",
    Estado: "18"
  },
  {
    ID: "2895",
    Nome: "F\xEAnix",
    Estado: "18"
  },
  {
    ID: "2896",
    Nome: "Fernandes Pinheiro",
    Estado: "18"
  },
  {
    ID: "2897",
    Nome: "Figueira",
    Estado: "18"
  },
  {
    ID: "2898",
    Nome: "Flor da Serra do Sul",
    Estado: "18"
  },
  {
    ID: "2899",
    Nome: "Flora\xED",
    Estado: "18"
  },
  {
    ID: "2900",
    Nome: "Floresta",
    Estado: "18"
  },
  {
    ID: "2901",
    Nome: "Florest\xF3polis",
    Estado: "18"
  },
  {
    ID: "2902",
    Nome: "Fl\xF3rida",
    Estado: "18"
  },
  {
    ID: "2903",
    Nome: "Formosa do Oeste",
    Estado: "18"
  },
  {
    ID: "2904",
    Nome: "Foz do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "2905",
    Nome: "Foz do Jord\xE3o",
    Estado: "18"
  },
  {
    ID: "2906",
    Nome: "Francisco Alves",
    Estado: "18"
  },
  {
    ID: "2907",
    Nome: "Francisco Beltr\xE3o",
    Estado: "18"
  },
  {
    ID: "2908",
    Nome: "General Carneiro",
    Estado: "18"
  },
  {
    ID: "2909",
    Nome: "Godoy Moreira",
    Estado: "18"
  },
  {
    ID: "2910",
    Nome: "Goioer\xEA",
    Estado: "18"
  },
  {
    ID: "2911",
    Nome: "Goioxim",
    Estado: "18"
  },
  {
    ID: "2912",
    Nome: "Grandes Rios",
    Estado: "18"
  },
  {
    ID: "2913",
    Nome: "Gua\xEDra",
    Estado: "18"
  },
  {
    ID: "2914",
    Nome: "Guaira\xE7\xE1",
    Estado: "18"
  },
  {
    ID: "2915",
    Nome: "Guamiranga",
    Estado: "18"
  },
  {
    ID: "2916",
    Nome: "Guapirama",
    Estado: "18"
  },
  {
    ID: "2917",
    Nome: "Guaporema",
    Estado: "18"
  },
  {
    ID: "2918",
    Nome: "Guaraci",
    Estado: "18"
  },
  {
    ID: "2919",
    Nome: "Guarania\xE7u",
    Estado: "18"
  },
  {
    ID: "2920",
    Nome: "Guarapuava",
    Estado: "18"
  },
  {
    ID: "2921",
    Nome: "Guaraque\xE7aba",
    Estado: "18"
  },
  {
    ID: "2922",
    Nome: "Guaratuba",
    Estado: "18"
  },
  {
    ID: "2923",
    Nome: "Hon\xF3rio Serpa",
    Estado: "18"
  },
  {
    ID: "2924",
    Nome: "Ibaiti",
    Estado: "18"
  },
  {
    ID: "2925",
    Nome: "Ibema",
    Estado: "18"
  },
  {
    ID: "2926",
    Nome: "Ibipor\xE3",
    Estado: "18"
  },
  {
    ID: "2927",
    Nome: "Icara\xEDma",
    Estado: "18"
  },
  {
    ID: "2928",
    Nome: "Iguara\xE7u",
    Estado: "18"
  },
  {
    ID: "2929",
    Nome: "Iguatu",
    Estado: "18"
  },
  {
    ID: "2930",
    Nome: "Imba\xFA",
    Estado: "18"
  },
  {
    ID: "2931",
    Nome: "Imbituva",
    Estado: "18"
  },
  {
    ID: "2932",
    Nome: "In\xE1cio Martins",
    Estado: "18"
  },
  {
    ID: "2933",
    Nome: "Inaj\xE1",
    Estado: "18"
  },
  {
    ID: "2934",
    Nome: "Indian\xF3polis",
    Estado: "18"
  },
  {
    ID: "2935",
    Nome: "Ipiranga",
    Estado: "18"
  },
  {
    ID: "2936",
    Nome: "Ipor\xE3",
    Estado: "18"
  },
  {
    ID: "2937",
    Nome: "Iracema do Oeste",
    Estado: "18"
  },
  {
    ID: "2938",
    Nome: "Irati",
    Estado: "18"
  },
  {
    ID: "2939",
    Nome: "Iretama",
    Estado: "18"
  },
  {
    ID: "2940",
    Nome: "Itaguaj\xE9",
    Estado: "18"
  },
  {
    ID: "2941",
    Nome: "Itaipul\xE2ndia",
    Estado: "18"
  },
  {
    ID: "2942",
    Nome: "Itambarac\xE1",
    Estado: "18"
  },
  {
    ID: "2943",
    Nome: "Itamb\xE9",
    Estado: "18"
  },
  {
    ID: "2944",
    Nome: "Itapejara d`Oeste",
    Estado: "18"
  },
  {
    ID: "2945",
    Nome: "Itaperu\xE7u",
    Estado: "18"
  },
  {
    ID: "2946",
    Nome: "Ita\xFAna do Sul",
    Estado: "18"
  },
  {
    ID: "2947",
    Nome: "Iva\xED",
    Estado: "18"
  },
  {
    ID: "2948",
    Nome: "Ivaipor\xE3",
    Estado: "18"
  },
  {
    ID: "2949",
    Nome: "Ivat\xE9",
    Estado: "18"
  },
  {
    ID: "2950",
    Nome: "Ivatuba",
    Estado: "18"
  },
  {
    ID: "2951",
    Nome: "Jaboti",
    Estado: "18"
  },
  {
    ID: "2952",
    Nome: "Jacarezinho",
    Estado: "18"
  },
  {
    ID: "2953",
    Nome: "Jaguapit\xE3",
    Estado: "18"
  },
  {
    ID: "2954",
    Nome: "Jaguaria\xEDva",
    Estado: "18"
  },
  {
    ID: "2955",
    Nome: "Jandaia do Sul",
    Estado: "18"
  },
  {
    ID: "2956",
    Nome: "Jani\xF3polis",
    Estado: "18"
  },
  {
    ID: "2957",
    Nome: "Japira",
    Estado: "18"
  },
  {
    ID: "2958",
    Nome: "Japur\xE1",
    Estado: "18"
  },
  {
    ID: "2959",
    Nome: "Jardim Alegre",
    Estado: "18"
  },
  {
    ID: "2960",
    Nome: "Jardim Olinda",
    Estado: "18"
  },
  {
    ID: "2961",
    Nome: "Jataizinho",
    Estado: "18"
  },
  {
    ID: "2962",
    Nome: "Jesu\xEDtas",
    Estado: "18"
  },
  {
    ID: "2963",
    Nome: "Joaquim T\xE1vora",
    Estado: "18"
  },
  {
    ID: "2964",
    Nome: "Jundia\xED do Sul",
    Estado: "18"
  },
  {
    ID: "2965",
    Nome: "Juranda",
    Estado: "18"
  },
  {
    ID: "2966",
    Nome: "Jussara",
    Estado: "18"
  },
  {
    ID: "2967",
    Nome: "Kalor\xE9",
    Estado: "18"
  },
  {
    ID: "2968",
    Nome: "Lapa",
    Estado: "18"
  },
  {
    ID: "2969",
    Nome: "Laranjal",
    Estado: "18"
  },
  {
    ID: "2970",
    Nome: "Laranjeiras do Sul",
    Estado: "18"
  },
  {
    ID: "2971",
    Nome: "Le\xF3polis",
    Estado: "18"
  },
  {
    ID: "2972",
    Nome: "Lidian\xF3polis",
    Estado: "18"
  },
  {
    ID: "2973",
    Nome: "Lindoeste",
    Estado: "18"
  },
  {
    ID: "2974",
    Nome: "Loanda",
    Estado: "18"
  },
  {
    ID: "2975",
    Nome: "Lobato",
    Estado: "18"
  },
  {
    ID: "2976",
    Nome: "Londrina",
    Estado: "18"
  },
  {
    ID: "2977",
    Nome: "Luiziana",
    Estado: "18"
  },
  {
    ID: "2978",
    Nome: "Lunardelli",
    Estado: "18"
  },
  {
    ID: "2979",
    Nome: "Lupion\xF3polis",
    Estado: "18"
  },
  {
    ID: "2980",
    Nome: "Mallet",
    Estado: "18"
  },
  {
    ID: "2981",
    Nome: "Mambor\xEA",
    Estado: "18"
  },
  {
    ID: "2982",
    Nome: "Mandagua\xE7u",
    Estado: "18"
  },
  {
    ID: "2983",
    Nome: "Mandaguari",
    Estado: "18"
  },
  {
    ID: "2984",
    Nome: "Mandirituba",
    Estado: "18"
  },
  {
    ID: "2985",
    Nome: "Manfrin\xF3polis",
    Estado: "18"
  },
  {
    ID: "2986",
    Nome: "Mangueirinha",
    Estado: "18"
  },
  {
    ID: "2987",
    Nome: "Manoel Ribas",
    Estado: "18"
  },
  {
    ID: "2988",
    Nome: "Marechal C\xE2ndido Rondon",
    Estado: "18"
  },
  {
    ID: "2989",
    Nome: "Maria Helena",
    Estado: "18"
  },
  {
    ID: "2990",
    Nome: "Marialva",
    Estado: "18"
  },
  {
    ID: "2991",
    Nome: "Maril\xE2ndia do Sul",
    Estado: "18"
  },
  {
    ID: "2992",
    Nome: "Marilena",
    Estado: "18"
  },
  {
    ID: "2993",
    Nome: "Mariluz",
    Estado: "18"
  },
  {
    ID: "2994",
    Nome: "Maring\xE1",
    Estado: "18"
  },
  {
    ID: "2995",
    Nome: "Mari\xF3polis",
    Estado: "18"
  },
  {
    ID: "2996",
    Nome: "Marip\xE1",
    Estado: "18"
  },
  {
    ID: "2997",
    Nome: "Marmeleiro",
    Estado: "18"
  },
  {
    ID: "2998",
    Nome: "Marquinho",
    Estado: "18"
  },
  {
    ID: "2999",
    Nome: "Marumbi",
    Estado: "18"
  },
  {
    ID: "3000",
    Nome: "Matel\xE2ndia",
    Estado: "18"
  },
  {
    ID: "3001",
    Nome: "Matinhos",
    Estado: "18"
  },
  {
    ID: "3002",
    Nome: "Mato Rico",
    Estado: "18"
  },
  {
    ID: "3003",
    Nome: "Mau\xE1 da Serra",
    Estado: "18"
  },
  {
    ID: "3004",
    Nome: "Medianeira",
    Estado: "18"
  },
  {
    ID: "3005",
    Nome: "Mercedes",
    Estado: "18"
  },
  {
    ID: "3006",
    Nome: "Mirador",
    Estado: "18"
  },
  {
    ID: "3007",
    Nome: "Miraselva",
    Estado: "18"
  },
  {
    ID: "3008",
    Nome: "Missal",
    Estado: "18"
  },
  {
    ID: "3009",
    Nome: "Moreira Sales",
    Estado: "18"
  },
  {
    ID: "3010",
    Nome: "Morretes",
    Estado: "18"
  },
  {
    ID: "3011",
    Nome: "Munhoz de Melo",
    Estado: "18"
  },
  {
    ID: "3012",
    Nome: "Nossa Senhora das Gra\xE7as",
    Estado: "18"
  },
  {
    ID: "3013",
    Nome: "Nova Alian\xE7a do Iva\xED",
    Estado: "18"
  },
  {
    ID: "3014",
    Nome: "Nova Am\xE9rica da Colina",
    Estado: "18"
  },
  {
    ID: "3015",
    Nome: "Nova Aurora",
    Estado: "18"
  },
  {
    ID: "3016",
    Nome: "Nova Cantu",
    Estado: "18"
  },
  {
    ID: "3017",
    Nome: "Nova Esperan\xE7a",
    Estado: "18"
  },
  {
    ID: "3018",
    Nome: "Nova Esperan\xE7a do Sudoeste",
    Estado: "18"
  },
  {
    ID: "3019",
    Nome: "Nova F\xE1tima",
    Estado: "18"
  },
  {
    ID: "3020",
    Nome: "Nova Laranjeiras",
    Estado: "18"
  },
  {
    ID: "3021",
    Nome: "Nova Londrina",
    Estado: "18"
  },
  {
    ID: "3022",
    Nome: "Nova Ol\xEDmpia",
    Estado: "18"
  },
  {
    ID: "3023",
    Nome: "Nova Prata do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "3024",
    Nome: "Nova Santa B\xE1rbara",
    Estado: "18"
  },
  {
    ID: "3025",
    Nome: "Nova Santa Rosa",
    Estado: "18"
  },
  {
    ID: "3026",
    Nome: "Nova Tebas",
    Estado: "18"
  },
  {
    ID: "3027",
    Nome: "Novo Itacolomi",
    Estado: "18"
  },
  {
    ID: "3028",
    Nome: "Ortigueira",
    Estado: "18"
  },
  {
    ID: "3029",
    Nome: "Ourizona",
    Estado: "18"
  },
  {
    ID: "3030",
    Nome: "Ouro Verde do Oeste",
    Estado: "18"
  },
  {
    ID: "3031",
    Nome: "Pai\xE7andu",
    Estado: "18"
  },
  {
    ID: "3032",
    Nome: "Palmas",
    Estado: "18"
  },
  {
    ID: "3033",
    Nome: "Palmeira",
    Estado: "18"
  },
  {
    ID: "3034",
    Nome: "Palmital",
    Estado: "18"
  },
  {
    ID: "3035",
    Nome: "Palotina",
    Estado: "18"
  },
  {
    ID: "3036",
    Nome: "Para\xEDso do Norte",
    Estado: "18"
  },
  {
    ID: "3037",
    Nome: "Paranacity",
    Estado: "18"
  },
  {
    ID: "3038",
    Nome: "Paranagu\xE1",
    Estado: "18"
  },
  {
    ID: "3039",
    Nome: "Paranapoema",
    Estado: "18"
  },
  {
    ID: "3040",
    Nome: "Paranava\xED",
    Estado: "18"
  },
  {
    ID: "3041",
    Nome: "Pato Bragado",
    Estado: "18"
  },
  {
    ID: "3042",
    Nome: "Pato Branco",
    Estado: "18"
  },
  {
    ID: "3043",
    Nome: "Paula Freitas",
    Estado: "18"
  },
  {
    ID: "3044",
    Nome: "Paulo Frontin",
    Estado: "18"
  },
  {
    ID: "3045",
    Nome: "Peabiru",
    Estado: "18"
  },
  {
    ID: "3046",
    Nome: "Perobal",
    Estado: "18"
  },
  {
    ID: "3047",
    Nome: "P\xE9rola",
    Estado: "18"
  },
  {
    ID: "3048",
    Nome: "P\xE9rola d`Oeste",
    Estado: "18"
  },
  {
    ID: "3049",
    Nome: "Pi\xEAn",
    Estado: "18"
  },
  {
    ID: "3050",
    Nome: "Pinhais",
    Estado: "18"
  },
  {
    ID: "3051",
    Nome: "Pinhal de S\xE3o Bento",
    Estado: "18"
  },
  {
    ID: "3052",
    Nome: "Pinhal\xE3o",
    Estado: "18"
  },
  {
    ID: "3053",
    Nome: "Pinh\xE3o",
    Estado: "18"
  },
  {
    ID: "3054",
    Nome: "Pira\xED do Sul",
    Estado: "18"
  },
  {
    ID: "3055",
    Nome: "Piraquara",
    Estado: "18"
  },
  {
    ID: "3056",
    Nome: "Pitanga",
    Estado: "18"
  },
  {
    ID: "3057",
    Nome: "Pitangueiras",
    Estado: "18"
  },
  {
    ID: "3058",
    Nome: "Planaltina do Paran\xE1",
    Estado: "18"
  },
  {
    ID: "3059",
    Nome: "Planalto",
    Estado: "18"
  },
  {
    ID: "3060",
    Nome: "Ponta Grossa",
    Estado: "18"
  },
  {
    ID: "3061",
    Nome: "Pontal do Paran\xE1",
    Estado: "18"
  },
  {
    ID: "3062",
    Nome: "Porecatu",
    Estado: "18"
  },
  {
    ID: "3063",
    Nome: "Porto Amazonas",
    Estado: "18"
  },
  {
    ID: "3064",
    Nome: "Porto Barreiro",
    Estado: "18"
  },
  {
    ID: "3065",
    Nome: "Porto Rico",
    Estado: "18"
  },
  {
    ID: "3066",
    Nome: "Porto Vit\xF3ria",
    Estado: "18"
  },
  {
    ID: "3067",
    Nome: "Prado Ferreira",
    Estado: "18"
  },
  {
    ID: "3068",
    Nome: "Pranchita",
    Estado: "18"
  },
  {
    ID: "3069",
    Nome: "Presidente Castelo Branco",
    Estado: "18"
  },
  {
    ID: "3070",
    Nome: "Primeiro de Maio",
    Estado: "18"
  },
  {
    ID: "3071",
    Nome: "Prudent\xF3polis",
    Estado: "18"
  },
  {
    ID: "3072",
    Nome: "Quarto Centen\xE1rio",
    Estado: "18"
  },
  {
    ID: "3073",
    Nome: "Quatigu\xE1",
    Estado: "18"
  },
  {
    ID: "3074",
    Nome: "Quatro Barras",
    Estado: "18"
  },
  {
    ID: "3075",
    Nome: "Quatro Pontes",
    Estado: "18"
  },
  {
    ID: "3076",
    Nome: "Quedas do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "3077",
    Nome: "Quer\xEAncia do Norte",
    Estado: "18"
  },
  {
    ID: "3078",
    Nome: "Quinta do Sol",
    Estado: "18"
  },
  {
    ID: "3079",
    Nome: "Quitandinha",
    Estado: "18"
  },
  {
    ID: "3080",
    Nome: "Ramil\xE2ndia",
    Estado: "18"
  },
  {
    ID: "3081",
    Nome: "Rancho Alegre",
    Estado: "18"
  },
  {
    ID: "3082",
    Nome: "Rancho Alegre d`Oeste",
    Estado: "18"
  },
  {
    ID: "3083",
    Nome: "Realeza",
    Estado: "18"
  },
  {
    ID: "3084",
    Nome: "Rebou\xE7as",
    Estado: "18"
  },
  {
    ID: "3085",
    Nome: "Renascen\xE7a",
    Estado: "18"
  },
  {
    ID: "3086",
    Nome: "Reserva",
    Estado: "18"
  },
  {
    ID: "3087",
    Nome: "Reserva do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "3088",
    Nome: "Ribeir\xE3o Claro",
    Estado: "18"
  },
  {
    ID: "3089",
    Nome: "Ribeir\xE3o do Pinhal",
    Estado: "18"
  },
  {
    ID: "3090",
    Nome: "Rio Azul",
    Estado: "18"
  },
  {
    ID: "3091",
    Nome: "Rio Bom",
    Estado: "18"
  },
  {
    ID: "3092",
    Nome: "Rio Bonito do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "3093",
    Nome: "Rio Branco do Iva\xED",
    Estado: "18"
  },
  {
    ID: "3094",
    Nome: "Rio Branco do Sul",
    Estado: "18"
  },
  {
    ID: "3095",
    Nome: "Rio Negro",
    Estado: "18"
  },
  {
    ID: "3096",
    Nome: "Rol\xE2ndia",
    Estado: "18"
  },
  {
    ID: "3097",
    Nome: "Roncador",
    Estado: "18"
  },
  {
    ID: "3098",
    Nome: "Rondon",
    Estado: "18"
  },
  {
    ID: "3099",
    Nome: "Ros\xE1rio do Iva\xED",
    Estado: "18"
  },
  {
    ID: "3100",
    Nome: "Sab\xE1udia",
    Estado: "18"
  },
  {
    ID: "3101",
    Nome: "Salgado Filho",
    Estado: "18"
  },
  {
    ID: "3102",
    Nome: "Salto do Itarar\xE9",
    Estado: "18"
  },
  {
    ID: "3103",
    Nome: "Salto do Lontra",
    Estado: "18"
  },
  {
    ID: "3104",
    Nome: "Santa Am\xE9lia",
    Estado: "18"
  },
  {
    ID: "3105",
    Nome: "Santa Cec\xEDlia do Pav\xE3o",
    Estado: "18"
  },
  {
    ID: "3106",
    Nome: "Santa Cruz de Monte Castelo",
    Estado: "18"
  },
  {
    ID: "3107",
    Nome: "Santa F\xE9",
    Estado: "18"
  },
  {
    ID: "3108",
    Nome: "Santa Helena",
    Estado: "18"
  },
  {
    ID: "3109",
    Nome: "Santa In\xEAs",
    Estado: "18"
  },
  {
    ID: "3110",
    Nome: "Santa Isabel do Iva\xED",
    Estado: "18"
  },
  {
    ID: "3111",
    Nome: "Santa Izabel do Oeste",
    Estado: "18"
  },
  {
    ID: "3112",
    Nome: "Santa L\xFAcia",
    Estado: "18"
  },
  {
    ID: "3113",
    Nome: "Santa Maria do Oeste",
    Estado: "18"
  },
  {
    ID: "3114",
    Nome: "Santa Mariana",
    Estado: "18"
  },
  {
    ID: "3115",
    Nome: "Santa M\xF4nica",
    Estado: "18"
  },
  {
    ID: "3116",
    Nome: "Santa Tereza do Oeste",
    Estado: "18"
  },
  {
    ID: "3117",
    Nome: "Santa Terezinha de Itaipu",
    Estado: "18"
  },
  {
    ID: "3118",
    Nome: "Santana do Itarar\xE9",
    Estado: "18"
  },
  {
    ID: "3119",
    Nome: "Santo Ant\xF4nio da Platina",
    Estado: "18"
  },
  {
    ID: "3120",
    Nome: "Santo Ant\xF4nio do Caiu\xE1",
    Estado: "18"
  },
  {
    ID: "3121",
    Nome: "Santo Ant\xF4nio do Para\xEDso",
    Estado: "18"
  },
  {
    ID: "3122",
    Nome: "Santo Ant\xF4nio do Sudoeste",
    Estado: "18"
  },
  {
    ID: "3123",
    Nome: "Santo In\xE1cio",
    Estado: "18"
  },
  {
    ID: "3124",
    Nome: "S\xE3o Carlos do Iva\xED",
    Estado: "18"
  },
  {
    ID: "3125",
    Nome: "S\xE3o Jer\xF4nimo da Serra",
    Estado: "18"
  },
  {
    ID: "3126",
    Nome: "S\xE3o Jo\xE3o",
    Estado: "18"
  },
  {
    ID: "3127",
    Nome: "S\xE3o Jo\xE3o do Caiu\xE1",
    Estado: "18"
  },
  {
    ID: "3128",
    Nome: "S\xE3o Jo\xE3o do Iva\xED",
    Estado: "18"
  },
  {
    ID: "3129",
    Nome: "S\xE3o Jo\xE3o do Triunfo",
    Estado: "18"
  },
  {
    ID: "3130",
    Nome: "S\xE3o Jorge d`Oeste",
    Estado: "18"
  },
  {
    ID: "3131",
    Nome: "S\xE3o Jorge do Iva\xED",
    Estado: "18"
  },
  {
    ID: "3132",
    Nome: "S\xE3o Jorge do Patroc\xEDnio",
    Estado: "18"
  },
  {
    ID: "3133",
    Nome: "S\xE3o Jos\xE9 da Boa Vista",
    Estado: "18"
  },
  {
    ID: "3134",
    Nome: "S\xE3o Jos\xE9 das Palmeiras",
    Estado: "18"
  },
  {
    ID: "3135",
    Nome: "S\xE3o Jos\xE9 dos Pinhais",
    Estado: "18"
  },
  {
    ID: "3136",
    Nome: "S\xE3o Manoel do Paran\xE1",
    Estado: "18"
  },
  {
    ID: "3137",
    Nome: "S\xE3o Mateus do Sul",
    Estado: "18"
  },
  {
    ID: "3138",
    Nome: "S\xE3o Miguel do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "3139",
    Nome: "S\xE3o Pedro do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "3140",
    Nome: "S\xE3o Pedro do Iva\xED",
    Estado: "18"
  },
  {
    ID: "3141",
    Nome: "S\xE3o Pedro do Paran\xE1",
    Estado: "18"
  },
  {
    ID: "3142",
    Nome: "S\xE3o Sebasti\xE3o da Amoreira",
    Estado: "18"
  },
  {
    ID: "3143",
    Nome: "S\xE3o Tom\xE9",
    Estado: "18"
  },
  {
    ID: "3144",
    Nome: "Sapopema",
    Estado: "18"
  },
  {
    ID: "3145",
    Nome: "Sarandi",
    Estado: "18"
  },
  {
    ID: "3146",
    Nome: "Saudade do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "3147",
    Nome: "Seng\xE9s",
    Estado: "18"
  },
  {
    ID: "3148",
    Nome: "Serran\xF3polis do Igua\xE7u",
    Estado: "18"
  },
  {
    ID: "3149",
    Nome: "Sertaneja",
    Estado: "18"
  },
  {
    ID: "3150",
    Nome: "Sertan\xF3polis",
    Estado: "18"
  },
  {
    ID: "3151",
    Nome: "Siqueira Campos",
    Estado: "18"
  },
  {
    ID: "3152",
    Nome: "Sulina",
    Estado: "18"
  },
  {
    ID: "3153",
    Nome: "Tamarana",
    Estado: "18"
  },
  {
    ID: "3154",
    Nome: "Tamboara",
    Estado: "18"
  },
  {
    ID: "3155",
    Nome: "Tapejara",
    Estado: "18"
  },
  {
    ID: "3156",
    Nome: "Tapira",
    Estado: "18"
  },
  {
    ID: "3157",
    Nome: "Teixeira Soares",
    Estado: "18"
  },
  {
    ID: "3158",
    Nome: "Tel\xEAmaco Borba",
    Estado: "18"
  },
  {
    ID: "3159",
    Nome: "Terra Boa",
    Estado: "18"
  },
  {
    ID: "3160",
    Nome: "Terra Rica",
    Estado: "18"
  },
  {
    ID: "3161",
    Nome: "Terra Roxa",
    Estado: "18"
  },
  {
    ID: "3162",
    Nome: "Tibagi",
    Estado: "18"
  },
  {
    ID: "3163",
    Nome: "Tijucas do Sul",
    Estado: "18"
  },
  {
    ID: "3164",
    Nome: "Toledo",
    Estado: "18"
  },
  {
    ID: "3165",
    Nome: "Tomazina",
    Estado: "18"
  },
  {
    ID: "3166",
    Nome: "Tr\xEAs Barras do Paran\xE1",
    Estado: "18"
  },
  {
    ID: "3167",
    Nome: "Tunas do Paran\xE1",
    Estado: "18"
  },
  {
    ID: "3168",
    Nome: "Tuneiras do Oeste",
    Estado: "18"
  },
  {
    ID: "3169",
    Nome: "Tup\xE3ssi",
    Estado: "18"
  },
  {
    ID: "3170",
    Nome: "Turvo",
    Estado: "18"
  },
  {
    ID: "3171",
    Nome: "Ubirat\xE3",
    Estado: "18"
  },
  {
    ID: "3172",
    Nome: "Umuarama",
    Estado: "18"
  },
  {
    ID: "3173",
    Nome: "Uni\xE3o da Vit\xF3ria",
    Estado: "18"
  },
  {
    ID: "3174",
    Nome: "Uniflor",
    Estado: "18"
  },
  {
    ID: "3175",
    Nome: "Ura\xED",
    Estado: "18"
  },
  {
    ID: "3176",
    Nome: "Ventania",
    Estado: "18"
  },
  {
    ID: "3177",
    Nome: "Vera Cruz do Oeste",
    Estado: "18"
  },
  {
    ID: "3178",
    Nome: "Ver\xEA",
    Estado: "18"
  },
  {
    ID: "3179",
    Nome: "Virmond",
    Estado: "18"
  },
  {
    ID: "3180",
    Nome: "Vitorino",
    Estado: "18"
  },
  {
    ID: "3181",
    Nome: "Wenceslau Braz",
    Estado: "18"
  },
  {
    ID: "3182",
    Nome: "Xambr\xEA",
    Estado: "18"
  },
  {
    ID: "3183",
    Nome: "Abreu e Lima",
    Estado: "16"
  },
  {
    ID: "3184",
    Nome: "Afogados da Ingazeira",
    Estado: "16"
  },
  {
    ID: "3185",
    Nome: "Afr\xE2nio",
    Estado: "16"
  },
  {
    ID: "3186",
    Nome: "Agrestina",
    Estado: "16"
  },
  {
    ID: "3187",
    Nome: "\xC1gua Preta",
    Estado: "16"
  },
  {
    ID: "3188",
    Nome: "\xC1guas Belas",
    Estado: "16"
  },
  {
    ID: "3189",
    Nome: "Alagoinha",
    Estado: "16"
  },
  {
    ID: "3190",
    Nome: "Alian\xE7a",
    Estado: "16"
  },
  {
    ID: "3191",
    Nome: "Altinho",
    Estado: "16"
  },
  {
    ID: "3192",
    Nome: "Amaraji",
    Estado: "16"
  },
  {
    ID: "3193",
    Nome: "Angelim",
    Estado: "16"
  },
  {
    ID: "3194",
    Nome: "Ara\xE7oiaba",
    Estado: "16"
  },
  {
    ID: "3195",
    Nome: "Araripina",
    Estado: "16"
  },
  {
    ID: "3196",
    Nome: "Arcoverde",
    Estado: "16"
  },
  {
    ID: "3197",
    Nome: "Barra de Guabiraba",
    Estado: "16"
  },
  {
    ID: "3198",
    Nome: "Barreiros",
    Estado: "16"
  },
  {
    ID: "3199",
    Nome: "Bel\xE9m de Maria",
    Estado: "16"
  },
  {
    ID: "3200",
    Nome: "Bel\xE9m de S\xE3o Francisco",
    Estado: "16"
  },
  {
    ID: "3201",
    Nome: "Belo Jardim",
    Estado: "16"
  },
  {
    ID: "3202",
    Nome: "Bet\xE2nia",
    Estado: "16"
  },
  {
    ID: "3203",
    Nome: "Bezerros",
    Estado: "16"
  },
  {
    ID: "3204",
    Nome: "Bodoc\xF3",
    Estado: "16"
  },
  {
    ID: "3205",
    Nome: "Bom Conselho",
    Estado: "16"
  },
  {
    ID: "3206",
    Nome: "Bom Jardim",
    Estado: "16"
  },
  {
    ID: "3207",
    Nome: "Bonito",
    Estado: "16"
  },
  {
    ID: "3208",
    Nome: "Brej\xE3o",
    Estado: "16"
  },
  {
    ID: "3209",
    Nome: "Brejinho",
    Estado: "16"
  },
  {
    ID: "3210",
    Nome: "Brejo da Madre de Deus",
    Estado: "16"
  },
  {
    ID: "3211",
    Nome: "Buenos Aires",
    Estado: "16"
  },
  {
    ID: "3212",
    Nome: "Bu\xEDque",
    Estado: "16"
  },
  {
    ID: "3213",
    Nome: "Cabo de Santo Agostinho",
    Estado: "16"
  },
  {
    ID: "3214",
    Nome: "Cabrob\xF3",
    Estado: "16"
  },
  {
    ID: "3215",
    Nome: "Cachoeirinha",
    Estado: "16"
  },
  {
    ID: "3216",
    Nome: "Caet\xE9s",
    Estado: "16"
  },
  {
    ID: "3217",
    Nome: "Cal\xE7ado",
    Estado: "16"
  },
  {
    ID: "3218",
    Nome: "Calumbi",
    Estado: "16"
  },
  {
    ID: "3219",
    Nome: "Camaragibe",
    Estado: "16"
  },
  {
    ID: "3220",
    Nome: "Camocim de S\xE3o F\xE9lix",
    Estado: "16"
  },
  {
    ID: "3221",
    Nome: "Camutanga",
    Estado: "16"
  },
  {
    ID: "3222",
    Nome: "Canhotinho",
    Estado: "16"
  },
  {
    ID: "3223",
    Nome: "Capoeiras",
    Estado: "16"
  },
  {
    ID: "3224",
    Nome: "Carna\xEDba",
    Estado: "16"
  },
  {
    ID: "3225",
    Nome: "Carnaubeira da Penha",
    Estado: "16"
  },
  {
    ID: "3226",
    Nome: "Carpina",
    Estado: "16"
  },
  {
    ID: "3227",
    Nome: "Caruaru",
    Estado: "16"
  },
  {
    ID: "3228",
    Nome: "Casinhas",
    Estado: "16"
  },
  {
    ID: "3229",
    Nome: "Catende",
    Estado: "16"
  },
  {
    ID: "3230",
    Nome: "Cedro",
    Estado: "16"
  },
  {
    ID: "3231",
    Nome: "Ch\xE3 de Alegria",
    Estado: "16"
  },
  {
    ID: "3232",
    Nome: "Ch\xE3 Grande",
    Estado: "16"
  },
  {
    ID: "3233",
    Nome: "Condado",
    Estado: "16"
  },
  {
    ID: "3234",
    Nome: "Correntes",
    Estado: "16"
  },
  {
    ID: "3235",
    Nome: "Cort\xEAs",
    Estado: "16"
  },
  {
    ID: "3236",
    Nome: "Cumaru",
    Estado: "16"
  },
  {
    ID: "3237",
    Nome: "Cupira",
    Estado: "16"
  },
  {
    ID: "3238",
    Nome: "Cust\xF3dia",
    Estado: "16"
  },
  {
    ID: "3239",
    Nome: "Dormentes",
    Estado: "16"
  },
  {
    ID: "3240",
    Nome: "Escada",
    Estado: "16"
  },
  {
    ID: "3241",
    Nome: "Exu",
    Estado: "16"
  },
  {
    ID: "3242",
    Nome: "Feira Nova",
    Estado: "16"
  },
  {
    ID: "3243",
    Nome: "Fernando de Noronha",
    Estado: "16"
  },
  {
    ID: "3244",
    Nome: "Ferreiros",
    Estado: "16"
  },
  {
    ID: "3245",
    Nome: "Flores",
    Estado: "16"
  },
  {
    ID: "3246",
    Nome: "Floresta",
    Estado: "16"
  },
  {
    ID: "3247",
    Nome: "Frei Miguelinho",
    Estado: "16"
  },
  {
    ID: "3248",
    Nome: "Gameleira",
    Estado: "16"
  },
  {
    ID: "3249",
    Nome: "Garanhuns",
    Estado: "16"
  },
  {
    ID: "3250",
    Nome: "Gl\xF3ria do Goit\xE1",
    Estado: "16"
  },
  {
    ID: "3251",
    Nome: "Goiana",
    Estado: "16"
  },
  {
    ID: "3252",
    Nome: "Granito",
    Estado: "16"
  },
  {
    ID: "3253",
    Nome: "Gravat\xE1",
    Estado: "16"
  },
  {
    ID: "3254",
    Nome: "Iati",
    Estado: "16"
  },
  {
    ID: "3255",
    Nome: "Ibimirim",
    Estado: "16"
  },
  {
    ID: "3256",
    Nome: "Ibirajuba",
    Estado: "16"
  },
  {
    ID: "3257",
    Nome: "Igarassu",
    Estado: "16"
  },
  {
    ID: "3258",
    Nome: "Iguaraci",
    Estado: "16"
  },
  {
    ID: "3259",
    Nome: "Ilha de Itamarac\xE1",
    Estado: "16"
  },
  {
    ID: "3260",
    Nome: "Inaj\xE1",
    Estado: "16"
  },
  {
    ID: "3261",
    Nome: "Ingazeira",
    Estado: "16"
  },
  {
    ID: "3262",
    Nome: "Ipojuca",
    Estado: "16"
  },
  {
    ID: "3263",
    Nome: "Ipubi",
    Estado: "16"
  },
  {
    ID: "3264",
    Nome: "Itacuruba",
    Estado: "16"
  },
  {
    ID: "3265",
    Nome: "Ita\xEDba",
    Estado: "16"
  },
  {
    ID: "3266",
    Nome: "Itamb\xE9",
    Estado: "16"
  },
  {
    ID: "3267",
    Nome: "Itapetim",
    Estado: "16"
  },
  {
    ID: "3268",
    Nome: "Itapissuma",
    Estado: "16"
  },
  {
    ID: "3269",
    Nome: "Itaquitinga",
    Estado: "16"
  },
  {
    ID: "3270",
    Nome: "Jaboat\xE3o dos Guararapes",
    Estado: "16"
  },
  {
    ID: "3271",
    Nome: "Jaqueira",
    Estado: "16"
  },
  {
    ID: "3272",
    Nome: "Jata\xFAba",
    Estado: "16"
  },
  {
    ID: "3273",
    Nome: "Jatob\xE1",
    Estado: "16"
  },
  {
    ID: "3274",
    Nome: "Jo\xE3o Alfredo",
    Estado: "16"
  },
  {
    ID: "3275",
    Nome: "Joaquim Nabuco",
    Estado: "16"
  },
  {
    ID: "3276",
    Nome: "Jucati",
    Estado: "16"
  },
  {
    ID: "3277",
    Nome: "Jupi",
    Estado: "16"
  },
  {
    ID: "3278",
    Nome: "Jurema",
    Estado: "16"
  },
  {
    ID: "3279",
    Nome: "Lagoa do Carro",
    Estado: "16"
  },
  {
    ID: "3280",
    Nome: "Lagoa do Itaenga",
    Estado: "16"
  },
  {
    ID: "3281",
    Nome: "Lagoa do Ouro",
    Estado: "16"
  },
  {
    ID: "3282",
    Nome: "Lagoa dos Gatos",
    Estado: "16"
  },
  {
    ID: "3283",
    Nome: "Lagoa Grande",
    Estado: "16"
  },
  {
    ID: "3284",
    Nome: "Lajedo",
    Estado: "16"
  },
  {
    ID: "3285",
    Nome: "Limoeiro",
    Estado: "16"
  },
  {
    ID: "3286",
    Nome: "Macaparana",
    Estado: "16"
  },
  {
    ID: "3287",
    Nome: "Machados",
    Estado: "16"
  },
  {
    ID: "3288",
    Nome: "Manari",
    Estado: "16"
  },
  {
    ID: "3289",
    Nome: "Maraial",
    Estado: "16"
  },
  {
    ID: "3290",
    Nome: "Mirandiba",
    Estado: "16"
  },
  {
    ID: "3291",
    Nome: "Moreil\xE2ndia",
    Estado: "16"
  },
  {
    ID: "3292",
    Nome: "Moreno",
    Estado: "16"
  },
  {
    ID: "3293",
    Nome: "Nazar\xE9 da Mata",
    Estado: "16"
  },
  {
    ID: "3294",
    Nome: "Olinda",
    Estado: "16"
  },
  {
    ID: "3295",
    Nome: "Orob\xF3",
    Estado: "16"
  },
  {
    ID: "3296",
    Nome: "Oroc\xF3",
    Estado: "16"
  },
  {
    ID: "3297",
    Nome: "Ouricuri",
    Estado: "16"
  },
  {
    ID: "3298",
    Nome: "Palmares",
    Estado: "16"
  },
  {
    ID: "3299",
    Nome: "Palmeirina",
    Estado: "16"
  },
  {
    ID: "3300",
    Nome: "Panelas",
    Estado: "16"
  },
  {
    ID: "3301",
    Nome: "Paranatama",
    Estado: "16"
  },
  {
    ID: "3302",
    Nome: "Parnamirim",
    Estado: "16"
  },
  {
    ID: "3303",
    Nome: "Passira",
    Estado: "16"
  },
  {
    ID: "3304",
    Nome: "Paudalho",
    Estado: "16"
  },
  {
    ID: "3305",
    Nome: "Paulista",
    Estado: "16"
  },
  {
    ID: "3306",
    Nome: "Pedra",
    Estado: "16"
  },
  {
    ID: "3307",
    Nome: "Pesqueira",
    Estado: "16"
  },
  {
    ID: "3308",
    Nome: "Petrol\xE2ndia",
    Estado: "16"
  },
  {
    ID: "3309",
    Nome: "Petrolina",
    Estado: "16"
  },
  {
    ID: "3310",
    Nome: "Po\xE7\xE3o",
    Estado: "16"
  },
  {
    ID: "3311",
    Nome: "Pombos",
    Estado: "16"
  },
  {
    ID: "3312",
    Nome: "Primavera",
    Estado: "16"
  },
  {
    ID: "3313",
    Nome: "Quipap\xE1",
    Estado: "16"
  },
  {
    ID: "3314",
    Nome: "Quixaba",
    Estado: "16"
  },
  {
    ID: "3315",
    Nome: "Recife",
    Estado: "16"
  },
  {
    ID: "3316",
    Nome: "Riacho das Almas",
    Estado: "16"
  },
  {
    ID: "3317",
    Nome: "Ribeir\xE3o",
    Estado: "16"
  },
  {
    ID: "3318",
    Nome: "Rio Formoso",
    Estado: "16"
  },
  {
    ID: "3319",
    Nome: "Sair\xE9",
    Estado: "16"
  },
  {
    ID: "3320",
    Nome: "Salgadinho",
    Estado: "16"
  },
  {
    ID: "3321",
    Nome: "Salgueiro",
    Estado: "16"
  },
  {
    ID: "3322",
    Nome: "Salo\xE1",
    Estado: "16"
  },
  {
    ID: "3323",
    Nome: "Sanhar\xF3",
    Estado: "16"
  },
  {
    ID: "3324",
    Nome: "Santa Cruz",
    Estado: "16"
  },
  {
    ID: "3325",
    Nome: "Santa Cruz da Baixa Verde",
    Estado: "16"
  },
  {
    ID: "3326",
    Nome: "Santa Cruz do Capibaribe",
    Estado: "16"
  },
  {
    ID: "3327",
    Nome: "Santa Filomena",
    Estado: "16"
  },
  {
    ID: "3328",
    Nome: "Santa Maria da Boa Vista",
    Estado: "16"
  },
  {
    ID: "3329",
    Nome: "Santa Maria do Cambuc\xE1",
    Estado: "16"
  },
  {
    ID: "3330",
    Nome: "Santa Terezinha",
    Estado: "16"
  },
  {
    ID: "3331",
    Nome: "S\xE3o Benedito do Sul",
    Estado: "16"
  },
  {
    ID: "3332",
    Nome: "S\xE3o Bento do Una",
    Estado: "16"
  },
  {
    ID: "3333",
    Nome: "S\xE3o Caitano",
    Estado: "16"
  },
  {
    ID: "3334",
    Nome: "S\xE3o Jo\xE3o",
    Estado: "16"
  },
  {
    ID: "3335",
    Nome: "S\xE3o Joaquim do Monte",
    Estado: "16"
  },
  {
    ID: "3336",
    Nome: "S\xE3o Jos\xE9 da Coroa Grande",
    Estado: "16"
  },
  {
    ID: "3337",
    Nome: "S\xE3o Jos\xE9 do Belmonte",
    Estado: "16"
  },
  {
    ID: "3338",
    Nome: "S\xE3o Jos\xE9 do Egito",
    Estado: "16"
  },
  {
    ID: "3339",
    Nome: "S\xE3o Louren\xE7o da Mata",
    Estado: "16"
  },
  {
    ID: "3340",
    Nome: "S\xE3o Vicente Ferrer",
    Estado: "16"
  },
  {
    ID: "3341",
    Nome: "Serra Talhada",
    Estado: "16"
  },
  {
    ID: "3342",
    Nome: "Serrita",
    Estado: "16"
  },
  {
    ID: "3343",
    Nome: "Sert\xE2nia",
    Estado: "16"
  },
  {
    ID: "3344",
    Nome: "Sirinha\xE9m",
    Estado: "16"
  },
  {
    ID: "3345",
    Nome: "Solid\xE3o",
    Estado: "16"
  },
  {
    ID: "3346",
    Nome: "Surubim",
    Estado: "16"
  },
  {
    ID: "3347",
    Nome: "Tabira",
    Estado: "16"
  },
  {
    ID: "3348",
    Nome: "Tacaimb\xF3",
    Estado: "16"
  },
  {
    ID: "3349",
    Nome: "Tacaratu",
    Estado: "16"
  },
  {
    ID: "3350",
    Nome: "Tamandar\xE9",
    Estado: "16"
  },
  {
    ID: "3351",
    Nome: "Taquaritinga do Norte",
    Estado: "16"
  },
  {
    ID: "3352",
    Nome: "Terezinha",
    Estado: "16"
  },
  {
    ID: "3353",
    Nome: "Terra Nova",
    Estado: "16"
  },
  {
    ID: "3354",
    Nome: "Timba\xFAba",
    Estado: "16"
  },
  {
    ID: "3355",
    Nome: "Toritama",
    Estado: "16"
  },
  {
    ID: "3356",
    Nome: "Tracunha\xE9m",
    Estado: "16"
  },
  {
    ID: "3357",
    Nome: "Trindade",
    Estado: "16"
  },
  {
    ID: "3358",
    Nome: "Triunfo",
    Estado: "16"
  },
  {
    ID: "3359",
    Nome: "Tupanatinga",
    Estado: "16"
  },
  {
    ID: "3360",
    Nome: "Tuparetama",
    Estado: "16"
  },
  {
    ID: "3361",
    Nome: "Venturosa",
    Estado: "16"
  },
  {
    ID: "3362",
    Nome: "Verdejante",
    Estado: "16"
  },
  {
    ID: "3363",
    Nome: "Vertente do L\xE9rio",
    Estado: "16"
  },
  {
    ID: "3364",
    Nome: "Vertentes",
    Estado: "16"
  },
  {
    ID: "3365",
    Nome: "Vic\xEAncia",
    Estado: "16"
  },
  {
    ID: "3366",
    Nome: "Vit\xF3ria de Santo Ant\xE3o",
    Estado: "16"
  },
  {
    ID: "3367",
    Nome: "Xex\xE9u",
    Estado: "16"
  },
  {
    ID: "3368",
    Nome: "Acau\xE3",
    Estado: "17"
  },
  {
    ID: "3369",
    Nome: "Agricol\xE2ndia",
    Estado: "17"
  },
  {
    ID: "3370",
    Nome: "\xC1gua Branca",
    Estado: "17"
  },
  {
    ID: "3371",
    Nome: "Alagoinha do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3372",
    Nome: "Alegrete do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3373",
    Nome: "Alto Long\xE1",
    Estado: "17"
  },
  {
    ID: "3374",
    Nome: "Altos",
    Estado: "17"
  },
  {
    ID: "3375",
    Nome: "Alvorada do Gurgu\xE9ia",
    Estado: "17"
  },
  {
    ID: "3376",
    Nome: "Amarante",
    Estado: "17"
  },
  {
    ID: "3377",
    Nome: "Angical do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3378",
    Nome: "An\xEDsio de Abreu",
    Estado: "17"
  },
  {
    ID: "3379",
    Nome: "Ant\xF4nio Almeida",
    Estado: "17"
  },
  {
    ID: "3380",
    Nome: "Aroazes",
    Estado: "17"
  },
  {
    ID: "3381",
    Nome: "Aroeiras do Itaim",
    Estado: "17"
  },
  {
    ID: "3382",
    Nome: "Arraial",
    Estado: "17"
  },
  {
    ID: "3383",
    Nome: "Assun\xE7\xE3o do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3384",
    Nome: "Avelino Lopes",
    Estado: "17"
  },
  {
    ID: "3385",
    Nome: "Baixa Grande do Ribeiro",
    Estado: "17"
  },
  {
    ID: "3386",
    Nome: "Barra d`Alc\xE2ntara",
    Estado: "17"
  },
  {
    ID: "3387",
    Nome: "Barras",
    Estado: "17"
  },
  {
    ID: "3388",
    Nome: "Barreiras do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3389",
    Nome: "Barro Duro",
    Estado: "17"
  },
  {
    ID: "3390",
    Nome: "Batalha",
    Estado: "17"
  },
  {
    ID: "3391",
    Nome: "Bela Vista do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3392",
    Nome: "Bel\xE9m do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3393",
    Nome: "Beneditinos",
    Estado: "17"
  },
  {
    ID: "3394",
    Nome: "Bertol\xEDnia",
    Estado: "17"
  },
  {
    ID: "3395",
    Nome: "Bet\xE2nia do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3396",
    Nome: "Boa Hora",
    Estado: "17"
  },
  {
    ID: "3397",
    Nome: "Bocaina",
    Estado: "17"
  },
  {
    ID: "3398",
    Nome: "Bom Jesus",
    Estado: "17"
  },
  {
    ID: "3399",
    Nome: "Bom Princ\xEDpio do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3400",
    Nome: "Bonfim do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3401",
    Nome: "Boqueir\xE3o do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3402",
    Nome: "Brasileira",
    Estado: "17"
  },
  {
    ID: "3403",
    Nome: "Brejo do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3404",
    Nome: "Buriti dos Lopes",
    Estado: "17"
  },
  {
    ID: "3405",
    Nome: "Buriti dos Montes",
    Estado: "17"
  },
  {
    ID: "3406",
    Nome: "Cabeceiras do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3407",
    Nome: "Cajazeiras do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3408",
    Nome: "Cajueiro da Praia",
    Estado: "17"
  },
  {
    ID: "3409",
    Nome: "Caldeir\xE3o Grande do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3410",
    Nome: "Campinas do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3411",
    Nome: "Campo Alegre do Fidalgo",
    Estado: "17"
  },
  {
    ID: "3412",
    Nome: "Campo Grande do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3413",
    Nome: "Campo Largo do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3414",
    Nome: "Campo Maior",
    Estado: "17"
  },
  {
    ID: "3415",
    Nome: "Canavieira",
    Estado: "17"
  },
  {
    ID: "3416",
    Nome: "Canto do Buriti",
    Estado: "17"
  },
  {
    ID: "3417",
    Nome: "Capit\xE3o de Campos",
    Estado: "17"
  },
  {
    ID: "3418",
    Nome: "Capit\xE3o Gerv\xE1sio Oliveira",
    Estado: "17"
  },
  {
    ID: "3419",
    Nome: "Caracol",
    Estado: "17"
  },
  {
    ID: "3420",
    Nome: "Cara\xFAbas do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3421",
    Nome: "Caridade do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3422",
    Nome: "Castelo do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3423",
    Nome: "Caxing\xF3",
    Estado: "17"
  },
  {
    ID: "3424",
    Nome: "Cocal",
    Estado: "17"
  },
  {
    ID: "3425",
    Nome: "Cocal de Telha",
    Estado: "17"
  },
  {
    ID: "3426",
    Nome: "Cocal dos Alves",
    Estado: "17"
  },
  {
    ID: "3427",
    Nome: "Coivaras",
    Estado: "17"
  },
  {
    ID: "3428",
    Nome: "Col\xF4nia do Gurgu\xE9ia",
    Estado: "17"
  },
  {
    ID: "3429",
    Nome: "Col\xF4nia do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3430",
    Nome: "Concei\xE7\xE3o do Canind\xE9",
    Estado: "17"
  },
  {
    ID: "3431",
    Nome: "Coronel Jos\xE9 Dias",
    Estado: "17"
  },
  {
    ID: "3432",
    Nome: "Corrente",
    Estado: "17"
  },
  {
    ID: "3433",
    Nome: "Cristal\xE2ndia do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3434",
    Nome: "Cristino Castro",
    Estado: "17"
  },
  {
    ID: "3435",
    Nome: "Curimat\xE1",
    Estado: "17"
  },
  {
    ID: "3436",
    Nome: "Currais",
    Estado: "17"
  },
  {
    ID: "3437",
    Nome: "Curral Novo do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3438",
    Nome: "Curralinhos",
    Estado: "17"
  },
  {
    ID: "3439",
    Nome: "Demerval Lob\xE3o",
    Estado: "17"
  },
  {
    ID: "3440",
    Nome: "Dirceu Arcoverde",
    Estado: "17"
  },
  {
    ID: "3441",
    Nome: "Dom Expedito Lopes",
    Estado: "17"
  },
  {
    ID: "3442",
    Nome: "Dom Inoc\xEAncio",
    Estado: "17"
  },
  {
    ID: "3443",
    Nome: "Domingos Mour\xE3o",
    Estado: "17"
  },
  {
    ID: "3444",
    Nome: "Elesb\xE3o Veloso",
    Estado: "17"
  },
  {
    ID: "3445",
    Nome: "Eliseu Martins",
    Estado: "17"
  },
  {
    ID: "3446",
    Nome: "Esperantina",
    Estado: "17"
  },
  {
    ID: "3447",
    Nome: "Fartura do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3448",
    Nome: "Flores do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3449",
    Nome: "Floresta do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3450",
    Nome: "Floriano",
    Estado: "17"
  },
  {
    ID: "3451",
    Nome: "Francin\xF3polis",
    Estado: "17"
  },
  {
    ID: "3452",
    Nome: "Francisco Ayres",
    Estado: "17"
  },
  {
    ID: "3453",
    Nome: "Francisco Macedo",
    Estado: "17"
  },
  {
    ID: "3454",
    Nome: "Francisco Santos",
    Estado: "17"
  },
  {
    ID: "3455",
    Nome: "Fronteiras",
    Estado: "17"
  },
  {
    ID: "3456",
    Nome: "Geminiano",
    Estado: "17"
  },
  {
    ID: "3457",
    Nome: "Gilbu\xE9s",
    Estado: "17"
  },
  {
    ID: "3458",
    Nome: "Guadalupe",
    Estado: "17"
  },
  {
    ID: "3459",
    Nome: "Guaribas",
    Estado: "17"
  },
  {
    ID: "3460",
    Nome: "Hugo Napole\xE3o",
    Estado: "17"
  },
  {
    ID: "3461",
    Nome: "Ilha Grande",
    Estado: "17"
  },
  {
    ID: "3462",
    Nome: "Inhuma",
    Estado: "17"
  },
  {
    ID: "3463",
    Nome: "Ipiranga do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3464",
    Nome: "Isa\xEDas Coelho",
    Estado: "17"
  },
  {
    ID: "3465",
    Nome: "Itain\xF3polis",
    Estado: "17"
  },
  {
    ID: "3466",
    Nome: "Itaueira",
    Estado: "17"
  },
  {
    ID: "3467",
    Nome: "Jacobina do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3468",
    Nome: "Jaic\xF3s",
    Estado: "17"
  },
  {
    ID: "3469",
    Nome: "Jardim do Mulato",
    Estado: "17"
  },
  {
    ID: "3470",
    Nome: "Jatob\xE1 do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3471",
    Nome: "Jerumenha",
    Estado: "17"
  },
  {
    ID: "3472",
    Nome: "Jo\xE3o Costa",
    Estado: "17"
  },
  {
    ID: "3473",
    Nome: "Joaquim Pires",
    Estado: "17"
  },
  {
    ID: "3474",
    Nome: "Joca Marques",
    Estado: "17"
  },
  {
    ID: "3475",
    Nome: "Jos\xE9 de Freitas",
    Estado: "17"
  },
  {
    ID: "3476",
    Nome: "Juazeiro do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3477",
    Nome: "J\xFAlio Borges",
    Estado: "17"
  },
  {
    ID: "3478",
    Nome: "Jurema",
    Estado: "17"
  },
  {
    ID: "3479",
    Nome: "Lagoa Alegre",
    Estado: "17"
  },
  {
    ID: "3480",
    Nome: "Lagoa de S\xE3o Francisco",
    Estado: "17"
  },
  {
    ID: "3481",
    Nome: "Lagoa do Barro do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3482",
    Nome: "Lagoa do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3483",
    Nome: "Lagoa do S\xEDtio",
    Estado: "17"
  },
  {
    ID: "3484",
    Nome: "Lagoinha do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3485",
    Nome: "Landri Sales",
    Estado: "17"
  },
  {
    ID: "3486",
    Nome: "Lu\xEDs Correia",
    Estado: "17"
  },
  {
    ID: "3487",
    Nome: "Luzil\xE2ndia",
    Estado: "17"
  },
  {
    ID: "3488",
    Nome: "Madeiro",
    Estado: "17"
  },
  {
    ID: "3489",
    Nome: "Manoel Em\xEDdio",
    Estado: "17"
  },
  {
    ID: "3490",
    Nome: "Marcol\xE2ndia",
    Estado: "17"
  },
  {
    ID: "3491",
    Nome: "Marcos Parente",
    Estado: "17"
  },
  {
    ID: "3492",
    Nome: "Massap\xEA do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3493",
    Nome: "Matias Ol\xEDmpio",
    Estado: "17"
  },
  {
    ID: "3494",
    Nome: "Miguel Alves",
    Estado: "17"
  },
  {
    ID: "3495",
    Nome: "Miguel Le\xE3o",
    Estado: "17"
  },
  {
    ID: "3496",
    Nome: "Milton Brand\xE3o",
    Estado: "17"
  },
  {
    ID: "3497",
    Nome: "Monsenhor Gil",
    Estado: "17"
  },
  {
    ID: "3498",
    Nome: "Monsenhor Hip\xF3lito",
    Estado: "17"
  },
  {
    ID: "3499",
    Nome: "Monte Alegre do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3500",
    Nome: "Morro Cabe\xE7a no Tempo",
    Estado: "17"
  },
  {
    ID: "3501",
    Nome: "Morro do Chap\xE9u do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3502",
    Nome: "Murici dos Portelas",
    Estado: "17"
  },
  {
    ID: "3503",
    Nome: "Nazar\xE9 do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3504",
    Nome: "Nossa Senhora de Nazar\xE9",
    Estado: "17"
  },
  {
    ID: "3505",
    Nome: "Nossa Senhora dos Rem\xE9dios",
    Estado: "17"
  },
  {
    ID: "3506",
    Nome: "Nova Santa Rita",
    Estado: "17"
  },
  {
    ID: "3507",
    Nome: "Novo Oriente do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3508",
    Nome: "Novo Santo Ant\xF4nio",
    Estado: "17"
  },
  {
    ID: "3509",
    Nome: "Oeiras",
    Estado: "17"
  },
  {
    ID: "3510",
    Nome: "Olho d`\xC1gua do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3511",
    Nome: "Padre Marcos",
    Estado: "17"
  },
  {
    ID: "3512",
    Nome: "Paes Landim",
    Estado: "17"
  },
  {
    ID: "3513",
    Nome: "Paje\xFA do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3514",
    Nome: "Palmeira do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3515",
    Nome: "Palmeirais",
    Estado: "17"
  },
  {
    ID: "3516",
    Nome: "Paquet\xE1",
    Estado: "17"
  },
  {
    ID: "3517",
    Nome: "Parnagu\xE1",
    Estado: "17"
  },
  {
    ID: "3518",
    Nome: "Parna\xEDba",
    Estado: "17"
  },
  {
    ID: "3519",
    Nome: "Passagem Franca do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3520",
    Nome: "Patos do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3521",
    Nome: "Pau d`Arco do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3522",
    Nome: "Paulistana",
    Estado: "17"
  },
  {
    ID: "3523",
    Nome: "Pavussu",
    Estado: "17"
  },
  {
    ID: "3524",
    Nome: "Pedro II",
    Estado: "17"
  },
  {
    ID: "3525",
    Nome: "Pedro Laurentino",
    Estado: "17"
  },
  {
    ID: "3526",
    Nome: "Picos",
    Estado: "17"
  },
  {
    ID: "3527",
    Nome: "Pimenteiras",
    Estado: "17"
  },
  {
    ID: "3528",
    Nome: "Pio IX",
    Estado: "17"
  },
  {
    ID: "3529",
    Nome: "Piracuruca",
    Estado: "17"
  },
  {
    ID: "3530",
    Nome: "Piripiri",
    Estado: "17"
  },
  {
    ID: "3531",
    Nome: "Porto",
    Estado: "17"
  },
  {
    ID: "3532",
    Nome: "Porto Alegre do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3533",
    Nome: "Prata do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3534",
    Nome: "Queimada Nova",
    Estado: "17"
  },
  {
    ID: "3535",
    Nome: "Reden\xE7\xE3o do Gurgu\xE9ia",
    Estado: "17"
  },
  {
    ID: "3536",
    Nome: "Regenera\xE7\xE3o",
    Estado: "17"
  },
  {
    ID: "3537",
    Nome: "Riacho Frio",
    Estado: "17"
  },
  {
    ID: "3538",
    Nome: "Ribeira do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3539",
    Nome: "Ribeiro Gon\xE7alves",
    Estado: "17"
  },
  {
    ID: "3540",
    Nome: "Rio Grande do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3541",
    Nome: "Santa Cruz do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3542",
    Nome: "Santa Cruz dos Milagres",
    Estado: "17"
  },
  {
    ID: "3543",
    Nome: "Santa Filomena",
    Estado: "17"
  },
  {
    ID: "3544",
    Nome: "Santa Luz",
    Estado: "17"
  },
  {
    ID: "3545",
    Nome: "Santa Rosa do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3546",
    Nome: "Santana do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3547",
    Nome: "Santo Ant\xF4nio de Lisboa",
    Estado: "17"
  },
  {
    ID: "3548",
    Nome: "Santo Ant\xF4nio dos Milagres",
    Estado: "17"
  },
  {
    ID: "3549",
    Nome: "Santo In\xE1cio do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3550",
    Nome: "S\xE3o Braz do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3551",
    Nome: "S\xE3o F\xE9lix do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3552",
    Nome: "S\xE3o Francisco de Assis do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3553",
    Nome: "S\xE3o Francisco do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3554",
    Nome: "S\xE3o Gon\xE7alo do Gurgu\xE9ia",
    Estado: "17"
  },
  {
    ID: "3555",
    Nome: "S\xE3o Gon\xE7alo do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3556",
    Nome: "S\xE3o Jo\xE3o da Canabrava",
    Estado: "17"
  },
  {
    ID: "3557",
    Nome: "S\xE3o Jo\xE3o da Fronteira",
    Estado: "17"
  },
  {
    ID: "3558",
    Nome: "S\xE3o Jo\xE3o da Serra",
    Estado: "17"
  },
  {
    ID: "3559",
    Nome: "S\xE3o Jo\xE3o da Varjota",
    Estado: "17"
  },
  {
    ID: "3560",
    Nome: "S\xE3o Jo\xE3o do Arraial",
    Estado: "17"
  },
  {
    ID: "3561",
    Nome: "S\xE3o Jo\xE3o do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3562",
    Nome: "S\xE3o Jos\xE9 do Divino",
    Estado: "17"
  },
  {
    ID: "3563",
    Nome: "S\xE3o Jos\xE9 do Peixe",
    Estado: "17"
  },
  {
    ID: "3564",
    Nome: "S\xE3o Jos\xE9 do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3565",
    Nome: "S\xE3o Juli\xE3o",
    Estado: "17"
  },
  {
    ID: "3566",
    Nome: "S\xE3o Louren\xE7o do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3567",
    Nome: "S\xE3o Luis do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3568",
    Nome: "S\xE3o Miguel da Baixa Grande",
    Estado: "17"
  },
  {
    ID: "3569",
    Nome: "S\xE3o Miguel do Fidalgo",
    Estado: "17"
  },
  {
    ID: "3570",
    Nome: "S\xE3o Miguel do Tapuio",
    Estado: "17"
  },
  {
    ID: "3571",
    Nome: "S\xE3o Pedro do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3572",
    Nome: "S\xE3o Raimundo Nonato",
    Estado: "17"
  },
  {
    ID: "3573",
    Nome: "Sebasti\xE3o Barros",
    Estado: "17"
  },
  {
    ID: "3574",
    Nome: "Sebasti\xE3o Leal",
    Estado: "17"
  },
  {
    ID: "3575",
    Nome: "Sigefredo Pacheco",
    Estado: "17"
  },
  {
    ID: "3576",
    Nome: "Sim\xF5es",
    Estado: "17"
  },
  {
    ID: "3577",
    Nome: "Simpl\xEDcio Mendes",
    Estado: "17"
  },
  {
    ID: "3578",
    Nome: "Socorro do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3579",
    Nome: "Sussuapara",
    Estado: "17"
  },
  {
    ID: "3580",
    Nome: "Tamboril do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3581",
    Nome: "Tanque do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3582",
    Nome: "Teresina",
    Estado: "17"
  },
  {
    ID: "3583",
    Nome: "Uni\xE3o",
    Estado: "17"
  },
  {
    ID: "3584",
    Nome: "Uru\xE7u\xED",
    Estado: "17"
  },
  {
    ID: "3585",
    Nome: "Valen\xE7a do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3586",
    Nome: "V\xE1rzea Branca",
    Estado: "17"
  },
  {
    ID: "3587",
    Nome: "V\xE1rzea Grande",
    Estado: "17"
  },
  {
    ID: "3588",
    Nome: "Vera Mendes",
    Estado: "17"
  },
  {
    ID: "3589",
    Nome: "Vila Nova do Piau\xED",
    Estado: "17"
  },
  {
    ID: "3590",
    Nome: "Wall Ferraz",
    Estado: "17"
  },
  {
    ID: "3591",
    Nome: "Angra dos Reis",
    Estado: "19"
  },
  {
    ID: "3592",
    Nome: "Aperib\xE9",
    Estado: "19"
  },
  {
    ID: "3593",
    Nome: "Araruama",
    Estado: "19"
  },
  {
    ID: "3594",
    Nome: "Areal",
    Estado: "19"
  },
  {
    ID: "3595",
    Nome: "Arma\xE7\xE3o dos B\xFAzios",
    Estado: "19"
  },
  {
    ID: "3596",
    Nome: "Arraial do Cabo",
    Estado: "19"
  },
  {
    ID: "3597",
    Nome: "Barra do Pira\xED",
    Estado: "19"
  },
  {
    ID: "3598",
    Nome: "Barra Mansa",
    Estado: "19"
  },
  {
    ID: "3599",
    Nome: "Belford Roxo",
    Estado: "19"
  },
  {
    ID: "3600",
    Nome: "Bom Jardim",
    Estado: "19"
  },
  {
    ID: "3601",
    Nome: "Bom Jesus do Itabapoana",
    Estado: "19"
  },
  {
    ID: "3602",
    Nome: "Cabo Frio",
    Estado: "19"
  },
  {
    ID: "3603",
    Nome: "Cachoeiras de Macacu",
    Estado: "19"
  },
  {
    ID: "3604",
    Nome: "Cambuci",
    Estado: "19"
  },
  {
    ID: "3605",
    Nome: "Campos dos Goytacazes",
    Estado: "19"
  },
  {
    ID: "3606",
    Nome: "Cantagalo",
    Estado: "19"
  },
  {
    ID: "3607",
    Nome: "Carapebus",
    Estado: "19"
  },
  {
    ID: "3608",
    Nome: "Cardoso Moreira",
    Estado: "19"
  },
  {
    ID: "3609",
    Nome: "Carmo",
    Estado: "19"
  },
  {
    ID: "3610",
    Nome: "Casimiro de Abreu",
    Estado: "19"
  },
  {
    ID: "3611",
    Nome: "Comendador Levy Gasparian",
    Estado: "19"
  },
  {
    ID: "3612",
    Nome: "Concei\xE7\xE3o de Macabu",
    Estado: "19"
  },
  {
    ID: "3613",
    Nome: "Cordeiro",
    Estado: "19"
  },
  {
    ID: "3614",
    Nome: "Duas Barras",
    Estado: "19"
  },
  {
    ID: "3615",
    Nome: "Duque de Caxias",
    Estado: "19"
  },
  {
    ID: "3616",
    Nome: "Engenheiro Paulo de Frontin",
    Estado: "19"
  },
  {
    ID: "3617",
    Nome: "Guapimirim",
    Estado: "19"
  },
  {
    ID: "3618",
    Nome: "Iguaba Grande",
    Estado: "19"
  },
  {
    ID: "3619",
    Nome: "Itabora\xED",
    Estado: "19"
  },
  {
    ID: "3620",
    Nome: "Itagua\xED",
    Estado: "19"
  },
  {
    ID: "3621",
    Nome: "Italva",
    Estado: "19"
  },
  {
    ID: "3622",
    Nome: "Itaocara",
    Estado: "19"
  },
  {
    ID: "3623",
    Nome: "Itaperuna",
    Estado: "19"
  },
  {
    ID: "3624",
    Nome: "Itatiaia",
    Estado: "19"
  },
  {
    ID: "3625",
    Nome: "Japeri",
    Estado: "19"
  },
  {
    ID: "3626",
    Nome: "Laje do Muria\xE9",
    Estado: "19"
  },
  {
    ID: "3627",
    Nome: "Maca\xE9",
    Estado: "19"
  },
  {
    ID: "3628",
    Nome: "Macuco",
    Estado: "19"
  },
  {
    ID: "3629",
    Nome: "Mag\xE9",
    Estado: "19"
  },
  {
    ID: "3630",
    Nome: "Mangaratiba",
    Estado: "19"
  },
  {
    ID: "3631",
    Nome: "Maric\xE1",
    Estado: "19"
  },
  {
    ID: "3632",
    Nome: "Mendes",
    Estado: "19"
  },
  {
    ID: "3633",
    Nome: "Mesquita",
    Estado: "19"
  },
  {
    ID: "3634",
    Nome: "Miguel Pereira",
    Estado: "19"
  },
  {
    ID: "3635",
    Nome: "Miracema",
    Estado: "19"
  },
  {
    ID: "3636",
    Nome: "Natividade",
    Estado: "19"
  },
  {
    ID: "3637",
    Nome: "Nil\xF3polis",
    Estado: "19"
  },
  {
    ID: "3638",
    Nome: "Niter\xF3i",
    Estado: "19"
  },
  {
    ID: "3639",
    Nome: "Nova Friburgo",
    Estado: "19"
  },
  {
    ID: "3640",
    Nome: "Nova Igua\xE7u",
    Estado: "19"
  },
  {
    ID: "3641",
    Nome: "Paracambi",
    Estado: "19"
  },
  {
    ID: "3642",
    Nome: "Para\xEDba do Sul",
    Estado: "19"
  },
  {
    ID: "3643",
    Nome: "Parati",
    Estado: "19"
  },
  {
    ID: "3644",
    Nome: "Paty do Alferes",
    Estado: "19"
  },
  {
    ID: "3645",
    Nome: "Petr\xF3polis",
    Estado: "19"
  },
  {
    ID: "3646",
    Nome: "Pinheiral",
    Estado: "19"
  },
  {
    ID: "3647",
    Nome: "Pira\xED",
    Estado: "19"
  },
  {
    ID: "3648",
    Nome: "Porci\xFAncula",
    Estado: "19"
  },
  {
    ID: "3649",
    Nome: "Porto Real",
    Estado: "19"
  },
  {
    ID: "3650",
    Nome: "Quatis",
    Estado: "19"
  },
  {
    ID: "3651",
    Nome: "Queimados",
    Estado: "19"
  },
  {
    ID: "3652",
    Nome: "Quissam\xE3",
    Estado: "19"
  },
  {
    ID: "3653",
    Nome: "Resende",
    Estado: "19"
  },
  {
    ID: "3654",
    Nome: "Rio Bonito",
    Estado: "19"
  },
  {
    ID: "3655",
    Nome: "Rio Claro",
    Estado: "19"
  },
  {
    ID: "3656",
    Nome: "Rio das Flores",
    Estado: "19"
  },
  {
    ID: "3657",
    Nome: "Rio das Ostras",
    Estado: "19"
  },
  {
    ID: "3658",
    Nome: "Rio de Janeiro",
    Estado: "19"
  },
  {
    ID: "3659",
    Nome: "Santa Maria Madalena",
    Estado: "19"
  },
  {
    ID: "3660",
    Nome: "Santo Ant\xF4nio de P\xE1dua",
    Estado: "19"
  },
  {
    ID: "3661",
    Nome: "S\xE3o Fid\xE9lis",
    Estado: "19"
  },
  {
    ID: "3662",
    Nome: "S\xE3o Francisco de Itabapoana",
    Estado: "19"
  },
  {
    ID: "3663",
    Nome: "S\xE3o Gon\xE7alo",
    Estado: "19"
  },
  {
    ID: "3664",
    Nome: "S\xE3o Jo\xE3o da Barra",
    Estado: "19"
  },
  {
    ID: "3665",
    Nome: "S\xE3o Jo\xE3o de Meriti",
    Estado: "19"
  },
  {
    ID: "3666",
    Nome: "S\xE3o Jos\xE9 de Ub\xE1",
    Estado: "19"
  },
  {
    ID: "3667",
    Nome: "S\xE3o Jos\xE9 do Vale do Rio Preto",
    Estado: "19"
  },
  {
    ID: "3668",
    Nome: "S\xE3o Pedro da Aldeia",
    Estado: "19"
  },
  {
    ID: "3669",
    Nome: "S\xE3o Sebasti\xE3o do Alto",
    Estado: "19"
  },
  {
    ID: "3670",
    Nome: "Sapucaia",
    Estado: "19"
  },
  {
    ID: "3671",
    Nome: "Saquarema",
    Estado: "19"
  },
  {
    ID: "3672",
    Nome: "Serop\xE9dica",
    Estado: "19"
  },
  {
    ID: "3673",
    Nome: "Silva Jardim",
    Estado: "19"
  },
  {
    ID: "3674",
    Nome: "Sumidouro",
    Estado: "19"
  },
  {
    ID: "3675",
    Nome: "Tangu\xE1",
    Estado: "19"
  },
  {
    ID: "3676",
    Nome: "Teres\xF3polis",
    Estado: "19"
  },
  {
    ID: "3677",
    Nome: "Trajano de Morais",
    Estado: "19"
  },
  {
    ID: "3678",
    Nome: "Tr\xEAs Rios",
    Estado: "19"
  },
  {
    ID: "3679",
    Nome: "Valen\xE7a",
    Estado: "19"
  },
  {
    ID: "3680",
    Nome: "Varre-Sai",
    Estado: "19"
  },
  {
    ID: "3681",
    Nome: "Vassouras",
    Estado: "19"
  },
  {
    ID: "3682",
    Nome: "Volta Redonda",
    Estado: "19"
  },
  {
    ID: "3683",
    Nome: "Acari",
    Estado: "20"
  },
  {
    ID: "3684",
    Nome: "A\xE7u",
    Estado: "20"
  },
  {
    ID: "3685",
    Nome: "Afonso Bezerra",
    Estado: "20"
  },
  {
    ID: "3686",
    Nome: "\xC1gua Nova",
    Estado: "20"
  },
  {
    ID: "3687",
    Nome: "Alexandria",
    Estado: "20"
  },
  {
    ID: "3688",
    Nome: "Almino Afonso",
    Estado: "20"
  },
  {
    ID: "3689",
    Nome: "Alto do Rodrigues",
    Estado: "20"
  },
  {
    ID: "3690",
    Nome: "Angicos",
    Estado: "20"
  },
  {
    ID: "3691",
    Nome: "Ant\xF4nio Martins",
    Estado: "20"
  },
  {
    ID: "3692",
    Nome: "Apodi",
    Estado: "20"
  },
  {
    ID: "3693",
    Nome: "Areia Branca",
    Estado: "20"
  },
  {
    ID: "3694",
    Nome: "Ar\xEAs",
    Estado: "20"
  },
  {
    ID: "3695",
    Nome: "Augusto Severo",
    Estado: "20"
  },
  {
    ID: "3696",
    Nome: "Ba\xEDa Formosa",
    Estado: "20"
  },
  {
    ID: "3697",
    Nome: "Bara\xFAna",
    Estado: "20"
  },
  {
    ID: "3698",
    Nome: "Barcelona",
    Estado: "20"
  },
  {
    ID: "3699",
    Nome: "Bento Fernandes",
    Estado: "20"
  },
  {
    ID: "3700",
    Nome: "Bod\xF3",
    Estado: "20"
  },
  {
    ID: "3701",
    Nome: "Bom Jesus",
    Estado: "20"
  },
  {
    ID: "3702",
    Nome: "Brejinho",
    Estado: "20"
  },
  {
    ID: "3703",
    Nome: "Cai\xE7ara do Norte",
    Estado: "20"
  },
  {
    ID: "3704",
    Nome: "Cai\xE7ara do Rio do Vento",
    Estado: "20"
  },
  {
    ID: "3705",
    Nome: "Caic\xF3",
    Estado: "20"
  },
  {
    ID: "3706",
    Nome: "Campo Redondo",
    Estado: "20"
  },
  {
    ID: "3707",
    Nome: "Canguaretama",
    Estado: "20"
  },
  {
    ID: "3708",
    Nome: "Cara\xFAbas",
    Estado: "20"
  },
  {
    ID: "3709",
    Nome: "Carna\xFAba dos Dantas",
    Estado: "20"
  },
  {
    ID: "3710",
    Nome: "Carnaubais",
    Estado: "20"
  },
  {
    ID: "3711",
    Nome: "Cear\xE1-Mirim",
    Estado: "20"
  },
  {
    ID: "3712",
    Nome: "Cerro Cor\xE1",
    Estado: "20"
  },
  {
    ID: "3713",
    Nome: "Coronel Ezequiel",
    Estado: "20"
  },
  {
    ID: "3714",
    Nome: "Coronel Jo\xE3o Pessoa",
    Estado: "20"
  },
  {
    ID: "3715",
    Nome: "Cruzeta",
    Estado: "20"
  },
  {
    ID: "3716",
    Nome: "Currais Novos",
    Estado: "20"
  },
  {
    ID: "3717",
    Nome: "Doutor Severiano",
    Estado: "20"
  },
  {
    ID: "3718",
    Nome: "Encanto",
    Estado: "20"
  },
  {
    ID: "3719",
    Nome: "Equador",
    Estado: "20"
  },
  {
    ID: "3720",
    Nome: "Esp\xEDrito Santo",
    Estado: "20"
  },
  {
    ID: "3721",
    Nome: "Extremoz",
    Estado: "20"
  },
  {
    ID: "3722",
    Nome: "Felipe Guerra",
    Estado: "20"
  },
  {
    ID: "3723",
    Nome: "Fernando Pedroza",
    Estado: "20"
  },
  {
    ID: "3724",
    Nome: "Flor\xE2nia",
    Estado: "20"
  },
  {
    ID: "3725",
    Nome: "Francisco Dantas",
    Estado: "20"
  },
  {
    ID: "3726",
    Nome: "Frutuoso Gomes",
    Estado: "20"
  },
  {
    ID: "3727",
    Nome: "Galinhos",
    Estado: "20"
  },
  {
    ID: "3728",
    Nome: "Goianinha",
    Estado: "20"
  },
  {
    ID: "3729",
    Nome: "Governador Dix-Sept Rosado",
    Estado: "20"
  },
  {
    ID: "3730",
    Nome: "Grossos",
    Estado: "20"
  },
  {
    ID: "3731",
    Nome: "Guamar\xE9",
    Estado: "20"
  },
  {
    ID: "3732",
    Nome: "Ielmo Marinho",
    Estado: "20"
  },
  {
    ID: "3733",
    Nome: "Ipangua\xE7u",
    Estado: "20"
  },
  {
    ID: "3734",
    Nome: "Ipueira",
    Estado: "20"
  },
  {
    ID: "3735",
    Nome: "Itaj\xE1",
    Estado: "20"
  },
  {
    ID: "3736",
    Nome: "Ita\xFA",
    Estado: "20"
  },
  {
    ID: "3737",
    Nome: "Ja\xE7an\xE3",
    Estado: "20"
  },
  {
    ID: "3738",
    Nome: "Janda\xEDra",
    Estado: "20"
  },
  {
    ID: "3739",
    Nome: "Jandu\xEDs",
    Estado: "20"
  },
  {
    ID: "3740",
    Nome: "Janu\xE1rio Cicco",
    Estado: "20"
  },
  {
    ID: "3741",
    Nome: "Japi",
    Estado: "20"
  },
  {
    ID: "3742",
    Nome: "Jardim de Angicos",
    Estado: "20"
  },
  {
    ID: "3743",
    Nome: "Jardim de Piranhas",
    Estado: "20"
  },
  {
    ID: "3744",
    Nome: "Jardim do Serid\xF3",
    Estado: "20"
  },
  {
    ID: "3745",
    Nome: "Jo\xE3o C\xE2mara",
    Estado: "20"
  },
  {
    ID: "3746",
    Nome: "Jo\xE3o Dias",
    Estado: "20"
  },
  {
    ID: "3747",
    Nome: "Jos\xE9 da Penha",
    Estado: "20"
  },
  {
    ID: "3748",
    Nome: "Jucurutu",
    Estado: "20"
  },
  {
    ID: "3749",
    Nome: "Jundi\xE1",
    Estado: "20"
  },
  {
    ID: "3750",
    Nome: "Lagoa d`Anta",
    Estado: "20"
  },
  {
    ID: "3751",
    Nome: "Lagoa de Pedras",
    Estado: "20"
  },
  {
    ID: "3752",
    Nome: "Lagoa de Velhos",
    Estado: "20"
  },
  {
    ID: "3753",
    Nome: "Lagoa Nova",
    Estado: "20"
  },
  {
    ID: "3754",
    Nome: "Lagoa Salgada",
    Estado: "20"
  },
  {
    ID: "3755",
    Nome: "Lajes",
    Estado: "20"
  },
  {
    ID: "3756",
    Nome: "Lajes Pintadas",
    Estado: "20"
  },
  {
    ID: "3757",
    Nome: "Lucr\xE9cia",
    Estado: "20"
  },
  {
    ID: "3758",
    Nome: "Lu\xEDs Gomes",
    Estado: "20"
  },
  {
    ID: "3759",
    Nome: "Maca\xEDba",
    Estado: "20"
  },
  {
    ID: "3760",
    Nome: "Macau",
    Estado: "20"
  },
  {
    ID: "3761",
    Nome: "Major Sales",
    Estado: "20"
  },
  {
    ID: "3762",
    Nome: "Marcelino Vieira",
    Estado: "20"
  },
  {
    ID: "3763",
    Nome: "Martins",
    Estado: "20"
  },
  {
    ID: "3764",
    Nome: "Maxaranguape",
    Estado: "20"
  },
  {
    ID: "3765",
    Nome: "Messias Targino",
    Estado: "20"
  },
  {
    ID: "3766",
    Nome: "Montanhas",
    Estado: "20"
  },
  {
    ID: "3767",
    Nome: "Monte Alegre",
    Estado: "20"
  },
  {
    ID: "3768",
    Nome: "Monte das Gameleiras",
    Estado: "20"
  },
  {
    ID: "3769",
    Nome: "Mossor\xF3",
    Estado: "20"
  },
  {
    ID: "3770",
    Nome: "Natal",
    Estado: "20"
  },
  {
    ID: "3771",
    Nome: "N\xEDsia Floresta",
    Estado: "20"
  },
  {
    ID: "3772",
    Nome: "Nova Cruz",
    Estado: "20"
  },
  {
    ID: "3773",
    Nome: "Olho-d`\xC1gua do Borges",
    Estado: "20"
  },
  {
    ID: "3774",
    Nome: "Ouro Branco",
    Estado: "20"
  },
  {
    ID: "3775",
    Nome: "Paran\xE1",
    Estado: "20"
  },
  {
    ID: "3776",
    Nome: "Para\xFA",
    Estado: "20"
  },
  {
    ID: "3777",
    Nome: "Parazinho",
    Estado: "20"
  },
  {
    ID: "3778",
    Nome: "Parelhas",
    Estado: "20"
  },
  {
    ID: "3779",
    Nome: "Parnamirim",
    Estado: "20"
  },
  {
    ID: "3780",
    Nome: "Passa e Fica",
    Estado: "20"
  },
  {
    ID: "3781",
    Nome: "Passagem",
    Estado: "20"
  },
  {
    ID: "3782",
    Nome: "Patu",
    Estado: "20"
  },
  {
    ID: "3783",
    Nome: "Pau dos Ferros",
    Estado: "20"
  },
  {
    ID: "3784",
    Nome: "Pedra Grande",
    Estado: "20"
  },
  {
    ID: "3785",
    Nome: "Pedra Preta",
    Estado: "20"
  },
  {
    ID: "3786",
    Nome: "Pedro Avelino",
    Estado: "20"
  },
  {
    ID: "3787",
    Nome: "Pedro Velho",
    Estado: "20"
  },
  {
    ID: "3788",
    Nome: "Pend\xEAncias",
    Estado: "20"
  },
  {
    ID: "3789",
    Nome: "Pil\xF5es",
    Estado: "20"
  },
  {
    ID: "3790",
    Nome: "Po\xE7o Branco",
    Estado: "20"
  },
  {
    ID: "3791",
    Nome: "Portalegre",
    Estado: "20"
  },
  {
    ID: "3792",
    Nome: "Porto do Mangue",
    Estado: "20"
  },
  {
    ID: "3793",
    Nome: "Presidente Juscelino",
    Estado: "20"
  },
  {
    ID: "3794",
    Nome: "Pureza",
    Estado: "20"
  },
  {
    ID: "3795",
    Nome: "Rafael Fernandes",
    Estado: "20"
  },
  {
    ID: "3796",
    Nome: "Rafael Godeiro",
    Estado: "20"
  },
  {
    ID: "3797",
    Nome: "Riacho da Cruz",
    Estado: "20"
  },
  {
    ID: "3798",
    Nome: "Riacho de Santana",
    Estado: "20"
  },
  {
    ID: "3799",
    Nome: "Riachuelo",
    Estado: "20"
  },
  {
    ID: "3800",
    Nome: "Rio do Fogo",
    Estado: "20"
  },
  {
    ID: "3801",
    Nome: "Rodolfo Fernandes",
    Estado: "20"
  },
  {
    ID: "3802",
    Nome: "Ruy Barbosa",
    Estado: "20"
  },
  {
    ID: "3803",
    Nome: "Santa Cruz",
    Estado: "20"
  },
  {
    ID: "3804",
    Nome: "Santa Maria",
    Estado: "20"
  },
  {
    ID: "3805",
    Nome: "Santana do Matos",
    Estado: "20"
  },
  {
    ID: "3806",
    Nome: "Santana do Serid\xF3",
    Estado: "20"
  },
  {
    ID: "3807",
    Nome: "Santo Ant\xF4nio",
    Estado: "20"
  },
  {
    ID: "3808",
    Nome: "S\xE3o Bento do Norte",
    Estado: "20"
  },
  {
    ID: "3809",
    Nome: "S\xE3o Bento do Trair\xED",
    Estado: "20"
  },
  {
    ID: "3810",
    Nome: "S\xE3o Fernando",
    Estado: "20"
  },
  {
    ID: "3811",
    Nome: "S\xE3o Francisco do Oeste",
    Estado: "20"
  },
  {
    ID: "3812",
    Nome: "S\xE3o Gon\xE7alo do Amarante",
    Estado: "20"
  },
  {
    ID: "3813",
    Nome: "S\xE3o Jo\xE3o do Sabugi",
    Estado: "20"
  },
  {
    ID: "3814",
    Nome: "S\xE3o Jos\xE9 de Mipibu",
    Estado: "20"
  },
  {
    ID: "3815",
    Nome: "S\xE3o Jos\xE9 do Campestre",
    Estado: "20"
  },
  {
    ID: "3816",
    Nome: "S\xE3o Jos\xE9 do Serid\xF3",
    Estado: "20"
  },
  {
    ID: "3817",
    Nome: "S\xE3o Miguel",
    Estado: "20"
  },
  {
    ID: "3818",
    Nome: "S\xE3o Miguel do Gostoso",
    Estado: "20"
  },
  {
    ID: "3819",
    Nome: "S\xE3o Paulo do Potengi",
    Estado: "20"
  },
  {
    ID: "3820",
    Nome: "S\xE3o Pedro",
    Estado: "20"
  },
  {
    ID: "3821",
    Nome: "S\xE3o Rafael",
    Estado: "20"
  },
  {
    ID: "3822",
    Nome: "S\xE3o Tom\xE9",
    Estado: "20"
  },
  {
    ID: "3823",
    Nome: "S\xE3o Vicente",
    Estado: "20"
  },
  {
    ID: "3824",
    Nome: "Senador El\xF3i de Souza",
    Estado: "20"
  },
  {
    ID: "3825",
    Nome: "Senador Georgino Avelino",
    Estado: "20"
  },
  {
    ID: "3826",
    Nome: "Serra de S\xE3o Bento",
    Estado: "20"
  },
  {
    ID: "3827",
    Nome: "Serra do Mel",
    Estado: "20"
  },
  {
    ID: "3828",
    Nome: "Serra Negra do Norte",
    Estado: "20"
  },
  {
    ID: "3829",
    Nome: "Serrinha",
    Estado: "20"
  },
  {
    ID: "3830",
    Nome: "Serrinha dos Pintos",
    Estado: "20"
  },
  {
    ID: "3831",
    Nome: "Severiano Melo",
    Estado: "20"
  },
  {
    ID: "3832",
    Nome: "S\xEDtio Novo",
    Estado: "20"
  },
  {
    ID: "3833",
    Nome: "Taboleiro Grande",
    Estado: "20"
  },
  {
    ID: "3834",
    Nome: "Taipu",
    Estado: "20"
  },
  {
    ID: "3835",
    Nome: "Tangar\xE1",
    Estado: "20"
  },
  {
    ID: "3836",
    Nome: "Tenente Ananias",
    Estado: "20"
  },
  {
    ID: "3837",
    Nome: "Tenente Laurentino Cruz",
    Estado: "20"
  },
  {
    ID: "3838",
    Nome: "Tibau",
    Estado: "20"
  },
  {
    ID: "3839",
    Nome: "Tibau do Sul",
    Estado: "20"
  },
  {
    ID: "3840",
    Nome: "Timba\xFAba dos Batistas",
    Estado: "20"
  },
  {
    ID: "3841",
    Nome: "Touros",
    Estado: "20"
  },
  {
    ID: "3842",
    Nome: "Triunfo Potiguar",
    Estado: "20"
  },
  {
    ID: "3843",
    Nome: "Umarizal",
    Estado: "20"
  },
  {
    ID: "3844",
    Nome: "Upanema",
    Estado: "20"
  },
  {
    ID: "3845",
    Nome: "V\xE1rzea",
    Estado: "20"
  },
  {
    ID: "3846",
    Nome: "Venha-Ver",
    Estado: "20"
  },
  {
    ID: "3847",
    Nome: "Vera Cruz",
    Estado: "20"
  },
  {
    ID: "3848",
    Nome: "Vi\xE7osa",
    Estado: "20"
  },
  {
    ID: "3849",
    Nome: "Vila Flor",
    Estado: "20"
  },
  {
    ID: "3850",
    Nome: "Acegu\xE1",
    Estado: "23"
  },
  {
    ID: "3851",
    Nome: "\xC1gua Santa",
    Estado: "23"
  },
  {
    ID: "3852",
    Nome: "Agudo",
    Estado: "23"
  },
  {
    ID: "3853",
    Nome: "Ajuricaba",
    Estado: "23"
  },
  {
    ID: "3854",
    Nome: "Alecrim",
    Estado: "23"
  },
  {
    ID: "3855",
    Nome: "Alegrete",
    Estado: "23"
  },
  {
    ID: "3856",
    Nome: "Alegria",
    Estado: "23"
  },
  {
    ID: "3857",
    Nome: "Almirante Tamandar\xE9 do Sul",
    Estado: "23"
  },
  {
    ID: "3858",
    Nome: "Alpestre",
    Estado: "23"
  },
  {
    ID: "3859",
    Nome: "Alto Alegre",
    Estado: "23"
  },
  {
    ID: "3860",
    Nome: "Alto Feliz",
    Estado: "23"
  },
  {
    ID: "3861",
    Nome: "Alvorada",
    Estado: "23"
  },
  {
    ID: "3862",
    Nome: "Amaral Ferrador",
    Estado: "23"
  },
  {
    ID: "3863",
    Nome: "Ametista do Sul",
    Estado: "23"
  },
  {
    ID: "3864",
    Nome: "Andr\xE9 da Rocha",
    Estado: "23"
  },
  {
    ID: "3865",
    Nome: "Anta Gorda",
    Estado: "23"
  },
  {
    ID: "3866",
    Nome: "Ant\xF4nio Prado",
    Estado: "23"
  },
  {
    ID: "3867",
    Nome: "Arambar\xE9",
    Estado: "23"
  },
  {
    ID: "3868",
    Nome: "Araric\xE1",
    Estado: "23"
  },
  {
    ID: "3869",
    Nome: "Aratiba",
    Estado: "23"
  },
  {
    ID: "3870",
    Nome: "Arroio do Meio",
    Estado: "23"
  },
  {
    ID: "3871",
    Nome: "Arroio do Padre",
    Estado: "23"
  },
  {
    ID: "3872",
    Nome: "Arroio do Sal",
    Estado: "23"
  },
  {
    ID: "3873",
    Nome: "Arroio do Tigre",
    Estado: "23"
  },
  {
    ID: "3874",
    Nome: "Arroio dos Ratos",
    Estado: "23"
  },
  {
    ID: "3875",
    Nome: "Arroio Grande",
    Estado: "23"
  },
  {
    ID: "3876",
    Nome: "Arvorezinha",
    Estado: "23"
  },
  {
    ID: "3877",
    Nome: "Augusto Pestana",
    Estado: "23"
  },
  {
    ID: "3878",
    Nome: "\xC1urea",
    Estado: "23"
  },
  {
    ID: "3879",
    Nome: "Bag\xE9",
    Estado: "23"
  },
  {
    ID: "3880",
    Nome: "Balne\xE1rio Pinhal",
    Estado: "23"
  },
  {
    ID: "3881",
    Nome: "Bar\xE3o",
    Estado: "23"
  },
  {
    ID: "3882",
    Nome: "Bar\xE3o de Cotegipe",
    Estado: "23"
  },
  {
    ID: "3883",
    Nome: "Bar\xE3o do Triunfo",
    Estado: "23"
  },
  {
    ID: "3884",
    Nome: "Barra do Guarita",
    Estado: "23"
  },
  {
    ID: "3885",
    Nome: "Barra do Quara\xED",
    Estado: "23"
  },
  {
    ID: "3886",
    Nome: "Barra do Ribeiro",
    Estado: "23"
  },
  {
    ID: "3887",
    Nome: "Barra do Rio Azul",
    Estado: "23"
  },
  {
    ID: "3888",
    Nome: "Barra Funda",
    Estado: "23"
  },
  {
    ID: "3889",
    Nome: "Barrac\xE3o",
    Estado: "23"
  },
  {
    ID: "3890",
    Nome: "Barros Cassal",
    Estado: "23"
  },
  {
    ID: "3891",
    Nome: "Benjamin Constant do Sul",
    Estado: "23"
  },
  {
    ID: "3892",
    Nome: "Bento Gon\xE7alves",
    Estado: "23"
  },
  {
    ID: "3893",
    Nome: "Boa Vista das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "3894",
    Nome: "Boa Vista do Buric\xE1",
    Estado: "23"
  },
  {
    ID: "3895",
    Nome: "Boa Vista do Cadeado",
    Estado: "23"
  },
  {
    ID: "3896",
    Nome: "Boa Vista do Incra",
    Estado: "23"
  },
  {
    ID: "3897",
    Nome: "Boa Vista do Sul",
    Estado: "23"
  },
  {
    ID: "3898",
    Nome: "Bom Jesus",
    Estado: "23"
  },
  {
    ID: "3899",
    Nome: "Bom Princ\xEDpio",
    Estado: "23"
  },
  {
    ID: "3900",
    Nome: "Bom Progresso",
    Estado: "23"
  },
  {
    ID: "3901",
    Nome: "Bom Retiro do Sul",
    Estado: "23"
  },
  {
    ID: "3902",
    Nome: "Boqueir\xE3o do Le\xE3o",
    Estado: "23"
  },
  {
    ID: "3903",
    Nome: "Bossoroca",
    Estado: "23"
  },
  {
    ID: "3904",
    Nome: "Bozano",
    Estado: "23"
  },
  {
    ID: "3905",
    Nome: "Braga",
    Estado: "23"
  },
  {
    ID: "3906",
    Nome: "Brochier",
    Estado: "23"
  },
  {
    ID: "3907",
    Nome: "Buti\xE1",
    Estado: "23"
  },
  {
    ID: "3908",
    Nome: "Ca\xE7apava do Sul",
    Estado: "23"
  },
  {
    ID: "3909",
    Nome: "Cacequi",
    Estado: "23"
  },
  {
    ID: "3910",
    Nome: "Cachoeira do Sul",
    Estado: "23"
  },
  {
    ID: "3911",
    Nome: "Cachoeirinha",
    Estado: "23"
  },
  {
    ID: "3912",
    Nome: "Cacique Doble",
    Estado: "23"
  },
  {
    ID: "3913",
    Nome: "Caibat\xE9",
    Estado: "23"
  },
  {
    ID: "3914",
    Nome: "Cai\xE7ara",
    Estado: "23"
  },
  {
    ID: "3915",
    Nome: "Camaqu\xE3",
    Estado: "23"
  },
  {
    ID: "3916",
    Nome: "Camargo",
    Estado: "23"
  },
  {
    ID: "3917",
    Nome: "Cambar\xE1 do Sul",
    Estado: "23"
  },
  {
    ID: "3918",
    Nome: "Campestre da Serra",
    Estado: "23"
  },
  {
    ID: "3919",
    Nome: "Campina das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "3920",
    Nome: "Campinas do Sul",
    Estado: "23"
  },
  {
    ID: "3921",
    Nome: "Campo Bom",
    Estado: "23"
  },
  {
    ID: "3922",
    Nome: "Campo Novo",
    Estado: "23"
  },
  {
    ID: "3923",
    Nome: "Campos Borges",
    Estado: "23"
  },
  {
    ID: "3924",
    Nome: "Candel\xE1ria",
    Estado: "23"
  },
  {
    ID: "3925",
    Nome: "C\xE2ndido God\xF3i",
    Estado: "23"
  },
  {
    ID: "3926",
    Nome: "Candiota",
    Estado: "23"
  },
  {
    ID: "3927",
    Nome: "Canela",
    Estado: "23"
  },
  {
    ID: "3928",
    Nome: "Cangu\xE7u",
    Estado: "23"
  },
  {
    ID: "3929",
    Nome: "Canoas",
    Estado: "23"
  },
  {
    ID: "3930",
    Nome: "Canudos do Vale",
    Estado: "23"
  },
  {
    ID: "3931",
    Nome: "Cap\xE3o Bonito do Sul",
    Estado: "23"
  },
  {
    ID: "3932",
    Nome: "Cap\xE3o da Canoa",
    Estado: "23"
  },
  {
    ID: "3933",
    Nome: "Cap\xE3o do Cip\xF3",
    Estado: "23"
  },
  {
    ID: "3934",
    Nome: "Cap\xE3o do Le\xE3o",
    Estado: "23"
  },
  {
    ID: "3935",
    Nome: "Capela de Santana",
    Estado: "23"
  },
  {
    ID: "3936",
    Nome: "Capit\xE3o",
    Estado: "23"
  },
  {
    ID: "3937",
    Nome: "Capivari do Sul",
    Estado: "23"
  },
  {
    ID: "3938",
    Nome: "Cara\xE1",
    Estado: "23"
  },
  {
    ID: "3939",
    Nome: "Carazinho",
    Estado: "23"
  },
  {
    ID: "3940",
    Nome: "Carlos Barbosa",
    Estado: "23"
  },
  {
    ID: "3941",
    Nome: "Carlos Gomes",
    Estado: "23"
  },
  {
    ID: "3942",
    Nome: "Casca",
    Estado: "23"
  },
  {
    ID: "3943",
    Nome: "Caseiros",
    Estado: "23"
  },
  {
    ID: "3944",
    Nome: "Catu\xEDpe",
    Estado: "23"
  },
  {
    ID: "3945",
    Nome: "Caxias do Sul",
    Estado: "23"
  },
  {
    ID: "3946",
    Nome: "Centen\xE1rio",
    Estado: "23"
  },
  {
    ID: "3947",
    Nome: "Cerrito",
    Estado: "23"
  },
  {
    ID: "3948",
    Nome: "Cerro Branco",
    Estado: "23"
  },
  {
    ID: "3949",
    Nome: "Cerro Grande",
    Estado: "23"
  },
  {
    ID: "3950",
    Nome: "Cerro Grande do Sul",
    Estado: "23"
  },
  {
    ID: "3951",
    Nome: "Cerro Largo",
    Estado: "23"
  },
  {
    ID: "3952",
    Nome: "Chapada",
    Estado: "23"
  },
  {
    ID: "3953",
    Nome: "Charqueadas",
    Estado: "23"
  },
  {
    ID: "3954",
    Nome: "Charrua",
    Estado: "23"
  },
  {
    ID: "3955",
    Nome: "Chiapeta",
    Estado: "23"
  },
  {
    ID: "3956",
    Nome: "Chu\xED",
    Estado: "23"
  },
  {
    ID: "3957",
    Nome: "Chuvisca",
    Estado: "23"
  },
  {
    ID: "3958",
    Nome: "Cidreira",
    Estado: "23"
  },
  {
    ID: "3959",
    Nome: "Cir\xEDaco",
    Estado: "23"
  },
  {
    ID: "3960",
    Nome: "Colinas",
    Estado: "23"
  },
  {
    ID: "3961",
    Nome: "Colorado",
    Estado: "23"
  },
  {
    ID: "3962",
    Nome: "Condor",
    Estado: "23"
  },
  {
    ID: "3963",
    Nome: "Constantina",
    Estado: "23"
  },
  {
    ID: "3964",
    Nome: "Coqueiro Baixo",
    Estado: "23"
  },
  {
    ID: "3965",
    Nome: "Coqueiros do Sul",
    Estado: "23"
  },
  {
    ID: "3966",
    Nome: "Coronel Barros",
    Estado: "23"
  },
  {
    ID: "3967",
    Nome: "Coronel Bicaco",
    Estado: "23"
  },
  {
    ID: "3968",
    Nome: "Coronel Pilar",
    Estado: "23"
  },
  {
    ID: "3969",
    Nome: "Cotipor\xE3",
    Estado: "23"
  },
  {
    ID: "3970",
    Nome: "Coxilha",
    Estado: "23"
  },
  {
    ID: "3971",
    Nome: "Crissiumal",
    Estado: "23"
  },
  {
    ID: "3972",
    Nome: "Cristal",
    Estado: "23"
  },
  {
    ID: "3973",
    Nome: "Cristal do Sul",
    Estado: "23"
  },
  {
    ID: "3974",
    Nome: "Cruz Alta",
    Estado: "23"
  },
  {
    ID: "3975",
    Nome: "Cruzaltense",
    Estado: "23"
  },
  {
    ID: "3976",
    Nome: "Cruzeiro do Sul",
    Estado: "23"
  },
  {
    ID: "3977",
    Nome: "David Canabarro",
    Estado: "23"
  },
  {
    ID: "3978",
    Nome: "Derrubadas",
    Estado: "23"
  },
  {
    ID: "3979",
    Nome: "Dezesseis de Novembro",
    Estado: "23"
  },
  {
    ID: "3980",
    Nome: "Dilermando de Aguiar",
    Estado: "23"
  },
  {
    ID: "3981",
    Nome: "Dois Irm\xE3os",
    Estado: "23"
  },
  {
    ID: "3982",
    Nome: "Dois Irm\xE3os das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "3983",
    Nome: "Dois Lajeados",
    Estado: "23"
  },
  {
    ID: "3984",
    Nome: "Dom Feliciano",
    Estado: "23"
  },
  {
    ID: "3985",
    Nome: "Dom Pedrito",
    Estado: "23"
  },
  {
    ID: "3986",
    Nome: "Dom Pedro de Alc\xE2ntara",
    Estado: "23"
  },
  {
    ID: "3987",
    Nome: "Dona Francisca",
    Estado: "23"
  },
  {
    ID: "3988",
    Nome: "Doutor Maur\xEDcio Cardoso",
    Estado: "23"
  },
  {
    ID: "3989",
    Nome: "Doutor Ricardo",
    Estado: "23"
  },
  {
    ID: "3990",
    Nome: "Eldorado do Sul",
    Estado: "23"
  },
  {
    ID: "3991",
    Nome: "Encantado",
    Estado: "23"
  },
  {
    ID: "3992",
    Nome: "Encruzilhada do Sul",
    Estado: "23"
  },
  {
    ID: "3993",
    Nome: "Engenho Velho",
    Estado: "23"
  },
  {
    ID: "3994",
    Nome: "Entre Rios do Sul",
    Estado: "23"
  },
  {
    ID: "3995",
    Nome: "Entre-Iju\xEDs",
    Estado: "23"
  },
  {
    ID: "3996",
    Nome: "Erebango",
    Estado: "23"
  },
  {
    ID: "3997",
    Nome: "Erechim",
    Estado: "23"
  },
  {
    ID: "3998",
    Nome: "Ernestina",
    Estado: "23"
  },
  {
    ID: "3999",
    Nome: "Erval Grande",
    Estado: "23"
  },
  {
    ID: "4000",
    Nome: "Erval Seco",
    Estado: "23"
  },
  {
    ID: "4001",
    Nome: "Esmeralda",
    Estado: "23"
  },
  {
    ID: "4002",
    Nome: "Esperan\xE7a do Sul",
    Estado: "23"
  },
  {
    ID: "4003",
    Nome: "Espumoso",
    Estado: "23"
  },
  {
    ID: "4004",
    Nome: "Esta\xE7\xE3o",
    Estado: "23"
  },
  {
    ID: "4005",
    Nome: "Est\xE2ncia Velha",
    Estado: "23"
  },
  {
    ID: "4006",
    Nome: "Esteio",
    Estado: "23"
  },
  {
    ID: "4007",
    Nome: "Estrela",
    Estado: "23"
  },
  {
    ID: "4008",
    Nome: "Estrela Velha",
    Estado: "23"
  },
  {
    ID: "4009",
    Nome: "Eug\xEAnio de Castro",
    Estado: "23"
  },
  {
    ID: "4010",
    Nome: "Fagundes Varela",
    Estado: "23"
  },
  {
    ID: "4011",
    Nome: "Farroupilha",
    Estado: "23"
  },
  {
    ID: "4012",
    Nome: "Faxinal do Soturno",
    Estado: "23"
  },
  {
    ID: "4013",
    Nome: "Faxinalzinho",
    Estado: "23"
  },
  {
    ID: "4014",
    Nome: "Fazenda Vilanova",
    Estado: "23"
  },
  {
    ID: "4015",
    Nome: "Feliz",
    Estado: "23"
  },
  {
    ID: "4016",
    Nome: "Flores da Cunha",
    Estado: "23"
  },
  {
    ID: "4017",
    Nome: "Floriano Peixoto",
    Estado: "23"
  },
  {
    ID: "4018",
    Nome: "Fontoura Xavier",
    Estado: "23"
  },
  {
    ID: "4019",
    Nome: "Formigueiro",
    Estado: "23"
  },
  {
    ID: "4020",
    Nome: "Forquetinha",
    Estado: "23"
  },
  {
    ID: "4021",
    Nome: "Fortaleza dos Valos",
    Estado: "23"
  },
  {
    ID: "4022",
    Nome: "Frederico Westphalen",
    Estado: "23"
  },
  {
    ID: "4023",
    Nome: "Garibaldi",
    Estado: "23"
  },
  {
    ID: "4024",
    Nome: "Garruchos",
    Estado: "23"
  },
  {
    ID: "4025",
    Nome: "Gaurama",
    Estado: "23"
  },
  {
    ID: "4026",
    Nome: "General C\xE2mara",
    Estado: "23"
  },
  {
    ID: "4027",
    Nome: "Gentil",
    Estado: "23"
  },
  {
    ID: "4028",
    Nome: "Get\xFAlio Vargas",
    Estado: "23"
  },
  {
    ID: "4029",
    Nome: "Giru\xE1",
    Estado: "23"
  },
  {
    ID: "4030",
    Nome: "Glorinha",
    Estado: "23"
  },
  {
    ID: "4031",
    Nome: "Gramado",
    Estado: "23"
  },
  {
    ID: "4032",
    Nome: "Gramado dos Loureiros",
    Estado: "23"
  },
  {
    ID: "4033",
    Nome: "Gramado Xavier",
    Estado: "23"
  },
  {
    ID: "4034",
    Nome: "Gravata\xED",
    Estado: "23"
  },
  {
    ID: "4035",
    Nome: "Guabiju",
    Estado: "23"
  },
  {
    ID: "4036",
    Nome: "Gua\xEDba",
    Estado: "23"
  },
  {
    ID: "4037",
    Nome: "Guapor\xE9",
    Estado: "23"
  },
  {
    ID: "4038",
    Nome: "Guarani das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "4039",
    Nome: "Harmonia",
    Estado: "23"
  },
  {
    ID: "4040",
    Nome: "Herval",
    Estado: "23"
  },
  {
    ID: "4041",
    Nome: "Herveiras",
    Estado: "23"
  },
  {
    ID: "4042",
    Nome: "Horizontina",
    Estado: "23"
  },
  {
    ID: "4043",
    Nome: "Hulha Negra",
    Estado: "23"
  },
  {
    ID: "4044",
    Nome: "Humait\xE1",
    Estado: "23"
  },
  {
    ID: "4045",
    Nome: "Ibarama",
    Estado: "23"
  },
  {
    ID: "4046",
    Nome: "Ibia\xE7\xE1",
    Estado: "23"
  },
  {
    ID: "4047",
    Nome: "Ibiraiaras",
    Estado: "23"
  },
  {
    ID: "4048",
    Nome: "Ibirapuit\xE3",
    Estado: "23"
  },
  {
    ID: "4049",
    Nome: "Ibirub\xE1",
    Estado: "23"
  },
  {
    ID: "4050",
    Nome: "Igrejinha",
    Estado: "23"
  },
  {
    ID: "4051",
    Nome: "Iju\xED",
    Estado: "23"
  },
  {
    ID: "4052",
    Nome: "Il\xF3polis",
    Estado: "23"
  },
  {
    ID: "4053",
    Nome: "Imb\xE9",
    Estado: "23"
  },
  {
    ID: "4054",
    Nome: "Imigrante",
    Estado: "23"
  },
  {
    ID: "4055",
    Nome: "Independ\xEAncia",
    Estado: "23"
  },
  {
    ID: "4056",
    Nome: "Inhacor\xE1",
    Estado: "23"
  },
  {
    ID: "4057",
    Nome: "Ip\xEA",
    Estado: "23"
  },
  {
    ID: "4058",
    Nome: "Ipiranga do Sul",
    Estado: "23"
  },
  {
    ID: "4059",
    Nome: "Ira\xED",
    Estado: "23"
  },
  {
    ID: "4060",
    Nome: "Itaara",
    Estado: "23"
  },
  {
    ID: "4061",
    Nome: "Itacurubi",
    Estado: "23"
  },
  {
    ID: "4062",
    Nome: "Itapuca",
    Estado: "23"
  },
  {
    ID: "4063",
    Nome: "Itaqui",
    Estado: "23"
  },
  {
    ID: "4064",
    Nome: "Itati",
    Estado: "23"
  },
  {
    ID: "4065",
    Nome: "Itatiba do Sul",
    Estado: "23"
  },
  {
    ID: "4066",
    Nome: "Ivor\xE1",
    Estado: "23"
  },
  {
    ID: "4067",
    Nome: "Ivoti",
    Estado: "23"
  },
  {
    ID: "4068",
    Nome: "Jaboticaba",
    Estado: "23"
  },
  {
    ID: "4069",
    Nome: "Jacuizinho",
    Estado: "23"
  },
  {
    ID: "4070",
    Nome: "Jacutinga",
    Estado: "23"
  },
  {
    ID: "4071",
    Nome: "Jaguar\xE3o",
    Estado: "23"
  },
  {
    ID: "4072",
    Nome: "Jaguari",
    Estado: "23"
  },
  {
    ID: "4073",
    Nome: "Jaquirana",
    Estado: "23"
  },
  {
    ID: "4074",
    Nome: "Jari",
    Estado: "23"
  },
  {
    ID: "4075",
    Nome: "J\xF3ia",
    Estado: "23"
  },
  {
    ID: "4076",
    Nome: "J\xFAlio de Castilhos",
    Estado: "23"
  },
  {
    ID: "4077",
    Nome: "Lagoa Bonita do Sul",
    Estado: "23"
  },
  {
    ID: "4078",
    Nome: "Lagoa dos Tr\xEAs Cantos",
    Estado: "23"
  },
  {
    ID: "4079",
    Nome: "Lagoa Vermelha",
    Estado: "23"
  },
  {
    ID: "4080",
    Nome: "Lago\xE3o",
    Estado: "23"
  },
  {
    ID: "4081",
    Nome: "Lajeado",
    Estado: "23"
  },
  {
    ID: "4082",
    Nome: "Lajeado do Bugre",
    Estado: "23"
  },
  {
    ID: "4083",
    Nome: "Lavras do Sul",
    Estado: "23"
  },
  {
    ID: "4084",
    Nome: "Liberato Salzano",
    Estado: "23"
  },
  {
    ID: "4085",
    Nome: "Lindolfo Collor",
    Estado: "23"
  },
  {
    ID: "4086",
    Nome: "Linha Nova",
    Estado: "23"
  },
  {
    ID: "4087",
    Nome: "Ma\xE7ambara",
    Estado: "23"
  },
  {
    ID: "4088",
    Nome: "Machadinho",
    Estado: "23"
  },
  {
    ID: "4089",
    Nome: "Mampituba",
    Estado: "23"
  },
  {
    ID: "4090",
    Nome: "Manoel Viana",
    Estado: "23"
  },
  {
    ID: "4091",
    Nome: "Maquin\xE9",
    Estado: "23"
  },
  {
    ID: "4092",
    Nome: "Marat\xE1",
    Estado: "23"
  },
  {
    ID: "4093",
    Nome: "Marau",
    Estado: "23"
  },
  {
    ID: "4094",
    Nome: "Marcelino Ramos",
    Estado: "23"
  },
  {
    ID: "4095",
    Nome: "Mariana Pimentel",
    Estado: "23"
  },
  {
    ID: "4096",
    Nome: "Mariano Moro",
    Estado: "23"
  },
  {
    ID: "4097",
    Nome: "Marques de Souza",
    Estado: "23"
  },
  {
    ID: "4098",
    Nome: "Mata",
    Estado: "23"
  },
  {
    ID: "4099",
    Nome: "Mato Castelhano",
    Estado: "23"
  },
  {
    ID: "4100",
    Nome: "Mato Leit\xE3o",
    Estado: "23"
  },
  {
    ID: "4101",
    Nome: "Mato Queimado",
    Estado: "23"
  },
  {
    ID: "4102",
    Nome: "Maximiliano de Almeida",
    Estado: "23"
  },
  {
    ID: "4103",
    Nome: "Minas do Le\xE3o",
    Estado: "23"
  },
  {
    ID: "4104",
    Nome: "Miragua\xED",
    Estado: "23"
  },
  {
    ID: "4105",
    Nome: "Montauri",
    Estado: "23"
  },
  {
    ID: "4106",
    Nome: "Monte Alegre dos Campos",
    Estado: "23"
  },
  {
    ID: "4107",
    Nome: "Monte Belo do Sul",
    Estado: "23"
  },
  {
    ID: "4108",
    Nome: "Montenegro",
    Estado: "23"
  },
  {
    ID: "4109",
    Nome: "Morma\xE7o",
    Estado: "23"
  },
  {
    ID: "4110",
    Nome: "Morrinhos do Sul",
    Estado: "23"
  },
  {
    ID: "4111",
    Nome: "Morro Redondo",
    Estado: "23"
  },
  {
    ID: "4112",
    Nome: "Morro Reuter",
    Estado: "23"
  },
  {
    ID: "4113",
    Nome: "Mostardas",
    Estado: "23"
  },
  {
    ID: "4114",
    Nome: "Mu\xE7um",
    Estado: "23"
  },
  {
    ID: "4115",
    Nome: "Muitos Cap\xF5es",
    Estado: "23"
  },
  {
    ID: "4116",
    Nome: "Muliterno",
    Estado: "23"
  },
  {
    ID: "4117",
    Nome: "N\xE3o-Me-Toque",
    Estado: "23"
  },
  {
    ID: "4118",
    Nome: "Nicolau Vergueiro",
    Estado: "23"
  },
  {
    ID: "4119",
    Nome: "Nonoai",
    Estado: "23"
  },
  {
    ID: "4120",
    Nome: "Nova Alvorada",
    Estado: "23"
  },
  {
    ID: "4121",
    Nome: "Nova Ara\xE7\xE1",
    Estado: "23"
  },
  {
    ID: "4122",
    Nome: "Nova Bassano",
    Estado: "23"
  },
  {
    ID: "4123",
    Nome: "Nova Boa Vista",
    Estado: "23"
  },
  {
    ID: "4124",
    Nome: "Nova Br\xE9scia",
    Estado: "23"
  },
  {
    ID: "4125",
    Nome: "Nova Candel\xE1ria",
    Estado: "23"
  },
  {
    ID: "4126",
    Nome: "Nova Esperan\xE7a do Sul",
    Estado: "23"
  },
  {
    ID: "4127",
    Nome: "Nova Hartz",
    Estado: "23"
  },
  {
    ID: "4128",
    Nome: "Nova P\xE1dua",
    Estado: "23"
  },
  {
    ID: "4129",
    Nome: "Nova Palma",
    Estado: "23"
  },
  {
    ID: "4130",
    Nome: "Nova Petr\xF3polis",
    Estado: "23"
  },
  {
    ID: "4131",
    Nome: "Nova Prata",
    Estado: "23"
  },
  {
    ID: "4132",
    Nome: "Nova Ramada",
    Estado: "23"
  },
  {
    ID: "4133",
    Nome: "Nova Roma do Sul",
    Estado: "23"
  },
  {
    ID: "4134",
    Nome: "Nova Santa Rita",
    Estado: "23"
  },
  {
    ID: "4135",
    Nome: "Novo Barreiro",
    Estado: "23"
  },
  {
    ID: "4136",
    Nome: "Novo Cabrais",
    Estado: "23"
  },
  {
    ID: "4137",
    Nome: "Novo Hamburgo",
    Estado: "23"
  },
  {
    ID: "4138",
    Nome: "Novo Machado",
    Estado: "23"
  },
  {
    ID: "4139",
    Nome: "Novo Tiradentes",
    Estado: "23"
  },
  {
    ID: "4140",
    Nome: "Novo Xingu",
    Estado: "23"
  },
  {
    ID: "4141",
    Nome: "Os\xF3rio",
    Estado: "23"
  },
  {
    ID: "4142",
    Nome: "Paim Filho",
    Estado: "23"
  },
  {
    ID: "4143",
    Nome: "Palmares do Sul",
    Estado: "23"
  },
  {
    ID: "4144",
    Nome: "Palmeira das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "4145",
    Nome: "Palmitinho",
    Estado: "23"
  },
  {
    ID: "4146",
    Nome: "Panambi",
    Estado: "23"
  },
  {
    ID: "4147",
    Nome: "Pantano Grande",
    Estado: "23"
  },
  {
    ID: "4148",
    Nome: "Para\xED",
    Estado: "23"
  },
  {
    ID: "4149",
    Nome: "Para\xEDso do Sul",
    Estado: "23"
  },
  {
    ID: "4150",
    Nome: "Pareci Novo",
    Estado: "23"
  },
  {
    ID: "4151",
    Nome: "Parob\xE9",
    Estado: "23"
  },
  {
    ID: "4152",
    Nome: "Passa Sete",
    Estado: "23"
  },
  {
    ID: "4153",
    Nome: "Passo do Sobrado",
    Estado: "23"
  },
  {
    ID: "4154",
    Nome: "Passo Fundo",
    Estado: "23"
  },
  {
    ID: "4155",
    Nome: "Paulo Bento",
    Estado: "23"
  },
  {
    ID: "4156",
    Nome: "Paverama",
    Estado: "23"
  },
  {
    ID: "4157",
    Nome: "Pedras Altas",
    Estado: "23"
  },
  {
    ID: "4158",
    Nome: "Pedro Os\xF3rio",
    Estado: "23"
  },
  {
    ID: "4159",
    Nome: "Peju\xE7ara",
    Estado: "23"
  },
  {
    ID: "4160",
    Nome: "Pelotas",
    Estado: "23"
  },
  {
    ID: "4161",
    Nome: "Picada Caf\xE9",
    Estado: "23"
  },
  {
    ID: "4162",
    Nome: "Pinhal",
    Estado: "23"
  },
  {
    ID: "4163",
    Nome: "Pinhal da Serra",
    Estado: "23"
  },
  {
    ID: "4164",
    Nome: "Pinhal Grande",
    Estado: "23"
  },
  {
    ID: "4165",
    Nome: "Pinheirinho do Vale",
    Estado: "23"
  },
  {
    ID: "4166",
    Nome: "Pinheiro Machado",
    Estado: "23"
  },
  {
    ID: "4167",
    Nome: "Pirap\xF3",
    Estado: "23"
  },
  {
    ID: "4168",
    Nome: "Piratini",
    Estado: "23"
  },
  {
    ID: "4169",
    Nome: "Planalto",
    Estado: "23"
  },
  {
    ID: "4170",
    Nome: "Po\xE7o das Antas",
    Estado: "23"
  },
  {
    ID: "4171",
    Nome: "Pont\xE3o",
    Estado: "23"
  },
  {
    ID: "4172",
    Nome: "Ponte Preta",
    Estado: "23"
  },
  {
    ID: "4173",
    Nome: "Port\xE3o",
    Estado: "23"
  },
  {
    ID: "4174",
    Nome: "Porto Alegre",
    Estado: "23"
  },
  {
    ID: "4175",
    Nome: "Porto Lucena",
    Estado: "23"
  },
  {
    ID: "4176",
    Nome: "Porto Mau\xE1",
    Estado: "23"
  },
  {
    ID: "4177",
    Nome: "Porto Vera Cruz",
    Estado: "23"
  },
  {
    ID: "4178",
    Nome: "Porto Xavier",
    Estado: "23"
  },
  {
    ID: "4179",
    Nome: "Pouso Novo",
    Estado: "23"
  },
  {
    ID: "4180",
    Nome: "Presidente Lucena",
    Estado: "23"
  },
  {
    ID: "4181",
    Nome: "Progresso",
    Estado: "23"
  },
  {
    ID: "4182",
    Nome: "Prot\xE1sio Alves",
    Estado: "23"
  },
  {
    ID: "4183",
    Nome: "Putinga",
    Estado: "23"
  },
  {
    ID: "4184",
    Nome: "Quara\xED",
    Estado: "23"
  },
  {
    ID: "4185",
    Nome: "Quatro Irm\xE3os",
    Estado: "23"
  },
  {
    ID: "4186",
    Nome: "Quevedos",
    Estado: "23"
  },
  {
    ID: "4187",
    Nome: "Quinze de Novembro",
    Estado: "23"
  },
  {
    ID: "4188",
    Nome: "Redentora",
    Estado: "23"
  },
  {
    ID: "4189",
    Nome: "Relvado",
    Estado: "23"
  },
  {
    ID: "4190",
    Nome: "Restinga Seca",
    Estado: "23"
  },
  {
    ID: "4191",
    Nome: "Rio dos \xCDndios",
    Estado: "23"
  },
  {
    ID: "4192",
    Nome: "Rio Grande",
    Estado: "23"
  },
  {
    ID: "4193",
    Nome: "Rio Pardo",
    Estado: "23"
  },
  {
    ID: "4194",
    Nome: "Riozinho",
    Estado: "23"
  },
  {
    ID: "4195",
    Nome: "Roca Sales",
    Estado: "23"
  },
  {
    ID: "4196",
    Nome: "Rodeio Bonito",
    Estado: "23"
  },
  {
    ID: "4197",
    Nome: "Rolador",
    Estado: "23"
  },
  {
    ID: "4198",
    Nome: "Rolante",
    Estado: "23"
  },
  {
    ID: "4199",
    Nome: "Ronda Alta",
    Estado: "23"
  },
  {
    ID: "4200",
    Nome: "Rondinha",
    Estado: "23"
  },
  {
    ID: "4201",
    Nome: "Roque Gonzales",
    Estado: "23"
  },
  {
    ID: "4202",
    Nome: "Ros\xE1rio do Sul",
    Estado: "23"
  },
  {
    ID: "4203",
    Nome: "Sagrada Fam\xEDlia",
    Estado: "23"
  },
  {
    ID: "4204",
    Nome: "Saldanha Marinho",
    Estado: "23"
  },
  {
    ID: "4205",
    Nome: "Salto do Jacu\xED",
    Estado: "23"
  },
  {
    ID: "4206",
    Nome: "Salvador das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "4207",
    Nome: "Salvador do Sul",
    Estado: "23"
  },
  {
    ID: "4208",
    Nome: "Sananduva",
    Estado: "23"
  },
  {
    ID: "4209",
    Nome: "Santa B\xE1rbara do Sul",
    Estado: "23"
  },
  {
    ID: "4210",
    Nome: "Santa Cec\xEDlia do Sul",
    Estado: "23"
  },
  {
    ID: "4211",
    Nome: "Santa Clara do Sul",
    Estado: "23"
  },
  {
    ID: "4212",
    Nome: "Santa Cruz do Sul",
    Estado: "23"
  },
  {
    ID: "4213",
    Nome: "Santa Margarida do Sul",
    Estado: "23"
  },
  {
    ID: "4214",
    Nome: "Santa Maria",
    Estado: "23"
  },
  {
    ID: "4215",
    Nome: "Santa Maria do Herval",
    Estado: "23"
  },
  {
    ID: "4216",
    Nome: "Santa Rosa",
    Estado: "23"
  },
  {
    ID: "4217",
    Nome: "Santa Tereza",
    Estado: "23"
  },
  {
    ID: "4218",
    Nome: "Santa Vit\xF3ria do Palmar",
    Estado: "23"
  },
  {
    ID: "4219",
    Nome: "Santana da Boa Vista",
    Estado: "23"
  },
  {
    ID: "4220",
    Nome: "Santana do Livramento",
    Estado: "23"
  },
  {
    ID: "4221",
    Nome: "Santiago",
    Estado: "23"
  },
  {
    ID: "4222",
    Nome: "Santo \xC2ngelo",
    Estado: "23"
  },
  {
    ID: "4223",
    Nome: "Santo Ant\xF4nio da Patrulha",
    Estado: "23"
  },
  {
    ID: "4224",
    Nome: "Santo Ant\xF4nio das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "4225",
    Nome: "Santo Ant\xF4nio do Palma",
    Estado: "23"
  },
  {
    ID: "4226",
    Nome: "Santo Ant\xF4nio do Planalto",
    Estado: "23"
  },
  {
    ID: "4227",
    Nome: "Santo Augusto",
    Estado: "23"
  },
  {
    ID: "4228",
    Nome: "Santo Cristo",
    Estado: "23"
  },
  {
    ID: "4229",
    Nome: "Santo Expedito do Sul",
    Estado: "23"
  },
  {
    ID: "4230",
    Nome: "S\xE3o Borja",
    Estado: "23"
  },
  {
    ID: "4231",
    Nome: "S\xE3o Domingos do Sul",
    Estado: "23"
  },
  {
    ID: "4232",
    Nome: "S\xE3o Francisco de Assis",
    Estado: "23"
  },
  {
    ID: "4233",
    Nome: "S\xE3o Francisco de Paula",
    Estado: "23"
  },
  {
    ID: "4234",
    Nome: "S\xE3o Gabriel",
    Estado: "23"
  },
  {
    ID: "4235",
    Nome: "S\xE3o Jer\xF4nimo",
    Estado: "23"
  },
  {
    ID: "4236",
    Nome: "S\xE3o Jo\xE3o da Urtiga",
    Estado: "23"
  },
  {
    ID: "4237",
    Nome: "S\xE3o Jo\xE3o do Pol\xEAsine",
    Estado: "23"
  },
  {
    ID: "4238",
    Nome: "S\xE3o Jorge",
    Estado: "23"
  },
  {
    ID: "4239",
    Nome: "S\xE3o Jos\xE9 das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "4240",
    Nome: "S\xE3o Jos\xE9 do Herval",
    Estado: "23"
  },
  {
    ID: "4241",
    Nome: "S\xE3o Jos\xE9 do Hort\xEAncio",
    Estado: "23"
  },
  {
    ID: "4242",
    Nome: "S\xE3o Jos\xE9 do Inhacor\xE1",
    Estado: "23"
  },
  {
    ID: "4243",
    Nome: "S\xE3o Jos\xE9 do Norte",
    Estado: "23"
  },
  {
    ID: "4244",
    Nome: "S\xE3o Jos\xE9 do Ouro",
    Estado: "23"
  },
  {
    ID: "4245",
    Nome: "S\xE3o Jos\xE9 do Sul",
    Estado: "23"
  },
  {
    ID: "4246",
    Nome: "S\xE3o Jos\xE9 dos Ausentes",
    Estado: "23"
  },
  {
    ID: "4247",
    Nome: "S\xE3o Leopoldo",
    Estado: "23"
  },
  {
    ID: "4248",
    Nome: "S\xE3o Louren\xE7o do Sul",
    Estado: "23"
  },
  {
    ID: "4249",
    Nome: "S\xE3o Luiz Gonzaga",
    Estado: "23"
  },
  {
    ID: "4250",
    Nome: "S\xE3o Marcos",
    Estado: "23"
  },
  {
    ID: "4251",
    Nome: "S\xE3o Martinho",
    Estado: "23"
  },
  {
    ID: "4252",
    Nome: "S\xE3o Martinho da Serra",
    Estado: "23"
  },
  {
    ID: "4253",
    Nome: "S\xE3o Miguel das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "4254",
    Nome: "S\xE3o Nicolau",
    Estado: "23"
  },
  {
    ID: "4255",
    Nome: "S\xE3o Paulo das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "4256",
    Nome: "S\xE3o Pedro da Serra",
    Estado: "23"
  },
  {
    ID: "4257",
    Nome: "S\xE3o Pedro das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "4258",
    Nome: "S\xE3o Pedro do Buti\xE1",
    Estado: "23"
  },
  {
    ID: "4259",
    Nome: "S\xE3o Pedro do Sul",
    Estado: "23"
  },
  {
    ID: "4260",
    Nome: "S\xE3o Sebasti\xE3o do Ca\xED",
    Estado: "23"
  },
  {
    ID: "4261",
    Nome: "S\xE3o Sep\xE9",
    Estado: "23"
  },
  {
    ID: "4262",
    Nome: "S\xE3o Valentim",
    Estado: "23"
  },
  {
    ID: "4263",
    Nome: "S\xE3o Valentim do Sul",
    Estado: "23"
  },
  {
    ID: "4264",
    Nome: "S\xE3o Val\xE9rio do Sul",
    Estado: "23"
  },
  {
    ID: "4265",
    Nome: "S\xE3o Vendelino",
    Estado: "23"
  },
  {
    ID: "4266",
    Nome: "S\xE3o Vicente do Sul",
    Estado: "23"
  },
  {
    ID: "4267",
    Nome: "Sapiranga",
    Estado: "23"
  },
  {
    ID: "4268",
    Nome: "Sapucaia do Sul",
    Estado: "23"
  },
  {
    ID: "4269",
    Nome: "Sarandi",
    Estado: "23"
  },
  {
    ID: "4270",
    Nome: "Seberi",
    Estado: "23"
  },
  {
    ID: "4271",
    Nome: "Sede Nova",
    Estado: "23"
  },
  {
    ID: "4272",
    Nome: "Segredo",
    Estado: "23"
  },
  {
    ID: "4273",
    Nome: "Selbach",
    Estado: "23"
  },
  {
    ID: "4274",
    Nome: "Senador Salgado Filho",
    Estado: "23"
  },
  {
    ID: "4275",
    Nome: "Sentinela do Sul",
    Estado: "23"
  },
  {
    ID: "4276",
    Nome: "Serafina Corr\xEAa",
    Estado: "23"
  },
  {
    ID: "4277",
    Nome: "S\xE9rio",
    Estado: "23"
  },
  {
    ID: "4278",
    Nome: "Sert\xE3o",
    Estado: "23"
  },
  {
    ID: "4279",
    Nome: "Sert\xE3o Santana",
    Estado: "23"
  },
  {
    ID: "4280",
    Nome: "Sete de Setembro",
    Estado: "23"
  },
  {
    ID: "4281",
    Nome: "Severiano de Almeida",
    Estado: "23"
  },
  {
    ID: "4282",
    Nome: "Silveira Martins",
    Estado: "23"
  },
  {
    ID: "4283",
    Nome: "Sinimbu",
    Estado: "23"
  },
  {
    ID: "4284",
    Nome: "Sobradinho",
    Estado: "23"
  },
  {
    ID: "4285",
    Nome: "Soledade",
    Estado: "23"
  },
  {
    ID: "4286",
    Nome: "Taba\xED",
    Estado: "23"
  },
  {
    ID: "4287",
    Nome: "Tapejara",
    Estado: "23"
  },
  {
    ID: "4288",
    Nome: "Tapera",
    Estado: "23"
  },
  {
    ID: "4289",
    Nome: "Tapes",
    Estado: "23"
  },
  {
    ID: "4290",
    Nome: "Taquara",
    Estado: "23"
  },
  {
    ID: "4291",
    Nome: "Taquari",
    Estado: "23"
  },
  {
    ID: "4292",
    Nome: "Taquaru\xE7u do Sul",
    Estado: "23"
  },
  {
    ID: "4293",
    Nome: "Tavares",
    Estado: "23"
  },
  {
    ID: "4294",
    Nome: "Tenente Portela",
    Estado: "23"
  },
  {
    ID: "4295",
    Nome: "Terra de Areia",
    Estado: "23"
  },
  {
    ID: "4296",
    Nome: "Teut\xF4nia",
    Estado: "23"
  },
  {
    ID: "4297",
    Nome: "Tio Hugo",
    Estado: "23"
  },
  {
    ID: "4298",
    Nome: "Tiradentes do Sul",
    Estado: "23"
  },
  {
    ID: "4299",
    Nome: "Toropi",
    Estado: "23"
  },
  {
    ID: "4300",
    Nome: "Torres",
    Estado: "23"
  },
  {
    ID: "4301",
    Nome: "Tramanda\xED",
    Estado: "23"
  },
  {
    ID: "4302",
    Nome: "Travesseiro",
    Estado: "23"
  },
  {
    ID: "4303",
    Nome: "Tr\xEAs Arroios",
    Estado: "23"
  },
  {
    ID: "4304",
    Nome: "Tr\xEAs Cachoeiras",
    Estado: "23"
  },
  {
    ID: "4305",
    Nome: "Tr\xEAs Coroas",
    Estado: "23"
  },
  {
    ID: "4306",
    Nome: "Tr\xEAs de Maio",
    Estado: "23"
  },
  {
    ID: "4307",
    Nome: "Tr\xEAs Forquilhas",
    Estado: "23"
  },
  {
    ID: "4308",
    Nome: "Tr\xEAs Palmeiras",
    Estado: "23"
  },
  {
    ID: "4309",
    Nome: "Tr\xEAs Passos",
    Estado: "23"
  },
  {
    ID: "4310",
    Nome: "Trindade do Sul",
    Estado: "23"
  },
  {
    ID: "4311",
    Nome: "Triunfo",
    Estado: "23"
  },
  {
    ID: "4312",
    Nome: "Tucunduva",
    Estado: "23"
  },
  {
    ID: "4313",
    Nome: "Tunas",
    Estado: "23"
  },
  {
    ID: "4314",
    Nome: "Tupanci do Sul",
    Estado: "23"
  },
  {
    ID: "4315",
    Nome: "Tupanciret\xE3",
    Estado: "23"
  },
  {
    ID: "4316",
    Nome: "Tupandi",
    Estado: "23"
  },
  {
    ID: "4317",
    Nome: "Tuparendi",
    Estado: "23"
  },
  {
    ID: "4318",
    Nome: "Turu\xE7u",
    Estado: "23"
  },
  {
    ID: "4319",
    Nome: "Ubiretama",
    Estado: "23"
  },
  {
    ID: "4320",
    Nome: "Uni\xE3o da Serra",
    Estado: "23"
  },
  {
    ID: "4321",
    Nome: "Unistalda",
    Estado: "23"
  },
  {
    ID: "4322",
    Nome: "Uruguaiana",
    Estado: "23"
  },
  {
    ID: "4323",
    Nome: "Vacaria",
    Estado: "23"
  },
  {
    ID: "4324",
    Nome: "Vale do Sol",
    Estado: "23"
  },
  {
    ID: "4325",
    Nome: "Vale Real",
    Estado: "23"
  },
  {
    ID: "4326",
    Nome: "Vale Verde",
    Estado: "23"
  },
  {
    ID: "4327",
    Nome: "Vanini",
    Estado: "23"
  },
  {
    ID: "4328",
    Nome: "Ven\xE2ncio Aires",
    Estado: "23"
  },
  {
    ID: "4329",
    Nome: "Vera Cruz",
    Estado: "23"
  },
  {
    ID: "4330",
    Nome: "Veran\xF3polis",
    Estado: "23"
  },
  {
    ID: "4331",
    Nome: "Vespasiano Correa",
    Estado: "23"
  },
  {
    ID: "4332",
    Nome: "Viadutos",
    Estado: "23"
  },
  {
    ID: "4333",
    Nome: "Viam\xE3o",
    Estado: "23"
  },
  {
    ID: "4334",
    Nome: "Vicente Dutra",
    Estado: "23"
  },
  {
    ID: "4335",
    Nome: "Victor Graeff",
    Estado: "23"
  },
  {
    ID: "4336",
    Nome: "Vila Flores",
    Estado: "23"
  },
  {
    ID: "4337",
    Nome: "Vila L\xE2ngaro",
    Estado: "23"
  },
  {
    ID: "4338",
    Nome: "Vila Maria",
    Estado: "23"
  },
  {
    ID: "4339",
    Nome: "Vila Nova do Sul",
    Estado: "23"
  },
  {
    ID: "4340",
    Nome: "Vista Alegre",
    Estado: "23"
  },
  {
    ID: "4341",
    Nome: "Vista Alegre do Prata",
    Estado: "23"
  },
  {
    ID: "4342",
    Nome: "Vista Ga\xFAcha",
    Estado: "23"
  },
  {
    ID: "4343",
    Nome: "Vit\xF3ria das Miss\xF5es",
    Estado: "23"
  },
  {
    ID: "4344",
    Nome: "Westf\xE1lia",
    Estado: "23"
  },
  {
    ID: "4345",
    Nome: "Xangri-l\xE1",
    Estado: "23"
  },
  {
    ID: "4346",
    Nome: "Alta Floresta d`Oeste",
    Estado: "21"
  },
  {
    ID: "4347",
    Nome: "Alto Alegre dos Parecis",
    Estado: "21"
  },
  {
    ID: "4348",
    Nome: "Alto Para\xEDso",
    Estado: "21"
  },
  {
    ID: "4349",
    Nome: "Alvorada d`Oeste",
    Estado: "21"
  },
  {
    ID: "4350",
    Nome: "Ariquemes",
    Estado: "21"
  },
  {
    ID: "4351",
    Nome: "Buritis",
    Estado: "21"
  },
  {
    ID: "4352",
    Nome: "Cabixi",
    Estado: "21"
  },
  {
    ID: "4353",
    Nome: "Cacaul\xE2ndia",
    Estado: "21"
  },
  {
    ID: "4354",
    Nome: "Cacoal",
    Estado: "21"
  },
  {
    ID: "4355",
    Nome: "Campo Novo de Rond\xF4nia",
    Estado: "21"
  },
  {
    ID: "4356",
    Nome: "Candeias do Jamari",
    Estado: "21"
  },
  {
    ID: "4357",
    Nome: "Castanheiras",
    Estado: "21"
  },
  {
    ID: "4358",
    Nome: "Cerejeiras",
    Estado: "21"
  },
  {
    ID: "4359",
    Nome: "Chupinguaia",
    Estado: "21"
  },
  {
    ID: "4360",
    Nome: "Colorado do Oeste",
    Estado: "21"
  },
  {
    ID: "4361",
    Nome: "Corumbiara",
    Estado: "21"
  },
  {
    ID: "4362",
    Nome: "Costa Marques",
    Estado: "21"
  },
  {
    ID: "4363",
    Nome: "Cujubim",
    Estado: "21"
  },
  {
    ID: "4364",
    Nome: "Espig\xE3o d`Oeste",
    Estado: "21"
  },
  {
    ID: "4365",
    Nome: "Governador Jorge Teixeira",
    Estado: "21"
  },
  {
    ID: "4366",
    Nome: "Guajar\xE1-Mirim",
    Estado: "21"
  },
  {
    ID: "4367",
    Nome: "Itapu\xE3 do Oeste",
    Estado: "21"
  },
  {
    ID: "4368",
    Nome: "Jaru",
    Estado: "21"
  },
  {
    ID: "4369",
    Nome: "Ji-Paran\xE1",
    Estado: "21"
  },
  {
    ID: "4370",
    Nome: "Machadinho d`Oeste",
    Estado: "21"
  },
  {
    ID: "4371",
    Nome: "Ministro Andreazza",
    Estado: "21"
  },
  {
    ID: "4372",
    Nome: "Mirante da Serra",
    Estado: "21"
  },
  {
    ID: "4373",
    Nome: "Monte Negro",
    Estado: "21"
  },
  {
    ID: "4374",
    Nome: "Nova Brasil\xE2ndia d`Oeste",
    Estado: "21"
  },
  {
    ID: "4375",
    Nome: "Nova Mamor\xE9",
    Estado: "21"
  },
  {
    ID: "4376",
    Nome: "Nova Uni\xE3o",
    Estado: "21"
  },
  {
    ID: "4377",
    Nome: "Novo Horizonte do Oeste",
    Estado: "21"
  },
  {
    ID: "4378",
    Nome: "Ouro Preto do Oeste",
    Estado: "21"
  },
  {
    ID: "4379",
    Nome: "Parecis",
    Estado: "21"
  },
  {
    ID: "4380",
    Nome: "Pimenta Bueno",
    Estado: "21"
  },
  {
    ID: "4381",
    Nome: "Pimenteiras do Oeste",
    Estado: "21"
  },
  {
    ID: "4382",
    Nome: "Porto Velho",
    Estado: "21"
  },
  {
    ID: "4383",
    Nome: "Presidente M\xE9dici",
    Estado: "21"
  },
  {
    ID: "4384",
    Nome: "Primavera de Rond\xF4nia",
    Estado: "21"
  },
  {
    ID: "4385",
    Nome: "Rio Crespo",
    Estado: "21"
  },
  {
    ID: "4386",
    Nome: "Rolim de Moura",
    Estado: "21"
  },
  {
    ID: "4387",
    Nome: "Santa Luzia d`Oeste",
    Estado: "21"
  },
  {
    ID: "4388",
    Nome: "S\xE3o Felipe d`Oeste",
    Estado: "21"
  },
  {
    ID: "4389",
    Nome: "S\xE3o Francisco do Guapor\xE9",
    Estado: "21"
  },
  {
    ID: "4390",
    Nome: "S\xE3o Miguel do Guapor\xE9",
    Estado: "21"
  },
  {
    ID: "4391",
    Nome: "Seringueiras",
    Estado: "21"
  },
  {
    ID: "4392",
    Nome: "Teixeir\xF3polis",
    Estado: "21"
  },
  {
    ID: "4393",
    Nome: "Theobroma",
    Estado: "21"
  },
  {
    ID: "4394",
    Nome: "Urup\xE1",
    Estado: "21"
  },
  {
    ID: "4395",
    Nome: "Vale do Anari",
    Estado: "21"
  },
  {
    ID: "4396",
    Nome: "Vale do Para\xEDso",
    Estado: "21"
  },
  {
    ID: "4397",
    Nome: "Vilhena",
    Estado: "21"
  },
  {
    ID: "4398",
    Nome: "Alto Alegre",
    Estado: "22"
  },
  {
    ID: "4399",
    Nome: "Amajari",
    Estado: "22"
  },
  {
    ID: "4400",
    Nome: "Boa Vista",
    Estado: "22"
  },
  {
    ID: "4401",
    Nome: "Bonfim",
    Estado: "22"
  },
  {
    ID: "4402",
    Nome: "Cant\xE1",
    Estado: "22"
  },
  {
    ID: "4403",
    Nome: "Caracara\xED",
    Estado: "22"
  },
  {
    ID: "4404",
    Nome: "Caroebe",
    Estado: "22"
  },
  {
    ID: "4405",
    Nome: "Iracema",
    Estado: "22"
  },
  {
    ID: "4406",
    Nome: "Mucaja\xED",
    Estado: "22"
  },
  {
    ID: "4407",
    Nome: "Normandia",
    Estado: "22"
  },
  {
    ID: "4408",
    Nome: "Pacaraima",
    Estado: "22"
  },
  {
    ID: "4409",
    Nome: "Rorain\xF3polis",
    Estado: "22"
  },
  {
    ID: "4410",
    Nome: "S\xE3o Jo\xE3o da Baliza",
    Estado: "22"
  },
  {
    ID: "4411",
    Nome: "S\xE3o Luiz",
    Estado: "22"
  },
  {
    ID: "4412",
    Nome: "Uiramut\xE3",
    Estado: "22"
  },
  {
    ID: "4413",
    Nome: "Abdon Batista",
    Estado: "24"
  },
  {
    ID: "4414",
    Nome: "Abelardo Luz",
    Estado: "24"
  },
  {
    ID: "4415",
    Nome: "Agrol\xE2ndia",
    Estado: "24"
  },
  {
    ID: "4416",
    Nome: "Agron\xF4mica",
    Estado: "24"
  },
  {
    ID: "4417",
    Nome: "\xC1gua Doce",
    Estado: "24"
  },
  {
    ID: "4418",
    Nome: "\xC1guas de Chapec\xF3",
    Estado: "24"
  },
  {
    ID: "4419",
    Nome: "\xC1guas Frias",
    Estado: "24"
  },
  {
    ID: "4420",
    Nome: "\xC1guas Mornas",
    Estado: "24"
  },
  {
    ID: "4421",
    Nome: "Alfredo Wagner",
    Estado: "24"
  },
  {
    ID: "4422",
    Nome: "Alto Bela Vista",
    Estado: "24"
  },
  {
    ID: "4423",
    Nome: "Anchieta",
    Estado: "24"
  },
  {
    ID: "4424",
    Nome: "Angelina",
    Estado: "24"
  },
  {
    ID: "4425",
    Nome: "Anita Garibaldi",
    Estado: "24"
  },
  {
    ID: "4426",
    Nome: "Anit\xE1polis",
    Estado: "24"
  },
  {
    ID: "4427",
    Nome: "Ant\xF4nio Carlos",
    Estado: "24"
  },
  {
    ID: "4428",
    Nome: "Api\xFAna",
    Estado: "24"
  },
  {
    ID: "4429",
    Nome: "Arabut\xE3",
    Estado: "24"
  },
  {
    ID: "4430",
    Nome: "Araquari",
    Estado: "24"
  },
  {
    ID: "4431",
    Nome: "Ararangu\xE1",
    Estado: "24"
  },
  {
    ID: "4432",
    Nome: "Armaz\xE9m",
    Estado: "24"
  },
  {
    ID: "4433",
    Nome: "Arroio Trinta",
    Estado: "24"
  },
  {
    ID: "4434",
    Nome: "Arvoredo",
    Estado: "24"
  },
  {
    ID: "4435",
    Nome: "Ascurra",
    Estado: "24"
  },
  {
    ID: "4436",
    Nome: "Atalanta",
    Estado: "24"
  },
  {
    ID: "4437",
    Nome: "Aurora",
    Estado: "24"
  },
  {
    ID: "4438",
    Nome: "Balne\xE1rio Arroio do Silva",
    Estado: "24"
  },
  {
    ID: "4439",
    Nome: "Balne\xE1rio Barra do Sul",
    Estado: "24"
  },
  {
    ID: "4440",
    Nome: "Balne\xE1rio Cambori\xFA",
    Estado: "24"
  },
  {
    ID: "4441",
    Nome: "Balne\xE1rio Gaivota",
    Estado: "24"
  },
  {
    ID: "4442",
    Nome: "Bandeirante",
    Estado: "24"
  },
  {
    ID: "4443",
    Nome: "Barra Bonita",
    Estado: "24"
  },
  {
    ID: "4444",
    Nome: "Barra Velha",
    Estado: "24"
  },
  {
    ID: "4445",
    Nome: "Bela Vista do Toldo",
    Estado: "24"
  },
  {
    ID: "4446",
    Nome: "Belmonte",
    Estado: "24"
  },
  {
    ID: "4447",
    Nome: "Benedito Novo",
    Estado: "24"
  },
  {
    ID: "4448",
    Nome: "Bigua\xE7u",
    Estado: "24"
  },
  {
    ID: "4449",
    Nome: "Blumenau",
    Estado: "24"
  },
  {
    ID: "4450",
    Nome: "Bocaina do Sul",
    Estado: "24"
  },
  {
    ID: "4451",
    Nome: "Bom Jardim da Serra",
    Estado: "24"
  },
  {
    ID: "4452",
    Nome: "Bom Jesus",
    Estado: "24"
  },
  {
    ID: "4453",
    Nome: "Bom Jesus do Oeste",
    Estado: "24"
  },
  {
    ID: "4454",
    Nome: "Bom Retiro",
    Estado: "24"
  },
  {
    ID: "4455",
    Nome: "Bombinhas",
    Estado: "24"
  },
  {
    ID: "4456",
    Nome: "Botuver\xE1",
    Estado: "24"
  },
  {
    ID: "4457",
    Nome: "Bra\xE7o do Norte",
    Estado: "24"
  },
  {
    ID: "4458",
    Nome: "Bra\xE7o do Trombudo",
    Estado: "24"
  },
  {
    ID: "4459",
    Nome: "Brun\xF3polis",
    Estado: "24"
  },
  {
    ID: "4460",
    Nome: "Brusque",
    Estado: "24"
  },
  {
    ID: "4461",
    Nome: "Ca\xE7ador",
    Estado: "24"
  },
  {
    ID: "4462",
    Nome: "Caibi",
    Estado: "24"
  },
  {
    ID: "4463",
    Nome: "Calmon",
    Estado: "24"
  },
  {
    ID: "4464",
    Nome: "Cambori\xFA",
    Estado: "24"
  },
  {
    ID: "4465",
    Nome: "Campo Alegre",
    Estado: "24"
  },
  {
    ID: "4466",
    Nome: "Campo Belo do Sul",
    Estado: "24"
  },
  {
    ID: "4467",
    Nome: "Campo Er\xEA",
    Estado: "24"
  },
  {
    ID: "4468",
    Nome: "Campos Novos",
    Estado: "24"
  },
  {
    ID: "4469",
    Nome: "Canelinha",
    Estado: "24"
  },
  {
    ID: "4470",
    Nome: "Canoinhas",
    Estado: "24"
  },
  {
    ID: "4471",
    Nome: "Cap\xE3o Alto",
    Estado: "24"
  },
  {
    ID: "4472",
    Nome: "Capinzal",
    Estado: "24"
  },
  {
    ID: "4473",
    Nome: "Capivari de Baixo",
    Estado: "24"
  },
  {
    ID: "4474",
    Nome: "Catanduvas",
    Estado: "24"
  },
  {
    ID: "4475",
    Nome: "Caxambu do Sul",
    Estado: "24"
  },
  {
    ID: "4476",
    Nome: "Celso Ramos",
    Estado: "24"
  },
  {
    ID: "4477",
    Nome: "Cerro Negro",
    Estado: "24"
  },
  {
    ID: "4478",
    Nome: "Chapad\xE3o do Lageado",
    Estado: "24"
  },
  {
    ID: "4479",
    Nome: "Chapec\xF3",
    Estado: "24"
  },
  {
    ID: "4480",
    Nome: "Cocal do Sul",
    Estado: "24"
  },
  {
    ID: "4481",
    Nome: "Conc\xF3rdia",
    Estado: "24"
  },
  {
    ID: "4482",
    Nome: "Cordilheira Alta",
    Estado: "24"
  },
  {
    ID: "4483",
    Nome: "Coronel Freitas",
    Estado: "24"
  },
  {
    ID: "4484",
    Nome: "Coronel Martins",
    Estado: "24"
  },
  {
    ID: "4485",
    Nome: "Correia Pinto",
    Estado: "24"
  },
  {
    ID: "4486",
    Nome: "Corup\xE1",
    Estado: "24"
  },
  {
    ID: "4487",
    Nome: "Crici\xFAma",
    Estado: "24"
  },
  {
    ID: "4488",
    Nome: "Cunha Por\xE3",
    Estado: "24"
  },
  {
    ID: "4489",
    Nome: "Cunhata\xED",
    Estado: "24"
  },
  {
    ID: "4490",
    Nome: "Curitibanos",
    Estado: "24"
  },
  {
    ID: "4491",
    Nome: "Descanso",
    Estado: "24"
  },
  {
    ID: "4492",
    Nome: "Dion\xEDsio Cerqueira",
    Estado: "24"
  },
  {
    ID: "4493",
    Nome: "Dona Emma",
    Estado: "24"
  },
  {
    ID: "4494",
    Nome: "Doutor Pedrinho",
    Estado: "24"
  },
  {
    ID: "4495",
    Nome: "Entre Rios",
    Estado: "24"
  },
  {
    ID: "4496",
    Nome: "Ermo",
    Estado: "24"
  },
  {
    ID: "4497",
    Nome: "Erval Velho",
    Estado: "24"
  },
  {
    ID: "4498",
    Nome: "Faxinal dos Guedes",
    Estado: "24"
  },
  {
    ID: "4499",
    Nome: "Flor do Sert\xE3o",
    Estado: "24"
  },
  {
    ID: "4500",
    Nome: "Florian\xF3polis",
    Estado: "24"
  },
  {
    ID: "4501",
    Nome: "Formosa do Sul",
    Estado: "24"
  },
  {
    ID: "4502",
    Nome: "Forquilhinha",
    Estado: "24"
  },
  {
    ID: "4503",
    Nome: "Fraiburgo",
    Estado: "24"
  },
  {
    ID: "4504",
    Nome: "Frei Rog\xE9rio",
    Estado: "24"
  },
  {
    ID: "4505",
    Nome: "Galv\xE3o",
    Estado: "24"
  },
  {
    ID: "4506",
    Nome: "Garopaba",
    Estado: "24"
  },
  {
    ID: "4507",
    Nome: "Garuva",
    Estado: "24"
  },
  {
    ID: "4508",
    Nome: "Gaspar",
    Estado: "24"
  },
  {
    ID: "4509",
    Nome: "Governador Celso Ramos",
    Estado: "24"
  },
  {
    ID: "4510",
    Nome: "Gr\xE3o Par\xE1",
    Estado: "24"
  },
  {
    ID: "4511",
    Nome: "Gravatal",
    Estado: "24"
  },
  {
    ID: "4512",
    Nome: "Guabiruba",
    Estado: "24"
  },
  {
    ID: "4513",
    Nome: "Guaraciaba",
    Estado: "24"
  },
  {
    ID: "4514",
    Nome: "Guaramirim",
    Estado: "24"
  },
  {
    ID: "4515",
    Nome: "Guaruj\xE1 do Sul",
    Estado: "24"
  },
  {
    ID: "4516",
    Nome: "Guatamb\xFA",
    Estado: "24"
  },
  {
    ID: "4517",
    Nome: "Herval d`Oeste",
    Estado: "24"
  },
  {
    ID: "4518",
    Nome: "Ibiam",
    Estado: "24"
  },
  {
    ID: "4519",
    Nome: "Ibicar\xE9",
    Estado: "24"
  },
  {
    ID: "4520",
    Nome: "Ibirama",
    Estado: "24"
  },
  {
    ID: "4521",
    Nome: "I\xE7ara",
    Estado: "24"
  },
  {
    ID: "4522",
    Nome: "Ilhota",
    Estado: "24"
  },
  {
    ID: "4523",
    Nome: "Imaru\xED",
    Estado: "24"
  },
  {
    ID: "4524",
    Nome: "Imbituba",
    Estado: "24"
  },
  {
    ID: "4525",
    Nome: "Imbuia",
    Estado: "24"
  },
  {
    ID: "4526",
    Nome: "Indaial",
    Estado: "24"
  },
  {
    ID: "4527",
    Nome: "Iomer\xEA",
    Estado: "24"
  },
  {
    ID: "4528",
    Nome: "Ipira",
    Estado: "24"
  },
  {
    ID: "4529",
    Nome: "Ipor\xE3 do Oeste",
    Estado: "24"
  },
  {
    ID: "4530",
    Nome: "Ipua\xE7u",
    Estado: "24"
  },
  {
    ID: "4531",
    Nome: "Ipumirim",
    Estado: "24"
  },
  {
    ID: "4532",
    Nome: "Iraceminha",
    Estado: "24"
  },
  {
    ID: "4533",
    Nome: "Irani",
    Estado: "24"
  },
  {
    ID: "4534",
    Nome: "Irati",
    Estado: "24"
  },
  {
    ID: "4535",
    Nome: "Irine\xF3polis",
    Estado: "24"
  },
  {
    ID: "4536",
    Nome: "It\xE1",
    Estado: "24"
  },
  {
    ID: "4537",
    Nome: "Itai\xF3polis",
    Estado: "24"
  },
  {
    ID: "4538",
    Nome: "Itaja\xED",
    Estado: "24"
  },
  {
    ID: "4539",
    Nome: "Itapema",
    Estado: "24"
  },
  {
    ID: "4540",
    Nome: "Itapiranga",
    Estado: "24"
  },
  {
    ID: "4541",
    Nome: "Itapo\xE1",
    Estado: "24"
  },
  {
    ID: "4542",
    Nome: "Ituporanga",
    Estado: "24"
  },
  {
    ID: "4543",
    Nome: "Jabor\xE1",
    Estado: "24"
  },
  {
    ID: "4544",
    Nome: "Jacinto Machado",
    Estado: "24"
  },
  {
    ID: "4545",
    Nome: "Jaguaruna",
    Estado: "24"
  },
  {
    ID: "4546",
    Nome: "Jaragu\xE1 do Sul",
    Estado: "24"
  },
  {
    ID: "4547",
    Nome: "Jardin\xF3polis",
    Estado: "24"
  },
  {
    ID: "4548",
    Nome: "Joa\xE7aba",
    Estado: "24"
  },
  {
    ID: "4549",
    Nome: "Joinville",
    Estado: "24"
  },
  {
    ID: "4550",
    Nome: "Jos\xE9 Boiteux",
    Estado: "24"
  },
  {
    ID: "4551",
    Nome: "Jupi\xE1",
    Estado: "24"
  },
  {
    ID: "4552",
    Nome: "Lacerd\xF3polis",
    Estado: "24"
  },
  {
    ID: "4553",
    Nome: "Lages",
    Estado: "24"
  },
  {
    ID: "4554",
    Nome: "Laguna",
    Estado: "24"
  },
  {
    ID: "4555",
    Nome: "Lajeado Grande",
    Estado: "24"
  },
  {
    ID: "4556",
    Nome: "Laurentino",
    Estado: "24"
  },
  {
    ID: "4557",
    Nome: "Lauro Muller",
    Estado: "24"
  },
  {
    ID: "4558",
    Nome: "Lebon R\xE9gis",
    Estado: "24"
  },
  {
    ID: "4559",
    Nome: "Leoberto Leal",
    Estado: "24"
  },
  {
    ID: "4560",
    Nome: "Lind\xF3ia do Sul",
    Estado: "24"
  },
  {
    ID: "4561",
    Nome: "Lontras",
    Estado: "24"
  },
  {
    ID: "4562",
    Nome: "Luiz Alves",
    Estado: "24"
  },
  {
    ID: "4563",
    Nome: "Luzerna",
    Estado: "24"
  },
  {
    ID: "4564",
    Nome: "Macieira",
    Estado: "24"
  },
  {
    ID: "4565",
    Nome: "Mafra",
    Estado: "24"
  },
  {
    ID: "4566",
    Nome: "Major Gercino",
    Estado: "24"
  },
  {
    ID: "4567",
    Nome: "Major Vieira",
    Estado: "24"
  },
  {
    ID: "4568",
    Nome: "Maracaj\xE1",
    Estado: "24"
  },
  {
    ID: "4569",
    Nome: "Maravilha",
    Estado: "24"
  },
  {
    ID: "4570",
    Nome: "Marema",
    Estado: "24"
  },
  {
    ID: "4571",
    Nome: "Massaranduba",
    Estado: "24"
  },
  {
    ID: "4572",
    Nome: "Matos Costa",
    Estado: "24"
  },
  {
    ID: "4573",
    Nome: "Meleiro",
    Estado: "24"
  },
  {
    ID: "4574",
    Nome: "Mirim Doce",
    Estado: "24"
  },
  {
    ID: "4575",
    Nome: "Modelo",
    Estado: "24"
  },
  {
    ID: "4576",
    Nome: "Monda\xED",
    Estado: "24"
  },
  {
    ID: "4577",
    Nome: "Monte Carlo",
    Estado: "24"
  },
  {
    ID: "4578",
    Nome: "Monte Castelo",
    Estado: "24"
  },
  {
    ID: "4579",
    Nome: "Morro da Fuma\xE7a",
    Estado: "24"
  },
  {
    ID: "4580",
    Nome: "Morro Grande",
    Estado: "24"
  },
  {
    ID: "4581",
    Nome: "Navegantes",
    Estado: "24"
  },
  {
    ID: "4582",
    Nome: "Nova Erechim",
    Estado: "24"
  },
  {
    ID: "4583",
    Nome: "Nova Itaberaba",
    Estado: "24"
  },
  {
    ID: "4584",
    Nome: "Nova Trento",
    Estado: "24"
  },
  {
    ID: "4585",
    Nome: "Nova Veneza",
    Estado: "24"
  },
  {
    ID: "4586",
    Nome: "Novo Horizonte",
    Estado: "24"
  },
  {
    ID: "4587",
    Nome: "Orleans",
    Estado: "24"
  },
  {
    ID: "4588",
    Nome: "Otac\xEDlio Costa",
    Estado: "24"
  },
  {
    ID: "4589",
    Nome: "Ouro",
    Estado: "24"
  },
  {
    ID: "4590",
    Nome: "Ouro Verde",
    Estado: "24"
  },
  {
    ID: "4591",
    Nome: "Paial",
    Estado: "24"
  },
  {
    ID: "4592",
    Nome: "Painel",
    Estado: "24"
  },
  {
    ID: "4593",
    Nome: "Palho\xE7a",
    Estado: "24"
  },
  {
    ID: "4594",
    Nome: "Palma Sola",
    Estado: "24"
  },
  {
    ID: "4595",
    Nome: "Palmeira",
    Estado: "24"
  },
  {
    ID: "4596",
    Nome: "Palmitos",
    Estado: "24"
  },
  {
    ID: "4597",
    Nome: "Papanduva",
    Estado: "24"
  },
  {
    ID: "4598",
    Nome: "Para\xEDso",
    Estado: "24"
  },
  {
    ID: "4599",
    Nome: "Passo de Torres",
    Estado: "24"
  },
  {
    ID: "4600",
    Nome: "Passos Maia",
    Estado: "24"
  },
  {
    ID: "4601",
    Nome: "Paulo Lopes",
    Estado: "24"
  },
  {
    ID: "4602",
    Nome: "Pedras Grandes",
    Estado: "24"
  },
  {
    ID: "4603",
    Nome: "Penha",
    Estado: "24"
  },
  {
    ID: "4604",
    Nome: "Peritiba",
    Estado: "24"
  },
  {
    ID: "4605",
    Nome: "Petrol\xE2ndia",
    Estado: "24"
  },
  {
    ID: "4606",
    Nome: "Pi\xE7arras",
    Estado: "24"
  },
  {
    ID: "4607",
    Nome: "Pinhalzinho",
    Estado: "24"
  },
  {
    ID: "4608",
    Nome: "Pinheiro Preto",
    Estado: "24"
  },
  {
    ID: "4609",
    Nome: "Piratuba",
    Estado: "24"
  },
  {
    ID: "4610",
    Nome: "Planalto Alegre",
    Estado: "24"
  },
  {
    ID: "4611",
    Nome: "Pomerode",
    Estado: "24"
  },
  {
    ID: "4612",
    Nome: "Ponte Alta",
    Estado: "24"
  },
  {
    ID: "4613",
    Nome: "Ponte Alta do Norte",
    Estado: "24"
  },
  {
    ID: "4614",
    Nome: "Ponte Serrada",
    Estado: "24"
  },
  {
    ID: "4615",
    Nome: "Porto Belo",
    Estado: "24"
  },
  {
    ID: "4616",
    Nome: "Porto Uni\xE3o",
    Estado: "24"
  },
  {
    ID: "4617",
    Nome: "Pouso Redondo",
    Estado: "24"
  },
  {
    ID: "4618",
    Nome: "Praia Grande",
    Estado: "24"
  },
  {
    ID: "4619",
    Nome: "Presidente Castelo Branco",
    Estado: "24"
  },
  {
    ID: "4620",
    Nome: "Presidente Get\xFAlio",
    Estado: "24"
  },
  {
    ID: "4621",
    Nome: "Presidente Nereu",
    Estado: "24"
  },
  {
    ID: "4622",
    Nome: "Princesa",
    Estado: "24"
  },
  {
    ID: "4623",
    Nome: "Quilombo",
    Estado: "24"
  },
  {
    ID: "4624",
    Nome: "Rancho Queimado",
    Estado: "24"
  },
  {
    ID: "4625",
    Nome: "Rio das Antas",
    Estado: "24"
  },
  {
    ID: "4626",
    Nome: "Rio do Campo",
    Estado: "24"
  },
  {
    ID: "4627",
    Nome: "Rio do Oeste",
    Estado: "24"
  },
  {
    ID: "4628",
    Nome: "Rio do Sul",
    Estado: "24"
  },
  {
    ID: "4629",
    Nome: "Rio dos Cedros",
    Estado: "24"
  },
  {
    ID: "4630",
    Nome: "Rio Fortuna",
    Estado: "24"
  },
  {
    ID: "4631",
    Nome: "Rio Negrinho",
    Estado: "24"
  },
  {
    ID: "4632",
    Nome: "Rio Rufino",
    Estado: "24"
  },
  {
    ID: "4633",
    Nome: "Riqueza",
    Estado: "24"
  },
  {
    ID: "4634",
    Nome: "Rodeio",
    Estado: "24"
  },
  {
    ID: "4635",
    Nome: "Romel\xE2ndia",
    Estado: "24"
  },
  {
    ID: "4636",
    Nome: "Salete",
    Estado: "24"
  },
  {
    ID: "4637",
    Nome: "Saltinho",
    Estado: "24"
  },
  {
    ID: "4638",
    Nome: "Salto Veloso",
    Estado: "24"
  },
  {
    ID: "4639",
    Nome: "Sang\xE3o",
    Estado: "24"
  },
  {
    ID: "4640",
    Nome: "Santa Cec\xEDlia",
    Estado: "24"
  },
  {
    ID: "4641",
    Nome: "Santa Helena",
    Estado: "24"
  },
  {
    ID: "4642",
    Nome: "Santa Rosa de Lima",
    Estado: "24"
  },
  {
    ID: "4643",
    Nome: "Santa Rosa do Sul",
    Estado: "24"
  },
  {
    ID: "4644",
    Nome: "Santa Terezinha",
    Estado: "24"
  },
  {
    ID: "4645",
    Nome: "Santa Terezinha do Progresso",
    Estado: "24"
  },
  {
    ID: "4646",
    Nome: "Santiago do Sul",
    Estado: "24"
  },
  {
    ID: "4647",
    Nome: "Santo Amaro da Imperatriz",
    Estado: "24"
  },
  {
    ID: "4648",
    Nome: "S\xE3o Bento do Sul",
    Estado: "24"
  },
  {
    ID: "4649",
    Nome: "S\xE3o Bernardino",
    Estado: "24"
  },
  {
    ID: "4650",
    Nome: "S\xE3o Bonif\xE1cio",
    Estado: "24"
  },
  {
    ID: "4651",
    Nome: "S\xE3o Carlos",
    Estado: "24"
  },
  {
    ID: "4652",
    Nome: "S\xE3o Cristov\xE3o do Sul",
    Estado: "24"
  },
  {
    ID: "4653",
    Nome: "S\xE3o Domingos",
    Estado: "24"
  },
  {
    ID: "4654",
    Nome: "S\xE3o Francisco do Sul",
    Estado: "24"
  },
  {
    ID: "4655",
    Nome: "S\xE3o Jo\xE3o Batista",
    Estado: "24"
  },
  {
    ID: "4656",
    Nome: "S\xE3o Jo\xE3o do Itaperi\xFA",
    Estado: "24"
  },
  {
    ID: "4657",
    Nome: "S\xE3o Jo\xE3o do Oeste",
    Estado: "24"
  },
  {
    ID: "4658",
    Nome: "S\xE3o Jo\xE3o do Sul",
    Estado: "24"
  },
  {
    ID: "4659",
    Nome: "S\xE3o Joaquim",
    Estado: "24"
  },
  {
    ID: "4660",
    Nome: "S\xE3o Jos\xE9",
    Estado: "24"
  },
  {
    ID: "4661",
    Nome: "S\xE3o Jos\xE9 do Cedro",
    Estado: "24"
  },
  {
    ID: "4662",
    Nome: "S\xE3o Jos\xE9 do Cerrito",
    Estado: "24"
  },
  {
    ID: "4663",
    Nome: "S\xE3o Louren\xE7o do Oeste",
    Estado: "24"
  },
  {
    ID: "4664",
    Nome: "S\xE3o Ludgero",
    Estado: "24"
  },
  {
    ID: "4665",
    Nome: "S\xE3o Martinho",
    Estado: "24"
  },
  {
    ID: "4666",
    Nome: "S\xE3o Miguel da Boa Vista",
    Estado: "24"
  },
  {
    ID: "4667",
    Nome: "S\xE3o Miguel do Oeste",
    Estado: "24"
  },
  {
    ID: "4668",
    Nome: "S\xE3o Pedro de Alc\xE2ntara",
    Estado: "24"
  },
  {
    ID: "4669",
    Nome: "Saudades",
    Estado: "24"
  },
  {
    ID: "4670",
    Nome: "Schroeder",
    Estado: "24"
  },
  {
    ID: "4671",
    Nome: "Seara",
    Estado: "24"
  },
  {
    ID: "4672",
    Nome: "Serra Alta",
    Estado: "24"
  },
  {
    ID: "4673",
    Nome: "Sider\xF3polis",
    Estado: "24"
  },
  {
    ID: "4674",
    Nome: "Sombrio",
    Estado: "24"
  },
  {
    ID: "4675",
    Nome: "Sul Brasil",
    Estado: "24"
  },
  {
    ID: "4676",
    Nome: "Tai\xF3",
    Estado: "24"
  },
  {
    ID: "4677",
    Nome: "Tangar\xE1",
    Estado: "24"
  },
  {
    ID: "4678",
    Nome: "Tigrinhos",
    Estado: "24"
  },
  {
    ID: "4679",
    Nome: "Tijucas",
    Estado: "24"
  },
  {
    ID: "4680",
    Nome: "Timb\xE9 do Sul",
    Estado: "24"
  },
  {
    ID: "4681",
    Nome: "Timb\xF3",
    Estado: "24"
  },
  {
    ID: "4682",
    Nome: "Timb\xF3 Grande",
    Estado: "24"
  },
  {
    ID: "4683",
    Nome: "Tr\xEAs Barras",
    Estado: "24"
  },
  {
    ID: "4684",
    Nome: "Treviso",
    Estado: "24"
  },
  {
    ID: "4685",
    Nome: "Treze de Maio",
    Estado: "24"
  },
  {
    ID: "4686",
    Nome: "Treze T\xEDlias",
    Estado: "24"
  },
  {
    ID: "4687",
    Nome: "Trombudo Central",
    Estado: "24"
  },
  {
    ID: "4688",
    Nome: "Tubar\xE3o",
    Estado: "24"
  },
  {
    ID: "4689",
    Nome: "Tun\xE1polis",
    Estado: "24"
  },
  {
    ID: "4690",
    Nome: "Turvo",
    Estado: "24"
  },
  {
    ID: "4691",
    Nome: "Uni\xE3o do Oeste",
    Estado: "24"
  },
  {
    ID: "4692",
    Nome: "Urubici",
    Estado: "24"
  },
  {
    ID: "4693",
    Nome: "Urupema",
    Estado: "24"
  },
  {
    ID: "4694",
    Nome: "Urussanga",
    Estado: "24"
  },
  {
    ID: "4695",
    Nome: "Varge\xE3o",
    Estado: "24"
  },
  {
    ID: "4696",
    Nome: "Vargem",
    Estado: "24"
  },
  {
    ID: "4697",
    Nome: "Vargem Bonita",
    Estado: "24"
  },
  {
    ID: "4698",
    Nome: "Vidal Ramos",
    Estado: "24"
  },
  {
    ID: "4699",
    Nome: "Videira",
    Estado: "24"
  },
  {
    ID: "4700",
    Nome: "Vitor Meireles",
    Estado: "24"
  },
  {
    ID: "4701",
    Nome: "Witmarsum",
    Estado: "24"
  },
  {
    ID: "4702",
    Nome: "Xanxer\xEA",
    Estado: "24"
  },
  {
    ID: "4703",
    Nome: "Xavantina",
    Estado: "24"
  },
  {
    ID: "4704",
    Nome: "Xaxim",
    Estado: "24"
  },
  {
    ID: "4705",
    Nome: "Zort\xE9a",
    Estado: "24"
  },
  {
    ID: "4706",
    Nome: "Adamantina",
    Estado: "26"
  },
  {
    ID: "4707",
    Nome: "Adolfo",
    Estado: "26"
  },
  {
    ID: "4708",
    Nome: "Agua\xED",
    Estado: "26"
  },
  {
    ID: "4709",
    Nome: "\xC1guas da Prata",
    Estado: "26"
  },
  {
    ID: "4710",
    Nome: "\xC1guas de Lind\xF3ia",
    Estado: "26"
  },
  {
    ID: "4711",
    Nome: "\xC1guas de Santa B\xE1rbara",
    Estado: "26"
  },
  {
    ID: "4712",
    Nome: "\xC1guas de S\xE3o Pedro",
    Estado: "26"
  },
  {
    ID: "4713",
    Nome: "Agudos",
    Estado: "26"
  },
  {
    ID: "4714",
    Nome: "Alambari",
    Estado: "26"
  },
  {
    ID: "4715",
    Nome: "Alfredo Marcondes",
    Estado: "26"
  },
  {
    ID: "4716",
    Nome: "Altair",
    Estado: "26"
  },
  {
    ID: "4717",
    Nome: "Altin\xF3polis",
    Estado: "26"
  },
  {
    ID: "4718",
    Nome: "Alto Alegre",
    Estado: "26"
  },
  {
    ID: "4719",
    Nome: "Alum\xEDnio",
    Estado: "26"
  },
  {
    ID: "4720",
    Nome: "\xC1lvares Florence",
    Estado: "26"
  },
  {
    ID: "4721",
    Nome: "\xC1lvares Machado",
    Estado: "26"
  },
  {
    ID: "4722",
    Nome: "\xC1lvaro de Carvalho",
    Estado: "26"
  },
  {
    ID: "4723",
    Nome: "Alvinl\xE2ndia",
    Estado: "26"
  },
  {
    ID: "4724",
    Nome: "Americana",
    Estado: "26"
  },
  {
    ID: "4725",
    Nome: "Am\xE9rico Brasiliense",
    Estado: "26"
  },
  {
    ID: "4726",
    Nome: "Am\xE9rico de Campos",
    Estado: "26"
  },
  {
    ID: "4727",
    Nome: "Amparo",
    Estado: "26"
  },
  {
    ID: "4728",
    Nome: "Anal\xE2ndia",
    Estado: "26"
  },
  {
    ID: "4729",
    Nome: "Andradina",
    Estado: "26"
  },
  {
    ID: "4730",
    Nome: "Angatuba",
    Estado: "26"
  },
  {
    ID: "4731",
    Nome: "Anhembi",
    Estado: "26"
  },
  {
    ID: "4732",
    Nome: "Anhumas",
    Estado: "26"
  },
  {
    ID: "4733",
    Nome: "Aparecida",
    Estado: "26"
  },
  {
    ID: "4734",
    Nome: "Aparecida d`Oeste",
    Estado: "26"
  },
  {
    ID: "4735",
    Nome: "Apia\xED",
    Estado: "26"
  },
  {
    ID: "4736",
    Nome: "Ara\xE7ariguama",
    Estado: "26"
  },
  {
    ID: "4737",
    Nome: "Ara\xE7atuba",
    Estado: "26"
  },
  {
    ID: "4738",
    Nome: "Ara\xE7oiaba da Serra",
    Estado: "26"
  },
  {
    ID: "4739",
    Nome: "Aramina",
    Estado: "26"
  },
  {
    ID: "4740",
    Nome: "Arandu",
    Estado: "26"
  },
  {
    ID: "4741",
    Nome: "Arape\xED",
    Estado: "26"
  },
  {
    ID: "4742",
    Nome: "Araraquara",
    Estado: "26"
  },
  {
    ID: "4743",
    Nome: "Araras",
    Estado: "26"
  },
  {
    ID: "4744",
    Nome: "Arco-\xCDris",
    Estado: "26"
  },
  {
    ID: "4745",
    Nome: "Arealva",
    Estado: "26"
  },
  {
    ID: "4746",
    Nome: "Areias",
    Estado: "26"
  },
  {
    ID: "4747",
    Nome: "Arei\xF3polis",
    Estado: "26"
  },
  {
    ID: "4748",
    Nome: "Ariranha",
    Estado: "26"
  },
  {
    ID: "4749",
    Nome: "Artur Nogueira",
    Estado: "26"
  },
  {
    ID: "4750",
    Nome: "Aruj\xE1",
    Estado: "26"
  },
  {
    ID: "4751",
    Nome: "Asp\xE1sia",
    Estado: "26"
  },
  {
    ID: "4752",
    Nome: "Assis",
    Estado: "26"
  },
  {
    ID: "4753",
    Nome: "Atibaia",
    Estado: "26"
  },
  {
    ID: "4754",
    Nome: "Auriflama",
    Estado: "26"
  },
  {
    ID: "4755",
    Nome: "Ava\xED",
    Estado: "26"
  },
  {
    ID: "4756",
    Nome: "Avanhandava",
    Estado: "26"
  },
  {
    ID: "4757",
    Nome: "Avar\xE9",
    Estado: "26"
  },
  {
    ID: "4758",
    Nome: "Bady Bassitt",
    Estado: "26"
  },
  {
    ID: "4759",
    Nome: "Balbinos",
    Estado: "26"
  },
  {
    ID: "4760",
    Nome: "B\xE1lsamo",
    Estado: "26"
  },
  {
    ID: "4761",
    Nome: "Bananal",
    Estado: "26"
  },
  {
    ID: "4762",
    Nome: "Bar\xE3o de Antonina",
    Estado: "26"
  },
  {
    ID: "4763",
    Nome: "Barbosa",
    Estado: "26"
  },
  {
    ID: "4764",
    Nome: "Bariri",
    Estado: "26"
  },
  {
    ID: "4765",
    Nome: "Barra Bonita",
    Estado: "26"
  },
  {
    ID: "4766",
    Nome: "Barra do Chap\xE9u",
    Estado: "26"
  },
  {
    ID: "4767",
    Nome: "Barra do Turvo",
    Estado: "26"
  },
  {
    ID: "4768",
    Nome: "Barretos",
    Estado: "26"
  },
  {
    ID: "4769",
    Nome: "Barrinha",
    Estado: "26"
  },
  {
    ID: "4770",
    Nome: "Barueri",
    Estado: "26"
  },
  {
    ID: "4771",
    Nome: "Bastos",
    Estado: "26"
  },
  {
    ID: "4772",
    Nome: "Batatais",
    Estado: "26"
  },
  {
    ID: "4773",
    Nome: "Bauru",
    Estado: "26"
  },
  {
    ID: "4774",
    Nome: "Bebedouro",
    Estado: "26"
  },
  {
    ID: "4775",
    Nome: "Bento de Abreu",
    Estado: "26"
  },
  {
    ID: "4776",
    Nome: "Bernardino de Campos",
    Estado: "26"
  },
  {
    ID: "4777",
    Nome: "Bertioga",
    Estado: "26"
  },
  {
    ID: "4778",
    Nome: "Bilac",
    Estado: "26"
  },
  {
    ID: "4779",
    Nome: "Birigui",
    Estado: "26"
  },
  {
    ID: "4780",
    Nome: "Biritiba-Mirim",
    Estado: "26"
  },
  {
    ID: "4781",
    Nome: "Boa Esperan\xE7a do Sul",
    Estado: "26"
  },
  {
    ID: "4782",
    Nome: "Bocaina",
    Estado: "26"
  },
  {
    ID: "4783",
    Nome: "Bofete",
    Estado: "26"
  },
  {
    ID: "4784",
    Nome: "Boituva",
    Estado: "26"
  },
  {
    ID: "4785",
    Nome: "Bom Jesus dos Perd\xF5es",
    Estado: "26"
  },
  {
    ID: "4786",
    Nome: "Bom Sucesso de Itarar\xE9",
    Estado: "26"
  },
  {
    ID: "4787",
    Nome: "Bor\xE1",
    Estado: "26"
  },
  {
    ID: "4788",
    Nome: "Borac\xE9ia",
    Estado: "26"
  },
  {
    ID: "4789",
    Nome: "Borborema",
    Estado: "26"
  },
  {
    ID: "4790",
    Nome: "Borebi",
    Estado: "26"
  },
  {
    ID: "4791",
    Nome: "Botucatu",
    Estado: "26"
  },
  {
    ID: "4792",
    Nome: "Bragan\xE7a Paulista",
    Estado: "26"
  },
  {
    ID: "4793",
    Nome: "Bra\xFAna",
    Estado: "26"
  },
  {
    ID: "4794",
    Nome: "Brejo Alegre",
    Estado: "26"
  },
  {
    ID: "4795",
    Nome: "Brodowski",
    Estado: "26"
  },
  {
    ID: "4796",
    Nome: "Brotas",
    Estado: "26"
  },
  {
    ID: "4797",
    Nome: "Buri",
    Estado: "26"
  },
  {
    ID: "4798",
    Nome: "Buritama",
    Estado: "26"
  },
  {
    ID: "4799",
    Nome: "Buritizal",
    Estado: "26"
  },
  {
    ID: "4800",
    Nome: "Cabr\xE1lia Paulista",
    Estado: "26"
  },
  {
    ID: "4801",
    Nome: "Cabre\xFAva",
    Estado: "26"
  },
  {
    ID: "4802",
    Nome: "Ca\xE7apava",
    Estado: "26"
  },
  {
    ID: "4803",
    Nome: "Cachoeira Paulista",
    Estado: "26"
  },
  {
    ID: "4804",
    Nome: "Caconde",
    Estado: "26"
  },
  {
    ID: "4805",
    Nome: "Cafel\xE2ndia",
    Estado: "26"
  },
  {
    ID: "4806",
    Nome: "Caiabu",
    Estado: "26"
  },
  {
    ID: "4807",
    Nome: "Caieiras",
    Estado: "26"
  },
  {
    ID: "4808",
    Nome: "Caiu\xE1",
    Estado: "26"
  },
  {
    ID: "4809",
    Nome: "Cajamar",
    Estado: "26"
  },
  {
    ID: "4810",
    Nome: "Cajati",
    Estado: "26"
  },
  {
    ID: "4811",
    Nome: "Cajobi",
    Estado: "26"
  },
  {
    ID: "4812",
    Nome: "Cajuru",
    Estado: "26"
  },
  {
    ID: "4813",
    Nome: "Campina do Monte Alegre",
    Estado: "26"
  },
  {
    ID: "4814",
    Nome: "Campinas",
    Estado: "26"
  },
  {
    ID: "4815",
    Nome: "Campo Limpo Paulista",
    Estado: "26"
  },
  {
    ID: "4816",
    Nome: "Campos do Jord\xE3o",
    Estado: "26"
  },
  {
    ID: "4817",
    Nome: "Campos Novos Paulista",
    Estado: "26"
  },
  {
    ID: "4818",
    Nome: "Canan\xE9ia",
    Estado: "26"
  },
  {
    ID: "4819",
    Nome: "Canas",
    Estado: "26"
  },
  {
    ID: "4820",
    Nome: "C\xE2ndido Mota",
    Estado: "26"
  },
  {
    ID: "4821",
    Nome: "C\xE2ndido Rodrigues",
    Estado: "26"
  },
  {
    ID: "4822",
    Nome: "Canitar",
    Estado: "26"
  },
  {
    ID: "4823",
    Nome: "Cap\xE3o Bonito",
    Estado: "26"
  },
  {
    ID: "4824",
    Nome: "Capela do Alto",
    Estado: "26"
  },
  {
    ID: "4825",
    Nome: "Capivari",
    Estado: "26"
  },
  {
    ID: "4826",
    Nome: "Caraguatatuba",
    Estado: "26"
  },
  {
    ID: "4827",
    Nome: "Carapicu\xEDba",
    Estado: "26"
  },
  {
    ID: "4828",
    Nome: "Cardoso",
    Estado: "26"
  },
  {
    ID: "4829",
    Nome: "Casa Branca",
    Estado: "26"
  },
  {
    ID: "4830",
    Nome: "C\xE1ssia dos Coqueiros",
    Estado: "26"
  },
  {
    ID: "4831",
    Nome: "Castilho",
    Estado: "26"
  },
  {
    ID: "4832",
    Nome: "Catanduva",
    Estado: "26"
  },
  {
    ID: "4833",
    Nome: "Catigu\xE1",
    Estado: "26"
  },
  {
    ID: "4834",
    Nome: "Cedral",
    Estado: "26"
  },
  {
    ID: "4835",
    Nome: "Cerqueira C\xE9sar",
    Estado: "26"
  },
  {
    ID: "4836",
    Nome: "Cerquilho",
    Estado: "26"
  },
  {
    ID: "4837",
    Nome: "Ces\xE1rio Lange",
    Estado: "26"
  },
  {
    ID: "4838",
    Nome: "Charqueada",
    Estado: "26"
  },
  {
    ID: "4839",
    Nome: "Chavantes",
    Estado: "26"
  },
  {
    ID: "4840",
    Nome: "Clementina",
    Estado: "26"
  },
  {
    ID: "4841",
    Nome: "Colina",
    Estado: "26"
  },
  {
    ID: "4842",
    Nome: "Col\xF4mbia",
    Estado: "26"
  },
  {
    ID: "4843",
    Nome: "Conchal",
    Estado: "26"
  },
  {
    ID: "4844",
    Nome: "Conchas",
    Estado: "26"
  },
  {
    ID: "4845",
    Nome: "Cordeir\xF3polis",
    Estado: "26"
  },
  {
    ID: "4846",
    Nome: "Coroados",
    Estado: "26"
  },
  {
    ID: "4847",
    Nome: "Coronel Macedo",
    Estado: "26"
  },
  {
    ID: "4848",
    Nome: "Corumbata\xED",
    Estado: "26"
  },
  {
    ID: "4849",
    Nome: "Cosm\xF3polis",
    Estado: "26"
  },
  {
    ID: "4850",
    Nome: "Cosmorama",
    Estado: "26"
  },
  {
    ID: "4851",
    Nome: "Cotia",
    Estado: "26"
  },
  {
    ID: "4852",
    Nome: "Cravinhos",
    Estado: "26"
  },
  {
    ID: "4853",
    Nome: "Cristais Paulista",
    Estado: "26"
  },
  {
    ID: "4854",
    Nome: "Cruz\xE1lia",
    Estado: "26"
  },
  {
    ID: "4855",
    Nome: "Cruzeiro",
    Estado: "26"
  },
  {
    ID: "4856",
    Nome: "Cubat\xE3o",
    Estado: "26"
  },
  {
    ID: "4857",
    Nome: "Cunha",
    Estado: "26"
  },
  {
    ID: "4858",
    Nome: "Descalvado",
    Estado: "26"
  },
  {
    ID: "4859",
    Nome: "Diadema",
    Estado: "26"
  },
  {
    ID: "4860",
    Nome: "Dirce Reis",
    Estado: "26"
  },
  {
    ID: "4861",
    Nome: "Divinol\xE2ndia",
    Estado: "26"
  },
  {
    ID: "4862",
    Nome: "Dobrada",
    Estado: "26"
  },
  {
    ID: "4863",
    Nome: "Dois C\xF3rregos",
    Estado: "26"
  },
  {
    ID: "4864",
    Nome: "Dolcin\xF3polis",
    Estado: "26"
  },
  {
    ID: "4865",
    Nome: "Dourado",
    Estado: "26"
  },
  {
    ID: "4866",
    Nome: "Dracena",
    Estado: "26"
  },
  {
    ID: "4867",
    Nome: "Duartina",
    Estado: "26"
  },
  {
    ID: "4868",
    Nome: "Dumont",
    Estado: "26"
  },
  {
    ID: "4869",
    Nome: "Echapor\xE3",
    Estado: "26"
  },
  {
    ID: "4870",
    Nome: "Eldorado",
    Estado: "26"
  },
  {
    ID: "4871",
    Nome: "Elias Fausto",
    Estado: "26"
  },
  {
    ID: "4872",
    Nome: "Elisi\xE1rio",
    Estado: "26"
  },
  {
    ID: "4873",
    Nome: "Emba\xFAba",
    Estado: "26"
  },
  {
    ID: "4874",
    Nome: "Embu",
    Estado: "26"
  },
  {
    ID: "4875",
    Nome: "Embu-Gua\xE7u",
    Estado: "26"
  },
  {
    ID: "4876",
    Nome: "Emilian\xF3polis",
    Estado: "26"
  },
  {
    ID: "4877",
    Nome: "Engenheiro Coelho",
    Estado: "26"
  },
  {
    ID: "4878",
    Nome: "Esp\xEDrito Santo do Pinhal",
    Estado: "26"
  },
  {
    ID: "4879",
    Nome: "Esp\xEDrito Santo do Turvo",
    Estado: "26"
  },
  {
    ID: "4880",
    Nome: "Estiva Gerbi",
    Estado: "26"
  },
  {
    ID: "4881",
    Nome: "Estrela d`Oeste",
    Estado: "26"
  },
  {
    ID: "4882",
    Nome: "Estrela do Norte",
    Estado: "26"
  },
  {
    ID: "4883",
    Nome: "Euclides da Cunha Paulista",
    Estado: "26"
  },
  {
    ID: "4884",
    Nome: "Fartura",
    Estado: "26"
  },
  {
    ID: "4885",
    Nome: "Fernando Prestes",
    Estado: "26"
  },
  {
    ID: "4886",
    Nome: "Fernand\xF3polis",
    Estado: "26"
  },
  {
    ID: "4887",
    Nome: "Fern\xE3o",
    Estado: "26"
  },
  {
    ID: "4888",
    Nome: "Ferraz de Vasconcelos",
    Estado: "26"
  },
  {
    ID: "4889",
    Nome: "Flora Rica",
    Estado: "26"
  },
  {
    ID: "4890",
    Nome: "Floreal",
    Estado: "26"
  },
  {
    ID: "4891",
    Nome: "Fl\xF3rida Paulista",
    Estado: "26"
  },
  {
    ID: "4892",
    Nome: "Flor\xEDnia",
    Estado: "26"
  },
  {
    ID: "4893",
    Nome: "Franca",
    Estado: "26"
  },
  {
    ID: "4894",
    Nome: "Francisco Morato",
    Estado: "26"
  },
  {
    ID: "4895",
    Nome: "Franco da Rocha",
    Estado: "26"
  },
  {
    ID: "4896",
    Nome: "Gabriel Monteiro",
    Estado: "26"
  },
  {
    ID: "4897",
    Nome: "G\xE1lia",
    Estado: "26"
  },
  {
    ID: "4898",
    Nome: "Gar\xE7a",
    Estado: "26"
  },
  {
    ID: "4899",
    Nome: "Gast\xE3o Vidigal",
    Estado: "26"
  },
  {
    ID: "4900",
    Nome: "Gavi\xE3o Peixoto",
    Estado: "26"
  },
  {
    ID: "4901",
    Nome: "General Salgado",
    Estado: "26"
  },
  {
    ID: "4902",
    Nome: "Getulina",
    Estado: "26"
  },
  {
    ID: "4903",
    Nome: "Glic\xE9rio",
    Estado: "26"
  },
  {
    ID: "4904",
    Nome: "Guai\xE7ara",
    Estado: "26"
  },
  {
    ID: "4905",
    Nome: "Guaimb\xEA",
    Estado: "26"
  },
  {
    ID: "4906",
    Nome: "Gua\xEDra",
    Estado: "26"
  },
  {
    ID: "4907",
    Nome: "Guapia\xE7u",
    Estado: "26"
  },
  {
    ID: "4908",
    Nome: "Guapiara",
    Estado: "26"
  },
  {
    ID: "4909",
    Nome: "Guar\xE1",
    Estado: "26"
  },
  {
    ID: "4910",
    Nome: "Guara\xE7a\xED",
    Estado: "26"
  },
  {
    ID: "4911",
    Nome: "Guaraci",
    Estado: "26"
  },
  {
    ID: "4912",
    Nome: "Guarani d`Oeste",
    Estado: "26"
  },
  {
    ID: "4913",
    Nome: "Guarant\xE3",
    Estado: "26"
  },
  {
    ID: "4914",
    Nome: "Guararapes",
    Estado: "26"
  },
  {
    ID: "4915",
    Nome: "Guararema",
    Estado: "26"
  },
  {
    ID: "4916",
    Nome: "Guaratinguet\xE1",
    Estado: "26"
  },
  {
    ID: "4917",
    Nome: "Guare\xED",
    Estado: "26"
  },
  {
    ID: "4918",
    Nome: "Guariba",
    Estado: "26"
  },
  {
    ID: "4919",
    Nome: "Guaruj\xE1",
    Estado: "26"
  },
  {
    ID: "4920",
    Nome: "Guarulhos",
    Estado: "26"
  },
  {
    ID: "4921",
    Nome: "Guatapar\xE1",
    Estado: "26"
  },
  {
    ID: "4922",
    Nome: "Guzol\xE2ndia",
    Estado: "26"
  },
  {
    ID: "4923",
    Nome: "Hercul\xE2ndia",
    Estado: "26"
  },
  {
    ID: "4924",
    Nome: "Holambra",
    Estado: "26"
  },
  {
    ID: "4925",
    Nome: "Hortol\xE2ndia",
    Estado: "26"
  },
  {
    ID: "4926",
    Nome: "Iacanga",
    Estado: "26"
  },
  {
    ID: "4927",
    Nome: "Iacri",
    Estado: "26"
  },
  {
    ID: "4928",
    Nome: "Iaras",
    Estado: "26"
  },
  {
    ID: "4929",
    Nome: "Ibat\xE9",
    Estado: "26"
  },
  {
    ID: "4930",
    Nome: "Ibir\xE1",
    Estado: "26"
  },
  {
    ID: "4931",
    Nome: "Ibirarema",
    Estado: "26"
  },
  {
    ID: "4932",
    Nome: "Ibitinga",
    Estado: "26"
  },
  {
    ID: "4933",
    Nome: "Ibi\xFAna",
    Estado: "26"
  },
  {
    ID: "4934",
    Nome: "Ic\xE9m",
    Estado: "26"
  },
  {
    ID: "4935",
    Nome: "Iep\xEA",
    Estado: "26"
  },
  {
    ID: "4936",
    Nome: "Igara\xE7u do Tiet\xEA",
    Estado: "26"
  },
  {
    ID: "4937",
    Nome: "Igarapava",
    Estado: "26"
  },
  {
    ID: "4938",
    Nome: "Igarat\xE1",
    Estado: "26"
  },
  {
    ID: "4939",
    Nome: "Iguape",
    Estado: "26"
  },
  {
    ID: "4940",
    Nome: "Ilha Comprida",
    Estado: "26"
  },
  {
    ID: "4941",
    Nome: "Ilha Solteira",
    Estado: "26"
  },
  {
    ID: "4942",
    Nome: "Ilhabela",
    Estado: "26"
  },
  {
    ID: "4943",
    Nome: "Indaiatuba",
    Estado: "26"
  },
  {
    ID: "4944",
    Nome: "Indiana",
    Estado: "26"
  },
  {
    ID: "4945",
    Nome: "Indiapor\xE3",
    Estado: "26"
  },
  {
    ID: "4946",
    Nome: "In\xFAbia Paulista",
    Estado: "26"
  },
  {
    ID: "4947",
    Nome: "Ipaussu",
    Estado: "26"
  },
  {
    ID: "4948",
    Nome: "Iper\xF3",
    Estado: "26"
  },
  {
    ID: "4949",
    Nome: "Ipe\xFAna",
    Estado: "26"
  },
  {
    ID: "4950",
    Nome: "Ipigu\xE1",
    Estado: "26"
  },
  {
    ID: "4951",
    Nome: "Iporanga",
    Estado: "26"
  },
  {
    ID: "4952",
    Nome: "Ipu\xE3",
    Estado: "26"
  },
  {
    ID: "4953",
    Nome: "Iracem\xE1polis",
    Estado: "26"
  },
  {
    ID: "4954",
    Nome: "Irapu\xE3",
    Estado: "26"
  },
  {
    ID: "4955",
    Nome: "Irapuru",
    Estado: "26"
  },
  {
    ID: "4956",
    Nome: "Itaber\xE1",
    Estado: "26"
  },
  {
    ID: "4957",
    Nome: "Ita\xED",
    Estado: "26"
  },
  {
    ID: "4958",
    Nome: "Itajobi",
    Estado: "26"
  },
  {
    ID: "4959",
    Nome: "Itaju",
    Estado: "26"
  },
  {
    ID: "4960",
    Nome: "Itanha\xE9m",
    Estado: "26"
  },
  {
    ID: "4961",
    Nome: "Ita\xF3ca",
    Estado: "26"
  },
  {
    ID: "4962",
    Nome: "Itapecerica da Serra",
    Estado: "26"
  },
  {
    ID: "4963",
    Nome: "Itapetininga",
    Estado: "26"
  },
  {
    ID: "4964",
    Nome: "Itapeva",
    Estado: "26"
  },
  {
    ID: "4965",
    Nome: "Itapevi",
    Estado: "26"
  },
  {
    ID: "4966",
    Nome: "Itapira",
    Estado: "26"
  },
  {
    ID: "4967",
    Nome: "Itapirapu\xE3 Paulista",
    Estado: "26"
  },
  {
    ID: "4968",
    Nome: "It\xE1polis",
    Estado: "26"
  },
  {
    ID: "4969",
    Nome: "Itaporanga",
    Estado: "26"
  },
  {
    ID: "4970",
    Nome: "Itapu\xED",
    Estado: "26"
  },
  {
    ID: "4971",
    Nome: "Itapura",
    Estado: "26"
  },
  {
    ID: "4972",
    Nome: "Itaquaquecetuba",
    Estado: "26"
  },
  {
    ID: "4973",
    Nome: "Itarar\xE9",
    Estado: "26"
  },
  {
    ID: "4974",
    Nome: "Itariri",
    Estado: "26"
  },
  {
    ID: "4975",
    Nome: "Itatiba",
    Estado: "26"
  },
  {
    ID: "4976",
    Nome: "Itatinga",
    Estado: "26"
  },
  {
    ID: "4977",
    Nome: "Itirapina",
    Estado: "26"
  },
  {
    ID: "4978",
    Nome: "Itirapu\xE3",
    Estado: "26"
  },
  {
    ID: "4979",
    Nome: "Itobi",
    Estado: "26"
  },
  {
    ID: "4980",
    Nome: "Itu",
    Estado: "26"
  },
  {
    ID: "4981",
    Nome: "Itupeva",
    Estado: "26"
  },
  {
    ID: "4982",
    Nome: "Ituverava",
    Estado: "26"
  },
  {
    ID: "4983",
    Nome: "Jaborandi",
    Estado: "26"
  },
  {
    ID: "4984",
    Nome: "Jaboticabal",
    Estado: "26"
  },
  {
    ID: "4985",
    Nome: "Jacare\xED",
    Estado: "26"
  },
  {
    ID: "4986",
    Nome: "Jaci",
    Estado: "26"
  },
  {
    ID: "4987",
    Nome: "Jacupiranga",
    Estado: "26"
  },
  {
    ID: "4988",
    Nome: "Jaguari\xFAna",
    Estado: "26"
  },
  {
    ID: "4989",
    Nome: "Jales",
    Estado: "26"
  },
  {
    ID: "4990",
    Nome: "Jambeiro",
    Estado: "26"
  },
  {
    ID: "4991",
    Nome: "Jandira",
    Estado: "26"
  },
  {
    ID: "4992",
    Nome: "Jardin\xF3polis",
    Estado: "26"
  },
  {
    ID: "4993",
    Nome: "Jarinu",
    Estado: "26"
  },
  {
    ID: "4994",
    Nome: "Ja\xFA",
    Estado: "26"
  },
  {
    ID: "4995",
    Nome: "Jeriquara",
    Estado: "26"
  },
  {
    ID: "4996",
    Nome: "Joan\xF3polis",
    Estado: "26"
  },
  {
    ID: "4997",
    Nome: "Jo\xE3o Ramalho",
    Estado: "26"
  },
  {
    ID: "4998",
    Nome: "Jos\xE9 Bonif\xE1cio",
    Estado: "26"
  },
  {
    ID: "4999",
    Nome: "J\xFAlio Mesquita",
    Estado: "26"
  },
  {
    ID: "5000",
    Nome: "Jumirim",
    Estado: "26"
  },
  {
    ID: "5001",
    Nome: "Jundia\xED",
    Estado: "26"
  },
  {
    ID: "5002",
    Nome: "Junqueir\xF3polis",
    Estado: "26"
  },
  {
    ID: "5003",
    Nome: "Juqui\xE1",
    Estado: "26"
  },
  {
    ID: "5004",
    Nome: "Juquitiba",
    Estado: "26"
  },
  {
    ID: "5005",
    Nome: "Lagoinha",
    Estado: "26"
  },
  {
    ID: "5006",
    Nome: "Laranjal Paulista",
    Estado: "26"
  },
  {
    ID: "5007",
    Nome: "Lav\xEDnia",
    Estado: "26"
  },
  {
    ID: "5008",
    Nome: "Lavrinhas",
    Estado: "26"
  },
  {
    ID: "5009",
    Nome: "Leme",
    Estado: "26"
  },
  {
    ID: "5010",
    Nome: "Len\xE7\xF3is Paulista",
    Estado: "26"
  },
  {
    ID: "5011",
    Nome: "Limeira",
    Estado: "26"
  },
  {
    ID: "5012",
    Nome: "Lind\xF3ia",
    Estado: "26"
  },
  {
    ID: "5013",
    Nome: "Lins",
    Estado: "26"
  },
  {
    ID: "5014",
    Nome: "Lorena",
    Estado: "26"
  },
  {
    ID: "5015",
    Nome: "Lourdes",
    Estado: "26"
  },
  {
    ID: "5016",
    Nome: "Louveira",
    Estado: "26"
  },
  {
    ID: "5017",
    Nome: "Luc\xE9lia",
    Estado: "26"
  },
  {
    ID: "5018",
    Nome: "Lucian\xF3polis",
    Estado: "26"
  },
  {
    ID: "5019",
    Nome: "Lu\xEDs Ant\xF4nio",
    Estado: "26"
  },
  {
    ID: "5020",
    Nome: "Luizi\xE2nia",
    Estado: "26"
  },
  {
    ID: "5021",
    Nome: "Lup\xE9rcio",
    Estado: "26"
  },
  {
    ID: "5022",
    Nome: "Lut\xE9cia",
    Estado: "26"
  },
  {
    ID: "5023",
    Nome: "Macatuba",
    Estado: "26"
  },
  {
    ID: "5024",
    Nome: "Macaubal",
    Estado: "26"
  },
  {
    ID: "5025",
    Nome: "Maced\xF4nia",
    Estado: "26"
  },
  {
    ID: "5026",
    Nome: "Magda",
    Estado: "26"
  },
  {
    ID: "5027",
    Nome: "Mairinque",
    Estado: "26"
  },
  {
    ID: "5028",
    Nome: "Mairipor\xE3",
    Estado: "26"
  },
  {
    ID: "5029",
    Nome: "Manduri",
    Estado: "26"
  },
  {
    ID: "5030",
    Nome: "Marab\xE1 Paulista",
    Estado: "26"
  },
  {
    ID: "5031",
    Nome: "Maraca\xED",
    Estado: "26"
  },
  {
    ID: "5032",
    Nome: "Marapoama",
    Estado: "26"
  },
  {
    ID: "5033",
    Nome: "Mari\xE1polis",
    Estado: "26"
  },
  {
    ID: "5034",
    Nome: "Mar\xEDlia",
    Estado: "26"
  },
  {
    ID: "5035",
    Nome: "Marin\xF3polis",
    Estado: "26"
  },
  {
    ID: "5036",
    Nome: "Martin\xF3polis",
    Estado: "26"
  },
  {
    ID: "5037",
    Nome: "Mat\xE3o",
    Estado: "26"
  },
  {
    ID: "5038",
    Nome: "Mau\xE1",
    Estado: "26"
  },
  {
    ID: "5039",
    Nome: "Mendon\xE7a",
    Estado: "26"
  },
  {
    ID: "5040",
    Nome: "Meridiano",
    Estado: "26"
  },
  {
    ID: "5041",
    Nome: "Mes\xF3polis",
    Estado: "26"
  },
  {
    ID: "5042",
    Nome: "Miguel\xF3polis",
    Estado: "26"
  },
  {
    ID: "5043",
    Nome: "Mineiros do Tiet\xEA",
    Estado: "26"
  },
  {
    ID: "5044",
    Nome: "Mira Estrela",
    Estado: "26"
  },
  {
    ID: "5045",
    Nome: "Miracatu",
    Estado: "26"
  },
  {
    ID: "5046",
    Nome: "Mirand\xF3polis",
    Estado: "26"
  },
  {
    ID: "5047",
    Nome: "Mirante do Paranapanema",
    Estado: "26"
  },
  {
    ID: "5048",
    Nome: "Mirassol",
    Estado: "26"
  },
  {
    ID: "5049",
    Nome: "Mirassol\xE2ndia",
    Estado: "26"
  },
  {
    ID: "5050",
    Nome: "Mococa",
    Estado: "26"
  },
  {
    ID: "5051",
    Nome: "Mogi das Cruzes",
    Estado: "26"
  },
  {
    ID: "5052",
    Nome: "Mogi Gua\xE7u",
    Estado: "26"
  },
  {
    ID: "5053",
    Nome: "Moji Mirim",
    Estado: "26"
  },
  {
    ID: "5054",
    Nome: "Mombuca",
    Estado: "26"
  },
  {
    ID: "5055",
    Nome: "Mon\xE7\xF5es",
    Estado: "26"
  },
  {
    ID: "5056",
    Nome: "Mongagu\xE1",
    Estado: "26"
  },
  {
    ID: "5057",
    Nome: "Monte Alegre do Sul",
    Estado: "26"
  },
  {
    ID: "5058",
    Nome: "Monte Alto",
    Estado: "26"
  },
  {
    ID: "5059",
    Nome: "Monte Apraz\xEDvel",
    Estado: "26"
  },
  {
    ID: "5060",
    Nome: "Monte Azul Paulista",
    Estado: "26"
  },
  {
    ID: "5061",
    Nome: "Monte Castelo",
    Estado: "26"
  },
  {
    ID: "5062",
    Nome: "Monte Mor",
    Estado: "26"
  },
  {
    ID: "5063",
    Nome: "Monteiro Lobato",
    Estado: "26"
  },
  {
    ID: "5064",
    Nome: "Morro Agudo",
    Estado: "26"
  },
  {
    ID: "5065",
    Nome: "Morungaba",
    Estado: "26"
  },
  {
    ID: "5066",
    Nome: "Motuca",
    Estado: "26"
  },
  {
    ID: "5067",
    Nome: "Murutinga do Sul",
    Estado: "26"
  },
  {
    ID: "5068",
    Nome: "Nantes",
    Estado: "26"
  },
  {
    ID: "5069",
    Nome: "Narandiba",
    Estado: "26"
  },
  {
    ID: "5070",
    Nome: "Natividade da Serra",
    Estado: "26"
  },
  {
    ID: "5071",
    Nome: "Nazar\xE9 Paulista",
    Estado: "26"
  },
  {
    ID: "5072",
    Nome: "Neves Paulista",
    Estado: "26"
  },
  {
    ID: "5073",
    Nome: "Nhandeara",
    Estado: "26"
  },
  {
    ID: "5074",
    Nome: "Nipo\xE3",
    Estado: "26"
  },
  {
    ID: "5075",
    Nome: "Nova Alian\xE7a",
    Estado: "26"
  },
  {
    ID: "5076",
    Nome: "Nova Campina",
    Estado: "26"
  },
  {
    ID: "5077",
    Nome: "Nova Cana\xE3 Paulista",
    Estado: "26"
  },
  {
    ID: "5078",
    Nome: "Nova Castilho",
    Estado: "26"
  },
  {
    ID: "5079",
    Nome: "Nova Europa",
    Estado: "26"
  },
  {
    ID: "5080",
    Nome: "Nova Granada",
    Estado: "26"
  },
  {
    ID: "5081",
    Nome: "Nova Guataporanga",
    Estado: "26"
  },
  {
    ID: "5082",
    Nome: "Nova Independ\xEAncia",
    Estado: "26"
  },
  {
    ID: "5083",
    Nome: "Nova Luzit\xE2nia",
    Estado: "26"
  },
  {
    ID: "5084",
    Nome: "Nova Odessa",
    Estado: "26"
  },
  {
    ID: "5085",
    Nome: "Novais",
    Estado: "26"
  },
  {
    ID: "5086",
    Nome: "Novo Horizonte",
    Estado: "26"
  },
  {
    ID: "5087",
    Nome: "Nuporanga",
    Estado: "26"
  },
  {
    ID: "5088",
    Nome: "Ocau\xE7u",
    Estado: "26"
  },
  {
    ID: "5089",
    Nome: "\xD3leo",
    Estado: "26"
  },
  {
    ID: "5090",
    Nome: "Ol\xEDmpia",
    Estado: "26"
  },
  {
    ID: "5091",
    Nome: "Onda Verde",
    Estado: "26"
  },
  {
    ID: "5092",
    Nome: "Oriente",
    Estado: "26"
  },
  {
    ID: "5093",
    Nome: "Orindi\xFAva",
    Estado: "26"
  },
  {
    ID: "5094",
    Nome: "Orl\xE2ndia",
    Estado: "26"
  },
  {
    ID: "5095",
    Nome: "Osasco",
    Estado: "26"
  },
  {
    ID: "5096",
    Nome: "Oscar Bressane",
    Estado: "26"
  },
  {
    ID: "5097",
    Nome: "Osvaldo Cruz",
    Estado: "26"
  },
  {
    ID: "5098",
    Nome: "Ourinhos",
    Estado: "26"
  },
  {
    ID: "5099",
    Nome: "Ouro Verde",
    Estado: "26"
  },
  {
    ID: "5100",
    Nome: "Ouroeste",
    Estado: "26"
  },
  {
    ID: "5101",
    Nome: "Pacaembu",
    Estado: "26"
  },
  {
    ID: "5102",
    Nome: "Palestina",
    Estado: "26"
  },
  {
    ID: "5103",
    Nome: "Palmares Paulista",
    Estado: "26"
  },
  {
    ID: "5104",
    Nome: "Palmeira d`Oeste",
    Estado: "26"
  },
  {
    ID: "5105",
    Nome: "Palmital",
    Estado: "26"
  },
  {
    ID: "5106",
    Nome: "Panorama",
    Estado: "26"
  },
  {
    ID: "5107",
    Nome: "Paragua\xE7u Paulista",
    Estado: "26"
  },
  {
    ID: "5108",
    Nome: "Paraibuna",
    Estado: "26"
  },
  {
    ID: "5109",
    Nome: "Para\xEDso",
    Estado: "26"
  },
  {
    ID: "5110",
    Nome: "Paranapanema",
    Estado: "26"
  },
  {
    ID: "5111",
    Nome: "Paranapu\xE3",
    Estado: "26"
  },
  {
    ID: "5112",
    Nome: "Parapu\xE3",
    Estado: "26"
  },
  {
    ID: "5113",
    Nome: "Pardinho",
    Estado: "26"
  },
  {
    ID: "5114",
    Nome: "Pariquera-A\xE7u",
    Estado: "26"
  },
  {
    ID: "5115",
    Nome: "Parisi",
    Estado: "26"
  },
  {
    ID: "5116",
    Nome: "Patroc\xEDnio Paulista",
    Estado: "26"
  },
  {
    ID: "5117",
    Nome: "Paulic\xE9ia",
    Estado: "26"
  },
  {
    ID: "5118",
    Nome: "Paul\xEDnia",
    Estado: "26"
  },
  {
    ID: "5119",
    Nome: "Paulist\xE2nia",
    Estado: "26"
  },
  {
    ID: "5120",
    Nome: "Paulo de Faria",
    Estado: "26"
  },
  {
    ID: "5121",
    Nome: "Pederneiras",
    Estado: "26"
  },
  {
    ID: "5122",
    Nome: "Pedra Bela",
    Estado: "26"
  },
  {
    ID: "5123",
    Nome: "Pedran\xF3polis",
    Estado: "26"
  },
  {
    ID: "5124",
    Nome: "Pedregulho",
    Estado: "26"
  },
  {
    ID: "5125",
    Nome: "Pedreira",
    Estado: "26"
  },
  {
    ID: "5126",
    Nome: "Pedrinhas Paulista",
    Estado: "26"
  },
  {
    ID: "5127",
    Nome: "Pedro de Toledo",
    Estado: "26"
  },
  {
    ID: "5128",
    Nome: "Pen\xE1polis",
    Estado: "26"
  },
  {
    ID: "5129",
    Nome: "Pereira Barreto",
    Estado: "26"
  },
  {
    ID: "5130",
    Nome: "Pereiras",
    Estado: "26"
  },
  {
    ID: "5131",
    Nome: "Peru\xEDbe",
    Estado: "26"
  },
  {
    ID: "5132",
    Nome: "Piacatu",
    Estado: "26"
  },
  {
    ID: "5133",
    Nome: "Piedade",
    Estado: "26"
  },
  {
    ID: "5134",
    Nome: "Pilar do Sul",
    Estado: "26"
  },
  {
    ID: "5135",
    Nome: "Pindamonhangaba",
    Estado: "26"
  },
  {
    ID: "5136",
    Nome: "Pindorama",
    Estado: "26"
  },
  {
    ID: "5137",
    Nome: "Pinhalzinho",
    Estado: "26"
  },
  {
    ID: "5138",
    Nome: "Piquerobi",
    Estado: "26"
  },
  {
    ID: "5139",
    Nome: "Piquete",
    Estado: "26"
  },
  {
    ID: "5140",
    Nome: "Piracaia",
    Estado: "26"
  },
  {
    ID: "5141",
    Nome: "Piracicaba",
    Estado: "26"
  },
  {
    ID: "5142",
    Nome: "Piraju",
    Estado: "26"
  },
  {
    ID: "5143",
    Nome: "Piraju\xED",
    Estado: "26"
  },
  {
    ID: "5144",
    Nome: "Pirangi",
    Estado: "26"
  },
  {
    ID: "5145",
    Nome: "Pirapora do Bom Jesus",
    Estado: "26"
  },
  {
    ID: "5146",
    Nome: "Pirapozinho",
    Estado: "26"
  },
  {
    ID: "5147",
    Nome: "Pirassununga",
    Estado: "26"
  },
  {
    ID: "5148",
    Nome: "Piratininga",
    Estado: "26"
  },
  {
    ID: "5149",
    Nome: "Pitangueiras",
    Estado: "26"
  },
  {
    ID: "5150",
    Nome: "Planalto",
    Estado: "26"
  },
  {
    ID: "5151",
    Nome: "Platina",
    Estado: "26"
  },
  {
    ID: "5152",
    Nome: "Po\xE1",
    Estado: "26"
  },
  {
    ID: "5153",
    Nome: "Poloni",
    Estado: "26"
  },
  {
    ID: "5154",
    Nome: "Pomp\xE9ia",
    Estado: "26"
  },
  {
    ID: "5155",
    Nome: "Ponga\xED",
    Estado: "26"
  },
  {
    ID: "5156",
    Nome: "Pontal",
    Estado: "26"
  },
  {
    ID: "5157",
    Nome: "Pontalinda",
    Estado: "26"
  },
  {
    ID: "5158",
    Nome: "Pontes Gestal",
    Estado: "26"
  },
  {
    ID: "5159",
    Nome: "Populina",
    Estado: "26"
  },
  {
    ID: "5160",
    Nome: "Porangaba",
    Estado: "26"
  },
  {
    ID: "5161",
    Nome: "Porto Feliz",
    Estado: "26"
  },
  {
    ID: "5162",
    Nome: "Porto Ferreira",
    Estado: "26"
  },
  {
    ID: "5163",
    Nome: "Potim",
    Estado: "26"
  },
  {
    ID: "5164",
    Nome: "Potirendaba",
    Estado: "26"
  },
  {
    ID: "5165",
    Nome: "Pracinha",
    Estado: "26"
  },
  {
    ID: "5166",
    Nome: "Prad\xF3polis",
    Estado: "26"
  },
  {
    ID: "5167",
    Nome: "Praia Grande",
    Estado: "26"
  },
  {
    ID: "5168",
    Nome: "Prat\xE2nia",
    Estado: "26"
  },
  {
    ID: "5169",
    Nome: "Presidente Alves",
    Estado: "26"
  },
  {
    ID: "5170",
    Nome: "Presidente Bernardes",
    Estado: "26"
  },
  {
    ID: "5171",
    Nome: "Presidente Epit\xE1cio",
    Estado: "26"
  },
  {
    ID: "5172",
    Nome: "Presidente Prudente",
    Estado: "26"
  },
  {
    ID: "5173",
    Nome: "Presidente Venceslau",
    Estado: "26"
  },
  {
    ID: "5174",
    Nome: "Promiss\xE3o",
    Estado: "26"
  },
  {
    ID: "5175",
    Nome: "Quadra",
    Estado: "26"
  },
  {
    ID: "5176",
    Nome: "Quat\xE1",
    Estado: "26"
  },
  {
    ID: "5177",
    Nome: "Queiroz",
    Estado: "26"
  },
  {
    ID: "5178",
    Nome: "Queluz",
    Estado: "26"
  },
  {
    ID: "5179",
    Nome: "Quintana",
    Estado: "26"
  },
  {
    ID: "5180",
    Nome: "Rafard",
    Estado: "26"
  },
  {
    ID: "5181",
    Nome: "Rancharia",
    Estado: "26"
  },
  {
    ID: "5182",
    Nome: "Reden\xE7\xE3o da Serra",
    Estado: "26"
  },
  {
    ID: "5183",
    Nome: "Regente Feij\xF3",
    Estado: "26"
  },
  {
    ID: "5184",
    Nome: "Regin\xF3polis",
    Estado: "26"
  },
  {
    ID: "5185",
    Nome: "Registro",
    Estado: "26"
  },
  {
    ID: "5186",
    Nome: "Restinga",
    Estado: "26"
  },
  {
    ID: "5187",
    Nome: "Ribeira",
    Estado: "26"
  },
  {
    ID: "5188",
    Nome: "Ribeir\xE3o Bonito",
    Estado: "26"
  },
  {
    ID: "5189",
    Nome: "Ribeir\xE3o Branco",
    Estado: "26"
  },
  {
    ID: "5190",
    Nome: "Ribeir\xE3o Corrente",
    Estado: "26"
  },
  {
    ID: "5191",
    Nome: "Ribeir\xE3o do Sul",
    Estado: "26"
  },
  {
    ID: "5192",
    Nome: "Ribeir\xE3o dos \xCDndios",
    Estado: "26"
  },
  {
    ID: "5193",
    Nome: "Ribeir\xE3o Grande",
    Estado: "26"
  },
  {
    ID: "5194",
    Nome: "Ribeir\xE3o Pires",
    Estado: "26"
  },
  {
    ID: "5195",
    Nome: "Ribeir\xE3o Preto",
    Estado: "26"
  },
  {
    ID: "5196",
    Nome: "Rifaina",
    Estado: "26"
  },
  {
    ID: "5197",
    Nome: "Rinc\xE3o",
    Estado: "26"
  },
  {
    ID: "5198",
    Nome: "Rin\xF3polis",
    Estado: "26"
  },
  {
    ID: "5199",
    Nome: "Rio Claro",
    Estado: "26"
  },
  {
    ID: "5200",
    Nome: "Rio das Pedras",
    Estado: "26"
  },
  {
    ID: "5201",
    Nome: "Rio Grande da Serra",
    Estado: "26"
  },
  {
    ID: "5202",
    Nome: "Riol\xE2ndia",
    Estado: "26"
  },
  {
    ID: "5203",
    Nome: "Riversul",
    Estado: "26"
  },
  {
    ID: "5204",
    Nome: "Rosana",
    Estado: "26"
  },
  {
    ID: "5205",
    Nome: "Roseira",
    Estado: "26"
  },
  {
    ID: "5206",
    Nome: "Rubi\xE1cea",
    Estado: "26"
  },
  {
    ID: "5207",
    Nome: "Rubin\xE9ia",
    Estado: "26"
  },
  {
    ID: "5208",
    Nome: "Sabino",
    Estado: "26"
  },
  {
    ID: "5209",
    Nome: "Sagres",
    Estado: "26"
  },
  {
    ID: "5210",
    Nome: "Sales",
    Estado: "26"
  },
  {
    ID: "5211",
    Nome: "Sales Oliveira",
    Estado: "26"
  },
  {
    ID: "5212",
    Nome: "Sales\xF3polis",
    Estado: "26"
  },
  {
    ID: "5213",
    Nome: "Salmour\xE3o",
    Estado: "26"
  },
  {
    ID: "5214",
    Nome: "Saltinho",
    Estado: "26"
  },
  {
    ID: "5215",
    Nome: "Salto",
    Estado: "26"
  },
  {
    ID: "5216",
    Nome: "Salto de Pirapora",
    Estado: "26"
  },
  {
    ID: "5217",
    Nome: "Salto Grande",
    Estado: "26"
  },
  {
    ID: "5218",
    Nome: "Sandovalina",
    Estado: "26"
  },
  {
    ID: "5219",
    Nome: "Santa Ad\xE9lia",
    Estado: "26"
  },
  {
    ID: "5220",
    Nome: "Santa Albertina",
    Estado: "26"
  },
  {
    ID: "5221",
    Nome: "Santa B\xE1rbara d`Oeste",
    Estado: "26"
  },
  {
    ID: "5222",
    Nome: "Santa Branca",
    Estado: "26"
  },
  {
    ID: "5223",
    Nome: "Santa Clara d`Oeste",
    Estado: "26"
  },
  {
    ID: "5224",
    Nome: "Santa Cruz da Concei\xE7\xE3o",
    Estado: "26"
  },
  {
    ID: "5225",
    Nome: "Santa Cruz da Esperan\xE7a",
    Estado: "26"
  },
  {
    ID: "5226",
    Nome: "Santa Cruz das Palmeiras",
    Estado: "26"
  },
  {
    ID: "5227",
    Nome: "Santa Cruz do Rio Pardo",
    Estado: "26"
  },
  {
    ID: "5228",
    Nome: "Santa Ernestina",
    Estado: "26"
  },
  {
    ID: "5229",
    Nome: "Santa F\xE9 do Sul",
    Estado: "26"
  },
  {
    ID: "5230",
    Nome: "Santa Gertrudes",
    Estado: "26"
  },
  {
    ID: "5231",
    Nome: "Santa Isabel",
    Estado: "26"
  },
  {
    ID: "5232",
    Nome: "Santa L\xFAcia",
    Estado: "26"
  },
  {
    ID: "5233",
    Nome: "Santa Maria da Serra",
    Estado: "26"
  },
  {
    ID: "5234",
    Nome: "Santa Mercedes",
    Estado: "26"
  },
  {
    ID: "5235",
    Nome: "Santa Rita d`Oeste",
    Estado: "26"
  },
  {
    ID: "5236",
    Nome: "Santa Rita do Passa Quatro",
    Estado: "26"
  },
  {
    ID: "5237",
    Nome: "Santa Rosa de Viterbo",
    Estado: "26"
  },
  {
    ID: "5238",
    Nome: "Santa Salete",
    Estado: "26"
  },
  {
    ID: "5239",
    Nome: "Santana da Ponte Pensa",
    Estado: "26"
  },
  {
    ID: "5240",
    Nome: "Santana de Parna\xEDba",
    Estado: "26"
  },
  {
    ID: "5241",
    Nome: "Santo Anast\xE1cio",
    Estado: "26"
  },
  {
    ID: "5242",
    Nome: "Santo Andr\xE9",
    Estado: "26"
  },
  {
    ID: "5243",
    Nome: "Santo Ant\xF4nio da Alegria",
    Estado: "26"
  },
  {
    ID: "5244",
    Nome: "Santo Ant\xF4nio de Posse",
    Estado: "26"
  },
  {
    ID: "5245",
    Nome: "Santo Ant\xF4nio do Aracangu\xE1",
    Estado: "26"
  },
  {
    ID: "5246",
    Nome: "Santo Ant\xF4nio do Jardim",
    Estado: "26"
  },
  {
    ID: "5247",
    Nome: "Santo Ant\xF4nio do Pinhal",
    Estado: "26"
  },
  {
    ID: "5248",
    Nome: "Santo Expedito",
    Estado: "26"
  },
  {
    ID: "5249",
    Nome: "Sant\xF3polis do Aguape\xED",
    Estado: "26"
  },
  {
    ID: "5250",
    Nome: "Santos",
    Estado: "26"
  },
  {
    ID: "5251",
    Nome: "S\xE3o Bento do Sapuca\xED",
    Estado: "26"
  },
  {
    ID: "5252",
    Nome: "S\xE3o Bernardo do Campo",
    Estado: "26"
  },
  {
    ID: "5253",
    Nome: "S\xE3o Caetano do Sul",
    Estado: "26"
  },
  {
    ID: "5254",
    Nome: "S\xE3o Carlos",
    Estado: "26"
  },
  {
    ID: "5255",
    Nome: "S\xE3o Francisco",
    Estado: "26"
  },
  {
    ID: "5256",
    Nome: "S\xE3o Jo\xE3o da Boa Vista",
    Estado: "26"
  },
  {
    ID: "5257",
    Nome: "S\xE3o Jo\xE3o das Duas Pontes",
    Estado: "26"
  },
  {
    ID: "5258",
    Nome: "S\xE3o Jo\xE3o de Iracema",
    Estado: "26"
  },
  {
    ID: "5259",
    Nome: "S\xE3o Jo\xE3o do Pau d`Alho",
    Estado: "26"
  },
  {
    ID: "5260",
    Nome: "S\xE3o Joaquim da Barra",
    Estado: "26"
  },
  {
    ID: "5261",
    Nome: "S\xE3o Jos\xE9 da Bela Vista",
    Estado: "26"
  },
  {
    ID: "5262",
    Nome: "S\xE3o Jos\xE9 do Barreiro",
    Estado: "26"
  },
  {
    ID: "5263",
    Nome: "S\xE3o Jos\xE9 do Rio Pardo",
    Estado: "26"
  },
  {
    ID: "5264",
    Nome: "S\xE3o Jos\xE9 do Rio Preto",
    Estado: "26"
  },
  {
    ID: "5265",
    Nome: "S\xE3o Jos\xE9 dos Campos",
    Estado: "26"
  },
  {
    ID: "5266",
    Nome: "S\xE3o Louren\xE7o da Serra",
    Estado: "26"
  },
  {
    ID: "5267",
    Nome: "S\xE3o Lu\xEDs do Paraitinga",
    Estado: "26"
  },
  {
    ID: "5268",
    Nome: "S\xE3o Manuel",
    Estado: "26"
  },
  {
    ID: "5269",
    Nome: "S\xE3o Miguel Arcanjo",
    Estado: "26"
  },
  {
    ID: "5270",
    Nome: "S\xE3o Paulo",
    Estado: "26"
  },
  {
    ID: "5271",
    Nome: "S\xE3o Pedro",
    Estado: "26"
  },
  {
    ID: "5272",
    Nome: "S\xE3o Pedro do Turvo",
    Estado: "26"
  },
  {
    ID: "5273",
    Nome: "S\xE3o Roque",
    Estado: "26"
  },
  {
    ID: "5274",
    Nome: "S\xE3o Sebasti\xE3o",
    Estado: "26"
  },
  {
    ID: "5275",
    Nome: "S\xE3o Sebasti\xE3o da Grama",
    Estado: "26"
  },
  {
    ID: "5276",
    Nome: "S\xE3o Sim\xE3o",
    Estado: "26"
  },
  {
    ID: "5277",
    Nome: "S\xE3o Vicente",
    Estado: "26"
  },
  {
    ID: "5278",
    Nome: "Sarapu\xED",
    Estado: "26"
  },
  {
    ID: "5279",
    Nome: "Sarutai\xE1",
    Estado: "26"
  },
  {
    ID: "5280",
    Nome: "Sebastian\xF3polis do Sul",
    Estado: "26"
  },
  {
    ID: "5281",
    Nome: "Serra Azul",
    Estado: "26"
  },
  {
    ID: "5282",
    Nome: "Serra Negra",
    Estado: "26"
  },
  {
    ID: "5283",
    Nome: "Serrana",
    Estado: "26"
  },
  {
    ID: "5284",
    Nome: "Sert\xE3ozinho",
    Estado: "26"
  },
  {
    ID: "5285",
    Nome: "Sete Barras",
    Estado: "26"
  },
  {
    ID: "5286",
    Nome: "Sever\xEDnia",
    Estado: "26"
  },
  {
    ID: "5287",
    Nome: "Silveiras",
    Estado: "26"
  },
  {
    ID: "5288",
    Nome: "Socorro",
    Estado: "26"
  },
  {
    ID: "5289",
    Nome: "Sorocaba",
    Estado: "26"
  },
  {
    ID: "5290",
    Nome: "Sud Mennucci",
    Estado: "26"
  },
  {
    ID: "5291",
    Nome: "Sumar\xE9",
    Estado: "26"
  },
  {
    ID: "5292",
    Nome: "Suzan\xE1polis",
    Estado: "26"
  },
  {
    ID: "5293",
    Nome: "Suzano",
    Estado: "26"
  },
  {
    ID: "5294",
    Nome: "Tabapu\xE3",
    Estado: "26"
  },
  {
    ID: "5295",
    Nome: "Tabatinga",
    Estado: "26"
  },
  {
    ID: "5296",
    Nome: "Tabo\xE3o da Serra",
    Estado: "26"
  },
  {
    ID: "5297",
    Nome: "Taciba",
    Estado: "26"
  },
  {
    ID: "5298",
    Nome: "Tagua\xED",
    Estado: "26"
  },
  {
    ID: "5299",
    Nome: "Taia\xE7u",
    Estado: "26"
  },
  {
    ID: "5300",
    Nome: "Tai\xFAva",
    Estado: "26"
  },
  {
    ID: "5301",
    Nome: "Tamba\xFA",
    Estado: "26"
  },
  {
    ID: "5302",
    Nome: "Tanabi",
    Estado: "26"
  },
  {
    ID: "5303",
    Nome: "Tapira\xED",
    Estado: "26"
  },
  {
    ID: "5304",
    Nome: "Tapiratiba",
    Estado: "26"
  },
  {
    ID: "5305",
    Nome: "Taquaral",
    Estado: "26"
  },
  {
    ID: "5306",
    Nome: "Taquaritinga",
    Estado: "26"
  },
  {
    ID: "5307",
    Nome: "Taquarituba",
    Estado: "26"
  },
  {
    ID: "5308",
    Nome: "Taquariva\xED",
    Estado: "26"
  },
  {
    ID: "5309",
    Nome: "Tarabai",
    Estado: "26"
  },
  {
    ID: "5310",
    Nome: "Tarum\xE3",
    Estado: "26"
  },
  {
    ID: "5311",
    Nome: "Tatu\xED",
    Estado: "26"
  },
  {
    ID: "5312",
    Nome: "Taubat\xE9",
    Estado: "26"
  },
  {
    ID: "5313",
    Nome: "Tejup\xE1",
    Estado: "26"
  },
  {
    ID: "5314",
    Nome: "Teodoro Sampaio",
    Estado: "26"
  },
  {
    ID: "5315",
    Nome: "Terra Roxa",
    Estado: "26"
  },
  {
    ID: "5316",
    Nome: "Tiet\xEA",
    Estado: "26"
  },
  {
    ID: "5317",
    Nome: "Timburi",
    Estado: "26"
  },
  {
    ID: "5318",
    Nome: "Torre de Pedra",
    Estado: "26"
  },
  {
    ID: "5319",
    Nome: "Torrinha",
    Estado: "26"
  },
  {
    ID: "5320",
    Nome: "Trabiju",
    Estado: "26"
  },
  {
    ID: "5321",
    Nome: "Trememb\xE9",
    Estado: "26"
  },
  {
    ID: "5322",
    Nome: "Tr\xEAs Fronteiras",
    Estado: "26"
  },
  {
    ID: "5323",
    Nome: "Tuiuti",
    Estado: "26"
  },
  {
    ID: "5324",
    Nome: "Tup\xE3",
    Estado: "26"
  },
  {
    ID: "5325",
    Nome: "Tupi Paulista",
    Estado: "26"
  },
  {
    ID: "5326",
    Nome: "Turi\xFAba",
    Estado: "26"
  },
  {
    ID: "5327",
    Nome: "Turmalina",
    Estado: "26"
  },
  {
    ID: "5328",
    Nome: "Ubarana",
    Estado: "26"
  },
  {
    ID: "5329",
    Nome: "Ubatuba",
    Estado: "26"
  },
  {
    ID: "5330",
    Nome: "Ubirajara",
    Estado: "26"
  },
  {
    ID: "5331",
    Nome: "Uchoa",
    Estado: "26"
  },
  {
    ID: "5332",
    Nome: "Uni\xE3o Paulista",
    Estado: "26"
  },
  {
    ID: "5333",
    Nome: "Ur\xE2nia",
    Estado: "26"
  },
  {
    ID: "5334",
    Nome: "Uru",
    Estado: "26"
  },
  {
    ID: "5335",
    Nome: "Urup\xEAs",
    Estado: "26"
  },
  {
    ID: "5336",
    Nome: "Valentim Gentil",
    Estado: "26"
  },
  {
    ID: "5337",
    Nome: "Valinhos",
    Estado: "26"
  },
  {
    ID: "5338",
    Nome: "Valpara\xEDso",
    Estado: "26"
  },
  {
    ID: "5339",
    Nome: "Vargem",
    Estado: "26"
  },
  {
    ID: "5340",
    Nome: "Vargem Grande do Sul",
    Estado: "26"
  },
  {
    ID: "5341",
    Nome: "Vargem Grande Paulista",
    Estado: "26"
  },
  {
    ID: "5342",
    Nome: "V\xE1rzea Paulista",
    Estado: "26"
  },
  {
    ID: "5343",
    Nome: "Vera Cruz",
    Estado: "26"
  },
  {
    ID: "5344",
    Nome: "Vinhedo",
    Estado: "26"
  },
  {
    ID: "5345",
    Nome: "Viradouro",
    Estado: "26"
  },
  {
    ID: "5346",
    Nome: "Vista Alegre do Alto",
    Estado: "26"
  },
  {
    ID: "5347",
    Nome: "Vit\xF3ria Brasil",
    Estado: "26"
  },
  {
    ID: "5348",
    Nome: "Votorantim",
    Estado: "26"
  },
  {
    ID: "5349",
    Nome: "Votuporanga",
    Estado: "26"
  },
  {
    ID: "5350",
    Nome: "Zacarias",
    Estado: "26"
  },
  {
    ID: "5351",
    Nome: "Amparo de S\xE3o Francisco",
    Estado: "25"
  },
  {
    ID: "5352",
    Nome: "Aquidab\xE3",
    Estado: "25"
  },
  {
    ID: "5353",
    Nome: "Aracaju",
    Estado: "25"
  },
  {
    ID: "5354",
    Nome: "Arau\xE1",
    Estado: "25"
  },
  {
    ID: "5355",
    Nome: "Areia Branca",
    Estado: "25"
  },
  {
    ID: "5356",
    Nome: "Barra dos Coqueiros",
    Estado: "25"
  },
  {
    ID: "5357",
    Nome: "Boquim",
    Estado: "25"
  },
  {
    ID: "5358",
    Nome: "Brejo Grande",
    Estado: "25"
  },
  {
    ID: "5359",
    Nome: "Campo do Brito",
    Estado: "25"
  },
  {
    ID: "5360",
    Nome: "Canhoba",
    Estado: "25"
  },
  {
    ID: "5361",
    Nome: "Canind\xE9 de S\xE3o Francisco",
    Estado: "25"
  },
  {
    ID: "5362",
    Nome: "Capela",
    Estado: "25"
  },
  {
    ID: "5363",
    Nome: "Carira",
    Estado: "25"
  },
  {
    ID: "5364",
    Nome: "Carm\xF3polis",
    Estado: "25"
  },
  {
    ID: "5365",
    Nome: "Cedro de S\xE3o Jo\xE3o",
    Estado: "25"
  },
  {
    ID: "5366",
    Nome: "Cristin\xE1polis",
    Estado: "25"
  },
  {
    ID: "5367",
    Nome: "Cumbe",
    Estado: "25"
  },
  {
    ID: "5368",
    Nome: "Divina Pastora",
    Estado: "25"
  },
  {
    ID: "5369",
    Nome: "Est\xE2ncia",
    Estado: "25"
  },
  {
    ID: "5370",
    Nome: "Feira Nova",
    Estado: "25"
  },
  {
    ID: "5371",
    Nome: "Frei Paulo",
    Estado: "25"
  },
  {
    ID: "5372",
    Nome: "Gararu",
    Estado: "25"
  },
  {
    ID: "5373",
    Nome: "General Maynard",
    Estado: "25"
  },
  {
    ID: "5374",
    Nome: "Gracho Cardoso",
    Estado: "25"
  },
  {
    ID: "5375",
    Nome: "Ilha das Flores",
    Estado: "25"
  },
  {
    ID: "5376",
    Nome: "Indiaroba",
    Estado: "25"
  },
  {
    ID: "5377",
    Nome: "Itabaiana",
    Estado: "25"
  },
  {
    ID: "5378",
    Nome: "Itabaianinha",
    Estado: "25"
  },
  {
    ID: "5379",
    Nome: "Itabi",
    Estado: "25"
  },
  {
    ID: "5380",
    Nome: "Itaporanga d`Ajuda",
    Estado: "25"
  },
  {
    ID: "5381",
    Nome: "Japaratuba",
    Estado: "25"
  },
  {
    ID: "5382",
    Nome: "Japoat\xE3",
    Estado: "25"
  },
  {
    ID: "5383",
    Nome: "Lagarto",
    Estado: "25"
  },
  {
    ID: "5384",
    Nome: "Laranjeiras",
    Estado: "25"
  },
  {
    ID: "5385",
    Nome: "Macambira",
    Estado: "25"
  },
  {
    ID: "5386",
    Nome: "Malhada dos Bois",
    Estado: "25"
  },
  {
    ID: "5387",
    Nome: "Malhador",
    Estado: "25"
  },
  {
    ID: "5388",
    Nome: "Maruim",
    Estado: "25"
  },
  {
    ID: "5389",
    Nome: "Moita Bonita",
    Estado: "25"
  },
  {
    ID: "5390",
    Nome: "Monte Alegre de Sergipe",
    Estado: "25"
  },
  {
    ID: "5391",
    Nome: "Muribeca",
    Estado: "25"
  },
  {
    ID: "5392",
    Nome: "Ne\xF3polis",
    Estado: "25"
  },
  {
    ID: "5393",
    Nome: "Nossa Senhora Aparecida",
    Estado: "25"
  },
  {
    ID: "5394",
    Nome: "Nossa Senhora da Gl\xF3ria",
    Estado: "25"
  },
  {
    ID: "5395",
    Nome: "Nossa Senhora das Dores",
    Estado: "25"
  },
  {
    ID: "5396",
    Nome: "Nossa Senhora de Lourdes",
    Estado: "25"
  },
  {
    ID: "5397",
    Nome: "Nossa Senhora do Socorro",
    Estado: "25"
  },
  {
    ID: "5398",
    Nome: "Pacatuba",
    Estado: "25"
  },
  {
    ID: "5399",
    Nome: "Pedra Mole",
    Estado: "25"
  },
  {
    ID: "5400",
    Nome: "Pedrinhas",
    Estado: "25"
  },
  {
    ID: "5401",
    Nome: "Pinh\xE3o",
    Estado: "25"
  },
  {
    ID: "5402",
    Nome: "Pirambu",
    Estado: "25"
  },
  {
    ID: "5403",
    Nome: "Po\xE7o Redondo",
    Estado: "25"
  },
  {
    ID: "5404",
    Nome: "Po\xE7o Verde",
    Estado: "25"
  },
  {
    ID: "5405",
    Nome: "Porto da Folha",
    Estado: "25"
  },
  {
    ID: "5406",
    Nome: "Propri\xE1",
    Estado: "25"
  },
  {
    ID: "5407",
    Nome: "Riach\xE3o do Dantas",
    Estado: "25"
  },
  {
    ID: "5408",
    Nome: "Riachuelo",
    Estado: "25"
  },
  {
    ID: "5409",
    Nome: "Ribeir\xF3polis",
    Estado: "25"
  },
  {
    ID: "5410",
    Nome: "Ros\xE1rio do Catete",
    Estado: "25"
  },
  {
    ID: "5411",
    Nome: "Salgado",
    Estado: "25"
  },
  {
    ID: "5412",
    Nome: "Santa Luzia do Itanhy",
    Estado: "25"
  },
  {
    ID: "5413",
    Nome: "Santa Rosa de Lima",
    Estado: "25"
  },
  {
    ID: "5414",
    Nome: "Santana do S\xE3o Francisco",
    Estado: "25"
  },
  {
    ID: "5415",
    Nome: "Santo Amaro das Brotas",
    Estado: "25"
  },
  {
    ID: "5416",
    Nome: "S\xE3o Crist\xF3v\xE3o",
    Estado: "25"
  },
  {
    ID: "5417",
    Nome: "S\xE3o Domingos",
    Estado: "25"
  },
  {
    ID: "5418",
    Nome: "S\xE3o Francisco",
    Estado: "25"
  },
  {
    ID: "5419",
    Nome: "S\xE3o Miguel do Aleixo",
    Estado: "25"
  },
  {
    ID: "5420",
    Nome: "Sim\xE3o Dias",
    Estado: "25"
  },
  {
    ID: "5421",
    Nome: "Siriri",
    Estado: "25"
  },
  {
    ID: "5422",
    Nome: "Telha",
    Estado: "25"
  },
  {
    ID: "5423",
    Nome: "Tobias Barreto",
    Estado: "25"
  },
  {
    ID: "5424",
    Nome: "Tomar do Geru",
    Estado: "25"
  },
  {
    ID: "5425",
    Nome: "Umba\xFAba",
    Estado: "25"
  },
  {
    ID: "5426",
    Nome: "Abreul\xE2ndia",
    Estado: "27"
  },
  {
    ID: "5427",
    Nome: "Aguiarn\xF3polis",
    Estado: "27"
  },
  {
    ID: "5428",
    Nome: "Alian\xE7a do Tocantins",
    Estado: "27"
  },
  {
    ID: "5429",
    Nome: "Almas",
    Estado: "27"
  },
  {
    ID: "5430",
    Nome: "Alvorada",
    Estado: "27"
  },
  {
    ID: "5431",
    Nome: "Anan\xE1s",
    Estado: "27"
  },
  {
    ID: "5432",
    Nome: "Angico",
    Estado: "27"
  },
  {
    ID: "5433",
    Nome: "Aparecida do Rio Negro",
    Estado: "27"
  },
  {
    ID: "5434",
    Nome: "Aragominas",
    Estado: "27"
  },
  {
    ID: "5435",
    Nome: "Araguacema",
    Estado: "27"
  },
  {
    ID: "5436",
    Nome: "Aragua\xE7u",
    Estado: "27"
  },
  {
    ID: "5437",
    Nome: "Aragua\xEDna",
    Estado: "27"
  },
  {
    ID: "5438",
    Nome: "Araguan\xE3",
    Estado: "27"
  },
  {
    ID: "5439",
    Nome: "Araguatins",
    Estado: "27"
  },
  {
    ID: "5440",
    Nome: "Arapoema",
    Estado: "27"
  },
  {
    ID: "5441",
    Nome: "Arraias",
    Estado: "27"
  },
  {
    ID: "5442",
    Nome: "Augustin\xF3polis",
    Estado: "27"
  },
  {
    ID: "5443",
    Nome: "Aurora do Tocantins",
    Estado: "27"
  },
  {
    ID: "5444",
    Nome: "Axix\xE1 do Tocantins",
    Estado: "27"
  },
  {
    ID: "5445",
    Nome: "Baba\xE7ul\xE2ndia",
    Estado: "27"
  },
  {
    ID: "5446",
    Nome: "Bandeirantes do Tocantins",
    Estado: "27"
  },
  {
    ID: "5447",
    Nome: "Barra do Ouro",
    Estado: "27"
  },
  {
    ID: "5448",
    Nome: "Barrol\xE2ndia",
    Estado: "27"
  },
  {
    ID: "5449",
    Nome: "Bernardo Say\xE3o",
    Estado: "27"
  },
  {
    ID: "5450",
    Nome: "Bom Jesus do Tocantins",
    Estado: "27"
  },
  {
    ID: "5451",
    Nome: "Brasil\xE2ndia do Tocantins",
    Estado: "27"
  },
  {
    ID: "5452",
    Nome: "Brejinho de Nazar\xE9",
    Estado: "27"
  },
  {
    ID: "5453",
    Nome: "Buriti do Tocantins",
    Estado: "27"
  },
  {
    ID: "5454",
    Nome: "Cachoeirinha",
    Estado: "27"
  },
  {
    ID: "5455",
    Nome: "Campos Lindos",
    Estado: "27"
  },
  {
    ID: "5456",
    Nome: "Cariri do Tocantins",
    Estado: "27"
  },
  {
    ID: "5457",
    Nome: "Carmol\xE2ndia",
    Estado: "27"
  },
  {
    ID: "5458",
    Nome: "Carrasco Bonito",
    Estado: "27"
  },
  {
    ID: "5459",
    Nome: "Caseara",
    Estado: "27"
  },
  {
    ID: "5460",
    Nome: "Centen\xE1rio",
    Estado: "27"
  },
  {
    ID: "5461",
    Nome: "Chapada da Natividade",
    Estado: "27"
  },
  {
    ID: "5462",
    Nome: "Chapada de Areia",
    Estado: "27"
  },
  {
    ID: "5463",
    Nome: "Colinas do Tocantins",
    Estado: "27"
  },
  {
    ID: "5464",
    Nome: "Colm\xE9ia",
    Estado: "27"
  },
  {
    ID: "5465",
    Nome: "Combinado",
    Estado: "27"
  },
  {
    ID: "5466",
    Nome: "Concei\xE7\xE3o do Tocantins",
    Estado: "27"
  },
  {
    ID: "5467",
    Nome: "Couto de Magalh\xE3es",
    Estado: "27"
  },
  {
    ID: "5468",
    Nome: "Cristal\xE2ndia",
    Estado: "27"
  },
  {
    ID: "5469",
    Nome: "Crix\xE1s do Tocantins",
    Estado: "27"
  },
  {
    ID: "5470",
    Nome: "Darcin\xF3polis",
    Estado: "27"
  },
  {
    ID: "5471",
    Nome: "Dian\xF3polis",
    Estado: "27"
  },
  {
    ID: "5472",
    Nome: "Divin\xF3polis do Tocantins",
    Estado: "27"
  },
  {
    ID: "5473",
    Nome: "Dois Irm\xE3os do Tocantins",
    Estado: "27"
  },
  {
    ID: "5474",
    Nome: "Duer\xE9",
    Estado: "27"
  },
  {
    ID: "5475",
    Nome: "Esperantina",
    Estado: "27"
  },
  {
    ID: "5476",
    Nome: "F\xE1tima",
    Estado: "27"
  },
  {
    ID: "5477",
    Nome: "Figueir\xF3polis",
    Estado: "27"
  },
  {
    ID: "5478",
    Nome: "Filad\xE9lfia",
    Estado: "27"
  },
  {
    ID: "5479",
    Nome: "Formoso do Araguaia",
    Estado: "27"
  },
  {
    ID: "5480",
    Nome: "Fortaleza do Taboc\xE3o",
    Estado: "27"
  },
  {
    ID: "5481",
    Nome: "Goianorte",
    Estado: "27"
  },
  {
    ID: "5482",
    Nome: "Goiatins",
    Estado: "27"
  },
  {
    ID: "5483",
    Nome: "Guara\xED",
    Estado: "27"
  },
  {
    ID: "5484",
    Nome: "Gurupi",
    Estado: "27"
  },
  {
    ID: "5485",
    Nome: "Ipueiras",
    Estado: "27"
  },
  {
    ID: "5486",
    Nome: "Itacaj\xE1",
    Estado: "27"
  },
  {
    ID: "5487",
    Nome: "Itaguatins",
    Estado: "27"
  },
  {
    ID: "5488",
    Nome: "Itapiratins",
    Estado: "27"
  },
  {
    ID: "5489",
    Nome: "Itapor\xE3 do Tocantins",
    Estado: "27"
  },
  {
    ID: "5490",
    Nome: "Ja\xFA do Tocantins",
    Estado: "27"
  },
  {
    ID: "5491",
    Nome: "Juarina",
    Estado: "27"
  },
  {
    ID: "5492",
    Nome: "Lagoa da Confus\xE3o",
    Estado: "27"
  },
  {
    ID: "5493",
    Nome: "Lagoa do Tocantins",
    Estado: "27"
  },
  {
    ID: "5494",
    Nome: "Lajeado",
    Estado: "27"
  },
  {
    ID: "5495",
    Nome: "Lavandeira",
    Estado: "27"
  },
  {
    ID: "5496",
    Nome: "Lizarda",
    Estado: "27"
  },
  {
    ID: "5497",
    Nome: "Luzin\xF3polis",
    Estado: "27"
  },
  {
    ID: "5498",
    Nome: "Marian\xF3polis do Tocantins",
    Estado: "27"
  },
  {
    ID: "5499",
    Nome: "Mateiros",
    Estado: "27"
  },
  {
    ID: "5500",
    Nome: "Mauril\xE2ndia do Tocantins",
    Estado: "27"
  },
  {
    ID: "5501",
    Nome: "Miracema do Tocantins",
    Estado: "27"
  },
  {
    ID: "5502",
    Nome: "Miranorte",
    Estado: "27"
  },
  {
    ID: "5503",
    Nome: "Monte do Carmo",
    Estado: "27"
  },
  {
    ID: "5504",
    Nome: "Monte Santo do Tocantins",
    Estado: "27"
  },
  {
    ID: "5505",
    Nome: "Muricil\xE2ndia",
    Estado: "27"
  },
  {
    ID: "5506",
    Nome: "Natividade",
    Estado: "27"
  },
  {
    ID: "5507",
    Nome: "Nazar\xE9",
    Estado: "27"
  },
  {
    ID: "5508",
    Nome: "Nova Olinda",
    Estado: "27"
  },
  {
    ID: "5509",
    Nome: "Nova Rosal\xE2ndia",
    Estado: "27"
  },
  {
    ID: "5510",
    Nome: "Novo Acordo",
    Estado: "27"
  },
  {
    ID: "5511",
    Nome: "Novo Alegre",
    Estado: "27"
  },
  {
    ID: "5512",
    Nome: "Novo Jardim",
    Estado: "27"
  },
  {
    ID: "5513",
    Nome: "Oliveira de F\xE1tima",
    Estado: "27"
  },
  {
    ID: "5514",
    Nome: "Palmas",
    Estado: "27"
  },
  {
    ID: "5515",
    Nome: "Palmeirante",
    Estado: "27"
  },
  {
    ID: "5516",
    Nome: "Palmeiras do Tocantins",
    Estado: "27"
  },
  {
    ID: "5517",
    Nome: "Palmeir\xF3polis",
    Estado: "27"
  },
  {
    ID: "5518",
    Nome: "Para\xEDso do Tocantins",
    Estado: "27"
  },
  {
    ID: "5519",
    Nome: "Paran\xE3",
    Estado: "27"
  },
  {
    ID: "5520",
    Nome: "Pau d`Arco",
    Estado: "27"
  },
  {
    ID: "5521",
    Nome: "Pedro Afonso",
    Estado: "27"
  },
  {
    ID: "5522",
    Nome: "Peixe",
    Estado: "27"
  },
  {
    ID: "5523",
    Nome: "Pequizeiro",
    Estado: "27"
  },
  {
    ID: "5524",
    Nome: "Pindorama do Tocantins",
    Estado: "27"
  },
  {
    ID: "5525",
    Nome: "Piraqu\xEA",
    Estado: "27"
  },
  {
    ID: "5526",
    Nome: "Pium",
    Estado: "27"
  },
  {
    ID: "5527",
    Nome: "Ponte Alta do Bom Jesus",
    Estado: "27"
  },
  {
    ID: "5528",
    Nome: "Ponte Alta do Tocantins",
    Estado: "27"
  },
  {
    ID: "5529",
    Nome: "Porto Alegre do Tocantins",
    Estado: "27"
  },
  {
    ID: "5530",
    Nome: "Porto Nacional",
    Estado: "27"
  },
  {
    ID: "5531",
    Nome: "Praia Norte",
    Estado: "27"
  },
  {
    ID: "5532",
    Nome: "Presidente Kennedy",
    Estado: "27"
  },
  {
    ID: "5533",
    Nome: "Pugmil",
    Estado: "27"
  },
  {
    ID: "5534",
    Nome: "Recursol\xE2ndia",
    Estado: "27"
  },
  {
    ID: "5535",
    Nome: "Riachinho",
    Estado: "27"
  },
  {
    ID: "5536",
    Nome: "Rio da Concei\xE7\xE3o",
    Estado: "27"
  },
  {
    ID: "5537",
    Nome: "Rio dos Bois",
    Estado: "27"
  },
  {
    ID: "5538",
    Nome: "Rio Sono",
    Estado: "27"
  },
  {
    ID: "5539",
    Nome: "Sampaio",
    Estado: "27"
  },
  {
    ID: "5540",
    Nome: "Sandol\xE2ndia",
    Estado: "27"
  },
  {
    ID: "5541",
    Nome: "Santa F\xE9 do Araguaia",
    Estado: "27"
  },
  {
    ID: "5542",
    Nome: "Santa Maria do Tocantins",
    Estado: "27"
  },
  {
    ID: "5543",
    Nome: "Santa Rita do Tocantins",
    Estado: "27"
  },
  {
    ID: "5544",
    Nome: "Santa Rosa do Tocantins",
    Estado: "27"
  },
  {
    ID: "5545",
    Nome: "Santa Tereza do Tocantins",
    Estado: "27"
  },
  {
    ID: "5546",
    Nome: "Santa Terezinha do Tocantins",
    Estado: "27"
  },
  {
    ID: "5547",
    Nome: "S\xE3o Bento do Tocantins",
    Estado: "27"
  },
  {
    ID: "5548",
    Nome: "S\xE3o F\xE9lix do Tocantins",
    Estado: "27"
  },
  {
    ID: "5549",
    Nome: "S\xE3o Miguel do Tocantins",
    Estado: "27"
  },
  {
    ID: "5550",
    Nome: "S\xE3o Salvador do Tocantins",
    Estado: "27"
  },
  {
    ID: "5551",
    Nome: "S\xE3o Sebasti\xE3o do Tocantins",
    Estado: "27"
  },
  {
    ID: "5552",
    Nome: "S\xE3o Val\xE9rio da Natividade",
    Estado: "27"
  },
  {
    ID: "5553",
    Nome: "Silvan\xF3polis",
    Estado: "27"
  },
  {
    ID: "5554",
    Nome: "S\xEDtio Novo do Tocantins",
    Estado: "27"
  },
  {
    ID: "5555",
    Nome: "Sucupira",
    Estado: "27"
  },
  {
    ID: "5556",
    Nome: "Taguatinga",
    Estado: "27"
  },
  {
    ID: "5557",
    Nome: "Taipas do Tocantins",
    Estado: "27"
  },
  {
    ID: "5558",
    Nome: "Talism\xE3",
    Estado: "27"
  },
  {
    ID: "5559",
    Nome: "Tocant\xEDnia",
    Estado: "27"
  },
  {
    ID: "5560",
    Nome: "Tocantin\xF3polis",
    Estado: "27"
  },
  {
    ID: "5561",
    Nome: "Tupirama",
    Estado: "27"
  },
  {
    ID: "5562",
    Nome: "Tupiratins",
    Estado: "27"
  },
  {
    ID: "5563",
    Nome: "Wanderl\xE2ndia",
    Estado: "27"
  },
  {
    ID: "5564",
    Nome: "Xambio\xE1",
    Estado: "27"
  }
];

// statesOfBrasil.json
var statesOfBrasil_default = [
  {
    ID: "1",
    Sigla: "AC",
    Nome: "Acre"
  },
  {
    ID: "2",
    Sigla: "AL",
    Nome: "Alagoas"
  },
  {
    ID: "3",
    Sigla: "AM",
    Nome: "Amazonas"
  },
  {
    ID: "4",
    Sigla: "AP",
    Nome: "Amap\xE1"
  },
  {
    ID: "5",
    Sigla: "BA",
    Nome: "Bahia"
  },
  {
    ID: "6",
    Sigla: "CE",
    Nome: "Cear\xE1"
  },
  {
    ID: "7",
    Sigla: "DF",
    Nome: "Distrito Federal"
  },
  {
    ID: "8",
    Sigla: "ES",
    Nome: "Esp\xEDrito Santo"
  },
  {
    ID: "9",
    Sigla: "GO",
    Nome: "Goi\xE1s"
  },
  {
    ID: "10",
    Sigla: "MA",
    Nome: "Maranh\xE3o"
  },
  {
    ID: "11",
    Sigla: "MG",
    Nome: "Minas Gerais"
  },
  {
    ID: "12",
    Sigla: "MS",
    Nome: "Mato Grosso do Sul"
  },
  {
    ID: "13",
    Sigla: "MT",
    Nome: "Mato Grosso"
  },
  {
    ID: "14",
    Sigla: "PA",
    Nome: "Par\xE1"
  },
  {
    ID: "15",
    Sigla: "PB",
    Nome: "Para\xEDba"
  },
  {
    ID: "16",
    Sigla: "PE",
    Nome: "Pernambuco"
  },
  {
    ID: "17",
    Sigla: "PI",
    Nome: "Piau\xED"
  },
  {
    ID: "18",
    Sigla: "PR",
    Nome: "Paran\xE1"
  },
  {
    ID: "19",
    Sigla: "RJ",
    Nome: "Rio de Janeiro"
  },
  {
    ID: "20",
    Sigla: "RN",
    Nome: "Rio Grande do Norte"
  },
  {
    ID: "21",
    Sigla: "RO",
    Nome: "Rond\xF4nia"
  },
  {
    ID: "22",
    Sigla: "RR",
    Nome: "Roraima"
  },
  {
    ID: "23",
    Sigla: "RS",
    Nome: "Rio Grande do Sul"
  },
  {
    ID: "24",
    Sigla: "SC",
    Nome: "Santa Catarina"
  },
  {
    ID: "25",
    Sigla: "SE",
    Nome: "Sergipe"
  },
  {
    ID: "26",
    Sigla: "SP",
    Nome: "S\xE3o Paulo"
  },
  {
    ID: "27",
    Sigla: "TO",
    Nome: "Tocantins"
  }
];

// src/validations/broadcastersValidations.ts
var broadcastersValidations = class {
  static city(city) {
    const test = citiesOfBrazil_default.filter((name) => name.Nome === city);
    if (test.length > 0)
      return true;
    else
      return false;
  }
  static state(state) {
    const test = statesOfBrasil_default.filter((uf) => uf.Sigla === state);
    if (test.length > 0)
      return true;
    else
      return false;
  }
  static codec(codec) {
    const validCodecs = ["mxf", "mov", "mp4"];
    const validate = validCodecs.includes(codec.toLowerCase());
    return validate;
  }
};

// src/services/RecordBroadcaster.ts
var prisma2 = new import_client2.PrismaClient();
var RecordBroadcaster = class {
  constructor(broadcasterName, city, state, codec, emails) {
    this.broadcasterName = broadcasterName;
    this.city = city;
    this.state = state;
    this.codec = codec;
    this.emails = emails;
  }
  static getBroadcasterById(id) {
    return __async(this, null, function* () {
      return yield prisma2.broadcastersReocord.findUnique({
        where: {
          id
        }
      });
    });
  }
  static getBroadcasterFiltered(filter) {
    return __async(this, null, function* () {
      return yield prisma2.broadcastersReocord.findMany({
        where: {
          OR: [
            {
              broadcasterName: {
                contains: filter
              }
            },
            {
              city: {
                contains: filter
              }
            },
            {
              state: {
                contains: filter
              }
            },
            {
              emails: {
                contains: filter
              }
            }
          ]
        }
      });
    });
  }
  createBroadcaster() {
    return __async(this, null, function* () {
      if (broadcastersValidations.city(this.city) && broadcastersValidations.state(this.state) && broadcastersValidations.codec(this.codec)) {
        yield prisma2.broadcastersReocord.create({
          data: {
            broadcasterName: this.broadcasterName,
            city: this.city,
            state: this.state,
            codec: this.codec,
            emails: this.emails
          }
        });
      } else
        throw new Error("Invalid Fields");
    });
  }
  updateBroadcaster(id) {
    return __async(this, null, function* () {
      if (broadcastersValidations.city(this.city) && broadcastersValidations.state(this.state) && broadcastersValidations.codec(this.codec)) {
        yield prisma2.broadcastersReocord.update({
          data: {
            broadcasterName: this.broadcasterName,
            city: this.city,
            state: this.state,
            codec: this.codec,
            emails: this.emails
          },
          where: {
            id
          }
        });
      } else
        throw new Error("Invalid Fields");
    });
  }
  // public async deleteBroadcaster (id: number) {
  // }
};

// src/utils/sendMail.ts
var sendMail_default = (email, pass, name, from, to, PointOfSaleIsRj, advertiser, broadcaster, infos) => __async(void 0, null, function* () {
  let mediaInfos = "";
  let template = "";
  if (PointOfSaleIsRj) {
    to += "; bryanadstream9@gmail.com";
  }
  for (const i in infos.mediaInfos) {
    if (!infos.mediaInfos[i].clock || !infos.mediaInfos[i].duration || !infos.mediaInfos[i].title || !infos.mediaInfos[i].link)
      throw new Error("Preencha todos os campos para enviar os materiais aos destinos.");
    mediaInfos += `
        <table>
            <tr class="tittle">
                <td>Destino</td>
                <td>Clock Number</td>
                <td>Dura\xE7\xE3o</td>
                <td>Titulo</td>
                <td>Link</td>
            </tr>
            <tr class="infos">
                <td>${broadcaster}</td>
                <td>${infos.mediaInfos[i].clock}</td>
                <td>${infos.mediaInfos[i].duration}</td>
                <td>${infos.mediaInfos[i].title}</td>
                <td><a href="${infos.mediaInfos[i].link}">DOWNLOAD</a></td>
            </tr>
        </table>
        <br>
        <br>
        `;
  }
  if (mediaInfos !== "") {
    template = `
            Ol\xE1, tudo bem?
            <br>
                <br>
            Segue abaixo a entrega do material da anunciante ${advertiser}:
            <br>
            <br>
            ${mediaInfos}

            Favor confirmar o recebimento.
            <br>
            <br>
            `;
  }
  if (mediaInfos !== "")
    yield mailTransporter_default(email, pass).sendMail({
      from,
      to,
      cc: "bryanlegaldarocha@gmail.com",
      subject: `Entrega de material - ${advertiser} - ${broadcaster}`,
      html: `
        <head>
            <style>
    * {
        font-size: 14px;
    }

    body {
        background-color: black;
    }

    table {
        display: flex;
        flex-wrap: wrap;
        font-family: sans-serif;
        text-align: center;
    }

    td, table {
        border-collapse: collapse;
        width: 750px;
    }

    td {
        border: 1px solid white;
    }

    .tittle {
        height: 20px;
        background-color: #77aadd;
        font-weight: bold;
    }

    .infos {
        background-color: #cccccc;
    }

    a {
        text-decoration: none;
        color: #2074c9;
    }

</style>
  </head>
  <body>
  ${template}
    <br>
    <br>
    <div style="color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: small; background-color: rgb(255, 255, 255);">Abs,</div>
<div style="color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: small; background-color: rgb(255, 255, 255);">
<p dir="ltr" style="color: rgb(34, 34, 34); line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;"><span style="font-size: 11pt; font-family: Arial; vertical-align: baseline; white-space: pre-wrap;"><span style="border-style: none; display: inline-block; overflow: hidden; width: 100px; height: 32px;"><img src="https://lh6.googleusercontent.com/wCUnK4Awh1DmZwgnhLdrhx8lNsAkdLwvwxcm0M2SLyZSvtE98mfAzKSI1UZu2GM1Ue6oyx2HVFbNB2az4Q8ZWg5C-2Gn6A1IV3sqXWnxQKeNLYnH10oxeyrtXw9VAa3Utg571x4n" alt="Extreme Reach" width="100" height="32" data-bit="iit"></span></span></p>
<div style="margin: 0px; padding: 0px; border-width: 0px; font-stretch: inherit; font-size: 12pt; line-height: inherit; font-family: Calibri, Arial, Helvetica, sans-serif; vertical-align: baseline; color: rgb(0, 0, 0);"><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); font-weight: bold; vertical-align: baseline; white-space: pre-wrap;">${name}<br></span><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); vertical-align: baseline; white-space: pre-wrap;"><strong>Traffic Assistant</strong><br></span><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); vertical-align: baseline; white-space: pre-wrap;"><br></span><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); font-weight: bold; vertical-align: baseline; white-space: pre-wrap;">M:</span><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); vertical-align: baseline; white-space: pre-wrap;"> </span><span style="color: rgb(16, 24, 32); font-family: Arial; font-size: 12px; white-space: pre-wrap;"> 55 11 98892-5295</span></div>
<div style="margin: 0px; padding: 0px; border-width: 0px; font-stretch: inherit; font-size: 14px; line-height: inherit; vertical-align: baseline; color: rgb(0, 0, 0);"><a style="color: rgb(17, 85, 204); font-family: Arial; font-size: 9pt; white-space: pre-wrap;" href="mailto:${email}" target="_blank" rel="noopener">${email}</a></div>
<p dir="ltr" style="color: rgb(34, 34, 34); line-height: 1.62; margin-top: 0pt; margin-bottom: 0pt; padding: 15pt 0pt 0pt;"><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); vertical-align: baseline; white-space: pre-wrap;">Adstream Brasil (an Extreme Reach company)</span></p>
<div>&nbsp;</div>
<div><img class="CToWUd a6T" style="cursor: pointer; outline-width: 0px;" tabindex="0" src="https://lh3.googleusercontent.com/Ujl148-8lEgohZsNH_Fb18WEhRRtQL4N6zhiUI8P8iOqfrf7XuzM5gGaPuZVffa5HLS-sH25siPnW4n_h3JK0HGbBamp-8wLfG5GjZJVAJHHQNS4OByP09aesSTz3L8KTg_oMgUVGUk4UH9JHGQqevY" width="420" height="138" data-bit="iit"></div>

  </body>

        `
    });
});

// src/controllers/recordBroadcasterController.ts
var auth2 = new AuthMiddleware();
var router2 = (0, import_express2.Router)();
var RecordBroadcasterController = class {
  routes() {
    router2.get("/get-broadcaster", auth2.ifUserIsAuthenticated, this.getFilteredBroadcaster);
    router2.post("/send-links", auth2.ifUserIsAuthenticated, this.sendLinks);
    router2.post("/create-broadcaster", auth2.ifUserIsAdmin, this.createBroadcaster);
    router2.put("/update/:id", auth2.ifUserIsAdmin, this.updateBroadcaster);
    return router2;
  }
  getFilteredBroadcaster(req, res) {
    return __async(this, null, function* () {
      const { filter } = req.query;
      const broadcaster = yield RecordBroadcaster.getBroadcasterFiltered(filter == null ? void 0 : filter.toString());
      return res.status(200).json({ broadcasters: broadcaster });
    });
  }
  sendLinks(req, res) {
    return __async(this, null, function* () {
      const infos = req.body;
      const { email, name, token } = req.user;
      try {
        if (!infos.mediaInfos[0].title || !infos.mediaInfos[0].clock || !infos.mediaInfos[0].duration || !infos.mediaInfos[0].link)
          return res.status(400).json({ error: "Preencha todos os campos para enviar o material." });
        if (infos.broadcasters.length === 0)
          return res.status(400).json({ error: "Nenhuma emissora selecionada." });
        for (const i in infos.broadcasters) {
          const broadcaster = yield RecordBroadcaster.getBroadcasterById(infos.broadcasters[i]);
          const pass = decryptPassword(token);
          if (broadcaster) {
            const camelCaseName = name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
            yield sendMail_default(email, pass, camelCaseName, `${camelCaseName}<${email}>`, broadcaster.emails, infos.PointOfSaleIsRj, infos.advertiser, broadcaster.broadcasterName, infos);
          }
        }
        return res.status(200).json({ message: "E-mails enviados com sucesso.", status: 200 });
      } catch (error) {
        if (error.message === "Preencha todos os campos para enviar os materiais aos destinos.")
          return res.status(400).json({ error: error.message, status: 400 });
        else
          return res.status(500).json({ error: "Erro desconhecido. Se persistir entre em contato com o Bryan.", status: 500 });
      }
    });
  }
  createBroadcaster(req, res) {
    return __async(this, null, function* () {
      const { broadcasterName, city, state, codec, emails } = req.body;
      try {
        const broadcasters = new RecordBroadcaster(broadcasterName, city, state, codec, emails);
        yield broadcasters.createBroadcaster();
        return res.status(201).json({ message: "Emissora cadastrada com sucesso.", broadcaster: broadcasterName, status: 201 });
      } catch (error) {
        if (!broadcasterName || !state || !codec || !emails)
          return res.status(400).json({ error: "Campo obrigat\xF3rio n\xE3o informado.", status: 400 });
        else if (error.code === "P2002")
          return res.status(409).json({ error: "Emissora j\xE1 cadastrada anteriormente.", status: 409 });
        else if (error.message === "Invalid Fields")
          return res.status(400).json({ error: "Campo digitado incorretamente. Verifique se digitou uma cidade ou um estado valido. As cidades devem ser escritas com letra maiuscula e acentua\xE7\xE3o. Exemplo: 'S\xE3o Paulo' e os estados precisam ser siglas. exemplo: 'SP'. J\xE1 o codec, precisa ser: 'mxf', 'mov' ou 'mp4'", status: 400 });
        else
          return res.status(500).json({ error: "erro desconhecido.", status: 500 });
      }
    });
  }
  updateBroadcaster(req, res) {
    return __async(this, null, function* () {
      const id = req.params.id;
      const { broadcasterName, city, state, codec, emails } = req.body;
      try {
        const broadcaster = yield RecordBroadcaster.getBroadcasterById(Number(id));
        const updateBroadcaster = new RecordBroadcaster(broadcasterName != null ? broadcasterName : broadcaster == null ? void 0 : broadcaster.broadcasterName, city != null ? city : broadcaster == null ? void 0 : broadcaster.city, state != null ? state : broadcaster == null ? void 0 : broadcaster.state, codec != null ? codec : broadcaster == null ? void 0 : broadcaster.codec, emails != null ? emails : broadcaster == null ? void 0 : broadcaster.emails);
        yield updateBroadcaster.updateBroadcaster(Number(id));
        return res.status(200).json({ message: "Emissora atualizada com sucesso." });
      } catch (error) {
        if (!id)
          return res.status(400).json({ error: "Id da emissora n\xE3o informado." });
        if (error.code === "P2025")
          return res.status(400).json({ error: "Emissora inexistente." });
        if (error.message === "Invalid Fields")
          return res.status(400).json({ error: "Campo digitado incorretamente. Verifique se digitou uma cidade ou um estado valido. As cidades devem ser escritas com letra maiuscula e acentua\xE7\xE3o. Exemplo: 'S\xE3o Paulo' e os estados precisam ser siglas. exemplo: 'SP'. J\xE1 o codec, precisa ser: 'mxf', 'mov' ou 'mp4'" });
      }
    });
  }
  // private async getFilteredHistory (req: Request, res: Response) {
  //     const { filter } = req.query;
  //     const history = await RecordHistory.getDestinationsFiltered(filter?.toString());
  //     return res.status(200).json({ history: history });
  // }
};

// src/routes/routes.ts
var import_express3 = require("express");
var router3 = (0, import_express3.Router)();
var users = new UserController();
var recordController = new RecordBroadcasterController();
router3.use("/users", users.routes());
router3.use("/record", recordController.routes());
var routes_default = router3;

// src/app.ts
var import_cors = __toESM(require("cors"));
var app = (0, import_express4.default)();
app.use((0, import_cors.default)());
app.use(import_express4.default.json());
app.use(routes_default);
var app_default = app;

// src/server.ts
var port = process.env.PORT || 3e3;
app_default.listen(port, () => {
  console.log(`The server is listening on port ${port}.`);
});
