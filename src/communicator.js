const uuidv4 = require('uuid/v4');
const mqtt   = require('mqtt');

export class Communicator {
  constructor(parent, opts) {
    this.parent      = parent;
    this.uuid        = uuidv4();
    this.topicPrefix = `minecraft/browser/${this.uuid}/`;
    this.replyTo     = this.topicPrefix + "reply";
    this.correlation = 1;
    this.requests    = {};
    this.callbacks   = opts.callbacks;

  }

  connect(brokerInfo) {
    this.host = brokerInfo.hostname;
    this.port = brokerInfo.port;

    this.url  = `ws://${this.host}`;

    if (this.port) {
      this.url += `:${this.port}`;
    }

    console.log("connecting to:", brokerInfo);
    // Connect to the broker
    this.broker  = mqtt.connect(this.url,
                               {username: brokerInfo.username,
                                password: brokerInfo.password});
 
    this.broker.on('connect', (connAck) => {
      this.parent.event('connect', {connAck});
    });
     
    this.broker.on('message', (topic, message) => {
      this.parent.event('message', {topic, message});
    });

    this.broker.on('close', () => {
      this.parent.event('close', {});
    });

    this.broker.on('offline', () => {
      // Send close for this
      this.parent.event('close', {});
    });

    this.broker.on('disconnect', (packet) => {
      this.parent.event('disconnect', {packet});
    });

    this.broker.on('reconnect', (packet) => {
      this.parent.event('reconnect', {packet});
    });

    this.broker.on('error', (error) => {
      this.parent.event('error', {message: error.message});
      console.log("MQTT error:", error.message);
    });
    
  }

  subscribe(topic) {
    if (this.broker) {
      this.broker.subscribe(topic);
    }
  }

  onConnectionComplete() {
    this.parent.onBrokerConnection();
  }

  onMessage(topic, message) {
    if (topic.match(/minecraft\/browser/)) {
      this.onServerResponse(topic, message);
    }
    else if (topic.match(/minecraft\/client/)) {
      this.onClientMessage(topic, message);
    }
    else if (topic.match(/minecraft\/server/)) {
      this.onServerMessage(topic, message);
    }
  }

  doServerRequest(type, timeout, retries, callback) {
    let request = {
      type:        type,
      replyTo:     this.replyTo,
      correlation: this.correlation++,

    };
    let topic = `minecraft/server/*/` + type;
    let requestInfo = {
      retries:     retries,
      timeout:     timeout,
      callback:    callback,
      request:     request,
      topic:       topic
    };

    this.requests[request.correlation] = requestInfo;
    
    this.broker.publish(topic, JSON.stringify(request));

    if (timeout) {
      requestInfo.timer = window.setTimeout(() => {
        this.onServerRequestTimeout(requestInfo);
      }, timeout);
    }
    
  }

  onServerRequestTimeout(requestInfo) {
    if (requestInfo.retries--) {
      this.broker.publish(requestInfo.topic, JSON.stringify(requestInfo.request));
      requestInfo.timer = window.setTimeout(() => {
        this.onServerRequestTimeout(requestInfo);
      }, requestInfo.timeout);
    }
    else {
      requestInfo.callback({error: "timeout"});
    }
  }

  onServerMessage(topic, message) {
    let msg = this.serverParser.parsePacketBuffer(message);
    if (this.callbacks.onServerMessage) {
      this.callbacks.onServerMessage(topic, msg);
    }
  }

  onClientMessage(topic, message) {
    let msg = this.clientParser.parsePacketBuffer(message);
    if (this.callbacks.onClientMessage) {
      this.callbacks.onClientMessage(topic, msg);
    }
  }

  onServerResponse(topic, message) {
    let response;
    try {
      response = JSON.parse(message);
    } catch(e) {
      console.warn("Bad server response:", message);
      return;
    }

    if (response.correlation && this.requests[response.correlation]) {
      let requestInfo = this.requests[response.correlation];
      if (requestInfo.timer) {
        window.clearTimeout(requestInfo.timer);
      }
      requestInfo.callback(response);
    }
    else if (topic.match(/minecraft\/browser\/all\/info/)) {
      this.callbacks.onServerInfo(response.info);
    }
  }

}
