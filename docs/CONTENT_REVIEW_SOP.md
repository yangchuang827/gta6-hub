# 内容审核 SOP（标准操作流程）

> GTA6 Hub AI 内容流水线人工审核指南

---

## 一、流程概览

```
RSS 抓取 → AI 生成中英双语文章 → 质量检查脚本 → Draft PR → 人工审核 → 合并部署
```

AI 每日自动生成文章并提交 Pull Request（分支 `auto-news`），你需要审核后合并才会发布。

---

## 二、审核步骤

### 1. 收到通知

- GitHub Actions 每日 14:00 和 02:00（北京时间）自动运行
- 有新文章时会创建/更新 PR，并发送通知
- PR 标题格式：`🤖 AI News Update - #run_id`
- PR 标签：`auto-generated`、`needs-review`

### 2. 检查文件变更

PR 中变更的文件：
- `src/data/auto/*.zh.json` — 中文文章
- `src/data/auto/*.en.json` — 英文文章
- `scripts/cache/processed-slugs.json` — 已处理记录（自动更新）

### 3. 逐篇审核

每篇文章检查以下要点：

| 检查项 | 要求 | 严重程度 |
|--------|------|----------|
| **标题** | 包含"GTA6"，准确概括内容，不超过 80 字符 | 高 |
| **描述** | 120-150 字，吸引点击，包含关键词 | 中 |
| **内容质量** | 原创改写，不是直译；有分析和背景 | 高 |
| **事实准确** | 日期、价格、人名、数据无误 | 高 |
| **信源分类** | official/media/community/rumor 分类正确 | 高 |
| **分类** | news/trailers/gameplay/characters/guides/rumors | 中 |
| **Markdown 格式** | 标题层级、列表、表格格式正确 | 中 |
| **字数** | 中文 800+ 字，英文 600+ 词 | 中 |
| **编辑观点** | 文末有"编辑观点"/"Editor's Take"段落 | 低 |
| **标签** | 3-5 个相关标签 | 低 |

### 4. 运行质量检查

```bash
node scripts/quality-check.js
```

输出结果：
- `✓ PASS` — 通过，无问题
- `⚠ WARN` — 有警告但可接受
- `✗ FAIL` — 有严重问题，必须修改

### 5. 本地预览

```bash
npm run build && npx astro dev
```

在 `http://localhost:4321/news` 查看文章是否正常显示。

### 6. 决策

- **通过** → 在 GitHub 上点击 "Merge Pull Request"
- **需修改** → 在 PR 中直接编辑 JSON 文件，或本地修改后推送
- **拒绝** → 关闭 PR 并删除分支

---

## 三、AdSense 合规要点

Google AdSense 对内容质量有严格要求，审核时特别注意：

1. **原创性**：文章不能是原文翻译，必须有独立分析和观点
2. **E-E-A-T 信号**：
   - Experience（经验）：作者署名 "GTA6 Hub 编辑组"
   - Expertise（专业）：内容准确，术语正确
   - Authoritativeness（权威）：标注信源和可信度
   - Trustworthiness（可信）：区分事实与传闻
3. **信源透明**：每篇文章标注来源（official/media/community/rumor）
4. **无误导内容**：不夸大、不编造、不传播未证实信息
5. **内容价值**：文章应为读者提供有用信息，非纯凑数

---

## 四、常见问题处理

### Q: AI 生成的文章事实有误怎么办？
A: 直接在 PR 中编辑 JSON 文件修改错误部分，或关闭 PR 后重新运行。

### Q: 文章质量太差怎么办？
A: 关闭 PR，检查 AI Prompt 模板是否需要优化。可在 `scripts/ai-process.js` 中调整 prompt。

### Q: 某个 RSS 源总是产生无关内容怎么办？
A: 在 `scripts/fetch-rss.js` 的 `RSS_SOURCES` 中删除该源，或增加更严格的 filter 关键词。

### Q: 如何手动触发一次抓取？
A: 在 GitHub 仓库 → Actions → "Daily GTA6 News Fetch" → 点击 "Run workflow"。

### Q: 如何添加新的 RSS 源？
A: 编辑 `scripts/fetch-rss.js`，在 `RSS_SOURCES` 数组中添加新条目。

---

## 五、配置说明

### 环境变量（GitHub Secrets）

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `GEMINI_API_KEY` | Google Gemini API 密钥 | https://aistudio.google.com/app/apikey |

### 环境变量（GitHub Variables，可选）

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `GEMINI_MODEL` | `gemini-2.0-flash` | 使用的 Gemini 模型 |

### 设置步骤

1. 访问 https://aistudio.google.com/app/apikey 获取免费 API Key
2. 在 GitHub 仓库 → Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. Name: `GEMINI_API_KEY`，Value: 你的 API Key
5. （可选）添加 Variable `GEMINI_MODEL` 选择模型

---

## 六、文件结构

```
scripts/
  fetch-rss.js          # RSS 抓取脚本
  ai-process.js         # AI 内容处理脚本（Gemini API）
  quality-check.js      # 质量检查脚本
  cache/
    feeds.json           # 抓取的 RSS 原始数据（临时）
    processed-slugs.json # 已处理的文章 slug 列表

src/data/auto/           # AI 生成的文章 JSON 文件
  *.zh.json              # 中文文章
  *.en.json              # 英文文章

.github/workflows/
  fetch-news.yml         # 每日定时抓取 + AI 处理 + Draft PR
  deploy.yml             # 部署到 Cloudflare Pages
```
