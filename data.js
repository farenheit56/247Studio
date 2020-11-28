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
});

let membersSchema = new mongoose.Schema({
    name: String,
    genre: String,
    imagePath: String,
});

let members = mongoose.model('members', membersSchema);
let news = mongoose.model('news', newsSchema);


module.exports = {
    allmembers: (callback) => {
        members.find((err, result) => {
            if(err){
                callback('Ocurrió un error al pedir el members')
            }else{
                console.log(result)
                callback(null, result)
            };
        })
    },
    allnews: (callback) => {
        news.find((err, result) => {
            if(err){
                callback('Ocurrió un error al pedir las novedades')
            }else{              
                callback(null, result)
            };
        })
    },
}
