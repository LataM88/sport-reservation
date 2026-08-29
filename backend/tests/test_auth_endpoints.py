"""
Testy integracyjne dla endpointów API autoryzacji (auth).

Wykorzystuje FastAPI TestClient oraz bazę SQLite w pamięci do testowania pełnego cyklu żądanie/odpowiedź HTTP.
"""

from unittest.mock import patch


class TestRegisterEndpoint:

    @patch("app.services.auth_service.send_activation_code_email")
    def test_register_returns_success_message(self, mock_email, client):
        # Arrange
        payload = {
            "name": "Jan",
            "lastName": "Kowalski",
            "phoneNumber": "123456789",
            "email": "jan@example.com",
            "password": "Secret123!",
        }

        # Act
        response = client.post("/api/auth/register", json=payload)

        # Assert
        assert response.status_code == 200
        assert "message" in response.json()

    @patch("app.services.auth_service.send_activation_code_email")
    def test_register_duplicate_email_returns_409(self, mock_email, client):
        # Arrange
        payload = {
            "name": "Jan",
            "lastName": "Kowalski",
            "phoneNumber": "123456789",
            "email": "jan@example.com",
            "password": "Secret123!",
        }
        client.post("/api/auth/register", json=payload)

        # Act
        response = client.post("/api/auth/register", json=payload)

        # Assert
        assert response.status_code == 409


class TestLoginEndpoint:

    def test_login_returns_token(self, client, create_user):
        # Arrange
        create_user(email="jan@example.com", password="Secret123!")
        payload = {"email": "jan@example.com", "password": "Secret123!"}

        # Act
        response = client.post("/api/auth/login", json=payload)

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["role"] == "user"

    def test_login_wrong_password_returns_401(self, client, create_user):
        # Arrange
        create_user(email="jan@example.com", password="Secret123!")
        payload = {"email": "jan@example.com", "password": "Wrong1!"}

        # Act
        response = client.post("/api/auth/login", json=payload)

        # Assert
        assert response.status_code == 401


class TestGetUserEndpoint:

    def test_get_user_with_valid_token(self, client, auth_headers):
        # Arrange
        headers, user = auth_headers

        # Act
        response = client.get("/api/auth/get-user", headers=headers)

        # Assert
        assert response.status_code == 200
        assert response.json()["email"] == user.email

    def test_get_user_without_token_returns_403(self, client):
        # Arrange

        # Act
        response = client.get("/api/auth/get-user")

        # Assert
        assert response.status_code in (401, 403)
