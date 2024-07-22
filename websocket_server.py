import asyncio
import websockets

connected_clients = set()

async def handler(websocket, path):
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            print(f"Nachricht vom ESP32 empfangen: {message}")
            for client in connected_clients:
                if client != websocket:
                    await client.send(message)
    except websockets.ConnectionClosedError as e:
        print(f"Verbindung geschlossen: {e}")
    except Exception as e:
        print(f"Ein Fehler ist aufgetreten: {e}")
    finally:
        connected_clients.remove(websocket)

# Erhöhen des Keep-Alive-Intervalls
start_server = websockets.serve(
    handler, "0.0.0.0", 5678, ping_interval=60, ping_timeout=120
)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
