# Blog Posting Protocol — Indications Media

## 1. Overview

This document is the single source of truth for AI agents producing blog content for Indications Media. It covers everything from API mechanics to voice, tone, SEO, and category-specific depth requirements. If you are an AI agent writing a post, read this document end-to-end before generating content.

Indications Media publishes technical deep-dives for senior engineers, CTOs, and technical founders. Every post must demonstrate real-world expertise, include specific technical detail, and respect the API contract for publishing.

Do not guess at API details. Do not invent tools, versions, or metrics. If you are unsure about something, say so explicitly in the post rather than fabricating specifics.

---

## 2. API Reference

### Endpoint

```
POST https://indicationsmedia.com/api/posts
```

### Authentication

```
Authorization: Bearer Fraser1984!
```

### Content-Type

```
Content-Type: application/json
```

### Request Body

```json
{
  "title": "Your Post Title",
  "category": "SECURITY",
  "image": "https://images.unsplash.com/photo-...?w=800&h=400&fit=crop",
  "excerpt": "Short 1-2 sentence summary for the feed.",
  "content": "Full blog post body. Paragraphs separated by \\n\\n."
}
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Blog post title. Clear, specific, no clickbait. |
| `category` | Yes | One of: `SECURITY`, `CRYPTO`, `AI` |
| `image` | Yes | URL to a stock image. Must be a valid image URL. |
| `excerpt` | No | 1-2 sentence summary. Auto-generated from content if omitted. |
| `content` | Yes | Full post body. Use `\n\n` to separate paragraphs. |
| `color` | No | Hex color. Auto-assigned from category if omitted. |

### Category Colors (auto-assigned)

- `SECURITY` → `#ff3366`
- `CRYPTO` → `#FF6600`
- `AI` → `#00ccff`

### Response: Success (201)

```json
{
  "id": 16,
  "title": "Your Post Title",
  "category": "SECURITY",
  "date": "2024-07-20",
  "excerpt": "Short summary...",
  "content": "Full body...",
  "color": "#ff3366"
}
```

### Response: Errors

| Status | Meaning |
|--------|---------|
| 400 | Missing required field (title, category, content, or image) |
| 401 | Wrong or missing API key |
| 405 | Wrong HTTP method (use POST) |

### Read All Posts

```bash
curl https://indicationsmedia.com/api/posts
```

Returns a JSON array sorted by date (newest first).

### Full curl Example

```bash
curl -X POST https://indicationsmedia.com/api/posts \
  -H "Authorization: Bearer Fraser1984!" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hardening SSH in Production: The Complete Checklist",
    "category": "SECURITY",
    "image": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop",
    "excerpt": "SSH is the front door to your infrastructure. Here is how to lock it down.",
    "content": "SSH brute-force attacks account for over 30% of unauthorized access attempts against cloud servers according to AWS 2023 threat reports. If your SSH configuration is still running defaults, you are one automated scan away from compromise.\n\nThis is not theoretical. We found an unpatched jump box running Ubuntu 18.04 with password authentication enabled. It had 47,000 failed login attempts in 72 hours. The attacker eventually moved laterally into our staging environment.\n\nHere is the hardened SSH configuration we now deploy across every production server."
  }'
```

---

## 3. Content Requirements

### Length

- **Minimum:** 600 words
- **Maximum:** 1200 words
- **Target:** 800-1000 words
- **Paragraphs:** 3-5 minimum. Do not pad with filler. Every paragraph must earn its place.

### Structure

Every post must follow this structure:

1. **Title** — Clear, specific, searchable. No clickbait. No vague promises.
2. **Hook paragraph** — Open with a concrete problem, statistic, or war story. Establish why this matters right now.
3. **Body paragraphs** — Deliver the technical substance. Include specific tools, configurations, real numbers, and code snippets where relevant. Each paragraph should advance the reader's understanding.
4. **Conclusion** — Summarize the key takeaway. Optionally point to next steps or further reading.

### Required Technical Specificity

Every post must include at least two of the following:

- Specific tool names and versions (e.g., "OpenSSH 9.6" not "a recent version of SSH")
- Configuration snippets or code examples
- Real metrics or performance numbers ("reduced latency from 340ms to 45ms")
- Infrastructure details ("deployed on c6g.xlarge instances running Amazon Linux 2023")
- Step-by-step procedures the reader can follow

