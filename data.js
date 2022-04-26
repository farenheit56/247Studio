const mongoose = require('mongoose');
/*PROD*/const connectionString = 'mongodb+srv://farenheit56:t3rm1nat0r@cluster0.lysqd.mongodb.net/247studio?retryWrites=true&w=majority';
mongoose.connect(connectionString, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Error al conectar'));
db.on('open', () => {console.log('Conectado a Atlas')});

let newsSchema = new mongoose.Schema({
    name: String,
    link: String,
    imagePath: String,
    order: Number
});

let membersSchema = new mongoose.Schema({
    name: String,
    genre: String,
    firstImage: String,
    secondImage: String,
});

let membershipsSchema = new mongoose.Schema({
  name: String,
  isValid: Boolean,
});

let photosSchema = new mongoose.Schema({
  eventName: String,
  eventDate: String,
  mediaPath: String,
  mediaType: String,
  videoPlaceholder: String,
});

let members = mongoose.model('members', membersSchema);
let news = mongoose.model('news', newsSchema);
let photos = mongoose.model('photos', photosSchema);
let memberships = mongoose.model('memberships', membershipsSchema);

module.exports = {
  allmembers: (callback) => {
    members.find((err, result) => {
      if (err) {
        callback('Ocurrió un error al pedir los members');
      } else {
        callback(null, result);
      }
    });
  },
  allnews: (callback) => {
    news
      .find()
      .sort({ order: -1 })
      .exec((err, result) => {
        if (err) {
          callback('Ocurrió un error al pedir las novedades');
        } else {
          callback(null, result);
        }
      });
  },
  allphotos: (callback) => {
    photos.find((err, result) => {
      if (err) {
        callback('Ocurrió un error al pedir las fotos');
      } else {
        callback(null, result);
      }
    });
  },
  singlephotoevents: (callback) => {
    photos.distinct('eventName', (err, result) => {
      if (err) {
        callback('Ocurrió un error al pedir los eventos de las fotos');
      } else {
        callback(null, result);
      }
    });
  },
  getMembership(id, callback) {
    memberships.findOne({ _id: id }, (err, result) => {
      if (err) {
        callback('Miembro no encontrado');
      } else {
        callback(null, result);
      }
    });
  },
};
