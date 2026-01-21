# 变更日志 (CHANGELOG)

## [初始开发阶段]
### ✨ 项目初始化
- **项目雏形**: 基于 Vite + React 19 构建的生产力工具原型。
- **UI 实现**: 完成了习惯追踪看板、时间轴日历、数据分析图表及社区界面的前端 UI 开发。
- **环境搭建**: 引入 Tailwind CSS (CDN) 和 Material Symbols 图标库。

## [2026-01-13 - 22:30]

### 🏗 架构重构 (Architectural Changes)
- **前后端分离**: 将原有的 React 项目迁移至 `frontend/` 目录，并初始化了 `backend/` 目录。
- **后端架构搭建**: 在 `backend/` 中引入了 Node.js + Express + TypeScript 基础环境。

### 🐳 容器化与部署 (Docker & Deployment)
- **Docker 支持**: 为前端 (`frontend/Dockerfile`) 和后端 (`backend/Dockerfile`) 编写了容器化配置。
- **环境编排**: 在根目录创建了 `docker-compose.yml`，支持一键拉起 PostgreSQL、API 后端以及 Nginx 前端。
- **环境变量管理**: 引入了项目根目录的 `.env` 文件，实现全栈配置共享。

### 📄 文档与规范 (Documentation)
- **README 升级**: 更新了根目录的 `README.md`，包含新的目录结构说明与 Docker 启动指南。
- **PRD 编写**: 创建了 `PRD.md` (需求规格说明书)，详细定义了习惯追踪、日历时间轴及社交互动等核心功能逻辑。
- **日志创建**: 初始化了 `CHANGELOG.md` 用于追踪后续开发动态。

### 🛠 验证与修复 (Verification)
- **启动验证**: 成功通过 Docker 部署并跑通了全栈环境。
- **后端连通性**: 验证了后端端口 4000 的 API 健康检查接口正常运行。

## [2026-01-13 - 23:00]
### 🔄 后端技术栈切换 (Tech Stack Switch)
- **技术栈变更**: 应用户需求，将后端从 Node.js (Express) 切换为 **Java (Spring Boot 3)**。
- **目录重整**: 清理了 `backend/` 下的 Node.js 相关文件，建立了标准的 Maven 项目结构。
- **配置同步**: 更新了 `Dockerfile` 为 JDK 17 多阶段构建，并同步修改了 `docker-compose.yml` 中的 JDBC 连接配置。
- **PRD 更新**: 修正了 PRD 中的技术方案描述，将后端实现方案定为 Spring Boot。

## [2026-01-13 23:50]
### 🚀 Java 后端性能与构建优化 (Build & Performance Optimization)
- **极速构建策略**: 引入本地 Maven 编译方案，将构建过程移至宿主机，使 Docker 编译时间从数分钟缩短至秒级。
- **镜像瘦身**: 后端 Dockerfile 切换为轻量级 JRE 运行时镜像，大幅优化了启动速度和镜像体积。

### 🔧 JDK 25 兼容性修复 (Compatibility Fixes)
- **代码重构**: 针对 JDK 25 与 Lombok 的版本冲突，彻底移除了项目中所有的 Lombok 依赖。
- **样板代码实现**: 手动为核心实体（User, Habit, HabitLog, TimeRecord, Post）及 DTO 实现了 Getter/Setter、构造函数及 Builder 模式，提升了代码的健壮性与兼容性。

### 📂 PostgreSQL 深度适配 (Database Integration)
- **配置精简**: 移除了冗余的 `hibernate.dialect` 显式设置，改由 Spring Boot 自动识别方言，解决了启动告警。
- **原生支持**: 在 `docker-compose.yml` 中添加了基于 `pg_isready` 的原生数据库健康检查逻辑。
- **性能调优**: 禁用了 `spring.jpa.open-in-view` 以优化数据库连接池性能。

### ✨ 核心业务逻辑实现 (Core Logic)
- **习惯追踪 API**: 实现了习惯管理的核心链路，包含 Entity 层映射（针对 PgSQL 关键字优化）、Repository 接口、Service 逻辑以及控制器接口。
- **数据初始化**: 完善了 `DataSeedListener`，支持在 PostgreSQL 环境下自动初始化演示用户及习惯数据。

