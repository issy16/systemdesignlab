/* System Design Lab: 繁体中文 (zh-tw) strings shared by every page.
   assets/i18n.zh-cn.js is generated from this file by tools/i18n.py (OpenCC tw2sp). Edit this one. */
(() => {
  const X = window.X;
  Object.assign(X.T, {
    play: '▶ 播放', pause: '❚❚ 暂停', step: '单步', reset: '↺ 重置',
    run: '运行中…', ok: '✓ 通过', fail: '✕ 失败', wait: '⏸ 等待中',
    right: '✓ 答对了。', wrong: '✕ 不太对。', nailed: ' · 全对！', retry: ' · 重读一次重点整理，再回去玩一次实验室',
    prev: '← 上一页', next: '下一页 →', page: n => `第 ${n} 页`, all: '所有主题', roadmap: '学习地图',
  });

  const STAGES = ['让一台服务器跑得好', '撑住更多流量', '在故障中存活', '保持数据正确', '上线与维运', '与外界沟通', '架构模式', '运行环境与成本', '建置与基础设施', '资安（下篇）', '可靠性实务'];
  X.STAGES.forEach((s, i) => (s.name = STAGES[i]));

  const TITLES = [null,
    '延迟与吞吐量', '数据库索引', 'N+1 查找与连接池', 'SQL 注入与 XSS', '缓存', '负载平衡与扩展', '限流', '消息队列',
    '超时、重试与退避', '幂等性', '断路器与健康检查', '竞态条件', '锁与死结', '拷贝与故障转移', '分片与分割', 'CAP 定理',
    'CI/CD 与安全部署', '可观测性', 'TLS 与机密管理', '期末事故模拟', 'DNS', 'TCP 与 UDP', 'HTTP/2 与 HTTP/3', 'WebSocket、长轮询与 SSE',
    'gRPC', 'Webhook', 'API 版本与语意化版本', '反向代理与 API 闸道', 'CDN', '发布/订阅与事件驱动设计', '分布式交易与 Saga', '调度工作（Cron）',
    '领导者选举与分布式锁', '时钟偏移', '多区域部署', '内存泄漏与垃圾回收', '自动扩展', '冷启动与无服务器限制', '成本优化', 'Docker',
    'Kubernetes、服务发现与 Helm', '基础设施即代码与 Terraform', '建置缓存', '相依性地狱', '数据库迁移与结构描述版本', 'IAM', 'OAuth', 'JWT 轮替',
    '静态数据加密', 'WAF 与 DDoS 防护', 'CORS', 'CSRF', 'SSRF', 'SLI、SLO 与错误预算', '混沌工程', '轮值待命（On-call）'];
  X.CATALOG.forEach(p => (p.title = TITLES[p.n]));

  X.CONCEPTS = [null,
    '限流（Rate Limiting）', '缓存（Caching）', '负载平衡（Load Balancing）', '反向代理（Reverse Proxy）', 'API 闸道（API Gateway）', 'CI/CD', 'Docker', 'Kubernetes',
    '服务发现（Service Discovery）', '断路器（Circuit Breaker）', '超时（Timeout）', '重试（Retry）', '指数退避（Exponential Backoff）', '幂等性（Idempotency）', '消息队列（Message Queue）', '发布/订阅（Pub/Sub）',
    '事件驱动架构（Event-Driven Architecture）', '分布式交易（Distributed Transaction）', 'Saga 模式', '死信队列（Dead Letter Queue）', '调度工作（Cron Job）', 'WebSocket', '长轮询（Long Polling）', '服务器推送事件（SSE）',
    '数据库索引（Database Indexing）', '查找优化（Query Optimization）', 'N+1 查找', '连接池（Connection Pooling）', '唯读副本（Read Replica）', '分片（Sharding）', '分割（Partitioning）', '拷贝（Replication）',
    '领导者选举（Leader Election）', 'CAP 定理', '最终一致性（Eventual Consistency）', '乐观锁（Optimistic Locking）', '悲观锁（Pessimistic Locking）', '分布式锁（Distributed Lock）', '竞态条件（Race Condition）', '死结（Deadlock）',
    '内存泄漏（Memory Leak）', '垃圾回收（Garbage Collection）', '线程安全（Thread Safety）', '背压（Backpressure）', '自动扩展（Autoscaling）', '水平扩展（Horizontal Scaling）', '垂直扩展（Vertical Scaling）', 'CDN',
    '边缘缓存（Edge Caching）', '缓存失效（Cache Invalidation）', '功能旗标（Feature Flag）', '蓝绿部署（Blue-Green Deployment）', '金丝雀发布（Canary Release）', '滚动部署（Rolling Deployment）', '回滚（Rollback）', '健康检查（Health Check）',
    '存活与就绪探针（Liveness & Readiness Probe）', '监控（Monitoring）', '日志（Logging）', '分布式追踪（Distributed Tracing）', '指针（Metrics）', '告警（Alert）', 'SLO', 'SLI',
    '错误预算（Error Budget）', '可观测性（Observability）', '机密管理（Secrets Management）', 'IAM', 'OAuth', 'JWT 轮替', 'TLS', '静态数据加密（Encryption at Rest）',
    '传输中加密（Encryption in Transit）', 'WAF', 'DDoS 防护', 'CORS', 'CSRF', 'SQL 注入（SQL Injection）', 'XSS', 'SSRF',
    '数据库迁移（Database Migration）', '结构描述版本（Schema Versioning）', '灾难复原（Disaster Recovery）', '备份（Backup）', '故障转移（Failover）', '多区域部署（Multi-Region）', '混沌工程（Chaos Engineering）', '成本优化（Cost Optimization）',
    '冷启动（Cold Start）', '无服务器限制（Serverless Limits）', '延迟（Latency）', '吞吐量（Throughput）', 'P99 延迟', '尾端延迟（Tail Latency）', '网络分割（Network Partition）', '时钟偏移（Clock Skew）',
    'DNS', 'TCP 与 UDP', 'HTTP/2 与 HTTP/3', 'gRPC', 'Webhook', 'API 版本控制（API Versioning）', '语意化版本（Semantic Versioning）', '基础设施即代码（IaC）',
    'Terraform', 'Helm Chart', '建置缓存（Build Caching）', '相依性地狱（Dependency Hell）', '在线事故（Production Incident）', '轮值待命（On-Call）', '事后检讨（Postmortem）'];
})();
