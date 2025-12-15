import { eventTypeOrdering, eventTypeColors } from "./const.js"
import { setTrackVisibility, settings, setZoom, setShowMaturity } from "./settings.js"
import { schedule } from "./index.js"

let container = document.getElementById("modalcontainer")

let eventinfomodal = document.getElementById("eventinfomodal")
let eventinfoname = document.getElementById("eventinfoname")
let eventinfodescription = document.getElementById("eventinfodescription")
let eventinfopresenters = document.getElementById("eventinfopresenters")
let eventinfopresenterslinebreak = document.getElementById("eventinfopresenterslinebreak")
let eventinfotimeplace = document.getElementById("eventinfotimeplace")
let eventinfotype = document.getElementById("eventinfotype")

let settingsbutton = document.getElementById("settingsbutton")
let settingsmodal = document.getElementById("settingsmodal")

let settingsshow18plus = document.getElementById("settingsshow18plus");
let settingsshowgeneral = document.getElementById("settingsshowgeneral");
let settingsshowfamily = document.getElementById("settingsshowfamily");

let settingsaftertracks = document.getElementById("settingsaftertracks")
let settingszoomnormal = document.getElementById("settingszoomnormal")
let settingszoomplus = document.getElementById("settingszoomplus")
let settingszoomminus = document.getElementById("settingszoomminus")

export function showEventModal(event) {
  container.style.display = "flex"
  eventinfomodal.style.display = "block"
  settingsmodal.style.display = "none"
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
settingsmodal.addEventListener("click", event => {
  //prevent it from bubbling up and closing the modal
  event.stopPropagation()
})
container.addEventListener("click", hideModal)

function hideModal() {
  container.style.display = "none"
  eventinfomodal.style.display = "none"
  settingsmodal.style.display = "none"
}

function showSettingsModal() {
  container.style.display = "flex"
  eventinfomodal.style.display = "none"
  settingsmodal.style.display = "block"
}

settingsbutton.addEventListener("click", () => {
  showSettingsModal()
})

settingsshow18plus.checked = settings.shownMaturity.adult;
settingsshow18plus.addEventListener("change", () => {
  setShowMaturity("adult", settingsshow18plus.checked);
});
settingsshowgeneral.checked = settings.shownMaturity.general;
settingsshowgeneral.addEventListener("change", () => {
  setShowMaturity("general", settingsshowgeneral.checked);
});
settingsshowfamily.checked = settings.shownMaturity.family;
settingsshowfamily.addEventListener("change", () => {
  setShowMaturity("family", settingsshowfamily.checked);
});

let isFirstTrack = true
for (let track of eventTypeOrdering) {
  if (isFirstTrack) {
    isFirstTrack = false
  } else {
    settingsaftertracks.insertAdjacentElement("beforebegin", document.createElement("br"))
  }

  let name = "settingstracktoggle-" + track

  let checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.name = name
  checkbox.checked = !settings.hiddenTracks.includes(track)
  checkbox.classList.add("settingscheckbox")
  settingsaftertracks.insertAdjacentElement("beforebegin", checkbox)
  let label = document.createElement("label")
  label.for = name
  label.innerText = track
  label.classList.add("trackvisibilitytogglelabel")
  label.style.backgroundColor = eventTypeColors[track]
  settingsaftertracks.insertAdjacentElement("beforebegin", label)

  checkbox.addEventListener("change", () => {
    setTrackVisibility(track, checkbox.checked)
  })
}

settingszoomnormal.addEventListener("click", () => {
  setZoom(schedule.getFullscreenZoom())
})
settingszoomplus.addEventListener("click", () => {
  setZoom(Math.min(settings.zoom * 1.1, 1.7))
})
settingszoomminus.addEventListener("click", () => {
  setZoom(Math.max(settings.zoom * 0.9, 0.3))
})