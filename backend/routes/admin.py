from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.dependencies import get_db
from backend.models import User, DesktopPackage, ActionLog, Admin  # Add Admin here
from backend.schemas import UserResponse, ActionLogResponse
from backend.utils import get_current_admin, log_action
from typing import List, Dict

router = APIRouter()

@router.get("/admin/users", response_model=List[UserResponse])
async def get_users(current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()
    log_action(db, None, current_admin.id, "admin_view_users", "Admin viewed users list")
    return users

@router.get("/admin/stats")
async def get_stats(current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    verified_users = db.query(User).filter(User.is_verified == True).count()
    package_counts = db.query(
        DesktopPackage.name,
        func.count(User.id).label("user_count")
    ).outerjoin(User, DesktopPackage.id == User.desktop_package_id).group_by(DesktopPackage.name).all()
    package_counts_dict = {name: count for name, count in package_counts}
    log_action(db, None, current_admin.id, "admin_view_stats", "Admin viewed statistics")
    return {
        "total_users": total_users,
        "verified_users": verified_users,
        "package_counts": package_counts_dict,
    }

@router.get("/admin/logs", response_model=Dict)
async def get_logs(
    page: int = 1,
    page_size: int = 10,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * page_size
    logs = db.query(ActionLog).order_by(ActionLog.timestamp.desc()).offset(offset).limit(page_size).all()
    total_logs = db.query(ActionLog).count()
    log_action(db, None, current_admin.id, "admin_view_logs", f"Admin viewed logs page {page}")
    return {
        "logs": logs,
        "total": total_logs,
        "page": page,
        "page_size": page_size,
    }