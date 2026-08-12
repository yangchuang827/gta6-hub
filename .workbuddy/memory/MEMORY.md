# GTA6 Hub 项目记忆

## 项目概述
- 路径: `D:\found\gta6`
- 类型: GTA6 游戏资讯网站（SEO 优化 + Google AdSense 变现）
- 技术栈: Astro 4.16 + Tailwind CSS 3.4 + Cloudflare Pages + GitHub Actions
- 部署目标: Cloudflare Pages (`gta6-hub.pages.dev`)
- 代码托管: GitHub

## 关键配置
- npm 镜像源: `registry.npmmirror.com`（国内网络必需）
- @astrojs/sitemap 不兼容 Astro 4.16，使用自定义 `src/pages/sitemap.xml.ts`
- AdSense Publisher ID 在 `src/data/articles.ts` 的 `siteConfig.adsenseClient` 配置
- 网站域名在 `astro.config.mjs` 的 `SITE_URL` 和 `siteConfig.url` 配置

## 文章数据
- 文章存储在 `src/data/articles.ts` 的 `articles` 数组
- 使用 Markdown 语法编写 content 字段
- `marked` 库负责渲染为 HTML

## 用户偏好
- 使用中文
- 目标：增加流量 + Google AdSense 收益
- 使用 Cloudflare + GitHub
