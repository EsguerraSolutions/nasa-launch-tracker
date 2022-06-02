const planets_API = 'http://localhost:8000/v1'

async function httpGetPlanets() {
  const response = await fetch(`${planets_API}/planets`);
  return await response.json();
  // TODO: Once API is ready.
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${planets_API}/launches`);
  const fetchedResponse = await response.json();
  return fetchedResponse.sort((a,b) => a.flightID - b.flightID);
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try {
    return await fetch(`${planets_API}/launches`, {
      method: "post",
      body: JSON.stringify(launch),
      headers : {
        "Content-Type" : "application/json"
      }
    });
  }

  catch (err) {
    return {ok : false}
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
    return await fetch(`${planets_API}/launches/${id}`, {
      method: "delete"
    });
  }

  catch (err) {
    return {ok : false}
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};