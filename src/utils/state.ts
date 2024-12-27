import {PayloadRequest} from 'payload'
import {ZitadelCallbackQuery, ZitadelCallbackState} from '../types.js'

export const getState = (req: PayloadRequest) =>
    Object.fromEntries(new URLSearchParams(atob((req.query as ZitadelCallbackQuery).state ?? ''))) as ZitadelCallbackState

export const createState = (req: PayloadRequest, invokedBy: ZitadelCallbackState['invokedBy']) =>
    btoa(new URLSearchParams({
        ...req.query,
        invokedBy
    } satisfies ZitadelCallbackState).toString())