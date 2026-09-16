document.addEventListener("DOMContentLoaded", () => {

    const target = document.querySelector("#target");
  
    // マーカーを認識したとき
    target.addEventListener("targetFound", () => {
      console.log("マーカーを見つけました！");
    });
  
    // マーカーを見失ったとき
    target.addEventListener("targetLost", () => {
      console.log("マーカーを見失いました");
    });
  
  });