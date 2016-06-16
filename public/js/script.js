var socket = io.connect();

$(document).ready(runAllGauges());

$('.reset').on('click', function(e){
  e.preventDefault();
  $(this).toggleClass('active');
  if ( $(this).hasClass('active') ){
    $(this).text('Run');
    resetAllGauges();
  } else {
    $(this).text('Reset');
    runAllGauges();
  }
});


function runAllGauges()
{
  var gauges = $('.gauge-cont');
  $.each(gauges, function(i, v){
    var self = this;
		setTimeout(function(){
        setGauge(self);
    },i * 700);
  });
}

function resetAllGauges()
{
  var gauges = $('.gauge-cont').get().reverse();
  $.each(gauges, function(i, v){
    var self = this;
		setTimeout(function(){
        resetGauge(self);
    },i * 700);
  });
}

function resetGauge(gauge)
{
  var spinner = $(gauge).find('.spinner');
  var pointer = $(gauge).find('.pointer');
  $(spinner).attr({
    style: 'transform: rotate(0deg)'
  });
  $(pointer).attr({
    style: 'transform: rotate(-90deg)'
  });
}

function setGauge(val, sp, poi)
{
  // console.log($(gauge).data('percentage'));
  var percentage = val / 100;
  var degrees = 180 * percentage;
  var pointerDegrees = degrees - 90;
  $(sp).attr({
    style: 'transform: rotate(' + degrees + 'deg)'
  });
  $(poi).attr({
    style: 'transform: rotate(' + pointerDegrees + 'deg)'
  });
}

function percentageVal(val, max) {
  return (val/max)*100;
}
socket.on('estado',function(datos){
  // console.log(datos['values'][0]);
  var gauges = $('.gauge-cont');
  gauges[0].dataset.percentage = percentageVal(datos['values'][0],2);
  gauges[1].dataset.percentage = percentageVal(datos['values'][1],2);
  gauges[2].dataset.percentage = Math.floor(datos['values'][2]);
  var light = document.getElementById('light');
  var a0 = document.getElementById('alert0');
  var a1 = document.getElementById('alert1');
  var a2 = document.getElementById('alert2');
  if (datos['values'][0]>=0.7 && datos['values'][1]>=0.7 && datos['values'][2]>=75) {
    light.classList.remove('red');
    light.classList.add('yellow');
  }else {
    light.classList.remove('yellow');
    light.classList.add('red');
  }
  if (datos['values'][0]>=0.7 && datos['values'][1]<0.7 ) {
    a0.classList.add('hide');
    a0.classList.remove('hide');
  }else {
    a0.classList.add('hide');
  }
  if (datos['values'][0]>=0.7 && datos['values'][1]<0.7) {
    a1.classList.add('hide');
    a1.classList.remove('hide');
  }else {
    a1.classList.add('hide');
  }
  if (datos['values'][1]>=1 && datos['values'][2]<75) {
    a2.classList.add('hide');
    a2.classList.remove('hide');
  }else {
    a2.classList.add('hide');
  }
  var v0 = $('#value0');
  v0[0].innerHTML = datos['values'][0] ;
  var v1 = $('#value1');
  v1[0].innerHTML = datos['values'][1] ;
  var v2 = $('#value2');
  v2[0].innerHTML = datos['values'][2] ;
  setGauge(gauges[0].dataset.percentage, '.sp0', '.poi0');
  setGauge(gauges[1].dataset.percentage, '.sp1', '.poi1');
  setGauge(gauges[2].dataset.percentage, '.sp2', '.poi2');
  // $.each($('.gauge-cont'), function(i, v){
  //   // console.log(i);
  //   // console.log(v);
  //   var self = this;
  //   setGauge(self);
  // });
});
