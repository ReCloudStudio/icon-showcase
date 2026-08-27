import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/**/*.{vue,js,ts,tsx}',
    './app.config.ts',
    './nuxt.config.ts',
    './node_modules/@nuxt/ui/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef5ff',
          100: '#d9e8ff',
          200: '#bcd7fe',
          300: '#8fbcfd',
          400: '#5a9bfb',
          500: '#3069c9',
          600: '#2654a8',
          700: '#1d4083',
          800: '#16315f',
          900: '#0d55cd',
        },
      },
    },
  },
}
