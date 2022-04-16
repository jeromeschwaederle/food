document.addEventListener('DOMContentLoaded', function(){

    // disables "add all to stock button" if shopping list is empty
    showAddAll();

    document.querySelector('#addAll').onclick = function(){
        document.querySelectorAll('.shop_list_item').forEach(function(element){
            fetch(`/stock_management/add/${element.dataset.ingredient_id}/${element.dataset.quantity}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
            element.remove();
        });
        showAddAll();
    }
});


function showAddAll() {
    // hides "add all to stock button" if shopping list is empty
    all_to_stock_btn = document.querySelector('#addAll');
    if (document.querySelectorAll('.shop_list_item').length == 0) {
        all_to_stock_btn.style.display = "none";
        const list = document.createElement('ul');
        list.className = "ulMessage";
        const message = document.createElement('h6');
        message.innerHTML = "I have everything I need.";
        document.querySelector('#shopping_list').append(list);
        document.querySelector('.ulMessage').append(message);
    } else {
        all_to_stock_btn.style.display = "block";
    }
}