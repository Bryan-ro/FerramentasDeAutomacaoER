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

// src/middlewares/authMiddleware.ts
var authMiddleware_exports = {};
__export(authMiddleware_exports, {
  AuthMiddleware: () => AuthMiddleware
});
module.exports = __toCommonJS(authMiddleware_exports);

// src/utils/mailTransporter.ts
var import_nodemailer = require("nodemailer");

// src/security/verifyLogin.ts
var import_jsonwebtoken = require("jsonwebtoken");
var import_crypto_js = __toESM(require("crypto-js"));
var import_dotenv = __toESM(require_main());
import_dotenv.default.config();
var verifyJwt = (token) => {
  if (process.env.JTW_SECRET)
    return (0, import_jsonwebtoken.verify)(token, process.env.JTW_SECRET);
};

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

// src/middlewares/authMiddleware.ts
var AuthMiddleware = class {
  ifUserIsAuthenticated(req, res, next) {
    const { token } = req.headers;
    try {
      if (typeof token === "string") {
        const auth = verifyJwt(token);
        if (auth) {
          req.user = {
            email: auth.email,
            name: auth.name,
            token: auth.token
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
          const auth = verifyJwt(token);
          const user = yield User.getUserByEmail(auth.email);
          if (user == null ? void 0 : user.admin) {
            req.user = {
              email: auth.email,
              name: auth.name,
              token: auth.token
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthMiddleware
});
