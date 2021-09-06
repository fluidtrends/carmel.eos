import { exposeWorker } from 'react-hooks-worker'
import * as TASKS from './crypto'

const main = async (props) => {
    const { type, data } = props

    if (!TASKS[type]) return

    const result = TASKS[type](data)

    return ({ type, result, data })
}

exposeWorker(main)