---
title: "Live Practicum 3"
layout: "default"
parent: "Assignment 3"
printtitle: "Live Practicum 3 - Inheritance"
nav_order: 1
tampil: true
isdebug: false
assignment_id: "assignment3-kelas"
variant_version: 1
selection_mode: "kelas"
class_prompt: "Pilih kelas untuk memuat study case."
class_options:
  - id: "2025A"
    title: "2025A - Study Case 1"
    variant_id: "v1"
  - id: "2025B"
    title: "2025B - Study Case 2"
    variant_id: "v2"
  - id: "2025C"
    title: "2025C - Study Case 3"
    variant_id: "v3"
unlock_at:
  "2025A": "2026-09-30T11:30:00"
  "2025B": "2026-10-02T13:00:00"
  "2025C": "2026-09-30T09:30:00"
variant_dir: "assignment/assignment3/studycase3/variants"
description_file: "assignment/assignment3/studycase3/description.md"
---

{% include pyodide-exercise.html id="assignment3-kelas" title="Memuat study case kelas..." prompt="Pilih kelas untuk memuat study case." %}
