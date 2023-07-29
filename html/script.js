function updateUI(status, json) {
    const statusLabel = document.getElementById('statusLabel');
    statusLabel.textContent = status;

    if (json) {
        const jsonTextbox = document.getElementById('jsonTextbox');
        jsonTextbox.value = JSON.stringify(json, null, 2);
    }
}
