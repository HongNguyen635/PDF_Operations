from django import forms
import magic


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


# create this subclass so that all form will be validated
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


class FileFieldForm(forms.Form):
    file_field = MultipleFileField()

    # add tailwind class to the input
    file_field.widget.attrs.update({"class": "text-black"})

    # add id
    file_field.widget.attrs.update({"id": "file-upload"})
