const fileInput = document.getElementById('fileInput');
const detectBtn = document.getElementById('detectBtn');
const previewImage = document.getElementById('previewImage');
const resultText = document.getElementById('resultText');
const loading = document.getElementById('loading');

let selectedFile = null;

fileInput.addEventListener('change', (e) => {
    selectedFile = e.target.files[0];

    if(selectedFile){
        previewImage.src = URL.createObjectURL(selectedFile);
    }
});

detectBtn.addEventListener('click', async () => {

    if(!selectedFile){
        alert('Please select image');
        return;
    }

    loading.style.display = 'block';

    const formData = new FormData();
    formData.append('image', selectedFile);

    try{

        const response = await fetch('/api/detect', {
            method:'POST',
            body: formData
        });

        const data = await response.json();

        console.log(data);

        resultText.innerText =
            data.detectedText || 'No detection found';

    }catch(err){
        console.error(err);
        resultText.innerText = 'Detection failed';
    }

    loading.style.display = 'none';
});
