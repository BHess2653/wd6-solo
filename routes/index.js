var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Wish = require('../models/wish');

var Product = require('../models/product');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, docs){
    var productChunks = [];
    var chunkSize = 3;
    for(var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Future-Tech', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/add-to-wish/:id', function(req, res, next) {
  var productId = req.params.id;
  var wish = new Wish(req.session.wish ? req.session.wish : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    wish.add(product, product.id);
    req.session.wish = wish;
    console.log(req.session.wish);
    res.redirect('/');
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove-all/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeAll(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove-wish/:id', function(req, res, next) {
  var productId = req.params.id;
  var wish = new Wish(req.session.wish ? req.session.wish : {});

  wish.removeOneWish(productId);
  req.session.wish = wish;
  res.redirect('/wishlist');
});

router.get('/remove-wish-all/:id', function(req, res, next) {
  var productId = req.params.id;
  var wish = new Wish(req.session.wish ? req.session.wish : {});

  wish.removeWishAll(productId);
  req.session.wish = wish;
  res.redirect('/wishlist');
});

router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/wishlist', function(req, res, next) {
  if (!req.session.wish) {
    return res.render('shop/wishlist', {products: null});
  }
  var wish = new Wish(req.session.wish);
  res.render('shop/wishlist', {products: wish.generateArray(), totalPrice: wish.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.render('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.render('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")("sk_test_XpviFBIcKNWDNq1KuQqclLHf");

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken,
    description: "Test Charge"
  }, function(err, charge) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result) {
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
