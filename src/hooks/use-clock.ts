"use client"

import { useEffect, useState } from "react"

export interface ClockState {
  time: string // "9:41"
  period: string // "AM" | "PM"
  date: string // "Monday, June 3"
}

function format(d: Date): ClockState {
  const h = d.getHours()
  const m = d.getMinutes()
  const period = h >= 12 ? "PM" : "AM"
  let h12 = h % 12
  if (h12 === 0) h12 = 12
  const time = `${h12}:${m.toString().padStart(2, "0")}`
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const date = `${weekdays[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`
  return { time, period, date }
}

/** Live-updating clock, ticking every second. */
export function useClock(): ClockState {
  const [now, setNow] = useState<ClockState>(() => format(new Date()))

  useEffect(() => {
    const tick = () => setNow(format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return now
}
