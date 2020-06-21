import { useState, useEffect } from 'react'
import { init as initD2, config, getUserSettings } from 'd2'
import { useConfig } from '@dhis2/app-runtime'

let theD2 = null

const configI18n = async (baseUrl, i18nRoot) => {
  config.baseUrl = baseUrl

  const settings = await getUserSettings()

  if (settings.keyUiLocale && settings.keyUiLocale !== 'en') {
    config.i18n.sources.add(
      `${i18nRoot}/i18n_module_${settings.keyUiLocale}.properties`
    )
  }

  config.i18n.sources.add('${i18nRoot}/i18n_module_en.properties')
}

const init = async ({ appUrl, baseUrl, d2Config, i18nRoot = null }) => {
  if (i18nRoot) {
    await configI18n(baseUrl, i18nRoot)
  }

  return await initD2({
    appUrl,
    baseUrl,
    ...d2Config,
  })
}

export const useD2 = ({
  d2Config = {},
  onInitialized = Function.prototype,
  i18nRoot,
}) => {
  const { baseUrl, apiVersion } = useConfig()
  const [d2, setD2] = useState(theD2)
  const [d2Error, setError] = useState(undefined)

  useEffect(() => {
    if (!theD2) {
      init({
        appUrl: baseUrl,
        baseUrl: `${baseUrl}/api/${apiVersion}`,
        d2Config,
        i18nRoot
      })
        .then(async (d2) => {
          await onInitialized(d2)
          theD2 = d2
          setD2(d2)
        })
        .catch(setError)
    }
  }, [])

  return { d2, d2Error } // d2 is null while loading
}
