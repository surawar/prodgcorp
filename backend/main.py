from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://prodogstar.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "ProDG Corp Backend is running!"
    }


@app.get("/projects")
def projects():

    return [
        {
            "name": "ProDG Python Runner",
            "description": "Browser-based Python execution platform.",
            "technology": "Python, FastAPI, React",
            "github": "",
            "live_url": ""
        },
        {
            "name": "ProDG Cyber Lab",
            "description": "Cybersecurity learning and experimentation environment.",
            "technology": "Linux, Networking, Security",
            "github": "",
            "live_url": ""
        }
    ]