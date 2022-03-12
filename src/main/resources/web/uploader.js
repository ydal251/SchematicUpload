/* Fetch the code from the URL params */
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
let code = params.upload_code;

window.onload = () => {
    /* Prefill the upload code if they followed the link */
    if (code != null) {
        document.getElementById('input-code').value = code;
    }

    document.getElementById('upload-button').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('message').innerHTML = "";

        if (!isCodeValid()) {
            showMessage('Please enter a valid code', 'red');
            return;
        }

        if (!isFileValid()) {
            showMessage('Please select a valid file', 'red');
            return;
        }

        postForm();
    });
};

function showMessage(message, color) {
    document.getElementById('message').style.color = color;
    document.getElementById('message').innerHTML = message;
}

function postForm() {
    let form = document.getElementById('upload-form');
    let data = new FormData(form);
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        let jsonResponse = JSON.parse(this.responseText);
        let message = jsonResponse.message;
        if (this.status === 200) {
            let successMessage = '<b>Successfully uploaded file</b><br/>\n' +
                'Use the following command in-game to use your schematic<br/>\n' +
                '<code>//schem load ' + message + '</code>'
            showMessage(successMessage, 'var(--accent-color)')
        } else {
            showMessage(message, 'red')
        }
    }

    xhr.open(form.method, form.action);
    xhr.send(data);
    showMessage("Uploading...", 'rgb(245, 245, 245)')
}

const isCodeValid = () => {
    let code = document.getElementById('input-code').value;
    if (code == null) {
        return false;
    }
    return code.length === 8;
};

const isFileValid = () => {
    let fileUpload = document.getElementById('file-upload');
    let uploadedFile = fileUpload.value;
    if (uploadedFile === '') {
        return false;
    }

    /* Only accept certain formats */
    if (!(uploadedFile.endsWith('.schem') || uploadedFile.endsWith('.schematic'))) {
        return false;
    }

    /* Hard schematic size limit of 5mb for safety */
    return fileUpload.files[0].size <= 5000000;
};