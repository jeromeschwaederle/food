document.addEventListener('DOMContentLoaded', function () {

    // Checks if recipe is planned
    checkIfPlanned();

    checkDoable(0);

    // adds click event + logic to "Plan" buttons
    plan_unplan();

    // adds click event + logic to "delete" buttons
    delete_buttons();

});



function checkIfPlanned() {
    // To set the right color
    document.querySelectorAll('.plan').forEach(function (button) {
        fetch(`/recipe_management/${button.dataset.recipe}/checkPlanned`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.planned == 'False') {
                    button.dataset.planned = "notPlanned";
                    button.parentElement.parentElement.style.backgroundColor = '#ffffe6';
                }
                else {
                    button.innerHTML = "Un-plan";
                    button.dataset.planned = "isPlanned";
                    button.parentElement.parentElement.style.backgroundColor = '#ffdf82';
                    createDoneBtn(button);
                }
            });
    });
}



function checkDoable(id) {
    fetch(`/recipe_management/${id}/checkDoable`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for (let x in data) {
                if (data[x] == false) {
                    document.querySelector(`#badge-${x}`).style.display = "none";
                } else {
                    document.querySelector(`#badge-${x}`).style.display = "block";
                }
            }
        });
}

function unplan(button) {
    fetch(`/recipe_management/${button.dataset.recipe}/unplan`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        button.parentElement.parentElement.style.backgroundColor = '#ffffe6';
        button.innerHTML = 'Plan';
        button.dataset.planned = "notPlanned";
        checkDoable(0);
    });
    doneBtn = document.querySelector(`#doneBtn-${button.dataset.recipe}`);
    doneBtn.remove();
}

function plan(button) {
    fetch(`/recipe_management/${button.dataset.recipe}/plan`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        button.parentElement.parentElement.style.backgroundColor = '#ffdf82';
        button.innerHTML = 'Un-plan';
        button.dataset.planned = "isPlanned";
        checkDoable(0);
    });
    createDoneBtn(button);
}

function plan_unplan() {
    document.querySelectorAll('.plan').forEach(function(button){
        button.onclick = function () {
            if (button.dataset.planned === 'isPlanned') {
                unplan(button);
            } else if (button.dataset.planned === 'notPlanned') {
                plan(button);
            }
        }
    });
}



function delete_buttons() {
    document.querySelectorAll('.btn-delete-recipe').forEach(function(button){
        button.onclick = function() {
            fetch(`/recipe_management/${button.dataset.recipe}/delete`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                button.parentElement.parentElement.remove();
            });        
        }
    });
}



function createDoneBtn(button) {
    const doneBtn = document.createElement('button');
    doneBtn.className = "done btn btn-secondary btn-sm";
    doneBtn.id = `doneBtn-${button.dataset.recipe}`;
    doneBtn.setAttribute("data-recipe", `${button.dataset.recipe}`);
    doneBtn.innerHTML = "Done";
    button.insertAdjacentElement("afterend", doneBtn);
    done_buttons_clickevent();
}


// adds click events to "Done" buttons
function done_buttons_clickevent() {
    document.querySelectorAll('.done').forEach(function(button){
        button.onclick = function() {
            done_buttons_logic(button);
        }
    });
}


// logic to "Done" buttons
function done_buttons_logic(button) {
    fetch(`/recipe_management/${button.dataset.recipe}/wasCooked`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const planBtn = document.querySelector(`#planBtn-${button.dataset.recipe}`);
        unplan(planBtn);
    });
}