Do not write vague statements like "we improved performance significantly." Write "we reduced p99 latency from 340ms to 45ms by switching from Python to Go for the hot path."

---

## 4. Category Specifications

Each category has a distinct focus area. Stay within the defined scope. Posts that blur category lines should be assigned to the category where the majority of the technical content falls.

### SECURITY

**Scope:** Defensive security, infrastructure hardening, operational security, compliance implementation.

**Topics to cover:**

- Vulnerability disclosures and mitigation strategies
- Infrastructure hardening (servers, containers, networks)
- Authentication and authorization systems
- Cryptography implementations (not crypto speculation — actual cryptographic engineering)
- Incident response and forensics
- Compliance practical guides (SOC2, HIPAA, PCI-DSS)
- Secrets management and key rotation
- Network segmentation and zero trust architecture
- Logging, monitoring, and alerting for security events

**Example topics:**

- "Harden Your SSH: The Complete Production Checklist"
- "Container Escape Prevention in Kubernetes"
- "WAF Configuration Guide: Rules That Actually Work"
- "Secrets Management at Scale with HashiCorp Vault"
- "Building a SOC2-Compliant Audit Trail from Scratch"
- "Incident Response Playbook for Small Teams"

**Do NOT cover:** General security news, threat intelligence roundups, CVE lists without mitigation guidance.

### CRYPTO

**Scope:** Cryptocurrency technology, smart contracts, DeFi mechanics, wallet security, blockchain engineering.

**Topics to cover:**

- Privacy coins and protocols (Monero, Zcash, Lightning Network)
- Smart contract development and security auditing
- DeFi protocol analysis and risk assessment
- Wallet security and key management (hardware wallets, multi-sig, MPC)
- Layer 2 solutions and scaling approaches
- Regulatory landscape and practical compliance steps
- Blockchain infrastructure and node operation
- Cross-chain bridges and interoperability security

**Example topics:**

- "Lightning Network Node Setup on a Raspberry Pi"
- "Smart Contract Auditing Checklist: A Practical Guide"
- "Multi-Sig Wallet Architecture for Treasury Management"
- "Cross-Chain Bridge Security: What Can Go Wrong"
- "Running a Monero Full Node: Privacy Infrastructure at Home"
- "DeFi Yield Farming Risk Assessment Framework"

**Do NOT cover:** Price predictions, market analysis, token launches, ICOs, "which coin will moon."

### AI

**Scope:** LLM engineering, AI systems design, practical ML deployment, responsible AI practices.

**Topics to cover:**

- LLM deployment and optimization (inference, quantization, serving)
- RAG pipeline architecture and evaluation
- Prompt engineering and injection defense
- AI agent design patterns and memory systems
- Cost optimization strategies for LLM workloads
- Evaluation and testing methodologies for AI outputs
- Fine-tuning workflows and data preparation
- AI safety and alignment in production systems

**Example topics:**

- "Building Production RAG Systems: What Actually Works"
- "LLM Cost Optimization at Scale: From $10K/mo to $2K/mo"
- "AI Agent Memory Architecture: Short-Term, Long-Term, and Episodic"
- "Evaluating LLM Output Quality: Metrics That Matter"
- "Prompt Injection Defense Patterns for Production Applications"
- "Fine-Tuning Small Models for Domain-Specific Tasks"

**Do NOT cover:** AI hype pieces, AGI speculation, general "AI will change everything" narratives, comparisons between chatbot products.

---

## 5. Target Reader Profile

**Primary audience:** Senior developers, CTOs, technical founders, security engineers, and DevOps/Platform engineers.

**They know the basics.** Do not explain what a container is or how HTTP works. They need depth, not definitions.

**What they want:**

- Specific configurations and commands they can use immediately
- Real-world trade-offs and failure modes, not just the happy path
- Performance numbers and benchmarks from actual production use
- Lessons learned from incidents and mistakes
- Architecture decisions with reasoning, not just conclusions

**What they do not want:**

- Beginner tutorials
- Vendor marketing copy disguised as technical content
- Theoretical discussions without practical application
- Lists of features without evaluation

Write as if you are explaining something to a colleague over coffee. They already understand the domain. You are sharing what you learned the hard way.

---

## 6. Voice and Tone Guidelines

### Core Principles

