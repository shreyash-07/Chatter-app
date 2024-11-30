# Chatter - Real-time Chat Application

**Chatter** is a responsive real-time chat application built with **ReactJS** and **Firebase**. The app allows users to engage in seamless real-time conversations with authentication and smooth user interface.

## Features

- **Real-time Messaging**: Instant message delivery using Firebase Firestore.
- **User Authentication**: Secure login and signup using Firebase Authentication.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **User Presence**: Displays online/offline status of users.
- **Clean UI**: Designed with ReactJS for a modern and intuitive interface.

## Technologies Used

### Frontend:

- **ReactJS**: For building a dynamic and interactive UI.
- **Tailwind CSS**: For styling and responsive design.

### Backend:

- **Firebase**:
  - **Authentication**: Handles secure user login and signup.
  - **Firestore Database**: Real-time database for storing messages.

---

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- npm or yarn
- Firebase account

### Steps to Set Up Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/shreyash-07/Chatter-app.git
   cd Chatter-app

   ```

2. Install dependencies:

   Copy code
   ```bash
    npm install

   ```
### 3. Configure Firebase:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project.
3. Enable **Authentication** (Email/Password) and **Firestore Database**.
4. Copy the Firebase configuration from the project settings.

#### Add Firebase Configuration:

1. Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id

2. Replace the placeholders with your Firebase project details.
   Start the application:
   Run the following command to start the development server:
   ```bash
    npm run dev
    ```
3. Open the app in your browser
