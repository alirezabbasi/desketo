from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    mobile: str

class UserVerify(BaseModel):
    mobile: str
    otp: str

class UserProfileUpdate(BaseModel):
    mobile: str
    name: str
    id_number: str

class UserPackageSelect(BaseModel):
    mobile: str
    package_id: int

class UserResponse(BaseModel):
    id: int
    mobile: str
    is_verified: bool
    name: Optional[str]
    id_number: Optional[str]
    kyc_file_path: Optional[str]
    desktop_package_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class DesktopPackageCreate(BaseModel):
    name: str
    os: str
    cpu: str
    ram: str
    storage: str
    price: str

class DesktopPackageResponse(BaseModel):
    id: int
    name: str
    os: str
    cpu: str
    ram: str
    storage: str
    price: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class AdminCreate(BaseModel):
    username: str
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ActionLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    admin_id: Optional[int]
    action: str
    details: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }