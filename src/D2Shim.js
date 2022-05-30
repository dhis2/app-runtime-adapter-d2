import * as PropTypes from 'prop-types'
import { useD2 } from './useD2.js'

export const D2Shim = ({ children, onInitialized, d2Config, i18nRoot, locale }) => {
    const { d2, d2Error } = useD2({ onInitialized, d2Config, i18nRoot, locale })

    return children({ d2, d2Error })
}

D2Shim.propTypes = {
    children: PropTypes.func.isRequired,
    d2Config: PropTypes.object,
    i18nRoot: PropTypes.string,
    locale: PropTypes.string,
    onInitialized: PropTypes.func,
}
