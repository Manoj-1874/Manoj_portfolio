# RetinaGuard: Hybrid Clinical Decision Support System (CDSS)

## Core Architectural Decisions
- **Hybrid Diagnostic Engine:** Combines a Deep Learning Convolutional Neural Network (CNN) with a deterministic 10-Expert Rule-Based Engine. This hybrid approach ensures that the "black box" nature of AI is corroborated by hard clinical evidence (e.g., measuring vessel density, bone spicules, and optic disc pallor).
- **Microservice API Design:** Built as a stateless RESTful API using Flask, allowing easy integration with web or mobile clinical frontends.
- **Staged Pipeline Execution:** 
  1. **Image Quality Assessment:** Pre-filters out blurry, low-contrast, or non-retinal images.
  2. **Modality Detection:** Automatically detects Fluorescein Angiography vs. Color Fundus photos and adjusts logic thresholds accordingly.
  3. **Feature Extraction:** Runs parallel computer vision algorithms to quantify structural biomarkers.
  4. **Decision Engine:** Synthesizes CNN probabilities with clinical features using a strict rule-based triad system.
- **Variant Handling System:** Explicit decision pathways to detect rare variants like RP Sine Pigmento (RP without pigment), Retinitis Punctata Albescens (RPA), and Sectoral RP.

## Technologies Used
- **Backend & API:** Python 3.11, Flask, Flask-CORS, Requests
- **Machine Learning & AI:** TensorFlow, Keras (h5 model deployment)
- **Computer Vision:** OpenCV (cv2)
- **Data Processing & Math:** NumPy, SciPy

## Database Schemas & Data Structures
RetinaGuard operates primarily as a stateless analytical inference engine, receiving base64 image data and returning structured JSON analyses.
**Core API Response Schema:**
```json
{
  "patientId": "String",
  "diagnosis": "String (HEALTHY | RP_POSITIVE | RP_SINE_PIGMENTO | etc.)",
  "severity": "String (MILD | MODERATE | CRITICAL)",
  "composite_score": "Float",
  "is_angiography": "Boolean",
  "triad_status": {
    "bone_spicules": "Boolean",
    "vessel_attenuation": "Boolean",
    "optic_disc_pallor": "Boolean"
  },
  "expert_opinions": "Array<Object>",
  "differential_diagnosis": {
    "top_diagnosis": "String",
    "probabilities": "Object<String, Float>"
  },
  "xai_explanation": "String (Explainable AI narrative)"
}
```

## Significant Performance & Security Optimizations
- **Performance Optimizations:**
  - **Field of View (FOV) Masking:** Algorithms restrict computation to the actual retinal area, discarding black background pixels to save CPU cycles and improve statistical accuracy.
  - **Vectorized Operations:** Extensive use of NumPy array slicing and masking over nested loops for image thresholding and entropy mapping.
  - **Hardware Acceleration:** TensorFlow configured to utilize GPU acceleration for the initial CNN inference pass.
- **Clinical Security & Safety:**
  - **Garbage-In, Garbage-Out (GIGO) Prevention:** Strict image quality checks reject non-eye objects or highly blurred images before processing.
  - **Context-Aware Thresholding:** Adjusts diagnostic thresholds based on patient demographics (Age, Ethnicity) to prevent biological variances from causing false positives.
  - **Explainable AI (XAI) Focus:** Generates a human-readable justification for every diagnosis, ensuring clinicians don't blindly trust the AI.
  - **Strict Threshold Calibration:** Rule-engine constraints specifically tuned to prevent high False Positive rates (e.g., adding an AI confidence minimum to the Sine Pigmento pathway to prevent healthy retinas with naturally low vessel density from being misclassified).
