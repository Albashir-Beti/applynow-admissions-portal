# ApplyNow – Admissions Portal

ApplyNow is a responsive web-based admissions portal built as my final project for the Intermediate Frontend Development pathway.

The application allows prospective students to submit admission applications, track their application status, and view a rule-based admission prediction. It also provides an admin dashboard for reviewing, approving, and rejecting submitted applications.

## Live Demo

Frontend:
https://applynow-admissions-portal.netlify.app/

API:
https://applynow-admissions-api.onrender.com

## Features

### Applicant Application
- Multi-step admission application form
- Personal information collection
- Academic information
- Guardian information
- WAEC/NECO O'Level subject and grade entry
- JAMB score entry
- Nigerian State and LGA selection
- Form validation and error handling
- Review before final submission
- Application confirmation with unique Application ID

### Applicant Dashboard
- Search for an application using Application ID
- View submitted applicant information
- View application status
- Application progress/status indicator
- View O'Level results
- Rule-based admission status prediction

### Admin Dashboard
- View all submitted applications
- View applications awaiting review
- View applicant information
- Approve applications
- Reject applications
- Application statistics
- Status synchronization with the applicant dashboard

### Admission Status Predictor
The project includes a rule-based admission status predictor.

The predictor uses:
- JAMB performance
- O'Level performance

A weighted scoring system combines the results to calculate an admission likelihood score.

The current weighting is:
- JAMB: 60%
- O'Level: 40%

The result is classified as:
- High Likelihood
- Moderate Likelihood
- Low Likelihood

The prediction is for demonstration purposes only and does not represent an official admission decision.

## Technologies Used

- React
- JavaScript
- Tailwind CSS
- React Router
- Axios
- JSON Server
- Vite
- Git
- GitHub
- Netlify
- Render

## Project Structure

```text
applynow-admissions-portal/
│
├── public/
│   ├── _redirects
│   └── icons.svg
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   └── ProcessSection.jsx
│   │
│   ├── data/
│   │   └── nigeriaLocations.js
│   │
│   ├── pages/
│   │   ├── Admin.jsx
│   │   ├── ApplicationForm.jsx
│   │   ├── Confirmation.jsx
│   │   └── Dashboard.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── db.json
├── package.json
└── vite.config.js
