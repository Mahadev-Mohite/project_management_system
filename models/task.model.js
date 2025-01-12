const db = require("../config/db");

exports.create = async ({
  project_id,
  tasktitle,
  description,
  status,
  userId,
}) => {
  try {
    const [projects] = await db.query(`SELECT * FROM projects WHERE id = ?`, [
      project_id,
    ]);
    // console.log("Projects query result:", projects);

    if (!projects || projects.length === 0) {
      throw new Error("Project not found");
    }

    const project = projects[0];
    // console.log("Project data:", project);

    const [projectUsers] = await db.query(
      `SELECT * FROM project_users WHERE project_id = ? AND user_id = ?`,
      [project_id, userId]
    );

    // Check if the user is authorized to create a task for this project
    if (
      project.owner_id !== userId &&
      (!projectUsers || projectUsers.length === 0)
    ) {
      throw new Error(
        "You are not authorized to create a task for this project"
      );
    }

    // Insert the new task into the database
    const [result] = await db.query(
      `INSERT INTO tasks (project_id, tasktitle, description, status) VALUES (?, ?, ?, ?)`,
      [project_id, tasktitle, description, status]
    );
    console.log("Insert task result:", result);

    // Fetch and return the newly created task
    const [tasks] = await db.query(`SELECT * FROM tasks WHERE id = ?`, [
      result.insertId,
    ]);

    return tasks[0];
  } catch (err) {
    console.error("Error creating task:", err.message);
    throw err;
  }
};

// gettask By project
exports.getByProject = async (project_id) => {
  try {
    // Correct query with proper column names
    const [tasks] = await db.query(
      `
      SELECT 
        tasks.id AS task_id,
        projects.project_title AS project_title,
        tasks.tasktitle AS task_title,
        tasks.description AS task_description,
        tasks.status
      FROM 
        tasks
      LEFT JOIN 
        projects 
      ON 
        tasks.project_id = projects.id
      WHERE 
        tasks.project_id = ?
      `,
      [project_id]
    );

    // Return null if no tasks are found
    if (!tasks || tasks.length === 0) {
      return null;
    }

    return tasks;
  } catch (err) {
    console.error("Error getting tasks:", err.message);
    throw new Error("An error occurred while fetching tasks");
  }
};

//delete task
exports.deleteById = async (id, userId) => {
  try {
    const [task] = await db.query(`SELECT project_id FROM tasks WHERE id = ?`, [
      id,
    ]);
    if (!task || task.length === 0) {
      throw new Error("Task Not Found");
    }
    const projectId = task[0].project_id;
    const [project] = await db.query(
      `SELECT owner_id FROM projects WHERE id = ?`,
      [projectId]
    );
    const owner = project[0].owner_id;
    if (owner !== userId) {
      throw new Error("You are not Authorised to delete the task");
    }
    const result = await db.query(`DELETE FROM tasks WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return null; // If no rows were affected, the task doesn't exist.
    }
    // console.log(result);
    return result;
  } catch (err) {
    console.error(err.message);
    throw err; // Re-throw the error to be handled by the calling function.
  }
};

// updaten task
exports.updateTaskById = async (
  taskId,
  taskTitle,
  description,
  status,
  userId
) => {
  try {
    // Fetch the task by ID
    const [tasks] = await db.query(`SELECT * FROM tasks WHERE id = ?`, [
      taskId,
    ]);
    if (!tasks || tasks.length === 0) {
      throw new Error("Task not found");
    }

    const task = tasks[0];

    // Fetch the project associated with the task
    const [projects] = await db.query(`SELECT * FROM projects WHERE id = ?`, [
      task.project_id,
    ]);
    if (!projects || projects.length === 0) {
      throw new Error("Project not found");
    }

    const project = projects[0];

    // Check if the user is authorized (either owner or associated via project_users)
    const [projectUsers] = await db.query(
      `SELECT * FROM project_users WHERE project_id = ? AND user_id = ?`,
      [task.project_id, userId]
    );

    if (
      project.owner_id !== userId &&
      (!projectUsers || projectUsers.length === 0)
    ) {
      throw new Error(
        "You are not authorized to update a task for this project"
      );
    }

    // Update the task
    const [result] = await db.query(
      `UPDATE tasks SET tasktitle = ?, description = ?, status = ? WHERE id = ?`,
      [taskTitle, description, status, taskId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Failed to update the task");
    }

    // Fetch and return the updated task
    const [updatedTask] = await db.query(`SELECT * FROM tasks WHERE id = ?`, [
      taskId,
    ]);
    return updatedTask[0];
  } catch (err) {
    console.error("Error updating task:", err.message);
    throw err;
  }
};

// update status
exports.updateTaskStatus = async (id, userId, status) => {
  try {
    const [tasks] = await db.query(`SELECT * FROM tasks WHERE id = ?`, [id]);
    if (!tasks || tasks.length === 0) {
      throw new Error("Task not found");
    }
    const task = tasks[0];
    // console.log("Task fetched:", task);

    const [projects] = await db.query(`SELECT * FROM projects WHERE id = ?`, [
      task.project_id,
    ]);
    if (!projects || projects.length === 0) {
      throw new Error("Project not found");
    }
    const project = projects[0];
    // console.log("Project fetched:", project);

    const [projectUsers] = await db.query(
      `SELECT * FROM project_users WHERE project_id = ? AND user_id = ?`,
      [task.project_id, userId]
    );
    console.log("Project Users fetched:", projectUsers);
    console.log("userid", userId);
    if (
      project.owner_id !== userId &&
      (!projectUsers || projectUsers.length === 0)
    ) {
      throw new Error(
        "You are not authorized to update the status for this project"
      );
    }

    // Update the task's status
    const [result] = await db.query(
      `UPDATE tasks SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Failed to update the task status");
    }

    return { message: "Task status updated successfully" };
  } catch (err) {
    console.error("Error updating task status:", err.message);
    throw err;
  }
};
