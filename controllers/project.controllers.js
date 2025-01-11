const db = require("../config/db");
const Project = require("../models/project.model");
// create
exports.create = async (req, res) => {
  const { project_title, description } = req.body;
  const owner_id = req.user.id;

  if (!owner_id || !project_title || !description) {
    return res.status(400).json({
      message: "All the field are required",
    });
  }
  try {
    const project = await Project.createProject({
      owner_id,
      project_title,
      description,
    });
    if (!project) {
      return res.status(400).json({
        message: "Error creating a project",
      });
    }
    return res.status(200).json({
      message: "Project created Successfully",
      Project: project,
    });
  } catch (err) {
    console.error("Error creating project", err.message);
    return res.status(500).json({
      message: "An Error occured while creating a project",
    });
  }
};

exports.getAllProject = async (req, res) => {
  try {
    const [projects] = await Project.getAll();
    if (!projects) {
      return res.status(400).json({
        message: "Projects not Found",
      });
    }

    return res.status(200).json({
      message: "Projects Fetched Successfully",
      projects,
    });
  } catch (err) {
    console.error("Error Getting Projects", err.message);
    return res.status(500).json({
      message: "An Error occured while getting a projects",
    });
  }
};

// getByID
exports.getByID = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      message: "ID is required",
    });
  }

  try {
    const project = await Project.getById(id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found with the given ID",
      });
    }

    return res.status(200).json({
      message: "Project fetched successfully",
      project,
    });
  } catch (err) {
    console.error("Error fetching the projects", err.message);
    return res.status(500).json({
      message: "An error occurred while retrieving the project",
      error: err.message,
    });
  }
};

exports.AllocateMember = async (req, res) => {
  const { project_id, user_id } = req.body;

  if (!project_id || !user_id) {
    return res.status(400).json({
      message: "Both Fields are required",
    });
  }

  console.log(req.body);

  try {
    const result = await Project.allocatemember(project_id, user_id);

    if (!result || result.affectedRows === 0) {
      return res.status(400).json({
        message: "Error allocating members",
      });
    }

    return res.status(200).json({
      message: "Member allocated successfully",
      result,
    });
  } catch (err) {
    console.error("Error allocating users", err.message);
    if (err.message === "User does not exist") {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (err.message === "Project does not exist") {
      return res.status(400).json({ message: "Project does not exist" });
    }
    if (err.message === "User is already allocated to this project") {
      return res.status(400).json({
        message: err.message,
      });
    }

    return res.status(500).json({
      message: "An error occurred while allocating users to the project",
    });
  }
};

// delete project

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) {
    return res.status(400).json({
      message: "Project ID is required",
    });
  }

  try {
    // Delete the project and its members
    await Project.deleteProjectAndMembers(id, userId);

    return res.status(200).json({
      message: "Project and its members deleted successfully",
    });
  } catch (err) {
    if (err.message === "Project not found") {
      return res.status(404).json({
        message: "Project not found",
      });
    } else if (err.message === "Unauthorized: You cannot delete this project") {
      return res.status(403).json({
        message: "Unauthorized: You cannot delete this project",
      });
    } else {
      console.error("Error deleting project:", err.message);
      return res.status(500).json({
        message: "An error occurred while deleting the project",
      });
    }
  }
};

// update project
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { project_title, description } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Project ID is required",
    });
  }

  if (!project_title || !description) {
    return res.status(400).json({
      message: "Project title and description are required",
    });
  }

  try {
    // Update the project
    await Project.updateProject(id, userId, { project_title, description });

    return res.status(200).json({
      message: "Project updated successfully",
    });
  } catch (err) {
    if (err.message === "Project not found") {
      return res.status(404).json({
        message: "Project not found",
      });
    } else if (err.message === "Unauthorized: You cannot update this project") {
      return res.status(403).json({
        message: "Unauthorized: You cannot update this project",
      });
    } else if (err.message === "Failed to update the project") {
      return res.status(500).json({
        message: "Failed to update the project",
      });
    } else {
      console.error("Error updating project:", err.message);
      return res.status(500).json({
        message: "An error occurred while updating the project",
      });
    }
  }
};
