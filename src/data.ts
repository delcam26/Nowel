export interface Enigme{
    id:Number;
    title:String;
    question:String;
    answer:String;
    image:String;
    hint:string;
    successMessage:String;
    errorMessage:String;
}

export const enigmes: Enigme[] = [
    {
        id:1 ,
        title: "Le fantôme du Rire",
        question :  "où avons-nous ri jusqu'aux larmes pour la première fois ? ",
        answer:  "cinema",
        image:"Ghost.png",
        hint:"je déconne, pas d'indice non mais oh",
        successMessage: "Tu t'en es souvenue aww",
        errorMessage: "... tu es sûr ? ... reessaye"
    },
    {
        id:2 ,
        title: "Le requin baveux",
        question :  "Combien de requins sur cette image ? ",
        answer:  "1",
        image:"requin.png",
        hint:"ET TU REESSAYE QUAND MEME ???",
        successMessage: "Bien joué, on reconnait l'expertise",
        errorMessage: "Blaaj va pas être content :o "
    }
]