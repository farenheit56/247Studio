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
})

let eventSchema = new mongoose.Schema({
    event_title: {
        type: String,
        required:true,
        minlength: 5,
        maxlength: 100
    },
    cooker: String,
    cellphone: String,
    value: {
        type: Number,
        required:true,
    },
    totalQuota : Number,
    date: String,
    sysdate: Date,
    rating: Number,
    address: {
        type: String,
        required:true,
        minlength: 5,
        maxlength: 100
    },
    description: String,
    menu: String,
    aboutHost: String,
    placeDescription: String,
    image_name: String,
    food_type: String,
    hasVideo: String,
    video_name: String,
    reviews: Object,
    reviews2: Array,
    guest_pics: Array,
    duration: String,
    timetables: Array,
    latitude: Number,
    longitude: Number,
    istop: Boolean,
    cookerPic: String,
    payer: Array,
});

let timetableSchema = new mongoose.Schema({
    event_id: String,
    event_title: String,
    cooker: String,
    hour: String,
    quota: Number,
    adress: String,
    date: String,
    hidden_date: String,
    expiration_date: Date,
    calendar_date: String,
})

let imageSchema = new mongoose.Schema({
    event_id: String,
    image_name: String,
})

let emailSchema = new mongoose.Schema({
    email: String,
})

let discountSchema = new mongoose.Schema({
    code: String,
    discount: Number,
})

let news = mongoose.model('news', newsSchema);
let event = mongoose.model('eventos', eventSchema);
let timetable = mongoose.model('horarios', timetableSchema);
let images = mongoose.model('event-images', imageSchema);
let emails = mongoose.model('emails', emailSchema);
let discount = mongoose.model('discount-codes', discountSchema);

module.exports = {
    allnews: (callback) => {
        news.find((err, result) => {
            if(err){
                callback('Ocurrió un error al pedir las novedades');
            }else{
                callback(null, result);
            };
        })
    },
    allevents: (callback) => {
        horaActual = new Date;
        event.find({sysdate: {$gte :horaActual},
                    totalQuota: {$gte:1}, istop: false}, (err, result) => {
            if(err){
                callback('Ocurrió un error al pedir los eventos');
            }else{
                callback(null, result);
            };
        })
    },
    topevents: (callback) => {
        horaActual = new Date;
        event.find({sysdate: {$gte :horaActual},
                    totalQuota: {$gte:1}, istop: true},  (err, result) => {
            if(err){
                callback('Ocurrió un error al pedir los eventos');
            }else{
                callback(null, result);
            };
        })
    },
    event: (id, callback) => {
        event.findOne(
            {_id: new mongoose.Types.ObjectId(id)},
            callback
            );
    }, 
    lastreviews: (id, callback) => {
        event.aggregate(
            [
            {$match: {_id: new mongoose.Types.ObjectId(id)}},
            {$project: {
                first: {$arrayElemAt: ['$reviews2', 0 ]},
                second: {$arrayElemAt: ['$reviews2', 1]},
                third: {$arrayElemAt: ['$reviews2', 2]}
            }}
            ], 
            (err, result)=> {
                if(err){
                    callback('Ocurrió un error al pedir los reviews');
                }else {
                    callback(null, result);
                }
            }
            
        )
    },
    lastguestpics: (id, callback) => {
        event.aggregate(
            [
            {$match: {_id: new mongoose.Types.ObjectId(id)}},
            {$project: {
                first: {$arrayElemAt: ['$guest_pics', 0]},
                second: {$arrayElemAt: ['$guest_pics', 1]},
                third: {$arrayElemAt: ['$guest_pics', 2]},
                forth: {$arrayElemAt: ['$guest_pics', 3]},
                fifth: {$arrayElemAt: ['$guest_pics', 4]},
                sixth: {$arrayElemAt: ['$guest_pics', 5]},
            }}
            ], 
            (err, result)=> {
                if(err){
                    callback('Ocurrió un error al pedir las fotos de usuarios');
                }else {
                    callback(null, result);
                }
            }
            
        )
    },
    allimages: (id, callback) => {
        images.find({event_id: id}, (err,result)=> {
            if(err){
                callback('Ocurrió un error al pedir las imágenes');
            }else{
                callback(null, result);
            };
        })
    },
    updatequota: (id, quotaNew, callback) => {

        timetable.updateOne(
            {_id: new mongoose.Types.ObjectId(id)}, 
            {quota: quotaNew}, 
            callback
            );
    },
    updateTotalQuota: (id, totalQuotaNew, callback) => {

        event.updateOne(
            {_id: new mongoose.Types.ObjectId(id)}, 
            {totalQuota: totalQuotaNew}, 
            callback
            );
    },
    updateEventRating: (id, newEventRating, callback) => {
        event.updateOne(
            {_id: new mongoose.Types.ObjectId(id)}, 
            {rating: newEventRating}, 
            callback
            );
    },
    appendPayer: (id, newPayer, callback) => {

        event.updateOne(
            {_id: new mongoose.Types.ObjectId(id)}, 
            {$push: {payer: newPayer}}, 
            callback
            );
    },
    appendReview: (id, newReview, callback) => {
        event.updateOne(
            {_id: new mongoose.Types.ObjectId(id)}, 
            {$push: {
                reviews2: {
                    $each: [newReview],
                    $position: 0}}}, 
            callback
            );
    },
    alldates: (id, callback) => {
        horaActual = new Date;
        timetable.aggregate([{$match: {event_id: id, expiration_date: {$gte :horaActual}}},
             {$group: {_id: "$date", hidden_date: {$first: "$hidden_date"}, calendar_date: {$first: "$calendar_date"}}},
            {$sort: {_id: 1}}], (err, result)=> {
            if(err){
                callback('Ocurrió un error al pedir las fechas');
            }else {
                callback(null, result);
            }
        })
    },
    alltimetables: (id, callback) => {
        horaActual = new Date;
        timetable.aggregate([{$match: {event_id: id, expiration_date: {$gte :horaActual}}}, {$sort: {hour: 1}}],   (err,result)=> {
            if(err){
                callback('Ocurrió un error al pedir los eventos');
            }else{
                callback(null, result);
            };
        })
    },
    timetable: (id, callback) => {
        timetable.findOne(
            {_id: new mongoose.Types.ObjectId(id)},
            callback
            );
    }, 
    discount: (discountCode, eventID, callback) => {
        discount.findOne(
            {code: discountCode,
             eventID: eventID},
            callback
            );
    }, 
    addemail: (email, callback) => {
        let newEmail = new emails({
            email: email,
        })

        newEmail.save((err) => {
            if (err) {
                callback('Hubo un error al guardar el email');
            } else {
                callback();
            }
        });
    },
}
