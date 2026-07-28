from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.recommendations import RecommendedFacilityResponse
from app.services import recommendations_service

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.get("/", response_model=List[RecommendedFacilityResponse])
def get_recommendations(
    limit: int = Query(default=3, ge=1, le=10),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Zwraca listę rekomendowanych obiektów sportowych dla zalogowanego użytkownika.
    Rekomendacje bazują na kategorii najczęściej rezerwowanych obiektów.
    Jeśli użytkownik nie ma historii – zwraca losowe obiekty.
    """
    return recommendations_service.get_recommendations(
        db=db,
        user_id=current_user.id,
        limit=limit,
    )


@router.get("/by-user/{user_id}", response_model=List[RecommendedFacilityResponse])
def get_recommendations_for_user(
    user_id: str,
    limit: int = Query(default=3, ge=1, le=10),
    db: Session = Depends(get_db),
):
    """
    Endpoint dla agenta n8n – zwraca rekomendacje po user_id bez sesji JWT.
    Wywołuj ten endpoint z poziomu webhooka n8n przekazując user_id z tokena.
    """
    return recommendations_service.get_recommendations(
        db=db,
        user_id=user_id,
        limit=limit,
    )
