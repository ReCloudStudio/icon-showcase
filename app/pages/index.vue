<script setup lang="ts">
const sizes = [16, 32, 48, 64, 96, 128, 256, 512]

const lockups = [
  { name: 'ReCloud', file: 'icon-text.svg' },
  { name: 'ReCloud Studio', file: 'icon-text-studio.svg' },
]

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

const snippet = `<!-- ReCloud Studio 图标 -->
<picture>
  <source srcset="/brand/icon.svg" type="image/svg+xml" />
  <img src="/brand/icon-256.png" alt="ReCloud Studio" width="256" height="256" />
</picture>`

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
async function copySnippet(text: string = snippet) {
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
    <div class="mb-10 text-center">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">ReCloud Studio 图标</h1>
      <p class="mt-3 text-zinc-500 dark:text-zinc-400">品牌标识的矢量与位图资源，自由下载使用。</p>
    </div>

    <UCard class="mb-10">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <span class="font-medium">主预览</span>
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
      </template>
      <div class="flex items-center justify-center py-8">
        <div :class="[bgClass, 'flex h-64 w-64 items-center justify-center rounded-2xl']">
          <img src="/brand/icon.svg" class="h-44 w-44" alt="ReCloud Studio 图标" />
        </div>
      </div>
    </UCard>

    <h2 class="mb-4 text-xl font-semibold">尺寸</h2>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <UCard v-for="s in sizes" :key="s">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">{{ s }}×{{ s }}</span>
            <span class="text-xs text-zinc-400">PNG</span>
          </div>
        </template>
        <div class="flex h-32 items-center justify-center" :class="bgClass">
          <img
            :src="`/brand/icon-${s}.png`"
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
            @click="download(`/brand/icon-${s}.png`, `icon-${s}.png`)"
          >
            下载
          </UButton>
        </template>
      </UCard>
    </div>

    <UCard class="mt-10">
      <template #header>
        <span class="font-medium">矢量 SVG</span>
      </template>
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div class="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl" :class="bgClass">
          <img src="/brand/icon.svg" class="h-20 w-20" alt="ReCloud Studio 图标" />
        </div>
        <div class="flex flex-col gap-3">
          <UButton variant="soft" @click="download('/brand/icon.svg', 'icon.svg')">下载 SVG</UButton>
          <UButton variant="ghost" size="xs" @click="copySnippet">
            {{ copied ? '已复制' : '复制使用代码' }}
          </UButton>
        </div>
        <pre class="mt-0 flex-1 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-xs dark:bg-zinc-800"><code>{{ snippet }}</code></pre>
      </div>
    </UCard>

    <h2 class="mb-4 mt-10 text-xl font-semibold">带文字图标</h2>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <UCard v-for="l in lockups" :key="l.file">
        <template #header>
          <span class="font-medium">{{ l.name }}</span>
        </template>
        <div class="flex h-40 items-center justify-center overflow-hidden rounded-xl" :class="bgClass">
          <img :src="`/brand/${l.file}`" class="max-h-28 w-auto" :alt="l.name" />
        </div>
        <template #footer>
          <UButton
            block
            size="xs"
            variant="soft"
            @click="download(`/brand/${l.file}`, l.file)"
          >
            下载
          </UButton>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
