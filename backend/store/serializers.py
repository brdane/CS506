from rest_framework import serializers
from .models import Product, CustomUser, Cart, CartItem, OrderItem, Order


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'password', 'email', 'phone_number', 'address']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class ProductSerializer(serializers.ModelSerializer):
    in_stock = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'stock', 'image', 'in_stock']

    def get_in_stock(self, obj):
        return True if obj.stock > 0 else False


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.title')
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'quantity', 'product_price', 'total_price']

    def get_total_price(self, obj):
        return obj.product.price * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)
    total_cost = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['user', 'cart_items', 'total_cost']

    def get_total_cost(self, obj):
        return sum(item.product.price * item.quantity for item in obj.cart_items.all())


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price', 'total_price']  # Include the fields you want to show in the response


# Serializer for the Order (the whole order with its items)
class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)  # Nested serializer for the related order items

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'total_amount', 'order_date', 'order_items']
        read_only_fields = ['id', 'user', 'order_date']
