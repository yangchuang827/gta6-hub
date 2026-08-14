import type { Lang } from '../i18n/ui';

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  featured?: boolean;
  content: string;
  lang: Lang;
  source?: string;
  sourceType?: 'official' | 'media' | 'community' | 'rumor';
}

export const siteConfig = {
  name: 'GTA6 Hub',
  title: 'GTA6 Hub - GTA6 最新资讯、预告片解析与游戏指南',
  titleEn: 'GTA6 Hub - Latest News, Trailer Breakdowns & Game Guides',
  description:
    'GTA6 Hub 是您获取侠盗猎车手6 (GTA VI) 最新新闻、预告片解析、发售日期、角色介绍和游戏攻略的首选平台。追踪 Rockstar Games 的每一步动态。',
  descriptionEn:
    'GTA6 Hub is your go-to source for Grand Theft Auto VI news, trailer breakdowns, release date info, character profiles, and game guides. Track every move from Rockstar Games.',
  url: 'https://gameinfos.org',
  keywords: [
    'GTA6',
    'GTA VI',
    'GTA6 新闻',
    'GTA6 发售日期',
    'GTA6 预告片',
    'GTA6 攻略',
    'Rockstar Games',
    '侠盗猎车手6',
    'GTA6 Lucia',
    'GTA6 Jason',
    'GTA6 地图',
    'GTA6 gameplay',
  ],
  adsenseClient: 'ca-pub-XXXXXXXXXXXXXXXX',
  social: {
    twitter: '@gta6hub',
    youtube: 'https://youtube.com/@gta6hub',
  },
};

export const categories = [
  { slug: 'news', name: '最新资讯', nameEn: 'Latest News', color: 'vice-pink' },
  { slug: 'trailers', name: '预告片解析', nameEn: 'Trailer Analysis', color: 'vice-purple' },
  { slug: 'gameplay', name: '游戏玩法', nameEn: 'Gameplay', color: 'vice-orange' },
  { slug: 'characters', name: '角色介绍', nameEn: 'Characters', color: 'vice-yellow' },
  { slug: 'guides', name: '攻略指南', nameEn: 'Guides', color: 'cyan' },
  { slug: 'rumors', name: '传闻与泄露', nameEn: 'Rumors & Leaks', color: 'vice-magenta' },
];

export function getCategoryName(slug: string, lang: Lang = 'zh'): string {
  const cat = categories.find(c => c.slug === slug);
  if (!cat) return slug;
  return lang === 'en' ? cat.nameEn : cat.name;
}

// Article helper functions are defined after the articles array + auto-loader (see below)

