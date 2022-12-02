const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const authenticate = require('../Middleware/Authentication')

require("../DB/conn");
const schema = require("../Model/userSchema");

const User = schema.User;
const blackNotes = schema.blackNotes

// -------------------For login and Register---------------------

router.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
        const isMatch = await bcrypt.compare(password, userLogin.password);

        token = await userLogin.generateAuthToken();
        // res.cookie("jwtoken", token);

        if (!isMatch) {
            res.status(400).json({ error: "invalid crediential password" });
        } else {
            // res.json({ message: "user sigin successfully" });
            res.send(token)
        }
    } else {
        res.status(400).json({ error: "invalid crediential email" });
    }
});



router.post('/api/register', async (req, res) => {
    const { name, email, password, cpassword } = req.body;
    if (!name || !email || !password || !cpassword) {
        return res.status(422).json({ error: "fill all" });
    }

    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "Email aleady exist" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "paswword not matching" });
        } else {
            const user = new User({ name, email, password, cpassword });
            const userRegister = await user.save();
            if (userRegister) {
                res.status(201).json({ message: "Register successfully" });
            }
        }
    } catch (err) {
        console.log(err);
    }
});


// ------------------------------------------Notes Database----------------------------------------

router.post("/api/createNote", async (req, res) => {
    const { title, note, date, day, note_Key, color, fontStyle, fontWeight, fontSize } = req.body;
    const blackNotesObj = new blackNotes({
        title,
        note,
        date,
        day,
        note_Key,
        color,
        fontStyle,
        fontWeight,
        fontSize
    });
    const saveNote = await blackNotesObj.save()
    if (!saveNote) {
        console.log("error occured");
    }
    else {
        res.send(saveNote);
    }
});


router.post("/api/getNotes", (req, res) => {
    const { email } = req.body

    blackNotes.find({ note_Key: email }, (err, inotesList) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send(inotesList);
            // console.log(inotesList)
        }
    });

});

router.post("/api/deleteNotes", (req, res) => {
    const { id, email } = req.body
    blackNotes.deleteOne({ _id: id }, () => {
        blackNotes.find({ note_Key: email }, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send(data);
            }
        });
    });
});

router.post("/api/editNote", (req, res) => {
    const { title, note, date, day, id } = req.body;
    const editNote = {
        title: title,
        note: note,
        day: day,
        date: date
    }
    blackNotes.findOneAndUpdate({ _id: id }, editNote, (err) => {
        if (err) {
            console.log("error occured");
        }
        else {
            res.status(200);
        }
    });
});

router.get('/api/getdata', authenticate, (req, res) => {
    res.send(req.rootUser)
})

router.get('/getCookie', (req, res) => {
    console.log(req.cookies)
    res.send(req.cookies.jwtoken)
})


module.exports = router;