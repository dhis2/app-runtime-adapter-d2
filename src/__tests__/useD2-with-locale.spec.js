import { renderHook } from '@testing-library/react-hooks'
import * as alld2 from 'd2'
import { useD2 } from '../useD2'

jest.mock('@dhis2/app-runtime', () => {
    return {
        useConfig: () => {
            return {
                baseUrl: 'baseurl',
                apiVersion: '42',
            }
        },
    }
})

describe('useD2 with locale', () => {
    it('sets the language from the given locale', async () => {
        const initSpy = jest.spyOn(alld2, 'init').mockResolvedValue('d2obj')
        const userSettingsSpy = jest
            .spyOn(alld2, 'getUserSettings')
            .mockResolvedValue({
                keyUiLocale: 'no',
            })
        const spy = jest.spyOn(alld2.config.i18n.sources, 'add')
        const { waitForNextUpdate } = renderHook(() =>
            useD2({
                d2Config: { schemas: ['schema1'] },
                i18nRoot: 'i18n_old',
                locale: 'it',
            })
        )

        await waitForNextUpdate()

        expect(userSettingsSpy).toHaveBeenCalledTimes(0)

        expect(spy).toHaveBeenCalledWith('i18n_old/i18n_module_it.properties')

        jest.restoreAllMocks()
    })
})
