# app-runtime-adapter-d2

Support [`d2`](https://github.com/dhis2/d2) and [`d2-ui`](https://github.com/dhis2/d2-ui) components in [DHIS2 Platform](https://platform.dhis2.nu) applications

## Requirements

Ths library has two peer dependencies:

-   [`d2`](https://www.npmjs.com/package/d2)
-   [`@dhis2/app-runtime`](https://www.npmjs.com/package/@dhis2/app-runtime)

## Initializing D2

There are two entrypoints to support initialization and access to the `d2` singleton from within an application.

-   `useD2`, a React Hook

```js
import React, { useState } from 'react'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { getUserSettings } from 'd2'

const d2Config = {
    schemas: ['dataElement', 'program', 'userGroup'],
}

const MyApp = () => {
    const [userSettings, setUserSettings] = useState(null)

    const onInitialized = d2 => {
        getUserSettings().then(setUserSettings)

        /* ... do other things with d2 ... */
    }
    const { d2, d2Error } = useD2({ d2Config, onInitialized })

    /* ... optionally render error or loading state ... */

    if (d2 && !d2Error && userSettings) {
        /* ... render the application ... */
    }
}

export default MyApp
```

-   `D2Shim`, a React Component that wraps the `useD2` hook. It accepts a single child **function**

```js
import React, { useState } from 'react'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { getUserSettings } from 'd2'
import { ScreenCover, CircularLoader } from '@dhis2/ui-core'
import Root from './components/Root' // This is the business logic of the application

const d2Config = {
    schemas: ['dataElement', 'program', 'userGroup'],
}

const onD2Initialized = async d2 => {
    const userSettings = await getUserSettings()

    /* do something with userSettings or d2 - spawn Redux initialization actions, for instance */
}

const MyApp = () => (
    <D2Shim d2Config={d2Config} onInitialized={onD2Initialized}>
        {({ d2, d2Error }) => (
            <>
                {d2Error && (
                    <div
                        style={{
                            display: 'flex',
                            height: '100%',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {`D2 initialization error: ${d2Error}`}
                    </div>
                )}
                {!d2 && !d2Error && (
                    <ScreenCover>
                        <CircularLoader />
                    </ScreenCover>
                )}
                {d2 && <Root d2={d2} store={store} />}
            </>
        )}
    </D2Shim>
)

export default MyApp
```

Both accept three options:

-   `d2Config` - an object passed to the `init` function when initializing `d2`
-   `onInitialized` - a callback function executed when `d2` has been initialized. It will be **await**ed, so returning a promise will delay resolution of the `d2` return value.
-   `i18nRoot` - an optional string that indicates the app's directory containing "legacy" i18n files, e.g., i18n_module_en.properties. In data-visualier, for example, the string would be "i18n_old". When this string is set, the properties file of the current language will be loaded.

## Referencing D2

The same two entrypoints can be used multiple places within an application to reference the `d2` singleton. Once `d2` has been initialized it will not be re-initialized, so you can safely call `useD2` or render `D2Shim` without any arguments further down the VDom tree after rendering `D2Shim` with initialization parameters at the application entrypoint.
