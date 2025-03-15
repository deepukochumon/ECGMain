Step 1 : Downloading Python 3.7

goto : https://www.python.org/downloads/release/python-379/  
download 64 bit python and install 

Step 2 : Activating Environment and Running Project 


conda activate ecg_env
cd Deployment
streamlit run final_app.py




How i installed venv:


py -3.7 -m venv venv_ecg 
venv_ecg\Scripts\activate



Using Docker :: 


docker build -t my-streamlit-app .

docker run -p 8080:8080 my-streamlit-app
