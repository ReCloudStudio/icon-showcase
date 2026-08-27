# ReCloud 图标展示站

Nuxt 4 画廊式站点，展示 ReCloud Studio 品牌图标（SVG 与多尺寸 PNG 下载、使用片段复制）。部署于 Cloudflare Pages。

## 技术栈

- Nuxt 4 + @nuxt/ui v2（Tailwind v3）+ @nuxtjs/color-mode。
- Nitro preset `cloudflare_pages`，构建产物目录 `dist/`。
- 包管理器 bun（`package.json` 的 `packageManager` 字段锁定）。

## 目录结构（Nuxt 4 标准布局）

- `app/app.vue`：页面壳层（页眉品牌与主题切换、页脚）。
- `app/pages/index.vue`：主画廊（透明/浅/深背景切换、尺寸卡片、SVG 与字标下载、使用片段复制）。
- `app/assets/css/main.css`：Tailwind 指令与棋盘格背景工具类。
- `public/brand/`：图标资产（由 sync 拉取，勿手工编辑）。
- `scripts/sync.mjs`：从 `ReCloudStudio/icon` 的 GitHub raw 拉取资产到 `public/brand/`。
- `wrangler.jsonc`：Cloudflare Pages 配置（`pages_build_output_dir: dist`，无 `account_id`/`main`/`assets` 等 Worker 专属字段）。
- `nuxt.config.ts` / `tailwind.config.ts` / `app.config.ts`：站点与样式配置（项目根）。

## 常用命令

- `bun install`：安装依赖。
- `bun run dev`：本地开发 http://localhost:3000。
- `bun run sync`：从上游 `ReCloudStudio/icon` 同步图标资产。
- `bun run build`：先 `bun install` 再 `nuxt build`，产物在 `dist/`。
- `bun run deploy`：直接上传（`wrangler pages deploy dist`）。

## 部署（Cloudflare Pages）

- 本仓库已连接 Cloudflare Pages 的 GitHub 自动构建。
- 后台构建设置：**Build command** `bun run build`（内含 `bun install`，否则 `nuxt` 找不到）、**Output directory** `dist`、**Package manager** bun（由 `package.json` 的 `packageManager` 自动识别，避免 npm 的 `edgesOut`）。
- 自定义域 `icon.worldexecute.me` 在 Pages 后台 Custom domains 绑定。
- 构建在 Cloudflare 构建镜像进行，推送即触发部署。

## 约定

- 提交需 GPG 签名（`git commit -S`）。
- `public/brand/` 由 `sync` 生成，勿手工提交图标文件；改图标请改 `ReCloudStudio/icon` 源仓库后重新 `sync`。
- 明暗主题强调色 `blue`、背景 `zinc`、深色 `#0a0a12`。
- `wrangler.jsonc` 为 Pages 形态，不要加入 `account_id`/`main`/`assets` 等 Workers 专属字段。
