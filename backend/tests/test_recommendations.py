"""
Testy jednostkowe dla algorytmu rekomendacji (recommendations_service.py).

Pokrywa: losowy fallback, sortowanie według kategorii oraz logikę obiektów odwiedzonych/nieodwiedzonych.
"""

from unittest.mock import MagicMock

import pytest

from app.services.recommendations_service import (
    _random_sample,
    _recommend_by_category,
)


class TestRandomSample:
    """Fallback: losowy wybór obiektów w przypadku braku historii rezerwacji."""

    def test_returns_at_most_limit(self):
        # Arrange
        facilities = [MagicMock(id=str(i)) for i in range(10)]

        # Act
        result = _random_sample(facilities, limit=3)

        # Assert
        assert len(result) == 3

    def test_returns_all_if_fewer_than_limit(self):
        # Arrange
        facilities = [MagicMock(id="1"), MagicMock(id="2")]

        # Act
        result = _random_sample(facilities, limit=5)

        # Assert
        assert len(result) == 2


class TestRecommendByCategory:
    """Rekomendacje oparte na kategoriach z logiką wykluczania odwiedzonych."""

    def test_prefers_unvisited_from_top_category(self):
        # Arrange
        facility_tenis_visited = MagicMock(id="1", category="tenis")
        facility_tenis_new = MagicMock(id="2", category="tenis")
        facility_pilka = MagicMock(id="3", category="piłka nożna")

        reservations = [
            MagicMock(facility_id="1"),
            MagicMock(facility_id="1"),
        ]
        all_facilities = [facility_tenis_visited, facility_tenis_new, facility_pilka]

        # Act
        result = _recommend_by_category(reservations, all_facilities, limit=2)

        # Assert
        result_ids = [f.id for f in result]
        assert "2" in result_ids
        assert "1" not in result_ids

    def test_fills_with_visited_when_not_enough_unvisited(self):
        # Arrange
        f1 = MagicMock(id="1", category="tenis")
        f2 = MagicMock(id="2", category="tenis")
        reservations = [MagicMock(facility_id="1"), MagicMock(facility_id="2")]

        # Act
        result = _recommend_by_category(reservations, [f1, f2], limit=3)

        # Assert
        assert len(result) >= 1

    def test_empty_facilities_returns_empty(self):
        # Arrange
        reservations = [MagicMock(facility_id="1")]

        # Act
        result = _recommend_by_category(reservations, [], limit=3)

        # Assert
        assert result == []
