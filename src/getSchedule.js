import schedule from "../schedule.json"

export async function getSchedule() {
  try {
    let res = await fetch("https://fcschedulecorsproxy.lapishusky.dev/schedule_data/fc2026-schedule.json");
    res = await res.json();
    return res.entries;
  } catch (error) {
    console.error(error);
    alert("There was a problem loading the current schedule. A (possibly) outdated one will be displayed. Try again later or report this issue if it persists.");
    return schedule.entries;
  }
}