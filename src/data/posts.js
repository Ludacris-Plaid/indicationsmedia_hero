const posts = [
  {
    id: 1,
    title: 'Building a Secure API Layer in Rust',
    category: 'SECURITY',
    date: '2024-07-01',
    excerpt: 'A walkthrough of building a zero-trust API using Rust, Actix-web, and JWT authentication at scale.',
    content: `At Indications Media, we recently shipped a client-facing API that handles sensitive financial data. We chose Rust for its memory safety guarantees and zero-cost abstractions — the combination of performance and safety made it the clear winner over Go and Python for this workload.

The architecture uses Actix-web as the HTTP layer, with middleware for rate limiting, JWT validation, and per-request audit logging. Each endpoint sits behind an authorization gate that checks the caller's scope against the requested resource. Every failed auth attempt is logged and correlated.

Rust's borrow checker caught three potential data races during development — races that would have gone unnoticed in a garbage-collected language. The result is an API that serves 10,000 requests per second with a P99 latency under 12ms. Memory usage sits at a steady 85MB, about 1/3 of what the Node.js prototype consumed.

We pair the Rust API with a PostgreSQL backend (using sqlx for compile-time query verification) and deploy via a single-binary Docker image. CI tests run in parallel thanks to Rust's fast compile times with sccache. If you're building anything that touches PII or financial data, Rust should be on your shortlist.`,
    color: '#DEA584',
  },
  {
    id: 2,
    title: 'Zero-Trust Architecture for Small Businesses',
    category: 'SECURITY',
    date: '2024-06-15',
    excerpt: 'Why zero-trust isn\'t just for enterprises. A practical guide to implementing least-privilege access for SMBs.',
    content: `Zero-trust architecture sounds like an enterprise-only concern, but small businesses are actually the easiest targets for attackers — they have the same attack surface with a fraction of the defense budget.

The core principle is simple: never trust, always verify. Every request, whether it comes from inside your network or outside, gets authenticated and authorized before it touches any resource. We implement this with a few practical patterns that work even for 5-person teams.

First, put everything behind a reverse proxy with mutual TLS. Nginx or Caddy can handle this. Second, use short-lived JWTs (15-minute tokens) instead of long-lived API keys. Third, enforce MFA on every authentication event — no exceptions, no "remember this device" for privileged accounts.

We recently deployed this stack for a 12-person accounting firm. Total cost: two $40/mo VPS instances, a Cloudflare free tier plan, and about 8 hours of configuration. The result: SOC 2 Type II auditability on a $100/mo budget. Zero-trust doesn't mean zero-budget.`,
    color: '#ff3366',
  },
  {
    id: 3,
    title: 'Why Monero Belongs in Your Privacy Stack',
    category: 'CRYPTO',
    date: '2024-05-20',
    excerpt: 'Understanding Monero\'s ring signatures, stealth addresses, and why privacy is not optional in digital payments.',
    content: `Most cryptocurrency transactions are pseudonymous, not anonymous. Every Bitcoin payment is permanently recorded on a public ledger. With enough chain analysis, any transaction can be traced back to a real identity. That's not a bug — it's how the protocol is designed.

Monero takes the opposite approach. By default, every transaction uses ring signatures (hiding the sender among 15 decoys), stealth addresses (generating a one-time address per payment), and RingCT (hiding the amount). The result is a system where outside observers cannot determine the sender, receiver, or amount of any transaction.

For developers, Monero's privacy guarantees are enforced at the protocol level — you can't accidentally leak metadata because the protocol doesn't expose it. Compare this to Bitcoin or Ethereum where every balance and transaction is queryable via a public RPC.

We use Monero internally for private payments and recommend it to clients who need verifiably untraceable transactions. It's not about hiding illegal activity — it's about the principle that financial privacy is a fundamental right, not a feature you opt into.`,
    color: '#FF6600',
  },
  {
    id: 4,
    title: 'Deploying AI Agents: Lessons from 50+ Projects',
    category: 'AI',
    date: '2024-04-10',
    excerpt: 'Hard-won lessons from deploying LLM-based agents at scale. What works, what fails, and what costs a fortune.',
    content: `After deploying AI agents across 50+ client projects, a few patterns have become painfully clear. The first: LLMs are terrible at counting. If you need precise numerical output, use a deterministic function, not a prompt. The second: structured output validation is non-negotiable. Every LLM output should be run through a schema validator before it touches your application logic.

We now use a pattern we call "gate-and-route." The LLM generates a candidate response. A lightweight validation layer (usually Zod schemas in TypeScript, or Pydantic in Python) checks the output against the expected shape. If it fails, the response is discarded and the prompt is retried with a more constrained instruction. If it passes, the structured data flows into the application layer.

Cost-wise, the biggest surprise was that prompt engineering time dominates model inference cost. A $0.002 API call often took 4 hours of prompt iteration to get right. We now cache validated prompt templates per use case and treat them as versioned assets in git.

For production, we run 85% of workloads through DeepSeek (cost-effective, fast) and route only the hardest 15% to larger models. This cut our total LLM spend by 60% without a measurable quality drop. If you're building AI features, budget more for the validation layer than the model itself.`,
    color: '#00ccff',
  },
  {
    id: 5,
    title: 'The State of Quantum-Resistant Cryptography',
    category: 'SECURITY',
    date: '2024-03-05',
    excerpt: 'NIST\'s post-quantum standards are finalized. Here\'s what developers need to know about CRYSTALS-Kyber and CRYSTALS-Dilithium.',
    content: `In August 2024, NIST finalized three post-quantum cryptography standards: ML-KEM (formerly CRYSTALS-Kyber) for key encapsulation, ML-DSA (CRYSTALS-Dilithium) for digital signatures, and SLH-DSA (SPHINCS+) as a backup signature scheme. These replace RSA and ECDSA, both of which are breakable by Shor's algorithm running on a sufficiently large quantum computer.

The good news: the new algorithms are faster than RSA for most operations. Kyber-768 key generation takes about 80 microseconds on modern hardware. The bad news: key sizes and ciphertext sizes are significantly larger. A Kyber public key is 1,184 bytes (vs 256 bytes for ECDSA). This matters for bandwidth-constrained environments and deeply embedded systems.

For web developers, the practical impact is minimal. TLS 1.3 already supports hybrid key exchange (combining classical and post-quantum algorithms), and major browsers are rolling out support through 2025. Cloudflare and Google have been running PQ-TLS experiments in production since 2019.

Our recommendation: start testing your service mesh and API gateways with hybrid PQ-TLS now. The transition window is closing, and "harvest now, decrypt later" attacks mean data encrypted today with RSA could be decrypted tomorrow by a quantum adversary. If your data has a shelf life longer than 5-7 years, the migration clock is already ticking.`,
    color: '#7C3AED',
  },
]

export default posts
