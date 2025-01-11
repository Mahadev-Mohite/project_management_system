const db = require("../config/db");
exports.createProject = async (projectData) => {
  const { owner_id, project_title, description } = projectData;
  try {
    const [result] = await db.query(
      "INSERT INTO projects (owner_id,project_title,description) VALUES (?, ?, ?)",
      [owner_id, project_title, description]
    );
    return result;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to insert project into the database.");
  }
};
// getAll project
exports.getAll = async () => {
  try {
    const project = await db.query(
      `SELECT 
  projects.id, 
  users.username, 
  projects.project_title, 
  projects.description 
FROM 
  projects 
LEFT JOIN 
  users 
ON 
  projects.owner_id = users.id;
`
    );
    if (project.length === 0) {
      return null;
    }
    return project;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// getByID

exports.getById = async (id) => {
  try {
    const [project] = await db.query(
      `
      SELECT
        projects.id AS project_id,
        users.username,
        projects.project_title,
        projects.description
      FROM
        projects
      LEFT JOIN
        users
      ON
        projects.owner_id = users.id
      WHERE
        projects.id = ?

      `,
      [id]
    );

    if (project.length === 0) {
      return null;
    }

    return project[0];
  } catch (err) {
    console.error("Error fetching project by ID:", err.message);
    throw err;
  }
};

exports.allocatemember = async (project_id, user_id) => {
  try {
    const [project] = await db.query(`SELECT id FROM projects WHERE id = ?`, [
      project_id,
    ]);
    if (project.length === 0) {
      throw new Error("Project does not exist");
    }

    // Check if the user exists
    const [user] = await db.query(`SELECT id FROM users WHERE id = ?`, [
      user_id,
    ]);
    if (user.length === 0) {
      throw new Error("User does not exist");
    }
    const [existingMember] = await db.query(
      `SELECT * FROM project_users WHERE project_id = ? AND user_id = ?`,
      [project_id, user_id]
    );

    if (existingMember.length > 0) {
      throw new Error("User is already allocated to this project");
    }
    const [projectMemebr] = await db.query(
      `
      INSERT INTO project_users (project_id,user_id) VALUES (?,?)
      `,
      [project_id, user_id]
    );
    return projectMemebr;
  } catch (err) {
    console.error("Error allocating users to the projects", err.message);
    throw err;
  }
};

// delete project
exports.deleteProjectAndMembers = async (projectId, ownerId) => {
  try {
    // Check if the project exists and belongs to the owner
    const [project] = await db.query(`SELECT * FROM projects WHERE id = ?`, [
      projectId,
    ]);
    if (!project || project.length === 0) {
      throw new Error("Project not found");
    }

    if (project[0].owner_id !== ownerId) {
      throw new Error("Unauthorized: You cannot delete this project");
    }

    // Delete members associated with the project
    await db.query(`DELETE FROM project_users WHERE project_id = ?`, [
      projectId,
    ]);

    // Delete the project itself
    await db.query(`DELETE FROM projects WHERE id = ?`, [projectId]);

    return true; // Successful deletion
  } catch (err) {
    console.error("Error deleting project and members:", err.message);
    throw err;
  }
};

// update the project
exports.updateProject = async (projectId, ownerId, updates) => {
  try {
    const [project] = await db.query(`SELECT * FROM projects WHERE id = ?`, [
      projectId,
    ]);
    if (!project || project.length === 0) {
      throw new Error("Project not found");
    }

    if (project[0].owner_id !== ownerId) {
      throw new Error("Unauthorized: You cannot update this project");
    }

    const { project_title, description } = updates;

    const updateResult = await db.query(
      `UPDATE projects SET project_title = ?, description = ? WHERE id = ?`,
      [project_title, description, projectId]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error("Failed to update the project");
    }

    return true;
  } catch (err) {
    console.error("Error updating project:", err.message);
    throw err;
  }
};
