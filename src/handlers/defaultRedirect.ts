import {PayloadHandler} from 'payload'
import {NextResponse} from 'next/server.js'
import {getState} from '../utils/index.js'

export const defaultRedirect: PayloadHandler = (req) =>
    NextResponse.redirect(req.payload.config.serverURL + (getState(req).redirect ?? ''))
