# Curt 减脂计算器 - 文件结构说明

## 📁 完整项目结构

```
curt-fat-loss-calculator/
│
├── 📄 app.js                    # 应用入口文件
│                                # - 全局数据管理 (globalData)
│                                # - 全局计算方法 (BMR, TDEE, BMI等)
│                                # - 应用生命周期处理
│
├── 📄 app.json                  # 应用配置文件
│                                # - 页面注册
│                                # - 导航栏配置
│                                # - TabBar配置
│                                # - 窗口样式配置
│
├── 📄 app.wxss                  # 全局样式文件
│                                # - 全局CSS变量定义
│                                # - 通用组件样式
│                                # - 响应式设计规则
│
├── 📄 project.config.json       # 微信开发者工具配置
│                                # - 项目基本信息
│                                # - 编译配置
│                                # - 调试配置
│
├── 📄 sitemap.json             # 小程序搜索配置
│                                # - 页面搜索规则
│
├── 📄 README.md                # 项目主文档
│                                # - 项目介绍
│                                # - 功能说明
│                                # - 使用指南
│                                # - 计算公式
│
├── 📄 QUICK_START.md           # 快速开始指南
│                                # - 开发者工具使用
│                                # - 功能使用流程
│                                # - 数据示例
│
├── 📄 FILE_STRUCTURE.md        # 本文件
│                                # - 文件结构说明
│                                # - 各文件功能描述
│
├── 📁 pages/                   # 页面目录
│   │
│   ├── 📁 index/               # 首页（欢迎页）
│   │   ├── index.wxml          # 页面模板
│   │   ├── index.js            # 页面逻辑
│   │   └── index.wxss          # 页面样式
│   │
│   ├── 📁 calculator/          # 热量计算页
│   │   ├── calculator.wxml     # 页面模板
│   │   │                       # - 基础代谢信息输入区
│   │   │                       # - 训练热量输入区
│   │   │                       # - 营养素分配区
│   │   │                       # - 计算结果显示
│   │   │
│   │   ├── calculator.js       # 页面逻辑
│   │   │                       # - 数据绑定
│   │   │                       # - 输入验证
│   │   │                       # - 实时计算
│   │   │
│   │   └── calculator.wxss     # 页面样式
│   │                           # - 卡片布局
│   │                           # - 输入框样式
│   │                           # - 进度条样式
│   │
│   ├── 📁 prediction/          # 减脂预测页
│   │   ├── prediction.wxml     # 页面模板
│   │   │                       # - 目标设置输入区
│   │   │                       # - 预测结果显示区
│   │   │                       # - 保存目标按钮
│   │   │
│   │   ├── prediction.js       # 页面逻辑
│   │   │                       # - 减脂周期计算
│   │   │                       # - 本地数据存储
│   │   │
│   │   └── prediction.wxss     # 页面样式
│   │                           # - 滑块控制样式
│   │                           # - 结果展示样式
│   │
│   └── 📁 profile/             # 个人信息页
│       ├── profile.wxml        # 页面模板
│       │                       # - 个人信息卡片
│       │                       # - 营养素分配显示
│       │                       # - 体重变化显示
│       │                       # - BMI指数显示
│       │                       # - 常见问题列表
│       │
│       ├── profile.js          # 页面逻辑
│       │                       # - 数据汇总显示
│       │                       # - BMI计算和判断
│       │                       # - 问题展开/收起
│       │
│       └── profile.wxss        # 页面样式
│                               # - 数据对比布局
│                               # - BMI进度条样式
│                               # - 问答列表样式
│
└── 📁 assets/                  # 资源目录（预留）
    └── 📁 icons/               # 图标目录（预留）
```

## 📋 文件详细说明

### 核心文件

#### `app.js` - 应用入口
**功能**:
- 初始化全局数据
- 定义全局计算方法
- 管理应用生命周期

**主要方法**:
```javascript
calculateBMR()           // 计算基础代谢率
calculateTDEE()          // 计算每日热量消耗
calculateBMI()           // 计算BMI指数
getNutritionBreakdown()  // 获取营养素分配
calculateFatLossPrediction() // 计算减脂预测
```

**全局数据**:
```javascript
globalData: {
  // 身体数据
  gender, age, height, weight,
  // 训练数据
  trainingTime, trainingIntensity,
  // 营养素数据
  nutritionRatio, customRatio,
  // 减脂数据
  initialWeight, targetWeight, monthlyLossRatio,
  // 计算结果
  bmr, tdee, bmi, bmiStatus
}
```

#### `app.json` - 应用配置
**功能**:
- 注册所有页面
- 配置导航栏
- 配置TabBar标签页
- 设置窗口样式

**关键配置**:
```json
{
  "pages": ["pages/calculator/calculator", ...],
  "window": { "navigationBarBackgroundColor": "#2DC78F", ... },
  "tabBar": { "list": [{"pagePath": "pages/calculator/calculator", ...}] }
}
```

