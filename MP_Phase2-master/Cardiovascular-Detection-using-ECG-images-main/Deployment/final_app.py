import streamlit as st
from Ecg import ECG

ecg = ECG()

def model_call(uploaded_file):
    if uploaded_file is not None:
        ecg_user_image_read = ecg.getImage(uploaded_file)
        
        # Convert to grayscale
        ecg_user_gray_image_read = ecg.GrayImgae(ecg_user_image_read)
        
        # Divide leads
        dividing_leads = ecg.DividingLeads(ecg_user_image_read)
        
        # Preprocess leads
        ecg_preprocessed_leads = ecg.PreprocessingLeads(dividing_leads)
        
        # Extract signals
        ec_signal_extraction = ecg.SignalExtraction_Scaling(dividing_leads)
        
        # Convert to 1D signal
        ecg_1dsignal = ecg.CombineConvert1Dsignal()
        
        # Dimensionality reduction
        ecg_final = ecg.DimensionalReduciton(ecg_1dsignal)
        
        # Predict using ML model
        ecg_model = ecg.ModelLoad_predict(ecg_final)
        
        return ecg_model  # Return prediction result
