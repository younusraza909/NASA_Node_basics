const API_URL = 'http://localhost:8000'

async function httpGetPlanets() {
  let response = await fetch(`${API_URL}/planets`)
  return await response.json()
}



async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  let response = await fetch(`${API_URL}/launches`)
  let fetchedLaunches = await response.json()
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  })
}
// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "POST",
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": 'application/json'
      }
    })
  } catch (e) {
    return {
      ok: false
    }
  }
}
// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": 'application/json'
      }
    })
  } catch (e) {
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};