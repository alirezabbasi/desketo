from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.dependencies import get_db
from backend.models import Admin
from backend.schemas import AdminCreate, AdminLogin, Token
from backend.utils import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, log_action, get_current_admin, delete_cache
from datetime import timedelta

router = APIRouter()

@router.post("/admin/register")
async def register_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    db_admin = db.query(Admin).filter(Admin.username == admin.username).first()
    if db_admin:
        raise HTTPException(status_code=400, detail="Admin already registered")
    hashed_password = get_password_hash(admin.password)
    new_admin = Admin(username=admin.username, hashed_password=hashed_password)
    db.add(new_admin)
    db.commit()
    log_action(db, None, new_admin.id, "admin_register", f"Admin {admin.username} registered")
    return {"message": "Admin registered successfully"}

@router.post("/admin/login", response_model=Token)
async def login_admin(admin: AdminLogin, db: Session = Depends(get_db)):
    db_admin = db.query(Admin).filter(Admin.username == admin.username).first()
    if not db_admin or not verify_password(admin.password, db_admin.hashed_password):
        log_action(db, None, None, "admin_login_failed", f"Failed login attempt for username {admin.username}")
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.username}, expires_delta=access_token_expires
    )
    log_action(db, None, db_admin.id, "admin_login", f"Admin {admin.username} logged in")
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/admin/logout")
async def logout_admin(current_admin: Admin = Depends(get_current_admin)):
    cache_key = f"admin_token:{current_admin.username}"
    delete_cache(cache_key)
    log_action(None, None, current_admin.id, "admin_logout", f"Admin {current_admin.username} logged out")
    return {"message": "Logged out successfully"}