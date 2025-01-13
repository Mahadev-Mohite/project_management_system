# FOR LIVE API ACCESS READ THE CURL FOLDER'S FILES. THERE IS GIVEN END TO END DESCRIPTION OF EVERY API

# project_management_system
1. To get started with this project, clone the repository and install the necessary dependencies.
git clone https://github.com/Mahadev-Mohite/project_management_system

2.Navigate to the project directory:
cd project_management_system

3.Install dependencies:
npm install

4.Replace raw.env to .env file in the root directory with the necessary environment variables (e.g., database credentials, JWT secret, etc.) and replace with your actual values:
JWT_SECRET =YourActualSecret
host=localhost
user=root
password=""
database=Your database name

5. Run the application:
 node app.js || nodemon app.js

URLS Example for local:
create a new user
POST~   /api/v1/users/create

