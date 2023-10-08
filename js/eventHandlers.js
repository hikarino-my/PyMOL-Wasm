export let pdb1 = "";
export let filename1="dummy1.pdb";
const dropArea1 = document.getElementById('drop-area1');
dropArea1.addEventListener('dragenter', (event)=> {
    event.stopPropagation();
    event.preventDefault();
    dropArea1.style.background = '#eee';
    }, false);
dropArea1.addEventListener('dragleave', (event) =>{
    event.stopPropagation();
    event.preventDefault();
    dropArea1.style.background = '#fff';
    }, false);
dropArea1.addEventListener('dragover', (event)=> {
    event.stopPropagation();
    event.preventDefault();
    dropArea1.style.background = '#eee';
    }, false);
dropArea1.addEventListener('drop', (event) =>{
    event.stopPropagation();
    event.preventDefault();
    dropArea1.style.background = '#fff';
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    // Check if the file name ends with ".gz"
    if (file.name.endsWith('.gz')) {
        reader.onload = function (event) {
        const compressedData = event.target.result;
        
        // Decompress the data using Pako
        const decompressed = pako.inflate(compressedData, { to: 'string' });
    
        ////console.log(decompressed);
        // Store the decompressed data
        pdb1 = decompressed;
        filename1 = file.name.replace("\.gz","");
        };
        // Read the file as an array buffer
        reader.readAsArrayBuffer(file);
    }else{
        if (file.name.endsWith('.pse')){		  
                if (file) {
                    const fileReader = new FileReader();		      
                    // Read the file as an ArrayBuffe		      
                    fileReader.onload = () => {
                        const arrayBuffer = fileReader.result;
                        // Convert the ArrayBuffer to a Uint8Array
                        pdb1 = new Uint8Array(arrayBuffer);
                        filename1 = file.name
                        // Write the binary data to the Pyodide virtual file system
            }
            fileReader.readAsArrayBuffer(file);
                }
        // Read the file as an array buffer		  
        }else{
        reader.onload = function (event) {
            const content = event.target.result;
            
            // Output the file contents to the ////console
            ////console.log(content);
            
            // Store the file contents
            pdb1 = content;
            filename1 = file.name
        };
        
        // Read the file as text
        reader.readAsText(file);
        }
    }
    dropArea1.textContent = file.name;
    }, false);
dropArea1.addEventListener('click', (event) =>{
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        // Check if the file name ends with ".gz"
        if (file.name.endsWith('.gz')) {
        reader.onload = function (event) {
            const compressedData = event.target.result;
            
            // Decompress the data using Pako
            const decompressed = pako.inflate(compressedData, { to: 'string' });
            ////console.log(decompressed);
            
            // Store the decompressed data
            pdb1 = decompressed;
            filename1 = file.name.replace("\.gz","");
        };
        
        // Read the file as an array buffer
        reader.readAsArrayBuffer(file);
        }else{
    if (file.name.endsWith('.pse')) {
                    if (file) {
                    const fileReader = new FileReader();		      
                    // Read the file as an ArrayBuffe
            
                    fileReader.onload = () => {
                        const arrayBuffer = fileReader.result;
                        // Convert the ArrayBuffer to a Uint8Array
                        pdb1 = new Uint8Array(arrayBuffer);
                        filename1 = file.name
                        // Write the binary data to the Pyodide virtual file system
            }
            fileReader.readAsArrayBuffer(file);
                }
    
        }else{
            reader.onload = function (event) {
            const content = event.target.result;
            
            // Output the file contents to the ////console
            ////console.log(content);
            
            // Store the file contents
            pdb1 = content;
            filename1 = file.name
            };
            
            // Read the file as text
            reader.readAsText(file);
        }
        
        }
        dropArea1.textContent = file.name;
    }
    input.click();
    }, false);
