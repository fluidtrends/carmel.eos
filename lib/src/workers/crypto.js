"use strict";
var randomBytes = require('randombytes');
var wif = require('wif');
var _a = require('bip32'), BIP32Interface = _a.BIP32Interface, fromSeed = _a.fromSeed, fromPrivateKey = _a.fromPrivateKey;
var _b = require('bip38'), encrypt = _b.encrypt, decrypt = _b.decrypt;
var _c = require('bip39'), entropyToMnemonic = _c.entropyToMnemonic, mnemonicToSeedSync = _c.mnemonicToSeedSync;
var bs58 = require('bs58');
var ecc = require('eosjs-ecc');
var generateMnemonic = function () {
    return entropyToMnemonic(randomBytes(32));
};
var generateSignature = function (_a) {
    var password = _a.password, privateKey = _a.privateKey;
    var decoded = wif.decode(privateKey, 128);
    return encrypt(decoded.privateKey, decoded.compressed, password);
};
var decryptSignature = function (data) {
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
module.exports = {
    generateMnemonic: generateMnemonic, generateSignature: generateSignature, decryptSignature: decryptSignature
};
//# sourceMappingURL=crypto.js.map