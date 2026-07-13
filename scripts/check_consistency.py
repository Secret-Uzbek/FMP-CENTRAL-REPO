#!/usr/bin/env python3
"""
Проверка согласованности документации между языковыми версиями.
Сравнивает структуру заголовков в README.md, README_RU.md, README_UZ.md
"""

import re
import os
import sys

def extract_headers(file_path):
    """Извлекает все заголовки (H1, H2) из Markdown файла."""
    headers = []
    if not os.path.exists(file_path):
        return headers
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            match = re.match(r'^(#{1,2})\s+(.*)', line.strip())
            if match:
                headers.append(match.group(2).strip())
    return headers

def check_consistency():
    """Проверяет согласованность структуры между языковыми версиями."""
    files = ['README.md', 'README_RU.md', 'README_UZ.md']
    
    print("=" * 60)
    print("🔍 Проверка согласованности документации FMP")
    print("=" * 60)
    
    base_headers = extract_headers(files[0])
    print(f"\n📄 Базовый файл: {files[0]}")
    print(f"   Найдено заголовков: {len(base_headers)}")
    
    results = {'consistent': True, 'details': []}
    
    for file in files[1:]:
        current_headers = extract_headers(file)
        print(f"\n📄 Сравнение с {file}:")
        print(f"   Найдено заголовков: {len(current_headers)}")
        
        if len(base_headers) != len(current_headers):
            print(f"   ⚠️ Разное количество заголовков!")
            print(f"   Ожидается: {len(base_headers)}, Найдено: {len(current_headers)}")
            results['consistent'] = False
            results['details'].append({
                'file': file,
                'expected': len(base_headers),
                'found': len(current_headers)
            })
        else:
            print(f"   ✅ Структура совпадает по количеству разделов.")
    
    print("\n" + "=" * 60)
    if results['consistent']:
        print("✅ Все языковые версии имеют согласованную структуру!")
        return 0
    else:
        print("⚠️ Обнаружены расхождения в структуре документации.")
        print("   Рекомендуется синхронизировать разделы между языками.")
        return 1

if __name__ == "__main__":
    sys.exit(check_consistency())