- **Write like a senior engineer talking to a peer.** Direct, knowledgeable, conversational.
- **Confident but not arrogant.** State your experience. Do not claim to be the world's foremost expert.
- **Specific over general.** "We used Postgres 15 with pg_partman for partitioning" not "we used a database with partitioning."
- **No corporate buzzwords.** Never use: leverage, synergy,赋能, solutionize, holistic, ecosystem, disrupt, innovation, best-in-class, cutting-edge, state-of-the-art.
- **Short sentences, active voice.** "We deployed the fix" not "The fix was deployed by our team."
- **It is OK to say "we don't know" or "it depends."** Honesty builds trust. False certainty destroys it.
- **Include war stories and lessons learned.** The best technical writing comes from experience, including failures.

### Sentence-Level Rules

| Instead of | Write |
|------------|-------|
| "It is important to note that..." | Delete the sentence. Just state the fact. |
| "In today's rapidly evolving landscape..." | Delete the sentence. Get to the point. |
| "This comprehensive guide will..." | Delete the sentence. The guide is comprehensive or it is not. |
| "It goes without saying that..." | If it goes without saying, do not say it. |
| "Leverage our solution to..." | Never. Just describe what you did. |
| "A myriad of..." | "Many" or "several" |
| "At the end of the day..." | "Ultimately" or just state the conclusion. |

### Tone Spectrum

| Situation | Tone |
|-----------|------|
| Explaining a configuration | Direct and precise |
| Describing an incident | Factual with context |
| Sharing an opinion | Clear attribution ("In our experience..." or "We found that...") |
| Discussing trade-offs | Balanced, present both sides |
| Admitting a mistake | Honest, no deflection |

---

## 7. SEO Guidelines

### Keyword Strategy

- Identify one primary keyword per post before writing
- Use the primary keyword naturally in the title, first paragraph, and at least one H2 heading
- Include 2-3 secondary keywords (related terms people search for)
- Use the keyword in the excerpt — this appears in search results and social shares

### Structural SEO

- Use proper heading hierarchy: H2 for main sections, H3 for subsections
- Each H2 should be descriptive and keyword-aware
- Keep paragraphs short (3-5 sentences) for readability and featured snippets
- Use bullet points or numbered lists when presenting steps or comparisons
- Include code blocks with language tags for syntax highlighting

### Meta and Snippet Optimization

- The excerpt should work as a standalone search snippet (1-2 sentences, 150-160 characters ideal)
- Front-load the value proposition in the excerpt
- Avoid repeating the title verbatim in the excerpt

### What NOT to Do

- Do not keyword stuff. If it reads unnaturally, rewrite it.
- Do not write meta descriptions or title tags (the API handles this)
- Do not add alt text for images (the content field is text-only)
- Do not pad word count with filler to hit SEO length targets

---

## 8. Sample Article

**Category:** SECURITY
**Title:** Harden Your SSH: The Complete Production Checklist
**Excerpt:** SSH brute-force attacks hit every internet-facing server. Here is the exact configuration we deploy to lock it down.

---

SSH is the front door to your infrastructure, and most teams leave it unlocked. AWS's 2023 threat report noted that SSH brute-force attempts account for over 30% of unauthorized access attempts against cloud instances. We found this firsthand when an automated scan hit one of our jump boxes with 47,000 failed login attempts in 72 hours. The box was running Ubuntu 18.04 with password authentication enabled. That was the last time we shipped a server with default SSH config.

Here is the hardened SSH configuration we now deploy across every production server. Every line has a reason, and we will explain each one.

**Disable root login.** The first rule: nobody logs in as root via SSH. Edit `/etc/ssh/sshd_config`:

```
PermitRootLogin no
```

Root has no business logging in over the network. If you need root access, log in as your personal account and escalate with `sudo`. This eliminates the most targeted account from the attack surface entirely.

**Switch to key-only authentication.** Password authentication is dead weight. Disable it:

```
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM no
```

Keys are longer, cannot be brute-forced in practice, and are easier to rotate. We generate 4096-bit RSA keys for each developer and rotate them every 90 days. If your team resists the friction, set up SSH certificates with a short-lived CA — it is more work upfront but scales better than managing individual authorized_keys files.

**Restrict who can log in.** Use the `AllowUsers` directive to whitelist specific accounts:

