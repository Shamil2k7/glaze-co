import os
import glob
import cv2
import numpy as np
from PIL import Image

def process_frame(frame):
    h, w, _ = frame.shape
    
    # 1. Clean watermark in bottom right
    y1, y2 = int(h * 0.78), int(h * 0.90)
    x1, x2 = int(w * 0.88), int(w * 0.95)
    crop = frame[y1:y2, x1:x2]
    bg_local = crop[5, 5].astype(float)
    diff_wm = np.linalg.norm(crop.astype(float) - bg_local, axis=2)
    mask = (diff_wm > 18).astype(np.uint8) * 255
    if np.sum(mask) > 0:
        kernel = np.ones((5, 5), np.uint8)
        dilated = cv2.dilate(mask, kernel, iterations=2)
        frame[y1:y2, x1:x2] = cv2.inpaint(crop, dilated, 7, cv2.INPAINT_TELEA)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB).astype(float)
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV).astype(float)
    
    # Donut core detection
    is_donut_core = (hsv[:,:,2] < 180) | (hsv[:,:,0] < 20) | (hsv[:,:,1] < 140)
    
    # Shadow detection
    is_shadow = (hsv[:,:,2] >= 180) & (hsv[:,:,2] < 235) & (hsv[:,:,0] >= 18) & (hsv[:,:,0] <= 32) & (hsv[:,:,1] > 150)
    
    # Spatial radial constraint around center (866, 526)
    Y, X = np.ogrid[:h, :w]
    spatial_dist = np.sqrt(((X - 866) / 510.0)**2 + ((Y - 526) / 370.0)**2)
    spatial_mask = spatial_dist < 1.05
    
    alpha = np.zeros((h, w), dtype=float)
    alpha[is_donut_core & spatial_mask] = 1.0
    
    shadow_pixels = is_shadow & spatial_mask & ~is_donut_core
    alpha[shadow_pixels] = (235.0 - hsv[shadow_pixels, 2]) / 55.0 * 0.75
    
    alpha = cv2.GaussianBlur(alpha, (7, 7), 2)
    alpha[spatial_dist >= 1.0] = 0.0
    
    out_rgba = np.zeros((h, w, 4), dtype=np.uint8)
    out_rgba[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    out_rgba[:, :, 3] = np.clip(alpha * 255, 0, 255).astype(np.uint8)
    
    return out_rgba

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
            
        rgba = process_frame(frame)
        resized_rgba = cv2.resize(rgba, (target_w, target_h), interpolation=cv2.INTER_AREA)
        pil_im = Image.fromarray(resized_rgba, mode='RGBA')
        
        out_path = os.path.join(seq_dir, f"frame_{frame_idx:03d}.webp")
        pil_im.save(out_path, "WEBP", quality=90)
        
        if frame_idx == 0:
            pil_im.save(os.path.join(seq_dir, "fallback.webp"), "WEBP", quality=90)
            
        frame_idx += 1
        if frame_idx % 20 == 0 or frame_idx == total_frames:
            print(f"Processed frame {frame_idx}/{total_frames} as transparent RGBA WebP")
            
    cap.release()
    print("All frames extracted with transparent alpha background and zero watermark!")

if __name__ == "__main__":
    main()
