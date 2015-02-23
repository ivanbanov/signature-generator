(function(win) {
    'use strict';

    function x() {
        console.log(true);
    }

    win.x = x;
}(window));