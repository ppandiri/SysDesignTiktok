// ============================================================
// CONTENT DATABASE
// Original explanations of standard, widely-taught system design
// concepts, written from scratch for this app.
// ============================================================

const PATHWAYS = [
  "Fundamentals",
  "AWS",
  "Google Cloud",
  "Distributed Systems",
  "Data & Batch Processing",
  "Reliability & Ops",
  "Containers & Orchestration"
];

const TOPICS = [
  // --- Fundamentals ---
  { id: "client-server", category: "Fundamentals", tag: "NET", name: "Client-Server Model", blurb: "Who asks, who answers" },
  { id: "dns", category: "Fundamentals", tag: "DNS", name: "DNS Resolution", blurb: "Turning names into addresses" },
  { id: "load-balancing", category: "Fundamentals", tag: "LB", name: "Load Balancing", blurb: "Spreading traffic around" },
  { id: "caching", category: "Fundamentals", tag: "CACHE", name: "Caching", blurb: "Remembering to avoid repeat work" },
  { id: "cdn", category: "Fundamentals", tag: "CDN", name: "Content Delivery Networks", blurb: "Serving content from nearby" },
  { id: "db-indexing", category: "Fundamentals", tag: "IDX", name: "Database Indexing", blurb: "Fast row lookups without full scans" },
  { id: "sql-nosql", category: "Fundamentals", tag: "SQL", name: "SQL vs NoSQL", blurb: "Choosing the right data model" },
  { id: "replication", category: "Fundamentals", tag: "REPL", name: "Database Replication", blurb: "Copies for speed and safety" },
  { id: "sharding", category: "Fundamentals", tag: "SHRD", name: "Sharding & Partitioning", blurb: "Splitting data across machines" },
  { id: "cap-theorem", category: "Fundamentals", tag: "CAP", name: "CAP Theorem", blurb: "Pick two, under a partition" },
  { id: "consistent-hashing", category: "Fundamentals", tag: "HASH", name: "Consistent Hashing", blurb: "Rebalancing without reshuffling" },
  { id: "message-queues", category: "Fundamentals", tag: "MQ", name: "Message Queues", blurb: "Decoupling work in time" },
  { id: "rate-limiting", category: "Fundamentals", tag: "RATE", name: "Rate Limiting", blurb: "Protecting systems from overload" },
  { id: "microservices", category: "Fundamentals", tag: "SVC", name: "Microservices vs Monolith", blurb: "One deployable or many" },
  { id: "api-gateway", category: "Fundamentals", tag: "GW", name: "API Gateway", blurb: "One door, many services" },
  { id: "scaling", category: "Fundamentals", tag: "SCALE", name: "Horizontal vs Vertical Scaling", blurb: "Bigger machine or more machines" },

  // --- AWS ---
  { id: "s3", category: "AWS", tag: "S3", name: "Amazon S3 & Object Storage", blurb: "Unlimited key-value blob storage" },
  { id: "ec2-autoscaling", category: "AWS", tag: "EC2", name: "EC2 & Auto Scaling Groups", blurb: "Elastic compute nodes on demand" },
  { id: "dynamodb", category: "AWS", tag: "DDB", name: "Amazon DynamoDB", blurb: "Managed NoSQL with single-digit ms latency" },
  { id: "sqs-sns", category: "AWS", tag: "SQS", name: "SQS & SNS Patterns", blurb: "Queuing and pub/sub fanout in AWS" },
  { id: "aws-lambda", category: "AWS", tag: "LAMB", name: "AWS Lambda & Serverless", blurb: "Event-driven code without servers" },
  { id: "route53", category: "AWS", tag: "R53", name: "Route 53 Traffic Routing", blurb: "DNS routing, latency checks & failover" },
  { id: "rds-aurora", category: "AWS", tag: "AUR", name: "RDS & Aurora Scaling", blurb: "Relational DBs with auto-scaling storage" },
  { id: "elb-alb", category: "AWS", tag: "ALB", name: "AWS Elastic Load Balancing", blurb: "Layer 7 ALB and Layer 4 NLB" },

  // --- Google Cloud ---
  { id: "bigquery", category: "Google Cloud", tag: "BQ", name: "BigQuery Analytics", blurb: "Serverless columnar data warehouse" },
  { id: "gcp-pubsub", category: "Google Cloud", tag: "PUB", name: "Cloud Pub/Sub Streaming", blurb: "Global real-time messaging pipeline" },
  { id: "cloud-spanner", category: "Google Cloud", tag: "SPAN", name: "Cloud Spanner", blurb: "Globally distributed RDBMS with TrueTime" },
  { id: "gke-gcp", category: "Google Cloud", tag: "GKE", name: "Google Kubernetes Engine", blurb: "Managed K8s clusters in GCP" },
  { id: "gcp-gcs", category: "Google Cloud", tag: "GCS", name: "Google Cloud Storage", blurb: "Blob storage for analytics & backups" },

  // --- Distributed Systems ---
  { id: "kafka-streaming", category: "Distributed Systems", tag: "KFK", name: "Kafka Event Streaming", blurb: "Partitioned append-only commit logs" },
  { id: "consensus-raft", category: "Distributed Systems", tag: "RAFT", name: "Raft & Paxos Consensus", blurb: "Agreeing on state across unreliable nodes" },
  { id: "leader-election", category: "Distributed Systems", tag: "LEAD", name: "Leader Election", blurb: "Designating a master node safely" },
  { id: "distributed-tx-saga", category: "Distributed Systems", tag: "SAGA", name: "Saga Pattern & 2PC", blurb: "Consistency across microservices without locks" },
  { id: "vector-clocks", category: "Distributed Systems", tag: "CLK", name: "Vector & Logical Clocks", blurb: "Ordering events in distributed systems" },
  { id: "quorum-reads-writes", category: "Distributed Systems", tag: "QRM", name: "Quorum Reads & Writes", blurb: "R + W > N consistency guarantees" },
  { id: "distributed-locking", category: "Distributed Systems", tag: "LOCK", name: "Distributed Locking", blurb: "Mutual exclusion across multiple nodes" },
  { id: "gossip-protocol", category: "Distributed Systems", tag: "GOSP", name: "Gossip Protocols", blurb: "Decentralized cluster membership & health" },
  { id: "idempotency-keys", category: "Distributed Systems", tag: "IDEM", name: "Idempotency Keys", blurb: "Preventing double-processing of API calls" },

  // --- Data & Batch Processing ---
  { id: "spark-batch", category: "Data & Batch Processing", tag: "SPK", name: "Apache Spark", blurb: "Distributed dataframes and batch processing" },
  { id: "stream-processing", category: "Data & Batch Processing", tag: "STRM", name: "Stream Processing", blurb: "Real-time windowing & event-driven ETL" },
  { id: "warehouse-lake", category: "Data & Batch Processing", tag: "LAKE", name: "Data Warehouses vs Lakes", blurb: "Structured analytics vs raw data storage" },
  { id: "etl-elt", category: "Data & Batch Processing", tag: "ETL", name: "ETL vs ELT Ingestion", blurb: "Transforming before or after loading" },

  // --- Reliability & Ops ---
  { id: "circuit-breaker", category: "Reliability & Ops", tag: "CB", name: "Circuit Breaker Pattern", blurb: "Failing fast to prevent cascading outages" },
  { id: "backpressure", category: "Reliability & Ops", tag: "BACK", name: "Backpressure Control", blurb: "Slowing producers when consumers lag" },
  { id: "bloom-filters", category: "Reliability & Ops", tag: "BLM", name: "Bloom Filters", blurb: "Fast, memory-efficient set membership tests" },
  { id: "distributed-tracing", category: "Reliability & Ops", tag: "TRC", name: "Distributed Tracing", blurb: "Tracking requests through microservices" },
  { id: "service-mesh", category: "Reliability & Ops", tag: "MESH", name: "Service Mesh & Envoy", blurb: "Sidecar proxies for mTLS & telemetry" },
  { id: "canary-bluegreen", category: "Reliability & Ops", tag: "CAN", name: "Canary & Blue-Green", blurb: "Zero-downtime deployment strategies" },

  // --- Containers & Orchestration ---
  { id: "docker-containers", category: "Containers & Orchestration", tag: "DOC", name: "Containers & Docker", blurb: "Lightweight process isolation and images" },
  { id: "kubernetes-core", category: "Containers & Orchestration", tag: "K8S", name: "Kubernetes Core", blurb: "Pods, Deployments, Services & Ingress" }
];

