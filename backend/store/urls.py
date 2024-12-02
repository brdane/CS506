from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *
from . import views

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', UserRegistrationAPIView.as_view(), name='user_register'),
    path('api/products/', ProductList.as_view(), name='product-list'),
    path('api/product/<int:id>/', ProductDetailAPIView.as_view(), name='product_detail'),
    path('api/cart/', CartAPIView.as_view(), name='cart'),  # For getting and adding items to the cart
    path('api/cart/item/<int:item_id>/', CartItemUpdateAPIView.as_view(), name='update_cart_item'), # Update or delete cart items
    path('api/checkout/', PlaceOrderAPIView.as_view(), name='checkout'),
    path('api/orders/<int:pk>/', RetrieveOrderAPIView.as_view(), name='retrieve_order'),
    path('index.html', views.index, name='index'),
    path('signup.html', views.signup, name='signup'),
    path('login.html', views.login_page, name='login'),
    path('cart.html', views.view_cart, name='cart'),
]
