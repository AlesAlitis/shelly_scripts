// If firmware version is lower than 1, relace const with let
const switchId = 0; // For Shelly 1 Plus it's always 0. Change if needed
const checkPeriod = 10 * 1000; // in ms
const haUrl = 'http://YOUR_HOME_ASSISTAN_URL_OR_IP:8123'; // As sugested by bvhme
let mode = "detached"; // Could be "detached", "flip", "follow" or "momentary"

function updateConfig(oldConfig) {
  //Aplly the new config only if the switch is not already working in the desired mode  
  if (oldConfig.in_mode !== mode) {
    Shelly.call("Switch.SetConfig", { id: switchId, config: { in_mode: mode } });
    // If moving to HA controlled mode, make sure that the relay is switched on
    if (mode === "detached") Shelly.call("Switch.Set", { id: switchId, on: true });
  }
}

function setSwitchFromRespons(response) {
  // If HA is accessible the response code is 200 update the current mode and the new configuration
  mode = (response.code === 200)? "detached" : "flip";
  
  // Get the current output configuration and pass it to updateConfig
  Shelly.call("Switch.GetConfig", {id: switchId}, updateConfig)
}

function testHA() {
  // For RPC command HTTP.GET, both url and body are required. 
  Shelly.call("HTTP.GET", {url: haUrl, body:{}}, setSwitchFromRespons);
}

// Timer.set(period_in_ms, reapeate_indefinitely, function)
Timer.set(checkPeriod, true, testHA);