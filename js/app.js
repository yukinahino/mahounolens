document.addEventListener("DOMContentLoaded", () => {

  // 5つのターゲットをまとめて取得
  const targets = document.querySelectorAll(".ar-target");

  // 5つのARキャラクターをまとめて取得
  const arCharacters = document.querySelectorAll(".ar-character");

  const findGuide = document.querySelector("#find-guide");
  const screenshotGuide = document.querySelector("#screenshot-guide");
  const endButton = document.querySelector("#end-button");


  // 各マーカーの認識イベント
  targets.forEach((target) => {

    target.addEventListener("targetFound", () => {
      console.log(`マーカーを見つけました：${target.id}`);
    });

    target.addEventListener("targetLost", () => {
      console.log(`マーカーを見失いました：${target.id}`);
    });

  });


  // 各ARキャラクターのタップイベント
  arCharacters.forEach((character) => {

    character.addEventListener("click", () => {

      console.log(`ARキャラクターがタップされました：${character.id}`);

      // 最初の案内を消す
      findGuide.hidden = true;

      // スクショ案内を表示
      screenshotGuide.hidden = false;

    });

  });


  // 「つぎへ」ボタン
  endButton.addEventListener("click", () => {
    window.location.href = "end.html";
  });

});