<script setup lang="ts">
import brandsData from '~/data/brands.json'

interface Lockup {
  id: string
  name: string
  source: string
  sizes: number[]
  sizeSource: string | null
}
interface Extra {
  id: string
  name: string
  source: string
}
interface Brand {
  id: string
  name: string
  tagline: string
  repo: { owner: string; name: string; branch: string }
  icon: { source: string; sizes: number[]; sizeSource: string | null }
  lockups: Lockup[]
  extras: Extra[]
}

const brands = brandsData.brands as Brand[]
const active = ref(brands[0]!.id)
const brand = computed(() => brands.find((b) => b.id === active.value) ?? brands[0]!)

const bg = ref<'checker' | 'light' | 'dark'>('checker')
const bgOptions = [
  { key: 'checker', label: '透明' },
  { key: 'light', label: '浅色' },
  { key: 'dark', label: '深色' },
] as const

const bgClass = computed(() => {
  if (bg.value === 'light') return 'bg-white'
  if (bg.value === 'dark') return 'bg-zinc-900'
  return 'checkerboard'
})

const bgColor = computed(() => {
  if (bg.value === 'light') return '#ffffff'
  if (bg.value === 'dark') return '#0a0a12'
  return null
})

function ext(path: string) {
  return path.slice(path.lastIndexOf('.'))
}

const iconSrc = computed(() => `/brand/${brand.value.id}/icon${ext(brand.value.icon.source)}`)
const iconPng256 = computed(() =>
  brand.value.icon.sizes.includes(256) ? `/brand/${brand.value.id}/icon-256.png` : null,
)

const snippet = computed(() => {
  const b = brand.value
  const src = iconSrc.value
  const png = iconPng256.value ?? src
  return `<!-- ${b.name} 图标 -->
<picture>
  <source srcset="${src}" type="image/svg+xml" />
  <img src="${png}" alt="${b.name}" width="256" height="256" />
</picture>`
})

watch(active, () => (copied.value = false))

function download(href: string, name: string) {
  if (!bgColor.value) {
    const a = document.createElement('a')
    a.href = href
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    return
  }
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = href
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = bgColor.value
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = name.replace(/\.(png|svg)$/i, '-bg.png')
    a.click()
    a.remove()
  }
}

const copied = ref(false)
async function copySnippet(text: string = snippet.value) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">图标库</h1>
      <p class="mt-3 text-zinc-500 dark:text-zinc-400">
        ReCloud 项目、团队与组织品牌标识的矢量与位图资源，自由下载使用。
      </p>
    </div>

    <div class="mb-8 flex flex-wrap gap-1 border-b border-zinc-200 dark:border-zinc-800">
      <button
        v-for="b in brands"
        :key="b.id"
        type="button"
        class="-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
        :class="
          active === b.id
            ? 'border-primary-500 text-primary-500'
            : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
        "
        @click="active = b.id"
      >
        <img :src="`/brand/${b.id}/icon.svg`" class="h-5 w-5" alt="" />
        {{ b.name }}
      </button>
    </div>

    <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-semibold">{{ brand.name }}</h2>
        <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{{ brand.tagline }}</p>
        <a
          :href="`https://github.com/${brand.repo.owner}/${brand.repo.name}`"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-1 inline-block text-xs text-primary-500 hover:underline"
        >
          {{ brand.repo.owner }}/{{ brand.repo.name }}
        </a>
      </div>
      <UButtonGroup size="sm">
        <UButton
          v-for="opt in bgOptions"
          :key="opt.key"
          :variant="bg === opt.key ? 'solid' : 'soft'"
          @click="bg = opt.key"
        >
          {{ opt.label }}
        </UButton>
      </UButtonGroup>
    </div>

    <UCard class="mb-10">
      <template #header>
        <span class="font-medium">主预览</span>
      </template>
      <div class="flex items-center justify-center py-8">
        <div :class="[bgClass, 'flex h-64 w-64 items-center justify-center rounded-2xl']">
          <img :src="iconSrc" class="h-44 w-44" :alt="`${brand.name} 图标`" />
        </div>
      </div>
    </UCard>

    <template v-if="brand.icon.sizes.length">
      <h3 class="mb-4 text-lg font-semibold">尺寸</h3>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        <UCard v-for="s in brand.icon.sizes" :key="s">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ s }}×{{ s }}</span>
              <span class="text-xs text-zinc-400">PNG</span>
            </div>
          </template>
          <div class="flex h-32 items-center justify-center" :class="bgClass">
            <img
              :src="`/brand/${brand.id}/icon-${s}.png`"
              :alt="`icon-${s}`"
              :width="Math.min(s, 96)"
              :height="Math.min(s, 96)"
              class="max-h-24 max-w-24 object-contain"
            />
          </div>
          <template #footer>
            <UButton
              block
              size="xs"
              variant="soft"
              @click="download(`/brand/${brand.id}/icon-${s}.png`, `icon-${s}.png`)"
            >
              下载
            </UButton>
          </template>
        </UCard>
      </div>
    </template>

    <UCard class="mt-10">
      <template #header>
        <span class="font-medium">矢量 SVG</span>
      </template>
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div class="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl" :class="bgClass">
          <img :src="iconSrc" class="h-20 w-20" :alt="`${brand.name} 图标`" />
        </div>
        <div class="flex flex-col gap-3">
          <UButton variant="soft" @click="download(iconSrc, `icon${ext(brand.icon.source)}`)">
            下载 SVG
          </UButton>
          <UButton variant="ghost" size="xs" @click="copySnippet()">
            {{ copied ? '已复制' : '复制使用代码' }}
          </UButton>
        </div>
        <pre class="mt-0 flex-1 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-xs dark:bg-zinc-800"><code>{{ snippet }}</code></pre>
      </div>
    </UCard>

    <template v-if="brand.lockups.length">
      <h3 class="mb-4 mt-10 text-lg font-semibold">带文字图标</h3>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UCard v-for="l in brand.lockups" :key="l.id">
          <template #header>
            <span class="font-medium">{{ l.name }}</span>
          </template>
          <div class="flex h-40 items-center justify-center overflow-hidden rounded-xl" :class="bgClass">
            <img
              :src="`/brand/${brand.id}/${l.id}${ext(l.source)}`"
              class="max-h-28 w-auto"
              :alt="l.name"
            />
          </div>
          <template #footer>
            <UButton
              block
              size="xs"
              variant="soft"
              @click="download(`/brand/${brand.id}/${l.id}${ext(l.source)}`, `${l.id}${ext(l.source)}`)"
            >
              下载 SVG
            </UButton>
          </template>
        </UCard>
      </div>
    </template>

    <template v-if="brand.extras.length">
      <h3 class="mb-4 mt-10 text-lg font-semibold">其他资源</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <UCard v-for="e in brand.extras" :key="e.id">
          <template #header>
            <span class="font-medium">{{ e.name }}</span>
          </template>
          <div class="flex h-32 items-center justify-center rounded-xl" :class="bgClass">
            <img
              :src="`/brand/${brand.id}/${e.id}${ext(e.source)}`"
              class="max-h-20 w-auto"
              :alt="e.name"
            />
          </div>
          <template #footer>
            <UButton
              block
              size="xs"
              variant="soft"
              @click="download(`/brand/${brand.id}/${e.id}${ext(e.source)}`, `${e.id}${ext(e.source)}`)"
            >
              下载
            </UButton>
          </template>
        </UCard>
      </div>
    </template>
  </UContainer>
</template>
