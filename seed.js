const Sequelize = require('sequelize');
const db = require('./server/db/db');
const { User, Order, LineItem, Product, Category } = require('./server/db/models');

const user = [
    {
      email: "TheGOAT@gmail.com",
      password: "aosdfjaosidjfoaijf9wjf993e9wu02w9ie9if",
      salt: "sl293r3029",
      googleId: null,
      subject_id: "a9sd90sif9i09",
      card_num: "770",
      first: "Aaron",
      last: "Rodgers",
      isAdmin: true
    },
    {
        email: "secondUser@gmail.com",
        password: "asi8u39i309059gg5kn0hbjvng48jv54if444",
        salt: "8f9i60u40fj",
        googleId: null,
        subject_id: "f83984g0kjsh8",
        card_num: "770",
        first: "Second",
        last: "Personson",
        isAdmin: false
    },
    {
        email: "firstuser@gmail.com",
        password: "aosdfjaosidjfoaijf9wjf993e9wu02w9ie9if",
        salt: "sl293r3029",
        googleId: null,
        subject_id: "a9sd90sif9i09",
        card_num: "770",
        first: "Tester",
        last: "Lasterson",
        isAdmin: false
    },
    {
        email: "fourthguy@gmail.com",
        password: "8gj9j5hvnng98h3fvd7vb9jr0i4igj8h483hnbe",
        salt: "f8450hkbmv4",
        googleId: null,
        subject_id: "8hvb74773h",
        card_num: "666",
        first: "Bill",
        last: "Clinton",
        isAdmin: false
    }
  ];
const order = [
     {
        status: 'pending',
        subtotal: 9,
        userId: 1
     },
     {
        status: 'cart',
        subtotal: 12,
        userId: 1
     },
     {
        status: 'paid',
        subtotal: 6,
        userId: 1
     },
     {
        status: 'paid',
        subtotal: 9,
        userId: 1
     },
     {
        status: 'paid',
        subtotal: 3,
        userId: 2
     },
     {
        status: 'cart',
        subtotal: 3,
        userId: 2
     },
     {
        status: 'paid',
        subtotal: 3,
        userId: 3
     },
     {
        status: 'pending',
        subtotal: 6,
        userId: 3
     }
];
const lineItem = [
    {
        productName: null,
        purchasePrice: 1,
        qty: 3,
        orderId: 1,
        productId: 1
    },
    {
        productName: null,
        purchasePrice: 1,
        qty: 3,
        orderId: 1,
        productId: 2
    },
    {
        productName: null,
        purchasePrice: 1,
        qty: 3,
        orderId: 1,
        productId: 3
    },
    {
        productName: null,
        purchasePrice: 2,
        qty: 3,
        orderId: 2,
        productId: 1
    },
    {
        productName: null,
        purchasePrice: 2,
        qty: 3,
        orderId: 2,
        productId: 2
    },
    {
        productName: null,
        purchasePrice: 2,
        qty: 3,
        orderId: 3,
        productId: 2
    },
    {
        productName: null,
        purchasePrice: 3,
        qty: 3,
        orderId: 4,
        productId: 3
    },
    {
        productName: null,
        purchasePrice: 1,
        qty: 3,
        orderId: 5,
        productId: 1
    },
    {
        productName: null,
        purchasePrice: 1,
        qty: 3,
        orderId: 6,
        productId: 1
    },
    {
        productName: null,
        purchasePrice: 1,
        qty: 3,
        orderId: 7,
        productId: 1
    },
    {
        productName: null,
        purchasePrice: 1,
        qty: 3,
        orderId: 8,
        productId: 1
    },
    {
        productName: null,
        purchasePrice: 1,
        qty: 3,
        orderId: 8,
        productId: 1
    },
]
const product = [
    {
        name: 'Coke',
        price: 1,
        inventory: 10,
        barcode: '2093fhasd8fj8f9',
        categoryId: 1
    },
    {
        name: 'Pepsi',
        price: 2,
        inventory: 10,
        barcode: '2093fhasd8fj8f9',
        categoryId: 1
    },
    {
        name: 'Gatorade',
        price: 3,
        inventory: 9,
        barcode: '2093fhasd8fj8f9',
        categoryId: 1
    },
]
const category = [
    {
        name: 'sports'
    }
]

const seed = () =>
Promise.all(user.map(user => User.create(user)))
  .then(() => Promise.all(category.map(ctg => Category.create(ctg))))
  .then(() => Promise.all(product.map(prdct => Product.create(prdct))))
  .then(() => Promise.all(order.map(ordr => Order.create(ordr))))
  .then(() => Promise.all(lineItem.map(item => LineItem.create(item))))

const main = () => {
    console.log('Syncing db...');
    db
      .sync({ force: true })
      .then(() => {
        console.log('Seeding databse...');
        return seed();
      })
      .catch(err => {
        console.log('Error while seeding');
        console.log(err.stack);
      })
      .then(() => {
        db.close();
        return null;
      });
  };
  
  main();