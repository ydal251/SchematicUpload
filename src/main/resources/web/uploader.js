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
        if (this.status === 404 || this.status === 500) {
            showMessage('Server error', 'red');
            return;
        }
        let jsonResponse = JSON.parse(this.responseText);
        let message = jsonResponse.message;
        if (this.status === 200) {
            let command = '//schem load ' + message;
            let successMessage = '<b>Successfully uploaded schematic</b><br/>\n' +
                'Use the in-game command to copy the schematic to your WorldEdit clipboard:<br/>\n' +
                'Note: FAWE has recently updated to V3 schematics, most schematics will be V2<br/>\n' +
                'All Litematica Conversions are V2. Remove "fast.2" from the command for V3 schematics'
            showMessage(successMessage, 'var(--accent-color)')
        } else {
            showMessage(message, 'red')
        }
    }

    xhr.open(form.method, form.action);
    xhr.send(data);
    showMessage("Uploading...", 'var(--main-white)')
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
    const allowedExtensions = /(\.schem|\.schematic|\.litematic)$/i;
    if (!allowedExtensions.exec(uploadedFile)) {
        return false;
    }

    /* Hard schematic size limit of 20mb for safety */
    return fileUpload.files[0].size <= 20000000;
};

function copyCommand() {
    /* Get the text field */
    let commandElement = document.getElementById('copy-area');

    /* Select the text field */
    commandElement.select();
    commandElement.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(commandElement.value).then(() => {
        document.getElementById('copied-confirmation').innerHTML = '(Copied!)';
    });
}