document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // 通常AR処理
  // =========================

  const targets = document.querySelectorAll(".ar-target");
  const arCharacters = document.querySelectorAll(".ar-character");

  const findGuide = document.querySelector("#find-guide");
  const screenshotGuide = document.querySelector("#screenshot-guide");
  const endButton = document.querySelector("#end-button");


  // 各マーカー
  targets.forEach((target) => {

    target.addEventListener("targetFound", () => {
      console.log(`マーカーを見つけました：${target.id}`);
    });

    target.addEventListener("targetLost", () => {
      console.log(`マーカーを見失いました：${target.id}`);
    });

  });


  // ARキャラクタータップ
  arCharacters.forEach((character) => {

    character.addEventListener("click", () => {

      console.log(
        `ARキャラクターがタップされました：${character.id}`
      );

      findGuide.hidden = true;
      screenshotGuide.hidden = false;

    });

  });


  // つぎへ
  endButton.addEventListener("click", () => {
    window.location.href = "end.html";
  });



  // =========================================
  // DEBUG MODE
  // ar.html?debug=true で有効
  // =========================================

  const params = new URLSearchParams(window.location.search);
  const debugMode = params.get("debug") === "true";

  if (!debugMode) {
    return;
  }


  console.log("AR DEBUG MODE ON");


  // =========================
  // UI取得
  // =========================

  const debugPanel =
    document.querySelector("#ar-debug-panel");

  const targetSelect =
    document.querySelector("#debug-target-select");

  const markerFile =
    document.querySelector("#debug-marker-file");

  const preview =
    document.querySelector("#debug-preview");

  const markerImage =
    document.querySelector("#debug-marker-image");

  const previewCharacter =
    document.querySelector("#debug-character-image");


  const inputX =
    document.querySelector("#debug-x");

  const inputY =
    document.querySelector("#debug-y");

  const inputZ =
    document.querySelector("#debug-z");

  const inputWidth =
    document.querySelector("#debug-width");

  const inputHeight =
    document.querySelector("#debug-height");

  const inputRotation =
    document.querySelector("#debug-rotation");

  const flipX =
    document.querySelector("#debug-flip-x");

  const flipY =
    document.querySelector("#debug-flip-y");


  const output =
    document.querySelector("#debug-output");


  debugPanel.style.display = "block";


  // 通常UIはデバッグ中は隠す
  findGuide.style.display = "none";
  screenshotGuide.style.display = "none";
  endButton.style.display = "none";



  // =========================
  // AR対象一覧
  // =========================

  const debugTargets = {

    slide: {
      character: "#ar-character-slide",
      asset: "#ar-slide"
    },

    flower: {
      character: "#ar-character-flower",
      asset: "#ar-flower"
    },

    table: {
      character: "#ar-character-table",
      asset: "#ar-table"
    },

    water: {
      character: "#ar-character-water",
      asset: "#ar-water"
    },

    horse: {
      character: "#ar-character-horse",
      asset: "#ar-horse"
    }

  };


  let currentCharacter = null;

  // ターゲットごとのマーカー画像を保存
  const markerSources = {};



  // =========================
  // 現在のAR値を読み込む
  // =========================

  function loadTarget() {

    const key = targetSelect.value;
    const config = debugTargets[key];

    currentCharacter =
      document.querySelector(config.character);

    const asset =
      document.querySelector(config.asset);


    // AR PNGをプレビューへ
    previewCharacter.src = asset.src;


    // 現在の値取得
    const position =
      currentCharacter.getAttribute("position");

    const rotation =
      currentCharacter.getAttribute("rotation");

    const scale =
      currentCharacter.getAttribute("scale");


    inputX.value = position.x;
    inputY.value = position.y;
    inputZ.value = position.z;

    inputWidth.value =
      parseFloat(
        currentCharacter.getAttribute("width")
      );

    inputHeight.value =
      parseFloat(
        currentCharacter.getAttribute("height")
      );

    inputRotation.value = rotation.z;


    flipX.checked =
      scale.x < 0;

    flipY.checked =
      scale.y < 0;


    // 登録済みマーカーがあれば表示
    if (markerSources[key]) {
      markerImage.src =
        markerSources[key];
    } else {
      markerImage.removeAttribute("src");
    }


    updateAll();

  }



  // =========================
  // スライダー → ARへ反映
  // =========================

  function updateAll() {

    if (!currentCharacter) return;


    const x =
      parseFloat(inputX.value);

    const y =
      parseFloat(inputY.value);

    const z =
      parseFloat(inputZ.value);

    const width =
      parseFloat(inputWidth.value);

    const height =
      parseFloat(inputHeight.value);

    const rotation =
      parseFloat(inputRotation.value);


    const scaleX =
      flipX.checked ? -1 : 1;

    const scaleY =
      flipY.checked ? -1 : 1;


    // =========================
    // 本物のA-Frameへ反映
    // =========================

    currentCharacter.setAttribute(
      "position",
      `${x} ${y} ${z}`
    );

    currentCharacter.setAttribute(
      "width",
      width
    );

    currentCharacter.setAttribute(
      "height",
      height
    );

    currentCharacter.setAttribute(
      "rotation",
      `0 0 ${rotation}`
    );

    currentCharacter.setAttribute(
      "scale",
      `${scaleX} ${scaleY} 1`
    );



    // =========================
    // 2Dプレビューへ反映
    // =========================

    updatePreview(
      x,
      y,
      width,
      height,
      rotation,
      scaleX,
      scaleY
    );


    // =========================
    // 数値表示
    // =========================

    document.querySelector(
      "#debug-x-value"
    ).textContent = x.toFixed(2);

    document.querySelector(
      "#debug-y-value"
    ).textContent = y.toFixed(2);

    document.querySelector(
      "#debug-z-value"
    ).textContent = z.toFixed(2);

    document.querySelector(
      "#debug-width-value"
    ).textContent = width.toFixed(2);

    document.querySelector(
      "#debug-height-value"
    ).textContent = height.toFixed(2);

    document.querySelector(
      "#debug-rotation-value"
    ).textContent =
      `${rotation}°`;


    // =========================
    // コピペ用コード
    // =========================

    output.textContent =
      `position="${x} ${y} ${z}" ` +
      `rotation="0 0 ${rotation}" ` +
      `scale="${scaleX} ${scaleY} 1" ` +
      `width="${width}" ` +
      `height="${height}"`;

  }



  // =========================
  // 2Dプレビュー計算
  // =========================

  function updatePreview(
    x,
    y,
    width,
    height,
    rotation,
    scaleX,
    scaleY
  ) {

    const previewWidth =
      preview.clientWidth;

    const previewHeight =
      preview.clientHeight;


    if (
      previewWidth === 0 ||
      previewHeight === 0
    ) {
      return;
    }


    /*
      MindARではターゲット横幅を
      おおむね1単位として扱うため、

      x = 0.5
      → マーカー横幅の半分移動

      としてプレビュー。
    */

    const centerX =
      previewWidth / 2;

    const centerY =
      previewHeight / 2;


    const pixelX =
      centerX +
      (x * previewWidth);

    const pixelY =
      centerY -
      (y * previewWidth);


    const pixelWidth =
      width * previewWidth;

    const pixelHeight =
      height * previewWidth;


    previewCharacter.style.left =
      `${pixelX}px`;

    previewCharacter.style.top =
      `${pixelY}px`;

    previewCharacter.style.width =
      `${pixelWidth}px`;

    previewCharacter.style.height =
      `${pixelHeight}px`;

    previewCharacter.style.transform =
      `
      translate(-50%, -50%)
      rotate(${-rotation}deg)
      scale(${scaleX}, ${scaleY})
      `;

  }



  // =========================
  // マーカー画像読み込み
  // =========================

  markerFile.addEventListener(
    "change",
    (event) => {

      const file =
        event.target.files[0];

      if (!file) return;


      const url =
        URL.createObjectURL(file);

      const key =
        targetSelect.value;

      markerSources[key] =
        url;

      markerImage.src =
        url;

    }
  );



  // マーカー画像比率をプレビューへ反映
  markerImage.addEventListener(
    "load",
    () => {

      const ratio =
        markerImage.naturalWidth /
        markerImage.naturalHeight;

      preview.style.aspectRatio =
        ratio;

      updateAll();

    }
  );



  // =========================
  // UIイベント
  // =========================

  targetSelect.addEventListener(
    "change",
    loadTarget
  );


  [
    inputX,
    inputY,
    inputZ,
    inputWidth,
    inputHeight,
    inputRotation
  ].forEach((input) => {

    input.addEventListener(
      "input",
      updateAll
    );

  });


  flipX.addEventListener(
    "change",
    updateAll
  );

  flipY.addEventListener(
    "change",
    updateAll
  );


  window.addEventListener(
    "resize",
    updateAll
  );


  // 最初のターゲット
  loadTarget();

});