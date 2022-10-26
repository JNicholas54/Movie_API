const express = require('express'),
  bodyParser = require('body-parser');
  uuid = require('uuid');
  const mongoose = require('mongoose');
  const Models = require('./models.js');
  const { check, validationResult } = require('express-validator');
  const morgan = require('morgan');
  app = express(),

// below is the Middleware
app.use(bodyParser.json()); // support parsing of application/json type post data
app.use(bodyParser.urlencoded({ extended: true })); //support parsing of application/x-www-form-urlencoded post data

// Mongoose; These are mongoose models exposed in 'models.js'
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genres;
const Directors = Models.Director;

// Authentication
let auth = require('./auth')(app);

// Passport
const passport = require('passport');
require('./passport');

mongoose.connect('mongodb://localhost:27017/myFlixDB', { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
  .then(console.log('DB Connected'));
  
app.use(morgan('combined')); // setup the logger, Mildware function to the terminal
app.use(express.static('public')); // Automatically routes all requests for static files to their corresponding files within a certain folder on the server.

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
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// Get a movie by title
app.get("/movies/:title", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movies) => {
      res.status(200).json(movies);
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
      res.status(500).send('Error: ' + err);
    });
}); 

// Get all users (read in mongoose)
// app.get('/users', (req, res) => {
//   Users.find()
//   .then((users) => {
//     res.status(200).json(users);
//   })
//   .catch((err) => {
//     console.error(err);
//     res.status(500).send('Error: ' + err);
//   });
// });

//Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ', + err);
    });
});

// Creates a new user // expects a JSON in the request body
app.post('/users',
  // validation array. 'check' refs to 'express-validator' pkg import
  [
    check('Username', 'Username length must be at least 5 characters.').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    // evaluate validations
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }});
    
  //   let hashedPassword = Users.hashPassword(req.body.Password);
  //   Users.findOne({ Username: req.body.Username })
  //     .then((user) => {
  //       if(user) {
  //         return res.status(400).send(req.body.Username + ' already exists');
  //       } else {
  //         Users.create({
  //           Username: req.body.Username,
  //           Password: hashedPassword,
  //           Email: req.body.Email,
  //           Birthday: req.body.Birthday
  //         })
  //         .then((user) => { res.status(201).json(user) })
  //         .catch((err) => {
  //           console.error(err);
  //           res.status(500).send('Error: ' + err);
  //         })
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       res.status(500).send('Error: ' + err);
  //     });
  // });
 
//CREATE, adding a new user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((users) => {
      if (users) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((users) =>{res.status(201).json(users) })``
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Update a users info by username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
{ $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }  
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });    
});

//Add a movie to a users list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, //this line makes sure that the updated docyment is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// DELETE, Delete a movie from your favorites list
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: {FavoriteMovies: req.params.MovieID}
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//allows existing user to deregister
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((users) => {
      if (!users) {
        res.status(400).send(req.params.Username = ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

//Error handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});