from django.shortcuts import render
from django.views.generic.edit import FormView
from .forms import FileFieldForm
from django.urls import reverse
from .process_file import merge_PDFs


# Create your views here.

# base class for upload files and display sucess page
class FileFieldFormView(FormView):
    form_class = FileFieldForm

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
            print("I'm here")
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
class MergeFileFormView (FileFieldFormView):
    def __init__(self):
        super().__init__("merge", "merge.html", reverse("merge-sucess"))
