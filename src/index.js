import { SchedulePanel } from "./SchedulePanel.js"
import { getSchedule } from "./getSchedule.js"

let schedule = new SchedulePanel()

async function setupSchedule() {
  let events = await getSchedule()

  for (event of events) {
    schedule.addEvent(event)
  }
  
  /*
  let locations = new Map()
  for (event of events) {
    let list = locations.get(event.location.name)
    if (!list) {
      list = []
      locations.set(event.location.name, list)
    }
    list.push(event)
  }
  console.log(locations)
  */
  
  schedule.addTimeRange("2025-01-16T09:00:00-08:00", "2025-01-17T03:00:00-08:00")
  schedule.addTimeRange("2025-01-17T08:00:00-08:00", "2025-01-18T03:00:00-08:00")
  schedule.addTimeRange("2025-01-18T08:00:00-08:00", "2025-01-19T03:00:00-08:00")
  schedule.addTimeRange("2025-01-19T08:00:00-08:00", "2025-01-20T03:00:00-08:00")
  schedule.addTimeRange("2025-01-20T09:00:00-08:00", "2025-01-21T00:00:00-08:00")
  
  schedule.computeLayout()
}

setupSchedule()