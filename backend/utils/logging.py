from sqlalchemy.orm import Session
from backend.models import ActionLog  # Already using backend.models

def log_action(db: Session, user_id: int | None, admin_id: int | None, action: str, details: str | None):
    log = ActionLog(user_id=user_id, admin_id=admin_id, action=action, details=details)
    db.add(log)
    db.commit()