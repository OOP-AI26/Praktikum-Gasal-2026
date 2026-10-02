document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("#weekly-schedule table");

  if (!table) return;

  // Kramdown may place the class on the wrapper instead of the generated table.
  // Add it here so the shared table keeps the same styling on Home and Calendar.
  table.classList.add("schedule-table");

  const calendar = document.querySelector("[data-calendar-grid]");
  const classSchedule = document.querySelector("#class-schedule");
  if (calendar) {
    // Read every row before the table's existing rowspan cleanup removes a cell.
    buildCalendar(calendar, table, classSchedule);
  }

  mergeRepeatedAssignments(table);
});

function mergeRepeatedAssignments(table) {
  const rows = table.querySelectorAll("tbody tr");
  if (rows.length < 2) return;

  const firstAssignment = rows[0].children[4];
  const secondAssignment = rows[1].children[4];

  if (!firstAssignment || !secondAssignment) return;

  firstAssignment.rowSpan = 2;
  secondAssignment.remove();
}

function buildCalendar(calendar, table, classSchedule) {
  const status = document.querySelector("[data-calendar-status]");
  const details = document.querySelector("[data-calendar-details]");
  const source = table.closest("#weekly-schedule");
  const calendarShell = calendar.closest(".course-calendar");
  const year = Number(calendarShell?.dataset.calendarYear) || 2026;
  const events = readScheduleEvents(table, year, classSchedule);

  if (!events.length) {
    if (status) status.textContent = "No dated events were found in the schedule.";
    return;
  }

  const eventsByDate = groupEventsByDate(events);
  const firstEventDate = new Date(events[0].date);
  let viewDate = new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1);
  let selectedKey = events[0].key;

  const previousButton = document.querySelector("[data-calendar-prev]");
  const nextButton = document.querySelector("[data-calendar-next]");
  const todayButton = document.querySelector("[data-calendar-today]");

  function render() {
    calendar.replaceChildren();
    calendar.setAttribute("aria-label", formatMonth(viewDate));

    if (status) status.textContent = formatMonth(viewDate);

    const weekdays = document.createElement("div");
    weekdays.className = "calendar-weekdays";
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].forEach((day) => {
      const weekday = document.createElement("span");
      weekday.textContent = day;
      weekday.dataset.short = day.slice(0, 3);
      weekday.setAttribute("aria-hidden", "true");
      weekdays.appendChild(weekday);
    });
    calendar.appendChild(weekdays);

    const days = document.createElement("div");
    days.className = "calendar-days";
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const mondayFirstOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const cellCount = Math.max(35, Math.ceil((mondayFirstOffset + daysInMonth) / 7) * 7);

    for (let index = 0; index < cellCount; index += 1) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), index - mondayFirstOffset + 1);
      const key = dateKey(date);
      const dayEvents = eventsByDate.get(key) || [];
      const isCurrentMonth = date.getMonth() === viewDate.getMonth();
      const day = document.createElement(dayEvents.length ? "button" : "div");

      day.className = `calendar-day${isCurrentMonth ? "" : " is-outside"}${dayEvents.length ? " has-events" : ""}${key === selectedKey ? " is-selected" : ""}`;
      if (dayEvents.length) {
        day.type = "button";
        day.setAttribute("aria-label", `${formatDate(date)}: ${dayEvents.map(eventSummary).join(", ")}`);
        day.addEventListener("click", () => {
          selectedKey = key;
          render();
          showDetails(dayEvents, date, details);
        });
      }

      const number = document.createElement("span");
      number.className = "calendar-day__number";
      number.textContent = String(date.getDate());
      day.appendChild(number);

      if (dayEvents.length) {
        const eventList = document.createElement("span");
        eventList.className = "calendar-day__events";
        dayEvents.forEach((event) => {
          const item = document.createElement("span");
          item.className = `calendar-event calendar-event--${event.type}`;
          item.title = eventSummary(event);

          const marker = document.createElement("span");
          marker.className = "calendar-event__marker";
          marker.setAttribute("aria-hidden", "true");
          item.appendChild(marker);

          const content = document.createElement("span");
          content.className = "calendar-event__content";

          const label = document.createElement("span");
          label.className = "calendar-event__title";
          label.textContent = event.topic;
          content.appendChild(label);

          if (event.type === "class") {
            (event.sessions || []).forEach((sessionData) => {
              const session = document.createElement("span");
              session.className = "calendar-event__session";

              const className = document.createElement("span");
              className.className = "calendar-event__class";
              className.textContent = sessionData.className;
              session.appendChild(className);

              const time = document.createElement("span");
              time.className = "calendar-event__time";
              time.textContent = sessionData.time;
              session.appendChild(time);

              const room = document.createElement("span");
              room.className = "calendar-event__room";
              room.textContent = sessionData.location ? `Room ${sessionData.location}` : "";
              session.appendChild(room);

              content.appendChild(session);
            });
          }

          item.appendChild(content);

          eventList.appendChild(item);
        });
        day.appendChild(eventList);
      }

      days.appendChild(day);
    }

    calendar.appendChild(days);
  }

  previousButton?.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    selectedKey = null;
    render();
    clearDetails(details);
  });

  nextButton?.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    selectedKey = null;
    render();
    clearDetails(details);
  });

  todayButton?.addEventListener("click", () => {
    const today = new Date();
    viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    selectedKey = dateKey(today);
    render();
    const todayEvents = eventsByDate.get(selectedKey) || [];
    if (todayEvents.length) {
      showDetails(todayEvents, today, details);
    } else {
      clearDetails(details, "There are no scheduled events on this date.");
    }
  });

  render();
  showDetails(eventsByDate.get(selectedKey) || [], firstEventDate, details);
  source?.classList.add("calendar-source");
}

