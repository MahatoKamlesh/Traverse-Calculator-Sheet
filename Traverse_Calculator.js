document.addEventListener('DOMContentLoaded', () => {
    const x1 = document.getElementById("myknownX1");
    const y1 = document.getElementById("myknownY1");
    const x2 = document.getElementById("myknownX2");
    const y2 = document.getElementById("myknownY2");
    const bearingButton = document.getElementById("bearing");
    const bearingResult = document.getElementById("bearingresult");

    const nAngle = document.getElementById("myinputnumber1");
    const inputBoxAngles = document.getElementById("inputboxAngles");
    const submitButton = document.getElementById("submitbutton1");

    function getBearing() {
        const x1Value = parseFloat(x1.value);
        const y1Value = parseFloat(y1.value);
        const x2Value = parseFloat(x2.value);
        const y2Value = parseFloat(y2.value);
        if (isNaN(x1Value) || isNaN(y1Value) || isNaN(x2Value) || isNaN(y2Value)) {
            bearingResult.textContent = "Please enter valid coordinates for both stations.";
            return;
        }
        const dx = x2Value - x1Value;
        const dy = y2Value - y1Value;
        let bearing = Math.atan2(dx, dy) * (180 / Math.PI);
        if (bearing < 0) {
            bearing += 360;
        }
        bearingResult.textContent = 'The bearing of line 12 is: ' + bearing.toFixed(2) + '°';
    }
    bearingButton.addEventListener('click', getBearing);

    function getnAngles() {
        const numberOfAngles = parseInt(nAngle.value, 10);
        if (isNaN(numberOfAngles) || numberOfAngles <= 0) {
            alert("Please enter a valid number greater than 0.");
            return;
        } else if (numberOfAngles < 3) {
            alert("A minimum of three angles is required for a closed traverse.");
            return;
        }

        inputBoxAngles.innerHTML = "";
        for (let i = 0; i < numberOfAngles; i++) {
            const inputBox = document.createElement("input");
            inputBox.type = "number";
            inputBox.placeholder = "Enter Angle " + (i + 1) + ":";
            inputBox.className = "angleInputBox";
            inputBoxAngles.appendChild(inputBox);
            inputBoxAngles.appendChild(document.createElement("br"));
        }

        if (!document.getElementById('calculateButton')) {
            const calculateButton = document.createElement('button');
            calculateButton.textContent = 'Calculate Closing Error';
            calculateButton.id = 'calculateButton';
            inputBoxAngles.appendChild(calculateButton);
            calculateButton.addEventListener('click', storeAngle);
        }
    }

    function storeAngle() {
        const inputBoxes = document.querySelectorAll('.angleInputBox');
        let angles = [];

        for (let i = 0; i < inputBoxes.length; i++) {
            const angleValue = parseFloat(inputBoxes[i].value);
            if (!isNaN(angleValue)) {
                angles.push(angleValue);
            } else {
                alert('Please enter a valid number for Angle ' + (i + 1) + ":");
                return;
            }
        }

        let observedAngle = 0;
        for (let i = 0; i < angles.length; i++) {
            observedAngle += angles[i];
        }

        const actualAngle = (angles.length - 2) * 180;
        const correction = actualAngle - observedAngle;
        const disCorrection = correction / angles.length;

        inputBoxAngles.innerHTML += "<br>Total Observed Angle Sum: " + observedAngle.toFixed(2) + "°<br>";
        inputBoxAngles.innerHTML += "Total Actual Angle Sum: " + actualAngle.toFixed(2) + "°<br>";
        inputBoxAngles.innerHTML += "Error: " + correction.toFixed(2) + "°<br><br><strong>Corrected Angles:</strong><br>";

        for (let i = 0; i < angles.length; i++) {
            const correctedAngle = angles[i] + disCorrection;
            const correctedInputBox = document.createElement("input");
            correctedInputBox.type = "text";
            correctedInputBox.value = 'Angle ' + (i + 1) + ": " + correctedAngle.toFixed(3) + "°";
            correctedInputBox.disabled = true;
            correctedInputBox.className = "correctedAngleBox";
            inputBoxAngles.appendChild(correctedInputBox);
            inputBoxAngles.appendChild(document.createElement("br"));
        }

        if (!document.getElementById('calculateBearingsButton')) {
            const calculateBearingsButton = document.createElement('button');
            calculateBearingsButton.textContent = 'Calculate Bearings';
            calculateBearingsButton.id = 'calculateBearingsButton';
            inputBoxAngles.appendChild(calculateBearingsButton);
            calculateBearingsButton.addEventListener('click', calculateBearings);
        }
    }

    function calculateBearings() {
        const correctedAngles = document.querySelectorAll('.correctedAngleBox');
        const initialBearing = parseFloat(bearingResult.textContent.split(":")[1]);
        let currentBearing = initialBearing;

        const bearingsContainer = document.createElement('div');
        bearingsContainer.id = 'bearingsContainer';
        inputBoxAngles.appendChild(bearingsContainer);

        bearingsContainer.innerHTML += '<strong>Calculated Bearings:</strong><br>';

        const initialBearingBox = document.createElement("input");
        initialBearingBox.type = "text";
        initialBearingBox.value = 'Bearing 1: ' + currentBearing.toFixed(2) + "°";
        initialBearingBox.disabled = true;
        initialBearingBox.className = "bearingBox";
        bearingsContainer.appendChild(initialBearingBox);
        bearingsContainer.appendChild(document.createElement("br"));

        for (let i = 0; i < correctedAngles.length; i++) {
            const angleValue = parseFloat(correctedAngles[i].value.split(":")[1]);
            currentBearing = calculateNewBearing(currentBearing, angleValue);

            const bearingInputBox = document.createElement("input");
            bearingInputBox.type = "text";
            bearingInputBox.value = "Bearing " + (i + 2) + ": " + currentBearing.toFixed(2) + "°";
            bearingInputBox.disabled = true;
            bearingInputBox.className = "bearingBox";
            bearingsContainer.appendChild(bearingInputBox);
            bearingsContainer.appendChild(document.createElement("br"));
        }

        if (!document.getElementById('enterDistanceButton')) {
            const enterDistanceButton = document.createElement('button');
            enterDistanceButton.textContent = 'Enter Distance';
            enterDistanceButton.id = 'enterDistanceButton';
            inputBoxAngles.appendChild(enterDistanceButton);
            enterDistanceButton.addEventListener('click', enterDistance);
        }
    }

    function calculateNewBearing(previousBearing, includedAngle) {
        let newBearing;
        if (previousBearing < 180) {
            newBearing = previousBearing + 180 + includedAngle;
            if (newBearing >= 360) {
                newBearing -= 360;
            }
        } else {
            newBearing = previousBearing - 180 + includedAngle;
            if (newBearing < 0) {
                newBearing += 360;
            }
        }
        return newBearing;
    }

    function enterDistance() {
        // Implementation for distance input can be added here
    }

    submitButton.addEventListener('click', getnAngles);
});
