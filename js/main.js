
console.log($(".orange").attr("style"));

function btnFunction(questiontype,question) {
    $(".row").hide();
    $(".round-info").hide();
    $(".quest").show();
    $(".quest").append(`<input class="backBtn" type="button" value="Back">`);
    $(".quest").append(`<input class="show" type="button" value="Show Answer">`);
    $(".quest").append(`<div class="imgcont">${questiontype}</div>`);
    $(".questionEl").text(`${question}`);
    $(".screenBtn").hide();
}
$(".screenBtn").hide();

function BackBtn() {
    $(".backBtn").click((()=>{
        $(".row").show();
        $(".round-info").show();
        $(".quest").hide();
        $(".backBtn").hide();
        $(".show").hide();
        // $(".screenBtn").show();
        $(".questionEl").show();
        $(".imgcont").hide();
        for (let index = 0; index < $("audio#pop").length; index++) {
            $("audio#pop")[index].pause();
            $("audio#pop").hide();
        }
       
        }));
}
function showAns(name,question) {
    $(".show").click((()=>{
        $(".show").toggleClass("showned")
        $(".questionEl").text(`${name}`)
        $(".quest").show();
        if ($(".show").attr("class") === "show showned") {
            console.log("wow");
            $(".questionEl").text(`${name}`)
            $(".show").attr('value', 'Show Question');
               
        }else{
            $(".questionEl").text(`${question}`);
            $(".show").attr('value', 'Show Answer');
        }
    }));
    
}

$("#btn1").click(()=>{
    let img = ``; 
    let questiontype ="Jedes Jahr werden davon 109 Millionen in DE verkauft.";
    let name = "Was ist ein Schokoweihnachtsmann?"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn2").click(()=>{
    let img = ``; 
    let questiontype ="Diese Kugel hat 336 Einkerbungen.";
    let name = "Was ist ein Golfball?"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn3").click(()=>{
    let img = ``; 
    let questiontype ="Ouagadougou";
    let name = "Wie heißt die Hauptstadt von Burkina Faso?"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn4").click(()=>{
    let img = ``; 
    let questiontype ="Es antwortet in allen Sprachen. Es spricht ohne Mund. Es hört ohne Ohren.";
    let name = "Was ist ein Echo"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn5").click(()=>{
    let img = ``; 
    let questiontype ="Adenin, Cytosin, Guanin, Thymin";
    let name = "Was sind die 4 Basen der DNA?"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn6").click(()=>{
    let img = ``; 
    let questiontype ="Von der Sonne aus: Der wievielte Planet ist die Erde in unserem Sonnensystem?";
    let name = "Der Dritte!"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn7").click(()=>{
    let img = ``; 
    let questiontype ="Welches ist das schnellste Tier der Erde?";
    let name = "Der Wanderfalke!"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn8").click(()=>{
    let img = ``; 
    let questiontype ="Schätzfrage: Aus wie viel Tonnen Plastik betseht der 'Great Pacific Garbage Patch?'";
    let name = "79.000 Tonnen!"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn9").click(()=>{
    let img = ``; 
    let questiontype ="Nenne ein Land in dessen Name zweimal den Buchstaben 'B' enthält.";
    let name = "Barbados, Zimbabwe, Antigua and Barbuda"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn10").click(()=>{
    let img = ``; 
    let questiontype ="Welches ist das giftigste Tier der Erde?";
    let name = "Seewespe (Qualle)"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn11").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/weeknd.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Welcher Song ist das? Titel + Interpret!";
    let name = "Blinding Lights - The Weeknd "
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn12").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/shape.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Welcher Song ist das? Translated Lyrics!";
    let name = "Shape of You - Ed Sheeran"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn13").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/BHR.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Welcher Song ist das? Translated Lyrics!";
    let name = "Bohemian Rapsody - Queen"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn14").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/nttd.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Welcher Song ist das? Titel + Interpret!";
    let name = "No Time to die - Billie Eilish/Hans Zimmer"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn15").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/ourhouse.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Welcher Song ist das? Titel + Interpret!";
    let name = "Our House - Madness"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn16").click(()=>{
    let img = ``; 
    let questiontype ="Wer erfand die Glühbirne?";
    let name = "Thomas Edison"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn17").click(()=>{
    let img = ``; 
    let questiontype ="Wer umsegelte als erstes die Erde?";
    let name = "Ferdinand Magellan"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn18").click(()=>{
    let img = ``; 
    let questiontype ="Wer entdeckte das Penecilin?";
    let name = "Alexander Fleming"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn19").click(()=>{
    let img = ``; 
    let questiontype ="Wer war der erste Präsident der USA?";
    let name = "George Washington"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn20").click(()=>{
    let img = ``; 
    let questiontype ="Wer war James Webb?";
    let name = "James Webb war ein US-amerikanischer Astronom und NASA-Verwaltungsbeamter. Er war der zweite Administrator der NASA von 1961 bis 1968 und trug wesentlich zur Entwicklung des Apollo-Programms bei."
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn21").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/netflix.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Was ist das?";
    let name = "Netflix Intro!"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn22").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/chips.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Was hörst du hier?";
    let name = "Chips Tüte öffnen!"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn23").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/straba.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Hör genau hin!";
    let name = "Freiburger Straßenbahn!"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn24").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/RTW.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Die Sierene welcher Einsatzkräfte ist hier zu hören?";
    let name = "Krankenwagen (RTW-Polizei-Feuerwehr)"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn25").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/waal.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Was ist hier zu hören?";
    let name = "Waalgesang!"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
