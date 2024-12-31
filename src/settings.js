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

function saveSettings() {
  localStorage.fcscheduledata = JSON.stringify(settings)
}