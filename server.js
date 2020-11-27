//Declaración de Requires de módulos
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const axios = require('axios');
const data = require('./data');
const PORT = process.env.PORT || 8080;


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

app.route('/contact')
  .get( (req, res) => {
    data.allevents((err, datos) => {
        if(err){
            res.render('error');
        }else {
            res.render('contact')
        }
    })
    })
  .post( (req,res) => {
    let contactName = req.body.contactName;
    let contactEmail = req.body.contactEmail;
    let contactMessage = req.body.contactMessage;

    const msgContact = {
      to: 'abezeweb@gmail.com',
      from: contactEmail,
      reply_to: contactEmail,
      dynamic_template_data: {
        name: contactName,
        email: contactEmail,
        message: contactMessage, 
      },
      template_id: 'd-48bb31af265c4df9a5621b1b8d08c999', 
    };    
    sgMail.send(msgContact);
    res.redirect('https://www.abezeweb.com/contact'); 
  })  ; 


app.route("/event")
    .get((req,res) => {
        var id= req.query.id;
        data.event(id,  (err,datos) => {
            if(err){
                res.render('error');  
            }else{
              let prueba = JSON.stringify(datos.guest_pics);
              let prueba2 = prueba.replace(/"([^"]+)":/g, '$1:');
              data.allimages(id, (err,images) => {
                if(err){
                    res.render('error');
                }else {
                  data.lastreviews(id, (err,reviews) => {
                    if(err){
                      res.render('error');
                    } else {
                      reviewsFinal = reviews[0];
                      data.lastguestpics(id, (err, guestpics) => {
                        if(err) {
                          res.render('error');
                        } else {
                          guestpicsFinal = guestpics[0];
                          res.render('event', {datos, images, reviewsFinal, guestpicsFinal, prueba2});
                        }
                      })                                           
                    }
                  })                    
                }
            }) 
            };
        });
})

//Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor inicializado en puerto ${PORT}`);
});