import React from 'react'
import { D2Shim } from '../D2Shim'
import { render, waitFor, screen } from '@testing-library/react'
import * as useD2 from '../useD2'
import '@testing-library/jest-dom'

// this polyfill shouldn't be needed once Jest is upgraded to 26
window.MutationObserver = require('mutation-observer')

jest.mock('../useD2')

// useD2.useD2 = jest.fn().mockResolvedValue({ d2: 'd2obj', d2Error: undefined })
useD2.useD2 = jest.fn().mockImplementation(() => {
    // return Promise.resolve({ d2: 'd2obj', d2Error: undefined })
    return { d2: 'd2obj', d2Error: undefined }
})

describe('D2Shim', () => {
    it('returns a component with children passed in', async () => {
        const { container } = render(
            <D2Shim>
                {({ d2 }) => {
                    return <div title="the-div" d2={d2} />
                }}
            </D2Shim>
        )

        await waitFor(() =>
            expect(screen.queryByTitle('the-div')).toHaveAttribute(
                'd2',
                'd2obj'
            )
        )

        expect(container.firstChild).toMatchSnapshot()
    })
})
