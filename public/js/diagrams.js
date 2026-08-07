// ============================================================
// SVG DIAGRAMS REGISTRY
// Hand-built, vector schematic diagrams matching SystemFeed's
// dark terminal aesthetics and CSS design tokens.
// ============================================================

const DIAGRAMS = {

  // 1. Load Balancer Topology
  "load-balancer-topology": `
<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" aria-label="Load Balancer Topology Diagram">
  <defs>
    <linearGradient id="lb-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="var(--surface-2)" stop-opacity="0.9"/>
    </linearGradient>
  </defs>

  <!-- Client -->
  <rect x="15" y="80" width="70" height="40" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="50" y="105" fill="var(--text)" font-family="var(--font-mono)" font-size="11" text-anchor="middle">Client</text>

  <!-- Traffic Line to LB -->
  <path d="M 85 100 L 125 100" stroke="var(--accent)" stroke-width="2" marker-end="url(#arr-accent)"/>
  <polygon points="125,96 133,100 125,104" fill="var(--accent)"/>

  <!-- Load Balancer -->
  <rect x="135" y="65" width="80" height="70" rx="10" fill="url(#lb-grad)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="175" y="96" fill="var(--accent)" font-family="var(--font-mono)" font-size="11" font-weight="bold" text-anchor="middle">LOAD</text>
  <text x="175" y="112" fill="var(--accent)" font-family="var(--font-mono)" font-size="11" font-weight="bold" text-anchor="middle">BALANCER</text>

  <!-- Server 1 -->
  <path d="M 215 85 L 247 40" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="3,3"/>
  <polygon points="244,36 253,37 249,45" fill="var(--accent)"/>
  <rect x="255" y="20" width="70" height="36" rx="6" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <circle cx="267" cy="38" r="3" fill="var(--success)"/>
  <text x="294" y="42" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Server 1</text>

  <!-- Server 2 -->
  <path d="M 215 100 L 247 100" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="247,96 255,100 247,104" fill="var(--accent)"/>
  <rect x="255" y="82" width="70" height="36" rx="6" fill="var(--surface-2)" stroke="var(--accent-dim)" stroke-width="1.5"/>
  <circle cx="267" cy="100" r="3" fill="var(--success)"/>
  <text x="294" y="104" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Server 2</text>

  <!-- Server 3 -->
  <path d="M 215 115 L 247 160" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="3,3"/>
  <polygon points="249,155 253,163 244,164" fill="var(--accent)"/>
  <rect x="255" y="144" width="70" height="36" rx="6" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <circle cx="267" cy="162" r="3" fill="var(--success)"/>
  <text x="294" y="166" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Server 3</text>
</svg>
`,

  // 2. CAP Theorem Triangle
  "cap-theorem-triangle": `
<svg viewBox="0 0 340 210" xmlns="http://www.w3.org/2000/svg" aria-label="CAP Theorem Triangle Diagram">
  <!-- Triangle Outline -->
  <polygon points="170,25 45,170 295,170" fill="none" stroke="var(--border)" stroke-width="2"/>

  <!-- Partition Tolerance edge (highlighted with weak color warning) -->
  <line x1="45" y1="170" x2="295" y2="170" stroke="var(--weak)" stroke-width="2" stroke-dasharray="4,4"/>
  <text x="170" y="188" fill="var(--weak)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">▲ Network Partitions Will Happen</text>

  <!-- Tradeoff curves -->
  <path d="M 107,97 A 100,100 0 0,1 233,97" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="3,3"/>

  <!-- Top Node: Consistency -->
  <circle cx="170" cy="25" r="22" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="2"/>
  <text x="170" y="29" fill="var(--accent)" font-family="var(--font-mono)" font-size="11" font-weight="bold" text-anchor="middle">C</text>
  <text x="170" y="-3" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Consistency</text>

  <!-- Left Node: Availability -->
  <circle cx="45" cy="170" r="22" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="2"/>
  <text x="45" y="174" fill="var(--accent)" font-family="var(--font-mono)" font-size="11" font-weight="bold" text-anchor="middle">A</text>
  <text x="45" y="202" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Availability</text>

  <!-- Right Node: Partition Tolerance -->
  <circle cx="295" cy="170" r="22" fill="var(--surface-3)" stroke="var(--weak)" stroke-width="2"/>
  <text x="295" y="174" fill="var(--weak)" font-family="var(--font-mono)" font-size="11" font-weight="bold" text-anchor="middle">P</text>
  <text x="295" y="202" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Partition Tol.</text>

  <!-- Central Badge -->
  <rect x="110" y="85" width="120" height="26" rx="6" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1"/>
  <text x="170" y="102" fill="var(--text-dim)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Choose CP vs AP</text>
</svg>
`,

  // 3. Consistent Hashing Ring
  "consistent-hashing-ring": `
<svg viewBox="0 0 340 210" xmlns="http://www.w3.org/2000/svg" aria-label="Consistent Hashing Ring Diagram">
  <!-- Ring Circle -->
  <circle cx="170" cy="105" r="70" fill="none" stroke="var(--border)" stroke-width="2"/>

  <!-- Clockwise Arrow Indicators -->
  <path d="M 170,35 A 70,70 0 0,1 240,105" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4,3"/>
  <polygon points="240,109 244,99 236,101" fill="var(--accent)"/>

  <!-- Server Nodes on Ring -->
  <!-- Node A (Top) -->
  <circle cx="170" cy="35" r="14" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="2"/>
  <text x="170" y="39" fill="var(--accent)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">N1</text>
  <text x="170" y="14" fill="var(--text)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Node A</text>

  <!-- Node B (Bottom Right) -->
  <circle cx="230" cy="140" r="14" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="2"/>
  <text x="230" y="144" fill="var(--accent)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">N2</text>
  <text x="262" y="144" fill="var(--text)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Node B</text>

  <!-- Node C (Bottom Left) -->
  <circle cx="110" cy="140" r="14" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="2"/>
  <text x="110" y="144" fill="var(--accent)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">N3</text>
  <text x="78" y="144" fill="var(--text)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Node C</text>

  <!-- Keys (Data Items) -->
  <!-- Key k1 mapped to Node A -->
  <circle cx="120" cy="55" r="5" fill="var(--weak)"/>
  <text x="104" y="52" fill="var(--weak)" font-family="var(--font-mono)" font-size="9">key_1</text>
  <path d="M 125,56 A 70,70 0 0,1 155,37" fill="none" stroke="var(--weak)" stroke-width="1" stroke-dasharray="2,2"/>

  <!-- Key k2 mapped to Node B -->
  <circle cx="225" cy="70" r="5" fill="var(--weak)"/>
  <text x="238" y="68" fill="var(--weak)" font-family="var(--font-mono)" font-size="9">key_2</text>
  <path d="M 226,75 A 70,70 0 0,1 230,125" fill="none" stroke="var(--weak)" stroke-width="1" stroke-dasharray="2,2"/>

  <text x="170" y="196" fill="var(--text-dim)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Clockwise Ownership</text>
</svg>
`,

  // 4. Database Sharding
  "db-sharding-split": `
<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" aria-label="Database Sharding Diagram">
  <!-- Logical Table Header -->
  <rect x="85" y="15" width="170" height="42" rx="8" fill="var(--surface-2)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="170" y="34" fill="var(--accent)" font-family="var(--font-mono)" font-size="11" font-weight="bold" text-anchor="middle">Logical Dataset</text>
  <text x="170" y="48" fill="var(--text-dim)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Shard Key: user_id</text>

  <!-- Hash / Router split lines -->
  <path d="M 120 57 L 55 110" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="53,104 52,114 61,111" fill="var(--accent)"/>

  <path d="M 170 57 L 170 110" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="166,108 170,116 174,108" fill="var(--accent)"/>

  <path d="M 220 57 L 285 110" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="279,111 288,114 287,104" fill="var(--accent)"/>

  <!-- Physical Shard 1 -->
  <rect x="15" y="118" width="90" height="55" rx="6" fill="var(--surface-3)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="60" y="138" fill="var(--text)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">Shard 1</text>
  <text x="60" y="156" fill="var(--text-faint)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">ID: 1 - 1M</text>

  <!-- Physical Shard 2 -->
  <rect x="125" y="118" width="90" height="55" rx="6" fill="var(--surface-3)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="170" y="138" fill="var(--text)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">Shard 2</text>
  <text x="170" y="156" fill="var(--text-faint)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">ID: 1M - 2M</text>

  <!-- Physical Shard 3 -->
  <rect x="235" y="118" width="90" height="55" rx="6" fill="var(--surface-3)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="280" y="138" fill="var(--text)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">Shard 3</text>
  <text x="280" y="156" fill="var(--text-faint)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">ID: 2M+</text>
</svg>
`,

  // 5. Primary / Replica Replication
  "primary-replica-replication": `
<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" aria-label="Primary Replica Replication Diagram">
  <!-- Application Client -->
  <rect x="15" y="75" width="70" height="45" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="50" y="102" fill="var(--text)" font-family="var(--font-mono)" font-size="11" text-anchor="middle">App</text>

  <!-- Write Flow to Primary -->
  <path d="M 85 87 L 135 45" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="129,43 139,41 135,50" fill="var(--accent)"/>
  <text x="100" y="58" fill="var(--accent)" font-family="var(--font-mono)" font-size="9">Write</text>

  <!-- Primary DB -->
  <rect x="140" y="20" width="100" height="42" rx="8" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="190" y="45" fill="var(--accent)" font-family="var(--font-mono)" font-size="11" font-weight="bold" text-anchor="middle">Primary DB</text>

  <!-- Replication Sync Arrows -->
  <path d="M 165 62 L 140 120" stroke="var(--text-dim)" stroke-width="1.5" stroke-dasharray="3,3"/>
  <polygon points="137,114 137,125 145,120" fill="var(--text-dim)"/>

  <path d="M 215 62 L 240 120" stroke="var(--text-dim)" stroke-width="1.5" stroke-dasharray="3,3"/>
  <polygon points="235,120 243,125 243,114" fill="var(--text-dim)"/>
  <text x="190" y="90" fill="var(--text-faint)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Replicate</text>

  <!-- Read Replica 1 -->
  <rect x="90" y="125" width="90" height="42" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="135" y="150" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Replica 1</text>

  <!-- Read Replica 2 -->
  <rect x="200" y="125" width="90" height="42" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="245" y="150" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Replica 2</text>

  <!-- Read Flow from App to Replicas -->
  <path d="M 85 110 L 105 125" stroke="var(--success)" stroke-width="1.5"/>
  <text x="65" y="135" fill="var(--success)" font-family="var(--font-mono)" font-size="9">Read</text>
</svg>
`,

  // 6. Cache-Aside Flow
  "cache-aside-flow": `
<svg viewBox="0 0 340 210" xmlns="http://www.w3.org/2000/svg" aria-label="Cache Aside Flow Diagram">
  <!-- Client / App -->
  <rect x="15" y="85" width="75" height="45" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="52" y="112" fill="var(--text)" font-family="var(--font-mono)" font-size="11" text-anchor="middle">App</text>

  <!-- Step 1: Check Cache -->
  <path d="M 90 95 L 140 45" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="133,45 144,41 141,51" fill="var(--accent)"/>
  <text x="96" y="62" fill="var(--accent)" font-family="var(--font-mono)" font-size="9">1. Check</text>

  <!-- Cache Node -->
  <rect x="145" y="20" width="100" height="42" rx="8" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="195" y="45" fill="var(--accent)" font-family="var(--font-mono)" font-size="11" font-weight="bold" text-anchor="middle">Cache</text>

  <!-- Cache Hit Path (Return to App) -->
  <path d="M 145 35 L 75 85" stroke="var(--success)" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="145" y="76" fill="var(--success)" font-family="var(--font-mono)" font-size="9">Hit: Return</text>

  <!-- Step 2: Cache Miss -> DB Read -->
  <path d="M 90 120 L 140 160" stroke="var(--weak)" stroke-width="1.5"/>
  <polygon points="139,154 145,164 133,162" fill="var(--weak)"/>
  <text x="92" y="152" fill="var(--weak)" font-family="var(--font-mono)" font-size="9">2. Miss: Read</text>

  <!-- Database Node -->
  <rect x="145" y="145" width="100" height="42" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="195" y="170" fill="var(--text)" font-family="var(--font-mono)" font-size="11" font-weight="bold" text-anchor="middle">Database</text>

  <!-- Step 3: Populate Cache -->
  <path d="M 195 145 L 195 62" stroke="var(--weak)" stroke-width="1.5" stroke-dasharray="3,3"/>
  <polygon points="191,70 195,62 199,70" fill="var(--weak)"/>
  <text x="202" y="110" fill="var(--weak)" font-family="var(--font-mono)" font-size="9">3. Write Back</text>
</svg>
`,

  // 7. DNS Resolution Chain
  "dns-resolution-chain": `
<svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" aria-label="DNS Resolution Chain Diagram">
  <!-- Client Browser -->
  <rect x="15" y="90" width="65" height="40" rx="6" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="47" y="114" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Client</text>

  <!-- Resolver -->
  <path d="M 80 110 L 105 110" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="105,106 113,110 105,114" fill="var(--accent)"/>
  <rect x="115" y="85" width="80" height="50" rx="8" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="155" y="107" fill="var(--accent)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">Recursive</text>
  <text x="155" y="122" fill="var(--accent)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">Resolver</text>

  <!-- Stacked DNS Servers -->
  <!-- Root Server -->
  <path d="M 195 95 L 230 40" stroke="var(--text-dim)" stroke-width="1.5"/>
  <polygon points="225,38 234,35 231,44" fill="var(--text-dim)"/>
  <rect x="235" y="20" width="90" height="35" rx="6" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="280" y="42" fill="var(--text)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">1. Root Server</text>

  <!-- TLD Server -->
  <path d="M 195 110 L 230 110" stroke="var(--text-dim)" stroke-width="1.5"/>
  <polygon points="230,106 238,110 230,114" fill="var(--text-dim)"/>
  <rect x="238" y="92" width="90" height="35" rx="6" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="283" y="114" fill="var(--text)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">2. TLD (.com)</text>

  <!-- Authoritative Server -->
  <path d="M 195 125 L 230 175" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="229,170 234,179 224,177" fill="var(--accent)"/>
  <rect x="235" y="165" width="90" height="35" rx="6" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="280" y="186" fill="var(--accent)" font-family="var(--font-mono)" font-size="9" font-weight="bold" text-anchor="middle">3. Authoritative</text>
</svg>
`,

  // 8. CDN Edge Network
  "cdn-edge-network": `
<svg viewBox="0 0 340 210" xmlns="http://www.w3.org/2000/svg" aria-label="CDN Edge Network Diagram">
  <!-- Origin Server -->
  <rect x="15" y="80" width="80" height="50" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="55" y="103" fill="var(--text-dim)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">Origin</text>
  <text x="55" y="117" fill="var(--text-faint)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Server</text>

  <!-- Sync lines from Origin to Edges -->
  <path d="M 95 90 L 140 45" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3,3"/>
  <path d="M 95 105 L 140 105" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3,3"/>
  <path d="M 95 120 L 140 165" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3,3"/>

  <!-- Edge Nodes -->
  <!-- Edge US -->
  <rect x="145" y="25" width="80" height="38" rx="6" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="185" y="48" fill="var(--accent)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Edge US</text>

  <!-- Edge EU -->
  <rect x="145" y="85" width="80" height="38" rx="6" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="185" y="108" fill="var(--accent)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Edge EU</text>

  <!-- Edge Asia -->
  <rect x="145" y="145" width="80" height="38" rx="6" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="185" y="168" fill="var(--accent)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Edge Asia</text>

  <!-- Users (Low Latency Connections) -->
  <path d="M 225 44 L 265 44" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="265,40 273,44 265,48" fill="var(--accent)"/>
  <text x="295" y="48" fill="var(--text)" font-family="var(--font-mono)" font-size="10">User A</text>

  <path d="M 225 104 L 265 104" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="265,100 273,104 265,108" fill="var(--accent)"/>
  <text x="295" y="108" fill="var(--text)" font-family="var(--font-mono)" font-size="10">User B</text>

  <path d="M 225 164 L 265 164" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="265,160 273,164 265,168" fill="var(--accent)"/>
  <text x="295" y="168" fill="var(--text)" font-family="var(--font-mono)" font-size="10">User C</text>
</svg>
`,

  // 9. API Gateway Fanout
  "api-gateway-fanout": `
<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" aria-label="API Gateway Fanout Diagram">
  <!-- Client -->
  <rect x="15" y="80" width="65" height="40" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="47" y="105" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Client</text>

  <path d="M 80 100 L 105 100" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="105,96 113,100 105,104" fill="var(--accent)"/>

  <!-- API Gateway Box -->
  <rect x="115" y="55" width="85" height="90" rx="10" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="157" y="85" fill="var(--accent)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">API</text>
  <text x="157" y="100" fill="var(--accent)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">GATEWAY</text>
  <text x="157" y="125" fill="var(--text-faint)" font-family="var(--font-mono)" font-size="8" text-anchor="middle">Auth/RateLimit</text>

  <!-- Fanout arrows -->
  <path d="M 200 80 L 235 35" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="231,32 240,30 237,39" fill="var(--accent)"/>

  <path d="M 200 100 L 235 100" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="235,96 243,100 235,104" fill="var(--accent)"/>

  <path d="M 200 120 L 235 165" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="237,161 240,170 231,168" fill="var(--accent)"/>

  <!-- Microservices -->
  <rect x="242" y="18" width="83" height="34" rx="6" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="283" y="39" fill="var(--text)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Auth Svc</text>

  <rect x="242" y="83" width="83" height="34" rx="6" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="283" y="104" fill="var(--text)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">User Svc</text>

  <rect x="242" y="148" width="83" height="34" rx="6" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="283" y="169" fill="var(--text)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Order Svc</text>
</svg>
`,

  // 10. Message Queue Decoupling
  "message-queue-decoupling": `
<svg viewBox="0 0 340 190" xmlns="http://www.w3.org/2000/svg" aria-label="Message Queue Decoupling Diagram">
  <!-- Producer -->
  <rect x="15" y="70" width="75" height="45" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="52" y="97" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Producer</text>

  <!-- Push to Queue -->
  <path d="M 90 925 L 115 92" stroke="var(--accent)" stroke-width="1.5"/>
  <path d="M 90 92 L 115 92" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="115,88 123,92 115,96" fill="var(--accent)"/>

  <!-- Message Queue -->
  <rect x="125" y="60" width="95" height="65" rx="8" fill="var(--surface-3)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="172" y="78" fill="var(--accent)" font-family="var(--font-mono)" font-size="10" font-weight="bold" text-anchor="middle">Message Queue</text>

  <!-- Enqueued Messages -->
  <rect x="135" y="88" width="20" height="24" rx="3" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1"/>
  <text x="145" y="104" fill="var(--text)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">m1</text>

  <rect x="162" y="88" width="20" height="24" rx="3" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1"/>
  <text x="172" y="104" fill="var(--text)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">m2</text>

  <rect x="189" y="88" width="20" height="24" rx="3" fill="var(--accent-dim)" stroke="var(--accent)" stroke-width="1"/>
  <text x="199" y="104" fill="var(--text)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">m3</text>

  <!-- Pull/Poll to Consumer -->
  <path d="M 220 92 L 245 92" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="245,88 253,92 245,96" fill="var(--accent)"/>

  <!-- Consumer -->
  <rect x="255" y="70" width="75" height="45" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
  <text x="292" y="97" fill="var(--text)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Consumer</text>

  <text x="170" y="155" fill="var(--text-dim)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">Async / Time Decoupled</text>
</svg>
`
};
