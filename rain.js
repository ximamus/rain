const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d', { willReadFrequently: true });

let qnty = 100;
const raindrops = [];
let water = 0;
let waterLevel = 150;
let isFlushing = false;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function initRaindrops() {
    for (let i = 0; i < qnty; i++) {
        const raindrop = {
            x: 0,
            y: 0,
            length: 0,
            spray: {
                x: 0,
                count: 0,
                lifetime: 0
            }
        };
        raindrop.x = Math.floor(Math.random() * cvs.width);
        raindrop.y = Math.floor(Math.random() * cvs.height);
        raindrop.length = getRandomInt(1, 5);
        raindrops.push(raindrop);
    }
}

function moreRain() {
    qnty += 100;
    initRaindrops();
}

function flushing() {
    isFlushing = true;
}

function moveRaindrops(raindrop) {
    // if (raindrop.y + raindrop.length > waterLevel) {
    // //if (raindrop.y > cvs.height) {
    //     raindrop.spray = null;
    // }
    raindrop.y += Math.floor(Math.random() * (5 - 2) + 2);
    if (raindrop.y > waterLevel && raindrop.spray.lifetime == 0) {
        raindrop.spray = {
            x: raindrop.x,
            count: getRandomInt(1, raindrop.length),
            lifetime: 5
        };
    }
    if (raindrop.y + raindrop.length > cvs.height + raindrop.length) {
        water += raindrop.length;
        if (water > cvs.width * 5) {
            waterLevel -= 1;
            water = 0;
        }
        raindrop.x = Math.floor(Math.random() * cvs.width);
        raindrop.y = 0;
        raindrop.length = getRandomInt(1, 5);
        raindrop.spray.lifetime--;
        //raindrop.spray = null;
    }
}

function render() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    //ctx.fillStyle = 'white';
    //let id = ctx.getImageData(0, 0, cvs.width, cvs.height);
    //let pixels = id.data;

    for (let i = 0; i < raindrops.length; i++) {
        ctx.fillStyle = 'white';
        for (let j = 0; j <= raindrops[i].length; j++) {
            let alpha = 1 - j / raindrops[i].length;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(raindrops[i].x, raindrops[i].y - j, 1, 1);
        }
        if (raindrops[i].spray.lifetime != 0) {
            ctx.fillStyle = 'white';
            for (let k = 1; k <= raindrops[i].spray.count; k++) {
                let x = raindrops[i].spray.x + getRandomInt(-3, 3);
                let y = waterLevel - getRandomInt(1, raindrops[i].length);
                ctx.fillRect(x, y, 1, 1);
            }
            raindrops[i].spray.lifetime--;
        }
        moveRaindrops(raindrops[i]);
    }

    ctx.fillStyle = '#74ccf4';
    for (let i = 150; i >= waterLevel; i--) {
        for (let j = 0; j <= cvs.width; j++) {
            ctx.fillRect(j, i, 1, 1);
        }
    }
    if (isFlushing) {
        waterLevel++;
        if (waterLevel == 150) {
            isFlushing = false;
        }
    }
    //ctx.putImageData(id, 0, 0);
}

const run = setInterval(render, 30);