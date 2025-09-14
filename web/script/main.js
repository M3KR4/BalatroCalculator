import { documentData } from '../data/gameObjects.js';
import { createUI } from './UI/UIOrganizer.js';
import { restartValues } from './handScoring.js';
if (typeof document !== "undefined") {
    mouseMovesListener();
    createUI();
    restartValues();
}
function mouseMovesListener() {
    let mouseTimer;
    document.addEventListener('mousemove', function (e) {
        documentData.mouseIsMoving = true;
        documentData.mousePosition.x = e.pageX;
        documentData.mousePosition.y = e.pageY;
        clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => {
            documentData.mouseIsMoving = false;
        }, documentData.mouseStopTime);
    });
}
