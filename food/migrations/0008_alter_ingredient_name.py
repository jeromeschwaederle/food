# Generated by Django 4.0 on 2021-12-16 09:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('food', '0007_recipe_alter_ingredient_name_alter_ingredient_unit_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredient',
            name='name',
            field=models.CharField(max_length=32, unique=True),
        ),
    ]
