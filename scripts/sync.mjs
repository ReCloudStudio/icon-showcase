import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'ReCloudStudio/icon'
const BRANCH = 'main'
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dest = resolve(root, 'public/brand')
mkdirSync(dest, { recursive: true })

const files = [
  { url: `${RAW}/icon.svg`, name: 'icon.svg' },
  ...[16, 32, 48, 64, 96, 128, 256, 512].map((s) => ({
    url: `${RAW}/output/icon-${s}.png`,
    name: `icon-${s}.png`,
  })),
  ...['', '-studio'].flatMap((v) =>
    [
      { url: `${RAW}/icon-text${v}.svg`, name: `icon-text${v}.svg` },
      ...[16, 32, 48, 64, 96, 128, 256, 512].map((s) => ({
        url: `${RAW}/output/icon-text${v}-${s}.png`,
        name: `icon-text${v}-${s}.png`,
      })),
    ]),
]

let ok = 0
for (const f of files) {
  const res = await fetch(f.url)
  if (!res.ok) {
    console.error(`下载失败 ${f.url}: ${res.status}`)
    process.exitCode = 1
    continue
  }
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(resolve(dest, f.name), buf)
  ok++
  console.log(`✓ ${f.name} (${buf.length} bytes)`)
}

console.log(`已同步 ${ok}/${files.length} 个图标文件到 public/brand/`)
