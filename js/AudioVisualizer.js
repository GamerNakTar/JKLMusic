var canvas, ctx, center_x, center_y, radius, bars,
    x_end, y_end, bar_height, bar_width,
    frequency_array, dis_x, dis_y, dis,analyser,
    nowPlaying, firstTime, barLength;

bars = 200;
bar_width = 2;

function initPage(){
    nowPlaying = 1;
    firstTime = 1;

    // get audio from html
    audio = document.getElementById("music");

    // set to the size of device
    canvas = document.getElementById("renderer");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // find the center of the window
    center_x = canvas.width / 2 - 130;
    center_y = canvas.height / 2;

    // draw canvas
    animationLooper();

    canvas.addEventListener("mousemove", e => {
      dis_x = Math.abs(e.offsetX - center_x);
      dis_y = Math.abs(e.offsetY - center_y);
      dis = Math.sqrt(Math.pow(dis_x, 2) + Math.pow(dis_y, 2));
    });

    canvas.addEventListener("click", e => {
      if( dis <= 100 ) {
        if( firstTime == 1 ) {
          context = new (window.AudioContext || window.webkitAudioContext)();
          analyser = context.createAnalyser();
          source = context.createMediaElementSource(audio);
          source.connect(analyser);
          analyser.connect(context.destination);

          frequency_array = new Uint8Array(analyser.frequencyBinCount);

          firstTime = 0;
        }
        if( nowPlaying == 1 ) {
          nowPlaying = 0;
          audio.play();
        }
        else {
          nowPlaying = 1;
          audio.pause();
        }
      }
    });
}

function animationLooper(){
    ctx = canvas.getContext("2d");

    // style the background
    var gradient = ctx.createLinearGradient(0,0,0,canvas.height);
    gradient.addColorStop(0,"rgba(35, 7, 77, 1)");
    gradient.addColorStop(1,"rgba(204, 83, 51, 1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // draw play button
    ctx.beginPath();
    ctx.moveTo(center_x, center_y - 50);
    ctx.lineTo(center_x+ 50, center_y);
    ctx.lineTo(center_x, center_y + 50)
    ctx.closePath();
    ctx.fillStyle = "#ff0000";
    ctx.fill();

    //draw a circle
    if( dis > 100 ) {
      radius = 100;
      barLength = 0.3;
    }
    else {
      radius = 110;
      barLength = 0.5;
    }

    ctx.beginPath();
    ctx.arc(center_x,center_y,radius,0,2*Math.PI);
    ctx.stroke();

    // draw visualizer
    if(analyser !== undefined ){
      analyser.getByteFrequencyData(frequency_array);
      for(var i = 0; i < bars; i++){

          //divide a circle into equal parts
          rads = Math.PI * 2 / bars;

          bar_height = frequency_array[i]*barLength;

          // set coordinates
          x = center_x + Math.cos(rads * i) * (radius);
  	      y = center_y + Math.sin(rads * i) * (radius);
          x_end = center_x + Math.cos(rads * i)*(radius + bar_height);
          y_end = center_y + Math.sin(rads * i)*(radius + bar_height);

          //draw a bar
          drawBar(x, y, x_end, y_end, bar_width,frequency_array[i]);
      }
    }
    window.requestAnimationFrame(animationLooper);
}

// for drawing a bar
function drawBar(x1, y1, x2, y2, width,frequency){
    var lineColor = "rgb(" + 255 + ", " + 255 + ", " + 255 + ")";

    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}
