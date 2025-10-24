// This file contains functions related to easter egg tracking on the homepage

/**
 * EasterEggChecklist class manages the Easter Egg checklist UI and logic.
 *
 * It tracks the completion status of various Easter Eggs and updates the UI accordingly.
 * It also provides functionality to reveal all Easter Eggs as a cheat option.
 */
class EasterEggChecklist {
  /**
   * Constructor initializes the Easter Egg checklist with predefined eggs.
   * Each egg has a UI key, name, criteria for completion, and a completed status.
   * The constructor also sets an initialised flag to false to track if the UI has been updated.
   */
  constructor() {
    this.eggList = {
      openChecklist: {
        uiKey: "open-checklist",
        name: "Open the Easter Egg Checklist!",
        criteria: "Click on the AeroGIS logo.",
        completed: true,
      },
      invertColours: {
        uiKey: "invert-colours",
        name: "Invert the colours of the AeroGIS regions",
        criteria: "Click on the 'A' feature.",
        completed: false,
      },
      enableEditing: {
        uiKey: "enable-editing",
        name: "Enable map editing controls",
        criteria: "Click on the 'E' feature.",
        completed: false,
      },
      rIsForRed: {
        uiKey: "r-is-for-red",
        name: "R is for Red",
        criteria: "Right-click on the 'R' feature.",
        completed: false,
      },
      putMeDown: {
        uiKey: "put-me-down",
        name: "Put Me Down!!",
        criteria: "Move any geometry feature.",
        completed: false,
      },
      itsAlive: {
        uiKey: "its-alive",
        name: "It's Alive!",
        criteria: "Add a new geometry feature.",
        completed: false,
      },
      snapCracklePop: {
        uiKey: "snap-crackle-pop",
        name: "Snap, Crackle, Pop!",
        criteria: "Remove the 'S' feature by double-clicking.",
        completed: false,
      },
    };
    this.initialised = false;
  }

  /**
   * Creates the Easter Egg checklist UI and appends it to the map container grid.
   *
   * Each checkbox reflects the completion status of the corresponding Easter Egg.
   * The checklist also includes a button to reveal all Easter Eggs as a cheat option.
   */
  createUIChecklist() {
    const mapContainerGrid = document.getElementById("map-container-grid");

    // Create checklist element
    // This is to track Easter Egg completions
    const checklistDiv = document.createElement("div");
    checklistDiv.id = "easter-egg-checklist";

    mapContainerGrid.appendChild(checklistDiv);

    // Each checkbox has an onclick="return false" to prevent user interaction
    // without disabling the checkbox
    const checklistHTML = `
            <h3>Easter Egg Checklist <span class="material-icons">egg</span></h3>
            <form id="checklist-form">
                ${Object.values(this.eggList)
                  .map(
                    (egg) => `
                    <label>
                        <input type="checkbox" name="${egg.uiKey}" ${egg.completed ? "checked" : ""} onclick="return false" />
                        ${egg.completed ? `${egg.name} - <em>${egg.criteria}</em>` : `?`}
                    </label>
                `,
                  )
                  .join("")}
            </form>
            <div class="centred-content">
                <button id="spoiler-button" title="Reveal All Easter Eggs">Reveal All Easter Eggs (Cheat!)</button>
            </div>
        `;

    checklistDiv.innerHTML = checklistHTML;
    this.attachSpoilerButtonListener();
    this.initialised = true;
  }

  /**
   * Updates the UI for a specific Easter Egg in the checklist.
   *
   * @param {string} eggKey - The key of which Easter Egg to update.
   */
  updateChecklistUI(eggKey) {
    const egg = this.eggList[eggKey];

    if (!egg) return;

    const checkbox = document.querySelector(
      `#checklist-form input[name="${egg.uiKey}"]`,
    );

    if (checkbox) {
      checkbox.checked = egg.completed;
      if (egg.completed) {
        checkbox.parentElement.innerHTML = `
                    <input type="checkbox" name="${egg.uiKey}" checked onclick="return false" />
                    ${egg.name} - <em>${egg.criteria}</em>
                `;
      }
    }
  }

  /**
   * Marks an Easter Egg as completed and updates the UI.
   *
   * @param {string} eggKey - The key of the Easter Egg to mark as completed.
   */
  markEggAsCompleted(eggKey) {
    const egg = this.eggList[eggKey];
    if (egg && !egg.completed) {
      egg.completed = true;
      this.updateChecklistUI(eggKey);

      Toastify({
        text: `Easter Egg Found: ${egg.name}! 🥚`,
        duration: 3000,
      }).showToast();

      this.checkEasterEggCompletion();
    }
  }

  /**
   * Checks if all Easter Eggs have been completed and shows a congratulatory message.
   *
   * If cheat mode is activated, a different message is shown.
   * @param {boolean} cheat - Whether the cheat mode is activated.
   */
  checkEasterEggCompletion(cheat = false) {
    const message = cheat
      ? "Cheater! You've revealed all Easter Eggs. You're no fun :("
      : "Congratulations! You've found all the Easter Eggs! 🎉";

    const allCompleted = Object.values(this.eggList).every(
      (egg) => egg.completed,
    );
    if (allCompleted) {
      Toastify({
        text: message,
        duration: 5000,
        close: true,
        gravity: "bottom",
        position: "center",
        backgroundColor: cheat ? "#FF0000" : "",
      }).showToast();

      if (!cheat) {
        import("./confettiFireworks.js").then(({ confettiFireworks }) => {
          confettiFireworks();
        });
      }

      // Remove the spoiler button
      const spoilerButton = document.getElementById("spoiler-button");
      if (spoilerButton) {
        spoilerButton.remove();
      }
    }
  }

  /**
   * Reveals all Easter Eggs by marking them as completed and updating the UI.
   */
  revealAllEasterEggs() {
    Object.keys(this.eggList).forEach((eggKey) => {
      this.eggList[eggKey].completed = true;
      this.updateChecklistUI(eggKey);
    });

    this.checkEasterEggCompletion(true);
  }

  /**
   * Attaches a click listener to the spoiler button to reveal all Easter Eggs.
   */
  attachSpoilerButtonListener() {
    const spoilerButton = document.getElementById("spoiler-button");
    if (spoilerButton) {
      spoilerButton.addEventListener("click", () => {
        this.revealAllEasterEggs();
      });
    }
  }
}

export default EasterEggChecklist;
