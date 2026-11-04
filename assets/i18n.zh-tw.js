/* System Design Lab: 繁體中文 (zh-tw) strings shared by every page.
   assets/i18n.zh-cn.js is generated from this file by tools/i18n.py (OpenCC tw2sp). Edit this one. */
(() => {
  const X = window.X;
  Object.assign(X.T, {
    play: '▶ 播放', pause: '❚❚ 暫停', step: '單步', reset: '↺ 重設',
    run: '執行中…', ok: '✓ 通過', fail: '✕ 失敗', wait: '⏸ 等待中',
    right: '✓ 答對了。', wrong: '✕ 不太對。', nailed: ' · 全對！', retry: ' · 重讀一次重點整理，再回去玩一次實驗室',
    prev: '← 上一頁', next: '下一頁 →', page: n => `第 ${n} 頁`, all: '所有主題', roadmap: '學習地圖',
  });

  const STAGES = ['讓一台伺服器跑得好', '撐住更多流量', '在故障中存活', '保持資料正確', '上線與維運', '與外界溝通', '架構模式', '執行環境與成本', '建置與基礎設施', '資安（下篇）', '可靠性實務'];
  X.STAGES.forEach((s, i) => (s.name = STAGES[i]));

  const TITLES = [null,
    '延遲與吞吐量', '資料庫索引', 'N+1 查詢與連線池', 'SQL 注入與 XSS', '快取', '負載平衡與擴展', '限流', '訊息佇列',
    '逾時、重試與退避', '冪等性', '斷路器與健康檢查', '競態條件', '鎖與死結', '複製與故障轉移', '分片與分割', 'CAP 定理',
    'CI/CD 與安全部署', '可觀測性', 'TLS 與機密管理', '期末事故模擬', 'DNS', 'TCP 與 UDP', 'HTTP/2 與 HTTP/3', 'WebSocket、長輪詢與 SSE',
    'gRPC', 'Webhook', 'API 版本與語意化版本', '反向代理與 API 閘道', 'CDN', '發布/訂閱與事件驅動設計', '分散式交易與 Saga', '排程工作（Cron）',
    '領導者選舉與分散式鎖', '時鐘偏移', '多區域部署', '記憶體洩漏與垃圾回收', '自動擴展', '冷啟動與無伺服器限制', '成本最佳化', 'Docker',
    'Kubernetes、服務發現與 Helm', '基礎設施即程式碼與 Terraform', '建置快取', '相依性地獄', '資料庫遷移與結構描述版本', 'IAM', 'OAuth', 'JWT 輪替',
    '靜態資料加密', 'WAF 與 DDoS 防護', 'CORS', 'CSRF', 'SSRF', 'SLI、SLO 與錯誤預算', '混沌工程', '輪值待命（On-call）'];
  X.CATALOG.forEach(p => (p.title = TITLES[p.n]));

  X.CONCEPTS = [null,
    '限流（Rate Limiting）', '快取（Caching）', '負載平衡（Load Balancing）', '反向代理（Reverse Proxy）', 'API 閘道（API Gateway）', 'CI/CD', 'Docker', 'Kubernetes',
    '服務發現（Service Discovery）', '斷路器（Circuit Breaker）', '逾時（Timeout）', '重試（Retry）', '指數退避（Exponential Backoff）', '冪等性（Idempotency）', '訊息佇列（Message Queue）', '發布/訂閱（Pub/Sub）',
    '事件驅動架構（Event-Driven Architecture）', '分散式交易（Distributed Transaction）', 'Saga 模式', '死信佇列（Dead Letter Queue）', '排程工作（Cron Job）', 'WebSocket', '長輪詢（Long Polling）', '伺服器推送事件（SSE）',
    '資料庫索引（Database Indexing）', '查詢最佳化（Query Optimization）', 'N+1 查詢', '連線池（Connection Pooling）', '唯讀副本（Read Replica）', '分片（Sharding）', '分割（Partitioning）', '複製（Replication）',
    '領導者選舉（Leader Election）', 'CAP 定理', '最終一致性（Eventual Consistency）', '樂觀鎖（Optimistic Locking）', '悲觀鎖（Pessimistic Locking）', '分散式鎖（Distributed Lock）', '競態條件（Race Condition）', '死結（Deadlock）',
    '記憶體洩漏（Memory Leak）', '垃圾回收（Garbage Collection）', '執行緒安全（Thread Safety）', '背壓（Backpressure）', '自動擴展（Autoscaling）', '水平擴展（Horizontal Scaling）', '垂直擴展（Vertical Scaling）', 'CDN',
    '邊緣快取（Edge Caching）', '快取失效（Cache Invalidation）', '功能旗標（Feature Flag）', '藍綠部署（Blue-Green Deployment）', '金絲雀發布（Canary Release）', '滾動部署（Rolling Deployment）', '回滾（Rollback）', '健康檢查（Health Check）',
    '存活與就緒探針（Liveness & Readiness Probe）', '監控（Monitoring）', '日誌（Logging）', '分散式追蹤（Distributed Tracing）', '指標（Metrics）', '告警（Alert）', 'SLO', 'SLI',
    '錯誤預算（Error Budget）', '可觀測性（Observability）', '機密管理（Secrets Management）', 'IAM', 'OAuth', 'JWT 輪替', 'TLS', '靜態資料加密（Encryption at Rest）',
    '傳輸中加密（Encryption in Transit）', 'WAF', 'DDoS 防護', 'CORS', 'CSRF', 'SQL 注入（SQL Injection）', 'XSS', 'SSRF',
    '資料庫遷移（Database Migration）', '結構描述版本（Schema Versioning）', '災難復原（Disaster Recovery）', '備份（Backup）', '故障轉移（Failover）', '多區域部署（Multi-Region）', '混沌工程（Chaos Engineering）', '成本最佳化（Cost Optimization）',
    '冷啟動（Cold Start）', '無伺服器限制（Serverless Limits）', '延遲（Latency）', '吞吐量（Throughput）', 'P99 延遲', '尾端延遲（Tail Latency）', '網路分割（Network Partition）', '時鐘偏移（Clock Skew）',
    'DNS', 'TCP 與 UDP', 'HTTP/2 與 HTTP/3', 'gRPC', 'Webhook', 'API 版本控制（API Versioning）', '語意化版本（Semantic Versioning）', '基礎設施即程式碼（IaC）',
    'Terraform', 'Helm Chart', '建置快取（Build Caching）', '相依性地獄（Dependency Hell）', '線上事故（Production Incident）', '輪值待命（On-Call）', '事後檢討（Postmortem）'];
})();
