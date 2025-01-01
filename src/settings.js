import { schedule } from "./index.js"

export let settings = localStorage.fcscheduledata
if (settings !== undefined) {
  try {
    settings = JSON.parse(settings)
  } catch (error) {
    settings = undefined
  }
}
if (settings === undefined) {
  settings = {
    show18Plus: true,
    hiddenTracks: []
  }
}

async function awaitToSetDefaultZoom() {
  await schedule.initialComputePromise
  let value = schedule.getFullscreenZoom()
  settings.zoom = value
  document.body.style.zoom = value
}
if ("zoom" in settings) {
  document.body.style.zoom = settings.zoom
} else {
  settings.zoom = 1
  //if probably on desktop, set zoom to fill the screen by default
  if (innerWidth > 1200) awaitToSetDefaultZoom()
}

export function setShow18Plus(value) {
  if (settings.show18Plus === value) return
  settings.show18Plus = value
  schedule.computeLayout()
  saveSettings()
}

export function setTrackVisibility(track, value) {
  if (value) {
    if (!settings.hiddenTracks.includes(track)) return
    settings.hiddenTracks.splice(settings.hiddenTracks.indexOf(track), 1)
  } else {
    if (settings.hiddenTracks.includes(track)) return
    settings.hiddenTracks.push(track)
  }
  schedule.computeLayout()
  saveSettings()
}

export function setZoom(value) {
  settings.zoom = value
  document.body.style.zoom = value
  saveSettings()
}

function saveSettings() {
  localStorage.fcscheduledata = JSON.stringify(settings)
}