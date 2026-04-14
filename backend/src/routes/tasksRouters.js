import express, { Router } from "express";
import {
    createTask,
    deleteTask,
    getAllTasks,
    updateTask,
} from "../controllers/tasksControllers.js";

const router = express.Router();

// GET
router.get("/", getAllTasks);

// POST
router.post("/", createTask);

// PUT
router.put("/:id", updateTask);

// DELETE
router.delete("/:id", deleteTask);

export default router;
