from django.urls import path

from .import views

urlpatterns = [

    # views
    path('', views.index, name='index'),
    path('register', views.register, name='register'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('new-recipe', views.new_recipe, name='new_recipe'),
    path('stock', views.stock, name='stock'),
    path('recipe/<str:recipe_title>', views.recipe, name='recipe'),
    path('shopping-list', views.shopping_list, name='shopping'),

    # apis
    path('save_recipe/<str:title>/<str:recipe>', views.save_recipe),
    path('add_ingredient/<str:recipe>/<int:ingredient_id>/<int:quantity>', views.add_ingredient_to_recipe),
    path('recipe_management/<int:recipe_id>/<str:action>', views.recipe_management),
    path('stock_management/<str:action>/<int:ingredient_id>/<int:ingredient_quantity>', views.stock_management)
]