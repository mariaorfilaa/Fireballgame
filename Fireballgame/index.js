const canvas = document.getElementById ("canvas");
const ctx = canvas.getContext ("2d");

canvas.height = 512;
canvas.width = 448;

const sprite = document.getElementById ("sprite");
const mur = document.getElementById ("murs");
const ball = document.getElementById ("balls")


let colors = ["#CD5C5C", "#F08080", "#FA8072", "#E9967A", "#8B0000"]

const filas = 6 
const columnes = 12;
const ampleMur = 30;
const alturaMur = 14;
const margeTMur = 80;
const margeEMur = 30;
const sepMurs = 2;

const murs = []
const ESTAT_MUR = {
    DESTRUIT: 0,
    SHOW: 1
}

for(let c=0; c<columnes; c++){
    murs [c] = [];
    for (let f=0; f<filas; f++){
        let r  = Math.floor(Math.random()*3)
        const murX = margeEMur+c*(ampleMur+sepMurs)
        const murY = margeTMur+f*(alturaMur+sepMurs)
        murs  [c][f] = {
            x: murX,
            y: murY,
            status: ESTAT_MUR.SHOW,
            color: r,

        }
    }
}

let radiPilota = 12;

let x = canvas.width / 2
let y = canvas.height - 35

let dx = 4
let dy = -4

let amplePala = 90;
let alturaPala = 20;

let sensibilitat = 8;
let dreta = false;
let esquerra = false;

let palaX = (canvas.width - amplePala) / 2 ;
let palaY = canvas.height - alturaPala - 10 ;

let vidas = 3

function pintarPilota (){
    /*ctx.beginPath();
    ctx.arc(x, y, radiPilota, 0, Math.PI*2);
    ctx.fillStyle = "#FFF";
    ctx.fill ();
    ctx.closePath();
    */
    ctx.drawImage(
        ball,
        0,
        0,
        360,
        360,
        x,
        y,
        24,
        24
    )

}


function pintarPala (){
    //ctx.fillStyle = " #e53800  ";
    //ctx.fillRect (palaX, palaY,amplePala, alturaPala);
    ctx.drawImage(
        sprite,
        0,
        0,
        1012,
        289,
        palaX,
        palaY,
        amplePala,
        alturaPala
    )
}

function pintarMurs (){
    for(let c=0; c<columnes; c++){
        for (let f=0; f<filas; f++){
            const murActual = murs[c][f];
            if (murActual.status == ESTAT_MUR.DESTRUIT){
                continue;
            }
            let clipX = murActual.color * 111
            ctx.drawImage(
                mur,
                clipX,
                0,
                72,
                90,
                murActual.x,
                murActual.y,
                ampleMur,
                alturaMur
            )
            //ctx.fillStyle = murActual.color;
           // ctx.rect(murActual.x,murActual.y,ampleMur,alturaMur)
            //ctx.fill();
        }
    }
}
function deteccioColisio () {
    for(let c=0; c<columnes; c++){
        for (let f=0; f<filas; f++){
            const murActual = murs[c][f];
            if (murActual.status == ESTAT_MUR.DESTRUIT){
                continue;
            }
            
            const mateixaXMur = x > murActual.x && x < murActual.x + ampleMur
            const mataiexaYMur = y >murActual.y && y < murActual.y + alturaMur
            if (mateixaXMur && mataiexaYMur){
                dy = -dy;
                murActual.status = ESTAT_MUR.DESTRUIT
                
                var audio = document.getElementById("music");
                audio.play();
            }
        }
    }
}

function movimentPilota (){
    if(x + dx >= canvas.width || x + dx <= 0){
        dx = -dx
    }
    if(y + dy <= 0){
        dy = -dy
    }

    if( y == palaY && x >= palaX && x <= palaX+amplePala){
        dy = -dy
    }else if(y > canvas.height){
        vidas--
    
        if(vidas == 0){
            console.log("GAME OVER")
            document.location.reload();
        }
        dx = 2;
        dy = -2
        x = canvas.width / 2
        y = canvas.height - 30
    } 
    
    x += dx;
    y += dy;
}

function movimentPala (){
    if (dreta && palaX < canvas.width - amplePala){
        palaX += sensibilitat
    }else if (esquerra && palaX > 0){
        palaX -= sensibilitat
    }
}

function borrarPantalla(){
    canvas.height = 512;
    canvas.width = 448;
}

function inicialitzadorEvents (){
    document.addEventListener ('keydown', pulsar);
    document.addEventListener ('keyup', soltar);

    function soltar(event){
        if (event.key == 'ArrowRight' || event.key == 'd'){
            dreta = false;
        }
        if (event.key == 'ArrowLeft' || event.key == 'a'){
            esquerra = false;
        }
}

    function pulsar (event){
        if (event.key == 'ArrowRight' || event.key == 'd'){
            dreta = true;
        }
        if (event.key == 'ArrowLeft' || event.key == 'a'){
            esquerra = true;
        }
        if (event.key == '+'){
            amplePala = amplePala *2
        }
        if (event.key == '-'){
            amplePala = amplePala /2
        }
        if (event.key == 'r'){
            radiPilota = radiPilota *2
        }
        if (event.key == 'w'){
            radiPilota = radiPilota /2
        }
        if (event.key == '2'){
            sensibilitat = sensibilitat *2
        }
        if (event.key == '3'){
            sensibilitat = sensibilitat /2
        }
        if (event.key == '0'){
            let dx2 = dx;
            let dy2 = dy
            dx = 0;
            dy = 0;
            setTimeout (() =>{
                dx = dx2;
                dy = dy2;

            },3000)
    }
}
}

function pintarCanvas(){
    console.log("Hi");
    borrarPantalla ();
    pintarPilota ();
    pintarPala();
    pintarMurs();
    deteccioColisio();
    movimentPilota();
    movimentPala();
    ctx.fillText("Vidas: " +vidas ,12,12);
    window.requestAnimationFrame(pintarCanvas);
}
pintarCanvas();
inicialitzadorEvents();
