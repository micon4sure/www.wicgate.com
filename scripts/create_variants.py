from PIL import Image, ImageFilter
import sys

def create_variants(input_path, scale_factor):
    try:
        img = Image.open(input_path)
        print(f"Original size: {img.size}")
        
        new_size = (img.size[0] * scale_factor, img.size[1] * scale_factor)
        
        # Variant A: Nearest Neighbor
        img_nearest = img.resize(new_size, Image.Resampling.NEAREST)
        img_nearest.save('wic_nearest.png')
        print(f"Saved wic_nearest.png: {img_nearest.size}")
        
        # Variant B: Lanczos + Sharpen
        img_lanczos = img.resize(new_size, Image.Resampling.LANCZOS)
        # Apply Unsharp Mask to reduce blurriness
        img_sharpened = img_lanczos.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
        img_sharpened.save('wic_sharpened.png')
        print(f"Saved wic_sharpened.png: {img_sharpened.size}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    create_variants('wic.png', 5)
