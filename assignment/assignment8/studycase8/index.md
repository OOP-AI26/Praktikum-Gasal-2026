---
title: "Live Practicum 8"
layout: "default"
parent: "Assignment 8"
printtitle: "Live Practicum 8 - File handling, CSV, JSON, dan serialisasi object"
nav_order: 1
tampil: true
isdebug: false
assignment_id: "assignment8-kelas"
variant_version: 1
selection_mode: "kelas"
class_prompt: "Pilih kelas (2025A / 2025B / 2025C) untuk memuat Live Practicum 8."
class_options:
  - id: "2025A"
    title: "2025A - Inventaris Alat Laboratorium"
    variant_id: "v1"
  - id: "2025B"
    title: "2025B - Koleksi Buku Pojok Baca"
    variant_id: "v2"
  - id: "2025C"
    title: "2025C - Pendaftaran Workshop Kampus"
    variant_id: "v3"
unlock_at:
  "2025A": "2026-11-11T13:00:00+07:00"
  "2025B": "2026-11-13T13:00:00+07:00"
  "2025C": "2026-11-11T09:30:00+07:00"
variant_dir: "assignment/assignment8/studycase8/variants"
description_file: "assignment/assignment8/studycase8/description.md"
---

{% include pyodide-exercise.html id="assignment8-kelas" title="Memuat Live Practicum 8..." prompt="Pilih kelas sesuai kelas praktikum." %}
