// If firmware version is lower than 1, relace const with let
const outputId = 0; // For Shelly 1 Plus it's always 0. Change if needed
const checkPeriod = 10 * 1000 // in ms
const operationModes = {
  haControlled: "detached",
  switchControlled: "flip" // Could be "follow" or "momentary" too
}

let currentMode = operationModes.haControlled;
// "id" is the ID of the output to which the new configuration will be applied and "config" is the actual configuration
let config = {
  id: outputId,
  config: {
    in_mode: currentMode
  }
};

function updateConfig(oldConfig) {
  //Aplly the new config only if the switch is not already working in the desired mode  
  if (oldConfig.in_mode !== currentMode) {
    Shelly.call("Switch.SetConfig", config);
  }
}

function setSwitchFromRespons(resp) {
  // If HA is accessible the response code is 200
  if (resp.code === 200) {
    currentMode = operationModes.haControlled;
  } else {
    currentMode = operationModes.switchControlled;
  }
  
  // Update the mode in the new configuration
  config.config.in_mode = currentMode;
  
  // Get the current output configuration and pass it to updateConfig
  Shelly.call("Switch.GetConfig", {id: outputId}, updateConfig)
}

function testHA() {
  // For RPC command HTTP.GET, both url and body are required. 
  Shelly.call("HTTP.GET", {url:'http://YOUR_HOME_ASSISTAN_URL_OR_IP:8123', body:{}}, setSwitchFromRespons);
}

// Timer.set(period_in_ms, reapeate_indefinitely, function)
Timer.set(checkPeriod, true, testHA);