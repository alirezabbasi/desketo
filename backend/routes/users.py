from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from backend.dependencies import get_db
from backend.models import User, DesktopPackage
from backend.schemas import UserCreate, UserVerify, UserProfileUpdate, UserPackageSelect, UserResponse
from backend.utils import log_action
import os
from datetime import datetime

router = APIRouter()

@router.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.mobile == user.mobile).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Mobile number already registered")
    new_user = User(mobile=user.mobile)
    db.add(new_user)
    db.commit()
    log_action(db, new_user.id, None, "user_register", f"User with mobile {user.mobile} registered")
    return {"message": "User registered successfully. Please verify your mobile number."}

@router.post("/verify-otp")
async def verify_otp(user: UserVerify, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.mobile == user.mobile).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.otp != "123456":  # Dummy OTP check
        log_action(db, db_user.id, None, "user_verify_failed", f"Failed OTP verification for mobile {user.mobile}")
        raise HTTPException(status_code=400, detail="Invalid OTP")
    db_user.is_verified = True
    db.commit()
    log_action(db, db_user.id, None, "user_verify", f"User with mobile {user.mobile} verified")
    return {"message": "User verified successfully"}

@router.post("/profile")
async def update_profile(
    mobile: str,
    name: str,
    id_number: str,
    kyc_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.mobile == mobile).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not db_user.is_verified:
        raise HTTPException(status_code=400, detail="User not verified")

    # Save KYC file
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{mobile}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{kyc_file.filename}")
    with open(file_path, "wb") as f:
        f.write(await kyc_file.read())

    db_user.name = name
    db_user.id_number = id_number
    db_user.kyc_file_path = file_path
    db.commit()
    log_action(db, db_user.id, None, "user_profile_update", f"User with mobile {mobile} updated profile")
    return {"message": "Profile updated successfully"}

@router.post("/select-package")
async def select_package(user: UserPackageSelect, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.mobile == user.mobile).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not db_user.is_verified:
        raise HTTPException(status_code=400, detail="User not verified")
    package = db.query(DesktopPackage).filter(DesktopPackage.id == user.package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    db_user.desktop_package_id = user.package_id
    db.commit()
    log_action(db, db_user.id, None, "user_select_package", f"User with mobile {user.mobile} selected package {package.name}")
    return {"message": "Package selected successfully"}