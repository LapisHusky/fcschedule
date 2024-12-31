import { weekdays, eventTypeColors, shortLocationNames, cohesiveLocationOrder } from "./const.js"
import { showEventModal } from "./modal.js"

class Event {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.location = data.location.name
    this.start = new Date(data.startDate)
    this.end = new Date(data.endDate)
    this.description = data.description
    this.type = data.type
    //console.log(this.type)
    this.presenters = data.presenters.map(thing => thing.name)
    this.maturity = data.maturity
    if (this.maturity === "18+") {
      //refine name to make consistent notice of maturity
      this.name = this.name.replaceAll("(18+)", "").trim()
      this.name = "(18+) " + this.name
    }

    this.div = document.createElement("div")
    this.div.classList.add("eventblock")
    this.div.style.backgroundColor = eventTypeColors[this.type] || "#444"

    this.visible = this.type !== "Hours"
    this.visible = true

    this.div.addEventListener("click", () => {
      showEventModal(this)
    })
  }

  setWidth(width) {
    this.div.style.width = width + "px"
    this.div.innerHtml = ""
    let hoursWide = width / 200
    if (hoursWide < 4) {
      let textDiv = document.createElement("div")
      textDiv.innerText = this.name
      textDiv.classList.add("eventtextblock")
      this.div.appendChild(textDiv)
    } else {
      for (let i = 0; i <= hoursWide - 2; i += 2) {
        let textDiv = document.createElement("div")
        textDiv.innerText = this.name
        textDiv.classList.add("eventtextblock")
        textDiv.style.left = i * 200 + "px"
        textDiv.style.width = "300px"
        this.div.appendChild(textDiv)
      }
    }
  }
}

class Time {
  constructor(time, index) {
    this.date = new Date(time)
    this.index = index

    this.div = document.createElement("div")
    this.div.classList.add("timeblock")
    
    let displayText = weekdays[this.date.getDay()] + " "
    let hour = this.date.toLocaleString("en-US", {hour: "numeric", timeZone: "America/Los_Angeles"})
    if (hour === "12 PM") {
      hour = "Noon"
    } else if (hour === "12 AM") {
      hour = "Midnight"
    }
    displayText += hour
    this.div.innerText = displayText
  }
}

class TimeGap {
  constructor(index) {
    this.gap = true
    this.index = index
    
    this.div = document.createElement("div")
    this.div.classList.add("timeblock")
    this.div.style.backgroundColor = "#522"
    this.div.innerText = "Get enough sleep!"
  }
}

class Location {
  constructor(name, index) {
    this.fullName = name
    this.shortName = shortLocationNames[name] || name
    this.index = index

    this.div = document.createElement("div")
    this.div.classList.add("locationblock")
    this.div.innerText = this.shortName
  }
}

class LocationGap {
  constructor(index) {
    this.gap = true
    this.index = index

    this.div = document.createElement("div")
    this.div.classList.add("locationblock")
    this.div.innerText = "FC 2025"
    this.div.style.fontSize = "30px"
  }
}

export class SchedulePanel {
  constructor() {
    this.poolDiv = document.getElementById("blockpool")
    this.gridPoolDiv = document.getElementById("gridpool")
    this.scheduleDiv = document.getElementById("schedulepanel")

    this.xAxisDiv = document.getElementById("schedulexaxis")
    this.yAxisDiv = document.getElementById("scheduleyaxis")

    this.yAxisDiv.appendChild(new LocationGap().div, 0)

    this.events = new Map()
    this.xAxisItems = []
    this.yAxisItems = []
  }

  addEvent(data) {
    let event = new Event(data)
    this.events.set(event.id, event)
    this.poolDiv.appendChild(event.div)
  }

  addLocation(data) {
    let location = new Location(data, this.yAxisItems.length + 1) //+1 because the gap at the top isn't in array
    this.yAxisItems.push(location)
    this.yAxisDiv.appendChild(location.div)
  }

  removeLocation(location) {
    this.yAxisDiv.removeChild(location.div)
    this.yAxisItems.splice(this.yAxisItems.indexOf(location), 1)
  }

