"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/services/User.ts
var User_exports = {};
__export(User_exports, {
  User: () => User
});
module.exports = __toCommonJS(User_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  User
});
