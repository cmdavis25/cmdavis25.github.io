---
title: NOAA Weather Data Lake
summary: S3-to-S3 pipeline ingesting NOAA's public climate archive into a queryable data lake, analyzed with Athena and Python.
thumbnail: assets/images/projects/noaa_weather_lake.png
tools: Python, boto3, AWS S3, AWS Glue, AWS Athena, pandas, pyarrow, SQL
github:
date: 2026-03-20
---

## Problem Statement

NOAA's Global Historical Climatology Network (GHCN) contains daily weather observations from over 100,000 stations worldwide, stretching back to the 1800s — hundreds of gigabytes of data updated every day. It already lives on a public AWS S3 bucket. But raw GHCN data is stored as fixed-width text files partitioned by station, making ad hoc analysis slow and awkward. Answering a question like "which U.S. cities have seen the most extreme heat days since 2000?" requires either downloading massive files locally or building something smarter.

## My Approach

This project builds a lightweight data lake pipeline that moves NOAA data from the public source bucket into a private, analysis-ready bucket — converting it to columnar Parquet format, partitioned by year and country, and registered in AWS Glue so it can be queried directly with Athena SQL. No database server. No local data warehouse. Just files in S3 and SQL on demand.

### Pipeline Architecture

1. **Extract** — Pull daily update files from `s3://noaa-ghcn-pds` using `boto3`, targeting a configurable date range or incremental daily updates
2. **Transform** — Parse fixed-width text into structured records with `pandas`, filter to desired observation types (TMAX, TMIN, PRCP, SNOW), and convert to Parquet with `pyarrow` using an efficient columnar schema
3. **Load** — Write partitioned Parquet files to a private S3 bucket (`s3://my-weather-lake/ghcn/year=YYYY/country=XX/`)
4. **Catalog** — Register the partition schema in AWS Glue so Athena can discover and query it with standard SQL
5. **Analyze** — Run analytical queries directly in Athena; pull results into Python for visualization

### Key Technical Details

- **S3-to-S3 transfer** — Data never touches local disk; pulled and transformed entirely in memory using streaming reads, mirroring a real enterprise ingestion pattern
- **Parquet + partitioning** — Columnar storage reduces Athena query costs and scan time dramatically vs. raw CSV
- **Incremental updates** — Pipeline detects which daily files have already been ingested and only processes new arrivals
- **SQL showcase** — Athena queries demonstrate window functions (ranking stations by anomaly), aggregations (decade-over-decade trend comparison), and cross-partition scans

### Sample Analyses

- Hottest and coldest years on record by U.S. state
- Decade-over-decade shift in average first frost date by region
- Station-level precipitation anomaly ranking (window functions)
- Rolling 30-year baseline vs. recent 10-year average temperature comparison

## Tech Stack

- **Python 3.10+** — Core language
- **boto3** — AWS SDK for S3 reads/writes and Glue catalog management
- **pandas + pyarrow** — Parsing, transformation, and Parquet serialization
- **AWS S3** — Source (public NOAA bucket) and destination (private data lake bucket)
- **AWS Glue** — Schema catalog and partition registration
- **AWS Athena** — Serverless SQL queries directly on S3 Parquet files
- **SQL** — Window functions, CTEs, aggregations, date arithmetic

## Outcome

A fully automated, cloud-native pipeline that ingests one of the world's largest public climate datasets into a queryable data lake — demonstrating S3 as infrastructure, not just file storage. The pipeline runs within the AWS free tier for moderate query volumes and can be extended to a Lambda-triggered daily refresh with no architectural changes.
