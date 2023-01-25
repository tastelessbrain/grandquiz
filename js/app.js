
const rootDiv = document.querySelector(".cont-team")
const resetBtn = document.querySelector(".reset")
const addTeamBtn = document.querySelector(".addTeamBtn")

// const inputEl= parseInt(teamnuber)

function inputFunctio() {
}

// Increment button
function add(inputId) {
    let x = document.getElementById(inputId)
    if(x.value === ""){
        x.value = 100;
    } else {
        let currentValue = parseInt(x.value);
        x.value = currentValue + 100;
    }
}

//Decrement button
function remove(inputId) {
    let x = document.getElementById(inputId)
    if(x.value !=0){
        let currentValue = parseInt(x.value);
        x.value = currentValue - 100;
    }
}



// Reset Button Function
resetBtn.addEventListener("click",()=>{
    localStorage.clear()
    setInterval(location.reload(),1000)   
})

// remove a team

function removeteam(inputId) {
    let x = document.getElementById(inputId)
    x.parentNode.remove();
}


// Add Team button function
let count = 1;
let countt = 0;
addTeamBtn.addEventListener("click",function (e) {
    count++;
    if(count <7){
        let newEl = document.createElement("div");
        newEl.innerHTML = `<div class="indTeam"><p contenteditable="" class ="teamName">Team ${count}</p><input class="team1Input"
         oninput="${inputFunctio()}" id="input${count}" type="number"><br>
        <button class="addscore" onclick="add('input${count}')">+</button>
        <button class="addscore" onclick="remove('input${count}')">-</button>
        <button class="removeteam"  onclick=removeteam("input${count}")
         id="input${count}">x</button> </div>`;
        rootDiv.appendChild(newEl);
        let newAddButton = newEl.querySelectorAll('.addscore');
        let newRemoveButton = newEl.querySelectorAll('.removescore');
        let newRemoveTeamButton = newEl.querySelectorAll('.removeteam')
        newAddButton.forEach(button => button.addEventListener("click", add));
        newRemoveButton.forEach(button => button.addEventListener("click", remove));
        newRemoveTeamButton.forEach(button => button.addEventListener("click", removeteam));

    }
});