## [2026-01-14 00:30]
### 🐙 源码托管与规范 (Git & Repository)
- **Git 初始化**: 针对本地项目完成了 Git 仓库的初始化，并编写了全面的 `.gitignore` 排除规则。
- **身份配置**: 成功配置项目级身份为 `i-YOLO <2647762505@qq.com>`。
- **分支管理**: 按照命名规范创建了特性分支 `feature-260114-init-fullstack`。
- **云端托管**: 成功将前端与后端的全量初始代码推送到 GitHub 远程仓库，开启了云端协作流程。
## [2026-01-14 09:40]
### 🔐 安全与身份认证 (Security & Authentication)
- **认证框架**: 引入 Spring Security 6 并实现 JWT 无状态认证方案。
- **密码安全**: 采用 BCrypt 强哈希算法对用户密码进行单向加密。
- **认证接口**: 实现了 `/api/auth/register` (注册) 和 `/api/auth/login` (登录) API。
- **令牌管理**: 实现了 JWT 的生成、分发及请求拦截校验逻辑。
- **数据同步**: 更新了 Data Seed 逻辑，确保 Demo 用户密码以加密形式存储，支持开箱即用的登录体验。

## [2026-01-14 14:30]
### 🎨 前端交互与注册流程 (UX & Registration)
- **跳转逻辑修复**: 完善了登录页面的“创建账号”跳转功能，将静态链接替换为 React 视图切换逻辑。
- **新增注册页面**: 实现了 `RegisterView` 组件，支持用户姓名、邮箱、密码的输入及后端注册接口对接。
- **全栈联调**: 联通了前端注册请求至后端 `/api/auth/register` API，并支持注册成功后的自动视图回切。
- **自动登录检查**: 在 `App.tsx` 中增加了启动时的 Token 检查机制。

## [2026-01-15 00:00]
### ✨ 全栈功能落地 (Full Stack Features)
#### 1. 📅 日历与时间记录 (Calendar & Time Records)
- **后端支持**: 新增 `TimeRecord` 模块，完整的 Controller/Service/Repository 层，支持时间块的创建、更新、删除及按天查询。
- **前端交互**: 
  - 实现 `CalendarView` 的真实数据绑定，支持从后端加载每日时间记录。
  - 新增 `AddTimeRecordView` 组件，支持“+1天”跨夜时间记录，自动计算时长与结束时间。
  - 优化了时间轴的视觉呈现，支持不同分类的颜色区分。

#### 2. ✅ 习惯追踪 (Habit Tracking)
- **全链路打通**: 
  - **创建习惯**: 前端 `AddHabitView` 对接后端 `/api/habits` 接口，支持自定义图标、颜色、目标值。
  - **每日打卡**: 实现了 `/api/habits/{id}/log` 接口，支持前端实时打卡并即时反馈进度。
  - **今日视图**: 优化了 `HomeView` 的数据加载逻辑，解决了数据懒加载导致的查询异常（事务优化）。

#### 3. 🏷 分类管理 (Category Management)
- **后端实现**: 新增 `Category` 实体及管理接口，支持用户自定义分类（名称、颜色、图标）。
- **前端管理**: 新增 `CategoryManagementView` 页面，允许用户管理自己的时间/习惯分类体系。
- **数据预设**: 优化已有的 `DataSeedListener`，为新用户自动初始化一套默认分类（工作、健康、学习等）。

### 🛠 工程化与架构优化 (Engineering)
- **样式系统重构**: 
  - 彻底完成了 **Tailwind CSS 的本地化构建**，移除了 CDN依赖，提升加载速度与稳定性。
  - 建立了标准的 `frontend/index.css` 样式入口，统一管理全局样式与图标字体。
- **数据库交互增强**: 
  - 针对 PostgreSQL 优化了 JPA 查询事务策略，消除了 `LazyInitializationException` 隐患，确保关联数据（如习惯日志）能稳定读取。

## [2026-01-16 09:30]
### 🎯 专注模式模块 (Focus Mode Module)
- **后端架构**: 
  - 新增 `FocusSession` 实体，支持记录专注会话（用户、分类、习惯、开始/结束时间、时长、状态）。
  - 实现 `FocusSessionRepository` + `FocusSessionService`，支持创建会话、查询用户会话及今日统计。
  - 新增 `/api/focus/today-stats` API，返回今日专注总时长和完成组数。
