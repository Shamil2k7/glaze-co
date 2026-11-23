import os
import glob
import cv2
import numpy as np
from PIL import Image

def clean_watermark(frame):
    h, w, _ = frame.shape
    # Watermark region in full frame (1920x1080):
    # around y=850..960, x=1690..1800
    y1, y2 = int(h * 0.78), int(h * 0.90)
    x1, x2 = int(w * 0.88), int(w * 0.95)
    
    crop = frame[y1:y2, x1:x2]
    bg_local = crop[5, 5].astype(float)
    diff = np.linalg.norm(crop.astype(float) - bg_local, axis=2)
    mask = (diff > 18).astype(np.uint8) * 255
    if np.sum(mask) > 0:
        kernel = np.ones((5, 5), np.uint8)
        dilated = cv2.dilate(mask, kernel, iterations=2)
        frame[y1:y2, x1:x2] = cv2.inpaint(crop, dilated, 7, cv2.INPAINT_TELEA)
    return frame

def adjust_background_to_target(frame, target_rgb=(255, 217, 0)):
    # target_bgr = [B, G, R]
    target_bgr = np.array([target_rgb[2], target_rgb[1], target_rgb[0]], dtype=float)
    h, w, _ = frame.shape
    
    # Video background is approximately BGR [69, 202, 246]
    bg_color = np.array([69., 202., 246.])
    diff_bg = np.linalg.norm(frame.astype(float) - bg_color, axis=2)
    
    # Smooth background factor (0 = pure background, 1 = donut)
    bg_factor = np.clip((diff_bg - 22) / 65.0, 0, 1)
    
    shifted = frame.astype(float).copy()
    delta = target_bgr - bg_color
    for c in range(3):
        shifted[:, :, c] += delta[c] * (1 - bg_factor)
        
    # Feather outer borders so margins are 100% target_bgr
    edge_x = int(w * 0.16)
    edge_y = int(h * 0.16)
    
    wx = np.ones(w)
    wx[:edge_x] = np.linspace(0, 1, edge_x)
    wx[-edge_x:] = np.linspace(1, 0, edge_x)
    
    wy = np.ones(h)
    wy[:edge_y] = np.linspace(0, 1, edge_y)
    wy[-edge_y:] = np.linspace(1, 0, edge_y)
    
    weight_grid = np.outer(wy, wx)
    feathered = shifted.copy()
    for c in range(3):
        feathered[:, :, c] = feathered[:, :, c] * weight_grid + target_bgr[c] * (1 - weight_grid)
        
    return np.clip(feathered, 0, 255).astype(np.uint8)

def main():
    base_dir = r"d:\Mini_Project\donat_website"
    seq_dir = os.path.join(base_dir, "public", "assets", "donut-sequence")
    os.makedirs(seq_dir, exist_ok=True)
    
    video_files = glob.glob(os.path.join(base_dir, "asset", "*.mp4"))
    if not video_files:
        print("No video file found!")
        return
        
    video_path = video_files[0]
    print(f"Reading video: {video_path}")
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Total frames: {total_frames}")
    
    target_w = 960
    target_h = 540
    
    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        # 1. Inpaint watermark
        cleaned = clean_watermark(frame)
        
        # 2. Adjust background to exact hero section #FFD900 (RGB: 255, 217, 0)
        adjusted = adjust_background_to_target(cleaned, target_rgb=(255, 217, 0))
        
        # 3. Resize and convert to PIL
        resized = cv2.resize(adjusted, (target_w, target_h), interpolation=cv2.INTER_AREA)
        rgb_frame = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
        pil_im = Image.fromarray(rgb_frame)
        
        # Save as WebP
        out_path = os.path.join(seq_dir, f"frame_{frame_idx:03d}.webp")
        pil_im.save(out_path, "WEBP", quality=88)
        
        if frame_idx == 0:
            pil_im.save(os.path.join(seq_dir, "fallback.jpg"), "JPEG", quality=92)
            
        frame_idx += 1
        if frame_idx % 20 == 0 or frame_idx == total_frames:
            print(f"Processed frame {frame_idx}/{total_frames}")
            
    cap.release()
    print("All 94 sequence frames processed with watermark removed and #FFD900 background matched!")
    
    # Also clean any corner artifacts from uploaded donuts
    donuts_dir = os.path.join(base_dir, "public", "assets", "donuts")
    for fname in ['white-choco.jpg', 'oreo-crunch.jpg']:
        fpath = os.path.join(donuts_dir, fname)
        if os.path.exists(fpath):
            im = cv2.imread(fpath)
            h, w, _ = im.shape
            # corner inpainting
            corner = im[h-80:h, w-80:w]
            bg = corner[5, 5].astype(float)
            diff = np.linalg.norm(corner.astype(float) - bg, axis=2)
            mask = (diff > 20).astype(np.uint8) * 255
            if np.sum(mask) > 0:
                kernel = np.ones((5, 5), np.uint8)
                dilated = cv2.dilate(mask, kernel, iterations=2)
                im[h-80:h, w-80:w] = cv2.inpaint(corner, dilated, 5, cv2.INPAINT_TELEA)
                cv2.imwrite(fpath, im)
                # also update webp
                webp_path = os.path.splitext(fpath)[0] + '.webp'
                Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB)).save(webp_path, 'WEBP', quality=90)
                print(f"Cleaned corner artifact from {fname}")

if __name__ == "__main__":
    main()
