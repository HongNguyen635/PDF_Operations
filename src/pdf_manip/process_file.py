from pypdf import PdfWriter, PdfReader
import img2pdf
import magic


def merge_PDFs(pdfs):
    # basic merger pattern
    merger = PdfWriter()

    for pdf in pdfs:
        pdf.seek(0)
        mime_type = magic.from_buffer(pdf.read(1024), mime=True)
        # print(mime_type)

        if mime_type in ['image/jpeg', 'image/png']:
            pdf.seek(0)  # reset

            # converting into chunks using img2pdf
            pdf_bytes = img2pdf.convert(pdf)

            # opening or creating temp pdf file for the img
            file = open("./media/temp/tempImg.pdf", "wb")
            file.write(pdf_bytes)
            file.close()

            # append to temp
            merger.append("./media/temp/tempImg.pdf")

        else:
            print("HERE")
            merger.append(pdf)

    merger.write("./media/temp/result.pdf")
    merger.close()


# watermark
def watermark(source_pdf, watermark_file):
    # check if the watermark is a pdf or img
    watermark_file.seek(0)  # reset
    mime_type = magic.from_buffer(watermark_file.read(1024), mime=True)

    if mime_type in ['image/jpeg', 'image/png']:
        watermark_file.seek(0)  # reset

        # converting into chunks using img2pdf
        pdf_bytes = img2pdf.convert(watermark_file)

        # opening or creating temp pdf file for the img
        file = open("./media/temp/tempImg.pdf", "wb")
        file.write(pdf_bytes)
        file.close()

        read_watermark = PdfReader("./media/temp/tempImg.pdf")

    else:
        # watermark is a pdf
        read_watermark = PdfReader(watermark_file)

    # only use 1st page if multiple pages are presented
    watermark_file = read_watermark.pages[0]

    writer = PdfWriter(clone_from=source_pdf)

    for page in writer.pages:
        # here set to False for watermarking
        page.merge_page(watermark_file, over=False)

    writer.write("./media/temp/result.pdf")


# compress
def compress_PDF(pdf):
    # removing duplication & reduce quality of images & lossless compression
    # reference: https://pypdf.readthedocs.io/en/stable/user/file-size.html
    reader = PdfReader(pdf)

    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    writer.add_metadata(reader.metadata)

    for page in writer.pages:
        # ⚠️ This has to be done on the writer, not the reader!
        page.compress_content_streams()  # This is CPU intensive!

        # reduce the image quality
        for img in page.images:
            img.replace(img.image, quality=80)

    with open("./media/temp/result.pdf", "wb") as f:
        writer.write(f)


# encrypt
def encrypt_PDF(pdf, password):
    reader = PdfReader(pdf)
    writer = PdfWriter()

    # Add all pages to the writer
    for page in reader.pages:
        writer.add_page(page)

    # Add a password to the new PDF
    writer.encrypt(password, algorithm="AES-256")

    # Save the new PDF to a file
    with open("./media/temp/result.pdf", "wb") as f:
        writer.write(f)
