import type { Package } from '@inkdropapp/types'

import { getEnv } from './env'

export type ThemeAppearance = 'light' | 'dark'

const FALLBACK_THEME: Record<ThemeAppearance, string> = {
  light: 'default-light',
  dark: 'default-dark'
}

/**
 * Determine whether a theme renders a light or dark UI, using the same
 * heuristic as Inkdrop core: explicit `themeAppearance` metadata wins,
 * otherwise a name containing "dark" means dark.
 */
export function getThemeAppearance(theme: Package): ThemeAppearance {
  return theme.metadata.themeAppearance === 'dark' || theme.name.includes('dark') ? 'dark' : 'light'
}

export function getLoadedTheme(name: string): Package | undefined {
  return getEnv()
    .themes.getLoadedThemes()
    .find((theme) => theme.name === name)
}

/**
 * Activate a theme and remember it as the preferred theme for its
 * appearance, so {@link toggleLightDarkTheme} can come back to it later.
 */
export function applyTheme(name: string): void {
  const { config } = getEnv()
  const theme = getLoadedTheme(name)
  if (!theme) return

  config.set(`telescope-themes.${getThemeAppearance(theme)}Theme`, name)
  config.set('core.theme', name)
}

/**
 * Switch between the preferred light and dark themes. The theme being
 * switched away from is remembered as the preferred theme for its
 * appearance, so toggling back restores it.
 */
export function toggleLightDarkTheme(): void {
  const { config, themes } = getEnv()
  const currentName = themes.getEnabledThemeName()
  const current = getLoadedTheme(currentName)
  const currentAppearance: ThemeAppearance = current
    ? getThemeAppearance(current)
    : /dark/i.test(currentName)
      ? 'dark'
      : 'light'
  const targetAppearance: ThemeAppearance = currentAppearance === 'dark' ? 'light' : 'dark'

  config.set(`telescope-themes.${currentAppearance}Theme`, currentName)

  const preferred = config.get<string>(`telescope-themes.${targetAppearance}Theme`)
  const target =
    preferred && getLoadedTheme(preferred) ? preferred : FALLBACK_THEME[targetAppearance]
  config.set('core.theme', target)
}
