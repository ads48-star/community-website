# Community Website

A full-stack community website developed using Flask and MySQL.
This project allows users to contact the organization, apply as volunteers, and view community statistics through a responsive web interface and backend APIs.

---

# Features

* Contact form
* Volunteer registration form
* MySQL database integration
* REST API endpoints
* Form validation and error handling

---
# Technologies Used

## Backend

* Python
* Flask
* Flask-MySQLdb
* MySQL

## Frontend

* HTML5
* CSS3
* JavaScript

## Deployment

* Gunicorn
* GitHub

---

# Project Structure

```plaintext
community-website/
│
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
│
├── templates/
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   └── volunteer.html
│
├── static/
│   ├── css/
|   |    |____main.css
│   └── js/
|        |____main.js
│
└── database/
    └── schema.sql
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/yourusername/community-website.git
```

---

## Navigate into the Project Folder

```bash
cd community-website
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Database Setup

## Create Database

```sql
CREATE DATABASE community_db;
```

---

## Import Tables

Run the SQL queries inside:

```plaintext
database/schema.sql
```

---

# MySQL Configuration

Update your database credentials inside `app.py`:

```python
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'your_password'
app.config['MYSQL_DB'] = 'community_db'

```

---

# Running the Application

Start the Flask server:

```bash
python app.py
```

Open in browser:

```plaintext
http://127.0.0.1:5000
```

---

# API Endpoints

## Contact Form

```http
POST /api/contact
```

---

## Volunteer Form

```http
POST /api/volunteer
```

---

## Statistics API

```http
GET /api/stats
```

---

# Validation Features

The backend validates:

* Empty fields
* Email format
* Minimum character requirements
* Required selections

---

# Security Features

* Parameterized SQL queries
* Server-side validation
* Error handling using try-except blocks

---

# Future Improvements

* User authentication
* Admin dashboard
* Cloud deployment
* Environment variable support
* Enhanced UI/UX
* Email notifications

---

# Author

Developed as a Flask + MySQL web development project.

---

# License

This project is intended for educational purposes only.
