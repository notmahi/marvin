/////////////////// EMOTION RECOGNIZER///////////////
/////////////////////////////////////////////////////////////
const video = document.getElementById('webcam');
const instruction = document.getElementById('caminstruct');
const liveView = document.getElementById('liveView');
const enableWebcamButton = document.getElementById('webcamButton');
const instructionText = document.getElementById("camiText");
const webcam_canvas = document.getElementById('webcam_canvas');
const cam_ctx = webcam_canvas.getContext('2d');
const width = 640
const height = 480
var model = true;
var model_emotion = undefined;
var control = false;
// Error fallback when webcam access is denied.
var errorCallback = function (error) {
    if (error.name == 'NotAllowedError') { instructionText.innerHTML = "Webcam Access Not Allowed"; }
    else if (error.name == 'PermissionDismissedError') { instructionText.innerHTML = "Permission Denied. Please provide Webcam Access."; }
};

function resetEverything() {
    control = false;
    console.log("Stopping Everything.");
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function (track) {
        track.stop();
    });

    video.srcObject = null;
    instruction.style.display = "flex";
    document.getElementById("cam_chart_main").style.left = "-225px";
    // 		document.getElementById("cam_chart_main").style.left = "-253px";
}

// Function to handle enableWebcamButton click.
// Takes video feed and the call predictWebcam function.
function enableCam(event) {
    // getUsermedia parameters to force video but not audio.
    control = true;
    const constraints = {
        audio: false,
        video: { width: 640, height: 480 },
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream;
        instruction.style.display = "none";
        document.getElementById("cam_chart_main").style.left = 0;
        video.addEventListener('loadeddata', predictWebcam);
        cameraaccess = true;
    })
        .catch(errorCallback)
}

//The main functioning starts from here. Check if webcam is supported/acceesible or not.
// Then loads the models and then wait for webcam permission.
// Check if webcam access is supported.

function getUserMediaSupported() {
    return (navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}
if (getUserMediaSupported()) {

    if (model && model_emotion) {
        enableWebcamButton.style.display = "inline-flex";
        instructionText.innerHTML = "Please provide Webcam Access."
    }

    else {
        instructionText.innerHTML = "Initializing assets 1/3";
        const detectorModel = faceapi.loadTinyFaceDetectorModel("/face-api.js/weights");

        detectorModel.then(() => {
            instructionText.innerHTML = "Initializing assets 2/3";

            const landmarkModel = faceapi.loadFaceLandmarkModel("/face-api.js/weights");

            landmarkModel.then(() => {
                instructionText.innerHTML = "Initializing assets 3/3";

                const expressionModel = faceapi.loadFaceExpressionModel("/face-api.js/weights");

                expressionModel.then(() => {
                    faceapi.nets.ssdMobilenetv1.loadFromUri('/face-api.js/weights').then(function () {
                        model_emotion = true;
                        if (model) {
                            enableWebcamButton.style.display = "inline-flex";
                            enableWebcamButton.classList.remove("removed");
                            instructionText.innerHTML = "Please provide Webcam Access."
                        }
                    });
                });
            });
        });
    }
    enableWebcamButton.addEventListener('click', enableCam);
} else {
    console.warn('getUserMedia() is not supported by your browser');
    instructionText.innerHTML = "getUserMedia() is not supported by your browser"
}


function predictWebcam() {
    // Get the webcam image data.
    cam_ctx.drawImage(video, 0, 0, width, height);

    faceapi.detectSingleFace(video).withFaceLandmarks().withFaceExpressions().then((predictions) => {
        if (predictions) {
            landmark = predictions['landmarks'];
            var predictedValue = predictions['expressions'];
            console.log(predictedValue);
            document.getElementById("angry").style.width = 100 * predictedValue['angry'] + "%";
            document.getElementById("disgust").style.width = 100 * predictedValue['disgusted'] + "%";
            document.getElementById("fear").style.width = 100 * predictedValue['fearful'] + "%";
            document.getElementById("happy").style.width = 100 * predictedValue['happy'] + "%";
            document.getElementById("sad").style.width = 100 * predictedValue["sad"] + "%";
            document.getElementById("surprise").style.width = 100 * predictedValue['surprised'] + "%";
            document.getElementById("neutral").style.width = 100 * predictedValue['neutral'] + "%";
        }
        // Call this function again to keep predicting when the browser is ready.
        if (control)
            window.requestAnimationFrame(predictWebcam);
    });
}
document.addEventListener('scroll', function (e) {
    if (control && (window.scrollY < 5400 || window.scrollY > 6000))
        resetEverything()
})