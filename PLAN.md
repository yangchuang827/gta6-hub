# GTA6 Hub 升级规划：AI 内容引擎 + 双语 i18n + 竞品功能整合

> 规划日期: 2026-08-12 | 基于当前项目状态 + 竞品调研 + 技术可行性分析

---

## 一、现状分析

### 当前项目状态
- 框架: Astro 4.16 静态站，17 个页面，6 篇中文文章
- 内容: 全部存储在 `src/data/articles.ts` 的静态数组中
- 语言: 仅中文
- 更新: 手动修改代码 + 手动部署
- 风格: Vice City 暗色霓虹主题

### 核心痛点
1. **内容不更新** = 没有回头客 = Google 不收录新页面 = 没有流量
2. **单语言** = 错失全球英文搜索流量（"gta 6" 全球月搜 400 万次，主要是英文）
3. **功能单一** = 只有新闻列表，缺乏用户停留理由和差异化竞争力
4. **人力有限** = 无法每日手动写文章，需要 AI 辅助

---

## 二、三大升级方向

### 方向一：AI 内容创作流水线

#### 架构设计

```
RSS 源监听 → GitHub Actions 定时抓取 → AI 引擎处理 → Draft PR → 人工审核 → 合并部署
```

#### 详细流程

**第 1 步：数据源监听**

| 源 | 类型 | 语言 | 优先级 |
|----|------|------|--------|
| Rockstar Newswire | 官方 | 英文 | P0 |
| IGN GTA6 | 媒体 | 英文 | P0 |
| Kotaku GTA6 | 媒体 | 英文 | P1 |
| Reddit r/GTA6 | 社区 | 英文 | P1 |
| Twitter @RockstarGames | 官方 | 英文 | P0 |
| YouTube RockstarGames | 官方 | 英文 | P0 |
| 游民星空 GTA6 | 媒体 | 中文 | P2 |
| 微博 #GTA6# | 社区 | 中文 | P2 |

**第 2 步：GitHub Actions 自动化**

```yaml
# .github/workflows/fetch-news.yml
name: Daily GTA6 News Fetch
on:
  schedule:
    - cron: '0 6,18 * * *'  # 北京时间 14:00 和 02:00
  workflow_dispatch: {}
jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: node scripts/fetch-rss.js      # 抓取 RSS
      - run: node scripts/ai-process.js     # AI 摘要 + 翻译 + 分析
      - run: node scripts/generate-md.js    # 生成 Markdown 文件
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          title: 'auto: daily news update'
          branch: auto-news
          body: 'AI 生成的每日新闻草稿，请审核后合并'
```

**第 3 步：AI 内容引擎（核心）**

AI 引擎不是简单翻译，而是执行以下多步处理：

```
输入: 一篇英文新闻原文
  ↓
1. 信息提取: 提取关键事实、数据、引用
  ↓
2. 中文摘要: 200-300 字概括核心内容
  ↓
3. 深度分析: 加入行业背景、历史对比、影响评估
  ↓
4. 原创化改写: 整合多源信息，加入独家视角
  ↓
5. SEO 优化: 生成 title/description/tags/slug
  ↓
6. 英文版生成: 基于中文版生成优化后的英文版
  ↓
输出: zh/article-slug.md + en/article-slug.md
```

**AI Prompt 模板设计**:

```javascript
const prompt = `
你是 GTA6 Hub 的专业游戏编辑。请将以下英文新闻转化为中英双语原创文章。

要求：
1. 不是直译，要加入分析和背景解读
2. 标注信息来源（官方/媒体/社区）
3. 如果有数据，用表格呈现
4. 中文版 800-1200 字，英文版 600-900 词
5. 生成 SEO 友好的 title（含关键词）、description（150字内）、tags
6. 在文章末尾加入"编辑观点"段落（100字内）

原文: ${article.content}
来源: ${article.source}
`;
```

**第 4 步：内容存储结构迁移**

从静态数组迁移到 Content Collections：

```
src/content/
  articles/
    zh/
      gta6-release-date.md
      gta6-trailer-analysis.md
      ...
    en/
      gta6-release-date.md
      gta6-trailer-analysis.md
      ...
  config.ts                    # Content Collections schema 定义
```

