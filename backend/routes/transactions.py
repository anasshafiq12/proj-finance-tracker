from fastapi import APIRouter, Depends, Response
from sqlmodel import Session, select
from database import get_session
from models import Transaction, User
from auth import get_current_user
import pandas as pd
import io

router = APIRouter(prefix="/transactions", tags=["Finance"])

@router.get("/")
def list_expenses(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Transaction).where(Transaction.user_id == user.id)).all()

@router.get("/export/excel")
def export_excel(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    data = session.exec(select(Transaction).where(Transaction.user_id == user.id)).all()
    df = pd.DataFrame([t.dict() for t in data])
    
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    
    return Response(
        content=output.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=report.xlsx"}
    )