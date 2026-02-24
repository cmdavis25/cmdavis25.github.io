---
title: Comparing Pattern Discovery Algorithms -- Apriori vs FPGrowth
date: 2026-02-23
summary: Which algorithm should you use for your application?
---
## Introduction

Association rule mining — sometimes called frequent pattern mining or market basket analysis — is one of the oldest and most practically useful techniques in data science. The goal is simple: given a dataset of transactions (each a set of items), find which items tend to appear together, and express that as rules like "customers who buy bread and butter also tend to buy milk." Beyond retail, the same technique surfaces co-occurring symptoms in medical records, frequently requested permissions in security logs, and related tags in content platforms.

Two algorithms dominate this space: **Apriori** (Agrawal & Srikant, 1994) and **FP-Growth** (Han et al., 2000). Both are available in Python's `mlxtend` library with a nearly identical API. This post walks through the full workflow — encoding your data, running each algorithm, generating rules, and interpreting the results — and closes with a practical comparison to help you choose the right tool for your dataset.

---

## Setting Up: Installing mlxtend

If you don't already have `mlxtend` installed, add it alongside the usual data stack:

```bash
pip install mlxtend pandas
```

---

## Encoding Your Data for mlxtend

Both `apriori` and `fpgrowth` expect a **boolean DataFrame** — one row per transaction, one column per unique item, and `True`/`False` values indicating whether each item appeared in that transaction. Raw transaction lists need to be transformed before you can run either algorithm.

### Starting from a list of transactions

The most common raw format is a list of lists, where each inner list is one transaction:

```python
transactions = [
    ['milk', 'bread', 'butter'],
    ['bread', 'diapers', 'beer', 'eggs'],
    ['milk', 'diapers', 'beer', 'cola'],
    ['bread', 'milk', 'diapers', 'beer'],
    ['bread', 'milk', 'butter'],
]
```

`mlxtend` ships a `TransactionEncoder` that handles this cleanly:

```python
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder

te = TransactionEncoder()
te_array = te.fit(transactions).transform(transactions)
df = pd.DataFrame(te_array, columns=te.columns_)
print(df.astype(int))  # cast bool → int for readability
```

Output:

```
   beer  bread  butter  cola  diapers  eggs  milk
0     0      1       1     0        0     0     1
1     1      1       0     0        1     1     0
2     1      0       0     1        1     0     1
3     1      1       0     0        1     0     1
4     0      1       1     0        0     0     1
```

Each column is one item; each row is one transaction. `True` (displayed here as `1`) means the item was present.

### Starting from a pandas DataFrame

If your data is already in a DataFrame — say, with one row per order-item pair — you can pivot to the required shape using `pd.crosstab` or `pivot_table`:

```python
# Example: long-format DataFrame with columns ['order_id', 'item']
basket = (df_raw
    .assign(value=True)
    .pivot_table(index='order_id', columns='item', values='value', fill_value=False)
    .astype(bool))
```

Either way, the result is the same boolean DataFrame that both algorithms consume.

---

## The Apriori Algorithm

### How it works

Apriori uses a **generate-and-prune** strategy:

1. Count all single-item sets and keep those meeting `min_support`.
2. Join surviving itemsets to form candidates one size larger.
3. Prune any candidate containing a subset that failed the support threshold (the *anti-monotone* property: if an itemset is infrequent, all of its supersets must also be infrequent).
4. Repeat until no new frequent itemsets are found.

The anti-monotone property makes pruning powerful, but the algorithm still generates and tests a large number of candidates, and it requires multiple passes over the database — one per itemset size. On wide datasets with many unique items this becomes expensive.

### Finding frequent itemsets

```python
from mlxtend.frequent_patterns import apriori

frequent_itemsets = apriori(df, min_support=0.6, use_colnames=True)
print(frequent_itemsets.sort_values('support', ascending=False))
```

Output:

```
   support          itemsets
3      0.8           (bread)
6      0.8            (milk)
0      0.6            (beer)
2      0.6          (butter)
4      0.6         (diapers)
7      0.6     (bread, milk)
1      0.6    (beer, diapers)
5      0.6  (bread, milk, ...)
```

`min_support=0.6` means an itemset must appear in at least 60% of transactions (3 out of 5 here) to be retained.

### Generating association rules

Frequent itemsets are the building blocks; association rules are the actionable output. `association_rules()` works on any frequent itemset DataFrame — from either algorithm:

