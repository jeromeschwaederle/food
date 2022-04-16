from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout, get_user
from django.contrib.auth.decorators import login_required
from django.http.response import JsonResponse
import re

from .forms import RegisterForm, LoginForm, RecipeForm
from .models import Ingredient, User, Recipe, Recipe_Ingredient, Stock, Shopping_List


# Create your views here.
def index(request):
    user = get_user(request)
    if not user.is_authenticated:
        return HttpResponseRedirect(reverse('login'))
    recipes = user.recipes.all().order_by('title')  
    return render(request, 'food/index.html', {
        'recipes': recipes,        
    })


def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        # checks that the form's data is valid
        if form.is_valid():
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            password_confirmation = request.POST['password_confirmation']
            # checks that password and password_confirmation are the same
            if not password == password_confirmation:
                return render(request, 'food/register.html', {
                    "message": "PASSWORD and PASSWORD CONFIRMATION did not match !",
                    "form": form
                })
            # checks that the email is not already used
            email_used = User.objects.filter(email=email)
            if email_used:
                return render(request, "food/register.html", {
                    "message": "EMAIL already used, please give another one.",
                    "form": form
                })
            # if all good, creates user
            user = User.objects.create_user(username=email, email=email, password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()
                  
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        # if form isn't valid for some reason
        else:
            return render(request, "food/register.html", {
                "message": "There was a problem, please fill the register form again.",
                "form": form
            })

    # if method is not POST
    form = RegisterForm()
    return render(request, "food/register.html", {
        "form": form,
    })


def login_view(request):
    form = LoginForm()
    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, 'food/login.html', {
                "message": "Email or Password not valid. Please try again.",
                "form": form
            })
    return render(request, 'food/login.html', {
        "form": form
    })


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('login'))


@login_required
def new_recipe(request):
    form_recipe = RecipeForm()
    ingredients = Ingredient.objects.all().order_by('name')
    return render(request, 'food/new_recipe.html', {
        "form_recipe": form_recipe,
        "ingredients": ingredients
    })


@login_required
def stock(request):
    user = get_user(request)
    ingredients = Ingredient.objects.all().order_by('name')
    stocks = Stock.objects.filter(owner=user).order_by('ingredient__name')
    return render(request, 'food/stock.html', {
        'ingredients': ingredients,
        'stocks': stocks
    })


@login_required
def recipe(request, recipe_title):
    recipe = Recipe.objects.filter(title=recipe_title)
    if recipe:
        recipe = recipe[0]
        ingredients = recipe.ingredients.all()
        return render(request, 'food/recipe.html', {
            'recipe': recipe,
            'ingredients': ingredients
        })
    if not recipe:
        return render(request, 'food/error.html', {
            'message': "No recipe saved with this title"
        })


def all_needed_ingredients(user):
    # all planned recipe objects
    all_recipes_to_do = Recipe.objects.filter(owner=user, todo=True)
    # All needed ingredients
    needed = {}
    # for each recipe
    for recipe in all_recipes_to_do:
        # takes all Recipe_Ingredient objects
        all_recipe_ingredients = recipe.ingredients.all()
        for recipe_ingredient in all_recipe_ingredients:
            # and puts them in "d_needed"
            if recipe_ingredient.ingredient.name not in needed.keys():
                needed[recipe_ingredient.ingredient.name] = recipe_ingredient.quantity
            else:
                needed[recipe_ingredient.ingredient.name] += recipe_ingredient.quantity
    print(f"NEEDED: {needed}")
    return needed


def all_stock(user):
    stock = {}
    stock_objects = Stock.objects.filter(owner=user)
    for item in stock_objects:
        stock[f"{item.ingredient.name}"] = item.quantity
    print(f"STOCK: {stock}")
    return stock


# takes 2 dictionaries as arguments
def shop(needed, stock):
    list = {}
    for key in needed:
        if key in stock:
            if needed[key] - stock[key] > 0:
                list[f"{key}"] = needed[key] - stock[key]
        else:
            list[f"{key}"] = needed[key]
    print(f"SHOP: {list}")
    return list


# takes 2 dictionaries as arguments
def planned_stock(needed, stock):
    list = {}
    for ingredient in stock:
        if ingredient in needed:
            list[ingredient] = stock[ingredient] - needed[ingredient]
        else:
            list[ingredient] = stock[ingredient]
    print(f"PLANNED_STOCK: {list}")
    return list

# updates doable property in db and returns a dictionaty of the recipes doable states
def checkDoable(user):
    print("\n"*3)
    recipes = Recipe.objects.filter(owner=user)
    d_needed = all_needed_ingredients(user)
    d_stock = all_stock(user)
    d_planned_stock = planned_stock(d_needed, d_stock)
    doable = {}
    for recipe in recipes:
        recipe_ingredients = recipe.ingredients.all()
        counter = 0
        for recipe_ingredient in recipe_ingredients:
            if recipe.todo == True:
                if recipe_ingredient.ingredient.name not in d_stock or d_planned_stock[recipe_ingredient.ingredient.name] < 0:
                    recipe.doable = False
                    recipe.save()
                    print(f"DOABLE: {recipe.doable}, PLANNED: {recipe.todo}, RECIPE: {recipe.title}")
                    doable[recipe.id] = recipe.doable
                    break
                counter += 1
            else:
                if recipe_ingredient.ingredient.name not in d_stock or recipe_ingredient.quantity > d_planned_stock[recipe_ingredient.ingredient.name]:
                    recipe.doable = False
                    recipe.save()
                    print(f"DOABLE: {recipe.doable}, PLANNED: {recipe.todo}, RECIPE: {recipe.title}")
                    doable[recipe.id] = recipe.doable
                    break
                counter += 1
        if counter == len(recipe_ingredients):
            recipe.doable = True
            recipe.save()
            print(f"DOABLE: {recipe.doable}, PLANNED: {recipe.todo}, RECIPE: {recipe.title}")
            doable[recipe.id] = recipe.doable
    return doable



