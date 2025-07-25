# Dental Scheduler Backend — Architecture & Documentation

## Table of Contents

1. [Overview & Assumptions](#overview--assumptions)
2. [API Endpoints & Features Checklist](#api-endpoints--features-checklist)
3. [System Architecture](#system-architecture)
4. [Tech Stack & Tools](#tech-stack--tools)

---

## Overview & Assumptions

- **Purpose**: An Express.js API server for managing users, dentists, and appointments in the Dental Scheduler system.
- **Assumptions**:
  - **PROJECT PRIORITY**: Focused on trying to build as much as functionality as possible as described on the test instructions sent of the PDF.
  - **Authentication**: JWT bearer token
  - **API Base URL**: `https://d1jvzv365exkzh.cloudfront.net/api`
  - **Database**: PostgreSQL accessed via Prisma ORM; connection configured by the `DATABASE_URL` environment variable.
  - **Rate Limiting**: Requests are throttled with a 1-minute window to mitigate abuse.
  - **CORS**: Configured to allow only the trusted frontend domain (`https://dentals-appointment.netlify.app/`) with credentials.

---

## API Endpoints & Features Checklist

- **Authentication**

  - [x] `POST /api/auth/register` – create a new user
  - [x] `POST /api/auth/login` – issue JWT cookie
  - [x] `POST /api/auth/logout` – clear JWT cookie
  - [x] `GET /api/auth/me` – fetch current user profile

- **Dentists**

  - [x] `GET  /api/dentists` – list all dentists
  - [x] `GET  /api/dentists/:id` – get dentist by ID
  - [ ] `POST /api/dentists` – (admin) add new dentist
  - [ ] `PUT  /api/dentists/:id` – (admin) update dentist
  - [ ] `DELETE /api/dentists/:id` – (admin) remove dentist

- **Appointments**

  - [x] `GET    /api/appointments` – list user’s appointments
  - [x] `GET    /api/appointments/availability` – check dentist availability
  - [x] `POST   /api/appointments` – book new appointment
  - [x] `PUT    /api/appointments/:id` – reschedule existing appointment
  - [x] `DELETE /api/appointments/:id` – cancel appointment

- **Error Handling & Validation**
  - [x] Centralized `errorHandler` middleware
  - [x] Input validation with Prisma and custom checks
  - [x] 400 / 401 / 404 / 500 status codes

---

## System Architecture

```plaintext
┌───────────────┐        HTTPS         ┌──────────────────────┐
│  Frontend App │◀───────────────────▶│      CloudFront      │
│ (Netlify/Vercel)│                    │                      │
└───────────────┘                      └──────────────────────┘
                                           │
                                           │ HTTPS
                                           ▼
                             ┌────────────────────────────┐
                             │   EKS Cluster (Express)    │
                             │ ┌────────────────────────┐ │
                             │ │ Pods:                  │ │
                             │ │ - auth-service         │ │
                             │ │ - dentist-service      │ │
                             │ │ - appointment-service  │ │
                             │ └────────────────────────┘ │
                             └────────────────────────────┘
                                           │
                                           │ Prisma over TCP
                                           ▼
                               ┌──────────────────────────┐
                               │   Amazon RDS (Postgres)  │
                               └──────────────────────────┘

```

## Tech Stack & Tools

Runtime & Framework

- Node.js & Express.js for RESTful API
- TypeScript for static typing

ORM & Database

- Prisma ORM
- PostgreSQL (Amazon RDS)
  Security & Reliability
- helmet for HTTP headers
- cors with strict origin & credentials
- express-rate-limit for throttling
- JWT for stateless authentication
  CLI & Dev Tools
- dotenv for environment variables
- ts-node-dev for local TypeScript hot reload
  Containerization & Orchestration
- Docker for image builds
- Kubernetes (EKS) for deployment
- AWS Secrets Manager / Kubernetes Secrets for sensitive configs
