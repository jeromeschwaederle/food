from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Unit, Ingredient, Recipe, Recipe_Ingredient, Stock, Aisle, Shopping_List

class AdminStock(admin.ModelAdmin):
    list_display = ('ingredient', 'quantity',)

class AdminRecipe(admin.ModelAdmin):
    list_display = ('title',)


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Unit)
admin.site.register(Aisle)
admin.site.register(Ingredient)
admin.site.register(Stock, AdminStock)
admin.site.register(Recipe, AdminRecipe)
admin.site.register(Recipe_Ingredient)
admin.site.register(Shopping_List)