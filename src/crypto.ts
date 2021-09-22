const randomBytes = require('randombytes')
const wif = require('wif')
const { BIP32Interface, fromSeed, fromPrivateKey } = require('bip32')
const { encrypt, decrypt } = require('bip38')
const { entropyToMnemonic, mnemonicToSeedSync } = require('bip39')
const bs58 = require('bs58')
const ecc = require('eosjs-ecc')

const WALLET_PATHS: any = {
    carmel: "m/44'/194'/0'",
    eos: "m/44'/194'/0'",
    btc: "m/44'/0'/0'",
    ada: "m/44'/1815'/0'",
    eth: "m/44'/94'/0'"
}

export const generateKey = async () =>{
    const privateKey = await ecc.randomKey()
    const publicKey = ecc.privateToPublic(privateKey)

    return {
        privateKey, publicKey
    }
}

export const generateMnemonic = () => {
    return entropyToMnemonic(randomBytes(32))
}

export const generateWallet = (mnemonic: string) => {
    const wallet = fromSeed(mnemonicToSeedSync(mnemonic))
    let paths: any = {}

    Object.keys(WALLET_PATHS).map((k: string) => paths[k] = wallet.derivePath(WALLET_PATHS[k]))

    return ({ ...wallet, ...paths })
}

export const generateWalletKey = (wallet: any, index: number, path: string = 'carmel') => {
    const raw = wallet[path].deriveHardened(index)
    const publicKey = ecc.PublicKey(raw.publicKey).toString()
    const privateKey = wif.encode(128, raw.privateKey!, true)

    return ({ privateKey, publicKey })
}

export const generateSignature = (privateKey: any, password: any) => {
    const decoded = wif.decode(privateKey, 128)
    return encrypt(decoded.privateKey, decoded.compressed, password)
}

export const generateIdentity = ({ username, password }: any) => {
    const mnemonic = generateMnemonic()
    const wallet = generateWallet(mnemonic)
    const key = generateWalletKey(wallet, 0)
    // const signature = generateSignature(key.privateKey, password)

    return ({
        mnemonic, ...key
    })
}

export const decryptSignature = (data: any) => {
    try {
        const decrypted = decrypt(data.signature, data.password)
        const privateKey = wif.encode(128, decrypted.privateKey, decrypted.compressed)

        return Object.assign({}, data, { privateKey })
    } catch (error) {
        return {
            error
        }
    }
}