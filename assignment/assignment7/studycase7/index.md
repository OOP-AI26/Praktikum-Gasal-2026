---
title: "Live Practicum 7"
layout: "default"
parent: "Assignment 7"
printtitle: "Live Practicum 7 - Exceptions and robust error handling"
nav_order: 1
tampil: true
isdebug: false
assignment_id: "assignment7-kelas"
variant_version: 1
selection_mode: "kelas"
class_prompt: "Pilih kelas (2025A / 2025B / 2025C) untuk memuat Live Practicum 7."
class_options:
  - id: "2025A"
    title: "2025A - Dompet Kantin Kampus"
    variant_id: "v1"
  - id: "2025B"
    title: "2025B - Stok Rak Laboratorium"
    variant_id: "v2"
  - id: "2025C"
    title: "2025C - Kuota Tiket Seminar"
    variant_id: "v3"
unlock_at:
  "2025A": "2026-11-11T13:00:00+07:00"
  "2025B": "2026-11-13T13:00:00+07:00"
  "2025C": "2026-11-11T09:30:00+07:00"
variant_dir: "assignment/assignment7/studycase7/variants"
description_file: "assignment/assignment7/studycase7/description.md"
---

{% include pyodide-exercise.html id="assignment7-kelas" title="Memuat Live Practicum 7..." prompt="Pilih kelas sesuai jadwal praktikum." %}
