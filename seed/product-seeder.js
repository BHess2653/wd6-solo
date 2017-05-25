var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('localhost:27017/shopping');

var products = [
  new Product({
    imagePath: 'https://vignette1.wikia.nocookie.net/runescape2/images/0/05/Bronze_2h_sword_detail.png',
    title: 'Bronze 2h Sword',
    description: 'Quality made 2h sword made from bronze material.',
    price: 10
  }),
  new Product({
    imagePath: 'https://vignette4.wikia.nocookie.net/runescape2/images/d/d8/Iron_2h_sword_detail.png',
    title: 'Iron 2h Sword',
    description: 'Quality made 2h sword made from Iron material.',
    price: 20
  }),
  new Product({
    imagePath: 'https://vignette1.wikia.nocookie.net/runescape2/images/5/54/Steel_2h_sword_detail.png',
    title: 'Steel 2h Sword',
    description: 'Quality made 2h sword made from Steel material.',
    price: 30
  }),
  new Product({
    imagePath: 'https://vignette2.wikia.nocookie.net/runescape2/images/0/0a/Mithril_2h_sword_detail.png',
    title: 'Mithril 2h Sword',
    description: 'Quality made 2h sword made from mithril material.',
    price: 40
  }),
  new Product({
    imagePath: 'https://vignette3.wikia.nocookie.net/runescape2/images/6/6f/Adamant_2h_sword_detail.png',
    title: 'Adamant 2h Sword',
    description: 'Quality made 2h sword made from adamant material.',
    price: 50
  }),
  new Product({
    imagePath: 'https://vignette2.wikia.nocookie.net/runescape2/images/c/c9/Rune_2h_sword_detail.png',
    title: 'Rune 2h Sword',
    description: 'Quality made 2h sword made from rune material.',
    price: 60
  })
];
var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
