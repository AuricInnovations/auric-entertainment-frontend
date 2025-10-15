# Auric Entertainment Frontend

## Overview
Auric Entertainment’s public web application built with **React + TypeScript**.  
Phase One delivers the marketing and booking experience with API integration to the backend.  
No file uploads, payments, or outbound emails are included in this phase.

---

## Tech Stack
- React 18 + TypeScript  
- Tailwind CSS  
- React Query (TanStack Query)  
- Axios / Fetch for API calls  
- React Router (optional)

---

## Project Structure
- auric-frontend/
- ├─ src/
- │ ├─ api/ # axios client, query keys
- │ ├─ components/ # reusable UI components
- │ ├─ features/
- │ │ ├─ events/ # event list & detail
- │ │ └─ bookings/ # booking form & hooks
- │ ├─ pages/ # route components
- │ ├─ assets/ # static images/icons
- │ ├─ App.tsx
- │ └─ main.tsx
- ├─ index.html
- ├─ package.json
- └─ tailwind.config.js


---

## Environment Variables
Create `.env` (and `.env.production` if needed):

- VITE_API_BASE_URL=


---

## API Endpoints Used
| Method | Endpoint | Purpose |
|--------|-----------|----------|
| GET | `/api/events` | Fetch all published events |
| GET | `/api/events/{id}` | Fetch single event detail |
| POST | `/api/bookings` | Submit booking (no payment/email) |

---

## Local Development
```bash
npm install
npm run dev
```

- Visit http://localhost:5173 (or as printed in terminal).
```bash
npm run build
```
- Outputs production files in /dist.

## Phase One Scope

- Static content + API calls

## Future Enhancements

- Admin dashboard (event CRUD)
- Payments (Stripe or similar)
- Transactional email notifications (SendGrid)
- Media uploads (S3)
- Analytics dashboards

## License

- Internal project.
- © Auric Innovations – All rights reserved.


---
