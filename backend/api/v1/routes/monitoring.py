from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from utils.models.calculate_result import CalculateResult
import cv2
import base64
from pathlib import Path
from settings import settings
import random
import asyncio

router = APIRouter(
    prefix="/monitoring",
    tags=["monitoring"],
    responses={404: {"description": "Не найдено"}},
)

video_path = Path(f"{settings.download_path}/main.mp4")


async def send_video_data(websocket: WebSocket, cap: cv2.VideoCapture):
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue

            _, buffer = cv2.imencode('.jpg', frame)
            image_base64 = base64.b64encode(buffer).decode("utf-8")

            result = CalculateResult(kg_loss=random.randint(1, 30),
                                     procent_loss=random.randint(1, 20),
                                     longitude=random.randint(0, 90),
                                     latitude=random.randint(0, 90),
                                     fullnes=random.randint(0, 100))

            data = {
                "result": result.model_dump(),
                "shot": image_base64,
                "processed": image_base64,
                "depth": image_base64
            }
            await websocket.send_json(data)
            await asyncio.sleep(0.05)
    except WebSocketDisconnect:
        print("Клиент отключился")
    finally:
        cap.release()


@router.websocket("/ws")
async def monitoring(websocket: WebSocket):
    await websocket.accept()
    try:
        cap = cv2.VideoCapture(str(video_path))
        if not cap.isOpened():
            raise ValueError("Не удалось открыть видеофайл")

        asyncio.create_task(send_video_data(websocket, cap))

        await websocket.receive_text()
    except:
        pass
    finally:
        websocket.close()
