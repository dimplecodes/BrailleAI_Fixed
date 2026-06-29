const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({storage: multer.memoryStorage()});

app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.post('/api/detect', upload.single('image'), async(req,res)=>{

    try{

        const form = new FormData();

        form.append('image', req.file.buffer, {
            filename: req.file.originalname
        });

        const flaskRes = await fetch('http://localhost:8000/detect', {
            method:'POST',
            body: form,
            headers: form.getHeaders()
        });

        const data = await flaskRes.json();

        res.json(data);

    }catch(err){

        console.error(err);
        res.status(500).json({
            success:false,
            detectedText:'Server Error'
        });

    }

});

app.listen(5000, ()=>{
    console.log('Server running on http://localhost:5000');
});
