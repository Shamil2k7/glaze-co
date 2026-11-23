import os
import cv2
import numpy as np
from PIL import Image

def transparentize_donut(img_path, out_path):
    im = cv2.imread(img_path)
    if im is None: return
    h, w, _ = im.shape
    
    # Inpaint any corner watermark
    y1, y2 = int(h * 0.8), h
    x1, x2 = int(w * 0.8), w
    crop = im[y1:y2, x1:x2]
    bg_local = crop[5, 5].astype(float)
    diff_wm = np.linalg.norm(crop.astype(float) - bg_local, axis=2)
    mask = (diff_wm > 18).astype(np.uint8) * 255
    if np.sum(mask) > 0:
        kernel = np.ones((5, 5), np.uint8)
        dilated = cv2.dilate(mask, kernel, iterations=2)
        im[y1:y2, x1:x2] = cv2.inpaint(crop, dilated, 7, cv2.INPAINT_TELEA)

    rgb = cv2.cvtColor(im, cv2.COLOR_BGR2RGB).astype(float)
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV).astype(float)
    
    # Donut center is around (w/2, h/2)
    cx, cy = w / 2, h / 2
    Y, X = np.ogrid[:h, :w]
    spatial_dist = np.sqrt(((X - cx) / (w * 0.46))**2 + ((Y - cy) / (h * 0.44))**2)
    
    # Yellow background has H around 25..35, S > 160, V > 200
    is_donut_core = (hsv[:,:,2] < 185) | (hsv[:,:,0] < 22) | (hsv[:,:,1] < 150)
    is_shadow = (hsv[:,:,2] >= 185) & (hsv[:,:,2] < 235) & (hsv[:,:,0] >= 18) & (hsv[:,:,0] <= 33) & (hsv[:,:,1] > 150)
    
    alpha = np.zeros((h, w), dtype=float)
    alpha[is_donut_core & (spatial_dist < 1.05)] = 1.0
    
    shadow_pixels = is_shadow & (spatial_dist < 1.05) & ~is_donut_core
    alpha[shadow_pixels] = (235.0 - hsv[shadow_pixels, 2]) / 50.0 * 0.75
    
    alpha = cv2.GaussianBlur(alpha, (9, 9), 2)
    alpha[spatial_dist >= 1.0] = 0.0
    
    out_rgba = np.zeros((h, w, 4), dtype=np.uint8)
    out_rgba[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    out_rgba[:, :, 3] = np.clip(alpha * 255, 0, 255).astype(np.uint8)
    
    Image.fromarray(out_rgba, mode='RGBA').save(out_path, 'WEBP', quality=90)
    print(f"Saved transparent donut: {out_path}")

def main():
    base_dir = r"d:\Mini_Project\donat_website\public\assets\donuts"
    for name in ['chocolate-glazed', 'strawberry-sprinkle', 'oreo-crunch', 'caramel-crunch', 'white-choco']:
        src = os.path.join(base_dir, f"{name}.jpg")
        dest = os.path.join(base_dir, f"{name}.webp")
        transparentize_donut(src, dest)

if __name__ == "__main__":
    main()
