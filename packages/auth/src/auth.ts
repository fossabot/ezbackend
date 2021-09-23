import { Column } from 'typeorm'
import providers from './providers'

type IProviders = Array<'google'>

/**
 * Represents a TEST OBJECT.
 * @constructor
 * @param {string} TESTPARAM1 - Lorem Ipsum Dolor 1.
 * @param {string} TESTPARAM2 - Lorem Ipsum Dolor 2.
 */
export function EzAuthUser(...providerNames: IProviders): ClassDecorator {

    return function (constructor: Function) {
        //URGENT TODO: Throw error if there are non-nullable, non generated columns the model
        //TODO: Avoid using this fakeclass method
        //TODO: Throw error if there are repeat providers

        const fakeClass = { constructor: constructor }
        Column('varchar')(fakeClass, 'googleId')
        Column('simple-json')(fakeClass, 'googleData')


        providerNames.forEach((providerName) => {
            const Provider = providers[providerName]
            const provider = new Provider(constructor)
            provider.addProvider()
        })
    }
}
