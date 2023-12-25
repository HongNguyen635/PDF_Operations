from pypdf import PdfWriter, PdfReader  # watermark
from pypdf import PdfMerger


def merge_PDFs(pdfs):
    # basic merger pattern
    merger = PdfMerger()

    for pdf in pdfs:
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
    except Exception as e:
        # Exception, he file is not a valid PDF
        # -> do nothing, keep as img file
        pass

    writer = PdfWriter(clone_from=source_pdf)

    for page in writer.pages:
        # here set to False for watermarking
        page.merge_page(watermark, over=False)

    writer.write("../media/temp/result.pdf")
