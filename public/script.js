// script.js file

document.addEventListener('DOMContentLoaded', function () {
    const resultContainer = document.getElementById('result');
    const reader = document.getElementById('reader');

    const scanner = new Html5QrcodeScanner(reader.id, {
        qrbox: { width: 250, height: 250 },
        fps: 20,
    });

    scanner.render(success, error);

    function success(result) {
        resultContainer.innerHTML = `
            <h2>Success!</h2>
            <p><a href="${result}">${result}</a></p>
        `;
        scanner.clear();
        reader.remove();
    }

    function error(err) {
        console.error(err);
    }
});
