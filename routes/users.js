var express = require('express');
var router = express.Router();

const User = require('../models/users');

const { checkBody } = require('../modules/checkBody');

const bcrypt = require ('bcrypt');
const uid2 = require ('uid2');

// Route pour l'inscription
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ['username', 'firstname', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' }); // Erreur dans les champs 
    return;
  }


  User.findOne({ username: req.body.username }) // Cherche dans la BDD un meme nom
  .then(data => {
    if (data === null) { // Pas de meme nom alors on crée
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({ // création d'un nouvel User
        username: req.body.username,
        firstname: req.body.firstname,
        password: hash,
        token: uid2(32),
        canBookmark: true,
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // L'utilisateur existe déjà dans la base de données
      res.json({ result: false, error: '❌User already exists' });
    }
  });
});


// Route pour la connexion
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ['username', 'firstname', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ username: req.body.username, firstname: req.body.firstname, password: req.body.password })
  .then(data => {
    if (data) {
      res.json({ result: true }); // User est enregistré 
    } else {
      res.json ({ result: false, error: "❌User not found" }) // User pas trouvé
    }
  })
});

module.exports = router;


// /* GET users listing. */
// router.get('/signup', function(req, res, next) {
//   res.send('respond with a resource');
// });