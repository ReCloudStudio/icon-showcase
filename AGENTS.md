# ReCloud 图标展示站

Nuxt 4 可 fork 图标展示站，支持按团队/组织聚合多个项目。默认身份为 ReCloud Studio，但站点身份与图标数据均由配置驱动。部署于 Cloudflare Pages。

## 技术栈

- Nuxt 4 + @nuxt/ui v2（Tailwind v3）+ @nuxtjs/color-mode。
- Nitro preset `cloudflare_pages`，构建产物目录 `dist/`。
- zod 用于构建期与同步期配置校验。
- 包管理器 bun（`package.json` 的 `packageManager` 字段锁定）。

## 目录结构

- `site.config.ts`：站点名称、描述、Logo、强调色、链接、页脚与默认分组。
- `app/data/icons.json`：单一图标清单，使用 `groups` 对象聚合团队/组织；新增品牌改这里。
- `app/app.vue`：页面壳层（页眉身份、主题切换、页脚）。
- `app/pages/index.vue`：分组标签与品牌卡片网格。
- `app/components/BrandCard.vue`：品牌卡片。
- `app/components/BrandDrawer.vue`：详情抽屉、背景切换、预览、尺寸、下载与使用片段。
- `app/composables/`：站点配置、背景、图标与下载逻辑。
- `shared/schema.ts`：`site.config.ts` 与 `icons.json` 的 zod schema 和类型。
- `shared/accents.ts`：站点与品牌强调色预设。
- `shared/assets.ts`：GitHub/本地资源路径解析。
- `public/brand/<id>/`：按品牌分目录的同步资源。
- `scripts/sync.mjs`：校验并同步 GitHub 资源，本地资源跳过下载。
- `FORKING.md`：fork、改配置、同步资源与部署说明。

## 常用命令

- `bun install`：安装依赖。
- `bun run dev`：启动本地开发服务器。
- `bun run sync`：校验配置并同步 GitHub 图标资源。
- `bun run build`：校验配置并构建 Cloudflare Pages 产物。
- `bun run deploy`：上传 `dist/` 到 Cloudflare Pages。

## 配置约定

- `site.config.ts` 使用类型约束，站点强调色支持 `brand`、`indigo`、`violet`、`emerald`、`rose`、`amber`、`sky`、`slate`。
- `app/data/icons.json` 的 `groups` 是对象映射，保持插入顺序；每个分组包含 `brands` 数组。
- 品牌 `id` 决定 `public/brand/<id>/` 目录。
- 品牌 `repo` 格式为 `owner/name`，可选 `ref` 指定分支、标签或提交。
- 资源 `source` 为 GitHub 路径字符串，或 `{ "type": "local", "path": "..." }`。
- 分组 `logo` 为 `true` 时使用分组 Logo，缺省时回退到该组首个品牌图标；为 `false` 或缺省时不显示。
- 背景切换位于品牌详情抽屉中，仅影响当前预览与下载合成背景。
- `public/brand/` 由 `sync` 生成，勿手工修改资源文件。
- 不添加代码注释，用户界面字符串使用简体中文。

## 部署

- Cloudflare Pages Build command：`bun run build`。
- Output directory：`dist`。
- `wrangler.jsonc` 保持 Pages 配置，不加入 `account_id`、`main`、`assets` 等 Workers 专属字段。
- 提交需使用 GPG 签名：`git commit -S`。
