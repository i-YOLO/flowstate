# 极速运行镜像 - 不在容器内编译
FROM eclipse-temurin:17-jre
WORKDIR /app
# 复制本地构建好的 jar
COPY target/*.jar app.jar
EXPOSE 4000
# 设置 JVM 时区为 Asia/Shanghai (UTC+8)
ENTRYPOINT ["java", "-Duser.timezone=Asia/Shanghai", "-jar", "app.jar"]
