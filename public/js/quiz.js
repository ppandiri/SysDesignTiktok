// ============================================================
// QUIZ: Modular intro quiz to score users across topic areas.
//
// SCORING PRINCIPLE: A question's `topics` array lists ONLY
// the specific topic IDs that the question directly tests.
// Getting it right/wrong ONLY affects those exact topics.
// No bleed-over to adjacent topics in the same category.
//
// Topics not covered by any quiz question get a neutral default.
// ============================================================

const QUIZ_CORRECT_FAMILIARITY = 72;  // answered correctly
const QUIZ_WRONG_FAMILIARITY   = 12;  // answered incorrectly
const QUIZ_DEFAULT_FAMILIARITY = 35;  // topic not tested at all

// ============================================================
// QUESTION BANK
// ============================================================
const QUIZ_BANK = [

  // ── FUNDAMENTALS ────────────────────────────────────────────
  {
    id: "q-fund-lb",
    categories: ["Fundamentals"],
    topics: ["load-balancing"],           // tests: load balancing only
    q: "A web service is struggling under peak traffic. Which approach distributes requests across multiple identical servers?",
    options: [
      "Vertical scaling — upgrade to a bigger server",
      "Load balancing — spread requests across a fleet of servers",
      "Database indexing — add indexes to speed up queries",
      "Rate limiting — throttle inbound requests"
    ],
    correct: 1,
    explain: "A load balancer distributes incoming requests across multiple servers, preventing any single server from being overwhelmed."
  },
  {
    id: "q-fund-scale",
    categories: ["Fundamentals"],
    topics: ["scaling"],                  // tests: horizontal vs vertical scaling only
    q: "Your single database server is at 95% CPU. You add a second identical server and split reads between them. This is an example of:",
    options: [
      "Vertical scaling",
      "Horizontal scaling",
      "Database sharding",
      "Replication lag"
    ],
    correct: 1,
    explain: "Adding more machines of the same size to share load is horizontal (scale-out) scaling."
  },
  {
    id: "q-fund-cache",
    categories: ["Fundamentals"],
    topics: ["caching"],                  // tests: caching only
    q: "Which caching strategy serves the cached value immediately and refreshes it in the background after it expires?",
    options: [
      "Write-through cache",
      "Cache-aside (lazy loading)",
      "Stale-while-revalidate",
      "Write-back cache"
    ],
    correct: 2,
    explain: "Stale-while-revalidate serves the cached copy immediately (even if stale) and asynchronously fetches a fresh copy, minimising perceived latency."
  },
  {
    id: "q-fund-cdn",
    categories: ["Fundamentals"],
    topics: ["cdn"],                      // tests: CDN only
    q: "A CDN edge node in Singapore serves content to a local user instead of fetching it from a US origin. What primary benefit does this provide?",
    options: [
      "Reduced origin storage costs",
      "Lower latency due to geographic proximity",
      "Stronger encryption",
      "Higher write throughput"
    ],
    correct: 1,
    explain: "CDNs cache content at edge nodes close to users, dramatically reducing round-trip latency compared to crossing oceans to the origin."
  },
  {
    id: "q-fund-sql",
    categories: ["Fundamentals"],
    topics: ["sql-nosql"],                // tests: SQL vs NoSQL only
    q: "You need to store social-graph relationships with deeply nested multi-hop traversals. Which database model fits best?",
    options: [
      "Relational (SQL) with foreign key joins",
      "Document store (MongoDB)",
      "Graph database (Neo4j / Neptune)",
      "Wide-column store (Cassandra)"
    ],
    correct: 2,
    explain: "Graph databases natively represent nodes and edges, making relationship traversals orders of magnitude faster than SQL joins."
  },
  {
    id: "q-fund-index",
    categories: ["Fundamentals"],
    topics: ["db-indexing"],              // tests: database indexing only
    q: "A table has 50 million rows. A query on an un-indexed `email` column does a full table scan. Adding a B-tree index on `email` changes the lookup complexity from:",
    options: [
      "O(n) → O(log n)",
      "O(n) → O(1)",
      "O(log n) → O(1)",
      "No change — indexes only help writes"
    ],
    correct: 0,
    explain: "A B-tree index turns a full O(n) scan into an O(log n) tree traversal, making lookups orders of magnitude faster on large tables."
  },
  {
    id: "q-fund-cap",
    categories: ["Fundamentals"],
    topics: ["cap-theorem"],              // tests: CAP theorem only
    q: "Under the CAP theorem, during a network partition a distributed system must choose between:",
    options: [
      "Consistency and Availability",
      "Latency and Throughput",
      "Read performance and Write performance",
      "Synchronous and Asynchronous replication"
    ],
    correct: 0,
    explain: "CAP states that a partitioned system can guarantee Consistency OR Availability — not both simultaneously."
  },
  {
    id: "q-fund-repl",
    categories: ["Fundamentals"],
    topics: ["replication"],              // tests: replication only
    q: "In leader-follower database replication, a follower replica can be used to:",
    options: [
      "Accept write transactions to reduce leader load",
      "Scale read throughput by serving SELECT queries",
      "Perform schema migrations without downtime",
      "Replace the leader automatically on every request"
    ],
    correct: 1,
    explain: "Followers replicate the leader's writes and serve read queries, scaling read throughput without touching the leader."
  },
  {
    id: "q-fund-shard",
    categories: ["Fundamentals"],
    topics: ["sharding"],                 // tests: sharding only
    q: "You partition a users table by `user_id % 4` across 4 database shards. A query for all users in a given city requires:",
    options: [
      "A single fast shard lookup",
      "A scatter-gather query hitting all 4 shards",
      "A full table scan on the primary shard",
      "A distributed join between shards"
    ],
    correct: 1,
    explain: "Hash-based sharding by user_id means city-based queries have no single shard to target — you must scatter the query to all shards and gather results."
  },
  {
    id: "q-fund-hash",
    categories: ["Fundamentals"],
    topics: ["consistent-hashing"],       // tests: consistent hashing only
    q: "A cache cluster uses modulo hashing across 10 nodes. A node is added making 11. Approximately what fraction of keys must be remapped?",
    options: [
      "~9% — only the new node's keys move",
      "~50% — about half the keys remap",
      "~91% — almost all keys remap",
      "0% — consistent hashing avoids remapping"
    ],
    correct: 2,
    explain: "Naive mod-N hashing remaps ~(N-1)/N ≈ 91% of keys when a node is added. Consistent hashing reduces this to ~1/N ≈ 9%."
  },
  {
    id: "q-fund-mq",
    categories: ["Fundamentals"],
    topics: ["message-queues"],           // tests: message queues only
    q: "Service A produces tasks and Service B processes them. B goes down for 10 minutes. With a message queue between them, what happens to tasks produced during that time?",
    options: [
      "They are dropped — B was unavailable",
      "They are buffered in the queue and processed when B recovers",
      "They are retried synchronously by A until B comes back",
      "A buffers them in memory until B recovers"
    ],
    correct: 1,
    explain: "Message queues durably buffer messages, decoupling producer availability from consumer availability."
  },
  {
    id: "q-fund-dns",
    categories: ["Fundamentals"],
    topics: ["dns"],                      // tests: DNS only
    q: "When a browser visits example.com for the first time, what is the correct order of DNS resolution steps?",
    options: [
      "Browser cache → OS cache → Recursive resolver → Root NS → TLD NS → Authoritative NS",
      "Authoritative NS → TLD NS → Root NS → Recursive resolver",
      "Browser cache → Authoritative NS directly",
      "OS cache → CDN → Authoritative NS"
    ],
    correct: 0,
    explain: "DNS resolution walks the hierarchy from local caches outward: browser → OS → recursive resolver → root → TLD → authoritative nameserver."
  },
  {
    id: "q-fund-rate",
    categories: ["Fundamentals"],
    topics: ["rate-limiting"],            // tests: rate limiting only
    q: "Which rate-limiting algorithm allows short bursts above the average rate while still enforcing a long-term average?",
    options: [
      "Fixed window counter",
      "Sliding window log",
      "Token bucket",
      "Leaky bucket"
    ],
    correct: 2,
    explain: "Token bucket accumulates tokens up to a capacity, allowing bursts. Leaky bucket smooths output at a constant rate, not allowing bursts."
  },
  {
    id: "q-fund-ms",
    categories: ["Fundamentals"],
    topics: ["microservices"],            // tests: microservices vs monolith only
    q: "A startup deploys their entire application as one deployable unit. The main advantage of this over microservices early on is:",
    options: [
      "Easier independent scaling of components",
      "Simpler deployment, development, and debugging",
      "Better fault isolation between services",
      "Faster network calls between components"
    ],
    correct: 1,
    explain: "Monoliths are operationally simpler early on — no network overhead, distributed tracing, or inter-service contract management needed."
  },
  {
    id: "q-fund-gw",
    categories: ["Fundamentals"],
    topics: ["api-gateway"],              // tests: API gateway only
    q: "An API Gateway sits in front of 12 microservices. Which responsibility does it handle that individual services should NOT each implement?",
    options: [
      "Business logic for each service's domain",
      "Data storage for each service",
      "Authentication, rate limiting, and routing at the entry point",
      "Running background jobs for each service"
    ],
    correct: 2,
    explain: "An API Gateway centralises cross-cutting concerns like auth, rate limiting, SSL termination, and routing so individual services don't need to duplicate them."
  },

  // ── AWS ─────────────────────────────────────────────────────
  {
    id: "q-aws-s3",
    categories: ["AWS"],
    topics: ["s3"],                       // tests: S3 only
    q: "Which S3 storage class is cheapest for data that is accessed less than once a month and requires millisecond retrieval?",
    options: [
      "S3 Standard",
      "S3 Standard-IA (Infrequent Access)",
      "S3 Glacier Instant Retrieval",
      "S3 Glacier Deep Archive"
    ],
    correct: 1,
    explain: "S3 Standard-IA costs ~60% less than Standard for storage, with a per-retrieval fee — ideal for infrequently accessed data needing ms latency."
  },
  {
    id: "q-aws-lambda",
    categories: ["AWS"],
    topics: ["aws-lambda"],               // tests: Lambda/serverless only
    q: "AWS Lambda is best suited for workloads that are:",
    options: [
      "Long-running, CPU-bound machine learning training jobs",
      "Stateful services that maintain WebSocket connections",
      "Short-lived, event-triggered functions with variable traffic",
      "Persistent databases requiring ACID transactions"
    ],
    correct: 2,
    explain: "Lambda excels at short-lived (up to 15 min), event-driven functions that scale automatically with traffic — not for long-running stateful workloads."
  },
  {
    id: "q-aws-sqs",
    categories: ["AWS"],
    topics: ["sqs-sns"],                  // tests: SQS/SNS only
    q: "You need to fan out an order-placed event to inventory, billing, and notification services simultaneously. Which AWS pattern fits?",
    options: [
      "SQS FIFO queue — each service polls the same queue",
      "SNS topic → multiple SQS queues (fan-out pattern)",
      "Lambda calling each service synchronously in sequence",
      "EventBridge bus with a single Lambda target"
    ],
    correct: 1,
    explain: "SNS → SQS fan-out delivers an independent copy of each message to every subscribed queue simultaneously."
  },
  {
    id: "q-aws-ec2",
    categories: ["AWS"],
    topics: ["ec2-autoscaling"],          // tests: EC2 Auto Scaling only
    q: "An EC2 Auto Scaling Group is configured with min=2, max=10, desired=4. CPU averages 85% for 5 minutes. What happens?",
    options: [
      "Nothing — desired capacity is already set",
      "The group scales out, adding instances up to the max",
      "The group terminates instances to reduce cost",
      "The existing instances are upgraded to larger types"
    ],
    correct: 1,
    explain: "ASG scale-out policies add instances when metrics breach thresholds, up to the configured maximum."
  },
  {
    id: "q-aws-dynamo",
    categories: ["AWS"],
    topics: ["dynamodb"],                 // tests: DynamoDB only
    q: "DynamoDB performs best when queries use the primary key. A query filtering by a non-key attribute across all items requires:",
    options: [
      "A GetItem call — DynamoDB handles arbitrary filters natively",
      "A full table Scan — expensive and slow at scale",
      "A Global Secondary Index (GSI) if that attribute is needed often",
      "Both B and C — Scan now, add GSI for production"
    ],
    correct: 3,
    explain: "Without a GSI, filtering by a non-key attribute requires a full Scan (reads every item). Add a GSI with that attribute as the key for efficient queries."
  },
  {
    id: "q-aws-rds",
    categories: ["AWS"],
    topics: ["rds-aurora"],               // tests: RDS/Aurora only
    q: "Aurora Serverless v2 differs from a standard RDS instance because it:",
    options: [
      "Only supports NoSQL workloads",
      "Scales compute capacity automatically in fine-grained increments within seconds",
      "Stores data in S3 instead of block storage",
      "Requires manual failover in a Multi-AZ setup"
    ],
    correct: 1,
    explain: "Aurora Serverless v2 adjusts capacity in 0.5 ACU increments almost instantly, eliminating the need to pre-provision for peak load."
  },
  {
    id: "q-aws-elb",
    categories: ["AWS"],
    topics: ["elb-alb"],                  // tests: ELB/ALB only
    q: "An Application Load Balancer (ALB) operates at Layer 7. What can it do that a Network Load Balancer (NLB) at Layer 4 cannot?",
    options: [
      "Handle millions of requests per second",
      "Route traffic based on URL path or HTTP headers",
      "Preserve the client's source IP address",
      "Handle TCP and UDP traffic"
    ],
    correct: 1,
    explain: "ALB inspects HTTP headers and paths to route /api/* to one target group and /static/* to another — impossible at the TCP layer."
  },
  {
    id: "q-aws-route53",
    categories: ["AWS"],
    topics: ["route53"],                  // tests: Route 53 only
    q: "You want to route users to the lowest-latency AWS region automatically. Which Route 53 routing policy do you use?",
    options: [
      "Weighted routing",
      "Failover routing",
      "Latency-based routing",
      "Geolocation routing"
    ],
    correct: 2,
    explain: "Latency-based routing measures AWS network latency to each region and routes each user's DNS query to the region with the lowest latency."
  },

  // ── GOOGLE CLOUD ─────────────────────────────────────────────
  {
    id: "q-gcp-bq",
    categories: ["Google Cloud"],
    topics: ["bigquery"],                 // tests: BigQuery only
    q: "BigQuery charges by bytes scanned, not compute time. Which query technique directly reduces cost?",
    options: [
      "Using LIMIT to reduce output rows",
      "Selecting only required columns instead of SELECT *",
      "Adding a WHERE clause on a non-partitioned column",
      "Running queries during off-peak hours"
    ],
    correct: 1,
    explain: "BigQuery is columnar — SELECT * scans all columns. Selecting only needed columns can reduce bytes scanned (and cost) by 90%+."
  },
  {
    id: "q-gcp-pubsub",
    categories: ["Google Cloud"],
    topics: ["gcp-pubsub"],               // tests: Cloud Pub/Sub only
    q: "In Cloud Pub/Sub, two different services need to independently consume the same stream of events. How do you configure this?",
    options: [
      "Create two separate topics — one per service",
      "Create two subscriptions on the same topic — each gets its own copy",
      "Use a single pull subscription shared between both services",
      "Enable message deduplication on the topic"
    ],
    correct: 1,
    explain: "Each Pub/Sub subscription gets its own independent copy of every message. Multiple subscriptions on one topic = fan-out."
  },
  {
    id: "q-gcp-spanner",
    categories: ["Google Cloud"],
    topics: ["cloud-spanner"],            // tests: Cloud Spanner only
    q: "Cloud Spanner achieves external consistency globally using TrueTime. What is TrueTime?",
    options: [
      "A distributed locking service",
      "An API backed by GPS and atomic clocks that provides bounded clock uncertainty",
      "A consensus protocol similar to Raft",
      "A synchronous replication protocol between zones"
    ],
    correct: 1,
    explain: "TrueTime uses GPS receivers and atomic clocks in every datacenter to provide a globally bounded timestamp API, enabling Spanner's external consistency."
  },
  {
    id: "q-gcp-gke",
    categories: ["Google Cloud"],
    topics: ["gke-gcp"],                  // tests: GKE only
    q: "GKE Autopilot differs from GKE Standard in that:",
    options: [
      "Autopilot only supports stateless workloads",
      "Google manages node provisioning, scaling, and security; you only define Pods",
      "Autopilot uses VMs instead of containers",
      "Autopilot does not support custom Docker images"
    ],
    correct: 1,
    explain: "GKE Autopilot is fully managed — you pay per Pod, not per node, and Google handles node lifecycle, OS patching, and autoscaling."
  },
  {
    id: "q-gcp-gcs",
    categories: ["Google Cloud"],
    topics: ["gcp-gcs"],                  // tests: GCS only
    q: "A GCS object is set to `Uniform bucket-level access`. What does this mean for ACLs?",
    options: [
      "Each object can have its own ACL in addition to bucket-level IAM",
      "Object-level ACLs are disabled; access is controlled only by bucket IAM policies",
      "All objects are public by default",
      "Access is controlled per project, not per bucket"
    ],
    correct: 1,
    explain: "Uniform bucket-level access disables object-level ACLs, enforcing IAM-only access control at the bucket level for simpler, auditable permissions."
  },

  // ── DISTRIBUTED SYSTEMS ──────────────────────────────────────
  {
    id: "q-dist-kafka",
    categories: ["Distributed Systems"],
    topics: ["kafka-streaming"],          // tests: Kafka only
    q: "Kafka retains messages after consumers read them. What key capability does this enable over traditional queues?",
    options: [
      "Higher throughput by skipping deletion",
      "Multiple independent consumer groups replaying the same events from any offset",
      "Automatic message deduplication",
      "Built-in schema validation"
    ],
    correct: 1,
    explain: "Kafka's log-based storage lets multiple consumer groups independently read and replay events — impossible with queue-delete-on-consume semantics."
  },
  {
    id: "q-dist-raft",
    categories: ["Distributed Systems"],
    topics: ["consensus-raft"],           // tests: Raft/consensus only
    q: "In the Raft consensus algorithm, a candidate becomes leader when it:",
    options: [
      "Has the highest node ID in the cluster",
      "Receives votes from a majority of cluster members",
      "Has committed the most log entries",
      "Is the first node to restart after a failure"
    ],
    correct: 1,
    explain: "Raft requires a quorum (majority) of votes before a candidate can become leader for a given term."
  },
  {
    id: "q-dist-leader",
    categories: ["Distributed Systems"],
    topics: ["leader-election"],          // tests: leader election only
    q: "ZooKeeper is commonly used for leader election. A node claims leadership by:",
    options: [
      "Broadcasting a claim to all nodes",
      "Atomically creating an ephemeral node — if it succeeds, it's leader; if it crashes, the node disappears",
      "Winning a random number lottery among nodes",
      "Holding the highest sequence number in the cluster"
    ],
    correct: 1,
    explain: "ZooKeeper ephemeral nodes vanish when the creator's session dies, providing automatic leader revocation without manual cleanup."
  },
  {
    id: "q-dist-saga",
    categories: ["Distributed Systems"],
    topics: ["distributed-tx-saga"],      // tests: Saga / 2PC only
    q: "A payment saga spans 3 microservices. Step 2 fails. In the choreography-based Saga pattern, what handles rollback?",
    options: [
      "A central coordinator sends rollback commands to all services",
      "Each prior service listens for a failure event and executes its own compensating transaction",
      "The database rolls back the entire distributed transaction atomically",
      "The API gateway retries step 2 until it succeeds"
    ],
    correct: 1,
    explain: "In choreography Sagas, services react to failure events by running compensating transactions locally — no central coordinator needed."
  },
  {
    id: "q-dist-vector",
    categories: ["Distributed Systems"],
    topics: ["vector-clocks"],            // tests: vector clocks only
    q: "Two nodes update the same key concurrently. Their vector clocks are [A:3, B:1] and [A:2, B:2]. These vectors are:",
    options: [
      "Ordered — [A:3, B:1] happened after [A:2, B:2]",
      "Ordered — [A:2, B:2] happened after [A:3, B:1]",
      "Concurrent — neither dominates the other, indicating a conflict",
      "Invalid — vector clocks cannot represent this state"
    ],
    correct: 2,
    explain: "Neither vector dominates: A:3 > A:2 but B:1 < B:2. Incomparable vectors indicate concurrent writes — a conflict must be resolved."
  },
  {
    id: "q-dist-quorum",
    categories: ["Distributed Systems"],
    topics: ["quorum-reads-writes"],      // tests: quorum only
    q: "In a system with N=5 replicas, R=3, W=3. Is strong consistency guaranteed?",
    options: [
      "No — R + W must equal N exactly",
      "Yes — R + W = 6 > N = 5, so read sets always overlap with the latest write",
      "Only if all 5 replicas acknowledge writes",
      "Only during leader elections"
    ],
    correct: 1,
    explain: "Quorum consistency holds when R + W > N. Here 3+3=6>5, ensuring at least one node in every read set has the latest write."
  },
  {
    id: "q-dist-lock",
    categories: ["Distributed Systems"],
    topics: ["distributed-locking"],      // tests: distributed locking only
    q: "A distributed lock is acquired via Redis SET NX PX 5000. The lock holder pauses for 8 seconds due to GC. What happens?",
    options: [
      "The lock is held safely — Redis extends it automatically",
      "The lock expires at 5s; another node may acquire it before the paused node resumes",
      "Redis kills the paused node's connection",
      "Nothing — the lock persists until explicitly released"
    ],
    correct: 1,
    explain: "Redis TTL expiry is not extended automatically. A GC pause longer than the TTL means the lock expires; a fencing token is needed to prevent stale writes."
  },
  {
    id: "q-dist-gossip",
    categories: ["Distributed Systems"],
    topics: ["gossip-protocol"],          // tests: gossip protocol only
    q: "Cassandra uses a gossip protocol for cluster membership. The key property of gossip is:",
    options: [
      "A central registry broadcasts state to all nodes simultaneously",
      "Each node periodically shares its state with a random subset; information spreads epidemically",
      "Nodes elect a leader who maintains authoritative membership state",
      "Each node directly contacts every other node every heartbeat"
    ],
    correct: 1,
    explain: "Gossip spreads information exponentially — each round of peer exchange doubles the number of informed nodes, with no central bottleneck."
  },
  {
    id: "q-dist-idem",
    categories: ["Distributed Systems"],
    topics: ["idempotency-keys"],         // tests: idempotency only
    q: "A payment API retries failed requests. How do you prevent a user being charged twice?",
    options: [
      "Use SERIALIZABLE database transactions",
      "Implement idempotency keys — store and deduplicate by request ID",
      "Retry with exponential backoff only once",
      "Use a Saga with compensating transactions"
    ],
    correct: 1,
    explain: "Idempotency keys let the server recognise duplicate requests and return the cached response without re-executing the charge."
  },

  // ── DATA & BATCH PROCESSING ──────────────────────────────────
  {
    id: "q-data-spark",
    categories: ["Data & Batch Processing"],
    topics: ["spark-batch"],              // tests: Spark/batch only
    q: "Apache Spark processes data faster than Hadoop MapReduce primarily because:",
    options: [
      "It uses more CPU cores per node",
      "It keeps intermediate results in memory (RDDs) instead of writing to disk between stages",
      "It uses a proprietary file format",
      "It avoids the JVM overhead"
    ],
    correct: 1,
    explain: "Spark's DAG engine chains operations and keeps data in memory across stages, avoiding the disk I/O between every Map and Reduce step that slows MapReduce."
  },
  {
    id: "q-data-stream",
    categories: ["Data & Batch Processing"],
    topics: ["stream-processing"],        // tests: stream processing only
    q: "A fraud detection system needs to flag transactions within 50ms. Which architecture is required?",
    options: [
      "Nightly batch job over the day's transactions",
      "Hourly micro-batch with Spark Streaming",
      "Real-time stream processor (e.g., Flink) consuming from Kafka",
      "Polling a database every minute"
    ],
    correct: 2,
    explain: "Flink processes each event as it arrives, achieving sub-millisecond to millisecond latency — not possible with batch or micro-batch."
  },
  {
    id: "q-data-lake",
    categories: ["Data & Batch Processing"],
    topics: ["warehouse-lake"],           // tests: warehouse vs lake only
    q: "A data lake stores raw clickstream JSON files in S3. A data warehouse stores structured, pre-aggregated tables. The key trade-off is:",
    options: [
      "Lakes are faster for ad-hoc SQL; warehouses are cheaper",
      "Lakes retain raw flexibility for future schemas; warehouses enable fast structured queries on pre-modelled data",
      "Warehouses store more data than lakes",
      "Lakes require ETL pipelines; warehouses accept raw data directly"
    ],
    correct: 1,
    explain: "Lakes preserve raw data for flexible future use; warehouses impose schemas upfront for fast, consistent analytics — different tools for different goals."
  },
  {
    id: "q-data-etl",
    categories: ["Data & Batch Processing"],
    topics: ["etl-elt"],                  // tests: ETL vs ELT only
    q: "Modern cloud warehouses (BigQuery, Snowflake) prefer ELT over ETL. Why?",
    options: [
      "ELT pipelines are simpler to write in Python",
      "Load raw data first — the warehouse's MPP engine transforms at query time, avoiding rigid pre-transform schemas",
      "ELT avoids the need for any data pipeline",
      "ETL cannot handle semi-structured data"
    ],
    correct: 1,
    explain: "ELT loads raw data into the warehouse and transforms with SQL at query time, allowing flexible schema evolution without re-ingesting upstream."
  },

  // ── RELIABILITY & OPS ────────────────────────────────────────
  {
    id: "q-rel-cb",
    categories: ["Reliability & Ops"],
    topics: ["circuit-breaker"],          // tests: circuit breaker only
    q: "Service A calls Service B. B starts responding slowly, filling A's thread pool. What pattern prevents A from also failing?",
    options: [
      "Retry with exponential backoff",
      "Circuit breaker — trip after N failures, fail fast until B recovers",
      "Add more threads to A's pool",
      "Increase B's request timeout to 60 seconds"
    ],
    correct: 1,
    explain: "An open circuit returns errors immediately instead of queueing threads, preventing cascading failure while B is degraded."
  },
  {
    id: "q-rel-back",
    categories: ["Reliability & Ops"],
    topics: ["backpressure"],             // tests: backpressure only
    q: "A producer sends 100k events/second but the consumer can only process 40k/second. Without backpressure, what happens?",
    options: [
      "The producer automatically slows to match the consumer",
      "The consumer buffers grow unboundedly until memory is exhausted or messages drop",
      "The queue automatically rejects excess messages cleanly",
      "The producer receives an error and stops"
    ],
    correct: 1,
    explain: "Without backpressure signalling, the consumer's buffer fills up, leading to OOM crashes or silent message loss."
  },
  {
    id: "q-rel-bloom",
    categories: ["Reliability & Ops"],
    topics: ["bloom-filters"],            // tests: bloom filters only
    q: "A Bloom filter says a key is 'possibly present'. What is guaranteed?",
    options: [
      "The key definitely exists in the set",
      "Nothing — Bloom filters have both false positives and false negatives",
      "The key may or may not exist (possible false positive), but if it says 'absent' the key definitely does not exist",
      "The key was inserted within the last 10 minutes"
    ],
    correct: 2,
    explain: "Bloom filters have no false negatives — 'absent' is always correct. 'Present' may be a false positive, requiring a real lookup to confirm."
  },
  {
    id: "q-rel-trace",
    categories: ["Reliability & Ops"],
    topics: ["distributed-tracing"],      // tests: distributed tracing only
    q: "A request touches 8 microservices and occasionally takes 3s. How do you identify which service introduces the latency?",
    options: [
      "Check each service's log files individually",
      "Add timestamps to HTTP headers manually",
      "Distributed tracing (Jaeger/Zipkin) — visualise the full span waterfall",
      "Profile the database with EXPLAIN ANALYZE"
    ],
    correct: 2,
    explain: "Distributed tracing propagates a trace context through all services, producing a waterfall showing exactly where time is spent."
  },
  {
    id: "q-rel-mesh",
    categories: ["Reliability & Ops"],
    topics: ["service-mesh"],             // tests: service mesh only
    q: "A service mesh sidecar proxy (Envoy) is injected into every Pod. What does it handle transparently without changing app code?",
    options: [
      "Persistent storage mounting and volume management",
      "mTLS between services, traffic routing, retries, and telemetry",
      "Container image pulls and layer caching",
      "Kubernetes API server authentication"
    ],
    correct: 1,
    explain: "Sidecar proxies handle mTLS encryption, circuit breaking, retries, load balancing, and metrics at the network layer — zero app code changes."
  },
  {
    id: "q-rel-canary",
    categories: ["Reliability & Ops"],
    topics: ["canary-bluegreen"],         // tests: canary/blue-green only
    q: "You deploy v2 to 5% of traffic while 95% stays on v1, monitoring error rates before rolling out fully. This is:",
    options: [
      "Blue-green deployment",
      "Rolling deployment",
      "Canary deployment",
      "Feature flagging"
    ],
    correct: 2,
    explain: "A canary deployment sends a small percentage of real traffic to the new version to validate it before full rollout."
  },

  // ── CONTAINERS & ORCHESTRATION ───────────────────────────────
  {
    id: "q-cont-docker",
    categories: ["Containers & Orchestration"],
    topics: ["docker-containers"],        // tests: Docker/containers only
    q: "Docker containers share the host OS kernel. This makes them different from VMs in that:",
    options: [
      "Containers cannot run on Linux hosts",
      "Containers start in milliseconds and use far less memory than full VMs",
      "Containers provide stronger security isolation than VMs",
      "Containers require a hypervisor to run"
    ],
    correct: 1,
    explain: "Containers are isolated processes on the host kernel — no guest OS overhead. They start in milliseconds vs seconds for VMs."
  },
  {
    id: "q-cont-k8s",
    categories: ["Containers & Orchestration"],
    topics: ["kubernetes-core"],          // tests: Kubernetes only
    q: "A Kubernetes Pod has status CrashLoopBackOff. What is the most likely cause?",
    options: [
      "The Docker image is too large to pull",
      "The container process exits with a non-zero code on startup (misconfiguration, missing env var)",
      "The Node has insufficient CPU to schedule the Pod",
      "The Service selector doesn't match any Pods"
    ],
    correct: 1,
    explain: "CrashLoopBackOff means the container keeps crashing. Kubernetes backs off retries exponentially. Check `kubectl logs` for the startup error."
  }
];

