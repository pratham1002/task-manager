const Task = require("../models/task");
const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({ ...req.body, owner: req.user._id });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10
// GET /taks?sortBy=createdAt:asc
router.get("/tasks", auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id: _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        await task.populate("owner").execPopulate();
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [ "description","completed" ];
    
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    const _id = req.params.id;

    try {
        const task = await Task.findOneAndUpdate({ _id: _id, owner: req.user._id }, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send();
        }
        if (!isValidOperation) {
            return res.status(400).send({ error: "Invalid updates" });
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOneAndDelete({ _id: _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;