function readScheduleEvents(table, year, classSchedule) {
  const events = [];
  table.querySelectorAll("tbody tr").forEach((row) => {
    const cells = row.children;
    if (cells.length < 6) return;

    const week = cells[0].textContent.trim();
    const topic = cells[2].querySelector("strong")?.textContent.trim() || cells[2].textContent.trim();
    const dateLines = cellLines(cells[1]);
    const dates = dateLines.flatMap((line) => parseDates(line, year));
    const fallbackDates = dates.length ? dates : parseDates(cells[1].textContent, year);

    // A row can contain two sessions joined by a line break, so retain both dates.
    // The fallback also handles browsers that normalize the generated table markup.
    const sessionDates = fallbackDates.length ? fallbackDates : dates;

    sessionDates.forEach((date, index) => {
      const sessionLine = dateLines[index] || formatDate(date);
      const sessions = getClassSessionInfo(sessionLine, classSchedule);
      const fallback = getSessionRoom(sessionLine);
      const sessionList = sessions.length ? sessions : fallback.classes.map((className) => ({
        className,
        time: "",
        location: fallback.location,
      }));

      events.push({
        date,
        key: dateKey(date),
        type: "class",
        week,
        topic,
        meta: sessionLine,
        sessions: sessionList,
        time: sessionList.map((session) => session.time).filter(Boolean).join(", "),
        classes: sessionList.map((session) => session.className).filter(Boolean),
        location: [...new Set(sessionList.map((session) => session.location).filter(Boolean))].join(", "),
        topicCell: cells[2],
        readingCell: cells[4],
        assignmentCell: cells[5],
      });
    });

    parseDates(cells[3].textContent, year).forEach((date) => {
      events.push({
        date,
        key: dateKey(date),
        type: "discussion",
        week,
        topic: "Discussion",
        meta: cells[3].textContent.trim(),
        discussionCell: cells[3],
        topicCell: cells[2],
      });
    });
  });

  return events.sort((a, b) => a.date - b.date);
}

function cellLines(cell) {
  const lines = [""];
  cell.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") {
      lines.push("");
    } else {
      lines[lines.length - 1] += node.textContent || "";
    }
  });
  return lines.map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
}

function parseDates(text, year) {
  // Accept both the English abbreviations used by older rows and Indonesian
  // abbreviations such as "Okt" in newly added discussion dates.
  const datePattern = /\b(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)[a-z]*,?\s+(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Mei|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Agu(?:stus)?|Sep(?:t|tember)?|Oct(?:ober)?|Okt(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|Des(?:ember)?)\b/gi;
  const monthAliases = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    mei: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    agu: 7,
    sep: 8,
    oct: 9,
    okt: 9,
    nov: 10,
    dec: 11,
    des: 11,
  };
  const dates = [];
  let match;

  while ((match = datePattern.exec(text)) !== null) {
    const month = monthAliases[match[2].slice(0, 3).toLowerCase()];
    const day = Number(match[1]);
    const date = new Date(year, month, day);
    if (month !== undefined && date.getMonth() === month && date.getDate() === day) {
      dates.push(date);
    }
  }

  return dates;
}

