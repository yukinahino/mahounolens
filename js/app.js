document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // 通常AR処理
  // 新仕様：
  // リーフレットのマーカーを認識
  // → 対応するARキャラクターを画面固定表示
  // → マーカーを外しても表示を維持
  // → 「つぎの えほんを さがす」でOFF
  // =========================================

  const targets = document.querySelectorAll(".ar-target");

  const overlay = document.querySelector("#ar-overlay");
  const overlayCharacter = document.querySelector("#overlay-character");
  const screenshotGuide = document.querySelector("#screenshot-guide");
  const nextBookButton = document.querySelector("#next-book-button");

  // ar.html の <a-assets> をそのまま参照
  const characterAssets = {
    slide: document.querySelector("#ar-slide"),
    flower: document.querySelector("#ar-flower"),
    horse: document.querySelector("#ar-horse"),
    water: document.querySelector("#ar-water")
  };

  let characterActive = false;
  let currentCharacter = null;


  // =========================================
  // ARキャラクター表示
  // =========================================

  function showCharacter(characterName) {

    const asset = characterAssets[characterName];

    if (!asset) {
      console.warn(
        `AR画像が見つかりません：${characterName}`
      );
      return;
    }

    // <a-assets> 内の画像パスを画面固定用 img に渡す
    overlayCharacter.src =
      asset.getAttribute("src");

    overlay.hidden = false;
    screenshotGuide.hidden = false;
    nextBookButton.hidden = false;

    characterActive = true;
    currentCharacter = characterName;

    console.log(
      `ARキャラクター表示：${characterName}`
    );
  }


  // =========================================
  // ARキャラクター非表示
  // =========================================

  function hideCharacter() {

    overlay.hidden = true;
    screenshotGuide.hidden = true;
    nextBookButton.hidden = true;

    overlayCharacter.removeAttribute("src");

    characterActive = false;
    currentCharacter = null;

    console.log(
      "ARキャラクターをOFF：次のマーカーを待機"
    );
  }


  // =========================================
  // MindAR ターゲットイベント
  // =========================================

  targets.forEach((target) => {

    target.addEventListener(
      "targetFound",
      () => {

        const characterName =
          target.dataset.character;

        console.log(
          `マーカーを見つけました：${target.id} / ${characterName}`
        );

        // すでにキャラクター表示中なら、
        // 別マーカーを認識しても切り替えない
        if (characterActive) {
          return;
        }

        showCharacter(characterName);
      }
    );


    // 新仕様では targetLost してもARを消さない
    target.addEventListener(
      "targetLost",
      () => {

        console.log(
          `マーカーを見失いました：${target.id}`
        );

        // 何もしない
        // → リーフレットからスマホを外しても
        //   ARキャラクターを画面に残す
      }
    );

  });


  // =========================================
  // 「つぎの えほんを さがす」
  // =========================================

  nextBookButton.addEventListener(
    "click",
    () => {

      hideCharacter();

    }
  );


  // =========================================
  // DEBUG MODE
  // ar.html?debug=true
  //
  // 旧A-Frame配置調整パネルは、
  // 今回「画面固定オーバーレイ方式」に変更したため
  // A-Frame座標調整には使用しない。
  //
  // 提出用コードでは通常非表示のままにする。
  // =========================================

  const params =
    new URLSearchParams(window.location.search);

  const debugMode =
    params.get("debug") === "true";

  if (debugMode) {

    const debugPanel =
      document.querySelector("#ar-debug-panel");

    if (debugPanel) {
      debugPanel.style.display = "block";
    }

    console.log(
      "DEBUG MODE ON：現在は画面固定AR方式です"
    );

    // デバッグ中にターゲット選択で
    // 各AR画像を簡易プレビューできるようにする
    const targetSelect =
      document.querySelector("#debug-target-select");

    const previewCharacter =
      document.querySelector("#debug-character-image");

    const markerFile =
      document.querySelector("#debug-marker-file");

    const markerImage =
      document.querySelector("#debug-marker-image");

    const preview =
      document.querySelector("#debug-preview");


    function updateDebugCharacter() {

      if (!targetSelect || !previewCharacter) {
        return;
      }

      const key =
        targetSelect.value;

      const asset =
        characterAssets[key];

      if (!asset) {
        return;
      }

      previewCharacter.src =
        asset.getAttribute("src");

      previewCharacter.style.left = "50%";
      previewCharacter.style.top = "50%";
      previewCharacter.style.width = "45%";
      previewCharacter.style.height = "auto";
      previewCharacter.style.transform =
        "translate(-50%, -50%)";
    }


    if (targetSelect) {

      targetSelect.addEventListener(
        "change",
        updateDebugCharacter
      );

      updateDebugCharacter();
    }


    if (markerFile && markerImage) {

      markerFile.addEventListener(
        "change",
        (event) => {

          const file =
            event.target.files[0];

          if (!file) {
            return;
          }

          const url =
            URL.createObjectURL(file);

          markerImage.src = url;
        }
      );


      markerImage.addEventListener(
        "load",
        () => {

          if (!preview) {
            return;
          }

          const ratio =
            markerImage.naturalWidth /
            markerImage.naturalHeight;

          preview.style.aspectRatio =
            ratio;
        }
      );
    }

  }

});