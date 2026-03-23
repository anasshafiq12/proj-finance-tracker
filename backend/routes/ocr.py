import os
from fastapi import APIRouter, UploadFile, File, Depends
from openai import OpenAI
from auth import get_current_user
import base64

router = APIRouter(prefix="/ocr", tags=["AI Scanner"])
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/scan")
async def scan_receipt(file: UploadFile = File(...), user=Depends(get_current_user)):
    content = await file.read()
    base64_image = base64.b64encode(content).decode('utf-8')

    # Sending to GPT-4o for structured extraction
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "Extract: total amount (float), merchant name, and category. Return JSON only."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]
        }],
        response_format={ "type": "json_object" }
    )
    return response.choices[0].message.content