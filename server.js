var express     = require('express');
var bodyParser  = require('body-parser');
var app         = express();
var morgan      = require('morgan');
var Translate      = require('./lib/translate');

var Auth0ManagementClient = require('auth0').ManagementClient;
var auth0Client = new Auth0ManagementClient({
  domain: 'scim-test.auth0.com',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJrUGV6cFhrQkdON0JqWHd3TjVuRHgxekJWVGZvZVU4aiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJjcmVhdGUiXX19LCJpYXQiOjE0NzE5MDM5NjgsImp0aSI6ImU5MDI2YWUxMzZmNDJkMmRjMmEwYjg5ZDJhN2MyNzk2In0.xGaqfyA_0fm-OOv5IaopHXK-MlMA3yNusr7LQ7nHQiM'
});

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

// endpoints
router.route('/users')
  .post(function (req, res, next) {
    var scimUser = req.body;
    
    return Translate.toAuth0(scimUser, (err, auth0_user) => {
      if (err) return next(err);
      
      auth0Client.users.create(auth0_user, (err, newAuth0User) => {
        if (err) return next(err);
        
        Translate.fromAuth0(newAuth0User, (err, newScimUser) => {
          if (err) return next(err);
          
          res.status(201).json(newScimUser);
        });
      });
    });
  })

  .get(function (req, res, next) {
    // TODO: support paging/search/etc
    auth0Client.users.getAll(function (err, auth0Users) {
      if (err) return next(err);

      var scimUsers = (auth0Users || []).map(function (auth0User) {
        return mapper.users.auth0ToScim(auth0User);
      });

      res.json(scimUsers);
    });
  });

router.route('/users/:user_id')
  .get(function (req, res, next) {
    auth0Client.users.get({ id: req.params.user_id }, function (err, auth0User) {
      if (err) return next(err);
      if (!auth0User) return res.send(404);

      var scimUser = mapper.users.auth0ToScim(auth0User);
      res.json(scimUser);
    });
  });

app.use('/scim', router);

app.use(function (err, req, res, next) {
  var status = err.statusCode || 500;
  res.status(status).send(err.message);
});

app.listen(port);
console.log('Listening on port ' + port);
