const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser');

const app = express();

let topMovies = [
  {
    title: 'Good Will Hunting',
    story:'Will Hunting, a janitor at MIT, has a gift for mathematics but needs help from a psychologist to find direction in his life.',
    director: 'Gus Van Sant',
    stars: 'Matt Damon, Robin Williams, Ben Affleck, Stellan Skarsgård, Minnie Driver'

  },
  {
    title: 'A Few Good Men',
    story:'When cocky military lawyer Lt. Daniel Kaffee and his co-counsel, Lt. Cmdr. JoAnne Galloway, are assigned to a murder case, they uncover a hazing ritual that could implicate high-ranking officials such as shady Col. Nathan Jessep.',
    director: 'Rob Reiner',
    stars: 'Tom Cruise, Jack Nicholson, Demi Moore, Kevin Bacon, Kiefer Sutherland'

  },
  {
    title: 'My Cousin Vinny',
    story:'Two New Yorkers accused of murder in rural Alabama while on their way back to college call in the help of one of their cousins, a loudmouth lawyer with no trial experience.',
    director: 'Johnathan Lynn',
    stars: 'Joe Pesci, Marisa Tomei, Ralph Macchio'

  },
  {
    title: 'Cast Away',
    story:'A FedEx executive undergoes a physical and emotional transformation after crash landing on a deserted island.',
    director: 'Robert Zemeckis',
    stars: 'Tom Hanks, Helen Hunt, Paul Sanchez'

  },
  {
    title: 'A Nightmare on Elm Street',
    story:'Teenager Nancy Thompson must uncover the dark truth concealed by her parents after she and her friends become targets of the spirit of a serial killer with a bladed glove in their dreams, in which if they die, it kills them in real life.',
    director: 'Wes Craven',
    stars: 'Heather Langenkamp, Johnny Depp, Robert Englund'

  },
  {
    title: 'Scream 2',
    story:'Two years after the first series of murders, as Sidney acclimates to college life, someone donning the Ghostface costume begins a new string of killings.',
    director: 'Wes Craven',
    stars: 'Neve Campbell, Courteney Cox, David Arquette'

  },
  {
    title: 'A Beautiful Mind',
    story:'After John Nash, a brilliant but asocial mathematician, accepts secret work in cryptography, his life takes a turn for the nightmarish.',
    director: 'Ron Howard',
    stars: 'Russel Crowe, Ed Harris, Jennifer Connelly'

  },
  {
    title: 'Remember the Titans',
    story:'The true story of a newly appointed African-American coach and his high school team on their first season as a racially integrated unit.',
    director: 'Boaz Yakin',
    stars: 'Denzel Washington, Will Patton, Wood Harris'

  },
  {
    title: 'Jurassic Park',
    story:"A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose",
    director: 'Steven Spielberg',
    stars: 'Sam Neill -Laura Dern - Jeff Goldblum'

  },
  {
    title: 'Avatar',
    story:'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.    ',
    director: 'James Cameron',
    stars: 'Sam Worthington, Zoe Saldana, Siguorney Weaver'

  },
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my website for movies!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/index', (req, res) => {                  
  res.sendFile('public/index.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use(morgan('combined')); // setup the logger, Mildware function to the terminal

app.use(express.static('public')); // Automatically routes all requests for static files to their corresponding files within a certain folder on the server.

app.use(bodyParser.json()); // support parsing of application/json type post data
app.use(bodyParser.urlencoded({ extended: true })); //support parsing of application/x-www-form-urlencoded post data

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});