// Card type field shapes:
// concept:   { type:'concept', topicId, title, body:[strings...] }
// flashcard: { type:'flashcard', topicId, front, back }
// mc:        { type:'mc', topicId, question, options:[...], correctIndex, explanation }
// tf:        { type:'tf', topicId, statement, answer:bool, explanation }
const CARDS = [
// ---------------- CLIENT-SERVER ----------------
  { type: "concept", topicId: "client-server", title: "The client-server model",
    body: [
      "A client is anything that initiates a request — a browser tab, a mobile app, another backend service. A server listens for those requests and sends back a response.",
      "The relationship is asymmetric: clients know how to talk to a server, but a server doesn't usually know or care which specific client is calling, only how to handle the request in front of it."
    ]},
  { type: "flashcard", topicId: "client-server",
    front: "What's the core asymmetry between a client and a server?",
    back: "The client initiates and knows what it wants; the server listens, stays available, and responds — without needing to know who's asking." },
  { type: "mc", topicId: "client-server",
    question: "In a typical request-response cycle, which statement is true?",
    options: [
      "The server always opens the connection to the client first",
      "The client sends a request and the server returns a response over that same connection",
      "Clients and servers must run on the same machine",
      "A server can only handle one client at a time"
    ],
    correctIndex: 1,
    explanation: "The client opens the connection and sends the request; the server replies on that connection. Modern servers handle many clients concurrently." },
  { type: "tf", topicId: "client-server",
    statement: "A single machine can act as a server for one application and a client for another.",
    answer: true,
    explanation: "Role is about the interaction, not the hardware. A web server might itself be a client when it calls a database or a third-party API." },

  // ---------------- DNS ----------------
  { type: "concept", topicId: "dns", title: "What DNS actually does",
    diagram: "dns-resolution-chain",
    body: [
      "DNS is the system that maps human-readable names like example.com to the IP addresses machines use to route traffic.",
      "A lookup walks a chain: resolver checks cache, asks root, TLD, then authoritative server, caching at each hop."
    ]},
  { type: "flashcard", topicId: "dns",
    diagram: "dns-resolution-chain",
    front: "Why does DNS rely so heavily on caching at every layer?",
    back: "Domain-to-IP mappings rarely change, so caching avoids repeating the same multi-hop lookup for every request, which would add latency and load to the root and TLD servers." },
  { type: "mc", topicId: "dns",
    question: "What does a DNS 'TTL' (time to live) control?",
    options: [
      "How long a server takes to respond",
      "How long a resolver is allowed to cache a DNS record before checking again",
      "The maximum number of hops a packet can take",
      "How long a domain registration is valid for"
    ],
    correctIndex: 1,
    explanation: "TTL tells resolvers and clients how long they may reuse a cached answer before re-querying. Lower TTLs mean faster propagation of changes but more lookup traffic." },
  { type: "tf", topicId: "dns",
    statement: "DNS resolution has to happen fresh for every single HTTP request.",
    answer: false,
    explanation: "Thanks to caching at the OS, browser, and resolver level, most requests reuse a previously resolved address until its TTL expires." },

  // ---------------- LOAD BALANCING ----------------
  { type: "concept", topicId: "load-balancing", title: "Why put something in front of your servers",
    diagram: "load-balancer-topology",
    body: [
      "A load balancer sits between clients and servers, distributing incoming requests so no single machine gets overwhelmed.",
      "It provides a single stable entry point and detects/routes around unresponsive servers via health checks."
    ]},
  { type: "flashcard", topicId: "load-balancing",
    diagram: "load-balancer-topology",
    front: "Round robin vs. least connections — what's the difference in strategy?",
    back: "Round robin cycles through servers in fixed order regardless of load. Least connections sends the next request to whichever server currently has the fewest active connections, adapting to uneven request costs." },
  { type: "mc", topicId: "load-balancing",
    question: "A health check on a load balancer is primarily used to:",
    options: [
      "Encrypt traffic between client and server",
      "Detect and stop routing traffic to servers that are unresponsive or unhealthy",
      "Compress responses before sending them to the client",
      "Cache static assets closer to the client"
    ],
    correctIndex: 1,
    explanation: "Health checks periodically probe backend servers; if one fails to respond correctly, the load balancer stops sending it traffic until it recovers." },
  { type: "tf", topicId: "load-balancing",
    statement: "Sticky sessions route a given client to the same backend server across requests.",
    answer: true,
    explanation: "Sticky sessions (often via a cookie) pin a client to one server, which simplifies in-memory session state at the cost of even load distribution." },
  { type: "mc", topicId: "load-balancing",
    question: "Which layer does a 'Layer 7' load balancer operate at?",
    options: [ "Physical", "Transport (TCP)", "Application (HTTP)", "Data link" ],
    correctIndex: 2,
    explanation: "Layer 7 balancers read application-level data like HTTP headers and URL paths, letting them route based on content, not just IP and port." },

  // ---------------- CACHING ----------------
  { type: "concept", topicId: "caching", title: "The idea behind caching",
    diagram: "cache-aside-flow",
    body: [
      "A cache stores results of expensive work so future requests can reuse them instead of redoing work.",
      "In cache-aside, the app checks cache first; on a miss, it reads from the database and updates the cache."
    ]},
  { type: "flashcard", topicId: "caching",
    diagram: "cache-aside-flow",
    front: "What's a 'cache-aside' (lazy loading) pattern?",
    back: "The app checks the cache first; on a miss, it reads from the database, returns the result, and writes it into the cache for next time. Simple, and only caches data that's actually requested." },
  { type: "flashcard", topicId: "caching",
    front: "Name the two hardest problems in caching (classic joke, but true).",
    back: "Cache invalidation and naming things. Invalidation is hard because you must know exactly when cached data becomes stale and act on every code path that can change it." },
  { type: "mc", topicId: "caching",
    question: "Which eviction policy discards the item that hasn't been used for the longest time?",
    options: [ "FIFO", "LRU (Least Recently Used)", "Random", "LFU (Least Frequently Used)" ],
    correctIndex: 1,
    explanation: "LRU tracks recency of access and evicts the item that has gone the longest without being touched, which tends to match real-world access patterns well." },
  { type: "tf", topicId: "caching",
    statement: "A write-through cache writes to the cache and the database at the same time, keeping them in sync.",
    answer: true,
    explanation: "Write-through keeps cache and source of truth consistent on every write, trading some write latency for simpler, safer reads." },

  // ---------------- CDN ----------------
  { type: "concept", topicId: "cdn", title: "Why a CDN exists",
    diagram: "cdn-edge-network",
    body: [
      "A CDN uses geographically distributed edge servers to cache and serve content close to users.",
      "This cuts physical latency, relieves origin server load, and routes around regional outages."
    ]},
  { type: "flashcard", topicId: "cdn",
    diagram: "cdn-edge-network",
    front: "What kind of content is a CDN best suited for, and why?",
    back: "Static or rarely-changing content — images, videos, JS/CSS bundles — because it can be cached at the edge for a long time without going stale, unlike highly personalized or constantly changing data." },
  { type: "mc", topicId: "cdn",
    question: "What happens on a CDN 'cache miss' at the edge?",
    options: [
      "The request fails and returns an error",
      "The edge server fetches the content from the origin, serves it, and typically caches it for future requests",
      "The user is redirected to a different website",
      "The content is deleted from the origin"
    ],
    correctIndex: 1,
    explanation: "A miss just means this edge node doesn't have the content yet — it pulls from the origin once, then caches so nearby users benefit next time." },
  { type: "tf", topicId: "cdn",
    statement: "CDNs can only serve pre-built static files, never help with dynamic content.",
    answer: false,
    explanation: "Modern CDNs can also do things like edge computing, request routing, and caching of semi-dynamic responses, though highly personalized data still typically goes to origin." },

  // ---------------- DB INDEXING ----------------
  { type: "concept", topicId: "db-indexing", title: "Why indexes make queries fast",
    body: [
      "Without an index, a database has to scan every row to find matches for a query — a full table scan. An index is a separate, ordered data structure (commonly a B-tree) that lets the database jump straight to matching rows.",
      "The tradeoff: indexes speed up reads but cost extra storage and slow down writes slightly, since every insert or update has to keep the index current too."
    ]},
  { type: "flashcard", topicId: "db-indexing",
    front: "Why can indexing too many columns hurt performance?",
    back: "Every additional index adds overhead to every write (insert, update, delete) because the database must maintain that index too, so over-indexing trades write speed for read speed you may not need." },
  { type: "mc", topicId: "db-indexing",
    question: "A composite index on (last_name, first_name) is generally most useful for:",
    options: [
      "Queries that filter only on first_name",
      "Queries that filter on last_name, or on last_name and first_name together",
      "Sorting on any column in the table",
      "Reducing the size of the table on disk"
    ],
    correctIndex: 1,
    explanation: "Composite indexes are effective following their leftmost column(s); a search on last_name alone or the full pair can use it, but first_name alone typically cannot." },
  { type: "tf", topicId: "db-indexing",
    statement: "Adding an index always makes both reads and writes faster.",
    answer: false,
    explanation: "Indexes accelerate lookups but add overhead on every write, since the index structure has to be updated too." },

  // ---------------- SQL vs NOSQL ----------------
  { type: "concept", topicId: "sql-nosql", title: "Relational vs. non-relational, at a glance",
    body: [
      "SQL databases store data in structured tables with a fixed schema and strong support for relationships and multi-row transactions (ACID guarantees).",
      "NoSQL is an umbrella for several different models — key-value, document, column-family, graph — that generally trade strict schema and cross-row transactions for flexibility and easier horizontal scaling."
    ]},
  { type: "flashcard", topicId: "sql-nosql",
    front: "When would a document store (like MongoDB) be a better fit than a relational DB?",
    back: "When your data is naturally nested and varies in shape between records — e.g. user profiles with optional fields — and you don't need complex multi-table joins or strict cross-record transactions." },
  { type: "mc", topicId: "sql-nosql",
    question: "ACID transactions guarantee all of the following EXCEPT:",
    options: [ "Atomicity", "Consistency", "Isolation", "Availability" ],
    correctIndex: 3,
    explanation: "ACID stands for Atomicity, Consistency, Isolation, Durability. Availability is a separate concern, notably from the CAP theorem." },
  { type: "tf", topicId: "sql-nosql",
    statement: "NoSQL databases can never provide strong consistency.",
    answer: false,
    explanation: "Many NoSQL systems support tunable or strong consistency for specific operations; the umbrella term doesn't mandate eventual consistency everywhere." },

  // ---------------- REPLICATION ----------------
  { type: "concept", topicId: "replication", title: "Copying data on purpose",
    diagram: "primary-replica-replication",
    body: [
      "Replication maintains copies of data across machines: one primary handles writes while replicas handle read traffic.",
      "This increases read capacity and reliability, though you must account for replication lag."
    ]},
  { type: "flashcard", topicId: "replication",
    diagram: "primary-replica-replication",
    front: "What is 'replication lag'?",
    back: "The delay between a write landing on the primary and that same write appearing on a replica. During this window, a read from the replica can return stale data." },
  { type: "mc", topicId: "replication",
    question: "In synchronous replication, a write is considered complete when:",
    options: [
      "It's written to the primary only",
      "It's written to the primary and acknowledged by at least one replica",
      "It's written to any available server",
      "The client's connection closes"
    ],
    correctIndex: 1,
    explanation: "Synchronous replication waits for replica acknowledgment before confirming the write, trading extra latency for a stronger durability guarantee." },
  { type: "tf", topicId: "replication",
    statement: "Asynchronous replication guarantees replicas are always fully up to date.",
    answer: false,
    explanation: "Asynchronous replication confirms the write immediately on the primary and copies it to replicas afterward, so replicas can briefly lag behind." },

  // ---------------- SHARDING ----------------
  { type: "concept", topicId: "sharding", title: "Splitting data across machines",
    diagram: "db-sharding-split",
    body: [
      "Sharding partitions a large dataset across multiple DB nodes based on a shard key so no single machine holds all data.",
      "Choosing a good shard key avoids hot shards that get disproportionate traffic."
    ]},
  { type: "flashcard", topicId: "sharding",
    diagram: "db-sharding-split",
    front: "What is a 'hot shard' and why is it a problem?",
    back: "A shard that receives disproportionately more traffic or data than the others, usually from a poor shard key choice, which defeats the purpose of spreading load evenly." },
  { type: "mc", topicId: "sharding",
    question: "Sharding a users table by user_id range (e.g. 1-1M, 1M-2M) can create problems mainly when:",
    options: [
      "User IDs are randomly distributed",
      "New users are created with sequentially increasing IDs, concentrating new signups on one shard",
      "The table has too many columns",
      "The database doesn't support indexes"
    ],
    correctIndex: 1,
    explanation: "Range sharding on a monotonically increasing key tends to funnel all new writes to the most recent shard, making it a hotspot." },
  { type: "tf", topicId: "sharding",
    statement: "Cross-shard joins and transactions are generally more complex than in a single, unsharded database.",
    answer: true,
    explanation: "Once data is spread across shards, operations that touch multiple shards need extra coordination that a single database handles natively." },

  // ---------------- CAP THEOREM ----------------
  { type: "concept", topicId: "cap-theorem", title: "Consistency, Availability, Partition tolerance",
    diagram: "cap-theorem-triangle",
    body: [
      "During a network partition, a distributed system must choose between Consistency (latest data) and Availability (always respond).",
      "Because network partitions are inevitable in distributed systems, real systems trade off CP vs AP."
    ]},
  { type: "flashcard", topicId: "cap-theorem",
    diagram: "cap-theorem-triangle",
    front: "During a network partition, what does an AP system prioritize?",
    back: "Availability — it keeps responding to requests on both sides of the partition, potentially returning stale or conflicting data that gets reconciled later." },
  { type: "mc", topicId: "cap-theorem",
    question: "Why is 'pick any two of C, A, P' a somewhat misleading way to state CAP?",
    options: [
      "Because partitions never actually happen in real networks",
      "Because you can only meaningfully trade off C vs A once a partition occurs — P isn't really optional",
      "Because CAP only applies to single-node systems",
      "Because consistency and availability are the same thing"
    ],
    correctIndex: 1,
    explanation: "In any real distributed system, partitions will eventually happen, so the practical choice is what to sacrifice (C or A) when one occurs, not whether to support P at all." },
  { type: "tf", topicId: "cap-theorem",
    statement: "A CP system will refuse to serve some requests during a partition in order to avoid returning stale data.",
    answer: true,
    explanation: "CP systems favor consistency, so on a partition they may reject or block requests on the minority side rather than risk an inconsistent read." },

  // ---------------- CONSISTENT HASHING ----------------
  { type: "concept", topicId: "consistent-hashing", title: "Why not just use hash % N?",
    diagram: "consistent-hashing-ring",
    body: [
      "Modulo hashing reshuffles almost all keys when nodes change. Consistent hashing maps keys and nodes onto a circular ring.",
      "Each key belongs to the next clockwise node, so adding or removing nodes only affects neighboring keys."
    ]},
  { type: "flashcard", topicId: "consistent-hashing",
    diagram: "consistent-hashing-ring",
    front: "What problem do 'virtual nodes' solve in consistent hashing?",
    back: "With few real nodes on the ring, load can be distributed unevenly. Virtual nodes give each physical server multiple positions on the ring, smoothing out the distribution of keys across servers." },
  { type: "mc", topicId: "consistent-hashing",
    question: "The main benefit of consistent hashing over plain modulo hashing is:",
    options: [
      "It's faster to compute",
      "It minimizes how many keys need to move when servers are added or removed",
      "It removes the need for hashing entirely",
      "It guarantees perfectly equal load with zero configuration"
    ],
    correctIndex: 1,
    explanation: "The whole point of consistent hashing is to localize the impact of scaling events — only keys near the changed node need to move." },
  { type: "tf", topicId: "consistent-hashing",
    statement: "Consistent hashing is mainly useful for systems where the number of servers rarely or never changes.",
    answer: false,
    explanation: "It's the opposite — consistent hashing shines specifically when servers are added or removed dynamically, which is common in caches and distributed stores." },

  // ---------------- MESSAGE QUEUES ----------------
  { type: "concept", topicId: "message-queues", title: "Decoupling producers from consumers",
    diagram: "message-queue-decoupling",
    body: [
      "A message queue lets producers hand off tasks as messages without waiting for consumers to finish processing.",
      "This buffers traffic bursts so workers can process jobs asynchronously at their own rate."
    ]},
  { type: "flashcard", topicId: "message-queues",
    diagram: "message-queue-decoupling",
    front: "What's the practical difference between 'at-least-once' and 'exactly-once' delivery?",
    back: "At-least-once may redeliver a message after a failure, so consumers must handle duplicates (idempotency). Exactly-once guarantees no duplicates but is harder and costlier to implement correctly." },
  { type: "mc", topicId: "message-queues",
    question: "A key reason to add a message queue between a web app and a slow downstream task (like video encoding) is to:",
    options: [
      "Make the downstream task run faster automatically",
      "Let the web app respond to the user quickly while the slow work happens asynchronously",
      "Remove the need for a database",
      "Guarantee the task never fails"
    ],
    correctIndex: 1,
    explanation: "Queuing the slow work lets the user-facing request return immediately, improving perceived performance, while a worker processes the task in the background." },
  { type: "tf", topicId: "message-queues",
    statement: "Message queues guarantee messages are always processed in the exact order they were sent.",
    answer: false,
    explanation: "Strict ordering depends on the specific system and configuration (e.g. single partition/consumer); many setups trade strict ordering for higher throughput via parallel consumers." },

  // ---------------- RATE LIMITING ----------------
  { type: "concept", topicId: "rate-limiting", title: "Capping how much is too much",
    body: [
      "Rate limiting restricts how many requests a client can make in a given time window, protecting a service from being overwhelmed — whether by a bug, a traffic spike, or abuse.",
      "Common algorithms include token bucket (a refillable allowance of requests) and sliding window (counting requests in a rolling time frame), each trading off burst tolerance against implementation complexity."
    ]},
  { type: "flashcard", topicId: "rate-limiting",
    front: "How does the token bucket algorithm work, in one line?",
    back: "Tokens refill into a bucket at a fixed rate; each request consumes one token, and requests are rejected or delayed once the bucket is empty — allowing short bursts up to the bucket size." },
  { type: "mc", topicId: "rate-limiting",
    question: "A fixed window rate limiter (e.g. 100 requests per minute, reset on the minute) has what known weakness?",
    options: [
      "It cannot be implemented in a distributed system",
      "It allows up to double the intended rate right at the boundary between two windows",
      "It never allows any bursts at all",
      "It requires no shared state"
    ],
    correctIndex: 1,
    explanation: "A client can send a full window's worth of requests right before the boundary and another full window's worth right after, briefly doubling the intended rate." },
  { type: "tf", topicId: "rate-limiting",
    statement: "Rate limiting is only useful for stopping malicious traffic, not legitimate usage spikes.",
    answer: false,
    explanation: "Rate limiting also protects backend systems from well-intentioned but unexpected spikes — retries, batch jobs, or a sudden surge of real users." },

  // ---------------- MICROSERVICES ----------------
  { type: "concept", topicId: "microservices", title: "One big app, or many small ones?",
    body: [
      "A monolith ships one deployable unit containing all functionality; a microservices architecture splits functionality into independently deployable services that communicate over the network.",
      "Microservices offer independent scaling, deployment, and technology choices per service, at the cost of operational complexity — network calls, distributed debugging, and data consistency across service boundaries."
    ]},
  { type: "flashcard", topicId: "microservices",
    front: "What's a common reason teams regret going to microservices too early?",
    back: "The operational overhead — service discovery, distributed tracing, network failures, data consistency — can outweigh the benefits when the team or product isn't yet at a scale that needs independent scaling." },
  { type: "mc", topicId: "microservices",
    question: "A key operational challenge that microservices introduce, compared to a monolith, is:",
    options: [
      "Slower local development for a single small feature",
      "Debugging a request that spans multiple services over the network",
      "Inability to use more than one programming language",
      "Needing exactly one database for the whole system"
    ],
    correctIndex: 1,
    explanation: "Tracing a single user request across several independently deployed services is much harder than debugging function calls within one process." },
  { type: "tf", topicId: "microservices",
    statement: "Microservices require each service to use the same programming language and database.",
    answer: false,
    explanation: "One of the selling points of microservices is that each service can pick the language and datastore that fits it best, independent of the others." },

  // ---------------- API GATEWAY ----------------
  { type: "concept", topicId: "api-gateway", title: "One front door for many services",
    diagram: "api-gateway-fanout",
    body: [
      "An API gateway acts as a single entry point that routes incoming requests to backend microservices.",
      "It centralizes cross-cutting concerns like authentication, rate limiting, and request transformation."
    ]},
  { type: "flashcard", topicId: "api-gateway",
    diagram: "api-gateway-fanout",
    front: "Name two cross-cutting concerns an API gateway commonly centralizes?",
    back: "Authentication/authorization and rate limiting are classic examples — also logging, request routing, and response transformation." },
  { type: "mc", topicId: "api-gateway",
    question: "Without an API gateway, a mobile client calling five microservices directly would most likely have to:",
    options: [
      "Make a single simple request",
      "Know the address and auth details of each of the five services and stitch together their responses itself",
      "Automatically get load balancing for free",
      "Avoid needing any authentication"
    ],
    correctIndex: 1,
    explanation: "Without a gateway, the client bears the complexity of talking to multiple services directly, which a gateway (or a backend-for-frontend) can hide behind one API." },
  { type: "tf", topicId: "api-gateway",
    statement: "An API gateway can become a single point of failure if it isn't itself made highly available.",
    answer: true,
    explanation: "Since all traffic flows through it, the gateway needs redundancy and good failover — otherwise it turns into a bottleneck and a single point of failure." },

  // ---------------- SCALING ----------------
  { type: "concept", topicId: "scaling", title: "Bigger box vs. more boxes",
    body: [
      "Vertical scaling means adding more resources (CPU, RAM) to a single machine. Horizontal scaling means adding more machines and distributing work across them.",
      "Vertical scaling is simpler — no distributed coordination needed — but has a hard ceiling and a single point of failure. Horizontal scaling can grow much further but introduces the challenges of distributed systems: coordination, consistency, and load balancing."
    ]},
  { type: "flashcard", topicId: "scaling",
    front: "What's a hard limit that vertical scaling eventually runs into?",
    back: "Physical hardware ceilings — there's a maximum CPU, memory, and I/O capacity a single machine can have, no matter how much money you spend." },
  { type: "mc", topicId: "scaling",
    question: "Which statement about horizontal scaling is accurate?",
    options: [
      "It requires no changes to application architecture",
      "It typically requires the workload to be distributable across machines, often needing load balancing and careful state management",
      "It always outperforms vertical scaling for every workload",
      "It eliminates the need for a database entirely"
    ],
    correctIndex: 1,
    explanation: "Horizontal scaling only helps if work can actually be spread across machines — which usually means designing for statelessness, load balancing, and coordinated data access." },
  { type: "tf", topicId: "scaling",
    statement: "Stateless application servers are generally easier to scale horizontally than stateful ones.",
    answer: true,
    explanation: "If any server can handle any request without relying on local in-memory state, a load balancer can freely distribute traffic and you can add or remove servers with ease." },,

  // ---------------- AWS: S3 ----------------
  { type: "concept", topicId: "s3", title: "Amazon S3 & Object Storage",
    body: [
      "Amazon S3 stores data as immutable objects inside flat buckets identified by unique keys.",
      "It offers virtually unlimited capacity and high durability by replicating objects across multiple Availability Zones."
    ]},
  { type: "flashcard", topicId: "s3",
    front: "What makes Object Storage (S3) distinct from Block Storage (EBS)?",
    back: "Object storage uses flat key-value access with rich metadata for immutable blobs, whereas block storage acts like a raw hard drive mounted to a single server for random byte writes." },
  { type: "mc", topicId: "s3",
    question: "Which feature automatically transitions older S3 objects to lower-cost storage tiers like Glacier?",
    options: [ "S3 Cross-Region Replication", "S3 Lifecycle Policies", "S3 Versioning", "S3 Select" ],
    correctIndex: 1,
    explanation: "S3 Lifecycle rules automate transitioning objects between storage classes (e.g. Standard -> Infrequent Access -> Glacier) based on age." },
  { type: "tf", topicId: "s3",
    statement: "Modifying a 50MB file in S3 allows editing specific bytes in-place without re-uploading.",
    answer: false,
    explanation: "S3 objects are immutable. Any update requires writing a complete replacement object." },

  // ---------------- AWS: EC2 & Auto Scaling ----------------
  { type: "concept", topicId: "ec2-autoscaling", title: "EC2 & Auto Scaling Groups",
    body: [
      "EC2 Auto Scaling Groups (ASGs) dynamically adjust compute capacity by adding or terminating instances based on demand metrics like CPU or queue depth.",
      "ASGs continuously perform health checks, automatically terminating unresponsive instances and spinning up fresh replacements to meet target capacity."
    ]},
  { type: "flashcard", topicId: "ec2-autoscaling",
    front: "What is a Target Tracking scaling policy in EC2 Auto Scaling?",
    back: "A policy that automatically adds or removes instances to keep a chosen metric (e.g. average CPU utilization at 60%) at a target value." },
  { type: "mc", topicId: "ec2-autoscaling",
    question: "What happens when an Auto Scaling Group health check marks an EC2 instance as unhealthy?",
    options: [
      "The instance is paused indefinitely",
      "The unhealthy instance is terminated and a new instance is launched to replace it",
      "The instance is rebooted without modifying the cluster",
      "An email alert is sent but no instances are changed"
    ],
    correctIndex: 1,
    explanation: "ASGs automatically replace unhealthy instances to preserve target capacity and service availability." },
  { type: "tf", topicId: "ec2-autoscaling",
    statement: "Auto Scaling Groups can distribute EC2 instances across multiple Availability Zones in a region.",
    answer: true,
    explanation: "Spreading instances across AZs ensures high availability if a single data center experiences an outage." },

  // ---------------- AWS: DynamoDB ----------------
  { type: "concept", topicId: "dynamodb", title: "Amazon DynamoDB",
    body: [
      "DynamoDB is a fully managed NoSQL key-value and document database designed for single-digit millisecond latency at any scale.",
      "Data is partitioned automatically across SSD storage nodes using partition keys (and optional sort keys for item querying)."
    ]},
  { type: "flashcard", topicId: "dynamodb",
    front: "What is Single-Table Design in DynamoDB?",
    back: "Modeling multiple distinct application entity types in one DynamoDB table using generic PK/SK attributes to retrieve related data in a single query." },
  { type: "mc", topicId: "dynamodb",
    question: "Which index type in DynamoDB allows querying across all table partitions on non-primary key attributes?",
    options: [ "Local Secondary Index (LSI)", "Global Secondary Index (GSI)", "Partition Index", "Sort Index" ],
    correctIndex: 1,
    explanation: "GSIs can define an entirely new partition key and sort key across all table data, independent of the base table's primary key." },
  { type: "tf", topicId: "dynamodb",
    statement: "DynamoDB On-Demand capacity automatically scales throughput up or down as application traffic spikes.",
    answer: true,
    explanation: "On-Demand mode allocates read/write capacity units instantly without pre-provisioning." },

  // ---------------- AWS: SQS & SNS ----------------
  { type: "concept", topicId: "sqs-sns", title: "SQS & SNS Messaging Patterns",
    body: [
      "Amazon SQS is a distributed message queue; Amazon SNS is a pub/sub notification service.",
      "Coupling SNS to multiple SQS queues enables the Fan-out pattern: a single event published to SNS is copied to multiple queues for parallel processing by separate microservices."
    ]},
  { type: "flashcard", topicId: "sqs-sns",
    front: "What is the Visibility Timeout in SQS?",
    back: "The period during which SQS hides a message from other consumers while a worker processes it, preventing duplicate processing unless the worker crashes before deleting the message." },
  { type: "mc", topicId: "sqs-sns",
    question: "Which messaging feature guarantees strict FIFO message ordering in SQS?",
    options: [ "Standard SQS Queue", "SQS FIFO Queue", "SNS Topic", "Dead Letter Queue" ],
    correctIndex: 1,
    explanation: "SQS FIFO queues guarantee exact first-in-first-out ordering and deduplication, trading off higher throughput." },
  { type: "tf", topicId: "sqs-sns",
    statement: "In the SNS to SQS fan-out pattern, each subscribed SQS queue gets its own copy of the published event.",
    answer: true,
    explanation: "SNS publishes the payload to all subscribed queues, enabling independent asynchronous consumers." },

  // ---------------- AWS: Lambda ----------------
  { type: "concept", topicId: "aws-lambda", title: "AWS Lambda & Serverless",
    body: [
      "AWS Lambda executes code in short-lived execution environments in response to triggers like HTTP API calls or S3 events.",
      "It scales automatically from 0 to thousands of concurrent executions, billing only for compute time consumed down to the millisecond."
    ]},
  { type: "flashcard", topicId: "aws-lambda",
    front: "What causes a 'cold start' in AWS Lambda?",
    back: "The latency when Lambda spins up a new container environment, downloads code, and initializes runtime dependencies for an incoming request." },
  { type: "mc", topicId: "aws-lambda",
    question: "What is the maximum execution timeout for a single AWS Lambda invocation?",
    options: [ "30 seconds", "5 minutes", "15 minutes", "24 hours" ],
    correctIndex: 2,
    explanation: "Lambda functions have a hard 15-minute execution limit, making them suited for event tasks rather than continuous long-running processes." },
  { type: "tf", topicId: "aws-lambda",
    statement: "Lambda functions automatically scale down to zero when no incoming events are received.",
    answer: true,
    explanation: "Zero traffic equals zero active compute containers and zero cost." },

  // ---------------- AWS: Route 53 ----------------
  { type: "concept", topicId: "route53", title: "Route 53 Traffic Routing",
    body: [
      "Amazon Route 53 is a scalable DNS web service that connects user requests to AWS resources or external IPs.",
      "It supports advanced routing policies like Latency-Based Routing, Geolocation, and Health Checks to route users to the healthiest, closest endpoint."
    ]},
  { type: "flashcard", topicId: "route53",
    front: "How does Route 53 Latency-Based Routing work?",
    back: "Route 53 measures latency from networks worldwide to AWS regions and directs users to the region providing the lowest network delay." },
  { type: "mc", topicId: "route53",
    question: "Which Route 53 record type maps a domain name directly to an AWS resource (like an ALB) without incurring extra CNAME lookup latency?",
    options: [ "A Record", "Alias Record", "MX Record", "TXT Record" ],
    correctIndex: 1,
    explanation: "Alias records are an AWS extension that resolve directly to AWS resource IP addresses seamlessly." },
  { type: "tf", topicId: "route53",
    statement: "Route 53 Failover Routing uses health checks to automatically divert traffic away from an impaired region.",
    answer: true,
    explanation: "When a primary health check fails, DNS responses automatically switch to the secondary failover target." },

  // ---------------- AWS: RDS & Aurora ----------------
  { type: "concept", topicId: "rds-aurora", title: "RDS & Aurora Scaling",
    body: [
      "Amazon RDS automates relational database management (PostgreSQL/MySQL), providing automated backups, patching, and Multi-AZ failover.",
      "Amazon Aurora decouples compute from storage, storing 6 copies of data across 3 AZs on a shared auto-scaling storage engine."
    ]},
  { type: "flashcard", topicId: "rds-aurora",
    front: "How do Aurora Read Replicas differ from standard RDS Read Replicas?",
    back: "Aurora replicas share the underlying distributed storage cluster, resulting in sub-10ms replica lag without duplicating disk writes." },
  { type: "mc", topicId: "rds-aurora",
    question: "In RDS Multi-AZ deployments, how is data copied from the primary DB to the standby DB?",
    options: [ "Asynchronously", "Synchronously", "Daily via snapshot", "Manually by admin" ],
    correctIndex: 1,
    explanation: "RDS Multi-AZ uses synchronous replication to guarantee zero data loss during failover to the standby." },
  { type: "tf", topicId: "rds-aurora",
    statement: "Amazon Aurora storage scales automatically up to 128TB without manual storage provisioning.",
    answer: true,
    explanation: "Aurora storage grows dynamically in 10GB allocation chunks as needed." },

  // ---------------- AWS: ELB / ALB ----------------
  { type: "concept", topicId: "elb-alb", title: "AWS Elastic Load Balancing",
    body: [
      "AWS ELB provides Application Load Balancers (ALB, Layer 7) and Network Load Balancers (NLB, Layer 4).",
      "ALB routes traffic using HTTP paths, headers, and hostnames, whereas NLB routes TCP/UDP traffic at extreme scale with static IP support."
    ]},
  { type: "flashcard", topicId: "elb-alb",
    front: "When would you select a Network Load Balancer (NLB) over an Application Load Balancer (ALB)?",
    back: "When handling millions of requests per second, requiring static IP addresses, or processing non-HTTP TCP/UDP protocols at sub-millisecond latency." },
  { type: "mc", topicId: "elb-alb",
    question: "Which OSI layer does an AWS Application Load Balancer (ALB) operate at?",
    options: [ "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)", "Layer 2 (Data Link)" ],
    correctIndex: 2,
    explanation: "ALB inspects Layer 7 HTTP/HTTPS headers, cookies, and URL paths to make routing decisions." },
  { type: "tf", topicId: "elb-alb",
    statement: "An ALB target group can route traffic to EC2 instances, IP addresses, and AWS Lambda functions.",
    answer: true,
    explanation: "ALB supports flexible target types spanning compute instances, containers, and serverless functions." },

  // ---------------- GCP: BigQuery ----------------
  { type: "concept", topicId: "bigquery", title: "BigQuery Analytics",
    body: [
      "Google Cloud BigQuery is a serverless, highly scalable data warehouse designed for analytical SQL queries on petabyte-scale datasets.",
      "It uses a columnar storage format (Capacitor) and separate compute engine (Dremel) to scan billions of rows in seconds."
    ]},
  { type: "flashcard", topicId: "bigquery",
    front: "Why are columnar formats like Capacitor in BigQuery faster for analytics?",
    back: "Columns are stored together on disk, so queries only read the specific columns requested rather than scanning entire rows." },
  { type: "mc", topicId: "bigquery",
    question: "How are BigQuery on-demand query costs calculated?",
    options: [ "By CPU usage hours", "By total bytes of data scanned by the query", "By number of SQL statements written", "By network port speed" ],
    correctIndex: 1,
    explanation: "On-demand BigQuery billing charges based on the quantity of data read from disk during query execution." },
  { type: "tf", topicId: "bigquery",
    statement: "Partitioning BigQuery tables by date reduces scan volume and query costs.",
    answer: true,
    explanation: "Date partitioning lets queries filter out irrelevant partitions completely during scan execution." },

  // ---------------- GCP: Cloud Pub/Sub ----------------
  { type: "concept", topicId: "gcp-pubsub", title: "Cloud Pub/Sub Streaming",
    body: [
      "Cloud Pub/Sub is GCP's global asynchronous messaging service for event ingestion and stream processing.",
      "Publishers send messages to topics, and subscribers pull or receive push deliveries from independent subscriptions attached to those topics."
    ]},
  { type: "flashcard", topicId: "gcp-pubsub",
    front: "What happens when a subscriber acknowledges (acks) a Pub/Sub message?",
    back: "Pub/Sub marks the message as delivered for that subscription and removes it from the subscription's pending message queue." },
  { type: "mc", topicId: "gcp-pubsub",
    question: "In GCP Pub/Sub, how do multiple independent microservices receive the same published event?",
    options: [
      "Each service creates its own subscription to the topic",
      "The publisher sends separate messages to each service",
      "Services share a single subscription queue",
      "Messages are saved to a bucket"
    ],
    correctIndex: 0,
    explanation: "Each subscription attached to a topic receives a copy of every published message." },
  { type: "tf", topicId: "gcp-pubsub",
    statement: "GCP Pub/Sub requires manual cluster provisioning before publishing events.",
    answer: false,
    explanation: "Pub/Sub is serverless and automatically scales globally without infrastructure management." },

  // ---------------- GCP: Cloud Spanner ----------------
  { type: "concept", topicId: "cloud-spanner", title: "Cloud Spanner",
    body: [
      "Cloud Spanner is Google's globally distributed relational database offering SQL support, horizontal scaling, and strong ACID transactions.",
      "It uses Google's TrueTime API — synchronizing atomic clocks and GPS in data centers — to enforce global external consistency without lock contention."
    ]},
  { type: "flashcard", topicId: "cloud-spanner",
    front: "What is the TrueTime API in Google Cloud Spanner?",
    back: "A hardware-backed time API (atomic clocks + GPS) that provides bounded clock uncertainty for global transaction ordering." },
  { type: "mc", topicId: "cloud-spanner",
    question: "What unique combination of properties does Cloud Spanner provide?",
    options: [
      "Global horizontal scaling with full relational SQL and strict ACID consistency",
      "NoSQL document storage with eventual consistency only",
      "Single-instance vertical scaling",
      "Local file storage"
    ],
    correctIndex: 0,
    explanation: "Spanner combines the scale of NoSQL with the strict ACID guarantees of a traditional relational RDBMS." },
  { type: "tf", topicId: "cloud-spanner",
    statement: "Cloud Spanner sacrifices strong consistency across regions to maintain high availability.",
    answer: false,
    explanation: "Spanner uses Paxos and TrueTime to deliver both global high availability and external consistency." },

  // ---------------- GCP: GKE ----------------
  { type: "concept", topicId: "gke-gcp", title: "Google Kubernetes Engine",
    body: [
      "Google Kubernetes Engine (GKE) is a managed environment for deploying and operating containerized applications at scale.",
      "GKE provides automatic control plane management, node auto-repair, cluster autoscaling, and GKE Autopilot for hands-free infrastructure."
    ]},
  { type: "flashcard", topicId: "gke-gcp",
    front: "What is GKE Autopilot mode?",
    back: "A hands-off mode where GCP manages node infrastructure, security, and scaling, charging users strictly per pod resource request." },
  { type: "mc", topicId: "gke-gcp",
    question: "Which GKE component automatically adds compute node instances when Pods cannot be scheduled due to resource limits?",
    options: [ "Horizontal Pod Autoscaler", "Cluster Autoscaler", "Kube-Proxy", "Ingress Controller" ],
    correctIndex: 1,
    explanation: "The Cluster Autoscaler monitors unschedulable pods and provisions new GCE VM nodes in the node pool." },
  { type: "tf", topicId: "gke-gcp",
    statement: "GKE integrates natively with GCP IAM to control Kubernetes cluster access permissions.",
    answer: true,
    explanation: "GCP IAM provides role-based access control (RBAC) mapping directly to K8s cluster permissions." },

  // ---------------- GCP: Cloud Storage (GCS) ----------------
  { type: "concept", topicId: "gcp-gcs", title: "Google Cloud Storage",
    body: [
      "Google Cloud Storage (GCS) is GCP's unified object storage service for unstructured data, logs, and backups.",
      "It offers global bucket namespaces, strong read-after-write consistency, and automated Object Lifecycle Rules for archiving data to Coldline/Archive tiers."
    ]},
  { type: "flashcard", topicId: "gcp-gcs",
    front: "What consistency guarantee does Google Cloud Storage provide for object uploads?",
    back: "Strong read-after-write consistency for all upload, update, and delete operations globally." },
  { type: "mc", topicId: "gcp-gcs",
    question: "GCS Object Lifecycle Management rules can automatically perform which action?",
    options: [
      "Transition objects to cheaper storage classes (like Coldline) based on age",
      "Re-write source code in Python",
      "Increase VM CPU speeds",
      "Delete user accounts"
    ],
    correctIndex: 0,
    explanation: "Lifecycle rules automate moving or deleting stale objects to optimize long-term storage costs." },
  { type: "tf", topicId: "gcp-gcs",
    statement: "GCS bucket names must be globally unique across all Google Cloud users.",
    answer: true,
    explanation: "Bucket names form a shared global namespace (storage.googleapis.com/bucket-name)." },

  // ---------------- DISTRIBUTED SYSTEMS: Kafka ----------------
  { type: "concept", topicId: "kafka-streaming", title: "Kafka Event Streaming",
    body: [
      "Apache Kafka is a distributed event streaming platform organized around append-only commit logs.",
      "Topics are partitioned across brokers for parallel processing, allowing consumer groups to track their own offsets and process streams concurrently."
    ]},
  { type: "flashcard", topicId: "kafka-streaming",
    front: "What is a consumer group offset in Kafka?",
    back: "A position pointer recorded by a consumer group indicating the last successfully processed event in a topic partition." },
  { type: "mc", topicId: "kafka-streaming",
    question: "In Apache Kafka, how is message ordering guaranteed?",
    options: [
      "Strictly ordered across all partitions in a topic",
      "Strictly ordered only within a single partition",
      "Randomly ordered",
      "Ordered by client IP"
    ],
    correctIndex: 1,
    explanation: "Kafka guarantees strict sequential ordering within an individual partition, but not across separate partitions." },
  { type: "tf", topicId: "kafka-streaming",
    statement: "Consuming a event from a Kafka topic deletes it from the broker storage immediately.",
    answer: false,
    explanation: "Kafka retains log messages until their configured time or size retention threshold expires, regardless of reads." },

  // ---------------- DISTRIBUTED SYSTEMS: Consensus (Raft) ----------------
  { type: "concept", topicId: "consensus-raft", title: "Raft & Paxos Consensus",
    body: [
      "Consensus algorithms allow a network of unreliable machines to agree on a single state machine log.",
      "Raft decomposes consensus into Leader Election, Log Replication, and Safety, requiring a majority quorum (N/2 + 1) to commit changes."
    ]},
  { type: "flashcard", topicId: "consensus-raft",
    front: "Why does Raft require a majority quorum to commit log entries?",
    back: "Any two majority quorums in a cluster overlap by at least one node, ensuring log history consistency and preventing split-brain states." },
  { type: "mc", topicId: "consensus-raft",
    question: "In a 5-node Raft consensus cluster, what is the maximum number of failed nodes the cluster can tolerate?",
    options: [ "1 node", "2 nodes", "3 nodes", "4 nodes" ],
    correctIndex: 1,
    explanation: "A 5-node cluster needs 3 operational nodes (majority quorum) to function, so it can tolerate 2 node failures." },
  { type: "tf", topicId: "consensus-raft",
    statement: "A Raft candidate node can become leader even if its log is missing committed entries present on a majority of nodes.",
    answer: false,
    explanation: "Raft's election rule blocks candidate nodes with less up-to-date logs from receiving votes." },

  // ---------------- DISTRIBUTED SYSTEMS: Leader Election ----------------
  { type: "concept", topicId: "leader-election", title: "Leader Election",
    body: [
      "Leader election designates a single node as the master coordinator for cluster tasks or consensus.",
      "Followers monitor the leader using periodic heartbeats; if heartbeats timeout, a new election is triggered via consensus (etcd/ZooKeeper) or lease locks."
    ]},
  { type: "flashcard", topicId: "leader-election",
    front: "What is the Split-Brain problem in leader election?",
    back: "A network partition causes isolated nodes to elect a second leader, resulting in two active leaders modifying state concurrently and corrupting data." },
  { type: "mc", topicId: "leader-election",
    question: "How do followers detect that an active cluster leader has failed?",
    options: [
      "By sending a shutdown command",
      "By detecting the absence of periodic heartbeat signals before a timer expires",
      "By checking physical hardware temperature",
      "By polling user browser sessions"
    ],
    correctIndex: 1,
    explanation: "Leaders send continuous heartbeats; missing heartbeats cause followers to declare election timeouts." },
  { type: "tf", topicId: "leader-election",
    statement: "Lease timers in leader election require fencing tokens to prevent stale leaders from executing writes after GC pauses.",
    answer: true,
    explanation: "Fencing tokens ensure storage engines reject writes from expired leaders that resume after long execution pauses." },

  // ---------------- DISTRIBUTED SYSTEMS: Saga & 2PC ----------------
  { type: "concept", topicId: "distributed-tx-saga", title: "Saga Pattern & 2PC",
    body: [
      "Distributed transactions across microservices avoid Two-Phase Commit (2PC) due to heavy database locks and blocking latency.",
      "The Saga pattern breaks business operations into a series of local transactions; if a step fails, compensation transactions execute in reverse order to undo changes."
    ]},
  { type: "flashcard", topicId: "distributed-tx-saga",
    front: "What is a Compensating Transaction in a Saga pattern?",
    back: "An explicit rollback action designed to reverse the business side-effects of a previously committed local transaction." },
  { type: "mc", topicId: "distributed-tx-saga",
    question: "Why is Two-Phase Commit (2PC) rarely used in modern high-throughput microservices?",
    options: [
      "2PC is not supported by SQL databases",
      "2PC holds locks across all participating databases until all nodes agree, creating blocking bottlenecks",
      "2PC cannot handle rollbacks",
      "2PC only works on single-core machines"
    ],
    correctIndex: 1,
    explanation: "Holding network locks across services creates tight coupling, latency spikes, and availability bottlenecks." },
  { type: "tf", topicId: "distributed-tx-saga",
    statement: "The Saga pattern delivers eventual consistency rather than strict ACID isolation across services.",
    answer: true,
    explanation: "Intermediate local states are committed and visible to other transactions before the entire Saga finishes." },

  // ---------------- DISTRIBUTED SYSTEMS: Vector Clocks ----------------
  { type: "concept", topicId: "vector-clocks", title: "Vector & Logical Clocks",
    body: [
      "Physical wall-clock timestamps drift across servers, making them unreliable for determining event sequence in distributed systems.",
      "Vector clocks maintain array counters per node to establish causal ordering (happened-before relationships) and detect concurrent write conflicts."
    ]},
  { type: "flashcard", topicId: "vector-clocks",
    front: "What does it mean when two vector clocks are concurrent?",
    back: "Neither vector clock is strictly greater than the other across all node elements, proving the writes occurred independently without causal knowledge." },
  { type: "mc", topicId: "vector-clocks",
    question: "Why are physical server timestamps insufficient for strict causality in distributed databases?",
    options: [
      "Clock drift and Network Time Protocol (NTP) adjustments prevent exact clock synchronization across nodes",
      "Physical clocks run backwards",
      "Servers do not have internal clocks",
      "Timestamps take too much memory"
    ],
    correctIndex: 0,
    explanation: "Physical clocks drift naturally, meaning event A on server 1 can receive a lower timestamp than event B on server 2." },
  { type: "tf", topicId: "vector-clocks",
    statement: "Vector clocks automatically merge concurrent data conflicts without application intervention.",
    answer: false,
    explanation: "Vector clocks detect conflicts; the application or database engine must apply conflict resolution logic (e.g. LWW or sibling reconciliation)." },

  // ---------------- DISTRIBUTED SYSTEMS: Quorum ----------------
  { type: "concept", topicId: "quorum-reads-writes", title: "Quorum Reads & Writes",
    body: [
      "Quorum consistency in distributed storage uses parameters N (replication factor), W (write quorum), and R (read quorum).",
      "Setting R + W > N guarantees that any read request touches at least one node containing the latest acknowledged write."
    ]},
  { type: "flashcard", topicId: "quorum-reads-writes",
    front: "What is the Quorum equation for strong consistency in distributed datastores?",
    back: "R + W > N (Read quorum + Write quorum must be greater than total Replication factor)." },
  { type: "mc", topicId: "quorum-reads-writes",
    question: "In a cluster with N=3 replicas, W=2 write quorum, and R=2 read quorum, what consistency level is guaranteed?",
    options: [ "Eventually consistent only", "Strong consistency (2 + 2 = 4 > 3)", "No consistency", "Dirty read mode" ],
    correctIndex: 1,
    explanation: "Because 2 + 2 > 3, any 2-node read set overlaps with the 2-node write set by at least 1 node." },
  { type: "tf", topicId: "quorum-reads-writes",
    statement: "Configuring W=1 and R=1 in a 3-replica cluster optimizes for speed but allows stale reads.",
    answer: true,
    explanation: "1 + 1 = 2 (not > 3), so a read can hit a replica that has not received the latest write." },

  // ---------------- DISTRIBUTED SYSTEMS: Distributed Locking ----------------
  { type: "concept", topicId: "distributed-locking", title: "Distributed Locking",
    body: [
      "Distributed locks prevent multiple processes on separate nodes from modifying a shared resource concurrently.",
      "To prevent deadlocks when a process crashes, locks use lease TTLs and fencing tokens (increasing counters) to invalidate stale lock holders."
    ]},
  { type: "flashcard", topicId: "distributed-locking",
    front: "What is a Fencing Token in distributed locking?",
    back: "A monotonically increasing counter attached to a lock lease; storage engines reject writes from old lock holders presenting lower tokens." },
  { type: "mc", topicId: "distributed-locking",
    question: "Why must a distributed lock include a Time-To-Live (TTL)?",
    options: [
      "To make lock acquisition faster",
      "To ensure the lock releases automatically if the holding node crashes or loses network connectivity",
      "To compress lock payload size",
      "To disable database backups"
    ],
    correctIndex: 1,
    explanation: "TTL prevents permanent lock starvation when lock holders crash before calling release." },
  { type: "tf", topicId: "distributed-locking",
    statement: "A process pause (such as long Java GC) can cause a distributed lock lease to expire while the process is still running.",
    answer: true,
    explanation: "Process pauses can exceed lock TTL, allowing another client to acquire the lock concurrently unless fencing tokens are used." },

  // ---------------- DISTRIBUTED SYSTEMS: Gossip Protocols ----------------
  { type: "concept", topicId: "gossip-protocol", title: "Gossip Protocols",
    body: [
      "Gossip protocols are decentralized communication algorithms where nodes periodically exchange state with a small random set of peer nodes.",
      "Cluster membership, failure detection, and health status spread exponentially like a rumor, scaling smoothly to thousands of nodes without a central master."
    ]},
  { type: "flashcard", topicId: "gossip-protocol",
    front: "Why are gossip protocols resilient against single points of failure?",
    back: "They are fully decentralized; no single master node coordinates cluster state, so any node can fail without stopping state convergence." },
  { type: "mc", topicId: "gossip-protocol",
    question: "How does network bandwidth consumption scale per node in a gossip protocol?",
    options: [
      "Linearly with the total number of cluster nodes (O(N))",
      "Constant per node (O(1)) because each node only talks to a fixed number of random peers",
      "Quadratically with total nodes (O(N^2))",
      "Exponentially"
    ],
    correctIndex: 1,
    explanation: "Nodes periodically contact a fixed subset of k peers, keeping per-node network overhead constant." },
  { type: "tf", topicId: "gossip-protocol",
    statement: "Gossip protocols provide instant sub-millisecond global synchronization across all nodes.",
    answer: false,
    explanation: "Gossip protocols provide eventual consistency; state propagates exponentially over a brief convergence interval." },

  // ---------------- DISTRIBUTED SYSTEMS: Idempotency Keys ----------------
  { type: "concept", topicId: "idempotency-keys", title: "Idempotency Keys",
    body: [
      "Network timeouts can force clients to retry requests, risking duplicate processing (e.g. charging a payment twice).",
      "Idempotency keys are unique client UUIDs attached to API requests; the server stores the key and result, returning the cached response on duplicate retries."
    ]},
  { type: "flashcard", topicId: "idempotency-keys",
    front: "What is an Idempotency Key in API design?",
    back: "A unique header value sent by a client to guarantee that retried API mutations are executed by the server exactly once." },
  { type: "mc", topicId: "idempotency-keys",
    question: "What should a server do when receiving a request with an idempotency key it has already completed?",
    options: [
      "Execute the transaction again",
      "Return an HTTP 500 error",
      "Return the cached response from the initial execution without re-processing",
      "Delete the record"
    ],
    correctIndex: 2,
    explanation: "Returning the initial response allows the client to recover safely without side-effect duplication." },
  { type: "tf", topicId: "idempotency-keys",
    statement: "HTTP GET and DELETE methods are designed to be naturally idempotent.",
    answer: true,
    explanation: "GET reads data without side effects; DELETE achieves the same end state (resource removed) regardless of repetition." },

  // ---------------- DATA: Apache Spark ----------------
  { type: "concept", topicId: "spark-batch", title: "Apache Spark",
    body: [
      "Apache Spark is an in-memory distributed computing engine for processing large-scale batch and stream workloads.",
      "It abstracts data into DataFrames and RDDs, constructing a Directed Acyclic Graph (DAG) of transformations to optimize execution across cluster workers."
    ]},
  { type: "flashcard", topicId: "spark-batch",
    front: "What is the DAG (Directed Acyclic Graph) in Apache Spark?",
    back: "The logical sequence of data transformation stages that Spark builds and optimizes before scheduling physical tasks on worker nodes." },
  { type: "mc", topicId: "spark-batch",
    question: "Why is Apache Spark faster than legacy Hadoop MapReduce?",
    options: [
      "Spark skips error handling",
      "Spark performs intermediate computations in cluster RAM instead of writing to disk between stages",
      "Spark runs only on single-core machines",
      "Spark does not support SQL"
    ],
    correctIndex: 1,
    explanation: "In-memory processing eliminates heavy disk I/O bottlenecks between Map and Reduce phases." },
  { type: "tf", topicId: "spark-batch",
    statement: "Spark DataFrame transformations are evaluated lazily when defined.",
    answer: true,
    explanation: "Spark builds the execution plan lazily and executes work only when an Action (like count or collect) is triggered." },

  // ---------------- DATA: Stream Processing ----------------
  { type: "concept", topicId: "stream-processing", title: "Stream Processing",
    body: [
      "Stream processing engines (Apache Flink, Spark Streaming) compute metrics on continuous, unbounded event streams in real time.",
      "They handle late-arriving data using Event-Time processing and Watermarks over sliding or tumbling time windows."
    ]},
  { type: "flashcard", topicId: "stream-processing",
    front: "Tumbling Window vs Sliding Window — what is the difference?",
    back: "Tumbling windows are fixed-size, non-overlapping time buckets (e.g. 5-min chunks); sliding windows overlap and evaluate continuously." },
  { type: "mc", topicId: "stream-processing",
    question: "In stream processing, Event-Time refers to:",
    options: [
      "The server clock time when the engine processes the event",
      "The timestamp generated when the event originally occurred at the source",
      "The database insertion timestamp",
      "The user's local timezone"
    ],
    correctIndex: 1,
    explanation: "Event-time uses the payload timestamp, delivering accurate windowing even when network delays delay arrival." },
  { type: "tf", topicId: "stream-processing",
    statement: "Watermarks tell a stream processor when to assume no more late data will arrive for a time window.",
    answer: true,
    explanation: "Watermarks track event-time progression to trigger window completion decisions." },

  // ---------------- DATA: Data Warehouse vs Lake ----------------
  { type: "concept", topicId: "warehouse-lake", title: "Data Warehouses vs Lakes",
    body: [
      "Data Warehouses (Snowflake, BigQuery) store structured, transformed data for fast SQL analytics.",
      "Data Lakes (S3, GCS) store vast volumes of raw, unstructured data in bulk at low cost, using Schema-on-Read for exploration and machine learning."
    ]},
  { type: "flashcard", topicId: "warehouse-lake",
    front: "What is a Data Lakehouse?",
    back: "An architecture combining the low-cost object storage of a Data Lake with the ACID transaction and indexing features of a Data Warehouse." },
  { type: "mc", topicId: "warehouse-lake",
    question: "Schema-on-Write vs Schema-on-Read: Data Lakes use which pattern?",
    options: [
      "Schema-on-Write (data must match schema before load)",
      "Schema-on-Read (raw data is stored as-is and structured when queried)",
      "No Schema allowed",
      "Fixed binary schema"
    ],
    correctIndex: 1,
    explanation: "Data Lakes ingest raw data without upfront schema enforcement, applying schema during query time." },
  { type: "tf", topicId: "warehouse-lake",
    statement: "Data Warehouses are optimized for high-volume unstructured video and audio blob storage.",
    answer: false,
    explanation: "Data Warehouses specialize in structured relational data; Data Lakes handle unstructured media blobs." },

  // ---------------- DATA: ETL vs ELT ----------------
  { type: "concept", topicId: "etl-elt", title: "ETL vs ELT Ingestion",
    body: [
      "ETL (Extract, Transform, Load) transforms data on an intermediate staging server before loading into a target database.",
      "ELT (Extract, Load, Transform) loads raw data directly into a cloud data warehouse first, using the warehouse's compute power to run transformations in SQL."
    ]},
  { type: "flashcard", topicId: "etl-elt",
    front: "Why has ELT replaced ETL in modern cloud data architectures?",
    back: "Cloud data warehouses scale compute on-demand, making in-warehouse SQL transformations faster, cheaper, and more flexible than running separate ETL servers." },
  { type: "mc", topicId: "etl-elt",
    question: "Where does data transformation occur in an ELT pipeline?",
    options: [
      "On an intermediate ETL server before loading",
      "Inside the target data warehouse after loading raw data",
      "On the client mobile device",
      "Inside the network router"
    ],
    correctIndex: 1,
    explanation: "ELT leverages cloud warehouse compute power to execute transformations directly inside the warehouse." },
  { type: "tf", topicId: "etl-elt",
    statement: "ELT preserves original raw data in the warehouse, allowing new transformations to be added later.",
    answer: true,
    explanation: "Because raw data is loaded first, teams can re-transform historical records whenever business requirements change." },

  // ---------------- RELIABILITY: Circuit Breaker ----------------
  { type: "concept", topicId: "circuit-breaker", title: "Circuit Breaker Pattern",
    body: [
      "The Circuit Breaker pattern prevents cascading service failures by intercepting requests to a failing downstream dependency.",
      "If downstream error rates cross a threshold, the breaker Trips (Open), instantly returning fallbacks without waiting for network timeouts."
    ]},
  { type: "flashcard", topicId: "circuit-breaker",
    front: "What are the three operational states of a Circuit Breaker?",
    back: "Closed (normal operation), Open (tripped, immediately returns errors), and Half-Open (testing trial requests for recovery)." },
  { type: "mc", topicId: "circuit-breaker",
    question: "What occurs when a Circuit Breaker transitions to the Open state?",
    options: [
      "Requests pass to downstream services as normal",
      "Requests fail fast immediately without calling the downstream service",
      "The downstream service is deleted",
      "Requests hang for 10 minutes"
    ],
    correctIndex: 1,
    explanation: "Failing fast prevents thread pool exhaustion on caller services while downstream systems recover." },
  { type: "tf", topicId: "circuit-breaker",
    statement: "In the Half-Open state, a Circuit Breaker allows a limited trial volume of traffic to verify if downstream has recovered.",
    answer: true,
    explanation: "If trial requests succeed, the breaker resets to Closed; if they fail, it returns to Open." },

  // ---------------- RELIABILITY: Backpressure ----------------
  { type: "concept", topicId: "backpressure", title: "Backpressure Control",
    body: [
      "Backpressure is a feedback mechanism where an overwhelmed consumer signals an upstream producer to slow down message delivery.",
      "Without backpressure, incoming traffic spikes fill consumer memory buffers, leading to latency spikes and OutOfMemory crashes."
    ]},
  { type: "flashcard", topicId: "backpressure",
    front: "What is reactive demand-driven backpressure?",
    back: "A protocol where the consumer explicitly requests the exact number of items it has capacity to process, preventing producer push overload." },
  { type: "mc", topicId: "backpressure",
    question: "If a system lacks backpressure control during a massive traffic surge, what is a common failure outcome?",
    options: [
      "Consumer memory buffers fill until the process crashes with an OutOfMemory error",
      "Producers slow down automatically",
      "Network bandwidth increases",
      "Databases run faster"
    ],
    correctIndex: 0,
    explanation: "Unbounded queues absorb memory until host memory is exhausted, crashing the consumer." },
  { type: "tf", topicId: "backpressure",
    statement: "Load shedding (intentionally dropping incoming requests) is used when backpressure cannot slow down external traffic.",
    answer: true,
    explanation: "When external clients cannot be throttled via backpressure, load shedding drops excess traffic to save system core stability." },

  // ---------------- RELIABILITY: Bloom Filters ----------------
  { type: "concept", topicId: "bloom-filters", title: "Bloom Filters",
    body: [
      "A Bloom Filter is a space-efficient probabilistic data structure used to test set membership.",
      "It returns either 'definitely not in set' or 'possibly in set', with zero false negatives and a low, configurable false positive rate."
    ]},
  { type: "flashcard", topicId: "bloom-filters",
    front: "What are the two possible query answers from a Bloom Filter?",
    back: "'Definitely not in set' (100% accurate) or 'Possibly in set' (subject to a small false positive probability)." },
  { type: "mc", topicId: "bloom-filters",
    question: "Why do databases like Cassandra use Bloom Filters before reading SSTables on disk?",
    options: [
      "To format output text",
      "To instantly skip disk reads for keys that definitely do not exist, saving disk I/O",
      "To encrypt table passwords",
      "To clean memory"
    ],
    correctIndex: 1,
    explanation: "If a Bloom Filter returns 'definitely not in set', the database avoids expensive disk searches completely." },
  { type: "tf", topicId: "bloom-filters",
    statement: "Elements can be deleted from a standard Bloom Filter without risking side effects.",
    answer: false,
    explanation: "Clearing bit positions in a standard Bloom Filter can inadvertently remove other items sharing those hash bits." },

  // ---------------- RELIABILITY: Distributed Tracing ----------------
  { type: "concept", topicId: "distributed-tracing", title: "Distributed Tracing",
    body: [
      "Distributed Tracing (OpenTelemetry, Jaeger) monitors request execution paths as they traverse multiple microservices.",
      "A unique Trace ID is passed in request headers, while individual services record Span IDs for sub-operations to measure latency bottlenecks."
    ]},
  { type: "flashcard", topicId: "distributed-tracing",
    front: "Trace ID vs Span ID in distributed tracing?",
    back: "Trace ID represents the end-to-end user request journey; Span ID represents a specific timed RPC or function call within one service." },
  { type: "mc", topicId: "distributed-tracing",
    question: "How is tracing context propagated between microservices across HTTP calls?",
    options: [
      "By passing Trace ID and Span ID in HTTP headers (e.g. W3C Trace Context)",
      "By sending emails between developers",
      "By storing logs on a USB drive",
      "By restarting containers"
    ],
    correctIndex: 0,
    explanation: "Standardized HTTP headers pass trace context seamlessly across service boundaries." },
  { type: "tf", topicId: "distributed-tracing",
    statement: "Distributed tracing allows pinpointing which specific microservice caused a request latency spike.",
    answer: true,
    explanation: "Visualization tools graph span durations to pinpoint the exact bottleneck service." },

  // ---------------- RELIABILITY: Service Mesh ----------------
  { type: "concept", topicId: "service-mesh", title: "Service Mesh & Envoy",
    body: [
      "A Service Mesh (Istio, Linkerd) manages service-to-service communication using sidecar proxies (like Envoy) co-located with app containers.",
      "It handles mutual TLS (mTLS) encryption, traffic routing, retries, and telemetry out-of-band without modifying application code."
    ]},
  { type: "flashcard", topicId: "service-mesh",
    front: "What is a Sidecar Proxy in a Service Mesh?",
    back: "A dedicated helper container running alongside the app container in the same pod to handle network security, routing, and metrics." },
  { type: "mc", topicId: "service-mesh",
    question: "Which feature is transparently provided by a Service Mesh sidecar proxy?",
    options: [
      "Automatic mutual TLS (mTLS) encryption between microservices",
      "Writing business SQL code",
      "Rendering UI HTML templates",
      "Compiling Java code"
    ],
    correctIndex: 0,
    explanation: "Sidecar proxies intercept and encrypt all inter-service network traffic transparently." },
  { type: "tf", topicId: "service-mesh",
    statement: "A Service Mesh requires application developers to write custom TLS certificate handling code inside every app.",
    answer: false,
    explanation: "The sidecar proxy handles mTLS certificates and encryption independently of application code." },

  // ---------------- RELIABILITY: Canary & Blue-Green ----------------
  { type: "concept", topicId: "canary-bluegreen", title: "Canary & Blue-Green",
    body: [
      "Blue-Green Deployment maintains two identical environments (Blue active, Green new); traffic switches instantly via load balancer routing.",
      "Canary Deployment shifts a small percentage of live traffic (e.g. 5%) to the new release, monitoring metrics before a full rollout."
    ]},
  { type: "flashcard", topicId: "canary-bluegreen",
    front: "What is the primary benefit of Blue-Green deployment?",
    back: "Zero-downtime deployment and instant rollback capability by switching load balancer traffic back to the Blue environment." },
  { type: "mc", topicId: "canary-bluegreen",
    question: "How does a Canary Deployment reduce release risk?",
    options: [
      "By exposing only a small fraction of real users to the new code while monitoring error metrics",
      "By deleting database backups",
      "By running code only on local laptops",
      "By deploying without testing"
    ],
    correctIndex: 0,
    explanation: "Canary rollouts catch bugs on a small sample of live traffic before impacting all users." },
  { type: "tf", topicId: "canary-bluegreen",
    statement: "Canary deployments require database schema changes to be compatible with both old and new code versions concurrently.",
    answer: true,
    explanation: "Because both code versions handle live requests simultaneously during rollout, schema changes must be backwards-compatible." },

  // ---------------- CONTAINERS: Docker ----------------
  { type: "concept", topicId: "docker-containers", title: "Containers & Docker",
    body: [
      "Docker containers package applications and runtime dependencies into lightweight, reproducible images.",
      "Containers share the host OS kernel using Linux Namespaces (process isolation) and cgroups (resource limits), making them much faster than Virtual Machines."
    ]},
  { type: "flashcard", topicId: "docker-containers",
    front: "Containers vs Virtual Machines — key architecture difference?",
    back: "Containers share the host OS kernel and isolate processes; VMs run a full guest OS on top of a hypervisor." },
  { type: "mc", topicId: "docker-containers",
    question: "Which Linux kernel feature enforces memory and CPU limits on Docker containers?",
    options: [ "Control Groups (cgroups)", "Namespaces", "Iptables", "EXT4" ],
    correctIndex: 0,
    explanation: "cgroups regulate and cap hardware resource utilization for container processes." },
  { type: "tf", topicId: "docker-containers",
    statement: "Docker image layers are read-only and immutable.",
    answer: true,
    explanation: "Image layers are read-only; container instances add a thin writable layer on top." },

  // ---------------- CONTAINERS: Kubernetes ----------------
  { type: "concept", topicId: "kubernetes-core", title: "Kubernetes Core",
    body: [
      "Kubernetes (K8s) is an container orchestration platform that automates container deployment, scaling, and operational management.",
      "Core objects include Pods (1+ co-located containers), Deployments (replica management), and Services (stable internal DNS and load balancer)."
    ]},
  { type: "flashcard", topicId: "kubernetes-core",
    front: "What is a Pod in Kubernetes?",
    back: "The smallest deployable unit in Kubernetes, containing one or more co-located containers sharing storage and network IP." },
  { type: "mc", topicId: "kubernetes-core",
    question: "Which Kubernetes resource provides a stable virtual IP and DNS name to load balance traffic across dynamic Pods?",
    options: [ "ConfigMap", "Service", "Volume", "Secret" ],
    correctIndex: 1,
    explanation: "K8s Services provide persistent IP and DNS endpoints that load balance traffic across matching pod endpoints." },
  { type: "tf", topicId: "kubernetes-core",
    statement: "Kubernetes automatically replaces Pods if the underlying worker node fails.",
    answer: true,
    explanation: "The K8s control plane detects node failure and reschedules pods on operational nodes to preserve desired state." }

];

// Attach an id to every card for tracking.
CARDS.forEach((c, i) => { c.id = `${c.topicId}__${i}`; });
