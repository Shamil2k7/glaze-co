import os
import urllib.request
from PIL import Image

treats = {
    'chocolate-brownie.webp': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&auto=format&fit=crop&q=85',
    'blueberry-muffin.webp': 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=900&auto=format&fit=crop&q=85',
    'chocolate-cupcake.webp': 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=900&auto=format&fit=crop&q=85',
    'cinnamon-roll.webp': 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=900&auto=format&fit=crop&q=85',
    'chocolate-croissant.webp': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&auto=format&fit=crop&q=85',
    'mini-donut-box.webp': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=900&auto=format&fit=crop&q=85',
}

beverages = {
    'hot-coffee.webp': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=85',
    'cold-coffee.webp': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=900&auto=format&fit=crop&q=85',
    'chocolate-milkshake.webp': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900&auto=format&fit=crop&q=85',
    'strawberry-milkshake.webp': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=900&auto=format&fit=crop&q=85',
    'iced-latte.webp': 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=85',
}

base_dir = r"d:\Mini_Project\donat_website\public\assets"
treats_dir = os.path.join(base_dir, "treats")
beverages_dir = os.path.join(base_dir, "beverages")

os.makedirs(treats_dir, exist_ok=True)
os.makedirs(beverages_dir, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0'}

def download_and_convert(url, dest_path):
    temp_path = dest_path + ".temp"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp, open(temp_path, 'wb') as f:
        f.write(resp.read())
    im = Image.open(temp_path).convert('RGB')
    im.save(dest_path, 'WEBP', quality=88)
    if os.path.exists(temp_path):
        os.remove(temp_path)
    print(f"Saved: {dest_path}")

print("Downloading treats...")
for name, url in treats.items():
    p = os.path.join(treats_dir, name)
    download_and_convert(url, p)

print("\nDownloading beverages...")
for name, url in beverages.items():
    p = os.path.join(beverages_dir, name)
    download_and_convert(url, p)

print("All images downloaded and converted to WebP successfully!")
