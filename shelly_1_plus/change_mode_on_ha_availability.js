// If firmware version is lower than 1, relace const with let
const switchId = 0; // For Shelly 1 Plus it's always 0. Change if needed
const checkPeriod = 10 * 1000; // in ms
const haUrl = 'http://YOUR_HOME_ASSISTAN_URL_OR_IP:8123'; // As sugested by bvhme

// For RPC command HTTP.GET, both url and body are required. 
function testHA() { Shelly.call("HTTP.GET", {url: haUrl, body:{}}, function(resp) {
    // If HA is accessible the response code is 200 update the current mode and the new configuration
    // Could be "detached", "flip", "follow" or "momentary". Use "detached" when HA is in control
    let mode = (resp && resp.code === 200)? "detached" : "flip"; 

    // Get the current output configuration and pass it to updateConfig
    Shelly.call("Switch.GetConfig", {id: switchId}, function(oldConfig) {
      //Aplly the new config only if the switch is not already working in the desired mode
      if (oldConfig.in_mode !== mode) {
        Shelly.call("Switch.SetConfig", { id: switchId, config: { in_mode: mode } });
        // If moving to HA controlled mode, make sure that the relay is switched on
        if (mode === "detached") Shelly.call("Switch.Set", { id: switchId, on: true });
      }
    });
  })
}

Timer.set(checkPeriod, true, testHA);