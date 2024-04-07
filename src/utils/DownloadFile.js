export function downloadBase64File(base64, fileName) {
    const blob = base64ToBlob(base64);
    const blobURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('download', `${fileName}`);
    link.href = blobURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobURL)
}

export function base64ToBlob(base64) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray]);
}