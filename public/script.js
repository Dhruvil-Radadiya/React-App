// script.js file

document.addEventListener('DOMContentLoaded', function () {
    const resultContainer = document.getElementById('result');

    function onScanSuccess(decodedText, decodedResult) {
        try {
            const qrData = JSON.parse(decodedText);

            if (qrData.tableNumber && qrData.menuPageLink) {
                resultContainer.innerHTML = `<strong>Table Number:</strong> ${qrData.tableNumber}`;
                setTimeout(() => {
                    window.location.href = qrData.menuPageLink;
                }, 3000); // Redirect after 3 seconds
            } else {
                resultContainer.innerHTML = `<strong>Error:</strong> Invalid QR Code data`;
            }
        } catch (error) {
            resultContainer.innerHTML = `<strong>Error:</strong> Failed to parse QR Code data`;
        }
    }

    function onScanFailure(error) {
        // You can choose to handle scan failure here, for example:
        console.warn(`Code scan error: ${error}`);
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
        "my-qr-reader", 
        { fps: 10, qrbox: 250 }
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
});
