const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const fs = require('fs');
const path = require('path');
  
  // Mongoose; These are mongoose models exposed in 'models.js'
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Directors;
  
const { check, validationResult } = require('express-validator');

// below is the Middleware
app.use(bodyParser.json()); // support parsing of application/json type post data
app.use(bodyParser.urlencoded({ extended: true })); //support parsing of application/x-www-form-urlencoded post data

// Authentication //
const auth = require('./auth')(app);

// Passport //
const passport = require('passport');
require('./passport');

//CORS
const cors = require('cors');
app.use(express.static('public'));
app.use(cors()); // this specifies that the app uses cors and by default it will set the application to allow requests from all orgins  

// If I want only certain origins to be given access [use the code below]
/*
let allowedOrigins = ['https://guarded-wave-99547.com/', 'http://localhost1234', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      //if a speciic origin isn't found on the list of allowed origins
      let messafe = 'The CORS policy for this application doesn\'t allow access from origin ' = origin;
      return callback(new Error(message ), false);
    }
    return callback(null. true);
  }
})); */

//================================================================ below is the connection when switching to my localhost. 
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { 
//   useNewUrlParser: true,
//   useUnifiedTopology: true 
// })
//   .then(console.log('DB Connected'));
//================================================================

// below is the new connection between Render and mongoDBAtlas
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(console.log('DB Connected'));


//// ENDPOINTS //////

// default text response
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// GET requests, READ
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

//get all movies and return json object
app.get('/movies', /*passport.authenticate('jwt', { session: false }),*/ (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(200).json(movies);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// Get a movie by title
app.get("/movies/:title", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get Genre by name
app.get("/movies/genres/:Name", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((movies) => {
      res.send(movies.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});  

// get director data by name
app.get("/movies/directors/:Name", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then((movies) => {
      res.send(movies.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + 'No such director!');
    });
}); 

// Get all users (read in mongoose)
app.get('/users', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.find()
  .then((users) => {
    res.status(200).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ', + err);
    });
});

// Allow a new user to register (create) // expects a JSON in the request body
app.post('/users',
  // validation array. 'check' refs to 'express-validator' pkg import
  [
    check('Username', 'Username length must be at least 5 characters.').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    // evaluate validations
     let errors = validationResult(req);

     if(!errors.isEmpty()) {
       return res.status(422).json({ errors: errors.array() });
     }
     
    let hashedPassword = Users.hashPassword(req.body.Password);
     Users.findOne({ Username: req.body.Username }) // search to see if a user with the requestied username already exists.
       .then((user) => {
         if(user) { //if the user is found, send a response that it already exists. 
           return res.status(400).send(req.body.Username + ' already exists');
         } else {
           Users.create({
             Username: req.body.Username,
             Password: hashedPassword,
             Email: req.body.Email,
             Birthday: req.body.Birthday
           })
           .then((user) => { 
            res.status(200).json(user);
           })
           .catch((err) => {
             console.error(err);
             res.status(500).send('Error: ' + err);
           });
         }
       })
       .catch((error) => {
         console.error(error);
         res.status(500).send('Error: ' + error);
       });

  });
    
// Updates the user by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set: {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) // the *updated (new) document is returned
    .then((updatedUser) => {
      res.status(201).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Adds a movie to a user's list of favorite movies
app.put('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $addToSet: { FavoriteMovies: req.params._id } // $addToSet won't add duplicates (note: if there IS a duplicate, it won't throw an error either...)
  },
  { new: true })  // the *updated (new) document is returned
  .then((updatedUser) => {
    res.status(201).json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Removes a movie from a user's list of favorite movies
app.delete('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params._id }
  },
  { new: true })  // the *updated (new) document is returned
  .then((updatedUser) => {
    res.status(201).json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Allow existing users deregister
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if(!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.' );
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Error handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',  () => {
  console.log('Listening on Port ' + port);
});

// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');

/* CODE
mongoimport --uri mongodb+srv://jerAtlasDBadmin:smcTLDE2tkidDPHW@jeratlasdb.ltinnim.mongodb.net/myFlixDB --collection movies --type json --file ../exported_collections/movies.json
*/ 