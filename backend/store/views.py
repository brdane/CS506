from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product, Cart, CartItem, Order, OrderItem
from .serializers import ProductSerializer, UserRegistrationSerializer, CartSerializer, CartItemSerializer, \
    OrderSerializer
from rest_framework.permissions import IsAuthenticated


# Create your views here.

class UserRegistrationAPIView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        try:
            # Fetch the product by ID
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the product
        serializer = ProductSerializer(product)
        return Response(serializer.data)


class CartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get or create the cart for the logged-in user
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        # Add a product to the cart
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get or create the cart for the logged-in user
        cart, created = Cart.objects.get_or_create(user=request.user)

        # Check if the product already exists in the cart
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        # if not created:
        # If the product is already in the cart, update the quantity
        cart_item.quantity = quantity
        cart_item.save()

        return Response(CartSerializer(cart).data)


class CartItemUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, item_id):
        # Update the quantity of an existing cart item
        try:
            cart_item = CartItem.objects.get(id=item_id)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.quantity = request.data.get('quantity', cart_item.quantity)
        cart_item.save()

        return Response(CartItemSerializer(cart_item).data)

    def delete(self, request, item_id):
        # Remove a cart item
        try:
            cart_item = CartItem.objects.get(id=item_id)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)

        if self.request.user == cart_item.cart.user:
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Not allowed"}, status=status.HTTP_401_UNAUTHORIZED)


class PlaceOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get the user's cart
        cart, created = Cart.objects.get_or_create(user=request.user)

        if not cart.cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Create the order
        order = Order.objects.create(user=request.user, total_amount=0)

        # Add cart items to the order
        for cart_item in cart.cart_items.all():
            order_item = OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
            remaining_stock = cart_item.product.stock - cart_item.quantity
            final_stock = remaining_stock if remaining_stock > 0 else 0
            cart_item.product.stock = final_stock
            cart_item.product.save()


        # Update the total amount for the order
        order.update_total_amount()

        # Clear the user's cart
        cart.cart_items.all().delete()

        return Response({"message": "Order placed successfully", "order_id": order.id}, status=status.HTTP_201_CREATED)


class RetrieveOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request, pk):
        try:
            # Get the order based on the pk (order id) and make sure it belongs to the authenticated user
            order = Order.objects.get(id=pk, user=request.user)

            # Serialize the order data
            serializer = OrderSerializer(order)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({"error": "Order not found or unauthorized access"}, status=status.HTTP_404_NOT_FOUND)
