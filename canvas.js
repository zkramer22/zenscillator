document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementById("canvas");
  canvasEl.width = 1280;
  canvasEl.height = 720;

  const ctx = canvasEl.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1280, 720);

});
