from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic.edit import FormView
from django.urls import reverse
import magic
from .forms import MultipleFileFieldForm
from .forms import CompressUploadFileForm
from .forms import WatermarkUploadForm
from .forms import EncryptionUploadForm
from .process_file import merge_PDFs, compress_PDF, watermark, encrypt_PDF


# Create your views here.

# base class for upload multiple files and display sucess page
class MultipleFileFieldFormView(FormView):
    form_class = MultipleFileFieldForm

    def __init__(self, operation, template_name=None, success_url=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.operation = operation  # see what type operation to use
        self.template_name = template_name
        self.success_url = success_url

    # return the template for uploading

    def get_template_names(self):
        return [self.template_name] if self.template_name else super().get_template_names()

    # return the success page url

    def get_success_url(self):
        return self.success_url or super().get_success_url()

    # handle the post request

    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        if form.is_valid():
            return self.form_valid(form)
        else:
            print(form.errors)
            return self.form_invalid(form)

    # what to do if form is valid

    def form_valid(self, form):
        files = form.cleaned_data["file_field"]

        # depends on which operations to call
        if (self.operation == 'merge'):
            merge_PDFs(files)
        else:
            print("Cont")

        # implement other logics. Remember to delete the result file after user
        # log out or exit or reload the result page

        return super().form_valid(form)


# class for the merge view
class MergeFileFormView (MultipleFileFieldFormView):
    def __init__(self):
        super().__init__("merge", "merge.html", reverse("merge-success"))


# base view class for single file input
# view for the single upload file field
class SingleFileInputFormView(FormView):
    # form_class = SingleUploadFileForm

    def __init__(self, form_class, operation, template_name=None, success_url=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.form_class = form_class
        self.operation = operation  # see what type operation to use
        self.template_name = template_name
        self.success_url = success_url

    # return the template for uploading

    def get_template_names(self):
        return [self.template_name] if self.template_name else super().get_template_names()

    # return the success page url

    def get_success_url(self):
        return self.success_url or super().get_success_url()

    # handle the post request

    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        if form.is_valid():
            return self.form_valid(form)
        else:
            print(form.errors)
            return self.form_invalid(form)

    # what to do if form is valid

    def form_valid(self, form):

        # depends on which operations to call
        if (self.operation == 'compress'):
            file = form.cleaned_data["file"]
            compress_PDF(file)

        elif (self.operation == "watermark"):
            source_file = form.cleaned_data["source_file"]
            watermark_file = form.cleaned_data["watermark"]
            watermark(source_file, watermark_file)

        elif (self.operation == "encryption"):
            encrypt_file = form.cleaned_data["file"]
            password = form.cleaned_data["password"]
            encrypt_PDF(encrypt_file, password)

        else:
            print("Cont")

        # implement other logics. Remember to delete the result file after user
        # log out or exit or reload the result page

        return super().form_valid(form)


# class for the compress view
class CompressFileFormView(SingleFileInputFormView):
    def __init__(self):
        super().__init__(CompressUploadFileForm, "compress",
                         "compress.html", reverse("compress-success"))


# class for watermark view
class WatermarkFormView(SingleFileInputFormView):
    def __init__(self):
        super().__init__(WatermarkUploadForm, "watermark",
                         "watermark.html", reverse("watermark-success"))


# class for encryption view
class EncryptionFormView(SingleFileInputFormView):
    def __init__(self):
        super().__init__(EncryptionUploadForm, "encryption",
                         "encryption.html", reverse("encryption-success"))


# ---------------------
# view for organize pdf (will be fully implemented in the future)
def organize_view(request, *args, **kwargs):
    return render(request, 'organize.html')
