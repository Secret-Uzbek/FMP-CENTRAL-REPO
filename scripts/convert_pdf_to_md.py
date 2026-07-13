#!/usr/bin/env python3
"""
Конвертация PDF файлов в Markdown формат.
Использует PyMuPDF (fitz) для извлечения текста из PDF.

Требования: pip install PyMuPDF
"""

import os
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    print("❌ Ошибка: PyMuPDF не установлен.")
    print("   Установите его командой: pip install PyMuPDF")
    sys.exit(1)

def convert_pdf_to_md(pdf_path, output_dir=None):
    """Конвертирует PDF файл в Markdown."""
    if not os.path.exists(pdf_path):
        print(f"❌ Файл не найден: {pdf_path}")
        return None
    
    if output_dir is None:
        output_dir = os.path.dirname(pdf_path)
    
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    md_path = os.path.join(output_dir, f"{base_name}.md")
    
    print(f"\n📄 Конвертация: {pdf_path}")
    
    try:
        doc = fitz.open(pdf_path)
        md_content = f"# {base_name}\n\n"
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            
            if text.strip():
                md_content += f"## Страница {page_num + 1}\n\n"
                md_content += text + "\n\n"
        
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(md_content)
        
        print(f"✅ Создан: {md_path}")
        print(f"   Страниц обработано: {len(doc)}")
        return md_path
        
    except Exception as e:
        print(f"❌ Ошибка при конвертации: {e}")
        return None

def find_pdfs(directory='.'):
    """Находит все PDF файлы в директории."""
    pdf_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.pdf'):
                pdf_files.append(os.path.join(root, file))
    return pdf_files

def main():
    """Основная функция."""
    print("=" * 60)
    print("🔄 PDF to Markdown Converter")
    print("=" * 60)
    
    pdf_files = find_pdfs('.')
    
    if not pdf_files:
        print("\n⚠️ PDF файлы не найдены в текущей директории.")
        return
    
    print(f"\n📚 Найдено PDF файлов: {len(pdf_files)}")
    
    converted = 0
    for pdf_file in pdf_files:
        result = convert_pdf_to_md(pdf_file)
        if result:
            converted += 1
    
    print("\n" + "=" * 60)
    print(f"✅ Конвертация завершена: {converted}/{len(pdf_files)} файлов")
    print("=" * 60)

if __name__ == "__main__":
    main()