```
AllowUsers deploy@10.0.0.0/8 admin@203.0.113.50
```

This limits SSH access to specific users from specific IPs. Even if an attacker obtains valid credentials, they cannot use them from an unauthorized network. We combine this with AWS Security Groups that only allow SSH traffic from known bastion hosts.

**Change the default port.** This is not security through obscurity — it is noise reduction:

```
Port 2222
```

Moving off port 22 cuts log noise by 95%. Automated scanners hit port 22 first. You still need all the other controls, but your logs become readable and your alerting becomes meaningful. We use port 2222 across our fleet and document it in our internal runbook.

**Harden the cryptographic handshake.** Restrict to strong key exchange and cipher algorithms:

```
KexAlgorithms curve25519-sha256@libssh.org,diffie-hellman-group16-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
HostKeyAlgorithms ssh-ed25519
```

This disables legacy algorithms like diffie-hellman-group1-sha1 and aes128-cbc that have known weaknesses. Curve25519 is both faster and more secure than RSA-based key exchange. We validated compatibility with our CI/CD tooling before deploying this, and you should too.

**Set connection timeouts.** Do not let idle sessions sit open:

```
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 30
MaxAuthTries 3
MaxSessions 3
```

A failed login attempt gets 30 seconds and 3 tries. Active sessions ping every 5 minutes and disconnect after 2 missed pings. This closes abandoned connections and limits brute-force windows.

**Enable logging.** You need to see what is happening:

```
LogLevel VERBOSE
```

VERBOSE logging records key fingerprints, connection attempts, and session activity. Pipe this to a SIEM or use `fail2ban` to auto-block IPs after repeated failures. We run fail2ban with a 5-attempt threshold and a 1-hour ban — it handles 99% of brute-force noise without manual intervention.

**Deploy and test.** After applying changes:

```bash
sudo sshd -t
sudo systemctl restart sshd
```

The `sshd -t` command validates your config before restarting. We have seen teams lock themselves out by restarting with a syntax error. Always test first, always have console access as a fallback.

**The result.** After rolling this configuration across our fleet, SSH-related alert volume dropped to near zero. Failed login attempts still happen — they just get blocked at the network layer or by fail2ban before they reach our logs. The 47,000-attempt scenario is no longer possible.

SSH hardening is not a one-time task. Review your config quarterly, rotate keys on schedule, and audit `authorized_keys` files regularly. The attackers are automated. Your defenses should be too.

---

## 9. Posting Schedule

- **Frequency:** Once per day maximum. Quality over quantity. It is better to skip a day than post something thin.
- **Optimal posting window:** 8:00 AM - 12:00 PM EST. This captures the morning technical audience checking feeds before deep work begins.
- **Consistency matters more than timing.** If you cannot post at a consistent time, pick a window and stick with it.
- **Never post two articles in the same category on consecutive days.** Rotate between SECURITY, CRYPTO, and AI to maintain variety.

---

## 10. Quality Checklist

Before publishing any post, verify all of the following:

- [ ] **Category is correct** — Does the content fit the category scope defined in Section 4?
- [ ] **Length is appropriate** — 600-1200 words. 3-5 paragraphs minimum.
- [ ] **Title is specific and searchable** — No clickbait. A senior engineer would click this.
- [ ] **Excerpt is compelling** — 1-2 sentences that work as a standalone search snippet.
- [ ] **Hook paragraph establishes stakes** — Opens with a problem, stat, or real incident.
- [ ] **Specific details included** — At least two of: tool names/versions, config snippets, real metrics, infrastructure details, step-by-step procedures.
- [ ] **No hallucinated tools or versions** — Every tool name, version number, and metric is real and verifiable.
- [ ] **No corporate buzzwords** — No "leverage," "synergy," "holistic," "cutting-edge."
- [ ] **Voice matches guidelines** — Senior engineer tone, active voice, short sentences.
- [ ] **SEO basics covered** — Primary keyword in first paragraph and at least one H2. Heading hierarchy is correct.
- [ ] **Code blocks are properly formatted** — Language tags included where applicable.
- [ ] **Conclusion provides closure** — Does not trail off. States the takeaway or next step.
- [ ] **No references to AI companies or models** — Per posting rules in the original protocol.
- [ ] **Post teaches something or shares a real experience** — Not just opinion or speculation.
