# SeatSpark — Round 3 Ticket Booking HLD Demo

A lightweight, responsive ticket-booking front end built with plain HTML, CSS and JavaScript. It has **no npm packages, build step, database setup or environment variables**.

## Run locally (easiest)

1. Download and extract `SeatSpark-Round3.zip`.
2. Open the extracted folder.
3. Double-click `index.html` to open it in your browser.

If your browser blocks anything in local-file mode, use a local server:
- Open the folder in VS Code.
- Install the **Live Server** extension if needed.
- Right-click `index.html` → **Open with Live Server**.

Alternative if Python is installed, open a terminal in this folder and run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Features you can demonstrate
- Browse upcoming events.
- Search by event/venue and filter by category.
- Open an event, select up to eight available seats and confirm a demo reservation.
- See a booking ID and reservation in **My bookings**.
- Cancel or clear demo reservations.
- Responsive desktop/mobile layout.
- Round 3 HLD overview showing client, REST API layer, PostgreSQL, Redis cache, booking safety and notification queue.

## Deploy on Vercel (no backend setup needed for this demo)
1. Upload the contents of this folder to a GitHub repository.
2. In Vercel, import that repository.
3. Deploy with the default settings. No environment variables are required.

## Important limitations
This is an educational **front-end demo**. Demo bookings are stored in the current browser using `localStorage`, not a shared database. It does not take payments, provide real authentication, send notifications, or prevent simultaneous bookings across different users/devices. The architecture section describes how those production services would fit together. A production system needs a server/API, PostgreSQL transactions or seat holds, authentication, payment-provider integration, and a queue/notification worker.
