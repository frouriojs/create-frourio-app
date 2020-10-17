import { STATUS } from '$/common/types'

let status: STATUS = 'waiting'

export const getStatus = () => status

export const setStatus = (val: STATUS) => { status = val }
