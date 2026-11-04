# Topics

Generated from `X.CATALOG` in `assets/explainer.js`, which is the source of truth. Edit the catalog, not this file, then regenerate with `node tests/gen-docs.js`.

**56 pages** cover all 111 concepts. **9** are live (one of them partial).

## Stage 1: Make one server work well

| Page | Topic | Concepts | Status | Folder |
| --- | --- | --- | --- | --- |
| 1 | Latency and throughput | 91 Latency, 92 Throughput, 93 P99 Latency, 94 Tail Latency | built | `latency-throughput/` |
| 2 | Database indexing | 25 Database Indexing, 26 Query Optimization | built | `database-indexing/` |
| 3 | N+1 queries and connection pooling | 27 N+1 Queries, 28 Connection Pooling | built | `n-plus-1-pooling/` |
| 4 | SQL injection and XSS | 78 SQL Injection, 79 XSS | built | `sql-injection-xss/` |

## Stage 2: Handle more traffic

| Page | Topic | Concepts | Status | Folder |
| --- | --- | --- | --- | --- |
| 5 | Caching | 2 Caching, 49 Edge Caching, 50 Cache Invalidation | built | `caching/` |
| 6 | Load balancing and scaling | 3 Load Balancing, 46 Horizontal Scaling, 47 Vertical Scaling | built | `load-balancing-scaling/` |
| 7 | Rate limiting | 1 Rate Limiting | built | `rate-limiting/` |
| 8 | Message queues | 15 Message Queues, 20 Dead Letter Queues, 44 Backpressure | built | `message-queues/` |

## Stage 3: Survive failures

| Page | Topic | Concepts | Status | Folder |
| --- | --- | --- | --- | --- |
| 9 | Timeouts, retries and backoff | 11 Timeouts, 12 Retries, 13 Exponential Backoff | planned | `timeouts-retries-backoff/` |
| 10 | Idempotency | 14 Idempotency | planned | `idempotency/` |
| 11 | Circuit breakers and health checks | 10 Circuit Breakers, 56 Health Checks, 57 Liveness & Readiness Probes | planned | `circuit-breakers-health-checks/` |

## Stage 4: Keep data correct

| Page | Topic | Concepts | Status | Folder |
| --- | --- | --- | --- | --- |
| 12 | Race conditions | 39 Race Conditions, 43 Thread Safety | planned | `race-conditions/` |
| 13 | Locking and deadlocks | 36 Optimistic Locking, 37 Pessimistic Locking, 40 Deadlocks | planned | `locking-deadlocks/` |
| 14 | Replication and failover | 29 Read Replicas, 32 Replication, 35 Eventual Consistency, 85 Failover | planned | `replication-failover/` |
| 15 | Sharding and partitioning | 30 Sharding, 31 Partitioning | planned | `sharding/` |
| 16 | CAP theorem | 34 CAP Theorem, 95 Network Partitions | planned | `cap-theorem/` |

## Stage 5: Ship and operate it

| Page | Topic | Concepts | Status | Folder |
| --- | --- | --- | --- | --- |
| 17 | CI/CD and safe deployments | 6 CI/CD, 51 Feature Flags, 52 Blue-Green Deployment, 53 Canary Releases, 54 Rolling Deployments, 55 Rollbacks | partial | `ci-cd/` |
| 18 | Observability | 58 Monitoring, 59 Logging, 60 Distributed Tracing, 61 Metrics, 62 Alerts, 66 Observability | planned | `observability/` |
| 19 | TLS and secrets | 67 Secrets Management, 71 TLS, 73 Encryption in Transit | planned | `tls-secrets/` |
| 20 | Final incident simulator | 83 Disaster Recovery, 84 Backups, 109 Production Incidents, 111 Postmortems | planned | `incident-simulator/` |

## Stage 6: Talk to the world

