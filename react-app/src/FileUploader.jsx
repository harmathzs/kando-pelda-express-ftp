import React, {Component} from 'react';

export default function FileUploader(props) {
    const onSubmit = async (e) => {
            e.preventDefault(); // prevent page reload

            const fileInput = document.getElementById('inputFile');
            const file = fileInput.files[0];
            if (!file) {
                  return alert("No file selected!");
            }

            console.log('🔁 Uploading file:', file.name);

            const formData = new FormData();
            formData.append('file', file);

            try {
                  const res = await fetch('http://localhost:3333/upload', {
                        method: 'POST',
                        body: formData,
                  });

                  const text = await res.text();
                  alert('✅ Upload finished: ' + text);
            } catch (err) {
                  console.error('❌ Upload error:', err);
                  alert('❌ Upload failed');
            }
      };

      return (
            <div className='card'>
                  <form onSubmit={onSubmit}>
                        <input id='inputFile' name='inputFile' type='file' /><br />
                        <button type='submit' id='uploadButton'>Upload to FTP</button>
                  </form>
            </div>
      );
}
