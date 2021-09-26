import { PluginScope } from '@ezbackend/core'
import { EzApp } from '@ezbackend/common'
import fastifySecureSession from 'fastify-secure-session'
import fastifyPassport from 'fastify-passport'
import fs from 'fs'

export class EzAuth extends EzApp {
    constructor() {
        super()
        this.setHandler("Add Fastify Secure Session", async (instance, opts) => {
            //TODO: Create key if no key
            instance.server.register(fastifySecureSession, {
                key: fs.readFileSync(opts.auth.secretKeyPath),
                cookie: {
                    path: '/'
                }
            })
        })

        this.setHandler("Add Fastify Passport", async (instance, opts) => {

            //TODO: Create key if no key
            instance.server.register(fastifyPassport.initialize())
            instance.server.register(fastifyPassport.secureSession())
        })

        this.scope = PluginScope.PARENT

    }
}