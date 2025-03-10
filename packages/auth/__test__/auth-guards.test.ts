//URGENT TODO: Figure out why github actions is throwing req has 'any' type even though locally there is no issue
import { EzApp, EzBackend } from "../../common/src";
import path from 'path'
import dotenv from 'dotenv'
import Boom from '@hapi/boom'
import { RouteShorthandOptionsWithHandler } from "fastify";

describe("Plugin Registering", () => {

    dotenv.config()

    let app: EzBackend

    const defaultConfig = {
        port: 3000,
        server: {
            logger: false
        },
        auth: {
            secretKeyPath: path.resolve(__dirname, "./testing-not-secret-key"),
            google: {
                googleClientId: process.env.GOOGLE_CLIENT_ID!,
                googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                scope: ['profile'],
                successRedirectURL: "http://localhost:8888/docs",
                failureRedirectURL: "http://localhost:8888/docs"
            }
        }
    }

    beforeEach(() => {
        app = new EzBackend()

        //Prevent server from starting
        app.removeHook("_run", "Run Fastify Server")
    })

    afterEach(async () => {
        const instance = app.getInternalInstance()
        await instance.orm.close();
        await instance._server.close();
    });

    it("Should be able to guard using an app", async () => {

        const v1Namespace = new EzApp()

        app.addApp('v1', v1Namespace, { prefix: 'v1' })

        const guard = new EzApp()
        guard.addHook('onRequest',async (req,res) => {})

        guard.addHook('preHandler', async(req,res) => {
            //@ts-ignore
            if (req.user === undefined) {
                throw Boom.unauthorized()
            }
        })

        const testApp = new EzApp()

        type x = RouteShorthandOptionsWithHandler

        testApp.get('/', async(req,res) => {
            return {hello: 'world'}
        })

        v1Namespace.addApp('guard', guard)
        guard.addApp('testApp', testApp, {prefix: 'test'})

        await app.start(defaultConfig)

        const result = await app.inject({
            method: "GET",
            url: "v1/test",
        })

        expect(result.statusCode).toBe(401)

    })

    it("Should be able to guard on the same app", async () => {

        const v1Namespace = new EzApp()

        app.addApp('v1', v1Namespace, { prefix: 'v1' })

        const testApp = new EzApp()
        
        testApp.addHook('preHandler', async(req,res) => {
            //@ts-ignore
            if (req.user === undefined) {
                throw Boom.unauthorized()
            }
        })

        testApp.get('/', async(req,res) => {
            return {hello: 'world'}
        })

        v1Namespace.addApp('testApp', testApp, {prefix: 'test'})

        await app.start(defaultConfig)

        const result = await app.inject({
            method: "GET",
            url: "v1/test",
        })

        expect(result.statusCode).toBe(401)

    })

    it("Should be able to guard specific model routes", async () => {

        const v1Namespace = new EzApp()

        app.addApp('v1', v1Namespace, { prefix: 'v1' })

        const testApp = new EzApp()

        testApp.addHook('preHandler', async(req,res) => {
            //@ts-ignore
            if (req.user === undefined) {
                throw Boom.unauthorized()
            }
        })

        testApp.get('/', async(req,res) => {
            return {hello: 'world'}
        })

        v1Namespace.addApp('testApp', testApp, {prefix: 'test'})

        await app.start(defaultConfig)

        const result = await app.inject({
            method: "GET",
            url: "v1/test",
        })

        expect(result.statusCode).toBe(401)

    })

})