```python
from mlxtend.frequent_patterns import association_rules

rules = association_rules(frequent_itemsets, metric='confidence', min_threshold=0.7)
print(rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']]
      .sort_values('lift', ascending=False))
```

The `metric` parameter controls which measure is used for the minimum threshold filter. `'confidence'` is the most common starting point; `'lift'` is useful when you want to surface only rules that represent a genuinely stronger-than-chance association.

---

## The FP-Growth Algorithm

### How it works

FP-Growth avoids candidate generation entirely. Instead, it:

1. Makes two passes over the database to build a compact **FP-tree** — a prefix-tree representation of all transactions.
2. Mines the FP-tree recursively using *conditional pattern bases*, never generating explicit candidate itemsets.

Because the FP-tree compresses the database into memory and only two database scans are needed regardless of itemset depth, FP-Growth is significantly faster and less memory-intensive than Apriori on large, dense datasets.

### Finding frequent itemsets

The `mlxtend` API is a drop-in replacement:

```python
from mlxtend.frequent_patterns import fpgrowth

frequent_itemsets_fp = fpgrowth(df, min_support=0.6, use_colnames=True)
print(frequent_itemsets_fp.sort_values('support', ascending=False))
```

The output DataFrame has the same structure (`support`, `itemsets` columns) as Apriori's output. You can pass it directly to `association_rules()`:

```python
rules_fp = association_rules(frequent_itemsets_fp, metric='lift', min_threshold=1.2)
print(rules_fp[['antecedents', 'consequents', 'support', 'confidence', 'lift']]
      .sort_values('lift', ascending=False))
```

Both algorithms produce identical frequent itemsets (and therefore identical rules) given the same input and `min_support`. The only difference is computational efficiency.

---

## Reading the Output: Key Metrics

| Metric | Definition | Interpretation |
|--------|-----------|----------------|
| **Support** | P(A∪B) — fraction of transactions containing both A and B | How common is this combination? Low support = rare pattern. |
| **Confidence** | P(B\|A) = support(A∪B) / support(A) | If A is in the basket, how often is B also there? |
| **Lift** | confidence(A → B) / support(B) | How much more likely is B given A vs. by random chance? Lift > 1 = positive association; lift = 1 = independent; lift < 1 = negative association. |

**Practical guidance:**
- Start with a `min_support` that keeps results manageable — try 1–5% on real-world data (thousands of transactions).
- Use `confidence` as the primary filter, then sort by `lift` to surface the most surprising rules.
- Rules with high confidence but lift ≈ 1 mean the consequent is simply a popular item; lift separates genuinely useful rules from trivial ones.

---

## Apriori vs FP-Growth: When to Use Which

| | Apriori | FP-Growth |
|--|---------|-----------|
| Database scans | One per itemset size | 2 |
| Memory usage | High (explicit candidate set) | Lower (compressed FP-tree) |
| Speed on small datasets | Fine | Fine |
| Speed on large/dense datasets | Slow | Substantially faster |
| Conceptual simplicity | High | Moderate |
| mlxtend function | `apriori()` | `fpgrowth()` |
| Output format | Identical | Identical |

**Rule of thumb:** Default to FP-Growth. It handles the same range of problems with better performance at scale. Apriori remains useful as a teaching tool — its generate-and-prune logic is easier to trace step-by-step — and for tiny datasets where simplicity trumps efficiency.

---

## Conclusion

Both Apriori and FP-Growth solve the same problem and produce output in the same format, making them interchangeable from an API perspective. The `association_rules()` function works with either, so switching algorithms is a single-line change. In practice, FP-Growth is the sensible default for any dataset of meaningful size; Apriori earns its place in the classroom and in exploratory work on small samples where you want to reason clearly about what the algorithm is doing.

The most important levers are `min_support` (controls how many itemsets you mine) and `min_threshold` with your chosen `metric` in `association_rules()` (controls which rules survive). Tuning these to your domain — where "frequent" and "strong" mean something specific — is where the real analytical work happens.

---

## References

- Agrawal, R., & Srikant, R. (1994). Fast algorithms for mining association rules. *Proceedings of the 20th International Conference on Very Large Data Bases (VLDB)*, 487–499.
- Han, J., Pei, J., & Yin, Y. (2000). Mining frequent patterns without candidate generation. *Proceedings of the 2000 ACM SIGMOD International Conference on Management of Data*, 1–12.
