/* eslint-disable no-import-assign,import/namespace */

import { render } from '@testing-library/react'
import React from 'react'
import { D2Shim } from '../D2Shim.js'
import * as useD2 from '../useD2.js'
import '@testing-library/jest-dom'

// this polyfill shouldn't be needed once Jest is upgraded to 26
window.MutationObserver = require('mutation-observer')

jest.mock('../useD2')

describe('D2Shim', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
    })
    it('returns a component with children passed in', () => {
        useD2.useD2 = jest
            .fn()
            .mockReturnValue({ d2: null, d2Error: undefined })

        const { container } = render(
            <D2Shim>
                {({ d2 }) => {
                    if (!d2) {
                        return null
                    }
                    return <div d2={d2} />
                }}
            </D2Shim>
        )

        expect(container.firstChild).toMatchSnapshot()
    })
    it('returns a component with children passed in', () => {
        useD2.useD2 = jest
            .fn()
            .mockReturnValue({ d2: 'd2obj', d2Error: undefined })

        const { container } = render(
            <D2Shim>
                {({ d2 }) => {
                    if (!d2) {
                        return null
                    }
                    return <div d2={d2} />
                }}
            </D2Shim>
        )

        expect(container.firstChild).toMatchSnapshot()
    })
})
