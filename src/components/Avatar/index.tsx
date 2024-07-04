import React from 'react'
import {_Avatar} from './avatar.js'
import {NextAuthResult} from 'next-auth'

export const Avatar = ({auth}: { auth: NextAuthResult['auth'] }) => () => <_Avatar auth={auth} active={false}/>