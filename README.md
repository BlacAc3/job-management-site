# Job Management API Documentation

## Overview
This API provides endpoints for user authentication, job posting, job applications, and related operations for a job management platform.

## Authentication Endpoints

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Register a new user
- **Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User object with JWT token

### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User object with JWT token

### Logout User
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Description**: Invalidate user's token
- **Headers**: Requires authorization token
- **Response**: Success message

### Get User Profile
- **URL**: `/auth/me`
- **Method**: `GET`
- **Description**: Get authenticated user's profile information
- **Headers**: Requires authorization token
- **Response**: User object

### Forgot Password
- **URL**: `/auth/forgot-password`
- **Method**: `POST`
- **Description**: Request password reset
- **Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**: Password reset instructions and token

### Reset Password
- **URL**: `/auth/reset-password`
- **Method**: `POST`
- **Description**: Reset user password using token
- **Body**:
  ```json
  {
    "resetToken": "string",
    "newPassword": "string"
  }
  ```
- **Response**: Success message

## Job Endpoints

### Get Jobs
- **URL**: `/jobs`
- **Method**: `GET`
- **Description**: Get all jobs with optional filtering
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `type`: Filter by job type
  - `location`: Filter by location
- **Response**: List of jobs with pagination data

### Get Job by ID
- **URL**: `/jobs/:id`
- **Method**: `GET`
- **Description**: Get details of a specific job
- **Response**: Job object

### Post Job
- **URL**: `/jobs`
- **Method**: `POST`
- **Description**: Create a new job posting
- **Headers**: Requires authorization token
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "type": "string",
    "location": "string",
    "company": "string",
    "salary": "number"
  }
  ```
- **Response**: Created job object

### Update Job
- **URL**: `/jobs/:id`
- **Method**: `PUT`
- **Description**: Update an existing job
- **Headers**: Requires authorization token
- **Body**: Job fields to update
- **Response**: Updated job object

### Delete Job
- **URL**: `/jobs/:id`
- **Method**: `DELETE`
- **Description**: Delete a job posting
- **Headers**: Requires authorization token
- **Response**: Success message

### Get Jobs by User
- **URL**: `/job/my-jobs`
- **Method**: `GET`
- **Description**: Get jobs posted by the authenticated user
- **Headers**: Requires authorization token
- **Response**: List of user's job postings

## Job Application Endpoints

### Apply to Job
- **URL**: `/jobs/:id/apply`
- **Method**: `POST`
- **Description**: Submit application for a job
- **Headers**: Requires authorization token
- **Body**:
  ```json
  {
    "coverLetter": "string",
    "resume": "string"
  }
  ```
- **Response**: Created application object

### Get Job Applications
- **URL**: `/jobs/:id/applications`
- **Method**: `GET`
- **Description**: Get all applications for a specific job
- **Headers**: Requires authorization token (job poster only)
- **Response**: List of applications

### Update Application Status
- **URL**: `/applications/:applicationId`
- **Method**: `PUT`
- **Description**: Update status of an application
- **Headers**: Requires authorization token (job poster only)
- **Body**:
  ```json
  {
    "status": "pending|accepted|rejected"
  }
  ```
- **Response**: Updated application object

### Delete Application
- **URL**: `/applications/:applicationId`
- **Method**: `DELETE`
- **Description**: Delete an application
- **Headers**: Requires authorization token
- **Response**: Success message

## Additional Job Features

### Get Featured Jobs
- **URL**: `/featured-jobs`
- **Method**: `GET`
- **Description**: Get a list of featured job postings
- **Response**: List of featured jobs

### Search Jobs
- **URL**: `/search-jobs`
- **Method**: `GET`
- **Description**: Search jobs with advanced filtering
- **Query Parameters**:
  - `keyword`: Search in title and description
  - `location`: Filter by location
  - `type`: Filter by job type
  - `minSalary`: Minimum salary
  - `maxSalary`: Maximum salary
  - `company`: Filter by company name
  - `page`: Page number
  - `limit`: Items per page
  - `sortBy`: Field to sort by
  - `sortOrder`: Sort direction (asc/desc)
- **Response**: Filtered jobs with pagination

### Get Recent Jobs
- **URL**: `/recent-jobs`
- **Method**: `GET`
- **Description**: Get recently posted jobs
- **Query Parameters**:
  - `limit`: Number of jobs to return
- **Response**: List of recent jobs

### Get Popular Categories
- **URL**: `/popular-categories`
- **Method**: `GET`
- **Description**: Get most popular job categories
- **Response**: List of categories with counts

## Job Saving and Recommendations

### Save Job
- **URL**: `/jobs/:id/save`
- **Method**: `POST`
- **Description**: Save a job for later viewing
- **Headers**: Requires authorization token
- **Response**: Success message

### Get Saved Jobs
- **URL**: `/saved-jobs`
- **Method**: `GET`
- **Description**: Get list of jobs saved by the user
- **Headers**: Requires authorization token
- **Response**: List of saved jobs

### Remove Saved Job
- **URL**: `/saved-jobs/:id`
- **Method**: `DELETE`
- **Description**: Remove a job from saved list
- **Headers**: Requires authorization token
- **Response**: Success message

### Get Job Recommendations
- **URL**: `/job-recommendations`
- **Method**: `GET`
- **Description**: Get personalized job recommendations
- **Headers**: Requires authorization token
- **Response**: List of recommended jobs

## Additional Features

### Get Job Statistics
- **URL**: `/job-stats`
- **Method**: `GET`
- **Description**: Get overall job statistics
- **Response**: Job statistics data

### Report Job
- **URL**: `/jobs/:id/report`
- **Method**: `POST`
- **Description**: Report a problematic job posting
- **Headers**: Requires authorization token
- **Body**:
  ```json
  {
    "reason": "string",
    "details": "string"
  }
  ```
- **Response**: Report confirmation

## Authentication
Most endpoints require authentication using a JWT token.
Include the token in the request header:
```
Authorization: Bearer <token>
```
