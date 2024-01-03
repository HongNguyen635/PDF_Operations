from django import forms
import magic


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


# create this subclass so that all files will be validated
# for multiple files input
class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean

        # check if one or multiple files was uploaded
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)

        # validate file type
        for d in data:
            # Get the MIME type of the file content
            mime_type = magic.from_buffer(d.read(1024), mime=True)

            # Specify the allowed MIME types
            allowed_types = ['application/pdf', 'image/jpeg', 'image/png']

            if mime_type not in allowed_types:
                print("Mime type error")
                print(mime_type)
                raise forms.ValidationError(
                    "File type is not supported. Please upload a PDF, JPEG, or PNG file.")

        # return the clean result
        return result


# for single file input
class SingleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean

        result = single_file_clean(data, initial)

        # validate file type
        mime_type = magic.from_buffer(data.read(1024), mime=True)

        # Specify the allowed MIME types
        allowed_types = ['application/pdf', 'image/jpeg', 'image/png']

        if mime_type not in allowed_types:
            print("Mime type error")
            print(mime_type)
            raise forms.ValidationError(
                "File type is not supported. Please upload a PDF, JPEG, or PNG file.")

        # return the clean result
        return result


# multiple files input form: for merge
class MultipleFileFieldForm(forms.Form):
    file_field = MultipleFileField()

    # add tailwind class to the input
    file_field.widget.attrs.update({"class": "hidden"})

    # add id
    file_field.widget.attrs.update({"id": "file-upload"})

    # add accept type hint
    file_field.widget.attrs.update(
        {"accept": "application/pdf, image/png, image/jpeg"})


# single file input form: for compress
class CompressUploadFileForm(forms.Form):
    file = SingleFileField()

    # add tailwind class to the input
    file.widget.attrs.update({"class": "hidden"})

    # add id
    file.widget.attrs.update({"id": "upload-input-compress"})

    # add accept type hint
    file.widget.attrs.update({"accept": "application/pdf"})


# form for watermark
class WatermarkUploadForm(forms.Form):
    source_file = SingleFileField()
    watermark = SingleFileField()

    # add tailwind class to the input
    source_file.widget.attrs.update({"class": "hidden"})
    watermark.widget.attrs.update({"class": "hidden"})

    # add id
    source_file.widget.attrs.update({"id": "upload-input-watermark-source"})
    watermark.widget.attrs.update({"id": "upload-input-watermark-mark"})

    # add accept type hint
    source_file.widget.attrs.update({"accept": "application/pdf"})
    watermark.widget.attrs.update(
        {"accept": "application/pdf, image/png, image/jpeg"})


# form for encryption
class EncryptionUploadForm(forms.Form):
    file = SingleFileField()
    password = forms.CharField(
        max_length=32, widget=forms.PasswordInput, required=True)
    confirmed_password = forms.CharField(
        max_length=32, widget=forms.PasswordInput, required=True)

    # add tailwind class to the input
    file.widget.attrs.update({"class": "hidden"})

    # add id
    file.widget.attrs.update({"id": "upload-input-encrypt"})

    # add accept type hint
    file.widget.attrs.update({"accept": "application/pdf"})

    # add place holder
    password.widget.attrs.update(
        {"placeholder": "password",
         "id": "encrypt-password",
         "class": "text-black dark:text-white rounded py-1 px-2 border border-black border-solid dark:border-zinc-200 bg-white dark:bg-slate-800"})
    confirmed_password.widget.attrs.update(
        {"placeholder": "retype password",
         "id": "encrypt-password-retype",
         "class": "text-black dark:text-white rounded py-1 px-2 border border-black border-solid dark:border-zinc-200 bg-white dark:bg-slate-800"})
