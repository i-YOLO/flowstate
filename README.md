# FlowState - 生产力与心流管理平台

FlowState 是一款旨在帮助用户通过科学的时间管理和习惯追踪进入“心流”状态的全栈 Web 应用。

## 🚀 项目功能
- **智能习惯看板**: 多维度（定量、时长、状态）习惯打卡与 Streak 追踪。
- **互动时间轴**: 支持拖拽、缩放的 Daily Time-Blocking 日历。
- **专注计时器**: 番茄钟模式，专注结果自动同步至日历。
- **动态社区**: 记录成就、互动点赞，构建社交激励。
- **数据可视化**: 详尽的生产力分布环形图与习惯一致性分析。

## 🛠 技术栈
- **前端**: React 19, TypeScript, Vite, Tailwind CSS, Recharts
- **后端**: Node.js, Express, TypeScript, Prisma ORM
- **数据库**: PostgreSQL
- **基础设施**: Docker, Docker Compose

## 📂 项目结构
```text
flowstate/
├── frontend/               # 前端项目 (React + Vite)
│   ├── src/                # 业务逻辑与 UI 组件
│   └── Dockerfile          # 前端容器化配置
├── backend/                # 后端 API (Node.js + Express)
│   ├── src/                # 接口服务、数据库模型
│   └── Dockerfile          # 后端容器化配置
├── docker-compose.yml      # 全栈容器运行配置
├── PRD.md                  # 详细需求文档
└── .env                    # 环境配置文件
```

## ⚡️ 快速启动

**前提条件**: 安装了 Docker 和 Docker Compose。

1. **配置环境**:
   复制并根据需要修改 `.env` 文件。
   ```bash
   cp .env.example .env # 如果有 example 的话
   ```

2. **一键启动**:
   在根目录下运行：
   ```bash
   docker-compose up --build
   ```

3. **访问应用**:
   - **前端界面**: [http://localhost](http://localhost)
   - **后端 API**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

## 📝 需求说明
详见 [PRD.md](./PRD.md)
