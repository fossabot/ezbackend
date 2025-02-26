import { EzApp, EzBackendServer } from "./ezapp";
import fastify, { FastifyInstance, FastifyPluginCallback } from "fastify";
import fp from 'fastify-plugin'
import { Connection, createConnection, EntitySchema, ObjectLiteral, Repository } from "typeorm";
import { PluginScope } from "@ezbackend/core";
import { EzError } from "@ezbackend/utils";
import _ from 'lodash'
import path from 'path'
import dotenv from 'dotenv'
import { InjectOptions } from "light-my-request";

export interface EzBackendInstance {
    entities: Array<EntitySchema>
    server: EzBackendServer
    _server: FastifyInstance
    repo: Repository<ObjectLiteral>
    orm: Connection
}

export interface EzBackendOpts {
    address: string
    port: number
    orm: Parameters<typeof createConnection>[0]
    server: Parameters<typeof fastify>[0]
}

//TODO: Check if emojis will break instance names
//URGENT TODO: Strict types for instance, opts
async function addErrorSchema(instance: EzBackendInstance, opts: EzBackendOpts) {
    instance.server.addSchema({
        "$id": "ErrorResponse",
        type: 'object',
        properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
        }
    })
}

//URGENT TODO: Make running this optional in the default config
dotenv.config()

const defaultConfig = {
    port: process.env.PORT || 8000,
    address: process.env.ADDRESS || "127.0.0.1",
    server: {
        logger: {
            prettyPrint: {
                translateTime: "SYS:HH:MM:ss",
                ignore: "pid,hostname,reqId,responseTime,req,res",
                messageFormat: "[{req.method} {req.url}] {msg}",
            },
        },
    },
    orm: {
        type: "better-sqlite3",
        database: ":memory:",
        synchronize: true
    },
    auth: {
        secretKey: process.env.SECRET_KEY ?? undefined,
        secretKeyPath: path.join(process.cwd(), 'secret-key'),
        successRedirectURL: "http://localhost:8000/db-ui",
        failureRedirectURL: "http://localhost:8000/db-ui",
        google: {
            googleClientId: process.env.GOOGLE_CLIENT_ID,
            googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
            scope: ['profile'],
        }
    },
    // cors: {
    //     origin: (origin: string, cb: Function) => {
    //         if (/localhost/.test(origin)) {
    //             //  Request from localhost will pass
    //             cb(null, true)
    //             return
    //         }
    //         // Generate an error on other origins, disabling access
    //         cb(new Error("Not allowed"))
    //     }
    // }
}

// Derived from https://github.com/jeromemacias/fastify-boom/blob/master/index.js
// Kudos to him
const ezbErrorPage: FastifyPluginCallback<{}> = (fastify, options, next) => {
    //TODO: Strict types for error
    fastify.setErrorHandler(function errorHandler(error: any, request, reply) {
        request.log.error(error)
        if (error && error.query) {
            //Assumption: It is a typeorm error if it falls here
            request.log.error(`query: ${error.query}`)
            request.log.error(`parameters: ${error.parameters}`)
            request.log.error(`driverError: ${error.driverError}`)
        }
        if (error && error.isBoom) {
            reply
                .code(error.output.statusCode)
                .type('application/json')
                .headers(error.output.headers)
                .send(error.output.payload)

            return
        }

        reply.send(error || new Error(`Got non-error: ${error}`))
    })

    next()
}

/**
 * Child of EzApp. This is where you set up your backend setup tasks.
 */
export class EzBackend extends EzApp {

    constructor() {
        super()

        this.setInit('Create Entities Container', async (instance, opts) => {
            instance.entities = []
        })
        this.setPostInit('Create Database Connection', async (instance, opts) => {
            instance.orm = await createConnection(
                {
                    ...opts.orm,
                    entities: instance.entities
                }
            )
        })

        this.setHandler('Add Fastify Boom', async (instance, opts) => {
            instance.server.register(fp(ezbErrorPage))
        })
        this.setHandler('Add Error Schema', addErrorSchema)

        this.setPostHandler('Create Fastify Server', async (instance, opts) => {
            instance._server = fastify(opts.server)
        })

        this.setPostHandler('Register Fastify Plugins', async (instance, opts) => {
            this.registerFastifyPlugins(instance._server, this)
        })

        this.setRun('Run Fastify Server', async (instance, opts) => {
            await instance._server.listen(opts.port, opts.address)
        })

        this.scope = PluginScope.PARENT

    }

    getInternalInstance() {
        //TODO: Figure if there is a better way of getting this data
        //@ts-ignore
        const lastPlugin = this.instance._lastUsed
        if (lastPlugin === null) {
            throw new Error("Server is still undefined, have you called app.start() yet?")
        }
        return lastPlugin.server as EzBackendInstance
    }

    getInternalServer() {
        return this.getInternalInstance()._server
    }

    async inject(injectOpts: string | InjectOptions) {
        const server = this.getInternalServer()
        return server.inject(injectOpts)
    }

    verifyStarted(funcName?: string) {
        if (!this.instance.started) {

            const additionalMsg = funcName
                ? `before running ${funcName}`
                : ''

            throw new EzError("Instance not yet started",
                `The EzBackend instance must be started ${additionalMsg}`,
                `
await app.start()

You must wait for the above function to finish before you can run ${funcName}
`)
        }
    }

    printRoutes() {
        this.verifyStarted("printRoutes")
        return this.getInternalServer().printRoutes()
    }

    printPlugins() {
        this.verifyStarted("printPlugins")
        return this.getInternalServer().printPlugins()
    }

    prettyPrint() {
        this.verifyStarted("prettyPrint")
        return this.instance.prettyPrint()
    }

    //URGENT TODO: Remove temporary any fix
    async start(opts?: any) {
        opts = _.merge(defaultConfig, opts)
        await super.start(opts)
    }

}