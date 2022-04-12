
from django.contrib import admin
from django.urls import path, include
# from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from graphene_file_upload.django import FileUploadGraphQLView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path("graphql", csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    path("", include("authentication.urls"))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
