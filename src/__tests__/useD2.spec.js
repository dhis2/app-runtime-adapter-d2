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

describe('useD2', () => {
    it('returns the d2 config and sets the language', async () => {
        const initSpy = jest.spyOn(alld2, 'init').mockResolvedValue('d2obj')
        const userSettingsSpy = jest
            .spyOn(alld2, 'getUserSettings')
            .mockResolvedValue({
                keyUiLocale: 'no',
            })
        const spy = jest.spyOn(alld2.config.i18n.sources, 'add')
        const mockOnInit = jest.fn().mockResolvedValue('initialized')

        const { result, waitForNextUpdate } = renderHook(() =>
            useD2({
                d2Config: { schemas: ['schema1'] },
                onInitialized: mockOnInit,
                i18nRoot: 'i18n_old',
            })
        )

        expect(result.current).toMatchObject({
            d2: null,
            d2Error: undefined,
        })
        expect(mockOnInit).toHaveBeenCalledTimes(0)

        await waitForNextUpdate()

        expect(result.current).toMatchObject({
            d2: 'd2obj',
            d2Error: undefined,
        })

        expect(mockOnInit).toHaveBeenCalledTimes(1)

        expect(initSpy).toHaveBeenCalledWith({
            appUrl: 'baseurl',
            baseUrl: 'baseurl/api/42',
            schemas: ['schema1'],
        })

        expect(userSettingsSpy).toHaveBeenCalledTimes(1)

        expect(spy).toHaveBeenCalledWith('i18n_old/i18n_module_no.properties')

        jest.restoreAllMocks()
    })
})
