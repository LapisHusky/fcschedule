let container = document.getElementById("modalcontainer")

let eventinfomodal = document.getElementById("eventinfomodal")
let eventinfoname = document.getElementById("eventinfoname")
let eventinfodescription = document.getElementById("eventinfodescription")
let eventinfopresenters = document.getElementById("eventinfopresenters")
let eventinfopresenterslinebreak = document.getElementById("eventinfopresenterslinebreak")
let eventinfotimeplace = document.getElementById("eventinfotimeplace")
let eventinfotype = document.getElementById("eventinfotype")

export function showEventModal(event) {
  console.log(event)
  container.style.display = "flex"
  eventinfomodal.style.display = "block"
  eventinfoname.innerText = event.name
  eventinfodescription.innerText = event.description
  if (event.presenters.length) {
    eventinfopresenters.innerText = "Presented by " + event.presenters.join(", ")
    eventinfopresenterslinebreak.style.display = "block"
  } else {
    eventinfopresenters.innerText = ""
    eventinfopresenterslinebreak.style.display = "none"
  }
  let startTime = event.start.toLocaleString("en-US", {hour: "numeric", minute: "numeric", timeZone: "America/Los_Angeles"})
  let endTime = event.end.toLocaleString("en-US", {hour: "numeric", minute: "numeric", timeZone: "America/Los_Angeles"})
  let startDay = event.start.toLocaleString("en-US", {weekday: "long", timeZone: "America/Los_Angeles"})
  let endDay = event.end.toLocaleString("en-US", {weekday: "long", timeZone: "America/Los_Angeles"})
  eventinfotimeplace.innerText = event.location
  if (startDay === endDay) {
    eventinfotimeplace.innerText += " - " + startDay + ", " + startTime + " to " + endTime
  } else {
    eventinfotimeplace.innerText += " - " + startDay + ", " + startTime + " to " + endDay + ", " + endTime
  }
  eventinfotype.innerText = "Type: " + event.type
}

eventinfomodal.addEventListener("click", event => {
  //prevent it from bubbling up and closing the modal
  event.stopPropagation()
})
container.addEventListener("click", hideModal)

function hideModal() {
  container.style.display = "none"
  eventinfomodal.style.display = "none"
}