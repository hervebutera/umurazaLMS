# Umuraza Rwanda Cultural Village Learners Management System

## Table of Contents

- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Endpoints](#endpoints)
    - [Authentication](#authentication)
    - [Users](#users)
    - [Courses](#courses)
- [Authors](#authors)

## Description

This repository contains the API for Umuraza Rwanda Cultural Village Learners Management System. The application's purpose is to digitalize learners registration for courses process and provide a platform to the institution to manage the users.

## Installation

### Prerequisites

- Node.js. You can download the latest version [here](https://nodejs.org/en/download)
- MySQL database. You can download the latest version [here](https://www.mysql.com/downloads/)

### Setup

- To get started, clone the repository to your local machine and navigate into the director.

```bash
git clone https://github.com/hervebutera/umurazaLMS.git
cd umurazaLMS
```
- Install the dependencies using;
``` bash
npm install
```
- Check the `.env.example` file for the required environment variables
- Create a `.env` file and add all the required environment variables
- Run the application using `npm run dev`

## Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/user/signup` | Create a new user |
| POST | `/api/user/login` | Login a user |
| PATCH | `/api/user/reset-password` | Reset user password |
| GET | `/api/user/token-verify` | Verify token from user's reset password email |

### Users

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/user/admins` | List all admin users |
| POST | `/api/user/search` | Search for single user |
| PATCH | `/api/user/changerole/:userId` | Changes a user's role. Roles are admin, super_admin, user |
| PATCH | `/api/user/changeactivestatus/:userId` | Activate or deactivate a user by a super admin user |
| PATCH | `/api/user/update-password` | Updates the user's password. It gets ther user's id from the authorization token. |


### Courses

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/course` | List all courses |
| POST | `/api/course/create` | Add a new course by an authenticated suer admin user |
| GET | `/api/course/:id` | Get single course details |

## Authors

- Herve Butera
