'use strict';
var portName = '/dev/ttyUSB0';
// Se importar y se inicializan las liberias.
var express = require('express'), //Liberia crear servidor web
    app = express(), //Se crea un servidor para la app
    router = express.Router(), //Se genera un enrutador para las vistar
    http = require('http').createServer(app), //Se activan los protocolos http para el servidor
    io = require('socket.io')(http), //Se crea la configuracion para conexiones socket con el servidor
    crossroads = require('crossroads'), //Libreria para saltar entre entornos de trabajo
    swig = require('swig'), // Motor de plantillas a implementar
		serialport = require('serialport'), // Libreria para la lectura del puerto serial
		SerialPort = serialport.SerialPort; // Se inicializa una variables para su control.

//Configuramos el motor de plantillas
swig.setDefaults({
	cache : 'memory'
});

//Se configura el servidor para renderirar las plantillas
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', './app/views');

//Se establecen los archivos estaticos del server
app.use( express.static(__dirname + '/public') );
app.use(router);

// Se llaman a las rutas
var homeRouter = require('./app/routers/home');
homeRouter(router);

var sp = new SerialPort(portName,{
  baudRate:9600,
  parser: serialport.parsers.readline(':\r\n')
});

var LuminaryClass = function (){
  this.Photocell = 0;
  this.Lamp=0;
  this.Luminosity=0;
}

//Se crean los metodos de la clase
LuminaryClass.prototype.setPhotocell = function (value) {this.Photocell = value;}
LuminaryClass.prototype.getPhotocell = function() {return this.Photocell;}
LuminaryClass.prototype.setLamp = function (value) {this.Lamp = value;}
LuminaryClass.prototype.getLamp = function() {return this.Lamp;}
LuminaryClass.prototype.setLuminosity = function (value) {this.Luminosity = value;}
LuminaryClass.prototype.getLuminosity = function() {return this.Luminosity;}


//Se crea una instancia e inicializa la clase
var Luminary = new LuminaryClass();

sp.on('data', function(data) {
  var res = data.split(",");
  console.log(res);
  Luminary.setPhotocell(res[0]);
  Luminary.setLamp(res[1]);
  Luminary.setLuminosity(res[2]);
});