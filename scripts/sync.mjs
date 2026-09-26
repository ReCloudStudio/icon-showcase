import { writeFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { iconsConfigSchema } from '../shared/schema.ts'
import { localName } from '../shared/assets.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dest = resolve(root, 'public/brand')

const config = iconsConfigSchema.parse(
  JSON.parse(readFileSync(resolve(root, 'app/data/icons.json'), 'utf8')),
)

function rawUrl(repo, ref, path) {
  return `https://raw.githubusercontent.com/${repo}/${ref ?? 'HEAD'}/${path}`
}

const jobs = []

for (const group of Object.values(config.groups)) {
  for (const brand of group.brands) {
    const push = (source, kind, id, size) => {
      if (typeof source !== 'string') return
      const path = size === undefined ? source : source.replace('{size}', String(size))
      jobs.push({
        url: rawUrl(brand.repo, brand.ref, path),
        name: `${brand.id}/${localName(kind, id, source, size)}`,
      })
    }

    push(brand.icon.source, 'icon', 'icon')
    if (brand.icon.sizeSource) {
      for (const size of brand.icon.sizes) push(brand.icon.sizeSource, 'icon', 'icon', size)
    }
    for (const lockup of brand.lockups) {
      push(lockup.source, 'lockup', lockup.id)
      if (lockup.sizeSource) {
        for (const size of lockup.sizes) push(lockup.sizeSource, 'lockup', lockup.id, size)
      }
    }
    for (const extra of brand.extras) push(extra.source, 'extra', extra.id)
  }
}

rmSync(dest, { recursive: true, force: true })
mkdirSync(dest, { recursive: true })

let ok = 0
for (const job of jobs) {
  const target = resolve(dest, job.name)
  mkdirSync(dirname(target), { recursive: true })
  const res = await fetch(job.url)
  if (!res.ok) {
    console.error(`下载失败 ${job.url}: ${res.status}`)
    process.exitCode = 1
    continue
  }
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(target, buf)
  ok++
  console.log(`✓ ${job.name} (${buf.length} bytes)`)
}

console.log(`已同步 ${ok}/${jobs.length} 个图标文件到 public/brand/`)