  addTimeRange(start, end) {
    if (this.xAxisItems.length) {
      let divider = new TimeGap(this.xAxisItems.length)
      this.xAxisItems.push(divider)
      this.xAxisDiv.appendChild(divider.div)
    }

    start = new Date(start).getTime()
    end = new Date(end).getTime()
    
    let value = start
    while (value < end) {
      let time = new Time(value, this.xAxisItems.length)
      this.xAxisItems.push(time)
      this.xAxisDiv.appendChild(time.div)

      value += 36e5
    }
  }

  computeLayout() {
    //if mobile, shrink location bar a bit
    this.yAxisDiv.style.width = innerWidth > 800 ? "200px" : "150px"

    //setup locations list
    for (let item of this.yAxisItems) {
      this.removeLocation(item)
    }
    let presentEventLocations = new Set()
    for (let event of this.events.values()) {
      if (!event.visible) continue
      presentEventLocations.add(event.location)
    }
    for (let location of cohesiveLocationOrder) {
      if (presentEventLocations.has(location)) this.addLocation(location)
    }
    for (let location of presentEventLocations.values()) {
      if (!cohesiveLocationOrder.includes(location)) this.addLocation(location)
    }

    //resize container divs to ensure scrolling and background and stuff works properly
    let wholeWidth = this.xAxisDiv.clientWidth + this.yAxisDiv.clientWidth
    //min height of 800 makes it a little easier to view on mobile by zooming the page out a bit
    let wholeHeight = this.yAxisDiv.clientHeight
    let containerHeight = Math.max(wholeHeight + 100, 800)
    this.poolDiv.style.width = wholeWidth + "px"
    this.poolDiv.style.height = containerHeight + "px"
    this.scheduleDiv.style.width = wholeWidth + "px"
    this.scheduleDiv.style.height = containerHeight + "px"

    //position event blocks within pool
    let xAxisOffset = this.xAxisDiv.offsetLeft
    for (let event of this.events.values()) {
      if (!event.visible) {
        event.div.style.display = "hidden"
        continue
      }
      event.div.style.display = "block"

      let locationBlock = null
      for (let location of this.yAxisItems) {
        if (location.fullName === event.location) locationBlock = location
      }
      event.div.style.top = locationBlock.index * 40 + "px"

      let startTimestamp = event.start.getTime()
      let endTimestamp = event.end.getTime()
      let hourBlock = this.xAxisItems[0]
      let endHourBlock = hourBlock
      for (let item of this.xAxisItems) {
        if (item.gap) continue
        if (item.date.getTime() > startTimestamp) {
          if (item.date.getTime() > endTimestamp) break
          endHourBlock = item
        } else {
          hourBlock = item
          endHourBlock = item
        }
      }
      
      let leftPos = xAxisOffset + hourBlock.index * 200
      leftPos += 200 * ((startTimestamp - hourBlock.date.getTime()) / 36e5)
      event.div.style.left = leftPos + "px"

      let rightPos = xAxisOffset + endHourBlock.index * 200
      rightPos += 200 * ((endTimestamp - endHourBlock.date.getTime()) / 36e5)

      let width = rightPos - leftPos
      event.setWidth(width)
    }

    //(re)create gridlines
    this.gridPoolDiv.innerHtml = "" //delete all children
    for (let x = 1; x < this.xAxisDiv.children.length; x++) {
      let linePos = x * 200 + xAxisOffset
      let line = document.createElement("div")
      line.classList.add("vertgridline")
      line.style.left = linePos + "px"
      line.style.height = wholeHeight + "px"
      this.gridPoolDiv.appendChild(line)
    }
    for (let y = 2; y < this.yAxisDiv.children.length; y++) {
      let linePos = y * 40
      let line = document.createElement("div")
      line.classList.add("vertgridline")
      line.style.top = linePos + "px"
      line.style.width = wholeWidth + "px"
      this.gridPoolDiv.appendChild(line)
    }
  }
}