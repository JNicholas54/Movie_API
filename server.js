const express = require('express'),
  bodyParser = require('body-parser');
  uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genres;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
});
  
app.use(bodyParser.json()); // support parsing of application/json type post data
app.use(bodyParser.urlencoded({ extended: true })); //support parsing of application/x-www-form-urlencoded post data
app.use(morgan('combined')); // setup the logger, Mildware function to the terminal
app.use(express.static('public')); // Automatically routes all requests for static files to their corresponding files within a certain folder on the server.

// let users = [
//   {
//     id: 1,
//     name: "Jeremy",
//     favoriteMovies: []
//   },
//   {
//     id: 2,
//     name: "Melissa",
//     favoriteMovies: ["Scream 2"]
//   },
//   {
//     id: 3,
//     name: "Dawn",
//     favoriteMovies: []
//   },
//   {
//     id: 4,
//     name: "Keith",
//     favoriteMovies: []
//   },
// ];

// let movies = [

//   {
//     Title: 'Good Will Hunting',
//     Story:'Will Hunting, a janitor at MIT, has a gift for mathematics but needs help from a psychologist to find direction in his life.',
//     Genre: {
//       Name: 'Drama',
//       Description: "In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
//     },
//     Director: {
//       Name: 'Gus Van Sant',
//       Bio: 'Gus Green Van Sant Jr. is an American filmmaker, painter, screenwriter, photographer and musician from Louisville, Kentucky who is known for directing films such as Good Will Hunting, the 1998 remake of Psycho, Gerry, Elephant, My Own Private Idaho, To Die For, Milk, Last Days, Finding Forrester, Promised Land, Drugstore Cowboy and Mala Noche.',
//       dob: 'July 24, 1952'
//     },
//     Stars: 'Matt Damon, Robin Williams, Ben Affleck, Stellan Skarsgård, Minnie Driver',
//     ImgURL: 'https://m.media-amazon.com/images/M/MV5BOTI0MzcxMTYtZDVkMy00NjY1LTgyMTYtZmUxN2M3NmQ2NWJhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX67_CR0,0,67,98_AL_.jpg'
//   },

//   {
//     Title: 'A Few Good Men',
//     Story:'When cocky military lawyer Lt. Daniel Kaffee and his co-counsel, Lt. Cmdr. JoAnne Galloway, are assigned to a murder case, they uncover a hazing ritual that could implicate high-ranking officials such as shady Col. Nathan Jessep.',
//     Genre: {
//       Name: 'Drama',
//       Description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
//     },
//     Director: {
//       Name: 'Rob Reiner',
//       Bio: 'Robert Reiner was born in New York City, to Estelle Reiner (née Lebost) and Emmy-winning actor, comedian, writer, and producer Carl Reiner. As a child, his father was his role model, as Carl Reiner created and starred in The Dick Van Dyke Show.',
//       dob: 'March 6, 1947'
//     },
//     Stars: 'Tom Cruise, Jack Nicholson, Demi Moore, Kevin Bacon, Kiefer Sutherland',
//     ImgURL: 'https://m.media-amazon.com/images/M/MV5BMmRlZDQ1MmUtMzE2Yi00YTkxLTk1MGMtYmIyYWQwODcxYzRlXkEyXkFqcGdeQXVyNTI4MjkwNjA@._V1_UX67_CR0,0,67,98_AL_.jpg'
//   },

//   {
//     Title: 'My Cousin Vinny',
//     Story:'Two New Yorkers accused of murder in rural Alabama while on their way back to college call in the help of one of their cousins, a loudmouth lawyer with no trial experience.',
//     Genre: {
//       Name: 'Comedy',
//       Description: 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter, especially in theatre, film, stand-up comedy, television, radio, books, or any other entertainment medium.'
//     },
//     Director: {
//       Name: 'Johnathan Lynn',
//       Bio: 'Jonathan Lynn and Antony Jay created and wrote every episode of the acclaimed BBC political comedy series Yes Minister (1980) and Yes, Prime Minister (1986).',
//       dob: 'April 3, 1943'
//     },  
//     Stars: 'Joe Pesci, Marisa Tomei, Ralph Macchio',
//     ImgURL: 'https://m.media-amazon.com/images/M/MV5BMTQxNDYzMTg1M15BMl5BanBnXkFtZTgwNzk4MDgxMTE@._V1_UX67_CR0,0,67,98_AL_.jpg'
//   },