export const articles: Article[] = [
  // ===== Chinese Articles =====
  {
    slug: 'gta6-release-date-everything-we-know',
    title: 'GTA6 发售日期：我们目前知道的一切',
    description:
      'Rockstar Games 已确认 GTA6 将于 2026 年 11 月 19 日登陆 PS5 和 Xbox Series X|S。本文汇总了所有官方信息、发售窗口分析以及 PC 版预期时间线。',
    date: '2025-01-15',
    updated: '2026-08-12',
    author: 'GTA6 Hub 编辑组',
    category: 'news',
    tags: ['发售日期', 'PS5', 'Xbox', 'PC'],
    image: 'release-date',
    featured: true,
    lang: 'zh',
    source: 'Rockstar Newswire',
    sourceType: 'official',
    content: `
## 官方确认的发售日期

Rockstar Games 已正式确认，《侠盗猎车手 VI》（GTA6）将于 **2026 年 11 月 19 日** 正式发售。首发平台为 **PlayStation 5** 和 **Xbox Series X|S**，PC 版预计在主机版发售后的 6-12 个月内推出。

这一日期与 Take-Two Interactive 在 2025 年 5 月财报会议上的公告一致。CEO Strauss Zelnick 称 2026 财年将是公司"具有变革性的一年"。

## 为什么延期到 2026 年？

GTA6 最初计划于 2025 年春季发售，但在 2025 年 5 月被推迟到 2026 年 11 月。业内分析师认为延期原因包括：

- **质量打磨**：Rockstar 一贯追求极致品质，不愿赶工发布
- **技术复杂度**：双主角系统、动态 NPC AI、超大地图需要更多开发时间
- **市场策略**：11 月发售覆盖假日购物季，最大化销售潜力

## PC 版什么时候出？

按照 Rockstar 的惯例，PC 版通常在主机版发售后 6-18 个月推出：

| 作品 | 主机发售 | PC 发售 | 间隔 |
|------|---------|---------|------|
| GTA5 | 2013.09 | 2015.04 | 约19个月 |
| RDR2 | 2018.10 | 2019.11 | 约13个月 |
| GTA6 | 2026.11 | 预计2027 | ? |

## 预售信息

预售已于 2026 年 6 月 25 日开启，提供两个版本：
- **标准版** - $79.99
- **终极版** - $99.99（包含额外数字内容）

## 总结

GTA6 的发售日期已锁定在 2026 年 11 月 19 日。虽然 PC 玩家需要再等待，但主机玩家终于可以在今年下半年体验到这款万众期待的大作了。
`,
  },
  {
    slug: 'gta6-trailer-2-breakdown',
    title: 'GTA6 第二支预告片深度解析：隐藏细节全解读',
    description:
      'Rockstar 发布的 GTA6 第二支预告片中藏着大量细节。从地图场景到角色互动，我们逐一拆解每一个隐藏线索。',
    date: '2025-03-05',
    updated: '2026-08-12',
    author: 'GTA6 Hub 编辑组',
    category: 'trailers',
    tags: ['预告片', '解析', '细节', '地图'],
    image: 'trailer-2',
    featured: true,
    lang: 'zh',
    source: 'Rockstar Games',
    sourceType: 'official',
    content: `
## 预告片概览

Rockstar Games 发布的 GTA6 第二支预告片再次引爆全球游戏圈。短短 90 秒的画面中，隐藏着大量关于游戏世界、角色和玩法的线索。

## Leonida 州：比想象中更大的世界

预告片确认了游戏背景设定在虚构的 **Leonida 州**，以现实中的佛罗里达州为原型。主要城市 Vice City（迈阿密）只是其中一部分。

### 确认的地点包括：

- **Vice City** - 主城，迈阿密风格的海滨大都市
- **Leonida Keys** - 对应佛罗里达群岛
- **Port Gellhorn** - 北部沼泽地区域
- **Mount Kalaga** - 州立国家公园
- **Grassrivers** - 沼泽湿地

## Lucia 和 Jason：双主角系统

预告片再次确认了系列首次采用 **双主角系统**：

> Lucia Caminos - 刚从监狱释放的女性主角
> Jason - 与 Lucia 有着复杂关系的男性搭档

这对 "Bonnie and Clyde" 式的搭档关系将是故事的核心驱动力。

## 交通工具大升级

预告片中出现了丰富的交通工具：
- 摩托艇在水道上飞驰
- 直升机俯瞰城市天际线
- 多种改装车辆
- 沙滩 ATV
- 商业航班

## 动态环境系统

画面中最令人印象深刻的是环境细节：
- 野生动物在沼泽中活动
- NPC 有自己的日常行为
- 天气系统影响场景氛围
- 夜晚的霓虹灯光效果

## 8 月 27 日 "Extended Look" 预告

Netflix 将于 8 月 27 日首播 GTA6 "Extended Look" 实机玩法展示，这是首次看到实际游戏画面。我们将在第一时间带来深度解析。
`,
  },
  {
    slug: 'gta6-map-size-comparison',
    title: 'GTA6 地图有多大？与 GTA5 和 RDR2 全面对比',
    description:
      '根据目前已知的所有信息，GTA6 的地图规模可能远超玩家预期。我们将它与 GTA5 和 RDR2 的地图进行了详细对比。',
    date: '2025-02-20',
    author: 'GTA6 Hub 编辑组',
    category: 'news',
    tags: ['地图', '对比', 'GTA5', 'RDR2'],
    image: 'map-size',
    lang: 'zh',
    source: 'GTA6 Hub 分析',
    sourceType: 'media',
    content: `
## GTA6 地图面积估算

根据预告片中展示的地理范围和已知的城市信息，业内估算 GTA6 的地图总面积约为 **125-150 平方公里**。

这比 GTA5 的洛圣都（约 75 平方公里）大了近一倍，但与 RDR2 的地图面积（约 75 平方公里）相比，GTA6 的可探索区域更为密集。

## 三作地图对比

| 游戏 | 估计面积 | 地形类型 | 城市数量 |
|------|---------|---------|---------|
| GTA5 | ~75 km² | 城市+乡村+山脉 | 1 |
| RDR2 | ~75 km² | 荒野+小镇 | 多个小镇 |
| GTA6 | ~125-150 km² | 城市+沼泽+海滩+群岛 | 1大城+多个小镇 |

## 地形多样性

GTA6 的地图最大的亮点在于地形的多样性：

- **都市区**：Vice City 的高楼大厦和繁华街道
- **海滩区**：阳光沙滩和海滨度假村
- **沼泽区**：类似佛罗里达大沼泽地
- **群岛**：Leonida Keys 的热带岛屿
- **乡村**：内陆的小镇和农田

## 对游戏体验的影响

更大的地图意味着更多的探索内容。结合 GTA6 的动态 NPC 系统和丰富的交通工具，玩家将拥有前所未有的自由度。
`,
  },
  {
    slug: 'gta6-lucia-jason-characters',
    title: 'GTA6 角色解析：Lucia 与 Jason 的故事',
    description:
      '深入了解 GTA6 的两位主角 Lucia Caminos 和 Jason 的背景故事、人物关系以及他们在游戏中的角色定位。',
    date: '2025-02-10',
    author: 'GTA6 Hub 编辑组',
    category: 'characters',
    tags: ['Lucia', 'Jason', '角色', '剧情'],
    image: 'characters',
    lang: 'zh',
    source: 'Rockstar Games',
    sourceType: 'official',
    content: `
## Lucia Caminos：GTA 系列首位女主角

Lucia 是侠盗猎车手系列历史上第一位女性主角。根据预告片和已知信息：

- 刚从 Leonida 州立监狱释放
- 有着拉丁裔背景
- 性格坚韧，有犯罪前科
- 与 Jason 有着深厚的情感纽带

## Jason：搭档还是隐患？

Jason 是另一位主角，关于他的信息相对较少：

- 与 Lucia 共同生活
- 可能有军事或执法背景
- 两人关系类似经典的犯罪搭档

## 配角阵容

GTA6 还引入了丰富的配角：

- **Cal Hampton** - 技术支持角色
- **Boobie Ike** - 地下势力人物
- **Brian Heder** - 神秘角色
- **DreQuan Priest** - 街头角色

## Bonnie & Clyde 式叙事

Rockstar 明确表示 GTA6 的故事灵感来自著名的犯罪情侣 Bonnie 和 Clyde。这意味着：

- **双视角叙事**：玩家可在两个角色间切换
- **情感驱动剧情**：关系动态是故事核心
- **犯罪主题**：抢劫、逃亡、背叛

## 对系列的意义

Lucia 的加入标志着 GTA 系列在角色多样性上的重大突破。结合 Rockstar 一贯的深度叙事能力，GTA6 的故事体验值得期待。
`,
  },
  {
    slug: 'gta6-gameplay-features',
    title: 'GTA6 玩法系统详解：10 大全新机制',
    description:
      '从动态天气到 NPC AI 革命，盘点 GTA6 确认和推测的 10 大全新游戏玩法机制。',
    date: '2025-03-12',
    author: 'GTA6 Hub 编辑组',
    category: 'gameplay',
    tags: ['玩法', '系统', 'AI', '机制'],
    image: 'gameplay',
    lang: 'zh',
    source: 'GTA6 Hub 分析',
    sourceType: 'media',
    content: `
## 1. 革命性的 NPC AI 系统

GTA6 的 NPC 将拥有前所未有的行为深度。据泄露信息，NPC 会：

- 拥有日常作息时间表
- 对玩家行为有记忆
- 互相之间会互动
- 对环境变化做出反应

## 2. 动态天气与环境

天气不仅仅是视觉效果：
- 暴风雨影响驾驶
- 潮汐变化影响海岸线
- 温度影响角色状态

## 3. 双主角切换系统

继承 GTA5 的三主角切换，但更加深入：
- 两位主角有独立技能树
- 切换时角色在继续自己的生活
- 合作任务设计

## 4. 增强的物理引擎

- 更真实的车辆物理
- 水上交通工具物理
- 破坏效果升级

## 5. 社交媒体系统

游戏内社交媒体将反映玩家行为：
- NPC 会拍摄并上传玩家行为
- 犯罪行为可能被 "viral"

## 6. 经济系统

- 多种赚钱方式
- 房产投资
- 地下经济

## 7. 载具定制

更深入的载具改装系统，包括性能改装、外观定制、特殊功能。

## 8. 武器与战斗

改进的射击手感、近战系统升级、武器定制。

## 9. 手机与通讯

游戏内手机功能大幅扩展，成为核心交互界面。

## 10. 持续更新的在线模式

GTA Online 的继任者将更加深度地融入单人故事。
`,
  },
  {
    slug: 'gta6-system-requirements-pc',
    title: 'GTA6 PC 版配置要求预测：你的电脑能跑吗？',
    description:
      '虽然 PC 版还未正式公布，但基于游戏引擎和主机性能表现，我们预测了 GTA6 PC 版的最低和推荐配置要求。',
    date: '2025-03-18',
    author: 'GTA6 Hub 编辑组',
    category: 'guides',
    tags: ['PC', '配置', '硬件', '优化'],
    image: 'pc-requirements',
    lang: 'zh',
    source: 'GTA6 Hub 预测',
    sourceType: 'media',
    content: `
## 预测配置要求

> 注意：以下为基于已知信息的预测，官方配置要求尚未公布。

### 最低配置（1080p 30fps）

| 组件 | 要求 |
|------|------|
| CPU | Intel Core i5-8400 / AMD Ryzen 5 2600 |
| GPU | NVIDIA GTX 1060 6GB / AMD RX 580 8GB |
| 内存 | 16 GB |
| 存储 | 150 GB SSD |
| 系统 | Windows 10/11 64-bit |

### 推荐配置（1440p 60fps）

| 组件 | 要求 |
|------|------|
| CPU | Intel Core i7-10700K / AMD Ryzen 7 5800X |
| GPU | NVIDIA RTX 3070 / AMD RX 6800 |
| 内存 | 32 GB |
| 存储 | 150 GB NVMe SSD |

### 4K 60fps 配置

| 组件 | 要求 |
|------|------|
| CPU | Intel Core i9-13900K / AMD Ryzen 9 7900X |
| GPU | NVIDIA RTX 4080 / AMD RX 7900 XTX |
| 内存 | 32 GB DDR5 |
| 存储 | 150 GB NVMe SSD |

## 为什么配置要求这么高？

GTA6 的画面表现远超当前世代标准：
- 复杂的 NPC AI 需要强大 CPU
- 高清材质需要大量显存
- 开放世界无缝加载需要高速 SSD

## 优化建议

- 使用 SSD 是必须的
- 16GB 内存是底线
- 保持显卡驱动更新
`,
  },

  // ===== English Articles =====
  {
    slug: 'gta6-release-date-everything-we-know',
    title: 'GTA6 Release Date: Everything We Know',
    description:
      'Rockstar Games has confirmed GTA6 will launch on November 19, 2026 for PS5 and Xbox Series X|S. Here is everything we know about the release, editions, and PC version timeline.',
    date: '2025-01-15',
    updated: '2026-08-12',
    author: 'GTA6 Hub Editorial',
    category: 'news',
    tags: ['Release Date', 'PS5', 'Xbox', 'PC'],
    image: 'release-date',
    featured: true,
    lang: 'en',
    source: 'Rockstar Newswire',
    sourceType: 'official',
    content: `
## Official Release Date Confirmed

Rockstar Games has officially confirmed that **Grand Theft Auto VI** (GTA6) will release on **November 19, 2026**. The game will launch first on **PlayStation 5** and **Xbox Series X|S**, with a PC version expected 6-12 months later.

This date aligns with Take-Two Interactive's announcement during their May 2025 earnings call. CEO Strauss Zelnick called fiscal year 2026 a "transformative year" for the company.

## Why the Delay to 2026?

GTA6 was originally planned for a Spring 2025 release but was pushed to November 2026 in May 2025. Industry analysts cite several reasons:

- **Quality polish**: Rockstar consistently prioritizes quality over release schedules
- **Technical complexity**: Dual protagonist system, dynamic NPC AI, and massive map require more development time
- **Market strategy**: November release covers the holiday shopping season, maximizing sales potential

## When Will the PC Version Release?

Based on Rockstar's history, PC versions typically launch 6-18 months after consoles:

| Title | Console Release | PC Release | Gap |
|-------|----------------|------------|-----|
| GTA5 | Sep 2013 | Apr 2015 | ~19 months |
| RDR2 | Oct 2018 | Nov 2019 | ~13 months |
| GTA6 | Nov 2026 | Expected 2027 | ? |

## Pre-Order Information

Pre-orders opened on June 25, 2026, with two editions available:
- **Standard Edition** - $79.99
- **Ultimate Edition** - $99.99 (includes bonus digital content)

## Summary

GTA6's release date is locked in for November 19, 2026. While PC players will need to wait longer, console players can finally experience the most anticipated game of the decade later this year.
`,
  },
  {
    slug: 'gta6-trailer-2-breakdown',
    title: 'GTA6 Trailer 2 Breakdown: Every Hidden Detail Explained',
    description:
      'Rockstar\'s second GTA6 trailer is packed with hidden details. From map locations to character interactions, we break down every clue.',
    date: '2025-03-05',
    updated: '2026-08-12',
    author: 'GTA6 Hub Editorial',
    category: 'trailers',
    tags: ['Trailer', 'Breakdown', 'Details', 'Map'],
    image: 'trailer-2',
    featured: true,
    lang: 'en',
    source: 'Rockstar Games',
    sourceType: 'official',
    content: `
## Trailer Overview

Rockstar Games' second GTA6 trailer set the gaming world on fire again. In just 90 seconds, it隐藏着 a wealth of clues about the game world, characters, and gameplay mechanics.

## Leonida State: Bigger Than Expected

The trailer confirms the game is set in the fictional **State of Leonida**, based on real-world Florida. Vice City (Miami) is just one part of it.

### Confirmed locations include:

- **Vice City** - The main city, a Miami-style coastal metropolis
- **Leonida Keys** - Based on the Florida Keys
- **Port Gellhorn** - Northern swamp region
- **Mount Kalaga** - State national park
- **Grassrivers** - Wetland area

## Lucia and Jason: Dual Protagonist System

The trailer confirms the series' first-ever **dual protagonist system**:

> Lucia Caminos - A female protagonist recently released from prison
> Jason - A male partner with a complex relationship with Lucia

This "Bonnie and Clyde" style partnership will be the core narrative driver.

## Vehicle Upgrades

The trailer showcased a rich variety of vehicles:
- Speedboats racing through waterways
- Helicopters surveying the city skyline
- Multiple customized cars
- Beach ATVs
- Commercial airliners

## Dynamic Environment System

The most impressive aspect is the environmental detail:
- Wildlife active in swamps
- NPCs with their own daily routines
- Weather system affecting scene atmosphere
- Neon lighting effects at night

## August 27 "Extended Look"

Netflix will premiere the GTA6 "Extended Look" gameplay demonstration on August 27. This will be our first look at actual gameplay footage. We will bring you an in-depth breakdown as soon as it drops.
`,
  },
  {
    slug: 'gta6-map-size-comparison',
    title: 'How Big is the GTA6 Map? Full Comparison with GTA5 and RDR2',
    description:
      'Based on all known information, the GTA6 map could be far larger than players expect. We compare it in detail with GTA5 and RDR2.',
    date: '2025-02-20',
    author: 'GTA6 Hub Editorial',
    category: 'news',
    tags: ['Map', 'Comparison', 'GTA5', 'RDR2'],
    image: 'map-size',
    lang: 'en',
    source: 'GTA6 Hub Analysis',
    sourceType: 'media',
    content: `
## GTA6 Map Size Estimation

Based on the geographic scope shown in trailers and known city information, industry estimates place GTA6's total map area at approximately **125-150 square kilometers**.

This is nearly double the size of GTA5's Los Santos (~75 sq km), but compared to RDR2's map (~75 sq km), GTA6's explorable area is significantly more dense.

## Three-Game Map Comparison

| Game | Est. Area | Terrain Types | Cities |
|------|----------|--------------|--------|
| GTA5 | ~75 km² | City+Country+Mountains | 1 |
| RDR2 | ~75 km² | Wilderness+Towns | Multiple small towns |
| GTA6 | ~125-150 km² | City+Swamp+Beach+Islands | 1 major+multiple small |

## Terrain Diversity

The biggest highlight of GTA6's map is terrain variety:

- **Urban area**: Vice City's skyscrapers and busy streets
- **Beach area**: Sunny beaches and seaside resorts
- **Swamp area**: Similar to the Florida Everglades
- **Islands**: Leonida Keys tropical islands
- **Countryside**: Inland towns and farmland

## Impact on Gameplay

A larger map means more exploration content. Combined with GTA6's dynamic NPC system and rich vehicle selection, players will have unprecedented freedom.
`,
  },
  {
    slug: 'gta6-lucia-jason-characters',
    title: 'GTA6 Characters: The Story of Lucia and Jason',
    description:
      'Get to know GTA6\'s two protagonists Lucia Caminos and Jason — their backgrounds, relationship, and roles in the game.',
    date: '2025-02-10',
    author: 'GTA6 Hub Editorial',
    category: 'characters',
    tags: ['Lucia', 'Jason', 'Characters', 'Story'],
    image: 'characters',
    lang: 'en',
    source: 'Rockstar Games',
    sourceType: 'official',
    content: `
## Lucia Caminos: GTA's First Female Protagonist

Lucia is the first female protagonist in Grand Theft Auto history. Based on trailers and known information:

- Recently released from Leonida State Prison
- Latina background
- Tough personality with a criminal record
- Deep emotional bond with Jason

## Jason: Partner or Liability?

Jason is the other protagonist, with less information available:

- Lives with Lucia
- Possibly military or law enforcement background
- Their relationship resembles classic crime partnerships

## Supporting Cast

GTA6 also introduces a rich supporting cast:

- **Cal Hampton** - Tech support character
- **Boobie Ike** - Underground figure
- **Brian Heder** - Mysterious character
- **DreQuan Priest** - Street character

## Bonnie & Clyde Narrative

Rockstar has explicitly stated that GTA6's story is inspired by the infamous crime couple Bonnie and Clyde. This means:

- **Dual perspective storytelling**: Players can switch between characters
- **Emotion-driven plot**: Relationship dynamics are the story's core
- **Crime themes**: Heists, escapes, betrayal

## Significance for the Series

Lucia's addition marks a major breakthrough in character diversity for the GTA series. Combined with Rockstar's signature deep storytelling, GTA6's narrative experience is highly anticipated.
`,
  },
  {
    slug: 'gta6-gameplay-features',
    title: 'GTA6 Gameplay Systems: 10 New Mechanics Explained',
    description:
      'From dynamic weather to NPC AI revolution, here are 10 confirmed and speculated gameplay mechanics in GTA6.',
    date: '2025-03-12',
    author: 'GTA6 Hub Editorial',
    category: 'gameplay',
    tags: ['Gameplay', 'Systems', 'AI', 'Mechanics'],
    image: 'gameplay',
    lang: 'en',
    source: 'GTA6 Hub Analysis',
    sourceType: 'media',
    content: `
## 1. Revolutionary NPC AI System

GTA6's NPCs will have unprecedented behavioral depth. According to leaked information, NPCs will:

- Have daily routine schedules
- Remember player behavior
- Interact with each other
- React to environmental changes

## 2. Dynamic Weather and Environment

Weather is not just visual:
- Storms affect driving
- Tidal changes affect coastlines
- Temperature affects character status

## 3. Dual Protagonist Switching

Inheriting GTA5's character switching, but deeper:
- Two protagonists with independent skill trees
- Characters continue their lives when switched away
- Cooperative mission design

## 4. Enhanced Physics Engine

- More realistic vehicle physics
- Water vehicle physics
- Upgraded destruction effects

## 5. Social Media System

In-game social media reflects player behavior:
- NPCs can film and upload player actions
- Criminal behavior can go "viral"

## 6. Economy System

- Multiple ways to earn money
- Property investment
- Underground economy

## 7. Vehicle Customization

Deeper vehicle modification system including performance tuning, appearance customization, and special features.

## 8. Weapons and Combat

Improved shooting feel, upgraded melee system, weapon customization.

## 9. Phone and Communication

In-game phone functionality greatly expanded, becoming a core interface.

## 10. Continuously Updated Online Mode

GTA Online's successor will be more deeply integrated with the single-player story.
`,
  },
  {
    slug: 'gta6-system-requirements-pc',
    title: 'GTA6 PC System Requirements Prediction: Can Your PC Run It?',
    description:
      'While the PC version hasn\'t been officially announced, we predict GTA6 PC minimum and recommended specs based on the game engine and console performance.',
    date: '2025-03-18',
    author: 'GTA6 Hub Editorial',
    category: 'guides',
    tags: ['PC', 'Specs', 'Hardware', 'Optimization'],
    image: 'pc-requirements',
    lang: 'en',
    source: 'GTA6 Hub Prediction',
    sourceType: 'media',
    content: `
## Predicted System Requirements

> Note: These are predictions based on available information. Official requirements have not been announced.

### Minimum Specs (1080p 30fps)

| Component | Requirement |
|-----------|------------|
| CPU | Intel Core i5-8400 / AMD Ryzen 5 2600 |
| GPU | NVIDIA GTX 1060 6GB / AMD RX 580 8GB |
| RAM | 16 GB |
| Storage | 150 GB SSD |
| OS | Windows 10/11 64-bit |

### Recommended Specs (1440p 60fps)

| Component | Requirement |
|-----------|------------|
| CPU | Intel Core i7-10700K / AMD Ryzen 7 5800X |
| GPU | NVIDIA RTX 3070 / AMD RX 6800 |
| RAM | 32 GB |
| Storage | 150 GB NVMe SSD |

### 4K 60fps Specs

| Component | Requirement |
|-----------|------------|
| CPU | Intel Core i9-13900K / AMD Ryzen 9 7900X |
| GPU | NVIDIA RTX 4080 / AMD RX 7900 XTX |
| RAM | 32 GB DDR5 |
| Storage | 150 GB NVMe SSD |

## Why Are the Requirements So High?

GTA6's visual fidelity far exceeds current-gen standards:
- Complex NPC AI requires powerful CPU
- High-res textures need lots of VRAM
- Seamless open-world loading requires fast SSD

## Optimization Tips

- Using an SSD is mandatory
- 16GB RAM is the bare minimum
- Keep GPU drivers updated
`,
  },
];

