{
  description = "ReCloud Studio 图标展示站";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            bun
            nodejs
            wrangler
          ];

          shellHook = ''
            echo "ReCloud Studio 图标展示站 — dev shell"
            echo "  bun:    $(bun --version)"
            echo "  node:   $(node --version)"
            echo "  wrangler: $(wrangler --version 2>/dev/null | head -1)"
            echo ""
            echo "Commands:"
            echo "  bun install   — 安装依赖"
            echo "  bun run dev   — 启动开发服务器"
            echo "  bun run build — 构建生产版本"
            echo "  bun run sync  — 从 ../icon 同步图标资源"
            echo "  bun run deploy — 部署到 Cloudflare"
          '';
        };
      }
    );
}
