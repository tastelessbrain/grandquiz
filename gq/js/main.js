
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
    let questiontype ="What is the name of this Hero";
    let name = "THOR GOD OF THUNDER"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn2").click(()=>{
    let audio = `<audio id="pop" controls>
    <source src="./soundfiles/sound.mp3" type="audio/mpeg">
</audio>`; 
console.log($("audio#pop")[0]);
    let questiontype ="What is the name of the song";
    let name = "juice "
    btnFunction(audio,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn3").click(()=>{
    let img = `<img class="qimg" src="./qimg/hulk.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "THE INCREDIBLE HULK"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn4").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn5").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn6").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn7").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn8").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn9").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn10").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn11").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn12").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn13").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn14").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn15").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn16").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn17").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn18").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn19").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn20").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn21").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn22").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn23").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn24").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
$("#btn25").click(()=>{
    let img = `<img class="qimg" src="./qimg/spidey.jpg"/>`; 
    let questiontype ="What is the name of this Hero";
    let name = "SPIDERMAN"
    btnFunction(img,questiontype);
    showAns(name,questiontype);
    BackBtn();
    
})
