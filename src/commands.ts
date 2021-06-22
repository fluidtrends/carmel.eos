import keys from "../mainnet.keys.json"
import { generateKey, signMessage } from './eos'
import { get, getId, ticker, sendCarmel, sendEOS, system } from './carmel'

export const get_ids = async (data: any) => {  
    console.log(await get('identities'))
}

export const get_id = async (data: any) => {  
    if (data.length < 1) return

    console.log(await getId(data[0]))
}

export const get_assets = async (data: any) => {  
    console.log(await get('assets'))
}

export const get_config = async (data: any) => {  
    console.log(await get('config'))
}

export const get_ticker = async (data: any) => {  
    console.log(await ticker())
}

export const new_key = async (data: any) => {  
    console.log(await generateKey())
}

export const topup = async (data: any) => {  
    if (data.length < 3) return

    if (`${data[1]}`.toLowerCase() === 'eos') {
        console.log(await sendEOS(data[0], data[2]))
        return
    }

    if (`${data[1]}`.toLowerCase() === 'carmel') {
        console.log(await sendCarmel(data[0], data[2]))
        return
    }
}

export const register_domain = async (data: any) => {
    if (data.length < 1) return

    const domain = data[0]
    const username = keys.carmel.id
    const id = await getId(username)

    const sig = signMessage(`${parseInt(id.rev) + 1}:${domain}`, keys.carmel.private)
    console.log(await system("newdomain", {
        username, domain, sig
    }))
}
 



