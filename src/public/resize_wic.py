from PIL import Image
import sys

def resize_image(input_path, scale_factor):
    try:
        img = Image.open(input_path)
        print(f"Original size: {img.size}")
        
        new_size = (img.size[0] * scale_factor, img.size[1] * scale_factor)
        
        # Use LANCZOS for high quality downsampling/upsampling
        resized_img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        resized_img.save(input_path)
        print(f"Resized to: {resized_img.size}")
        print("Saved successfully.")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    resize_image('wic.png', 5)
