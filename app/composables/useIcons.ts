import type { IconsConfig } from '~~/shared/schema'
import iconsData from '~/data/icons.json'

const iconsConfig = iconsData as unknown as IconsConfig

export function useIcons() {
  return iconsConfig
}
