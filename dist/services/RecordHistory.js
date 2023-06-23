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

// src/services/RecordHistory.ts
var RecordHistory_exports = {};
__export(RecordHistory_exports, {
  RecordHistory: () => RecordHistory
});
module.exports = __toCommonJS(RecordHistory_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var RecordHistory = class {
  constructor(destinations, clock, user) {
    this.destinations = destinations;
    this.clock = clock;
    this.user = user;
  }
  static getDestinationsFiltered(filter) {
    return __async(this, null, function* () {
      const history = yield prisma.recordHistory.findMany({
        where: {
          OR: [
            {
              destinations: {
                contains: filter
              }
            },
            {
              clock: {
                contains: filter
              }
            },
            {
              user: {
                contains: filter
              }
            }
          ]
        }
      });
      for (const i in history) {
        history[i].destinations = history[i].destinations.split(",");
        history[i].clock = history[i].clock.split(",");
      }
      return history;
    });
  }
  RecordHistory() {
    return __async(this, null, function* () {
      yield prisma.recordHistory.create({
        data: {
          date: /* @__PURE__ */ new Date(),
          clock: this.clock,
          destinations: this.destinations,
          user: this.user
        }
      });
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RecordHistory
});
