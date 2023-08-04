
console.log($(".orange").attr("style"));

function btnFunction(questiontype,question) {
    $(".row").hide();
    $(".round-info").hide();
    $(".quest").show();
    $(".quest").append(`<input class="backBtn" type="button" value="Back">`);
    $(".quest").append(`<input class="show" type="button" value="Show Answer">`);
    $(".quest").append(`<div class="imgcont">${questiontype}</div>`);
    $(".questionEl").html(`${question}`);
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

//KATEGORIE 1
$("#btn1").click(()=>{
    let img = ``; 
    let questiontype = "Top 10 - Suchbegriffe <br>Wähle: Schlagzeilen/Persönlichkeiten";
    let name = ""
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
})

$("#btn2").click(()=>{
    let img = ``; 
    let questiontype ="Welche Disziplinen gehören zum modernen olypischen Zehnkampf?<br>(2019)";
    let name = ""
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn3").click(()=>{
    let img = ``; 
    let questiontype ="Welche 10 Sprachen sind die meist gesprochenen Sprachen der Welt? <br>(2018)";
    let name = ""
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn4").click(()=>{
    let img = ``; 
    let questiontype ="Welche Länder stellten 2018 den meisten Wein her?";
    let name = ""
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn5").click(()=>{
    let img = ``; 
    let questiontype ="Welches sind die 10 schwersten, heute auf dem Land lebenden, Säugetiere? <br>(2018)";
    let name = ""
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})

//KATEGORIE 2
$("#btn6").click(()=>{
    let img = ``; 
    let questiontype ="Welcher ist der zweithöchste Berg der Erde?";
    let name = "K2 -  Godwin-Austen / Chhogori | 8.611 m"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn7").click(()=>{
    let img = ``; 
    let questiontype ="Welches ist das dichtestbesiedelte Land der Erde?";
    let name = "Monaco / Bangladesh"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn8").click(()=>{
    let img = ``; 
    let questiontype ="Welches Land hat die meisten aktiven Vulkane?";
    let name = "Indonesien"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn9").click(()=>{
    let img = ``; 
    let questiontype ="Nenne drei Länder die mit 'J' beginnen!";
    let name = "Jamaika, Japan, Jordanien, Jemen"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn10").click(()=>{
    let img = ``; 
    let questiontype ="Was versteht man unter dem Kessler Effekt?";
    let name = "Eine Kaskade and Kollisionen im Erdorbit."
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})

//KATEGORIE 3
$("#btn11").click(()=>{
    let img = ``; 
    let questiontype ="Bis in die Unendlichkeit und noch viel weiter.";
    let name = "Buzz Lightyear"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn12").click(()=>{
    let img = ``; 
    let questiontype ="Wenn ich wählen muss zwischen einem Übel und einem kleineren, dann ziehe ich es vor, überhaupt nicht zu wählen.";
    let name = "Geralt von Riva"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn13").click(()=>{
    let img = ``; 
    let questiontype ="Wer entschlüsselte (maßgeblich) die Enigma?";
    let name = "Alan Turing"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn14").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/jvj.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Wer hat die Häftlingsnummer '24601'?";
    let name = "Jean Valjean"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn15").click(()=>{
    let img = ``; 
    let questiontype ="Phantasie ist wichtiger als Wissen, denn Wissen ist begrenzt.";
    let name = "Albert Einstein"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})

//KATEGORIE 4
$("#btn16").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/ok.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Welcher Song ist das?";
    let name = "Casper & Kraftklub - Ganz schön okay"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn17").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/kk.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Welches Geräusch ist das?";
    let name = "Kronkorken"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn18").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/tasten.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Welches Geräusch ist das?";
    let name = "Computer-Tastatur"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn19").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/creep.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Welcher Song ist das?";
    let name = "Radiohead - Creep"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn20").click(()=>{
    let audio = `<audio id="pop" controls><source src="./soundfiles/ttl.mp3" type="audio/mpeg"></audio>`; 
	console.log($("audio#pop")[0]);
    let questiontype ="Welcher Song ist das?";
    let name = "Soft Cell - Tainted Love"
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})

//KATEGORIE 5
$("#btn21").click(()=>{
    let img = `<img class="qimg" src="./qimg/wdym.jpg"/>`; 
    let questiontype ="";
    let name = ""
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn22").click(()=>{
    let img = `<img class="qimg" src="./qimg/wdym8.jpg"/>`; 
    let questiontype ="";
    let name = ""
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn23").click(()=>{
    let img = `<img class="qimg" src="./qimg/wdym11.jpg"/>`; 
    let questiontype ="";
    let name = ""
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn24").click(()=>{
    let img = `<img class="qimg" src="./qimg/wdym12.png"/>`; 
    let questiontype ="";
    let name = ""
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn25").click(()=>{
    let img = `<img class="qimg" src="./qimg/wdym14.jpg"/>`; 
    let questiontype ="";
    let name = ""
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
