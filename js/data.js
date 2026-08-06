// ============================================================
// CONTENT DATABASE
// Original explanations of standard, widely-taught system design
// concepts, written from scratch for this app.
// ============================================================

const TOPICS = [
  { id: "client-server", tag: "NET", name: "Client-Server Model", blurb: "Who asks, who answers" },
  { id: "dns",            tag: "DNS", name: "DNS Resolution",      blurb: "Turning names into addresses" },
  { id: "load-balancing", tag: "LB",  name: "Load Balancing",      blurb: "Spreading the traffic around" },
  { id: "caching",        tag: "CACHE", name: "Caching",           blurb: "Remembering so you don't repeat work" },
  { id: "cdn",            tag: "CDN", name: "Content Delivery Networks", blurb: "Serving content from nearby" },
  { id: "db-indexing",    tag: "IDX", name: "Database Indexing",   blurb: "Finding rows without scanning everything" },
  { id: "sql-nosql",      tag: "SQL", name: "SQL vs NoSQL",        blurb: "Choosing the right data model" },
  { id: "replication",    tag: "REPL", name: "Database Replication", blurb: "Copies for speed and safety" },
  { id: "sharding",       tag: "SHRD", name: "Sharding & Partitioning", blurb: "Splitting data across machines" },
  { id: "cap-theorem",    tag: "CAP", name: "CAP Theorem",         blurb: "Pick two, under a partition" },
  { id: "consistent-hashing", tag: "HASH", name: "Consistent Hashing", blurb: "Rebalancing without the reshuffle" },
  { id: "message-queues", tag: "MQ",  name: "Message Queues", blurb: "Decoupling work in time" },
  { id: "rate-limiting",  tag: "RATE", name: "Rate Limiting", blurb: "Protecting systems from too much love" },
  { id: "microservices",  tag: "SVC", name: "Microservices vs Monolith", blurb: "One deployable or many" },
  { id: "api-gateway",    tag: "GW",  name: "API Gateway", blurb: "One door, many services" },
  { id: "scaling",        tag: "SCALE", name: "Horizontal vs Vertical Scaling", blurb: "Bigger machine or more machines" },
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
    front: "Name two cross-cutting concerns an API gateway commonly centralizes.",
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
    explanation: "If any server can handle any request without relying on local in-memory state, a load balancer can freely distribute traffic and you can add or remove servers with ease." },
];

// Attach an id to every card for tracking.
CARDS.forEach((c, i) => { c.id = `${c.topicId}__${i}`; });
