# INSTRUCTIONS FOR CODEX

Pack 1.0.1 / schema 1.1.0

1. Treat this handoff pack as the normalized academic specification for DelftStudy. Do not reinterpret all 90 PDFs from scratch unless an item is explicitly UNKNOWN, UNVERIFIED, PARTIALLY_UNVERIFIED, or page/visual verification is required.
2. Keep subject_id, topic_id, subtopic_id, skill_id, document_id, assessment_id, question_type_id, pattern_id, error_tag, and relationship identifiers immutable once persisted. Migrations must preserve referential integrity.
3. Use subject/course associations from the pack. Never infer a cross-course association from similar terminology.
4. Preserve document_type, official_status, evidence_era, current_style_weight, filename_year_label, internal_date, and solution_included as distinct fields. Never count OFFICIAL_PRACTICE_MATERIAL as an observed official sitting.
5. For current exam-style generation, prefer CURRENT evidence, then RECENT evidence. HISTORICAL evidence may supply mechanisms only when still corroborated. Do not silently revive obsolete assessment formats.
6. Any question with mapping_granularity=UNVERIFIED_OR_DRILL_ONLY, or an explicitly PARTIALLY_UNVERIFIED/LOW/UNVERIFIED mapping, must have can_generate_variants=false, must not be used as a source-derived generation template, must not update individual skill mastery, must not contribute weighted exam-readiness, and must not contribute verified topic/skill historical-frequency counts.
7. Do not convert UNKNOWN/UNVERIFIED source locator, difficulty component, future weighting, or future exam content into numeric/factual values. UNKNOWN is a valid data state. A whole-document page range is document-level provenance, not exact page-level provenance.
8. Respect mapping_granularity, skill_mastery_update_policy, historical_topic_frequency_eligible, historical_skill_frequency_eligible, and exam_readiness_eligible. Broad topic mappings may not award mastery to every child skill. Integrated IP programs require rubric/test decomposition before per-skill credit.
9. Historical_frequency counts UNIQUE assessment documents. by_assessment_type must also count UNIQUE assessment documents per type. Historical frequency is not a forecast and must never be treated as a future-exam probability.
10. Mastery must be based on demonstrated performance, not lecture/page completion. Keep learning_mastery and exam_mastery/readiness separate.
11. IP exam-readiness must include integrated program evidence (domain model + parsing + processing/CLI + relevant quality/testing requirements). Theory-only or code-prediction-only evidence is insufficient.
12. CO exam-readiness must include calculation/tracing/open explanation across early and late course clusters; do not infer readiness from one subsystem only.
13. R&L exam-readiness must include open formalization/model/countermodel/proof/induction-or-invariant evidence. MCQ-only evidence is insufficient.
14. Question generation must create new surface instances with the same verified academic mechanism/difficulty. Never copy real exam wording or data verbatim. no_verbatim_exam_copy=true.
15. Use deterministic validators only where a unique/oracle answer is reliable. Use rubric grading for proofs, open explanations, model construction and other multi-valid-answer tasks; use compile/tests/requirements for IP implementation.
16. If a task depends on geometry/diagrams not fully represented in parsed text, require the source page image or a verified reconstructed template; do not invent diagram geometry.
17. The existing x86-64 Assembly Visualizer belongs under CO_T06_ASSEMBLY_X86_64. Preserve its working engine/UI and integrate it as one Computer Organisation tool rather than making Assembly the whole course.
18. Do not expose a predicted TU Delft grade as a certainty. exam_readiness is an evidence index with confidence and coverage, not an official mark.
19. The handoff JSON contains source-document records and hashes, NOT the 90 source PDF binaries or full PDF text. If Codex needs to verify a diagram, exact wording, or unresolved locator, the original PDF must be supplied/accessed separately.
20. Run the schema validation plus the semantic integrity checks in FINAL_VALIDATION_REPORT after any migration/edit. A pack with broken refs, duplicate IDs/edges, invalid prerequisite refs, uncertainty-policy contradictions, frequency leakage, or manifest/checksum mismatch is not production-safe.