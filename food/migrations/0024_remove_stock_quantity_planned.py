# Generated by Django 4.0 on 2022-01-20 10:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('food', '0023_alter_stock_quantity_alter_stock_quantity_planned'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stock',
            name='quantity_planned',
        ),
    ]
