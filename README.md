## Implemented Endpoints and Features

### User Authentication

* `/api/auth/register`:
  * **Method:** POST
  * **Description:** Registers a new user.
  * **Request Body:** `firstName`, `lastName`, `email`, `password`
  * **Response:** Returns user details and a JWT upon successful registration.
  * **Status:** Implemented

* `/api/auth/login`:
  * **Method:** POST
  * **Description:** Logs in an existing user.
  * **Request Body:** `email`, `password`
  * **Response:** Returns user details and a JWT upon successful login.
  * **Status:** Implemented

* `/api/auth/me`:
  * **Method:** POST
  * **Description:** Retrieves the profile of the currently logged-in user.
  * **Response:** Returns user details.
  * **Status:** Implemented

* `/api/auth/logout`:
  * **Method:** POST
  * **Description:** Logs out the current user by invalidating their token.
  * **Response:** Confirmation message.
  * **Status:** Implemented

* `/api/auth/forgot-password`:
  * **Method:** POST
  * **Description:** Initiates password reset process.
  * **Request Body:** `email`
  * **Response:** Reset token (in production, this would be sent via email).
  * **Status:** Implemented

* `/api/auth/reset-password`:
  * **Method:** POST
  * **Description:** Resets user password using the token.
  * **Request Body:** `resetToken`, `newPassword`
  * **Response:** Confirmation message.
  * **Status:** Implemented

### Job Postings

* `/api/jobs`:
  * **Method:** GET
  * **Description:** Retrieves a list of all job postings.
  * **Query Parameters:** `page`, `limit`, `type`, `location`
  * **Response:** List of jobs with pagination details.
  * **Status:** Implemented

* `/api/jobs`:
  * **Method:** POST
  * **Description:** Creates a new job posting.
  * **Request Body:** `title`, `description`, `type`, `location`, `company`, `salary`
  * **Auth Required:** Yes
  * **Response:** Created job details.
  * **Status:** Implemented

* `/api/jobs/:id`:
  * **Method:** GET
  * **Description:** Retrieves a specific job posting by its ID.
  * **Response:** Job details.
  * **Status:** Implemented

* `/api/jobs/:id`:
  * **Method:** PUT
  * **Description:** Updates an existing job posting.
  * **Request Body:** Job fields to update.
  * **Auth Required:** Yes (job owner or admin)
  * **Response:** Updated job details.
  * **Status:** Implemented

* `/api/jobs/:id`:
  * **Method:** DELETE
  * **Description:** Deletes a job posting.
  * **Auth Required:** Yes (job owner or admin)
  * **Response:** Confirmation message.
  * **Status:** Implemented

* `/api/jobs/my-jobs`:
  * **Method:** GET
  * **Description:** Retrieves jobs posted by the logged-in user.
  * **Auth Required:** Yes
  * **Response:** List of user's jobs.
  * **Status:** Implemented

### Job Applications

* `/api/jobs/:id/apply`:
  * **Method:** POST
  * **Description:** Allows a user to apply to a job.
  * **Request Body:** `coverLetter`, `resume`
  * **Auth Required:** Yes
  * **Response:** Application details.
  * **Status:** Implemented

* `/api/jobs/:id/applications`:
  * **Method:** GET
  * **Description:** Retrieves applications for a job posting.
  * **Auth Required:** Yes (job owner or admin)
  * **Response:** List of applications.
  * **Status:** Implemented

* `/api/jobs/:id/applications/:applicationId`:
  * **Method:** PUT
  * **Description:** Updates an application status.
  * **Request Body:** `status` (pending, accepted, rejected)
  * **Auth Required:** Yes (job owner or admin)
  * **Response:** Updated application details.
  * **Status:** Implemented

* `/api/jobs/:id/applications/:applicationId`:
  * **Method:** DELETE
  * **Description:** Deletes a job application.
  * **Auth Required:** Yes (job owner, applicant, or admin)
  * **Response:** Confirmation message.
  * **Status:** Implemented

## Planned Features (Not Yet Implemented)

### User Authentication & Authorization

* **Email Verification:** Verify user email after registration.
* **Role-Based Access Control (RBAC):** More granular control over permissions.
* **Social Login:** Integration with third-party providers.
* **Two-Factor Authentication (2FA):** Enhance sign-in security.

### Job Postings

* **Advanced Filtering:** Additional query parameters like salary range, experience level, etc.
* **Featured/Sponsored Jobs:** Ability to mark certain jobs as featured.
* **Job Expiration:** Automatically expire job postings after a certain period.
* **Job Saving:** Allow job seekers to save jobs for later.
* **Similar Jobs Recommendations:** Suggest similar jobs based on user profile.

### Company Profiles

* **Company Profiles:** Create and manage company profiles.
* **Company Reviews:** Allow users to review companies.
* **Company Followers:** Allow users to follow companies.
* **Company Branding:** Customization options for company profiles.

### Job Applications

* **Resume/CV Upload:** Support for document uploads.
* **Internal Messaging:** Communication between applicants and hiring managers.

### Admin Features

* **User Management:** CRUD operations for user accounts.
* **Job Posting Moderation:** Review and approve/reject job postings.
* **Analytics Dashboard:** Track key metrics.

### General Improvements

* **Email Notifications:** For various events and updates.
* **Advanced Search:** Improved search functionality.
* **Rate Limiting:** Prevent abuse.
* **Testing & Deployment:** Automated testing and deployment pipelines.
* **Scalability Improvements:** For handling larger user bases.
* **Payment Integration:** For premium features.
