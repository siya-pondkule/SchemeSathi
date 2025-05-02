import cv2
import numpy as np

def is_blurry(img, threshold=2.0, debug=True):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    if debug:
        print(f"[DEBUG] Blur Check - Laplacian Variance: {laplacian_var:.2f} (Threshold: {threshold})")
    return laplacian_var < threshold

def has_unusual_colors(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    avg_saturation = hsv[:, :, 1].mean()
    return avg_saturation > 180

def has_inconsistent_edges(img, debug=True):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 100, 200)
    edge_density = np.sum(edges > 0) / edges.size
    if debug:
        print(f"[DEBUG] Edge Density: {edge_density:.4f} (Typical: 0.002 - 0.10)")
    return edge_density > 0.10 or edge_density < 0.002
