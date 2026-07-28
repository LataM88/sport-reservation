import random
from collections import Counter
from typing import Optional

from sqlalchemy.orm import Session

from app.models.facility import Facility
from app.models.reservations import Reservation


def get_recommendations(db: Session, user_id: Optional[str], limit: int = 3):
    """
    Zwraca listę rekomendowanych obiektów sportowych.

    Logika:
    - Jeśli użytkownik ma historię rezerwacji → rekomenduje obiekty
      z najczęściej rezerwowanych kategorii (ale wyklucza już odwiedzone).
      Jeśli za mało obiektów w ulubionych kategoriach – dopełnia losowymi.
    - Jeśli użytkownik nie ma żadnych rezerwacji → zwraca losowe obiekty.
    """
    active_facilities = (
        db.query(Facility).filter(Facility.is_active == True).all()
    )

    if not active_facilities:
        return []

    if not user_id:
        return _random_sample(active_facilities, limit)

    past_reservations = (
        db.query(Reservation)
        .filter(Reservation.user_id == user_id)
        .order_by(Reservation.created_at.desc())
        .limit(20)
        .all()
    )

    if not past_reservations:
        return _random_sample(active_facilities, limit)

    return _recommend_by_category(
        past_reservations=past_reservations,
        all_facilities=active_facilities,
        limit=limit,
    )


def _random_sample(facilities: list, limit: int) -> list:
    return random.sample(facilities, min(limit, len(facilities)))


def _recommend_by_category(
    past_reservations: list,
    all_facilities: list,
    limit: int,
) -> list:
    visited_ids = {r.facility_id for r in past_reservations}
    category_counts = Counter(
        f.category
        for r in past_reservations
        for f in all_facilities
        if f.id == r.facility_id
    )

    # Obiekty nieodwiedzone, posortowane wg popularności kategorii
    unvisited = [f for f in all_facilities if f.id not in visited_ids]
    unvisited.sort(
        key=lambda f: category_counts.get(f.category, 0),
        reverse=True,
    )

    recommended = unvisited[:limit]

    # Jeśli za mało nieodwiedzonych – dopełnij losowo z odwiedzonych
    if len(recommended) < limit:
        visited = [f for f in all_facilities if f.id in visited_ids]
        extra = random.sample(visited, min(limit - len(recommended), len(visited)))
        recommended.extend(extra)

    return recommended
