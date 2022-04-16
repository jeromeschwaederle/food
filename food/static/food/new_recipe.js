document.addEventListener('DOMContentLoaded', function() {

    // to show second part of the process if there is some text in the form
    document.querySelector('#submit_new_recipe_form').onclick = function() {
        to_second_step();
    } 

  
    // array with all ingredients
    let all_ingredients = [];
    document.querySelectorAll('.ingredient-name').forEach(
        function(ingredient) {
            all_ingredients.push(ingredient.innerHTML.toLowerCase().trim());
        }
    );
    console.log(all_ingredients);



    // takes the inputfield and displays ingredients that match input
    const lookup = document.querySelector('#lookup');
    lookup.onkeyup = function() {
        filter_ingredient(lookup.value.toLowerCase().trim(), all_ingredients);
    }



    // in the list of ingredients, takes all the input fields
    document.querySelectorAll(".quantity_input").forEach(
        function(input) {
            input.onkeyup = function() {
                // checks that input is only digits and ables "add to recipe" button
                check_quantity_input(input);
            }
        }
    );



    // add event to all "Add to recipe" buttons + logic
    document.querySelectorAll(".add-to").forEach(
        function(button) {
            button.onclick = function() {
                let ingredient_id = this.dataset.ingredient_id;
                let ingredient_name = this.dataset.ingredient_name;
                let unit = this.dataset.unit;
                let quantity = document.querySelector(`#quantity-${ingredient_id}`).value;
                add_to_recipe(ingredient_id, ingredient_name, unit, quantity, button.id);
            }
        }
    );
    

});




// to hide and show the sections and update advancement bar
function show(section) {
    let sections = ["#first_step", "#second_step", "#third_step"]
    let advancements = ["5", "50", "100"]
    let index = section - 1;
    document.querySelector(`${sections[index]}`).style.display = "block";
    let progress = document.querySelector('.progress-bar');
    progress.setAttribute('aria-valuenow', `${advancements[index]}`);
    progress.style.width = `${advancements[index]}%`;
    sections.splice(index, 1);
    sections.forEach(
        function(step) {
            document.querySelector(`${step}`).style.display = "none";
        }
    );
}





function to_second_step() {

    let title = document.querySelector('#recipe_title');
    let recipe = document.querySelector('#recipe_recipe');
    let alert = document.querySelector('#alert_title_recipe');
    let lookup = document.querySelector('#lookup');


    // checks that the title and recipe have word's characters
    if (!/\w+/g.test(title.value)) {
        alert.innerHTML = "You must enter a title !";
        alert.style.display = 'block';
        title.focus();
        return
    } else if (!/\w+/g.test(recipe.value)) {
        alert.innerHTML = "You must enter a recipe !";
        alert.style.display = 'block';
        recipe.focus();
        return
    } else {
        alert.style.display = 'none';
    }

    // depending on comming back from another step, ensures there is only one "remove" button
    document.querySelectorAll('.remove_btn').forEach(
        function(button) {
            button.remove();
        }
    );

    // put the remove buttons on list items
    document.querySelectorAll('.ingredients_list_item').forEach(
        function(item) {
            // add a remove button to each list element 
            let remove_btn = document.createElement('button');
            remove_btn.innerHTML = "remove";
            remove_btn.className = "remove_btn btn btn-sm";
            item.append(remove_btn);
            document.querySelectorAll(".remove_btn").forEach(
                function(button) {
                    button.onclick = function() {
                        this.parentElement.remove();
                        lookup.focus();
                        // enables or disables "check and save" button
                        if (document.querySelector('#ingredients_list').childElementCount > 0) {
                            document.querySelector('#check_and_save').disabled = false;
                        } else {
                            document.querySelector('#check_and_save').disabled = true;
                        }
                    }
                }
            );
        }
    );


    // keeps the title and the recipe
    let pattern = /\n\r?/g;
    recipe = recipe.value.replace(pattern, '<br />');
    document.querySelector('#recipe_title_second_step').innerHTML = title.value;
    document.querySelector('#recipe_recipe_second_step').innerHTML = recipe;

    // shows the second step
    show(2);

    // attach event to go back or further in the process
    document.querySelector('#back_to_title_and_recipe').onclick = function() {
        show(1);
    }
    document.querySelector('#check_and_save').onclick = function() {
        to_third_step();
    }

    lookup.focus();
}