每篇文章的 frontmatter:
```yaml
---
title: "GTA6 发售日期：我们目前知道的一切"
description: "Rockstar Games 确认 GTA6 将于 2026 年 11 月 19 日发售..."
date: 2026-08-12
updated: 2026-08-12
author: "GTA6 Hub 编辑组"
category: "news"
tags: ["发售日期", "PS5", "Xbox"]
image: "release-date"
featured: true
source: "Rockstar Newswire"
sourceType: "official"  # official | media | community
lang: "zh"
---
```

**第 5 步：内容质量保障（AdSense 合规）**

| 规则 | 说明 |
|------|------|
| 信源标注 | 每篇文章标注信息来源和可信度等级 |
| 原创度检查 | AI 生成后检查与原文相似度，确保 > 60% 原创 |
| 人工审核 | 所有 AI 生成内容必须经人工审核才能发布 |
| 事实核查 | 数据类内容（日期、价格、销量）必须与官方核对 |
| 更新追踪 | 文章有更新时标注 updated 日期 |

#### 内容生产计划

| 内容类型 | 生产方式 | 频率 | 目标 |
|----------|----------|------|------|
| 即时新闻 | RSS → AI → 人工审核 | 每日 2-3 篇 | 保持更新频率 |
| 深度分析 | 人工选题 → AI 辅助 | 每周 1-2 篇 | 高质量长文 |
| 数据盘点 | 自动抓取 + 人工 | 每周 1 篇 | 独家数据 |
| 双语同步 | AI 同时生成中英 | 每篇都做 | 覆盖双语流量 |
| 攻略指南 | 发售后人工密集 | 按需 | 发售爆发期 |

---

### 方向二：中英文双语 i18n

#### 技术方案：Astro 内置 i18n

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://gameinfos.org',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,  // 中文无前缀，英文 /en/
    },
  },
  integrations: [tailwind({ applyBaseStyles: false })],
});
```

#### URL 结构

| 页面 | 中文 URL | 英文 URL |
|------|----------|----------|
| 首页 | `/` | `/en/` |
| 新闻列表 | `/news` | `/en/news` |
| 文章详情 | `/news/gta6-release-date` | `/en/news/gta6-release-date` |
| 分类页 | `/category/news` | `/en/category/news` |
| 关于 | `/about` | `/en/about` |

#### 文件结构

```
src/
  pages/
    index.astro              # 中文首页
    news/
      index.astro            # 中文新闻列表
      [slug].astro           # 中文文章详情
    category/
      [slug].astro           # 中文分类
    about.astro
    privacy.astro
    404.astro
    en/                      # 英文版镜像
      index.astro
      news/
        index.astro
        [slug].astro
      category/
        [slug].astro
      about.astro
      privacy.astro
  content/
    articles/
      zh/                    # 中文文章 Markdown
      en/                    # 英文文章 Markdown
  i18n/
    ui.ts                    # UI 字符串翻译
    languages.ts             # 语言配置
  components/
    LanguageSwitcher.astro   # 语言切换组件
```

#### UI 翻译表

```typescript
// src/i18n/ui.ts
export const languages = {
  zh: { label: '中文', flag: 'ZH' },
  en: { label: 'English', flag: 'EN' },
};

export const ui = {
  zh: {
    'nav.home': '首页',
    'nav.news': '全部资讯',
    'nav.about': '关于我们',
    'article.readMore': '阅读全文',
    'article.published': '发布于',
    'article.updated': '更新于',
    'article.source': '来源',
    'countdown.title': '距 GTA6 发售还有',
    'countdown.days': '天',
    'countdown.hours': '时',
    'countdown.minutes': '分',
    'countdown.seconds': '秒',
    'category.news': '最新资讯',
    'category.trailers': '预告片解析',
    'category.gameplay': '游戏玩法',
    'category.characters': '角色介绍',
    'category.guides': '攻略指南',
    'category.rumors': '传闻与泄露',
  },
  en: {
    'nav.home': 'Home',
    'nav.news': 'All News',
    'nav.about': 'About',
    'article.readMore': 'Read more',
    'article.published': 'Published',
    'article.updated': 'Updated',
    'article.source': 'Source',
    'countdown.title': 'GTA6 releases in',
    'countdown.days': 'days',
    'countdown.hours': 'hours',
    'countdown.minutes': 'min',
    'countdown.seconds': 'sec',
    'category.news': 'Latest News',
    'category.trailers': 'Trailer Analysis',
    'category.gameplay': 'Gameplay',
    'category.characters': 'Characters',
    'category.guides': 'Guides',
    'category.rumors': 'Rumors & Leaks',
  },
};
```

#### 语言切换器组件

放在 Header 右上角，点击切换中/英，自动感知当前路径并跳转到对应语言版本。

#### SEO 多语言优化

每个页面 `<head>` 中添加:
```html
<link rel="alternate" hreflang="zh" href="https://gameinfos.org/news/gta6-release-date" />
<link rel="alternate" hreflang="en" href="https://gameinfos.org/en/news/gta6-release-date" />
<link rel="alternate" hreflang="x-default" href="https://gameinfos.org/news/gta6-release-date" />
```

Sitemap 同时输出两种语言版本:
```xml
<url>
  <loc>https://gameinfos.org/news/gta6-release-date</loc>
  <xhtml:link rel="alternate" hreflang="zh" href="https://gameinfos.org/news/gta6-release-date"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://gameinfos.org/en/news/gta6-release-date"/>