function getClassSessionInfo(sessionLine, classSchedule) {
  if (!classSchedule) return [];

  const scheduleSessions = [...classSchedule.querySelectorAll("tbody td")].map((cell) => {
    const lines = cellLines(cell);
    const className = cell.textContent.match(/\b\d{4}[A-Z]\b/)?.[0] || "";
    const location = cell.textContent.match(/Location:\s*([^\n]+)/i)?.[1]?.trim() || "";
    const time = lines.find((line) => /\d{1,2}:\d{2}\s*[-–]\s*\d{1,2}:\d{2}/.test(line)) || "";
    return { className, location, time };
  });

  const classes = [...sessionLine.matchAll(/\b\d{4}[A-Z]\b/g)].map((match) => match[0]);
  return classes.map((className) => scheduleSessions.find((session) => session.className === className) || {
    className,
    location: "",
    time: "",
  });
}

function eventSummary(event) {
  if (event.type === "discussion") return event.topic;
  return [event.topic, formatSessions(event.sessions)]
    .filter(Boolean)
    .join(" · ");
}

function formatSession(session) {
  return [
    session.className,
    session.time,
    session.location ? `Room ${session.location}` : "",
  ].filter(Boolean).join(" · ");
}

function formatSessions(sessions) {
  return (sessions || []).map(formatSession).filter(Boolean).join("; ");
}

function getSessionRoom(sessionLine) {
  const classes = [...sessionLine.matchAll(/\b\d{4}[A-Z]\b/g)].map((match) => match[0]);
  const locations = [...new Set(classes.map((className) => ({
    "2025A": "C01.04.03",
    "2025B": "C01.03.03",
    "2025C": "C01.04.03",
  }[className])).filter(Boolean))];

  return {
    classes,
    location: locations.join(", "),
  };
}

function groupEventsByDate(events) {
  return events.reduce((groups, event) => {
    if (!groups.has(event.key)) groups.set(event.key, []);
    groups.get(event.key).push(event);
    return groups;
  }, new Map());
}

function showDetails(events, date, details) {
  if (!details) return;
  details.replaceChildren();

  if (!events.length) {
    clearDetails(details);
    return;
  }

  const heading = document.createElement("h3");
  heading.textContent = formatDate(date);
  details.appendChild(heading);

  events.forEach((event) => {
    const article = document.createElement("article");
    article.className = `calendar-detail calendar-detail--${event.type}`;

    const type = document.createElement("p");
    type.className = "calendar-detail__type";
    type.textContent = `${event.week} · ${event.type === "discussion" ? "Discussion" : "Practicum session"}`;
    article.appendChild(type);

    const title = document.createElement("h4");
    title.textContent = event.topic;
    article.appendChild(title);

    const session = document.createElement("p");
    session.className = "calendar-detail__session";
    session.textContent = event.type === "discussion" ? event.meta : event.meta;
    article.appendChild(session);

    if (event.type === "discussion") {
      appendField(article, "Discussion details", event.discussionCell);
      appendField(article, "Topic", event.topicCell);
    } else {
      if (event.sessions?.length) {
        appendTextField(article, "Class / time / room", formatSessions(event.sessions));
      }
      appendField(article, "Topic and materials", event.topicCell);
      appendField(article, "Reading", event.readingCell);
      appendField(article, "Practicum assignment", event.assignmentCell);
    }

    details.appendChild(article);
  });
}

function appendTextField(parent, labelText, text) {
  if (!text) return;
  const field = document.createElement("div");
  field.className = "calendar-detail__field";

  const label = document.createElement("span");
  label.className = "calendar-detail__label";
  label.textContent = labelText;
  field.appendChild(label);

  const value = document.createElement("div");
  value.className = "calendar-detail__value";
  value.textContent = text;
  field.appendChild(value);
  parent.appendChild(field);
}

function appendField(parent, labelText, cell) {
  if (!cell) return;
  const field = document.createElement("div");
  field.className = "calendar-detail__field";

  const label = document.createElement("span");
  label.className = "calendar-detail__label";
  label.textContent = labelText;
  field.appendChild(label);

  const value = document.createElement("div");
  value.className = "calendar-detail__value";
  Array.from(cell.childNodes).forEach((node) => value.appendChild(node.cloneNode(true)));
  field.appendChild(value);
  parent.appendChild(field);
}

function clearDetails(details, message = "Select a date with an event to view the details.") {
  if (!details) return;
  details.replaceChildren();
  const empty = document.createElement("p");
  empty.className = "calendar-empty";
  empty.textContent = message;
  details.appendChild(empty);
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatMonth(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
