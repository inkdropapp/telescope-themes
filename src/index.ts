import type { Environment, IInkdropPlugin } from '@inkdropapp/types'

import { setEnv } from './env'
import { toggleLightDarkTheme } from './theme-switcher'
import { SOURCE_ID, TelescopeSourceThemes } from './themes-source'

class InkdropPlugin implements IInkdropPlugin {
  private disposable: { dispose(): void } | null = null

  activate(env: Environment) {
    setEnv(env)
    env.telescope.registerSource(new TelescopeSourceThemes())

    this.disposable = env.commands.add(document.body, {
      'telescope-themes:show': () => {
        env.commands.dispatch(document.body, 'core:show-telescope', {
          scopedSourceId: SOURCE_ID,
          cancelBehavior: 'close'
        })
      },
      'telescope-themes:toggle-light-dark': () => toggleLightDarkTheme()
    })
  }

  deactivate(env: Environment) {
    env.telescope.unregisterSource(SOURCE_ID)
    this.disposable?.dispose()
    this.disposable = null
    setEnv(undefined)
  }
}

export default new InkdropPlugin()
