import {enigmes} from "./data";
import { showEnigme} from "./ui";

let current=0;

const game = document.getElementById("game") as HTMLDivElement;

if (game) {
    game.innerHTML = `
    <h1> Le jeu s'est bien lancé : </h1>
    <button id="startBtn">Commencer</button>`;

    document.getElementById("startBtn")?.addEventListener("click",() => {
        startGame();
    });
}
else {
    console.error("element game introuvable");
}

export function startGame() {
    showEnigme(enigmes[current]);
}

export function validateAnswer (input:string) {
    const enigme = enigmes[current];
    if (input.toLowerCase().trim()=== enigme.answer){
        alert(enigme.successMessage);
        current++;
        if (current < enigmes.length){
            showEnigme(enigmes[current]);
        }
        else {
            showFinalMessage();
        }
    }
    else {
        alert(enigme.errorMessage);
        }
}

function showFinalMessage() {
document.body.innerHTML = `
<div class="final"> 
    <h2> Le sort est levé </h2>
    <p> Tu a retrouvé tous nos souvenirs ... Je t'aime </p>
    <button id="restart">Rejouer</button>
</div>`;

const restartBtn = document.getElementById("restart") as HTMLButtonElement;
restartBtn.addEventListener("click",() => {
    location.reload();
});
}
