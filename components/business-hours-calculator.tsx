"use client";

import { useState } from "react";

function parseMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatHours(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

export function BusinessHoursCalculator() {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState(60);
  const [daysPerWeek, setDaysPerWeek] = useState(5);

  const rawMinutes = Math.max(parseMinutes(endTime) - parseMinutes(startTime), 0);
  const dailyMinutes = Math.max(rawMinutes - breakMinutes, 0);
  const weeklyMinutes = dailyMinutes * daysPerWeek;
  const monthlyMinutes = Math.round((weeklyMinutes * 52) / 12);

  return (
    <section className="tool-calculator">
      <div className="tool-calculator__panel">
        <p className="tool-calculator__label">Input</p>
        <div className="tool-form">
          <label className="tool-field">
            <span>Start time</span>
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </label>

          <label className="tool-field">
            <span>End time</span>
            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </label>

          <label className="tool-field">
            <span>Break length</span>
            <input
              type="number"
              min="0"
              step="15"
              value={breakMinutes}
              onChange={(event) => setBreakMinutes(Number(event.target.value) || 0)}
            />
            <small>Minutes</small>
          </label>

          <label className="tool-field">
            <span>Working days per week</span>
            <input
              type="number"
              min="1"
              max="7"
              value={daysPerWeek}
              onChange={(event) => setDaysPerWeek(Number(event.target.value) || 1)}
            />
            <small>1 to 7 days</small>
          </label>
        </div>
      </div>

      <div className="tool-calculator__panel tool-calculator__panel--result">
        <p className="tool-calculator__label">Result</p>
        <div className="tool-metrics">
          <article className="tool-metric">
            <span className="tool-metric__name">Daily business hours</span>
            <strong>{formatHours(dailyMinutes)}</strong>
          </article>
          <article className="tool-metric">
            <span className="tool-metric__name">Weekly business hours</span>
            <strong>{formatHours(weeklyMinutes)}</strong>
          </article>
          <article className="tool-metric">
            <span className="tool-metric__name">Monthly estimate</span>
            <strong>{formatHours(monthlyMinutes)}</strong>
          </article>
        </div>
        <p className="tool-note">
          This gives a quick estimate based on your schedule. It subtracts one daily
          break from the total time between start and finish.
        </p>
      </div>
    </section>
  );
}
