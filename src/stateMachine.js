//
// Simple statemachine infrastructure that can be used for Solace Messaging
//



class MsgStateMachine {
  constructor(states, startState, options) {

    // this.states holds all the valid states in the state machine
    // Each state should define event and message handlers
    // and optionally a defaultEventHandler and a defaultMsgHandler
    this.states = states;

    for (name in this.states) {
      this.states[name].name = name;
    }

    // The current state
    this.state = this.states[startState];

    // The last state
    this.lastState = this.state;

    // Call the enter state handler for the first state
    this._callStateMethod("enterState", this.state, null);

    if (options) {
      var optNames = ["logCallback", "name", "debug"];
      for (var i = 0; i < optNames.length; i++) {
        if (options[optNames[i]]) {
          this[optNames[i]] = options[optNames[i]];
        }
      }
    }

    // Timer structures
    this.periodicTimers = {};
    this.oneShotTimers = {};

  };

  // Change state function
  changeState(newState) {
    if (!this.states[newState]) {
      throw ("Attempted to change state to non-existant state: " + newState);
    } 

    this._callStateMethod("exitState", this.state, this.states[newState]);
    this.lastState = this.state;
    this.state = this.states[newState];
    this._debugLog("Changing to state: " + newState + " from state: " + this.lastState.name);
    this._callStateMethod("enterState", this.state, this.lastState);

  }

  // Called to invoke an event on the state machine
  invokeEvent(eventName) {
    this._debugLog("Invoking event: " + eventName);
    this._callStateMethodOrDefault.apply(this,
      (["event" + eventName, this.state]).concat(Array.prototype.slice.call(arguments, 1)));
  }

  // Called to get the statemachine to handle a received message
  handleMessage(topic, message) {
    this._debugLog("Handling message: " + "msg" + type + operation);
    this._callStateMethodOrDefault(topic, message);
  }

  // Create and start a periodic timer that will spit out an event each time it goes off
  // The event name will be 'event{name}Timeout'
  startPeriodicTimer(name, period) {
    this.periodicTimers[name] = setInterval(() => {
      this.invokeEvent(name + "Timeout");
    }, period);  
  }

  stopPeriodicTimer(name, period) {
    if (typeof (this.periodicTimers[name]) != "undefined") {
      clearInterval(this.periodicTimers[name]);
    }
  }

  // Create a one shot timer that will generate an event when it fires
  // The event name will be 'event{name}Timeout'
  startOneShotTimer(name, delay) {
    this.oneShotTimers[name] = setTimeout(() => {
      this.invokeEvent(name + "Timeout");
    }, delay);
  }

  stopOneShotTimer(name) {
    if (typeof (this.oneShotTimers[name]) != "undefined") {
      clearTimeout(this.oneShotTimers[name]);
    }
  }

  // Private methods

  // Call an internal state method - but only if it is there
  _callStateMethod(methodName, callingThis) {

  if (callingThis[methodName]) {
      this._debugLog("Calling state method '" + methodName + "' within state '" + callingThis.name + "'");
      callingThis[methodName].apply(callingThis, Array.prototype.slice.call(arguments, 2));
      return true;
    }
    return false;

  }

  _callStateMethodOrDefault(methodName, callingThis) {

    if (callingThis[methodName]) {
      this._debugLog("Calling state method: " + methodName);
      callingThis[methodName].apply(callingThis, Array.prototype.slice.call(arguments, 2));
      return true;
    }
    else {
      var match = methodName.match(/^([a-z]+)[A-Z]/);
      if (match) {
        var defaultMethod = match[1] + "DefaultHandler";
        if (callingThis[defaultMethod]) {
          this._debugLog("Calling state default method instead of method: " + methodName);
          callingThis[defaultMethod].apply(callingThis, Array.prototype.slice.call(arguments, 2));
          return true;
        }
      }
    }

    return false;

  }

  _log(message) {
    if (this.logCallback) {
      this.logCallback((this.name ? "name: " : "") + message);
    }
  }

  _debugLog(message) {
    if (typeof (this.logCallback) == "function" && this.debug) {
      this.logCallback((this.name ? "name: " : "") + message);
    }
  }

}