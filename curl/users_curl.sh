# Base URL
BASE_URL="https://project-management-system-1-wk08.onrender.com/api/v1/user"

# Token (replace with an actual token after login)
TOKEN="YOUR_JWT_TOKEN"

# Create a new user
echo "Creating a new user..."
curl -X POST "$BASE_URL/create" \
  -H "Content-Type: application/json" \
  -d '{
        "username": "JohnDoe",
        "email": "johndoe@example.com",
        "password": "strongpassword123"
      }'
echo -e "\n"

# Fetch a user by ID
echo "Fetching a user by ID..."
curl -X GET "$BASE_URL/fetchById/1" \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# Delete a user by ID
echo "Deleting a user by ID..."
curl -X DELETE "$BASE_URL/deleteUserById/1" \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# Update a user
echo "Updating a user..."
curl -X PUT "$BASE_URL/update/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "username": "JaneDoe",
        "password": "newpassword123"
      }'
echo -e "\n"

# Login a user
echo "Logging in a user..."
curl -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
        "email": "johndoe@example.com",
        "password": "strongpassword123"
      }'
echo -e "\n"
