document.addEventListener('DOMContentLoaded', function(){

    // for the "show my stock" button to change innerHTML
    document.querySelector('#stock_btn').onclick = function() {
        let innerText = this.innerHTML;
        if (innerText == 'Show my stock') {
            this.innerHTML = 'Hide my stock';
        } else {
            this.innerHTML = 'Show my stock';
        }
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
    document.querySelectorAll(".quantity_input").forEach(function(input) {
        input.onkeyup = function() {
            // checks that input is only digits and ables "add to recipe" button
            check_quantity_input(input);
        }
    });

    // add event to all "Add to stock" buttons + logic
    document.querySelectorAll(".add-to").forEach(function(button) {
        button.innerHTML = "Add to stock"
        button.onclick = function() {
            let ingredient_id = this.dataset.ingredient_id;
            let ingredient_name = this.dataset.ingredient_name;
            let unit = this.dataset.unit;
            let quantity = document.querySelector(`#quantity-${ingredient_id}`).value;
            add_to_stock(ingredient_id, ingredient_name, unit, quantity, button.id);
        }
    });

    // add event + logic to all "remove" buttons
    document.querySelectorAll(".remove_btn").forEach(function(button) {
        button.onclick = function() {
            remove_from_stock(button);
        }
    });

});



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




function add_to_stock(ingredient_id, ingredient_name, unit, quantity, button_id) {

    // TO DO => Add backend logic to "remove" buttons !!!!!!!!!!!!!!!!


    let updated = 0;

    fetch(`/stock_management/add/${ingredient_id}/${quantity}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // check if added ingredient allready exists in stock list
        document.querySelectorAll('.stock_list_item').forEach(function(element){
            // if it already exists
            if (element.dataset.ingredient_id == ingredient_id) {
                console.log(`${element.dataset.quantity} + ${quantity} = ${parseInt(element.dataset.quantity) + parseInt(quantity)}`)
                // updates the quantity
                let int_quantity = parseInt(element.dataset.quantity);
                int_quantity += parseInt(quantity);
                element.dataset.quantity = int_quantity;
                if (unit === "piece" && int_quantity === 1) {
                    element.innerHTML = `${ingredient_name}: ${int_quantity}`;
                } else if (unit === "piece" && int_quantity > 1) {
                    element.innerHTML = `${ingredient_name}s: ${int_quantity}`;
                } else {
                    element.innerHTML = `${ingredient_name}: ${int_quantity} ${unit} `;
                }
            
                // add a remove button to each list element + logic
                let remove_btn = document.createElement('button');
                remove_btn.innerHTML = "remove";
                remove_btn.setAttribute("data-ingredient_id", `${ingredient_id}`);
                remove_btn.className = "remove_btn btn btn-secondary btn-sm me-2";
                element.insertAdjacentElement("afterbegin", remove_btn);
                remove_btn.setAttribute('data-quantity', `${remove_btn.parentElement.dataset.quantity}`);
                remove_btn.onclick = function() {
                    remove_from_stock(remove_btn);
                }
                updated += 1;
            }
        });

        if (updated == 0) {
            console.log("nouvel ingrédient")
            // creates new elements and attach it to the unordered list
            let new_stock = document.createElement('li');
            new_stock.setAttribute("data-ingredient_id", `${ingredient_id}`);
            new_stock.setAttribute('data-quantity', `${quantity}`);
            new_stock.className = 'stock_list_item list-group-item';
            if (unit === "piece" && parseInt(quantity) === 1) {
                new_stock.innerHTML = `${ingredient_name}: ${quantity}`;
            } else if (unit === "piece" && parseInt(quantity) > 1) {
                new_stock.innerHTML = `${ingredient_name}s: ${quantity}`;
            } else {
                new_stock.innerHTML = `${ingredient_name}: ${quantity} ${unit}`;
            }
            document.querySelector('#stock_list').append(new_stock);

            // add a remove button to each list element + logic
            let remove_btn = document.createElement('button');
            remove_btn.innerHTML = "remove";
            remove_btn.setAttribute("data-ingredient_id", `${ingredient_id}`);
            remove_btn.setAttribute('data-quantity', `${quantity}`);
            remove_btn.className = "remove_btn btn btn-secondary btn-sm me-2";
            new_stock.insertAdjacentElement("afterbegin", remove_btn);
            document.querySelectorAll(".remove_btn").forEach(function(button) {
                button.onclick = function() {
                    remove_from_stock(button);
                }
            });
        }


    });

    
    // emppty quantity input
    id = button_id;
    id = id.replace("add-to", "quantity");
    document.querySelector(`#${id}`).value = "";

    // disables "Add to stock" button
    document.querySelector(`#${button_id}`).disabled = true;

    // empty search input and focus cursor inside
    let lookup = document.querySelector('#lookup');
    lookup.value = "";
    lookup.focus();
        
}


function remove_from_stock(element) {
    console.log("remove function", element.dataset.ingredient_id, element.dataset.quantity)
    fetch(`/stock_management/remove/${element.dataset.ingredient_id}/${element.dataset.quantity}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        element.parentElement.remove();
    });

}