# Generated by Django 4.0 on 2022-01-06 10:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('food', '0012_recipe_todo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stock',
            name='ingredient',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='food.ingredient'),
        ),
    ]
