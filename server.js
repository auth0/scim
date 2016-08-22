var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

// endpoints
router.route('/users')
  .post(function (req, res) {
    res.json({ message: 'TODO' });
  })

  .get(function (req, res) {
    res.json({ message: 'TODO' });
  });

router.route('/users/:user_id')
  .get(function(req, res) {
    res.json({ message: 'TODO' });
  });

app.use('/scim', router);

app.listen(port);
console.log('Listening on port ' + port);