//   {
//     Title: 'Cast Away',
//     Story:'A FedEx executive undergoes a physical and emotional transformation after crash landing on a deserted island.',
//     Genre: {
//       Name: 'Adventure',
//       Description: 'The adventure genre consists of books where the protagonist goes on an epic journey, either personally or geographically.'
//     },
//     Director: {
//       Name: 'Robert Zemeckis',
//       Bio: 'A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films). Usually working with writing partner Bob Gale, Robert"s earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985)). His later films have become more serious, with the hugely successful Tom Hanks vehicle Forrest Gump (1994) and the Jodie Foster film Contact (1997), both critically acclaimed movies.',
//       dob: 'May 14, 1951'
//     },  
//     Stars: 'Tom Hanks, Helen Hunt, Paul Sanchez',
//     ImgURL: 'https://m.media-amazon.com/images/M/MV5BN2Y5ZTU4YjctMDRmMC00MTg4LWE1M2MtMjk4MzVmOTE4YjkzXkEyXkFqcGdeQXVyNTc1NTQxODI@._V1_UX67_CR0,0,67,98_AL_.jpg'
//   },
//   {
//     Title: 'A Nightmare on Elm Street',
//     Story:'Teenager Nancy Thompson must uncover the dark truth concealed by her parents after she and her friends become targets of the spirit of a serial killer with a bladed glove in their dreams, in which if they die, it kills them in real life.',
//     Genre: {
//       Name: 'Horror',
//       Description: 'Horror is a genre of fiction whose purpose is to create feelings of fear, dread, repulsion, and terror in the audience'
//     },
//     Director: {
//       Name: 'Wes Craven',
//       Bio: 'Wesley Earl Craven was born in Cleveland, Ohio, to Caroline (Miller) and Paul Eugene Craven. He had a midwestern suburban upbringing. His first feature film was The Last House on the Left (1972), which he wrote, directed, and edited. Craven reinvented the youth horror genre again in 1984 with the classic A Nightmare on Elm Street (1984), a film he wrote and directed.',
//       dob: 'August 2, 1939'
//     },
//     Stars: 'Heather Langenkamp, Johnny Depp, Robert Englund',
//     ImgURL: 'https://m.media-amazon.com/images/M/MV5BNzFjZmM1ODgtMDBkMS00NWFlLTg2YmUtZjc3ZTgxMjE1OTI2L2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_UX67_CR0,0,67,98_AL_.jpg'
//   },
//   {
//     Title: 'Scream 2',
//     Story:'Two years after the first series of murders, as Sidney acclimates to college life, someone donning the Ghostface costume begins a new string of killings.',
//     Genre: {
//       Name: 'Horror',
//       Description: 'Horror is a genre of fiction whose purpose is to create feelings of fear, dread, repulsion, and terror in the audience'
//     },
//     Director: {
//       Name: 'Wes Craven',
//       Bio: 'Wesley Earl Craven was born in Cleveland, Ohio, to Caroline (Miller) and Paul Eugene Craven. He had a midwestern suburban upbringing. His first feature film was The Last House on the Left (1972), which he wrote, directed, and edited. Craven reinvented the youth horror genre again in 1984 with the classic A Nightmare on Elm Street (1984), a film he wrote and directed.',
//       dob: 'August 2, 1939'
//     },
//     Stars: 'Neve Campbell, Courteney Cox, David Arquette',
//     ImgURL: 'https://m.media-amazon.com/images/M/MV5BMTIxNTMzNzYtNzA3NC00MzgwLTlhNGYtMDEyYTNlZjcwZTNiXkEyXkFqcGdeQXVyNDAxNjkxNjQ@._V1_UX67_CR0,0,67,98_AL_.jpg'
//   },
//   {
//     Title: 'A Beautiful Mind',
//     Story:'After John Nash, a brilliant but asocial mathematician, accepts secret work in cryptography, his life takes a turn for the nightmarish.',
//     Genre: {
//       Name: 'Drama',
//       Description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
//     },
//     Director: {
//       Name: 'Ron Howard',
//       Bio: 'Academy Award-winning filmmaker Ron Howard is one of this generation"s most popular directors. From the critically acclaimed dramas A Beautiful Mind (2001) and Apollo 13 (1995) to the hit comedies Parenthood (1989) and Splash (1983), he has created some of Hollywood"s most memorable films.',
//       dob: 'March 1, 1954'
//     },
//     Stars: 'Russel Crowe, Ed Harris, Jennifer Connelly',
//     ImgURL: 'https://m.media-amazon.com/images/M/MV5BMzcwYWFkYzktZjAzNC00OGY1LWI4YTgtNzc5MzVjMDVmNjY0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX67_CR0,0,67,98_AL_.jpg'
//   },
//   {
//     Title: 'Remember the Titans',
//     Story:'The true story of a newly appointed African-American coach and his high school team on their first season as a racially integrated unit.',
//     Genre: {
//       Name: 'Drama',
//       Description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
//     },
//     Director: {
//       Name: 'Boaz Yakin',
//       Bio: 'Boaz Yakin was born in 1966 in New York City, New York, USA. He is a writer and producer, known for Fresh (1994), Remember the Titans (2000) and The Harder They Fall (2021).',
//       dob: 'June 20, 1966'
//     },
//     Stars: 'Denzel Washington, Will Patton, Wood Harris',
//     ImgURL: 'https://m.media-amazon.com/images/M/MV5BYThkMzgxNjEtMzFiOC00MTI0LWI5MDItNDVmYjA4NzY5MDQ2L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX67_CR0,0,67,98_AL_.jpg'
//   },
//   {
//     Title: 'Jurassic Park',
//     Story:"A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
//     Genre: {
//       Name: 'Action',
//       Description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
//     },
//     Director: {
//       Name: 'Steven Speilberg',
//       Bio: 'One of the most influential personalities in the history of cinema, Steven Spielberg is Hollywood"s best known director and one of the wealthiest filmmakers in the world. He has an extraordinary number of commercially successful and critically acclaimed credits to his name, either as a director, producer or writer since launching the summer blockbuster with Jaws (1975), and he has done more to define popular film-making since the mid-1970s than anyone else.',
//       dob: 'December 18, 1946'
//     },
//     Stars: 'Sam Neill, Laura Dern, Jeff Goldblum',
//     ImgURL: 'https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_UX67_CR0,0,67,98_AL_.jpg'
//   },
//   {
//     Title: 'Avatar',
//     Story:'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
//     Genre: {
//       Name: 'Fantasy',
//       Description: 'Fantasy fiction is a genre of writing in which the plot could not happen in real life (as we know it, at least).'
//     },
//     Director: {
//       Name: 'James Cameron',
//       Bio: 'James Francis Cameron was born on August 16, 1954 in Kapuskasing, Ontario, Canada. He moved to the United States in 1971. The son of an engineer, he majored in physics at California State University before switching to English, and eventually dropping out. He then drove a truck to support his screenwriting ambition. James Cameron is now one of the most sought-after directors in Hollywood.',
//       dob: 'August 16, 1954'
//     },
//     Stars: 'Sam Worthington, Zoe Saldana, Siguorney Weaver',
//     ImgURL: 'https://m.media-amazon.com/images/M/MV5BNjA3NGExZDktNDlhZC00NjYyLTgwNmUtZWUzMDYwMTZjZWUyXkEyXkFqcGdeQXVyMTU1MDM3NDk0._V1_UX67_CR0,0,67,98_AL_.jpg'
//   },
// ];

// default text response
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

//get all movies and return json object
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(200).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Get a movie by title
app.get("/movies/:title", (req, res) => {
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
app.get("/movies/genres/:Name", (req, res) => {
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
app.get("/movies/directors/:Name", (req, res) => {
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
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ', + err);
    });
});
 
//CREATE, adding a new user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
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
      PAssword: req.body.Password,
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
app.post('/users/:Username/movies/:MoviesID', (req, res) => {
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
    .then((user) => {
      if (!user) {
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

// GET requests, READ
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
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