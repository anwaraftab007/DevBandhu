# Project Name: DevSangha

## Description
DevSangha is a collaborative platform designed to connect developers for project sharing and skill development. This repository contains the backend setup for the application, while the frontend is currently under construction.

---

## Table of Contents
- [Backend Overview](#backend-overview)
- [API Routes](#api-routes)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Usage](#usage)

---

## Backend Overview

The backend is built using **Node.js** and **Express**, with **MongoDB** as the database. This application manages user registrations, logins, project creation, and collaborations through well-defined API routes. It utilizes JWT for authentication and is structured for scalability and maintainability.

### API Routes

1. **User Routes**
   - **POST /user/register**  
     - Request Body:
       ```json
       {
         "fullName": "string",
         "username": "string",
         "email": "string",
         "password": "string",
         "skills": ["string"]
       }
       ```

   - **POST /user/login**  
     - Request Body:
       ```json
       {
         "email": "string",
         "password": "string"
       }
       ```

   - **POST /user/logout**  
     - Request Body:
       - No body required; simply call this route to log the user out.

   - **POST /user/changePassword**  
     - Request Body:
       ```json
       {
         "oldPassword": "string",
         "newPassword": "string"
       }
       ```

   - **GET /user/getUser**  
     - Request Headers:
       - `Authorization`: Bearer token of the logged-in user.

   - **PUT /user/updateSkills**  
     - Query Parameters:
       - `skills`: Comma-separated string of skills (e.g., `React,Node.js`).

2. **Project Routes**
   - **POST /user/createProject**  
     - Request Body:
       ```json
       {
         "title": "string",
         "description": "string",
         "skills": ["string"],
         "leader": "userId"
       }
       ```

   - **POST /user/joinProject/:projectId**  
     - URL Parameters:
       - `projectId`: ID of the project to join.

---

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```plaintext
MONGODB_URI=mongodb://<username>:<password>@localhost:27017/devsangha
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=30d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
