from django.forms import ModelForm, widgets
from food.models import Recipe, User

class RegisterForm(ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']
        widgets = {
            'password': widgets.TextInput(attrs={'type': 'password'}),
            'first_name': widgets.TextInput(attrs={'autofocus': True})
        }


class LoginForm(ModelForm):
    class Meta:
        model = User
        fields = ['email', 'password']
        widgets = {
            'password': widgets.TextInput(attrs={'type': 'password'}),
            'email': widgets.EmailInput(attrs={'autofocus': True})
        }


class RecipeForm(ModelForm):
    class Meta:
        model = Recipe
        fields = ['title', 'recipe']
        widgets = {
            'title': widgets.TextInput(attrs={
                'autofocus': True,
                'id': 'recipe_title'
                }),
            'recipe': widgets.Textarea(attrs={
                'id': 'recipe_recipe',
                'rows': '10',
                'cols': '30'
            })
        }