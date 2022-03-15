const video = document.getElementById('ourVideo');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

function setupVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream){
        video.srcObject = stream;
    })
    .catch(function(error){
        console.error(error);
    });
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
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;
    ctx.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);
    const img64 = canvas.toDataURL();

    const data = { img64, keyword: htmlExpression.textContent };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
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

