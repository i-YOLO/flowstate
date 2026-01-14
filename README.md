# FlowState - 生产力与心流管理平台

FlowState 是一款旨在帮助用户通过科学的时间管理和习惯追踪进入“心流”状态的全栈应用。

## 🚀 项目功能
- **智能习惯看板**: 多维度（定量、时长、状态）习惯打卡与 Streak 追踪。
- **互动时间轴**: 支持拖拽、缩放的 Daily Time-Blocking 日历。
- **专注计时器**: 番茄钟模式，专注结果自动同步至日历。
- **动态社区**: 记录成就、互动点赞，构建社交激励。
- **数据可视化**: 详尽的生产力分布环形图与习惯一致性分析。

## 🛠 技术栈
- **前端**: React 19, TypeScript, Vite, Tailwind CSS
- **后端**: Java 17 (Spring Boot 3.4.1), Spring Data JPA
- **数据库**: PostgreSQL 12-alpine
- **基础设施**: Docker, Docker Compose
- **构建优化**: 针对 JDK 25 的“去 Lombok”手动样板代码优化，极速宿主机编译分发模式。

## 📂 项目结构
```text
flowstate/
├── frontend/               # 前端项目 (React + Vite)
│   ├── src/                # 业务逻辑与 UI 组件
│   └── Dockerfile          # 前端容器化配置 (Nginx 托管)
├── backend/                # 后端 API (Java Spring Boot)
│   ├── src/                # Controller, Service, Entity, Repository
│   ├── pom.xml             # Maven 项目配置
│   └── Dockerfile          # 后端容器化配置 (轻量级 JRE 运行时)
├── docker-compose.yml      # 全栈容器运行配置 (含 PostgreSQL 12)
├── PRD.md                  # 详细需求文档
├── CHANGELOG.md            # 变更记录
└── .env                    # 环境配置文件
```

## ⚡️ 快速启动

**前提条件**: 安装了 Docker, Docker Compose 以及 Maven (用于本地构建后端)。

1. **配置环境**:
   确保项目根目录下存在 `.env` 文件并正确配置数据库环境变量。

2. **本地编译后端 (关键步)**:
   由于采用了宿主机编译策略以最大化速度，请先在本地生成 JAR 包：
   ```bash
   cd backend && mvn clean package -DskipTests && cd ..
   ```

3. **容器一键部署**:
   在根目录下运行：
   ```bash
   docker-compose up --build -d
   ```

4. **访问服务**:
   - **Web 前端**: [http://localhost](http://localhost)
   - **后端 API**: [http://localhost:4000/api/habits/today/{userId}](http://localhost:4000/api/habits/today/{userId})

## 📝 文档索引
- [需求规格说明书 (PRD)](./PRD.md)
- [版本变更日志 (CHANGELOG)](./CHANGELOG.md)
