# Carbon Fighters

## Stack

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

The frontend is built with **React** for component-based UI development and **Tailwind CSS** for rapid, utility-first styling.

The backend uses **Node.js**, providing a fast and scalable environment for building RESTful APIs and handling authentication.

## Front-Back Communication

### Register - POST

```json
{
  "full_name": "John Doe",
  "email": "john@email.com",
  "phone": "+5500987654321",
  "password": "encrypted_password",
  "date_of_birth": "1990-01-01"
}
```

### Login - POST

```json
{
  "email": "john@email.com",
  "password": "encrypted_password"
}
```

#### Success

```json
{ "token": "session_token", "user": {...} }
```

#### Fail

```json
{ "error": "Invalid email or password" }
```

## To-Do

- Frontend
  - Login
  - Register
- Backend
  - Login
  - Register

## Authors

This project was developed for the Software Engineering Subject at UNICAMP (MC426 / MC656)

- [Rafael Setton](github.com/RafaelSetton)
