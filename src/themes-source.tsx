import type { Package, TelescopeResult, TelescopeSourceItem } from '@inkdropapp/types'
import { TelescopeSource } from 'inkdrop'

import { PaletteIcon, ThemeSwatchIcon } from './components/icons'
import { getEnv } from './env'
import { applyTheme, getThemeAppearance } from './theme-switcher'

export const SOURCE_ID = 'themes'

/**
 * A telescope source listing all installed themes, with a palette swatch
 * preview per theme. Applying an item switches `core.theme` to it.
 */
export class TelescopeSourceThemes extends TelescopeSource {
  id = SOURCE_ID
  name = 'Themes'
  description = 'Switch between installed themes'
  defaultAlias = 'h'

  // palette.json is read from disk on every `getThemePalette` call, so
  // cache per theme name for the lifetime of the source.
  private paletteCache = new Map<string, Record<string, string> | null>()

  getItems(): TelescopeResult {
    const { themes } = getEnv()
    const activeName = themes.getEnabledThemeName()
    const loaded = [...themes.getLoadedThemes()].sort((a, b) => a.name.localeCompare(b.name))

    return {
      options: loaded.map((theme) => this.toItem(theme, theme.name === activeName))
    }
  }

  apply(item: TelescopeSourceItem, action: string): boolean {
    if (action === 'apply') {
      applyTheme(item.id.replace(/^theme:/, ''))
    }
    return true
  }

  getIcon() {
    return <PaletteIcon />
  }

  private toItem(theme: Package, isActive: boolean): TelescopeSourceItem {
    const palette = this.getPalette(theme.name)

    return {
      id: `theme:${theme.name}`,
      type: 'Theme',
      label: theme.name,
      detail: getThemeAppearance(theme) === 'dark' ? 'Dark' : 'Light',
      icon: () => <ThemeSwatchIcon palette={palette} />,
      accessoryView: isActive
        ? () => <span className="telescope-themes-current">current</span>
        : undefined,
      boost: isActive ? 1 : 0,
      source: this.id,
      actions: [
        {
          type: 'apply',
          label: 'Apply Theme'
        }
      ]
    }
  }

  private getPalette(name: string): Record<string, string> | null {
    if (!this.paletteCache.has(name)) {
      this.paletteCache.set(name, getEnv().themes.getThemePalette(name))
    }
    return this.paletteCache.get(name) ?? null
  }
}
