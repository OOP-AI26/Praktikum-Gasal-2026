---
title: Calendar
layout: default
nav_order: 2
has_toc: false
---

# Calendar

Halaman ini menyediakan kalender praktikum yang mencakup jadwal mingguan, topik, dan kegiatan penting selama praktikum berlangsung.

<div class="calendar-session-source" aria-hidden="true">
  {% include class-schedule.md %}
</div>

<section class="course-calendar" data-calendar-year="2026" aria-labelledby="calendar-heading">
  <div class="course-calendar__toolbar">
    <div>
      <p class="course-calendar__eyebrow">Semester Gasal 2026</p>
      <h2 id="calendar-heading">Practicum calendar</h2>
      <p class="course-calendar__hint">Select a date to see its class sessions, topics, and linked materials.</p>
    </div>
    <div class="course-calendar__controls" aria-label="Calendar navigation">
      <button class="calendar-control" type="button" data-calendar-prev aria-label="Previous month">‹</button>
      <button class="calendar-today" type="button" data-calendar-today>Today</button>
      <button class="calendar-control" type="button" data-calendar-next aria-label="Next month">›</button>
    </div>
  </div>

  <div class="course-calendar__status" data-calendar-status role="status" aria-live="polite"></div>
  <div class="course-calendar__legend" aria-label="Calendar legend">
    <span><i class="calendar-legend__swatch calendar-legend__swatch--class" aria-hidden="true"></i>Practicum session</span>
    <span><i class="calendar-legend__swatch calendar-legend__swatch--discussion" aria-hidden="true"></i>Discussion</span>
  </div>
  <div class="course-calendar__grid" data-calendar-grid aria-label="Monthly calendar"></div>
  <aside class="course-calendar__details" data-calendar-details aria-live="polite">
    <p class="calendar-empty">Select a date with an event to view the details.</p>
  </aside>
</section>

<!-- The shared weekly schedule remains in the DOM as the single topic/event source. -->
{% include course-schedule.md calendar_source=true %}
