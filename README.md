# 马景悦 · 个人作品集

使用 React + Vite 构建的个人作品集，包含个人介绍、工作经历、视频作品、图片画廊和联系方式。

## 本地运行

安装 Node.js 和 pnpm，然后执行：

```sh
pnpm install
pnpm dev
```

## 构建

```sh
pnpm build
pnpm preview
```

构建输出位于 `dist/`。部署时使用 `pnpm build` 作为构建命令、`dist` 作为输出目录。

## 目录

- `src/`：页面与组件，包括 React Bits 挂牌和头像动效。
- `public/`：网站使用的图片、视频和公司 Logo。
- `scripts/create-badges.cjs`：生成挂牌正反面及挂绳贴图；修改后执行 `node scripts/create-badges.cjs`。
- `src/assets/lanyard/`：挂牌的 3D 模型和默认挂绳纹理。

本地依赖、构建结果、原始素材与预览截图不纳入版本控制。其他检查及素材处理脚本可能需要调整本机工具路径后运行。
