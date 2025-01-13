# Base URL
BASE_URL="https://project-management-system-1-wk08.onrender.com/api/v1/project"

# Token (replace with an actual token after login)
TOKEN="YOUR_JWT_TOKEN"

# 1. Create a new project
echo "Creating a new project..."
curl -X POST "$BASE_URL/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "project_title": "Project 1",
        "description": "This is the first project"
      }'
echo -e "\n"

# 2. Get all projects
echo "Fetching all projects..."
curl -X GET "$BASE_URL/getall" \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# 3. Get project by ID
echo "Fetching project by ID..."
curl -X GET "$BASE_URL/getbyid/1" \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# 4. Allocate a member to a project
echo "Allocating a member to a project..."
curl -X POST "$BASE_URL/allocatemember" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "project_id": 1,
        "user_id": 2
      }'
echo -e "\n"

# 5. Delete a project
echo "Deleting a project..."
curl -X DELETE "$BASE_URL/delete/1" \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# 6. Update a project
echo "Updating a project..."
curl -X PUT "$BASE_URL/update/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "project_title": "Updated Project Title",
        "description": "Updated project description"
      }'
echo -e "\n"
