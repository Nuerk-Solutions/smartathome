import React from 'react';

export default function FileBase64({onDone, multiple}) {

    const handleChange = (e) => {
        let files = e.target.files;

        // Process each file
        const allFiles = [];
        for (let i = 0; i < files.length; i++) {

            let file = files[i];

            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {

                // Make a fileInfo Object
                let fileInfo = {
                    name: file.name,
                    type: file.type,
                    size: Math.round(file.size / 1000) + ' kB',
                    base64: reader.result,
                    file: file,
                };

                // Push it to the state
                allFiles.push(fileInfo);

                // If all files have been proceed
                if (allFiles.length == files.length) {
                    // Apply Callback function
                    if (multiple) onDone(allFiles);
                    else onDone(allFiles[0]);
                }
            }
        }
    }

    return (
        <input
            id="file-input"
            type={'file'}
            accept={'image/*'}
            onChange={(e) => handleChange(e)}
            multiple={multiple}
        />
    );

}
