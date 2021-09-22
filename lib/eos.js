"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountsFromPrivateKey = exports.createAccount = exports.registerDomain = exports.topup = exports.geTicker = exports.getConfig = exports.getAssets = exports.getIds = exports.ticker = exports.system = exports.sendCarmel = exports.sendEOS = exports.getId = exports.getSystemTableRows = exports.sendTransaction = exports.getTableRows = exports.sha256 = exports.signMessage = exports.get = exports.generateElement = exports.generateDomain = exports.generateConfigKey = exports.generateUsername = exports.anonChain = exports.chain = exports.DEFAULT_URL = void 0;
const ecc = require('eosjs-ecc');
const nanoid_1 = require("nanoid");
const nanoid = nanoid_1.customAlphabet('2345abcdefghijklmnopqrstuvwxyz', 12);
const util_1 = require("util");
// const { Api, JsonRpc, RpcError } = require('eosjs')
const eosjs_1 = require("eosjs");
const eosjs_jssig_1 = require("eosjs/dist/eosjs-jssig");
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.DEFAULT_URL = "https://eos.greymass.com";
exports.chain = ({ keys, url }) => {
    const textDecoder = new globalThis.TextDecoder();
    const signatureProvider = new eosjs_jssig_1.JsSignatureProvider(Object.keys(keys).map((k) => keys[k].private));
    const rpc = new eosjs_1.JsonRpc(url || exports.DEFAULT_URL, { fetch: node_fetch_1.default });
    const api = new eosjs_1.Api({ rpc, signatureProvider, textDecoder, textEncoder: new util_1.TextEncoder() });
    return { api, rpc, keys };
};
exports.anonChain = ({ url }) => {
    const rpc = new eosjs_1.JsonRpc(url || exports.DEFAULT_URL, { fetch: node_fetch_1.default });
    return { rpc };
};
exports.generateUsername = () => {
    return nanoid();
};
exports.generateConfigKey = () => {
    return nanoid();
};
exports.generateDomain = () => {
    return nanoid();
};
exports.generateElement = () => {
    return nanoid();
};
exports.get = async (c, table) => exports.getSystemTableRows(c, table);
exports.signMessage = (msg, c, key = 'main') => {
    return ecc.sign(msg, c.keys[key].private);
};
exports.sha256 = async (message) => {
    return require("crypto").createHash("sha256").update(message).digest("hex");
};
exports.getTableRows = async (c, code, scope, table, limit = 100, index = false) => {
    try {
        const result = await c.rpc.get_table_rows(Object.assign({
            json: true,
            code,
            scope,
            table,
            limit,
            reverse: false,
            show_payer: false
        }, index && index));
        if (!result.rows) {
            return;
        }
        return result.rows;
    }
    catch (e) {
    }
};
exports.sendTransaction = async (c, actor, account, action, data, key = 'main') => {
    const result = await c.api.transact({
        actions: [{
                account,
                name: action,
                authorization: [{
                        actor,
                        permission: 'active'
                    }],
                data
            }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
    return result;
};
exports.getSystemTableRows = async (c, table) => {
    return exports.getTableRows(c, "carmelsystem", "carmelsystem", table);
};
exports.getId = async (c, username) => {
    const hash = await exports.sha256(username);
    const result = await exports.getTableRows(c, "carmelsystem", "carmelsystem", "identities", 10, {
        lower_bound: hash,
        upper_bound: hash,
        index_position: '2',
        encode_type: 'hex',
        key_type: 'sha256'
    });
    if (!result || result.length < 1)
        return;
    return result[0];
};
exports.sendEOS = async (c, amount, to, key = 'main') => exports.sendTransaction(c, c.keys[key].id, "eosio.token", "transfer", {
    from: c.keys[key].id,
    to: "carmelsystem",
    quantity: `${amount} EOS`,
    memo: `topup:${to}`
});
exports.sendCarmel = async (c, amount, to, key = 'main') => exports.sendTransaction(c, c.keys.main.id, "carmeltokens", "transfer", {
    from: c.keys[key].id,
    to: "carmelsystem",
    quantity: `${amount} CARMEL`,
    memo: `topup:${to}`
});
exports.system = async (c, action, data, key = 'main') => exports.sendTransaction(c, c.keys[key].id, "carmelsystem", action, data);
exports.ticker = async (c) => {
    const EOS_CARMEL = await exports.getTableRows(c, "swap.defi", "swap.defi", "pairs", 1, {
        lower_bound: 1408,
        upper_bound: 1408
    });
    const EOS_USDT = await exports.getTableRows(c, "swap.defi", "swap.defi", "pairs", 1, {
        lower_bound: 12,
        upper_bound: 12
    });
    const CARMEL_USDT = {
        price: parseFloat(EOS_CARMEL[0].price0_last) / parseFloat(EOS_USDT[0].price0_last)
    };
    return {
        EOS_USDT: {
            price: EOS_USDT[0].price0_last
        },
        CARMEL_EOS: {
            price: EOS_CARMEL[0].price0_last
        },
        CARMEL_USDT
    };
};
exports.getIds = async (c) => exports.get(c, 'identities');
exports.getAssets = async (c) => exports.get(c, 'assets');
exports.getConfig = async (c) => exports.get(c, 'config');
exports.geTicker = async (c) => exports.ticker(c);
exports.topup = async (c, amount, to, type = 'eos', key = 'main') => {
    if (type.toLowerCase() === 'eos') {
        return exports.sendEOS(c, amount, to, key);
    }
    if (type.toLowerCase() === 'carmel') {
        return exports.sendCarmel(c, amount, to, key);
    }
};
exports.registerDomain = async (c, username, domain, key = 'main') => {
    const id = await exports.getId(c, username);
    const sig = exports.signMessage(`${parseInt(id.rev) + 1}:${domain}`, c.keys[key].private);
    const result = await exports.system(c, "newdomain", { username, domain, sig }, key);
    return result;
};
exports.createAccount = async (c, username, publicKey, did) => {
    // const id = await getId(c, username)
    // const sig = signMessage(`${parseInt(id.rev) + 1}:${domain}`, c.keys[key].private)
    // const result = await system(c, "newdomain", { username, domain, sig }, key)
    const result = await exports.system(c, "caccount", {
        username, pub_key: publicKey, did
    });
    // sendTransaction(c, c.keys[key].id, "carmelsystem", action, data)
    // sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "caccount", {
    //   username: NEW_USERNAME, pub_key, did: "hello"
    // }), done, (result) => {
    return result;
};
exports.getAccountsFromPrivateKey = async (data) => {
    const signatureProvider = new eosjs_jssig_1.JsSignatureProvider([data.privateKey]);
    const getAvailableKeys = await signatureProvider.getAvailableKeys();
    const publicKey = getAvailableKeys[0];
    try {
        const rpc = new eosjs_1.JsonRpc(exports.DEFAULT_URL, { fetch: node_fetch_1.default });
        let result = await rpc.history_get_key_accounts(publicKey);
        if (!result || !result.account_names) {
            throw new Error('Invalid private key');
        }
        const { account_names } = result;
        let balances = await Promise.all(account_names.map((a) => Promise.all([rpc.get_currency_balance("eosio.token", a), rpc.get_currency_balance("carmeltokens", a)])));
        balances = balances.map((b) => b.map((a) => a[0]));
        const accounts = account_names.map((id, i) => {
            const eos = balances[i][0] ? parseFloat(balances[i][0].split()[0]) : -1;
            const carmel = balances[i][1] ? parseFloat(balances[i][1].split()[0]) : -1;
            return { id, eos, carmel };
        });
        return {
            publicKey,
            accounts
        };
    }
    catch (e) {
        console.log(e);
    }
};
//# sourceMappingURL=eos.js.map