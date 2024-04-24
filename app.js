const jwt = require('jsonwebtoken'),
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  dotenv = require('dotenv'),
  cors = require('cors'),
  swaggerJsdoc = require('swagger-jsdoc'),
  { MongoClient } = require('mongodb'),
  swaggerUi = require('swagger-ui-express');
const db = require('./db');

dotenv.config();

const PORT = process.env.PORT;
const secretKey = process.env.SECRET;

const app = express();

app.use(cors({ credentials: true, origin: '*' }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

if (process.env.ISDEV == 'true') {
  const swaggerDefinition = {
    info: {
      title: 'App',
      version: '1.0.0',
      description: 'API documentation with Swagger',
    },
    host: `localhost:${PORT}`,
    basePath: '/',
  };

  const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
  };
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

app.use('/api', function (req, res, next) {
  try {
    const clientId = req.headers['client-id'];
    const clientSecret = req.headers['client-secret'];

    if (
      clientId == process.env.CLIENT_ID &&
      clientSecret == process.env.CLIENT_SECRET
    ) {
      next();
    } else {
      return res.status(403).send('access error !');
    }
  } catch (error) {
    return res.status(403).send('access error !');
  }
});
const userRoutes = require('./apiRoutes');
app.use('/', userRoutes);
app.get('/web', (req, res) => {
  res.render('index.html');
});

// app.use('*', (req, res) => {
//   res.render('./error.ejs', {});
// });

app.listen(PORT, async (error) => {
  if (!error) {
    console.log('server running || port : ' + process.env.PORT);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
