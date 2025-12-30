export let schedule = new ScheduleArea();

import { ScheduleArea } from "./ScheduleArea.js"
import { getSchedule } from "./getSchedule.js"

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
  
  schedule.addTimeRange("2026-01-15T09:00:00-08:00", "2026-01-16T03:00:00-08:00")
  schedule.addTimeRange("2026-01-16T08:00:00-08:00", "2026-01-17T03:00:00-08:00")
  schedule.addTimeRange("2026-01-17T08:00:00-08:00", "2026-01-18T03:00:00-08:00")
  schedule.addTimeRange("2026-01-18T08:00:00-08:00", "2026-01-19T03:00:00-08:00")
  schedule.addTimeRange("2026-01-19T09:00:00-08:00", "2026-01-20T00:00:00-08:00")
  
  schedule.computeLayout()
  
  let nowPosition = schedule.timeIndicator.updatePosition()
  if (nowPosition !== false && nowPosition > 200) {
    let scrollPosition = nowPosition - 200;
    //retry until success
    function retrySetScroll() {
      if (Math.abs(schedule.scheduleDiv.scrollLeft - scrollPosition) > 10) {
        requestAnimationFrame(retrySetScroll)
      }
      schedule.scheduleDiv.scrollTo(scrollPosition, 0);
    }
    requestAnimationFrame(retrySetScroll)
  }

  setInterval(() => {
    schedule.timeIndicator.updatePosition()
  }, 5000)
}

setupSchedule()