"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptSignature = exports.generateIdentity = exports.doWork = exports.generateSignature = exports.generateWalletKey = exports.generateWallet = exports.generateMnemonic = exports.generateKey = void 0;
var randomBytes = require('randombytes');
var wif = require('wif');
var _a = require('bip32'), BIP32Interface = _a.BIP32Interface, fromSeed = _a.fromSeed, fromPrivateKey = _a.fromPrivateKey;
var _b = require('bip38'), encrypt = _b.encrypt, decrypt = _b.decrypt;
var _c = require('bip39'), entropyToMnemonic = _c.entropyToMnemonic, mnemonicToSeedSync = _c.mnemonicToSeedSync;
var bs58 = require('bs58');
var ecc = require('eosjs-ecc');
// const worker = new Worker('../workers/main.js', { type: 'module' })
var WALLET_PATHS = {
    carmel: "m/44'/194'/0'",
    eos: "m/44'/194'/0'",
    btc: "m/44'/0'/0'",
    ada: "m/44'/1815'/0'",
    eth: "m/44'/94'/0'"
};
exports.generateKey = function () { return __awaiter(void 0, void 0, void 0, function () {
    var privateKey, publicKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ecc.randomKey()];
            case 1:
                privateKey = _a.sent();
                publicKey = ecc.privateToPublic(privateKey);
                return [2 /*return*/, {
                        privateKey: privateKey, publicKey: publicKey
                    }];
        }
    });
}); };
exports.generateMnemonic = function () {
    return entropyToMnemonic(randomBytes(32));
};
exports.generateWallet = function (mnemonic) {
    var wallet = fromSeed(mnemonicToSeedSync(mnemonic));
    var paths = {};
    Object.keys(WALLET_PATHS).map(function (k) { return paths[k] = wallet.derivePath(WALLET_PATHS[k]); });
    return (__assign(__assign({}, wallet), paths));
};
exports.generateWalletKey = function (wallet, index, path) {
    if (path === void 0) { path = 'carmel'; }
    var raw = wallet[path].deriveHardened(index);
    var publicKey = ecc.PublicKey(raw.publicKey).toString();
    var privateKey = wif.encode(128, raw.privateKey, true);
    return ({ privateKey: privateKey, publicKey: publicKey });
};
exports.generateSignature = function (privateKey, password) {
    var decoded = wif.decode(privateKey, 128);
    return encrypt(decoded.privateKey, decoded.compressed, password);
};
exports.doWork = function () {
};
exports.generateIdentity = function (username, password) {
    var mnemonic = exports.generateMnemonic();
    var wallet = exports.generateWallet(mnemonic);
    var key = exports.generateWalletKey(wallet, 0);
    // const signature = generateSignature(key.privateKey, password)
    return (__assign({ mnemonic: mnemonic }, key));
};
exports.decryptSignature = function (data) {
    try {
        var decrypted = decrypt(data.signature, data.password);
        var privateKey = wif.encode(128, decrypted.privateKey, decrypted.compressed);
        return Object.assign({}, data, { privateKey: privateKey });
    }
    catch (e) {
        return {
            error: e.message
        };
    }
};
//# sourceMappingURL=security.js.map