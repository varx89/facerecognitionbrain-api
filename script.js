const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

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


app.get('/', (req, res) => {
    // res.send(database.users);
});

//signin
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => res.json(user[0]))
            .catch(err => res.status(400).json('unable to get user'));
        } else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'));
});

//register
app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    
    const salt = bcrypt.genSaltSync(bcryptSaltRounds);
    const hash = bcrypt.hashSync(password, salt);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {

            return trx('users').returning('*').insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => res.status(400).json('unable to register'));
});

//profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length){
            res.json(user[0]);
        } else {
            res.status(400).json('not found')
        }
        
    })
    .catch(err => res.status(400).json('no such user here'));
});

// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
//     // result == true
// });
// bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
//     // result == false
// });

//profile
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0].entries))
    .catch(err => res.status(400).json('unable to get entries/count'));
});


app.listen(port = 5000, () => {
    console.log(`app listening at http://localhost:${port}`);
})


/*routes

/ res -> this is working
/signin --> POST = success/failure
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/