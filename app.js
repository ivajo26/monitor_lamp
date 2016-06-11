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

//Lectura del puerto serial y gardado de datos en la clase
sp.on('data', function(data) {
  var res = data.split(",");
  Luminary.setPhotocell(res[0]);
  Luminary.setLamp(res[1]);
  Luminary.setLuminosity(res[2]);
});

var sockets = {};
//Se crea un callback para escuchar conexciones socket
io.on('connection', function(socket) {
  sockets[socket.id] = socket;
  console.log("Clientes conectados ", Object.keys(sockets).length);

  //Funcion para cuando se deconecta un cliente
  socket.on('disconnect', function() {
    delete sockets[socket.id];
    console.log("Cliente Desconectado");
    console.log("Clientes conectados ", Object.keys(sockets).length);
  });
});

//Se activa la escucha del servidor web por el puerto 300
http.listen(3000, function() {
  console.log('Servidor escuchando en puerto 3000');
});

setInterval(function(){
    //Envio de nuevos valores
    console.log({'photocell': Luminary.getPhotocell(), 'lamp': Luminary.getLamp(), 'luminosity': Luminary.getLuminosity()});
    io.emit('estado', {'values': [ Luminary.getPhotocell(), Luminary.getLamp(), Luminary.getLuminosity()]});
}, 500);
