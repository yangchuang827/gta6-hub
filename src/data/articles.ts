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
}

export const siteConfig = {
  name: 'GTA6 Hub',
  title: 'GTA6 Hub - GTA6 最新资讯、预告片解析与游戏指南',
  description:
    'GTA6 Hub 是您获取侠盗猎车手6 (GTA VI) 最新新闻、预告片解析、发售日期、角色介绍和游戏攻略的首选平台。追踪 Rockstar Games 的每一步动态。',
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
  // Replace with your actual Google AdSense Publisher ID
  adsenseClient: 'ca-pub-XXXXXXXXXXXXXXXX',
  social: {
    twitter: '@gta6hub',
    youtube: 'https://youtube.com/@gta6hub',
  },
};

export const categories = [
  { slug: 'news', name: '最新资讯', color: 'vice-pink' },
  { slug: 'trailers', name: '预告片解析', color: 'vice-purple' },
  { slug: 'gameplay', name: '游戏玩法', color: 'vice-orange' },
  { slug: 'characters', name: '角色介绍', color: 'vice-yellow' },
  { slug: 'guides', name: '攻略指南', color: 'cyan' },
  { slug: 'rumors', name: '传闻与泄露', color: 'vice-magenta' },
];

export const articles: Article[] = [
  {
    slug: 'gta6-release-date-everything-we-know',
    title: 'GTA6 发售日期：我们目前知道的一切',
    description:
      'Rockstar Games 已确认 GTA6 将于 2025 年秋季登陆 PS5 和 Xbox Series X|S。本文汇总了所有官方信息、发售窗口分析以及 PC 版预期时间线。',
    date: '2025-01-15',
    updated: '2025-01-20',
    author: 'GTA6 Hub 编辑组',
    category: 'news',
    tags: ['发售日期', 'PS5', 'Xbox', 'PC'],
    image: 'release-date',
    featured: true,
    content: `
## 官方确认的发售窗口

Rockstar Games 在 2023 年 12 月发布的官方新闻稿中确认，《侠盗猎车手 VI》（GTA6）将于 **2025 年秋季** 正式发售。首发平台为 **PlayStation 5** 和 **Xbox Series X|S**，PC 版预计在主机版发售后的 6-12 个月内推出。

这一发售窗口与 Take-Two Interactive 在财报会议上的表态一致。CEO Strauss Zelnick 多次暗示 2025 财年将是公司"具有变革性的一年"。

## 为什么选择 2025 年秋季？

业内分析师认为，Rockstar 选择秋季发售有以下几个原因：

- **假日购物季**：秋季发售可覆盖感恩节、圣诞节等消费旺季
- **开发周期**：GTA6 自 2013 年 GTA5 发售后便开始早期概念设计，至今已超过 10 年
- **技术成熟度**：PS5/Xbox Series X 已有足够装机量支撑大作发售

## PC 版什么时候出？

按照 Rockstar 的惯例，PC 版通常在主机版发售后 6-18 个月推出：

| 作品 | 主机发售 | PC 发售 | 间隔 |
|------|---------|---------|------|
| GTA5 | 2013.09 | 2015.04 | 约19个月 |
| RDR2 | 2018.10 | 2019.11 | 约13个月 |
| GTA6 | 2025秋 | 预计2026 | ? |

## 总结

GTA6 的发售日期已经基本确定在 2025 年秋季。虽然具体日期尚未公布，但基于 Rockstar 的开发节奏和 Take-Two 的财报指引，这个时间窗口非常可靠。建议玩家持续关注官方渠道获取最新消息。
`,
  },
  {
    slug: 'gta6-trailer-2-breakdown',
    title: 'GTA6 第二支预告片深度解析：隐藏细节全解读',
    description:
      'Rockstar 发布的 GTA6 第二支预告片中藏着大量细节。从地图场景到角色互动，我们逐一拆解每一个隐藏线索。',
    date: '2025-03-05',
    author: 'GTA6 Hub 编辑组',
    category: 'trailers',
    tags: ['预告片', '解析', '细节', '地图'],
    image: 'trailer-2',
    featured: true,
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

## 动态环境系统

画面中最令人印象深刻的是环境细节：
- 野生动物在沼泽中活动
- NPC 有自己的日常行为
- 天气系统影响场景氛围
- 夜晚的霓虹灯光效果
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
- 犯罪行为可能被 " viral"

## 6. 经济系统

- 多种赚钱方式
- 房产投资
- 地下经济

## 7. 载具定制

更深入的载具改装系统，包括：
- 性能改装
- 外观定制
- 特殊功能

## 8. 武器与战斗

- 改进的射击手感
- 近战系统升级
- 武器定制

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
];
