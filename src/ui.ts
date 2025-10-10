import { Enigme} from "./data";
import {validateAnswer} from "./main";

const gameContainer = document.getElementById ("game") as HTMLDivElement;

export function showEnigme(enigme: Enigme) {
    gameContainer.innerHTML=`
    <div class="enigme">
    <h2>${enigme.title}</h2>
    <img src=".assets/images.${enigme.image}" alt=${enigme.title}" class="enigme-img'/>
    <p>${enigme.question}</p>
<input type="text" id="answer" placegolder="Ta réponse ..." class="answer_input"/>
<button id="validationBtn" class="validate-btn"> Valider</button>
${enigme.hint ? `<p class="hint"> Indice : ${enigme.hint}</p>`:""}
</div>
`;

const validateBtn= document.getElementById("validateBtn") as HTMLButtonElement;
const answerInput = document.getElementById("answer") as HTMLInputElement;

validateBtn.addEventListener("click",() => {
    const answer = answerInput.value;
    validateAnswer(answer);
});
 }
 

