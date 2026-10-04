---
title: "Live Practicum 4"
layout: "default"
parent: "Assignment 4"
printtitle: "Live Practicum 4 - Abstract Method dan Data Class"
nav_order: 1
tampil: true
isdebug: false
assignment_id: "assignment4-kelas"
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
  "2025A": "2026-10-07T11:30:00"
  "2025B": "2026-10-09T13:00:00"
  "2025C": "2026-10-07T09:30:00"
variant_dir: "assignment/assignment4/studycase4/variants"
description_file: "assignment/assignment4/studycase4/description.md"
---

{% include pyodide-exercise.html id="assignment4-kelas" title="Memuat study case kelas..." prompt="Pilih kelas untuk memuat study case." %}
