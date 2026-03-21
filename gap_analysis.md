# Portfolio Gap Analysis: Tech Stack & Skills

**Date:** March 20, 2026
**Subject:** Gaps between listed skills and demonstrated portfolio evidence

---

## What's Well-Represented

The portfolio already demonstrates: Python (pandas, numpy, matplotlib, scikit-learn), SQL, statistical modeling (PCA, clustering, DOE), data visualization, pattern mining, and GUI tooling (PyQt). These are consistent and credible across blog posts and projects.

---

## Gaps Worth Addressing

### 1. Cloud / Data Infrastructure (High Priority)

The tech stack lists "Infrastructure: Git, HPC, ERP" — but nothing cloud-native. Data roles in 2025 almost universally expect at least familiarity with AWS, GCP, or Azure (S3/BigQuery/Blob storage, basic compute). Even one project showing data pulled from cloud storage or a notebook deployed to the cloud would help significantly. This is the biggest gap relative to job postings.

### 2. ML Ops / Reproducibility Tooling

No mention of: virtual environments (venv/conda), `requirements.txt`/`pyproject.toml`, or experiment tracking (MLflow, W&B). The blog posts have good code but don't show the "productionization" mindset employers look for in Analyst/Engineer hybrids. Adding environment management tools to tech_stack.md costs nothing.

### 3. Data Pipeline / Orchestration

"Data Pipeline Design" appears in skills.md but there is no supporting evidence — no project or post demonstrates Airflow, dbt, Prefect, or even a well-structured ETL script. This claim is currently unsupported. Either add a project or soften the language to "pipeline thinking / ETL pattern design."

### 4. SQL Depth is Invisible

SQL is listed first in the languages section, which signals priority — but none of the blog posts or projects showcase it prominently. The Instacart project uses SQLite3 but doesn't feature SQL as a skill. A post on window functions, CTEs, or query optimization would make SQL feel real, not just listed.

### 5. Supervised ML / Predictive Modeling

The blog posts cover unsupervised methods well (clustering, PCA, association rules) but there is no regression, classification, or time-series work shown. The value proposition mentions "statistical modeling" broadly, but a concrete post on a regression or classification problem would round out the ML narrative — especially for Data Scientist roles.

### 6. NLP is Listed but Invisible

NLP appears in tech_stack.md with no supporting content anywhere in the portfolio. Either remove it or add even a lightweight post (e.g., TF-IDF on text data, basic sentiment analysis). Listed-but-undemonstrated tools hurt credibility.

### 7. Tableau / Power BI are Unverifiable

Tableau and Power BI are listed but nothing in the portfolio links to a Tableau Public dashboard or features either tool in a project. Even a screenshot or external link would help establish credibility.

---

## Recommended Actions (Prioritized)

| Priority | Action | Effort |
|----------|--------|--------|
| High | Add a supervised ML blog post (regression or classification with real data) | Medium |
| High | Either demonstrate NLP or remove it from tech_stack.md | Low |
| High | Add cloud tool(s) to tech_stack.md — even if just "AWS S3 (data storage)" | Low |
| Medium | Add a SQL-focused blog post (window functions / CTEs) | Medium |
| Medium | Add environment/reproducibility tools (conda, venv) to tech_stack.md | Low |
| Low | Soften "Data Pipeline Design" or back it up with a project/post | Low |
| Low | Link to a Tableau Public dashboard or add a screenshot in a project | Low |

---

## Quick Wins

The two changes with the best ROI for minimal effort:

- **Remove or support NLP** — an unverifiable claim does more harm than good
- **Add cloud exposure** — even listing a tool used to pull data from S3 or BigQuery signals modern data workflow awareness
