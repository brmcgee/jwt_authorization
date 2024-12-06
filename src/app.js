const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken')
const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use((req, res, next) => {

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
const myConnect = { host : '127.0.0.1', user : 'root', password : '', database : 'jwt_db'};

const db = mysql.createConnection(myConnect);
db.connect(function(err) {
    if (err) {
        console.error(`Error connecting to MySQL`, err);
        return;
    }
    console.log(`Connected to MySQL`);
});

app.get('/', function (req, res){
    res.send('Welcome to Dizzo')
})
app.post('/register', function (req, res){
    const { username, email, password } = req.body;
    var sql = `INSERT INTO user (username, email, password) VALUES('${username}', '${email}', '${password}')`;
    db.query(sql, function(err){
        if (err) {
            console.log('Error in SQL ' + err)
            return res.status(500).json({ error : 'Internal service error'})
        } else {
            res.status(200).json({message : 'Registered Successfully'})
        }
    })
})

const secretKey = 'pizzaparty'; 
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    var sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error("Error in SQL query:", err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.length > 0) {
            console.log("User found:", result[0].username);
            const payload = { userId: result.username, username: result.username };
            const expiration = '1h';
            const token = jwt.sign(payload, secretKey, { expiresIn: expiration });
            console.log('JWT Token:', token);
            res.json({ 'message' : 'Login successful', 'username' : result[0].username, 'token' : token });

        } else {
            console.log("User not found");
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });

});

const authenticateJWT = function (req, res, next)  {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token.split(' ')[1], secretKey, function (err, user) {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};


app.get('/protected', authenticateJWT, function (req, res) {
    res.send('<h1>Access granted</h1>')
});



app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`)
})