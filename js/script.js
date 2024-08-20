//* Récupérer tous les élments dont on aura besoin
const GAMER_CARDS = document.querySelectorAll(".cards img");
const ROBOT_CARD = document.querySelector(".robot_card img");
const RESULT_TEXT = document.getElementById("result_text");
const GAMER_RESULT = document.getElementById("gamer_result");
const ROBOT_RESULT = document.getElementById("robot_result");
const GAMER_STATS = document.getElementById("gamer_stats");
const ROBOT_STATS = document.getElementById("robot_stats");
// Bouton rejouer
const REPLAY = document.getElementById("replay");
// Bouton effacer historique
const ERASE = document.getElementById("erase");

//* Tableau avec les valeurs possibles
let hands = [
   "./images/pierre.png",
   "./images/papier.png",
   "./images/ciseaux.png",
];

//* Récupération du localStorage pour voir si un historique était déjà en
GAMER_STATS.textContent = localStorage.getItem("player") ?? "0";
ROBOT_STATS.textContent = localStorage.getItem("robot") ?? "0";

activateImg();

REPLAY.addEventListener("click", () => {
   GAMER_RESULT.textContent = 0;
   ROBOT_RESULT.textContent = 0;
   ROBOT_CARD.src = "./images/base.png";
   activateImg();
   RESULT_TEXT.textContent = "Cliquez sur une image pour jouer";
});

ERASE.addEventListener("click", () => {
   localStorage.clear();
   GAMER_STATS.textContent = "0";
   ROBOT_STATS.textContent = "0";
});

function play(e) {
   desactivateImg();

   const gamerChoice = e.target.id;
   console.log(gamerChoice);

   for (card of GAMER_CARDS) {
      if (card !== e.target) {
         card.classList.add("faded");
      } else {
         card.classList.remove("faded");
      }
   }
   generateRobotChoice();

   function generateRobotChoice() {
      let currentIndex = 0;

      let shuffleRobotChoice = setInterval(() => {
         ROBOT_CARD.src = hands[currentIndex];
         currentIndex++;

         if (currentIndex === hands.length) {
            currentIndex = 0;
         }
      }, 100);

      // Arrête le shuffle après 1 seconde
      setTimeout(() => {
         clearInterval(shuffleRobotChoice);
         const RANDOM_NUMBER = Math.floor(Math.random() * hands.length); // entre 0 et 2 pour correspondre à l'index du tableau
         ROBOT_CARD.src = hands[RANDOM_NUMBER];

         if (RANDOM_NUMBER === 0) {
            robotChoice = "rock";
         }
         if (RANDOM_NUMBER === 1) {
            robotChoice = "paper";
         }
         if (RANDOM_NUMBER === 2) {
            robotChoice = "scissors";
         }

         //Résolution de la manche :
         getResult(gamerChoice, robotChoice);

         //Résolution de la partie
         isGameOver();
      }, 1000);
   }
}

/**
 * Désactive le fait de pouvoir cliquer sur les images
 */
function desactivateImg() {
   for (const GAMER_CARD of GAMER_CARDS) {
      GAMER_CARD.removeEventListener("click", play);
   }
}

/**
 * Active le fait de pouvoir cliquer sur les images
 */
function activateImg() {
   for (const GAMER_CARD of GAMER_CARDS) {
      GAMER_CARD.addEventListener("click", play);
   }
}

/**
 * Gère la résolution d'une manche
 * @param {string} player
 * @param {string} robot
 */

function getResult(player, robot) {
   if (player === robot) {
      RESULT_TEXT.textContent = "C'est une égalité !";
   } else if (
      (player === "rock" && robot === "scissors") ||
      (player === "paper" && robot === "rock") ||
      (player === "scissors" && robot === "paper")
   ) {
      RESULT_TEXT.textContent = `${player} gagne contre ${robot}`;
      GAMER_RESULT.textContent++;
   } else {
      RESULT_TEXT.textContent = `${player} perd contre ${robot}`;
      ROBOT_RESULT.textContent++;
   }
   //Réactiver le fait que les images soient clickables
   activateImg();
}

/**
 * Vérifie si la partie est terminée et gère l'affichage si oui
 */
function isGameOver() {
   if (ROBOT_RESULT.textContent >= 3 || GAMER_RESULT.textContent >= 3) {
      desactivateImg();

      if (GAMER_RESULT.textContent >= 3) {
         RESULT_TEXT.textContent =
            "Bravo vous avez gagné la partie ! Cliquez sur rejouer";
         GAMER_STATS.textContent++;
      } else {
         RESULT_TEXT.textContent =
            "Loser ! C'est l'ordinateur qui a gagné ! Cliquez sur rejouer";
         ROBOT_STATS.textContent++;
      }

      // Mise à jour des scores dans le localStorage
      localStorage.setItem("player", GAMER_STATS.textContent);
      localStorage.setItem("robot", ROBOT_STATS.textContent);
   }
}
