# Fork 使用指南

这个项目适合团队 fork 后作为自己的图标展示站部署。默认配置保留 ReCloud Studio 示例，fork 后可以完整替换为自己的站点身份与品牌清单。

## 1. Fork 与重命名

1. Fork 仓库。
2. 按团队名称重命名 GitHub 仓库。
3. 修改 `site.config.ts` 中的站点身份。

至少修改这些字段：

- `name`：站点名称。
- `description`：站点描述。
- `logo`：站点 Logo 路径。
- `accent`：站点强调色。
- `ogUrl`：正式访问域名。
- `github`：团队或组织 GitHub 地址。
- `footer`：页脚署名。
- `defaultGroup`：默认展示的分组 ID。
- `links`：额外导航链接。

## 2. 配置图标分组

编辑 `app/data/icons.json`：

```json
{
  "groups": {
    "team": {
      "name": "Team Name",
      "url": "https://github.com/team",
      "description": "团队项目",
      "logo": true,
      "brands": []
    }
  }
}
```

每个品牌至少需要：

- `id`：唯一 ID，同时决定 `public/brand/<id>/` 目录。
- `name`：品牌名称。
- `repo`：资源来源仓库，格式为 `owner/name`。
- `icon`：主图标资源。
- `lockups`：带文字图标数组，没有则使用 `[]`。
- `extras`：额外资源数组，没有则使用 `[]`。

可选字段：

- `ref`：分支、标签或提交，默认使用 `HEAD`。
- `url`：品牌展示链接，缺省时回退到 GitHub 仓库地址。
- `tagline`：卡片副标题。
- `description`：详情抽屉中的说明。
- `accent`：品牌卡片和详情抽屉头部的局部强调色。

## 3. 配置资源

GitHub 资源使用仓库内路径：

```json
{
  "source": "assets/icon.svg",
  "sizes": [64, 128, 256],
  "sizeSource": "output/icon-{size}.png"
}
```

本地资源使用相对于 `public/` 的路径：

```json
{
  "source": { "type": "local", "path": "brand/team/icon.svg" },
  "sizes": []
}
```

本地资源不会被 `bun run sync` 下载或覆盖。远程 URL 资源暂不支持。

## 4. 同步与验证

```bash
bun install
bun run sync
bun run build
```

`sync` 和 `build` 都会校验 `site.config.ts` 与 `app/data/icons.json`。配置错误时命令会直接失败并输出校验信息。

## 5. 部署 Cloudflare Pages

1. 在 Cloudflare Pages 创建项目并连接 fork 后的 GitHub 仓库。
2. Build command 设置为 `bun run build`。
3. Output directory 设置为 `dist`。
4. 绑定自己的域名。

本地部署也可以使用：

```bash
bunx wrangler login
bun run deploy
```

## 6. 同步上游更新

仓库内置 `.github/workflows/sync-upstream.yml`，用于把上游的新功能与修复合并到你的 fork，同时保留你自己的 `site.config.ts`、`app/data/icons.json` 与 `public/brand/` 等配置。相比 GitHub 内置的 Sync fork，它不会覆盖你的配置，也不会产生需要手动解决的冲突。

使用方式：

1. 在 fork 仓库的 Actions 页面启用 workflow（fork 首次需要手动启用）。
2. 需要更新时，手动运行 “Sync upstream”（也可等待每周一自动运行）。
3. workflow 会合并上游、还原受保护文件、执行 `bun run build` 校验，全部通过后再提交并推送。

默认行为可通过仓库 Variables（Settings → Secrets and variables → Actions → Variables）调整：

- `UPSTREAM_REPO`：上游仓库，默认 `ReCloudStudio/icon-showcase`。
- `UPSTREAM_BRANCH`：上游分支，默认 `main`。
- `PROTECTED_PATHS`：合并时保留的本地路径，默认 `site.config.ts app/data/icons.json public/brand`；如需保留自定义文案，可追加 `i18n/locales`。

注意：

- workflow 使用 `-X theirs` 让上游代码优先，仅在受保护路径上强制保留本地版本。若你在受保护路径之外也做了修改，合并时可能被上游覆盖。
- 若上游改动导致 `bun run build` 校验失败，workflow 会中止且不推送，便于你手动处理。
- 若 fork 的默认分支开启了分支保护，`git push` 可能被拒绝，可放宽保护或改为在 workflow 中走 PR。

## 7. 移除 ReCloud 示例

完成自己的配置后，检查并替换：

- `site.config.ts` 中的 ReCloud 名称、Logo、链接与页脚。
- `app/data/icons.json` 中的 `recloud` 分组与示例品牌。
- `public/brand/` 下由 ReCloud 示例生成的资源。
- README、站点描述和社交分享元信息中的 ReCloud 文案。

然后重新执行 `bun run sync` 和 `bun run build`。
