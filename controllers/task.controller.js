const db = require("../config/db");
const Task = require("../models/task.model");

exports.create = async (req, res) => {
  const { project_id, tasktitle, description, status } = req.body;
  const userId = req.user?.id;
  console.log(userId);

  // Validate input fields
  if (!project_id || !tasktitle) {
    return res.status(400).json({
      message: "Project ID and Task Title are required",
    });
  }

  try {
    // Call the model to create the task
    const task = await Task.create({
      project_id,
      tasktitle,
      description,
      status,
      userId,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    if (err.message === "Project not found") {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (
      err.message === "You are not authorized to create a task for this project"
    ) {
      return res.status(403).json({
        message: "You are not authorized to create a task for this project",
      });
    }

    // Handle unexpected server errors
    console.error("Unexpected error creating task:", err.message);
    return res.status(500).json({
      message: "An error occurred while creating the task",
      error: err.message,
    });
  }
};

// getTask By projectId

exports.getByProject = async (req, res) => {
  const project_id = req.params.project_id;

  // Validate project_id
  if (!project_id) {
    return res.status(400).json({
      message: "Project ID is required",
    });
  }

  try {
    // Fetch tasks for the given project
    const tasks = await Task.getByProject(project_id);

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        message: "No tasks found for the given project",
      });
    }

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (err) {
    console.error("Error fetching tasks by project:", err.message);

    // Return the actual error message in the response for debugging
    return res.status(500).json({
      message: "An error occurred while fetching tasks",
      error: err.message || "Unknown error occurred",
    });
  }
};

// delete ByID
exports.deletetaskById = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  console.log(id);
  try {
    const task = await Task.deleteById(id, userId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    if (err.message === "Task Not Found") {
      return res.status(404).json({ message: "Task not found" });
    }
    if (err.message === "You are not Authorised to delete the task") {
      return res.status(404).json({
        message: "You are not Authorised to delete the task",
      });
    }
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update By id
exports.updateTask = async (req, res) => {
  const id = req.params.id;
  const { tasktitle, description, status } = req.body;
  const userId = req.user.id;
  try {
    const result = await Task.updateTaskById(
      id,
      tasktitle,
      description,
      status,
      userId
    );

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }

    // If successful, return a success message
    res
      .status(200)
      .json({ message: "Task updated successfully", task: result });
  } catch (err) {
    if (err.message === "Task not found") {
      return res.status(404).json({ message: "Task not found" });
    }

    if (err.message === "Project not found") {
      return res.status(404).json({ message: "Project not found" });
    }

    if (
      err.message === "You are not authorized to update a task for this project"
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this task",
      });
    }
    console.error("Error updating task:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update status
exports.updateTaskStatus = async (req, res) => {
  const id = req.params.id; // Extract task ID from URL parameters
  const { status } = req.body; // Extract the new status from the request body
  const userId = req.user.id;
  try {
    const result = await Task.updateTaskStatus(id, userId, status);

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task status updated successfully" });
  } catch (err) {
    if (err.message === "Task not found") {
      return res.status(404).json({ message: "Task not found" });
    }

    if (err.message === "Project not found") {
      return res.status(404).json({ message: "Project not found" });
    }

    if (
      err.message ===
      "You are not authorized to update the status for this project"
    ) {
      return res.status(403).json({
        message: "You are not authorized to update the status for this project",
      });
    }
    console.error("Error updating task status:", err.message);
    res.status(500).json({ message: "Internal Server Error" }); // Handle server errors
  }
};
