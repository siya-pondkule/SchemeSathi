from pdf2image import convert_from_path
import cv2
import pytesseract
import numpy as np
import os
import re
from utils import is_blurry, has_unusual_colors, has_inconsistent_edges
from rapidfuzz import fuzz

# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"D:\Project setup\tesseract.exe"

def is_document_fraudulent(file_path, expected_name="", doc_type="", expected_income=None):
    try:
        if file_path.lower().endswith(".pdf"):
            images = convert_from_path(file_path, dpi=300)
            if not images:
                return True, "No image extracted from PDF"
            img_pil = images[0]
            img = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
        else:
            img = cv2.imread(file_path)
            if img is None:
                return True, "Unable to read image"

        # Optional: Save image for manual review
        cv2.imwrite(f"debug_{os.path.basename(file_path)}.jpg", img)

        # Step 1: Blur check
        if is_blurry(img, threshold=8.0, debug=True):
            return True, "Document image is blurry — possibly altered"

        # Step 2: Color inconsistencies
        if has_unusual_colors(img):
            return True, "Color inconsistency detected — potential manipulation"

        # Step 3: Edge inconsistencies
        if has_inconsistent_edges(img):
            return True, "Edge inconsistency found — likely forged document"

        # Step 4: OCR-based content check
        text = pytesseract.image_to_string(img).lower()

        # ✅ Step 5: Name match (only for Aadhaar and Caste)
        if doc_type in ["aadhaar", "caste"]:
            match_score = fuzz.partial_ratio(expected_name.lower(), text)
            if match_score < 70:
                return True, f"{doc_type.capitalize()} name mismatch — score: {match_score}"

        # Step 6: Heuristic keyword + income check
        if "aadhaar" in text:
            if "male" not in text and "female" not in text:
                return True, "Missing gender info — possible manipulation"
        elif "ration" in text:
            if "public distribution system" not in text:
                return True, "Missing authority details — possibly fake"
        elif "income" in text:
            if "tax" not in text:
                return True, "Income tax information missing — potential fraud"

            if expected_income:
                numbers = re.findall(r'\b\d{5,}\b', text.replace(",", ""))
                extracted_income = max([int(n) for n in numbers], default=0)

                if extracted_income == 0:
                    return True, "Could not extract income amount from certificate"

                # ±10% tolerance
                lower_bound = expected_income * 0.9
                upper_bound = expected_income * 1.1
                if not (lower_bound <= extracted_income <= upper_bound):
                    return True, f"Mismatch in declared income — expected: {expected_income}, found: {extracted_income}"
        elif "caste" in text:
            if "reservation" not in text:
                return True, "Missing reservation category details — potential manipulation"

        return False, "Document appears genuine"

    except Exception as e:
        return True, f"Exception during detection: {e}"
