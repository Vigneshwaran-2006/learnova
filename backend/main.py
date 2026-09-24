from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, AliasChoices, field_validator

from recommendation_engine import generate_learning_path

app = FastAPI(
    title="Learnova API",
    description="Backend API for Learnova – AI-Powered Personalized Learning Path Generator",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LearnerProfileRequest(BaseModel):
    name: Optional[str] = Field(
        default=None,
        description="Optional name of the learner"
    )
    interest: str = Field(
        ...,
        validation_alias=AliasChoices("interest", "learning_interest", "learningInterest"),
        description="Selected learning interest topic"
    )
    skill_level: str = Field(
        ...,
        validation_alias=AliasChoices("skill_level", "skillLevel"),
        description="Current skill level (Beginner/Intermediate/Advanced)"
    )
    career_goal: str = Field(
        ...,
        validation_alias=AliasChoices("career_goal", "careerGoal"),
        description="Target career role"
    )
    daily_time: str = Field(
        ...,
        validation_alias=AliasChoices("daily_time", "dailyTime"),
        description="Available daily learning commitment"
    )
    duration: str = Field(
        ...,
        validation_alias=AliasChoices("duration", "learning_duration", "learningDuration"),
        description="Target roadmap duration"
    )

    @field_validator("interest", "skill_level", "career_goal", "daily_time", "duration")
    @classmethod
    def validate_non_empty(cls, v: str, info) -> str:
        if not v or not v.strip():
            raise ValueError(f"{info.field_name} must not be empty or whitespace.")
        return v.strip()

    @field_validator("name")
    @classmethod
    def clean_name(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        cleaned = v.strip()
        return cleaned if cleaned else None


@app.get("/api/health")
def get_health():
    """
    Health check endpoint to verify backend operational status.
    """
    return {
        "status": "success",
        "message": "Learnova backend is running"
    }


@app.post("/api/generate-path", status_code=status.HTTP_200_OK)
def create_personalized_path(profile: LearnerProfileRequest):
    """
    Rule-based recommendation engine endpoint.
    Generates a personalized learning roadmap based on learner profile.
    """
    try:
        roadmap_response = generate_learning_path(
            interest=profile.interest,
            skill_level=profile.skill_level,
            career_goal=profile.career_goal,
            daily_time=profile.daily_time,
            duration=profile.duration,
            name=profile.name
        )
        return roadmap_response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate learning path: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
