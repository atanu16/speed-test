function startTest() {
    const downloadUrl = "https://i.ibb.co/vYqv0F1/Blog-2250x2250.png"; // URL to a sample file for download
    const uploadUrl = "/upload"; // URL to handle file upload on the server
    const fileSizeInBytes = 10000000; // Increase file size to 10 MB for more accurate measurements
    const uploadData = new Blob([new ArrayBuffer(fileSizeInBytes)]); // 10 MB blob for upload test

    const numTests = 3; // Number of test runs to average results

    document.getElementById('result').innerText = 'Testing...';

    Promise.all([
        measureDownloadSpeed(downloadUrl, fileSizeInBytes, numTests),
        measureUploadSpeed(uploadUrl, uploadData, numTests),
        measureLatency(downloadUrl, numTests)
    ])
    .then(([downloadSpeed, uploadSpeed, latency]) => {
        document.getElementById('result').innerText = `Download Speed: ${downloadSpeed.toFixed(2)} Mbps\n`;
        document.getElementById('result').innerText += `Upload Speed: ${uploadSpeed.toFixed(2)} Mbps\n`;
        document.getElementById('result').innerText += `Latency: ${latency.toFixed(2)} ms`;
    })
    .catch(error => {
        console.error('Error during the speed test:', error);
        document.getElementById('result').innerText = 'Error during the speed test.';
    });
}

function measureDownloadSpeed(url, fileSizeInBytes, numTests) {
    return new Promise((resolve, reject) => {
        let totalSpeed = 0;

        function runTest() {
            const startTime = new Date().getTime();

            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const endTime = new Date().getTime();
                    const durationInSeconds = (endTime - startTime) / 1000;
                    const bitsLoaded = fileSizeInBytes * 8;
                    const speedBps = bitsLoaded / durationInSeconds;
                    const speedMbps = speedBps / (1024 * 1024);
                    totalSpeed += speedMbps;

                    if (numTests > 1) {
                        numTests--;
                        runTest();
                    } else {
                        resolve(totalSpeed / numTests);
                    }
                })
                .catch(reject);
        }

        runTest();
    });
}

function measureUploadSpeed(url, data, numTests) {
    return new Promise((resolve, reject) => {
        let totalSpeed = 0;

        function runTest() {
            const startTime = new Date().getTime();
            const formData = new FormData();
            formData.append('file', data);

            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(() => {
                const endTime = new Date().getTime();
                const durationInSeconds = (endTime - startTime) / 1000;
                const bitsLoaded = data.size * 8;
                const speedBps = bitsLoaded / durationInSeconds;
                const speedMbps = speedBps / (1024 * 1024);
                totalSpeed += speedMbps;

                if (numTests > 1) {
                    numTests--;
                    runTest();
                } else {
                    resolve(totalSpeed / numTests);
                }
            })
            .catch(reject);
        }

        runTest();
    });
}

function measureLatency(url, numTests) {
    return new Promise((resolve, reject) => {
        let totalLatency = 0;

        function runTest() {
            const startTime = new Date().getTime();

            fetch(url, { method: 'HEAD' })
                .then(() => {
                    const endTime = new Date().getTime();
                    const latency = endTime - startTime;
                    totalLatency += latency;

                    if (numTests > 1) {
                        numTests--;
                        runTest();
                    } else {
                        resolve(totalLatency / numTests);
                    }
                })
                .catch(reject);
        }

        runTest();
    });
}