// ===== Auto-generated articles loader =====
// Loads JSON files from src/data/auto/ directory (generated by AI pipeline)
const autoArticleModules = import.meta.glob('./auto/*.json', { eager: true, as: 'raw' });

const autoArticles: Article[] = Object.entries(autoArticleModules).map(([path, raw]) => {
  try {
    const data = JSON.parse(raw as string);
    return {
      slug: data.slug,
      title: data.title,
      description: data.description,
      date: data.date,
      updated: data.updated,
      author: data.author || 'GTA6 Hub',
      category: data.category || 'news',
      tags: data.tags || [],
      image: data.image || data.slug,
      featured: data.featured || false,
      content: data.content,
      lang: data.lang,
      source: data.source,
      sourceType: data.sourceType,
    } as Article;
  } catch (e) {
    console.warn(`Failed to parse auto article: ${path}`, e);
    return null;
  }
}).filter((a): a is Article => a !== null);

// Merge manual + auto articles, auto articles first (newest)
const allArticles: Article[] = [...autoArticles, ...articles];

// Override helper functions to use merged array
export function getArticles(lang: Lang = 'zh'): Article[] {
  return allArticles.filter(a => a.lang === lang);
}

export function getArticleBySlug(slug: string, lang: Lang = 'zh'): Article | undefined {
  return allArticles.find(a => a.slug === slug && a.lang === lang);
}

export function getFeaturedArticles(lang: Lang = 'zh'): Article[] {
  return allArticles.filter(a => a.lang === lang && a.featured);
}
