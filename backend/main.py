"""Small public API for optional ProDG project metadata."""

from os import getenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Project(BaseModel):
    name: str
    description: str
    technology: str
    github: str | None = None
    live_url: str | None = None


def allowed_origins() -> list[str]:
    """Read a comma-separated allow-list without enabling wildcard CORS."""
    configured = getenv("ALLOWED_ORIGINS", "https://prodogstar.github.io")
    return [origin.strip() for origin in configured.split(",") if origin.strip()]


app = FastAPI(
    title="ProDG Project API",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins(),
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Accept", "Content-Type"],
    max_age=600,
)

PROJECTS = [
    Project(
        name="ProDG Python Runner",
        description="Browser-based Python execution platform built around FastAPI and React.",
        technology="Python, FastAPI, React",
    ),
    Project(
        name="ProDG Cyber Lab",
        description="Personal environment for learning Linux, networking, ethical hacking and defensive security.",
        technology="Linux, Kali, Networking",
    ),
    Project(
        name="Smart Door Locker",
        description="Experimental access-control system using authentication, sensors and microcontrollers.",
        technology="ESP32, C++, IoT",
    ),
    Project(
        name="ProDG Board v1",
        description="Experimental custom board combining sensors, microcontroller and power management.",
        technology="KiCad, PCB, Electronics",
    ),
    Project(
        name="ProDG Knowledge Assistant",
        description="Experimental AI system for retrieving and reasoning over a personal knowledge base.",
        technology="Python, RAG, LLM",
    ),
    Project(
        name="Student Management System",
        description="Command-line application exploring C++, OOP, structures and file management.",
        technology="C++, OOP",
    ),
]


@app.get("/", tags=["system"])
def home() -> dict[str, str]:
    return {"message": "ProDG Corp Backend is running!"}


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/projects", response_model=list[Project], tags=["projects"])
def projects() -> list[Project]:
    return PROJECTS
