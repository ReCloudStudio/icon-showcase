<script setup lang="ts">
const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="relative min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-[#0a0a12] dark:text-white">
    <div class="pointer-events-none fixed inset-0 z-0">
      <div class="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:64px_64px] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
      <div class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-500/10 blur-[128px]" />
      <div class="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-500/10 blur-[128px]" />
    </div>

    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:left-4 focus:top-4 focus:rounded-full focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
    >
      跳到主内容
    </a>

    <header class="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/20">
          <img src="/brand/icon.svg" class="h-5 w-5" alt="" />
        </div>
        <span class="text-lg font-bold tracking-tight">ReCloud <span class="text-primary-500">Studio</span></span>
      </div>
      <div class="flex items-center gap-4">
        <a
          href="https://github.com/recloudstudio"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          GitHub
        </a>
        <button
          class="rounded-full p-2 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
          :aria-label="colorMode.value === 'dark' ? '切换到浅色' : '切换到深色'"
          :title="colorMode.value === 'dark' ? '切换到浅色' : '切换到深色'"
          @click="toggleTheme"
        >
          <svg v-if="colorMode.value === 'dark'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        </button>
      </div>
    </header>

    <main id="main" class="relative z-10">
      <NuxtPage />
    </main>

    <footer class="relative z-10 border-t border-zinc-200 px-6 py-12 dark:border-zinc-900">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 text-xs text-zinc-500 dark:text-zinc-700 sm:flex-row sm:justify-between">
        <div>&copy; {{ new Date().getFullYear() }} ReCloud Studio. 保留所有权利。</div>
        <a
          href="https://github.com/recloudstudio"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          GitHub
        </a>
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  scroll-behavior: smooth;
}

::selection {
  background-color: rgba(48, 105, 201, 0.25);
  color: inherit;
}

.dark ::selection {
  background-color: rgba(48, 105, 201, 0.35);
}

*:focus-visible {
  outline: 2px solid rgb(48 105 201);
  outline-offset: 2px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
