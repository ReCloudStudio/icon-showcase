# ReCloud Icon Showcase

ReCloud 品牌图标的展示网站，画廊式预览多尺寸图标与 SVG 用法片段。

## 技术栈

- [Nuxt 4](https://nuxt.com/) + [@nuxt/ui v2](https://ui.nuxt.com/)（Tailwind v3）
- 明暗主题（`@nuxtjs/color-mode`），强调色 `blue`，背景 `zinc`
- 部署目标：Cloudflare Pages（`cloudflare-module` preset）

## 同步图标

图标从 GitHub 仓库 [ReCloudStudio/icon](https://github.com/ReCloudStudio/icon) 拉取：

```bash
bun run sync        # 下载 icon.svg、icon-text*.svg 与各尺寸 PNG 到 public/brand/
```

资源包含 `icon`（纯图标）、`icon-text`（ReCloud 横排字标）、`icon-text-studio`（ReCloud Studio 横排字标）三种。

页面预览支持切换透明 / 浅色 / 深色背景；「带背景」下载按钮会将当前背景色（白 `#ffffff` 或深 `#0a0a12`）合成到图标后导出 PNG。

## 本地开发

```bash
bun install
bun run dev         # http://localhost:3000
bun run build       # 产出 .output/
```

## 部署

```bash
bunx wrangler login
bun run deploy      # 推送到 Cloudflare Pages，自定义域 icon.worldexecute.me
```

## 目录结构

- `pages/index.vue`：主画廊（背景切换、尺寸卡片、SVG 下载/复制）
- `app.vue`：页面壳层（页眉主题切换、页脚）
- `assets/css/main.css`：Tailwind 指令与棋盘格背景工具类
- `scripts/sync.mjs`：从上游仓库同步图标资源
- `wrangler.jsonc` / `nuxt.config.ts`：部署与站点配置

## 使用规范

### 源代码

源代码部分使用 AGPL-3.0 许可证，详见 [LICENSE](LICENSE)。

### 图标资源

图标资源部分使用参见 [品牌使用规范](https://docs.worldexecute.me/brand/brand-guidelines/)