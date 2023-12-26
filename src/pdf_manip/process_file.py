from pypdf import PdfWriter, PdfReader  # watermark
from pypdf import PdfMerger
from PIL import Image
import img2pdf
import magic


def merge_PDFs(pdfs):
    # basic merger pattern
    merger = PdfMerger()

    for pdf in pdfs:
        pdf.seek(0)
        mime_type = magic.from_buffer(pdf.read(1024), mime=True)
        print(mime_type)

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
def watermark(source_pdf, watermark):
    # check if the watermark is a pdf
    try:
        check = PdfReader(watermark)

        # valid pdf
        watermark = check.pages[0]
    except Exception:
        # Exception, he file is not a valid PDF
        # -> do nothing, keep as img file
        pass

    writer = PdfWriter(clone_from=source_pdf)

    for page in writer.pages:
        # here set to False for watermarking
        page.merge_page(watermark, over=False)

    writer.write("../media/temp/result.pdf")
