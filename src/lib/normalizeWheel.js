// This is based on
// github.com/jquery/jquery-mousewheel/blob/master/jquery.mousewheel.js, which is
// somewhat similar to but more advanced than
// github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js

let LINE_HEIGHT = 16;
let PAGE_HEIGHT = 800;

let lowestDelta;
let nullLowestDeltaTimeout;

export default function normalizeWheel($event) {
  let event = $event.originalEvent || $event;
  let deltaX = 0;
  let deltaY = 0;

  // Old school scrollwheel delta
  if ('detail' in event) {
    deltaY = event.detail;
  }
  if ('wheelDelta' in event) {
    deltaY = -event.wheelDelta;
  }
  if ('wheelDeltaY' in event) {
    deltaY = -event.wheelDeltaY;
  }
  if ('wheelDeltaX' in event) {
    deltaX = -event.wheelDeltaX;
  }

  // New school wheel delta (wheel event)
  if ('deltaY' in event) {
    deltaY = event.deltaY;
  }
  if ('deltaX' in event) {
    deltaX = event.deltaX;
  }

  // No change actually happened, no reason to go any further
  if (deltaY === 0 && deltaX === 0) {
    return {
      x: 0,
      y: 0,
    };
  }

  // Need to convert lines and pages to pixels if we aren't already in pixels
  // There are three delta modes:
  //   * deltaMode 0 is by pixels, nothing to do
  //   * deltaMode 1 is by lines
  //   * deltaMode 2 is by pages
  if (event.deltaMode === 1) {
    deltaY *= LINE_HEIGHT;
    deltaX *= LINE_HEIGHT;
  } else if (event.deltaMode === 2) {
    deltaY *= PAGE_HEIGHT;
    deltaX *= PAGE_HEIGHT;
  }

  // Store lowest absolute delta to normalize the delta values
  let absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));
  let shouldAdjust = shouldAdjustOldDeltas(event, absDelta);

  if (!lowestDelta || absDelta < lowestDelta) {
    lowestDelta = absDelta;

    // Adjust older deltas if necessary
    if (shouldAdjust) {
      lowestDelta /= 40;
    }
  }

  // Adjust older deltas if necessary
  if (shouldAdjust) {
    // Divide all the things by 40!
    deltaX /= 40;
    deltaY /= 40;
  }

  // Get a whole, normalized value for the deltas
  //deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
  //deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

  // Clearout lowestDelta after sometime to better
  // handle multiple device types that give different
  // a different lowestDelta
  // Ex: trackpad = 3 and mouse wheel = 120
  if (nullLowestDeltaTimeout) {
    clearTimeout(nullLowestDeltaTimeout);
  }
  nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 500);

  return {
    x: deltaX,
    y: deltaY,
  };
}

function shouldAdjustOldDeltas(event, absDelta) {
  // If this is an older event and the delta is divisable by 120,
  // then we are assuming that the browser is treating this as an
  // older mouse wheel event and that we should divide the deltas
  // by 40 to try and get a more usable deltaFactor.
  // Side note, this actually impacts the reported scroll distance
  // in older browsers and can cause scrolling to be slower than native.
  // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
  return event.type === 'mousewheel' && absDelta % 120 === 0;
}

function nullLowestDelta() {
  lowestDelta = null;
}