- **前端集成**:
  - `CalendarView.tsx` 中的 Focus Hub 从硬编码改为调用 API 获取真实数据。
  - 切换到"专注"标签时自动拉取当天统计数据。

### 📅 日历按日期筛选 (Calendar Date Filtering)
- **后端支持**:
  - `TimeRecord` 实体新增 `recordDate` 字段（LocalDate），用于区分不同日期的记录。
  - `TimeRecordController` 的 GET 接口支持 `?date=YYYY-MM-DD` 查询参数，按日期筛选记录。
  - `TimeRecordService` 新增 `getRecordsForUserByDate()` 方法。
- **数据库迁移**:
  - 执行 `ALTER TABLE time_records ADD COLUMN record_date DATE` 并用 `created_at::date` 初始化现有数据。
- **前端改造**:
  - `CalendarView` 中 `selectedDate` 类型从 `number` 改为 `Date`，切换日期时传递参数给 API。
  - 刷新页面时自动加载当天数据，切换日期时重新获取对应日期的记录。
  - 切换到日历标签时自动滚动到当前时间位置。

### 📝 时间记录日期选择器 (Time Record Date Picker)
- **UI 增强**:
  - `AddTimeRecordView` 的"时间详情"区域新增日期选择器，默认为当前日期。
  - 开始时间行显示可编辑的日期输入框；结束时间行显示只读日期（跨天自动 +1 天）。
  - 创建/编辑记录时将 `recordDate` 一并提交到后端。

### 🔐 Token 过期自动登出 (Session Expiry Handling)
- **API 层封装**:
  - 新增 `frontend/utils/api.ts`，封装 `apiFetch()` 函数统一处理认证头和错误。
  - 当 API 返回 401 或 403 时，自动清除本地 Token 并触发登出回调。
- **全局集成**:
  - `App.tsx` 注册 Token 过期回调，检测到过期后自动跳转登录页面。
  - 所有前端 API 调用逐步迁移至 `apiFetch`，统一认证和错误处理逻辑。

## [2026-01-16 21:50]
### 🎨 UI/UX Pro Max 优化 (Visual & Interaction Enhancement)

#### 1. 🎯 沉浸式专注计时器 (Embedded Focus Timer)
- **无缝体验**: 点击"开始专注"不再跳转页面，直接在当前位置平滑切换为计时状态。
- **分离式布局**:
  - **顶部**: 仅保留模式切换器（倒计时/正计时）。
  - **中部**: 巨大的纯净时间显示，专注于展示时间。
  - **底部**: 悬浮控制栏，包含暂停/继续和结束按钮。
- **功能增强**:
  - 支持 **倒计时 (Pomodoro)** 和 **正计时 (Stopwatch)** 两种模式。
  - 自由时长滑块，支持 1-120 分钟无级调节。
- **视觉反馈**:
  - **运行中**: 时间高亮，光环呼吸动画，粒子旋转。
  - **暂停时**: 所有动画瞬间冻结，时间变暗，显示闪烁的"PAUSED"警示。

#### 2. 🚀 转场与动画优化 (Transitions & Animations)
- **Tab 切换**: 实现 Fade & Scale 平滑过渡效果。
- **Pro Max 导航栏**: 底部导航栏采用滑动 Pill 高亮 + 微动效设计。
- **Tailwind 扩展**: 新增自定义动画 (orbit, ripple, breathe, expand-full) 到 `tailwind.config.js`。

#### 3. 💾 专注记录保存与同步 (Focus Session Persistence)
- **自动保存**: 点击 END 按钮后，专注记录自动保存到数据库。
- **时长校验**: 专注时长 < 1 分钟时弹出提示，不保存记录。
- **Fire-and-Forget 模式**: UI 立即切换，API 调用在后台异步执行，消除 2 秒延迟。
- **日历同步**: 保存成功后，日历视图自动刷新，新记录即时可见。

#### 4. 🕐 时区处理 (Timezone Handling)
- **后端配置**:
  - `application.yml` 添加 Jackson 时区配置 (`Asia/Shanghai`)。
  - `Dockerfile` 添加 JVM 时区参数 (`-Duser.timezone=Asia/Shanghai`)。
