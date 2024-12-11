from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@app.websocket("/ws/{name}")
async def websocket_endpoint(websocket: WebSocket, name: str):
    await manager.connect(websocket)

    now = datetime.now()
    timestamp = now.strftime("%H:%M")
    try:
        while True:
            text_data = await websocket.receive_text()
            # Create message 
            # message = {"time": current_time, "name": name, "message": data}

            message = {
                "type": "message",
                "data": {
                    "username": name, 
                    "text": text_data, 
                    "time": timestamp       
            }}       
            await manager.broadcast(json.dumps(message))

    except WebSocketDisconnect:
        manager.disconnect(websocket)

        message = {"time": timestamp, "name": name, "message": "Disconnected"}

        disconnect_message = {
            "type": "status",
            "data": {
                "username": name,
                "text": "Disconnected",
                "timestamp": timestamp 
            }
        }
        await manager.broadcast(json.dumps(disconnect_message))
