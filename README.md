<div align="center">

# PlayFlex — Sport Facility Reservation Platform

**AI-powered sport facility booking**

[![Deploy](https://img.shields.io/badge/deploy-VPS-blue?logo=github-actions&logoColor=white)](#deployment)
[![Frontend](https://img.shields.io/badge/frontend-React_19-61DAFB?logo=react&logoColor=white)](#tech-stack)
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688?logo=fastapi&logoColor=white)](#tech-stack)
[![Database](https://img.shields.io/badge/database-PostgreSQL_17-4169E1?logo=postgresql&logoColor=white)](#tech-stack)

---

A full-stack web application for browsing, booking, and managing sport facility reservations. Features an **AI-powered chatbot** (via n8n) for intelligent booking assistance and personalized facility recommendations based on user history.

### [Live Application](https://playflex.pl)

**Demo Access Credentials:**

- **Admin:** `admin@demo.com` / `admin123`

</div>

---

## Table of Contents

- [Application Previews](#application-previews)
- [The Problem It Solves](#the-problem-it-solves)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Application Previews

### Landing Page & Browsing

Modern landing page with scroll-reveal animations, facility categories, and a step-by-step reservation guide.

<!-- ZAMIEŃ PONIŻSZY LINK NA WYGENEROWANY PRZEZ GITHUB PO PRZECIĄGNIĘCIU WIDEO -->

https://github.com/user-attachments/assets/twój-unikalny-link-do-wideo-1

### Dashboard & Booking Flow

Full authentication flow and the main booking dashboard with facility browsing, time-slot selection, and reservation management.

<!-- ZAMIEŃ PONIŻSZY LINK NA WYGENEROWANY PRZEZ GITHUB PO PRZECIĄGNIĘCIU WIDEO -->

https://github.com/user-attachments/assets/twój-unikalny-link-do-wideo-2

### AI-Powered Reservations

Conversational AI chatbot that helps users find and book facilities through natural language.

<!-- ZAMIEŃ PONIŻSZY LINK NA WYGENEROWANY PRZEZ GITHUB PO PRZECIĄGNIĘCIU WIDEO -->

https://github.com/user-attachments/assets/twój-unikalny-link-do-wideo-3

---

## The Problem It Solves

Currently, residents looking to book local sports facilities often have to navigate through multiple outdated websites, make phone calls, or even visit locations in person just to check availability. PlayFlex solves this fragmentation by providing a unified, modern booking ecosystem tailored for local communities.

- **Centralized Hub for the Community:** PlayFlex aggregates all municipal or local sports facilities (sports halls, stadiums, tennis courts, pools) into a single platform. Users from a given town or city no longer need to search across different, disconnected sites—everything they need to stay active is available in one place.
- **Dedicated Facility Hosts:** The system is designed with distributed management in mind. Each facility has an assigned admin/host (_gospodarz_). Instead of a central office handling all operations, local hosts can log into their dedicated Admin Panel to approve reservations, adjust opening hours, update pricing, and manage their specific facility autonomously.
- **Modernizing Local Infrastructure:** It replaces messy paper calendars and phone-based bookings with a 24/7 digital system. Complete with AI assistance and automated email reminders, it significantly reduces the administrative burden on local governments, schools, or private operators.

---

## Features

### Client Panel

- **Authentication:** Register, login, password reset via email verification codes.
- **Facility Browsing:** Browse by category (halls, stadiums, racket sports, gyms & saunas) with images, descriptions, and pricing.
- **Smart Reservations:** Calendar-based date selection generating available time slots for one-click booking.
- **My Bookings:** View, track status (pending / confirmed / cancelled), and manage reservations.
- **Profile Management:** Edit contact info, change password, upload avatar (Cloudinary), and toggle email notifications.
- **AI Chat:** Conversational booking via chatbot with natural language processing.
- **AI Recommendations:** Personalized facility suggestions based on booking history.

### Admin Panel

- **Dashboard:** Overview of all reservation requests with an approve/reject workflow.
- **Dedicated Management:** Facility hosts manage only the venues assigned to them.
- **Facility Settings:** Comprehensive CRUD operations for facility management (pricing, hours, media, status).
- **User Management:** View and manage registered users interacting with the facility.
- **Manual Reservations:** Create walk-in bookings for guests requiring only a name and phone number.

---

## Tech Stack

| Layer             | Technology                                                                                |
| :---------------- | :---------------------------------------------------------------------------------------- |
| **Frontend**      | React 19, TypeScript, Vite, Ant Design 6, React Router 7, TanStack Query, React Hook Form |
| **Backend**       | Python, FastAPI, SQLAlchemy 2.0, Pydantic v2, APScheduler                                 |
| **Database**      | PostgreSQL 17, pgAdmin 4                                                                  |
| **AI/Automation** | n8n (self-hosted workflow automation for chatbot)                                         |
| **Email**         | Resend API (transactional emails)                                                         |
| **Media**         | Cloudinary (avatar & facility image storage)                                              |
| **Auth**          | JWT (python-jose), bcrypt password hashing                                                |
| **DevOps**        | Docker Compose, GitHub Actions CI/CD, Nginx (production reverse proxy)                    |
| **Testing**       | Backend: pytest · Frontend: Vitest + React Testing Library                                |

---

## Project Structure

```text
sport-reservation/
├── .github/workflows/      # GitHub Actions auto-deploy configuration
├── backend/
│   ├── app/
│   │   ├── core/           # Config & settings
│   │   ├── db/             # Database session & base model
│   │   ├── models/         # SQLAlchemy models (User, Facility, Reservation)
│   │   ├── routers/        # API endpoints
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── services/       # Business logic (Auth, Bookings, AI, Emails)
│   │   └── main.py         # FastAPI app entry point
│   ├── tests/              # pytest test suite
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/            # API client functions
│   │   ├── components/     # Reusable UI components
│   │   ├── sections/       # Page-level components
│   │   └── types/          # TypeScript type definitions
│   └── Dockerfile
└── docker-compose.yml      # Container orchestration
```