- **统一 UTC+8**: 所有后端时间记录（包括 `@CreationTimestamp`、`@UpdateTimestamp`）均使用北京时间。
- **前端适配**: 使用 `toLocalISOString()` 发送本地时间，确保前后端时间一致。

#### 5. 🛠 工程化改进 (Engineering)
- **`.gitignore` 更新**: 添加 `agent/` 目录到忽略列表。
- **调试日志**: `handleFinish` 函数增加详细的彩色调试日志，便于排查问题。

## [2026-01-20 00:00]
### 🎯 习惯频率系统完整实现 (Habit Frequency System)

#### 1. 📊 频率枚举与数据模型 (Frequency Enum & Data Model)
- **后端枚举**: 新增 `Frequency` 枚举类，支持三种习惯频率：`DAILY`（每日）、`WEEKLY`（每周）、`MONTHLY`（每月）。
- **实体扩展**: 
  - `Habit` 实体新增 `frequency` 字段（默认值 `DAILY`），支持枚举类型持久化。
  - `HabitRequest` 和 `HabitResponse` DTO 均新增 `frequency` 字段传递。
  - Builder 模式全面支持频率属性设置。

#### 2. 📅 日期查询与周期计算 (Date Filtering & Period Calculation)
- **按日期查询接口**: 
  - `HabitController.getTodayHabits()` 接口支持 `date` 查询参数（可选，ISO 8601 格式）。
  - 未传递日期时默认查询当天，传递日期时查询指定日期的习惯数据。
  - 后端方法重命名为 `getHabitsForDate()` 以更准确反映功能。
- **智能进度计算**: 
  - `HabitService.mapToResponse()` 根据 `frequency` 类型计算当期进度：
    - **每日习惯**: 统计指定日期的记录总值。
    - **每周习惯**: 使用 ISO 周字段（`WeekFields.weekOfWeekBasedYear()`）计算当周进度。
    - **每月习惯**: 按年月过滤记录并累加进度。

#### 3. 🔥 连续打卡统计 (Streak Calculation)
- **Streak 算法实现**: 
  - 新增 `calculateCurrentStreak()` 方法，计算习惯的当前连续完成天数。
  - 仅当最近一次完成日期为今天或昨天时才计入 Streak，否则归零。
  - 从最近完成日期向前回溯，直到中断为止。
- **七天状态展示**: 
  - 新增 `getLastSevenDays()` 方法，返回过去 7 天（从 6 天前到今天）的完成状态布尔数组。
  - 用于前端展示打卡热力图或趋势线。
- **数据增强**: `HabitResponse` 新增 `currentStreak` 和 `lastSevenDays` 字段。

#### 4. 🌱 历史数据生成工具 (Seed History)
- **测试数据生成**: 
  - 新增 `/api/habits/seed` 接口，为当前用户的所有活跃习惯生成过去 30 天的随机历史记录。
  - 每天 70% 概率生成记录，数值随机分布在 0 到目标值的 1.5 倍之间。
  - 自动判定完成状态（达到目标值即标记为完成）。
- **用途**: 便于开发环境快速验证 Streak 计算、图表展示等功能。

#### 5. 🗓 日期选择弹窗 (Date Selection Modal)
- **前端组件**: 新增 `DateSelectionModal.tsx` 独立组件。
- **三种选择模式**: 
  - **日历模式**: 支持按日选择，显示标准月历视图，高亮今日和选中日期。
  - **周选择模式**: 按周展示（周一至周日），显示周次和日期范围。
  - **月选择模式**: 网格展示 12 个月，支持跨年切换。
- **交互优化**: 
  - 点击日期/周/月后自动关闭弹窗并更新选择。
  - 支持月份切换（前进/后退）。
  - 底部滑入动画和背景模糊效果。

#### 6. 🏠 首页交互增强 (HomeView Enhancement)
- **频率 Tab 切换**: 顶部新增 `DAILY` / `WEEKLY` / `MONTHLY` 三个频率标签，点击切换当前查看频率。
- **日期选择器集成**: 点击日历图标打开 `DateSelectionModal`，选择日期后自动刷新习惯列表。
- **动态查询**: 切换频率或日期时，向后端传递 `date` 参数重新加载对应周期的习惯数据。
- **打卡交互优化**: 
  - 未完成习惯显示"记录"按钮，支持鼠标悬停颜色渐变和发光效果。
  - 已完成习惯显示绿色打勾按钮，支持单击撤销（传递 `-1` 增量）。
  - 打卡中状态显示旋转加载动画，防止重复点击。
