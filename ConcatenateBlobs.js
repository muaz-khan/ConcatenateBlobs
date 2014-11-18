// Last time updated at Nov 18, 2014, 08:32:23

// Latest file can be found here: https://cdn.webrtc-experiment.com/ConcatenateBlobs.js

// Muaz Khan    - www.MuazKhan.com
// MIT License  - www.WebRTC-Experiment.com/licence
// Source Code  - https://github.com/muaz-khan/ConcatenateBlobs
// Demo         - https://www.WebRTC-Experiment.com/ConcatenateBlobs/

// ___________________
// ConcatenateBlobs.js

// Simply pass array of blobs.
// This javascript library will concatenate all blobs in single "Blob" object.

(function() {
    window.ConcatenateBlobs = function(blobs, type, callback) {
        var buffers = [];

        var index = 0;

        function readAsArrayBuffer() {
            if (!blobs[index]) {
                return concatenateBuffers();
            }
            var reader = new FileReader();
            reader.onload = function(event) {
                buffers.push(event.target.result);
                index++;
                readAsArrayBuffer();
            };
            reader.readAsArrayBuffer(blobs[index]);
        }

        readAsArrayBuffer();

        function concatenateBuffers() {
            var byteLength = 0;
            buffers.forEach(function(buffer) {
                byteLength += buffer.byteLength;
                // TODO(datermine): Figure out if this is necessary.
                if (buffer.byteLength % 2 != 0) {
                    // byteLength--;
                }
            });
            var tmp = new Uint16Array(byteLength);

            var lastOffset = 0;
            buffers.forEach(function(buffer) {
                // BYTES_PER_ELEMENT == 2 for Uint16Array
                var bufferByteLength = buffer.byteLength;
                if (bufferByteLength % 2 != 0) {
                    // NOTE(datermine): Uses to delete, now we use slice.
                    // delete buffer[bufferByteLength - 1];
                    buffer = buffer.slice(0, bufferByteLength - 1)
                    
                    // NOTE(datermine): Once we slice instead of delete, this is really
                    // no longer necessary as it's the same as buffer.byteLength
                    // bufferByteLength -= 1;
                }
                tmp.set(new Uint16Array(buffer), lastOffset);
                
                // NOTE(datermine): We could just use buffer.byteLength here.
                lastOffset += bufferByteLength;
            });

            var blob = new Blob([tmp.buffer], {
                type: type
            });

            callback(blob);
        }
    };
})();
