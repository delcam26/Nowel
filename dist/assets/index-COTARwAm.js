(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();const o=[{id:1,title:"Le fantôme du Rire",question:"où avons-nous ri jusqu'aux larmes pour la première fois ? ",answer:"cinema",image:"Ghost.png",hint:"je déconne, pas d'indice non mais oh",successMessage:"Tu t'en es souvenue aww",errorMessage:"... tu es sûr ? ... reessaye"},{id:2,title:"Le requin baveux",question:"Combien de requins sur cette image ? ",answer:"1",image:"requin.png",hint:"ET TU REESSAYE QUAND MEME ???",successMessage:"Bien joué, on reconnait l'expertise",errorMessage:"Blaaj va pas être content :o "}],m=document.getElementById("game");function d(n){m.innerHTML=`
    <div class="enigme">
    <h2>${n.image}</h2>
    <img src=".assets/images.${n.image}" alt=${n.title}" class="enigme-img'/>
    <p>${n.question}</p>
<input type="text" id="answer" placegolder="Ta réponse ..." class="answer_input"/>
<button id="validationBtn" class="validate-btn"> Valider</button>
${n.hint?`<p class="hint"> Indice : ${n.hint}</p>`:""}
</div>
`;const s=document.getElementById("validateBtn"),a=document.getElementById("answer");s.addEventListener("click",()=>{const i=a.value;f(i)})}let r=0;const u=document.getElementById("game");var l;u?(u.innerHTML=`
    <h1> Le jeu s'est bien lancé : </h1>
    <button id="startBtn">Commencer</button>`,(l=document.getElementById("startBtn"))==null||l.addEventListener("click",()=>{g()})):console.error("element game introuvable");function g(){d(o[r])}function f(n){const s=o[r];n.toLowerCase().trim()===s.answer?(alert(s.successMessage),r++,r<o.length?d(o[r]):p()):alert(s.errorMessage)}function p(){document.body.innerHTML=`
<div class="final"> 
    <h2> Le sort est levé </h2>
    <p> Tu a retrouvé tous nos souvenirs ... Je t'aime </p>
    <button id="restart">Rejouer</button>
</div>`,document.getElementById("restart").addEventListener("click",()=>{location.reload()})}
