from django.db import models

# Create your models here.

# fix this later


class UploadedFiles(models.Model):
    file = models.FileField(upload_to='uploads/%Y/%m/%d/')

    def __str__(self) -> str:
        return self.file.name