@login_required
def shopping_list(request):
    user = get_user(request)
    print('\n'*4)

    d_needed = all_needed_ingredients(user)

    d_stock = all_stock(user)

    d_shop = shop(d_needed, d_stock)

    planned_stock(d_needed, d_stock)

    shop_list = Shopping_List.objects.all()

    for x, y in d_shop.items():
    
        ingredient = Ingredient.objects.get(name=x)
        quantity = int(y)
        owner = get_user(request)

        try:
            item = Shopping_List.objects.get(owner=owner, ingredient=ingredient)
        except:
            Shopping_List.objects.create(owner=owner, ingredient=ingredient, quantity=quantity)
        else:
            item.quantity = quantity
            item.save()

    for element in shop_list:
        if element.ingredient.name not in d_shop.keys():
            element.delete()

    shop_list = Shopping_List.objects.all().order_by('ingredient__ailse','ingredient__name','-quantity')
    all_recipes_to_do = Recipe.objects.filter(owner=user, todo=True)

    return render(request, 'food/shopping_list.html', {
        'recipes': all_recipes_to_do,
        "shop_list": shop_list,
    })


####################################################################
### api ############################################################
####################################################################


@login_required
def recipe_management(request, recipe_id, action):
    user = get_user(request)

    if action == "checkDoable":
        return JsonResponse(checkDoable(user))

    try: 
        recipe = Recipe.objects.get(pk=recipe_id)
    except:
        return render(request, 'food/error.html', {
            "message": "Sorry, this recipe doesn't exist."
        })

    if action == "checkPlanned":
        return JsonResponse({
            "planned": f"{recipe.todo}", 
            "recipe": f"{recipe.title}"
        })        

    if action == "unplan":
        recipe.todo = False
        recipe.save()
        return JsonResponse({
            "planned": f"{recipe.todo}",
            "recipe": f"{recipe.title}"
        })

    if action == "plan":
        recipe.todo = True
        recipe.save()
        return JsonResponse({
            "planned": f"{recipe.todo}",
            "recipe": f"{recipe.title}"
        })

    if action == "wasCooked":
        all_recipe_ingredients = recipe.ingredients.all()       
        status = {}
        for recipe_ingredient in all_recipe_ingredients:
            stock_exist = Stock.objects.filter(owner=user, ingredient=recipe_ingredient.ingredient)
            if stock_exist:
                if stock_exist[0].quantity > recipe_ingredient.quantity:
                    new_quantity = stock_exist[0].quantity - recipe_ingredient.quantity
                    stock_exist[0].quantity = new_quantity
                    stock_exist[0].save()
                    status[f"{recipe_ingredient.ingredient.name}"] = f"AVAILABLE {new_quantity + recipe_ingredient.quantity} - {recipe_ingredient.quantity} = {new_quantity}"
    
                elif stock_exist[0].quantity <= recipe_ingredient.quantity:
                    stock_exist[0].delete()
                    status[f"{recipe_ingredient.ingredient.name}"] = "STOCK DELETED"
            else:
                status[f"{recipe_ingredient.ingredient.name}"] = "WAS NOT IN STOCK"

        return JsonResponse({
            "status": f"{status}"
        })
    
    if action == "delete":
        if recipe:
            title = recipe.title
            recipe.delete()
        return JsonResponse({
            "status": f"{title} deleted"
        })



@login_required
def add_ingredient_to_recipe(request, recipe, ingredient_id, quantity):
    recipe = Recipe.objects.get(title=recipe.capitalize())
    ingredient = Ingredient.objects.get(pk=ingredient_id)
    quantity = int(quantity)
    
    recipe_ingredient = Recipe_Ingredient.objects.create(
        recipe=recipe,
        ingredient=ingredient,
        quantity=quantity
    )

    return JsonResponse({
        "ingredient": f"{recipe_ingredient.ingredient.name}",
        "quantity": f"{recipe_ingredient.quantity}",
        "unit": f"{recipe_ingredient.ingredient.unit}"
    })



@login_required
def save_recipe(request, title, recipe):
    user = get_user(request)
    recipe = re.sub("<br>", "\n", recipe)
    title_exists = Recipe.objects.filter(title=title.capitalize(), owner=user)
    if title_exists:
        return JsonResponse({
            "status": "ERROR: title already exists"
        })
    else:
        new_recipe = Recipe.objects.create(
            title = title.capitalize(),
            owner = request.user,
            recipe = recipe
        )
        return JsonResponse({
            "status": f"recipe created, title: {new_recipe.title}, owner: {new_recipe.owner}, recipe: {new_recipe.recipe}"
        })


@login_required
def stock_management(request, action, ingredient_id, ingredient_quantity):
    ingredient = Ingredient.objects.get(pk=ingredient_id)
    user = get_user(request)
    stock_exists = Stock.objects.filter(owner=user, ingredient=ingredient)
    if stock_exists:
        stock = stock_exists[0]
        if action == "add":
            stock.quantity += int(ingredient_quantity)
            stock.save()
        elif action == "remove":
            if stock.quantity - int(ingredient_quantity) <= 0:
                stock.delete()
                return JsonResponse({
                    "status": f"{stock.ingredient} stock deleted"
                })
            stock.save()
    else:
        stock = Stock.objects.create(
            owner=user, ingredient=ingredient, quantity=int(ingredient_quantity)
        )
    return JsonResponse({
        "status": "stock updated", 
        "ingredient": f"{stock.ingredient.name} {stock.quantity} {stock.ingredient.unit.unit}"
    })