const app = () => {
  let canvas = document.querySelector("#myCanvas");
  console.log("app");
  console.log(canvas);
  let dpr = window.devicePixelRatio;

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.maxWidth = window.innerWidth + "px";
  canvas.style.maxHeight = window.innerHeight + "px";

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.maxWidth = window.innerWidth + "px";
    canvas.style.maxHeight = window.innerHeight + "px";
  });

  const cw = canvas.width;
  const ch = canvas.height;
  const cw2 = cw / 2;
  const ch2 = ch / 2;

  let ctx = canvas.getContext("2d");
  console.log(ctx);

  let mouseX = cw2;
  let mouseY = ch2;
  let color = "gray";
  let xdiff, ydiff;

  window.addEventListener("mousemove", (e) => {
    xdiff = mouseX - e.x * dpr;
    ydiff = mouseY - e.y * dpr;
    mouseX = e.x * dpr;
    mouseY = e.y * dpr;
  });
  window.addEventListener("touchmove", (e) => {
    console.log(e.targetTouches[0].pageX);
    console.log(e.targetTouches[0].pageY);
    xdiff = mouseX - e.targetTouches[0].pageX * dpr;
    ydiff = mouseY - e.targetTouches[0].pageY * dpr;
    console.log("xdiff : " + xdiff + " ydiff : " + ydiff);
    mouseX = e.targetTouches[0].pageX * dpr;
    mouseY = e.targetTouches[0].pageY * dpr;
    e.preventDefault();
  });

  let val = 0;
  let noise = new SimplexNoise();

  function changeColor() {
    color =
      "rgb(" +
      Math.random() * 255 +
      "," +
      Math.random() * 255 +
      "," +
      Math.random() * 255 +
      ")";
  }

  function update() {
    requestAnimationFrame(update);
    ctx.save();
    ctx.translate(mouseX, mouseY);
    ctx.beginPath();
    ctx.strokeStyle = color;
    let n = 0;
    let steps = 10000;
    let scale = 0 + val;
    let radius = Math.cos(val) * 150 - val * 10;
    n = noise.noise3D(val, Math.cos(0), Math.sin(0)) * scale;
    //ctx.moveTo(Math.cos(0) * radius + n, Math.sin(0) * (radius + n));
    for (let x = 0; x < steps; x++) {
      n =
        noise.noise3D(
          val,
          Math.cos(Math.PI * 2 * (x / steps)),
          Math.sin(Math.PI * 2 * (x / steps))
        ) * scale;
      ctx.lineTo(
        Math.cos(Math.PI * 2 * (x / steps)) * (radius + n),
        Math.sin(Math.PI * 2 * (x / steps)) * (radius + n)
      );
    }
    n = noise.noise3D(val, Math.cos(0), Math.sin(0)) * scale;
    ctx.lineTo(Math.cos(0) * radius + n, Math.sin(0) * (radius + n));
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
    val += 0.02;
    if (val > 70) {
      color = "gray";
      scale = 0;
      val = 0;
    }
  }

  document.addEventListener("click", () => {
    changeColor();
  });

  requestAnimationFrame(update);
};

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click",start);
  function start() {
    console.log("start");
    document.removeEventListener("click",start);
    app();
  }
  
});

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Enter") {
      console.log("event");
      toggleFullScreen();
    }
  },
  false
);