</url>
```

---

### 方向三：竞品功能整合

#### 竞品调研结果

| 竞品 | 亮点功能 | 我们是否整合 |
|------|----------|-------------|
| GTA6Gang | 845+ Wiki 词条、互动工具(10+)、Fact Ledger 信源分级 | 整合核心功能 |
| gta6news.net | E-E-A-T 信号、硬核分析、信源分级制度 | 整合 |
| gta6updatesnow | 延误/里程碑时间线、信源标签 | 整合 |
| vicountdown.com | 纯倒计时页面 | 已规划 |
| GTABase.com | 最大数据库+新闻 | 参考 |

#### 要整合的功能清单

**功能 1：发售倒计时组件（P0）**
- 首页 Hero 区域大数字倒计时
- 纯前端 JS，零后端依赖
- 下一个里程碑事件倒计时（8/27 Extended Look）
- 用户可设置提醒（localStorage）

**功能 2：事实台账 Fact Ledger（P1）**
- 参考 GTA6Gang 的 136 条信源分级
- 每条 GTA6 说法标注：官方确认 / 高可信爆料 / 社区传闻
- 每条记录链接到原始来源
- 中英双语

**功能 3：里程碑时间线（P0）**
- GTA6 从公布到发售的完整时间线
- 每个里程碑可点击查看详情文章
- 视觉化时间轴组件

**功能 4：Wiki 数据库（P1）**
- 角色数据库：Jason, Lucia, Cal Hampton 等
- 地点数据库：Vice City, Leonida Keys 等
- 版本对比：Standard $80 vs Ultimate $100
- 每个词条中英双语

**功能 5：互动小工具（P2）**
- 简化版互动工具，增加用户停留时间:
  -发售日倒计时（已有）
  - 版本选择计算器：帮你选 Standard 还是 Ultimate
  - 平台选择器：PS5 vs Xbox 选购指南
  - GTA6 知识小测试：5 道题测测你有多了解 GTA6

**功能 6：信源分级标签（P0）**
- 每篇文章标注信源类型：官方/媒体/社区
- 视觉化标签（颜色区分）
- 点击可筛选同类信源文章

---

## 三、实施路线图

### 阶段 1：基础架构升级（第 1-2 周）

| 任务 | 优先级 | 说明 |
|------|--------|------|
| 迁移到 Content Collections | P0 | 从 articles.ts 迁移到 Markdown 文件 |
| 配置 Astro i18n | P0 | 双语路由、UI 翻译表 |
| 创建英文页面镜像 | P0 | /en/ 下所有页面 |
| 语言切换器组件 | P0 | Header 右上角 |
| hreflang + sitemap 多语言 | P0 | SEO 多语言优化 |
| 现有 6 篇文章翻译为英文 | P1 | AI 翻译 + 人工校对 |

### 阶段 2：AI 内容流水线（第 2-3 周）

| 任务 | 优先级 | 说明 |
|------|--------|------|
| RSS 抓取脚本 | P0 | scripts/fetch-rss.js |
| AI 处理脚本 | P0 | scripts/ai-process.js |
| GitHub Actions workflow | P0 | 每日定时 + Draft PR |
| AI Prompt 模板 | P0 | 摘要+翻译+分析+SEO |
| 质量检查脚本 | P1 | 原创度检查、字数检查 |
| 内容审核流程文档 | P1 | 人工审核 SOP |

### 阶段 3：功能模块开发（第 3-5 周）

| 任务 | 优先级 | 说明 |
|------|--------|------|
| 发售倒计时组件 | P0 | 首页 Hero |
| 里程碑时间线页面 | P0 | /timeline |
| 信源分级标签 | P0 | 文章卡片 + 详情页 |
| 事实台账页面 | P1 | /fact-ledger |
| Wiki 数据库骨架 | P1 | /wiki |
| 版本对比页面 | P1 | /editions |
| 互动小工具 | P2 | /tools |

### 阶段 4：运营优化（持续）

| 任务 | 优先级 | 说明 |
|------|--------|------|
| Google Search Console 提交 | P0 | 新域名 + 双语 sitemap |
| 百度站长工具提交 | P0 | 中文 sitemap |
| 微博/B站账号 | P1 | 内容同步引流 |
| AdSense 申请 | P1 | 内容达到 20+ 篇后申请 |
| 8/27 预告片专题 | P0 | 第一个流量爆点 |

---

## 四、技术选型总结

| 领域 | 选择 | 理由 |
|------|------|------|
| 框架 | Astro 4.16（不变） | 已有基础，i18n 原生支持 |
| i18n | Astro 内置 i18n | 无需额外依赖，路由级支持 |
| 内容管理 | Content Collections | 类型安全、Markdown 友好、AI 管道友好 |
| AI 引擎 | OpenAI API / Claude API | 通过 GitHub Actions Secrets 配置 |
| 自动化 | GitHub Actions | 已有 CI/CD 基础，免费额度足够 |
| 部署 | Cloudflare Pages（不变） | 已配置，自动触发 |
| RSS 解析 | rss-parser (npm) | 轻量、可靠 |
| 前端交互 | 原生 JS + Web Components | 静态站无需框架 |

---

## 五、预期效果

### 流量预估（升级后）

| 阶段 | 时间 | 日 PV 预估 | 说明 |
|------|------|-----------|------|
| 升级完成 | 2 周后 | 100-300 | 双语内容上线 |
| AI 内容运转 | 4 周后 | 300-1000 | 每日更新 + 英文流量 |
| 8/27 预告片 | 8月底 | 1000-5000 | 第一个爆点 |
| 发售冲刺 | 11月 | 5000-30000 | 双语搜索高峰 |
| 发售爆发 | 11/19后 | 10000-50000 | 攻略需求爆发 |

### 双语流量分布预估
- 中文流量: 40-50%（中文 SEO 竞争低，容易排名）
- 英文流量: 50-60%（搜索量大，但竞争激烈）
- 双语策略: 中文做差异化（独家解读），英文做覆盖面（快速跟进）

---

## 六、关键决策点

### 需要你确认的决定

1. **AI API 选择**: 使用 OpenAI API 还是 Claude API？（都需要 API Key）
2. **英文内容策略**: 是 AI 翻译为主，还是先专注中文、英文逐步补充？
3. **Wiki 数据库范围**: 先做角色（6个），还是一次性做角色+地点+版本对比？
4. **互动工具优先级**: 先做哪个工具？（倒计时/版本计算器/知识测试）
5. **GitHub Actions AI**: 是否在 GitHub Actions 中直接调用 AI API？（需要把 API Key 存到 GitHub Secrets）

---

## 七、风险与应对

| 风险 | 影响 | 应对 |
|------|------|------|
| AI 生成内容质量不稳定 | AdSense 拒审、用户流失 | 人工审核 SOP + 质量检查脚本 |
| 英文内容原创度不足 | Google 不收录 | AI 生成后检查相似度，确保 > 60% |
| RSS 源失效 | 内容断更 | 多源备份 + 手动补充机制 |
| 8/27 预告片流量过大 | 服务器压力 | Cloudflare CDN 已有，静态站无压力 |
| AdSense 审核未通过 | 无收益 | 先积累 20+ 篇高质量内容再申请 |

---

## 八、与现有 STRATEGY.md 的关系

本文档是 STRATEGY.md 的技术执行方案升级版：
- STRATEGY.md 侧重运营策略和流量预估（不变）
- PLAN.md 侧重技术实现方案和开发路线图（本文档）
- 两者配合使用，先看 PLAN.md 做开发，再看 STRATEGY.md 做运营
