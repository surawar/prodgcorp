import os
from datetime import datetime, timezone

from authlib.integrations.starlette_client import OAuth
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware

from database import Base, SessionLocal, engine
from models import User


# --------------------------------------------------
# Configuration
# --------------------------------------------------

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://127.0.0.1:5500",
)

SESSION_SECRET = os.getenv(
    "SESSION_SECRET",
    "development-secret-change-this",
)

ENVIRONMENT = os.getenv(
    "ENVIRONMENT",
    "development",
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")


# --------------------------------------------------
# Database
# --------------------------------------------------

Base.metadata.create_all(bind=engine)


# --------------------------------------------------
# FastAPI
# --------------------------------------------------

app = FastAPI(
    title="ProDG Corp Backend",
    version="2.0.0",
    docs_url=None,
    redoc_url=None,
)


# --------------------------------------------------
# Session
# --------------------------------------------------

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET,
    https_only=ENVIRONMENT == "production",
    same_site="lax",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

allowed_origins = [
    FRONTEND_URL,
    "https://prodgcorp.in",
    "https://www.prodgcorp.in",
    "https://prodogstar.github.io",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(allowed_origins)),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Accept", "Content-Type"],
)


# --------------------------------------------------
# Google OAuth
# --------------------------------------------------

oauth = OAuth()

if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET:
    oauth.register(
        name="google",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        server_metadata_url=(
            "https://accounts.google.com/"
            ".well-known/openid-configuration"
        ),
        client_kwargs={
            "scope": "openid email profile",
        },
    )


# --------------------------------------------------
# System
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "ProDG Corp Backend is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# --------------------------------------------------
# Google Login
# --------------------------------------------------

@app.get("/auth/google/login")
async def google_login(request: Request):

    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth is not configured.",
        )

    redirect_uri = request.url_for(
        "google_callback"
    )

    return await oauth.google.authorize_redirect(
        request,
        redirect_uri,
    )


# --------------------------------------------------
# Google Callback
# --------------------------------------------------

@app.get("/auth/google/callback", name="google_callback")
async def google_callback(request: Request):

    try:
        token = await oauth.google.authorize_access_token(
            request
        )

        userinfo = token.get("userinfo")

        if not userinfo:
            raise HTTPException(
                status_code=400,
                detail="Google did not return user information.",
            )

        google_id = userinfo.get("sub")
        email = userinfo.get("email")
        name = userinfo.get("name")
        profile_photo = userinfo.get("picture")

        if not google_id or not email:
            raise HTTPException(
                status_code=400,
                detail="Google account information is incomplete.",
            )

        db = SessionLocal()

        try:
            user = (
                db.query(User)
                .filter(User.google_id == google_id)
                .first()
            )

            if user is None:
                user = User(
                    google_id=google_id,
                    name=name or "ProDG Student",
                    email=email,
                    profile_photo=profile_photo,
                    last_login=datetime.now(timezone.utc),
                )

                db.add(user)

            else:
                user.name = name or user.name
                user.email = email
                user.profile_photo = profile_photo
                user.last_login = datetime.now(timezone.utc)

            db.commit()
            db.refresh(user)

            request.session["user_id"] = user.id

        finally:
            db.close()

        return RedirectResponse(
            url=f"{FRONTEND_URL}/dashboard.html"
        )

    except Exception as error:

        print("Google authentication error:", error)

        return RedirectResponse(
            url=f"{FRONTEND_URL}/index.html?auth=error"
        )


# --------------------------------------------------
# Current User
# --------------------------------------------------

@app.get("/auth/me")
def current_user(request: Request):

    user_id = request.session.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated.",
        )

    db = SessionLocal()

    try:
        user = (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if not user:
            request.session.clear()

            raise HTTPException(
                status_code=401,
                detail="User not found.",
            )

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "profile_photo": user.profile_photo,
        }

    finally:
        db.close()


# --------------------------------------------------
# Logout
# --------------------------------------------------

@app.post("/auth/logout")
def logout(request: Request):

    request.session.clear()

    return {
        "message": "Logged out successfully."
    }


# --------------------------------------------------
# Projects
# --------------------------------------------------

PROJECTS = [
    {
        "name": "ProDG Python Runner",
        "description": "Browser-based Python execution platform.",
        "technology": "Python, FastAPI, React",
    },
    {
        "name": "ProDG Cyber Lab",
        "description": "Environment for learning Linux, networking and security.",
        "technology": "Linux, Kali, Networking",
    },
    {
        "name": "Smart Door Locker",
        "description": "Experimental access-control system.",
        "technology": "ESP32, C++, IoT",
    },
    {
        "name": "ProDG Board v1",
        "description": "Experimental custom electronics board.",
        "technology": "KiCad, PCB, Electronics",
    },
    {
        "name": "ProDG Knowledge Assistant",
        "description": "Experimental AI knowledge assistant.",
        "technology": "Python, RAG, LLM",
    },
    {
        "name": "Student Management System",
        "description": "C++ application exploring OOP and file management.",
        "technology": "C++, OOP",
    },
]


@app.get("/projects")
def projects():
    return PROJECTS