import os
import glob
import cv2
import shutil
from PIL import Image

def main():
    base_dir = r"d:\Mini_Project\donat_website"
    uploaded_dir = r"C:\Users\DELL\.gemini\antigravity\brain\abd5ee45-7890-4c09-a8aa-feb9e52114e6\.user_uploaded"
    
    # Destination directories
    sequence_dir = os.path.join(base_dir, "public", "assets", "donut-sequence")
    donuts_dir = os.path.join(base_dir, "public", "assets", "donuts")
    treats_dir = os.path.join(base_dir, "public", "assets", "treats")
    beverages_dir = os.path.join(base_dir, "public", "assets", "beverages")
    
    for d in [sequence_dir, donuts_dir, treats_dir, beverages_dir]:
        os.makedirs(d, exist_ok=True)
        
    print("1. Copying donut reference images...")
    mapping = {
        'chocolate-glazed.jpg': 'media_1795355716026_ee90bb8c.jpg',
        'strawberry-sprinkle.jpg': 'media_1795355716092_6d3e289d.jpg',
        'white-choco.jpg': 'media_1795355716168_4e98d4ed.jpg',
        'caramel-crunch.jpg': 'media_1795355716308_fa6c8ebc.jpg',
        'oreo-crunch.jpg': 'media_1795355717013_eb4e88d6.jpg',
        'card-reference.jpg': 'media_1795355716426_66f5a2f5.jpg'
    }
    for dest_name, src_name in mapping.items():
        src_path = os.path.join(uploaded_dir, src_name)
        dest_path = os.path.join(donuts_dir, dest_name)
        if os.path.exists(src_path):
            shutil.copy2(src_path, dest_path)
            # Also save a webp version for performance
            im = Image.open(src_path)
            webp_name = os.path.splitext(dest_name)[0] + ".webp"
            im.save(os.path.join(donuts_dir, webp_name), "WEBP", quality=90)
            print(f"Copied {dest_name} and saved {webp_name}")
            
    print("\n2. Extracting video frames...")
    video_files = glob.glob(os.path.join(base_dir, "asset", "*.mp4"))
    if not video_files:
        print("No video file found in asset directory!")
        return
        
    video_path = video_files[0]
    print(f"Reading video: {video_path}")
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print(f"Total frames: {total_frames}, FPS: {fps}, Res: {orig_w}x{orig_h}")
    
    # We want square or 16:9 optimized frames.
    # In the video, the donut is centered around (866, 526).
    # Resizing to 1280x720 or 960x540 for web delivers crisp rendering with small footprint.
    target_w = 960
    target_h = 540
    
    frame_idx = 0
    saved_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        resized = cv2.resize(frame, (target_w, target_h), interpolation=cv2.INTER_AREA)
        # Convert BGR to RGB for PIL
        rgb_frame = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
        pil_im = Image.fromarray(rgb_frame)
        
        # Save as WebP
        out_path = os.path.join(sequence_dir, f"frame_{frame_idx:03d}.webp")
        pil_im.save(out_path, "WEBP", quality=85)
        
        # Also save first and last as fallback jpg
        if frame_idx == 0:
            pil_im.save(os.path.join(sequence_dir, "fallback.jpg"), "JPEG", quality=90)
            
        frame_idx += 1
        saved_count += 1
        
    cap.release()
    print(f"Successfully extracted {saved_count} frames to {sequence_dir}")

if __name__ == "__main__":
    main()
