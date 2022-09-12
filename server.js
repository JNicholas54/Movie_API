const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  bodyParser = require('body-parser');
  uuid = require('uuid');

app.use(morgan('combined')); // setup the logger, Mildware function to the terminal
app.use(express.static('public')); // Automatically routes all requests for static files to their corresponding files within a certain folder on the server.
app.use(bodyParser.json()); // support parsing of application/json type post data
app.use(bodyParser.urlencoded({ extended: true })); //support parsing of application/x-www-form-urlencoded post data

let users = [
  {
    id: 1,
    name: "Jeremy",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Melissa",
    favoriteMovies: ["Scream 2"]
  },
];

let movies = [

  {
    Title: 'Good Will Hunting',
    Story:'Will Hunting, a janitor at MIT, has a gift for mathematics but needs help from a psychologist to find direction in his life.',
    Genre: {
      Name: "Drama, Romance",
      Description: "In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
    },
    Director: {
      Name: 'Gus Van Sant',
      Bio: 'Gus Green Van Sant Jr. is an American filmmaker, painter, screenwriter, photographer and musician from Louisville, Kentucky who is known for directing films such as Good Will Hunting, the 1998 remake of Psycho, Gerry, Elephant, My Own Private Idaho, To Die For, Milk, Last Days, Finding Forrester, Promised Land, Drugstore Cowboy and Mala Noche.',
      DOB: 'July 24, 1952'
    },
    Stars: 'Matt Damon, Robin Williams, Ben Affleck, Stellan Skarsgård, Minnie Driver',
    ImgURL: 'https://m.media-amazon.com/images/M/MV5BOTI0MzcxMTYtZDVkMy00NjY1LTgyMTYtZmUxN2M3NmQ2NWJhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX67_CR0,0,67,98_AL_.jpg'
  },

  {
    Title: 'A Few Good Men',
    Story:'When cocky military lawyer Lt. Daniel Kaffee and his co-counsel, Lt. Cmdr. JoAnne Galloway, are assigned to a murder case, they uncover a hazing ritual that could implicate high-ranking officials such as shady Col. Nathan Jessep.',
    Genre: {
      Name: 'Drama',
      Description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
    },
    Director: {
      Name: 'Rob Reiner',
      Bio: 'Robert Reiner was born in New York City, to Estelle Reiner (née Lebost) and Emmy-winning actor, comedian, writer, and producer Carl Reiner. As a child, his father was his role model, as Carl Reiner created and starred in The Dick Van Dyke Show.',
      DOB: 'March 6, 1947'
    },
    Stars: 'Tom Cruise, Jack Nicholson, Demi Moore, Kevin Bacon, Kiefer Sutherland',
    ImgURL: 'https://m.media-amazon.com/images/M/MV5BMmRlZDQ1MmUtMzE2Yi00YTkxLTk1MGMtYmIyYWQwODcxYzRlXkEyXkFqcGdeQXVyNTI4MjkwNjA@._V1_UX67_CR0,0,67,98_AL_.jpg'
  },

  {
    Title: 'My Cousin Vinny',
    Story:'Two New Yorkers accused of murder in rural Alabama while on their way back to college call in the help of one of their cousins, a loudmouth lawyer with no trial experience.',
    Genre: {
      Name: 'Comedy, Crime',
      Description: 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter, especially in theatre, film, stand-up comedy, television, radio, books, or any other entertainment medium.'
    },
    Director: {
      Name: 'Johnathan Lynn',
      Bio: 'Jonathan Lynn and Antony Jay created and wrote every episode of the acclaimed BBC political comedy series Yes Minister (1980) and Yes, Prime Minister (1986).',
      DOB: 'April 3, 1943'
    },  
    Stars: 'Joe Pesci, Marisa Tomei, Ralph Macchio',
    ImgURL: 'https://m.media-amazon.com/images/M/MV5BMTQxNDYzMTg1M15BMl5BanBnXkFtZTgwNzk4MDgxMTE@._V1_UX67_CR0,0,67,98_AL_.jpg'
  },

  {
    Title: 'Cast Away',
    Story:'A FedEx executive undergoes a physical and emotional transformation after crash landing on a deserted island.',
    Genre: {
      Name: 'Adventure, Drama, Romance',
      Description: 'The adventure genre consists of books where the protagonist goes on an epic journey, either personally or geographically.'
    },
    Director: {
      Name: 'Robert Zemeckis',
      Bio: 'A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films). Usually working with writing partner Bob Gale, Robert"s earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985)). His later films have become more serious, with the hugely successful Tom Hanks vehicle Forrest Gump (1994) and the Jodie Foster film Contact (1997), both critically acclaimed movies.',
      DOB: 'May 14, 1951'
    },  
    Stars: 'Tom Hanks, Helen Hunt, Paul Sanchez',
    ImgURL: 'https://m.media-amazon.com/images/M/MV5BN2Y5ZTU4YjctMDRmMC00MTg4LWE1M2MtMjk4MzVmOTE4YjkzXkEyXkFqcGdeQXVyNTc1NTQxODI@._V1_UX67_CR0,0,67,98_AL_.jpg'
  },
  {
    Title: 'A Nightmare on Elm Street',
    Story:'Teenager Nancy Thompson must uncover the dark truth concealed by her parents after she and her friends become targets of the spirit of a serial killer with a bladed glove in their dreams, in which if they die, it kills them in real life.',
    Genre: {
      Name: 'Horror',
      Description: 'Horror is a genre of fiction whose purpose is to create feelings of fear, dread, repulsion, and terror in the audience'
    },
    Director: {
      Name: 'Wes Craven',
      Bio: 'Wesley Earl Craven was born in Cleveland, Ohio, to Caroline (Miller) and Paul Eugene Craven. He had a midwestern suburban upbringing. His first feature film was The Last House on the Left (1972), which he wrote, directed, and edited. Craven reinvented the youth horror genre again in 1984 with the classic A Nightmare on Elm Street (1984), a film he wrote and directed.',
      DOB: 'August 2, 1939'
    },
    Stars: 'Heather Langenkamp, Johnny Depp, Robert Englund',
    ImgURL: 'https://m.media-amazon.com/images/M/MV5BNzFjZmM1ODgtMDBkMS00NWFlLTg2YmUtZjc3ZTgxMjE1OTI2L2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_UX67_CR0,0,67,98_AL_.jpg'
  },
  {
    Title: 'Scream 2',
    Story:'Two years after the first series of murders, as Sidney acclimates to college life, someone donning the Ghostface costume begins a new string of killings.',
    Genre: {
      Name: 'Horror',
      Description: 'Horror is a genre of fiction whose purpose is to create feelings of fear, dread, repulsion, and terror in the audience'
    },
    Director: {
      Name: 'Wes Craven',
      Bio: 'Wesley Earl Craven was born in Cleveland, Ohio, to Caroline (Miller) and Paul Eugene Craven. He had a midwestern suburban upbringing. His first feature film was The Last House on the Left (1972), which he wrote, directed, and edited. Craven reinvented the youth horror genre again in 1984 with the classic A Nightmare on Elm Street (1984), a film he wrote and directed.',
      DOB: 'August 2, 1939'
    },
    Stars: 'Neve Campbell, Courteney Cox, David Arquette',
    ImgURL: 'https://m.media-amazon.com/images/M/MV5BMTIxNTMzNzYtNzA3NC00MzgwLTlhNGYtMDEyYTNlZjcwZTNiXkEyXkFqcGdeQXVyNDAxNjkxNjQ@._V1_UX67_CR0,0,67,98_AL_.jpg'
  },
  {
    Title: 'A Beautiful Mind',
    Story:'After John Nash, a brilliant but asocial mathematician, accepts secret work in cryptography, his life takes a turn for the nightmarish.',
    Genre: {
      Name: 'Drama',
      Description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
    },
    Director: {
      Name: 'Ron Howard',
      Bio: 'Academy Award-winning filmmaker Ron Howard is one of this generation"s most popular directors. From the critically acclaimed dramas A Beautiful Mind (2001) and Apollo 13 (1995) to the hit comedies Parenthood (1989) and Splash (1983), he has created some of Hollywood"s most memorable films.',
      DOB: 'March 1, 1954'
    },
    Stars: 'Russel Crowe, Ed Harris, Jennifer Connelly',
    ImgURL: 'https://m.media-amazon.com/images/M/MV5BMzcwYWFkYzktZjAzNC00OGY1LWI4YTgtNzc5MzVjMDVmNjY0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX67_CR0,0,67,98_AL_.jpg'
  },
  {
    Title: 'Remember the Titans',
    Story:'The true story of a newly appointed African-American coach and his high school team on their first season as a racially integrated unit.',
    Genre: {
      Name: 'Drama',
      Description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
    },
    Director: {
      Name: 'Boaz Yakin',
      Bio: 'Boaz Yakin was born in 1966 in New York City, New York, USA. He is a writer and producer, known for Fresh (1994), Remember the Titans (2000) and The Harder They Fall (2021).',
      DOB: 'June 20, 1966'
    },
    Stars: 'Denzel Washington, Will Patton, Wood Harris',
    ImgURL: 'https://m.media-amazon.com/images/M/MV5BYThkMzgxNjEtMzFiOC00MTI0LWI5MDItNDVmYjA4NzY5MDQ2L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX67_CR0,0,67,98_AL_.jpg'
  },
  {
    Title: 'Jurassic Park',
    Story:"A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose",
    Genre: {
      Name: 'Action, Adventure, Sci-Fi',
      Description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    },
    Director: {
      Name: 'Steven Speilberg',
      Bio: 'One of the most influential personalities in the history of cinema, Steven Spielberg is Hollywood"s best known director and one of the wealthiest filmmakers in the world. He has an extraordinary number of commercially successful and critically acclaimed credits to his name, either as a director, producer or writer since launching the summer blockbuster with Jaws (1975), and he has done more to define popular film-making since the mid-1970s than anyone else.',
      DOB: 'December 18, 1946'
    },
    Stars: 'Sam Neill, Laura Dern, Jeff Goldblum',
    ImgURL: 'https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_UX67_CR0,0,67,98_AL_.jpg'
  },
  {
    Title: 'Avatar',
    Story:'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.    ',
    Genre: {
      Name: '',
      Description: ''
    },
    Director: {
      Name: 'James Cameron',
      Bio: 'James Francis Cameron was born on August 16, 1954 in Kapuskasing, Ontario, Canada. He moved to the United States in 1971. The son of an engineer, he majored in physics at California State University before switching to English, and eventually dropping out. He then drove a truck to support his screenwriting ambition. James Cameron is now one of the most sought-after directors in Hollywood.',
      DOB: 'August 16, 1954'
    },
    Stars: 'Sam Worthington, Zoe Saldana, Siguorney Weaver',
    ImgURL: 'https://m.media-amazon.com/images/M/MV5BNjA3NGExZDktNDlhZC00NjYyLTgwNmUtZWUzMDYwMTZjZWUyXkEyXkFqcGdeQXVyMTU1MDM3NDk0._V1_UX67_CR0,0,67,98_AL_.jpg'
  },
];

