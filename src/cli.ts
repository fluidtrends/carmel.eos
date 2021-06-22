import keys from "../mainnet.keys.json"   

import { signMessage } from "./eos"
import { system, getId, args } from "./carmel"
import * as commands from './commands'

(async  () => {
    const arg = args()

    if (!arg || arg.length < 1) {
        console.log("Bad usage")
        return 
    }
    
    type CMD_ID = keyof typeof commands 
    const cmd = commands[arg[0] as CMD_ID]
    
    if (!cmd) {
        console.log("Bad command")
        return 
    }

    arg.shift()
    return cmd(arg)
})()

