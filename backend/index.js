require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
const cors = require("cors");
const validator = require("validator");
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use(express.json());

const { Pool } = require('pg')
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database:process.env.DB_DATABASE
});

app.post("/signup", async function (req, res) {
    var { email, password, confirmPassword } = req.body;
    var created_at = new Date().toISOString().slice(0, 10);
    var start_at = new Date().toISOString();
    var db_password = "";
    var db_id = "0";
    var sql = "select id from users where email='" + email + "'; ";
    await pool.query(sql, async (err, results) => {
        if (results.rowCount !== 0) {
            res.status(400).json({ message: "User with such email already exists" });
        }
        else {
            if (email !== null && password !== null && confirmPassword !== null && validator.isEmail(email) && validator.isLength(password, 6, 20) && password === confirmPassword) {
                password = bcrypt.hashSync(password, saltRounds);
                console.log(password);
                var sql = " INSERT INTO  users (email, password, created_at) VALUES ('" + email + "', '" + password + "', '" + created_at + "'); ";
                await pool.query(sql);
                var sql = "select id, email, password from users where email='" + email + "' and password='" + password + "'; ";
                const respond = await pool.query(sql);
                db_password = respond.rows[0].password;
                db_id = respond.rows[0].id;
                var sql = "INSERT INTO  sessions (start_at, end_at, user_id) VALUES ('" + start_at + "', null, '" + db_id + "'); ";
                await pool.query(sql);
                console.log(db_id, "here");
                res.send({ db_id });
            } else {
                res.status(400).json({ message: "Not valid email or password" });
            }
        }
    })
});

app.post("/login", async function (req, res) {
    const { email, password } = req.body;
    var start_at = new Date().toISOString();
    var sql = "select id, email, password from users where email='" + email + "'; ";
    await pool.query(sql, async (err, results) => {
        if (err) {
            res.send(err);
            console.log(err)
        } else if (results.rowCount !== 0) {
            var db_password = results.rows[0].password;
            var db_id = results.rows[0].id;
            console.log(db_password, db_id);
            if (password!== null && bcrypt.compareSync(password, db_password)) {
                var sql = "INSERT INTO  sessions (start_at, end_at, user_id) VALUES ('" + start_at + "', null, '" + db_id + "'); ";
                pool.query(sql);
                console.log(db_id, "here");
                res.send({ db_id });
            } else {
                res.status(404).json({ message: "Password is not correct" });
            }
        }
        else {
            res.status(404).json({ message: "User does not exist" });
        }
    })
});

app.post("/logout", async function (req, res) {
    const { userId } = req.body;
    var end_at = new Date().toISOString();
    var sql = "UPDATE sessions SET end_at = '" + end_at + "' WHERE user_id='" + userId + "'; ";
    await pool.query(sql);
    res.send("Session ended");
});

app.post("/createnote", async function (req, res) {
    const { title, body, due_at, userId } = req.body;
    var created_at = new Date().toISOString();
    if (title !== null && body !== null && due_at !== null && validator.isLength(title, 0, 100) && validator.isLength(body, 0, 150) && validator.isDate(due_at) && validator.isAfter(due_at)) {
        var sql = " INSERT INTO  notes (title, body,  created_at, due_at, user_id) VALUES ('" + title + "', '" + body + "', '" + created_at + "', '" + due_at + "', '" + userId + "'); ";
        const respond = await pool.query(sql);
        res.send("Note created");
    } else {
        res.status(400).json({ message: "Not valid input" });
    }
});

app.post("/getnotes", async function (req, res) {
    const sortValue = req.body.sortValue;
    const UserId = req.body.userId;
    var notes;
    var sql = "select id, title, body, TO_CHAR(due_at, 'yyyy-mm-dd') as due_at, case when done=false then 'open' when done=true then 'done' end as status from notes where user_id= '" + UserId + "' order by created_at desc limit '" + sortValue + "';"
    const respond = await pool.query(sql);
    console.log(sql);
    res.send(respond.rows);
});

app.post("/deletenote", async function (req, res) {
    const id = req.body.id;
    var notes;
    var sql = "delete from notes where id= '" + id + "';"
    const respond = await pool.query(sql);
    res.send('Note deleted');
});

app.post("/donenote", async function (req, res) {
    const id = req.body.id;
    var notes;
    var sql = " UPDATE notes SET done = true WHERE id= '" + id + "';"
    const respond = await pool.query(sql);
    res.send('Marked done');
});

app.post("/updatenote", async function (req, res) {
    const { title, body, due_at, id } = req.body;
    var notes;
    if (title !== null && title !== "" && body !== null && body !== "" && due_at !== null && due_at !== "" && validator.isLength(title, 0, 100) && validator.isLength(body, 0, 150) && validator.isDate(due_at) && validator.isAfter(due_at)) {
        var sql = " UPDATE notes SET title='" + title + "', body='" + body + "', due_at=' " + due_at + "' WHERE id= '" + id + "';"
        const respond = await pool.query(sql);
        res.send('Note updated');
    } else {
        res.status(400).json({ message: "Not valid input" });
    }
});

app.get('/', (req, res) => {
    res.send("Server is up")
  })

app.listen(process.env.LISTEN_TO, function () {
    console.log("server is runnning on port 3000");
});
