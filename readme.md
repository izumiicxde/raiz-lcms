# **RAÍZ LCMS**

Raíz LCMS (Learning Content Management System) is a collaborative platform where students can upload, manage, and share study materials. Each student can create content related to their course, explore materials uploaded by peers, and follow other students to stay updated with their shared content. The system enables a simplified learning ecosystem through visibility-based content access, tagging, and personalized study content discovery.

---

## **1. TABLE OF CONTENTS**

1. Overview
2. Features
3. Setup and Installation
4. Project Structure
5. Technology Stack
6. Environment Configuration
7. Application Modules
8. API Endpoints
9. License

---

## **2. OVERVIEW**

Raíz LCMS is designed to facilitate student-driven content sharing in academic environments. Built using **Laravel**, **React**, and **Inertia.js**, it provides a smooth single-page experience that integrates backend and frontend operations seamlessly. Students can log in, upload study content, set visibility preferences, and interact with materials shared by others.

The goal is to maintain an efficient, user-friendly interface where learners can manage their materials, follow peers for updates, and discover resources relevant to their courses without administrative complexity.

---

## **3. SETUP AND INSTALLATION**

### **3.1 Clone the repository**

```bash
git clone <repo-url>
cd project-folder

```

### **3.2 Install PHP dependencies**

```bash
composer install

```

### **3.3 Install Node.js dependencies**

```bash
npm install

```

### **3.4 Generate application key**

```bash
php artisan key:generate

```

### **3.5 Run migrations**

```bash
php artisan migrate --seed

```

### **3.6 Start the development servers**

```bash
php artisan serve
npm run dev

```

---

## **4. PROJECT STRUCTURE**

The project follows a standard **Laravel + Inertia React** structure integrating backend and frontend within the same repository.

```
Raiz-LCMS/
│
├── app/                  # Laravel application logic (Models, Controllers)
├── bootstrap/            # Laravel bootstrap files
├── config/               # Application configurations
├── database/             # Migrations and seeders
├── public/               # Publicly accessible files (storage, compiled assets)
├── resources/
│   ├── js/               # React components, pages, and Inertia setup
│   ├── views/            # Blade templates (if any)
│   └── css/              # Tailwind and global styles
├── routes/
│   └── web.php           # Application routes
├── storage/              # File uploads and logs
├── .env.example          # Example environment configuration
└── package.json          # Frontend dependencies

```

---

## **5. TECHNOLOGY STACK**

- **Backend:** Laravel 11
- **Frontend:** React with Inertia.js
- **Styling:** Tailwind CSS with shadcn/ui components
- **Database:** SQLite
- **Authentication:** Laravel Breeze (Email/Password)
- **Storage:** Local filesystem
- **Environment:** Local Development

---

## **6. ENVIRONMENT CONFIGURATION**

### **6.1 Environment setup**

Duplicate the provided `.env.example` file and rename it as `.env`.

This configuration defines the local database and application settings.

### **6.2 Example configuration**

```
APP_NAME=RaizLCMS
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=sqlite

FILESYSTEM_DISK=public

```

### **6.3 Storage linking**

Before uploading files, ensure storage is linked properly:

```bash
php artisan storage:link

```

---

## **7. APPLICATION MODULES**

### **7.1 Authentication**

Students can register, log in, and access their personalized dashboard. The system maintains session-based authentication handled by Laravel and Inertia.

### **7.2 Study content management**

Students can upload files related to their course. Each file includes:

- Title, description, and hashtags for better discoverability.
- Visibility settings (Public or Private).
- Automatic storage in `/storage/app/public/uploads` with database reference.

Uploaded materials are immediately available for viewing or download.

### **7.3 Follow system**

Each student can follow any other student without requests or approvals.

Followed users’ public uploads appear prioritized in listings.

Unfollowing removes their content from the personalized feed.

### **7.4 Content visibility**

- **Public:** Visible to all students.
- **Private:** Only visible to the uploader.

Visibility rules are enforced at the database query level.

### **7.5 Search and filtering**

- Search students or content by keywords or hashtags.
- Apply a “Show only followed users” filter directly in the UI.
- Results dynamically update through Inertia routing.

### **7.6 Theme system**

The application includes light and dark themes controlled from the settings page.

Theme preference persists across sessions.

---

## **8. API ENDPOINTS**

### **8.1 User-related routes**

| Method   | Endpoint                    | Description         |
| -------- | --------------------------- | ------------------- |
| `GET`    | `/list/users`               | Fetch list of users |
| `POST`   | `/list/users/{id}/follow`   | Follow a student    |
| `DELETE` | `/list/users/{id}/unfollow` | Unfollow a student  |

### **8.2 Study content routes**

| Method   | Endpoint                | Description                      |
| -------- | ----------------------- | -------------------------------- |
| `GET`    | `/study-content`        | List all visible study materials |
| `POST`   | `/study-content/upload` | Upload a new file                |
| `PUT`    | `/study-content/{id}`   | Update existing content          |
| `DELETE` | `/study-content/{id}`   | Delete uploaded content          |

All requests are authenticated through Laravel’s middleware stack and return Inertia responses to maintain SPA behavior.

---

## **9. LICENSE**

This project is developed for learning and academic demonstration purposes.

All rights reserved © Raíz LCMS Development Team.

---
