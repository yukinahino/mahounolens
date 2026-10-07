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

  // =========================================
  // キャラクターごとの画面表示設定
  // =========================================
  const characterDisplaySettings = {

    horse: {
      x: 68,
      y: 64,
      width: 44,
      rotation: 4,
      flipX: false,
      flipY: false
    },

    water: {
      x: 73,
      y: 66,
      width: 33,
      rotation: -35,
      flipX: false,
      flipY: false
    }

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

    const setting =
      characterDisplaySettings[characterName];

    if (setting) {

      overlayCharacter.style.left =
        `${setting.x}%`;

      overlayCharacter.style.top =
        `${setting.y}%`;

      overlayCharacter.style.width =
        `${setting.width}vw`;

      const scaleX =
        setting.flipX ? -1 : 1;

      const scaleY =
        setting.flipY ? -1 : 1;

      overlayCharacter.style.transform =
        `translate(-50%, -50%)
     rotate(${setting.rotation}deg)
     scale(${scaleX}, ${scaleY})`;
    }

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
// =========================================

const params =
  new URLSearchParams(window.location.search);

const debugMode =
  params.get("debug") === "true";


if (debugMode) {

  console.log(
    "DEBUG MODE ON：実際のARキャラクターを直接調整"
  );


  // =========================================
  // パネル
  // =========================================

  const debugPanel =
    document.querySelector("#ar-debug-panel");

  if (debugPanel) {
    debugPanel.style.display = "block";
  }


  // =========================================
  // DEBUG中は通常UIを隠す
  // =========================================

  screenshotGuide.hidden = true;
  nextBookButton.hidden = true;


  // =========================================
  // 実際のAR表示領域をON
  // =========================================

  overlay.hidden = false;

  // マーカー認識による切替を防ぐ
  characterActive = true;


  // =========================================
  // UI取得
  // =========================================

  const targetSelect =
    document.querySelector("#debug-target-select");

  const xSlider =
    document.querySelector("#debug-x");

  const ySlider =
    document.querySelector("#debug-y");

  const widthSlider =
    document.querySelector("#debug-width");

  const rotationSlider =
    document.querySelector("#debug-rotation");

  const flipXCheckbox =
    document.querySelector("#debug-flip-x");

  const flipYCheckbox =
    document.querySelector("#debug-flip-y");


  const xValue =
    document.querySelector("#debug-x-value");

  const yValue =
    document.querySelector("#debug-y-value");

  const widthValue =
    document.querySelector("#debug-width-value");

  const rotationValue =
    document.querySelector("#debug-rotation-value");

  const debugOutput =
    document.querySelector("#debug-output");


  // =========================================
  // 実際のARキャラクターへ反映
  // =========================================

  function applyDebugSetting() {

    const key =
      targetSelect.value;

    const asset =
      characterAssets[key];

    const setting =
      characterDisplaySettings[key];

    if (!asset || !setting) {
      return;
    }


    // 本番と同じ画像
    overlayCharacter.src =
      asset.getAttribute("src");


    // 本番ARそのものを移動
    overlayCharacter.style.left =
      `${setting.x}%`;

    overlayCharacter.style.top =
      `${setting.y}%`;

    overlayCharacter.style.width =
      `${setting.width}vw`;

    overlayCharacter.style.maxWidth =
      "none";


    const scaleX =
      setting.flipX ? -1 : 1;

    const scaleY =
      setting.flipY ? -1 : 1;


    overlayCharacter.style.transform =
      `translate(-50%, -50%)
       rotate(${setting.rotation}deg)
       scale(${scaleX}, ${scaleY})`;


    // UIへ現在値を反映
    xSlider.value =
      setting.x;

    ySlider.value =
      setting.y;

    widthSlider.value =
      setting.width;

    rotationSlider.value =
      setting.rotation;

    flipXCheckbox.checked =
      setting.flipX;

    flipYCheckbox.checked =
      setting.flipY;


    updateDebugValues();

  }


  // =========================================
  // 数値表示
  // =========================================

  function updateDebugValues() {

    const key =
      targetSelect.value;

    const setting =
      characterDisplaySettings[key];

    if (!setting) {
      return;
    }


    xValue.textContent =
      `${setting.x}%`;

    yValue.textContent =
      `${setting.y}%`;

    widthValue.textContent =
      `${setting.width}vw`;

    rotationValue.textContent =
      `${setting.rotation}°`;


    debugOutput.innerHTML =
      `
      <strong>${key}</strong><br>
      x: ${setting.x},<br>
      y: ${setting.y},<br>
      width: ${setting.width},<br>
      rotation: ${setting.rotation},<br>
      flipX: ${setting.flipX},<br>
      flipY: ${setting.flipY}
      `;

  }


  // =========================================
  // スライダー操作
  // =========================================

  function updateSettingFromControls() {

    const key =
      targetSelect.value;

    const setting =
      characterDisplaySettings[key];

    if (!setting) {
      return;
    }


    setting.x =
      Number(xSlider.value);

    setting.y =
      Number(ySlider.value);

    setting.width =
      Number(widthSlider.value);

    setting.rotation =
      Number(rotationSlider.value);

    setting.flipX =
      flipXCheckbox.checked;

    setting.flipY =
      flipYCheckbox.checked;


    // 実際のARへ即反映
    applyDebugSetting();

  }


  // =========================================
  // キャラクター切替
  // =========================================

  targetSelect.addEventListener(
    "change",
    applyDebugSetting
  );


  // =========================================
  // スライダー
  // =========================================

  [
    xSlider,
    ySlider,
    widthSlider,
    rotationSlider

  ].forEach((control) => {

    control.addEventListener(
      "input",
      updateSettingFromControls
    );

  });


  // =========================================
  // 反転
  // =========================================

  flipXCheckbox.addEventListener(
    "change",
    updateSettingFromControls
  );

  flipYCheckbox.addEventListener(
    "change",
    updateSettingFromControls
  );


  // =========================================
  // 初期表示
  // =========================================

  applyDebugSetting();

}

// DOMContentLoaded 終了
});