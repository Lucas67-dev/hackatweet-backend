var express = require('express');
var router = express.Router();

const User = require('../models/users');

const { checkBody } = require('../modules/checkBody');

const bcrypt = require ('bcrypt');
const uid2 = require ('uid2');

/* Route pour l'inscription */
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ['username', 'firstname', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' }); // Erreur dans les champs donc c'est false
    return;
  }


  User.findOne({ username: req.body.username }) // Cherche dans la BDD un meme nom
  .then(data => {
    if (data === null) { // Pas de meme nom alors on crée un user
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({ // création d'un nouvel User
        username: req.body.username,
        firstname: req.body.firstname,
        password: hash,
        token: uid2(32),
        canBookmark: true,
      });

      newUser.save().then(newDoc => { // Sauvegarde le User dans la BDD
        res.json({ result: true, token: newDoc.token }); // Si c'est true alors c'est sauvegarde
      });
    } else {
      res.json({ result: false, error: '❌User already exists' }); // L'utilisateur existe déjà dans la base de données donc cest false
    }
  });
});


/* Route pour la connexion */
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ['username', 'firstname', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ username: req.body.username, firstname: req.body.firstname })
  .then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token }); // User est enregistré 
    } else {
      res.json ({ result: false, error: "❌User not found" }) // User pas trouvé
    }
  })
});

/* Route Get pour trouver le token d'un user */
router.get('/canBookmark/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(data => { // Recherche dans la BDD avec le token en parametre 
    if (data) {
      res.json({ result: true, canBookmark: data.canBookmark });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

module.exports = router;


// /* GET users listing. */
// router.get('/signup', function(req, res, next) {
//   res.send('respond with a resource');
// });