function to_third_step() {
    // hides and shows the appropriate view
    show(3);

    // keeps the title and the recipe
    let title = document.querySelector('#recipe_title').value;
    let recipe = document.querySelector('#recipe_recipe').value;
    let pattern = /\n\r?/g;
    recipe = recipe.replace(pattern, '<br>');
    document.querySelector('#recipe_title_third_step').innerHTML = title;
    document.querySelector('#recipe_recipe_third_step').innerHTML = recipe;

    // takes the ingredient list AND changes class name
    // checks first that the list is empty
    if (document.querySelectorAll('.ingredient_to_save').length > 0) {
        document.querySelectorAll('.ingredient_to_save').forEach(function(element){element.remove();});
    }
    document.querySelectorAll('.ingredients_list_item').forEach(
        function(element) {
            var clone = element.cloneNode(true);
            clone.className = 'ingredient_to_save list-group-item p-1';
            document.querySelector('#ingredients_list_last_check').append(clone);
        }
    );
    
    // removes the remove buttons
    document.querySelectorAll('.remove_btn').forEach(
        function(button) {
            button.remove();
        }
    );

    // event + logic "Change Ingredients" button
    document.querySelector('#change_ingredients').onclick = function() {
        to_second_step();
    }

    // event + logic "Save Recipe" button
    document.querySelector('#save_recipe').onclick = function() {
        save_recipe(title, recipe);
    }
}


function save_recipe(title, recipe) {
    fetch(`save_recipe/${title}/${recipe}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.status === "ERROR: title already exists") {
            let alert = document.querySelector('#alert_title_recipe');
            alert.innerHTML = "Please choose a new title\nThis one is already taken";
            alert.style.display = "block";
            show(1);
            let title = document.querySelector('#recipe_title');
            title.focus();
            return 
        }
        else {
            document.querySelectorAll('.ingredient_to_save').forEach(function(element) {
                save_ingredient(title, element.dataset.ingredient_id, element.dataset.quantity);
            });
            location.href = "/";
        }
    });
}


function save_ingredient(recipe_title, id, quantity) {
    fetch(`add_ingredient/${recipe_title}/${id}/${quantity}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}


function filter_ingredient(value, array) {

    console.log(value);
    let results = [];
    for (let i = 0; i < array.length; i++) {
        pattern = new RegExp(`${value}`, "ig")
        if (pattern.test(array[i])) {
            results.push(array[i]);
            document.getElementById(`${array[i]}`.replace(/ /g, "")).style.display = 'block';
        } else {
            document.getElementById(`${array[i]}`.replace(/ /g, "")).style.display = 'none';
        }
    }
    console.log(results)

}



function check_quantity_input(input) {

    // select the right "Add to recipe" button
    let id = input.id;
    id = id.replace("quantity", "add-to");
    button = document.querySelector(`#${id}`);

    // test if something is written
    if (input.value.length === 0) {
        button.disabled = true;
    }
    // test for non-digit characters
    else if (/\D/g.test(input.value)) {
        // they are non-digit characters
        console.log(`all characters ${input.value}`);
        button.disabled = true;
    } else {
        // they are only digits
        console.log(`only digits ${input.value}`);    
        button.disabled = false;
    }

}






function add_to_recipe(ingredient_id, ingredient_name, unit, quantity, button_id) {

    // Number of ingredient added to the recipe
    console.log(document.querySelector('#ingredients_list').childElementCount);
   
    // creates new elements and attach it to the unordered list
    let new_ingredient = document.createElement('li');
    new_ingredient.setAttribute("data-ingredient_id", `${ingredient_id}`);
    new_ingredient.setAttribute('data-quantity', `${quantity}`);
    new_ingredient.className = 'ingredients_list_item list-group-item d-flex justify-content-between align-items-center p-1';
    if (unit === "piece" && parseInt(quantity) === 1) {
        new_ingredient.innerHTML = `${quantity} ${ingredient_name.toLowerCase()} `;
    } else if (unit === "piece" && parseInt(quantity) > 1) {
        new_ingredient.innerHTML = `${quantity} ${ingredient_name.toLowerCase()}s `;
    } else {
        new_ingredient.innerHTML = `${quantity} ${unit} of ${ingredient_name.toLowerCase()} `;
    }
    document.querySelector('#ingredients_list').append(new_ingredient);

    // add a remove button to each list element + logic
    let remove_btn = document.createElement('button');
    remove_btn.innerHTML = "remove";
    remove_btn.className = "remove_btn btn btn-sm";
    new_ingredient.append(remove_btn);
    document.querySelectorAll(".remove_btn").forEach(
        function(button) {
            button.onclick = function() {
                this.parentElement.remove();
                // enables or disables "check and save" button
                if (document.querySelector('#ingredients_list').childElementCount > 0) {
                    document.querySelector('#check_and_save').disabled = false;
                } else {
                    document.querySelector('#check_and_save').disabled = true;
                }
            }
        }
    );

    // enables or disables "check and save" button
    if (document.querySelector('#ingredients_list').childElementCount > 0) {
        document.querySelector('#check_and_save').disabled = false;
    } else {
        document.querySelector('#check_and_save').disabled = true;
    }

    // emppty quantity input
    id = button_id;
    id = id.replace("add-to", "quantity");
    document.querySelector(`#${id}`).value = "";

    // disables "Add to recipe" button
    document.querySelector(`#${button_id}`).disabled = true;

    // empty search input and focus cursor inside
    let lookup = document.querySelector('#lookup');
    lookup.value = "";
    lookup.focus();
        
}