// GET requests, READ
app.get('/', (req, res) => {
  res.send('Welcome to my website, where you can create a list of your favorite movies!');
});

// GET requests, READ
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

// GET requests, READ
app.get('/index', (req, res) => {                  
  res.sendFile('public/index.html', { root: __dirname });
});

//Lists all movies, READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// Get a single movie by title, READ
app.get("/movies/:title", (req, res) => {
  const { title } = req.params; // this syntax is called 'object destructuring'
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie found');
  }
});

// get info about the genre of the movie, READ
app.get("/movies/genres/:genreName", (req, res) => {
  const { genreName } = req.params; // this syntax is called 'object destructuring'
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre found');
  }
});

// get info about director, READ
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params; // this syntax is called 'object destructuring'
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director found');
  }
});

//CREATE, adding a new user
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser) // the 201 code status reps something being created
  } else {
    res.status(400).send('users need names')
  }
})

// UPDATE, make a change to your user id
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  }

})

// CREATE add a movie to your favorites list
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no such user')
  }
})

// DELETE, Delete a movie to your favorites list
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been deleted from user ${id}'s array`);
  } else {
    res.status(400).send('no such user')
  }
})

// DELETE, delete a user 
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id ); // DO NOT want to use strict equality here since we are comparing a string to a number
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send('no such user')
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});