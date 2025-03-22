from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.models import Base  # Absolute import
from backend.routes import auth_router, users_router, admin_router, packages_router
from backend.dependencies import engine

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(admin_router)
app.include_router(packages_router)

# Create tables
Base.metadata.create_all(bind=engine)