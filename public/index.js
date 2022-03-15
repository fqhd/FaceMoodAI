const video = document.getElementById('ourVideo');

function setupVideo(){
    navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => console.error(err)
    );
}

function findExpression(expressions){
    let highest = 'neutral';
    let num = 0;
    for(e in expressions){
        if(expressions[e] > num){
            num = expressions[e];
            highest = e;
        }
    }
    return highest;
}

const htmlExpression = document.getElementById('expression');
document.getElementById('submit').onclick = async () => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: 'whats up'
    };

    const fetchResponse = await fetch('/sendData', options);
    const response = await fetchResponse.json();
    console.log(response);
}

async function initFaceAPI(){
    await faceapi.loadSsdMobilenetv1Model('/models');
    await faceapi.loadTinyFaceDetectorModel('/models');
    await faceapi.loadFaceLandmarkModel('/models');
    await faceapi.loadFaceLandmarkTinyModel('/models');
    await faceapi.loadFaceRecognitionModel('/models');
    await faceapi.loadFaceExpressionModel('/models');
}

function main(){
    initFaceAPI().then(() => {
        video.addEventListener('play', () => {
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
                let expression = 'unsure :/';
                if(detections[0]?.expressions){
                    expression = findExpression(detections[0].expressions);
                }
                htmlExpression.textContent = expression;
            }, 1000);
        });
        setupVideo();
    });
}

main();