- **Toast 通知**: 新增底部中央 Toast 提示区域，支持成功/失败消息展示（绿色/红色主题）。
- **连续天数展示**: 
  - 每个习惯卡片底部新增 `lastSevenDays` 点阵图，直观展示过去 7 天的完成情况。
  - 显示当前 Streak 数值（火焰图标 + 数字）。

#### 7. 🛡 错误处理增强 (Error Handling)
- **API 错误提示**: 
  - `api.ts` 工具函数优化，非 200 状态码时解析并抛出服务端错误消息。
  - 支持展示后端返回的 `message` 或 `error` 字段。
  - 网络错误统一抛出异常，由调用方决定处理策略。
- **用户友好提示**: 前端捕获 API 错误后显示 Toast 提示，避免静默失败。

#### 8. 🎨 样式与依赖优化 (Styling & Dependencies)
- **Tailwind CSS 生态**: 
  - 安装 `tailwindcss 3.4.19` 及其依赖（`postcss`、`autoprefixer`、`fast-glob`、`sucrase` 等）。
  - 配置 `postcss.config.js` 和 `tailwind.config.js`，支持 Tailwind 类名的 JIT 编译。
- **`package-lock.json` 更新**: 新增大量 Tailwind 构建工具链依赖（如 `chokidar`、`micromatch`、`reusify` 等）。
- **全局样式调整**: `index.css` 可能包含针对新 UI 组件的样式定义（如 Toast 动画、模态框过渡效果）。

#### 9. 🗄️ 数据库查询优化 (Repository Enhancements)
- **新增查询方法**: 
  - `HabitLogRepository.findByHabitAndDateAfterOrderByDateDesc()` 支持查询某习惯在指定日期后的所有日志（按日期倒序）。
  - 用于 Streak 计算和历史趋势分析。
- **性能考虑**: 查询限制在近期数据范围（如 12 个月、7 天），避免全表扫描。

## [2026-01-21 16:00]
### 📊 统计分析看板 (Analytics Dashboard)

#### 1. 📈 全维度数据可视化 (Data Visualization)
- **后端架构**: 
  - 新增 `AnalyticsController` 和 `AnalyticsService`，提供时间分配、习惯一致性、热力图及成就统计接口。
  - 定义了 `HabitHeatmapDTO`, `TimeAllocationDTO` 等数据传输对象，规范前后端数据契约。
  - 扩展 `HabitLogRepository`，新增 `getHeatmapDataByRange` 方法，支持跨年及自定义日期范围的热力图数据查询。
- **前端实现**:
  - 全新 `AnalyticsView.tsx` 组件，集成 `Recharts` 库实现环形图、折线图和柱状图的动态切换。
  - 支持 **多维度时间筛选**：日、周、月、年及自定义日期范围（集成 DatePicker）。
  - **智能数据聚合**：年视图下自动按 15 天聚合数据，优化长期趋势展示。

#### 2. 🔥 习惯热力图 (Habit Heatmap Ultimate)
- **视觉升级**: 
  - 采用 **GitHub Dark 风格**的高对比度绿色阶梯 (`#0e4429` -> `#39d353`)，替代原有低对比度配色。
  - 方块圆角优化至 `2.5px`，提升视觉柔和度。
- **交互优化**: 
  - **自动滚动**：组件加载后自动定位到最右侧最新日期。
  - **移动端适配**：默认显示最近 6 个月数据，完美适配手机屏幕宽度，避免过度横向滚动。
  - **API 归一化**：前端统一处理日期格式为 `YYYY/MM/DD`，并强制对其午夜时间，解决组件渲染空白问题。

#### 3. 📱 移动端适配与体验 (Mobile & UX)
- **响应式布局**: 图表容器使用 `ResponsiveContainer`，确保在不同屏幕尺寸下均能完整显示。
- **细节打磨**: 
  - 移除了冗余的"数据统计中"占位符。
  - 优化了标题和按钮在移动端的排版和触摸区域。
  - 修复了 Nginx 路由配置，确保 `/api/analytics` 路径正确转发。