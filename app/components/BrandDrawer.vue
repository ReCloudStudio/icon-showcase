<script setup lang="ts">
import type { Brand, Extra, Lockup } from '~~/shared/schema'
import { ACCENT_COLORS } from '~~/shared/accents'
import { publicUrl } from '~~/shared/assets'

const props = defineProps<{ brand: Brand | null }>()
const open = defineModel<boolean>({ default: false })

const siteConfig = useSiteConfig()
const { t } = useI18n()
const { mode, bgClass } = useBackground()
const { download } = useDownload()

const accentColor = computed(() => ACCENT_COLORS[props.brand?.accent ?? siteConfig.accent])
const bgOptions = computed(
  () =>
    [
      { key: 'checker', label: t('drawer.bgChecker') },
      { key: 'light', label: t('drawer.bgLight') },
      { key: 'dark', label: t('drawer.bgDark') },
    ] as const,
)

function iconUrl(size?: number) {
  const b = props.brand
  return b ? publicUrl(b.id, 'icon', 'icon', b.icon.source, size) : ''
}
function lockupUrl(l: Lockup, size?: number) {
  return props.brand ? publicUrl(props.brand.id, 'lockup', l.id, l.source, size) : ''
}
function extraUrl(e: Extra) {
  return props.brand ? publicUrl(props.brand.id, 'extra', e.id, e.source) : ''
}
function fileName(url: string, base: string) {
  return `${base}${url.slice(url.lastIndexOf('.'))}`
}

const snippet = computed(() => {
  const b = props.brand
  if (!b) return ''
  const svg = iconUrl()
  const png = b.icon.sizes.includes(256) ? iconUrl(256) : svg
  return `<!-- ${t('drawer.snippetComment', { name: b.name })} -->
<picture>
  <source srcset="${svg}" type="image/svg+xml" />
  <img src="${png}" alt="${b.name}" width="256" height="256" />
</picture>`
})

const copied = ref(false)
watch(
  () => props.brand,
  () => (copied.value = false),
)
async function copySnippet() {
  try {
    await navigator.clipboard.writeText(snippet.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <USlideover v-model="open" :ui="{ width: 'w-screen max-w-2xl' }">
    <div v-if="brand" class="flex h-full flex-col">
      <header
        class="flex items-start justify-between gap-4 border-b border-t-4 border-zinc-200 p-6 dark:border-zinc-800"
        :style="{ borderTopColor: accentColor }"
      >
        <div class="flex items-center gap-4">
          <div :class="[bgClass, 'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl']">
            <img :src="iconUrl()" class="h-9 w-9" :alt="brand.name" />
          </div>
          <div>
            <h2 class="text-lg font-semibold">{{ brand.name }}</h2>
            <p v-if="brand.tagline" class="text-sm text-zinc-500 dark:text-zinc-400">
              {{ brand.tagline }}
            </p>
            <a
              :href="`https://github.com/${brand.repo}`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs text-primary-500 hover:underline"
            >
              {{ brand.repo }}
            </a>
          </div>
        </div>
        <button
          type="button"
          class="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          :aria-label="t('common.close')"
          @click="open = false"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div class="flex-1 space-y-8 overflow-y-auto p-6">
        <p v-if="brand.description" class="text-sm text-zinc-600 dark:text-zinc-300">
          {{ brand.description }}
        </p>

        <section>
          <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ t('drawer.preview') }}</h3>
            <UButtonGroup size="xs">
              <UButton
                v-for="option in bgOptions"
                :key="option.key"
                :variant="mode === option.key ? 'solid' : 'soft'"
                @click="mode = option.key"
              >
                {{ option.label }}
              </UButton>
            </UButtonGroup>
          </div>
          <div :class="[bgClass, 'flex h-48 items-center justify-center rounded-2xl']">
            <img :src="iconUrl()" class="h-32 w-32" :alt="brand.name" />
          </div>
        </section>

        <section v-if="brand.icon.sizes.length">
          <h3 class="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ t('drawer.sizes') }}</h3>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              v-for="s in brand.icon.sizes"
              :key="s"
              class="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div :class="[bgClass, 'mb-2 flex h-20 items-center justify-center rounded-lg']">
                <img
                  :src="iconUrl(s)"
                  :width="Math.min(s, 64)"
                  :height="Math.min(s, 64)"
                  class="max-h-14 max-w-14 object-contain"
                  :alt="`icon-${s}`"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-zinc-500">{{ s }}×{{ s }}</span>
                <button
                  type="button"
                  class="text-xs text-primary-500 hover:underline"
                  @click="download(iconUrl(s), `icon-${s}.png`)"
                >
                  {{ t('common.download') }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ t('drawer.vectorSvg') }}</h3>
          <div class="flex flex-col gap-3">
            <div class="flex gap-2">
              <UButton variant="soft" size="xs" @click="download(iconUrl(), fileName(iconUrl(), 'icon'))">
                {{ t('drawer.downloadSvg') }}
              </UButton>
              <UButton variant="ghost" size="xs" @click="copySnippet">
                {{ copied ? t('common.copied') : t('drawer.copySnippet') }}
              </UButton>
            </div>
            <pre
              class="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-xs dark:bg-zinc-800"
            ><code>{{ snippet }}</code></pre>
          </div>
        </section>

        <section v-if="brand.lockups.length">
          <h3 class="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ t('drawer.lockups') }}</h3>
          <div class="space-y-3">
            <div
              v-for="l in brand.lockups"
              :key="l.id"
              class="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div :class="[bgClass, 'mb-2 flex h-24 items-center justify-center overflow-hidden rounded-lg']">
                <img :src="lockupUrl(l)" class="max-h-16 w-auto" :alt="l.name" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">{{ l.name }}</span>
                <button
                  type="button"
                  class="text-xs text-primary-500 hover:underline"
                  @click="download(lockupUrl(l), fileName(lockupUrl(l), l.id))"
                >
                  {{ t('common.download') }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section v-if="brand.extras.length">
          <h3 class="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ t('drawer.extras') }}</h3>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="e in brand.extras"
              :key="e.id"
              class="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div :class="[bgClass, 'mb-2 flex h-20 items-center justify-center rounded-lg']">
                <img :src="extraUrl(e)" class="max-h-12 w-auto" :alt="e.name" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">{{ e.name }}</span>
                <button
                  type="button"
                  class="text-xs text-primary-500 hover:underline"
                  @click="download(extraUrl(e), fileName(extraUrl(e), e.id))"
                >
                  {{ t('common.download') }}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </USlideover>
</template>
