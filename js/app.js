document.addEventListener("DOMContentLoaded", () => {

  const target = document.querySelector("#target");
  const arCharacter = document.querySelector("#ar-character");
  const screenshotGuide = document.querySelector("#screenshot-guide");
  const endButton = document.querySelector("#end-button");

  // マーカーを認識したとき
  target.addEventListener("targetFound", () => {
    console.log("マーカーを見つけました！");
  });

  // マーカーを見失ったとき
  target.addEventListener("targetLost", () => {
    console.log("マーカーを見失いました");
  });

  // ARキャラクターをタップしたとき
  arCharacter.addEventListener("click", () => {
    console.log("ARキャラクターがタップされました");

    arCharacter.setAttribute("src", "#character-slide");

    screenshotGuide.hidden = false;
  });

  // 次へ
  endButton.addEventListener("click", () => {
    window.location.href = "end.html";
  });

});