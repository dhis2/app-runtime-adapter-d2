import React from 'react'
import * as PropTypes from 'prop-types'
import { useD2 } from './useD2'

export const D2Shim = ({ d2Config, onInitialized, i18nRoot, children }) => {
    const { d2, d2Error } = useD2({ d2Config, onInitialized, i18nRoot })

    return children({ d2, d2Error })
}

D2Shim.propTypes = {
    onInitialized: PropTypes.func,
    d2Config: PropTypes.object,
    children: PropTypes.func.isRequired,
    i18nRoot: PropTypes.string
}
