import schedule from "../schedule.json"

export async function getSchedule() {
  try {
    let res = await fetch("https://fcschedulecorsproxy.lapishusky.dev/schedule_data/fc2026-schedule.json");
    res = await res.json();
    return res.entries;
  } catch (error) {
    console.error(error);
    return schedule.entries;
  }
}