import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const salt = 10;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dash'
});
app.listen(3001, () => {
    console.log('Server running...');
})

app.post('/register', (req, res) => {
    //Checking if there is already an user registered with the same email address
    const checkEmails = 'SELECT email FROM users';
    let emailToCheck = req.body.email;
    db.query(checkEmails, emailToCheck, (err, result) => {
        if(err) return res.json({Error: "Error with the query"}); console.log(err);
        let i ;
        for(i = 0; i < result.length; i++){
            if(emailToCheck === result[i].email){
                return res.json({Error: "Email already exists in our database"});
            }
        }
        //If the email is not in the database then the user can go ahead
        const sql = 'INSERT INTO users (`name`, `email`, `password`) VALUES(?)';
        bcrypt.hash(req.body.password.toString(), salt, (err, hash) =>{
            if(err) return res.json({Error: "Error for hasssing password"});
            const values = [req.body.name, req.body.email, hash];
            db.query(sql, [values], (err, result) => {
                if(err) return res.json({Error: "Error for hasssing password"});
                return res.json({result: "Successfull"});
            })
        })
    });
})
