# Patch 7 asset diagnosis and bounded budget update

| Metric (bytes) | Accepted Patch 6 | 112-item checkpoint | Final 212 items | Final delta from Patch 6 |
|---|---:|---:|---:|---:|
| Initial JS | 507455 | 508745 | 510265 | 2810 |
| Initial gzip | 134670 | 134813 | 134964 | 294 |
| Total non-HTML assets | 1918056 | 2120695 | 2245349 | 327293 |
| Total asset gzip | 557263 | 595183 | 626886 | 69623 |
| CSS | 91364 | 91846 | 91917 | 553 |

The added 100 activities increase total assets by 124,654 bytes from the already tested 112-item checkpoint. Final growth is fully attributed below; same-named chunks are aggregated before comparison so multiple course `TopicContent` chunks are not lost. Machine-readable attribution: [asset deltas](maintenance-patch-7-asset-deltas.json).

| Emitted asset group | Before | After | Delta |
|---|---:|---:|---:|
| assets/CompletionGuides.js | 0 | 73558 | 73558 |
| assets/ExerciseParts.css | 1746 | 2069 | 323 |
| assets/ExerciseParts.js | 11548 | 13326 | 1778 |
| assets/GuidedPractice.js | 2049 | 2045 | -4 |
| assets/TopicContent.js | 12958 | 26433 | 13475 |
| assets/TopicPractice.js | 1704 | 1811 | 107 |
| assets/index.css | 79335 | 79565 | 230 |
| assets/index.js | 507455 | 510265 | 2810 |
| assets/service.js | 159517 | 394533 | 235016 |

All six expansion JSON modules (`practice`, `ip`, `co`, `guided`, `completion`, `completion-guided`) have exactly one owner, outside the initial import graph. New objective definitions share the existing lazy Practice service; 62 new guides have their own lazy CompletionGuides chunk. Initial changes are small capability counts and route dispatch. Existing course lesson/tool/exam/cloud lazy guards all pass. The shared Practice catalogue has always covered all courses; this is route-level loading, not a new promise of per-course exercise fetching.

Classification: legitimate lazy content growth YES; harmful initial growth NO; duplicated expansion modules NO; unexpectedly eager exercise data NO. No raw source PDFs, archives, verification fixtures or reports are emitted. No framework, Vite architecture, compression/obfuscation or runtime question generation was introduced.

Under the user’s explicit conditional authorization, the total asset ceiling changes from **2,000,000 → 2,200,000 at the 112-item checkpoint → 2,300,000 bytes at 212 items**. The final build leaves 54,651 bytes (2.38%) headroom. The intermediate 2.2 MB guard correctly rejected the expanded content at 2,245,349 bytes before the measured adjustment. Initial JS 520,000, initial gzip 140,000 and CSS 95,000 ceilings remain unchanged; six single-owner/non-initial assertions prevent future accidental eager imports or duplication. This finite allowance does not waive content or preservation checks.
