//Declaración de Requires de módulos
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const axios = require('axios');
const data = require('./data');
const PORT = process.env.PORT || 8082;


app.enable('trust proxy');

/*app.use((req, res, next) => {
        if (req.secure) {            
                next();
        } else {
                res.redirect('https://' + req.headers.host + req.url);
        }
});*/

//Seteo de Handlebars (Templates)
const motor = handlebars.create({
    extname: 'hbs',
    defaultLayout: 'layout247Studio',
});

app.engine("hbs",motor.engine);
app.set("view engine","hbs");


//Seteo de bodyParser (para leer JSON)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Seteo de Archivos Estáticos
app.use('/images', express.static('images'))
app.use('/assets', express.static('assets'))

//Seteo de peticiones GET
app.get('/', (req, res) => {
  data.allnews((err, allNews) => {
    if (err) {
      res.render('error');
    } else {
      res.render('home', { allNews });
    }
  })
});

app.get('/actualidad', (req, res) => {
  res.render('actualidad')
});    

app.get('/trayectoria', (req, res) => {
  res.render('trayectoria')
});    
    
app.get('/escuela', (req, res) => {
  res.render('escuela')
});  

app.get('/salas', (req, res) => {
  res.render('salas')
});    

app.get('/produccion', (req, res) => {
  res.render('produccion')
}); 

app.get('/alquiler', (req, res) => {
  res.render('alquiler')
}); 

app.get('/contacto', (req, res) => {
  res.render('contacto')
}); 

app.get('/roster', (req, res) => {
  data.allmembers((err, allMembers) => {
    if (err) {
      res.render('error');
    } else {
      res.render('roster', { allMembers });
    }
  })
}); 

//Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor inicializado en puerto ${PORT}`);
});