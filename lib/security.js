"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptSignature = exports.generateIdentity = exports.doWork = exports.generateSignature = exports.generateWalletKey = exports.generateWallet = exports.generateMnemonic = exports.generateKey = void 0;
const randomBytes = require('randombytes');
const wif = require('wif');
const { BIP32Interface, fromSeed, fromPrivateKey } = require('bip32');
const { encrypt, decrypt } = require('bip38');
const { entropyToMnemonic, mnemonicToSeedSync } = require('bip39');
const bs58 = require('bs58');
const ecc = require('eosjs-ecc');
// const worker = new Worker('../workers/main.js', { type: 'module' })
const WALLET_PATHS = {
    carmel: "m/44'/194'/0'",
    eos: "m/44'/194'/0'",
    btc: "m/44'/0'/0'",
    ada: "m/44'/1815'/0'",
    eth: "m/44'/94'/0'"
};
exports.generateKey = async () => {
    const privateKey = await ecc.randomKey();
    const publicKey = ecc.privateToPublic(privateKey);
    return {
        privateKey, publicKey
    };
};
exports.generateMnemonic = () => {
    return entropyToMnemonic(randomBytes(32));
};
exports.generateWallet = (mnemonic) => {
    const wallet = fromSeed(mnemonicToSeedSync(mnemonic));
    let paths = {};
    Object.keys(WALLET_PATHS).map((k) => paths[k] = wallet.derivePath(WALLET_PATHS[k]));
    return (Object.assign(Object.assign({}, wallet), paths));
};
exports.generateWalletKey = (wallet, index, path = 'carmel') => {
    const raw = wallet[path].deriveHardened(index);
    const publicKey = ecc.PublicKey(raw.publicKey).toString();
    const privateKey = wif.encode(128, raw.privateKey, true);
    return ({ privateKey, publicKey });
};
exports.generateSignature = (privateKey, password) => {
    const decoded = wif.decode(privateKey, 128);
    return encrypt(decoded.privateKey, decoded.compressed, password);
};
exports.doWork = () => {
};
exports.generateIdentity = (username, password) => {
    const mnemonic = exports.generateMnemonic();
    const wallet = exports.generateWallet(mnemonic);
    const key = exports.generateWalletKey(wallet, 0);
    // const signature = generateSignature(key.privateKey, password)
    return (Object.assign({ mnemonic }, key));
};
exports.decryptSignature = (data) => {
    try {
        const decrypted = decrypt(data.signature, data.password);
        const privateKey = wif.encode(128, decrypted.privateKey, decrypted.compressed);
        return Object.assign({}, data, { privateKey });
    }
    catch (e) {
        return {
            error: e.message
        };
    }
};
//# sourceMappingURL=security.js.map