// ============================================================
// QUIZ SELECTION
// Pick a modular subset based on chosen pathways.
// ~3 questions per pathway, max 15 total, no duplicates.
// Questions are selected per-pathway so coverage is even.
// ============================================================
function selectQuizQuestions(chosenPathways) {
  const PER_PATHWAY = 3;
  const MAX_TOTAL   = 15;

  // Group questions by category
  const byCategory = {};
  QUIZ_BANK.forEach(q => {
    q.categories.forEach(cat => {
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(q);
    });
  });

  const selected = [];
  const seenIds  = new Set();

  chosenPathways.forEach(pathway => {
    const pool    = (byCategory[pathway] || []).filter(q => !seenIds.has(q.id));
    const shuffled = pool.slice().sort(() => Math.random() - 0.5);
    const picks   = shuffled.slice(0, PER_PATHWAY);
    picks.forEach(q => {
      if (selected.length < MAX_TOTAL) {
        selected.push(q);
        seenIds.add(q.id);
      }
    });
  });

  // Shuffle final order so pathways don't cluster
  return selected.sort(() => Math.random() - 0.5);
}

// ============================================================
// SCORING
// Each question ONLY updates familiarity for the specific
// topic IDs listed in q.topics — no bleed-over to other topics.
// Topics not covered by any quiz question get QUIZ_DEFAULT_FAMILIARITY.
// ============================================================
function scoreQuiz(questions, answers) {
  // Track per-topic performance across all questions that tested it
  const topicScores = {}; // topicId → { correct: n, total: n }

  questions.forEach(q => {
    const userAnswer = answers[q.id];
    if (userAnswer === undefined) return; // unanswered question — skip
    const isCorrect = (userAnswer === q.correct);

    q.topics.forEach(topicId => {
      if (!topicScores[topicId]) topicScores[topicId] = { correct: 0, total: 0 };
      topicScores[topicId].total   += 1;
      if (isCorrect) topicScores[topicId].correct += 1;
    });
  });

  // Map scores → familiarity for every topic
  const familiarity = {};
  TOPICS.forEach(t => {
    const score = topicScores[t.id];
    if (!score) {
      // Not tested — neutral default
      familiarity[t.id] = QUIZ_DEFAULT_FAMILIARITY;
    } else {
      const ratio = score.correct / score.total;
      // Linear interpolation: 0% correct → WRONG value, 100% correct → CORRECT value
      familiarity[t.id] = Math.round(
        QUIZ_WRONG_FAMILIARITY + ratio * (QUIZ_CORRECT_FAMILIARITY - QUIZ_WRONG_FAMILIARITY)
      );
    }
  });

  return familiarity;
}
