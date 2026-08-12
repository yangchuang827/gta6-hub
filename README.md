# GTA6 Hub - GTA6 资讯网站

> 基于 Astro + Tailwind CSS 构建的 SEO 优化静态网站，部署在 Cloudflare Pages，代码托管在 GitHub。

## 特性

- **极速加载** - Astro 静态生成，零 JS 默认加载
- **SEO 优化** - 完整 meta 标签、Open Graph、结构化数据、sitemap、robots.txt
- **Google AdSense** - 内置广告位组件（横幅、信息流、侧边栏、文章内）
- **RSS 订阅** - 自动生成 RSS feed
- **响应式设计** - 完美适配移动端和桌面端
- **Vice City 风格** - GTA6 主题视觉设计
- **Cloudflare Pages** - 全球 CDN 分发

## 技术栈

| 技术 | 用途 |
|------|------|
| [Astro](https://astro.build) | 静态站点生成框架 |
| [Tailwind CSS](https://tailwindcss.com) | 原子化 CSS |
| Cloudflare Pages | 托管 & CDN |
| GitHub Actions | CI/CD 自动部署 |
| Google AdSense | 广告变现 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

开发服务器默认运行在 `http://localhost:4321`。

## 配置指南

### 1. Google AdSense 配置

在 `src/data/articles.ts` 中修改 `adsenseClient`：

```typescript
export const siteConfig = {
  // ...
  adsenseClient: 'ca-pub-XXXXXXXXXXXXXXXX', // 替换为你的 AdSense Publisher ID
  // ...
};
```

然后在各页面的 `AdSlot` 组件中设置你的广告单元 ID：

```astro
<AdSlot slot="1234567890" format="auto" />
```

> 申请 AdSense 前需要网站有足够的内容和流量，建议先上线运营一段时间再申请。

### 2. 网站域名配置

在 `astro.config.mjs` 中修改 `SITE_URL`：

```javascript
const SITE_URL = 'https://your-domain.com';
```

同时在 `src/data/articles.ts` 中更新 `siteConfig.url`。

### 3. 添加新文章

在 `src/data/articles.ts` 的 `articles` 数组中添加新条目：

```typescript
{
  slug: 'article-url-slug',
  title: '文章标题',
  description: '文章描述（用于 SEO 和列表预览）',
  date: '2025-04-01',
  author: '作者',
  category: 'news', // news, trailers, gameplay, characters, guides, rumors
  tags: ['标签1', '标签2'],
  image: 'image-key',
  content: `
## Markdown 内容
文章正文使用 Markdown 语法编写...
  `,
}
```

## 部署指南

### 方法一：Cloudflare Pages 自动部署（推荐）

1. **推送到 GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/gta6-hub.git
   git push -u origin main
   ```

2. **在 Cloudflare Pages 创建项目**

   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 进入 Workers & Pages → Create application → Pages
   - 连接你的 GitHub 仓库
   - 构建配置：
     - **Framework preset**: Astro
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Node version**: 20

3. **配置环境变量（可选）**

   在 Cloudflare Pages 设置中添加：
   - `SITE_URL` - 你的网站域名

4. **绑定自定义域名（可选）**

   在 Cloudflare Pages → Custom domains 中添加你的域名。

### 方法二：GitHub Actions 自动部署

1. 获取 Cloudflare API Token：
   - 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - 创建 token，选择 "Edit Cloudflare Workers" 模板

2. 获取 Account ID：
   - 在 Cloudflare Dashboard 右侧栏可以看到

3. 在 GitHub 仓库设置 Secrets：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

4. 推送到 `main` 分支即可自动部署。

## SEO 清单

- [x] 页面 title & meta description
- [x] Open Graph & Twitter Card 标签
- [x] Canonical URL
- [x] XML Sitemap（自动生成）
- [x] robots.txt
- [x] JSON-LD 结构化数据（WebSite, Organization, Article）
- [x] RSS Feed
- [x] 语义化 HTML（header, nav, main, article, footer）
- [x] 移动端响应式
- [x] 快速加载（静态 HTML，零 JS）
- [x] 安全 HTTP 头（_headers）

## 文件结构

```
gta6-hub/
├── .github/workflows/deploy.yml  # GitHub Actions CI/CD
├── public/
│   ├── _headers                  # Cloudflare 安全头
│   ├── _redirects                # URL 重定向
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── AdSlot.astro          # Google AdSense 广告组件
│   │   ├── ArticleCard.astro     # 文章卡片
│   │   ├── Footer.astro
│   │   └── Header.astro
│   ├── data/
│   │   └── articles.ts           # 网站配置 & 文章数据
│   ├── layouts/
│   │   └── BaseLayout.astro      # 基础布局 + SEO
│   ├── pages/
│   │   ├── index.astro           # 首页
│   │   ├── about.astro
│   │   ├── privacy.astro
│   │   ├── 404.astro
│   │   ├── news/
│   │   │   ├── index.astro       # 资讯列表
│   │   │   └── [slug].astro      # 文章详情
│   │   ├── category/
│   │   │   └── [slug].astro      # 分类页
│   │   └── rss.xml.ts            # RSS Feed
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## 提升流量的建议

1. **持续更新内容** - 定期发布 GTA6 相关新闻和分析
2. **长尾关键词** - 针对 "GTA6 发售日期"、"GTA6 配置要求" 等搜索词优化
3. **社交媒体** - 在 YouTube、B站、微博等平台分发内容并引流
4. **Google Search Console** - 提交 sitemap，监控索引状态
5. **页面速度** - Astro 零 JS 架构已为你做好基础优化
6. **内链策略** - 文章之间互相链接，提升页面权重
7. **结构化数据** - 已内置 Article schema，有助于搜索结果富摘要

## 许可

本项目代码采用 MIT 许可。文章内容版权归 GTA6 Hub 所有。

GTA 和 Rockstar Games 是 Take-Two Interactive 的商标。本网站为非官方粉丝网站。
