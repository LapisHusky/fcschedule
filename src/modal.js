import { eventTypeOrdering, eventTypeColors } from "./const.js"
import { setTrackVisibility, settings, setZoom, setShowMaturity } from "./settings.js"
import { schedule } from "./index.js"

const container = document.getElementById("modalcontainer")

const eventinfomodal = document.getElementById("eventinfomodal")
const eventinfoname = document.getElementById("eventinfoname")
const eventinfodescription = document.getElementById("eventinfodescription")
const eventinfopresenters = document.getElementById("eventinfopresenters")
const eventinfopresenterslinebreak = document.getElementById("eventinfopresenterslinebreak")
const eventinfotimeplace = document.getElementById("eventinfotimeplace")
const eventinfotype = document.getElementById("eventinfotype")

const settingsbutton = document.getElementById("settingsbutton")
const settingsmodal = document.getElementById("settingsmodal")

const settingsshow18plus = document.getElementById("settingsshow18plus");
const settingsshowgeneral = document.getElementById("settingsshowgeneral");
const settingsshowfamily = document.getElementById("settingsshowfamily");

const settingsaftertracks = document.getElementById("settingsaftertracks")
const settingszoomnormal = document.getElementById("settingszoomnormal")
const settingszoomplus = document.getElementById("settingszoomplus")
const settingszoomminus = document.getElementById("settingszoomminus")

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
  const startTime = event.start.toLocaleString("en-US", {hour: "numeric", minute: "numeric", timeZone: "America/Los_Angeles"})
  const endTime = event.end.toLocaleString("en-US", {hour: "numeric", minute: "numeric", timeZone: "America/Los_Angeles"})
  const startDay = event.start.toLocaleString("en-US", {weekday: "long", timeZone: "America/Los_Angeles"})
  const endDay = event.end.toLocaleString("en-US", {weekday: "long", timeZone: "America/Los_Angeles"})
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
for (const track of eventTypeOrdering) {
  if (isFirstTrack) {
    isFirstTrack = false
  } else {
    settingsaftertracks.insertAdjacentElement("beforebegin", document.createElement("br"))
  }

  const name = "settingstracktoggle-" + track

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.name = name
  checkbox.checked = !settings.hiddenTracks.includes(track)
  checkbox.classList.add("settingscheckbox")
  settingsaftertracks.insertAdjacentElement("beforebegin", checkbox)
  const label = document.createElement("label")
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
