from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenRefreshView

from accounts import urls as accounts_urls
from accounts.views import MyTokenObtainPairView
from workouts import urls as workouts_urls
from stats import urls as stats_urls

# Documentation schema
schema_view = get_schema_view(
    openapi.Info(
        title="Gymshare API",
        default_version='v1',
        description="API for Gymshare app.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=[],
)

urlpatterns = [
    path('workouts/', include(workouts_urls)),
    path('accounts/', include(accounts_urls)),
    path('admin/', admin.site.urls),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/password-reset/', include('django_rest_passwordreset.urls', namespace='password-reset')),
    path('stats/', include(stats_urls)),

    # Documentation urls
    re_path(r'^docs(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^docs/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
