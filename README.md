# FOODAPP

## Goals

This software attempts to help everyone to manage food and food supplies. 

The idea primarily comes from my struggle to organize meals throughout the week and to shop for supplies accordingly.


FOODAPP intends to make this process easy and frictionless.

## Video presentation
You will find a video presentation [here](https://youtu.be/qOZgxGUN3rs).
#### Eratum
English is not my mother tongue, they may be some flaw in this regard in this documentation.
## Setting up
### To run the application on a Django development server
You need:
* Python3+
* pip
* Django

installed on your system.
### Make all necessary configurations
In the **food/** directory,  run 
```bash
python manage.py migrate
```
#### Once all migrations are applied, you need to create a superuser
```bash
python manage.py createsuperuser
```
Povide a username, email and password

#### To finally run the application:

```bash
python manage.py runsever
```
#### Admin interface
In your browser, go to /admin and log in with the credentials you just created.



As administrator, you have to make all the ingredient objects that are to be used by users to create and save their recipes, edit their shopping-list and manage their stock.

For each ingredient, you can add a url to provide an image but it is not required.

In addition, you will have to create the units in which ingredients are denominated. I advise you to create 3 : 
* g (grammes)
* mL (milliliters)
* piece (for ingredients for which it makes more sense)

This last one (piece) is needed for templates to display correctly information.


### As user
#### First step
You have to register with your first and last name, an email address and set up a password.


#### Second step
The first time you use the software, once you have registered, you have to write down your favorite recipes.
In my understanding, we all regularly cook between 5 and 20 recipes. The most important is that the ingredient list and quantities for each ingredient are accurate in each recipe.


#### Third step
You have to enter the ingredients that you already have at home into your "Stock".
 

## Usage

Once you have made all the necessary setups, starts the real value of this software.


### My Recipes (planning)
On the index page "My Recipes" you can see all the recipes you have saved.


Simply click on the "Plan" button in order to plan the recipe. You can now either "un-plan" it or mark it as "done" which will deselect the recipe and remove the recipe's ingredients from your stock if they were there.


If a green badge "ingredients" appears on the left side of the recipe title, it means that considering all the currently planned recipes, you have all the necessary ingredients in stock to cook this recipe. This allows you to plan the maximum amount of recipes using what you already have in stock.
### Shopping List
Once you have planned all the recipes you want, going to “Shopping List” will display all ingredients/quantities that you need to buy in order to cook everything you have planned.
After you've been at the grocery store, simply click "Add all to stock" to add all the ingredients to your stock.


The shopping list is sorted by aisle, then alphabetically.


### My Stock
This is where you manage your stock, keep it up to date to make the best out of the app.
The stock items are sorted alphabetically
 

## Distinctiveness and Complexity

My project, as a personal food-management/meal-planification application, strongly differs from an e-commerce site or a social network.
### Django
My project utilizes Django:
* In **models.py** are 8 models, all registered in **admin.py** to allow administrators full control
* In **urls.py** are 8 url paths for the views, and 4 url paths for apis
* I created a **forms.py** file for my "ModelForm" class forms
* In **views.py** are 8 view fonctions, 5 helper functions and 4 apis fonctions
* 10 templates
   * 7 extend **template/food/layout.html**
   * 2 extend **template/food/ingredient_list.html** which extends **template/food/layout.html**
 
### Javascript
My project utilizes raw JavaScript (4 files) located in the **static/food** folder and Bootstrap v5.1.3 on the front-end.
 
### Index view
On the index view, all the user's saved recipes are displayed in alphabetical order.
* "New Recipe" button
   * If clicked, loads a 3 steps process to create a new recipe
* "Plan" buttons
   * If clicked, plans the recipe. Once a recipe is marked as planned, the application will take its ingredients into account to render the shopping list and display or hide the green "ingredients" badges
      * The initial button turns to an "Un-plan" button and a "Done" button appears on the right
* "Un-plan" buttons
   * If clicked, un-plans the according recipe.
* "Done" buttons
   * If clicked, removes all the necessary ingredients from Stock and Un-plans the recipe
* "Delete" buttons
   * If clicked, deletes the according recipe
 
### New Recipe view
This is a 3 step process to create and save a new recipe.
#### First step: Write Recipe
Here you have to write a title and the recipe itself. You have to write at least one character in "Title" and one character in "Recipe" in order to access the second step. Each title **MUST** be unique. Click "Add Ingredients" to go to the second step.
#### Second step: Add Ingredients
This is where you add all necessary ingredients and quantities to your recipe. All users have access to ingredients created by an administrator. 

I strongly suggest using the text input field to filter ingredients' names. It will match every possible substring in the ingredient's name. The unit for each ingredient appears in gray. Only digits are allowed in this input field, otherwise, the "Add to recipe" button on the right will stay disabled. Clicking the "Add to recipe" button will add the ingredient and quantities to the recipe. Repeat this process for all ingredients (you need to have at least one ingredient in your recipe to go to the last step, otherwise the "Check and Save" button will stay disabled).
#### Third step: Check And Save
The last step is only there to help you make sure everything is as it should. At any moment, you can go back or further in the process to make some corrections.
If all is ok, click "Save Recipe". The recipe is saved and you are taken to the index page.
### Shopping List view
Here you can see a list of your planned recipes and a list of the ingredients that you need but don't have in stock.
* "Add all to stock" button
   * If clicked, adds all the shopping list ingredients/quantities to your stock
### My stock view
This is where you manage your stock.
* "Show my Stock" button
   * If clicked, changes to "Hide my stock",  if you have ingredients in stock, shows all of them. You can individually remove them or add others. You can add quantities, but to edit for less quantity you have to remove the stock and create a new one with less quantity


