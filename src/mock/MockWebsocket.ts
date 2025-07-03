export class MockWebSocket {
  listeners: {};
  readyState: number;
  
  constructor() {
    this.listeners = {};
    this.readyState = 1; // OPEN
  }

  addEventListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        callback({ data: JSON.stringify(data) });
      });
    }
  }

  close() {
    this.readyState = 3; // CLOSED
  }
}