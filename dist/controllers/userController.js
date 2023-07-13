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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
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

// src/controllers/userController.ts
var userController_exports = {};
__export(userController_exports, {
  UserController: () => UserController
});
module.exports = __toCommonJS(userController_exports);
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

// src/middlewares/authMiddleware.ts
var AuthMiddleware = class {
  ifUserIsAuthenticated(req, res, next) {
    const { token } = req.headers;
    try {
      if (typeof token === "string") {
        const auth2 = verifyJwt(token);
        if (auth2) {
          req.user = {
            email: auth2.email,
            name: auth2.name,
            token: auth2.token
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
          const auth2 = verifyJwt(token);
          const user = yield User.getUserByEmail(auth2.email);
          if (user == null ? void 0 : user.admin) {
            req.user = {
              email: auth2.email,
              name: auth2.name,
              token: auth2.token
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
          const auth2 = yield verifyEmail(user.name, user.email, pass);
          if (auth2)
            return res.status(200).json({ token: auth2, user: user.email, name: user.name, admin: user.admin, redirected: "Home page", status: 200 });
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserController
});
