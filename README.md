# <img src="./frontend/public/logo.png" height=30> Carbon Fighters

## Overview

Carbon Fighters is an innovative web application inspired by GymRats, but focused on environmental sustainability. Instead of earning points for physical exercises, users are rewarded for actions that reduce their carbon footprint, such as recycling, using public transport, or adopting energy-efficient habits. Track your eco-friendly activities, compete with friends, and contribute to a greener planet!

## Features

- **User Authentication**: Secure sign-up and login to track personal progress.

### Coming Soon...

- **Activity Logging**: Log daily actions that reduce carbon emissions and earn points.
- **Leaderboard**: Compete with others based on carbon savings.
- **Dashboard**: Visualize your impact with charts and stats.
- **Challenges**: Participate in community challenges for bonus points.
- **Badges and Rewards**: Unlock achievements for consistent eco-efforts.

## Tech Stack

This project is built using modern web technologies for a responsive and efficient experience:

[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

## Developers

The following developers are contributing to Carbon Fighters:

- [**Rafael Setton**](https://github.com/RafaelSetton) - Full-Stack Implementation
- [**Fernando Rodrigues**](https://github.com/FernandoRST7) - Backend and Database Expert
- [**Bruno Jambeiro**](https://github.com/Bruno-Jambeiro) - Backend and Database Expert
- [**Luiza Viana**](https://github.com/luizaviana) - Frontend Specialist
- [**Jeik Pasquel**](https://github.com/Savage-22) - Frontend Specialist

## Installation

To set up the project locally, follow these steps:

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Steps

1. **Clone the Repository**:

   ```
   git clone https://github.com/Bruno-Jambeiro/CarbonFighters.git
   cd CarbonFighters
   ```

2. **Install Dependencies**:

   - For the backend:

     ```
     cd backend
     npm install
     ```

   - For the frontend:

     ```
     cd ../frontend
     npm install
     ```

3. **Set Up the Database**:

   - The backend uses SQLite3, which requires no additional setup beyond installing dependencies.
   - Run any initial migrations:

     ```
     cd ../backend
     npm run migrate
     ```

4. **Environment Variables**:

   - Create a `.env` file in the backend directory with necessary variables

```sh
# backend/.env

PORT=3000
DB_PATH=./data/database.sqlite
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=1h
```

## Building and Running

### Build

- **Backend**: No build step needed for Node.js/Express, but you can compile TypeScript:

  ```
  cd backend
  tsc
  ```

- **Frontend**: Build the React app:

  ```
  cd frontend
  npm run build
  ```

### Run

- **Start the Backend**:

  ```
  cd backend
  npm run start  # Or 'ts-node src/index.ts' for development
  ```

  The server will run on `http://localhost:3000` (or your configured port).

- **Start the Frontend**:

  ```
  cd frontend
  npm run start
  ```

  The app will be available at `http://localhost:5173` (default Vite port for React+TS).

- **Development Mode**: Use `npm run dev` in both directories for hot-reloading.

For production, consider using tools like PM2 for the backend and serving the frontend build via Express or a static host.

## Usage

Once running:

- Navigate to the frontend URL in your browser.
- Sign up, log in, and start logging your carbon-reducing activities.
- View your dashboard for points and progress.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE file](./LICENSE) for details.

## Acknowledgments

- Inspired by GymRats for the gamification concept.
- Thanks to the open-source communities behind React, Tailwind, Node.js, and more.
