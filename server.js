const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const dotenv = require('dotenv');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

dotenv.config();
const app = express();

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

// app.use(bodyParser.urlencoded({extended: false}));
const bcrypt = require('bcrypt');
const bcryptSaltRounds = 10;


// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

app.use(bodyParser.json());
app.use(cors());

//home
app.get('/', (req, res) => { res.send('it werks!' + process.env.DATABASE_UR) });

//signin
app.post('/signin', signin.handleSignin(db, bcrypt, bcryptSaltRounds));

//register
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, bcryptSaltRounds) });

//profile
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});

//profile
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)});

//profile
app.put('/image', (req, res) => { image.handleImage(req, res, db) });


const PORT = process.env.PORT;
app.listen(PORT || 5000, () => {
    console.log(`app listening at http://localhost:${PORT}`);
})


/*routes

/ res -> this is working
/signin --> POST = success/failure
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/