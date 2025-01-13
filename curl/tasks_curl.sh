# Base URL
BASE_URL="https://project-management-system-1-wk08.onrender.com/api/v1/task"

# Token (replace with an actual token after login)
TOKEN="YOUR_JWT_TOKEN"

# 1. Create a new task
echo "Creating a new task..."
curl -X POST "$BASE_URL/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "project_id": 1,
        "tasktitle": "Sample Task",
        "description": "Task description goes here"
      }'
echo -e "\n"

# 2. Get tasks by project ID
echo "Fetching tasks by project ID..."
curl -X GET "$BASE_URL/getByProject/1" \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# 3. Delete a task by ID
echo "Deleting a task by ID..."
curl -X DELETE "$BASE_URL/delete/1" \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# 4. Update a task by ID
echo "Updating a task by ID..."
curl -X PUT "$BASE_URL/update/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "tasktitle": "Updated Task Title",
        "description": "Updated Task Description",
        "status": "In Progress"
      }'
echo -e "\n"

# 5. Update task status by ID
echo "Updating task status by ID..."
curl -X PUT "$BASE_URL/changestatus/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "status": "Done"
      }'
echo -e "\n"
