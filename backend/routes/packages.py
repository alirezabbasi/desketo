from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.dependencies import get_db
from backend.models import DesktopPackage, Admin
from backend.schemas import DesktopPackageResponse, DesktopPackageCreate
from backend.utils import get_current_admin, log_action, get_cache, set_cache, delete_cache

router = APIRouter()

@router.get("/packages", response_model=List[DesktopPackageResponse])
async def get_packages(db: Session = Depends(get_db)):
    # Retrieve cached packages and convert to DesktopPackageResponse instances
    cached_packages = get_cache("desktop_packages", model=DesktopPackageResponse)
    if cached_packages:
        return cached_packages

    packages = db.query(DesktopPackage).all()
    if not packages:
        default_packages = [
            DesktopPackage(name="Windows Basic", os="Windows", cpu="2 cores", ram="4GB", storage="50GB", price="$10/month"),
            DesktopPackage(name="Windows Pro", os="Windows", cpu="4 cores", ram="8GB", storage="100GB", price="$20/month"),
            DesktopPackage(name="Linux Starter", os="Linux", cpu="2 cores", ram="2GB", storage="30GB", price="$5/month"),
        ]
        db.add_all(default_packages)
        db.commit()
        packages = db.query(DesktopPackage).all()

    # Convert packages to a list of DesktopPackageResponse for caching
    package_list = [DesktopPackageResponse.from_orm(pkg) for pkg in packages]
    # Use model_dump() (or dict()) and ensure datetime fields are serialized
    package_list_serializable = [pkg.model_dump() for pkg in package_list]
    set_cache("desktop_packages", package_list_serializable, expire=3600)
    return package_list

@router.post("/admin/packages", response_model=DesktopPackageResponse)
async def create_package(
    package: DesktopPackageCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_package = DesktopPackage(**package.dict())
    db.add(new_package)
    db.commit()
    db.refresh(new_package)
    log_action(db, None, current_admin.id, "admin_create_package", f"Package {new_package.name} created")
    delete_cache("desktop_packages")
    return new_package

@router.delete("/admin/packages/{package_id}")
async def delete_package(
    package_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    package = db.query(DesktopPackage).filter(DesktopPackage.id == package_id).first()
    if not package:
        log_action(db, None, current_admin.id, "admin_delete_package_failed", f"Package ID {package_id} not found")
        raise HTTPException(status_code=404, detail="Package not found")
    db.delete(package)
    db.commit()
    log_action(db, None, current_admin.id, "admin_delete_package", f"Package ID {package_id} deleted")
    delete_cache("desktop_packages")
    return {"message": "Package deleted successfully"}