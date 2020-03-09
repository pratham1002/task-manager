const User = require("../models/user");
const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();


router.post("/users", async (req, res) => {
    const user = new User(req.body);
    
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findbyCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [ "name", "email", "password", "age" ];
    
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates" });
    }        

    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/users/me", auth, async (req, res) => {
    // const _id = req.user._id;

    try {
        // const user = await User.findByIdAndDelete(_id);
        // if (!user) {
        //     return res.status(404).send();
        // }

        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;

