"""Renderiza cada página de un PDF como JPG para QA visual."""
import sys, os, pypdfium2 as pdfium
src = sys.argv[1]
out_dir = sys.argv[2] if len(sys.argv) > 2 else 'slides-img'
os.makedirs(out_dir, exist_ok=True)
# limpia anteriores
for f in os.listdir(out_dir):
    if f.startswith('slide-'):
        os.remove(os.path.join(out_dir, f))
pdf = pdfium.PdfDocument(src)
n = len(pdf)
for i in range(n):
    img = pdf[i].render(scale=1.5).to_pil()
    name = f'slide-{i+1:02d}.jpg'
    img.save(os.path.join(out_dir, name), 'JPEG', quality=85)
    print(f' OK {name}')
print(f'\n{n} paginas renderizadas en {out_dir}/')
