from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Unit(models.Model):
    unit = models.CharField(max_length=16)

    def __str__(self):
        return f"{self.unit}"


class Aisle(models.Model):
    name = models.CharField(max_length=32)

    def __str__(self):
        return f"{self.name}"


class Ingredient(models.Model):
    name = models.CharField(max_length=32, unique=True)
    image = models.URLField(blank=True, null=True)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="is_used_by")
    ailse = models.ManyToManyField(Aisle, related_name="ingredients_in_ailse" )

    def __str__(self):
        return f"{self.name}"


class Stock(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="stocks")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.BigIntegerField()

    def __str__(self):
        return f"STOCK OBJECT: {self.ingredient.name}: quantity:{self.quantity}"


class Recipe(models.Model):
    title = models.CharField(max_length=128)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")
    recipe = models.TextField()
    todo = models.BooleanField(default=False)
    doable = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title}"


class Recipe_Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="ingredients")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"RECIPE INGREDIENT: RECIPE: {self.recipe}, {self.ingredient.name} {self.quantity} {self.ingredient.unit}"


class Shopping_List(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shopping_list")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    
    def __str__(self):
        return f"SHOPPING: {self.ingredient.name}: {self.quantity} {self.ingredient.unit}"