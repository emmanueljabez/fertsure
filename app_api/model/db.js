var mongoose = require( 'mongoose' );


var dbURI = 'mongodb://localhost/fertSure';
if (process.env.NODE_ENV === 'production'){
    dbURI = 'mongodb://<jayb21>:<incorrect>@ds030829.mlab.com:30829/fertsure';
}

mongoose.connect(dbURI);

mongoose.connection.on("connected",function(){
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on("error",function(){
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on("disconnected",function(){
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function(msg,callback){
    mongoose.connection.close(function(){
        console.log("Mongoose disconnected through "+ msg);
        callback();
    });
};

process.once('SIGUSR2',function(){
    gracefulShutdown('nodemon restart',function(){
        process.kill(process.pid,'SIGUSR2');
    });
});

process.once('SIGINT',function(){
    gracefulShutdown('app termination',function(){
        process.exit(0);
    });
});

process.once('SIGTERM',function(){
    gracefulShutdown('Heroku app shutdown',function(){
        process.exit(0);
    });
});

require('./fertlizers');
require('./users');

