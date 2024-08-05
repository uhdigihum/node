
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('myfile').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            
            if (file.size > 131072000) {
                alert('file size too big\nlimit is 125 MB');
                document.getElementById('myfile').value = "";
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                document.getElementById('inputArea').value = content;
            };
            reader.readAsText(file);
        } else {
            return;
        }
    });
});

function submitForm() {

    const teksti = document.getElementById("inputArea").value;
    laheta(teksti);

}

function submitFile(file) { 
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const fileContent = e.target.result;
        laheta(fileContent);
    };
    
    reader.onerror = function(e) {
        alert('Error reading file: ' + e.target.error);
    };
    
    reader.readAsText(file[0]);
}

function laheta(teksti) {

    fetch('/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: teksti
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("outputArea").value = data;
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function clearFile() {
    document.getElementById('myfile').value= "";
    document.getElementById('inputArea').value= "";
    document.getElementById('outputArea').value= null;
}

function download() {
    data = document.getElementById('outputArea').value;
    var file = new Blob([data], {type: String});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, "result.txt");
    else {
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = "result.txt";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

