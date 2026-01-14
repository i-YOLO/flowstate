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
