# Agent Instructions (AGENTS.md)

This file contains invariants and constraints for any AI coding agent (like Google Antigravity/AGY) working on the New Sobat Komputer V2 repository.

## Project Invariants & Scope Boundaries

1. **No Frameworks/Build Tools:** This is a zero-build static site. Do not add React, Astro, Tailwind, Vite, npm, etc.
2. **No Backend/Database:** Do not add APIs or dynamic data endpoints.
3. **No Unverified Data:** Do not add fake Google rating metrics, fabricated review quotes, or placeholder statistics. Keep them commented out or hidden until the owner provides real data.
4. **No Git Push:** Do not push to remote, modify GitHub Pages settings, or alter remotes without explicit user instruction.
5. **No Pricing:** Do not publish service or product prices.
6. **No-JS Baseline:** The site must remain usable if JavaScript is disabled. Keep core navigation and content accessible.
7. **Business Links:** Preserve the existing WhatsApp number (+62 857-4274-4594) and Maps coordinates.

## Verified Validation Commands

Run these checks to validate your changes locally:

```bash
# 1. Check for trailing whitespaces and basic git diff errors
git diff --check

# 2. Check for broken anchor links in index.html
node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const ids=[...h.matchAll(/\bid=\"([^\"]+)\"/g)].map(m=>m[1]);const anchors=[...h.matchAll(/href=\"#([^\"]+)\"/g)].map(m=>m[1]);if(anchors.some(id=>!ids.includes(id)))process.exit(1)"
```

## Release Workflow

Once your tasks are complete, run the validation commands above. If they pass, report the readiness to the owner so they can merge and deploy via GitHub Pages.
