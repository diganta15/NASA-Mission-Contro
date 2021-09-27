const API_URL = 'http://localhost:8000/v1'

async function httpGetPlanets() {
  const res = await fetch(`${API_URL}/planets`);
  const fetchedLaunches = await res.json();
  return fetchedLaunches.sort((a,b)=>{
    return a.flightNumber - b.flightNumber;
  })
}

async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  const res = await fetch(`${API_URL}/launches`);
  return await res.json()
}

async function httpSubmitLaunch(launch) {
 try{
   return await fetch(`${API_URL}/launches`, {
     method: 'POST',
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(launch)
   });
 }
 catch(err){
     return {
       ok: false,
     };
 }
}

async function httpAbortLaunch(id) {
  try{
    return await fetch(`${API_URL}/launches/${id}`,{
      method:"DELETE"
    });
  }catch(err){
    return{
      ok:false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};