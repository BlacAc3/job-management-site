# Job Board API Endpoints and Features

This document outlines the API endpoints and features for a job board website, including both implemented and planned functionalities.

## Implemented Endpoints and Features

### User Authentication

*   `/api/users/register`:
    *   **Method:** POST
    *   **Description:** Registers a new user (both job seekers and employers).  Requires fields like `email`, `password`, `user_type` (e.g., "seeker", "employer"), `first_name`, `last_name`.  Returns a JWT upon successful registration.
    *   **Status:** Implemented
*   `/api/users/login`:
    *   **Method:** POST
    *   **Description:** Logs in an existing user. Requires `email` and `password`. Returns a JWT upon successful login.
    *   **Status:** Implemented
*   `/api/users/me`:
    *   **Method:** GET
    *   **Description:** Retrieves the profile of the currently logged-in user. Requires a valid JWT in the `Authorization` header.
    *    **Status:** Implemented

### Job Postings

*   `/api/jobs`:
    *   **Method:** GET
    *   **Description:** Retrieves a list of all job postings. Supports pagination, filtering (by keywords, location, salary range, job type, etc.), and sorting (by date, relevance, etc.).
        *    **Query Parameters (Implemented):** `page`, `limit`, `search` (for keyword search)
    *   **Status:** Partially Implemented (basic listing and search)
*   `/api/jobs`:
    *   **Method:** POST
    *   **Description:** Creates a new job posting.  Requires a valid JWT (employer role) and fields like `title`, `description`, `location`, `salary`, `job_type`, `company_id`.
    *   **Status:** Implemented
*   `/api/jobs/{job_id}`:
    *   **Method:** GET
    *   **Description:** Retrieves a specific job posting by its ID.
    *   **Status:** Implemented
*   `/api/jobs/{job_id}`:
    *   **Method:** PUT
    *   **Description:** Updates an existing job posting. Requires a valid JWT (employer role and ownership of the job posting).
    *   **Status:** Implemented
*   `/api/jobs/{job_id}`:
    *   **Method:** DELETE
    *   **Description:** Deletes a job posting. Requires a valid JWT (employer role and ownership of the job posting).
    *   **Status:** Implemented

### Company Profiles

*   `/api/companies`:
    *    **Method:** GET
    *    **Description:** Retrieves a list of companies.
    *    **Status:** Implemented
*   `/api/companies/{company_id}`:
    *   **Method:** GET
    *   **Description:** Retrieves a specific company profile by its ID.
    *   **Status:** Implemented
*    `/api/companies`:
    *    **Method:** POST
    *    **Description:** Allows employers to create new companies.
    *    **Status:** Implemented
*    `/api/companies/{company_id}`:
    *    **Method:** PUT
    *    **Description:** Updates an existing company. Requires a valid JWT (employer role and ownership of the company).
    *   **Status:** Implemented

### Job Applications

*    `/api/jobs/{job_id}/apply`
    *     **Method:** POST
    *     **Description:** Allows the logged in job seeker to apply to a job.
    *    **Status:** Implemented

## Unimplemented and Necessary Features (for Production Readiness)

### User Authentication & Authorization

*   **Password Reset:**
    *   `/api/users/forgot-password`: (POST) Initiate password reset process (send email with reset token).
    *   `/api/users/reset-password`: (POST) Reset password using the token.
*   **Email Verification:**
    *   `/api/users/verify-email/{token}`: (GET) Verify user email after registration.
*   **Role-Based Access Control (RBAC):**  More granular control over permissions beyond just "seeker" and "employer".  (e.g., "admin", "moderator").
*   **Social Login:**  Integration with third-party providers (Google, LinkedIn, etc.).
*    **Two-Factor Authentication (2FA):** Enhance the sign in security.

### Job Postings

*   **Advanced Filtering:**
    *   `/api/jobs`: (GET) Implement all planned query parameters:  `location`, `salary_min`, `salary_max`, `job_type` (full-time, part-time, contract, etc.), `experience_level`, `industry`, `date_posted`.
*   **Featured/Sponsored Jobs:**  Ability to mark certain jobs as featured (higher visibility).
    *   `/api/jobs/{job_id}/feature`: (POST) - Admin endpoint to feature a job.
*   **Job Expiration:** Automatically expire job postings after a certain period.
*   **Job Saving:** Allow job seekers to save jobs for later.
    *   `/api/users/me/saved-jobs`: (GET) - Retrieve saved jobs.
    *   `/api/jobs/{job_id}/save`: (POST) - Save a job.
    *   `/api/jobs/{job_id}/unsave`: (DELETE) - Unsave a job.
*   **Similar Jobs Recommendations:** Suggest similar jobs based on a user's profile and viewed jobs.

### Company Profiles

*   **Company Reviews:**  Allow users to review companies.
    *    `/api/companies/{company_id}/reviews`: (GET, POST) - Get and post reviews.
*   **Company Followers:** Allow users to follow companies.
*   **Company Branding:** Allow companies to customize their profiles more extensively (logo, banner image, about section, etc.).

### Job Applications

*   **Application Tracking:**  Allow employers to manage applications (track status, add notes, etc.).
    *   `/api/jobs/{job_id}/applications`: (GET) - Get applications for a job (employer view).
    *   `/api/applications/{application_id}`: (GET, PUT) - Get and update application details (employer view).
*   **Resume/CV Upload:**
    *   `/api/applications/{application_id}/resume`: (POST) - Upload resume/CV.
*   **Cover Letter:** Allow job seekers to submit a cover letter.
*   **Application Status Updates:**  Notify job seekers about changes in their application status.
*    **Internal Messaging:** Facilitate in-app communication between applicants and hiring managers.

### Admin Panel

*   **User Management:**  CRUD operations for user accounts.
*   **Job Posting Moderation:**  Review and approve/reject job postings.
*   **Content Management:**  Manage static content on the site (e.g., FAQs, terms of service).
*   **Analytics Dashboard:**  Track key metrics (job postings, applications, user activity, etc.).

### General Improvements

*   **Email Notifications:**  Send email notifications for various events (new job postings, application updates, password resets, etc.).
*   **Search Indexing:**  Use a dedicated search index (e.g., Elasticsearch, Algolia) for faster and more relevant search results.
*   **Rate Limiting:**  Prevent abuse by limiting the number of requests from a single IP address or user.
*   **Error Handling:**  Implement robust error handling and reporting.
*   **Logging:**  Comprehensive logging for debugging and auditing.
*   **Testing:**  Thorough unit and integration tests.
*   **Deployment:**  Automated deployment pipeline (CI/CD).
*   **Scalability:**  Design the system to handle a large number of users and job postings.
*   **Internationalization (i18n):**  Support multiple languages.
*   **Accessibility (a11y):**  Ensure the website is accessible to users with disabilities.
*   **Payment Gateway Integration:** if sponsored posts will be a feature, then there must be payment options for employers.

This list provides a comprehensive overview of the features required for a production-ready job board website. The "Unimplemented" section highlights areas for future development.
```
