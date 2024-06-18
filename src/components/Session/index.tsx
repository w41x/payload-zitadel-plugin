'use client'

import * as React from 'react'
import {SessionProvider} from 'next-auth/react'
import {PropsWithChildren} from 'react'


export const Session = ({children}: PropsWithChildren) => <SessionProvider>{children}</SessionProvider>