| Page | Topic | Concepts | Status | Folder |
| --- | --- | --- | --- | --- |
| 21 | DNS | 97 DNS | planned | `dns/` |
| 22 | TCP vs UDP | 98 TCP vs UDP | planned | `tcp-vs-udp/` |
| 23 | HTTP/2 and HTTP/3 | 99 HTTP/2 & HTTP/3 | planned | `http2-http3/` |
| 24 | WebSockets, long polling and SSE | 22 WebSockets, 23 Long Polling, 24 Server-Sent Events | planned | `realtime/` |
| 25 | gRPC | 100 gRPC | planned | `grpc/` |
| 26 | Webhooks | 101 Webhooks | planned | `webhooks/` |
| 27 | API versioning and semver | 102 API Versioning, 103 Semantic Versioning | planned | `api-versioning/` |
| 28 | Reverse proxies and API gateways | 4 Reverse Proxies, 5 API Gateways | planned | `proxies-gateways/` |
| 29 | CDN | 48 CDN | planned | `cdn/` |

## Stage 7: Architecture patterns

| Page | Topic | Concepts | Status | Folder |
| --- | --- | --- | --- | --- |
| 30 | Pub/sub and event-driven design | 16 Pub/Sub, 17 Event-Driven Architecture | planned | `pub-sub-events/` |
| 31 | Distributed transactions and sagas | 18 Distributed Transactions, 19 Saga Pattern | planned | `sagas/` |
| 32 | Cron jobs | 21 Cron Jobs | planned | `cron-jobs/` |
| 33 | Leader election and distributed locks | 33 Leader Election, 38 Distributed Locks | planned | `leader-election-locks/` |
| 34 | Clock skew | 96 Clock Skew | planned | `clock-skew/` |
| 35 | Multi-region deployment | 86 Multi-Region Deployment | planned | `multi-region/` |

## Stage 8: Runtime and cost

| Page | Topic | Concepts | Status | Folder |
| --- | --- | --- | --- | --- |
| 36 | Memory leaks and garbage collection | 41 Memory Leaks, 42 Garbage Collection | planned | `memory-leaks-gc/` |
| 37 | Autoscaling | 45 Autoscaling | planned | `autoscaling/` |
| 38 | Cold starts and serverless limits | 89 Cold Starts, 90 Serverless Limits | planned | `serverless/` |
| 39 | Cost optimization | 88 Cost Optimization | planned | `cost-optimization/` |

## Stage 9: Build and infrastructure

| Page | Topic | Concepts | Status | Folder |
| --- | --- | --- | --- | --- |
| 40 | Docker | 7 Docker | planned | `docker/` |
| 41 | Kubernetes, service discovery and Helm | 8 Kubernetes, 9 Service Discovery, 106 Helm Charts | planned | `kubernetes/` |
| 42 | Infrastructure as code and Terraform | 104 Infrastructure as Code, 105 Terraform | planned | `infrastructure-as-code/` |
| 43 | Build caching | 107 Build Caching | planned | `build-caching/` |
| 44 | Dependency hell | 108 Dependency Hell | planned | `dependency-hell/` |
| 45 | Database migrations and schema versioning | 81 Database Migrations, 82 Schema Versioning | planned | `migrations/` |

## Stage 10: Security, part 2

| Page | Topic | Concepts | Status | Folder |
| --- | --- | --- | --- | --- |
| 46 | IAM | 68 IAM | planned | `iam/` |
| 47 | OAuth | 69 OAuth | planned | `oauth/` |
| 48 | JWT rotation | 70 JWT Rotation | planned | `jwt-rotation/` |
| 49 | Encryption at rest | 72 Encryption at Rest | planned | `encryption-at-rest/` |
| 50 | WAF and DDoS protection | 74 WAF, 75 DDoS Protection | planned | `waf-ddos/` |
| 51 | CORS | 76 CORS | planned | `cors/` |
| 52 | CSRF | 77 CSRF | planned | `csrf/` |
| 53 | SSRF | 80 SSRF | planned | `ssrf/` |

## Stage 11: Reliability practice

| Page | Topic | Concepts | Status | Folder |
| --- | --- | --- | --- | --- |
| 54 | SLIs, SLOs and error budgets | 63 SLOs, 64 SLIs, 65 Error Budgets | planned | `slos/` |
| 55 | Chaos engineering | 87 Chaos Engineering | planned | `chaos-engineering/` |
| 56 | On-call | 110 On-Call | planned | `on-call/` |
