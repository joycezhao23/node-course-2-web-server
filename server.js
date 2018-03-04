const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

//Assigns setting name 'view engine' to value 'hbs'
//'hbs' will be the default engine extension to use when omitted.
app.set('view engine', 'hbs');

//app.use([path,] callback [, callback...])
//path defaults to '/' so the following will be mounted to root
//and executed for every request to the app
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});

//without "next()", this middleware will not
//allow the request to go beyond it
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//app.get(path, callback): Routes HTTP GET requests to the
//specified path with the specified callback functions.
//res.render(view [, locals] [, callback]): Renders a view
//and sends the rendered HTML string to the client.
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About page',
  });
});

//res.send([body]): Sends the HTTP response.
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

//app.listen(port, [hostname], [backlog], [callback]): Binds and
//listens for connections on the specified host and port.
//This method is identical to Node’s http.Server.listen().
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
