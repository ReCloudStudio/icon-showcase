import { writeFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dest = resolve(root, 'public/brand')

const { brands } = JSON.parse(readFileSync(resolve(root, 'app/data/brands.json'), 'utf8'))

const raw = (owner, name, branch) => `https://raw.githubusercontent.com/${owner}/${name}/${branch}`

function collect(brand) {
  const base = raw(brand.repo.owner, brand.repo.name, brand.repo.branch)
  const files = []
  const push = (url, name) => files.push({ url: `${base}/${url}`, name: `${brand.id}/${name}` })

  if (brand.icon) {
    push(brand.icon.source, `icon${extname(brand.icon.source)}`)
    for (const size of brand.icon.sizes ?? []) {
      if (brand.icon.sizeSource) {
        push(brand.icon.sizeSource.replace('{size}', size), `icon-${size}.png`)
      }
    }
  }

  for (const lockup of brand.lockups ?? []) {
    push(lockup.source, `${lockup.id}${extname(lockup.source)}`)
    for (const size of lockup.sizes ?? []) {
      if (lockup.sizeSource) {
        push(lockup.sizeSource.replace('{size}', size), `${lockup.id}-${size}.png`)
      }
    }
  }

  for (const extra of brand.extras ?? []) {
    push(extra.source, `${extra.id}${extname(extra.source)}`)
  }

  return files
}

rmSync(dest, { recursive: true, force: true })
mkdirSync(dest, { recursive: true })

const files = brands.flatMap(collect)

let ok = 0
for (const f of files) {
  const target = resolve(dest, f.name)
  mkdirSync(dirname(target), { recursive: true })
  const res = await fetch(f.url)
  if (!res.ok) {
    console.error(`下载失败 ${f.url}: ${res.status}`)
    process.exitCode = 1
    continue
  }
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(target, buf)
  ok++
  console.log(`✓ ${f.name} (${buf.length} bytes)`)
}

console.log(`已同步 ${ok}/${files.length} 个图标文件到 public/brand/`)
