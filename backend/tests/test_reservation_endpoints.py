"""
Testy integracyjne dla endpointów API rezerwacji (reservations).

Wykorzystuje FastAPI TestClient oraz bazę SQLite w pamięci do testowania pełnego cyklu żądanie/odpowiedź HTTP.
"""

from datetime import date, time, timedelta

from app.core.security import create_access_token


class TestCreateReservationEndpoint:

    def test_create_reservation_success(self, client, auth_headers, create_facility):
        # Arrange
        headers, user = auth_headers
        facility = create_facility()
        future = (date.today() + timedelta(days=5)).isoformat()
        payload = {
            "facility_id": facility.id,
            "reservation_date": future,
            "start_time": "10:00:00",
            "end_time": "11:00:00",
        }

        # Act
        response = client.post("/api/reservations/", json=payload, headers=headers)

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "pending"
        assert data["facility_id"] == facility.id

    def test_create_reservation_without_auth_returns_403(self, client, create_facility):
        # Arrange
        facility = create_facility()
        future = (date.today() + timedelta(days=5)).isoformat()
        payload = {
            "facility_id": facility.id,
            "reservation_date": future,
            "start_time": "10:00:00",
            "end_time": "11:00:00",
        }

        # Act
        response = client.post("/api/reservations/", json=payload)

        # Assert
        assert response.status_code in (401, 403)


class TestGetReservationsEndpoint:

    def test_get_my_reservations(self, client, auth_headers, create_facility, make_reservation):
        # Arrange
        headers, user = auth_headers
        facility = create_facility()
        make_reservation(user_id=user.id, facility_id=facility.id)

        # Act
        response = client.get("/api/reservations/my", headers=headers)

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1

    def test_get_facility_reservations(self, client, create_user, create_facility, make_reservation):
        # Arrange
        user = create_user(email="other@example.com")
        facility = create_facility()
        future = date.today() + timedelta(days=5)
        make_reservation(
            user_id=user.id,
            facility_id=facility.id,
            reservation_date=future,
        )

        # Act
        response = client.get(f"/api/reservations/facility/{facility.id}")

        # Assert
        assert response.status_code == 200
        assert len(response.json()) == 1


class TestCancelReservationEndpoint:

    def test_cancel_reservation_success(self, client, auth_headers, create_facility, make_reservation):
        # Arrange
        headers, user = auth_headers
        facility = create_facility()
        future = date.today() + timedelta(days=5)
        res = make_reservation(
            user_id=user.id,
            facility_id=facility.id,
            reservation_date=future,
        )

        # Act
        response = client.patch(
            f"/api/reservations/{res.id}/cancel", headers=headers
        )

        # Assert
        assert response.status_code == 200
        assert response.json()["status"] == "cancelled"

    def test_cancel_without_auth_returns_403(self, client, create_user, create_facility, make_reservation):
        # Arrange
        user = create_user(email="other2@example.com")
        facility = create_facility()
        res = make_reservation(user_id=user.id, facility_id=facility.id)

        # Act
        response = client.patch(f"/api/reservations/{res.id}/cancel")

        # Assert
        assert response.status_code in (401, 403)
