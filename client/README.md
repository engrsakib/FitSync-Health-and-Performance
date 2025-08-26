# FitSync Health and Performance - Gym Class Scheduling and Membership Management System

## Project Overview

FitSync is a full-featured Gym Class Scheduling and Membership Management System designed to streamline gym operations by organizing classes, trainers, and trainees with clear role-based access and robust business logic. The platform supports three user roles: **Admin**, **Trainer**, and **Trainee**, each with distinct responsibilities and permissions. FitSync ensures smooth scheduling, efficient class capacity management, and secure authentication for all users.

---

## Relation Diagram

![Relation Diagram](https://raw.githubusercontent.com/engrsakib/FitSync-Health-and-Performance/main/assets/relation-diagram.png)
<!-- If your diagram is hosted elsewhere, update the link above. If you don't have an image, use any free diagram tool (dbdiagram.io, draw.io), export as PNG/JPG, and upload in the repo. -->

---

## Technology Stack

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Backend:** Express.js, TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Token)
- **Deployment:** Vercel / Heroku
- **State Management:** Redux Toolkit
- **Other:** Framer Motion, React Three Fiber, Lucide Icons

---

## API Endpoints

### Auth & User Management

- `POST /api/v1/auth/login`  
  - **Body:** `{ email, password }`
  - **Response:** `{ token, user }`

- `POST /api/v1/auth/register`  
  - **Body:** `{ name, email, password, role }`
  - **Response:** `{ user }`

- `GET /api/v1/users/role/:role`  
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** `{ data: [users] }`

### Scheduling & Classes

- `POST /api/v1/scheduling/create`  
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:** `{ title, description, trainer, classDate, startTime, endTime, createdBy }`
  - **Response:** `{ schedule }`
  - **Limits:** Max 5 schedules/day; class duration 2 hrs.

- `GET /api/v1/scheduling/all`  
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** `{ data: [schedules] }`

### Booking

- `POST /api/v1/booking/create`  
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:** `{ schedule, trainee, bookingDate }`
  - **Response:** `{ booking }`
  - **Limits:** Max 10 trainees/schedule.

- `PATCH /api/v1/booking/:id`  
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** `{ success }`

---

## Database Schema

### User Model

```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string,
  role: 'ADMIN' | 'TRAINER' | 'TRAINEE',
  picture?: string,
  isActive: boolean,
  isDeleted: boolean,
  createdAt: Date,
}
```

### Schedule Model

```typescript
{
  _id: ObjectId,
  title: string,
  description?: string,
  trainer: ObjectId, // ref: User
  classDate: Date,
  startTime: string,
  endTime: string,
  createdBy: ObjectId, // ref: User (Admin)
  trainees: ObjectId[], // ref: User
  maxTrainees: number, // default: 10
  isFull: boolean,
  status: 'scheduled' | 'completed' | 'cancelled'
}
```

### Booking Model

```typescript
{
  _id: ObjectId,
  schedule: ObjectId, // ref: Schedule
  trainee: ObjectId, // ref: User
  bookingDate: Date,
  status: 'active' | 'cancelled'
}
```

---

## Admin Credentials

> **Admin Email:** `sakib@gamil.com`  
> **Admin Password:** `1445uIoG@`

---

## Instructions to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/engrsakib/FitSync-Health-and-Performance.git
cd FitSync-Health-and-Performance
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

### 3. Configure Environment Variables

> Create `.env` files for both `server` and `client` as per `.env.example`.

- **Backend .env**
  ```
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_jwt_secret
  ```

- **Frontend .env.local**
  ```
  NEXT_PUBLIC_API_URL=https://your-live-server-url/api
  ```

### 4. Start Server

```bash
cd server
npm run dev
# or
npm start
```

### 5. Start Client

```bash
cd client
npm run dev
```

### 6. Access the App

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Use the admin credentials above to log in as admin.

---

## Deployment

- **Live Server:** [https://fit-sync-server.vercel.app](https://fit-sync-server.vercel.app) <!-- Replace with your actual deployed server URL -->
- **Live Client:** [https://fit-sync-client.vercel.app](https://fit-sync-client.vercel.app) <!-- Replace with your actual deployed client URL -->

---

## Business Rules

- **Admins:** Max 5 classes per day, assign trainers, manage users.
- **Trainers:** Conduct assigned classes only, view schedules.
- **Trainees:** Book schedules (max 10 per class), manage own profile.
- **Schedule:** Each class lasts 2 hours.
- **Authentication:** JWT-based, role-based access.
- **Error Handling:** Unauthorized access, validation errors, booking/scheduling limit errors.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Contact

For any queries, contact [sakib@gamil.com](mailto:sakib@gamil.com)
