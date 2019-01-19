const express = require('express');
const router = express.Router();
const {postRegister} = require('../controllers/index'); // extracting from the controller index.js , send the object 

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Surf Shop - Home' });
});


/* GET /register page. */
router.get('/register', (req, res, next) => {
  res.send('GET /register');
});

/* POST /register page. */
router.post('/register', postRegister);

/* GET /register page. */
router.get('/login', (req, res, next) => {
  res.send('GET /login');
});

/* POST /register page. */
router.post('/login', (req, res, next) => {
  res.send('POST /login');
});

/* GET /profile page. */
router.get('/profile', (req, res, next) => {
  res.send('GET /profile');
});

/* PUT /profile/:user_id page. */
router.put('/profile', (req, res, next) => {
  res.send('GET /profile/:user_id');
});

/* GET /forgot page. */
router.get('/forgot', (req, res, next) => {
  res.send('GET /forgot');
});

/* PUT /forgot page. */
router.put('/forgot', (req, res, next) => {
  res.send('PUT /forgot');
});

/* GET /reset/:token  page. */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset/:token');
});

/* PUT /reset/:token page. */
router.put('/reset/:token', (req, res, next) => {
  res.send('PUT /reset/:token');
});

module.exports = router;
