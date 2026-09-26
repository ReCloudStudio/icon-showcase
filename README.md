# ReCloud Icon Showcase

可 fork 的 Nuxt 4 图标展示站，支持按团队/组织聚合多个项目，展示 SVG、多尺寸 PNG、字标、额外资源与使用片段。

## 技术栈

- Nuxt 4 + @nuxt/ui v2（Tailwind v3）
- 明暗主题（`@nuxtjs/color-mode`）
- zod 配置校验
- Cloudflare Pages（`cloudflare_pages` preset）
- Bun

## 配置

站点身份配置位于项目根目录的 `site.config.ts`：

```ts
export const siteConfig = {
  name: 'ReCloud Studio',
  description: '品牌图标展示站',
  logo: '/brand/recloud-studio/icon.svg',
  accent: 'brand',
  ogUrl: 'https://icon.worldexecute.me',
  github: 'https://github.com/ReCloudStudio',
  footer: 'ReCloud Studio',
  defaultGroup: 'recloud',
  links: [],
}
```

图标数据位于 `app/data/icons.json`，使用 `groups` 对象聚合团队/组织：

```json
{
  "groups": {
    "acme": {
      "name": "Acme Team",
      "url": "https://github.com/acme",
      "logo": true,
      "brands": [
        {
          "id": "acme-api",
          "name": "Acme API",
          "repo": "acme/api",
          "url": "https://api.acme.example",
          "tagline": "API service",
          "icon": { "source": "assets/icon.svg", "sizes": [] },
          "lockups": [],
          "extras": []
        }
      ]
    },
    "another-team": {
      "name": "Another Team",
      "brands": []
    }
  }
}
```

品牌资源默认从 `repo` 的 GitHub 仓库同步，也可以使用本地资源：

```json
{ "source": { "type": "local", "path": "brand/acme/icon.svg" }, "sizes": [] }
```

完整字段和 fork 流程见 [`FORKING.md`](FORKING.md)。

## 同步图标

```bash
bun run sync
```

同步脚本会先校验 `site.config.ts` 与 `app/data/icons.json`，再将 GitHub 资源写入 `public/brand/<id>/`；本地资源不会被覆盖。

## 本地开发

```bash
bun install
bun run dev
bun run build
```

## 部署

```bash
bunx wrangler login
bun run deploy
```

Cloudflare Pages 构建命令为 `bun run build`，输出目录为 `dist`。

## 目录结构

- `site.config.ts`：站点名称、描述、Logo、强调色、链接与默认分组。
- `app/data/icons.json`：分组与品牌图标资源清单。
- `app/pages/index.vue`：分组标签与品牌卡片网格。
- `app/components/BrandCard.vue`：品牌卡片。
- `app/components/BrandDrawer.vue`：品牌详情抽屉、预览、下载与代码片段。
- `app/composables/`：站点配置、背景、图标与下载逻辑。
- `shared/`：zod schema、强调色与资源路径工具。
- `public/brand/<id>/`：同步生成的品牌资源。
- `scripts/sync.mjs`：校验并同步远程品牌资源。

## 许可

源代码使用 AGPL-3.0，详见 [LICENSE](LICENSE)。图标资源遵循各品牌自己的使用规范。
