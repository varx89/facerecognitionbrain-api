const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'groot',
      database : 'smartbrain'
    }
  });
  

const app = express();
// app.use(bodyParser.urlencoded({extended: false}));
const bcrypt = require('bcrypt');
const bcryptSaltRounds = 10;
const { response } = require('express');

// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

app.use(bodyParser.json());
app.use(cors());

//home
app.get('/', (req, res) => {/* res.send(database.users)*/});

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


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`);
})


/*routes

/ res -> this is working
/signin --> POST = success/failure
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/