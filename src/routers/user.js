const User = require("../models/user");
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
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


const upload = multer({
    // dest: "avatars",
    limits: {
        fileSize: 1024 * 1024 // size in bytes
    },
    fileFilter(req, file, cb) {
        // if (!file.originalname.endsWith(".pdf")) {
        //     return cb(new Error("file must be PDF"));
        // }
        // else {
        //     cb(undefined, true);
        // }

        if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(undefined, true);
        }
        else {
            return cb(new Error("file must be JPG, JPEG or PNG"));
        }


        // cb(new Error("file must be PDF"))
        // cb(undefined, true)
        // cb(undefined, false) // fail silently
    }
});

router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send(req.user);
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
});

router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;

