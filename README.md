# ReCloud Icon Showcase

ReCloud 品牌图标的展示网站，画廊式预览多项目/团队/组织的多尺寸图标与 SVG 用法片段。品牌由 [`app/data/brands.json`](app/data/brands.json) 配置驱动。

## 技术栈

- [Nuxt 4](https://nuxt.com/) + [@nuxt/ui v2](https://ui.nuxt.com/)（Tailwind v3）
- 明暗主题（`@nuxtjs/color-mode`），强调色 `blue`，背景 `zinc`
- 部署目标：Cloudflare Pages（`cloudflare_pages` preset）

## 同步图标

图标按品牌从各自 GitHub 仓库拉取，来源与资源路径在 [`app/data/brands.json`](app/data/brands.json) 中声明：

```bash
bun run sync        # 按配置下载各品牌资产到 public/brand/<id>/
```

当前品牌：

- `recloud-studio`（[ReCloudStudio/icon](https://github.com/ReCloudStudio/icon)）：`icon`（纯图标）、`icon-text`（ReCloud 横排字标）、`icon-text-studio`（ReCloud Studio 横排字标）。
- `webhooker`（[ReCloudStudio/WebHooker](https://github.com/ReCloudStudio/WebHooker)）：`logo.svg`（图标）与 `favicon.svg`。

### 新增品牌

在 `app/data/brands.json` 的 `brands` 数组追加条目后运行 `bun run sync`：

- `id`：品牌 slug，决定 `public/brand/<id>/` 目录。
- `name` / `tagline`：页面展示名称与一句话说明。
- `repo`：`{ owner, name, branch }` 来源仓库。
- `icon`：主图标 `{ source, sizes, sizeSource }`；`sizeSource` 用 `{size}` 占位，如 `output/icon-{size}.png`，无多尺寸时 `sizes: []`。
- `lockups`：横排字标数组，结构与 `icon` 类似，另含 `id`。
- `extras`：其他资源数组 `{ id, name, source }`（如 favicon）。

页面预览支持切换透明 / 浅色 / 深色背景；「带背景」下载按钮会将当前背景色（白 `#ffffff` 或深 `#0a0a12`）合成到图标后导出 PNG。

## 本地开发

```bash
bun install
bun run dev         # http://localhost:3000
bun run build       # 产出 dist/
```

## 部署

```bash
bunx wrangler login
bun run deploy      # 推送到 Cloudflare Pages，自定义域 icon.worldexecute.me
```

## 目录结构

采用 Nuxt 4 标准布局（`app/` 为源码根目录）：

- `app/app.vue`：页面壳层（页眉主题切换、页脚）
- `app/pages/index.vue`：主画廊（顶部品牌标签切换、背景切换、尺寸卡片、SVG 下载/复制）
- `app/data/brands.json`：品牌清单（来源仓库与资源路径）
- `app/assets/css/main.css`：Tailwind 指令与棋盘格背景工具类
- `public/brand/<id>/`：同步而来的图标资源（构建时不被打包）
- `scripts/sync.mjs`：按品牌配置同步图标资源
- `wrangler.jsonc` / `nuxt.config.ts`：部署与站点配置
- `app.config.ts` / `tailwind.config.ts`：UI 主题与样式配置（项目根）

## 使用规范

### 源代码

源代码部分使用 AGPL-3.0 许可证，详见 [LICENSE](LICENSE)。

### 图标资源

图标资源部分使用参见 [品牌使用规范](https://docs.worldexecute.me/brand/brand-guidelines/)