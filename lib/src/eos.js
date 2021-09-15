"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountsFromPrivateKey = exports.createAccount = exports.registerDomain = exports.topup = exports.geTicker = exports.getConfig = exports.getAssets = exports.getIds = exports.ticker = exports.system = exports.sendCarmel = exports.sendEOS = exports.getId = exports.getSystemTableRows = exports.sendTransaction = exports.getTableRows = exports.sha256 = exports.signMessage = exports.get = exports.generateElement = exports.generateDomain = exports.generateConfigKey = exports.generateUsername = exports.anonChain = exports.chain = exports.DEFAULT_URL = void 0;
var ecc = require('eosjs-ecc');
var nanoid_1 = require("nanoid");
var nanoid = nanoid_1.customAlphabet('2345abcdefghijklmnopqrstuvwxyz', 12);
var util_1 = require("util");
// const { Api, JsonRpc, RpcError } = require('eosjs')
var eosjs_1 = require("eosjs");
var eosjs_jssig_1 = require("eosjs/dist/eosjs-jssig");
var node_fetch_1 = __importDefault(require("node-fetch"));
exports.DEFAULT_URL = "https://eos.greymass.com";
exports.chain = function (_a) {
    var keys = _a.keys, url = _a.url;
    var textDecoder = new globalThis.TextDecoder();
    var signatureProvider = new eosjs_jssig_1.JsSignatureProvider(Object.keys(keys).map(function (k) { return keys[k].private; }));
    var rpc = new eosjs_1.JsonRpc(url, { fetch: node_fetch_1.default });
    var api = new eosjs_1.Api({ rpc: rpc, signatureProvider: signatureProvider, textDecoder: textDecoder, textEncoder: new util_1.TextEncoder() });
    return { api: api, rpc: rpc, keys: keys };
};
exports.anonChain = function () {
    var rpc = new eosjs_1.JsonRpc(exports.DEFAULT_URL, { fetch: node_fetch_1.default });
    return { rpc: rpc };
};
exports.generateUsername = function () {
    return nanoid();
};
exports.generateConfigKey = function () {
    return nanoid();
};
exports.generateDomain = function () {
    return nanoid();
};
exports.generateElement = function () {
    return nanoid();
};
exports.get = function (c, table) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, exports.getSystemTableRows(c, table)];
}); }); };
exports.signMessage = function (msg, c, key) {
    if (key === void 0) { key = 'main'; }
    return ecc.sign(msg, c.keys[key].private);
};
exports.sha256 = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, require("crypto").createHash("sha256").update(message).digest("hex")];
    });
}); };
exports.getTableRows = function (c, code, scope, table, limit, index) {
    if (limit === void 0) { limit = 100; }
    if (index === void 0) { index = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, c.rpc.get_table_rows(Object.assign({
                            json: true,
                            code: code,
                            scope: scope,
                            table: table,
                            limit: limit,
                            reverse: false,
                            show_payer: false
                        }, index && index))];
                case 1:
                    result = _a.sent();
                    if (!result.rows) {
                        return [2 /*return*/];
                    }
                    return [2 /*return*/, result.rows];
                case 2:
                    e_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.sendTransaction = function (c, actor, account, action, data, key) {
    if (key === void 0) { key = 'main'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, c.api.transact({
                        actions: [{
                                account: account,
                                name: action,
                                authorization: [{
                                        actor: actor,
                                        permission: 'active'
                                    }],
                                data: data
                            }]
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30,
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.getSystemTableRows = function (c, table) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, exports.getTableRows(c, "carmelsystem", "carmelsystem", table)];
    });
}); };
exports.getId = function (c, username) { return __awaiter(void 0, void 0, void 0, function () {
    var hash, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.sha256(username)];
            case 1:
                hash = _a.sent();
                return [4 /*yield*/, exports.getTableRows(c, "carmelsystem", "carmelsystem", "identities", 10, {
                        lower_bound: hash,
                        upper_bound: hash,
                        index_position: '2',
                        encode_type: 'hex',
                        key_type: 'sha256'
                    })];
            case 2:
                result = _a.sent();
                if (!result || result.length < 1)
                    return [2 /*return*/];
                return [2 /*return*/, result[0]];
        }
    });
}); };
exports.sendEOS = function (c, amount, to, key) {
    if (key === void 0) { key = 'main'; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, exports.sendTransaction(c, c.keys[key].id, "eosio.token", "transfer", {
                    from: c.keys[key].id,
                    to: "carmelsystem",
                    quantity: amount + " EOS",
                    memo: "topup:" + to
                })];
        });
    });
};
exports.sendCarmel = function (c, amount, to, key) {
    if (key === void 0) { key = 'main'; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, exports.sendTransaction(c, c.keys.main.id, "carmeltokens", "transfer", {
                    from: c.keys[key].id,
                    to: "carmelsystem",
                    quantity: amount + " CARMEL",
                    memo: "topup:" + to
                })];
        });
    });
};
exports.system = function (c, action, data, key) {
    if (key === void 0) { key = 'main'; }
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, exports.sendTransaction(c, c.keys[key].id, "carmelsystem", action, data)];
    }); });
};
exports.ticker = function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var EOS_CARMEL, EOS_USDT, CARMEL_USDT;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getTableRows(c, "swap.defi", "swap.defi", "pairs", 1, {
                    lower_bound: 1408,
                    upper_bound: 1408
                })];
            case 1:
                EOS_CARMEL = _a.sent();
                return [4 /*yield*/, exports.getTableRows(c, "swap.defi", "swap.defi", "pairs", 1, {
                        lower_bound: 12,
                        upper_bound: 12
                    })];
            case 2:
                EOS_USDT = _a.sent();
                CARMEL_USDT = {
                    price: parseFloat(EOS_CARMEL[0].price0_last) / parseFloat(EOS_USDT[0].price0_last)
                };
                return [2 /*return*/, {
                        EOS_USDT: {
                            price: EOS_USDT[0].price0_last
                        },
                        CARMEL_EOS: {
                            price: EOS_CARMEL[0].price0_last
                        },
                        CARMEL_USDT: CARMEL_USDT
                    }];
        }
    });
}); };
exports.getIds = function (c) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, exports.get(c, 'identities')];
}); }); };
exports.getAssets = function (c) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, exports.get(c, 'assets')];
}); }); };
exports.getConfig = function (c) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, exports.get(c, 'config')];
}); }); };
exports.geTicker = function (c) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, exports.ticker(c)];
}); }); };
exports.topup = function (c, amount, to, type, key) {
    if (type === void 0) { type = 'eos'; }
    if (key === void 0) { key = 'main'; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (type.toLowerCase() === 'eos') {
                return [2 /*return*/, exports.sendEOS(c, amount, to, key)];
            }
            if (type.toLowerCase() === 'carmel') {
                return [2 /*return*/, exports.sendCarmel(c, amount, to, key)];
            }
            return [2 /*return*/];
        });
    });
};
exports.registerDomain = function (c, username, domain, key) {
    if (key === void 0) { key = 'main'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var id, sig, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.getId(c, username)];
                case 1:
                    id = _a.sent();
                    sig = exports.signMessage(parseInt(id.rev) + 1 + ":" + domain, c.keys[key].private);
                    return [4 /*yield*/, exports.system(c, "newdomain", { username: username, domain: domain, sig: sig }, key)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.createAccount = function (c, username, publicKey, did) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.system(c, "caccount", {
                    username: username,
                    pub_key: publicKey,
                    did: did
                })
                // sendTransaction(c, c.keys[key].id, "carmelsystem", action, data)
                // sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "caccount", {
                //   username: NEW_USERNAME, pub_key, did: "hello"
                // }), done, (result) => {
            ];
            case 1:
                result = _a.sent();
                // sendTransaction(c, c.keys[key].id, "carmelsystem", action, data)
                // sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "caccount", {
                //   username: NEW_USERNAME, pub_key, did: "hello"
                // }), done, (result) => {
                return [2 /*return*/, result];
        }
    });
}); };
exports.getAccountsFromPrivateKey = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var signatureProvider, getAvailableKeys, publicKey, rpc_1, result, account_names, balances_1, accounts, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                signatureProvider = new eosjs_jssig_1.JsSignatureProvider([data.privateKey]);
                return [4 /*yield*/, signatureProvider.getAvailableKeys()];
            case 1:
                getAvailableKeys = _a.sent();
                publicKey = getAvailableKeys[0];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 6]);
                rpc_1 = new eosjs_1.JsonRpc(exports.DEFAULT_URL, { fetch: node_fetch_1.default });
                return [4 /*yield*/, rpc_1.history_get_key_accounts(publicKey)];
            case 3:
                result = _a.sent();
                if (!result || !result.account_names) {
                    throw new Error('Invalid private key');
                }
                account_names = result.account_names;
                return [4 /*yield*/, Promise.all(account_names.map(function (a) { return Promise.all([rpc_1.get_currency_balance("eosio.token", a), rpc_1.get_currency_balance("carmeltokens", a)]); }))];
            case 4:
                balances_1 = _a.sent();
                balances_1 = balances_1.map(function (b) { return b.map(function (a) { return a[0]; }); });
                accounts = account_names.map(function (id, i) {
                    var eos = balances_1[i][0] ? parseFloat(balances_1[i][0].split()[0]) : -1;
                    var carmel = balances_1[i][1] ? parseFloat(balances_1[i][1].split()[0]) : -1;
                    return { id: id, eos: eos, carmel: carmel };
                });
                return [2 /*return*/, {
                        publicKey: publicKey,
                        accounts: accounts
                    }];
            case 5:
                e_2 = _a.sent();
                console.log(e_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=eos.js.map