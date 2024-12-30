import schedule from "../schedule.json"

export async function getSchedule() {
  return schedule.entries
}