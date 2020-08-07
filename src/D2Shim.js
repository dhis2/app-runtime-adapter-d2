import * as PropTypes from 'prop-types'
import { useD2 } from './useD2'

export const D2Shim = ({ children, onInitialized, d2Config, i18nRoot }) => {
    const { d2, d2Error } = useD2({ onInitialized, d2Config, i18nRoot })

    return children({ d2, d2Error })
}

D2Shim.propTypes = {
    children: PropTypes.func.isRequired,
    d2Config: PropTypes.object,
    i18nRoot: PropTypes.string,
    onInitialized: PropTypes.func,
}
