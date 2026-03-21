---
title: MLB Statcast Data Lake
summary: Cloud pipeline ingesting pitch-by-pitch Statcast data into S3, queryable with Athena SQL — no database server required.
thumbnail: assets/images/projects/statcast_lake.png
tools: Python, pybaseball, boto3, AWS S3, AWS Glue, AWS Athena, pandas, pyarrow, SQL
github:
date: 2026-03-20
---

## Problem Statement

MLB Statcast tracks every pitch, batted ball, and player movement at 30 frames per second — generating millions of records per season with sub-inch precision. The `pybaseball` library makes this data freely accessible with no API key and no rate limits, but a full multi-season pull is gigabytes of data that overwhelms local workflows. Storing it in a relational database is overkill for exploratory analysis. The question: can a single analyst stand up a scalable, SQL-queryable baseball analytics platform entirely within the AWS free tier?

## My Approach

This project ingests Statcast pitch-by-pitch data into a private S3 data lake, converts it to Parquet, registers it in AWS Glue, and queries it with Athena — enabling fast, cost-efficient SQL analytics across multiple seasons of data without a single running server.

### Pipeline Architecture

1. **Extract** — Pull Statcast data by date range using `pybaseball.statcast()`, which returns clean DataFrames with no authentication required
2. **Transform** — Standardize column types, drop sparse columns, derive useful fields (pitch result categories, count state, plate appearance outcomes), and serialize to Parquet with `pyarrow`
3. **Load** — Write to S3 partitioned by season and team (`s3://my-statcast-lake/pitches/season=YYYY/team=XXX/`) for efficient partition pruning
4. **Catalog** — Register schema in AWS Glue; Athena reads partition metadata to avoid full-table scans
5. **Analyze** — Run SQL in Athena; pull result sets into Python for visualization and modeling

### Key Technical Details

- **Incremental ingestion** — Tracks last-loaded game date in S3 metadata; daily runs during the season append only new games
- **Partition pruning** — Queries scoped to a single team or season scan a small fraction of total data, keeping Athena costs near zero
- **SQL showcase** — Queries demonstrate window functions (pitcher ERA+ ranked within season), CTEs (multi-step plate appearance aggregation), and joins (pitcher vs. batter matchup history)
- **Volume** — A full 2015–2024 historical load produces 8–10M rows, validating the "big data on a budget" premise

### Sample Analyses

- Swinging strike rate by pitch type and count state (aggregation + filtering)
- Pitcher velocity trend across a season — fatigue proxy (window functions over game date)
- Exit velocity and launch angle distributions by batter handedness (histogram analysis)
- Most effective pitch sequences leading to strikeouts (sequence pattern mining — ties to association rules work)
- Umpire called-strike accuracy by zone location (spatial analysis with matplotlib)

## Tech Stack

- **Python 3.10+** — Core language
- **pybaseball** — No-auth Statcast data access
- **boto3** — S3 writes and Glue catalog management
- **pandas + pyarrow** — Transformation and Parquet serialization
- **AWS S3** — Partitioned Parquet data lake storage
- **AWS Glue** — Schema catalog and partition registration
- **AWS Athena** — Serverless SQL on S3
- **SQL** — Window functions, CTEs, aggregations, sequence analysis
- **matplotlib / seaborn** — Visualization of query results

## Outcome

A self-service baseball analytics platform built entirely on serverless AWS infrastructure and free public data. The project demonstrates that a single analyst can stand up a scalable, SQL-queryable data lake — handling tens of millions of rows — within the AWS free tier, with no running servers and no licensing costs. The pipeline architecture directly mirrors production data lake patterns used at companies like Netflix, Airbnb, and major sports franchises.
