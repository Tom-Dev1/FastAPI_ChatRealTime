interface Message {
  time: string;
  name: string;
  message: string;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private name: string;
  private onMessageCallback: (message: Message) => void;

  constructor(name: string, onMessageCallback: (message: Message) => void) {
    this.name = name;
    this.onMessageCallback = onMessageCallback;
  }

  connect(): void {
    this.ws = new WebSocket(`ws://localhost:8000/ws/${this.name}`);

    this.ws.onopen = () => {
      console.log("Connected to WebSocket server.");
    };

    this.ws.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      this.onMessageCallback(message);
    };

    this.ws.onclose = () => {
      console.log("Disconnected from WebSocket server.");
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  sendMessage(message: string): void {
    if (this.ws) {
      const messageData: Message = {
        time: new Date().toLocaleTimeString(),
        name: this.name,
        message,
      };

      this.ws.send(JSON.stringify(messageData));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WebSocketService;
