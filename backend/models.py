from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    mobile = Column(String, unique=True, index=True)
    is_verified = Column(Boolean, default=False)
    name = Column(String, nullable=True)
    id_number = Column(String, nullable=True)
    kyc_file_path = Column(String, nullable=True)
    desktop_package_id = Column(Integer, ForeignKey("desktop_packages.id"), nullable=True)
    desktop_package = relationship("DesktopPackage", back_populates="users")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DesktopPackage(Base):
    __tablename__ = "desktop_packages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    os = Column(String)
    cpu = Column(String)
    ram = Column(String)
    storage = Column(String)
    price = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    users = relationship("User", back_populates="desktop_package")

class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ActionLog(Base):
    __tablename__ = "action_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    admin_id = Column(Integer, ForeignKey("admins.id"), nullable=True)
    action = Column(String)
    details = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)