#### `app.wxss` - 全局样式
**功能**:
- 定义全局CSS变量
- 提供通用样式类
- 设置响应式规则

**主要样式类**:
- `.card` - 卡片容器
- `.btn` - 按钮样式
- `.input-field` - 输入框
- `.progress-bar` - 进度条
- `.radio-group` - 单选按钮组

### 页面文件

每个页面包含三个文件：

#### `*.wxml` - 页面模板
- 页面结构和布局
- 数据绑定表达式
- 事件绑定

#### `*.js` - 页面逻辑
- 页面数据定义
- 事件处理函数
- 生命周期方法

#### `*.wxss` - 页面样式
- 页面特定样式
- 组件样式覆盖
- 动画定义

### 页面详细说明

#### 首页 (index)
**用途**: 欢迎页和功能介绍
**主要元素**:
- 欢迎标题和副标题
- 功能特性卡片
- 使用说明步骤
- 开始按钮

#### 热量计算页 (calculator)
**用途**: 计算每日热量和营养素分配
**输入项**:
- 性别、年龄、身高、体重
- 训练时间、训练强度
- 营养素比例选择

**输出项**:
- 基础代谢率 (BMR)
- 每日热量消耗 (TDEE)
- 营养素分配 (克数和热量)

#### 减脂预测页 (prediction)
**用途**: 预测减脂周期
**输入项**:
- 初始体重
- 目标体重
- 每月减重比例

**输出项**:
- 总减重公斤数
- 预计减脂月数、周数、天数
- 每月/周减重计划

#### 个人页 (profile)
**用途**: 显示身体数据和BMI评估
**显示内容**:
- 每日热量建议
- 身体数据汇总
- 营养素分配建议
- BMI指数和评估
- 减重进度
- 常见问题

## 🔄 数据流向图

```
app.js (全局数据)
    ↓
    ├─→ pages/calculator/ (输入身体数据)
    │   ├─ 计算 BMR
    │   ├─ 计算 TDEE
    │   └─ 计算营养素分配
    │
    ├─→ pages/prediction/ (输入减脂目标)
    │   └─ 计算减脂周期
    │
    └─→ pages/profile/ (显示汇总数据)
        ├─ 显示热量数据
        ├─ 显示营养素数据
        ├─ 计算并显示 BMI
        └─ 显示减重进度
```

## 📝 编码规范

### 命名规范
- **文件名**: 小写 + 中划线 (如: calculator.wxml)
- **变量名**: 小驼峰 (如: trainingTime)
- **常量名**: 大写 + 下划线 (如: PRIMARY_COLOR)
- **类名**: 大驼峰 (如: InputField)

### 代码结构
```javascript
Page({
  // 1. 数据定义
  data: { ... },
  
  // 2. 生命周期方法
  onLoad() { ... },
  onShow() { ... },
  
  // 3. 事件处理
  onButtonClick() { ... },
  
  // 4. 计算方法
  calculate() { ... }
});
```

### 样式规范
```wxss
/* 1. 布局样式 */
.container { ... }

/* 2. 组件样式 */
.card { ... }

/* 3. 状态样式 */
.active { ... }

/* 4. 响应式样式 */
@media (max-width: 375px) { ... }
```

## 🔧 修改指南

### 修改颜色主题
1. 编辑 `app.wxss` 中的 `--primary-color`
2. 所有组件自动应用新颜色

### 添加新页面
1. 创建 `pages/newpage/` 目录
2. 新建 `newpage.wxml`, `newpage.js`, `newpage.wxss`
3. 在 `app.json` 的 `pages` 数组中添加页面路径
4. 在 `app.js` 中添加全局数据（如需要）

### 修改计算公式
1. 编辑 `app.js` 中的对应计算方法
2. 在页面中调用该方法
3. 使用 `setData()` 更新显示结果

### 添加新的输入字段
1. 在 `app.js` 的 `globalData` 中添加字段
2. 在页面 WXML 中添加输入控件
3. 在页面 JS 中添加事件处理函数
4. 在 WXSS 中添加样式

## 📊 文件大小参考

| 文件 | 大小 | 说明 |
|-----|------|------|
| app.js | ~4KB | 应用逻辑 |
| app.json | ~1KB | 配置文件 |
| app.wxss | ~7KB | 全局样式 |
| calculator.* | ~15KB | 热量计算页 |
| prediction.* | ~10KB | 减脂预测页 |
| profile.* | ~20KB | 个人页 |
| index.* | ~5KB | 首页 |
| **总计** | **~62KB** | 不含依赖 |

## ✅ 检查清单

在发布前，请确保：

- [ ] 所有页面都能正常加载
- [ ] 所有输入字段都能正常输入
- [ ] 所有计算都能正确执行
- [ ] 所有按钮都能正常点击
- [ ] 页面间数据能正确同步
- [ ] 本地存储功能正常
- [ ] 样式在不同屏幕尺寸下显示正确
- [ ] 没有控制台错误信息
- [ ] 文档完整准确

---

**最后更新**: 2026年2月27日
