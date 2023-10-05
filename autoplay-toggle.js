// NAME: Autoplay toggle
// AUTHOR: Marcell-Puskas
// DESCRIPTION: Toggle Autoplay at the end of an album

(function autoplaytoggle () {
  const { Platform } = Spicetify;
  if (!Platform) {
    setTimeout(autoplaytoggle, 300);
    return;
  }

    let isEnabled = Spicetify.LocalStorage.get("NeverAutoplay") === "1";

    const playingWidgetContainer = document.querySelector(
        '[class*="player-controls__right"]'
      );
    
    if (!playingWidgetContainer) return;

    playingWidgetContainer.insertAdjacentHTML(
      "beforeend", `
        <button class="autoplayButton-button" role="checkbox" aria-checked="false" aria-label="enable/disable autoplay" style="--button-size:32px;">
          <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 Svg-img-16-icon" fill="currentcolor">
            ${Spicetify.SVGIcons["enhance"]} <!--${Spicetify.SVGIcons["spotify"]}-->
          </svg>
        </button>
        `);

    const toggle_button = document.querySelector('[class="autoplayButton-button"]');

    function updatecolors() {
      if (isEnabled) {
        toggle_button.style.setProperty("--autoplay-button", "var(--spice-button)");
        toggle_button.style.setProperty("--autoplay-button-active", "var(--spice-button-active)");
      }
      else {
        toggle_button.style.setProperty("--autoplay-button", "rgba(var(--spice-rgb-selected-row),.7)");
        toggle_button.style.setProperty("--autoplay-button-active", "var(--spice-text)");
      }
    }

    updatecolors();

    toggle_button.addEventListener("click", () => {
      isEnabled = !isEnabled;
      Spicetify.showNotification("Autoplay is " + (isEnabled ? "Enabled" : "Disabled"));
      Spicetify.LocalStorage.set("NeverAutoplay", isEnabled ? "1" : "0");
      updatecolors();
    });

    function styleSettings() {
      let style = document.createElement("style");
      style.innerHTML = `
          .autoplayButton-button {
            user-select: none;
            box-sizing: border-box;
            touch-action: manipulation;
            padding: 0;
            font-family: CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif),sans-serif;
            align-items: center;
            background: transparent;
            border: none;
            color: var(--autoplay-button);
            display: flex;
            height: var(--button-size);
            justify-content: center;
            min-width: var(--button-size);
            position: relative;
            width: var(--button-size);
            cursor: pointer !important;
          } 

          .autoplayButton-button:hover {
            color: var(--autoplay-button-active);
          }
          `;
      playingWidgetContainer.appendChild(style);
    }

    styleSettings();

    Spicetify.Player.addEventListener("songchange", () => {
      if (isEnabled) return;
      const data = Spicetify.Player.data || Spicetify.Queue;
      if (!data) return;

      if (data.track.provider === "autoplay") {
        Spicetify.Player.pause();
      }
    });

})();
