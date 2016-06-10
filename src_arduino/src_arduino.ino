float tension1,vpp1,vpp2,I1,I2,tension2;
void setup() {
  Serial.begin(9600);
}

void loop() {
  float minvoltaje1=5.0,maxvoltaje1=0.0,minvoltaje2=5.0,maxvoltaje2=0.0,promedioluz=0.0;
  for(int i; i<160; i++){
    int l=analogRead(A2);
    int l1=analogRead(A3);
     promedioluz=promedio(l,l1);
    tension1=5.0/1023*analogRead(A0);
    tension2=5.0/1023*analogRead(A1);
    if(tension1<=minvoltaje1) minvoltaje1=tension1;
    if(tension2<=minvoltaje2) minvoltaje2=tension2;
    if(tension1>=maxvoltaje1) maxvoltaje1=tension1;
    if(tension2>=maxvoltaje2) maxvoltaje2=tension2;
    }
vpp1=maxvoltaje1-minvoltaje1;
vpp2=maxvoltaje2-minvoltaje2;
I1=(3.53553*vpp1);
I2=(3.53553*vpp2);
Serial.print(I1);
Serial.print(",");
Serial.print(I2);
Serial.print(",");
Serial.print(promedioluz);
}

float promedio(float val1, float val2){
  float prom;
  float val;
  val = (val1+val2)/2;
  prom = (val*100)/1023;
  return prom;
  }
