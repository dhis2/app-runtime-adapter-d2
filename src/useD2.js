import { useConfig } from '@dhis2/app-runtime'
import { init, config, getUserSettings } from 'd2'
import { useState, useEffect } from 'react'

let theD2 = null

const configI18n = async (baseUrl, i18nRoot, locale) => {
    config.baseUrl = baseUrl

    const currentLocale = locale || (await getUserSettings()).keyUiLocale

    if (currentLocale && currentLocale !== 'en') {
        config.i18n.sources.add(
            `${i18nRoot}/i18n_module_${currentLocale}.properties`
        )
    }

    config.i18n.sources.add(`${i18nRoot}/i18n_module_en.properties`)
}

const initD2 = async ({
    appUrl,
    baseUrl,
    d2Config,
    i18nRoot = null,
    locale,
}) => {
    if (i18nRoot) {
        await configI18n(baseUrl, i18nRoot, locale)
    }

    return await init({
        appUrl,
        baseUrl,
        ...d2Config,
    })
}

export const useD2 = ({
    d2Config = {},
    onInitialized = Function.prototype,
    i18nRoot,
    locale,
} = {}) => {
    const { baseUrl, apiVersion } = useConfig()
    const [d2, setD2] = useState(theD2)
    const [d2Error, setError] = useState(undefined)

    useEffect(() => {
        if (!theD2) {
            initD2({
                appUrl: baseUrl,
                baseUrl: `${baseUrl}/api/${apiVersion}`,
                d2Config,
                i18nRoot,
                locale,
            })
                .then(async (d2) => {
                    await onInitialized(d2)
                    theD2 = d2
                    setD2(d2)
                })
                .catch(setError)
        }
    }, [apiVersion, baseUrl, d2Config, i18nRoot, locale, onInitialized])

    return { d2, d2Error } // d2 is null while loading
}
