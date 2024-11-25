from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import CustomUser, Product, Cart, CartItem, Order, OrderItem, Payment, Category, ProductCategory

admin.site.register(CustomUser)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)
admin.site.register(Category)
admin.site.register(ProductCategory)