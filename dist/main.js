/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_13__["default"]),
/* harmony export */   "popperGenerator": () => (/* binding */ popperGenerator)
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_validateModifiers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/validateModifiers.js */ "./node_modules/@popperjs/core/lib/utils/validateModifiers.js");
/* harmony import */ var _utils_uniqueBy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/uniqueBy.js */ "./node_modules/@popperjs/core/lib/utils/uniqueBy.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");














var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (true) {
          var modifiers = (0,_utils_uniqueBy_js__WEBPACK_IMPORTED_MODULE_4__["default"])([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          (0,_utils_validateModifiers_js__WEBPACK_IMPORTED_MODULE_5__["default"])(modifiers);

          if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.options.placement) === _enums_js__WEBPACK_IMPORTED_MODULE_7__.auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = (0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_8__["default"])(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (true) {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_9__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_11__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (true) {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_12__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (true) {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    scaleX = element.offsetWidth > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !(0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__["default"])() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getClippingRect)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element, strategy) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element, strategy)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getCompositeRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) / element.offsetWidth || 1;
  var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getComputedStyle)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentElement)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentRect)
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getHTMLElementScroll)
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getLayoutRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeName)
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeScroll)
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOffsetParent)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");








function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
  var isIE = /Trident/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(currentNode)) {
    currentNode = currentNode.host;
  }

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_5__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getParentNode)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getScrollParent)
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getViewportRect)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getViewportRect(element, strategy) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = (0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__["default"])();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindow)
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScroll)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScrollBarX)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isElement": () => (/* binding */ isElement),
/* harmony export */   "isHTMLElement": () => (/* binding */ isHTMLElement),
/* harmony export */   "isShadowRoot": () => (/* binding */ isShadowRoot)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isLayoutViewport)
/* harmony export */ });
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__["default"])());
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isScrollParent)
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTableElement)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listScrollParents)
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "afterMain": () => (/* binding */ afterMain),
/* harmony export */   "afterRead": () => (/* binding */ afterRead),
/* harmony export */   "afterWrite": () => (/* binding */ afterWrite),
/* harmony export */   "auto": () => (/* binding */ auto),
/* harmony export */   "basePlacements": () => (/* binding */ basePlacements),
/* harmony export */   "beforeMain": () => (/* binding */ beforeMain),
/* harmony export */   "beforeRead": () => (/* binding */ beforeRead),
/* harmony export */   "beforeWrite": () => (/* binding */ beforeWrite),
/* harmony export */   "bottom": () => (/* binding */ bottom),
/* harmony export */   "clippingParents": () => (/* binding */ clippingParents),
/* harmony export */   "end": () => (/* binding */ end),
/* harmony export */   "left": () => (/* binding */ left),
/* harmony export */   "main": () => (/* binding */ main),
/* harmony export */   "modifierPhases": () => (/* binding */ modifierPhases),
/* harmony export */   "placements": () => (/* binding */ placements),
/* harmony export */   "popper": () => (/* binding */ popper),
/* harmony export */   "read": () => (/* binding */ read),
/* harmony export */   "reference": () => (/* binding */ reference),
/* harmony export */   "right": () => (/* binding */ right),
/* harmony export */   "start": () => (/* binding */ start),
/* harmony export */   "top": () => (/* binding */ top),
/* harmony export */   "variationPlacements": () => (/* binding */ variationPlacements),
/* harmony export */   "viewport": () => (/* binding */ viewport),
/* harmony export */   "write": () => (/* binding */ write)
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "afterMain": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterMain),
/* harmony export */   "afterRead": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterRead),
/* harmony export */   "afterWrite": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterWrite),
/* harmony export */   "applyStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.applyStyles),
/* harmony export */   "arrow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.arrow),
/* harmony export */   "auto": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.auto),
/* harmony export */   "basePlacements": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements),
/* harmony export */   "beforeMain": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeMain),
/* harmony export */   "beforeRead": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeRead),
/* harmony export */   "beforeWrite": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeWrite),
/* harmony export */   "bottom": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom),
/* harmony export */   "clippingParents": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents),
/* harmony export */   "computeStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.computeStyles),
/* harmony export */   "createPopper": () => (/* reexport safe */ _popper_js__WEBPACK_IMPORTED_MODULE_4__.createPopper),
/* harmony export */   "createPopperBase": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.createPopper),
/* harmony export */   "createPopperLite": () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__.createPopper),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "end": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.end),
/* harmony export */   "eventListeners": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.eventListeners),
/* harmony export */   "flip": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.flip),
/* harmony export */   "hide": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.hide),
/* harmony export */   "left": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.left),
/* harmony export */   "main": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.main),
/* harmony export */   "modifierPhases": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases),
/* harmony export */   "offset": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.offset),
/* harmony export */   "placements": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements),
/* harmony export */   "popper": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper),
/* harmony export */   "popperGenerator": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.popperGenerator),
/* harmony export */   "popperOffsets": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.popperOffsets),
/* harmony export */   "preventOverflow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.preventOverflow),
/* harmony export */   "read": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.read),
/* harmony export */   "reference": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference),
/* harmony export */   "right": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.right),
/* harmony export */   "start": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.start),
/* harmony export */   "top": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.top),
/* harmony export */   "variationPlacements": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements),
/* harmony export */   "viewport": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport),
/* harmony export */   "write": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.write)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _popper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./popper.js */ "./node_modules/@popperjs/core/lib/popper.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__.within)(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (true) {
    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_8__.isHTMLElement)(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.popper, arrowElement)) {
    if (true) {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "mapToStyles": () => (/* binding */ mapToStyles)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (true) {
    var transitionProperty = (0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyStyles": () => (/* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "arrow": () => (/* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "computeStyles": () => (/* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "eventListeners": () => (/* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "flip": () => (/* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "hide": () => (/* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "offset": () => (/* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "popperOffsets": () => (/* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "preventOverflow": () => (/* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "distanceAndSkiddingToXY": () => (/* binding */ distanceAndSkiddingToXY)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;

    var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "defaultModifiers": () => (/* binding */ defaultModifiers),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "popperGenerator": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles),
/* harmony export */   "arrow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow),
/* harmony export */   "computeStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles),
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "createPopperLite": () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper),
/* harmony export */   "defaultModifiers": () => (/* binding */ defaultModifiers),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   "eventListeners": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners),
/* harmony export */   "flip": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip),
/* harmony export */   "hide": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide),
/* harmony export */   "offset": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset),
/* harmony export */   "popperGenerator": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator),
/* harmony export */   "popperOffsets": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets),
/* harmony export */   "preventOverflow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");










var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeAutoPlacement)
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;

    if (true) {
      console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
    }
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeOffsets)
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ detectOverflow)
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ expandToHashMap)
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/format.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/format.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ format)
/* harmony export */ });
function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getAltAxis)
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBasePlacement)
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getFreshSideObject)
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMainAxisFromPlacement)
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositePlacement)
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositeVariationPlacement)
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getVariation)
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "round": () => (/* binding */ round)
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeByName)
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergePaddingObject)
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ orderModifiers)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rectToClientRect)
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/uniqueBy.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/uniqueBy.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ uniqueBy)
/* harmony export */ });
function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/userAgent.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/userAgent.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUAString)
/* harmony export */ });
function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/validateModifiers.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/validateModifiers.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ validateModifiers)
/* harmony export */ });
/* harmony import */ var _format_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./format.js */ "./node_modules/@popperjs/core/lib/utils/format.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");


var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    }).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

          break;

        case 'phase':
          if (_enums_js__WEBPACK_IMPORTED_MODULE_1__.modifierPhases.indexOf(modifier.phase) < 0) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + _enums_js__WEBPACK_IMPORTED_MODULE_1__.modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (modifier.effect != null && typeof modifier.effect !== 'function') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "within": () => (/* binding */ within),
/* harmony export */   "withinMaxClamp": () => (/* binding */ withinMaxClamp)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

/***/ }),

/***/ "./node_modules/bootstrap/dist/js/bootstrap.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/bootstrap/dist/js/bootstrap.esm.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Alert": () => (/* binding */ Alert),
/* harmony export */   "Button": () => (/* binding */ Button),
/* harmony export */   "Carousel": () => (/* binding */ Carousel),
/* harmony export */   "Collapse": () => (/* binding */ Collapse),
/* harmony export */   "Dropdown": () => (/* binding */ Dropdown),
/* harmony export */   "Modal": () => (/* binding */ Modal),
/* harmony export */   "Offcanvas": () => (/* binding */ Offcanvas),
/* harmony export */   "Popover": () => (/* binding */ Popover),
/* harmony export */   "ScrollSpy": () => (/* binding */ ScrollSpy),
/* harmony export */   "Tab": () => (/* binding */ Tab),
/* harmony export */   "Toast": () => (/* binding */ Toast),
/* harmony export */   "Tooltip": () => (/* binding */ Tooltip)
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/index.js");
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
/*!
  * Bootstrap v5.2.2 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = 'transitionend'; // Shout-out Angus Croll (https://goo.gl/pxwQGp)

const toType = object => {
  if (object === null || object === undefined) {
    return `${object}`;
  }

  return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
};
/**
 * Public Util API
 */


const getUID = prefix => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID);
  } while (document.getElementById(prefix));

  return prefix;
};

const getSelector = element => {
  let selector = element.getAttribute('data-bs-target');

  if (!selector || selector === '#') {
    let hrefAttribute = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273

    if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
      return null;
    } // Just in case some CMS puts out a full URL with the anchor appended


    if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
      hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
    }

    selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
  }

  return selector;
};

const getSelectorFromElement = element => {
  const selector = getSelector(element);

  if (selector) {
    return document.querySelector(selector) ? selector : null;
  }

  return null;
};

const getElementFromSelector = element => {
  const selector = getSelector(element);
  return selector ? document.querySelector(selector) : null;
};

const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0;
  } // Get transition-duration of the element


  let {
    transitionDuration,
    transitionDelay
  } = window.getComputedStyle(element);
  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  } // If multiple durations are defined, take the first


  transitionDuration = transitionDuration.split(',')[0];
  transitionDelay = transitionDelay.split(',')[0];
  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};

const triggerTransitionEnd = element => {
  element.dispatchEvent(new Event(TRANSITION_END));
};

const isElement = object => {
  if (!object || typeof object !== 'object') {
    return false;
  }

  if (typeof object.jquery !== 'undefined') {
    object = object[0];
  }

  return typeof object.nodeType !== 'undefined';
};

const getElement = object => {
  // it's a jQuery object or a node element
  if (isElement(object)) {
    return object.jquery ? object[0] : object;
  }

  if (typeof object === 'string' && object.length > 0) {
    return document.querySelector(object);
  }

  return null;
};

const isVisible = element => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false;
  }

  const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible'; // Handle `details` element as its content may falsie appear visible when it is closed

  const closedDetails = element.closest('details:not([open])');

  if (!closedDetails) {
    return elementIsVisible;
  }

  if (closedDetails !== element) {
    const summary = element.closest('summary');

    if (summary && summary.parentNode !== closedDetails) {
      return false;
    }

    if (summary === null) {
      return false;
    }
  }

  return elementIsVisible;
};

const isDisabled = element => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true;
  }

  if (element.classList.contains('disabled')) {
    return true;
  }

  if (typeof element.disabled !== 'undefined') {
    return element.disabled;
  }

  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};

const findShadowRoot = element => {
  if (!document.documentElement.attachShadow) {
    return null;
  } // Can find the shadow root otherwise it'll return the document


  if (typeof element.getRootNode === 'function') {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }

  if (element instanceof ShadowRoot) {
    return element;
  } // when we don't find a shadow root


  if (!element.parentNode) {
    return null;
  }

  return findShadowRoot(element.parentNode);
};

const noop = () => {};
/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */


const reflow = element => {
  element.offsetHeight; // eslint-disable-line no-unused-expressions
};

const getjQuery = () => {
  if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
    return window.jQuery;
  }

  return null;
};

const DOMContentLoadedCallbacks = [];

const onDOMContentLoaded = callback => {
  if (document.readyState === 'loading') {
    // add listener on the first call when the document is in loading state
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener('DOMContentLoaded', () => {
        for (const callback of DOMContentLoadedCallbacks) {
          callback();
        }
      });
    }

    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};

const isRTL = () => document.documentElement.dir === 'rtl';

const defineJQueryPlugin = plugin => {
  onDOMContentLoaded(() => {
    const $ = getjQuery();
    /* istanbul ignore if */

    if ($) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $.fn[name];
      $.fn[name] = plugin.jQueryInterface;
      $.fn[name].Constructor = plugin;

      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};

const execute = callback => {
  if (typeof callback === 'function') {
    callback();
  }
};

const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback);
    return;
  }

  const durationPadding = 5;
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
  let called = false;

  const handler = ({
    target
  }) => {
    if (target !== transitionElement) {
      return;
    }

    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler);
    execute(callback);
  };

  transitionElement.addEventListener(TRANSITION_END, handler);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};
/**
 * Return the previous/next element of a list.
 *
 * @param {array} list    The list of elements
 * @param activeElement   The active element
 * @param shouldGetNext   Choose to get next or previous element
 * @param isCycleAllowed
 * @return {Element|elem} The proper element
 */


const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
  const listLength = list.length;
  let index = list.indexOf(activeElement); // if the element does not exist in the list return an element
  // depending on the direction and if cycle is allowed

  if (index === -1) {
    return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
  }

  index += shouldGetNext ? 1 : -1;

  if (isCycleAllowed) {
    index = (index + listLength) % listLength;
  }

  return list[Math.max(0, Math.min(index, listLength - 1))];
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage

let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
/**
 * Private methods
 */

function makeEventUid(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}

function getElementEvents(element) {
  const uid = makeEventUid(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}

function bootstrapHandler(element, fn) {
  return function handler(event) {
    hydrateObj(event, {
      delegateTarget: element
    });

    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }

    return fn.apply(element, [event]);
  };
}

function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);

    for (let {
      target
    } = event; target && target !== this; target = target.parentNode) {
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue;
        }

        hydrateObj(event, {
          delegateTarget: target
        });

        if (handler.oneOff) {
          EventHandler.off(element, event.type, selector, fn);
        }

        return fn.apply(target, [event]);
      }
    }
  };
}

function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
}

function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
  const isDelegated = typeof handler === 'string'; // todo: tooltip passes `false` instead of selector, so we need to check

  const callable = isDelegated ? delegationFunction : handler || delegationFunction;
  let typeEvent = getTypeEvent(originalTypeEvent);

  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }

  return [isDelegated, callable, typeEvent];
}

function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }

  let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction); // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does

  if (originalTypeEvent in customEvents) {
    const wrapFunction = fn => {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn.call(this, event);
        }
      };
    };

    callable = wrapFunction(callable);
  }

  const events = getElementEvents(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);

  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;
    return;
  }

  const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
  const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
  fn.delegationSelector = isDelegated ? handler : null;
  fn.callable = callable;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, isDelegated);
}

function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);

  if (!fn) {
    return;
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};

  for (const handlerKey of Object.keys(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      const event = storeElementEvent[handlerKey];
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
}

function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event;
}

const EventHandler = {
  on(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, false);
  },

  one(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, true);
  },

  off(element, originalTypeEvent, handler, delegationFunction) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }

    const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getElementEvents(element);
    const storeElementEvent = events[typeEvent] || {};
    const isNamespace = originalTypeEvent.startsWith('.');

    if (typeof callable !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!Object.keys(storeElementEvent).length) {
        return;
      }

      removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
      return;
    }

    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      }
    }

    for (const keyHandlers of Object.keys(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');

      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        const event = storeElementEvent[keyHandlers];
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  },

  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null;
    }

    const $ = getjQuery();
    const typeEvent = getTypeEvent(event);
    const inNamespace = event !== typeEvent;
    let jQueryEvent = null;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;

    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args);
      $(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }

    let evt = new Event(event, {
      bubbles,
      cancelable: true
    });
    evt = hydrateObj(evt, args);

    if (defaultPrevented) {
      evt.preventDefault();
    }

    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }

    if (evt.defaultPrevented && jQueryEvent) {
      jQueryEvent.preventDefault();
    }

    return evt;
  }

};

function hydrateObj(obj, meta) {
  for (const [key, value] of Object.entries(meta || {})) {
    try {
      obj[key] = value;
    } catch (_unused) {
      Object.defineProperty(obj, key, {
        configurable: true,

        get() {
          return value;
        }

      });
    }
  }

  return obj;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */
const elementMap = new Map();
const Data = {
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map());
    }

    const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used

    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
      return;
    }

    instanceMap.set(key, instance);
  },

  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }

    return null;
  },

  remove(element, key) {
    if (!elementMap.has(element)) {
      return;
    }

    const instanceMap = elementMap.get(element);
    instanceMap.delete(key); // free up element references if there are no instances left for an element

    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
function normalizeData(value) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (value === Number(value).toString()) {
    return Number(value);
  }

  if (value === '' || value === 'null') {
    return null;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (_unused) {
    return value;
  }
}

function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
}

const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
  },

  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
  },

  getDataAttributes(element) {
    if (!element) {
      return {};
    }

    const attributes = {};
    const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));

    for (const key of bsKeys) {
      let pureKey = key.replace(/^bs/, '');
      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
      attributes[pureKey] = normalizeData(element.dataset[key]);
    }

    return attributes;
  },

  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): util/config.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Class definition
 */

class Config {
  // Getters
  static get Default() {
    return {};
  }

  static get DefaultType() {
    return {};
  }

  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!');
  }

  _getConfig(config) {
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);

    this._typeCheckConfig(config);

    return config;
  }

  _configAfterMerge(config) {
    return config;
  }

  _mergeConfigObj(config, element) {
    const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

    return { ...this.constructor.Default,
      ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
      ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
      ...(typeof config === 'object' ? config : {})
    };
  }

  _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
    for (const property of Object.keys(configTypes)) {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    }
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const VERSION = '5.2.2';
/**
 * Class definition
 */

class BaseComponent extends Config {
  constructor(element, config) {
    super();
    element = getElement(element);

    if (!element) {
      return;
    }

    this._element = element;
    this._config = this._getConfig(config);
    Data.set(this._element, this.constructor.DATA_KEY, this);
  } // Public


  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);

    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null;
    }
  }

  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }

  _getConfig(config) {
    config = this._mergeConfigObj(config, this._element);
    config = this._configAfterMerge(config);

    this._typeCheckConfig(config);

    return config;
  } // Static


  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
  }

  static get VERSION() {
    return VERSION;
  }

  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }

  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }

  static eventName(name) {
    return `${name}${this.EVENT_KEY}`;
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const enableDismissTrigger = (component, method = 'hide') => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`;
  const name = component.NAME;
  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    const target = getElementFromSelector(this) || this.closest(`.${name}`);
    const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

    instance[method]();
  });
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$f = 'alert';
const DATA_KEY$a = 'bs.alert';
const EVENT_KEY$b = `.${DATA_KEY$a}`;
const EVENT_CLOSE = `close${EVENT_KEY$b}`;
const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
const CLASS_NAME_FADE$5 = 'fade';
const CLASS_NAME_SHOW$8 = 'show';
/**
 * Class definition
 */

class Alert extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$f;
  } // Public


  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

    if (closeEvent.defaultPrevented) {
      return;
    }

    this._element.classList.remove(CLASS_NAME_SHOW$8);

    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);

    this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
  } // Private


  _destroyElement() {
    this._element.remove();

    EventHandler.trigger(this._element, EVENT_CLOSED);
    this.dispose();
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Alert.getOrCreateInstance(this);

      if (typeof config !== 'string') {
        return;
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](this);
    });
  }

}
/**
 * Data API implementation
 */


enableDismissTrigger(Alert, 'close');
/**
 * jQuery
 */

defineJQueryPlugin(Alert);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$e = 'button';
const DATA_KEY$9 = 'bs.button';
const EVENT_KEY$a = `.${DATA_KEY$9}`;
const DATA_API_KEY$6 = '.data-api';
const CLASS_NAME_ACTIVE$3 = 'active';
const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
/**
 * Class definition
 */

class Button extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$e;
  } // Public


  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this);

      if (config === 'toggle') {
        data[config]();
      }
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
  event.preventDefault();
  const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
  const data = Button.getOrCreateInstance(button);
  data.toggle();
});
/**
 * jQuery
 */

defineJQueryPlugin(Button);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  },

  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },

  children(element, selector) {
    return [].concat(...element.children).filter(child => child.matches(selector));
  },

  parents(element, selector) {
    const parents = [];
    let ancestor = element.parentNode.closest(selector);

    while (ancestor) {
      parents.push(ancestor);
      ancestor = ancestor.parentNode.closest(selector);
    }

    return parents;
  },

  prev(element, selector) {
    let previous = element.previousElementSibling;

    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }

      previous = previous.previousElementSibling;
    }

    return [];
  },

  // TODO: this is now unused; remove later along with prev()
  next(element, selector) {
    let next = element.nextElementSibling;

    while (next) {
      if (next.matches(selector)) {
        return [next];
      }

      next = next.nextElementSibling;
    }

    return [];
  },

  focusableChildren(element) {
    const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
    return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): util/swipe.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$d = 'swipe';
const EVENT_KEY$9 = '.bs.swipe';
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
const POINTER_TYPE_TOUCH = 'touch';
const POINTER_TYPE_PEN = 'pen';
const CLASS_NAME_POINTER_EVENT = 'pointer-event';
const SWIPE_THRESHOLD = 40;
const Default$c = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null
};
const DefaultType$c = {
  endCallback: '(function|null)',
  leftCallback: '(function|null)',
  rightCallback: '(function|null)'
};
/**
 * Class definition
 */

class Swipe extends Config {
  constructor(element, config) {
    super();
    this._element = element;

    if (!element || !Swipe.isSupported()) {
      return;
    }

    this._config = this._getConfig(config);
    this._deltaX = 0;
    this._supportPointerEvents = Boolean(window.PointerEvent);

    this._initEvents();
  } // Getters


  static get Default() {
    return Default$c;
  }

  static get DefaultType() {
    return DefaultType$c;
  }

  static get NAME() {
    return NAME$d;
  } // Public


  dispose() {
    EventHandler.off(this._element, EVENT_KEY$9);
  } // Private


  _start(event) {
    if (!this._supportPointerEvents) {
      this._deltaX = event.touches[0].clientX;
      return;
    }

    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX;
    }
  }

  _end(event) {
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX - this._deltaX;
    }

    this._handleSwipe();

    execute(this._config.endCallback);
  }

  _move(event) {
    this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
  }

  _handleSwipe() {
    const absDeltaX = Math.abs(this._deltaX);

    if (absDeltaX <= SWIPE_THRESHOLD) {
      return;
    }

    const direction = absDeltaX / this._deltaX;
    this._deltaX = 0;

    if (!direction) {
      return;
    }

    execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
  }

  _initEvents() {
    if (this._supportPointerEvents) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
      EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event));

      this._element.classList.add(CLASS_NAME_POINTER_EVENT);
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
      EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
      EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event));
    }
  }

  _eventIsPointerPenTouch(event) {
    return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
  } // Static


  static isSupported() {
    return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$c = 'carousel';
const DATA_KEY$8 = 'bs.carousel';
const EVENT_KEY$8 = `.${DATA_KEY$8}`;
const DATA_API_KEY$5 = '.data-api';
const ARROW_LEFT_KEY$1 = 'ArrowLeft';
const ARROW_RIGHT_KEY$1 = 'ArrowRight';
const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

const ORDER_NEXT = 'next';
const ORDER_PREV = 'prev';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
const EVENT_SLID = `slid${EVENT_KEY$8}`;
const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
const CLASS_NAME_CAROUSEL = 'carousel';
const CLASS_NAME_ACTIVE$2 = 'active';
const CLASS_NAME_SLIDE = 'slide';
const CLASS_NAME_END = 'carousel-item-end';
const CLASS_NAME_START = 'carousel-item-start';
const CLASS_NAME_NEXT = 'carousel-item-next';
const CLASS_NAME_PREV = 'carousel-item-prev';
const SELECTOR_ACTIVE = '.active';
const SELECTOR_ITEM = '.carousel-item';
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
const SELECTOR_ITEM_IMG = '.carousel-item img';
const SELECTOR_INDICATORS = '.carousel-indicators';
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
};
const Default$b = {
  interval: 5000,
  keyboard: true,
  pause: 'hover',
  ride: false,
  touch: true,
  wrap: true
};
const DefaultType$b = {
  interval: '(number|boolean)',
  // TODO:v6 remove boolean support
  keyboard: 'boolean',
  pause: '(string|boolean)',
  ride: '(boolean|string)',
  touch: 'boolean',
  wrap: 'boolean'
};
/**
 * Class definition
 */

class Carousel extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._interval = null;
    this._activeElement = null;
    this._isSliding = false;
    this.touchTimeout = null;
    this._swipeHelper = null;
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);

    this._addEventListeners();

    if (this._config.ride === CLASS_NAME_CAROUSEL) {
      this.cycle();
    }
  } // Getters


  static get Default() {
    return Default$b;
  }

  static get DefaultType() {
    return DefaultType$b;
  }

  static get NAME() {
    return NAME$c;
  } // Public


  next() {
    this._slide(ORDER_NEXT);
  }

  nextWhenVisible() {
    // FIXME TODO use `document.visibilityState`
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }

  prev() {
    this._slide(ORDER_PREV);
  }

  pause() {
    if (this._isSliding) {
      triggerTransitionEnd(this._element);
    }

    this._clearInterval();
  }

  cycle() {
    this._clearInterval();

    this._updateInterval();

    this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
  }

  _maybeEnableCycle() {
    if (!this._config.ride) {
      return;
    }

    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
      return;
    }

    this.cycle();
  }

  to(index) {
    const items = this._getItems();

    if (index > items.length - 1 || index < 0) {
      return;
    }

    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
      return;
    }

    const activeIndex = this._getItemIndex(this._getActive());

    if (activeIndex === index) {
      return;
    }

    const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

    this._slide(order, items[index]);
  }

  dispose() {
    if (this._swipeHelper) {
      this._swipeHelper.dispose();
    }

    super.dispose();
  } // Private


  _configAfterMerge(config) {
    config.defaultInterval = config.interval;
    return config;
  }

  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN$1, event => this._keydown(event));
    }

    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
      EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
    }

    if (this._config.touch && Swipe.isSupported()) {
      this._addTouchEventListeners();
    }
  }

  _addTouchEventListeners() {
    for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
      EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault());
    }

    const endCallBack = () => {
      if (this._config.pause !== 'hover') {
        return;
      } // If it's a touch-enabled device, mouseenter/leave are fired as
      // part of the mouse compatibility events on first tap - the carousel
      // would stop cycling until user tapped out of it;
      // here, we listen for touchend, explicitly pause the carousel
      // (as if it's the second time we tap on it, mouseenter compat event
      // is NOT fired) and after a timeout (to allow for mouse compatibility
      // events to fire) we explicitly restart cycling


      this.pause();

      if (this.touchTimeout) {
        clearTimeout(this.touchTimeout);
      }

      this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
    };

    const swipeConfig = {
      leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
      rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
      endCallback: endCallBack
    };
    this._swipeHelper = new Swipe(this._element, swipeConfig);
  }

  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }

    const direction = KEY_TO_DIRECTION[event.key];

    if (direction) {
      event.preventDefault();

      this._slide(this._directionToOrder(direction));
    }
  }

  _getItemIndex(element) {
    return this._getItems().indexOf(element);
  }

  _setActiveIndicatorElement(index) {
    if (!this._indicatorsElement) {
      return;
    }

    const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
    activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
    activeIndicator.removeAttribute('aria-current');
    const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);

    if (newActiveIndicator) {
      newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
      newActiveIndicator.setAttribute('aria-current', 'true');
    }
  }

  _updateInterval() {
    const element = this._activeElement || this._getActive();

    if (!element) {
      return;
    }

    const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
    this._config.interval = elementInterval || this._config.defaultInterval;
  }

  _slide(order, element = null) {
    if (this._isSliding) {
      return;
    }

    const activeElement = this._getActive();

    const isNext = order === ORDER_NEXT;
    const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);

    if (nextElement === activeElement) {
      return;
    }

    const nextElementIndex = this._getItemIndex(nextElement);

    const triggerEvent = eventName => {
      return EventHandler.trigger(this._element, eventName, {
        relatedTarget: nextElement,
        direction: this._orderToDirection(order),
        from: this._getItemIndex(activeElement),
        to: nextElementIndex
      });
    };

    const slideEvent = triggerEvent(EVENT_SLIDE);

    if (slideEvent.defaultPrevented) {
      return;
    }

    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      // todo: change tests that use empty divs to avoid this check
      return;
    }

    const isCycling = Boolean(this._interval);
    this.pause();
    this._isSliding = true;

    this._setActiveIndicatorElement(nextElementIndex);

    this._activeElement = nextElement;
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
    nextElement.classList.add(orderClassName);
    reflow(nextElement);
    activeElement.classList.add(directionalClassName);
    nextElement.classList.add(directionalClassName);

    const completeCallBack = () => {
      nextElement.classList.remove(directionalClassName, orderClassName);
      nextElement.classList.add(CLASS_NAME_ACTIVE$2);
      activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
      this._isSliding = false;
      triggerEvent(EVENT_SLID);
    };

    this._queueCallback(completeCallBack, activeElement, this._isAnimated());

    if (isCycling) {
      this.cycle();
    }
  }

  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_SLIDE);
  }

  _getActive() {
    return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  }

  _getItems() {
    return SelectorEngine.find(SELECTOR_ITEM, this._element);
  }

  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  _directionToOrder(direction) {
    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
    }

    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
  }

  _orderToDirection(order) {
    if (isRTL()) {
      return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }

    return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Carousel.getOrCreateInstance(this, config);

      if (typeof config === 'number') {
        data.to(config);
        return;
      }

      if (typeof config === 'string') {
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function (event) {
  const target = getElementFromSelector(this);

  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return;
  }

  event.preventDefault();
  const carousel = Carousel.getOrCreateInstance(target);
  const slideIndex = this.getAttribute('data-bs-slide-to');

  if (slideIndex) {
    carousel.to(slideIndex);

    carousel._maybeEnableCycle();

    return;
  }

  if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
    carousel.next();

    carousel._maybeEnableCycle();

    return;
  }

  carousel.prev();

  carousel._maybeEnableCycle();
});
EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

  for (const carousel of carousels) {
    Carousel.getOrCreateInstance(carousel);
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(Carousel);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$b = 'collapse';
const DATA_KEY$7 = 'bs.collapse';
const EVENT_KEY$7 = `.${DATA_KEY$7}`;
const DATA_API_KEY$4 = '.data-api';
const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
const CLASS_NAME_SHOW$7 = 'show';
const CLASS_NAME_COLLAPSE = 'collapse';
const CLASS_NAME_COLLAPSING = 'collapsing';
const CLASS_NAME_COLLAPSED = 'collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
const WIDTH = 'width';
const HEIGHT = 'height';
const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
const Default$a = {
  parent: null,
  toggle: true
};
const DefaultType$a = {
  parent: '(null|element)',
  toggle: 'boolean'
};
/**
 * Class definition
 */

class Collapse extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isTransitioning = false;
    this._triggerArray = [];
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

    for (const elem of toggleList) {
      const selector = getSelectorFromElement(elem);
      const filterElement = SelectorEngine.find(selector).filter(foundElement => foundElement === this._element);

      if (selector !== null && filterElement.length) {
        this._triggerArray.push(elem);
      }
    }

    this._initializeChildren();

    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }

    if (this._config.toggle) {
      this.toggle();
    }
  } // Getters


  static get Default() {
    return Default$a;
  }

  static get DefaultType() {
    return DefaultType$a;
  }

  static get NAME() {
    return NAME$b;
  } // Public


  toggle() {
    if (this._isShown()) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }

    let activeChildren = []; // find active children

    if (this._config.parent) {
      activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
        toggle: false
      }));
    }

    if (activeChildren.length && activeChildren[0]._isTransitioning) {
      return;
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);

    if (startEvent.defaultPrevented) {
      return;
    }

    for (const activeInstance of activeChildren) {
      activeInstance.hide();
    }

    const dimension = this._getDimension();

    this._element.classList.remove(CLASS_NAME_COLLAPSE);

    this._element.classList.add(CLASS_NAME_COLLAPSING);

    this._element.style[dimension] = 0;

    this._addAriaAndCollapsedClass(this._triggerArray, true);

    this._isTransitioning = true;

    const complete = () => {
      this._isTransitioning = false;

      this._element.classList.remove(CLASS_NAME_COLLAPSING);

      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

      this._element.style[dimension] = '';
      EventHandler.trigger(this._element, EVENT_SHOWN$6);
    };

    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;

    this._queueCallback(complete, this._element, true);

    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }

  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);

    if (startEvent.defaultPrevented) {
      return;
    }

    const dimension = this._getDimension();

    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
    reflow(this._element);

    this._element.classList.add(CLASS_NAME_COLLAPSING);

    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

    for (const trigger of this._triggerArray) {
      const element = getElementFromSelector(trigger);

      if (element && !this._isShown(element)) {
        this._addAriaAndCollapsedClass([trigger], false);
      }
    }

    this._isTransitioning = true;

    const complete = () => {
      this._isTransitioning = false;

      this._element.classList.remove(CLASS_NAME_COLLAPSING);

      this._element.classList.add(CLASS_NAME_COLLAPSE);

      EventHandler.trigger(this._element, EVENT_HIDDEN$6);
    };

    this._element.style[dimension] = '';

    this._queueCallback(complete, this._element, true);
  }

  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$7);
  } // Private


  _configAfterMerge(config) {
    config.toggle = Boolean(config.toggle); // Coerce string values

    config.parent = getElement(config.parent);
    return config;
  }

  _getDimension() {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
  }

  _initializeChildren() {
    if (!this._config.parent) {
      return;
    }

    const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);

    for (const element of children) {
      const selected = getElementFromSelector(element);

      if (selected) {
        this._addAriaAndCollapsedClass([element], this._isShown(selected));
      }
    }
  }

  _getFirstLevelChildren(selector) {
    const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent); // remove children if greater depth

    return SelectorEngine.find(selector, this._config.parent).filter(element => !children.includes(element));
  }

  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }

    for (const element of triggerArray) {
      element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
      element.setAttribute('aria-expanded', isOpen);
    }
  } // Static


  static jQueryInterface(config) {
    const _config = {};

    if (typeof config === 'string' && /show|hide/.test(config)) {
      _config.toggle = false;
    }

    return this.each(function () {
      const data = Collapse.getOrCreateInstance(this, _config);

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
    event.preventDefault();
  }

  const selector = getSelectorFromElement(this);
  const selectorElements = SelectorEngine.find(selector);

  for (const element of selectorElements) {
    Collapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle();
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(Collapse);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$a = 'dropdown';
const DATA_KEY$6 = 'bs.dropdown';
const EVENT_KEY$6 = `.${DATA_KEY$6}`;
const DATA_API_KEY$3 = '.data-api';
const ESCAPE_KEY$2 = 'Escape';
const TAB_KEY$1 = 'Tab';
const ARROW_UP_KEY$1 = 'ArrowUp';
const ARROW_DOWN_KEY$1 = 'ArrowDown';
const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
const CLASS_NAME_SHOW$6 = 'show';
const CLASS_NAME_DROPUP = 'dropup';
const CLASS_NAME_DROPEND = 'dropend';
const CLASS_NAME_DROPSTART = 'dropstart';
const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
const SELECTOR_MENU = '.dropdown-menu';
const SELECTOR_NAVBAR = '.navbar';
const SELECTOR_NAVBAR_NAV = '.navbar-nav';
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
const PLACEMENT_TOPCENTER = 'top';
const PLACEMENT_BOTTOMCENTER = 'bottom';
const Default$9 = {
  autoClose: true,
  boundary: 'clippingParents',
  display: 'dynamic',
  offset: [0, 2],
  popperConfig: null,
  reference: 'toggle'
};
const DefaultType$9 = {
  autoClose: '(boolean|string)',
  boundary: '(string|element)',
  display: 'string',
  offset: '(array|string|function)',
  popperConfig: '(null|object|function)',
  reference: '(string|element|object)'
};
/**
 * Class definition
 */

class Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._popper = null;
    this._parent = this._element.parentNode; // dropdown wrapper
    // todo: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.2/forms/input-group/

    this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
    this._inNavbar = this._detectNavbar();
  } // Getters


  static get Default() {
    return Default$9;
  }

  static get DefaultType() {
    return DefaultType$9;
  }

  static get NAME() {
    return NAME$a;
  } // Public


  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }

  show() {
    if (isDisabled(this._element) || this._isShown()) {
      return;
    }

    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);

    if (showEvent.defaultPrevented) {
      return;
    }

    this._createPopper(); // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


    if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }

    this._element.focus();

    this._element.setAttribute('aria-expanded', true);

    this._menu.classList.add(CLASS_NAME_SHOW$6);

    this._element.classList.add(CLASS_NAME_SHOW$6);

    EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
  }

  hide() {
    if (isDisabled(this._element) || !this._isShown()) {
      return;
    }

    const relatedTarget = {
      relatedTarget: this._element
    };

    this._completeHide(relatedTarget);
  }

  dispose() {
    if (this._popper) {
      this._popper.destroy();
    }

    super.dispose();
  }

  update() {
    this._inNavbar = this._detectNavbar();

    if (this._popper) {
      this._popper.update();
    }
  } // Private


  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);

    if (hideEvent.defaultPrevented) {
      return;
    } // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support


    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }

    if (this._popper) {
      this._popper.destroy();
    }

    this._menu.classList.remove(CLASS_NAME_SHOW$6);

    this._element.classList.remove(CLASS_NAME_SHOW$6);

    this._element.setAttribute('aria-expanded', 'false');

    Manipulator.removeDataAttribute(this._menu, 'popper');
    EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
  }

  _getConfig(config) {
    config = super._getConfig(config);

    if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
      // Popper virtual elements require a getBoundingClientRect method
      throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
    }

    return config;
  }

  _createPopper() {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
    }

    let referenceElement = this._element;

    if (this._config.reference === 'parent') {
      referenceElement = this._parent;
    } else if (isElement(this._config.reference)) {
      referenceElement = getElement(this._config.reference);
    } else if (typeof this._config.reference === 'object') {
      referenceElement = this._config.reference;
    }

    const popperConfig = this._getPopperConfig();

    this._popper = _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(referenceElement, this._menu, popperConfig);
  }

  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW$6);
  }

  _getPlacement() {
    const parentDropdown = this._parent;

    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT;
    }

    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT;
    }

    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
      return PLACEMENT_TOPCENTER;
    }

    if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
      return PLACEMENT_BOTTOMCENTER;
    } // We need to trim the value because custom properties can also include spaces


    const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
    }

    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
  }

  _detectNavbar() {
    return this._element.closest(SELECTOR_NAVBAR) !== null;
  }

  _getOffset() {
    const {
      offset
    } = this._config;

    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10));
    }

    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }

    return offset;
  }

  _getPopperConfig() {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [{
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }]
    }; // Disable Popper if we have a static display or Dropdown is in Navbar

    if (this._inNavbar || this._config.display === 'static') {
      Manipulator.setDataAttribute(this._menu, 'popper', 'static'); // todo:v6 remove

      defaultBsPopperConfig.modifiers = [{
        name: 'applyStyles',
        enabled: false
      }];
    }

    return { ...defaultBsPopperConfig,
      ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
    };
  }

  _selectMenuItem({
    key,
    target
  }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element));

    if (!items.length) {
      return;
    } // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY


    getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Dropdown.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

  static clearMenus(event) {
    if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
      return;
    }

    const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);

    for (const toggle of openToggles) {
      const context = Dropdown.getInstance(toggle);

      if (!context || context._config.autoClose === false) {
        continue;
      }

      const composedPath = event.composedPath();
      const isMenuTarget = composedPath.includes(context._menu);

      if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
        continue;
      } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


      if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
        continue;
      }

      const relatedTarget = {
        relatedTarget: context._element
      };

      if (event.type === 'click') {
        relatedTarget.clickEvent = event;
      }

      context._completeHide(relatedTarget);
    }
  }

  static dataApiKeydownHandler(event) {
    // If not an UP | DOWN | ESCAPE key => not a dropdown command
    // If input/textarea && if key is other than ESCAPE => not a dropdown command
    const isInput = /input|textarea/i.test(event.target.tagName);
    const isEscapeEvent = event.key === ESCAPE_KEY$2;
    const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);

    if (!isUpOrDownEvent && !isEscapeEvent) {
      return;
    }

    if (isInput && !isEscapeEvent) {
      return;
    }

    event.preventDefault(); // todo: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.2/forms/input-group/

    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode);
    const instance = Dropdown.getOrCreateInstance(getToggleButton);

    if (isUpOrDownEvent) {
      event.stopPropagation();
      instance.show();

      instance._selectMenuItem(event);

      return;
    }

    if (instance._isShown()) {
      // else is escape and we check if it is shown
      event.stopPropagation();
      instance.hide();
      getToggleButton.focus();
    }
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
  event.preventDefault();
  Dropdown.getOrCreateInstance(this).toggle();
});
/**
 * jQuery
 */

defineJQueryPlugin(Dropdown);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
const SELECTOR_STICKY_CONTENT = '.sticky-top';
const PROPERTY_PADDING = 'padding-right';
const PROPERTY_MARGIN = 'margin-right';
/**
 * Class definition
 */

class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  } // Public


  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }

  hide() {
    const width = this.getWidth();

    this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width


    this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth


    this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);

    this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
  }

  reset() {
    this._resetElementAttributes(this._element, 'overflow');

    this._resetElementAttributes(this._element, PROPERTY_PADDING);

    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);

    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
  }

  isOverflowing() {
    return this.getWidth() > 0;
  } // Private


  _disableOverFlow() {
    this._saveInitialAttribute(this._element, 'overflow');

    this._element.style.overflow = 'hidden';
  }

  _setElementAttributes(selector, styleProperty, callback) {
    const scrollbarWidth = this.getWidth();

    const manipulationCallBack = element => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }

      this._saveInitialAttribute(element, styleProperty);

      const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
      element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
    };

    this._applyManipulationCallback(selector, manipulationCallBack);
  }

  _saveInitialAttribute(element, styleProperty) {
    const actualValue = element.style.getPropertyValue(styleProperty);

    if (actualValue) {
      Manipulator.setDataAttribute(element, styleProperty, actualValue);
    }
  }

  _resetElementAttributes(selector, styleProperty) {
    const manipulationCallBack = element => {
      const value = Manipulator.getDataAttribute(element, styleProperty); // We only want to remove the property if the value is `null`; the value can also be zero

      if (value === null) {
        element.style.removeProperty(styleProperty);
        return;
      }

      Manipulator.removeDataAttribute(element, styleProperty);
      element.style.setProperty(styleProperty, value);
    };

    this._applyManipulationCallback(selector, manipulationCallBack);
  }

  _applyManipulationCallback(selector, callBack) {
    if (isElement(selector)) {
      callBack(selector);
      return;
    }

    for (const sel of SelectorEngine.find(selector, this._element)) {
      callBack(sel);
    }
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): util/backdrop.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$9 = 'backdrop';
const CLASS_NAME_FADE$4 = 'fade';
const CLASS_NAME_SHOW$5 = 'show';
const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
const Default$8 = {
  className: 'modal-backdrop',
  clickCallback: null,
  isAnimated: false,
  isVisible: true,
  // if false, we use the backdrop helper without adding any element to the dom
  rootElement: 'body' // give the choice to place backdrop under different elements

};
const DefaultType$8 = {
  className: 'string',
  clickCallback: '(function|null)',
  isAnimated: 'boolean',
  isVisible: 'boolean',
  rootElement: '(element|string)'
};
/**
 * Class definition
 */

class Backdrop extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isAppended = false;
    this._element = null;
  } // Getters


  static get Default() {
    return Default$8;
  }

  static get DefaultType() {
    return DefaultType$8;
  }

  static get NAME() {
    return NAME$9;
  } // Public


  show(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }

    this._append();

    const element = this._getElement();

    if (this._config.isAnimated) {
      reflow(element);
    }

    element.classList.add(CLASS_NAME_SHOW$5);

    this._emulateAnimation(() => {
      execute(callback);
    });
  }

  hide(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }

    this._getElement().classList.remove(CLASS_NAME_SHOW$5);

    this._emulateAnimation(() => {
      this.dispose();
      execute(callback);
    });
  }

  dispose() {
    if (!this._isAppended) {
      return;
    }

    EventHandler.off(this._element, EVENT_MOUSEDOWN);

    this._element.remove();

    this._isAppended = false;
  } // Private


  _getElement() {
    if (!this._element) {
      const backdrop = document.createElement('div');
      backdrop.className = this._config.className;

      if (this._config.isAnimated) {
        backdrop.classList.add(CLASS_NAME_FADE$4);
      }

      this._element = backdrop;
    }

    return this._element;
  }

  _configAfterMerge(config) {
    // use getElement() with the default "body" to get a fresh Element on each instantiation
    config.rootElement = getElement(config.rootElement);
    return config;
  }

  _append() {
    if (this._isAppended) {
      return;
    }

    const element = this._getElement();

    this._config.rootElement.append(element);

    EventHandler.on(element, EVENT_MOUSEDOWN, () => {
      execute(this._config.clickCallback);
    });
    this._isAppended = true;
  }

  _emulateAnimation(callback) {
    executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): util/focustrap.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$8 = 'focustrap';
const DATA_KEY$5 = 'bs.focustrap';
const EVENT_KEY$5 = `.${DATA_KEY$5}`;
const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
const TAB_KEY = 'Tab';
const TAB_NAV_FORWARD = 'forward';
const TAB_NAV_BACKWARD = 'backward';
const Default$7 = {
  autofocus: true,
  trapElement: null // The element to trap focus inside of

};
const DefaultType$7 = {
  autofocus: 'boolean',
  trapElement: 'element'
};
/**
 * Class definition
 */

class FocusTrap extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isActive = false;
    this._lastTabNavDirection = null;
  } // Getters


  static get Default() {
    return Default$7;
  }

  static get DefaultType() {
    return DefaultType$7;
  }

  static get NAME() {
    return NAME$8;
  } // Public


  activate() {
    if (this._isActive) {
      return;
    }

    if (this._config.autofocus) {
      this._config.trapElement.focus();
    }

    EventHandler.off(document, EVENT_KEY$5); // guard against infinite focus loop

    EventHandler.on(document, EVENT_FOCUSIN$2, event => this._handleFocusin(event));
    EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
    this._isActive = true;
  }

  deactivate() {
    if (!this._isActive) {
      return;
    }

    this._isActive = false;
    EventHandler.off(document, EVENT_KEY$5);
  } // Private


  _handleFocusin(event) {
    const {
      trapElement
    } = this._config;

    if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
      return;
    }

    const elements = SelectorEngine.focusableChildren(trapElement);

    if (elements.length === 0) {
      trapElement.focus();
    } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
      elements[elements.length - 1].focus();
    } else {
      elements[0].focus();
    }
  }

  _handleKeydown(event) {
    if (event.key !== TAB_KEY) {
      return;
    }

    this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$7 = 'modal';
const DATA_KEY$4 = 'bs.modal';
const EVENT_KEY$4 = `.${DATA_KEY$4}`;
const DATA_API_KEY$2 = '.data-api';
const ESCAPE_KEY$1 = 'Escape';
const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
const CLASS_NAME_OPEN = 'modal-open';
const CLASS_NAME_FADE$3 = 'fade';
const CLASS_NAME_SHOW$4 = 'show';
const CLASS_NAME_STATIC = 'modal-static';
const OPEN_SELECTOR$1 = '.modal.show';
const SELECTOR_DIALOG = '.modal-dialog';
const SELECTOR_MODAL_BODY = '.modal-body';
const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
const Default$6 = {
  backdrop: true,
  focus: true,
  keyboard: true
};
const DefaultType$6 = {
  backdrop: '(boolean|string)',
  focus: 'boolean',
  keyboard: 'boolean'
};
/**
 * Class definition
 */

class Modal extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._isShown = false;
    this._isTransitioning = false;
    this._scrollBar = new ScrollBarHelper();

    this._addEventListeners();
  } // Getters


  static get Default() {
    return Default$6;
  }

  static get DefaultType() {
    return DefaultType$6;
  }

  static get NAME() {
    return NAME$7;
  } // Public


  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }

  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return;
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
      relatedTarget
    });

    if (showEvent.defaultPrevented) {
      return;
    }

    this._isShown = true;
    this._isTransitioning = true;

    this._scrollBar.hide();

    document.body.classList.add(CLASS_NAME_OPEN);

    this._adjustDialog();

    this._backdrop.show(() => this._showElement(relatedTarget));
  }

  hide() {
    if (!this._isShown || this._isTransitioning) {
      return;
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);

    if (hideEvent.defaultPrevented) {
      return;
    }

    this._isShown = false;
    this._isTransitioning = true;

    this._focustrap.deactivate();

    this._element.classList.remove(CLASS_NAME_SHOW$4);

    this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
  }

  dispose() {
    for (const htmlElement of [window, this._dialog]) {
      EventHandler.off(htmlElement, EVENT_KEY$4);
    }

    this._backdrop.dispose();

    this._focustrap.deactivate();

    super.dispose();
  }

  handleUpdate() {
    this._adjustDialog();
  } // Private


  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop),
      // 'static' option will be translated to true, and booleans will keep their value,
      isAnimated: this._isAnimated()
    });
  }

  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }

  _showElement(relatedTarget) {
    // try to append dynamic modal
    if (!document.body.contains(this._element)) {
      document.body.append(this._element);
    }

    this._element.style.display = 'block';

    this._element.removeAttribute('aria-hidden');

    this._element.setAttribute('aria-modal', true);

    this._element.setAttribute('role', 'dialog');

    this._element.scrollTop = 0;
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

    if (modalBody) {
      modalBody.scrollTop = 0;
    }

    reflow(this._element);

    this._element.classList.add(CLASS_NAME_SHOW$4);

    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.activate();
      }

      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN$4, {
        relatedTarget
      });
    };

    this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
  }

  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
      if (event.key !== ESCAPE_KEY$1) {
        return;
      }

      if (this._config.keyboard) {
        event.preventDefault();
        this.hide();
        return;
      }

      this._triggerBackdropTransition();
    });
    EventHandler.on(window, EVENT_RESIZE$1, () => {
      if (this._isShown && !this._isTransitioning) {
        this._adjustDialog();
      }
    });
    EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, event => {
      // a bad trick to segregate clicks that may start inside dialog but end outside, and avoid listen to scrollbar clicks
      EventHandler.one(this._element, EVENT_CLICK_DISMISS, event2 => {
        if (this._element !== event.target || this._element !== event2.target) {
          return;
        }

        if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();

          return;
        }

        if (this._config.backdrop) {
          this.hide();
        }
      });
    });
  }

  _hideModal() {
    this._element.style.display = 'none';

    this._element.setAttribute('aria-hidden', true);

    this._element.removeAttribute('aria-modal');

    this._element.removeAttribute('role');

    this._isTransitioning = false;

    this._backdrop.hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN);

      this._resetAdjustments();

      this._scrollBar.reset();

      EventHandler.trigger(this._element, EVENT_HIDDEN$4);
    });
  }

  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_FADE$3);
  }

  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);

    if (hideEvent.defaultPrevented) {
      return;
    }

    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const initialOverflowY = this._element.style.overflowY; // return if the following background transition hasn't yet completed

    if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) {
      return;
    }

    if (!isModalOverflowing) {
      this._element.style.overflowY = 'hidden';
    }

    this._element.classList.add(CLASS_NAME_STATIC);

    this._queueCallback(() => {
      this._element.classList.remove(CLASS_NAME_STATIC);

      this._queueCallback(() => {
        this._element.style.overflowY = initialOverflowY;
      }, this._dialog);
    }, this._dialog);

    this._element.focus();
  }
  /**
   * The following methods are used to handle overflowing modals
   */


  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

    const scrollbarWidth = this._scrollBar.getWidth();

    const isBodyOverflowing = scrollbarWidth > 0;

    if (isBodyOverflowing && !isModalOverflowing) {
      const property = isRTL() ? 'paddingLeft' : 'paddingRight';
      this._element.style[property] = `${scrollbarWidth}px`;
    }

    if (!isBodyOverflowing && isModalOverflowing) {
      const property = isRTL() ? 'paddingRight' : 'paddingLeft';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
  }

  _resetAdjustments() {
    this._element.style.paddingLeft = '';
    this._element.style.paddingRight = '';
  } // Static


  static jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      const data = Modal.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](relatedTarget);
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
  const target = getElementFromSelector(this);

  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }

  EventHandler.one(target, EVENT_SHOW$4, showEvent => {
    if (showEvent.defaultPrevented) {
      // only register focus restorer if modal will actually get shown
      return;
    }

    EventHandler.one(target, EVENT_HIDDEN$4, () => {
      if (isVisible(this)) {
        this.focus();
      }
    });
  }); // avoid conflict when clicking modal toggler while another one is open

  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);

  if (alreadyOpen) {
    Modal.getInstance(alreadyOpen).hide();
  }

  const data = Modal.getOrCreateInstance(target);
  data.toggle(this);
});
enableDismissTrigger(Modal);
/**
 * jQuery
 */

defineJQueryPlugin(Modal);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$6 = 'offcanvas';
const DATA_KEY$3 = 'bs.offcanvas';
const EVENT_KEY$3 = `.${DATA_KEY$3}`;
const DATA_API_KEY$1 = '.data-api';
const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
const ESCAPE_KEY = 'Escape';
const CLASS_NAME_SHOW$3 = 'show';
const CLASS_NAME_SHOWING$1 = 'showing';
const CLASS_NAME_HIDING = 'hiding';
const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
const OPEN_SELECTOR = '.offcanvas.show';
const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
const Default$5 = {
  backdrop: true,
  keyboard: true,
  scroll: false
};
const DefaultType$5 = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  scroll: 'boolean'
};
/**
 * Class definition
 */

class Offcanvas extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isShown = false;
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();

    this._addEventListeners();
  } // Getters


  static get Default() {
    return Default$5;
  }

  static get DefaultType() {
    return DefaultType$5;
  }

  static get NAME() {
    return NAME$6;
  } // Public


  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }

  show(relatedTarget) {
    if (this._isShown) {
      return;
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
      relatedTarget
    });

    if (showEvent.defaultPrevented) {
      return;
    }

    this._isShown = true;

    this._backdrop.show();

    if (!this._config.scroll) {
      new ScrollBarHelper().hide();
    }

    this._element.setAttribute('aria-modal', true);

    this._element.setAttribute('role', 'dialog');

    this._element.classList.add(CLASS_NAME_SHOWING$1);

    const completeCallBack = () => {
      if (!this._config.scroll || this._config.backdrop) {
        this._focustrap.activate();
      }

      this._element.classList.add(CLASS_NAME_SHOW$3);

      this._element.classList.remove(CLASS_NAME_SHOWING$1);

      EventHandler.trigger(this._element, EVENT_SHOWN$3, {
        relatedTarget
      });
    };

    this._queueCallback(completeCallBack, this._element, true);
  }

  hide() {
    if (!this._isShown) {
      return;
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);

    if (hideEvent.defaultPrevented) {
      return;
    }

    this._focustrap.deactivate();

    this._element.blur();

    this._isShown = false;

    this._element.classList.add(CLASS_NAME_HIDING);

    this._backdrop.hide();

    const completeCallback = () => {
      this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);

      this._element.removeAttribute('aria-modal');

      this._element.removeAttribute('role');

      if (!this._config.scroll) {
        new ScrollBarHelper().reset();
      }

      EventHandler.trigger(this._element, EVENT_HIDDEN$3);
    };

    this._queueCallback(completeCallback, this._element, true);
  }

  dispose() {
    this._backdrop.dispose();

    this._focustrap.deactivate();

    super.dispose();
  } // Private


  _initializeBackDrop() {
    const clickCallback = () => {
      if (this._config.backdrop === 'static') {
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
        return;
      }

      this.hide();
    }; // 'static' option will be translated to true, and booleans will keep their value


    const isVisible = Boolean(this._config.backdrop);
    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: isVisible ? clickCallback : null
    });
  }

  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }

  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
      if (event.key !== ESCAPE_KEY) {
        return;
      }

      if (!this._config.keyboard) {
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
        return;
      }

      this.hide();
    });
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Offcanvas.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](this);
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
  const target = getElementFromSelector(this);

  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }

  if (isDisabled(this)) {
    return;
  }

  EventHandler.one(target, EVENT_HIDDEN$3, () => {
    // focus on trigger when it is closed
    if (isVisible(this)) {
      this.focus();
    }
  }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

  if (alreadyOpen && alreadyOpen !== target) {
    Offcanvas.getInstance(alreadyOpen).hide();
  }

  const data = Offcanvas.getOrCreateInstance(target);
  data.toggle(this);
});
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
  for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
    Offcanvas.getOrCreateInstance(selector).show();
  }
});
EventHandler.on(window, EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
    if (getComputedStyle(element).position !== 'fixed') {
      Offcanvas.getOrCreateInstance(element).hide();
    }
  }
});
enableDismissTrigger(Offcanvas);
/**
 * jQuery
 */

defineJQueryPlugin(Offcanvas);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): util/sanitizer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
/**
 * A pattern that recognizes a commonly useful subset of URLs that are safe.
 *
 * Shout-out to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
 */

const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
/**
 * A pattern that matches safe data URLs. Only matches image, video and audio types.
 *
 * Shout-out to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
 */

const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

const allowedAttribute = (attribute, allowedAttributeList) => {
  const attributeName = attribute.nodeName.toLowerCase();

  if (allowedAttributeList.includes(attributeName)) {
    if (uriAttributes.has(attributeName)) {
      return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
    }

    return true;
  } // Check if a regular expression validates the attribute.


  return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
};

const DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  div: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
};
function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
  if (!unsafeHtml.length) {
    return unsafeHtml;
  }

  if (sanitizeFunction && typeof sanitizeFunction === 'function') {
    return sanitizeFunction(unsafeHtml);
  }

  const domParser = new window.DOMParser();
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
  const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

  for (const element of elements) {
    const elementName = element.nodeName.toLowerCase();

    if (!Object.keys(allowList).includes(elementName)) {
      element.remove();
      continue;
    }

    const attributeList = [].concat(...element.attributes);
    const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);

    for (const attribute of attributeList) {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName);
      }
    }
  }

  return createdDocument.body.innerHTML;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): util/template-factory.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$5 = 'TemplateFactory';
const Default$4 = {
  allowList: DefaultAllowlist,
  content: {},
  // { selector : text ,  selector2 : text2 , }
  extraClass: '',
  html: false,
  sanitize: true,
  sanitizeFn: null,
  template: '<div></div>'
};
const DefaultType$4 = {
  allowList: 'object',
  content: 'object',
  extraClass: '(string|function)',
  html: 'boolean',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  template: 'string'
};
const DefaultContentType = {
  entry: '(string|element|function|null)',
  selector: '(string|element)'
};
/**
 * Class definition
 */

class TemplateFactory extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
  } // Getters


  static get Default() {
    return Default$4;
  }

  static get DefaultType() {
    return DefaultType$4;
  }

  static get NAME() {
    return NAME$5;
  } // Public


  getContent() {
    return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
  }

  hasContent() {
    return this.getContent().length > 0;
  }

  changeContent(content) {
    this._checkContent(content);

    this._config.content = { ...this._config.content,
      ...content
    };
    return this;
  }

  toHtml() {
    const templateWrapper = document.createElement('div');
    templateWrapper.innerHTML = this._maybeSanitize(this._config.template);

    for (const [selector, text] of Object.entries(this._config.content)) {
      this._setContent(templateWrapper, text, selector);
    }

    const template = templateWrapper.children[0];

    const extraClass = this._resolvePossibleFunction(this._config.extraClass);

    if (extraClass) {
      template.classList.add(...extraClass.split(' '));
    }

    return template;
  } // Private


  _typeCheckConfig(config) {
    super._typeCheckConfig(config);

    this._checkContent(config.content);
  }

  _checkContent(arg) {
    for (const [selector, content] of Object.entries(arg)) {
      super._typeCheckConfig({
        selector,
        entry: content
      }, DefaultContentType);
    }
  }

  _setContent(template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template);

    if (!templateElement) {
      return;
    }

    content = this._resolvePossibleFunction(content);

    if (!content) {
      templateElement.remove();
      return;
    }

    if (isElement(content)) {
      this._putElementInTemplate(getElement(content), templateElement);

      return;
    }

    if (this._config.html) {
      templateElement.innerHTML = this._maybeSanitize(content);
      return;
    }

    templateElement.textContent = content;
  }

  _maybeSanitize(arg) {
    return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
  }

  _resolvePossibleFunction(arg) {
    return typeof arg === 'function' ? arg(this) : arg;
  }

  _putElementInTemplate(element, templateElement) {
    if (this._config.html) {
      templateElement.innerHTML = '';
      templateElement.append(element);
      return;
    }

    templateElement.textContent = element.textContent;
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$4 = 'tooltip';
const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
const CLASS_NAME_FADE$2 = 'fade';
const CLASS_NAME_MODAL = 'modal';
const CLASS_NAME_SHOW$2 = 'show';
const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
const EVENT_MODAL_HIDE = 'hide.bs.modal';
const TRIGGER_HOVER = 'hover';
const TRIGGER_FOCUS = 'focus';
const TRIGGER_CLICK = 'click';
const TRIGGER_MANUAL = 'manual';
const EVENT_HIDE$2 = 'hide';
const EVENT_HIDDEN$2 = 'hidden';
const EVENT_SHOW$2 = 'show';
const EVENT_SHOWN$2 = 'shown';
const EVENT_INSERTED = 'inserted';
const EVENT_CLICK$1 = 'click';
const EVENT_FOCUSIN$1 = 'focusin';
const EVENT_FOCUSOUT$1 = 'focusout';
const EVENT_MOUSEENTER = 'mouseenter';
const EVENT_MOUSELEAVE = 'mouseleave';
const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: isRTL() ? 'left' : 'right',
  BOTTOM: 'bottom',
  LEFT: isRTL() ? 'right' : 'left'
};
const Default$3 = {
  allowList: DefaultAllowlist,
  animation: true,
  boundary: 'clippingParents',
  container: false,
  customClass: '',
  delay: 0,
  fallbackPlacements: ['top', 'right', 'bottom', 'left'],
  html: false,
  offset: [0, 0],
  placement: 'top',
  popperConfig: null,
  sanitize: true,
  sanitizeFn: null,
  selector: false,
  template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
  title: '',
  trigger: 'hover focus'
};
const DefaultType$3 = {
  allowList: 'object',
  animation: 'boolean',
  boundary: '(string|element)',
  container: '(string|element|boolean)',
  customClass: '(string|function)',
  delay: '(number|object)',
  fallbackPlacements: 'array',
  html: 'boolean',
  offset: '(array|string|function)',
  placement: '(string|function)',
  popperConfig: '(null|object|function)',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  selector: '(string|boolean)',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string'
};
/**
 * Class definition
 */

class Tooltip extends BaseComponent {
  constructor(element, config) {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
    }

    super(element, config); // Private

    this._isEnabled = true;
    this._timeout = 0;
    this._isHovered = null;
    this._activeTrigger = {};
    this._popper = null;
    this._templateFactory = null;
    this._newContent = null; // Protected

    this.tip = null;

    this._setListeners();

    if (!this._config.selector) {
      this._fixTitle();
    }
  } // Getters


  static get Default() {
    return Default$3;
  }

  static get DefaultType() {
    return DefaultType$3;
  }

  static get NAME() {
    return NAME$4;
  } // Public


  enable() {
    this._isEnabled = true;
  }

  disable() {
    this._isEnabled = false;
  }

  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }

  toggle() {
    if (!this._isEnabled) {
      return;
    }

    this._activeTrigger.click = !this._activeTrigger.click;

    if (this._isShown()) {
      this._leave();

      return;
    }

    this._enter();
  }

  dispose() {
    clearTimeout(this._timeout);
    EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

    if (this.tip) {
      this.tip.remove();
    }

    if (this._element.getAttribute('data-bs-original-title')) {
      this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
    }

    this._disposePopper();

    super.dispose();
  }

  show() {
    if (this._element.style.display === 'none') {
      throw new Error('Please use show on visible elements');
    }

    if (!(this._isWithContent() && this._isEnabled)) {
      return;
    }

    const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
    const shadowRoot = findShadowRoot(this._element);

    const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);

    if (showEvent.defaultPrevented || !isInTheDom) {
      return;
    } // todo v6 remove this OR make it optional


    if (this.tip) {
      this.tip.remove();
      this.tip = null;
    }

    const tip = this._getTipElement();

    this._element.setAttribute('aria-describedby', tip.getAttribute('id'));

    const {
      container
    } = this._config;

    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip);
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
    }

    if (this._popper) {
      this._popper.update();
    } else {
      this._popper = this._createPopper(tip);
    }

    tip.classList.add(CLASS_NAME_SHOW$2); // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }

    const complete = () => {
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));

      if (this._isHovered === false) {
        this._leave();
      }

      this._isHovered = false;
    };

    this._queueCallback(complete, this.tip, this._isAnimated());
  }

  hide() {
    if (!this._isShown()) {
      return;
    }

    const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));

    if (hideEvent.defaultPrevented) {
      return;
    }

    const tip = this._getTipElement();

    tip.classList.remove(CLASS_NAME_SHOW$2); // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support

    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }

    this._activeTrigger[TRIGGER_CLICK] = false;
    this._activeTrigger[TRIGGER_FOCUS] = false;
    this._activeTrigger[TRIGGER_HOVER] = false;
    this._isHovered = null; // it is a trick to support manual triggering

    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return;
      }

      if (!this._isHovered) {
        tip.remove();
      }

      this._element.removeAttribute('aria-describedby');

      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));

      this._disposePopper();
    };

    this._queueCallback(complete, this.tip, this._isAnimated());
  }

  update() {
    if (this._popper) {
      this._popper.update();
    }
  } // Protected


  _isWithContent() {
    return Boolean(this._getTitle());
  }

  _getTipElement() {
    if (!this.tip) {
      this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
    }

    return this.tip;
  }

  _createTipElement(content) {
    const tip = this._getTemplateFactory(content).toHtml(); // todo: remove this check on v6


    if (!tip) {
      return null;
    }

    tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2); // todo: on v6 the following can be achieved with CSS only

    tip.classList.add(`bs-${this.constructor.NAME}-auto`);
    const tipId = getUID(this.constructor.NAME).toString();
    tip.setAttribute('id', tipId);

    if (this._isAnimated()) {
      tip.classList.add(CLASS_NAME_FADE$2);
    }

    return tip;
  }

  setContent(content) {
    this._newContent = content;

    if (this._isShown()) {
      this._disposePopper();

      this.show();
    }
  }

  _getTemplateFactory(content) {
    if (this._templateFactory) {
      this._templateFactory.changeContent(content);
    } else {
      this._templateFactory = new TemplateFactory({ ...this._config,
        // the `content` var has to be after `this._config`
        // to override config.content in case of popover
        content,
        extraClass: this._resolvePossibleFunction(this._config.customClass)
      });
    }

    return this._templateFactory;
  }

  _getContentForTemplate() {
    return {
      [SELECTOR_TOOLTIP_INNER]: this._getTitle()
    };
  }

  _getTitle() {
    return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
  } // Private


  _initializeOnDelegatedTarget(event) {
    return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
  }

  _isAnimated() {
    return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
  }

  _isShown() {
    return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
  }

  _createPopper(tip) {
    const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;
    const attachment = AttachmentMap[placement.toUpperCase()];
    return _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(this._element, tip, this._getPopperConfig(attachment));
  }

  _getOffset() {
    const {
      offset
    } = this._config;

    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10));
    }

    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }

    return offset;
  }

  _resolvePossibleFunction(arg) {
    return typeof arg === 'function' ? arg.call(this._element) : arg;
  }

  _getPopperConfig(attachment) {
    const defaultBsPopperConfig = {
      placement: attachment,
      modifiers: [{
        name: 'flip',
        options: {
          fallbackPlacements: this._config.fallbackPlacements
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }, {
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'arrow',
        options: {
          element: `.${this.constructor.NAME}-arrow`
        }
      }, {
        name: 'preSetPlacement',
        enabled: true,
        phase: 'beforeMain',
        fn: data => {
          // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
          // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
          this._getTipElement().setAttribute('data-popper-placement', data.state.placement);
        }
      }]
    };
    return { ...defaultBsPopperConfig,
      ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
    };
  }

  _setListeners() {
    const triggers = this._config.trigger.split(' ');

    for (const trigger of triggers) {
      if (trigger === 'click') {
        EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);

          context.toggle();
        });
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
        const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
        EventHandler.on(this._element, eventIn, this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);

          context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;

          context._enter();
        });
        EventHandler.on(this._element, eventOut, this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);

          context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);

          context._leave();
        });
      }
    }

    this._hideModalHandler = () => {
      if (this._element) {
        this.hide();
      }
    };

    EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
  }

  _fixTitle() {
    const title = this._element.getAttribute('title');

    if (!title) {
      return;
    }

    if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
      this._element.setAttribute('aria-label', title);
    }

    this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility


    this._element.removeAttribute('title');
  }

  _enter() {
    if (this._isShown() || this._isHovered) {
      this._isHovered = true;
      return;
    }

    this._isHovered = true;

    this._setTimeout(() => {
      if (this._isHovered) {
        this.show();
      }
    }, this._config.delay.show);
  }

  _leave() {
    if (this._isWithActiveTrigger()) {
      return;
    }

    this._isHovered = false;

    this._setTimeout(() => {
      if (!this._isHovered) {
        this.hide();
      }
    }, this._config.delay.hide);
  }

  _setTimeout(handler, timeout) {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(handler, timeout);
  }

  _isWithActiveTrigger() {
    return Object.values(this._activeTrigger).includes(true);
  }

  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);

    for (const dataAttribute of Object.keys(dataAttributes)) {
      if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
        delete dataAttributes[dataAttribute];
      }
    }

    config = { ...dataAttributes,
      ...(typeof config === 'object' && config ? config : {})
    };
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);

    this._typeCheckConfig(config);

    return config;
  }

  _configAfterMerge(config) {
    config.container = config.container === false ? document.body : getElement(config.container);

    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      };
    }

    if (typeof config.title === 'number') {
      config.title = config.title.toString();
    }

    if (typeof config.content === 'number') {
      config.content = config.content.toString();
    }

    return config;
  }

  _getDelegateConfig() {
    const config = {};

    for (const key in this._config) {
      if (this.constructor.Default[key] !== this._config[key]) {
        config[key] = this._config[key];
      }
    }

    config.selector = false;
    config.trigger = 'manual'; // In the future can be replaced with:
    // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
    // `Object.fromEntries(keysWithDifferentValues)`

    return config;
  }

  _disposePopper() {
    if (this._popper) {
      this._popper.destroy();

      this._popper = null;
    }
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tooltip.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

}
/**
 * jQuery
 */


defineJQueryPlugin(Tooltip);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$3 = 'popover';
const SELECTOR_TITLE = '.popover-header';
const SELECTOR_CONTENT = '.popover-body';
const Default$2 = { ...Tooltip.Default,
  content: '',
  offset: [0, 8],
  placement: 'right',
  template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>',
  trigger: 'click'
};
const DefaultType$2 = { ...Tooltip.DefaultType,
  content: '(null|string|element|function)'
};
/**
 * Class definition
 */

class Popover extends Tooltip {
  // Getters
  static get Default() {
    return Default$2;
  }

  static get DefaultType() {
    return DefaultType$2;
  }

  static get NAME() {
    return NAME$3;
  } // Overrides


  _isWithContent() {
    return this._getTitle() || this._getContent();
  } // Private


  _getContentForTemplate() {
    return {
      [SELECTOR_TITLE]: this._getTitle(),
      [SELECTOR_CONTENT]: this._getContent()
    };
  }

  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Popover.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

}
/**
 * jQuery
 */


defineJQueryPlugin(Popover);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$2 = 'scrollspy';
const DATA_KEY$2 = 'bs.scrollspy';
const EVENT_KEY$2 = `.${DATA_KEY$2}`;
const DATA_API_KEY = '.data-api';
const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
const EVENT_CLICK = `click${EVENT_KEY$2}`;
const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
const CLASS_NAME_ACTIVE$1 = 'active';
const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
const SELECTOR_TARGET_LINKS = '[href]';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_NAV_LINKS = '.nav-link';
const SELECTOR_NAV_ITEMS = '.nav-item';
const SELECTOR_LIST_ITEMS = '.list-group-item';
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
const SELECTOR_DROPDOWN = '.dropdown';
const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
const Default$1 = {
  offset: null,
  // TODO: v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: '0px 0px -25%',
  smoothScroll: false,
  target: null,
  threshold: [0.1, 0.5, 1]
};
const DefaultType$1 = {
  offset: '(number|null)',
  // TODO v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: 'string',
  smoothScroll: 'boolean',
  target: 'element',
  threshold: 'array'
};
/**
 * Class definition
 */

class ScrollSpy extends BaseComponent {
  constructor(element, config) {
    super(element, config); // this._element is the observablesContainer and config.target the menu links wrapper

    this._targetLinks = new Map();
    this._observableSections = new Map();
    this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
    this._activeTarget = null;
    this._observer = null;
    this._previousScrollData = {
      visibleEntryTop: 0,
      parentScrollTop: 0
    };
    this.refresh(); // initialize
  } // Getters


  static get Default() {
    return Default$1;
  }

  static get DefaultType() {
    return DefaultType$1;
  }

  static get NAME() {
    return NAME$2;
  } // Public


  refresh() {
    this._initializeTargetsAndObservables();

    this._maybeEnableSmoothScroll();

    if (this._observer) {
      this._observer.disconnect();
    } else {
      this._observer = this._getNewObserver();
    }

    for (const section of this._observableSections.values()) {
      this._observer.observe(section);
    }
  }

  dispose() {
    this._observer.disconnect();

    super.dispose();
  } // Private


  _configAfterMerge(config) {
    // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
    config.target = getElement(config.target) || document.body; // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only

    config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;

    if (typeof config.threshold === 'string') {
      config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
    }

    return config;
  }

  _maybeEnableSmoothScroll() {
    if (!this._config.smoothScroll) {
      return;
    } // unregister any previous listeners


    EventHandler.off(this._config.target, EVENT_CLICK);
    EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
      const observableSection = this._observableSections.get(event.target.hash);

      if (observableSection) {
        event.preventDefault();
        const root = this._rootElement || window;
        const height = observableSection.offsetTop - this._element.offsetTop;

        if (root.scrollTo) {
          root.scrollTo({
            top: height,
            behavior: 'smooth'
          });
          return;
        } // Chrome 60 doesn't support `scrollTo`


        root.scrollTop = height;
      }
    });
  }

  _getNewObserver() {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin
    };
    return new IntersectionObserver(entries => this._observerCallback(entries), options);
  } // The logic of selection


  _observerCallback(entries) {
    const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);

    const activate = entry => {
      this._previousScrollData.visibleEntryTop = entry.target.offsetTop;

      this._process(targetElement(entry));
    };

    const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
    const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
    this._previousScrollData.parentScrollTop = parentScrollTop;

    for (const entry of entries) {
      if (!entry.isIntersecting) {
        this._activeTarget = null;

        this._clearActiveClass(targetElement(entry));

        continue;
      }

      const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop; // if we are scrolling down, pick the bigger offsetTop

      if (userScrollsDown && entryIsLowerThanPrevious) {
        activate(entry); // if parent isn't scrolled, let's keep the first visible item, breaking the iteration

        if (!parentScrollTop) {
          return;
        }

        continue;
      } // if we are scrolling up, pick the smallest offsetTop


      if (!userScrollsDown && !entryIsLowerThanPrevious) {
        activate(entry);
      }
    }
  }

  _initializeTargetsAndObservables() {
    this._targetLinks = new Map();
    this._observableSections = new Map();
    const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);

    for (const anchor of targetLinks) {
      // ensure that the anchor has an id and is not disabled
      if (!anchor.hash || isDisabled(anchor)) {
        continue;
      }

      const observableSection = SelectorEngine.findOne(anchor.hash, this._element); // ensure that the observableSection exists & is visible

      if (isVisible(observableSection)) {
        this._targetLinks.set(anchor.hash, anchor);

        this._observableSections.set(anchor.hash, observableSection);
      }
    }
  }

  _process(target) {
    if (this._activeTarget === target) {
      return;
    }

    this._clearActiveClass(this._config.target);

    this._activeTarget = target;
    target.classList.add(CLASS_NAME_ACTIVE$1);

    this._activateParents(target);

    EventHandler.trigger(this._element, EVENT_ACTIVATE, {
      relatedTarget: target
    });
  }

  _activateParents(target) {
    // Activate dropdown parents
    if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
      return;
    }

    for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
      // Set triggered links parents as active
      // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
      for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
        item.classList.add(CLASS_NAME_ACTIVE$1);
      }
    }
  }

  _clearActiveClass(parent) {
    parent.classList.remove(CLASS_NAME_ACTIVE$1);
    const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);

    for (const node of activeNodes) {
      node.classList.remove(CLASS_NAME_ACTIVE$1);
    }
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
  for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
    ScrollSpy.getOrCreateInstance(spy);
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(ScrollSpy);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$1 = 'tab';
const DATA_KEY$1 = 'bs.tab';
const EVENT_KEY$1 = `.${DATA_KEY$1}`;
const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_FADE$1 = 'fade';
const CLASS_NAME_SHOW$1 = 'show';
const CLASS_DROPDOWN = 'dropdown';
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
const NOT_SELECTOR_DROPDOWN_TOGGLE = ':not(.dropdown-toggle)';
const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
const SELECTOR_OUTER = '.nav-item, .list-group-item';
const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // todo:v6: could be only `tab`

const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;
/**
 * Class definition
 */

class Tab extends BaseComponent {
  constructor(element) {
    super(element);
    this._parent = this._element.closest(SELECTOR_TAB_PANEL);

    if (!this._parent) {
      return; // todo: should Throw exception on v6
      // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
    } // Set up initial aria attributes


    this._setInitialAttributes(this._parent, this._getChildren());

    EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
  } // Getters


  static get NAME() {
    return NAME$1;
  } // Public


  show() {
    // Shows this elem and deactivate the active sibling if exists
    const innerElem = this._element;

    if (this._elemIsActive(innerElem)) {
      return;
    } // Search for active tab on same parent to deactivate it


    const active = this._getActiveElem();

    const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
      relatedTarget: innerElem
    }) : null;
    const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
      relatedTarget: active
    });

    if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
      return;
    }

    this._deactivate(active, innerElem);

    this._activate(innerElem, active);
  } // Private


  _activate(element, relatedElem) {
    if (!element) {
      return;
    }

    element.classList.add(CLASS_NAME_ACTIVE);

    this._activate(getElementFromSelector(element)); // Search and activate/show the proper section


    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.add(CLASS_NAME_SHOW$1);
        return;
      }

      element.removeAttribute('tabindex');
      element.setAttribute('aria-selected', true);

      this._toggleDropDown(element, true);

      EventHandler.trigger(element, EVENT_SHOWN$1, {
        relatedTarget: relatedElem
      });
    };

    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }

  _deactivate(element, relatedElem) {
    if (!element) {
      return;
    }

    element.classList.remove(CLASS_NAME_ACTIVE);
    element.blur();

    this._deactivate(getElementFromSelector(element)); // Search and deactivate the shown section too


    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.remove(CLASS_NAME_SHOW$1);
        return;
      }

      element.setAttribute('aria-selected', false);
      element.setAttribute('tabindex', '-1');

      this._toggleDropDown(element, false);

      EventHandler.trigger(element, EVENT_HIDDEN$1, {
        relatedTarget: relatedElem
      });
    };

    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }

  _keydown(event) {
    if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY].includes(event.key)) {
      return;
    }

    event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page

    event.preventDefault();
    const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
    const nextActiveElement = getNextActiveElement(this._getChildren().filter(element => !isDisabled(element)), event.target, isNext, true);

    if (nextActiveElement) {
      nextActiveElement.focus({
        preventScroll: true
      });
      Tab.getOrCreateInstance(nextActiveElement).show();
    }
  }

  _getChildren() {
    // collection of inner elements
    return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
  }

  _getActiveElem() {
    return this._getChildren().find(child => this._elemIsActive(child)) || null;
  }

  _setInitialAttributes(parent, children) {
    this._setAttributeIfNotExists(parent, 'role', 'tablist');

    for (const child of children) {
      this._setInitialAttributesOnChild(child);
    }
  }

  _setInitialAttributesOnChild(child) {
    child = this._getInnerElement(child);

    const isActive = this._elemIsActive(child);

    const outerElem = this._getOuterElement(child);

    child.setAttribute('aria-selected', isActive);

    if (outerElem !== child) {
      this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
    }

    if (!isActive) {
      child.setAttribute('tabindex', '-1');
    }

    this._setAttributeIfNotExists(child, 'role', 'tab'); // set attributes to the related panel too


    this._setInitialAttributesOnTargetPanel(child);
  }

  _setInitialAttributesOnTargetPanel(child) {
    const target = getElementFromSelector(child);

    if (!target) {
      return;
    }

    this._setAttributeIfNotExists(target, 'role', 'tabpanel');

    if (child.id) {
      this._setAttributeIfNotExists(target, 'aria-labelledby', `#${child.id}`);
    }
  }

  _toggleDropDown(element, open) {
    const outerElem = this._getOuterElement(element);

    if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
      return;
    }

    const toggle = (selector, className) => {
      const element = SelectorEngine.findOne(selector, outerElem);

      if (element) {
        element.classList.toggle(className, open);
      }
    };

    toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
    toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
    outerElem.setAttribute('aria-expanded', open);
  }

  _setAttributeIfNotExists(element, attribute, value) {
    if (!element.hasAttribute(attribute)) {
      element.setAttribute(attribute, value);
    }
  }

  _elemIsActive(elem) {
    return elem.classList.contains(CLASS_NAME_ACTIVE);
  } // Try to get the inner element (usually the .nav-link)


  _getInnerElement(elem) {
    return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
  } // Try to get the outer element (usually the .nav-item)


  _getOuterElement(elem) {
    return elem.closest(SELECTOR_OUTER) || elem;
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tab.getOrCreateInstance(this);

      if (typeof config !== 'string') {
        return;
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }

  if (isDisabled(this)) {
    return;
  }

  Tab.getOrCreateInstance(this).show();
});
/**
 * Initialize on focus
 */

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
    Tab.getOrCreateInstance(element);
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(Tab);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.2): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME = 'toast';
const DATA_KEY = 'bs.toast';
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility

const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_SHOWING = 'showing';
const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
};
const Default = {
  animation: true,
  autohide: true,
  delay: 5000
};
/**
 * Class definition
 */

class Toast extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._timeout = null;
    this._hasMouseInteraction = false;
    this._hasKeyboardInteraction = false;

    this._setListeners();
  } // Getters


  static get Default() {
    return Default;
  }

  static get DefaultType() {
    return DefaultType;
  }

  static get NAME() {
    return NAME;
  } // Public


  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

    if (showEvent.defaultPrevented) {
      return;
    }

    this._clearTimeout();

    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE);
    }

    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING);

      EventHandler.trigger(this._element, EVENT_SHOWN);

      this._maybeScheduleHide();
    };

    this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated


    reflow(this._element);

    this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);

    this._queueCallback(complete, this._element, this._config.animation);
  }

  hide() {
    if (!this.isShown()) {
      return;
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

    if (hideEvent.defaultPrevented) {
      return;
    }

    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE); // @deprecated


      this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);

      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };

    this._element.classList.add(CLASS_NAME_SHOWING);

    this._queueCallback(complete, this._element, this._config.animation);
  }

  dispose() {
    this._clearTimeout();

    if (this.isShown()) {
      this._element.classList.remove(CLASS_NAME_SHOW);
    }

    super.dispose();
  }

  isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  } // Private


  _maybeScheduleHide() {
    if (!this._config.autohide) {
      return;
    }

    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return;
    }

    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }

  _onInteraction(event, isInteracting) {
    switch (event.type) {
      case 'mouseover':
      case 'mouseout':
        {
          this._hasMouseInteraction = isInteracting;
          break;
        }

      case 'focusin':
      case 'focusout':
        {
          this._hasKeyboardInteraction = isInteracting;
          break;
        }
    }

    if (isInteracting) {
      this._clearTimeout();

      return;
    }

    const nextElement = event.relatedTarget;

    if (this._element === nextElement || this._element.contains(nextElement)) {
      return;
    }

    this._maybeScheduleHide();
  }

  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
    EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
  }

  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Toast.getOrCreateInstance(this, config);

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](this);
      }
    });
  }

}
/**
 * Data API implementation
 */


enableDismissTrigger(Toast);
/**
 * jQuery
 */

defineJQueryPlugin(Toast);


//# sourceMappingURL=bootstrap.esm.js.map


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/scss/styles.scss":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/scss/styles.scss ***!
  \*********************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27m6 10 3 3 6-6%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27m6 10 3 3 6-6%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%272%27 fill=%27%23fff%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%272%27 fill=%27%23fff%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10h8%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10h8%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27rgba%280, 0, 0, 0.25%29%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27rgba%280, 0, 0, 0.25%29%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%2386b7fe%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%2386b7fe%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_6___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%23fff%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%23fff%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_7___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%23198754%27 d=%27M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%23198754%27 d=%27M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_8___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_9___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%280, 0, 0, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%280, 0, 0, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_10___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%28255, 255, 255, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%28255, 255, 255, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_11___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23212529%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23212529%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_12___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%230c63e4%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%230c63e4%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_13___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath d=%27M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath d=%27M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_14___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_15___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);
var ___CSS_LOADER_URL_REPLACEMENT_6___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_6___);
var ___CSS_LOADER_URL_REPLACEMENT_7___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_7___);
var ___CSS_LOADER_URL_REPLACEMENT_8___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_8___);
var ___CSS_LOADER_URL_REPLACEMENT_9___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_9___);
var ___CSS_LOADER_URL_REPLACEMENT_10___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_10___);
var ___CSS_LOADER_URL_REPLACEMENT_11___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_11___);
var ___CSS_LOADER_URL_REPLACEMENT_12___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_12___);
var ___CSS_LOADER_URL_REPLACEMENT_13___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_13___);
var ___CSS_LOADER_URL_REPLACEMENT_14___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_14___);
var ___CSS_LOADER_URL_REPLACEMENT_15___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_15___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n/*!\n * Bootstrap  v5.2.2 (https://getbootstrap.com/)\n * Copyright 2011-2022 The Bootstrap Authors\n * Copyright 2011-2022 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)\n */\n:root {\n  --bs-blue: #0d6efd;\n  --bs-indigo: #6610f2;\n  --bs-purple: #6f42c1;\n  --bs-pink: #d63384;\n  --bs-red: #dc3545;\n  --bs-orange: #fd7e14;\n  --bs-yellow: #ffc107;\n  --bs-green: #198754;\n  --bs-teal: #20c997;\n  --bs-cyan: #0dcaf0;\n  --bs-black: #000;\n  --bs-white: #fff;\n  --bs-gray: #6c757d;\n  --bs-gray-dark: #343a40;\n  --bs-gray-100: #f8f9fa;\n  --bs-gray-200: #e9ecef;\n  --bs-gray-300: #dee2e6;\n  --bs-gray-400: #ced4da;\n  --bs-gray-500: #adb5bd;\n  --bs-gray-600: #6c757d;\n  --bs-gray-700: #495057;\n  --bs-gray-800: #343a40;\n  --bs-gray-900: #212529;\n  --bs-primary: #0d6efd;\n  --bs-secondary: #6c757d;\n  --bs-success: #198754;\n  --bs-info: #0dcaf0;\n  --bs-warning: #ffc107;\n  --bs-danger: #dc3545;\n  --bs-light: #f8f9fa;\n  --bs-dark: #212529;\n  --bs-primary-rgb: 13, 110, 253;\n  --bs-secondary-rgb: 108, 117, 125;\n  --bs-success-rgb: 25, 135, 84;\n  --bs-info-rgb: 13, 202, 240;\n  --bs-warning-rgb: 255, 193, 7;\n  --bs-danger-rgb: 220, 53, 69;\n  --bs-light-rgb: 248, 249, 250;\n  --bs-dark-rgb: 33, 37, 41;\n  --bs-white-rgb: 255, 255, 255;\n  --bs-black-rgb: 0, 0, 0;\n  --bs-body-color-rgb: 33, 37, 41;\n  --bs-body-bg-rgb: 255, 255, 255;\n  --bs-font-sans-serif: system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", \"Liberation Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  --bs-font-monospace: SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n  --bs-gradient: linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));\n  --bs-body-font-family: var(--bs-font-sans-serif);\n  --bs-body-font-size: 1rem;\n  --bs-body-font-weight: 400;\n  --bs-body-line-height: 1.5;\n  --bs-body-color: #212529;\n  --bs-body-bg: #fff;\n  --bs-border-width: 1px;\n  --bs-border-style: solid;\n  --bs-border-color: #dee2e6;\n  --bs-border-color-translucent: rgba(0, 0, 0, 0.175);\n  --bs-border-radius: 0.375rem;\n  --bs-border-radius-sm: 0.25rem;\n  --bs-border-radius-lg: 0.5rem;\n  --bs-border-radius-xl: 1rem;\n  --bs-border-radius-2xl: 2rem;\n  --bs-border-radius-pill: 50rem;\n  --bs-link-color: #0d6efd;\n  --bs-link-hover-color: #0a58ca;\n  --bs-code-color: #d63384;\n  --bs-highlight-bg: #fff3cd;\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  :root {\n    scroll-behavior: smooth;\n  }\n}\n\nbody {\n  margin: 0;\n  font-family: var(--bs-body-font-family);\n  font-size: var(--bs-body-font-size);\n  font-weight: var(--bs-body-font-weight);\n  line-height: var(--bs-body-line-height);\n  color: var(--bs-body-color);\n  text-align: var(--bs-body-text-align);\n  background-color: var(--bs-body-bg);\n  -webkit-text-size-adjust: 100%;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\n\nhr {\n  margin: 1rem 0;\n  color: inherit;\n  border: 0;\n  border-top: 1px solid;\n  opacity: 0.25;\n}\n\nh6, .h6, h5, .h5, h4, .h4, h3, .h3, h2, .h2, h1, .h1 {\n  margin-top: 0;\n  margin-bottom: 0.5rem;\n  font-weight: 500;\n  line-height: 1.2;\n}\n\nh1, .h1 {\n  font-size: calc(1.375rem + 1.5vw);\n}\n@media (min-width: 1200px) {\n  h1, .h1 {\n    font-size: 2.5rem;\n  }\n}\n\nh2, .h2 {\n  font-size: calc(1.325rem + 0.9vw);\n}\n@media (min-width: 1200px) {\n  h2, .h2 {\n    font-size: 2rem;\n  }\n}\n\nh3, .h3 {\n  font-size: calc(1.3rem + 0.6vw);\n}\n@media (min-width: 1200px) {\n  h3, .h3 {\n    font-size: 1.75rem;\n  }\n}\n\nh4, .h4 {\n  font-size: calc(1.275rem + 0.3vw);\n}\n@media (min-width: 1200px) {\n  h4, .h4 {\n    font-size: 1.5rem;\n  }\n}\n\nh5, .h5 {\n  font-size: 1.25rem;\n}\n\nh6, .h6 {\n  font-size: 1rem;\n}\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\nabbr[title] {\n  text-decoration: underline dotted;\n  cursor: help;\n  text-decoration-skip-ink: none;\n}\n\naddress {\n  margin-bottom: 1rem;\n  font-style: normal;\n  line-height: inherit;\n}\n\nol,\nul {\n  padding-left: 2rem;\n}\n\nol,\nul,\ndl {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\nol ol,\nul ul,\nol ul,\nul ol {\n  margin-bottom: 0;\n}\n\ndt {\n  font-weight: 700;\n}\n\ndd {\n  margin-bottom: 0.5rem;\n  margin-left: 0;\n}\n\nblockquote {\n  margin: 0 0 1rem;\n}\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\nsmall, .small {\n  font-size: 0.875em;\n}\n\nmark, .mark {\n  padding: 0.1875em;\n  background-color: var(--bs-highlight-bg);\n}\n\nsub,\nsup {\n  position: relative;\n  font-size: 0.75em;\n  line-height: 0;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\na {\n  color: var(--bs-link-color);\n  text-decoration: underline;\n}\na:hover {\n  color: var(--bs-link-hover-color);\n}\n\na:not([href]):not([class]), a:not([href]):not([class]):hover {\n  color: inherit;\n  text-decoration: none;\n}\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: var(--bs-font-monospace);\n  font-size: 1em;\n}\n\npre {\n  display: block;\n  margin-top: 0;\n  margin-bottom: 1rem;\n  overflow: auto;\n  font-size: 0.875em;\n}\npre code {\n  font-size: inherit;\n  color: inherit;\n  word-break: normal;\n}\n\ncode {\n  font-size: 0.875em;\n  color: var(--bs-code-color);\n  word-wrap: break-word;\n}\na > code {\n  color: inherit;\n}\n\nkbd {\n  padding: 0.1875rem 0.375rem;\n  font-size: 0.875em;\n  color: var(--bs-body-bg);\n  background-color: var(--bs-body-color);\n  border-radius: 0.25rem;\n}\nkbd kbd {\n  padding: 0;\n  font-size: 1em;\n}\n\nfigure {\n  margin: 0 0 1rem;\n}\n\nimg,\nsvg {\n  vertical-align: middle;\n}\n\ntable {\n  caption-side: bottom;\n  border-collapse: collapse;\n}\n\ncaption {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  color: #6c757d;\n  text-align: left;\n}\n\nth {\n  text-align: inherit;\n  text-align: -webkit-match-parent;\n}\n\nthead,\ntbody,\ntfoot,\ntr,\ntd,\nth {\n  border-color: inherit;\n  border-style: solid;\n  border-width: 0;\n}\n\nlabel {\n  display: inline-block;\n}\n\nbutton {\n  border-radius: 0;\n}\n\nbutton:focus:not(:focus-visible) {\n  outline: 0;\n}\n\ninput,\nbutton,\nselect,\noptgroup,\ntextarea {\n  margin: 0;\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n[role=button] {\n  cursor: pointer;\n}\n\nselect {\n  word-wrap: normal;\n}\nselect:disabled {\n  opacity: 1;\n}\n\n[list]:not([type=date]):not([type=datetime-local]):not([type=month]):not([type=week]):not([type=time])::-webkit-calendar-picker-indicator {\n  display: none !important;\n}\n\nbutton,\n[type=button],\n[type=reset],\n[type=submit] {\n  -webkit-appearance: button;\n}\nbutton:not(:disabled),\n[type=button]:not(:disabled),\n[type=reset]:not(:disabled),\n[type=submit]:not(:disabled) {\n  cursor: pointer;\n}\n\n::-moz-focus-inner {\n  padding: 0;\n  border-style: none;\n}\n\ntextarea {\n  resize: vertical;\n}\n\nfieldset {\n  min-width: 0;\n  padding: 0;\n  margin: 0;\n  border: 0;\n}\n\nlegend {\n  float: left;\n  width: 100%;\n  padding: 0;\n  margin-bottom: 0.5rem;\n  font-size: calc(1.275rem + 0.3vw);\n  line-height: inherit;\n}\n@media (min-width: 1200px) {\n  legend {\n    font-size: 1.5rem;\n  }\n}\nlegend + * {\n  clear: left;\n}\n\n::-webkit-datetime-edit-fields-wrapper,\n::-webkit-datetime-edit-text,\n::-webkit-datetime-edit-minute,\n::-webkit-datetime-edit-hour-field,\n::-webkit-datetime-edit-day-field,\n::-webkit-datetime-edit-month-field,\n::-webkit-datetime-edit-year-field {\n  padding: 0;\n}\n\n::-webkit-inner-spin-button {\n  height: auto;\n}\n\n[type=search] {\n  outline-offset: -2px;\n  -webkit-appearance: textfield;\n}\n\n/* rtl:raw:\n[type=\"tel\"],\n[type=\"url\"],\n[type=\"email\"],\n[type=\"number\"] {\n  direction: ltr;\n}\n*/\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n::-webkit-color-swatch-wrapper {\n  padding: 0;\n}\n\n::file-selector-button {\n  font: inherit;\n  -webkit-appearance: button;\n}\n\noutput {\n  display: inline-block;\n}\n\niframe {\n  border: 0;\n}\n\nsummary {\n  display: list-item;\n  cursor: pointer;\n}\n\nprogress {\n  vertical-align: baseline;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n.lead {\n  font-size: 1.25rem;\n  font-weight: 300;\n}\n\n.display-1 {\n  font-size: calc(1.625rem + 4.5vw);\n  font-weight: 300;\n  line-height: 1.2;\n}\n@media (min-width: 1200px) {\n  .display-1 {\n    font-size: 5rem;\n  }\n}\n\n.display-2 {\n  font-size: calc(1.575rem + 3.9vw);\n  font-weight: 300;\n  line-height: 1.2;\n}\n@media (min-width: 1200px) {\n  .display-2 {\n    font-size: 4.5rem;\n  }\n}\n\n.display-3 {\n  font-size: calc(1.525rem + 3.3vw);\n  font-weight: 300;\n  line-height: 1.2;\n}\n@media (min-width: 1200px) {\n  .display-3 {\n    font-size: 4rem;\n  }\n}\n\n.display-4 {\n  font-size: calc(1.475rem + 2.7vw);\n  font-weight: 300;\n  line-height: 1.2;\n}\n@media (min-width: 1200px) {\n  .display-4 {\n    font-size: 3.5rem;\n  }\n}\n\n.display-5 {\n  font-size: calc(1.425rem + 2.1vw);\n  font-weight: 300;\n  line-height: 1.2;\n}\n@media (min-width: 1200px) {\n  .display-5 {\n    font-size: 3rem;\n  }\n}\n\n.display-6 {\n  font-size: calc(1.375rem + 1.5vw);\n  font-weight: 300;\n  line-height: 1.2;\n}\n@media (min-width: 1200px) {\n  .display-6 {\n    font-size: 2.5rem;\n  }\n}\n\n.list-unstyled {\n  padding-left: 0;\n  list-style: none;\n}\n\n.list-inline {\n  padding-left: 0;\n  list-style: none;\n}\n\n.list-inline-item {\n  display: inline-block;\n}\n.list-inline-item:not(:last-child) {\n  margin-right: 0.5rem;\n}\n\n.initialism {\n  font-size: 0.875em;\n  text-transform: uppercase;\n}\n\n.blockquote {\n  margin-bottom: 1rem;\n  font-size: 1.25rem;\n}\n.blockquote > :last-child {\n  margin-bottom: 0;\n}\n\n.blockquote-footer {\n  margin-top: -1rem;\n  margin-bottom: 1rem;\n  font-size: 0.875em;\n  color: #6c757d;\n}\n.blockquote-footer::before {\n  content: \"— \";\n}\n\n.img-fluid {\n  max-width: 100%;\n  height: auto;\n}\n\n.img-thumbnail {\n  padding: 0.25rem;\n  background-color: #fff;\n  border: 1px solid var(--bs-border-color);\n  border-radius: 0.375rem;\n  max-width: 100%;\n  height: auto;\n}\n\n.figure {\n  display: inline-block;\n}\n\n.figure-img {\n  margin-bottom: 0.5rem;\n  line-height: 1;\n}\n\n.figure-caption {\n  font-size: 0.875em;\n  color: #6c757d;\n}\n\n.container,\n.container-fluid,\n.container-xxl,\n.container-xl,\n.container-lg,\n.container-md,\n.container-sm {\n  --bs-gutter-x: 1.5rem;\n  --bs-gutter-y: 0;\n  width: 100%;\n  padding-right: calc(var(--bs-gutter-x) * 0.5);\n  padding-left: calc(var(--bs-gutter-x) * 0.5);\n  margin-right: auto;\n  margin-left: auto;\n}\n\n@media (min-width: 576px) {\n  .container-sm, .container {\n    max-width: 540px;\n  }\n}\n@media (min-width: 768px) {\n  .container-md, .container-sm, .container {\n    max-width: 720px;\n  }\n}\n@media (min-width: 992px) {\n  .container-lg, .container-md, .container-sm, .container {\n    max-width: 960px;\n  }\n}\n@media (min-width: 1200px) {\n  .container-xl, .container-lg, .container-md, .container-sm, .container {\n    max-width: 1140px;\n  }\n}\n@media (min-width: 1400px) {\n  .container-xxl, .container-xl, .container-lg, .container-md, .container-sm, .container {\n    max-width: 1320px;\n  }\n}\n.row {\n  --bs-gutter-x: 1.5rem;\n  --bs-gutter-y: 0;\n  display: flex;\n  flex-wrap: wrap;\n  margin-top: calc(-1 * var(--bs-gutter-y));\n  margin-right: calc(-0.5 * var(--bs-gutter-x));\n  margin-left: calc(-0.5 * var(--bs-gutter-x));\n}\n.row > * {\n  flex-shrink: 0;\n  width: 100%;\n  max-width: 100%;\n  padding-right: calc(var(--bs-gutter-x) * 0.5);\n  padding-left: calc(var(--bs-gutter-x) * 0.5);\n  margin-top: var(--bs-gutter-y);\n}\n\n.col {\n  flex: 1 0 0%;\n}\n\n.row-cols-auto > * {\n  flex: 0 0 auto;\n  width: auto;\n}\n\n.row-cols-1 > * {\n  flex: 0 0 auto;\n  width: 100%;\n}\n\n.row-cols-2 > * {\n  flex: 0 0 auto;\n  width: 50%;\n}\n\n.row-cols-3 > * {\n  flex: 0 0 auto;\n  width: 33.3333333333%;\n}\n\n.row-cols-4 > * {\n  flex: 0 0 auto;\n  width: 25%;\n}\n\n.row-cols-5 > * {\n  flex: 0 0 auto;\n  width: 20%;\n}\n\n.row-cols-6 > * {\n  flex: 0 0 auto;\n  width: 16.6666666667%;\n}\n\n.col-auto {\n  flex: 0 0 auto;\n  width: auto;\n}\n\n.col-1 {\n  flex: 0 0 auto;\n  width: 8.33333333%;\n}\n\n.col-2 {\n  flex: 0 0 auto;\n  width: 16.66666667%;\n}\n\n.col-3 {\n  flex: 0 0 auto;\n  width: 25%;\n}\n\n.col-4 {\n  flex: 0 0 auto;\n  width: 33.33333333%;\n}\n\n.col-5 {\n  flex: 0 0 auto;\n  width: 41.66666667%;\n}\n\n.col-6 {\n  flex: 0 0 auto;\n  width: 50%;\n}\n\n.col-7 {\n  flex: 0 0 auto;\n  width: 58.33333333%;\n}\n\n.col-8 {\n  flex: 0 0 auto;\n  width: 66.66666667%;\n}\n\n.col-9 {\n  flex: 0 0 auto;\n  width: 75%;\n}\n\n.col-10 {\n  flex: 0 0 auto;\n  width: 83.33333333%;\n}\n\n.col-11 {\n  flex: 0 0 auto;\n  width: 91.66666667%;\n}\n\n.col-12 {\n  flex: 0 0 auto;\n  width: 100%;\n}\n\n.offset-1 {\n  margin-left: 8.33333333%;\n}\n\n.offset-2 {\n  margin-left: 16.66666667%;\n}\n\n.offset-3 {\n  margin-left: 25%;\n}\n\n.offset-4 {\n  margin-left: 33.33333333%;\n}\n\n.offset-5 {\n  margin-left: 41.66666667%;\n}\n\n.offset-6 {\n  margin-left: 50%;\n}\n\n.offset-7 {\n  margin-left: 58.33333333%;\n}\n\n.offset-8 {\n  margin-left: 66.66666667%;\n}\n\n.offset-9 {\n  margin-left: 75%;\n}\n\n.offset-10 {\n  margin-left: 83.33333333%;\n}\n\n.offset-11 {\n  margin-left: 91.66666667%;\n}\n\n.g-0,\n.gx-0 {\n  --bs-gutter-x: 0;\n}\n\n.g-0,\n.gy-0 {\n  --bs-gutter-y: 0;\n}\n\n.g-1,\n.gx-1 {\n  --bs-gutter-x: 0.25rem;\n}\n\n.g-1,\n.gy-1 {\n  --bs-gutter-y: 0.25rem;\n}\n\n.g-2,\n.gx-2 {\n  --bs-gutter-x: 0.5rem;\n}\n\n.g-2,\n.gy-2 {\n  --bs-gutter-y: 0.5rem;\n}\n\n.g-3,\n.gx-3 {\n  --bs-gutter-x: 1rem;\n}\n\n.g-3,\n.gy-3 {\n  --bs-gutter-y: 1rem;\n}\n\n.g-4,\n.gx-4 {\n  --bs-gutter-x: 1.5rem;\n}\n\n.g-4,\n.gy-4 {\n  --bs-gutter-y: 1.5rem;\n}\n\n.g-5,\n.gx-5 {\n  --bs-gutter-x: 3rem;\n}\n\n.g-5,\n.gy-5 {\n  --bs-gutter-y: 3rem;\n}\n\n@media (min-width: 576px) {\n  .col-sm {\n    flex: 1 0 0%;\n  }\n  .row-cols-sm-auto > * {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  .row-cols-sm-1 > * {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n  .row-cols-sm-2 > * {\n    flex: 0 0 auto;\n    width: 50%;\n  }\n  .row-cols-sm-3 > * {\n    flex: 0 0 auto;\n    width: 33.3333333333%;\n  }\n  .row-cols-sm-4 > * {\n    flex: 0 0 auto;\n    width: 25%;\n  }\n  .row-cols-sm-5 > * {\n    flex: 0 0 auto;\n    width: 20%;\n  }\n  .row-cols-sm-6 > * {\n    flex: 0 0 auto;\n    width: 16.6666666667%;\n  }\n  .col-sm-auto {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  .col-sm-1 {\n    flex: 0 0 auto;\n    width: 8.33333333%;\n  }\n  .col-sm-2 {\n    flex: 0 0 auto;\n    width: 16.66666667%;\n  }\n  .col-sm-3 {\n    flex: 0 0 auto;\n    width: 25%;\n  }\n  .col-sm-4 {\n    flex: 0 0 auto;\n    width: 33.33333333%;\n  }\n  .col-sm-5 {\n    flex: 0 0 auto;\n    width: 41.66666667%;\n  }\n  .col-sm-6 {\n    flex: 0 0 auto;\n    width: 50%;\n  }\n  .col-sm-7 {\n    flex: 0 0 auto;\n    width: 58.33333333%;\n  }\n  .col-sm-8 {\n    flex: 0 0 auto;\n    width: 66.66666667%;\n  }\n  .col-sm-9 {\n    flex: 0 0 auto;\n    width: 75%;\n  }\n  .col-sm-10 {\n    flex: 0 0 auto;\n    width: 83.33333333%;\n  }\n  .col-sm-11 {\n    flex: 0 0 auto;\n    width: 91.66666667%;\n  }\n  .col-sm-12 {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n  .offset-sm-0 {\n    margin-left: 0;\n  }\n  .offset-sm-1 {\n    margin-left: 8.33333333%;\n  }\n  .offset-sm-2 {\n    margin-left: 16.66666667%;\n  }\n  .offset-sm-3 {\n    margin-left: 25%;\n  }\n  .offset-sm-4 {\n    margin-left: 33.33333333%;\n  }\n  .offset-sm-5 {\n    margin-left: 41.66666667%;\n  }\n  .offset-sm-6 {\n    margin-left: 50%;\n  }\n  .offset-sm-7 {\n    margin-left: 58.33333333%;\n  }\n  .offset-sm-8 {\n    margin-left: 66.66666667%;\n  }\n  .offset-sm-9 {\n    margin-left: 75%;\n  }\n  .offset-sm-10 {\n    margin-left: 83.33333333%;\n  }\n  .offset-sm-11 {\n    margin-left: 91.66666667%;\n  }\n  .g-sm-0,\n.gx-sm-0 {\n    --bs-gutter-x: 0;\n  }\n  .g-sm-0,\n.gy-sm-0 {\n    --bs-gutter-y: 0;\n  }\n  .g-sm-1,\n.gx-sm-1 {\n    --bs-gutter-x: 0.25rem;\n  }\n  .g-sm-1,\n.gy-sm-1 {\n    --bs-gutter-y: 0.25rem;\n  }\n  .g-sm-2,\n.gx-sm-2 {\n    --bs-gutter-x: 0.5rem;\n  }\n  .g-sm-2,\n.gy-sm-2 {\n    --bs-gutter-y: 0.5rem;\n  }\n  .g-sm-3,\n.gx-sm-3 {\n    --bs-gutter-x: 1rem;\n  }\n  .g-sm-3,\n.gy-sm-3 {\n    --bs-gutter-y: 1rem;\n  }\n  .g-sm-4,\n.gx-sm-4 {\n    --bs-gutter-x: 1.5rem;\n  }\n  .g-sm-4,\n.gy-sm-4 {\n    --bs-gutter-y: 1.5rem;\n  }\n  .g-sm-5,\n.gx-sm-5 {\n    --bs-gutter-x: 3rem;\n  }\n  .g-sm-5,\n.gy-sm-5 {\n    --bs-gutter-y: 3rem;\n  }\n}\n@media (min-width: 768px) {\n  .col-md {\n    flex: 1 0 0%;\n  }\n  .row-cols-md-auto > * {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  .row-cols-md-1 > * {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n  .row-cols-md-2 > * {\n    flex: 0 0 auto;\n    width: 50%;\n  }\n  .row-cols-md-3 > * {\n    flex: 0 0 auto;\n    width: 33.3333333333%;\n  }\n  .row-cols-md-4 > * {\n    flex: 0 0 auto;\n    width: 25%;\n  }\n  .row-cols-md-5 > * {\n    flex: 0 0 auto;\n    width: 20%;\n  }\n  .row-cols-md-6 > * {\n    flex: 0 0 auto;\n    width: 16.6666666667%;\n  }\n  .col-md-auto {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  .col-md-1 {\n    flex: 0 0 auto;\n    width: 8.33333333%;\n  }\n  .col-md-2 {\n    flex: 0 0 auto;\n    width: 16.66666667%;\n  }\n  .col-md-3 {\n    flex: 0 0 auto;\n    width: 25%;\n  }\n  .col-md-4 {\n    flex: 0 0 auto;\n    width: 33.33333333%;\n  }\n  .col-md-5 {\n    flex: 0 0 auto;\n    width: 41.66666667%;\n  }\n  .col-md-6 {\n    flex: 0 0 auto;\n    width: 50%;\n  }\n  .col-md-7 {\n    flex: 0 0 auto;\n    width: 58.33333333%;\n  }\n  .col-md-8 {\n    flex: 0 0 auto;\n    width: 66.66666667%;\n  }\n  .col-md-9 {\n    flex: 0 0 auto;\n    width: 75%;\n  }\n  .col-md-10 {\n    flex: 0 0 auto;\n    width: 83.33333333%;\n  }\n  .col-md-11 {\n    flex: 0 0 auto;\n    width: 91.66666667%;\n  }\n  .col-md-12 {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n  .offset-md-0 {\n    margin-left: 0;\n  }\n  .offset-md-1 {\n    margin-left: 8.33333333%;\n  }\n  .offset-md-2 {\n    margin-left: 16.66666667%;\n  }\n  .offset-md-3 {\n    margin-left: 25%;\n  }\n  .offset-md-4 {\n    margin-left: 33.33333333%;\n  }\n  .offset-md-5 {\n    margin-left: 41.66666667%;\n  }\n  .offset-md-6 {\n    margin-left: 50%;\n  }\n  .offset-md-7 {\n    margin-left: 58.33333333%;\n  }\n  .offset-md-8 {\n    margin-left: 66.66666667%;\n  }\n  .offset-md-9 {\n    margin-left: 75%;\n  }\n  .offset-md-10 {\n    margin-left: 83.33333333%;\n  }\n  .offset-md-11 {\n    margin-left: 91.66666667%;\n  }\n  .g-md-0,\n.gx-md-0 {\n    --bs-gutter-x: 0;\n  }\n  .g-md-0,\n.gy-md-0 {\n    --bs-gutter-y: 0;\n  }\n  .g-md-1,\n.gx-md-1 {\n    --bs-gutter-x: 0.25rem;\n  }\n  .g-md-1,\n.gy-md-1 {\n    --bs-gutter-y: 0.25rem;\n  }\n  .g-md-2,\n.gx-md-2 {\n    --bs-gutter-x: 0.5rem;\n  }\n  .g-md-2,\n.gy-md-2 {\n    --bs-gutter-y: 0.5rem;\n  }\n  .g-md-3,\n.gx-md-3 {\n    --bs-gutter-x: 1rem;\n  }\n  .g-md-3,\n.gy-md-3 {\n    --bs-gutter-y: 1rem;\n  }\n  .g-md-4,\n.gx-md-4 {\n    --bs-gutter-x: 1.5rem;\n  }\n  .g-md-4,\n.gy-md-4 {\n    --bs-gutter-y: 1.5rem;\n  }\n  .g-md-5,\n.gx-md-5 {\n    --bs-gutter-x: 3rem;\n  }\n  .g-md-5,\n.gy-md-5 {\n    --bs-gutter-y: 3rem;\n  }\n}\n@media (min-width: 992px) {\n  .col-lg {\n    flex: 1 0 0%;\n  }\n  .row-cols-lg-auto > * {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  .row-cols-lg-1 > * {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n  .row-cols-lg-2 > * {\n    flex: 0 0 auto;\n    width: 50%;\n  }\n  .row-cols-lg-3 > * {\n    flex: 0 0 auto;\n    width: 33.3333333333%;\n  }\n  .row-cols-lg-4 > * {\n    flex: 0 0 auto;\n    width: 25%;\n  }\n  .row-cols-lg-5 > * {\n    flex: 0 0 auto;\n    width: 20%;\n  }\n  .row-cols-lg-6 > * {\n    flex: 0 0 auto;\n    width: 16.6666666667%;\n  }\n  .col-lg-auto {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  .col-lg-1 {\n    flex: 0 0 auto;\n    width: 8.33333333%;\n  }\n  .col-lg-2 {\n    flex: 0 0 auto;\n    width: 16.66666667%;\n  }\n  .col-lg-3 {\n    flex: 0 0 auto;\n    width: 25%;\n  }\n  .col-lg-4 {\n    flex: 0 0 auto;\n    width: 33.33333333%;\n  }\n  .col-lg-5 {\n    flex: 0 0 auto;\n    width: 41.66666667%;\n  }\n  .col-lg-6 {\n    flex: 0 0 auto;\n    width: 50%;\n  }\n  .col-lg-7 {\n    flex: 0 0 auto;\n    width: 58.33333333%;\n  }\n  .col-lg-8 {\n    flex: 0 0 auto;\n    width: 66.66666667%;\n  }\n  .col-lg-9 {\n    flex: 0 0 auto;\n    width: 75%;\n  }\n  .col-lg-10 {\n    flex: 0 0 auto;\n    width: 83.33333333%;\n  }\n  .col-lg-11 {\n    flex: 0 0 auto;\n    width: 91.66666667%;\n  }\n  .col-lg-12 {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n  .offset-lg-0 {\n    margin-left: 0;\n  }\n  .offset-lg-1 {\n    margin-left: 8.33333333%;\n  }\n  .offset-lg-2 {\n    margin-left: 16.66666667%;\n  }\n  .offset-lg-3 {\n    margin-left: 25%;\n  }\n  .offset-lg-4 {\n    margin-left: 33.33333333%;\n  }\n  .offset-lg-5 {\n    margin-left: 41.66666667%;\n  }\n  .offset-lg-6 {\n    margin-left: 50%;\n  }\n  .offset-lg-7 {\n    margin-left: 58.33333333%;\n  }\n  .offset-lg-8 {\n    margin-left: 66.66666667%;\n  }\n  .offset-lg-9 {\n    margin-left: 75%;\n  }\n  .offset-lg-10 {\n    margin-left: 83.33333333%;\n  }\n  .offset-lg-11 {\n    margin-left: 91.66666667%;\n  }\n  .g-lg-0,\n.gx-lg-0 {\n    --bs-gutter-x: 0;\n  }\n  .g-lg-0,\n.gy-lg-0 {\n    --bs-gutter-y: 0;\n  }\n  .g-lg-1,\n.gx-lg-1 {\n    --bs-gutter-x: 0.25rem;\n  }\n  .g-lg-1,\n.gy-lg-1 {\n    --bs-gutter-y: 0.25rem;\n  }\n  .g-lg-2,\n.gx-lg-2 {\n    --bs-gutter-x: 0.5rem;\n  }\n  .g-lg-2,\n.gy-lg-2 {\n    --bs-gutter-y: 0.5rem;\n  }\n  .g-lg-3,\n.gx-lg-3 {\n    --bs-gutter-x: 1rem;\n  }\n  .g-lg-3,\n.gy-lg-3 {\n    --bs-gutter-y: 1rem;\n  }\n  .g-lg-4,\n.gx-lg-4 {\n    --bs-gutter-x: 1.5rem;\n  }\n  .g-lg-4,\n.gy-lg-4 {\n    --bs-gutter-y: 1.5rem;\n  }\n  .g-lg-5,\n.gx-lg-5 {\n    --bs-gutter-x: 3rem;\n  }\n  .g-lg-5,\n.gy-lg-5 {\n    --bs-gutter-y: 3rem;\n  }\n}\n@media (min-width: 1200px) {\n  .col-xl {\n    flex: 1 0 0%;\n  }\n  .row-cols-xl-auto > * {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  .row-cols-xl-1 > * {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n  .row-cols-xl-2 > * {\n    flex: 0 0 auto;\n    width: 50%;\n  }\n  .row-cols-xl-3 > * {\n    flex: 0 0 auto;\n    width: 33.3333333333%;\n  }\n  .row-cols-xl-4 > * {\n    flex: 0 0 auto;\n    width: 25%;\n  }\n  .row-cols-xl-5 > * {\n    flex: 0 0 auto;\n    width: 20%;\n  }\n  .row-cols-xl-6 > * {\n    flex: 0 0 auto;\n    width: 16.6666666667%;\n  }\n  .col-xl-auto {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  .col-xl-1 {\n    flex: 0 0 auto;\n    width: 8.33333333%;\n  }\n  .col-xl-2 {\n    flex: 0 0 auto;\n    width: 16.66666667%;\n  }\n  .col-xl-3 {\n    flex: 0 0 auto;\n    width: 25%;\n  }\n  .col-xl-4 {\n    flex: 0 0 auto;\n    width: 33.33333333%;\n  }\n  .col-xl-5 {\n    flex: 0 0 auto;\n    width: 41.66666667%;\n  }\n  .col-xl-6 {\n    flex: 0 0 auto;\n    width: 50%;\n  }\n  .col-xl-7 {\n    flex: 0 0 auto;\n    width: 58.33333333%;\n  }\n  .col-xl-8 {\n    flex: 0 0 auto;\n    width: 66.66666667%;\n  }\n  .col-xl-9 {\n    flex: 0 0 auto;\n    width: 75%;\n  }\n  .col-xl-10 {\n    flex: 0 0 auto;\n    width: 83.33333333%;\n  }\n  .col-xl-11 {\n    flex: 0 0 auto;\n    width: 91.66666667%;\n  }\n  .col-xl-12 {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n  .offset-xl-0 {\n    margin-left: 0;\n  }\n  .offset-xl-1 {\n    margin-left: 8.33333333%;\n  }\n  .offset-xl-2 {\n    margin-left: 16.66666667%;\n  }\n  .offset-xl-3 {\n    margin-left: 25%;\n  }\n  .offset-xl-4 {\n    margin-left: 33.33333333%;\n  }\n  .offset-xl-5 {\n    margin-left: 41.66666667%;\n  }\n  .offset-xl-6 {\n    margin-left: 50%;\n  }\n  .offset-xl-7 {\n    margin-left: 58.33333333%;\n  }\n  .offset-xl-8 {\n    margin-left: 66.66666667%;\n  }\n  .offset-xl-9 {\n    margin-left: 75%;\n  }\n  .offset-xl-10 {\n    margin-left: 83.33333333%;\n  }\n  .offset-xl-11 {\n    margin-left: 91.66666667%;\n  }\n  .g-xl-0,\n.gx-xl-0 {\n    --bs-gutter-x: 0;\n  }\n  .g-xl-0,\n.gy-xl-0 {\n    --bs-gutter-y: 0;\n  }\n  .g-xl-1,\n.gx-xl-1 {\n    --bs-gutter-x: 0.25rem;\n  }\n  .g-xl-1,\n.gy-xl-1 {\n    --bs-gutter-y: 0.25rem;\n  }\n  .g-xl-2,\n.gx-xl-2 {\n    --bs-gutter-x: 0.5rem;\n  }\n  .g-xl-2,\n.gy-xl-2 {\n    --bs-gutter-y: 0.5rem;\n  }\n  .g-xl-3,\n.gx-xl-3 {\n    --bs-gutter-x: 1rem;\n  }\n  .g-xl-3,\n.gy-xl-3 {\n    --bs-gutter-y: 1rem;\n  }\n  .g-xl-4,\n.gx-xl-4 {\n    --bs-gutter-x: 1.5rem;\n  }\n  .g-xl-4,\n.gy-xl-4 {\n    --bs-gutter-y: 1.5rem;\n  }\n  .g-xl-5,\n.gx-xl-5 {\n    --bs-gutter-x: 3rem;\n  }\n  .g-xl-5,\n.gy-xl-5 {\n    --bs-gutter-y: 3rem;\n  }\n}\n@media (min-width: 1400px) {\n  .col-xxl {\n    flex: 1 0 0%;\n  }\n  .row-cols-xxl-auto > * {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  .row-cols-xxl-1 > * {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n  .row-cols-xxl-2 > * {\n    flex: 0 0 auto;\n    width: 50%;\n  }\n  .row-cols-xxl-3 > * {\n    flex: 0 0 auto;\n    width: 33.3333333333%;\n  }\n  .row-cols-xxl-4 > * {\n    flex: 0 0 auto;\n    width: 25%;\n  }\n  .row-cols-xxl-5 > * {\n    flex: 0 0 auto;\n    width: 20%;\n  }\n  .row-cols-xxl-6 > * {\n    flex: 0 0 auto;\n    width: 16.6666666667%;\n  }\n  .col-xxl-auto {\n    flex: 0 0 auto;\n    width: auto;\n  }\n  .col-xxl-1 {\n    flex: 0 0 auto;\n    width: 8.33333333%;\n  }\n  .col-xxl-2 {\n    flex: 0 0 auto;\n    width: 16.66666667%;\n  }\n  .col-xxl-3 {\n    flex: 0 0 auto;\n    width: 25%;\n  }\n  .col-xxl-4 {\n    flex: 0 0 auto;\n    width: 33.33333333%;\n  }\n  .col-xxl-5 {\n    flex: 0 0 auto;\n    width: 41.66666667%;\n  }\n  .col-xxl-6 {\n    flex: 0 0 auto;\n    width: 50%;\n  }\n  .col-xxl-7 {\n    flex: 0 0 auto;\n    width: 58.33333333%;\n  }\n  .col-xxl-8 {\n    flex: 0 0 auto;\n    width: 66.66666667%;\n  }\n  .col-xxl-9 {\n    flex: 0 0 auto;\n    width: 75%;\n  }\n  .col-xxl-10 {\n    flex: 0 0 auto;\n    width: 83.33333333%;\n  }\n  .col-xxl-11 {\n    flex: 0 0 auto;\n    width: 91.66666667%;\n  }\n  .col-xxl-12 {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n  .offset-xxl-0 {\n    margin-left: 0;\n  }\n  .offset-xxl-1 {\n    margin-left: 8.33333333%;\n  }\n  .offset-xxl-2 {\n    margin-left: 16.66666667%;\n  }\n  .offset-xxl-3 {\n    margin-left: 25%;\n  }\n  .offset-xxl-4 {\n    margin-left: 33.33333333%;\n  }\n  .offset-xxl-5 {\n    margin-left: 41.66666667%;\n  }\n  .offset-xxl-6 {\n    margin-left: 50%;\n  }\n  .offset-xxl-7 {\n    margin-left: 58.33333333%;\n  }\n  .offset-xxl-8 {\n    margin-left: 66.66666667%;\n  }\n  .offset-xxl-9 {\n    margin-left: 75%;\n  }\n  .offset-xxl-10 {\n    margin-left: 83.33333333%;\n  }\n  .offset-xxl-11 {\n    margin-left: 91.66666667%;\n  }\n  .g-xxl-0,\n.gx-xxl-0 {\n    --bs-gutter-x: 0;\n  }\n  .g-xxl-0,\n.gy-xxl-0 {\n    --bs-gutter-y: 0;\n  }\n  .g-xxl-1,\n.gx-xxl-1 {\n    --bs-gutter-x: 0.25rem;\n  }\n  .g-xxl-1,\n.gy-xxl-1 {\n    --bs-gutter-y: 0.25rem;\n  }\n  .g-xxl-2,\n.gx-xxl-2 {\n    --bs-gutter-x: 0.5rem;\n  }\n  .g-xxl-2,\n.gy-xxl-2 {\n    --bs-gutter-y: 0.5rem;\n  }\n  .g-xxl-3,\n.gx-xxl-3 {\n    --bs-gutter-x: 1rem;\n  }\n  .g-xxl-3,\n.gy-xxl-3 {\n    --bs-gutter-y: 1rem;\n  }\n  .g-xxl-4,\n.gx-xxl-4 {\n    --bs-gutter-x: 1.5rem;\n  }\n  .g-xxl-4,\n.gy-xxl-4 {\n    --bs-gutter-y: 1.5rem;\n  }\n  .g-xxl-5,\n.gx-xxl-5 {\n    --bs-gutter-x: 3rem;\n  }\n  .g-xxl-5,\n.gy-xxl-5 {\n    --bs-gutter-y: 3rem;\n  }\n}\n.table {\n  --bs-table-color: var(--bs-body-color);\n  --bs-table-bg: transparent;\n  --bs-table-border-color: var(--bs-border-color);\n  --bs-table-accent-bg: transparent;\n  --bs-table-striped-color: var(--bs-body-color);\n  --bs-table-striped-bg: rgba(0, 0, 0, 0.05);\n  --bs-table-active-color: var(--bs-body-color);\n  --bs-table-active-bg: rgba(0, 0, 0, 0.1);\n  --bs-table-hover-color: var(--bs-body-color);\n  --bs-table-hover-bg: rgba(0, 0, 0, 0.075);\n  width: 100%;\n  margin-bottom: 1rem;\n  color: var(--bs-table-color);\n  vertical-align: top;\n  border-color: var(--bs-table-border-color);\n}\n.table > :not(caption) > * > * {\n  padding: 0.5rem 0.5rem;\n  background-color: var(--bs-table-bg);\n  border-bottom-width: 1px;\n  box-shadow: inset 0 0 0 9999px var(--bs-table-accent-bg);\n}\n.table > tbody {\n  vertical-align: inherit;\n}\n.table > thead {\n  vertical-align: bottom;\n}\n\n.table-group-divider {\n  border-top: 2px solid currentcolor;\n}\n\n.caption-top {\n  caption-side: top;\n}\n\n.table-sm > :not(caption) > * > * {\n  padding: 0.25rem 0.25rem;\n}\n\n.table-bordered > :not(caption) > * {\n  border-width: 1px 0;\n}\n.table-bordered > :not(caption) > * > * {\n  border-width: 0 1px;\n}\n\n.table-borderless > :not(caption) > * > * {\n  border-bottom-width: 0;\n}\n.table-borderless > :not(:first-child) {\n  border-top-width: 0;\n}\n\n.table-striped > tbody > tr:nth-of-type(odd) > * {\n  --bs-table-accent-bg: var(--bs-table-striped-bg);\n  color: var(--bs-table-striped-color);\n}\n\n.table-striped-columns > :not(caption) > tr > :nth-child(even) {\n  --bs-table-accent-bg: var(--bs-table-striped-bg);\n  color: var(--bs-table-striped-color);\n}\n\n.table-active {\n  --bs-table-accent-bg: var(--bs-table-active-bg);\n  color: var(--bs-table-active-color);\n}\n\n.table-hover > tbody > tr:hover > * {\n  --bs-table-accent-bg: var(--bs-table-hover-bg);\n  color: var(--bs-table-hover-color);\n}\n\n.table-primary {\n  --bs-table-color: #000;\n  --bs-table-bg: #cfe2ff;\n  --bs-table-border-color: #bacbe6;\n  --bs-table-striped-bg: #c5d7f2;\n  --bs-table-striped-color: #000;\n  --bs-table-active-bg: #bacbe6;\n  --bs-table-active-color: #000;\n  --bs-table-hover-bg: #bfd1ec;\n  --bs-table-hover-color: #000;\n  color: var(--bs-table-color);\n  border-color: var(--bs-table-border-color);\n}\n\n.table-secondary {\n  --bs-table-color: #000;\n  --bs-table-bg: #e2e3e5;\n  --bs-table-border-color: #cbccce;\n  --bs-table-striped-bg: #d7d8da;\n  --bs-table-striped-color: #000;\n  --bs-table-active-bg: #cbccce;\n  --bs-table-active-color: #000;\n  --bs-table-hover-bg: #d1d2d4;\n  --bs-table-hover-color: #000;\n  color: var(--bs-table-color);\n  border-color: var(--bs-table-border-color);\n}\n\n.table-success {\n  --bs-table-color: #000;\n  --bs-table-bg: #d1e7dd;\n  --bs-table-border-color: #bcd0c7;\n  --bs-table-striped-bg: #c7dbd2;\n  --bs-table-striped-color: #000;\n  --bs-table-active-bg: #bcd0c7;\n  --bs-table-active-color: #000;\n  --bs-table-hover-bg: #c1d6cc;\n  --bs-table-hover-color: #000;\n  color: var(--bs-table-color);\n  border-color: var(--bs-table-border-color);\n}\n\n.table-info {\n  --bs-table-color: #000;\n  --bs-table-bg: #cff4fc;\n  --bs-table-border-color: #badce3;\n  --bs-table-striped-bg: #c5e8ef;\n  --bs-table-striped-color: #000;\n  --bs-table-active-bg: #badce3;\n  --bs-table-active-color: #000;\n  --bs-table-hover-bg: #bfe2e9;\n  --bs-table-hover-color: #000;\n  color: var(--bs-table-color);\n  border-color: var(--bs-table-border-color);\n}\n\n.table-warning {\n  --bs-table-color: #000;\n  --bs-table-bg: #fff3cd;\n  --bs-table-border-color: #e6dbb9;\n  --bs-table-striped-bg: #f2e7c3;\n  --bs-table-striped-color: #000;\n  --bs-table-active-bg: #e6dbb9;\n  --bs-table-active-color: #000;\n  --bs-table-hover-bg: #ece1be;\n  --bs-table-hover-color: #000;\n  color: var(--bs-table-color);\n  border-color: var(--bs-table-border-color);\n}\n\n.table-danger {\n  --bs-table-color: #000;\n  --bs-table-bg: #f8d7da;\n  --bs-table-border-color: #dfc2c4;\n  --bs-table-striped-bg: #eccccf;\n  --bs-table-striped-color: #000;\n  --bs-table-active-bg: #dfc2c4;\n  --bs-table-active-color: #000;\n  --bs-table-hover-bg: #e5c7ca;\n  --bs-table-hover-color: #000;\n  color: var(--bs-table-color);\n  border-color: var(--bs-table-border-color);\n}\n\n.table-light {\n  --bs-table-color: #000;\n  --bs-table-bg: #f8f9fa;\n  --bs-table-border-color: #dfe0e1;\n  --bs-table-striped-bg: #ecedee;\n  --bs-table-striped-color: #000;\n  --bs-table-active-bg: #dfe0e1;\n  --bs-table-active-color: #000;\n  --bs-table-hover-bg: #e5e6e7;\n  --bs-table-hover-color: #000;\n  color: var(--bs-table-color);\n  border-color: var(--bs-table-border-color);\n}\n\n.table-dark {\n  --bs-table-color: #fff;\n  --bs-table-bg: #212529;\n  --bs-table-border-color: #373b3e;\n  --bs-table-striped-bg: #2c3034;\n  --bs-table-striped-color: #fff;\n  --bs-table-active-bg: #373b3e;\n  --bs-table-active-color: #fff;\n  --bs-table-hover-bg: #323539;\n  --bs-table-hover-color: #fff;\n  color: var(--bs-table-color);\n  border-color: var(--bs-table-border-color);\n}\n\n.table-responsive {\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n@media (max-width: 575.98px) {\n  .table-responsive-sm {\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n  }\n}\n@media (max-width: 767.98px) {\n  .table-responsive-md {\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n  }\n}\n@media (max-width: 991.98px) {\n  .table-responsive-lg {\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n  }\n}\n@media (max-width: 1199.98px) {\n  .table-responsive-xl {\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n  }\n}\n@media (max-width: 1399.98px) {\n  .table-responsive-xxl {\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n  }\n}\n.form-label {\n  margin-bottom: 0.5rem;\n}\n\n.col-form-label {\n  padding-top: calc(0.375rem + 1px);\n  padding-bottom: calc(0.375rem + 1px);\n  margin-bottom: 0;\n  font-size: inherit;\n  line-height: 1.5;\n}\n\n.col-form-label-lg {\n  padding-top: calc(0.5rem + 1px);\n  padding-bottom: calc(0.5rem + 1px);\n  font-size: 1.25rem;\n}\n\n.col-form-label-sm {\n  padding-top: calc(0.25rem + 1px);\n  padding-bottom: calc(0.25rem + 1px);\n  font-size: 0.875rem;\n}\n\n.form-text {\n  margin-top: 0.25rem;\n  font-size: 0.875em;\n  color: #6c757d;\n}\n\n.form-control {\n  display: block;\n  width: 100%;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #212529;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ced4da;\n  appearance: none;\n  border-radius: 0.375rem;\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n  .form-control {\n    transition: none;\n  }\n}\n.form-control[type=file] {\n  overflow: hidden;\n}\n.form-control[type=file]:not(:disabled):not([readonly]) {\n  cursor: pointer;\n}\n.form-control:focus {\n  color: #212529;\n  background-color: #fff;\n  border-color: #86b7fe;\n  outline: 0;\n  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);\n}\n.form-control::-webkit-date-and-time-value {\n  height: 1.5em;\n}\n.form-control::placeholder {\n  color: #6c757d;\n  opacity: 1;\n}\n.form-control:disabled {\n  background-color: #e9ecef;\n  opacity: 1;\n}\n.form-control::file-selector-button {\n  padding: 0.375rem 0.75rem;\n  margin: -0.375rem -0.75rem;\n  margin-inline-end: 0.75rem;\n  color: #212529;\n  background-color: #e9ecef;\n  pointer-events: none;\n  border-color: inherit;\n  border-style: solid;\n  border-width: 0;\n  border-inline-end-width: 1px;\n  border-radius: 0;\n  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n  .form-control::file-selector-button {\n    transition: none;\n  }\n}\n.form-control:hover:not(:disabled):not([readonly])::file-selector-button {\n  background-color: #dde0e3;\n}\n\n.form-control-plaintext {\n  display: block;\n  width: 100%;\n  padding: 0.375rem 0;\n  margin-bottom: 0;\n  line-height: 1.5;\n  color: #212529;\n  background-color: transparent;\n  border: solid transparent;\n  border-width: 1px 0;\n}\n.form-control-plaintext:focus {\n  outline: 0;\n}\n.form-control-plaintext.form-control-sm, .form-control-plaintext.form-control-lg {\n  padding-right: 0;\n  padding-left: 0;\n}\n\n.form-control-sm {\n  min-height: calc(1.5em + 0.5rem + 2px);\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  border-radius: 0.25rem;\n}\n.form-control-sm::file-selector-button {\n  padding: 0.25rem 0.5rem;\n  margin: -0.25rem -0.5rem;\n  margin-inline-end: 0.5rem;\n}\n\n.form-control-lg {\n  min-height: calc(1.5em + 1rem + 2px);\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  border-radius: 0.5rem;\n}\n.form-control-lg::file-selector-button {\n  padding: 0.5rem 1rem;\n  margin: -0.5rem -1rem;\n  margin-inline-end: 1rem;\n}\n\ntextarea.form-control {\n  min-height: calc(1.5em + 0.75rem + 2px);\n}\ntextarea.form-control-sm {\n  min-height: calc(1.5em + 0.5rem + 2px);\n}\ntextarea.form-control-lg {\n  min-height: calc(1.5em + 1rem + 2px);\n}\n\n.form-control-color {\n  width: 3rem;\n  height: calc(1.5em + 0.75rem + 2px);\n  padding: 0.375rem;\n}\n.form-control-color:not(:disabled):not([readonly]) {\n  cursor: pointer;\n}\n.form-control-color::-moz-color-swatch {\n  border: 0 !important;\n  border-radius: 0.375rem;\n}\n.form-control-color::-webkit-color-swatch {\n  border-radius: 0.375rem;\n}\n.form-control-color.form-control-sm {\n  height: calc(1.5em + 0.5rem + 2px);\n}\n.form-control-color.form-control-lg {\n  height: calc(1.5em + 1rem + 2px);\n}\n\n.form-select {\n  display: block;\n  width: 100%;\n  padding: 0.375rem 2.25rem 0.375rem 0.75rem;\n  -moz-padding-start: calc(0.75rem - 3px);\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #212529;\n  background-color: #fff;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  background-repeat: no-repeat;\n  background-position: right 0.75rem center;\n  background-size: 16px 12px;\n  border: 1px solid #ced4da;\n  border-radius: 0.375rem;\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n  appearance: none;\n}\n@media (prefers-reduced-motion: reduce) {\n  .form-select {\n    transition: none;\n  }\n}\n.form-select:focus {\n  border-color: #86b7fe;\n  outline: 0;\n  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);\n}\n.form-select[multiple], .form-select[size]:not([size=\"1\"]) {\n  padding-right: 0.75rem;\n  background-image: none;\n}\n.form-select:disabled {\n  background-color: #e9ecef;\n}\n.form-select:-moz-focusring {\n  color: transparent;\n  text-shadow: 0 0 0 #212529;\n}\n\n.form-select-sm {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n  padding-left: 0.5rem;\n  font-size: 0.875rem;\n  border-radius: 0.25rem;\n}\n\n.form-select-lg {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  padding-left: 1rem;\n  font-size: 1.25rem;\n  border-radius: 0.5rem;\n}\n\n.form-check {\n  display: block;\n  min-height: 1.5rem;\n  padding-left: 1.5em;\n  margin-bottom: 0.125rem;\n}\n.form-check .form-check-input {\n  float: left;\n  margin-left: -1.5em;\n}\n\n.form-check-reverse {\n  padding-right: 1.5em;\n  padding-left: 0;\n  text-align: right;\n}\n.form-check-reverse .form-check-input {\n  float: right;\n  margin-right: -1.5em;\n  margin-left: 0;\n}\n\n.form-check-input {\n  width: 1em;\n  height: 1em;\n  margin-top: 0.25em;\n  vertical-align: top;\n  background-color: #fff;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: contain;\n  border: 1px solid rgba(0, 0, 0, 0.25);\n  appearance: none;\n  print-color-adjust: exact;\n}\n.form-check-input[type=checkbox] {\n  border-radius: 0.25em;\n}\n.form-check-input[type=radio] {\n  border-radius: 50%;\n}\n.form-check-input:active {\n  filter: brightness(90%);\n}\n.form-check-input:focus {\n  border-color: #86b7fe;\n  outline: 0;\n  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);\n}\n.form-check-input:checked {\n  background-color: #0d6efd;\n  border-color: #0d6efd;\n}\n.form-check-input:checked[type=checkbox] {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");\n}\n.form-check-input:checked[type=radio] {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ");\n}\n.form-check-input[type=checkbox]:indeterminate {\n  background-color: #0d6efd;\n  border-color: #0d6efd;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ");\n}\n.form-check-input:disabled {\n  pointer-events: none;\n  filter: none;\n  opacity: 0.5;\n}\n.form-check-input[disabled] ~ .form-check-label, .form-check-input:disabled ~ .form-check-label {\n  cursor: default;\n  opacity: 0.5;\n}\n\n.form-switch {\n  padding-left: 2.5em;\n}\n.form-switch .form-check-input {\n  width: 2em;\n  margin-left: -2.5em;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_4___ + ");\n  background-position: left center;\n  border-radius: 2em;\n  transition: background-position 0.15s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n  .form-switch .form-check-input {\n    transition: none;\n  }\n}\n.form-switch .form-check-input:focus {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_5___ + ");\n}\n.form-switch .form-check-input:checked {\n  background-position: right center;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_6___ + ");\n}\n.form-switch.form-check-reverse {\n  padding-right: 2.5em;\n  padding-left: 0;\n}\n.form-switch.form-check-reverse .form-check-input {\n  margin-right: -2.5em;\n  margin-left: 0;\n}\n\n.form-check-inline {\n  display: inline-block;\n  margin-right: 1rem;\n}\n\n.btn-check {\n  position: absolute;\n  clip: rect(0, 0, 0, 0);\n  pointer-events: none;\n}\n.btn-check[disabled] + .btn, .btn-check:disabled + .btn {\n  pointer-events: none;\n  filter: none;\n  opacity: 0.65;\n}\n\n.form-range {\n  width: 100%;\n  height: 1.5rem;\n  padding: 0;\n  background-color: transparent;\n  appearance: none;\n}\n.form-range:focus {\n  outline: 0;\n}\n.form-range:focus::-webkit-slider-thumb {\n  box-shadow: 0 0 0 1px #fff, 0 0 0 0.25rem rgba(13, 110, 253, 0.25);\n}\n.form-range:focus::-moz-range-thumb {\n  box-shadow: 0 0 0 1px #fff, 0 0 0 0.25rem rgba(13, 110, 253, 0.25);\n}\n.form-range::-moz-focus-outer {\n  border: 0;\n}\n.form-range::-webkit-slider-thumb {\n  width: 1rem;\n  height: 1rem;\n  margin-top: -0.25rem;\n  background-color: #0d6efd;\n  border: 0;\n  border-radius: 1rem;\n  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n  appearance: none;\n}\n@media (prefers-reduced-motion: reduce) {\n  .form-range::-webkit-slider-thumb {\n    transition: none;\n  }\n}\n.form-range::-webkit-slider-thumb:active {\n  background-color: #b6d4fe;\n}\n.form-range::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 0.5rem;\n  color: transparent;\n  cursor: pointer;\n  background-color: #dee2e6;\n  border-color: transparent;\n  border-radius: 1rem;\n}\n.form-range::-moz-range-thumb {\n  width: 1rem;\n  height: 1rem;\n  background-color: #0d6efd;\n  border: 0;\n  border-radius: 1rem;\n  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n  appearance: none;\n}\n@media (prefers-reduced-motion: reduce) {\n  .form-range::-moz-range-thumb {\n    transition: none;\n  }\n}\n.form-range::-moz-range-thumb:active {\n  background-color: #b6d4fe;\n}\n.form-range::-moz-range-track {\n  width: 100%;\n  height: 0.5rem;\n  color: transparent;\n  cursor: pointer;\n  background-color: #dee2e6;\n  border-color: transparent;\n  border-radius: 1rem;\n}\n.form-range:disabled {\n  pointer-events: none;\n}\n.form-range:disabled::-webkit-slider-thumb {\n  background-color: #adb5bd;\n}\n.form-range:disabled::-moz-range-thumb {\n  background-color: #adb5bd;\n}\n\n.form-floating {\n  position: relative;\n}\n.form-floating > .form-control,\n.form-floating > .form-control-plaintext,\n.form-floating > .form-select {\n  height: calc(3.5rem + 2px);\n  line-height: 1.25;\n}\n.form-floating > label {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  padding: 1rem 0.75rem;\n  overflow: hidden;\n  text-align: start;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  pointer-events: none;\n  border: 1px solid transparent;\n  transform-origin: 0 0;\n  transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n  .form-floating > label {\n    transition: none;\n  }\n}\n.form-floating > .form-control,\n.form-floating > .form-control-plaintext {\n  padding: 1rem 0.75rem;\n}\n.form-floating > .form-control::placeholder,\n.form-floating > .form-control-plaintext::placeholder {\n  color: transparent;\n}\n.form-floating > .form-control:focus, .form-floating > .form-control:not(:placeholder-shown),\n.form-floating > .form-control-plaintext:focus,\n.form-floating > .form-control-plaintext:not(:placeholder-shown) {\n  padding-top: 1.625rem;\n  padding-bottom: 0.625rem;\n}\n.form-floating > .form-control:-webkit-autofill,\n.form-floating > .form-control-plaintext:-webkit-autofill {\n  padding-top: 1.625rem;\n  padding-bottom: 0.625rem;\n}\n.form-floating > .form-select {\n  padding-top: 1.625rem;\n  padding-bottom: 0.625rem;\n}\n.form-floating > .form-control:focus ~ label,\n.form-floating > .form-control:not(:placeholder-shown) ~ label,\n.form-floating > .form-control-plaintext ~ label,\n.form-floating > .form-select ~ label {\n  opacity: 0.65;\n  transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);\n}\n.form-floating > .form-control:-webkit-autofill ~ label {\n  opacity: 0.65;\n  transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);\n}\n.form-floating > .form-control-plaintext ~ label {\n  border-width: 1px 0;\n}\n\n.input-group {\n  position: relative;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: stretch;\n  width: 100%;\n}\n.input-group > .form-control,\n.input-group > .form-select,\n.input-group > .form-floating {\n  position: relative;\n  flex: 1 1 auto;\n  width: 1%;\n  min-width: 0;\n}\n.input-group > .form-control:focus,\n.input-group > .form-select:focus,\n.input-group > .form-floating:focus-within {\n  z-index: 5;\n}\n.input-group .btn {\n  position: relative;\n  z-index: 2;\n}\n.input-group .btn:focus {\n  z-index: 5;\n}\n\n.input-group-text {\n  display: flex;\n  align-items: center;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #212529;\n  text-align: center;\n  white-space: nowrap;\n  background-color: #e9ecef;\n  border: 1px solid #ced4da;\n  border-radius: 0.375rem;\n}\n\n.input-group-lg > .form-control,\n.input-group-lg > .form-select,\n.input-group-lg > .input-group-text,\n.input-group-lg > .btn {\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  border-radius: 0.5rem;\n}\n\n.input-group-sm > .form-control,\n.input-group-sm > .form-select,\n.input-group-sm > .input-group-text,\n.input-group-sm > .btn {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  border-radius: 0.25rem;\n}\n\n.input-group-lg > .form-select,\n.input-group-sm > .form-select {\n  padding-right: 3rem;\n}\n\n.input-group:not(.has-validation) > :not(:last-child):not(.dropdown-toggle):not(.dropdown-menu):not(.form-floating),\n.input-group:not(.has-validation) > .dropdown-toggle:nth-last-child(n+3),\n.input-group:not(.has-validation) > .form-floating:not(:last-child) > .form-control,\n.input-group:not(.has-validation) > .form-floating:not(:last-child) > .form-select {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.input-group.has-validation > :nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu):not(.form-floating),\n.input-group.has-validation > .dropdown-toggle:nth-last-child(n+4),\n.input-group.has-validation > .form-floating:nth-last-child(n+3) > .form-control,\n.input-group.has-validation > .form-floating:nth-last-child(n+3) > .form-select {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.input-group > :not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback) {\n  margin-left: -1px;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.input-group > .form-floating:not(:first-child) > .form-control,\n.input-group > .form-floating:not(:first-child) > .form-select {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.valid-feedback {\n  display: none;\n  width: 100%;\n  margin-top: 0.25rem;\n  font-size: 0.875em;\n  color: #198754;\n}\n\n.valid-tooltip {\n  position: absolute;\n  top: 100%;\n  z-index: 5;\n  display: none;\n  max-width: 100%;\n  padding: 0.25rem 0.5rem;\n  margin-top: 0.1rem;\n  font-size: 0.875rem;\n  color: #fff;\n  background-color: rgba(25, 135, 84, 0.9);\n  border-radius: 0.375rem;\n}\n\n.was-validated :valid ~ .valid-feedback,\n.was-validated :valid ~ .valid-tooltip,\n.is-valid ~ .valid-feedback,\n.is-valid ~ .valid-tooltip {\n  display: block;\n}\n\n.was-validated .form-control:valid, .form-control.is-valid {\n  border-color: #198754;\n  padding-right: calc(1.5em + 0.75rem);\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_7___ + ");\n  background-repeat: no-repeat;\n  background-position: right calc(0.375em + 0.1875rem) center;\n  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);\n}\n.was-validated .form-control:valid:focus, .form-control.is-valid:focus {\n  border-color: #198754;\n  box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);\n}\n\n.was-validated textarea.form-control:valid, textarea.form-control.is-valid {\n  padding-right: calc(1.5em + 0.75rem);\n  background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);\n}\n\n.was-validated .form-select:valid, .form-select.is-valid {\n  border-color: #198754;\n}\n.was-validated .form-select:valid:not([multiple]):not([size]), .was-validated .form-select:valid:not([multiple])[size=\"1\"], .form-select.is-valid:not([multiple]):not([size]), .form-select.is-valid:not([multiple])[size=\"1\"] {\n  padding-right: 4.125rem;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + "), url(" + ___CSS_LOADER_URL_REPLACEMENT_7___ + ");\n  background-position: right 0.75rem center, center right 2.25rem;\n  background-size: 16px 12px, calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);\n}\n.was-validated .form-select:valid:focus, .form-select.is-valid:focus {\n  border-color: #198754;\n  box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);\n}\n\n.was-validated .form-control-color:valid, .form-control-color.is-valid {\n  width: calc(3rem + calc(1.5em + 0.75rem));\n}\n\n.was-validated .form-check-input:valid, .form-check-input.is-valid {\n  border-color: #198754;\n}\n.was-validated .form-check-input:valid:checked, .form-check-input.is-valid:checked {\n  background-color: #198754;\n}\n.was-validated .form-check-input:valid:focus, .form-check-input.is-valid:focus {\n  box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);\n}\n.was-validated .form-check-input:valid ~ .form-check-label, .form-check-input.is-valid ~ .form-check-label {\n  color: #198754;\n}\n\n.form-check-inline .form-check-input ~ .valid-feedback {\n  margin-left: 0.5em;\n}\n\n.was-validated .input-group > .form-control:not(:focus):valid, .input-group > .form-control:not(:focus).is-valid,\n.was-validated .input-group > .form-select:not(:focus):valid,\n.input-group > .form-select:not(:focus).is-valid,\n.was-validated .input-group > .form-floating:not(:focus-within):valid,\n.input-group > .form-floating:not(:focus-within).is-valid {\n  z-index: 3;\n}\n\n.invalid-feedback {\n  display: none;\n  width: 100%;\n  margin-top: 0.25rem;\n  font-size: 0.875em;\n  color: #dc3545;\n}\n\n.invalid-tooltip {\n  position: absolute;\n  top: 100%;\n  z-index: 5;\n  display: none;\n  max-width: 100%;\n  padding: 0.25rem 0.5rem;\n  margin-top: 0.1rem;\n  font-size: 0.875rem;\n  color: #fff;\n  background-color: rgba(220, 53, 69, 0.9);\n  border-radius: 0.375rem;\n}\n\n.was-validated :invalid ~ .invalid-feedback,\n.was-validated :invalid ~ .invalid-tooltip,\n.is-invalid ~ .invalid-feedback,\n.is-invalid ~ .invalid-tooltip {\n  display: block;\n}\n\n.was-validated .form-control:invalid, .form-control.is-invalid {\n  border-color: #dc3545;\n  padding-right: calc(1.5em + 0.75rem);\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_8___ + ");\n  background-repeat: no-repeat;\n  background-position: right calc(0.375em + 0.1875rem) center;\n  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);\n}\n.was-validated .form-control:invalid:focus, .form-control.is-invalid:focus {\n  border-color: #dc3545;\n  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);\n}\n\n.was-validated textarea.form-control:invalid, textarea.form-control.is-invalid {\n  padding-right: calc(1.5em + 0.75rem);\n  background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);\n}\n\n.was-validated .form-select:invalid, .form-select.is-invalid {\n  border-color: #dc3545;\n}\n.was-validated .form-select:invalid:not([multiple]):not([size]), .was-validated .form-select:invalid:not([multiple])[size=\"1\"], .form-select.is-invalid:not([multiple]):not([size]), .form-select.is-invalid:not([multiple])[size=\"1\"] {\n  padding-right: 4.125rem;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + "), url(" + ___CSS_LOADER_URL_REPLACEMENT_8___ + ");\n  background-position: right 0.75rem center, center right 2.25rem;\n  background-size: 16px 12px, calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);\n}\n.was-validated .form-select:invalid:focus, .form-select.is-invalid:focus {\n  border-color: #dc3545;\n  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);\n}\n\n.was-validated .form-control-color:invalid, .form-control-color.is-invalid {\n  width: calc(3rem + calc(1.5em + 0.75rem));\n}\n\n.was-validated .form-check-input:invalid, .form-check-input.is-invalid {\n  border-color: #dc3545;\n}\n.was-validated .form-check-input:invalid:checked, .form-check-input.is-invalid:checked {\n  background-color: #dc3545;\n}\n.was-validated .form-check-input:invalid:focus, .form-check-input.is-invalid:focus {\n  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);\n}\n.was-validated .form-check-input:invalid ~ .form-check-label, .form-check-input.is-invalid ~ .form-check-label {\n  color: #dc3545;\n}\n\n.form-check-inline .form-check-input ~ .invalid-feedback {\n  margin-left: 0.5em;\n}\n\n.was-validated .input-group > .form-control:not(:focus):invalid, .input-group > .form-control:not(:focus).is-invalid,\n.was-validated .input-group > .form-select:not(:focus):invalid,\n.input-group > .form-select:not(:focus).is-invalid,\n.was-validated .input-group > .form-floating:not(:focus-within):invalid,\n.input-group > .form-floating:not(:focus-within).is-invalid {\n  z-index: 4;\n}\n\n.btn {\n  --bs-btn-padding-x: 0.75rem;\n  --bs-btn-padding-y: 0.375rem;\n  --bs-btn-font-family: ;\n  --bs-btn-font-size: 1rem;\n  --bs-btn-font-weight: 400;\n  --bs-btn-line-height: 1.5;\n  --bs-btn-color: #212529;\n  --bs-btn-bg: transparent;\n  --bs-btn-border-width: 1px;\n  --bs-btn-border-color: transparent;\n  --bs-btn-border-radius: 0.375rem;\n  --bs-btn-hover-border-color: transparent;\n  --bs-btn-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 1px 1px rgba(0, 0, 0, 0.075);\n  --bs-btn-disabled-opacity: 0.65;\n  --bs-btn-focus-box-shadow: 0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), .5);\n  display: inline-block;\n  padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);\n  font-family: var(--bs-btn-font-family);\n  font-size: var(--bs-btn-font-size);\n  font-weight: var(--bs-btn-font-weight);\n  line-height: var(--bs-btn-line-height);\n  color: var(--bs-btn-color);\n  text-align: center;\n  text-decoration: none;\n  vertical-align: middle;\n  cursor: pointer;\n  user-select: none;\n  border: var(--bs-btn-border-width) solid var(--bs-btn-border-color);\n  border-radius: var(--bs-btn-border-radius);\n  background-color: var(--bs-btn-bg);\n  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n  .btn {\n    transition: none;\n  }\n}\n.btn:hover {\n  color: var(--bs-btn-hover-color);\n  background-color: var(--bs-btn-hover-bg);\n  border-color: var(--bs-btn-hover-border-color);\n}\n.btn-check + .btn:hover {\n  color: var(--bs-btn-color);\n  background-color: var(--bs-btn-bg);\n  border-color: var(--bs-btn-border-color);\n}\n.btn:focus-visible {\n  color: var(--bs-btn-hover-color);\n  background-color: var(--bs-btn-hover-bg);\n  border-color: var(--bs-btn-hover-border-color);\n  outline: 0;\n  box-shadow: var(--bs-btn-focus-box-shadow);\n}\n.btn-check:focus-visible + .btn {\n  border-color: var(--bs-btn-hover-border-color);\n  outline: 0;\n  box-shadow: var(--bs-btn-focus-box-shadow);\n}\n.btn-check:checked + .btn, :not(.btn-check) + .btn:active, .btn:first-child:active, .btn.active, .btn.show {\n  color: var(--bs-btn-active-color);\n  background-color: var(--bs-btn-active-bg);\n  border-color: var(--bs-btn-active-border-color);\n}\n.btn-check:checked + .btn:focus-visible, :not(.btn-check) + .btn:active:focus-visible, .btn:first-child:active:focus-visible, .btn.active:focus-visible, .btn.show:focus-visible {\n  box-shadow: var(--bs-btn-focus-box-shadow);\n}\n.btn:disabled, .btn.disabled, fieldset:disabled .btn {\n  color: var(--bs-btn-disabled-color);\n  pointer-events: none;\n  background-color: var(--bs-btn-disabled-bg);\n  border-color: var(--bs-btn-disabled-border-color);\n  opacity: var(--bs-btn-disabled-opacity);\n}\n\n.btn-primary {\n  --bs-btn-color: #fff;\n  --bs-btn-bg: #0d6efd;\n  --bs-btn-border-color: #0d6efd;\n  --bs-btn-hover-color: #fff;\n  --bs-btn-hover-bg: #0b5ed7;\n  --bs-btn-hover-border-color: #0a58ca;\n  --bs-btn-focus-shadow-rgb: 49, 132, 253;\n  --bs-btn-active-color: #fff;\n  --bs-btn-active-bg: #0a58ca;\n  --bs-btn-active-border-color: #0a53be;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #fff;\n  --bs-btn-disabled-bg: #0d6efd;\n  --bs-btn-disabled-border-color: #0d6efd;\n}\n\n.btn-secondary {\n  --bs-btn-color: #fff;\n  --bs-btn-bg: #6c757d;\n  --bs-btn-border-color: #6c757d;\n  --bs-btn-hover-color: #fff;\n  --bs-btn-hover-bg: #5c636a;\n  --bs-btn-hover-border-color: #565e64;\n  --bs-btn-focus-shadow-rgb: 130, 138, 145;\n  --bs-btn-active-color: #fff;\n  --bs-btn-active-bg: #565e64;\n  --bs-btn-active-border-color: #51585e;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #fff;\n  --bs-btn-disabled-bg: #6c757d;\n  --bs-btn-disabled-border-color: #6c757d;\n}\n\n.btn-success {\n  --bs-btn-color: #fff;\n  --bs-btn-bg: #198754;\n  --bs-btn-border-color: #198754;\n  --bs-btn-hover-color: #fff;\n  --bs-btn-hover-bg: #157347;\n  --bs-btn-hover-border-color: #146c43;\n  --bs-btn-focus-shadow-rgb: 60, 153, 110;\n  --bs-btn-active-color: #fff;\n  --bs-btn-active-bg: #146c43;\n  --bs-btn-active-border-color: #13653f;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #fff;\n  --bs-btn-disabled-bg: #198754;\n  --bs-btn-disabled-border-color: #198754;\n}\n\n.btn-info {\n  --bs-btn-color: #000;\n  --bs-btn-bg: #0dcaf0;\n  --bs-btn-border-color: #0dcaf0;\n  --bs-btn-hover-color: #000;\n  --bs-btn-hover-bg: #31d2f2;\n  --bs-btn-hover-border-color: #25cff2;\n  --bs-btn-focus-shadow-rgb: 11, 172, 204;\n  --bs-btn-active-color: #000;\n  --bs-btn-active-bg: #3dd5f3;\n  --bs-btn-active-border-color: #25cff2;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #000;\n  --bs-btn-disabled-bg: #0dcaf0;\n  --bs-btn-disabled-border-color: #0dcaf0;\n}\n\n.btn-warning {\n  --bs-btn-color: #000;\n  --bs-btn-bg: #ffc107;\n  --bs-btn-border-color: #ffc107;\n  --bs-btn-hover-color: #000;\n  --bs-btn-hover-bg: #ffca2c;\n  --bs-btn-hover-border-color: #ffc720;\n  --bs-btn-focus-shadow-rgb: 217, 164, 6;\n  --bs-btn-active-color: #000;\n  --bs-btn-active-bg: #ffcd39;\n  --bs-btn-active-border-color: #ffc720;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #000;\n  --bs-btn-disabled-bg: #ffc107;\n  --bs-btn-disabled-border-color: #ffc107;\n}\n\n.btn-danger {\n  --bs-btn-color: #fff;\n  --bs-btn-bg: #dc3545;\n  --bs-btn-border-color: #dc3545;\n  --bs-btn-hover-color: #fff;\n  --bs-btn-hover-bg: #bb2d3b;\n  --bs-btn-hover-border-color: #b02a37;\n  --bs-btn-focus-shadow-rgb: 225, 83, 97;\n  --bs-btn-active-color: #fff;\n  --bs-btn-active-bg: #b02a37;\n  --bs-btn-active-border-color: #a52834;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #fff;\n  --bs-btn-disabled-bg: #dc3545;\n  --bs-btn-disabled-border-color: #dc3545;\n}\n\n.btn-light {\n  --bs-btn-color: #000;\n  --bs-btn-bg: #f8f9fa;\n  --bs-btn-border-color: #f8f9fa;\n  --bs-btn-hover-color: #000;\n  --bs-btn-hover-bg: #d3d4d5;\n  --bs-btn-hover-border-color: #c6c7c8;\n  --bs-btn-focus-shadow-rgb: 211, 212, 213;\n  --bs-btn-active-color: #000;\n  --bs-btn-active-bg: #c6c7c8;\n  --bs-btn-active-border-color: #babbbc;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #000;\n  --bs-btn-disabled-bg: #f8f9fa;\n  --bs-btn-disabled-border-color: #f8f9fa;\n}\n\n.btn-dark {\n  --bs-btn-color: #fff;\n  --bs-btn-bg: #212529;\n  --bs-btn-border-color: #212529;\n  --bs-btn-hover-color: #fff;\n  --bs-btn-hover-bg: #424649;\n  --bs-btn-hover-border-color: #373b3e;\n  --bs-btn-focus-shadow-rgb: 66, 70, 73;\n  --bs-btn-active-color: #fff;\n  --bs-btn-active-bg: #4d5154;\n  --bs-btn-active-border-color: #373b3e;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #fff;\n  --bs-btn-disabled-bg: #212529;\n  --bs-btn-disabled-border-color: #212529;\n}\n\n.btn-outline-primary {\n  --bs-btn-color: #0d6efd;\n  --bs-btn-border-color: #0d6efd;\n  --bs-btn-hover-color: #fff;\n  --bs-btn-hover-bg: #0d6efd;\n  --bs-btn-hover-border-color: #0d6efd;\n  --bs-btn-focus-shadow-rgb: 13, 110, 253;\n  --bs-btn-active-color: #fff;\n  --bs-btn-active-bg: #0d6efd;\n  --bs-btn-active-border-color: #0d6efd;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #0d6efd;\n  --bs-btn-disabled-bg: transparent;\n  --bs-btn-disabled-border-color: #0d6efd;\n  --bs-gradient: none;\n}\n\n.btn-outline-secondary {\n  --bs-btn-color: #6c757d;\n  --bs-btn-border-color: #6c757d;\n  --bs-btn-hover-color: #fff;\n  --bs-btn-hover-bg: #6c757d;\n  --bs-btn-hover-border-color: #6c757d;\n  --bs-btn-focus-shadow-rgb: 108, 117, 125;\n  --bs-btn-active-color: #fff;\n  --bs-btn-active-bg: #6c757d;\n  --bs-btn-active-border-color: #6c757d;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #6c757d;\n  --bs-btn-disabled-bg: transparent;\n  --bs-btn-disabled-border-color: #6c757d;\n  --bs-gradient: none;\n}\n\n.btn-outline-success {\n  --bs-btn-color: #198754;\n  --bs-btn-border-color: #198754;\n  --bs-btn-hover-color: #fff;\n  --bs-btn-hover-bg: #198754;\n  --bs-btn-hover-border-color: #198754;\n  --bs-btn-focus-shadow-rgb: 25, 135, 84;\n  --bs-btn-active-color: #fff;\n  --bs-btn-active-bg: #198754;\n  --bs-btn-active-border-color: #198754;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #198754;\n  --bs-btn-disabled-bg: transparent;\n  --bs-btn-disabled-border-color: #198754;\n  --bs-gradient: none;\n}\n\n.btn-outline-info {\n  --bs-btn-color: #0dcaf0;\n  --bs-btn-border-color: #0dcaf0;\n  --bs-btn-hover-color: #000;\n  --bs-btn-hover-bg: #0dcaf0;\n  --bs-btn-hover-border-color: #0dcaf0;\n  --bs-btn-focus-shadow-rgb: 13, 202, 240;\n  --bs-btn-active-color: #000;\n  --bs-btn-active-bg: #0dcaf0;\n  --bs-btn-active-border-color: #0dcaf0;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #0dcaf0;\n  --bs-btn-disabled-bg: transparent;\n  --bs-btn-disabled-border-color: #0dcaf0;\n  --bs-gradient: none;\n}\n\n.btn-outline-warning {\n  --bs-btn-color: #ffc107;\n  --bs-btn-border-color: #ffc107;\n  --bs-btn-hover-color: #000;\n  --bs-btn-hover-bg: #ffc107;\n  --bs-btn-hover-border-color: #ffc107;\n  --bs-btn-focus-shadow-rgb: 255, 193, 7;\n  --bs-btn-active-color: #000;\n  --bs-btn-active-bg: #ffc107;\n  --bs-btn-active-border-color: #ffc107;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #ffc107;\n  --bs-btn-disabled-bg: transparent;\n  --bs-btn-disabled-border-color: #ffc107;\n  --bs-gradient: none;\n}\n\n.btn-outline-danger {\n  --bs-btn-color: #dc3545;\n  --bs-btn-border-color: #dc3545;\n  --bs-btn-hover-color: #fff;\n  --bs-btn-hover-bg: #dc3545;\n  --bs-btn-hover-border-color: #dc3545;\n  --bs-btn-focus-shadow-rgb: 220, 53, 69;\n  --bs-btn-active-color: #fff;\n  --bs-btn-active-bg: #dc3545;\n  --bs-btn-active-border-color: #dc3545;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #dc3545;\n  --bs-btn-disabled-bg: transparent;\n  --bs-btn-disabled-border-color: #dc3545;\n  --bs-gradient: none;\n}\n\n.btn-outline-light {\n  --bs-btn-color: #f8f9fa;\n  --bs-btn-border-color: #f8f9fa;\n  --bs-btn-hover-color: #000;\n  --bs-btn-hover-bg: #f8f9fa;\n  --bs-btn-hover-border-color: #f8f9fa;\n  --bs-btn-focus-shadow-rgb: 248, 249, 250;\n  --bs-btn-active-color: #000;\n  --bs-btn-active-bg: #f8f9fa;\n  --bs-btn-active-border-color: #f8f9fa;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #f8f9fa;\n  --bs-btn-disabled-bg: transparent;\n  --bs-btn-disabled-border-color: #f8f9fa;\n  --bs-gradient: none;\n}\n\n.btn-outline-dark {\n  --bs-btn-color: #212529;\n  --bs-btn-border-color: #212529;\n  --bs-btn-hover-color: #fff;\n  --bs-btn-hover-bg: #212529;\n  --bs-btn-hover-border-color: #212529;\n  --bs-btn-focus-shadow-rgb: 33, 37, 41;\n  --bs-btn-active-color: #fff;\n  --bs-btn-active-bg: #212529;\n  --bs-btn-active-border-color: #212529;\n  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  --bs-btn-disabled-color: #212529;\n  --bs-btn-disabled-bg: transparent;\n  --bs-btn-disabled-border-color: #212529;\n  --bs-gradient: none;\n}\n\n.btn-link {\n  --bs-btn-font-weight: 400;\n  --bs-btn-color: var(--bs-link-color);\n  --bs-btn-bg: transparent;\n  --bs-btn-border-color: transparent;\n  --bs-btn-hover-color: var(--bs-link-hover-color);\n  --bs-btn-hover-border-color: transparent;\n  --bs-btn-active-color: var(--bs-link-hover-color);\n  --bs-btn-active-border-color: transparent;\n  --bs-btn-disabled-color: #6c757d;\n  --bs-btn-disabled-border-color: transparent;\n  --bs-btn-box-shadow: none;\n  --bs-btn-focus-shadow-rgb: 49, 132, 253;\n  text-decoration: underline;\n}\n.btn-link:focus-visible {\n  color: var(--bs-btn-color);\n}\n.btn-link:hover {\n  color: var(--bs-btn-hover-color);\n}\n\n.btn-lg, .btn-group-lg > .btn {\n  --bs-btn-padding-y: 0.5rem;\n  --bs-btn-padding-x: 1rem;\n  --bs-btn-font-size: 1.25rem;\n  --bs-btn-border-radius: 0.5rem;\n}\n\n.btn-sm, .btn-group-sm > .btn {\n  --bs-btn-padding-y: 0.25rem;\n  --bs-btn-padding-x: 0.5rem;\n  --bs-btn-font-size: 0.875rem;\n  --bs-btn-border-radius: 0.25rem;\n}\n\n.fade {\n  transition: opacity 0.15s linear;\n}\n@media (prefers-reduced-motion: reduce) {\n  .fade {\n    transition: none;\n  }\n}\n.fade:not(.show) {\n  opacity: 0;\n}\n\n.collapse:not(.show) {\n  display: none;\n}\n\n.collapsing {\n  height: 0;\n  overflow: hidden;\n  transition: height 0.35s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n  .collapsing {\n    transition: none;\n  }\n}\n.collapsing.collapse-horizontal {\n  width: 0;\n  height: auto;\n  transition: width 0.35s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n  .collapsing.collapse-horizontal {\n    transition: none;\n  }\n}\n\n.dropup,\n.dropend,\n.dropdown,\n.dropstart,\n.dropup-center,\n.dropdown-center {\n  position: relative;\n}\n\n.dropdown-toggle {\n  white-space: nowrap;\n}\n.dropdown-toggle::after {\n  display: inline-block;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0.3em solid;\n  border-right: 0.3em solid transparent;\n  border-bottom: 0;\n  border-left: 0.3em solid transparent;\n}\n.dropdown-toggle:empty::after {\n  margin-left: 0;\n}\n\n.dropdown-menu {\n  --bs-dropdown-zindex: 1000;\n  --bs-dropdown-min-width: 10rem;\n  --bs-dropdown-padding-x: 0;\n  --bs-dropdown-padding-y: 0.5rem;\n  --bs-dropdown-spacer: 0.125rem;\n  --bs-dropdown-font-size: 1rem;\n  --bs-dropdown-color: #212529;\n  --bs-dropdown-bg: #fff;\n  --bs-dropdown-border-color: var(--bs-border-color-translucent);\n  --bs-dropdown-border-radius: 0.375rem;\n  --bs-dropdown-border-width: 1px;\n  --bs-dropdown-inner-border-radius: calc(0.375rem - 1px);\n  --bs-dropdown-divider-bg: var(--bs-border-color-translucent);\n  --bs-dropdown-divider-margin-y: 0.5rem;\n  --bs-dropdown-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);\n  --bs-dropdown-link-color: #212529;\n  --bs-dropdown-link-hover-color: #1e2125;\n  --bs-dropdown-link-hover-bg: #e9ecef;\n  --bs-dropdown-link-active-color: #fff;\n  --bs-dropdown-link-active-bg: #0d6efd;\n  --bs-dropdown-link-disabled-color: #adb5bd;\n  --bs-dropdown-item-padding-x: 1rem;\n  --bs-dropdown-item-padding-y: 0.25rem;\n  --bs-dropdown-header-color: #6c757d;\n  --bs-dropdown-header-padding-x: 1rem;\n  --bs-dropdown-header-padding-y: 0.5rem;\n  position: absolute;\n  z-index: var(--bs-dropdown-zindex);\n  display: none;\n  min-width: var(--bs-dropdown-min-width);\n  padding: var(--bs-dropdown-padding-y) var(--bs-dropdown-padding-x);\n  margin: 0;\n  font-size: var(--bs-dropdown-font-size);\n  color: var(--bs-dropdown-color);\n  text-align: left;\n  list-style: none;\n  background-color: var(--bs-dropdown-bg);\n  background-clip: padding-box;\n  border: var(--bs-dropdown-border-width) solid var(--bs-dropdown-border-color);\n  border-radius: var(--bs-dropdown-border-radius);\n}\n.dropdown-menu[data-bs-popper] {\n  top: 100%;\n  left: 0;\n  margin-top: var(--bs-dropdown-spacer);\n}\n\n.dropdown-menu-start {\n  --bs-position: start;\n}\n.dropdown-menu-start[data-bs-popper] {\n  right: auto;\n  left: 0;\n}\n\n.dropdown-menu-end {\n  --bs-position: end;\n}\n.dropdown-menu-end[data-bs-popper] {\n  right: 0;\n  left: auto;\n}\n\n@media (min-width: 576px) {\n  .dropdown-menu-sm-start {\n    --bs-position: start;\n  }\n  .dropdown-menu-sm-start[data-bs-popper] {\n    right: auto;\n    left: 0;\n  }\n  .dropdown-menu-sm-end {\n    --bs-position: end;\n  }\n  .dropdown-menu-sm-end[data-bs-popper] {\n    right: 0;\n    left: auto;\n  }\n}\n@media (min-width: 768px) {\n  .dropdown-menu-md-start {\n    --bs-position: start;\n  }\n  .dropdown-menu-md-start[data-bs-popper] {\n    right: auto;\n    left: 0;\n  }\n  .dropdown-menu-md-end {\n    --bs-position: end;\n  }\n  .dropdown-menu-md-end[data-bs-popper] {\n    right: 0;\n    left: auto;\n  }\n}\n@media (min-width: 992px) {\n  .dropdown-menu-lg-start {\n    --bs-position: start;\n  }\n  .dropdown-menu-lg-start[data-bs-popper] {\n    right: auto;\n    left: 0;\n  }\n  .dropdown-menu-lg-end {\n    --bs-position: end;\n  }\n  .dropdown-menu-lg-end[data-bs-popper] {\n    right: 0;\n    left: auto;\n  }\n}\n@media (min-width: 1200px) {\n  .dropdown-menu-xl-start {\n    --bs-position: start;\n  }\n  .dropdown-menu-xl-start[data-bs-popper] {\n    right: auto;\n    left: 0;\n  }\n  .dropdown-menu-xl-end {\n    --bs-position: end;\n  }\n  .dropdown-menu-xl-end[data-bs-popper] {\n    right: 0;\n    left: auto;\n  }\n}\n@media (min-width: 1400px) {\n  .dropdown-menu-xxl-start {\n    --bs-position: start;\n  }\n  .dropdown-menu-xxl-start[data-bs-popper] {\n    right: auto;\n    left: 0;\n  }\n  .dropdown-menu-xxl-end {\n    --bs-position: end;\n  }\n  .dropdown-menu-xxl-end[data-bs-popper] {\n    right: 0;\n    left: auto;\n  }\n}\n.dropup .dropdown-menu[data-bs-popper] {\n  top: auto;\n  bottom: 100%;\n  margin-top: 0;\n  margin-bottom: var(--bs-dropdown-spacer);\n}\n.dropup .dropdown-toggle::after {\n  display: inline-block;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0;\n  border-right: 0.3em solid transparent;\n  border-bottom: 0.3em solid;\n  border-left: 0.3em solid transparent;\n}\n.dropup .dropdown-toggle:empty::after {\n  margin-left: 0;\n}\n\n.dropend .dropdown-menu[data-bs-popper] {\n  top: 0;\n  right: auto;\n  left: 100%;\n  margin-top: 0;\n  margin-left: var(--bs-dropdown-spacer);\n}\n.dropend .dropdown-toggle::after {\n  display: inline-block;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0.3em solid transparent;\n  border-right: 0;\n  border-bottom: 0.3em solid transparent;\n  border-left: 0.3em solid;\n}\n.dropend .dropdown-toggle:empty::after {\n  margin-left: 0;\n}\n.dropend .dropdown-toggle::after {\n  vertical-align: 0;\n}\n\n.dropstart .dropdown-menu[data-bs-popper] {\n  top: 0;\n  right: 100%;\n  left: auto;\n  margin-top: 0;\n  margin-right: var(--bs-dropdown-spacer);\n}\n.dropstart .dropdown-toggle::after {\n  display: inline-block;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n}\n.dropstart .dropdown-toggle::after {\n  display: none;\n}\n.dropstart .dropdown-toggle::before {\n  display: inline-block;\n  margin-right: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0.3em solid transparent;\n  border-right: 0.3em solid;\n  border-bottom: 0.3em solid transparent;\n}\n.dropstart .dropdown-toggle:empty::after {\n  margin-left: 0;\n}\n.dropstart .dropdown-toggle::before {\n  vertical-align: 0;\n}\n\n.dropdown-divider {\n  height: 0;\n  margin: var(--bs-dropdown-divider-margin-y) 0;\n  overflow: hidden;\n  border-top: 1px solid var(--bs-dropdown-divider-bg);\n  opacity: 1;\n}\n\n.dropdown-item {\n  display: block;\n  width: 100%;\n  padding: var(--bs-dropdown-item-padding-y) var(--bs-dropdown-item-padding-x);\n  clear: both;\n  font-weight: 400;\n  color: var(--bs-dropdown-link-color);\n  text-align: inherit;\n  text-decoration: none;\n  white-space: nowrap;\n  background-color: transparent;\n  border: 0;\n}\n.dropdown-item:hover, .dropdown-item:focus {\n  color: var(--bs-dropdown-link-hover-color);\n  background-color: var(--bs-dropdown-link-hover-bg);\n}\n.dropdown-item.active, .dropdown-item:active {\n  color: var(--bs-dropdown-link-active-color);\n  text-decoration: none;\n  background-color: var(--bs-dropdown-link-active-bg);\n}\n.dropdown-item.disabled, .dropdown-item:disabled {\n  color: var(--bs-dropdown-link-disabled-color);\n  pointer-events: none;\n  background-color: transparent;\n}\n\n.dropdown-menu.show {\n  display: block;\n}\n\n.dropdown-header {\n  display: block;\n  padding: var(--bs-dropdown-header-padding-y) var(--bs-dropdown-header-padding-x);\n  margin-bottom: 0;\n  font-size: 0.875rem;\n  color: var(--bs-dropdown-header-color);\n  white-space: nowrap;\n}\n\n.dropdown-item-text {\n  display: block;\n  padding: var(--bs-dropdown-item-padding-y) var(--bs-dropdown-item-padding-x);\n  color: var(--bs-dropdown-link-color);\n}\n\n.dropdown-menu-dark {\n  --bs-dropdown-color: #dee2e6;\n  --bs-dropdown-bg: #343a40;\n  --bs-dropdown-border-color: var(--bs-border-color-translucent);\n  --bs-dropdown-box-shadow: ;\n  --bs-dropdown-link-color: #dee2e6;\n  --bs-dropdown-link-hover-color: #fff;\n  --bs-dropdown-divider-bg: var(--bs-border-color-translucent);\n  --bs-dropdown-link-hover-bg: rgba(255, 255, 255, 0.15);\n  --bs-dropdown-link-active-color: #fff;\n  --bs-dropdown-link-active-bg: #0d6efd;\n  --bs-dropdown-link-disabled-color: #adb5bd;\n  --bs-dropdown-header-color: #adb5bd;\n}\n\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-flex;\n  vertical-align: middle;\n}\n.btn-group > .btn,\n.btn-group-vertical > .btn {\n  position: relative;\n  flex: 1 1 auto;\n}\n.btn-group > .btn-check:checked + .btn,\n.btn-group > .btn-check:focus + .btn,\n.btn-group > .btn:hover,\n.btn-group > .btn:focus,\n.btn-group > .btn:active,\n.btn-group > .btn.active,\n.btn-group-vertical > .btn-check:checked + .btn,\n.btn-group-vertical > .btn-check:focus + .btn,\n.btn-group-vertical > .btn:hover,\n.btn-group-vertical > .btn:focus,\n.btn-group-vertical > .btn:active,\n.btn-group-vertical > .btn.active {\n  z-index: 1;\n}\n\n.btn-toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n}\n.btn-toolbar .input-group {\n  width: auto;\n}\n\n.btn-group {\n  border-radius: 0.375rem;\n}\n.btn-group > :not(.btn-check:first-child) + .btn,\n.btn-group > .btn-group:not(:first-child) {\n  margin-left: -1px;\n}\n.btn-group > .btn:not(:last-child):not(.dropdown-toggle),\n.btn-group > .btn.dropdown-toggle-split:first-child,\n.btn-group > .btn-group:not(:last-child) > .btn {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.btn-group > .btn:nth-child(n+3),\n.btn-group > :not(.btn-check) + .btn,\n.btn-group > .btn-group:not(:first-child) > .btn {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.dropdown-toggle-split {\n  padding-right: 0.5625rem;\n  padding-left: 0.5625rem;\n}\n.dropdown-toggle-split::after, .dropup .dropdown-toggle-split::after, .dropend .dropdown-toggle-split::after {\n  margin-left: 0;\n}\n.dropstart .dropdown-toggle-split::before {\n  margin-right: 0;\n}\n\n.btn-sm + .dropdown-toggle-split, .btn-group-sm > .btn + .dropdown-toggle-split {\n  padding-right: 0.375rem;\n  padding-left: 0.375rem;\n}\n\n.btn-lg + .dropdown-toggle-split, .btn-group-lg > .btn + .dropdown-toggle-split {\n  padding-right: 0.75rem;\n  padding-left: 0.75rem;\n}\n\n.btn-group-vertical {\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n}\n.btn-group-vertical > .btn,\n.btn-group-vertical > .btn-group {\n  width: 100%;\n}\n.btn-group-vertical > .btn:not(:first-child),\n.btn-group-vertical > .btn-group:not(:first-child) {\n  margin-top: -1px;\n}\n.btn-group-vertical > .btn:not(:last-child):not(.dropdown-toggle),\n.btn-group-vertical > .btn-group:not(:last-child) > .btn {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.btn-group-vertical > .btn ~ .btn,\n.btn-group-vertical > .btn-group:not(:first-child) > .btn {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n\n.nav {\n  --bs-nav-link-padding-x: 1rem;\n  --bs-nav-link-padding-y: 0.5rem;\n  --bs-nav-link-font-weight: ;\n  --bs-nav-link-color: var(--bs-link-color);\n  --bs-nav-link-hover-color: var(--bs-link-hover-color);\n  --bs-nav-link-disabled-color: #6c757d;\n  display: flex;\n  flex-wrap: wrap;\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none;\n}\n\n.nav-link {\n  display: block;\n  padding: var(--bs-nav-link-padding-y) var(--bs-nav-link-padding-x);\n  font-size: var(--bs-nav-link-font-size);\n  font-weight: var(--bs-nav-link-font-weight);\n  color: var(--bs-nav-link-color);\n  text-decoration: none;\n  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n  .nav-link {\n    transition: none;\n  }\n}\n.nav-link:hover, .nav-link:focus {\n  color: var(--bs-nav-link-hover-color);\n}\n.nav-link.disabled {\n  color: var(--bs-nav-link-disabled-color);\n  pointer-events: none;\n  cursor: default;\n}\n\n.nav-tabs {\n  --bs-nav-tabs-border-width: 1px;\n  --bs-nav-tabs-border-color: #dee2e6;\n  --bs-nav-tabs-border-radius: 0.375rem;\n  --bs-nav-tabs-link-hover-border-color: #e9ecef #e9ecef #dee2e6;\n  --bs-nav-tabs-link-active-color: #495057;\n  --bs-nav-tabs-link-active-bg: #fff;\n  --bs-nav-tabs-link-active-border-color: #dee2e6 #dee2e6 #fff;\n  border-bottom: var(--bs-nav-tabs-border-width) solid var(--bs-nav-tabs-border-color);\n}\n.nav-tabs .nav-link {\n  margin-bottom: calc(-1 * var(--bs-nav-tabs-border-width));\n  background: none;\n  border: var(--bs-nav-tabs-border-width) solid transparent;\n  border-top-left-radius: var(--bs-nav-tabs-border-radius);\n  border-top-right-radius: var(--bs-nav-tabs-border-radius);\n}\n.nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {\n  isolation: isolate;\n  border-color: var(--bs-nav-tabs-link-hover-border-color);\n}\n.nav-tabs .nav-link.disabled, .nav-tabs .nav-link:disabled {\n  color: var(--bs-nav-link-disabled-color);\n  background-color: transparent;\n  border-color: transparent;\n}\n.nav-tabs .nav-link.active,\n.nav-tabs .nav-item.show .nav-link {\n  color: var(--bs-nav-tabs-link-active-color);\n  background-color: var(--bs-nav-tabs-link-active-bg);\n  border-color: var(--bs-nav-tabs-link-active-border-color);\n}\n.nav-tabs .dropdown-menu {\n  margin-top: calc(-1 * var(--bs-nav-tabs-border-width));\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n\n.nav-pills {\n  --bs-nav-pills-border-radius: 0.375rem;\n  --bs-nav-pills-link-active-color: #fff;\n  --bs-nav-pills-link-active-bg: #0d6efd;\n}\n.nav-pills .nav-link {\n  background: none;\n  border: 0;\n  border-radius: var(--bs-nav-pills-border-radius);\n}\n.nav-pills .nav-link:disabled {\n  color: var(--bs-nav-link-disabled-color);\n  background-color: transparent;\n  border-color: transparent;\n}\n.nav-pills .nav-link.active,\n.nav-pills .show > .nav-link {\n  color: var(--bs-nav-pills-link-active-color);\n  background-color: var(--bs-nav-pills-link-active-bg);\n}\n\n.nav-fill > .nav-link,\n.nav-fill .nav-item {\n  flex: 1 1 auto;\n  text-align: center;\n}\n\n.nav-justified > .nav-link,\n.nav-justified .nav-item {\n  flex-basis: 0;\n  flex-grow: 1;\n  text-align: center;\n}\n\n.nav-fill .nav-item .nav-link,\n.nav-justified .nav-item .nav-link {\n  width: 100%;\n}\n\n.tab-content > .tab-pane {\n  display: none;\n}\n.tab-content > .active {\n  display: block;\n}\n\n.navbar {\n  --bs-navbar-padding-x: 0;\n  --bs-navbar-padding-y: 0.5rem;\n  --bs-navbar-color: rgba(0, 0, 0, 0.55);\n  --bs-navbar-hover-color: rgba(0, 0, 0, 0.7);\n  --bs-navbar-disabled-color: rgba(0, 0, 0, 0.3);\n  --bs-navbar-active-color: rgba(0, 0, 0, 0.9);\n  --bs-navbar-brand-padding-y: 0.3125rem;\n  --bs-navbar-brand-margin-end: 1rem;\n  --bs-navbar-brand-font-size: 1.25rem;\n  --bs-navbar-brand-color: rgba(0, 0, 0, 0.9);\n  --bs-navbar-brand-hover-color: rgba(0, 0, 0, 0.9);\n  --bs-navbar-nav-link-padding-x: 0.5rem;\n  --bs-navbar-toggler-padding-y: 0.25rem;\n  --bs-navbar-toggler-padding-x: 0.75rem;\n  --bs-navbar-toggler-font-size: 1.25rem;\n  --bs-navbar-toggler-icon-bg: url(" + ___CSS_LOADER_URL_REPLACEMENT_9___ + ");\n  --bs-navbar-toggler-border-color: rgba(0, 0, 0, 0.1);\n  --bs-navbar-toggler-border-radius: 0.375rem;\n  --bs-navbar-toggler-focus-width: 0.25rem;\n  --bs-navbar-toggler-transition: box-shadow 0.15s ease-in-out;\n  position: relative;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  padding: var(--bs-navbar-padding-y) var(--bs-navbar-padding-x);\n}\n.navbar > .container,\n.navbar > .container-fluid,\n.navbar > .container-sm,\n.navbar > .container-md,\n.navbar > .container-lg,\n.navbar > .container-xl,\n.navbar > .container-xxl {\n  display: flex;\n  flex-wrap: inherit;\n  align-items: center;\n  justify-content: space-between;\n}\n.navbar-brand {\n  padding-top: var(--bs-navbar-brand-padding-y);\n  padding-bottom: var(--bs-navbar-brand-padding-y);\n  margin-right: var(--bs-navbar-brand-margin-end);\n  font-size: var(--bs-navbar-brand-font-size);\n  color: var(--bs-navbar-brand-color);\n  text-decoration: none;\n  white-space: nowrap;\n}\n.navbar-brand:hover, .navbar-brand:focus {\n  color: var(--bs-navbar-brand-hover-color);\n}\n\n.navbar-nav {\n  --bs-nav-link-padding-x: 0;\n  --bs-nav-link-padding-y: 0.5rem;\n  --bs-nav-link-font-weight: ;\n  --bs-nav-link-color: var(--bs-navbar-color);\n  --bs-nav-link-hover-color: var(--bs-navbar-hover-color);\n  --bs-nav-link-disabled-color: var(--bs-navbar-disabled-color);\n  display: flex;\n  flex-direction: column;\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none;\n}\n.navbar-nav .show > .nav-link,\n.navbar-nav .nav-link.active {\n  color: var(--bs-navbar-active-color);\n}\n.navbar-nav .dropdown-menu {\n  position: static;\n}\n\n.navbar-text {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  color: var(--bs-navbar-color);\n}\n.navbar-text a,\n.navbar-text a:hover,\n.navbar-text a:focus {\n  color: var(--bs-navbar-active-color);\n}\n\n.navbar-collapse {\n  flex-basis: 100%;\n  flex-grow: 1;\n  align-items: center;\n}\n\n.navbar-toggler {\n  padding: var(--bs-navbar-toggler-padding-y) var(--bs-navbar-toggler-padding-x);\n  font-size: var(--bs-navbar-toggler-font-size);\n  line-height: 1;\n  color: var(--bs-navbar-color);\n  background-color: transparent;\n  border: var(--bs-border-width) solid var(--bs-navbar-toggler-border-color);\n  border-radius: var(--bs-navbar-toggler-border-radius);\n  transition: var(--bs-navbar-toggler-transition);\n}\n@media (prefers-reduced-motion: reduce) {\n  .navbar-toggler {\n    transition: none;\n  }\n}\n.navbar-toggler:hover {\n  text-decoration: none;\n}\n.navbar-toggler:focus {\n  text-decoration: none;\n  outline: 0;\n  box-shadow: 0 0 0 var(--bs-navbar-toggler-focus-width);\n}\n\n.navbar-toggler-icon {\n  display: inline-block;\n  width: 1.5em;\n  height: 1.5em;\n  vertical-align: middle;\n  background-image: var(--bs-navbar-toggler-icon-bg);\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 100%;\n}\n\n.navbar-nav-scroll {\n  max-height: var(--bs-scroll-height, 75vh);\n  overflow-y: auto;\n}\n\n@media (min-width: 576px) {\n  .navbar-expand-sm {\n    flex-wrap: nowrap;\n    justify-content: flex-start;\n  }\n  .navbar-expand-sm .navbar-nav {\n    flex-direction: row;\n  }\n  .navbar-expand-sm .navbar-nav .dropdown-menu {\n    position: absolute;\n  }\n  .navbar-expand-sm .navbar-nav .nav-link {\n    padding-right: var(--bs-navbar-nav-link-padding-x);\n    padding-left: var(--bs-navbar-nav-link-padding-x);\n  }\n  .navbar-expand-sm .navbar-nav-scroll {\n    overflow: visible;\n  }\n  .navbar-expand-sm .navbar-collapse {\n    display: flex !important;\n    flex-basis: auto;\n  }\n  .navbar-expand-sm .navbar-toggler {\n    display: none;\n  }\n  .navbar-expand-sm .offcanvas {\n    position: static;\n    z-index: auto;\n    flex-grow: 1;\n    width: auto !important;\n    height: auto !important;\n    visibility: visible !important;\n    background-color: transparent !important;\n    border: 0 !important;\n    transform: none !important;\n    transition: none;\n  }\n  .navbar-expand-sm .offcanvas .offcanvas-header {\n    display: none;\n  }\n  .navbar-expand-sm .offcanvas .offcanvas-body {\n    display: flex;\n    flex-grow: 0;\n    padding: 0;\n    overflow-y: visible;\n  }\n}\n@media (min-width: 768px) {\n  .navbar-expand-md {\n    flex-wrap: nowrap;\n    justify-content: flex-start;\n  }\n  .navbar-expand-md .navbar-nav {\n    flex-direction: row;\n  }\n  .navbar-expand-md .navbar-nav .dropdown-menu {\n    position: absolute;\n  }\n  .navbar-expand-md .navbar-nav .nav-link {\n    padding-right: var(--bs-navbar-nav-link-padding-x);\n    padding-left: var(--bs-navbar-nav-link-padding-x);\n  }\n  .navbar-expand-md .navbar-nav-scroll {\n    overflow: visible;\n  }\n  .navbar-expand-md .navbar-collapse {\n    display: flex !important;\n    flex-basis: auto;\n  }\n  .navbar-expand-md .navbar-toggler {\n    display: none;\n  }\n  .navbar-expand-md .offcanvas {\n    position: static;\n    z-index: auto;\n    flex-grow: 1;\n    width: auto !important;\n    height: auto !important;\n    visibility: visible !important;\n    background-color: transparent !important;\n    border: 0 !important;\n    transform: none !important;\n    transition: none;\n  }\n  .navbar-expand-md .offcanvas .offcanvas-header {\n    display: none;\n  }\n  .navbar-expand-md .offcanvas .offcanvas-body {\n    display: flex;\n    flex-grow: 0;\n    padding: 0;\n    overflow-y: visible;\n  }\n}\n@media (min-width: 992px) {\n  .navbar-expand-lg {\n    flex-wrap: nowrap;\n    justify-content: flex-start;\n  }\n  .navbar-expand-lg .navbar-nav {\n    flex-direction: row;\n  }\n  .navbar-expand-lg .navbar-nav .dropdown-menu {\n    position: absolute;\n  }\n  .navbar-expand-lg .navbar-nav .nav-link {\n    padding-right: var(--bs-navbar-nav-link-padding-x);\n    padding-left: var(--bs-navbar-nav-link-padding-x);\n  }\n  .navbar-expand-lg .navbar-nav-scroll {\n    overflow: visible;\n  }\n  .navbar-expand-lg .navbar-collapse {\n    display: flex !important;\n    flex-basis: auto;\n  }\n  .navbar-expand-lg .navbar-toggler {\n    display: none;\n  }\n  .navbar-expand-lg .offcanvas {\n    position: static;\n    z-index: auto;\n    flex-grow: 1;\n    width: auto !important;\n    height: auto !important;\n    visibility: visible !important;\n    background-color: transparent !important;\n    border: 0 !important;\n    transform: none !important;\n    transition: none;\n  }\n  .navbar-expand-lg .offcanvas .offcanvas-header {\n    display: none;\n  }\n  .navbar-expand-lg .offcanvas .offcanvas-body {\n    display: flex;\n    flex-grow: 0;\n    padding: 0;\n    overflow-y: visible;\n  }\n}\n@media (min-width: 1200px) {\n  .navbar-expand-xl {\n    flex-wrap: nowrap;\n    justify-content: flex-start;\n  }\n  .navbar-expand-xl .navbar-nav {\n    flex-direction: row;\n  }\n  .navbar-expand-xl .navbar-nav .dropdown-menu {\n    position: absolute;\n  }\n  .navbar-expand-xl .navbar-nav .nav-link {\n    padding-right: var(--bs-navbar-nav-link-padding-x);\n    padding-left: var(--bs-navbar-nav-link-padding-x);\n  }\n  .navbar-expand-xl .navbar-nav-scroll {\n    overflow: visible;\n  }\n  .navbar-expand-xl .navbar-collapse {\n    display: flex !important;\n    flex-basis: auto;\n  }\n  .navbar-expand-xl .navbar-toggler {\n    display: none;\n  }\n  .navbar-expand-xl .offcanvas {\n    position: static;\n    z-index: auto;\n    flex-grow: 1;\n    width: auto !important;\n    height: auto !important;\n    visibility: visible !important;\n    background-color: transparent !important;\n    border: 0 !important;\n    transform: none !important;\n    transition: none;\n  }\n  .navbar-expand-xl .offcanvas .offcanvas-header {\n    display: none;\n  }\n  .navbar-expand-xl .offcanvas .offcanvas-body {\n    display: flex;\n    flex-grow: 0;\n    padding: 0;\n    overflow-y: visible;\n  }\n}\n@media (min-width: 1400px) {\n  .navbar-expand-xxl {\n    flex-wrap: nowrap;\n    justify-content: flex-start;\n  }\n  .navbar-expand-xxl .navbar-nav {\n    flex-direction: row;\n  }\n  .navbar-expand-xxl .navbar-nav .dropdown-menu {\n    position: absolute;\n  }\n  .navbar-expand-xxl .navbar-nav .nav-link {\n    padding-right: var(--bs-navbar-nav-link-padding-x);\n    padding-left: var(--bs-navbar-nav-link-padding-x);\n  }\n  .navbar-expand-xxl .navbar-nav-scroll {\n    overflow: visible;\n  }\n  .navbar-expand-xxl .navbar-collapse {\n    display: flex !important;\n    flex-basis: auto;\n  }\n  .navbar-expand-xxl .navbar-toggler {\n    display: none;\n  }\n  .navbar-expand-xxl .offcanvas {\n    position: static;\n    z-index: auto;\n    flex-grow: 1;\n    width: auto !important;\n    height: auto !important;\n    visibility: visible !important;\n    background-color: transparent !important;\n    border: 0 !important;\n    transform: none !important;\n    transition: none;\n  }\n  .navbar-expand-xxl .offcanvas .offcanvas-header {\n    display: none;\n  }\n  .navbar-expand-xxl .offcanvas .offcanvas-body {\n    display: flex;\n    flex-grow: 0;\n    padding: 0;\n    overflow-y: visible;\n  }\n}\n.navbar-expand {\n  flex-wrap: nowrap;\n  justify-content: flex-start;\n}\n.navbar-expand .navbar-nav {\n  flex-direction: row;\n}\n.navbar-expand .navbar-nav .dropdown-menu {\n  position: absolute;\n}\n.navbar-expand .navbar-nav .nav-link {\n  padding-right: var(--bs-navbar-nav-link-padding-x);\n  padding-left: var(--bs-navbar-nav-link-padding-x);\n}\n.navbar-expand .navbar-nav-scroll {\n  overflow: visible;\n}\n.navbar-expand .navbar-collapse {\n  display: flex !important;\n  flex-basis: auto;\n}\n.navbar-expand .navbar-toggler {\n  display: none;\n}\n.navbar-expand .offcanvas {\n  position: static;\n  z-index: auto;\n  flex-grow: 1;\n  width: auto !important;\n  height: auto !important;\n  visibility: visible !important;\n  background-color: transparent !important;\n  border: 0 !important;\n  transform: none !important;\n  transition: none;\n}\n.navbar-expand .offcanvas .offcanvas-header {\n  display: none;\n}\n.navbar-expand .offcanvas .offcanvas-body {\n  display: flex;\n  flex-grow: 0;\n  padding: 0;\n  overflow-y: visible;\n}\n\n.navbar-dark {\n  --bs-navbar-color: rgba(255, 255, 255, 0.55);\n  --bs-navbar-hover-color: rgba(255, 255, 255, 0.75);\n  --bs-navbar-disabled-color: rgba(255, 255, 255, 0.25);\n  --bs-navbar-active-color: #fff;\n  --bs-navbar-brand-color: #fff;\n  --bs-navbar-brand-hover-color: #fff;\n  --bs-navbar-toggler-border-color: rgba(255, 255, 255, 0.1);\n  --bs-navbar-toggler-icon-bg: url(" + ___CSS_LOADER_URL_REPLACEMENT_10___ + ");\n}\n\n.card {\n  --bs-card-spacer-y: 1rem;\n  --bs-card-spacer-x: 1rem;\n  --bs-card-title-spacer-y: 0.5rem;\n  --bs-card-border-width: 1px;\n  --bs-card-border-color: var(--bs-border-color-translucent);\n  --bs-card-border-radius: 0.375rem;\n  --bs-card-box-shadow: ;\n  --bs-card-inner-border-radius: calc(0.375rem - 1px);\n  --bs-card-cap-padding-y: 0.5rem;\n  --bs-card-cap-padding-x: 1rem;\n  --bs-card-cap-bg: rgba(0, 0, 0, 0.03);\n  --bs-card-cap-color: ;\n  --bs-card-height: ;\n  --bs-card-color: ;\n  --bs-card-bg: #fff;\n  --bs-card-img-overlay-padding: 1rem;\n  --bs-card-group-margin: 0.75rem;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  height: var(--bs-card-height);\n  word-wrap: break-word;\n  background-color: var(--bs-card-bg);\n  background-clip: border-box;\n  border: var(--bs-card-border-width) solid var(--bs-card-border-color);\n  border-radius: var(--bs-card-border-radius);\n}\n.card > hr {\n  margin-right: 0;\n  margin-left: 0;\n}\n.card > .list-group {\n  border-top: inherit;\n  border-bottom: inherit;\n}\n.card > .list-group:first-child {\n  border-top-width: 0;\n  border-top-left-radius: var(--bs-card-inner-border-radius);\n  border-top-right-radius: var(--bs-card-inner-border-radius);\n}\n.card > .list-group:last-child {\n  border-bottom-width: 0;\n  border-bottom-right-radius: var(--bs-card-inner-border-radius);\n  border-bottom-left-radius: var(--bs-card-inner-border-radius);\n}\n.card > .card-header + .list-group,\n.card > .list-group + .card-footer {\n  border-top: 0;\n}\n\n.card-body {\n  flex: 1 1 auto;\n  padding: var(--bs-card-spacer-y) var(--bs-card-spacer-x);\n  color: var(--bs-card-color);\n}\n\n.card-title {\n  margin-bottom: var(--bs-card-title-spacer-y);\n}\n\n.card-subtitle {\n  margin-top: calc(-0.5 * var(--bs-card-title-spacer-y));\n  margin-bottom: 0;\n}\n\n.card-text:last-child {\n  margin-bottom: 0;\n}\n\n.card-link + .card-link {\n  margin-left: var(--bs-card-spacer-x);\n}\n\n.card-header {\n  padding: var(--bs-card-cap-padding-y) var(--bs-card-cap-padding-x);\n  margin-bottom: 0;\n  color: var(--bs-card-cap-color);\n  background-color: var(--bs-card-cap-bg);\n  border-bottom: var(--bs-card-border-width) solid var(--bs-card-border-color);\n}\n.card-header:first-child {\n  border-radius: var(--bs-card-inner-border-radius) var(--bs-card-inner-border-radius) 0 0;\n}\n\n.card-footer {\n  padding: var(--bs-card-cap-padding-y) var(--bs-card-cap-padding-x);\n  color: var(--bs-card-cap-color);\n  background-color: var(--bs-card-cap-bg);\n  border-top: var(--bs-card-border-width) solid var(--bs-card-border-color);\n}\n.card-footer:last-child {\n  border-radius: 0 0 var(--bs-card-inner-border-radius) var(--bs-card-inner-border-radius);\n}\n\n.card-header-tabs {\n  margin-right: calc(-0.5 * var(--bs-card-cap-padding-x));\n  margin-bottom: calc(-1 * var(--bs-card-cap-padding-y));\n  margin-left: calc(-0.5 * var(--bs-card-cap-padding-x));\n  border-bottom: 0;\n}\n.card-header-tabs .nav-link.active {\n  background-color: var(--bs-card-bg);\n  border-bottom-color: var(--bs-card-bg);\n}\n\n.card-header-pills {\n  margin-right: calc(-0.5 * var(--bs-card-cap-padding-x));\n  margin-left: calc(-0.5 * var(--bs-card-cap-padding-x));\n}\n\n.card-img-overlay {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  padding: var(--bs-card-img-overlay-padding);\n  border-radius: var(--bs-card-inner-border-radius);\n}\n\n.card-img,\n.card-img-top,\n.card-img-bottom {\n  width: 100%;\n}\n\n.card-img,\n.card-img-top {\n  border-top-left-radius: var(--bs-card-inner-border-radius);\n  border-top-right-radius: var(--bs-card-inner-border-radius);\n}\n\n.card-img,\n.card-img-bottom {\n  border-bottom-right-radius: var(--bs-card-inner-border-radius);\n  border-bottom-left-radius: var(--bs-card-inner-border-radius);\n}\n\n.card-group > .card {\n  margin-bottom: var(--bs-card-group-margin);\n}\n@media (min-width: 576px) {\n  .card-group {\n    display: flex;\n    flex-flow: row wrap;\n  }\n  .card-group > .card {\n    flex: 1 0 0%;\n    margin-bottom: 0;\n  }\n  .card-group > .card + .card {\n    margin-left: 0;\n    border-left: 0;\n  }\n  .card-group > .card:not(:last-child) {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n  }\n  .card-group > .card:not(:last-child) .card-img-top,\n.card-group > .card:not(:last-child) .card-header {\n    border-top-right-radius: 0;\n  }\n  .card-group > .card:not(:last-child) .card-img-bottom,\n.card-group > .card:not(:last-child) .card-footer {\n    border-bottom-right-radius: 0;\n  }\n  .card-group > .card:not(:first-child) {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n  }\n  .card-group > .card:not(:first-child) .card-img-top,\n.card-group > .card:not(:first-child) .card-header {\n    border-top-left-radius: 0;\n  }\n  .card-group > .card:not(:first-child) .card-img-bottom,\n.card-group > .card:not(:first-child) .card-footer {\n    border-bottom-left-radius: 0;\n  }\n}\n\n.accordion {\n  --bs-accordion-color: #212529;\n  --bs-accordion-bg: #fff;\n  --bs-accordion-transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, border-radius 0.15s ease;\n  --bs-accordion-border-color: var(--bs-border-color);\n  --bs-accordion-border-width: 1px;\n  --bs-accordion-border-radius: 0.375rem;\n  --bs-accordion-inner-border-radius: calc(0.375rem - 1px);\n  --bs-accordion-btn-padding-x: 1.25rem;\n  --bs-accordion-btn-padding-y: 1rem;\n  --bs-accordion-btn-color: #212529;\n  --bs-accordion-btn-bg: var(--bs-accordion-bg);\n  --bs-accordion-btn-icon: url(" + ___CSS_LOADER_URL_REPLACEMENT_11___ + ");\n  --bs-accordion-btn-icon-width: 1.25rem;\n  --bs-accordion-btn-icon-transform: rotate(-180deg);\n  --bs-accordion-btn-icon-transition: transform 0.2s ease-in-out;\n  --bs-accordion-btn-active-icon: url(" + ___CSS_LOADER_URL_REPLACEMENT_12___ + ");\n  --bs-accordion-btn-focus-border-color: #86b7fe;\n  --bs-accordion-btn-focus-box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);\n  --bs-accordion-body-padding-x: 1.25rem;\n  --bs-accordion-body-padding-y: 1rem;\n  --bs-accordion-active-color: #0c63e4;\n  --bs-accordion-active-bg: #e7f1ff;\n}\n\n.accordion-button {\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n  padding: var(--bs-accordion-btn-padding-y) var(--bs-accordion-btn-padding-x);\n  font-size: 1rem;\n  color: var(--bs-accordion-btn-color);\n  text-align: left;\n  background-color: var(--bs-accordion-btn-bg);\n  border: 0;\n  border-radius: 0;\n  overflow-anchor: none;\n  transition: var(--bs-accordion-transition);\n}\n@media (prefers-reduced-motion: reduce) {\n  .accordion-button {\n    transition: none;\n  }\n}\n.accordion-button:not(.collapsed) {\n  color: var(--bs-accordion-active-color);\n  background-color: var(--bs-accordion-active-bg);\n  box-shadow: inset 0 calc(-1 * var(--bs-accordion-border-width)) 0 var(--bs-accordion-border-color);\n}\n.accordion-button:not(.collapsed)::after {\n  background-image: var(--bs-accordion-btn-active-icon);\n  transform: var(--bs-accordion-btn-icon-transform);\n}\n.accordion-button::after {\n  flex-shrink: 0;\n  width: var(--bs-accordion-btn-icon-width);\n  height: var(--bs-accordion-btn-icon-width);\n  margin-left: auto;\n  content: \"\";\n  background-image: var(--bs-accordion-btn-icon);\n  background-repeat: no-repeat;\n  background-size: var(--bs-accordion-btn-icon-width);\n  transition: var(--bs-accordion-btn-icon-transition);\n}\n@media (prefers-reduced-motion: reduce) {\n  .accordion-button::after {\n    transition: none;\n  }\n}\n.accordion-button:hover {\n  z-index: 2;\n}\n.accordion-button:focus {\n  z-index: 3;\n  border-color: var(--bs-accordion-btn-focus-border-color);\n  outline: 0;\n  box-shadow: var(--bs-accordion-btn-focus-box-shadow);\n}\n\n.accordion-header {\n  margin-bottom: 0;\n}\n\n.accordion-item {\n  color: var(--bs-accordion-color);\n  background-color: var(--bs-accordion-bg);\n  border: var(--bs-accordion-border-width) solid var(--bs-accordion-border-color);\n}\n.accordion-item:first-of-type {\n  border-top-left-radius: var(--bs-accordion-border-radius);\n  border-top-right-radius: var(--bs-accordion-border-radius);\n}\n.accordion-item:first-of-type .accordion-button {\n  border-top-left-radius: var(--bs-accordion-inner-border-radius);\n  border-top-right-radius: var(--bs-accordion-inner-border-radius);\n}\n.accordion-item:not(:first-of-type) {\n  border-top: 0;\n}\n.accordion-item:last-of-type {\n  border-bottom-right-radius: var(--bs-accordion-border-radius);\n  border-bottom-left-radius: var(--bs-accordion-border-radius);\n}\n.accordion-item:last-of-type .accordion-button.collapsed {\n  border-bottom-right-radius: var(--bs-accordion-inner-border-radius);\n  border-bottom-left-radius: var(--bs-accordion-inner-border-radius);\n}\n.accordion-item:last-of-type .accordion-collapse {\n  border-bottom-right-radius: var(--bs-accordion-border-radius);\n  border-bottom-left-radius: var(--bs-accordion-border-radius);\n}\n\n.accordion-body {\n  padding: var(--bs-accordion-body-padding-y) var(--bs-accordion-body-padding-x);\n}\n\n.accordion-flush .accordion-collapse {\n  border-width: 0;\n}\n.accordion-flush .accordion-item {\n  border-right: 0;\n  border-left: 0;\n  border-radius: 0;\n}\n.accordion-flush .accordion-item:first-child {\n  border-top: 0;\n}\n.accordion-flush .accordion-item:last-child {\n  border-bottom: 0;\n}\n.accordion-flush .accordion-item .accordion-button, .accordion-flush .accordion-item .accordion-button.collapsed {\n  border-radius: 0;\n}\n\n.breadcrumb {\n  --bs-breadcrumb-padding-x: 0;\n  --bs-breadcrumb-padding-y: 0;\n  --bs-breadcrumb-margin-bottom: 1rem;\n  --bs-breadcrumb-bg: ;\n  --bs-breadcrumb-border-radius: ;\n  --bs-breadcrumb-divider-color: #6c757d;\n  --bs-breadcrumb-item-padding-x: 0.5rem;\n  --bs-breadcrumb-item-active-color: #6c757d;\n  display: flex;\n  flex-wrap: wrap;\n  padding: var(--bs-breadcrumb-padding-y) var(--bs-breadcrumb-padding-x);\n  margin-bottom: var(--bs-breadcrumb-margin-bottom);\n  font-size: var(--bs-breadcrumb-font-size);\n  list-style: none;\n  background-color: var(--bs-breadcrumb-bg);\n  border-radius: var(--bs-breadcrumb-border-radius);\n}\n\n.breadcrumb-item + .breadcrumb-item {\n  padding-left: var(--bs-breadcrumb-item-padding-x);\n}\n.breadcrumb-item + .breadcrumb-item::before {\n  float: left;\n  padding-right: var(--bs-breadcrumb-item-padding-x);\n  color: var(--bs-breadcrumb-divider-color);\n  content: var(--bs-breadcrumb-divider, \"/\") /* rtl: var(--bs-breadcrumb-divider, \"/\") */;\n}\n.breadcrumb-item.active {\n  color: var(--bs-breadcrumb-item-active-color);\n}\n\n.pagination {\n  --bs-pagination-padding-x: 0.75rem;\n  --bs-pagination-padding-y: 0.375rem;\n  --bs-pagination-font-size: 1rem;\n  --bs-pagination-color: var(--bs-link-color);\n  --bs-pagination-bg: #fff;\n  --bs-pagination-border-width: 1px;\n  --bs-pagination-border-color: #dee2e6;\n  --bs-pagination-border-radius: 0.375rem;\n  --bs-pagination-hover-color: var(--bs-link-hover-color);\n  --bs-pagination-hover-bg: #e9ecef;\n  --bs-pagination-hover-border-color: #dee2e6;\n  --bs-pagination-focus-color: var(--bs-link-hover-color);\n  --bs-pagination-focus-bg: #e9ecef;\n  --bs-pagination-focus-box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);\n  --bs-pagination-active-color: #fff;\n  --bs-pagination-active-bg: #0d6efd;\n  --bs-pagination-active-border-color: #0d6efd;\n  --bs-pagination-disabled-color: #6c757d;\n  --bs-pagination-disabled-bg: #fff;\n  --bs-pagination-disabled-border-color: #dee2e6;\n  display: flex;\n  padding-left: 0;\n  list-style: none;\n}\n\n.page-link {\n  position: relative;\n  display: block;\n  padding: var(--bs-pagination-padding-y) var(--bs-pagination-padding-x);\n  font-size: var(--bs-pagination-font-size);\n  color: var(--bs-pagination-color);\n  text-decoration: none;\n  background-color: var(--bs-pagination-bg);\n  border: var(--bs-pagination-border-width) solid var(--bs-pagination-border-color);\n  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n  .page-link {\n    transition: none;\n  }\n}\n.page-link:hover {\n  z-index: 2;\n  color: var(--bs-pagination-hover-color);\n  background-color: var(--bs-pagination-hover-bg);\n  border-color: var(--bs-pagination-hover-border-color);\n}\n.page-link:focus {\n  z-index: 3;\n  color: var(--bs-pagination-focus-color);\n  background-color: var(--bs-pagination-focus-bg);\n  outline: 0;\n  box-shadow: var(--bs-pagination-focus-box-shadow);\n}\n.page-link.active, .active > .page-link {\n  z-index: 3;\n  color: var(--bs-pagination-active-color);\n  background-color: var(--bs-pagination-active-bg);\n  border-color: var(--bs-pagination-active-border-color);\n}\n.page-link.disabled, .disabled > .page-link {\n  color: var(--bs-pagination-disabled-color);\n  pointer-events: none;\n  background-color: var(--bs-pagination-disabled-bg);\n  border-color: var(--bs-pagination-disabled-border-color);\n}\n\n.page-item:not(:first-child) .page-link {\n  margin-left: -1px;\n}\n.page-item:first-child .page-link {\n  border-top-left-radius: var(--bs-pagination-border-radius);\n  border-bottom-left-radius: var(--bs-pagination-border-radius);\n}\n.page-item:last-child .page-link {\n  border-top-right-radius: var(--bs-pagination-border-radius);\n  border-bottom-right-radius: var(--bs-pagination-border-radius);\n}\n\n.pagination-lg {\n  --bs-pagination-padding-x: 1.5rem;\n  --bs-pagination-padding-y: 0.75rem;\n  --bs-pagination-font-size: 1.25rem;\n  --bs-pagination-border-radius: 0.5rem;\n}\n\n.pagination-sm {\n  --bs-pagination-padding-x: 0.5rem;\n  --bs-pagination-padding-y: 0.25rem;\n  --bs-pagination-font-size: 0.875rem;\n  --bs-pagination-border-radius: 0.25rem;\n}\n\n.badge {\n  --bs-badge-padding-x: 0.65em;\n  --bs-badge-padding-y: 0.35em;\n  --bs-badge-font-size: 0.75em;\n  --bs-badge-font-weight: 700;\n  --bs-badge-color: #fff;\n  --bs-badge-border-radius: 0.375rem;\n  display: inline-block;\n  padding: var(--bs-badge-padding-y) var(--bs-badge-padding-x);\n  font-size: var(--bs-badge-font-size);\n  font-weight: var(--bs-badge-font-weight);\n  line-height: 1;\n  color: var(--bs-badge-color);\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: var(--bs-badge-border-radius);\n}\n.badge:empty {\n  display: none;\n}\n\n.btn .badge {\n  position: relative;\n  top: -1px;\n}\n\n.alert {\n  --bs-alert-bg: transparent;\n  --bs-alert-padding-x: 1rem;\n  --bs-alert-padding-y: 1rem;\n  --bs-alert-margin-bottom: 1rem;\n  --bs-alert-color: inherit;\n  --bs-alert-border-color: transparent;\n  --bs-alert-border: 1px solid var(--bs-alert-border-color);\n  --bs-alert-border-radius: 0.375rem;\n  position: relative;\n  padding: var(--bs-alert-padding-y) var(--bs-alert-padding-x);\n  margin-bottom: var(--bs-alert-margin-bottom);\n  color: var(--bs-alert-color);\n  background-color: var(--bs-alert-bg);\n  border: var(--bs-alert-border);\n  border-radius: var(--bs-alert-border-radius);\n}\n\n.alert-heading {\n  color: inherit;\n}\n\n.alert-link {\n  font-weight: 700;\n}\n\n.alert-dismissible {\n  padding-right: 3rem;\n}\n.alert-dismissible .btn-close {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 2;\n  padding: 1.25rem 1rem;\n}\n\n.alert-primary {\n  --bs-alert-color: #084298;\n  --bs-alert-bg: #cfe2ff;\n  --bs-alert-border-color: #b6d4fe;\n}\n.alert-primary .alert-link {\n  color: #06357a;\n}\n\n.alert-secondary {\n  --bs-alert-color: #41464b;\n  --bs-alert-bg: #e2e3e5;\n  --bs-alert-border-color: #d3d6d8;\n}\n.alert-secondary .alert-link {\n  color: #34383c;\n}\n\n.alert-success {\n  --bs-alert-color: #0f5132;\n  --bs-alert-bg: #d1e7dd;\n  --bs-alert-border-color: #badbcc;\n}\n.alert-success .alert-link {\n  color: #0c4128;\n}\n\n.alert-info {\n  --bs-alert-color: #055160;\n  --bs-alert-bg: #cff4fc;\n  --bs-alert-border-color: #b6effb;\n}\n.alert-info .alert-link {\n  color: #04414d;\n}\n\n.alert-warning {\n  --bs-alert-color: #664d03;\n  --bs-alert-bg: #fff3cd;\n  --bs-alert-border-color: #ffecb5;\n}\n.alert-warning .alert-link {\n  color: #523e02;\n}\n\n.alert-danger {\n  --bs-alert-color: #842029;\n  --bs-alert-bg: #f8d7da;\n  --bs-alert-border-color: #f5c2c7;\n}\n.alert-danger .alert-link {\n  color: #6a1a21;\n}\n\n.alert-light {\n  --bs-alert-color: #636464;\n  --bs-alert-bg: #fefefe;\n  --bs-alert-border-color: #fdfdfe;\n}\n.alert-light .alert-link {\n  color: #4f5050;\n}\n\n.alert-dark {\n  --bs-alert-color: #141619;\n  --bs-alert-bg: #d3d3d4;\n  --bs-alert-border-color: #bcbebf;\n}\n.alert-dark .alert-link {\n  color: #101214;\n}\n\n@keyframes progress-bar-stripes {\n  0% {\n    background-position-x: 1rem;\n  }\n}\n.progress {\n  --bs-progress-height: 1rem;\n  --bs-progress-font-size: 0.75rem;\n  --bs-progress-bg: #e9ecef;\n  --bs-progress-border-radius: 0.375rem;\n  --bs-progress-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);\n  --bs-progress-bar-color: #fff;\n  --bs-progress-bar-bg: #0d6efd;\n  --bs-progress-bar-transition: width 0.6s ease;\n  display: flex;\n  height: var(--bs-progress-height);\n  overflow: hidden;\n  font-size: var(--bs-progress-font-size);\n  background-color: var(--bs-progress-bg);\n  border-radius: var(--bs-progress-border-radius);\n}\n\n.progress-bar {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  overflow: hidden;\n  color: var(--bs-progress-bar-color);\n  text-align: center;\n  white-space: nowrap;\n  background-color: var(--bs-progress-bar-bg);\n  transition: var(--bs-progress-bar-transition);\n}\n@media (prefers-reduced-motion: reduce) {\n  .progress-bar {\n    transition: none;\n  }\n}\n\n.progress-bar-striped {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: var(--bs-progress-height) var(--bs-progress-height);\n}\n\n.progress-bar-animated {\n  animation: 1s linear infinite progress-bar-stripes;\n}\n@media (prefers-reduced-motion: reduce) {\n  .progress-bar-animated {\n    animation: none;\n  }\n}\n\n.list-group {\n  --bs-list-group-color: #212529;\n  --bs-list-group-bg: #fff;\n  --bs-list-group-border-color: rgba(0, 0, 0, 0.125);\n  --bs-list-group-border-width: 1px;\n  --bs-list-group-border-radius: 0.375rem;\n  --bs-list-group-item-padding-x: 1rem;\n  --bs-list-group-item-padding-y: 0.5rem;\n  --bs-list-group-action-color: #495057;\n  --bs-list-group-action-hover-color: #495057;\n  --bs-list-group-action-hover-bg: #f8f9fa;\n  --bs-list-group-action-active-color: #212529;\n  --bs-list-group-action-active-bg: #e9ecef;\n  --bs-list-group-disabled-color: #6c757d;\n  --bs-list-group-disabled-bg: #fff;\n  --bs-list-group-active-color: #fff;\n  --bs-list-group-active-bg: #0d6efd;\n  --bs-list-group-active-border-color: #0d6efd;\n  display: flex;\n  flex-direction: column;\n  padding-left: 0;\n  margin-bottom: 0;\n  border-radius: var(--bs-list-group-border-radius);\n}\n\n.list-group-numbered {\n  list-style-type: none;\n  counter-reset: section;\n}\n.list-group-numbered > .list-group-item::before {\n  content: counters(section, \".\") \". \";\n  counter-increment: section;\n}\n\n.list-group-item-action {\n  width: 100%;\n  color: var(--bs-list-group-action-color);\n  text-align: inherit;\n}\n.list-group-item-action:hover, .list-group-item-action:focus {\n  z-index: 1;\n  color: var(--bs-list-group-action-hover-color);\n  text-decoration: none;\n  background-color: var(--bs-list-group-action-hover-bg);\n}\n.list-group-item-action:active {\n  color: var(--bs-list-group-action-active-color);\n  background-color: var(--bs-list-group-action-active-bg);\n}\n\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: var(--bs-list-group-item-padding-y) var(--bs-list-group-item-padding-x);\n  color: var(--bs-list-group-color);\n  text-decoration: none;\n  background-color: var(--bs-list-group-bg);\n  border: var(--bs-list-group-border-width) solid var(--bs-list-group-border-color);\n}\n.list-group-item:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.list-group-item:last-child {\n  border-bottom-right-radius: inherit;\n  border-bottom-left-radius: inherit;\n}\n.list-group-item.disabled, .list-group-item:disabled {\n  color: var(--bs-list-group-disabled-color);\n  pointer-events: none;\n  background-color: var(--bs-list-group-disabled-bg);\n}\n.list-group-item.active {\n  z-index: 2;\n  color: var(--bs-list-group-active-color);\n  background-color: var(--bs-list-group-active-bg);\n  border-color: var(--bs-list-group-active-border-color);\n}\n.list-group-item + .list-group-item {\n  border-top-width: 0;\n}\n.list-group-item + .list-group-item.active {\n  margin-top: calc(-1 * var(--bs-list-group-border-width));\n  border-top-width: var(--bs-list-group-border-width);\n}\n\n.list-group-horizontal {\n  flex-direction: row;\n}\n.list-group-horizontal > .list-group-item:first-child:not(:last-child) {\n  border-bottom-left-radius: var(--bs-list-group-border-radius);\n  border-top-right-radius: 0;\n}\n.list-group-horizontal > .list-group-item:last-child:not(:first-child) {\n  border-top-right-radius: var(--bs-list-group-border-radius);\n  border-bottom-left-radius: 0;\n}\n.list-group-horizontal > .list-group-item.active {\n  margin-top: 0;\n}\n.list-group-horizontal > .list-group-item + .list-group-item {\n  border-top-width: var(--bs-list-group-border-width);\n  border-left-width: 0;\n}\n.list-group-horizontal > .list-group-item + .list-group-item.active {\n  margin-left: calc(-1 * var(--bs-list-group-border-width));\n  border-left-width: var(--bs-list-group-border-width);\n}\n\n@media (min-width: 576px) {\n  .list-group-horizontal-sm {\n    flex-direction: row;\n  }\n  .list-group-horizontal-sm > .list-group-item:first-child:not(:last-child) {\n    border-bottom-left-radius: var(--bs-list-group-border-radius);\n    border-top-right-radius: 0;\n  }\n  .list-group-horizontal-sm > .list-group-item:last-child:not(:first-child) {\n    border-top-right-radius: var(--bs-list-group-border-radius);\n    border-bottom-left-radius: 0;\n  }\n  .list-group-horizontal-sm > .list-group-item.active {\n    margin-top: 0;\n  }\n  .list-group-horizontal-sm > .list-group-item + .list-group-item {\n    border-top-width: var(--bs-list-group-border-width);\n    border-left-width: 0;\n  }\n  .list-group-horizontal-sm > .list-group-item + .list-group-item.active {\n    margin-left: calc(-1 * var(--bs-list-group-border-width));\n    border-left-width: var(--bs-list-group-border-width);\n  }\n}\n@media (min-width: 768px) {\n  .list-group-horizontal-md {\n    flex-direction: row;\n  }\n  .list-group-horizontal-md > .list-group-item:first-child:not(:last-child) {\n    border-bottom-left-radius: var(--bs-list-group-border-radius);\n    border-top-right-radius: 0;\n  }\n  .list-group-horizontal-md > .list-group-item:last-child:not(:first-child) {\n    border-top-right-radius: var(--bs-list-group-border-radius);\n    border-bottom-left-radius: 0;\n  }\n  .list-group-horizontal-md > .list-group-item.active {\n    margin-top: 0;\n  }\n  .list-group-horizontal-md > .list-group-item + .list-group-item {\n    border-top-width: var(--bs-list-group-border-width);\n    border-left-width: 0;\n  }\n  .list-group-horizontal-md > .list-group-item + .list-group-item.active {\n    margin-left: calc(-1 * var(--bs-list-group-border-width));\n    border-left-width: var(--bs-list-group-border-width);\n  }\n}\n@media (min-width: 992px) {\n  .list-group-horizontal-lg {\n    flex-direction: row;\n  }\n  .list-group-horizontal-lg > .list-group-item:first-child:not(:last-child) {\n    border-bottom-left-radius: var(--bs-list-group-border-radius);\n    border-top-right-radius: 0;\n  }\n  .list-group-horizontal-lg > .list-group-item:last-child:not(:first-child) {\n    border-top-right-radius: var(--bs-list-group-border-radius);\n    border-bottom-left-radius: 0;\n  }\n  .list-group-horizontal-lg > .list-group-item.active {\n    margin-top: 0;\n  }\n  .list-group-horizontal-lg > .list-group-item + .list-group-item {\n    border-top-width: var(--bs-list-group-border-width);\n    border-left-width: 0;\n  }\n  .list-group-horizontal-lg > .list-group-item + .list-group-item.active {\n    margin-left: calc(-1 * var(--bs-list-group-border-width));\n    border-left-width: var(--bs-list-group-border-width);\n  }\n}\n@media (min-width: 1200px) {\n  .list-group-horizontal-xl {\n    flex-direction: row;\n  }\n  .list-group-horizontal-xl > .list-group-item:first-child:not(:last-child) {\n    border-bottom-left-radius: var(--bs-list-group-border-radius);\n    border-top-right-radius: 0;\n  }\n  .list-group-horizontal-xl > .list-group-item:last-child:not(:first-child) {\n    border-top-right-radius: var(--bs-list-group-border-radius);\n    border-bottom-left-radius: 0;\n  }\n  .list-group-horizontal-xl > .list-group-item.active {\n    margin-top: 0;\n  }\n  .list-group-horizontal-xl > .list-group-item + .list-group-item {\n    border-top-width: var(--bs-list-group-border-width);\n    border-left-width: 0;\n  }\n  .list-group-horizontal-xl > .list-group-item + .list-group-item.active {\n    margin-left: calc(-1 * var(--bs-list-group-border-width));\n    border-left-width: var(--bs-list-group-border-width);\n  }\n}\n@media (min-width: 1400px) {\n  .list-group-horizontal-xxl {\n    flex-direction: row;\n  }\n  .list-group-horizontal-xxl > .list-group-item:first-child:not(:last-child) {\n    border-bottom-left-radius: var(--bs-list-group-border-radius);\n    border-top-right-radius: 0;\n  }\n  .list-group-horizontal-xxl > .list-group-item:last-child:not(:first-child) {\n    border-top-right-radius: var(--bs-list-group-border-radius);\n    border-bottom-left-radius: 0;\n  }\n  .list-group-horizontal-xxl > .list-group-item.active {\n    margin-top: 0;\n  }\n  .list-group-horizontal-xxl > .list-group-item + .list-group-item {\n    border-top-width: var(--bs-list-group-border-width);\n    border-left-width: 0;\n  }\n  .list-group-horizontal-xxl > .list-group-item + .list-group-item.active {\n    margin-left: calc(-1 * var(--bs-list-group-border-width));\n    border-left-width: var(--bs-list-group-border-width);\n  }\n}\n.list-group-flush {\n  border-radius: 0;\n}\n.list-group-flush > .list-group-item {\n  border-width: 0 0 var(--bs-list-group-border-width);\n}\n.list-group-flush > .list-group-item:last-child {\n  border-bottom-width: 0;\n}\n\n.list-group-item-primary {\n  color: #084298;\n  background-color: #cfe2ff;\n}\n.list-group-item-primary.list-group-item-action:hover, .list-group-item-primary.list-group-item-action:focus {\n  color: #084298;\n  background-color: #bacbe6;\n}\n.list-group-item-primary.list-group-item-action.active {\n  color: #fff;\n  background-color: #084298;\n  border-color: #084298;\n}\n\n.list-group-item-secondary {\n  color: #41464b;\n  background-color: #e2e3e5;\n}\n.list-group-item-secondary.list-group-item-action:hover, .list-group-item-secondary.list-group-item-action:focus {\n  color: #41464b;\n  background-color: #cbccce;\n}\n.list-group-item-secondary.list-group-item-action.active {\n  color: #fff;\n  background-color: #41464b;\n  border-color: #41464b;\n}\n\n.list-group-item-success {\n  color: #0f5132;\n  background-color: #d1e7dd;\n}\n.list-group-item-success.list-group-item-action:hover, .list-group-item-success.list-group-item-action:focus {\n  color: #0f5132;\n  background-color: #bcd0c7;\n}\n.list-group-item-success.list-group-item-action.active {\n  color: #fff;\n  background-color: #0f5132;\n  border-color: #0f5132;\n}\n\n.list-group-item-info {\n  color: #055160;\n  background-color: #cff4fc;\n}\n.list-group-item-info.list-group-item-action:hover, .list-group-item-info.list-group-item-action:focus {\n  color: #055160;\n  background-color: #badce3;\n}\n.list-group-item-info.list-group-item-action.active {\n  color: #fff;\n  background-color: #055160;\n  border-color: #055160;\n}\n\n.list-group-item-warning {\n  color: #664d03;\n  background-color: #fff3cd;\n}\n.list-group-item-warning.list-group-item-action:hover, .list-group-item-warning.list-group-item-action:focus {\n  color: #664d03;\n  background-color: #e6dbb9;\n}\n.list-group-item-warning.list-group-item-action.active {\n  color: #fff;\n  background-color: #664d03;\n  border-color: #664d03;\n}\n\n.list-group-item-danger {\n  color: #842029;\n  background-color: #f8d7da;\n}\n.list-group-item-danger.list-group-item-action:hover, .list-group-item-danger.list-group-item-action:focus {\n  color: #842029;\n  background-color: #dfc2c4;\n}\n.list-group-item-danger.list-group-item-action.active {\n  color: #fff;\n  background-color: #842029;\n  border-color: #842029;\n}\n\n.list-group-item-light {\n  color: #636464;\n  background-color: #fefefe;\n}\n.list-group-item-light.list-group-item-action:hover, .list-group-item-light.list-group-item-action:focus {\n  color: #636464;\n  background-color: #e5e5e5;\n}\n.list-group-item-light.list-group-item-action.active {\n  color: #fff;\n  background-color: #636464;\n  border-color: #636464;\n}\n\n.list-group-item-dark {\n  color: #141619;\n  background-color: #d3d3d4;\n}\n.list-group-item-dark.list-group-item-action:hover, .list-group-item-dark.list-group-item-action:focus {\n  color: #141619;\n  background-color: #bebebf;\n}\n.list-group-item-dark.list-group-item-action.active {\n  color: #fff;\n  background-color: #141619;\n  border-color: #141619;\n}\n\n.btn-close {\n  box-sizing: content-box;\n  width: 1em;\n  height: 1em;\n  padding: 0.25em 0.25em;\n  color: #000;\n  background: transparent url(" + ___CSS_LOADER_URL_REPLACEMENT_13___ + ") center/1em auto no-repeat;\n  border: 0;\n  border-radius: 0.375rem;\n  opacity: 0.5;\n}\n.btn-close:hover {\n  color: #000;\n  text-decoration: none;\n  opacity: 0.75;\n}\n.btn-close:focus {\n  outline: 0;\n  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);\n  opacity: 1;\n}\n.btn-close:disabled, .btn-close.disabled {\n  pointer-events: none;\n  user-select: none;\n  opacity: 0.25;\n}\n\n.btn-close-white {\n  filter: invert(1) grayscale(100%) brightness(200%);\n}\n\n.toast {\n  --bs-toast-zindex: 1090;\n  --bs-toast-padding-x: 0.75rem;\n  --bs-toast-padding-y: 0.5rem;\n  --bs-toast-spacing: 1.5rem;\n  --bs-toast-max-width: 350px;\n  --bs-toast-font-size: 0.875rem;\n  --bs-toast-color: ;\n  --bs-toast-bg: rgba(255, 255, 255, 0.85);\n  --bs-toast-border-width: 1px;\n  --bs-toast-border-color: var(--bs-border-color-translucent);\n  --bs-toast-border-radius: 0.375rem;\n  --bs-toast-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);\n  --bs-toast-header-color: #6c757d;\n  --bs-toast-header-bg: rgba(255, 255, 255, 0.85);\n  --bs-toast-header-border-color: rgba(0, 0, 0, 0.05);\n  width: var(--bs-toast-max-width);\n  max-width: 100%;\n  font-size: var(--bs-toast-font-size);\n  color: var(--bs-toast-color);\n  pointer-events: auto;\n  background-color: var(--bs-toast-bg);\n  background-clip: padding-box;\n  border: var(--bs-toast-border-width) solid var(--bs-toast-border-color);\n  box-shadow: var(--bs-toast-box-shadow);\n  border-radius: var(--bs-toast-border-radius);\n}\n.toast.showing {\n  opacity: 0;\n}\n.toast:not(.show) {\n  display: none;\n}\n\n.toast-container {\n  --bs-toast-zindex: 1090;\n  position: absolute;\n  z-index: var(--bs-toast-zindex);\n  width: max-content;\n  max-width: 100%;\n  pointer-events: none;\n}\n.toast-container > :not(:last-child) {\n  margin-bottom: var(--bs-toast-spacing);\n}\n\n.toast-header {\n  display: flex;\n  align-items: center;\n  padding: var(--bs-toast-padding-y) var(--bs-toast-padding-x);\n  color: var(--bs-toast-header-color);\n  background-color: var(--bs-toast-header-bg);\n  background-clip: padding-box;\n  border-bottom: var(--bs-toast-border-width) solid var(--bs-toast-header-border-color);\n  border-top-left-radius: calc(var(--bs-toast-border-radius) - var(--bs-toast-border-width));\n  border-top-right-radius: calc(var(--bs-toast-border-radius) - var(--bs-toast-border-width));\n}\n.toast-header .btn-close {\n  margin-right: calc(-0.5 * var(--bs-toast-padding-x));\n  margin-left: var(--bs-toast-padding-x);\n}\n\n.toast-body {\n  padding: var(--bs-toast-padding-x);\n  word-wrap: break-word;\n}\n\n.modal {\n  --bs-modal-zindex: 1055;\n  --bs-modal-width: 500px;\n  --bs-modal-padding: 1rem;\n  --bs-modal-margin: 0.5rem;\n  --bs-modal-color: ;\n  --bs-modal-bg: #fff;\n  --bs-modal-border-color: var(--bs-border-color-translucent);\n  --bs-modal-border-width: 1px;\n  --bs-modal-border-radius: 0.5rem;\n  --bs-modal-box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);\n  --bs-modal-inner-border-radius: calc(0.5rem - 1px);\n  --bs-modal-header-padding-x: 1rem;\n  --bs-modal-header-padding-y: 1rem;\n  --bs-modal-header-padding: 1rem 1rem;\n  --bs-modal-header-border-color: var(--bs-border-color);\n  --bs-modal-header-border-width: 1px;\n  --bs-modal-title-line-height: 1.5;\n  --bs-modal-footer-gap: 0.5rem;\n  --bs-modal-footer-bg: ;\n  --bs-modal-footer-border-color: var(--bs-border-color);\n  --bs-modal-footer-border-width: 1px;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: var(--bs-modal-zindex);\n  display: none;\n  width: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n  outline: 0;\n}\n\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: var(--bs-modal-margin);\n  pointer-events: none;\n}\n.modal.fade .modal-dialog {\n  transition: transform 0.3s ease-out;\n  transform: translate(0, -50px);\n}\n@media (prefers-reduced-motion: reduce) {\n  .modal.fade .modal-dialog {\n    transition: none;\n  }\n}\n.modal.show .modal-dialog {\n  transform: none;\n}\n.modal.modal-static .modal-dialog {\n  transform: scale(1.02);\n}\n\n.modal-dialog-scrollable {\n  height: calc(100% - var(--bs-modal-margin) * 2);\n}\n.modal-dialog-scrollable .modal-content {\n  max-height: 100%;\n  overflow: hidden;\n}\n.modal-dialog-scrollable .modal-body {\n  overflow-y: auto;\n}\n\n.modal-dialog-centered {\n  display: flex;\n  align-items: center;\n  min-height: calc(100% - var(--bs-modal-margin) * 2);\n}\n\n.modal-content {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  color: var(--bs-modal-color);\n  pointer-events: auto;\n  background-color: var(--bs-modal-bg);\n  background-clip: padding-box;\n  border: var(--bs-modal-border-width) solid var(--bs-modal-border-color);\n  border-radius: var(--bs-modal-border-radius);\n  outline: 0;\n}\n\n.modal-backdrop {\n  --bs-backdrop-zindex: 1050;\n  --bs-backdrop-bg: #000;\n  --bs-backdrop-opacity: 0.5;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: var(--bs-backdrop-zindex);\n  width: 100vw;\n  height: 100vh;\n  background-color: var(--bs-backdrop-bg);\n}\n.modal-backdrop.fade {\n  opacity: 0;\n}\n.modal-backdrop.show {\n  opacity: var(--bs-backdrop-opacity);\n}\n\n.modal-header {\n  display: flex;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: space-between;\n  padding: var(--bs-modal-header-padding);\n  border-bottom: var(--bs-modal-header-border-width) solid var(--bs-modal-header-border-color);\n  border-top-left-radius: var(--bs-modal-inner-border-radius);\n  border-top-right-radius: var(--bs-modal-inner-border-radius);\n}\n.modal-header .btn-close {\n  padding: calc(var(--bs-modal-header-padding-y) * 0.5) calc(var(--bs-modal-header-padding-x) * 0.5);\n  margin: calc(-0.5 * var(--bs-modal-header-padding-y)) calc(-0.5 * var(--bs-modal-header-padding-x)) calc(-0.5 * var(--bs-modal-header-padding-y)) auto;\n}\n\n.modal-title {\n  margin-bottom: 0;\n  line-height: var(--bs-modal-title-line-height);\n}\n\n.modal-body {\n  position: relative;\n  flex: 1 1 auto;\n  padding: var(--bs-modal-padding);\n}\n\n.modal-footer {\n  display: flex;\n  flex-shrink: 0;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: flex-end;\n  padding: calc(var(--bs-modal-padding) - var(--bs-modal-footer-gap) * 0.5);\n  background-color: var(--bs-modal-footer-bg);\n  border-top: var(--bs-modal-footer-border-width) solid var(--bs-modal-footer-border-color);\n  border-bottom-right-radius: var(--bs-modal-inner-border-radius);\n  border-bottom-left-radius: var(--bs-modal-inner-border-radius);\n}\n.modal-footer > * {\n  margin: calc(var(--bs-modal-footer-gap) * 0.5);\n}\n\n@media (min-width: 576px) {\n  .modal {\n    --bs-modal-margin: 1.75rem;\n    --bs-modal-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);\n  }\n  .modal-dialog {\n    max-width: var(--bs-modal-width);\n    margin-right: auto;\n    margin-left: auto;\n  }\n  .modal-sm {\n    --bs-modal-width: 300px;\n  }\n}\n@media (min-width: 992px) {\n  .modal-lg,\n.modal-xl {\n    --bs-modal-width: 800px;\n  }\n}\n@media (min-width: 1200px) {\n  .modal-xl {\n    --bs-modal-width: 1140px;\n  }\n}\n.modal-fullscreen {\n  width: 100vw;\n  max-width: none;\n  height: 100%;\n  margin: 0;\n}\n.modal-fullscreen .modal-content {\n  height: 100%;\n  border: 0;\n  border-radius: 0;\n}\n.modal-fullscreen .modal-header,\n.modal-fullscreen .modal-footer {\n  border-radius: 0;\n}\n.modal-fullscreen .modal-body {\n  overflow-y: auto;\n}\n\n@media (max-width: 575.98px) {\n  .modal-fullscreen-sm-down {\n    width: 100vw;\n    max-width: none;\n    height: 100%;\n    margin: 0;\n  }\n  .modal-fullscreen-sm-down .modal-content {\n    height: 100%;\n    border: 0;\n    border-radius: 0;\n  }\n  .modal-fullscreen-sm-down .modal-header,\n.modal-fullscreen-sm-down .modal-footer {\n    border-radius: 0;\n  }\n  .modal-fullscreen-sm-down .modal-body {\n    overflow-y: auto;\n  }\n}\n@media (max-width: 767.98px) {\n  .modal-fullscreen-md-down {\n    width: 100vw;\n    max-width: none;\n    height: 100%;\n    margin: 0;\n  }\n  .modal-fullscreen-md-down .modal-content {\n    height: 100%;\n    border: 0;\n    border-radius: 0;\n  }\n  .modal-fullscreen-md-down .modal-header,\n.modal-fullscreen-md-down .modal-footer {\n    border-radius: 0;\n  }\n  .modal-fullscreen-md-down .modal-body {\n    overflow-y: auto;\n  }\n}\n@media (max-width: 991.98px) {\n  .modal-fullscreen-lg-down {\n    width: 100vw;\n    max-width: none;\n    height: 100%;\n    margin: 0;\n  }\n  .modal-fullscreen-lg-down .modal-content {\n    height: 100%;\n    border: 0;\n    border-radius: 0;\n  }\n  .modal-fullscreen-lg-down .modal-header,\n.modal-fullscreen-lg-down .modal-footer {\n    border-radius: 0;\n  }\n  .modal-fullscreen-lg-down .modal-body {\n    overflow-y: auto;\n  }\n}\n@media (max-width: 1199.98px) {\n  .modal-fullscreen-xl-down {\n    width: 100vw;\n    max-width: none;\n    height: 100%;\n    margin: 0;\n  }\n  .modal-fullscreen-xl-down .modal-content {\n    height: 100%;\n    border: 0;\n    border-radius: 0;\n  }\n  .modal-fullscreen-xl-down .modal-header,\n.modal-fullscreen-xl-down .modal-footer {\n    border-radius: 0;\n  }\n  .modal-fullscreen-xl-down .modal-body {\n    overflow-y: auto;\n  }\n}\n@media (max-width: 1399.98px) {\n  .modal-fullscreen-xxl-down {\n    width: 100vw;\n    max-width: none;\n    height: 100%;\n    margin: 0;\n  }\n  .modal-fullscreen-xxl-down .modal-content {\n    height: 100%;\n    border: 0;\n    border-radius: 0;\n  }\n  .modal-fullscreen-xxl-down .modal-header,\n.modal-fullscreen-xxl-down .modal-footer {\n    border-radius: 0;\n  }\n  .modal-fullscreen-xxl-down .modal-body {\n    overflow-y: auto;\n  }\n}\n.tooltip {\n  --bs-tooltip-zindex: 1080;\n  --bs-tooltip-max-width: 200px;\n  --bs-tooltip-padding-x: 0.5rem;\n  --bs-tooltip-padding-y: 0.25rem;\n  --bs-tooltip-margin: ;\n  --bs-tooltip-font-size: 0.875rem;\n  --bs-tooltip-color: #fff;\n  --bs-tooltip-bg: #000;\n  --bs-tooltip-border-radius: 0.375rem;\n  --bs-tooltip-opacity: 0.9;\n  --bs-tooltip-arrow-width: 0.8rem;\n  --bs-tooltip-arrow-height: 0.4rem;\n  z-index: var(--bs-tooltip-zindex);\n  display: block;\n  padding: var(--bs-tooltip-arrow-height);\n  margin: var(--bs-tooltip-margin);\n  font-family: var(--bs-font-sans-serif);\n  font-style: normal;\n  font-weight: 400;\n  line-height: 1.5;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  white-space: normal;\n  word-spacing: normal;\n  line-break: auto;\n  font-size: var(--bs-tooltip-font-size);\n  word-wrap: break-word;\n  opacity: 0;\n}\n.tooltip.show {\n  opacity: var(--bs-tooltip-opacity);\n}\n.tooltip .tooltip-arrow {\n  display: block;\n  width: var(--bs-tooltip-arrow-width);\n  height: var(--bs-tooltip-arrow-height);\n}\n.tooltip .tooltip-arrow::before {\n  position: absolute;\n  content: \"\";\n  border-color: transparent;\n  border-style: solid;\n}\n\n.bs-tooltip-top .tooltip-arrow, .bs-tooltip-auto[data-popper-placement^=top] .tooltip-arrow {\n  bottom: 0;\n}\n.bs-tooltip-top .tooltip-arrow::before, .bs-tooltip-auto[data-popper-placement^=top] .tooltip-arrow::before {\n  top: -1px;\n  border-width: var(--bs-tooltip-arrow-height) calc(var(--bs-tooltip-arrow-width) * 0.5) 0;\n  border-top-color: var(--bs-tooltip-bg);\n}\n\n/* rtl:begin:ignore */\n.bs-tooltip-end .tooltip-arrow, .bs-tooltip-auto[data-popper-placement^=right] .tooltip-arrow {\n  left: 0;\n  width: var(--bs-tooltip-arrow-height);\n  height: var(--bs-tooltip-arrow-width);\n}\n.bs-tooltip-end .tooltip-arrow::before, .bs-tooltip-auto[data-popper-placement^=right] .tooltip-arrow::before {\n  right: -1px;\n  border-width: calc(var(--bs-tooltip-arrow-width) * 0.5) var(--bs-tooltip-arrow-height) calc(var(--bs-tooltip-arrow-width) * 0.5) 0;\n  border-right-color: var(--bs-tooltip-bg);\n}\n\n/* rtl:end:ignore */\n.bs-tooltip-bottom .tooltip-arrow, .bs-tooltip-auto[data-popper-placement^=bottom] .tooltip-arrow {\n  top: 0;\n}\n.bs-tooltip-bottom .tooltip-arrow::before, .bs-tooltip-auto[data-popper-placement^=bottom] .tooltip-arrow::before {\n  bottom: -1px;\n  border-width: 0 calc(var(--bs-tooltip-arrow-width) * 0.5) var(--bs-tooltip-arrow-height);\n  border-bottom-color: var(--bs-tooltip-bg);\n}\n\n/* rtl:begin:ignore */\n.bs-tooltip-start .tooltip-arrow, .bs-tooltip-auto[data-popper-placement^=left] .tooltip-arrow {\n  right: 0;\n  width: var(--bs-tooltip-arrow-height);\n  height: var(--bs-tooltip-arrow-width);\n}\n.bs-tooltip-start .tooltip-arrow::before, .bs-tooltip-auto[data-popper-placement^=left] .tooltip-arrow::before {\n  left: -1px;\n  border-width: calc(var(--bs-tooltip-arrow-width) * 0.5) 0 calc(var(--bs-tooltip-arrow-width) * 0.5) var(--bs-tooltip-arrow-height);\n  border-left-color: var(--bs-tooltip-bg);\n}\n\n/* rtl:end:ignore */\n.tooltip-inner {\n  max-width: var(--bs-tooltip-max-width);\n  padding: var(--bs-tooltip-padding-y) var(--bs-tooltip-padding-x);\n  color: var(--bs-tooltip-color);\n  text-align: center;\n  background-color: var(--bs-tooltip-bg);\n  border-radius: var(--bs-tooltip-border-radius);\n}\n\n.popover {\n  --bs-popover-zindex: 1070;\n  --bs-popover-max-width: 276px;\n  --bs-popover-font-size: 0.875rem;\n  --bs-popover-bg: #fff;\n  --bs-popover-border-width: 1px;\n  --bs-popover-border-color: var(--bs-border-color-translucent);\n  --bs-popover-border-radius: 0.5rem;\n  --bs-popover-inner-border-radius: calc(0.5rem - 1px);\n  --bs-popover-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);\n  --bs-popover-header-padding-x: 1rem;\n  --bs-popover-header-padding-y: 0.5rem;\n  --bs-popover-header-font-size: 1rem;\n  --bs-popover-header-color: ;\n  --bs-popover-header-bg: #f0f0f0;\n  --bs-popover-body-padding-x: 1rem;\n  --bs-popover-body-padding-y: 1rem;\n  --bs-popover-body-color: #212529;\n  --bs-popover-arrow-width: 1rem;\n  --bs-popover-arrow-height: 0.5rem;\n  --bs-popover-arrow-border: var(--bs-popover-border-color);\n  z-index: var(--bs-popover-zindex);\n  display: block;\n  max-width: var(--bs-popover-max-width);\n  font-family: var(--bs-font-sans-serif);\n  font-style: normal;\n  font-weight: 400;\n  line-height: 1.5;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  white-space: normal;\n  word-spacing: normal;\n  line-break: auto;\n  font-size: var(--bs-popover-font-size);\n  word-wrap: break-word;\n  background-color: var(--bs-popover-bg);\n  background-clip: padding-box;\n  border: var(--bs-popover-border-width) solid var(--bs-popover-border-color);\n  border-radius: var(--bs-popover-border-radius);\n}\n.popover .popover-arrow {\n  display: block;\n  width: var(--bs-popover-arrow-width);\n  height: var(--bs-popover-arrow-height);\n}\n.popover .popover-arrow::before, .popover .popover-arrow::after {\n  position: absolute;\n  display: block;\n  content: \"\";\n  border-color: transparent;\n  border-style: solid;\n  border-width: 0;\n}\n\n.bs-popover-top > .popover-arrow, .bs-popover-auto[data-popper-placement^=top] > .popover-arrow {\n  bottom: calc(-1 * (var(--bs-popover-arrow-height)) - var(--bs-popover-border-width));\n}\n.bs-popover-top > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=top] > .popover-arrow::before, .bs-popover-top > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=top] > .popover-arrow::after {\n  border-width: var(--bs-popover-arrow-height) calc(var(--bs-popover-arrow-width) * 0.5) 0;\n}\n.bs-popover-top > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=top] > .popover-arrow::before {\n  bottom: 0;\n  border-top-color: var(--bs-popover-arrow-border);\n}\n.bs-popover-top > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=top] > .popover-arrow::after {\n  bottom: var(--bs-popover-border-width);\n  border-top-color: var(--bs-popover-bg);\n}\n\n/* rtl:begin:ignore */\n.bs-popover-end > .popover-arrow, .bs-popover-auto[data-popper-placement^=right] > .popover-arrow {\n  left: calc(-1 * (var(--bs-popover-arrow-height)) - var(--bs-popover-border-width));\n  width: var(--bs-popover-arrow-height);\n  height: var(--bs-popover-arrow-width);\n}\n.bs-popover-end > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=right] > .popover-arrow::before, .bs-popover-end > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=right] > .popover-arrow::after {\n  border-width: calc(var(--bs-popover-arrow-width) * 0.5) var(--bs-popover-arrow-height) calc(var(--bs-popover-arrow-width) * 0.5) 0;\n}\n.bs-popover-end > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=right] > .popover-arrow::before {\n  left: 0;\n  border-right-color: var(--bs-popover-arrow-border);\n}\n.bs-popover-end > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=right] > .popover-arrow::after {\n  left: var(--bs-popover-border-width);\n  border-right-color: var(--bs-popover-bg);\n}\n\n/* rtl:end:ignore */\n.bs-popover-bottom > .popover-arrow, .bs-popover-auto[data-popper-placement^=bottom] > .popover-arrow {\n  top: calc(-1 * (var(--bs-popover-arrow-height)) - var(--bs-popover-border-width));\n}\n.bs-popover-bottom > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=bottom] > .popover-arrow::before, .bs-popover-bottom > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=bottom] > .popover-arrow::after {\n  border-width: 0 calc(var(--bs-popover-arrow-width) * 0.5) var(--bs-popover-arrow-height);\n}\n.bs-popover-bottom > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=bottom] > .popover-arrow::before {\n  top: 0;\n  border-bottom-color: var(--bs-popover-arrow-border);\n}\n.bs-popover-bottom > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=bottom] > .popover-arrow::after {\n  top: var(--bs-popover-border-width);\n  border-bottom-color: var(--bs-popover-bg);\n}\n.bs-popover-bottom .popover-header::before, .bs-popover-auto[data-popper-placement^=bottom] .popover-header::before {\n  position: absolute;\n  top: 0;\n  left: 50%;\n  display: block;\n  width: var(--bs-popover-arrow-width);\n  margin-left: calc(-0.5 * var(--bs-popover-arrow-width));\n  content: \"\";\n  border-bottom: var(--bs-popover-border-width) solid var(--bs-popover-header-bg);\n}\n\n/* rtl:begin:ignore */\n.bs-popover-start > .popover-arrow, .bs-popover-auto[data-popper-placement^=left] > .popover-arrow {\n  right: calc(-1 * (var(--bs-popover-arrow-height)) - var(--bs-popover-border-width));\n  width: var(--bs-popover-arrow-height);\n  height: var(--bs-popover-arrow-width);\n}\n.bs-popover-start > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=left] > .popover-arrow::before, .bs-popover-start > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=left] > .popover-arrow::after {\n  border-width: calc(var(--bs-popover-arrow-width) * 0.5) 0 calc(var(--bs-popover-arrow-width) * 0.5) var(--bs-popover-arrow-height);\n}\n.bs-popover-start > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=left] > .popover-arrow::before {\n  right: 0;\n  border-left-color: var(--bs-popover-arrow-border);\n}\n.bs-popover-start > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=left] > .popover-arrow::after {\n  right: var(--bs-popover-border-width);\n  border-left-color: var(--bs-popover-bg);\n}\n\n/* rtl:end:ignore */\n.popover-header {\n  padding: var(--bs-popover-header-padding-y) var(--bs-popover-header-padding-x);\n  margin-bottom: 0;\n  font-size: var(--bs-popover-header-font-size);\n  color: var(--bs-popover-header-color);\n  background-color: var(--bs-popover-header-bg);\n  border-bottom: var(--bs-popover-border-width) solid var(--bs-popover-border-color);\n  border-top-left-radius: var(--bs-popover-inner-border-radius);\n  border-top-right-radius: var(--bs-popover-inner-border-radius);\n}\n.popover-header:empty {\n  display: none;\n}\n\n.popover-body {\n  padding: var(--bs-popover-body-padding-y) var(--bs-popover-body-padding-x);\n  color: var(--bs-popover-body-color);\n}\n\n.carousel {\n  position: relative;\n}\n\n.carousel.pointer-event {\n  touch-action: pan-y;\n}\n\n.carousel-inner {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n}\n.carousel-inner::after {\n  display: block;\n  clear: both;\n  content: \"\";\n}\n\n.carousel-item {\n  position: relative;\n  display: none;\n  float: left;\n  width: 100%;\n  margin-right: -100%;\n  backface-visibility: hidden;\n  transition: transform 0.6s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n  .carousel-item {\n    transition: none;\n  }\n}\n\n.carousel-item.active,\n.carousel-item-next,\n.carousel-item-prev {\n  display: block;\n}\n\n/* rtl:begin:ignore */\n.carousel-item-next:not(.carousel-item-start),\n.active.carousel-item-end {\n  transform: translateX(100%);\n}\n\n.carousel-item-prev:not(.carousel-item-end),\n.active.carousel-item-start {\n  transform: translateX(-100%);\n}\n\n/* rtl:end:ignore */\n.carousel-fade .carousel-item {\n  opacity: 0;\n  transition-property: opacity;\n  transform: none;\n}\n.carousel-fade .carousel-item.active,\n.carousel-fade .carousel-item-next.carousel-item-start,\n.carousel-fade .carousel-item-prev.carousel-item-end {\n  z-index: 1;\n  opacity: 1;\n}\n.carousel-fade .active.carousel-item-start,\n.carousel-fade .active.carousel-item-end {\n  z-index: 0;\n  opacity: 0;\n  transition: opacity 0s 0.6s;\n}\n@media (prefers-reduced-motion: reduce) {\n  .carousel-fade .active.carousel-item-start,\n.carousel-fade .active.carousel-item-end {\n    transition: none;\n  }\n}\n\n.carousel-control-prev,\n.carousel-control-next {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 15%;\n  padding: 0;\n  color: #fff;\n  text-align: center;\n  background: none;\n  border: 0;\n  opacity: 0.5;\n  transition: opacity 0.15s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n  .carousel-control-prev,\n.carousel-control-next {\n    transition: none;\n  }\n}\n.carousel-control-prev:hover, .carousel-control-prev:focus,\n.carousel-control-next:hover,\n.carousel-control-next:focus {\n  color: #fff;\n  text-decoration: none;\n  outline: 0;\n  opacity: 0.9;\n}\n\n.carousel-control-prev {\n  left: 0;\n}\n\n.carousel-control-next {\n  right: 0;\n}\n\n.carousel-control-prev-icon,\n.carousel-control-next-icon {\n  display: inline-block;\n  width: 2rem;\n  height: 2rem;\n  background-repeat: no-repeat;\n  background-position: 50%;\n  background-size: 100% 100%;\n}\n\n/* rtl:options: {\n  \"autoRename\": true,\n  \"stringMap\":[ {\n    \"name\"    : \"prev-next\",\n    \"search\"  : \"prev\",\n    \"replace\" : \"next\"\n  } ]\n} */\n.carousel-control-prev-icon {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_14___ + ");\n}\n\n.carousel-control-next-icon {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_15___ + ");\n}\n\n.carousel-indicators {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 2;\n  display: flex;\n  justify-content: center;\n  padding: 0;\n  margin-right: 15%;\n  margin-bottom: 1rem;\n  margin-left: 15%;\n  list-style: none;\n}\n.carousel-indicators [data-bs-target] {\n  box-sizing: content-box;\n  flex: 0 1 auto;\n  width: 30px;\n  height: 3px;\n  padding: 0;\n  margin-right: 3px;\n  margin-left: 3px;\n  text-indent: -999px;\n  cursor: pointer;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 0;\n  border-top: 10px solid transparent;\n  border-bottom: 10px solid transparent;\n  opacity: 0.5;\n  transition: opacity 0.6s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n  .carousel-indicators [data-bs-target] {\n    transition: none;\n  }\n}\n.carousel-indicators .active {\n  opacity: 1;\n}\n\n.carousel-caption {\n  position: absolute;\n  right: 15%;\n  bottom: 1.25rem;\n  left: 15%;\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  color: #fff;\n  text-align: center;\n}\n\n.carousel-dark .carousel-control-prev-icon,\n.carousel-dark .carousel-control-next-icon {\n  filter: invert(1) grayscale(100);\n}\n.carousel-dark .carousel-indicators [data-bs-target] {\n  background-color: #000;\n}\n.carousel-dark .carousel-caption {\n  color: #000;\n}\n\n.spinner-grow,\n.spinner-border {\n  display: inline-block;\n  width: var(--bs-spinner-width);\n  height: var(--bs-spinner-height);\n  vertical-align: var(--bs-spinner-vertical-align);\n  border-radius: 50%;\n  animation: var(--bs-spinner-animation-speed) linear infinite var(--bs-spinner-animation-name);\n}\n\n@keyframes spinner-border {\n  to {\n    transform: rotate(360deg) /* rtl:ignore */;\n  }\n}\n.spinner-border {\n  --bs-spinner-width: 2rem;\n  --bs-spinner-height: 2rem;\n  --bs-spinner-vertical-align: -0.125em;\n  --bs-spinner-border-width: 0.25em;\n  --bs-spinner-animation-speed: 0.75s;\n  --bs-spinner-animation-name: spinner-border;\n  border: var(--bs-spinner-border-width) solid currentcolor;\n  border-right-color: transparent;\n}\n\n.spinner-border-sm {\n  --bs-spinner-width: 1rem;\n  --bs-spinner-height: 1rem;\n  --bs-spinner-border-width: 0.2em;\n}\n\n@keyframes spinner-grow {\n  0% {\n    transform: scale(0);\n  }\n  50% {\n    opacity: 1;\n    transform: none;\n  }\n}\n.spinner-grow {\n  --bs-spinner-width: 2rem;\n  --bs-spinner-height: 2rem;\n  --bs-spinner-vertical-align: -0.125em;\n  --bs-spinner-animation-speed: 0.75s;\n  --bs-spinner-animation-name: spinner-grow;\n  background-color: currentcolor;\n  opacity: 0;\n}\n\n.spinner-grow-sm {\n  --bs-spinner-width: 1rem;\n  --bs-spinner-height: 1rem;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .spinner-border,\n.spinner-grow {\n    --bs-spinner-animation-speed: 1.5s;\n  }\n}\n.offcanvas, .offcanvas-xxl, .offcanvas-xl, .offcanvas-lg, .offcanvas-md, .offcanvas-sm {\n  --bs-offcanvas-zindex: 1045;\n  --bs-offcanvas-width: 400px;\n  --bs-offcanvas-height: 30vh;\n  --bs-offcanvas-padding-x: 1rem;\n  --bs-offcanvas-padding-y: 1rem;\n  --bs-offcanvas-color: ;\n  --bs-offcanvas-bg: #fff;\n  --bs-offcanvas-border-width: 1px;\n  --bs-offcanvas-border-color: var(--bs-border-color-translucent);\n  --bs-offcanvas-box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);\n}\n\n@media (max-width: 575.98px) {\n  .offcanvas-sm {\n    position: fixed;\n    bottom: 0;\n    z-index: var(--bs-offcanvas-zindex);\n    display: flex;\n    flex-direction: column;\n    max-width: 100%;\n    color: var(--bs-offcanvas-color);\n    visibility: hidden;\n    background-color: var(--bs-offcanvas-bg);\n    background-clip: padding-box;\n    outline: 0;\n    transition: transform 0.3s ease-in-out;\n  }\n}\n@media (max-width: 575.98px) and (prefers-reduced-motion: reduce) {\n  .offcanvas-sm {\n    transition: none;\n  }\n}\n@media (max-width: 575.98px) {\n  .offcanvas-sm.offcanvas-start {\n    top: 0;\n    left: 0;\n    width: var(--bs-offcanvas-width);\n    border-right: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateX(-100%);\n  }\n}\n@media (max-width: 575.98px) {\n  .offcanvas-sm.offcanvas-end {\n    top: 0;\n    right: 0;\n    width: var(--bs-offcanvas-width);\n    border-left: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateX(100%);\n  }\n}\n@media (max-width: 575.98px) {\n  .offcanvas-sm.offcanvas-top {\n    top: 0;\n    right: 0;\n    left: 0;\n    height: var(--bs-offcanvas-height);\n    max-height: 100%;\n    border-bottom: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateY(-100%);\n  }\n}\n@media (max-width: 575.98px) {\n  .offcanvas-sm.offcanvas-bottom {\n    right: 0;\n    left: 0;\n    height: var(--bs-offcanvas-height);\n    max-height: 100%;\n    border-top: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateY(100%);\n  }\n}\n@media (max-width: 575.98px) {\n  .offcanvas-sm.showing, .offcanvas-sm.show:not(.hiding) {\n    transform: none;\n  }\n}\n@media (max-width: 575.98px) {\n  .offcanvas-sm.showing, .offcanvas-sm.hiding, .offcanvas-sm.show {\n    visibility: visible;\n  }\n}\n@media (min-width: 576px) {\n  .offcanvas-sm {\n    --bs-offcanvas-height: auto;\n    --bs-offcanvas-border-width: 0;\n    background-color: transparent !important;\n  }\n  .offcanvas-sm .offcanvas-header {\n    display: none;\n  }\n  .offcanvas-sm .offcanvas-body {\n    display: flex;\n    flex-grow: 0;\n    padding: 0;\n    overflow-y: visible;\n    background-color: transparent !important;\n  }\n}\n\n@media (max-width: 767.98px) {\n  .offcanvas-md {\n    position: fixed;\n    bottom: 0;\n    z-index: var(--bs-offcanvas-zindex);\n    display: flex;\n    flex-direction: column;\n    max-width: 100%;\n    color: var(--bs-offcanvas-color);\n    visibility: hidden;\n    background-color: var(--bs-offcanvas-bg);\n    background-clip: padding-box;\n    outline: 0;\n    transition: transform 0.3s ease-in-out;\n  }\n}\n@media (max-width: 767.98px) and (prefers-reduced-motion: reduce) {\n  .offcanvas-md {\n    transition: none;\n  }\n}\n@media (max-width: 767.98px) {\n  .offcanvas-md.offcanvas-start {\n    top: 0;\n    left: 0;\n    width: var(--bs-offcanvas-width);\n    border-right: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateX(-100%);\n  }\n}\n@media (max-width: 767.98px) {\n  .offcanvas-md.offcanvas-end {\n    top: 0;\n    right: 0;\n    width: var(--bs-offcanvas-width);\n    border-left: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateX(100%);\n  }\n}\n@media (max-width: 767.98px) {\n  .offcanvas-md.offcanvas-top {\n    top: 0;\n    right: 0;\n    left: 0;\n    height: var(--bs-offcanvas-height);\n    max-height: 100%;\n    border-bottom: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateY(-100%);\n  }\n}\n@media (max-width: 767.98px) {\n  .offcanvas-md.offcanvas-bottom {\n    right: 0;\n    left: 0;\n    height: var(--bs-offcanvas-height);\n    max-height: 100%;\n    border-top: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateY(100%);\n  }\n}\n@media (max-width: 767.98px) {\n  .offcanvas-md.showing, .offcanvas-md.show:not(.hiding) {\n    transform: none;\n  }\n}\n@media (max-width: 767.98px) {\n  .offcanvas-md.showing, .offcanvas-md.hiding, .offcanvas-md.show {\n    visibility: visible;\n  }\n}\n@media (min-width: 768px) {\n  .offcanvas-md {\n    --bs-offcanvas-height: auto;\n    --bs-offcanvas-border-width: 0;\n    background-color: transparent !important;\n  }\n  .offcanvas-md .offcanvas-header {\n    display: none;\n  }\n  .offcanvas-md .offcanvas-body {\n    display: flex;\n    flex-grow: 0;\n    padding: 0;\n    overflow-y: visible;\n    background-color: transparent !important;\n  }\n}\n\n@media (max-width: 991.98px) {\n  .offcanvas-lg {\n    position: fixed;\n    bottom: 0;\n    z-index: var(--bs-offcanvas-zindex);\n    display: flex;\n    flex-direction: column;\n    max-width: 100%;\n    color: var(--bs-offcanvas-color);\n    visibility: hidden;\n    background-color: var(--bs-offcanvas-bg);\n    background-clip: padding-box;\n    outline: 0;\n    transition: transform 0.3s ease-in-out;\n  }\n}\n@media (max-width: 991.98px) and (prefers-reduced-motion: reduce) {\n  .offcanvas-lg {\n    transition: none;\n  }\n}\n@media (max-width: 991.98px) {\n  .offcanvas-lg.offcanvas-start {\n    top: 0;\n    left: 0;\n    width: var(--bs-offcanvas-width);\n    border-right: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateX(-100%);\n  }\n}\n@media (max-width: 991.98px) {\n  .offcanvas-lg.offcanvas-end {\n    top: 0;\n    right: 0;\n    width: var(--bs-offcanvas-width);\n    border-left: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateX(100%);\n  }\n}\n@media (max-width: 991.98px) {\n  .offcanvas-lg.offcanvas-top {\n    top: 0;\n    right: 0;\n    left: 0;\n    height: var(--bs-offcanvas-height);\n    max-height: 100%;\n    border-bottom: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateY(-100%);\n  }\n}\n@media (max-width: 991.98px) {\n  .offcanvas-lg.offcanvas-bottom {\n    right: 0;\n    left: 0;\n    height: var(--bs-offcanvas-height);\n    max-height: 100%;\n    border-top: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateY(100%);\n  }\n}\n@media (max-width: 991.98px) {\n  .offcanvas-lg.showing, .offcanvas-lg.show:not(.hiding) {\n    transform: none;\n  }\n}\n@media (max-width: 991.98px) {\n  .offcanvas-lg.showing, .offcanvas-lg.hiding, .offcanvas-lg.show {\n    visibility: visible;\n  }\n}\n@media (min-width: 992px) {\n  .offcanvas-lg {\n    --bs-offcanvas-height: auto;\n    --bs-offcanvas-border-width: 0;\n    background-color: transparent !important;\n  }\n  .offcanvas-lg .offcanvas-header {\n    display: none;\n  }\n  .offcanvas-lg .offcanvas-body {\n    display: flex;\n    flex-grow: 0;\n    padding: 0;\n    overflow-y: visible;\n    background-color: transparent !important;\n  }\n}\n\n@media (max-width: 1199.98px) {\n  .offcanvas-xl {\n    position: fixed;\n    bottom: 0;\n    z-index: var(--bs-offcanvas-zindex);\n    display: flex;\n    flex-direction: column;\n    max-width: 100%;\n    color: var(--bs-offcanvas-color);\n    visibility: hidden;\n    background-color: var(--bs-offcanvas-bg);\n    background-clip: padding-box;\n    outline: 0;\n    transition: transform 0.3s ease-in-out;\n  }\n}\n@media (max-width: 1199.98px) and (prefers-reduced-motion: reduce) {\n  .offcanvas-xl {\n    transition: none;\n  }\n}\n@media (max-width: 1199.98px) {\n  .offcanvas-xl.offcanvas-start {\n    top: 0;\n    left: 0;\n    width: var(--bs-offcanvas-width);\n    border-right: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateX(-100%);\n  }\n}\n@media (max-width: 1199.98px) {\n  .offcanvas-xl.offcanvas-end {\n    top: 0;\n    right: 0;\n    width: var(--bs-offcanvas-width);\n    border-left: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateX(100%);\n  }\n}\n@media (max-width: 1199.98px) {\n  .offcanvas-xl.offcanvas-top {\n    top: 0;\n    right: 0;\n    left: 0;\n    height: var(--bs-offcanvas-height);\n    max-height: 100%;\n    border-bottom: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateY(-100%);\n  }\n}\n@media (max-width: 1199.98px) {\n  .offcanvas-xl.offcanvas-bottom {\n    right: 0;\n    left: 0;\n    height: var(--bs-offcanvas-height);\n    max-height: 100%;\n    border-top: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateY(100%);\n  }\n}\n@media (max-width: 1199.98px) {\n  .offcanvas-xl.showing, .offcanvas-xl.show:not(.hiding) {\n    transform: none;\n  }\n}\n@media (max-width: 1199.98px) {\n  .offcanvas-xl.showing, .offcanvas-xl.hiding, .offcanvas-xl.show {\n    visibility: visible;\n  }\n}\n@media (min-width: 1200px) {\n  .offcanvas-xl {\n    --bs-offcanvas-height: auto;\n    --bs-offcanvas-border-width: 0;\n    background-color: transparent !important;\n  }\n  .offcanvas-xl .offcanvas-header {\n    display: none;\n  }\n  .offcanvas-xl .offcanvas-body {\n    display: flex;\n    flex-grow: 0;\n    padding: 0;\n    overflow-y: visible;\n    background-color: transparent !important;\n  }\n}\n\n@media (max-width: 1399.98px) {\n  .offcanvas-xxl {\n    position: fixed;\n    bottom: 0;\n    z-index: var(--bs-offcanvas-zindex);\n    display: flex;\n    flex-direction: column;\n    max-width: 100%;\n    color: var(--bs-offcanvas-color);\n    visibility: hidden;\n    background-color: var(--bs-offcanvas-bg);\n    background-clip: padding-box;\n    outline: 0;\n    transition: transform 0.3s ease-in-out;\n  }\n}\n@media (max-width: 1399.98px) and (prefers-reduced-motion: reduce) {\n  .offcanvas-xxl {\n    transition: none;\n  }\n}\n@media (max-width: 1399.98px) {\n  .offcanvas-xxl.offcanvas-start {\n    top: 0;\n    left: 0;\n    width: var(--bs-offcanvas-width);\n    border-right: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateX(-100%);\n  }\n}\n@media (max-width: 1399.98px) {\n  .offcanvas-xxl.offcanvas-end {\n    top: 0;\n    right: 0;\n    width: var(--bs-offcanvas-width);\n    border-left: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateX(100%);\n  }\n}\n@media (max-width: 1399.98px) {\n  .offcanvas-xxl.offcanvas-top {\n    top: 0;\n    right: 0;\n    left: 0;\n    height: var(--bs-offcanvas-height);\n    max-height: 100%;\n    border-bottom: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateY(-100%);\n  }\n}\n@media (max-width: 1399.98px) {\n  .offcanvas-xxl.offcanvas-bottom {\n    right: 0;\n    left: 0;\n    height: var(--bs-offcanvas-height);\n    max-height: 100%;\n    border-top: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n    transform: translateY(100%);\n  }\n}\n@media (max-width: 1399.98px) {\n  .offcanvas-xxl.showing, .offcanvas-xxl.show:not(.hiding) {\n    transform: none;\n  }\n}\n@media (max-width: 1399.98px) {\n  .offcanvas-xxl.showing, .offcanvas-xxl.hiding, .offcanvas-xxl.show {\n    visibility: visible;\n  }\n}\n@media (min-width: 1400px) {\n  .offcanvas-xxl {\n    --bs-offcanvas-height: auto;\n    --bs-offcanvas-border-width: 0;\n    background-color: transparent !important;\n  }\n  .offcanvas-xxl .offcanvas-header {\n    display: none;\n  }\n  .offcanvas-xxl .offcanvas-body {\n    display: flex;\n    flex-grow: 0;\n    padding: 0;\n    overflow-y: visible;\n    background-color: transparent !important;\n  }\n}\n\n.offcanvas {\n  position: fixed;\n  bottom: 0;\n  z-index: var(--bs-offcanvas-zindex);\n  display: flex;\n  flex-direction: column;\n  max-width: 100%;\n  color: var(--bs-offcanvas-color);\n  visibility: hidden;\n  background-color: var(--bs-offcanvas-bg);\n  background-clip: padding-box;\n  outline: 0;\n  transition: transform 0.3s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n  .offcanvas {\n    transition: none;\n  }\n}\n.offcanvas.offcanvas-start {\n  top: 0;\n  left: 0;\n  width: var(--bs-offcanvas-width);\n  border-right: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n  transform: translateX(-100%);\n}\n.offcanvas.offcanvas-end {\n  top: 0;\n  right: 0;\n  width: var(--bs-offcanvas-width);\n  border-left: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n  transform: translateX(100%);\n}\n.offcanvas.offcanvas-top {\n  top: 0;\n  right: 0;\n  left: 0;\n  height: var(--bs-offcanvas-height);\n  max-height: 100%;\n  border-bottom: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n  transform: translateY(-100%);\n}\n.offcanvas.offcanvas-bottom {\n  right: 0;\n  left: 0;\n  height: var(--bs-offcanvas-height);\n  max-height: 100%;\n  border-top: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);\n  transform: translateY(100%);\n}\n.offcanvas.showing, .offcanvas.show:not(.hiding) {\n  transform: none;\n}\n.offcanvas.showing, .offcanvas.hiding, .offcanvas.show {\n  visibility: visible;\n}\n\n.offcanvas-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 1040;\n  width: 100vw;\n  height: 100vh;\n  background-color: #000;\n}\n.offcanvas-backdrop.fade {\n  opacity: 0;\n}\n.offcanvas-backdrop.show {\n  opacity: 0.5;\n}\n\n.offcanvas-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: var(--bs-offcanvas-padding-y) var(--bs-offcanvas-padding-x);\n}\n.offcanvas-header .btn-close {\n  padding: calc(var(--bs-offcanvas-padding-y) * 0.5) calc(var(--bs-offcanvas-padding-x) * 0.5);\n  margin-top: calc(-0.5 * var(--bs-offcanvas-padding-y));\n  margin-right: calc(-0.5 * var(--bs-offcanvas-padding-x));\n  margin-bottom: calc(-0.5 * var(--bs-offcanvas-padding-y));\n}\n\n.offcanvas-title {\n  margin-bottom: 0;\n  line-height: 1.5;\n}\n\n.offcanvas-body {\n  flex-grow: 1;\n  padding: var(--bs-offcanvas-padding-y) var(--bs-offcanvas-padding-x);\n  overflow-y: auto;\n}\n\n.placeholder {\n  display: inline-block;\n  min-height: 1em;\n  vertical-align: middle;\n  cursor: wait;\n  background-color: currentcolor;\n  opacity: 0.5;\n}\n.placeholder.btn::before {\n  display: inline-block;\n  content: \"\";\n}\n\n.placeholder-xs {\n  min-height: 0.6em;\n}\n\n.placeholder-sm {\n  min-height: 0.8em;\n}\n\n.placeholder-lg {\n  min-height: 1.2em;\n}\n\n.placeholder-glow .placeholder {\n  animation: placeholder-glow 2s ease-in-out infinite;\n}\n\n@keyframes placeholder-glow {\n  50% {\n    opacity: 0.2;\n  }\n}\n.placeholder-wave {\n  mask-image: linear-gradient(130deg, #000 55%, rgba(0, 0, 0, 0.8) 75%, #000 95%);\n  mask-size: 200% 100%;\n  animation: placeholder-wave 2s linear infinite;\n}\n\n@keyframes placeholder-wave {\n  100% {\n    mask-position: -200% 0%;\n  }\n}\n.clearfix::after {\n  display: block;\n  clear: both;\n  content: \"\";\n}\n\n.text-bg-primary {\n  color: #fff !important;\n  background-color: RGBA(13, 110, 253, var(--bs-bg-opacity, 1)) !important;\n}\n\n.text-bg-secondary {\n  color: #fff !important;\n  background-color: RGBA(108, 117, 125, var(--bs-bg-opacity, 1)) !important;\n}\n\n.text-bg-success {\n  color: #fff !important;\n  background-color: RGBA(25, 135, 84, var(--bs-bg-opacity, 1)) !important;\n}\n\n.text-bg-info {\n  color: #000 !important;\n  background-color: RGBA(13, 202, 240, var(--bs-bg-opacity, 1)) !important;\n}\n\n.text-bg-warning {\n  color: #000 !important;\n  background-color: RGBA(255, 193, 7, var(--bs-bg-opacity, 1)) !important;\n}\n\n.text-bg-danger {\n  color: #fff !important;\n  background-color: RGBA(220, 53, 69, var(--bs-bg-opacity, 1)) !important;\n}\n\n.text-bg-light {\n  color: #000 !important;\n  background-color: RGBA(248, 249, 250, var(--bs-bg-opacity, 1)) !important;\n}\n\n.text-bg-dark {\n  color: #fff !important;\n  background-color: RGBA(33, 37, 41, var(--bs-bg-opacity, 1)) !important;\n}\n\n.link-primary {\n  color: #0d6efd !important;\n}\n.link-primary:hover, .link-primary:focus {\n  color: #0a58ca !important;\n}\n\n.link-secondary {\n  color: #6c757d !important;\n}\n.link-secondary:hover, .link-secondary:focus {\n  color: #565e64 !important;\n}\n\n.link-success {\n  color: #198754 !important;\n}\n.link-success:hover, .link-success:focus {\n  color: #146c43 !important;\n}\n\n.link-info {\n  color: #0dcaf0 !important;\n}\n.link-info:hover, .link-info:focus {\n  color: #3dd5f3 !important;\n}\n\n.link-warning {\n  color: #ffc107 !important;\n}\n.link-warning:hover, .link-warning:focus {\n  color: #ffcd39 !important;\n}\n\n.link-danger {\n  color: #dc3545 !important;\n}\n.link-danger:hover, .link-danger:focus {\n  color: #b02a37 !important;\n}\n\n.link-light {\n  color: #f8f9fa !important;\n}\n.link-light:hover, .link-light:focus {\n  color: #f9fafb !important;\n}\n\n.link-dark {\n  color: #212529 !important;\n}\n.link-dark:hover, .link-dark:focus {\n  color: #1a1e21 !important;\n}\n\n.ratio {\n  position: relative;\n  width: 100%;\n}\n.ratio::before {\n  display: block;\n  padding-top: var(--bs-aspect-ratio);\n  content: \"\";\n}\n.ratio > * {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.ratio-1x1 {\n  --bs-aspect-ratio: 100%;\n}\n\n.ratio-4x3 {\n  --bs-aspect-ratio: 75%;\n}\n\n.ratio-16x9 {\n  --bs-aspect-ratio: 56.25%;\n}\n\n.ratio-21x9 {\n  --bs-aspect-ratio: 42.8571428571%;\n}\n\n.fixed-top {\n  position: fixed;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 1030;\n}\n\n.fixed-bottom {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1030;\n}\n\n.sticky-top {\n  position: sticky;\n  top: 0;\n  z-index: 1020;\n}\n\n.sticky-bottom {\n  position: sticky;\n  bottom: 0;\n  z-index: 1020;\n}\n\n@media (min-width: 576px) {\n  .sticky-sm-top {\n    position: sticky;\n    top: 0;\n    z-index: 1020;\n  }\n  .sticky-sm-bottom {\n    position: sticky;\n    bottom: 0;\n    z-index: 1020;\n  }\n}\n@media (min-width: 768px) {\n  .sticky-md-top {\n    position: sticky;\n    top: 0;\n    z-index: 1020;\n  }\n  .sticky-md-bottom {\n    position: sticky;\n    bottom: 0;\n    z-index: 1020;\n  }\n}\n@media (min-width: 992px) {\n  .sticky-lg-top {\n    position: sticky;\n    top: 0;\n    z-index: 1020;\n  }\n  .sticky-lg-bottom {\n    position: sticky;\n    bottom: 0;\n    z-index: 1020;\n  }\n}\n@media (min-width: 1200px) {\n  .sticky-xl-top {\n    position: sticky;\n    top: 0;\n    z-index: 1020;\n  }\n  .sticky-xl-bottom {\n    position: sticky;\n    bottom: 0;\n    z-index: 1020;\n  }\n}\n@media (min-width: 1400px) {\n  .sticky-xxl-top {\n    position: sticky;\n    top: 0;\n    z-index: 1020;\n  }\n  .sticky-xxl-bottom {\n    position: sticky;\n    bottom: 0;\n    z-index: 1020;\n  }\n}\n.hstack {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  align-self: stretch;\n}\n\n.vstack {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  align-self: stretch;\n}\n\n.visually-hidden,\n.visually-hidden-focusable:not(:focus):not(:focus-within) {\n  position: absolute !important;\n  width: 1px !important;\n  height: 1px !important;\n  padding: 0 !important;\n  margin: -1px !important;\n  overflow: hidden !important;\n  clip: rect(0, 0, 0, 0) !important;\n  white-space: nowrap !important;\n  border: 0 !important;\n}\n\n.stretched-link::after {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1;\n  content: \"\";\n}\n\n.text-truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.vr {\n  display: inline-block;\n  align-self: stretch;\n  width: 1px;\n  min-height: 1em;\n  background-color: currentcolor;\n  opacity: 0.25;\n}\n\n.align-baseline {\n  vertical-align: baseline !important;\n}\n\n.align-top {\n  vertical-align: top !important;\n}\n\n.align-middle {\n  vertical-align: middle !important;\n}\n\n.align-bottom {\n  vertical-align: bottom !important;\n}\n\n.align-text-bottom {\n  vertical-align: text-bottom !important;\n}\n\n.align-text-top {\n  vertical-align: text-top !important;\n}\n\n.float-start {\n  float: left !important;\n}\n\n.float-end {\n  float: right !important;\n}\n\n.float-none {\n  float: none !important;\n}\n\n.opacity-0 {\n  opacity: 0 !important;\n}\n\n.opacity-25 {\n  opacity: 0.25 !important;\n}\n\n.opacity-50 {\n  opacity: 0.5 !important;\n}\n\n.opacity-75 {\n  opacity: 0.75 !important;\n}\n\n.opacity-100 {\n  opacity: 1 !important;\n}\n\n.overflow-auto {\n  overflow: auto !important;\n}\n\n.overflow-hidden {\n  overflow: hidden !important;\n}\n\n.overflow-visible {\n  overflow: visible !important;\n}\n\n.overflow-scroll {\n  overflow: scroll !important;\n}\n\n.d-inline {\n  display: inline !important;\n}\n\n.d-inline-block {\n  display: inline-block !important;\n}\n\n.d-block {\n  display: block !important;\n}\n\n.d-grid {\n  display: grid !important;\n}\n\n.d-table {\n  display: table !important;\n}\n\n.d-table-row {\n  display: table-row !important;\n}\n\n.d-table-cell {\n  display: table-cell !important;\n}\n\n.d-flex {\n  display: flex !important;\n}\n\n.d-inline-flex {\n  display: inline-flex !important;\n}\n\n.d-none {\n  display: none !important;\n}\n\n.shadow {\n  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;\n}\n\n.shadow-sm {\n  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;\n}\n\n.shadow-lg {\n  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;\n}\n\n.shadow-none {\n  box-shadow: none !important;\n}\n\n.position-static {\n  position: static !important;\n}\n\n.position-relative {\n  position: relative !important;\n}\n\n.position-absolute {\n  position: absolute !important;\n}\n\n.position-fixed {\n  position: fixed !important;\n}\n\n.position-sticky {\n  position: sticky !important;\n}\n\n.top-0 {\n  top: 0 !important;\n}\n\n.top-50 {\n  top: 50% !important;\n}\n\n.top-100 {\n  top: 100% !important;\n}\n\n.bottom-0 {\n  bottom: 0 !important;\n}\n\n.bottom-50 {\n  bottom: 50% !important;\n}\n\n.bottom-100 {\n  bottom: 100% !important;\n}\n\n.start-0 {\n  left: 0 !important;\n}\n\n.start-50 {\n  left: 50% !important;\n}\n\n.start-100 {\n  left: 100% !important;\n}\n\n.end-0 {\n  right: 0 !important;\n}\n\n.end-50 {\n  right: 50% !important;\n}\n\n.end-100 {\n  right: 100% !important;\n}\n\n.translate-middle {\n  transform: translate(-50%, -50%) !important;\n}\n\n.translate-middle-x {\n  transform: translateX(-50%) !important;\n}\n\n.translate-middle-y {\n  transform: translateY(-50%) !important;\n}\n\n.border {\n  border: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color) !important;\n}\n\n.border-0 {\n  border: 0 !important;\n}\n\n.border-top {\n  border-top: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color) !important;\n}\n\n.border-top-0 {\n  border-top: 0 !important;\n}\n\n.border-end {\n  border-right: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color) !important;\n}\n\n.border-end-0 {\n  border-right: 0 !important;\n}\n\n.border-bottom {\n  border-bottom: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color) !important;\n}\n\n.border-bottom-0 {\n  border-bottom: 0 !important;\n}\n\n.border-start {\n  border-left: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color) !important;\n}\n\n.border-start-0 {\n  border-left: 0 !important;\n}\n\n.border-primary {\n  --bs-border-opacity: 1;\n  border-color: rgba(var(--bs-primary-rgb), var(--bs-border-opacity)) !important;\n}\n\n.border-secondary {\n  --bs-border-opacity: 1;\n  border-color: rgba(var(--bs-secondary-rgb), var(--bs-border-opacity)) !important;\n}\n\n.border-success {\n  --bs-border-opacity: 1;\n  border-color: rgba(var(--bs-success-rgb), var(--bs-border-opacity)) !important;\n}\n\n.border-info {\n  --bs-border-opacity: 1;\n  border-color: rgba(var(--bs-info-rgb), var(--bs-border-opacity)) !important;\n}\n\n.border-warning {\n  --bs-border-opacity: 1;\n  border-color: rgba(var(--bs-warning-rgb), var(--bs-border-opacity)) !important;\n}\n\n.border-danger {\n  --bs-border-opacity: 1;\n  border-color: rgba(var(--bs-danger-rgb), var(--bs-border-opacity)) !important;\n}\n\n.border-light {\n  --bs-border-opacity: 1;\n  border-color: rgba(var(--bs-light-rgb), var(--bs-border-opacity)) !important;\n}\n\n.border-dark {\n  --bs-border-opacity: 1;\n  border-color: rgba(var(--bs-dark-rgb), var(--bs-border-opacity)) !important;\n}\n\n.border-white {\n  --bs-border-opacity: 1;\n  border-color: rgba(var(--bs-white-rgb), var(--bs-border-opacity)) !important;\n}\n\n.border-1 {\n  --bs-border-width: 1px;\n}\n\n.border-2 {\n  --bs-border-width: 2px;\n}\n\n.border-3 {\n  --bs-border-width: 3px;\n}\n\n.border-4 {\n  --bs-border-width: 4px;\n}\n\n.border-5 {\n  --bs-border-width: 5px;\n}\n\n.border-opacity-10 {\n  --bs-border-opacity: 0.1;\n}\n\n.border-opacity-25 {\n  --bs-border-opacity: 0.25;\n}\n\n.border-opacity-50 {\n  --bs-border-opacity: 0.5;\n}\n\n.border-opacity-75 {\n  --bs-border-opacity: 0.75;\n}\n\n.border-opacity-100 {\n  --bs-border-opacity: 1;\n}\n\n.w-25 {\n  width: 25% !important;\n}\n\n.w-50 {\n  width: 50% !important;\n}\n\n.w-75 {\n  width: 75% !important;\n}\n\n.w-100 {\n  width: 100% !important;\n}\n\n.w-auto {\n  width: auto !important;\n}\n\n.mw-100 {\n  max-width: 100% !important;\n}\n\n.vw-100 {\n  width: 100vw !important;\n}\n\n.min-vw-100 {\n  min-width: 100vw !important;\n}\n\n.h-25 {\n  height: 25% !important;\n}\n\n.h-50 {\n  height: 50% !important;\n}\n\n.h-75 {\n  height: 75% !important;\n}\n\n.h-100 {\n  height: 100% !important;\n}\n\n.h-auto {\n  height: auto !important;\n}\n\n.mh-100 {\n  max-height: 100% !important;\n}\n\n.vh-100 {\n  height: 100vh !important;\n}\n\n.min-vh-100 {\n  min-height: 100vh !important;\n}\n\n.flex-fill {\n  flex: 1 1 auto !important;\n}\n\n.flex-row {\n  flex-direction: row !important;\n}\n\n.flex-column {\n  flex-direction: column !important;\n}\n\n.flex-row-reverse {\n  flex-direction: row-reverse !important;\n}\n\n.flex-column-reverse {\n  flex-direction: column-reverse !important;\n}\n\n.flex-grow-0 {\n  flex-grow: 0 !important;\n}\n\n.flex-grow-1 {\n  flex-grow: 1 !important;\n}\n\n.flex-shrink-0 {\n  flex-shrink: 0 !important;\n}\n\n.flex-shrink-1 {\n  flex-shrink: 1 !important;\n}\n\n.flex-wrap {\n  flex-wrap: wrap !important;\n}\n\n.flex-nowrap {\n  flex-wrap: nowrap !important;\n}\n\n.flex-wrap-reverse {\n  flex-wrap: wrap-reverse !important;\n}\n\n.justify-content-start {\n  justify-content: flex-start !important;\n}\n\n.justify-content-end {\n  justify-content: flex-end !important;\n}\n\n.justify-content-center {\n  justify-content: center !important;\n}\n\n.justify-content-between {\n  justify-content: space-between !important;\n}\n\n.justify-content-around {\n  justify-content: space-around !important;\n}\n\n.justify-content-evenly {\n  justify-content: space-evenly !important;\n}\n\n.align-items-start {\n  align-items: flex-start !important;\n}\n\n.align-items-end {\n  align-items: flex-end !important;\n}\n\n.align-items-center {\n  align-items: center !important;\n}\n\n.align-items-baseline {\n  align-items: baseline !important;\n}\n\n.align-items-stretch {\n  align-items: stretch !important;\n}\n\n.align-content-start {\n  align-content: flex-start !important;\n}\n\n.align-content-end {\n  align-content: flex-end !important;\n}\n\n.align-content-center {\n  align-content: center !important;\n}\n\n.align-content-between {\n  align-content: space-between !important;\n}\n\n.align-content-around {\n  align-content: space-around !important;\n}\n\n.align-content-stretch {\n  align-content: stretch !important;\n}\n\n.align-self-auto {\n  align-self: auto !important;\n}\n\n.align-self-start {\n  align-self: flex-start !important;\n}\n\n.align-self-end {\n  align-self: flex-end !important;\n}\n\n.align-self-center {\n  align-self: center !important;\n}\n\n.align-self-baseline {\n  align-self: baseline !important;\n}\n\n.align-self-stretch {\n  align-self: stretch !important;\n}\n\n.order-first {\n  order: -1 !important;\n}\n\n.order-0 {\n  order: 0 !important;\n}\n\n.order-1 {\n  order: 1 !important;\n}\n\n.order-2 {\n  order: 2 !important;\n}\n\n.order-3 {\n  order: 3 !important;\n}\n\n.order-4 {\n  order: 4 !important;\n}\n\n.order-5 {\n  order: 5 !important;\n}\n\n.order-last {\n  order: 6 !important;\n}\n\n.m-0 {\n  margin: 0 !important;\n}\n\n.m-1 {\n  margin: 0.25rem !important;\n}\n\n.m-2 {\n  margin: 0.5rem !important;\n}\n\n.m-3 {\n  margin: 1rem !important;\n}\n\n.m-4 {\n  margin: 1.5rem !important;\n}\n\n.m-5 {\n  margin: 3rem !important;\n}\n\n.m-auto {\n  margin: auto !important;\n}\n\n.mx-0 {\n  margin-right: 0 !important;\n  margin-left: 0 !important;\n}\n\n.mx-1 {\n  margin-right: 0.25rem !important;\n  margin-left: 0.25rem !important;\n}\n\n.mx-2 {\n  margin-right: 0.5rem !important;\n  margin-left: 0.5rem !important;\n}\n\n.mx-3 {\n  margin-right: 1rem !important;\n  margin-left: 1rem !important;\n}\n\n.mx-4 {\n  margin-right: 1.5rem !important;\n  margin-left: 1.5rem !important;\n}\n\n.mx-5 {\n  margin-right: 3rem !important;\n  margin-left: 3rem !important;\n}\n\n.mx-auto {\n  margin-right: auto !important;\n  margin-left: auto !important;\n}\n\n.my-0 {\n  margin-top: 0 !important;\n  margin-bottom: 0 !important;\n}\n\n.my-1 {\n  margin-top: 0.25rem !important;\n  margin-bottom: 0.25rem !important;\n}\n\n.my-2 {\n  margin-top: 0.5rem !important;\n  margin-bottom: 0.5rem !important;\n}\n\n.my-3 {\n  margin-top: 1rem !important;\n  margin-bottom: 1rem !important;\n}\n\n.my-4 {\n  margin-top: 1.5rem !important;\n  margin-bottom: 1.5rem !important;\n}\n\n.my-5 {\n  margin-top: 3rem !important;\n  margin-bottom: 3rem !important;\n}\n\n.my-auto {\n  margin-top: auto !important;\n  margin-bottom: auto !important;\n}\n\n.mt-0 {\n  margin-top: 0 !important;\n}\n\n.mt-1 {\n  margin-top: 0.25rem !important;\n}\n\n.mt-2 {\n  margin-top: 0.5rem !important;\n}\n\n.mt-3 {\n  margin-top: 1rem !important;\n}\n\n.mt-4 {\n  margin-top: 1.5rem !important;\n}\n\n.mt-5 {\n  margin-top: 3rem !important;\n}\n\n.mt-auto {\n  margin-top: auto !important;\n}\n\n.me-0 {\n  margin-right: 0 !important;\n}\n\n.me-1 {\n  margin-right: 0.25rem !important;\n}\n\n.me-2 {\n  margin-right: 0.5rem !important;\n}\n\n.me-3 {\n  margin-right: 1rem !important;\n}\n\n.me-4 {\n  margin-right: 1.5rem !important;\n}\n\n.me-5 {\n  margin-right: 3rem !important;\n}\n\n.me-auto {\n  margin-right: auto !important;\n}\n\n.mb-0 {\n  margin-bottom: 0 !important;\n}\n\n.mb-1 {\n  margin-bottom: 0.25rem !important;\n}\n\n.mb-2 {\n  margin-bottom: 0.5rem !important;\n}\n\n.mb-3 {\n  margin-bottom: 1rem !important;\n}\n\n.mb-4 {\n  margin-bottom: 1.5rem !important;\n}\n\n.mb-5 {\n  margin-bottom: 3rem !important;\n}\n\n.mb-auto {\n  margin-bottom: auto !important;\n}\n\n.ms-0 {\n  margin-left: 0 !important;\n}\n\n.ms-1 {\n  margin-left: 0.25rem !important;\n}\n\n.ms-2 {\n  margin-left: 0.5rem !important;\n}\n\n.ms-3 {\n  margin-left: 1rem !important;\n}\n\n.ms-4 {\n  margin-left: 1.5rem !important;\n}\n\n.ms-5 {\n  margin-left: 3rem !important;\n}\n\n.ms-auto {\n  margin-left: auto !important;\n}\n\n.p-0 {\n  padding: 0 !important;\n}\n\n.p-1 {\n  padding: 0.25rem !important;\n}\n\n.p-2 {\n  padding: 0.5rem !important;\n}\n\n.p-3 {\n  padding: 1rem !important;\n}\n\n.p-4 {\n  padding: 1.5rem !important;\n}\n\n.p-5 {\n  padding: 3rem !important;\n}\n\n.px-0 {\n  padding-right: 0 !important;\n  padding-left: 0 !important;\n}\n\n.px-1 {\n  padding-right: 0.25rem !important;\n  padding-left: 0.25rem !important;\n}\n\n.px-2 {\n  padding-right: 0.5rem !important;\n  padding-left: 0.5rem !important;\n}\n\n.px-3 {\n  padding-right: 1rem !important;\n  padding-left: 1rem !important;\n}\n\n.px-4 {\n  padding-right: 1.5rem !important;\n  padding-left: 1.5rem !important;\n}\n\n.px-5 {\n  padding-right: 3rem !important;\n  padding-left: 3rem !important;\n}\n\n.py-0 {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n}\n\n.py-1 {\n  padding-top: 0.25rem !important;\n  padding-bottom: 0.25rem !important;\n}\n\n.py-2 {\n  padding-top: 0.5rem !important;\n  padding-bottom: 0.5rem !important;\n}\n\n.py-3 {\n  padding-top: 1rem !important;\n  padding-bottom: 1rem !important;\n}\n\n.py-4 {\n  padding-top: 1.5rem !important;\n  padding-bottom: 1.5rem !important;\n}\n\n.py-5 {\n  padding-top: 3rem !important;\n  padding-bottom: 3rem !important;\n}\n\n.pt-0 {\n  padding-top: 0 !important;\n}\n\n.pt-1 {\n  padding-top: 0.25rem !important;\n}\n\n.pt-2 {\n  padding-top: 0.5rem !important;\n}\n\n.pt-3 {\n  padding-top: 1rem !important;\n}\n\n.pt-4 {\n  padding-top: 1.5rem !important;\n}\n\n.pt-5 {\n  padding-top: 3rem !important;\n}\n\n.pe-0 {\n  padding-right: 0 !important;\n}\n\n.pe-1 {\n  padding-right: 0.25rem !important;\n}\n\n.pe-2 {\n  padding-right: 0.5rem !important;\n}\n\n.pe-3 {\n  padding-right: 1rem !important;\n}\n\n.pe-4 {\n  padding-right: 1.5rem !important;\n}\n\n.pe-5 {\n  padding-right: 3rem !important;\n}\n\n.pb-0 {\n  padding-bottom: 0 !important;\n}\n\n.pb-1 {\n  padding-bottom: 0.25rem !important;\n}\n\n.pb-2 {\n  padding-bottom: 0.5rem !important;\n}\n\n.pb-3 {\n  padding-bottom: 1rem !important;\n}\n\n.pb-4 {\n  padding-bottom: 1.5rem !important;\n}\n\n.pb-5 {\n  padding-bottom: 3rem !important;\n}\n\n.ps-0 {\n  padding-left: 0 !important;\n}\n\n.ps-1 {\n  padding-left: 0.25rem !important;\n}\n\n.ps-2 {\n  padding-left: 0.5rem !important;\n}\n\n.ps-3 {\n  padding-left: 1rem !important;\n}\n\n.ps-4 {\n  padding-left: 1.5rem !important;\n}\n\n.ps-5 {\n  padding-left: 3rem !important;\n}\n\n.gap-0 {\n  gap: 0 !important;\n}\n\n.gap-1 {\n  gap: 0.25rem !important;\n}\n\n.gap-2 {\n  gap: 0.5rem !important;\n}\n\n.gap-3 {\n  gap: 1rem !important;\n}\n\n.gap-4 {\n  gap: 1.5rem !important;\n}\n\n.gap-5 {\n  gap: 3rem !important;\n}\n\n.font-monospace {\n  font-family: var(--bs-font-monospace) !important;\n}\n\n.fs-1 {\n  font-size: calc(1.375rem + 1.5vw) !important;\n}\n\n.fs-2 {\n  font-size: calc(1.325rem + 0.9vw) !important;\n}\n\n.fs-3 {\n  font-size: calc(1.3rem + 0.6vw) !important;\n}\n\n.fs-4 {\n  font-size: calc(1.275rem + 0.3vw) !important;\n}\n\n.fs-5 {\n  font-size: 1.25rem !important;\n}\n\n.fs-6 {\n  font-size: 1rem !important;\n}\n\n.fst-italic {\n  font-style: italic !important;\n}\n\n.fst-normal {\n  font-style: normal !important;\n}\n\n.fw-light {\n  font-weight: 300 !important;\n}\n\n.fw-lighter {\n  font-weight: lighter !important;\n}\n\n.fw-normal {\n  font-weight: 400 !important;\n}\n\n.fw-bold {\n  font-weight: 700 !important;\n}\n\n.fw-semibold {\n  font-weight: 600 !important;\n}\n\n.fw-bolder {\n  font-weight: bolder !important;\n}\n\n.lh-1 {\n  line-height: 1 !important;\n}\n\n.lh-sm {\n  line-height: 1.25 !important;\n}\n\n.lh-base {\n  line-height: 1.5 !important;\n}\n\n.lh-lg {\n  line-height: 2 !important;\n}\n\n.text-start {\n  text-align: left !important;\n}\n\n.text-end {\n  text-align: right !important;\n}\n\n.text-center {\n  text-align: center !important;\n}\n\n.text-decoration-none {\n  text-decoration: none !important;\n}\n\n.text-decoration-underline {\n  text-decoration: underline !important;\n}\n\n.text-decoration-line-through {\n  text-decoration: line-through !important;\n}\n\n.text-lowercase {\n  text-transform: lowercase !important;\n}\n\n.text-uppercase {\n  text-transform: uppercase !important;\n}\n\n.text-capitalize {\n  text-transform: capitalize !important;\n}\n\n.text-wrap {\n  white-space: normal !important;\n}\n\n.text-nowrap {\n  white-space: nowrap !important;\n}\n\n/* rtl:begin:remove */\n.text-break {\n  word-wrap: break-word !important;\n  word-break: break-word !important;\n}\n\n/* rtl:end:remove */\n.text-primary {\n  --bs-text-opacity: 1;\n  color: rgba(var(--bs-primary-rgb), var(--bs-text-opacity)) !important;\n}\n\n.text-secondary {\n  --bs-text-opacity: 1;\n  color: rgba(var(--bs-secondary-rgb), var(--bs-text-opacity)) !important;\n}\n\n.text-success {\n  --bs-text-opacity: 1;\n  color: rgba(var(--bs-success-rgb), var(--bs-text-opacity)) !important;\n}\n\n.text-info {\n  --bs-text-opacity: 1;\n  color: rgba(var(--bs-info-rgb), var(--bs-text-opacity)) !important;\n}\n\n.text-warning {\n  --bs-text-opacity: 1;\n  color: rgba(var(--bs-warning-rgb), var(--bs-text-opacity)) !important;\n}\n\n.text-danger {\n  --bs-text-opacity: 1;\n  color: rgba(var(--bs-danger-rgb), var(--bs-text-opacity)) !important;\n}\n\n.text-light {\n  --bs-text-opacity: 1;\n  color: rgba(var(--bs-light-rgb), var(--bs-text-opacity)) !important;\n}\n\n.text-dark {\n  --bs-text-opacity: 1;\n  color: rgba(var(--bs-dark-rgb), var(--bs-text-opacity)) !important;\n}\n\n.text-black {\n  --bs-text-opacity: 1;\n  color: rgba(var(--bs-black-rgb), var(--bs-text-opacity)) !important;\n}\n\n.text-white {\n  --bs-text-opacity: 1;\n  color: rgba(var(--bs-white-rgb), var(--bs-text-opacity)) !important;\n}\n\n.text-body {\n  --bs-text-opacity: 1;\n  color: rgba(var(--bs-body-color-rgb), var(--bs-text-opacity)) !important;\n}\n\n.text-muted {\n  --bs-text-opacity: 1;\n  color: #6c757d !important;\n}\n\n.text-black-50 {\n  --bs-text-opacity: 1;\n  color: rgba(0, 0, 0, 0.5) !important;\n}\n\n.text-white-50 {\n  --bs-text-opacity: 1;\n  color: rgba(255, 255, 255, 0.5) !important;\n}\n\n.text-reset {\n  --bs-text-opacity: 1;\n  color: inherit !important;\n}\n\n.text-opacity-25 {\n  --bs-text-opacity: 0.25;\n}\n\n.text-opacity-50 {\n  --bs-text-opacity: 0.5;\n}\n\n.text-opacity-75 {\n  --bs-text-opacity: 0.75;\n}\n\n.text-opacity-100 {\n  --bs-text-opacity: 1;\n}\n\n.bg-primary {\n  --bs-bg-opacity: 1;\n  background-color: rgba(var(--bs-primary-rgb), var(--bs-bg-opacity)) !important;\n}\n\n.bg-secondary {\n  --bs-bg-opacity: 1;\n  background-color: rgba(var(--bs-secondary-rgb), var(--bs-bg-opacity)) !important;\n}\n\n.bg-success {\n  --bs-bg-opacity: 1;\n  background-color: rgba(var(--bs-success-rgb), var(--bs-bg-opacity)) !important;\n}\n\n.bg-info {\n  --bs-bg-opacity: 1;\n  background-color: rgba(var(--bs-info-rgb), var(--bs-bg-opacity)) !important;\n}\n\n.bg-warning {\n  --bs-bg-opacity: 1;\n  background-color: rgba(var(--bs-warning-rgb), var(--bs-bg-opacity)) !important;\n}\n\n.bg-danger {\n  --bs-bg-opacity: 1;\n  background-color: rgba(var(--bs-danger-rgb), var(--bs-bg-opacity)) !important;\n}\n\n.bg-light {\n  --bs-bg-opacity: 1;\n  background-color: rgba(var(--bs-light-rgb), var(--bs-bg-opacity)) !important;\n}\n\n.bg-dark {\n  --bs-bg-opacity: 1;\n  background-color: rgba(var(--bs-dark-rgb), var(--bs-bg-opacity)) !important;\n}\n\n.bg-black {\n  --bs-bg-opacity: 1;\n  background-color: rgba(var(--bs-black-rgb), var(--bs-bg-opacity)) !important;\n}\n\n.bg-white {\n  --bs-bg-opacity: 1;\n  background-color: rgba(var(--bs-white-rgb), var(--bs-bg-opacity)) !important;\n}\n\n.bg-body {\n  --bs-bg-opacity: 1;\n  background-color: rgba(var(--bs-body-bg-rgb), var(--bs-bg-opacity)) !important;\n}\n\n.bg-transparent {\n  --bs-bg-opacity: 1;\n  background-color: transparent !important;\n}\n\n.bg-opacity-10 {\n  --bs-bg-opacity: 0.1;\n}\n\n.bg-opacity-25 {\n  --bs-bg-opacity: 0.25;\n}\n\n.bg-opacity-50 {\n  --bs-bg-opacity: 0.5;\n}\n\n.bg-opacity-75 {\n  --bs-bg-opacity: 0.75;\n}\n\n.bg-opacity-100 {\n  --bs-bg-opacity: 1;\n}\n\n.bg-gradient {\n  background-image: var(--bs-gradient) !important;\n}\n\n.user-select-all {\n  user-select: all !important;\n}\n\n.user-select-auto {\n  user-select: auto !important;\n}\n\n.user-select-none {\n  user-select: none !important;\n}\n\n.pe-none {\n  pointer-events: none !important;\n}\n\n.pe-auto {\n  pointer-events: auto !important;\n}\n\n.rounded {\n  border-radius: var(--bs-border-radius) !important;\n}\n\n.rounded-0 {\n  border-radius: 0 !important;\n}\n\n.rounded-1 {\n  border-radius: var(--bs-border-radius-sm) !important;\n}\n\n.rounded-2 {\n  border-radius: var(--bs-border-radius) !important;\n}\n\n.rounded-3 {\n  border-radius: var(--bs-border-radius-lg) !important;\n}\n\n.rounded-4 {\n  border-radius: var(--bs-border-radius-xl) !important;\n}\n\n.rounded-5 {\n  border-radius: var(--bs-border-radius-2xl) !important;\n}\n\n.rounded-circle {\n  border-radius: 50% !important;\n}\n\n.rounded-pill {\n  border-radius: var(--bs-border-radius-pill) !important;\n}\n\n.rounded-top {\n  border-top-left-radius: var(--bs-border-radius) !important;\n  border-top-right-radius: var(--bs-border-radius) !important;\n}\n\n.rounded-end {\n  border-top-right-radius: var(--bs-border-radius) !important;\n  border-bottom-right-radius: var(--bs-border-radius) !important;\n}\n\n.rounded-bottom {\n  border-bottom-right-radius: var(--bs-border-radius) !important;\n  border-bottom-left-radius: var(--bs-border-radius) !important;\n}\n\n.rounded-start {\n  border-bottom-left-radius: var(--bs-border-radius) !important;\n  border-top-left-radius: var(--bs-border-radius) !important;\n}\n\n.visible {\n  visibility: visible !important;\n}\n\n.invisible {\n  visibility: hidden !important;\n}\n\n@media (min-width: 576px) {\n  .float-sm-start {\n    float: left !important;\n  }\n  .float-sm-end {\n    float: right !important;\n  }\n  .float-sm-none {\n    float: none !important;\n  }\n  .d-sm-inline {\n    display: inline !important;\n  }\n  .d-sm-inline-block {\n    display: inline-block !important;\n  }\n  .d-sm-block {\n    display: block !important;\n  }\n  .d-sm-grid {\n    display: grid !important;\n  }\n  .d-sm-table {\n    display: table !important;\n  }\n  .d-sm-table-row {\n    display: table-row !important;\n  }\n  .d-sm-table-cell {\n    display: table-cell !important;\n  }\n  .d-sm-flex {\n    display: flex !important;\n  }\n  .d-sm-inline-flex {\n    display: inline-flex !important;\n  }\n  .d-sm-none {\n    display: none !important;\n  }\n  .flex-sm-fill {\n    flex: 1 1 auto !important;\n  }\n  .flex-sm-row {\n    flex-direction: row !important;\n  }\n  .flex-sm-column {\n    flex-direction: column !important;\n  }\n  .flex-sm-row-reverse {\n    flex-direction: row-reverse !important;\n  }\n  .flex-sm-column-reverse {\n    flex-direction: column-reverse !important;\n  }\n  .flex-sm-grow-0 {\n    flex-grow: 0 !important;\n  }\n  .flex-sm-grow-1 {\n    flex-grow: 1 !important;\n  }\n  .flex-sm-shrink-0 {\n    flex-shrink: 0 !important;\n  }\n  .flex-sm-shrink-1 {\n    flex-shrink: 1 !important;\n  }\n  .flex-sm-wrap {\n    flex-wrap: wrap !important;\n  }\n  .flex-sm-nowrap {\n    flex-wrap: nowrap !important;\n  }\n  .flex-sm-wrap-reverse {\n    flex-wrap: wrap-reverse !important;\n  }\n  .justify-content-sm-start {\n    justify-content: flex-start !important;\n  }\n  .justify-content-sm-end {\n    justify-content: flex-end !important;\n  }\n  .justify-content-sm-center {\n    justify-content: center !important;\n  }\n  .justify-content-sm-between {\n    justify-content: space-between !important;\n  }\n  .justify-content-sm-around {\n    justify-content: space-around !important;\n  }\n  .justify-content-sm-evenly {\n    justify-content: space-evenly !important;\n  }\n  .align-items-sm-start {\n    align-items: flex-start !important;\n  }\n  .align-items-sm-end {\n    align-items: flex-end !important;\n  }\n  .align-items-sm-center {\n    align-items: center !important;\n  }\n  .align-items-sm-baseline {\n    align-items: baseline !important;\n  }\n  .align-items-sm-stretch {\n    align-items: stretch !important;\n  }\n  .align-content-sm-start {\n    align-content: flex-start !important;\n  }\n  .align-content-sm-end {\n    align-content: flex-end !important;\n  }\n  .align-content-sm-center {\n    align-content: center !important;\n  }\n  .align-content-sm-between {\n    align-content: space-between !important;\n  }\n  .align-content-sm-around {\n    align-content: space-around !important;\n  }\n  .align-content-sm-stretch {\n    align-content: stretch !important;\n  }\n  .align-self-sm-auto {\n    align-self: auto !important;\n  }\n  .align-self-sm-start {\n    align-self: flex-start !important;\n  }\n  .align-self-sm-end {\n    align-self: flex-end !important;\n  }\n  .align-self-sm-center {\n    align-self: center !important;\n  }\n  .align-self-sm-baseline {\n    align-self: baseline !important;\n  }\n  .align-self-sm-stretch {\n    align-self: stretch !important;\n  }\n  .order-sm-first {\n    order: -1 !important;\n  }\n  .order-sm-0 {\n    order: 0 !important;\n  }\n  .order-sm-1 {\n    order: 1 !important;\n  }\n  .order-sm-2 {\n    order: 2 !important;\n  }\n  .order-sm-3 {\n    order: 3 !important;\n  }\n  .order-sm-4 {\n    order: 4 !important;\n  }\n  .order-sm-5 {\n    order: 5 !important;\n  }\n  .order-sm-last {\n    order: 6 !important;\n  }\n  .m-sm-0 {\n    margin: 0 !important;\n  }\n  .m-sm-1 {\n    margin: 0.25rem !important;\n  }\n  .m-sm-2 {\n    margin: 0.5rem !important;\n  }\n  .m-sm-3 {\n    margin: 1rem !important;\n  }\n  .m-sm-4 {\n    margin: 1.5rem !important;\n  }\n  .m-sm-5 {\n    margin: 3rem !important;\n  }\n  .m-sm-auto {\n    margin: auto !important;\n  }\n  .mx-sm-0 {\n    margin-right: 0 !important;\n    margin-left: 0 !important;\n  }\n  .mx-sm-1 {\n    margin-right: 0.25rem !important;\n    margin-left: 0.25rem !important;\n  }\n  .mx-sm-2 {\n    margin-right: 0.5rem !important;\n    margin-left: 0.5rem !important;\n  }\n  .mx-sm-3 {\n    margin-right: 1rem !important;\n    margin-left: 1rem !important;\n  }\n  .mx-sm-4 {\n    margin-right: 1.5rem !important;\n    margin-left: 1.5rem !important;\n  }\n  .mx-sm-5 {\n    margin-right: 3rem !important;\n    margin-left: 3rem !important;\n  }\n  .mx-sm-auto {\n    margin-right: auto !important;\n    margin-left: auto !important;\n  }\n  .my-sm-0 {\n    margin-top: 0 !important;\n    margin-bottom: 0 !important;\n  }\n  .my-sm-1 {\n    margin-top: 0.25rem !important;\n    margin-bottom: 0.25rem !important;\n  }\n  .my-sm-2 {\n    margin-top: 0.5rem !important;\n    margin-bottom: 0.5rem !important;\n  }\n  .my-sm-3 {\n    margin-top: 1rem !important;\n    margin-bottom: 1rem !important;\n  }\n  .my-sm-4 {\n    margin-top: 1.5rem !important;\n    margin-bottom: 1.5rem !important;\n  }\n  .my-sm-5 {\n    margin-top: 3rem !important;\n    margin-bottom: 3rem !important;\n  }\n  .my-sm-auto {\n    margin-top: auto !important;\n    margin-bottom: auto !important;\n  }\n  .mt-sm-0 {\n    margin-top: 0 !important;\n  }\n  .mt-sm-1 {\n    margin-top: 0.25rem !important;\n  }\n  .mt-sm-2 {\n    margin-top: 0.5rem !important;\n  }\n  .mt-sm-3 {\n    margin-top: 1rem !important;\n  }\n  .mt-sm-4 {\n    margin-top: 1.5rem !important;\n  }\n  .mt-sm-5 {\n    margin-top: 3rem !important;\n  }\n  .mt-sm-auto {\n    margin-top: auto !important;\n  }\n  .me-sm-0 {\n    margin-right: 0 !important;\n  }\n  .me-sm-1 {\n    margin-right: 0.25rem !important;\n  }\n  .me-sm-2 {\n    margin-right: 0.5rem !important;\n  }\n  .me-sm-3 {\n    margin-right: 1rem !important;\n  }\n  .me-sm-4 {\n    margin-right: 1.5rem !important;\n  }\n  .me-sm-5 {\n    margin-right: 3rem !important;\n  }\n  .me-sm-auto {\n    margin-right: auto !important;\n  }\n  .mb-sm-0 {\n    margin-bottom: 0 !important;\n  }\n  .mb-sm-1 {\n    margin-bottom: 0.25rem !important;\n  }\n  .mb-sm-2 {\n    margin-bottom: 0.5rem !important;\n  }\n  .mb-sm-3 {\n    margin-bottom: 1rem !important;\n  }\n  .mb-sm-4 {\n    margin-bottom: 1.5rem !important;\n  }\n  .mb-sm-5 {\n    margin-bottom: 3rem !important;\n  }\n  .mb-sm-auto {\n    margin-bottom: auto !important;\n  }\n  .ms-sm-0 {\n    margin-left: 0 !important;\n  }\n  .ms-sm-1 {\n    margin-left: 0.25rem !important;\n  }\n  .ms-sm-2 {\n    margin-left: 0.5rem !important;\n  }\n  .ms-sm-3 {\n    margin-left: 1rem !important;\n  }\n  .ms-sm-4 {\n    margin-left: 1.5rem !important;\n  }\n  .ms-sm-5 {\n    margin-left: 3rem !important;\n  }\n  .ms-sm-auto {\n    margin-left: auto !important;\n  }\n  .p-sm-0 {\n    padding: 0 !important;\n  }\n  .p-sm-1 {\n    padding: 0.25rem !important;\n  }\n  .p-sm-2 {\n    padding: 0.5rem !important;\n  }\n  .p-sm-3 {\n    padding: 1rem !important;\n  }\n  .p-sm-4 {\n    padding: 1.5rem !important;\n  }\n  .p-sm-5 {\n    padding: 3rem !important;\n  }\n  .px-sm-0 {\n    padding-right: 0 !important;\n    padding-left: 0 !important;\n  }\n  .px-sm-1 {\n    padding-right: 0.25rem !important;\n    padding-left: 0.25rem !important;\n  }\n  .px-sm-2 {\n    padding-right: 0.5rem !important;\n    padding-left: 0.5rem !important;\n  }\n  .px-sm-3 {\n    padding-right: 1rem !important;\n    padding-left: 1rem !important;\n  }\n  .px-sm-4 {\n    padding-right: 1.5rem !important;\n    padding-left: 1.5rem !important;\n  }\n  .px-sm-5 {\n    padding-right: 3rem !important;\n    padding-left: 3rem !important;\n  }\n  .py-sm-0 {\n    padding-top: 0 !important;\n    padding-bottom: 0 !important;\n  }\n  .py-sm-1 {\n    padding-top: 0.25rem !important;\n    padding-bottom: 0.25rem !important;\n  }\n  .py-sm-2 {\n    padding-top: 0.5rem !important;\n    padding-bottom: 0.5rem !important;\n  }\n  .py-sm-3 {\n    padding-top: 1rem !important;\n    padding-bottom: 1rem !important;\n  }\n  .py-sm-4 {\n    padding-top: 1.5rem !important;\n    padding-bottom: 1.5rem !important;\n  }\n  .py-sm-5 {\n    padding-top: 3rem !important;\n    padding-bottom: 3rem !important;\n  }\n  .pt-sm-0 {\n    padding-top: 0 !important;\n  }\n  .pt-sm-1 {\n    padding-top: 0.25rem !important;\n  }\n  .pt-sm-2 {\n    padding-top: 0.5rem !important;\n  }\n  .pt-sm-3 {\n    padding-top: 1rem !important;\n  }\n  .pt-sm-4 {\n    padding-top: 1.5rem !important;\n  }\n  .pt-sm-5 {\n    padding-top: 3rem !important;\n  }\n  .pe-sm-0 {\n    padding-right: 0 !important;\n  }\n  .pe-sm-1 {\n    padding-right: 0.25rem !important;\n  }\n  .pe-sm-2 {\n    padding-right: 0.5rem !important;\n  }\n  .pe-sm-3 {\n    padding-right: 1rem !important;\n  }\n  .pe-sm-4 {\n    padding-right: 1.5rem !important;\n  }\n  .pe-sm-5 {\n    padding-right: 3rem !important;\n  }\n  .pb-sm-0 {\n    padding-bottom: 0 !important;\n  }\n  .pb-sm-1 {\n    padding-bottom: 0.25rem !important;\n  }\n  .pb-sm-2 {\n    padding-bottom: 0.5rem !important;\n  }\n  .pb-sm-3 {\n    padding-bottom: 1rem !important;\n  }\n  .pb-sm-4 {\n    padding-bottom: 1.5rem !important;\n  }\n  .pb-sm-5 {\n    padding-bottom: 3rem !important;\n  }\n  .ps-sm-0 {\n    padding-left: 0 !important;\n  }\n  .ps-sm-1 {\n    padding-left: 0.25rem !important;\n  }\n  .ps-sm-2 {\n    padding-left: 0.5rem !important;\n  }\n  .ps-sm-3 {\n    padding-left: 1rem !important;\n  }\n  .ps-sm-4 {\n    padding-left: 1.5rem !important;\n  }\n  .ps-sm-5 {\n    padding-left: 3rem !important;\n  }\n  .gap-sm-0 {\n    gap: 0 !important;\n  }\n  .gap-sm-1 {\n    gap: 0.25rem !important;\n  }\n  .gap-sm-2 {\n    gap: 0.5rem !important;\n  }\n  .gap-sm-3 {\n    gap: 1rem !important;\n  }\n  .gap-sm-4 {\n    gap: 1.5rem !important;\n  }\n  .gap-sm-5 {\n    gap: 3rem !important;\n  }\n  .text-sm-start {\n    text-align: left !important;\n  }\n  .text-sm-end {\n    text-align: right !important;\n  }\n  .text-sm-center {\n    text-align: center !important;\n  }\n}\n@media (min-width: 768px) {\n  .float-md-start {\n    float: left !important;\n  }\n  .float-md-end {\n    float: right !important;\n  }\n  .float-md-none {\n    float: none !important;\n  }\n  .d-md-inline {\n    display: inline !important;\n  }\n  .d-md-inline-block {\n    display: inline-block !important;\n  }\n  .d-md-block {\n    display: block !important;\n  }\n  .d-md-grid {\n    display: grid !important;\n  }\n  .d-md-table {\n    display: table !important;\n  }\n  .d-md-table-row {\n    display: table-row !important;\n  }\n  .d-md-table-cell {\n    display: table-cell !important;\n  }\n  .d-md-flex {\n    display: flex !important;\n  }\n  .d-md-inline-flex {\n    display: inline-flex !important;\n  }\n  .d-md-none {\n    display: none !important;\n  }\n  .flex-md-fill {\n    flex: 1 1 auto !important;\n  }\n  .flex-md-row {\n    flex-direction: row !important;\n  }\n  .flex-md-column {\n    flex-direction: column !important;\n  }\n  .flex-md-row-reverse {\n    flex-direction: row-reverse !important;\n  }\n  .flex-md-column-reverse {\n    flex-direction: column-reverse !important;\n  }\n  .flex-md-grow-0 {\n    flex-grow: 0 !important;\n  }\n  .flex-md-grow-1 {\n    flex-grow: 1 !important;\n  }\n  .flex-md-shrink-0 {\n    flex-shrink: 0 !important;\n  }\n  .flex-md-shrink-1 {\n    flex-shrink: 1 !important;\n  }\n  .flex-md-wrap {\n    flex-wrap: wrap !important;\n  }\n  .flex-md-nowrap {\n    flex-wrap: nowrap !important;\n  }\n  .flex-md-wrap-reverse {\n    flex-wrap: wrap-reverse !important;\n  }\n  .justify-content-md-start {\n    justify-content: flex-start !important;\n  }\n  .justify-content-md-end {\n    justify-content: flex-end !important;\n  }\n  .justify-content-md-center {\n    justify-content: center !important;\n  }\n  .justify-content-md-between {\n    justify-content: space-between !important;\n  }\n  .justify-content-md-around {\n    justify-content: space-around !important;\n  }\n  .justify-content-md-evenly {\n    justify-content: space-evenly !important;\n  }\n  .align-items-md-start {\n    align-items: flex-start !important;\n  }\n  .align-items-md-end {\n    align-items: flex-end !important;\n  }\n  .align-items-md-center {\n    align-items: center !important;\n  }\n  .align-items-md-baseline {\n    align-items: baseline !important;\n  }\n  .align-items-md-stretch {\n    align-items: stretch !important;\n  }\n  .align-content-md-start {\n    align-content: flex-start !important;\n  }\n  .align-content-md-end {\n    align-content: flex-end !important;\n  }\n  .align-content-md-center {\n    align-content: center !important;\n  }\n  .align-content-md-between {\n    align-content: space-between !important;\n  }\n  .align-content-md-around {\n    align-content: space-around !important;\n  }\n  .align-content-md-stretch {\n    align-content: stretch !important;\n  }\n  .align-self-md-auto {\n    align-self: auto !important;\n  }\n  .align-self-md-start {\n    align-self: flex-start !important;\n  }\n  .align-self-md-end {\n    align-self: flex-end !important;\n  }\n  .align-self-md-center {\n    align-self: center !important;\n  }\n  .align-self-md-baseline {\n    align-self: baseline !important;\n  }\n  .align-self-md-stretch {\n    align-self: stretch !important;\n  }\n  .order-md-first {\n    order: -1 !important;\n  }\n  .order-md-0 {\n    order: 0 !important;\n  }\n  .order-md-1 {\n    order: 1 !important;\n  }\n  .order-md-2 {\n    order: 2 !important;\n  }\n  .order-md-3 {\n    order: 3 !important;\n  }\n  .order-md-4 {\n    order: 4 !important;\n  }\n  .order-md-5 {\n    order: 5 !important;\n  }\n  .order-md-last {\n    order: 6 !important;\n  }\n  .m-md-0 {\n    margin: 0 !important;\n  }\n  .m-md-1 {\n    margin: 0.25rem !important;\n  }\n  .m-md-2 {\n    margin: 0.5rem !important;\n  }\n  .m-md-3 {\n    margin: 1rem !important;\n  }\n  .m-md-4 {\n    margin: 1.5rem !important;\n  }\n  .m-md-5 {\n    margin: 3rem !important;\n  }\n  .m-md-auto {\n    margin: auto !important;\n  }\n  .mx-md-0 {\n    margin-right: 0 !important;\n    margin-left: 0 !important;\n  }\n  .mx-md-1 {\n    margin-right: 0.25rem !important;\n    margin-left: 0.25rem !important;\n  }\n  .mx-md-2 {\n    margin-right: 0.5rem !important;\n    margin-left: 0.5rem !important;\n  }\n  .mx-md-3 {\n    margin-right: 1rem !important;\n    margin-left: 1rem !important;\n  }\n  .mx-md-4 {\n    margin-right: 1.5rem !important;\n    margin-left: 1.5rem !important;\n  }\n  .mx-md-5 {\n    margin-right: 3rem !important;\n    margin-left: 3rem !important;\n  }\n  .mx-md-auto {\n    margin-right: auto !important;\n    margin-left: auto !important;\n  }\n  .my-md-0 {\n    margin-top: 0 !important;\n    margin-bottom: 0 !important;\n  }\n  .my-md-1 {\n    margin-top: 0.25rem !important;\n    margin-bottom: 0.25rem !important;\n  }\n  .my-md-2 {\n    margin-top: 0.5rem !important;\n    margin-bottom: 0.5rem !important;\n  }\n  .my-md-3 {\n    margin-top: 1rem !important;\n    margin-bottom: 1rem !important;\n  }\n  .my-md-4 {\n    margin-top: 1.5rem !important;\n    margin-bottom: 1.5rem !important;\n  }\n  .my-md-5 {\n    margin-top: 3rem !important;\n    margin-bottom: 3rem !important;\n  }\n  .my-md-auto {\n    margin-top: auto !important;\n    margin-bottom: auto !important;\n  }\n  .mt-md-0 {\n    margin-top: 0 !important;\n  }\n  .mt-md-1 {\n    margin-top: 0.25rem !important;\n  }\n  .mt-md-2 {\n    margin-top: 0.5rem !important;\n  }\n  .mt-md-3 {\n    margin-top: 1rem !important;\n  }\n  .mt-md-4 {\n    margin-top: 1.5rem !important;\n  }\n  .mt-md-5 {\n    margin-top: 3rem !important;\n  }\n  .mt-md-auto {\n    margin-top: auto !important;\n  }\n  .me-md-0 {\n    margin-right: 0 !important;\n  }\n  .me-md-1 {\n    margin-right: 0.25rem !important;\n  }\n  .me-md-2 {\n    margin-right: 0.5rem !important;\n  }\n  .me-md-3 {\n    margin-right: 1rem !important;\n  }\n  .me-md-4 {\n    margin-right: 1.5rem !important;\n  }\n  .me-md-5 {\n    margin-right: 3rem !important;\n  }\n  .me-md-auto {\n    margin-right: auto !important;\n  }\n  .mb-md-0 {\n    margin-bottom: 0 !important;\n  }\n  .mb-md-1 {\n    margin-bottom: 0.25rem !important;\n  }\n  .mb-md-2 {\n    margin-bottom: 0.5rem !important;\n  }\n  .mb-md-3 {\n    margin-bottom: 1rem !important;\n  }\n  .mb-md-4 {\n    margin-bottom: 1.5rem !important;\n  }\n  .mb-md-5 {\n    margin-bottom: 3rem !important;\n  }\n  .mb-md-auto {\n    margin-bottom: auto !important;\n  }\n  .ms-md-0 {\n    margin-left: 0 !important;\n  }\n  .ms-md-1 {\n    margin-left: 0.25rem !important;\n  }\n  .ms-md-2 {\n    margin-left: 0.5rem !important;\n  }\n  .ms-md-3 {\n    margin-left: 1rem !important;\n  }\n  .ms-md-4 {\n    margin-left: 1.5rem !important;\n  }\n  .ms-md-5 {\n    margin-left: 3rem !important;\n  }\n  .ms-md-auto {\n    margin-left: auto !important;\n  }\n  .p-md-0 {\n    padding: 0 !important;\n  }\n  .p-md-1 {\n    padding: 0.25rem !important;\n  }\n  .p-md-2 {\n    padding: 0.5rem !important;\n  }\n  .p-md-3 {\n    padding: 1rem !important;\n  }\n  .p-md-4 {\n    padding: 1.5rem !important;\n  }\n  .p-md-5 {\n    padding: 3rem !important;\n  }\n  .px-md-0 {\n    padding-right: 0 !important;\n    padding-left: 0 !important;\n  }\n  .px-md-1 {\n    padding-right: 0.25rem !important;\n    padding-left: 0.25rem !important;\n  }\n  .px-md-2 {\n    padding-right: 0.5rem !important;\n    padding-left: 0.5rem !important;\n  }\n  .px-md-3 {\n    padding-right: 1rem !important;\n    padding-left: 1rem !important;\n  }\n  .px-md-4 {\n    padding-right: 1.5rem !important;\n    padding-left: 1.5rem !important;\n  }\n  .px-md-5 {\n    padding-right: 3rem !important;\n    padding-left: 3rem !important;\n  }\n  .py-md-0 {\n    padding-top: 0 !important;\n    padding-bottom: 0 !important;\n  }\n  .py-md-1 {\n    padding-top: 0.25rem !important;\n    padding-bottom: 0.25rem !important;\n  }\n  .py-md-2 {\n    padding-top: 0.5rem !important;\n    padding-bottom: 0.5rem !important;\n  }\n  .py-md-3 {\n    padding-top: 1rem !important;\n    padding-bottom: 1rem !important;\n  }\n  .py-md-4 {\n    padding-top: 1.5rem !important;\n    padding-bottom: 1.5rem !important;\n  }\n  .py-md-5 {\n    padding-top: 3rem !important;\n    padding-bottom: 3rem !important;\n  }\n  .pt-md-0 {\n    padding-top: 0 !important;\n  }\n  .pt-md-1 {\n    padding-top: 0.25rem !important;\n  }\n  .pt-md-2 {\n    padding-top: 0.5rem !important;\n  }\n  .pt-md-3 {\n    padding-top: 1rem !important;\n  }\n  .pt-md-4 {\n    padding-top: 1.5rem !important;\n  }\n  .pt-md-5 {\n    padding-top: 3rem !important;\n  }\n  .pe-md-0 {\n    padding-right: 0 !important;\n  }\n  .pe-md-1 {\n    padding-right: 0.25rem !important;\n  }\n  .pe-md-2 {\n    padding-right: 0.5rem !important;\n  }\n  .pe-md-3 {\n    padding-right: 1rem !important;\n  }\n  .pe-md-4 {\n    padding-right: 1.5rem !important;\n  }\n  .pe-md-5 {\n    padding-right: 3rem !important;\n  }\n  .pb-md-0 {\n    padding-bottom: 0 !important;\n  }\n  .pb-md-1 {\n    padding-bottom: 0.25rem !important;\n  }\n  .pb-md-2 {\n    padding-bottom: 0.5rem !important;\n  }\n  .pb-md-3 {\n    padding-bottom: 1rem !important;\n  }\n  .pb-md-4 {\n    padding-bottom: 1.5rem !important;\n  }\n  .pb-md-5 {\n    padding-bottom: 3rem !important;\n  }\n  .ps-md-0 {\n    padding-left: 0 !important;\n  }\n  .ps-md-1 {\n    padding-left: 0.25rem !important;\n  }\n  .ps-md-2 {\n    padding-left: 0.5rem !important;\n  }\n  .ps-md-3 {\n    padding-left: 1rem !important;\n  }\n  .ps-md-4 {\n    padding-left: 1.5rem !important;\n  }\n  .ps-md-5 {\n    padding-left: 3rem !important;\n  }\n  .gap-md-0 {\n    gap: 0 !important;\n  }\n  .gap-md-1 {\n    gap: 0.25rem !important;\n  }\n  .gap-md-2 {\n    gap: 0.5rem !important;\n  }\n  .gap-md-3 {\n    gap: 1rem !important;\n  }\n  .gap-md-4 {\n    gap: 1.5rem !important;\n  }\n  .gap-md-5 {\n    gap: 3rem !important;\n  }\n  .text-md-start {\n    text-align: left !important;\n  }\n  .text-md-end {\n    text-align: right !important;\n  }\n  .text-md-center {\n    text-align: center !important;\n  }\n}\n@media (min-width: 992px) {\n  .float-lg-start {\n    float: left !important;\n  }\n  .float-lg-end {\n    float: right !important;\n  }\n  .float-lg-none {\n    float: none !important;\n  }\n  .d-lg-inline {\n    display: inline !important;\n  }\n  .d-lg-inline-block {\n    display: inline-block !important;\n  }\n  .d-lg-block {\n    display: block !important;\n  }\n  .d-lg-grid {\n    display: grid !important;\n  }\n  .d-lg-table {\n    display: table !important;\n  }\n  .d-lg-table-row {\n    display: table-row !important;\n  }\n  .d-lg-table-cell {\n    display: table-cell !important;\n  }\n  .d-lg-flex {\n    display: flex !important;\n  }\n  .d-lg-inline-flex {\n    display: inline-flex !important;\n  }\n  .d-lg-none {\n    display: none !important;\n  }\n  .flex-lg-fill {\n    flex: 1 1 auto !important;\n  }\n  .flex-lg-row {\n    flex-direction: row !important;\n  }\n  .flex-lg-column {\n    flex-direction: column !important;\n  }\n  .flex-lg-row-reverse {\n    flex-direction: row-reverse !important;\n  }\n  .flex-lg-column-reverse {\n    flex-direction: column-reverse !important;\n  }\n  .flex-lg-grow-0 {\n    flex-grow: 0 !important;\n  }\n  .flex-lg-grow-1 {\n    flex-grow: 1 !important;\n  }\n  .flex-lg-shrink-0 {\n    flex-shrink: 0 !important;\n  }\n  .flex-lg-shrink-1 {\n    flex-shrink: 1 !important;\n  }\n  .flex-lg-wrap {\n    flex-wrap: wrap !important;\n  }\n  .flex-lg-nowrap {\n    flex-wrap: nowrap !important;\n  }\n  .flex-lg-wrap-reverse {\n    flex-wrap: wrap-reverse !important;\n  }\n  .justify-content-lg-start {\n    justify-content: flex-start !important;\n  }\n  .justify-content-lg-end {\n    justify-content: flex-end !important;\n  }\n  .justify-content-lg-center {\n    justify-content: center !important;\n  }\n  .justify-content-lg-between {\n    justify-content: space-between !important;\n  }\n  .justify-content-lg-around {\n    justify-content: space-around !important;\n  }\n  .justify-content-lg-evenly {\n    justify-content: space-evenly !important;\n  }\n  .align-items-lg-start {\n    align-items: flex-start !important;\n  }\n  .align-items-lg-end {\n    align-items: flex-end !important;\n  }\n  .align-items-lg-center {\n    align-items: center !important;\n  }\n  .align-items-lg-baseline {\n    align-items: baseline !important;\n  }\n  .align-items-lg-stretch {\n    align-items: stretch !important;\n  }\n  .align-content-lg-start {\n    align-content: flex-start !important;\n  }\n  .align-content-lg-end {\n    align-content: flex-end !important;\n  }\n  .align-content-lg-center {\n    align-content: center !important;\n  }\n  .align-content-lg-between {\n    align-content: space-between !important;\n  }\n  .align-content-lg-around {\n    align-content: space-around !important;\n  }\n  .align-content-lg-stretch {\n    align-content: stretch !important;\n  }\n  .align-self-lg-auto {\n    align-self: auto !important;\n  }\n  .align-self-lg-start {\n    align-self: flex-start !important;\n  }\n  .align-self-lg-end {\n    align-self: flex-end !important;\n  }\n  .align-self-lg-center {\n    align-self: center !important;\n  }\n  .align-self-lg-baseline {\n    align-self: baseline !important;\n  }\n  .align-self-lg-stretch {\n    align-self: stretch !important;\n  }\n  .order-lg-first {\n    order: -1 !important;\n  }\n  .order-lg-0 {\n    order: 0 !important;\n  }\n  .order-lg-1 {\n    order: 1 !important;\n  }\n  .order-lg-2 {\n    order: 2 !important;\n  }\n  .order-lg-3 {\n    order: 3 !important;\n  }\n  .order-lg-4 {\n    order: 4 !important;\n  }\n  .order-lg-5 {\n    order: 5 !important;\n  }\n  .order-lg-last {\n    order: 6 !important;\n  }\n  .m-lg-0 {\n    margin: 0 !important;\n  }\n  .m-lg-1 {\n    margin: 0.25rem !important;\n  }\n  .m-lg-2 {\n    margin: 0.5rem !important;\n  }\n  .m-lg-3 {\n    margin: 1rem !important;\n  }\n  .m-lg-4 {\n    margin: 1.5rem !important;\n  }\n  .m-lg-5 {\n    margin: 3rem !important;\n  }\n  .m-lg-auto {\n    margin: auto !important;\n  }\n  .mx-lg-0 {\n    margin-right: 0 !important;\n    margin-left: 0 !important;\n  }\n  .mx-lg-1 {\n    margin-right: 0.25rem !important;\n    margin-left: 0.25rem !important;\n  }\n  .mx-lg-2 {\n    margin-right: 0.5rem !important;\n    margin-left: 0.5rem !important;\n  }\n  .mx-lg-3 {\n    margin-right: 1rem !important;\n    margin-left: 1rem !important;\n  }\n  .mx-lg-4 {\n    margin-right: 1.5rem !important;\n    margin-left: 1.5rem !important;\n  }\n  .mx-lg-5 {\n    margin-right: 3rem !important;\n    margin-left: 3rem !important;\n  }\n  .mx-lg-auto {\n    margin-right: auto !important;\n    margin-left: auto !important;\n  }\n  .my-lg-0 {\n    margin-top: 0 !important;\n    margin-bottom: 0 !important;\n  }\n  .my-lg-1 {\n    margin-top: 0.25rem !important;\n    margin-bottom: 0.25rem !important;\n  }\n  .my-lg-2 {\n    margin-top: 0.5rem !important;\n    margin-bottom: 0.5rem !important;\n  }\n  .my-lg-3 {\n    margin-top: 1rem !important;\n    margin-bottom: 1rem !important;\n  }\n  .my-lg-4 {\n    margin-top: 1.5rem !important;\n    margin-bottom: 1.5rem !important;\n  }\n  .my-lg-5 {\n    margin-top: 3rem !important;\n    margin-bottom: 3rem !important;\n  }\n  .my-lg-auto {\n    margin-top: auto !important;\n    margin-bottom: auto !important;\n  }\n  .mt-lg-0 {\n    margin-top: 0 !important;\n  }\n  .mt-lg-1 {\n    margin-top: 0.25rem !important;\n  }\n  .mt-lg-2 {\n    margin-top: 0.5rem !important;\n  }\n  .mt-lg-3 {\n    margin-top: 1rem !important;\n  }\n  .mt-lg-4 {\n    margin-top: 1.5rem !important;\n  }\n  .mt-lg-5 {\n    margin-top: 3rem !important;\n  }\n  .mt-lg-auto {\n    margin-top: auto !important;\n  }\n  .me-lg-0 {\n    margin-right: 0 !important;\n  }\n  .me-lg-1 {\n    margin-right: 0.25rem !important;\n  }\n  .me-lg-2 {\n    margin-right: 0.5rem !important;\n  }\n  .me-lg-3 {\n    margin-right: 1rem !important;\n  }\n  .me-lg-4 {\n    margin-right: 1.5rem !important;\n  }\n  .me-lg-5 {\n    margin-right: 3rem !important;\n  }\n  .me-lg-auto {\n    margin-right: auto !important;\n  }\n  .mb-lg-0 {\n    margin-bottom: 0 !important;\n  }\n  .mb-lg-1 {\n    margin-bottom: 0.25rem !important;\n  }\n  .mb-lg-2 {\n    margin-bottom: 0.5rem !important;\n  }\n  .mb-lg-3 {\n    margin-bottom: 1rem !important;\n  }\n  .mb-lg-4 {\n    margin-bottom: 1.5rem !important;\n  }\n  .mb-lg-5 {\n    margin-bottom: 3rem !important;\n  }\n  .mb-lg-auto {\n    margin-bottom: auto !important;\n  }\n  .ms-lg-0 {\n    margin-left: 0 !important;\n  }\n  .ms-lg-1 {\n    margin-left: 0.25rem !important;\n  }\n  .ms-lg-2 {\n    margin-left: 0.5rem !important;\n  }\n  .ms-lg-3 {\n    margin-left: 1rem !important;\n  }\n  .ms-lg-4 {\n    margin-left: 1.5rem !important;\n  }\n  .ms-lg-5 {\n    margin-left: 3rem !important;\n  }\n  .ms-lg-auto {\n    margin-left: auto !important;\n  }\n  .p-lg-0 {\n    padding: 0 !important;\n  }\n  .p-lg-1 {\n    padding: 0.25rem !important;\n  }\n  .p-lg-2 {\n    padding: 0.5rem !important;\n  }\n  .p-lg-3 {\n    padding: 1rem !important;\n  }\n  .p-lg-4 {\n    padding: 1.5rem !important;\n  }\n  .p-lg-5 {\n    padding: 3rem !important;\n  }\n  .px-lg-0 {\n    padding-right: 0 !important;\n    padding-left: 0 !important;\n  }\n  .px-lg-1 {\n    padding-right: 0.25rem !important;\n    padding-left: 0.25rem !important;\n  }\n  .px-lg-2 {\n    padding-right: 0.5rem !important;\n    padding-left: 0.5rem !important;\n  }\n  .px-lg-3 {\n    padding-right: 1rem !important;\n    padding-left: 1rem !important;\n  }\n  .px-lg-4 {\n    padding-right: 1.5rem !important;\n    padding-left: 1.5rem !important;\n  }\n  .px-lg-5 {\n    padding-right: 3rem !important;\n    padding-left: 3rem !important;\n  }\n  .py-lg-0 {\n    padding-top: 0 !important;\n    padding-bottom: 0 !important;\n  }\n  .py-lg-1 {\n    padding-top: 0.25rem !important;\n    padding-bottom: 0.25rem !important;\n  }\n  .py-lg-2 {\n    padding-top: 0.5rem !important;\n    padding-bottom: 0.5rem !important;\n  }\n  .py-lg-3 {\n    padding-top: 1rem !important;\n    padding-bottom: 1rem !important;\n  }\n  .py-lg-4 {\n    padding-top: 1.5rem !important;\n    padding-bottom: 1.5rem !important;\n  }\n  .py-lg-5 {\n    padding-top: 3rem !important;\n    padding-bottom: 3rem !important;\n  }\n  .pt-lg-0 {\n    padding-top: 0 !important;\n  }\n  .pt-lg-1 {\n    padding-top: 0.25rem !important;\n  }\n  .pt-lg-2 {\n    padding-top: 0.5rem !important;\n  }\n  .pt-lg-3 {\n    padding-top: 1rem !important;\n  }\n  .pt-lg-4 {\n    padding-top: 1.5rem !important;\n  }\n  .pt-lg-5 {\n    padding-top: 3rem !important;\n  }\n  .pe-lg-0 {\n    padding-right: 0 !important;\n  }\n  .pe-lg-1 {\n    padding-right: 0.25rem !important;\n  }\n  .pe-lg-2 {\n    padding-right: 0.5rem !important;\n  }\n  .pe-lg-3 {\n    padding-right: 1rem !important;\n  }\n  .pe-lg-4 {\n    padding-right: 1.5rem !important;\n  }\n  .pe-lg-5 {\n    padding-right: 3rem !important;\n  }\n  .pb-lg-0 {\n    padding-bottom: 0 !important;\n  }\n  .pb-lg-1 {\n    padding-bottom: 0.25rem !important;\n  }\n  .pb-lg-2 {\n    padding-bottom: 0.5rem !important;\n  }\n  .pb-lg-3 {\n    padding-bottom: 1rem !important;\n  }\n  .pb-lg-4 {\n    padding-bottom: 1.5rem !important;\n  }\n  .pb-lg-5 {\n    padding-bottom: 3rem !important;\n  }\n  .ps-lg-0 {\n    padding-left: 0 !important;\n  }\n  .ps-lg-1 {\n    padding-left: 0.25rem !important;\n  }\n  .ps-lg-2 {\n    padding-left: 0.5rem !important;\n  }\n  .ps-lg-3 {\n    padding-left: 1rem !important;\n  }\n  .ps-lg-4 {\n    padding-left: 1.5rem !important;\n  }\n  .ps-lg-5 {\n    padding-left: 3rem !important;\n  }\n  .gap-lg-0 {\n    gap: 0 !important;\n  }\n  .gap-lg-1 {\n    gap: 0.25rem !important;\n  }\n  .gap-lg-2 {\n    gap: 0.5rem !important;\n  }\n  .gap-lg-3 {\n    gap: 1rem !important;\n  }\n  .gap-lg-4 {\n    gap: 1.5rem !important;\n  }\n  .gap-lg-5 {\n    gap: 3rem !important;\n  }\n  .text-lg-start {\n    text-align: left !important;\n  }\n  .text-lg-end {\n    text-align: right !important;\n  }\n  .text-lg-center {\n    text-align: center !important;\n  }\n}\n@media (min-width: 1200px) {\n  .float-xl-start {\n    float: left !important;\n  }\n  .float-xl-end {\n    float: right !important;\n  }\n  .float-xl-none {\n    float: none !important;\n  }\n  .d-xl-inline {\n    display: inline !important;\n  }\n  .d-xl-inline-block {\n    display: inline-block !important;\n  }\n  .d-xl-block {\n    display: block !important;\n  }\n  .d-xl-grid {\n    display: grid !important;\n  }\n  .d-xl-table {\n    display: table !important;\n  }\n  .d-xl-table-row {\n    display: table-row !important;\n  }\n  .d-xl-table-cell {\n    display: table-cell !important;\n  }\n  .d-xl-flex {\n    display: flex !important;\n  }\n  .d-xl-inline-flex {\n    display: inline-flex !important;\n  }\n  .d-xl-none {\n    display: none !important;\n  }\n  .flex-xl-fill {\n    flex: 1 1 auto !important;\n  }\n  .flex-xl-row {\n    flex-direction: row !important;\n  }\n  .flex-xl-column {\n    flex-direction: column !important;\n  }\n  .flex-xl-row-reverse {\n    flex-direction: row-reverse !important;\n  }\n  .flex-xl-column-reverse {\n    flex-direction: column-reverse !important;\n  }\n  .flex-xl-grow-0 {\n    flex-grow: 0 !important;\n  }\n  .flex-xl-grow-1 {\n    flex-grow: 1 !important;\n  }\n  .flex-xl-shrink-0 {\n    flex-shrink: 0 !important;\n  }\n  .flex-xl-shrink-1 {\n    flex-shrink: 1 !important;\n  }\n  .flex-xl-wrap {\n    flex-wrap: wrap !important;\n  }\n  .flex-xl-nowrap {\n    flex-wrap: nowrap !important;\n  }\n  .flex-xl-wrap-reverse {\n    flex-wrap: wrap-reverse !important;\n  }\n  .justify-content-xl-start {\n    justify-content: flex-start !important;\n  }\n  .justify-content-xl-end {\n    justify-content: flex-end !important;\n  }\n  .justify-content-xl-center {\n    justify-content: center !important;\n  }\n  .justify-content-xl-between {\n    justify-content: space-between !important;\n  }\n  .justify-content-xl-around {\n    justify-content: space-around !important;\n  }\n  .justify-content-xl-evenly {\n    justify-content: space-evenly !important;\n  }\n  .align-items-xl-start {\n    align-items: flex-start !important;\n  }\n  .align-items-xl-end {\n    align-items: flex-end !important;\n  }\n  .align-items-xl-center {\n    align-items: center !important;\n  }\n  .align-items-xl-baseline {\n    align-items: baseline !important;\n  }\n  .align-items-xl-stretch {\n    align-items: stretch !important;\n  }\n  .align-content-xl-start {\n    align-content: flex-start !important;\n  }\n  .align-content-xl-end {\n    align-content: flex-end !important;\n  }\n  .align-content-xl-center {\n    align-content: center !important;\n  }\n  .align-content-xl-between {\n    align-content: space-between !important;\n  }\n  .align-content-xl-around {\n    align-content: space-around !important;\n  }\n  .align-content-xl-stretch {\n    align-content: stretch !important;\n  }\n  .align-self-xl-auto {\n    align-self: auto !important;\n  }\n  .align-self-xl-start {\n    align-self: flex-start !important;\n  }\n  .align-self-xl-end {\n    align-self: flex-end !important;\n  }\n  .align-self-xl-center {\n    align-self: center !important;\n  }\n  .align-self-xl-baseline {\n    align-self: baseline !important;\n  }\n  .align-self-xl-stretch {\n    align-self: stretch !important;\n  }\n  .order-xl-first {\n    order: -1 !important;\n  }\n  .order-xl-0 {\n    order: 0 !important;\n  }\n  .order-xl-1 {\n    order: 1 !important;\n  }\n  .order-xl-2 {\n    order: 2 !important;\n  }\n  .order-xl-3 {\n    order: 3 !important;\n  }\n  .order-xl-4 {\n    order: 4 !important;\n  }\n  .order-xl-5 {\n    order: 5 !important;\n  }\n  .order-xl-last {\n    order: 6 !important;\n  }\n  .m-xl-0 {\n    margin: 0 !important;\n  }\n  .m-xl-1 {\n    margin: 0.25rem !important;\n  }\n  .m-xl-2 {\n    margin: 0.5rem !important;\n  }\n  .m-xl-3 {\n    margin: 1rem !important;\n  }\n  .m-xl-4 {\n    margin: 1.5rem !important;\n  }\n  .m-xl-5 {\n    margin: 3rem !important;\n  }\n  .m-xl-auto {\n    margin: auto !important;\n  }\n  .mx-xl-0 {\n    margin-right: 0 !important;\n    margin-left: 0 !important;\n  }\n  .mx-xl-1 {\n    margin-right: 0.25rem !important;\n    margin-left: 0.25rem !important;\n  }\n  .mx-xl-2 {\n    margin-right: 0.5rem !important;\n    margin-left: 0.5rem !important;\n  }\n  .mx-xl-3 {\n    margin-right: 1rem !important;\n    margin-left: 1rem !important;\n  }\n  .mx-xl-4 {\n    margin-right: 1.5rem !important;\n    margin-left: 1.5rem !important;\n  }\n  .mx-xl-5 {\n    margin-right: 3rem !important;\n    margin-left: 3rem !important;\n  }\n  .mx-xl-auto {\n    margin-right: auto !important;\n    margin-left: auto !important;\n  }\n  .my-xl-0 {\n    margin-top: 0 !important;\n    margin-bottom: 0 !important;\n  }\n  .my-xl-1 {\n    margin-top: 0.25rem !important;\n    margin-bottom: 0.25rem !important;\n  }\n  .my-xl-2 {\n    margin-top: 0.5rem !important;\n    margin-bottom: 0.5rem !important;\n  }\n  .my-xl-3 {\n    margin-top: 1rem !important;\n    margin-bottom: 1rem !important;\n  }\n  .my-xl-4 {\n    margin-top: 1.5rem !important;\n    margin-bottom: 1.5rem !important;\n  }\n  .my-xl-5 {\n    margin-top: 3rem !important;\n    margin-bottom: 3rem !important;\n  }\n  .my-xl-auto {\n    margin-top: auto !important;\n    margin-bottom: auto !important;\n  }\n  .mt-xl-0 {\n    margin-top: 0 !important;\n  }\n  .mt-xl-1 {\n    margin-top: 0.25rem !important;\n  }\n  .mt-xl-2 {\n    margin-top: 0.5rem !important;\n  }\n  .mt-xl-3 {\n    margin-top: 1rem !important;\n  }\n  .mt-xl-4 {\n    margin-top: 1.5rem !important;\n  }\n  .mt-xl-5 {\n    margin-top: 3rem !important;\n  }\n  .mt-xl-auto {\n    margin-top: auto !important;\n  }\n  .me-xl-0 {\n    margin-right: 0 !important;\n  }\n  .me-xl-1 {\n    margin-right: 0.25rem !important;\n  }\n  .me-xl-2 {\n    margin-right: 0.5rem !important;\n  }\n  .me-xl-3 {\n    margin-right: 1rem !important;\n  }\n  .me-xl-4 {\n    margin-right: 1.5rem !important;\n  }\n  .me-xl-5 {\n    margin-right: 3rem !important;\n  }\n  .me-xl-auto {\n    margin-right: auto !important;\n  }\n  .mb-xl-0 {\n    margin-bottom: 0 !important;\n  }\n  .mb-xl-1 {\n    margin-bottom: 0.25rem !important;\n  }\n  .mb-xl-2 {\n    margin-bottom: 0.5rem !important;\n  }\n  .mb-xl-3 {\n    margin-bottom: 1rem !important;\n  }\n  .mb-xl-4 {\n    margin-bottom: 1.5rem !important;\n  }\n  .mb-xl-5 {\n    margin-bottom: 3rem !important;\n  }\n  .mb-xl-auto {\n    margin-bottom: auto !important;\n  }\n  .ms-xl-0 {\n    margin-left: 0 !important;\n  }\n  .ms-xl-1 {\n    margin-left: 0.25rem !important;\n  }\n  .ms-xl-2 {\n    margin-left: 0.5rem !important;\n  }\n  .ms-xl-3 {\n    margin-left: 1rem !important;\n  }\n  .ms-xl-4 {\n    margin-left: 1.5rem !important;\n  }\n  .ms-xl-5 {\n    margin-left: 3rem !important;\n  }\n  .ms-xl-auto {\n    margin-left: auto !important;\n  }\n  .p-xl-0 {\n    padding: 0 !important;\n  }\n  .p-xl-1 {\n    padding: 0.25rem !important;\n  }\n  .p-xl-2 {\n    padding: 0.5rem !important;\n  }\n  .p-xl-3 {\n    padding: 1rem !important;\n  }\n  .p-xl-4 {\n    padding: 1.5rem !important;\n  }\n  .p-xl-5 {\n    padding: 3rem !important;\n  }\n  .px-xl-0 {\n    padding-right: 0 !important;\n    padding-left: 0 !important;\n  }\n  .px-xl-1 {\n    padding-right: 0.25rem !important;\n    padding-left: 0.25rem !important;\n  }\n  .px-xl-2 {\n    padding-right: 0.5rem !important;\n    padding-left: 0.5rem !important;\n  }\n  .px-xl-3 {\n    padding-right: 1rem !important;\n    padding-left: 1rem !important;\n  }\n  .px-xl-4 {\n    padding-right: 1.5rem !important;\n    padding-left: 1.5rem !important;\n  }\n  .px-xl-5 {\n    padding-right: 3rem !important;\n    padding-left: 3rem !important;\n  }\n  .py-xl-0 {\n    padding-top: 0 !important;\n    padding-bottom: 0 !important;\n  }\n  .py-xl-1 {\n    padding-top: 0.25rem !important;\n    padding-bottom: 0.25rem !important;\n  }\n  .py-xl-2 {\n    padding-top: 0.5rem !important;\n    padding-bottom: 0.5rem !important;\n  }\n  .py-xl-3 {\n    padding-top: 1rem !important;\n    padding-bottom: 1rem !important;\n  }\n  .py-xl-4 {\n    padding-top: 1.5rem !important;\n    padding-bottom: 1.5rem !important;\n  }\n  .py-xl-5 {\n    padding-top: 3rem !important;\n    padding-bottom: 3rem !important;\n  }\n  .pt-xl-0 {\n    padding-top: 0 !important;\n  }\n  .pt-xl-1 {\n    padding-top: 0.25rem !important;\n  }\n  .pt-xl-2 {\n    padding-top: 0.5rem !important;\n  }\n  .pt-xl-3 {\n    padding-top: 1rem !important;\n  }\n  .pt-xl-4 {\n    padding-top: 1.5rem !important;\n  }\n  .pt-xl-5 {\n    padding-top: 3rem !important;\n  }\n  .pe-xl-0 {\n    padding-right: 0 !important;\n  }\n  .pe-xl-1 {\n    padding-right: 0.25rem !important;\n  }\n  .pe-xl-2 {\n    padding-right: 0.5rem !important;\n  }\n  .pe-xl-3 {\n    padding-right: 1rem !important;\n  }\n  .pe-xl-4 {\n    padding-right: 1.5rem !important;\n  }\n  .pe-xl-5 {\n    padding-right: 3rem !important;\n  }\n  .pb-xl-0 {\n    padding-bottom: 0 !important;\n  }\n  .pb-xl-1 {\n    padding-bottom: 0.25rem !important;\n  }\n  .pb-xl-2 {\n    padding-bottom: 0.5rem !important;\n  }\n  .pb-xl-3 {\n    padding-bottom: 1rem !important;\n  }\n  .pb-xl-4 {\n    padding-bottom: 1.5rem !important;\n  }\n  .pb-xl-5 {\n    padding-bottom: 3rem !important;\n  }\n  .ps-xl-0 {\n    padding-left: 0 !important;\n  }\n  .ps-xl-1 {\n    padding-left: 0.25rem !important;\n  }\n  .ps-xl-2 {\n    padding-left: 0.5rem !important;\n  }\n  .ps-xl-3 {\n    padding-left: 1rem !important;\n  }\n  .ps-xl-4 {\n    padding-left: 1.5rem !important;\n  }\n  .ps-xl-5 {\n    padding-left: 3rem !important;\n  }\n  .gap-xl-0 {\n    gap: 0 !important;\n  }\n  .gap-xl-1 {\n    gap: 0.25rem !important;\n  }\n  .gap-xl-2 {\n    gap: 0.5rem !important;\n  }\n  .gap-xl-3 {\n    gap: 1rem !important;\n  }\n  .gap-xl-4 {\n    gap: 1.5rem !important;\n  }\n  .gap-xl-5 {\n    gap: 3rem !important;\n  }\n  .text-xl-start {\n    text-align: left !important;\n  }\n  .text-xl-end {\n    text-align: right !important;\n  }\n  .text-xl-center {\n    text-align: center !important;\n  }\n}\n@media (min-width: 1400px) {\n  .float-xxl-start {\n    float: left !important;\n  }\n  .float-xxl-end {\n    float: right !important;\n  }\n  .float-xxl-none {\n    float: none !important;\n  }\n  .d-xxl-inline {\n    display: inline !important;\n  }\n  .d-xxl-inline-block {\n    display: inline-block !important;\n  }\n  .d-xxl-block {\n    display: block !important;\n  }\n  .d-xxl-grid {\n    display: grid !important;\n  }\n  .d-xxl-table {\n    display: table !important;\n  }\n  .d-xxl-table-row {\n    display: table-row !important;\n  }\n  .d-xxl-table-cell {\n    display: table-cell !important;\n  }\n  .d-xxl-flex {\n    display: flex !important;\n  }\n  .d-xxl-inline-flex {\n    display: inline-flex !important;\n  }\n  .d-xxl-none {\n    display: none !important;\n  }\n  .flex-xxl-fill {\n    flex: 1 1 auto !important;\n  }\n  .flex-xxl-row {\n    flex-direction: row !important;\n  }\n  .flex-xxl-column {\n    flex-direction: column !important;\n  }\n  .flex-xxl-row-reverse {\n    flex-direction: row-reverse !important;\n  }\n  .flex-xxl-column-reverse {\n    flex-direction: column-reverse !important;\n  }\n  .flex-xxl-grow-0 {\n    flex-grow: 0 !important;\n  }\n  .flex-xxl-grow-1 {\n    flex-grow: 1 !important;\n  }\n  .flex-xxl-shrink-0 {\n    flex-shrink: 0 !important;\n  }\n  .flex-xxl-shrink-1 {\n    flex-shrink: 1 !important;\n  }\n  .flex-xxl-wrap {\n    flex-wrap: wrap !important;\n  }\n  .flex-xxl-nowrap {\n    flex-wrap: nowrap !important;\n  }\n  .flex-xxl-wrap-reverse {\n    flex-wrap: wrap-reverse !important;\n  }\n  .justify-content-xxl-start {\n    justify-content: flex-start !important;\n  }\n  .justify-content-xxl-end {\n    justify-content: flex-end !important;\n  }\n  .justify-content-xxl-center {\n    justify-content: center !important;\n  }\n  .justify-content-xxl-between {\n    justify-content: space-between !important;\n  }\n  .justify-content-xxl-around {\n    justify-content: space-around !important;\n  }\n  .justify-content-xxl-evenly {\n    justify-content: space-evenly !important;\n  }\n  .align-items-xxl-start {\n    align-items: flex-start !important;\n  }\n  .align-items-xxl-end {\n    align-items: flex-end !important;\n  }\n  .align-items-xxl-center {\n    align-items: center !important;\n  }\n  .align-items-xxl-baseline {\n    align-items: baseline !important;\n  }\n  .align-items-xxl-stretch {\n    align-items: stretch !important;\n  }\n  .align-content-xxl-start {\n    align-content: flex-start !important;\n  }\n  .align-content-xxl-end {\n    align-content: flex-end !important;\n  }\n  .align-content-xxl-center {\n    align-content: center !important;\n  }\n  .align-content-xxl-between {\n    align-content: space-between !important;\n  }\n  .align-content-xxl-around {\n    align-content: space-around !important;\n  }\n  .align-content-xxl-stretch {\n    align-content: stretch !important;\n  }\n  .align-self-xxl-auto {\n    align-self: auto !important;\n  }\n  .align-self-xxl-start {\n    align-self: flex-start !important;\n  }\n  .align-self-xxl-end {\n    align-self: flex-end !important;\n  }\n  .align-self-xxl-center {\n    align-self: center !important;\n  }\n  .align-self-xxl-baseline {\n    align-self: baseline !important;\n  }\n  .align-self-xxl-stretch {\n    align-self: stretch !important;\n  }\n  .order-xxl-first {\n    order: -1 !important;\n  }\n  .order-xxl-0 {\n    order: 0 !important;\n  }\n  .order-xxl-1 {\n    order: 1 !important;\n  }\n  .order-xxl-2 {\n    order: 2 !important;\n  }\n  .order-xxl-3 {\n    order: 3 !important;\n  }\n  .order-xxl-4 {\n    order: 4 !important;\n  }\n  .order-xxl-5 {\n    order: 5 !important;\n  }\n  .order-xxl-last {\n    order: 6 !important;\n  }\n  .m-xxl-0 {\n    margin: 0 !important;\n  }\n  .m-xxl-1 {\n    margin: 0.25rem !important;\n  }\n  .m-xxl-2 {\n    margin: 0.5rem !important;\n  }\n  .m-xxl-3 {\n    margin: 1rem !important;\n  }\n  .m-xxl-4 {\n    margin: 1.5rem !important;\n  }\n  .m-xxl-5 {\n    margin: 3rem !important;\n  }\n  .m-xxl-auto {\n    margin: auto !important;\n  }\n  .mx-xxl-0 {\n    margin-right: 0 !important;\n    margin-left: 0 !important;\n  }\n  .mx-xxl-1 {\n    margin-right: 0.25rem !important;\n    margin-left: 0.25rem !important;\n  }\n  .mx-xxl-2 {\n    margin-right: 0.5rem !important;\n    margin-left: 0.5rem !important;\n  }\n  .mx-xxl-3 {\n    margin-right: 1rem !important;\n    margin-left: 1rem !important;\n  }\n  .mx-xxl-4 {\n    margin-right: 1.5rem !important;\n    margin-left: 1.5rem !important;\n  }\n  .mx-xxl-5 {\n    margin-right: 3rem !important;\n    margin-left: 3rem !important;\n  }\n  .mx-xxl-auto {\n    margin-right: auto !important;\n    margin-left: auto !important;\n  }\n  .my-xxl-0 {\n    margin-top: 0 !important;\n    margin-bottom: 0 !important;\n  }\n  .my-xxl-1 {\n    margin-top: 0.25rem !important;\n    margin-bottom: 0.25rem !important;\n  }\n  .my-xxl-2 {\n    margin-top: 0.5rem !important;\n    margin-bottom: 0.5rem !important;\n  }\n  .my-xxl-3 {\n    margin-top: 1rem !important;\n    margin-bottom: 1rem !important;\n  }\n  .my-xxl-4 {\n    margin-top: 1.5rem !important;\n    margin-bottom: 1.5rem !important;\n  }\n  .my-xxl-5 {\n    margin-top: 3rem !important;\n    margin-bottom: 3rem !important;\n  }\n  .my-xxl-auto {\n    margin-top: auto !important;\n    margin-bottom: auto !important;\n  }\n  .mt-xxl-0 {\n    margin-top: 0 !important;\n  }\n  .mt-xxl-1 {\n    margin-top: 0.25rem !important;\n  }\n  .mt-xxl-2 {\n    margin-top: 0.5rem !important;\n  }\n  .mt-xxl-3 {\n    margin-top: 1rem !important;\n  }\n  .mt-xxl-4 {\n    margin-top: 1.5rem !important;\n  }\n  .mt-xxl-5 {\n    margin-top: 3rem !important;\n  }\n  .mt-xxl-auto {\n    margin-top: auto !important;\n  }\n  .me-xxl-0 {\n    margin-right: 0 !important;\n  }\n  .me-xxl-1 {\n    margin-right: 0.25rem !important;\n  }\n  .me-xxl-2 {\n    margin-right: 0.5rem !important;\n  }\n  .me-xxl-3 {\n    margin-right: 1rem !important;\n  }\n  .me-xxl-4 {\n    margin-right: 1.5rem !important;\n  }\n  .me-xxl-5 {\n    margin-right: 3rem !important;\n  }\n  .me-xxl-auto {\n    margin-right: auto !important;\n  }\n  .mb-xxl-0 {\n    margin-bottom: 0 !important;\n  }\n  .mb-xxl-1 {\n    margin-bottom: 0.25rem !important;\n  }\n  .mb-xxl-2 {\n    margin-bottom: 0.5rem !important;\n  }\n  .mb-xxl-3 {\n    margin-bottom: 1rem !important;\n  }\n  .mb-xxl-4 {\n    margin-bottom: 1.5rem !important;\n  }\n  .mb-xxl-5 {\n    margin-bottom: 3rem !important;\n  }\n  .mb-xxl-auto {\n    margin-bottom: auto !important;\n  }\n  .ms-xxl-0 {\n    margin-left: 0 !important;\n  }\n  .ms-xxl-1 {\n    margin-left: 0.25rem !important;\n  }\n  .ms-xxl-2 {\n    margin-left: 0.5rem !important;\n  }\n  .ms-xxl-3 {\n    margin-left: 1rem !important;\n  }\n  .ms-xxl-4 {\n    margin-left: 1.5rem !important;\n  }\n  .ms-xxl-5 {\n    margin-left: 3rem !important;\n  }\n  .ms-xxl-auto {\n    margin-left: auto !important;\n  }\n  .p-xxl-0 {\n    padding: 0 !important;\n  }\n  .p-xxl-1 {\n    padding: 0.25rem !important;\n  }\n  .p-xxl-2 {\n    padding: 0.5rem !important;\n  }\n  .p-xxl-3 {\n    padding: 1rem !important;\n  }\n  .p-xxl-4 {\n    padding: 1.5rem !important;\n  }\n  .p-xxl-5 {\n    padding: 3rem !important;\n  }\n  .px-xxl-0 {\n    padding-right: 0 !important;\n    padding-left: 0 !important;\n  }\n  .px-xxl-1 {\n    padding-right: 0.25rem !important;\n    padding-left: 0.25rem !important;\n  }\n  .px-xxl-2 {\n    padding-right: 0.5rem !important;\n    padding-left: 0.5rem !important;\n  }\n  .px-xxl-3 {\n    padding-right: 1rem !important;\n    padding-left: 1rem !important;\n  }\n  .px-xxl-4 {\n    padding-right: 1.5rem !important;\n    padding-left: 1.5rem !important;\n  }\n  .px-xxl-5 {\n    padding-right: 3rem !important;\n    padding-left: 3rem !important;\n  }\n  .py-xxl-0 {\n    padding-top: 0 !important;\n    padding-bottom: 0 !important;\n  }\n  .py-xxl-1 {\n    padding-top: 0.25rem !important;\n    padding-bottom: 0.25rem !important;\n  }\n  .py-xxl-2 {\n    padding-top: 0.5rem !important;\n    padding-bottom: 0.5rem !important;\n  }\n  .py-xxl-3 {\n    padding-top: 1rem !important;\n    padding-bottom: 1rem !important;\n  }\n  .py-xxl-4 {\n    padding-top: 1.5rem !important;\n    padding-bottom: 1.5rem !important;\n  }\n  .py-xxl-5 {\n    padding-top: 3rem !important;\n    padding-bottom: 3rem !important;\n  }\n  .pt-xxl-0 {\n    padding-top: 0 !important;\n  }\n  .pt-xxl-1 {\n    padding-top: 0.25rem !important;\n  }\n  .pt-xxl-2 {\n    padding-top: 0.5rem !important;\n  }\n  .pt-xxl-3 {\n    padding-top: 1rem !important;\n  }\n  .pt-xxl-4 {\n    padding-top: 1.5rem !important;\n  }\n  .pt-xxl-5 {\n    padding-top: 3rem !important;\n  }\n  .pe-xxl-0 {\n    padding-right: 0 !important;\n  }\n  .pe-xxl-1 {\n    padding-right: 0.25rem !important;\n  }\n  .pe-xxl-2 {\n    padding-right: 0.5rem !important;\n  }\n  .pe-xxl-3 {\n    padding-right: 1rem !important;\n  }\n  .pe-xxl-4 {\n    padding-right: 1.5rem !important;\n  }\n  .pe-xxl-5 {\n    padding-right: 3rem !important;\n  }\n  .pb-xxl-0 {\n    padding-bottom: 0 !important;\n  }\n  .pb-xxl-1 {\n    padding-bottom: 0.25rem !important;\n  }\n  .pb-xxl-2 {\n    padding-bottom: 0.5rem !important;\n  }\n  .pb-xxl-3 {\n    padding-bottom: 1rem !important;\n  }\n  .pb-xxl-4 {\n    padding-bottom: 1.5rem !important;\n  }\n  .pb-xxl-5 {\n    padding-bottom: 3rem !important;\n  }\n  .ps-xxl-0 {\n    padding-left: 0 !important;\n  }\n  .ps-xxl-1 {\n    padding-left: 0.25rem !important;\n  }\n  .ps-xxl-2 {\n    padding-left: 0.5rem !important;\n  }\n  .ps-xxl-3 {\n    padding-left: 1rem !important;\n  }\n  .ps-xxl-4 {\n    padding-left: 1.5rem !important;\n  }\n  .ps-xxl-5 {\n    padding-left: 3rem !important;\n  }\n  .gap-xxl-0 {\n    gap: 0 !important;\n  }\n  .gap-xxl-1 {\n    gap: 0.25rem !important;\n  }\n  .gap-xxl-2 {\n    gap: 0.5rem !important;\n  }\n  .gap-xxl-3 {\n    gap: 1rem !important;\n  }\n  .gap-xxl-4 {\n    gap: 1.5rem !important;\n  }\n  .gap-xxl-5 {\n    gap: 3rem !important;\n  }\n  .text-xxl-start {\n    text-align: left !important;\n  }\n  .text-xxl-end {\n    text-align: right !important;\n  }\n  .text-xxl-center {\n    text-align: center !important;\n  }\n}\n@media (min-width: 1200px) {\n  .fs-1 {\n    font-size: 2.5rem !important;\n  }\n  .fs-2 {\n    font-size: 2rem !important;\n  }\n  .fs-3 {\n    font-size: 1.75rem !important;\n  }\n  .fs-4 {\n    font-size: 1.5rem !important;\n  }\n}\n@media print {\n  .d-print-inline {\n    display: inline !important;\n  }\n  .d-print-inline-block {\n    display: inline-block !important;\n  }\n  .d-print-block {\n    display: block !important;\n  }\n  .d-print-grid {\n    display: grid !important;\n  }\n  .d-print-table {\n    display: table !important;\n  }\n  .d-print-table-row {\n    display: table-row !important;\n  }\n  .d-print-table-cell {\n    display: table-cell !important;\n  }\n  .d-print-flex {\n    display: flex !important;\n  }\n  .d-print-inline-flex {\n    display: inline-flex !important;\n  }\n  .d-print-none {\n    display: none !important;\n  }\n}\nbody {\n  background-color: #FEFBF4;\n}\n\n* {\n  padding: 0;\n  margin: 0;\n}\n\nheader {\n  color: #FEFBF4;\n  width: 100vw;\n  height: 450px;\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n#subtitle {\n  font-style: italic;\n}\n\nnav {\n  background-color: none;\n  width: 50%;\n  padding: 10px 20px;\n  margin: auto;\n  display: flex;\n  justify-content: center;\n}\n\n.btn-nav {\n  border: none;\n  width: 33%;\n  background-color: #FEFBF4;\n  padding: 15px 25px;\n}\n\n.btn-nav:hover {\n  font-style: italic;\n}\n\n.btn-nav:first-of-type {\n  border-right: 1px #B9C44A solid;\n}\n\n.btn-nav:last-of-type {\n  border-left: 1px #B9C44A solid;\n}\n\n#copy {\n  padding: 20px 60px;\n}\n\n#translation {\n  font-style: italic;\n}\n\nfooter {\n  font-size: 10pt;\n  position: absolute;\n  text-align: center;\n  max-height: 15px;\n  margin: 10px 0px;\n  bottom: 0;\n  opacity: 0.5;\n  width: 100%;\n}\n\nfooter a {\n  font-size: 10pt;\n  text-decoration: underline;\n  color: #426078;\n}\n\nfooter a:hover {\n  color: #172938;\n}", "",{"version":3,"sources":["webpack://./src/scss/styles.scss","webpack://./node_modules/bootstrap/scss/mixins/_banner.scss","webpack://./node_modules/bootstrap/scss/_root.scss","webpack://./node_modules/bootstrap/scss/vendor/_rfs.scss","webpack://./node_modules/bootstrap/scss/_reboot.scss","webpack://./node_modules/bootstrap/scss/_variables.scss","webpack://./node_modules/bootstrap/scss/mixins/_border-radius.scss","webpack://./node_modules/bootstrap/scss/_type.scss","webpack://./node_modules/bootstrap/scss/mixins/_lists.scss","webpack://./node_modules/bootstrap/scss/_images.scss","webpack://./node_modules/bootstrap/scss/mixins/_image.scss","webpack://./node_modules/bootstrap/scss/_containers.scss","webpack://./node_modules/bootstrap/scss/mixins/_container.scss","webpack://./node_modules/bootstrap/scss/mixins/_breakpoints.scss","webpack://./node_modules/bootstrap/scss/_grid.scss","webpack://./node_modules/bootstrap/scss/mixins/_grid.scss","webpack://./node_modules/bootstrap/scss/_tables.scss","webpack://./node_modules/bootstrap/scss/mixins/_table-variants.scss","webpack://./node_modules/bootstrap/scss/forms/_labels.scss","webpack://./node_modules/bootstrap/scss/forms/_form-text.scss","webpack://./node_modules/bootstrap/scss/forms/_form-control.scss","webpack://./node_modules/bootstrap/scss/mixins/_transition.scss","webpack://./node_modules/bootstrap/scss/mixins/_gradients.scss","webpack://./node_modules/bootstrap/scss/forms/_form-select.scss","webpack://./node_modules/bootstrap/scss/forms/_form-check.scss","webpack://./node_modules/bootstrap/scss/forms/_form-range.scss","webpack://./node_modules/bootstrap/scss/forms/_floating-labels.scss","webpack://./node_modules/bootstrap/scss/forms/_input-group.scss","webpack://./node_modules/bootstrap/scss/mixins/_forms.scss","webpack://./node_modules/bootstrap/scss/_buttons.scss","webpack://./node_modules/bootstrap/scss/mixins/_buttons.scss","webpack://./node_modules/bootstrap/scss/_transitions.scss","webpack://./node_modules/bootstrap/scss/_dropdown.scss","webpack://./node_modules/bootstrap/scss/mixins/_caret.scss","webpack://./node_modules/bootstrap/scss/_button-group.scss","webpack://./node_modules/bootstrap/scss/_nav.scss","webpack://./node_modules/bootstrap/scss/_navbar.scss","webpack://./node_modules/bootstrap/scss/_card.scss","webpack://./node_modules/bootstrap/scss/_accordion.scss","webpack://./node_modules/bootstrap/scss/_breadcrumb.scss","webpack://./node_modules/bootstrap/scss/_pagination.scss","webpack://./node_modules/bootstrap/scss/mixins/_pagination.scss","webpack://./node_modules/bootstrap/scss/_badge.scss","webpack://./node_modules/bootstrap/scss/_alert.scss","webpack://./node_modules/bootstrap/scss/mixins/_alert.scss","webpack://./node_modules/bootstrap/scss/_progress.scss","webpack://./node_modules/bootstrap/scss/_list-group.scss","webpack://./node_modules/bootstrap/scss/mixins/_list-group.scss","webpack://./node_modules/bootstrap/scss/_close.scss","webpack://./node_modules/bootstrap/scss/_toasts.scss","webpack://./node_modules/bootstrap/scss/_modal.scss","webpack://./node_modules/bootstrap/scss/mixins/_backdrop.scss","webpack://./node_modules/bootstrap/scss/_tooltip.scss","webpack://./node_modules/bootstrap/scss/mixins/_reset-text.scss","webpack://./node_modules/bootstrap/scss/_popover.scss","webpack://./node_modules/bootstrap/scss/_carousel.scss","webpack://./node_modules/bootstrap/scss/mixins/_clearfix.scss","webpack://./node_modules/bootstrap/scss/_spinners.scss","webpack://./node_modules/bootstrap/scss/_offcanvas.scss","webpack://./node_modules/bootstrap/scss/_placeholders.scss","webpack://./node_modules/bootstrap/scss/helpers/_color-bg.scss","webpack://./node_modules/bootstrap/scss/helpers/_colored-links.scss","webpack://./node_modules/bootstrap/scss/helpers/_ratio.scss","webpack://./node_modules/bootstrap/scss/helpers/_position.scss","webpack://./node_modules/bootstrap/scss/helpers/_stacks.scss","webpack://./node_modules/bootstrap/scss/helpers/_visually-hidden.scss","webpack://./node_modules/bootstrap/scss/mixins/_visually-hidden.scss","webpack://./node_modules/bootstrap/scss/helpers/_stretched-link.scss","webpack://./node_modules/bootstrap/scss/helpers/_text-truncation.scss","webpack://./node_modules/bootstrap/scss/mixins/_text-truncate.scss","webpack://./node_modules/bootstrap/scss/helpers/_vr.scss","webpack://./node_modules/bootstrap/scss/mixins/_utilities.scss","webpack://./node_modules/bootstrap/scss/utilities/_api.scss"],"names":[],"mappings":"AAAA,gBAAgB;ACCd;;;;;EAAA;ACDF;EAQI,kBAAA;EAAA,oBAAA;EAAA,oBAAA;EAAA,kBAAA;EAAA,iBAAA;EAAA,oBAAA;EAAA,oBAAA;EAAA,mBAAA;EAAA,kBAAA;EAAA,kBAAA;EAAA,gBAAA;EAAA,gBAAA;EAAA,kBAAA;EAAA,uBAAA;EAIA,sBAAA;EAAA,sBAAA;EAAA,sBAAA;EAAA,sBAAA;EAAA,sBAAA;EAAA,sBAAA;EAAA,sBAAA;EAAA,sBAAA;EAAA,sBAAA;EAIA,qBAAA;EAAA,uBAAA;EAAA,qBAAA;EAAA,kBAAA;EAAA,qBAAA;EAAA,oBAAA;EAAA,mBAAA;EAAA,kBAAA;EAIA,8BAAA;EAAA,iCAAA;EAAA,6BAAA;EAAA,2BAAA;EAAA,6BAAA;EAAA,4BAAA;EAAA,6BAAA;EAAA,yBAAA;EAGF,6BAAA;EACA,uBAAA;EACA,+BAAA;EACA,+BAAA;EAMA,qNAAA;EACA,yGAAA;EACA,yFAAA;EAOA,gDAAA;EC4PI,yBALI;EDrPR,0BAAA;EACA,0BAAA;EACA,wBAAA;EAIA,kBAAA;EAIA,sBAAA;EACA,wBAAA;EACA,0BAAA;EACA,mDAAA;EAEA,4BAAA;EACA,8BAAA;EACA,6BAAA;EACA,2BAAA;EACA,4BAAA;EACA,8BAAA;EAGA,wBAAA;EACA,8BAAA;EAEA,wBAAA;EAEA,0BAAA;AFGF;;AI3DA;;;EAGE,sBAAA;AJ8DF;;AI/CI;EANJ;IAOM,uBAAA;EJmDJ;AACF;;AItCA;EACE,SAAA;EACA,uCAAA;EDmPI,mCALI;EC5OR,uCAAA;EACA,uCAAA;EACA,2BAAA;EACA,qCAAA;EACA,mCAAA;EACA,8BAAA;EACA,6CAAA;AJyCF;;AIhCA;EACE,cAAA;EACA,cCijB4B;EDhjB5B,SAAA;EACA,qBAAA;EACA,aCujB4B;ALphB9B;;AIzBA;EACE,aAAA;EACA,qBCwf4B;EDrf5B,gBCwf4B;EDvf5B,gBCwf4B;AL9d9B;;AItBA;ED6MQ,iCAAA;AHnLR;AGiBI;EC3CJ;IDoNQ,iBAAA;EHtLN;AACF;;AI1BA;EDwMQ,iCAAA;AH1KR;AGQI;ECtCJ;ID+MQ,eAAA;EH7KN;AACF;;AI9BA;EDmMQ,+BAAA;AHjKR;AGDI;ECjCJ;ID0MQ,kBAAA;EHpKN;AACF;;AIlCA;ED8LQ,iCAAA;AHxJR;AGVI;EC5BJ;IDqMQ,iBAAA;EH3JN;AACF;;AItCA;EDqLM,kBALI;AHtIV;;AIrCA;EDgLM,eALI;AHlIV;;AI9BA;EACE,aAAA;EACA,mBCmS0B;ALlQ5B;;AIvBA;EACE,iCAAA;EACA,YAAA;EACA,8BAAA;AJ0BF;;AIpBA;EACE,mBAAA;EACA,kBAAA;EACA,oBAAA;AJuBF;;AIjBA;;EAEE,kBAAA;AJoBF;;AIjBA;;;EAGE,aAAA;EACA,mBAAA;AJoBF;;AIjBA;;;;EAIE,gBAAA;AJoBF;;AIjBA;EACE,gBC6X4B;ALzW9B;;AIfA;EACE,qBAAA;EACA,cAAA;AJkBF;;AIZA;EACE,gBAAA;AJeF;;AIPA;;EAEE,mBCsW4B;AL5V9B;;AIFA;EDmFM,kBALI;AHxEV;;AICA;EACE,iBC+a4B;ED9a5B,wCAAA;AJEF;;AIOA;;EAEE,kBAAA;ED+DI,iBALI;ECxDR,cAAA;EACA,wBAAA;AJJF;;AIOA;EAAM,eAAA;AJHN;;AIIA;EAAM,WAAA;AJAN;;AIKA;EACE,2BAAA;EACA,0BCqKwC;ALvK1C;AIIE;EACE,iCAAA;AJFJ;;AIaE;EAEE,cAAA;EACA,qBAAA;AJXJ;;AIkBA;;;;EAIE,qCCkR4B;EF7PxB,cALI;AH9BV;;AIsBA;EACE,cAAA;EACA,aAAA;EACA,mBAAA;EACA,cAAA;EDSI,kBALI;AHtBV;AIuBE;EDII,kBALI;ECGN,cAAA;EACA,kBAAA;AJrBJ;;AIyBA;EDHM,kBALI;ECUR,2BAAA;EACA,qBAAA;AJtBF;AIyBE;EACE,cAAA;AJvBJ;;AI2BA;EACE,2BAAA;EDfI,kBALI;ECsBR,wBCuyCkC;EDtyClC,sCCuyCkC;EC3kDhC,sBAAA;AN6QJ;AI0BE;EACE,UAAA;EDtBE,cALI;AHIV;;AIkCA;EACE,gBAAA;AJ/BF;;AIqCA;;EAEE,sBAAA;AJlCF;;AI0CA;EACE,oBAAA;EACA,yBAAA;AJvCF;;AI0CA;EACE,mBCsT4B;EDrT5B,sBCqT4B;EDpT5B,cCjVS;EDkVT,gBAAA;AJvCF;;AI8CA;EAEE,mBAAA;EACA,gCAAA;AJ5CF;;AI+CA;;;;;;EAME,qBAAA;EACA,mBAAA;EACA,eAAA;AJ5CF;;AIoDA;EACE,qBAAA;AJjDF;;AIuDA;EAEE,gBAAA;AJrDF;;AI6DA;EACE,UAAA;AJ1DF;;AI+DA;;;;;EAKE,SAAA;EACA,oBAAA;EDrHI,kBALI;EC4HR,oBAAA;AJ5DF;;AIgEA;;EAEE,oBAAA;AJ7DF;;AIkEA;EACE,eAAA;AJ/DF;;AIkEA;EAGE,iBAAA;AJjEF;AIoEE;EACE,UAAA;AJlEJ;;AIyEA;EACE,wBAAA;AJtEF;;AI8EA;;;;EAIE,0BAAA;AJ3EF;AI8EI;;;;EACE,eAAA;AJzEN;;AIgFA;EACE,UAAA;EACA,kBAAA;AJ7EF;;AIkFA;EACE,gBAAA;AJ/EF;;AIyFA;EACE,YAAA;EACA,UAAA;EACA,SAAA;EACA,SAAA;AJtFF;;AI8FA;EACE,WAAA;EACA,WAAA;EACA,UAAA;EACA,qBC8I4B;EFxVtB,iCAAA;EC6MN,oBAAA;AJ5FF;AGnRI;ECwWJ;ID/LQ,iBAAA;EH8GN;AACF;AIyFE;EACE,WAAA;AJvFJ;;AI8FA;;;;;;;EAOE,UAAA;AJ3FF;;AI8FA;EACE,YAAA;AJ3FF;;AIoGA;EACE,oBAAA;EACA,6BAAA;AJjGF;;AIyGA;;;;;;;CAAA;AAWA;EACE,wBAAA;AJzGF;;AI8GA;EACE,UAAA;AJ3GF;;AIkHA;EACE,aAAA;EACA,0BAAA;AJ/GF;;AIoHA;EACE,qBAAA;AJjHF;;AIsHA;EACE,SAAA;AJnHF;;AI0HA;EACE,kBAAA;EACA,eAAA;AJvHF;;AI+HA;EACE,wBAAA;AJ5HF;;AIoIA;EACE,wBAAA;AJjIF;;AOncA;EJyQM,kBALI;EIlQR,gBFwkB4B;ALlI9B;;AOjcE;EJsQM,iCAAA;EIlQJ,gBFyjBkB;EExjBlB,gBFwiB0B;ALtG9B;AGnWI;EIpGF;IJ6QM,eAAA;EH8LN;AACF;;AO5cE;EJsQM,iCAAA;EIlQJ,gBFyjBkB;EExjBlB,gBFwiB0B;AL3F9B;AG9WI;EIpGF;IJ6QM,iBAAA;EHyMN;AACF;;AOvdE;EJsQM,iCAAA;EIlQJ,gBFyjBkB;EExjBlB,gBFwiB0B;ALhF9B;AGzXI;EIpGF;IJ6QM,eAAA;EHoNN;AACF;;AOleE;EJsQM,iCAAA;EIlQJ,gBFyjBkB;EExjBlB,gBFwiB0B;ALrE9B;AGpYI;EIpGF;IJ6QM,iBAAA;EH+NN;AACF;;AO7eE;EJsQM,iCAAA;EIlQJ,gBFyjBkB;EExjBlB,gBFwiB0B;AL1D9B;AG/YI;EIpGF;IJ6QM,eAAA;EH0ON;AACF;;AOxfE;EJsQM,iCAAA;EIlQJ,gBFyjBkB;EExjBlB,gBFwiB0B;AL/C9B;AG1ZI;EIpGF;IJ6QM,iBAAA;EHqPN;AACF;;AO3eA;ECvDE,eAAA;EACA,gBAAA;ARsiBF;;AO3eA;EC5DE,eAAA;EACA,gBAAA;AR2iBF;;AO7eA;EACE,qBAAA;APgfF;AO9eE;EACE,oBFgkB0B;ALhF9B;;AOteA;EJoNM,kBALI;EI7MR,yBAAA;APyeF;;AOreA;EACE,mBF6RO;EFhFH,kBALI;AHiSV;AOteE;EACE,gBAAA;APweJ;;AOpeA;EACE,iBAAA;EACA,mBFmRO;EFhFH,kBALI;EI5LR,cFtFS;AL6jBX;AOreE;EACE,aAAA;APueJ;;ASvkBA;ECIE,eAAA;EAGA,YAAA;AVqkBF;;AStkBA;EACE,gBJ48CkC;EI38ClC,sBJPS;EIQT,wCAAA;EHGE,uBAAA;EIRF,eAAA;EAGA,YAAA;AV8kBF;;AShkBA;EAEE,qBAAA;ATkkBF;;AS/jBA;EACE,qBAAA;EACA,cAAA;ATkkBF;;AS/jBA;EN+PM,kBALI;EMxPR,cJ1BS;AL4lBX;;AWpmBE;;;;;;;ECHA,qBAAA;EACA,gBAAA;EACA,WAAA;EACA,6CAAA;EACA,4CAAA;EACA,kBAAA;EACA,iBAAA;AZinBF;;Aa3jBI;EF5CE;IACE,gBN6ae;EL8LrB;AACF;AajkBI;EF5CE;IACE,gBN6ae;ELmMrB;AACF;AatkBI;EF5CE;IACE,gBN6ae;ELwMrB;AACF;Aa3kBI;EF5CE;IACE,iBN6ae;EL6MrB;AACF;AahlBI;EF5CE;IACE,iBN6ae;ELkNrB;AACF;Ac/oBE;ECAA,qBAA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AqB37DM;EDhBN;ICiBQ,gBAAA;ErB87DN;AACF;AoB57DE;EACE,gBAAA;ApB87DJ;AoB57DI;EACE,eAAA;ApB87DN;AoBz7DE;EACE,cfjBO;EekBP,sBf3BO;Ee4BP,qBfqyBoC;EepyBpC,UAAA;EAKE,kDf6qB0B;AL0wChC;AoBh7DE;EAEE,aAAA;ApBi7DJ;AoB76DE;EACE,cf1CO;Ee4CP,UAAA;ApB86DJ;AoBt6DE;EAEE,yBf1DO;Ee6DP,UAAA;ApBq6DJ;AoBj6DE;EACE,yBAAA;EACA,0BAAA;EACA,0BfgoB0B;Ee/nB1B,cf9DO;EiBbT,yBjBMS;EeuEP,oBAAA;EACA,qBAAA;EACA,mBAAA;EACA,eAAA;EACA,4Bf0Y0B;EezY1B,gBAAA;ECtEE,qIDuEF;ApBm6DJ;AqBt+DM;EDuDJ;ICtDM,gBAAA;ErBy+DN;AACF;AoBr6DE;EACE,yBfs4B8B;ALiiClC;;AoB95DA;EACE,cAAA;EACA,WAAA;EACA,mBAAA;EACA,gBAAA;EACA,gBf2c4B;Ee1c5B,cfzFS;Ee0FT,6BAAA;EACA,yBAAA;EACA,mBAAA;ApBi6DF;AoB/5DE;EACE,UAAA;ApBi6DJ;AoB95DE;EAEE,gBAAA;EACA,eAAA;ApB+5DJ;;AoBp5DA;EACE,sCfstBsC;EertBtC,uBAAA;EjBkKI,mBALI;EG7QN,sBAAA;ANygEJ;AoBr5DE;EACE,uBAAA;EACA,wBAAA;EACA,yBfglB0B;ALu0C9B;;AoBn5DA;EACE,oCf0sBsC;EezsBtC,oBAAA;EjBqJI,kBALI;EG7QN,qBAAA;ANqhEJ;AoBp5DE;EACE,oBAAA;EACA,qBAAA;EACA,uBfukB0B;AL+0C9B;;AoB94DE;EACE,uCfurBoC;AL0tCxC;AoB94DE;EACE,sCforBoC;AL4tCxC;AoB74DE;EACE,oCfirBoC;AL8tCxC;;AoB14DA;EACE,Wf+qBsC;Ee9qBtC,mCfwqBsC;EevqBtC,iBf6hB4B;ALg3C9B;AoB34DE;EACE,eAAA;ApB64DJ;AoB14DE;EACE,oBAAA;EdpKA,uBAAA;ANijEJ;AoBz4DE;EdxKE,uBAAA;ANojEJ;AoBx4DE;EAAoB,kCfypBkB;ALkvCxC;AoB14DE;EAAoB,gCfypBkB;ALovCxC;;AuBxkEA;EACE,cAAA;EACA,WAAA;EACA,0CAAA;EACA,uCAAA;EpB4RI,eALI;EoBpRR,gBlBiiB4B;EkBhiB5B,gBlBuiB4B;EkBtiB5B,clBGS;EkBFT,sBlBPS;EkBQT,yDAAA;EACA,4BAAA;EACA,yClBw5BkC;EkBv5BlC,0BlBw5BkC;EkBv5BlC,yBAAA;EjBDE,uBAAA;EeHE,wEEOJ;EACA,gBAAA;AvBykEF;AqB7kEM;EEfN;IFgBQ,gBAAA;ErBglEN;AACF;AuB5kEE;EACE,qBlB8yBoC;EkB7yBpC,UAAA;EAKE,kDlBy5B4B;ALirClC;AuBtkEE;EAEE,sBlBuqB0B;EkBtqB1B,sBAAA;AvBukEJ;AuBpkEE;EAEE,yBlBnCO;ALwmEX;AuBhkEE;EACE,kBAAA;EACA,0BAAA;AvBkkEJ;;AuB9jEA;EACE,oBlBgqB4B;EkB/pB5B,uBlB+pB4B;EkB9pB5B,oBlB+pB4B;EFrbxB,mBALI;EG7QN,sBAAA;AN2mEJ;;AuB9jEA;EACE,mBlB4pB4B;EkB3pB5B,sBlB2pB4B;EkB1pB5B,kBlB2pB4B;EFzbxB,kBALI;EG7QN,qBAAA;ANmnEJ;;AwBloEA;EACE,cAAA;EACA,kBnB41BwC;EmB31BxC,mBnB41BwC;EmB31BxC,uBnB41BwC;ALyyC1C;AwBnoEE;EACE,WAAA;EACA,mBAAA;AxBqoEJ;;AwBjoEA;EACE,oBnBk1BwC;EmBj1BxC,eAAA;EACA,iBAAA;AxBooEF;AwBloEE;EACE,YAAA;EACA,oBAAA;EACA,cAAA;AxBooEJ;;AwBhoEA;EACE,UnBo0BwC;EmBn0BxC,WnBm0BwC;EmBl0BxC,kBAAA;EACA,mBAAA;EACA,sBnBzBS;EmB0BT,4BAAA;EACA,2BAAA;EACA,wBAAA;EACA,qCnBu0BwC;EmBt0BxC,gBAAA;EACA,yBAAA;AxBmoEF;AwBhoEE;ElBvBE,qBAAA;AN0pEJ;AwB/nEE;EAEE,kBnB8zBsC;ALk0C1C;AwB7nEE;EACE,uBnBqzBsC;AL00C1C;AwB5nEE;EACE,qBnBixBoC;EmBhxBpC,UAAA;EACA,kDnB6pB4B;ALi+ChC;AwB3nEE;EACE,yBnBxBM;EmByBN,qBnBzBM;ALspEV;AwB3nEI;EAII,yDAAA;AxB0nER;AwBtnEI;EAII,yDAAA;AxBqnER;AwBhnEE;EACE,yBnB7CM;EmB8CN,qBnB9CM;EmBmDJ,yDAAA;AxB8mEN;AwB1mEE;EACE,oBAAA;EACA,YAAA;EACA,YnB6xBuC;AL+0C3C;AwBrmEI;EACE,eAAA;EACA,YnBoxBqC;ALm1C3C;;AwBzlEA;EACE,mBnB+wBgC;AL60ClC;AwB1lEE;EACE,UnB2wB8B;EmB1wB9B,mBAAA;EACA,yDAAA;EACA,gCAAA;ElB3GA,kBAAA;EeHE,iDGgHF;AxB4lEJ;AqBxsEM;EGsGJ;IHrGM,gBAAA;ErB2sEN;AACF;AwB/lEI;EACE,yDAAA;AxBimEN;AwB9lEI;EACE,iCnB0wB4B;EmBrwB1B,yDAAA;AxB4lER;AwBvlEE;EACE,oBnBqvB8B;EmBpvB9B,eAAA;AxBylEJ;AwBvlEI;EACE,oBAAA;EACA,cAAA;AxBylEN;;AwBplEA;EACE,qBAAA;EACA,kBnBmuBgC;ALo3ClC;;AwBplEA;EACE,kBAAA;EACA,sBAAA;EACA,oBAAA;AxBulEF;AwBnlEI;EACE,oBAAA;EACA,YAAA;EACA,anBolBwB;ALigD9B;;AyB1vEA;EACE,WAAA;EACA,cAAA;EACA,UAAA;EACA,6BAAA;EACA,gBAAA;AzB6vEF;AyB3vEE;EACE,UAAA;AzB6vEJ;AyBzvEI;EAA0B,kEpBq8Ba;ALuzC3C;AyB3vEI;EAA0B,kEpBo8Ba;AL0zC3C;AyB3vEE;EACE,SAAA;AzB6vEJ;AyB1vEE;EACE,WpBs7BuC;EoBr7BvC,YpBq7BuC;EoBp7BvC,oBAAA;EHzBF,yBjBkCQ;EoBPN,SpBq7BuC;ECj8BvC,mBAAA;EeHE,4GIkBF;EACA,gBAAA;AzB2vEJ;AqB1wEM;EIMJ;IJLM,gBAAA;ErB6wEN;AACF;AyB9vEI;EHjCF,yBjBq9ByC;AL60C3C;AyB5vEE;EACE,WpB+5B8B;EoB95B9B,cpB+5B8B;EoB95B9B,kBAAA;EACA,epB85B8B;EoB75B9B,yBpBpCO;EoBqCP,yBAAA;EnB7BA,mBAAA;AN4xEJ;AyB1vEE;EACE,WpB25BuC;EoB15BvC,YpB05BuC;EiB78BzC,yBjBkCQ;EoBmBN,SpB25BuC;ECj8BvC,mBAAA;EeHE,4GI4CF;EACA,gBAAA;AzB2vEJ;AqBpyEM;EIiCJ;IJhCM,gBAAA;ErBuyEN;AACF;AyB9vEI;EH3DF,yBjBq9ByC;ALu2C3C;AyB5vEE;EACE,WpBq4B8B;EoBp4B9B,cpBq4B8B;EoBp4B9B,kBAAA;EACA,epBo4B8B;EoBn4B9B,yBpB9DO;EoB+DP,yBAAA;EnBvDA,mBAAA;ANszEJ;AyB1vEE;EACE,oBAAA;AzB4vEJ;AyB1vEI;EACE,yBpBtEK;ALk0EX;AyBzvEI;EACE,yBpB1EK;ALq0EX;;A0Bl1EA;EACE,kBAAA;A1Bq1EF;A0Bn1EE;;;EAGE,0BrB+9B8B;EqB99B9B,iBrB+9B8B;ALs3ClC;A0Bl1EE;EACE,kBAAA;EACA,MAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;EACA,qBAAA;EACA,gBAAA;EACA,iBAAA;EACA,uBAAA;EACA,mBAAA;EACA,oBAAA;EACA,6BAAA;EACA,qBAAA;ELPE,gEKQF;A1Bo1EJ;AqBx1EM;EKVJ;ILWM,gBAAA;ErB21EN;AACF;A0Bt1EE;;EAEE,qBAAA;A1Bw1EJ;A0Bt1EI;;EACE,kBAAA;A1By1EN;A0Bt1EI;;;EAEE,qBrBo8B4B;EqBn8B5B,wBrBo8B4B;ALq5ClC;A0Bt1EI;;EACE,qBrB+7B4B;EqB97B5B,wBrB+7B4B;AL05ClC;A0Br1EE;EACE,qBrBy7B8B;EqBx7B9B,wBrBy7B8B;AL85ClC;A0Bh1EI;;;;EACE,arBk7B4B;EqBj7B5B,8DrBk7B4B;ALm6ClC;A0Bh1EI;EACE,arB26B4B;EqB16B5B,8DrB26B4B;ALu6ClC;A0B70EI;EACE,mBAAA;A1B+0EN;;A2Bl5EA;EACE,kBAAA;EACA,aAAA;EACA,eAAA;EACA,oBAAA;EACA,WAAA;A3Bq5EF;A2Bn5EE;;;EAGE,kBAAA;EACA,cAAA;EACA,SAAA;EACA,YAAA;A3Bq5EJ;A2Bj5EE;;;EAGE,UAAA;A3Bm5EJ;A2B74EE;EACE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JM;IACE,mDAAA;IACA,oBAAA;E9CktJR;E8ChtJQ;IACE,yDAAA;IACA,oDAAA;E9CktJV;AACF;A8CrsJA;ExChJI,gBAAA;ANw1JJ;A8CrsJE;EACE,mDAAA;A9CusJJ;A8CrsJI;EACE,sBAAA;A9CusJN;;A+C72JE;EACE,cDmLyB;EClLzB,yBDiLsB;A9C+rJ1B;A+C72JM;EAEE,cD6KqB;EC5KrB,yBAAA;A/C82JR;A+C32JM;EACE,W1CRG;E0CSH,yBDuKqB;ECtKrB,qBDsKqB;A9CusJ7B;;A+C33JE;EACE,cDmLyB;EClLzB,yBDiLsB;A9C6sJ1B;A+C33JM;EAEE,cD6KqB;EC5KrB,yBAAA;A/C43JR;A+Cz3JM;EACE,W1CRG;E0CSH,yBDuKqB;ECtKrB,qBDsKqB;A9CqtJ7B;;A+Cz4JE;EACE,cDmLyB;EClLzB,yBDiLsB;A9C2tJ1B;A+Cz4JM;EAEE,cD6KqB;EC5KrB,yBAAA;A/C04JR;A+Cv4JM;EACE,W1CRG;E0CSH,yBDuKqB;ECtKrB,qBDsKqB;A9CmuJ7B;;A+Cv5JE;EACE,cDqL2B;ECpL3B,yBDiLsB;A9CyuJ1B;A+Cv5JM;EAEE,cD+KuB;EC9KvB,yBAAA;A/Cw5JR;A+Cr5JM;EACE,W1CRG;E0CSH,yBDyKuB;ECxKvB,qBDwKuB;A9C+uJ/B;;A+Cr6JE;EACE,cDqL2B;ECpL3B,yBDiLsB;A9CuvJ1B;A+Cr6JM;EAEE,cD+KuB;EC9KvB,yBAAA;A/Cs6JR;A+Cn6JM;EACE,W1CRG;E0CSH,yBDyKuB;ECxKvB,qBDwKuB;A9C6vJ/B;;A+Cn7JE;EACE,cDmLyB;EClLzB,yBDiLsB;A9CqwJ1B;A+Cn7JM;EAEE,cD6KqB;EC5KrB,yBAAA;A/Co7JR;A+Cj7JM;EACE,W1CRG;E0CSH,yBDuKqB;ECtKrB,qBDsKqB;A9C6wJ7B;;A+Cj8JE;EACE,cDqL2B;ECpL3B,yBDiLsB;A9CmxJ1B;A+Cj8JM;EAEE,cD+KuB;EC9KvB,yBAAA;A/Ck8JR;A+C/7JM;EACE,W1CRG;E0CSH,yBDyKuB;ECxKvB,qBDwKuB;A9CyxJ/B;;A+C/8JE;EACE,cDmLyB;EClLzB,yBDiLsB;A9Ciy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OQ;EAOI,yBAAA;AvEgkOZ;;AuEvkOQ;EAOI,yBAAA;AvEokOZ;;AuE3kOQ;EAOI,0BAAA;AvEwkOZ;;AuE/kOQ;EAOI,4BAAA;AvE4kOZ;;AuEnlOQ;EAOI,kCAAA;AvEglOZ;;AuEvlOQ;EAOI,sCAAA;AvEolOZ;;AuE3lOQ;EAOI,oCAAA;AvEwlOZ;;AuE/lOQ;EAOI,kCAAA;AvE4lOZ;;AuEnmOQ;EAOI,yCAAA;AvEgmOZ;;AuEvmOQ;EAOI,wCAAA;AvEomOZ;;AuE3mOQ;EAOI,wCAAA;AvEwmOZ;;AuE/mOQ;EAOI,kCAAA;AvE4mOZ;;AuEnnOQ;EAOI,gCAAA;AvEgnOZ;;AuEvnOQ;EAOI,8BAAA;AvEonOZ;;AuE3nOQ;EAOI,gCAAA;AvEwnOZ;;AuE/nOQ;EAOI,+BAAA;AvE4nOZ;;AuEnoOQ;EAOI,oCAAA;AvEgoOZ;;AuEvoOQ;EAOI,kCAAA;AvEooOZ;;AuE3oOQ;EAOI,gCAAA;AvEwoOZ;;AuE/oOQ;EAOI,uCAAA;AvE4oOZ;;AuEnpOQ;EAOI,sCAAA;AvEgpOZ;;AuEvpOQ;EAOI,iCAAA;AvEopOZ;;AuE3pOQ;EAOI,2BAAA;AvEwpOZ;;AuE/pOQ;EAOI,iCAAA;AvE4pOZ;;AuEnqOQ;EAOI,+BAAA;AvEgqOZ;;AuEvqOQ;EAOI,6BAAA;AvEoqOZ;;AuE3qOQ;EAOI,+BAAA;AvEwqOZ;;AuE/qOQ;EAOI,8BAAA;AvE4qOZ;;AuEnrOQ;EAOI,oBAAA;AvEgrOZ;;AuEvrOQ;EAOI,mBAAA;AvEorOZ;;AuE3rOQ;EAOI,mBAAA;AvEwrOZ;;AuE/rOQ;EAOI,mBAAA;AvE4rOZ;;AuEnsOQ;EAOI,mBAAA;AvEgsOZ;;AuEvsOQ;EAOI,mBAAA;AvEosOZ;;AuE3sOQ;EAOI,mBAAA;AvEwsOZ;;AuE/sOQ;EAOI,mBAAA;AvE4sOZ;;AuEntOQ;EAOI,oBAAA;AvEgtOZ;;AuEvtOQ;EAOI,0BAAA;AvEotOZ;;AuE3tOQ;EAOI,yBAAA;AvEwtOZ;;AuE/tOQ;EAOI,uBAAA;AvE4tOZ;;AuEnuOQ;EAOI,yBAAA;AvEguOZ;;AuEvuOQ;EAOI,uBAAA;AvEouOZ;;AuE3uOQ;EAOI,uBAAA;AvEwuOZ;;A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AAA;AvEkjPZ;;AuEzjPQ;EAOI,iCAAA;AvEsjPZ;;AuE7jPQ;EAOI,+BAAA;AvE0jPZ;;AuEjkPQ;EAOI,0BAAA;AvE8jPZ;;AuErkPQ;EAOI,gCAAA;AvEkkPZ;;AuEzkPQ;EAOI,+BAAA;AvEskPZ;;AuE7kPQ;EAOI,6BAAA;AvE0kPZ;;AuEjlPQ;EAOI,+BAAA;AvE8kPZ;;AuErlPQ;EAOI,6BAAA;AvEklPZ;;AuEzlPQ;EAOI,iBAAA;AvEslPZ;;AuE7lPQ;EAOI,uBAAA;AvE0lPZ;;AuEjmPQ;EAOI,sBAAA;AvE8lPZ;;AuErmPQ;EAOI,oBAAA;AvEkmPZ;;AuEzmPQ;EAOI,sBAAA;AvEsmPZ;;AuE7mPQ;EAOI,oBAAA;AvE0mPZ;;AuEjnPQ;EAOI,gDAAA;AvE8mPZ;;AuErnPQ;EAOI,4CAAA;AvEknPZ;;AuEznPQ;EAOI,4CAAA;AvEsnPZ;;AuE7nPQ;EAOI,0CAAA;AvE0nPZ;;AuEjoPQ;EAOI,4CAAA;AvE8nPZ;;AuEroPQ;EAOI,6BAAA;AvEkoPZ;;AuEzoPQ;EAOI,0BAAA;AvEsoPZ;;AuE7oPQ;EAOI,6BAAA;AvE0oPZ;;AuEjpPQ;EAOI,6BAAA;AvE8oPZ;;AuErpPQ;EAOI,2BAAA;AvEkpPZ;;AuEzpPQ;EAOI,+BAAA;AvEspPZ;;AuE7pPQ;EAOI,2BAAA;AvE0pPZ;;AuEjqPQ;EAOI,2BAAA;AvE8pPZ;;AuErqPQ;EAOI,2BAAA;AvEkqPZ;;AuEzqPQ;EAOI,8BAAA;AvEsqPZ;;AuE7qPQ;EAOI,yBAAA;AvE0qPZ;;AuEjrPQ;EAOI,4BAAA;AvE8qPZ;;AuErrPQ;EAOI,2BAAA;AvEkrPZ;;AuEzrPQ;EAOI,yBAAA;AvEsrPZ;;AuE7rPQ;EAOI,2BAAA;AvE0rPZ;;AuEjsPQ;EAOI,4BAAA;AvE8rPZ;;AuErsPQ;EAOI,6BAAA;AvEksPZ;;AuEzsPQ;EAOI,gCAAA;AvEssPZ;;AuE7sPQ;EAOI,qCAAA;AvE0sPZ;;AuEjtPQ;EAOI,wCAAA;AvE8sPZ;;AuErtPQ;EAOI,oCAAA;AvEktPZ;;AuEztPQ;EAOI,oCAAA;AvEstPZ;;AuE7tPQ;EAOI,qCAAA;AvE0tPZ;;AuEjuPQ;EAO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EuE5hQM;IAOI,yBAAA;EvEwhQV;EuE/hQM;IAOI,8BAAA;EvE2hQV;EuEliQM;IAOI,iCAAA;EvE8hQV;EuEriQM;IAOI,sCAAA;EvEiiQV;EuExiQM;IAOI,yCAAA;EvEoiQV;EuE3iQM;IAOI,uBAAA;EvEuiQV;EuE9iQM;IAOI,uBAAA;EvE0iQV;EuEjjQM;IAOI,yBAAA;EvE6iQV;EuEpjQM;IAOI,yBAAA;EvEgjQV;EuEvjQM;IAOI,0BAAA;EvEmjQV;EuE1jQM;IAOI,4BAAA;EvEsjQV;EuE7jQM;IAOI,kCAAA;EvEyjQV;EuEhkQM;IAOI,sCAAA;EvE4jQV;EuEnkQM;IAOI,oCAAA;EvE+jQV;EuEtkQM;IAOI,kCAAA;EvEkkQV;EuEzkQM;IAOI,yCAAA;EvEqkQV;EuE5kQM;IAOI,wCAAA;EvEwkQV;EuE/kQM;IAOI,wCAAA;EvE2kQV;EuEllQM;IAOI,kCAAA;EvE8kQV;EuErlQM;IAOI,gCAAA;EvEilQV;EuExlQM;IAOI,8BAAA;EvEolQV;EuE3lQM;IAOI,gCAAA;EvEulQV;EuE9lQM;IAOI,+BAAA;EvE0lQV;EuEjmQM;IAOI,oCAAA;EvE6lQV;EuEpmQM;IAOI,kCAAA;EvEgmQV;EuEvmQM;IAOI,gCAAA;EvEmmQV;EuE1mQM;IAOI,uCAAA;EvEsmQV;EuE7mQM;IAOI,sCAAA;EvEymQV;EuEhnQM;IAOI,iCAAA;EvE4mQV;EuEnnQM;IAOI,2BAAA;EvE+mQV;EuEtnQM;IAOI,iCAAA;EvEknQV;EuEznQM;IAOI,+BAAA;EvEqnQV;EuE5nQM;IAOI,6BAAA;EvEwnQV;EuE/nQM;IAOI,+BAAA;EvE2nQV;EuEloQM;IAOI,8BAAA;EvE8nQV;EuEroQM;IAOI,oBAAA;EvEioQV;EuExoQM;IAOI,mBAAA;EvEooQV;EuE3oQM;IAOI,mBAAA;EvEuoQV;EuE9oQM;IAOI,mBAAA;EvE0oQV;EuEjpQM;IAOI,mBAAA;EvE6oQV;EuEppQM;IAOI,mBAAA;EvEgpQV;EuEvpQM;IAOI,mBAAA;EvEmpQV;EuE1pQM;IAOI,mBAAA;EvEspQV;EuE7pQM;IAOI,oBAAA;EvEypQV;EuEhqQM;IAOI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vEg6QV;EuEv6QM;IAOI,kCAAA;EvEm6QV;EuE16QM;IAOI,iCAAA;EvEs6QV;EuE76QM;IAOI,+BAAA;EvEy6QV;EuEh7QM;IAOI,iCAAA;EvE46QV;EuEn7QM;IAOI,+BAAA;EvE+6QV;EuEt7QM;IAOI,0BAAA;EvEk7QV;EuEz7QM;IAOI,gCAAA;EvEq7QV;EuE57QM;IAOI,+BAAA;EvEw7QV;EuE/7QM;IAOI,6BAAA;EvE27QV;EuEl8QM;IAOI,+BAAA;EvE87QV;EuEr8QM;IAOI,6BAAA;EvEi8QV;EuEx8QM;IAOI,iBAAA;EvEo8QV;EuE38QM;IAOI,uBAAA;EvEu8QV;EuE98QM;IAOI,sBAAA;EvE08QV;EuEj9QM;IAOI,oBAAA;EvE68QV;EuEp9QM;IAOI,sBAAA;EvEg9QV;EuEv9QM;IAOI,oBAAA;EvEm9QV;EuE19QM;IAOI,2BAAA;EvEs9QV;EuE79QM;IAOI,4BAAA;EvEy9QV;EuEh+QM;IAOI,6BAAA;EvE49QV;AACF;Aav+QI;E0DGI;IAOI,sBAAA;EvEi+QV;EuEx+QM;IAOI,uBAAA;EvEo+QV;EuE3+QM;IAOI,sBAAA;EvEu+QV;EuE9+QM;IAOI,0BAAA;EvE0+QV;EuEj/QM;IAOI,gCAAA;EvE6+QV;EuEp/QM;IAOI,yBAAA;EvEg/QV;EuEv/QM;IAOI,wBAAA;EvEm/QV;EuE1/QM;IAOI,yBAAA;EvEs/QV;EuE7/QM;IAOI,6BAAA;EvEy/QV;EuEhgRM;IAOI,8BAAA;EvE4/QV;EuEngRM;IAOI,wBAAA;EvE+/QV;EuEtgRM;IAOI,+BAAA;EvEkgRV;EuEzgRM;IAOI,wBAAA;EvEqgRV;EuE5gRM;IAOI,yBAAA;EvEwgRV;EuE/gRM;IAOI,8BAAA;EvE2gRV;EuElhRM;IAOI,iCAAA;EvE8gRV;EuErhRM;IAOI,sCAAA;EvEihRV;EuExhRM;IAOI,yCAAA;EvEohRV;EuE3hRM;IAOI,uBAAA;EvEuhRV;EuE9hRM;IAOI,uBAAA;EvE0hRV;EuEjiRM;IAOI,yBAAA;EvE6hRV;EuEpiRM;IAOI,yBAAA;EvEgiRV;EuEviRM;IAOI,0BAAA;EvEmiRV;EuE1iRM;IAOI,4BAAA;EvE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AAA;EvEi7RV;EuEx7RM;IAOI,iBAAA;EvEo7RV;EuE37RM;IAOI,uBAAA;EvEu7RV;EuE97RM;IAOI,sBAAA;EvE07RV;EuEj8RM;IAOI,oBAAA;EvE67RV;EuEp8RM;IAOI,sBAAA;EvEg8RV;EuEv8RM;IAOI,oBAAA;EvEm8RV;EuE18RM;IAOI,2BAAA;EvEs8RV;EuE78RM;IAOI,4BAAA;EvEy8RV;EuEh9RM;IAOI,6BAAA;EvE48RV;AACF;Aav9RI;E0DGI;IAOI,sBAAA;EvEi9RV;EuEx9RM;IAOI,uBAAA;EvEo9RV;EuE39RM;IAOI,sBAAA;EvEu9RV;EuE99RM;IAOI,0BAAA;EvE09RV;EuEj+RM;IAOI,gCAAA;EvE69RV;EuEp+RM;IAOI,yBAAA;EvEg+RV;EuEv+RM;IAOI,wBAAA;EvEm+RV;EuE1+RM;IAOI,yBAAA;EvEs+RV;EuE7+RM;IAOI,6BAAA;EvEy+RV;EuEh/RM;IAOI,8BAAA;EvE4+RV;EuEn/RM;IAOI,wBAAA;EvE++RV;EuEt/RM;IAOI,+BAAA;EvEk/RV;EuEz/RM;IAOI,wBAAA;EvEq/RV;EuE5/RM;IAOI,yBAAA;EvEw/RV;EuE//RM;IAOI,8BAAA;EvE2/RV;EuElgSM;IAOI,iCAAA;EvE8/RV;EuErgSM;IAOI,sCAAA;EvEigSV;EuExgSM;IAOI,yCAAA;EvEogSV;EuE3gSM;IAOI,uBAAA;EvEugSV;EuE9gSM;IAOI,uBAAA;EvE0gSV;EuEjhSM;IAOI,yBAAA;EvE6gSV;EuEphSM;IAOI,yBAAA;EvEghSV;EuEvhSM;IAOI,0BAAA;EvEmhSV;EuE1hSM;IAOI,4BAAA;EvEshSV;EuE7hSM;IAOI,kCAAA;EvEyhSV;EuEhiSM;IAOI,sCAAA;EvE4hSV;EuEniSM;IAOI,oCAAA;EvE+hSV;EuEtiSM;IAOI,kCAAA;EvEkiSV;EuEziSM;IAOI,yCAAA;EvEqiSV;EuE5iSM;IAOI,wCAAA;EvEwiSV;EuE/iSM;IAOI,wCAAA;EvE2iSV;EuEljSM;IAOI,kCAAA;EvE8iSV;EuErjSM;IAOI,gCAAA;EvEijSV;EuExjSM;IAOI,8BAAA;EvEojSV;EuE3jSM;IAOI,gCAA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EuEx8SM;IAOI,uBAAA;EvEo8SV;EuE38SM;IAOI,sBAAA;EvEu8SV;EuE98SM;IAOI,0BAAA;EvE08SV;EuEj9SM;IAOI,gCAAA;EvE68SV;EuEp9SM;IAOI,yBAAA;EvEg9SV;EuEv9SM;IAOI,wBAAA;EvEm9SV;EuE19SM;IAOI,yBAAA;EvEs9SV;EuE79SM;IAOI,6BAAA;EvEy9SV;EuEh+SM;IAOI,8BAAA;EvE49SV;EuEn+SM;IAOI,wBAAA;EvE+9SV;EuEt+SM;IAOI,+BAAA;EvEk+SV;EuEz+SM;IAOI,wBAAA;EvEq+SV;EuE5+SM;IAOI,yBAAA;EvEw+SV;EuE/+SM;IAOI,8BAAA;EvE2+SV;EuEl/SM;IAOI,iCAAA;EvE8+SV;EuEr/SM;IAOI,sCAAA;EvEi/SV;EuEx/SM;IAOI,yCAAA;EvEo/SV;EuE3/SM;IAOI,uBAAA;EvEu/SV;EuE9/SM;IAOI,uBAAA;EvE0/SV;EuEjgTM;IAOI,yBAAA;EvE6/SV;EuEpgTM;IAOI,yBAAA;EvEggTV;EuEvgTM;IAOI,0BAAA;EvEmgTV;EuE1gTM;IAOI,4BAAA;EvEsgTV;EuE7gTM;IAOI,kCAAA;EvEygTV;EuEhhTM;IAOI,sCAAA;EvE4gTV;EuEnhTM;IAOI,oCAAA;EvE+gTV;EuEthTM;IAOI,kCAAA;EvEkhTV;EuEzhTM;IAOI,yCAAA;EvEqhTV;EuE5hTM;IAOI,wCAAA;EvEwhTV;EuE/hTM;IAOI,wCAAA;EvE2hTV;EuEliTM;IAOI,kCAAA;EvE8hTV;EuEriTM;IAOI,gCAAA;EvEiiTV;EuExiTM;IAOI,8BAAA;EvEoiTV;EuE3iTM;IAOI,gCAAA;EvEuiTV;EuE9iTM;IAOI,+BAAA;EvE0iTV;EuEjjTM;IAOI,oCAAA;EvE6iTV;EuEpjTM;IAOI,kCAAA;EvEgjTV;EuEvjTM;IAOI,gCAAA;EvEmjTV;EuE1jTM;IAOI,uCAAA;EvEsjTV;EuE7jTM;IAOI,sCAAA;EvEyjTV;EuEhkTM;IAOI,iCAAA;EvE4jTV;EuEnkTM;IAOI,2BAAA;EvE+jTV;EuEtkTM;IAOI,iCAAA;EvEkkTV;EuEzkTM;IAOI,+BAAA;EvEqkTV;EuE5kTM;IAOI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vE40TV;EuEn1TM;IAOI,+BAAA;EvE+0TV;EuEt1TM;IAOI,8BAAA;EvEk1TV;EuEz1TM;IAOI,4BAAA;EvEq1TV;EuE51TM;IAOI,8BAAA;EvEw1TV;EuE/1TM;IAOI,4BAAA;EvE21TV;EuEl2TM;IAOI,2BAAA;EvE81TV;EuEr2TM;IAOI,iCAAA;EvEi2TV;EuEx2TM;IAOI,gCAAA;EvEo2TV;EuE32TM;IAOI,8BAAA;EvEu2TV;EuE92TM;IAOI,gCAAA;EvE02TV;EuEj3TM;IAOI,8BAAA;EvE62TV;EuEp3TM;IAOI,4BAAA;EvEg3TV;EuEv3TM;IAOI,kCAAA;EvEm3TV;EuE13TM;IAOI,iCAAA;EvEs3TV;EuE73TM;IAOI,+BAAA;EvEy3TV;EuEh4TM;IAOI,iCAAA;EvE43TV;EuEn4TM;IAOI,+BAAA;EvE+3TV;EuEt4TM;IAOI,0BAAA;EvEk4TV;EuEz4TM;IAOI,gCAAA;EvEq4TV;EuE54TM;IAOI,+BAAA;EvEw4TV;EuE/4TM;IAOI,6BAAA;EvE24TV;EuEl5TM;IAOI,+BAAA;EvE84TV;EuEr5TM;IAOI,6BAAA;EvEi5TV;EuEx5TM;IAOI,iBAAA;EvEo5TV;EuE35TM;IAOI,uBAAA;EvEu5TV;EuE95TM;IAOI,sBAAA;EvE05TV;EuEj6TM;IAOI,oBAAA;EvE65TV;EuEp6TM;IAOI,sBAAA;EvEg6TV;EuEv6TM;IAOI,oBAAA;EvEm6TV;EuE16TM;IAOI,2BAAA;EvEs6TV;EuE76TM;IAOI,4BAAA;EvEy6TV;EuEh7TM;IAOI,6BAAA;EvE46TV;AACF;Aav7TI;E0DGI;IAOI,sBAAA;EvEi7TV;EuEx7TM;IAOI,uBAAA;EvEo7TV;EuE37TM;IAOI,sBAAA;EvEu7TV;EuE97TM;IAOI,0BAAA;EvE07TV;EuEj8TM;IAOI,gCAAA;EvE67TV;EuEp8TM;IAOI,yBAAA;EvEg8TV;EuEv8TM;IAOI,wBAAA;EvEm8TV;EuE18TM;IAOI,yBAAA;EvEs8TV;EuE78TM;IAOI,6BAAA;EvEy8TV;EuEh9TM;IAOI,8BAAA;EvE48TV;EuEn9TM;IAOI,wBAAA;EvE+8TV;EuEt9TM;IAOI,+BAAA;EvEk9TV;EuEz9TM;IAOI,wBAAA;EvEq9TV;EuE59TM;IAOI,yBAAA;EvEw9TV;EuE/9TM;IAOI,8BAAA;EvE29TV;EuEl+TM;IAOI,iCAAA;EvE89TV;EuEr+TM;IAOI,sCAAA;EvEi+TV;EuEx+TM;IAOI,yCAAA;EvEo+TV;EuE3+TM;IAOI,uBAAA;EvEu+TV;EuE9+TM;IAOI,uBAAA;EvE0+TV;EuEj/TM;IAOI,yBAAA;EvE6+TV;EuEp/TM;IAOI,yBAAA;EvEg/TV;EuEv/TM;IAOI,0BAAA;EvEm/TV;EuE1/TM;IAOI,4BAAA;EvEs/TV;EuE7/TM;IAOI,kCAAA;EvEy/TV;EuEhgUM;IAOI,sCAAA;EvE4/TV;EuEngUM;IAOI,oCAAA;EvE+/TV;EuEtgUM;IAOI,kCAAA;EvEkgUV;EuEzgUM;IAOI,yCAAA;EvEqgUV;EuE5gUM;IAOI,wCAAA;EvEwgUV;EuE/gUM;IAOI,wCAAA;EvE2gUV;EuElhUM;IAOI,kCAAA;EvE8gUV;EuErhUM;IAOI,gCAAA;EvEihUV;EuExhUM;IAOI,8BAAA;EvEohUV;EuE3hUM;IAOI,gCAAA;EvEuhUV;EuE9hUM;IAOI,+BAAA;EvE0hUV;EuEjiUM;IAOI,oCAAA;EvE6hUV;EuEpiUM;IAOI,kCAAA;EvEgiUV;EuEviUM;IAOI,gCAAA;EvEmiUV;EuE1iUM;IAOI,uCAAA;EvEsiUV;EuE7iUM;IAOI,sCAAA;EvEyiUV;EuEhjUM;IAOI,iCAAA;EvE4iUV;EuEnjUM;IAOI,2BAAA;EvE+iUV;EuEtjUM;IAOI,iCAAA;EvEkjUV;EuEzjUM;IAOI,+BAAA;EvEqjUV;EuE5jUM;IAOI,6BAAA;EvEwjUV;EuE/jUM;IAOI,+BAAA;EvE2jUV;EuElkUM;IAOI,8BAAA;EvE8jUV;EuErkUM;IAOI,oBAAA;EvEikUV;EuExkUM;IAOI,mBAAA;EvEokUV;EuE3kUM;IAOI,mBAAA;EvEukUV;EuE9kUM;IAOI,mBAAA;EvE0kUV;EuEjlUM;IAOI,mBAAA;EvE6kUV;EuEplUM;IAOI,mBAAA;EvEglUV;EuEvlUM;IAOI,mBAAA;EvEmlUV;EuE1lUM;IAOI,mBAAA;EvEslUV;EuE7lUM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","sourcesContent":["// Import all of Bootstrap's CSS\r\n@import \"~bootstrap/scss/bootstrap\";\r\n\r\n\r\n\r\n// globals and variables\r\n$primary-white: #FEFBF4;\r\n$light-blue: #C3D4E8;\r\n$green: #B9C44A;\r\n$mid-blue: #6491BA;\r\n$dark-blue: #426078;\r\n$light-green: #EBEED9;\r\n\r\nbody {\r\n    background-color: $primary-white;\r\n}\r\n\r\n* {\r\n    padding: 0;\r\n    margin: 0;\r\n\r\n}\r\n\r\n// header\r\nheader {\r\n    color: $primary-white;\r\n    width: 100vw;\r\n    height:450px;\r\n    text-align: center;\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n}\r\n\r\n#subtitle {\r\n    font-style: italic;\r\n}\r\n\r\n// nav\r\nnav {\r\n    background-color: none;\r\n    width: 50%;\r\n    padding:10px 20px;\r\n    margin: auto;\r\n    display: flex;\r\n    justify-content: center;\r\n}\r\n\r\n.btn-nav {\r\n    border: none;\r\n    width: 33%;\r\n    background-color: $primary-white;\r\n    padding: 15px 25px;   \r\n}\r\n\r\n.btn-nav:hover {\r\n    font-style: italic;\r\n}\r\n\r\n.btn-nav:first-of-type {\r\n    border-right: 1px $green solid;\r\n}\r\n\r\n.btn-nav:last-of-type {\r\n    border-left: 1px $green solid;\r\n}\r\n\r\n\r\n// main\r\n#copy {\r\n    padding: 20px 60px;\r\n}\r\n\r\n\r\n// copy\r\n\r\n#translation {\r\n    font-style: italic;\r\n}\r\n\r\n// footer\r\nfooter {\r\n\r\n    font-size: 10pt;\r\n    position: absolute;\r\n    text-align: center;\r\n    max-height: 15px;\r\n    margin: 10px 0px;\r\n    bottom: 0;\r\n    opacity: 0.5;\r\n    width: 100%;\r\n}\r\n\r\nfooter a {\r\n    font-size: 10pt;\r\n    text-decoration: underline;\r\n    color: $dark-blue;\r\n}\r\n\r\nfooter a:hover {\r\n    color: #172938;\r\n}","@mixin bsBanner($file) {\n  /*!\n   * Bootstrap #{$file} v5.2.2 (https://getbootstrap.com/)\n   * Copyright 2011-2022 The Bootstrap Authors\n   * Copyright 2011-2022 Twitter, Inc.\n   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)\n   */\n}\n\n",":root {\n  // Note: Custom variable values only support SassScript inside `#{}`.\n\n  // Colors\n  //\n  // Generate palettes for full colors, grays, and theme colors.\n\n  @each $color, $value in $colors {\n    --#{$prefix}#{$color}: #{$value};\n  }\n\n  @each $color, $value in $grays {\n    --#{$prefix}gray-#{$color}: #{$value};\n  }\n\n  @each $color, $value in $theme-colors {\n    --#{$prefix}#{$color}: #{$value};\n  }\n\n  @each $color, $value in $theme-colors-rgb {\n    --#{$prefix}#{$color}-rgb: #{$value};\n  }\n\n  --#{$prefix}white-rgb: #{to-rgb($white)};\n  --#{$prefix}black-rgb: #{to-rgb($black)};\n  --#{$prefix}body-color-rgb: #{to-rgb($body-color)};\n  --#{$prefix}body-bg-rgb: #{to-rgb($body-bg)};\n\n  // Fonts\n\n  // Note: Use `inspect` for lists so that quoted items keep the quotes.\n  // See https://github.com/sass/sass/issues/2383#issuecomment-336349172\n  --#{$prefix}font-sans-serif: #{inspect($font-family-sans-serif)};\n  --#{$prefix}font-monospace: #{inspect($font-family-monospace)};\n  --#{$prefix}gradient: #{$gradient};\n\n  // Root and body\n  // scss-docs-start root-body-variables\n  @if $font-size-root != null {\n    --#{$prefix}root-font-size: #{$font-size-root};\n  }\n  --#{$prefix}body-font-family: #{$font-family-base};\n  @include rfs($font-size-base, --#{$prefix}body-font-size);\n  --#{$prefix}body-font-weight: #{$font-weight-base};\n  --#{$prefix}body-line-height: #{$line-height-base};\n  --#{$prefix}body-color: #{$body-color};\n  @if $body-text-align != null {\n    --#{$prefix}body-text-align: #{$body-text-align};\n  }\n  --#{$prefix}body-bg: #{$body-bg};\n  // scss-docs-end root-body-variables\n\n  // scss-docs-start root-border-var\n  --#{$prefix}border-width: #{$border-width};\n  --#{$prefix}border-style: #{$border-style};\n  --#{$prefix}border-color: #{$border-color};\n  --#{$prefix}border-color-translucent: #{$border-color-translucent};\n\n  --#{$prefix}border-radius: #{$border-radius};\n  --#{$prefix}border-radius-sm: #{$border-radius-sm};\n  --#{$prefix}border-radius-lg: #{$border-radius-lg};\n  --#{$prefix}border-radius-xl: #{$border-radius-xl};\n  --#{$prefix}border-radius-2xl: #{$border-radius-2xl};\n  --#{$prefix}border-radius-pill: #{$border-radius-pill};\n  // scss-docs-end root-border-var\n\n  --#{$prefix}link-color: #{$link-color};\n  --#{$prefix}link-hover-color: #{$link-hover-color};\n\n  --#{$prefix}code-color: #{$code-color};\n\n  --#{$prefix}highlight-bg: #{$mark-bg};\n}\n","// stylelint-disable property-blacklist, scss/dollar-variable-default\n\n// SCSS RFS mixin\n//\n// Automated responsive values for font sizes, paddings, margins and much more\n//\n// Licensed under MIT (https://github.com/twbs/rfs/blob/main/LICENSE)\n\n// Configuration\n\n// Base value\n$rfs-base-value: 1.25rem !default;\n$rfs-unit: rem !default;\n\n@if $rfs-unit != rem and $rfs-unit != px {\n  @error \"`#{$rfs-unit}` is not a valid unit for $rfs-unit. Use `px` or `rem`.\";\n}\n\n// Breakpoint at where values start decreasing if screen width is smaller\n$rfs-breakpoint: 1200px !default;\n$rfs-breakpoint-unit: px !default;\n\n@if $rfs-breakpoint-unit != px and $rfs-breakpoint-unit != em and $rfs-breakpoint-unit != rem {\n  @error \"`#{$rfs-breakpoint-unit}` is not a valid unit for $rfs-breakpoint-unit. Use `px`, `em` or `rem`.\";\n}\n\n// Resize values based on screen height and width\n$rfs-two-dimensional: false !default;\n\n// Factor of decrease\n$rfs-factor: 10 !default;\n\n@if type-of($rfs-factor) != number or $rfs-factor <= 1 {\n  @error \"`#{$rfs-factor}` is not a valid  $rfs-factor, it must be greater than 1.\";\n}\n\n// Mode. Possibilities: \"min-media-query\", \"max-media-query\"\n$rfs-mode: min-media-query !default;\n\n// Generate enable or disable classes. Possibilities: false, \"enable\" or \"disable\"\n$rfs-class: false !default;\n\n// 1 rem = $rfs-rem-value px\n$rfs-rem-value: 16 !default;\n\n// Safari iframe resize bug: https://github.com/twbs/rfs/issues/14\n$rfs-safari-iframe-resize-bug-fix: false !default;\n\n// Disable RFS by setting $enable-rfs to false\n$enable-rfs: true !default;\n\n// Cache $rfs-base-value unit\n$rfs-base-value-unit: unit($rfs-base-value);\n\n@function divide($dividend, $divisor, $precision: 10) {\n  $sign: if($dividend > 0 and $divisor > 0 or $dividend < 0 and $divisor < 0, 1, -1);\n  $dividend: abs($dividend);\n  $divisor: abs($divisor);\n  @if $dividend == 0 {\n    @return 0;\n  }\n  @if $divisor == 0 {\n    @error \"Cannot divide by 0\";\n  }\n  $remainder: $dividend;\n  $result: 0;\n  $factor: 10;\n  @while ($remainder > 0 and $precision >= 0) {\n    $quotient: 0;\n    @while ($remainder >= $divisor) {\n      $remainder: $remainder - $divisor;\n      $quotient: $quotient + 1;\n    }\n    $result: $result * 10 + $quotient;\n    $factor: $factor * .1;\n    $remainder: $remainder * 10;\n    $precision: $precision - 1;\n    @if ($precision < 0 and $remainder >= $divisor * 5) {\n      $result: $result + 1;\n    }\n  }\n  $result: $result * $factor * $sign;\n  $dividend-unit: unit($dividend);\n  $divisor-unit: unit($divisor);\n  $unit-map: (\n    \"px\": 1px,\n    \"rem\": 1rem,\n    \"em\": 1em,\n    \"%\": 1%\n  );\n  @if ($dividend-unit != $divisor-unit and map-has-key($unit-map, $dividend-unit)) {\n    $result: $result * map-get($unit-map, $dividend-unit);\n  }\n  @return $result;\n}\n\n// Remove px-unit from $rfs-base-value for calculations\n@if $rfs-base-value-unit == px {\n  $rfs-base-value: divide($rfs-base-value, $rfs-base-value * 0 + 1);\n}\n@else if $rfs-base-value-unit == rem {\n  $rfs-base-value: divide($rfs-base-value, divide($rfs-base-value * 0 + 1, $rfs-rem-value));\n}\n\n// Cache $rfs-breakpoint unit to prevent multiple calls\n$rfs-breakpoint-unit-cache: unit($rfs-breakpoint);\n\n// Remove unit from $rfs-breakpoint for calculations\n@if $rfs-breakpoint-unit-cache == px {\n  $rfs-breakpoint: divide($rfs-breakpoint, $rfs-breakpoint * 0 + 1);\n}\n@else if $rfs-breakpoint-unit-cache == rem or $rfs-breakpoint-unit-cache == \"em\" {\n  $rfs-breakpoint: divide($rfs-breakpoint, divide($rfs-breakpoint * 0 + 1, $rfs-rem-value));\n}\n\n// Calculate the media query value\n$rfs-mq-value: if($rfs-breakpoint-unit == px, #{$rfs-breakpoint}px, #{divide($rfs-breakpoint, $rfs-rem-value)}#{$rfs-breakpoint-unit});\n$rfs-mq-property-width: if($rfs-mode == max-media-query, max-width, min-width);\n$rfs-mq-property-height: if($rfs-mode == max-media-query, max-height, min-height);\n\n// Internal mixin used to determine which media query needs to be used\n@mixin _rfs-media-query {\n  @if $rfs-two-dimensional {\n    @if $rfs-mode == max-media-query {\n      @media (#{$rfs-mq-property-width}: #{$rfs-mq-value}), (#{$rfs-mq-property-height}: #{$rfs-mq-value}) {\n        @content;\n      }\n    }\n    @else {\n      @media (#{$rfs-mq-property-width}: #{$rfs-mq-value}) and (#{$rfs-mq-property-height}: #{$rfs-mq-value}) {\n        @content;\n      }\n    }\n  }\n  @else {\n    @media (#{$rfs-mq-property-width}: #{$rfs-mq-value}) {\n      @content;\n    }\n  }\n}\n\n// Internal mixin that adds disable classes to the selector if needed.\n@mixin _rfs-rule {\n  @if $rfs-class == disable and $rfs-mode == max-media-query {\n    // Adding an extra class increases specificity, which prevents the media query to override the property\n    &,\n    .disable-rfs &,\n    &.disable-rfs {\n      @content;\n    }\n  }\n  @else if $rfs-class == enable and $rfs-mode == min-media-query {\n    .enable-rfs &,\n    &.enable-rfs {\n      @content;\n    }\n  }\n  @else {\n    @content;\n  }\n}\n\n// Internal mixin that adds enable classes to the selector if needed.\n@mixin _rfs-media-query-rule {\n\n  @if $rfs-class == enable {\n    @if $rfs-mode == min-media-query {\n      @content;\n    }\n\n    @include _rfs-media-query {\n      .enable-rfs &,\n      &.enable-rfs {\n        @content;\n      }\n    }\n  }\n  @else {\n    @if $rfs-class == disable and $rfs-mode == min-media-query {\n      .disable-rfs &,\n      &.disable-rfs {\n        @content;\n      }\n    }\n    @include _rfs-media-query {\n      @content;\n    }\n  }\n}\n\n// Helper function to get the formatted non-responsive value\n@function rfs-value($values) {\n  // Convert to list\n  $values: if(type-of($values) != list, ($values,), $values);\n\n  $val: '';\n\n  // Loop over each value and calculate value\n  @each $value in $values {\n    @if $value == 0 {\n      $val: $val + ' 0';\n    }\n    @else {\n      // Cache $value unit\n      $unit: if(type-of($value) == \"number\", unit($value), false);\n\n      @if $unit == px {\n        // Convert to rem if needed\n        $val: $val + ' ' + if($rfs-unit == rem, #{divide($value, $value * 0 + $rfs-rem-value)}rem, $value);\n      }\n      @else if $unit == rem {\n        // Convert to px if needed\n        $val: $val + ' ' + if($rfs-unit == px, #{divide($value, $value * 0 + 1) * $rfs-rem-value}px, $value);\n      }\n      @else {\n        // If $value isn't a number (like inherit) or $value has a unit (not px or rem, like 1.5em) or $ is 0, just print the value\n        $val: $val + ' ' + $value;\n      }\n    }\n  }\n\n  // Remove first space\n  @return unquote(str-slice($val, 2));\n}\n\n// Helper function to get the responsive value calculated by RFS\n@function rfs-fluid-value($values) {\n  // Convert to list\n  $values: if(type-of($values) != list, ($values,), $values);\n\n  $val: '';\n\n  // Loop over each value and calculate value\n  @each $value in $values {\n    @if $value == 0 {\n      $val: $val + ' 0';\n    }\n\n    @else {\n      // Cache $value unit\n      $unit: if(type-of($value) == \"number\", unit($value), false);\n\n      // If $value isn't a number (like inherit) or $value has a unit (not px or rem, like 1.5em) or $ is 0, just print the value\n      @if not $unit or $unit != px and $unit != rem {\n        $val: $val + ' ' + $value;\n      }\n\n      @else {\n        // Remove unit from $value for calculations\n        $value: divide($value, $value * 0 + if($unit == px, 1, divide(1, $rfs-rem-value)));\n\n        // Only add the media query if the value is greater than the minimum value\n        @if abs($value) <= $rfs-base-value or not $enable-rfs {\n          $val: $val + ' ' +  if($rfs-unit == rem, #{divide($value, $rfs-rem-value)}rem, #{$value}px);\n        }\n        @else {\n          // Calculate the minimum value\n          $value-min: $rfs-base-value + divide(abs($value) - $rfs-base-value, $rfs-factor);\n\n          // Calculate difference between $value and the minimum value\n          $value-diff: abs($value) - $value-min;\n\n          // Base value formatting\n          $min-width: if($rfs-unit == rem, #{divide($value-min, $rfs-rem-value)}rem, #{$value-min}px);\n\n          // Use negative value if needed\n          $min-width: if($value < 0, -$min-width, $min-width);\n\n          // Use `vmin` if two-dimensional is enabled\n          $variable-unit: if($rfs-two-dimensional, vmin, vw);\n\n          // Calculate the variable width between 0 and $rfs-breakpoint\n          $variable-width: #{divide($value-diff * 100, $rfs-breakpoint)}#{$variable-unit};\n\n          // Return the calculated value\n          $val: $val + ' calc(' + $min-width + if($value < 0, ' - ', ' + ') + $variable-width + ')';\n        }\n      }\n    }\n  }\n\n  // Remove first space\n  @return unquote(str-slice($val, 2));\n}\n\n// RFS mixin\n@mixin rfs($values, $property: font-size) {\n  @if $values != null {\n    $val: rfs-value($values);\n    $fluidVal: rfs-fluid-value($values);\n\n    // Do not print the media query if responsive & non-responsive values are the same\n    @if $val == $fluidVal {\n      #{$property}: $val;\n    }\n    @else {\n      @include _rfs-rule {\n        #{$property}: if($rfs-mode == max-media-query, $val, $fluidVal);\n\n        // Include safari iframe resize fix if needed\n        min-width: if($rfs-safari-iframe-resize-bug-fix, (0 * 1vw), null);\n      }\n\n      @include _rfs-media-query-rule {\n        #{$property}: if($rfs-mode == max-media-query, $fluidVal, $val);\n      }\n    }\n  }\n}\n\n// Shorthand helper mixins\n@mixin font-size($value) {\n  @include rfs($value);\n}\n\n@mixin padding($value) {\n  @include rfs($value, padding);\n}\n\n@mixin padding-top($value) {\n  @include rfs($value, padding-top);\n}\n\n@mixin padding-right($value) {\n  @include rfs($value, padding-right);\n}\n\n@mixin padding-bottom($value) {\n  @include rfs($value, padding-bottom);\n}\n\n@mixin padding-left($value) {\n  @include rfs($value, padding-left);\n}\n\n@mixin margin($value) {\n  @include rfs($value, margin);\n}\n\n@mixin margin-top($value) {\n  @include rfs($value, margin-top);\n}\n\n@mixin margin-right($value) {\n  @include rfs($value, margin-right);\n}\n\n@mixin margin-bottom($value) {\n  @include rfs($value, margin-bottom);\n}\n\n@mixin margin-left($value) {\n  @include rfs($value, margin-left);\n}\n","// stylelint-disable declaration-no-important, selector-no-qualifying-type, property-no-vendor-prefix\n\n\n// Reboot\n//\n// Normalization of HTML elements, manually forked from Normalize.css to remove\n// styles targeting irrelevant browsers while applying new styles.\n//\n// Normalize is licensed MIT. https://github.com/necolas/normalize.css\n\n\n// Document\n//\n// Change from `box-sizing: content-box` so that `width` is not affected by `padding` or `border`.\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n\n// Root\n//\n// Ability to the value of the root font sizes, affecting the value of `rem`.\n// null by default, thus nothing is generated.\n\n:root {\n  @if $font-size-root != null {\n    @include font-size(var(--#{$prefix}root-font-size));\n  }\n\n  @if $enable-smooth-scroll {\n    @media (prefers-reduced-motion: no-preference) {\n      scroll-behavior: smooth;\n    }\n  }\n}\n\n\n// Body\n//\n// 1. Remove the margin in all browsers.\n// 2. As a best practice, apply a default `background-color`.\n// 3. Prevent adjustments of font size after orientation changes in iOS.\n// 4. Change the default tap highlight to be completely transparent in iOS.\n\n// scss-docs-start reboot-body-rules\nbody {\n  margin: 0; // 1\n  font-family: var(--#{$prefix}body-font-family);\n  @include font-size(var(--#{$prefix}body-font-size));\n  font-weight: var(--#{$prefix}body-font-weight);\n  line-height: var(--#{$prefix}body-line-height);\n  color: var(--#{$prefix}body-color);\n  text-align: var(--#{$prefix}body-text-align);\n  background-color: var(--#{$prefix}body-bg); // 2\n  -webkit-text-size-adjust: 100%; // 3\n  -webkit-tap-highlight-color: rgba($black, 0); // 4\n}\n// scss-docs-end reboot-body-rules\n\n\n// Content grouping\n//\n// 1. Reset Firefox's gray color\n\nhr {\n  margin: $hr-margin-y 0;\n  color: $hr-color; // 1\n  border: 0;\n  border-top: $hr-border-width solid $hr-border-color;\n  opacity: $hr-opacity;\n}\n\n\n// Typography\n//\n// 1. Remove top margins from headings\n//    By default, `<h1>`-`<h6>` all receive top and bottom margins. We nuke the top\n//    margin for easier control within type scales as it avoids margin collapsing.\n\n%heading {\n  margin-top: 0; // 1\n  margin-bottom: $headings-margin-bottom;\n  font-family: $headings-font-family;\n  font-style: $headings-font-style;\n  font-weight: $headings-font-weight;\n  line-height: $headings-line-height;\n  color: $headings-color;\n}\n\nh1 {\n  @extend %heading;\n  @include font-size($h1-font-size);\n}\n\nh2 {\n  @extend %heading;\n  @include font-size($h2-font-size);\n}\n\nh3 {\n  @extend %heading;\n  @include font-size($h3-font-size);\n}\n\nh4 {\n  @extend %heading;\n  @include font-size($h4-font-size);\n}\n\nh5 {\n  @extend %heading;\n  @include font-size($h5-font-size);\n}\n\nh6 {\n  @extend %heading;\n  @include font-size($h6-font-size);\n}\n\n\n// Reset margins on paragraphs\n//\n// Similarly, the top margin on `<p>`s get reset. However, we also reset the\n// bottom margin to use `rem` units instead of `em`.\n\np {\n  margin-top: 0;\n  margin-bottom: $paragraph-margin-bottom;\n}\n\n\n// Abbreviations\n//\n// 1. Add the correct text decoration in Chrome, Edge, Opera, and Safari.\n// 2. Add explicit cursor to indicate changed behavior.\n// 3. Prevent the text-decoration to be skipped.\n\nabbr[title] {\n  text-decoration: underline dotted; // 1\n  cursor: help; // 2\n  text-decoration-skip-ink: none; // 3\n}\n\n\n// Address\n\naddress {\n  margin-bottom: 1rem;\n  font-style: normal;\n  line-height: inherit;\n}\n\n\n// Lists\n\nol,\nul {\n  padding-left: 2rem;\n}\n\nol,\nul,\ndl {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\nol ol,\nul ul,\nol ul,\nul ol {\n  margin-bottom: 0;\n}\n\ndt {\n  font-weight: $dt-font-weight;\n}\n\n// 1. Undo browser default\n\ndd {\n  margin-bottom: .5rem;\n  margin-left: 0; // 1\n}\n\n\n// Blockquote\n\nblockquote {\n  margin: 0 0 1rem;\n}\n\n\n// Strong\n//\n// Add the correct font weight in Chrome, Edge, and Safari\n\nb,\nstrong {\n  font-weight: $font-weight-bolder;\n}\n\n\n// Small\n//\n// Add the correct font size in all browsers\n\nsmall {\n  @include font-size($small-font-size);\n}\n\n\n// Mark\n\nmark {\n  padding: $mark-padding;\n  background-color: var(--#{$prefix}highlight-bg);\n}\n\n\n// Sub and Sup\n//\n// Prevent `sub` and `sup` elements from affecting the line height in\n// all browsers.\n\nsub,\nsup {\n  position: relative;\n  @include font-size($sub-sup-font-size);\n  line-height: 0;\n  vertical-align: baseline;\n}\n\nsub { bottom: -.25em; }\nsup { top: -.5em; }\n\n\n// Links\n\na {\n  color: var(--#{$prefix}link-color);\n  text-decoration: $link-decoration;\n\n  &:hover {\n    color: var(--#{$prefix}link-hover-color);\n    text-decoration: $link-hover-decoration;\n  }\n}\n\n// And undo these styles for placeholder links/named anchors (without href).\n// It would be more straightforward to just use a[href] in previous block, but that\n// causes specificity issues in many other styles that are too complex to fix.\n// See https://github.com/twbs/bootstrap/issues/19402\n\na:not([href]):not([class]) {\n  &,\n  &:hover {\n    color: inherit;\n    text-decoration: none;\n  }\n}\n\n\n// Code\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: $font-family-code;\n  @include font-size(1em); // Correct the odd `em` font sizing in all browsers.\n}\n\n// 1. Remove browser default top margin\n// 2. Reset browser default of `1em` to use `rem`s\n// 3. Don't allow content to break outside\n\npre {\n  display: block;\n  margin-top: 0; // 1\n  margin-bottom: 1rem; // 2\n  overflow: auto; // 3\n  @include font-size($code-font-size);\n  color: $pre-color;\n\n  // Account for some code outputs that place code tags in pre tags\n  code {\n    @include font-size(inherit);\n    color: inherit;\n    word-break: normal;\n  }\n}\n\ncode {\n  @include font-size($code-font-size);\n  color: var(--#{$prefix}code-color);\n  word-wrap: break-word;\n\n  // Streamline the style when inside anchors to avoid broken underline and more\n  a > & {\n    color: inherit;\n  }\n}\n\nkbd {\n  padding: $kbd-padding-y $kbd-padding-x;\n  @include font-size($kbd-font-size);\n  color: $kbd-color;\n  background-color: $kbd-bg;\n  @include border-radius($border-radius-sm);\n\n  kbd {\n    padding: 0;\n    @include font-size(1em);\n    font-weight: $nested-kbd-font-weight;\n  }\n}\n\n\n// Figures\n//\n// Apply a consistent margin strategy (matches our type styles).\n\nfigure {\n  margin: 0 0 1rem;\n}\n\n\n// Images and content\n\nimg,\nsvg {\n  vertical-align: middle;\n}\n\n\n// Tables\n//\n// Prevent double borders\n\ntable {\n  caption-side: bottom;\n  border-collapse: collapse;\n}\n\ncaption {\n  padding-top: $table-cell-padding-y;\n  padding-bottom: $table-cell-padding-y;\n  color: $table-caption-color;\n  text-align: left;\n}\n\n// 1. Removes font-weight bold by inheriting\n// 2. Matches default `<td>` alignment by inheriting `text-align`.\n// 3. Fix alignment for Safari\n\nth {\n  font-weight: $table-th-font-weight; // 1\n  text-align: inherit; // 2\n  text-align: -webkit-match-parent; // 3\n}\n\nthead,\ntbody,\ntfoot,\ntr,\ntd,\nth {\n  border-color: inherit;\n  border-style: solid;\n  border-width: 0;\n}\n\n\n// Forms\n//\n// 1. Allow labels to use `margin` for spacing.\n\nlabel {\n  display: inline-block; // 1\n}\n\n// Remove the default `border-radius` that macOS Chrome adds.\n// See https://github.com/twbs/bootstrap/issues/24093\n\nbutton {\n  // stylelint-disable-next-line property-disallowed-list\n  border-radius: 0;\n}\n\n// Explicitly remove focus outline in Chromium when it shouldn't be\n// visible (e.g. as result of mouse click or touch tap). It already\n// should be doing this automatically, but seems to currently be\n// confused and applies its very visible two-tone outline anyway.\n\nbutton:focus:not(:focus-visible) {\n  outline: 0;\n}\n\n// 1. Remove the margin in Firefox and Safari\n\ninput,\nbutton,\nselect,\noptgroup,\ntextarea {\n  margin: 0; // 1\n  font-family: inherit;\n  @include font-size(inherit);\n  line-height: inherit;\n}\n\n// Remove the inheritance of text transform in Firefox\nbutton,\nselect {\n  text-transform: none;\n}\n// Set the cursor for non-`<button>` buttons\n//\n// Details at https://github.com/twbs/bootstrap/pull/30562\n[role=\"button\"] {\n  cursor: pointer;\n}\n\nselect {\n  // Remove the inheritance of word-wrap in Safari.\n  // See https://github.com/twbs/bootstrap/issues/24990\n  word-wrap: normal;\n\n  // Undo the opacity change from Chrome\n  &:disabled {\n    opacity: 1;\n  }\n}\n\n// Remove the dropdown arrow only from text type inputs built with datalists in Chrome.\n// See https://stackoverflow.com/a/54997118\n\n[list]:not([type=\"date\"]):not([type=\"datetime-local\"]):not([type=\"month\"]):not([type=\"week\"]):not([type=\"time\"])::-webkit-calendar-picker-indicator {\n  display: none !important;\n}\n\n// 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n//    controls in Android 4.\n// 2. Correct the inability to style clickable types in iOS and Safari.\n// 3. Opinionated: add \"hand\" cursor to non-disabled button elements.\n\nbutton,\n[type=\"button\"], // 1\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; // 2\n\n  @if $enable-button-pointers {\n    &:not(:disabled) {\n      cursor: pointer; // 3\n    }\n  }\n}\n\n// Remove inner border and padding from Firefox, but don't restore the outline like Normalize.\n\n::-moz-focus-inner {\n  padding: 0;\n  border-style: none;\n}\n\n// 1. Textareas should really only resize vertically so they don't break their (horizontal) containers.\n\ntextarea {\n  resize: vertical; // 1\n}\n\n// 1. Browsers set a default `min-width: min-content;` on fieldsets,\n//    unlike e.g. `<div>`s, which have `min-width: 0;` by default.\n//    So we reset that to ensure fieldsets behave more like a standard block element.\n//    See https://github.com/twbs/bootstrap/issues/12359\n//    and https://html.spec.whatwg.org/multipage/#the-fieldset-and-legend-elements\n// 2. Reset the default outline behavior of fieldsets so they don't affect page layout.\n\nfieldset {\n  min-width: 0; // 1\n  padding: 0; // 2\n  margin: 0; // 2\n  border: 0; // 2\n}\n\n// 1. By using `float: left`, the legend will behave like a block element.\n//    This way the border of a fieldset wraps around the legend if present.\n// 2. Fix wrapping bug.\n//    See https://github.com/twbs/bootstrap/issues/29712\n\nlegend {\n  float: left; // 1\n  width: 100%;\n  padding: 0;\n  margin-bottom: $legend-margin-bottom;\n  @include font-size($legend-font-size);\n  font-weight: $legend-font-weight;\n  line-height: inherit;\n\n  + * {\n    clear: left; // 2\n  }\n}\n\n// Fix height of inputs with a type of datetime-local, date, month, week, or time\n// See https://github.com/twbs/bootstrap/issues/18842\n\n::-webkit-datetime-edit-fields-wrapper,\n::-webkit-datetime-edit-text,\n::-webkit-datetime-edit-minute,\n::-webkit-datetime-edit-hour-field,\n::-webkit-datetime-edit-day-field,\n::-webkit-datetime-edit-month-field,\n::-webkit-datetime-edit-year-field {\n  padding: 0;\n}\n\n::-webkit-inner-spin-button {\n  height: auto;\n}\n\n// 1. Correct the outline style in Safari.\n// 2. This overrides the extra rounded corners on search inputs in iOS so that our\n//    `.form-control` class can properly style them. Note that this cannot simply\n//    be added to `.form-control` as it's not specific enough. For details, see\n//    https://github.com/twbs/bootstrap/issues/11586.\n\n[type=\"search\"] {\n  outline-offset: -2px; // 1\n  -webkit-appearance: textfield; // 2\n}\n\n// 1. A few input types should stay LTR\n// See https://rtlstyling.com/posts/rtl-styling#form-inputs\n// 2. RTL only output\n// See https://rtlcss.com/learn/usage-guide/control-directives/#raw\n\n/* rtl:raw:\n[type=\"tel\"],\n[type=\"url\"],\n[type=\"email\"],\n[type=\"number\"] {\n  direction: ltr;\n}\n*/\n\n// Remove the inner padding in Chrome and Safari on macOS.\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n// Remove padding around color pickers in webkit browsers\n\n::-webkit-color-swatch-wrapper {\n  padding: 0;\n}\n\n\n// 1. Inherit font family and line height for file input buttons\n// 2. Correct the inability to style clickable types in iOS and Safari.\n\n::file-selector-button {\n  font: inherit; // 1\n  -webkit-appearance: button; // 2\n}\n\n// Correct element displays\n\noutput {\n  display: inline-block;\n}\n\n// Remove border from iframe\n\niframe {\n  border: 0;\n}\n\n// Summary\n//\n// 1. Add the correct display in all browsers\n\nsummary {\n  display: list-item; // 1\n  cursor: pointer;\n}\n\n\n// Progress\n//\n// Add the correct vertical alignment in Chrome, Firefox, and Opera.\n\nprogress {\n  vertical-align: baseline;\n}\n\n\n// Hidden attribute\n//\n// Always hide an element with the `hidden` HTML attribute.\n\n[hidden] {\n  display: none !important;\n}\n","// Variables\n//\n// Variables should follow the `$component-state-property-size` formula for\n// consistent naming. Ex: $nav-link-disabled-color and $modal-content-box-shadow-xs.\n\n// Color system\n\n// scss-docs-start gray-color-variables\n$white:    #fff !default;\n$gray-100: #f8f9fa !default;\n$gray-200: #e9ecef !default;\n$gray-300: #dee2e6 !default;\n$gray-400: #ced4da !default;\n$gray-500: #adb5bd !default;\n$gray-600: #6c757d !default;\n$gray-700: #495057 !default;\n$gray-800: #343a40 !default;\n$gray-900: #212529 !default;\n$black:    #000 !default;\n// scss-docs-end gray-color-variables\n\n// fusv-disable\n// scss-docs-start gray-colors-map\n$grays: (\n  \"100\": $gray-100,\n  \"200\": $gray-200,\n  \"300\": $gray-300,\n  \"400\": $gray-400,\n  \"500\": $gray-500,\n  \"600\": $gray-600,\n  \"700\": $gray-700,\n  \"800\": $gray-800,\n  \"900\": $gray-900\n) !default;\n// scss-docs-end gray-colors-map\n// fusv-enable\n\n// scss-docs-start color-variables\n$blue:    #0d6efd !default;\n$indigo:  #6610f2 !default;\n$purple:  #6f42c1 !default;\n$pink:    #d63384 !default;\n$red:     #dc3545 !default;\n$orange:  #fd7e14 !default;\n$yellow:  #ffc107 !default;\n$green:   #198754 !default;\n$teal:    #20c997 !default;\n$cyan:    #0dcaf0 !default;\n// scss-docs-end color-variables\n\n// scss-docs-start colors-map\n$colors: (\n  \"blue\":       $blue,\n  \"indigo\":     $indigo,\n  \"purple\":     $purple,\n  \"pink\":       $pink,\n  \"red\":        $red,\n  \"orange\":     $orange,\n  \"yellow\":     $yellow,\n  \"green\":      $green,\n  \"teal\":       $teal,\n  \"cyan\":       $cyan,\n  \"black\":      $black,\n  \"white\":      $white,\n  \"gray\":       $gray-600,\n  \"gray-dark\":  $gray-800\n) !default;\n// scss-docs-end colors-map\n\n// The contrast ratio to reach against white, to determine if color changes from \"light\" to \"dark\". Acceptable values for WCAG 2.0 are 3, 4.5 and 7.\n// See https://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast\n$min-contrast-ratio:   4.5 !default;\n\n// Customize the light and dark text colors for use in our color contrast function.\n$color-contrast-dark:      $black !default;\n$color-contrast-light:     $white !default;\n\n// fusv-disable\n$blue-100: tint-color($blue, 80%) !default;\n$blue-200: tint-color($blue, 60%) !default;\n$blue-300: tint-color($blue, 40%) !default;\n$blue-400: tint-color($blue, 20%) !default;\n$blue-500: $blue !default;\n$blue-600: shade-color($blue, 20%) !default;\n$blue-700: shade-color($blue, 40%) !default;\n$blue-800: shade-color($blue, 60%) !default;\n$blue-900: shade-color($blue, 80%) !default;\n\n$indigo-100: tint-color($indigo, 80%) !default;\n$indigo-200: tint-color($indigo, 60%) !default;\n$indigo-300: tint-color($indigo, 40%) !default;\n$indigo-400: tint-color($indigo, 20%) !default;\n$indigo-500: $indigo !default;\n$indigo-600: shade-color($indigo, 20%) !default;\n$indigo-700: shade-color($indigo, 40%) !default;\n$indigo-800: shade-color($indigo, 60%) !default;\n$indigo-900: shade-color($indigo, 80%) !default;\n\n$purple-100: tint-color($purple, 80%) !default;\n$purple-200: tint-color($purple, 60%) !default;\n$purple-300: tint-color($purple, 40%) !default;\n$purple-400: tint-color($purple, 20%) !default;\n$purple-500: $purple !default;\n$purple-600: shade-color($purple, 20%) !default;\n$purple-700: shade-color($purple, 40%) !default;\n$purple-800: shade-color($purple, 60%) !default;\n$purple-900: shade-color($purple, 80%) !default;\n\n$pink-100: tint-color($pink, 80%) !default;\n$pink-200: tint-color($pink, 60%) !default;\n$pink-300: tint-color($pink, 40%) !default;\n$pink-400: tint-color($pink, 20%) !default;\n$pink-500: $pink !default;\n$pink-600: shade-color($pink, 20%) !default;\n$pink-700: shade-color($pink, 40%) !default;\n$pink-800: shade-color($pink, 60%) !default;\n$pink-900: shade-color($pink, 80%) !default;\n\n$red-100: tint-color($red, 80%) !default;\n$red-200: tint-color($red, 60%) !default;\n$red-300: tint-color($red, 40%) !default;\n$red-400: tint-color($red, 20%) !default;\n$red-500: $red !default;\n$red-600: shade-color($red, 20%) !default;\n$red-700: shade-color($red, 40%) !default;\n$red-800: shade-color($red, 60%) !default;\n$red-900: shade-color($red, 80%) !default;\n\n$orange-100: tint-color($orange, 80%) !default;\n$orange-200: tint-color($orange, 60%) !default;\n$orange-300: tint-color($orange, 40%) !default;\n$orange-400: tint-color($orange, 20%) !default;\n$orange-500: $orange !default;\n$orange-600: shade-color($orange, 20%) !default;\n$orange-700: shade-color($orange, 40%) !default;\n$orange-800: shade-color($orange, 60%) !default;\n$orange-900: shade-color($orange, 80%) !default;\n\n$yellow-100: tint-color($yellow, 80%) !default;\n$yellow-200: tint-color($yellow, 60%) !default;\n$yellow-300: tint-color($yellow, 40%) !default;\n$yellow-400: tint-color($yellow, 20%) !default;\n$yellow-500: $yellow !default;\n$yellow-600: shade-color($yellow, 20%) !default;\n$yellow-700: shade-color($yellow, 40%) !default;\n$yellow-800: shade-color($yellow, 60%) !default;\n$yellow-900: shade-color($yellow, 80%) !default;\n\n$green-100: tint-color($green, 80%) !default;\n$green-200: tint-color($green, 60%) !default;\n$green-300: tint-color($green, 40%) !default;\n$green-400: tint-color($green, 20%) !default;\n$green-500: $green !default;\n$green-600: shade-color($green, 20%) !default;\n$green-700: shade-color($green, 40%) !default;\n$green-800: shade-color($green, 60%) !default;\n$green-900: shade-color($green, 80%) !default;\n\n$teal-100: tint-color($teal, 80%) !default;\n$teal-200: tint-color($teal, 60%) !default;\n$teal-300: tint-color($teal, 40%) !default;\n$teal-400: tint-color($teal, 20%) !default;\n$teal-500: $teal !default;\n$teal-600: shade-color($teal, 20%) !default;\n$teal-700: shade-color($teal, 40%) !default;\n$teal-800: shade-color($teal, 60%) !default;\n$teal-900: shade-color($teal, 80%) !default;\n\n$cyan-100: tint-color($cyan, 80%) !default;\n$cyan-200: tint-color($cyan, 60%) !default;\n$cyan-300: tint-color($cyan, 40%) !default;\n$cyan-400: tint-color($cyan, 20%) !default;\n$cyan-500: $cyan !default;\n$cyan-600: shade-color($cyan, 20%) !default;\n$cyan-700: shade-color($cyan, 40%) !default;\n$cyan-800: shade-color($cyan, 60%) !default;\n$cyan-900: shade-color($cyan, 80%) !default;\n\n$blues: (\n  \"blue-100\": $blue-100,\n  \"blue-200\": $blue-200,\n  \"blue-300\": $blue-300,\n  \"blue-400\": $blue-400,\n  \"blue-500\": $blue-500,\n  \"blue-600\": $blue-600,\n  \"blue-700\": $blue-700,\n  \"blue-800\": $blue-800,\n  \"blue-900\": $blue-900\n) !default;\n\n$indigos: (\n  \"indigo-100\": $indigo-100,\n  \"indigo-200\": $indigo-200,\n  \"indigo-300\": $indigo-300,\n  \"indigo-400\": $indigo-400,\n  \"indigo-500\": $indigo-500,\n  \"indigo-600\": $indigo-600,\n  \"indigo-700\": $indigo-700,\n  \"indigo-800\": $indigo-800,\n  \"indigo-900\": $indigo-900\n) !default;\n\n$purples: (\n  \"purple-100\": $purple-100,\n  \"purple-200\": $purple-200,\n  \"purple-300\": $purple-300,\n  \"purple-400\": $purple-400,\n  \"purple-500\": $purple-500,\n  \"purple-600\": $purple-600,\n  \"purple-700\": $purple-700,\n  \"purple-800\": $purple-800,\n  \"purple-900\": $purple-900\n) !default;\n\n$pinks: (\n  \"pink-100\": $pink-100,\n  \"pink-200\": $pink-200,\n  \"pink-300\": $pink-300,\n  \"pink-400\": $pink-400,\n  \"pink-500\": $pink-500,\n  \"pink-600\": $pink-600,\n  \"pink-700\": $pink-700,\n  \"pink-800\": $pink-800,\n  \"pink-900\": $pink-900\n) !default;\n\n$reds: (\n  \"red-100\": $red-100,\n  \"red-200\": $red-200,\n  \"red-300\": $red-300,\n  \"red-400\": $red-400,\n  \"red-500\": $red-500,\n  \"red-600\": $red-600,\n  \"red-700\": $red-700,\n  \"red-800\": $red-800,\n  \"red-900\": $red-900\n) !default;\n\n$oranges: (\n  \"orange-100\": $orange-100,\n  \"orange-200\": $orange-200,\n  \"orange-300\": $orange-300,\n  \"orange-400\": $orange-400,\n  \"orange-500\": $orange-500,\n  \"orange-600\": $orange-600,\n  \"orange-700\": $orange-700,\n  \"orange-800\": $orange-800,\n  \"orange-900\": $orange-900\n) !default;\n\n$yellows: (\n  \"yellow-100\": $yellow-100,\n  \"yellow-200\": $yellow-200,\n  \"yellow-300\": $yellow-300,\n  \"yellow-400\": $yellow-400,\n  \"yellow-500\": $yellow-500,\n  \"yellow-600\": $yellow-600,\n  \"yellow-700\": $yellow-700,\n  \"yellow-800\": $yellow-800,\n  \"yellow-900\": $yellow-900\n) !default;\n\n$greens: (\n  \"green-100\": $green-100,\n  \"green-200\": $green-200,\n  \"green-300\": $green-300,\n  \"green-400\": $green-400,\n  \"green-500\": $green-500,\n  \"green-600\": $green-600,\n  \"green-700\": $green-700,\n  \"green-800\": $green-800,\n  \"green-900\": $green-900\n) !default;\n\n$teals: (\n  \"teal-100\": $teal-100,\n  \"teal-200\": $teal-200,\n  \"teal-300\": $teal-300,\n  \"teal-400\": $teal-400,\n  \"teal-500\": $teal-500,\n  \"teal-600\": $teal-600,\n  \"teal-700\": $teal-700,\n  \"teal-800\": $teal-800,\n  \"teal-900\": $teal-900\n) !default;\n\n$cyans: (\n  \"cyan-100\": $cyan-100,\n  \"cyan-200\": $cyan-200,\n  \"cyan-300\": $cyan-300,\n  \"cyan-400\": $cyan-400,\n  \"cyan-500\": $cyan-500,\n  \"cyan-600\": $cyan-600,\n  \"cyan-700\": $cyan-700,\n  \"cyan-800\": $cyan-800,\n  \"cyan-900\": $cyan-900\n) !default;\n// fusv-enable\n\n// scss-docs-start theme-color-variables\n$primary:       $blue !default;\n$secondary:     $gray-600 !default;\n$success:       $green !default;\n$info:          $cyan !default;\n$warning:       $yellow !default;\n$danger:        $red !default;\n$light:         $gray-100 !default;\n$dark:          $gray-900 !default;\n// scss-docs-end theme-color-variables\n\n// scss-docs-start theme-colors-map\n$theme-colors: (\n  \"primary\":    $primary,\n  \"secondary\":  $secondary,\n  \"success\":    $success,\n  \"info\":       $info,\n  \"warning\":    $warning,\n  \"danger\":     $danger,\n  \"light\":      $light,\n  \"dark\":       $dark\n) !default;\n// scss-docs-end theme-colors-map\n\n// Characters which are escaped by the escape-svg function\n$escaped-characters: (\n  (\"<\", \"%3c\"),\n  (\">\", \"%3e\"),\n  (\"#\", \"%23\"),\n  (\"(\", \"%28\"),\n  (\")\", \"%29\"),\n) !default;\n\n// Options\n//\n// Quickly modify global styling by enabling or disabling optional features.\n\n$enable-caret:                true !default;\n$enable-rounded:              true !default;\n$enable-shadows:              false !default;\n$enable-gradients:            false !default;\n$enable-transitions:          true !default;\n$enable-reduced-motion:       true !default;\n$enable-smooth-scroll:        true !default;\n$enable-grid-classes:         true !default;\n$enable-container-classes:    true !default;\n$enable-cssgrid:              false !default;\n$enable-button-pointers:      true !default;\n$enable-rfs:                  true !default;\n$enable-validation-icons:     true !default;\n$enable-negative-margins:     false !default;\n$enable-deprecation-messages: true !default;\n$enable-important-utilities:  true !default;\n\n// Prefix for :root CSS variables\n\n$variable-prefix:             bs- !default; // Deprecated in v5.2.0 for the shorter `$prefix`\n$prefix:                      $variable-prefix !default;\n\n// Gradient\n//\n// The gradient which is added to components if `$enable-gradients` is `true`\n// This gradient is also added to elements with `.bg-gradient`\n// scss-docs-start variable-gradient\n$gradient: linear-gradient(180deg, rgba($white, .15), rgba($white, 0)) !default;\n// scss-docs-end variable-gradient\n\n// Spacing\n//\n// Control the default styling of most Bootstrap elements by modifying these\n// variables. Mostly focused on spacing.\n// You can add more entries to the $spacers map, should you need more variation.\n\n// scss-docs-start spacer-variables-maps\n$spacer: 1rem !default;\n$spacers: (\n  0: 0,\n  1: $spacer * .25,\n  2: $spacer * .5,\n  3: $spacer,\n  4: $spacer * 1.5,\n  5: $spacer * 3,\n) !default;\n// scss-docs-end spacer-variables-maps\n\n// Position\n//\n// Define the edge positioning anchors of the position utilities.\n\n// scss-docs-start position-map\n$position-values: (\n  0: 0,\n  50: 50%,\n  100: 100%\n) !default;\n// scss-docs-end position-map\n\n// Body\n//\n// Settings for the `<body>` element.\n\n$body-bg:                   $white !default;\n$body-color:                $gray-900 !default;\n$body-text-align:           null !default;\n\n// Links\n//\n// Style anchor elements.\n\n$link-color:                              $primary !default;\n$link-decoration:                         underline !default;\n$link-shade-percentage:                   20% !default;\n$link-hover-color:                        shift-color($link-color, $link-shade-percentage) !default;\n$link-hover-decoration:                   null !default;\n\n$stretched-link-pseudo-element:           after !default;\n$stretched-link-z-index:                  1 !default;\n\n// Paragraphs\n//\n// Style p element.\n\n$paragraph-margin-bottom:   1rem !default;\n\n\n// Grid breakpoints\n//\n// Define the minimum dimensions at which your layout will change,\n// adapting to different screen sizes, for use in media queries.\n\n// scss-docs-start grid-breakpoints\n$grid-breakpoints: (\n  xs: 0,\n  sm: 576px,\n  md: 768px,\n  lg: 992px,\n  xl: 1200px,\n  xxl: 1400px\n) !default;\n// scss-docs-end grid-breakpoints\n\n@include _assert-ascending($grid-breakpoints, \"$grid-breakpoints\");\n@include _assert-starts-at-zero($grid-breakpoints, \"$grid-breakpoints\");\n\n\n// Grid containers\n//\n// Define the maximum width of `.container` for different screen sizes.\n\n// scss-docs-start container-max-widths\n$container-max-widths: (\n  sm: 540px,\n  md: 720px,\n  lg: 960px,\n  xl: 1140px,\n  xxl: 1320px\n) !default;\n// scss-docs-end container-max-widths\n\n@include _assert-ascending($container-max-widths, \"$container-max-widths\");\n\n\n// Grid columns\n//\n// Set the number of columns and specify the width of the gutters.\n\n$grid-columns:                12 !default;\n$grid-gutter-width:           1.5rem !default;\n$grid-row-columns:            6 !default;\n\n// Container padding\n\n$container-padding-x: $grid-gutter-width !default;\n\n\n// Components\n//\n// Define common padding and border radius sizes and more.\n\n// scss-docs-start border-variables\n$border-width:                1px !default;\n$border-widths: (\n  1: 1px,\n  2: 2px,\n  3: 3px,\n  4: 4px,\n  5: 5px\n) !default;\n\n$border-style:                solid !default;\n$border-color:                $gray-300 !default;\n$border-color-translucent:    rgba($black, .175) !default;\n// scss-docs-end border-variables\n\n// scss-docs-start border-radius-variables\n$border-radius:               .375rem !default;\n$border-radius-sm:            .25rem !default;\n$border-radius-lg:            .5rem !default;\n$border-radius-xl:            1rem !default;\n$border-radius-2xl:           2rem !default;\n$border-radius-pill:          50rem !default;\n// scss-docs-end border-radius-variables\n\n// scss-docs-start box-shadow-variables\n$box-shadow:                  0 .5rem 1rem rgba($black, .15) !default;\n$box-shadow-sm:               0 .125rem .25rem rgba($black, .075) !default;\n$box-shadow-lg:               0 1rem 3rem rgba($black, .175) !default;\n$box-shadow-inset:            inset 0 1px 2px rgba($black, .075) !default;\n// scss-docs-end box-shadow-variables\n\n$component-active-color:      $white !default;\n$component-active-bg:         $primary !default;\n\n// scss-docs-start caret-variables\n$caret-width:                 .3em !default;\n$caret-vertical-align:        $caret-width * .85 !default;\n$caret-spacing:               $caret-width * .85 !default;\n// scss-docs-end caret-variables\n\n$transition-base:             all .2s ease-in-out !default;\n$transition-fade:             opacity .15s linear !default;\n// scss-docs-start collapse-transition\n$transition-collapse:         height .35s ease !default;\n$transition-collapse-width:   width .35s ease !default;\n// scss-docs-end collapse-transition\n\n// stylelint-disable function-disallowed-list\n// scss-docs-start aspect-ratios\n$aspect-ratios: (\n  \"1x1\": 100%,\n  \"4x3\": calc(3 / 4 * 100%),\n  \"16x9\": calc(9 / 16 * 100%),\n  \"21x9\": calc(9 / 21 * 100%)\n) !default;\n// scss-docs-end aspect-ratios\n// stylelint-enable function-disallowed-list\n\n// Typography\n//\n// Font, line-height, and color for body text, headings, and more.\n\n// scss-docs-start font-variables\n// stylelint-disable value-keyword-case\n$font-family-sans-serif:      system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", \"Liberation Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\" !default;\n$font-family-monospace:       SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace !default;\n// stylelint-enable value-keyword-case\n$font-family-base:            var(--#{$prefix}font-sans-serif) !default;\n$font-family-code:            var(--#{$prefix}font-monospace) !default;\n\n// $font-size-root affects the value of `rem`, which is used for as well font sizes, paddings, and margins\n// $font-size-base affects the font size of the body text\n$font-size-root:              null !default;\n$font-size-base:              1rem !default; // Assumes the browser default, typically `16px`\n$font-size-sm:                $font-size-base * .875 !default;\n$font-size-lg:                $font-size-base * 1.25 !default;\n\n$font-weight-lighter:         lighter !default;\n$font-weight-light:           300 !default;\n$font-weight-normal:          400 !default;\n$font-weight-semibold:        600 !default;\n$font-weight-bold:            700 !default;\n$font-weight-bolder:          bolder !default;\n\n$font-weight-base:            $font-weight-normal !default;\n\n$line-height-base:            1.5 !default;\n$line-height-sm:              1.25 !default;\n$line-height-lg:              2 !default;\n\n$h1-font-size:                $font-size-base * 2.5 !default;\n$h2-font-size:                $font-size-base * 2 !default;\n$h3-font-size:                $font-size-base * 1.75 !default;\n$h4-font-size:                $font-size-base * 1.5 !default;\n$h5-font-size:                $font-size-base * 1.25 !default;\n$h6-font-size:                $font-size-base !default;\n// scss-docs-end font-variables\n\n// scss-docs-start font-sizes\n$font-sizes: (\n  1: $h1-font-size,\n  2: $h2-font-size,\n  3: $h3-font-size,\n  4: $h4-font-size,\n  5: $h5-font-size,\n  6: $h6-font-size\n) !default;\n// scss-docs-end font-sizes\n\n// scss-docs-start headings-variables\n$headings-margin-bottom:      $spacer * .5 !default;\n$headings-font-family:        null !default;\n$headings-font-style:         null !default;\n$headings-font-weight:        500 !default;\n$headings-line-height:        1.2 !default;\n$headings-color:              null !default;\n// scss-docs-end headings-variables\n\n// scss-docs-start display-headings\n$display-font-sizes: (\n  1: 5rem,\n  2: 4.5rem,\n  3: 4rem,\n  4: 3.5rem,\n  5: 3rem,\n  6: 2.5rem\n) !default;\n\n$display-font-family: null !default;\n$display-font-style:  null !default;\n$display-font-weight: 300 !default;\n$display-line-height: $headings-line-height !default;\n// scss-docs-end display-headings\n\n// scss-docs-start type-variables\n$lead-font-size:              $font-size-base * 1.25 !default;\n$lead-font-weight:            300 !default;\n\n$small-font-size:             .875em !default;\n\n$sub-sup-font-size:           .75em !default;\n\n$text-muted:                  $gray-600 !default;\n\n$initialism-font-size:        $small-font-size !default;\n\n$blockquote-margin-y:         $spacer !default;\n$blockquote-font-size:        $font-size-base * 1.25 !default;\n$blockquote-footer-color:     $gray-600 !default;\n$blockquote-footer-font-size: $small-font-size !default;\n\n$hr-margin-y:                 $spacer !default;\n$hr-color:                    inherit !default;\n\n// fusv-disable\n$hr-bg-color:                 null !default; // Deprecated in v5.2.0\n$hr-height:                   null !default; // Deprecated in v5.2.0\n// fusv-enable\n\n$hr-border-color:             null !default; // Allows for inherited colors\n$hr-border-width:             $border-width !default;\n$hr-opacity:                  .25 !default;\n\n$legend-margin-bottom:        .5rem !default;\n$legend-font-size:            1.5rem !default;\n$legend-font-weight:          null !default;\n\n$dt-font-weight:              $font-weight-bold !default;\n\n$list-inline-padding:         .5rem !default;\n\n$mark-padding:                .1875em !default;\n$mark-bg:                     $yellow-100 !default;\n// scss-docs-end type-variables\n\n\n// Tables\n//\n// Customizes the `.table` component with basic values, each used across all table variations.\n\n// scss-docs-start table-variables\n$table-cell-padding-y:        .5rem !default;\n$table-cell-padding-x:        .5rem !default;\n$table-cell-padding-y-sm:     .25rem !default;\n$table-cell-padding-x-sm:     .25rem !default;\n\n$table-cell-vertical-align:   top !default;\n\n$table-color:                 var(--#{$prefix}body-color) !default;\n$table-bg:                    transparent !default;\n$table-accent-bg:             transparent !default;\n\n$table-th-font-weight:        null !default;\n\n$table-striped-color:         $table-color !default;\n$table-striped-bg-factor:     .05 !default;\n$table-striped-bg:            rgba($black, $table-striped-bg-factor) !default;\n\n$table-active-color:          $table-color !default;\n$table-active-bg-factor:      .1 !default;\n$table-active-bg:             rgba($black, $table-active-bg-factor) !default;\n\n$table-hover-color:           $table-color !default;\n$table-hover-bg-factor:       .075 !default;\n$table-hover-bg:              rgba($black, $table-hover-bg-factor) !default;\n\n$table-border-factor:         .1 !default;\n$table-border-width:          $border-width !default;\n$table-border-color:          var(--#{$prefix}border-color) !default;\n\n$table-striped-order:         odd !default;\n$table-striped-columns-order: even !default;\n\n$table-group-separator-color: currentcolor !default;\n\n$table-caption-color:         $text-muted !default;\n\n$table-bg-scale:              -80% !default;\n// scss-docs-end table-variables\n\n// scss-docs-start table-loop\n$table-variants: (\n  \"primary\":    shift-color($primary, $table-bg-scale),\n  \"secondary\":  shift-color($secondary, $table-bg-scale),\n  \"success\":    shift-color($success, $table-bg-scale),\n  \"info\":       shift-color($info, $table-bg-scale),\n  \"warning\":    shift-color($warning, $table-bg-scale),\n  \"danger\":     shift-color($danger, $table-bg-scale),\n  \"light\":      $light,\n  \"dark\":       $dark,\n) !default;\n// scss-docs-end table-loop\n\n\n// Buttons + Forms\n//\n// Shared variables that are reassigned to `$input-` and `$btn-` specific variables.\n\n// scss-docs-start input-btn-variables\n$input-btn-padding-y:         .375rem !default;\n$input-btn-padding-x:         .75rem !default;\n$input-btn-font-family:       null !default;\n$input-btn-font-size:         $font-size-base !default;\n$input-btn-line-height:       $line-height-base !default;\n\n$input-btn-focus-width:         .25rem !default;\n$input-btn-focus-color-opacity: .25 !default;\n$input-btn-focus-color:         rgba($component-active-bg, $input-btn-focus-color-opacity) !default;\n$input-btn-focus-blur:          0 !default;\n$input-btn-focus-box-shadow:    0 0 $input-btn-focus-blur $input-btn-focus-width $input-btn-focus-color !default;\n\n$input-btn-padding-y-sm:      .25rem !default;\n$input-btn-padding-x-sm:      .5rem !default;\n$input-btn-font-size-sm:      $font-size-sm !default;\n\n$input-btn-padding-y-lg:      .5rem !default;\n$input-btn-padding-x-lg:      1rem !default;\n$input-btn-font-size-lg:      $font-size-lg !default;\n\n$input-btn-border-width:      $border-width !default;\n// scss-docs-end input-btn-variables\n\n\n// Buttons\n//\n// For each of Bootstrap's buttons, define text, background, and border color.\n\n// scss-docs-start btn-variables\n$btn-padding-y:               $input-btn-padding-y !default;\n$btn-padding-x:               $input-btn-padding-x !default;\n$btn-font-family:             $input-btn-font-family !default;\n$btn-font-size:               $input-btn-font-size !default;\n$btn-line-height:             $input-btn-line-height !default;\n$btn-white-space:             null !default; // Set to `nowrap` to prevent text wrapping\n\n$btn-padding-y-sm:            $input-btn-padding-y-sm !default;\n$btn-padding-x-sm:            $input-btn-padding-x-sm !default;\n$btn-font-size-sm:            $input-btn-font-size-sm !default;\n\n$btn-padding-y-lg:            $input-btn-padding-y-lg !default;\n$btn-padding-x-lg:            $input-btn-padding-x-lg !default;\n$btn-font-size-lg:            $input-btn-font-size-lg !default;\n\n$btn-border-width:            $input-btn-border-width !default;\n\n$btn-font-weight:             $font-weight-normal !default;\n$btn-box-shadow:              inset 0 1px 0 rgba($white, .15), 0 1px 1px rgba($black, .075) !default;\n$btn-focus-width:             $input-btn-focus-width !default;\n$btn-focus-box-shadow:        $input-btn-focus-box-shadow !default;\n$btn-disabled-opacity:        .65 !default;\n$btn-active-box-shadow:       inset 0 3px 5px rgba($black, .125) !default;\n\n$btn-link-color:              var(--#{$prefix}link-color) !default;\n$btn-link-hover-color:        var(--#{$prefix}link-hover-color) !default;\n$btn-link-disabled-color:     $gray-600 !default;\n\n// Allows for customizing button radius independently from global border radius\n$btn-border-radius:           $border-radius !default;\n$btn-border-radius-sm:        $border-radius-sm !default;\n$btn-border-radius-lg:        $border-radius-lg !default;\n\n$btn-transition:              color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out !default;\n\n$btn-hover-bg-shade-amount:       15% !default;\n$btn-hover-bg-tint-amount:        15% !default;\n$btn-hover-border-shade-amount:   20% !default;\n$btn-hover-border-tint-amount:    10% !default;\n$btn-active-bg-shade-amount:      20% !default;\n$btn-active-bg-tint-amount:       20% !default;\n$btn-active-border-shade-amount:  25% !default;\n$btn-active-border-tint-amount:   10% !default;\n// scss-docs-end btn-variables\n\n\n// Forms\n\n// scss-docs-start form-text-variables\n$form-text-margin-top:                  .25rem !default;\n$form-text-font-size:                   $small-font-size !default;\n$form-text-font-style:                  null !default;\n$form-text-font-weight:                 null !default;\n$form-text-color:                       $text-muted !default;\n// scss-docs-end form-text-variables\n\n// scss-docs-start form-label-variables\n$form-label-margin-bottom:              .5rem !default;\n$form-label-font-size:                  null !default;\n$form-label-font-style:                 null !default;\n$form-label-font-weight:                null !default;\n$form-label-color:                      null !default;\n// scss-docs-end form-label-variables\n\n// scss-docs-start form-input-variables\n$input-padding-y:                       $input-btn-padding-y !default;\n$input-padding-x:                       $input-btn-padding-x !default;\n$input-font-family:                     $input-btn-font-family !default;\n$input-font-size:                       $input-btn-font-size !default;\n$input-font-weight:                     $font-weight-base !default;\n$input-line-height:                     $input-btn-line-height !default;\n\n$input-padding-y-sm:                    $input-btn-padding-y-sm !default;\n$input-padding-x-sm:                    $input-btn-padding-x-sm !default;\n$input-font-size-sm:                    $input-btn-font-size-sm !default;\n\n$input-padding-y-lg:                    $input-btn-padding-y-lg !default;\n$input-padding-x-lg:                    $input-btn-padding-x-lg !default;\n$input-font-size-lg:                    $input-btn-font-size-lg !default;\n\n$input-bg:                              $body-bg !default;\n$input-disabled-color:                  null !default;\n$input-disabled-bg:                     $gray-200 !default;\n$input-disabled-border-color:           null !default;\n\n$input-color:                           $body-color !default;\n$input-border-color:                    $gray-400 !default;\n$input-border-width:                    $input-btn-border-width !default;\n$input-box-shadow:                      $box-shadow-inset !default;\n\n$input-border-radius:                   $border-radius !default;\n$input-border-radius-sm:                $border-radius-sm !default;\n$input-border-radius-lg:                $border-radius-lg !default;\n\n$input-focus-bg:                        $input-bg !default;\n$input-focus-border-color:              tint-color($component-active-bg, 50%) !default;\n$input-focus-color:                     $input-color !default;\n$input-focus-width:                     $input-btn-focus-width !default;\n$input-focus-box-shadow:                $input-btn-focus-box-shadow !default;\n\n$input-placeholder-color:               $gray-600 !default;\n$input-plaintext-color:                 $body-color !default;\n\n$input-height-border:                   $input-border-width * 2 !default;\n\n$input-height-inner:                    add($input-line-height * 1em, $input-padding-y * 2) !default;\n$input-height-inner-half:               add($input-line-height * .5em, $input-padding-y) !default;\n$input-height-inner-quarter:            add($input-line-height * .25em, $input-padding-y * .5) !default;\n\n$input-height:                          add($input-line-height * 1em, add($input-padding-y * 2, $input-height-border, false)) !default;\n$input-height-sm:                       add($input-line-height * 1em, add($input-padding-y-sm * 2, $input-height-border, false)) !default;\n$input-height-lg:                       add($input-line-height * 1em, add($input-padding-y-lg * 2, $input-height-border, false)) !default;\n\n$input-transition:                      border-color .15s ease-in-out, box-shadow .15s ease-in-out !default;\n\n$form-color-width:                      3rem !default;\n// scss-docs-end form-input-variables\n\n// scss-docs-start form-check-variables\n$form-check-input-width:                  1em !default;\n$form-check-min-height:                   $font-size-base * $line-height-base !default;\n$form-check-padding-start:                $form-check-input-width + .5em !default;\n$form-check-margin-bottom:                .125rem !default;\n$form-check-label-color:                  null !default;\n$form-check-label-cursor:                 null !default;\n$form-check-transition:                   null !default;\n\n$form-check-input-active-filter:          brightness(90%) !default;\n\n$form-check-input-bg:                     $input-bg !default;\n$form-check-input-border:                 1px solid rgba($black, .25) !default;\n$form-check-input-border-radius:          .25em !default;\n$form-check-radio-border-radius:          50% !default;\n$form-check-input-focus-border:           $input-focus-border-color !default;\n$form-check-input-focus-box-shadow:       $input-btn-focus-box-shadow !default;\n\n$form-check-input-checked-color:          $component-active-color !default;\n$form-check-input-checked-bg-color:       $component-active-bg !default;\n$form-check-input-checked-border-color:   $form-check-input-checked-bg-color !default;\n$form-check-input-checked-bg-image:       url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='none' stroke='#{$form-check-input-checked-color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/></svg>\") !default;\n$form-check-radio-checked-bg-image:       url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='2' fill='#{$form-check-input-checked-color}'/></svg>\") !default;\n\n$form-check-input-indeterminate-color:          $component-active-color !default;\n$form-check-input-indeterminate-bg-color:       $component-active-bg !default;\n$form-check-input-indeterminate-border-color:   $form-check-input-indeterminate-bg-color !default;\n$form-check-input-indeterminate-bg-image:       url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='none' stroke='#{$form-check-input-indeterminate-color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10h8'/></svg>\") !default;\n\n$form-check-input-disabled-opacity:        .5 !default;\n$form-check-label-disabled-opacity:        $form-check-input-disabled-opacity !default;\n$form-check-btn-check-disabled-opacity:    $btn-disabled-opacity !default;\n\n$form-check-inline-margin-end:    1rem !default;\n// scss-docs-end form-check-variables\n\n// scss-docs-start form-switch-variables\n$form-switch-color:               rgba($black, .25) !default;\n$form-switch-width:               2em !default;\n$form-switch-padding-start:       $form-switch-width + .5em !default;\n$form-switch-bg-image:            url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='3' fill='#{$form-switch-color}'/></svg>\") !default;\n$form-switch-border-radius:       $form-switch-width !default;\n$form-switch-transition:          background-position .15s ease-in-out !default;\n\n$form-switch-focus-color:         $input-focus-border-color !default;\n$form-switch-focus-bg-image:      url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='3' fill='#{$form-switch-focus-color}'/></svg>\") !default;\n\n$form-switch-checked-color:       $component-active-color !default;\n$form-switch-checked-bg-image:    url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='3' fill='#{$form-switch-checked-color}'/></svg>\") !default;\n$form-switch-checked-bg-position: right center !default;\n// scss-docs-end form-switch-variables\n\n// scss-docs-start input-group-variables\n$input-group-addon-padding-y:           $input-padding-y !default;\n$input-group-addon-padding-x:           $input-padding-x !default;\n$input-group-addon-font-weight:         $input-font-weight !default;\n$input-group-addon-color:               $input-color !default;\n$input-group-addon-bg:                  $gray-200 !default;\n$input-group-addon-border-color:        $input-border-color !default;\n// scss-docs-end input-group-variables\n\n// scss-docs-start form-select-variables\n$form-select-padding-y:             $input-padding-y !default;\n$form-select-padding-x:             $input-padding-x !default;\n$form-select-font-family:           $input-font-family !default;\n$form-select-font-size:             $input-font-size !default;\n$form-select-indicator-padding:     $form-select-padding-x * 3 !default; // Extra padding for background-image\n$form-select-font-weight:           $input-font-weight !default;\n$form-select-line-height:           $input-line-height !default;\n$form-select-color:                 $input-color !default;\n$form-select-bg:                    $input-bg !default;\n$form-select-disabled-color:        null !default;\n$form-select-disabled-bg:           $gray-200 !default;\n$form-select-disabled-border-color: $input-disabled-border-color !default;\n$form-select-bg-position:           right $form-select-padding-x center !default;\n$form-select-bg-size:               16px 12px !default; // In pixels because image dimensions\n$form-select-indicator-color:       $gray-800 !default;\n$form-select-indicator:             url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='none' stroke='#{$form-select-indicator-color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/></svg>\") !default;\n\n$form-select-feedback-icon-padding-end: $form-select-padding-x * 2.5 + $form-select-indicator-padding !default;\n$form-select-feedback-icon-position:    center right $form-select-indicator-padding !default;\n$form-select-feedback-icon-size:        $input-height-inner-half $input-height-inner-half !default;\n\n$form-select-border-width:        $input-border-width !default;\n$form-select-border-color:        $input-border-color !default;\n$form-select-border-radius:       $input-border-radius !default;\n$form-select-box-shadow:          $box-shadow-inset !default;\n\n$form-select-focus-border-color:  $input-focus-border-color !default;\n$form-select-focus-width:         $input-focus-width !default;\n$form-select-focus-box-shadow:    0 0 0 $form-select-focus-width $input-btn-focus-color !default;\n\n$form-select-padding-y-sm:        $input-padding-y-sm !default;\n$form-select-padding-x-sm:        $input-padding-x-sm !default;\n$form-select-font-size-sm:        $input-font-size-sm !default;\n$form-select-border-radius-sm:    $input-border-radius-sm !default;\n\n$form-select-padding-y-lg:        $input-padding-y-lg !default;\n$form-select-padding-x-lg:        $input-padding-x-lg !default;\n$form-select-font-size-lg:        $input-font-size-lg !default;\n$form-select-border-radius-lg:    $input-border-radius-lg !default;\n\n$form-select-transition:          $input-transition !default;\n// scss-docs-end form-select-variables\n\n// scss-docs-start form-range-variables\n$form-range-track-width:          100% !default;\n$form-range-track-height:         .5rem !default;\n$form-range-track-cursor:         pointer !default;\n$form-range-track-bg:             $gray-300 !default;\n$form-range-track-border-radius:  1rem !default;\n$form-range-track-box-shadow:     $box-shadow-inset !default;\n\n$form-range-thumb-width:                   1rem !default;\n$form-range-thumb-height:                  $form-range-thumb-width !default;\n$form-range-thumb-bg:                      $component-active-bg !default;\n$form-range-thumb-border:                  0 !default;\n$form-range-thumb-border-radius:           1rem !default;\n$form-range-thumb-box-shadow:              0 .1rem .25rem rgba($black, .1) !default;\n$form-range-thumb-focus-box-shadow:        0 0 0 1px $body-bg, $input-focus-box-shadow !default;\n$form-range-thumb-focus-box-shadow-width:  $input-focus-width !default; // For focus box shadow issue in Edge\n$form-range-thumb-active-bg:               tint-color($component-active-bg, 70%) !default;\n$form-range-thumb-disabled-bg:             $gray-500 !default;\n$form-range-thumb-transition:              background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out !default;\n// scss-docs-end form-range-variables\n\n// scss-docs-start form-file-variables\n$form-file-button-color:          $input-color !default;\n$form-file-button-bg:             $input-group-addon-bg !default;\n$form-file-button-hover-bg:       shade-color($form-file-button-bg, 5%) !default;\n// scss-docs-end form-file-variables\n\n// scss-docs-start form-floating-variables\n$form-floating-height:            add(3.5rem, $input-height-border) !default;\n$form-floating-line-height:       1.25 !default;\n$form-floating-padding-x:         $input-padding-x !default;\n$form-floating-padding-y:         1rem !default;\n$form-floating-input-padding-t:   1.625rem !default;\n$form-floating-input-padding-b:   .625rem !default;\n$form-floating-label-opacity:     .65 !default;\n$form-floating-label-transform:   scale(.85) translateY(-.5rem) translateX(.15rem) !default;\n$form-floating-transition:        opacity .1s ease-in-out, transform .1s ease-in-out !default;\n// scss-docs-end form-floating-variables\n\n// Form validation\n\n// scss-docs-start form-feedback-variables\n$form-feedback-margin-top:          $form-text-margin-top !default;\n$form-feedback-font-size:           $form-text-font-size !default;\n$form-feedback-font-style:          $form-text-font-style !default;\n$form-feedback-valid-color:         $success !default;\n$form-feedback-invalid-color:       $danger !default;\n\n$form-feedback-icon-valid-color:    $form-feedback-valid-color !default;\n$form-feedback-icon-valid:          url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path fill='#{$form-feedback-icon-valid-color}' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/></svg>\") !default;\n$form-feedback-icon-invalid-color:  $form-feedback-invalid-color !default;\n$form-feedback-icon-invalid:        url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='#{$form-feedback-icon-invalid-color}'><circle cx='6' cy='6' r='4.5'/><path stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/><circle cx='6' cy='8.2' r='.6' fill='#{$form-feedback-icon-invalid-color}' stroke='none'/></svg>\") !default;\n// scss-docs-end form-feedback-variables\n\n// scss-docs-start form-validation-states\n$form-validation-states: (\n  \"valid\": (\n    \"color\": $form-feedback-valid-color,\n    \"icon\": $form-feedback-icon-valid\n  ),\n  \"invalid\": (\n    \"color\": $form-feedback-invalid-color,\n    \"icon\": $form-feedback-icon-invalid\n  )\n) !default;\n// scss-docs-end form-validation-states\n\n// Z-index master list\n//\n// Warning: Avoid customizing these values. They're used for a bird's eye view\n// of components dependent on the z-axis and are designed to all work together.\n\n// scss-docs-start zindex-stack\n$zindex-dropdown:                   1000 !default;\n$zindex-sticky:                     1020 !default;\n$zindex-fixed:                      1030 !default;\n$zindex-offcanvas-backdrop:         1040 !default;\n$zindex-offcanvas:                  1045 !default;\n$zindex-modal-backdrop:             1050 !default;\n$zindex-modal:                      1055 !default;\n$zindex-popover:                    1070 !default;\n$zindex-tooltip:                    1080 !default;\n$zindex-toast:                      1090 !default;\n// scss-docs-end zindex-stack\n\n\n// Navs\n\n// scss-docs-start nav-variables\n$nav-link-padding-y:                .5rem !default;\n$nav-link-padding-x:                1rem !default;\n$nav-link-font-size:                null !default;\n$nav-link-font-weight:              null !default;\n$nav-link-color:                    var(--#{$prefix}link-color) !default;\n$nav-link-hover-color:              var(--#{$prefix}link-hover-color) !default;\n$nav-link-transition:               color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out !default;\n$nav-link-disabled-color:           $gray-600 !default;\n\n$nav-tabs-border-color:             $gray-300 !default;\n$nav-tabs-border-width:             $border-width !default;\n$nav-tabs-border-radius:            $border-radius !default;\n$nav-tabs-link-hover-border-color:  $gray-200 $gray-200 $nav-tabs-border-color !default;\n$nav-tabs-link-active-color:        $gray-700 !default;\n$nav-tabs-link-active-bg:           $body-bg !default;\n$nav-tabs-link-active-border-color: $gray-300 $gray-300 $nav-tabs-link-active-bg !default;\n\n$nav-pills-border-radius:           $border-radius !default;\n$nav-pills-link-active-color:       $component-active-color !default;\n$nav-pills-link-active-bg:          $component-active-bg !default;\n// scss-docs-end nav-variables\n\n\n// Navbar\n\n// scss-docs-start navbar-variables\n$navbar-padding-y:                  $spacer * .5 !default;\n$navbar-padding-x:                  null !default;\n\n$navbar-nav-link-padding-x:         .5rem !default;\n\n$navbar-brand-font-size:            $font-size-lg !default;\n// Compute the navbar-brand padding-y so the navbar-brand will have the same height as navbar-text and nav-link\n$nav-link-height:                   $font-size-base * $line-height-base + $nav-link-padding-y * 2 !default;\n$navbar-brand-height:               $navbar-brand-font-size * $line-height-base !default;\n$navbar-brand-padding-y:            ($nav-link-height - $navbar-brand-height) * .5 !default;\n$navbar-brand-margin-end:           1rem !default;\n\n$navbar-toggler-padding-y:          .25rem !default;\n$navbar-toggler-padding-x:          .75rem !default;\n$navbar-toggler-font-size:          $font-size-lg !default;\n$navbar-toggler-border-radius:      $btn-border-radius !default;\n$navbar-toggler-focus-width:        $btn-focus-width !default;\n$navbar-toggler-transition:         box-shadow .15s ease-in-out !default;\n\n$navbar-light-color:                rgba($black, .55) !default;\n$navbar-light-hover-color:          rgba($black, .7) !default;\n$navbar-light-active-color:         rgba($black, .9) !default;\n$navbar-light-disabled-color:       rgba($black, .3) !default;\n$navbar-light-toggler-icon-bg:      url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'><path stroke='#{$navbar-light-color}' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/></svg>\") !default;\n$navbar-light-toggler-border-color: rgba($black, .1) !default;\n$navbar-light-brand-color:          $navbar-light-active-color !default;\n$navbar-light-brand-hover-color:    $navbar-light-active-color !default;\n// scss-docs-end navbar-variables\n\n// scss-docs-start navbar-dark-variables\n$navbar-dark-color:                 rgba($white, .55) !default;\n$navbar-dark-hover-color:           rgba($white, .75) !default;\n$navbar-dark-active-color:          $white !default;\n$navbar-dark-disabled-color:        rgba($white, .25) !default;\n$navbar-dark-toggler-icon-bg:       url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'><path stroke='#{$navbar-dark-color}' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/></svg>\") !default;\n$navbar-dark-toggler-border-color:  rgba($white, .1) !default;\n$navbar-dark-brand-color:           $navbar-dark-active-color !default;\n$navbar-dark-brand-hover-color:     $navbar-dark-active-color !default;\n// scss-docs-end navbar-dark-variables\n\n\n// Dropdowns\n//\n// Dropdown menu container and contents.\n\n// scss-docs-start dropdown-variables\n$dropdown-min-width:                10rem !default;\n$dropdown-padding-x:                0 !default;\n$dropdown-padding-y:                .5rem !default;\n$dropdown-spacer:                   .125rem !default;\n$dropdown-font-size:                $font-size-base !default;\n$dropdown-color:                    $body-color !default;\n$dropdown-bg:                       $white !default;\n$dropdown-border-color:             var(--#{$prefix}border-color-translucent) !default;\n$dropdown-border-radius:            $border-radius !default;\n$dropdown-border-width:             $border-width !default;\n$dropdown-inner-border-radius:      subtract($dropdown-border-radius, $dropdown-border-width) !default;\n$dropdown-divider-bg:               $dropdown-border-color !default;\n$dropdown-divider-margin-y:         $spacer * .5 !default;\n$dropdown-box-shadow:               $box-shadow !default;\n\n$dropdown-link-color:               $gray-900 !default;\n$dropdown-link-hover-color:         shade-color($dropdown-link-color, 10%) !default;\n$dropdown-link-hover-bg:            $gray-200 !default;\n\n$dropdown-link-active-color:        $component-active-color !default;\n$dropdown-link-active-bg:           $component-active-bg !default;\n\n$dropdown-link-disabled-color:      $gray-500 !default;\n\n$dropdown-item-padding-y:           $spacer * .25 !default;\n$dropdown-item-padding-x:           $spacer !default;\n\n$dropdown-header-color:             $gray-600 !default;\n$dropdown-header-padding-x:         $dropdown-item-padding-x !default;\n$dropdown-header-padding-y:         $dropdown-padding-y !default;\n// fusv-disable\n$dropdown-header-padding:           $dropdown-header-padding-y $dropdown-header-padding-x !default; // Deprecated in v5.2.0\n// fusv-enable\n// scss-docs-end dropdown-variables\n\n// scss-docs-start dropdown-dark-variables\n$dropdown-dark-color:               $gray-300 !default;\n$dropdown-dark-bg:                  $gray-800 !default;\n$dropdown-dark-border-color:        $dropdown-border-color !default;\n$dropdown-dark-divider-bg:          $dropdown-divider-bg !default;\n$dropdown-dark-box-shadow:          null !default;\n$dropdown-dark-link-color:          $dropdown-dark-color !default;\n$dropdown-dark-link-hover-color:    $white !default;\n$dropdown-dark-link-hover-bg:       rgba($white, .15) !default;\n$dropdown-dark-link-active-color:   $dropdown-link-active-color !default;\n$dropdown-dark-link-active-bg:      $dropdown-link-active-bg !default;\n$dropdown-dark-link-disabled-color: $gray-500 !default;\n$dropdown-dark-header-color:        $gray-500 !default;\n// scss-docs-end dropdown-dark-variables\n\n\n// Pagination\n\n// scss-docs-start pagination-variables\n$pagination-padding-y:              .375rem !default;\n$pagination-padding-x:              .75rem !default;\n$pagination-padding-y-sm:           .25rem !default;\n$pagination-padding-x-sm:           .5rem !default;\n$pagination-padding-y-lg:           .75rem !default;\n$pagination-padding-x-lg:           1.5rem !default;\n\n$pagination-font-size:              $font-size-base !default;\n\n$pagination-color:                  var(--#{$prefix}link-color) !default;\n$pagination-bg:                     $white !default;\n$pagination-border-radius:          $border-radius !default;\n$pagination-border-width:           $border-width !default;\n$pagination-margin-start:           ($pagination-border-width * -1) !default;\n$pagination-border-color:           $gray-300 !default;\n\n$pagination-focus-color:            var(--#{$prefix}link-hover-color) !default;\n$pagination-focus-bg:               $gray-200 !default;\n$pagination-focus-box-shadow:       $input-btn-focus-box-shadow !default;\n$pagination-focus-outline:          0 !default;\n\n$pagination-hover-color:            var(--#{$prefix}link-hover-color) !default;\n$pagination-hover-bg:               $gray-200 !default;\n$pagination-hover-border-color:     $gray-300 !default;\n\n$pagination-active-color:           $component-active-color !default;\n$pagination-active-bg:              $component-active-bg !default;\n$pagination-active-border-color:    $pagination-active-bg !default;\n\n$pagination-disabled-color:         $gray-600 !default;\n$pagination-disabled-bg:            $white !default;\n$pagination-disabled-border-color:  $gray-300 !default;\n\n$pagination-transition:              color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out !default;\n\n$pagination-border-radius-sm:       $border-radius-sm !default;\n$pagination-border-radius-lg:       $border-radius-lg !default;\n// scss-docs-end pagination-variables\n\n\n// Placeholders\n\n// scss-docs-start placeholders\n$placeholder-opacity-max:           .5 !default;\n$placeholder-opacity-min:           .2 !default;\n// scss-docs-end placeholders\n\n// Cards\n\n// scss-docs-start card-variables\n$card-spacer-y:                     $spacer !default;\n$card-spacer-x:                     $spacer !default;\n$card-title-spacer-y:               $spacer * .5 !default;\n$card-border-width:                 $border-width !default;\n$card-border-color:                 var(--#{$prefix}border-color-translucent) !default;\n$card-border-radius:                $border-radius !default;\n$card-box-shadow:                   null !default;\n$card-inner-border-radius:          subtract($card-border-radius, $card-border-width) !default;\n$card-cap-padding-y:                $card-spacer-y * .5 !default;\n$card-cap-padding-x:                $card-spacer-x !default;\n$card-cap-bg:                       rgba($black, .03) !default;\n$card-cap-color:                    null !default;\n$card-height:                       null !default;\n$card-color:                        null !default;\n$card-bg:                           $white !default;\n$card-img-overlay-padding:          $spacer !default;\n$card-group-margin:                 $grid-gutter-width * .5 !default;\n// scss-docs-end card-variables\n\n// Accordion\n\n// scss-docs-start accordion-variables\n$accordion-padding-y:                     1rem !default;\n$accordion-padding-x:                     1.25rem !default;\n$accordion-color:                         $body-color !default; // Sass variable because of $accordion-button-icon\n$accordion-bg:                            $body-bg !default;\n$accordion-border-width:                  $border-width !default;\n$accordion-border-color:                  var(--#{$prefix}border-color) !default;\n$accordion-border-radius:                 $border-radius !default;\n$accordion-inner-border-radius:           subtract($accordion-border-radius, $accordion-border-width) !default;\n\n$accordion-body-padding-y:                $accordion-padding-y !default;\n$accordion-body-padding-x:                $accordion-padding-x !default;\n\n$accordion-button-padding-y:              $accordion-padding-y !default;\n$accordion-button-padding-x:              $accordion-padding-x !default;\n$accordion-button-color:                  $accordion-color !default;\n$accordion-button-bg:                     var(--#{$prefix}accordion-bg) !default;\n$accordion-transition:                    $btn-transition, border-radius .15s ease !default;\n$accordion-button-active-bg:              tint-color($component-active-bg, 90%) !default;\n$accordion-button-active-color:           shade-color($primary, 10%) !default;\n\n$accordion-button-focus-border-color:     $input-focus-border-color !default;\n$accordion-button-focus-box-shadow:       $btn-focus-box-shadow !default;\n\n$accordion-icon-width:                    1.25rem !default;\n$accordion-icon-color:                    $accordion-button-color !default;\n$accordion-icon-active-color:             $accordion-button-active-color !default;\n$accordion-icon-transition:               transform .2s ease-in-out !default;\n$accordion-icon-transform:                rotate(-180deg) !default;\n\n$accordion-button-icon:         url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='#{$accordion-icon-color}'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>\") !default;\n$accordion-button-active-icon:  url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='#{$accordion-icon-active-color}'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>\") !default;\n// scss-docs-end accordion-variables\n\n// Tooltips\n\n// scss-docs-start tooltip-variables\n$tooltip-font-size:                 $font-size-sm !default;\n$tooltip-max-width:                 200px !default;\n$tooltip-color:                     $white !default;\n$tooltip-bg:                        $black !default;\n$tooltip-border-radius:             $border-radius !default;\n$tooltip-opacity:                   .9 !default;\n$tooltip-padding-y:                 $spacer * .25 !default;\n$tooltip-padding-x:                 $spacer * .5 !default;\n$tooltip-margin:                    null !default; // TODO: remove this in v6\n\n$tooltip-arrow-width:               .8rem !default;\n$tooltip-arrow-height:              .4rem !default;\n// fusv-disable\n$tooltip-arrow-color:               null !default; // Deprecated in Bootstrap 5.2.0 for CSS variables\n// fusv-enable\n// scss-docs-end tooltip-variables\n\n// Form tooltips must come after regular tooltips\n// scss-docs-start tooltip-feedback-variables\n$form-feedback-tooltip-padding-y:     $tooltip-padding-y !default;\n$form-feedback-tooltip-padding-x:     $tooltip-padding-x !default;\n$form-feedback-tooltip-font-size:     $tooltip-font-size !default;\n$form-feedback-tooltip-line-height:   null !default;\n$form-feedback-tooltip-opacity:       $tooltip-opacity !default;\n$form-feedback-tooltip-border-radius: $tooltip-border-radius !default;\n// scss-docs-end tooltip-feedback-variables\n\n\n// Popovers\n\n// scss-docs-start popover-variables\n$popover-font-size:                 $font-size-sm !default;\n$popover-bg:                        $white !default;\n$popover-max-width:                 276px !default;\n$popover-border-width:              $border-width !default;\n$popover-border-color:              var(--#{$prefix}border-color-translucent) !default;\n$popover-border-radius:             $border-radius-lg !default;\n$popover-inner-border-radius:       subtract($popover-border-radius, $popover-border-width) !default;\n$popover-box-shadow:                $box-shadow !default;\n\n$popover-header-font-size:          $font-size-base !default;\n$popover-header-bg:                 shade-color($popover-bg, 6%) !default;\n$popover-header-color:              $headings-color !default;\n$popover-header-padding-y:          .5rem !default;\n$popover-header-padding-x:          $spacer !default;\n\n$popover-body-color:                $body-color !default;\n$popover-body-padding-y:            $spacer !default;\n$popover-body-padding-x:            $spacer !default;\n\n$popover-arrow-width:               1rem !default;\n$popover-arrow-height:              .5rem !default;\n// scss-docs-end popover-variables\n\n// fusv-disable\n// Deprecated in Bootstrap 5.2.0 for CSS variables\n$popover-arrow-color:               $popover-bg !default;\n$popover-arrow-outer-color:         var(--#{$prefix}border-color-translucent) !default;\n// fusv-enable\n\n\n// Toasts\n\n// scss-docs-start toast-variables\n$toast-max-width:                   350px !default;\n$toast-padding-x:                   .75rem !default;\n$toast-padding-y:                   .5rem !default;\n$toast-font-size:                   .875rem !default;\n$toast-color:                       null !default;\n$toast-background-color:            rgba($white, .85) !default;\n$toast-border-width:                $border-width !default;\n$toast-border-color:                var(--#{$prefix}border-color-translucent) !default;\n$toast-border-radius:               $border-radius !default;\n$toast-box-shadow:                  $box-shadow !default;\n$toast-spacing:                     $container-padding-x !default;\n\n$toast-header-color:                $gray-600 !default;\n$toast-header-background-color:     rgba($white, .85) !default;\n$toast-header-border-color:         rgba($black, .05) !default;\n// scss-docs-end toast-variables\n\n\n// Badges\n\n// scss-docs-start badge-variables\n$badge-font-size:                   .75em !default;\n$badge-font-weight:                 $font-weight-bold !default;\n$badge-color:                       $white !default;\n$badge-padding-y:                   .35em !default;\n$badge-padding-x:                   .65em !default;\n$badge-border-radius:               $border-radius !default;\n// scss-docs-end badge-variables\n\n\n// Modals\n\n// scss-docs-start modal-variables\n$modal-inner-padding:               $spacer !default;\n\n$modal-footer-margin-between:       .5rem !default;\n\n$modal-dialog-margin:               .5rem !default;\n$modal-dialog-margin-y-sm-up:       1.75rem !default;\n\n$modal-title-line-height:           $line-height-base !default;\n\n$modal-content-color:               null !default;\n$modal-content-bg:                  $white !default;\n$modal-content-border-color:        var(--#{$prefix}border-color-translucent) !default;\n$modal-content-border-width:        $border-width !default;\n$modal-content-border-radius:       $border-radius-lg !default;\n$modal-content-inner-border-radius: subtract($modal-content-border-radius, $modal-content-border-width) !default;\n$modal-content-box-shadow-xs:       $box-shadow-sm !default;\n$modal-content-box-shadow-sm-up:    $box-shadow !default;\n\n$modal-backdrop-bg:                 $black !default;\n$modal-backdrop-opacity:            .5 !default;\n\n$modal-header-border-color:         var(--#{$prefix}border-color) !default;\n$modal-header-border-width:         $modal-content-border-width !default;\n$modal-header-padding-y:            $modal-inner-padding !default;\n$modal-header-padding-x:            $modal-inner-padding !default;\n$modal-header-padding:              $modal-header-padding-y $modal-header-padding-x !default; // Keep this for backwards compatibility\n\n$modal-footer-bg:                   null !default;\n$modal-footer-border-color:         $modal-header-border-color !default;\n$modal-footer-border-width:         $modal-header-border-width !default;\n\n$modal-sm:                          300px !default;\n$modal-md:                          500px !default;\n$modal-lg:                          800px !default;\n$modal-xl:                          1140px !default;\n\n$modal-fade-transform:              translate(0, -50px) !default;\n$modal-show-transform:              none !default;\n$modal-transition:                  transform .3s ease-out !default;\n$modal-scale-transform:             scale(1.02) !default;\n// scss-docs-end modal-variables\n\n\n// Alerts\n//\n// Define alert colors, border radius, and padding.\n\n// scss-docs-start alert-variables\n$alert-padding-y:               $spacer !default;\n$alert-padding-x:               $spacer !default;\n$alert-margin-bottom:           1rem !default;\n$alert-border-radius:           $border-radius !default;\n$alert-link-font-weight:        $font-weight-bold !default;\n$alert-border-width:            $border-width !default;\n$alert-bg-scale:                -80% !default;\n$alert-border-scale:            -70% !default;\n$alert-color-scale:             40% !default;\n$alert-dismissible-padding-r:   $alert-padding-x * 3 !default; // 3x covers width of x plus default padding on either side\n// scss-docs-end alert-variables\n\n\n// Progress bars\n\n// scss-docs-start progress-variables\n$progress-height:                   1rem !default;\n$progress-font-size:                $font-size-base * .75 !default;\n$progress-bg:                       $gray-200 !default;\n$progress-border-radius:            $border-radius !default;\n$progress-box-shadow:               $box-shadow-inset !default;\n$progress-bar-color:                $white !default;\n$progress-bar-bg:                   $primary !default;\n$progress-bar-animation-timing:     1s linear infinite !default;\n$progress-bar-transition:           width .6s ease !default;\n// scss-docs-end progress-variables\n\n\n// List group\n\n// scss-docs-start list-group-variables\n$list-group-color:                  $gray-900 !default;\n$list-group-bg:                     $white !default;\n$list-group-border-color:           rgba($black, .125) !default;\n$list-group-border-width:           $border-width !default;\n$list-group-border-radius:          $border-radius !default;\n\n$list-group-item-padding-y:         $spacer * .5 !default;\n$list-group-item-padding-x:         $spacer !default;\n$list-group-item-bg-scale:          -80% !default;\n$list-group-item-color-scale:       40% !default;\n\n$list-group-hover-bg:               $gray-100 !default;\n$list-group-active-color:           $component-active-color !default;\n$list-group-active-bg:              $component-active-bg !default;\n$list-group-active-border-color:    $list-group-active-bg !default;\n\n$list-group-disabled-color:         $gray-600 !default;\n$list-group-disabled-bg:            $list-group-bg !default;\n\n$list-group-action-color:           $gray-700 !default;\n$list-group-action-hover-color:     $list-group-action-color !default;\n\n$list-group-action-active-color:    $body-color !default;\n$list-group-action-active-bg:       $gray-200 !default;\n// scss-docs-end list-group-variables\n\n\n// Image thumbnails\n\n// scss-docs-start thumbnail-variables\n$thumbnail-padding:                 .25rem !default;\n$thumbnail-bg:                      $body-bg !default;\n$thumbnail-border-width:            $border-width !default;\n$thumbnail-border-color:            var(--#{$prefix}border-color) !default;\n$thumbnail-border-radius:           $border-radius !default;\n$thumbnail-box-shadow:              $box-shadow-sm !default;\n// scss-docs-end thumbnail-variables\n\n\n// Figures\n\n// scss-docs-start figure-variables\n$figure-caption-font-size:          $small-font-size !default;\n$figure-caption-color:              $gray-600 !default;\n// scss-docs-end figure-variables\n\n\n// Breadcrumbs\n\n// scss-docs-start breadcrumb-variables\n$breadcrumb-font-size:              null !default;\n$breadcrumb-padding-y:              0 !default;\n$breadcrumb-padding-x:              0 !default;\n$breadcrumb-item-padding-x:         .5rem !default;\n$breadcrumb-margin-bottom:          1rem !default;\n$breadcrumb-bg:                     null !default;\n$breadcrumb-divider-color:          $gray-600 !default;\n$breadcrumb-active-color:           $gray-600 !default;\n$breadcrumb-divider:                quote(\"/\") !default;\n$breadcrumb-divider-flipped:        $breadcrumb-divider !default;\n$breadcrumb-border-radius:          null !default;\n// scss-docs-end breadcrumb-variables\n\n// Carousel\n\n// scss-docs-start carousel-variables\n$carousel-control-color:             $white !default;\n$carousel-control-width:             15% !default;\n$carousel-control-opacity:           .5 !default;\n$carousel-control-hover-opacity:     .9 !default;\n$carousel-control-transition:        opacity .15s ease !default;\n\n$carousel-indicator-width:           30px !default;\n$carousel-indicator-height:          3px !default;\n$carousel-indicator-hit-area-height: 10px !default;\n$carousel-indicator-spacer:          3px !default;\n$carousel-indicator-opacity:         .5 !default;\n$carousel-indicator-active-bg:       $white !default;\n$carousel-indicator-active-opacity:  1 !default;\n$carousel-indicator-transition:      opacity .6s ease !default;\n\n$carousel-caption-width:             70% !default;\n$carousel-caption-color:             $white !default;\n$carousel-caption-padding-y:         1.25rem !default;\n$carousel-caption-spacer:            1.25rem !default;\n\n$carousel-control-icon-width:        2rem !default;\n\n$carousel-control-prev-icon-bg:      url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='#{$carousel-control-color}'><path d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/></svg>\") !default;\n$carousel-control-next-icon-bg:      url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='#{$carousel-control-color}'><path d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/></svg>\") !default;\n\n$carousel-transition-duration:       .6s !default;\n$carousel-transition:                transform $carousel-transition-duration ease-in-out !default; // Define transform transition first if using multiple transitions (e.g., `transform 2s ease, opacity .5s ease-out`)\n// scss-docs-end carousel-variables\n\n// scss-docs-start carousel-dark-variables\n$carousel-dark-indicator-active-bg:  $black !default;\n$carousel-dark-caption-color:        $black !default;\n$carousel-dark-control-icon-filter:  invert(1) grayscale(100) !default;\n// scss-docs-end carousel-dark-variables\n\n\n// Spinners\n\n// scss-docs-start spinner-variables\n$spinner-width:           2rem !default;\n$spinner-height:          $spinner-width !default;\n$spinner-vertical-align:  -.125em !default;\n$spinner-border-width:    .25em !default;\n$spinner-animation-speed: .75s !default;\n\n$spinner-width-sm:        1rem !default;\n$spinner-height-sm:       $spinner-width-sm !default;\n$spinner-border-width-sm: .2em !default;\n// scss-docs-end spinner-variables\n\n\n// Close\n\n// scss-docs-start close-variables\n$btn-close-width:            1em !default;\n$btn-close-height:           $btn-close-width !default;\n$btn-close-padding-x:        .25em !default;\n$btn-close-padding-y:        $btn-close-padding-x !default;\n$btn-close-color:            $black !default;\n$btn-close-bg:               url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='#{$btn-close-color}'><path d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/></svg>\") !default;\n$btn-close-focus-shadow:     $input-btn-focus-box-shadow !default;\n$btn-close-opacity:          .5 !default;\n$btn-close-hover-opacity:    .75 !default;\n$btn-close-focus-opacity:    1 !default;\n$btn-close-disabled-opacity: .25 !default;\n$btn-close-white-filter:     invert(1) grayscale(100%) brightness(200%) !default;\n// scss-docs-end close-variables\n\n\n// Offcanvas\n\n// scss-docs-start offcanvas-variables\n$offcanvas-padding-y:               $modal-inner-padding !default;\n$offcanvas-padding-x:               $modal-inner-padding !default;\n$offcanvas-horizontal-width:        400px !default;\n$offcanvas-vertical-height:         30vh !default;\n$offcanvas-transition-duration:     .3s !default;\n$offcanvas-border-color:            $modal-content-border-color !default;\n$offcanvas-border-width:            $modal-content-border-width !default;\n$offcanvas-title-line-height:       $modal-title-line-height !default;\n$offcanvas-bg-color:                $modal-content-bg !default;\n$offcanvas-color:                   $modal-content-color !default;\n$offcanvas-box-shadow:              $modal-content-box-shadow-xs !default;\n$offcanvas-backdrop-bg:             $modal-backdrop-bg !default;\n$offcanvas-backdrop-opacity:        $modal-backdrop-opacity !default;\n// scss-docs-end offcanvas-variables\n\n// Code\n\n$code-font-size:                    $small-font-size !default;\n$code-color:                        $pink !default;\n\n$kbd-padding-y:                     .1875rem !default;\n$kbd-padding-x:                     .375rem !default;\n$kbd-font-size:                     $code-font-size !default;\n$kbd-color:                         var(--#{$prefix}body-bg) !default;\n$kbd-bg:                            var(--#{$prefix}body-color) !default;\n$nested-kbd-font-weight:            null !default; // Deprecated in v5.2.0, removing in v6\n\n$pre-color:                         null !default;\n","// stylelint-disable property-disallowed-list\n// Single side border-radius\n\n// Helper function to replace negative values with 0\n@function valid-radius($radius) {\n  $return: ();\n  @each $value in $radius {\n    @if type-of($value) == number {\n      $return: append($return, max($value, 0));\n    } @else {\n      $return: append($return, $value);\n    }\n  }\n  @return $return;\n}\n\n// scss-docs-start border-radius-mixins\n@mixin border-radius($radius: $border-radius, $fallback-border-radius: false) {\n  @if $enable-rounded {\n    border-radius: valid-radius($radius);\n  }\n  @else if $fallback-border-radius != false {\n    border-radius: $fallback-border-radius;\n  }\n}\n\n@mixin border-top-radius($radius: $border-radius) {\n  @if $enable-rounded {\n    border-top-left-radius: valid-radius($radius);\n    border-top-right-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-end-radius($radius: $border-radius) {\n  @if $enable-rounded {\n    border-top-right-radius: valid-radius($radius);\n    border-bottom-right-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-bottom-radius($radius: $border-radius) {\n  @if $enable-rounded {\n    border-bottom-right-radius: valid-radius($radius);\n    border-bottom-left-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-start-radius($radius: $border-radius) {\n  @if $enable-rounded {\n    border-top-left-radius: valid-radius($radius);\n    border-bottom-left-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-top-start-radius($radius: $border-radius) {\n  @if $enable-rounded {\n    border-top-left-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-top-end-radius($radius: $border-radius) {\n  @if $enable-rounded {\n    border-top-right-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-bottom-end-radius($radius: $border-radius) {\n  @if $enable-rounded {\n    border-bottom-right-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-bottom-start-radius($radius: $border-radius) {\n  @if $enable-rounded {\n    border-bottom-left-radius: valid-radius($radius);\n  }\n}\n// scss-docs-end border-radius-mixins\n","//\n// Headings\n//\n.h1 {\n  @extend h1;\n}\n\n.h2 {\n  @extend h2;\n}\n\n.h3 {\n  @extend h3;\n}\n\n.h4 {\n  @extend h4;\n}\n\n.h5 {\n  @extend h5;\n}\n\n.h6 {\n  @extend h6;\n}\n\n\n.lead {\n  @include font-size($lead-font-size);\n  font-weight: $lead-font-weight;\n}\n\n// Type display classes\n@each $display, $font-size in $display-font-sizes {\n  .display-#{$display} {\n    @include font-size($font-size);\n    font-family: $display-font-family;\n    font-style: $display-font-style;\n    font-weight: $display-font-weight;\n    line-height: $display-line-height;\n  }\n}\n\n//\n// Emphasis\n//\n.small {\n  @extend small;\n}\n\n.mark {\n  @extend mark;\n}\n\n//\n// Lists\n//\n\n.list-unstyled {\n  @include list-unstyled();\n}\n\n// Inline turns list items into inline-block\n.list-inline {\n  @include list-unstyled();\n}\n.list-inline-item {\n  display: inline-block;\n\n  &:not(:last-child) {\n    margin-right: $list-inline-padding;\n  }\n}\n\n\n//\n// Misc\n//\n\n// Builds on `abbr`\n.initialism {\n  @include font-size($initialism-font-size);\n  text-transform: uppercase;\n}\n\n// Blockquotes\n.blockquote {\n  margin-bottom: $blockquote-margin-y;\n  @include font-size($blockquote-font-size);\n\n  > :last-child {\n    margin-bottom: 0;\n  }\n}\n\n.blockquote-footer {\n  margin-top: -$blockquote-margin-y;\n  margin-bottom: $blockquote-margin-y;\n  @include font-size($blockquote-footer-font-size);\n  color: $blockquote-footer-color;\n\n  &::before {\n    content: \"\\2014\\00A0\"; // em dash, nbsp\n  }\n}\n","// Lists\n\n// Unstyled keeps list items block level, just removes default browser padding and list-style\n@mixin list-unstyled {\n  padding-left: 0;\n  list-style: none;\n}\n","// Responsive images (ensure images don't scale beyond their parents)\n//\n// This is purposefully opt-in via an explicit class rather than being the default for all `<img>`s.\n// We previously tried the \"images are responsive by default\" approach in Bootstrap v2,\n// and abandoned it in Bootstrap v3 because it breaks lots of third-party widgets (including Google Maps)\n// which weren't expecting the images within themselves to be involuntarily resized.\n// See also https://github.com/twbs/bootstrap/issues/18178\n.img-fluid {\n  @include img-fluid();\n}\n\n\n// Image thumbnails\n.img-thumbnail {\n  padding: $thumbnail-padding;\n  background-color: $thumbnail-bg;\n  border: $thumbnail-border-width solid $thumbnail-border-color;\n  @include border-radius($thumbnail-border-radius);\n  @include box-shadow($thumbnail-box-shadow);\n\n  // Keep them at most 100% wide\n  @include img-fluid();\n}\n\n//\n// Figures\n//\n\n.figure {\n  // Ensures the caption's text aligns with the image.\n  display: inline-block;\n}\n\n.figure-img {\n  margin-bottom: $spacer * .5;\n  line-height: 1;\n}\n\n.figure-caption {\n  @include font-size($figure-caption-font-size);\n  color: $figure-caption-color;\n}\n","// Image Mixins\n// - Responsive image\n// - Retina image\n\n\n// Responsive image\n//\n// Keep images from scaling beyond the width of their parents.\n\n@mixin img-fluid {\n  // Part 1: Set a maximum relative to the parent\n  max-width: 100%;\n  // Part 2: Override the height to auto, otherwise images will be stretched\n  // when setting a width and height attribute on the img element.\n  height: auto;\n}\n","// Container widths\n//\n// Set the container width, and override it for fixed navbars in media queries.\n\n@if $enable-container-classes {\n  // Single container class with breakpoint max-widths\n  .container,\n  // 100% wide container at all breakpoints\n  .container-fluid {\n    @include make-container();\n  }\n\n  // Responsive containers that are 100% wide until a breakpoint\n  @each $breakpoint, $container-max-width in $container-max-widths {\n    .container-#{$breakpoint} {\n      @extend .container-fluid;\n    }\n\n    @include media-breakpoint-up($breakpoint, $grid-breakpoints) {\n      %responsive-container-#{$breakpoint} {\n        max-width: $container-max-width;\n      }\n\n      // Extend each breakpoint which is smaller or equal to the current breakpoint\n      $extend-breakpoint: true;\n\n      @each $name, $width in $grid-breakpoints {\n        @if ($extend-breakpoint) {\n          .container#{breakpoint-infix($name, $grid-breakpoints)} {\n            @extend %responsive-container-#{$breakpoint};\n          }\n\n          // Once the current breakpoint is reached, stop extending\n          @if ($breakpoint == $name) {\n            $extend-breakpoint: false;\n          }\n        }\n      }\n    }\n  }\n}\n","// Container mixins\n\n@mixin make-container($gutter: $container-padding-x) {\n  --#{$prefix}gutter-x: #{$gutter};\n  --#{$prefix}gutter-y: 0;\n  width: 100%;\n  padding-right: calc(var(--#{$prefix}gutter-x) * .5); // stylelint-disable-line function-disallowed-list\n  padding-left: calc(var(--#{$prefix}gutter-x) * .5); // stylelint-disable-line function-disallowed-list\n  margin-right: auto;\n  margin-left: auto;\n}\n","// Breakpoint viewport sizes and media queries.\n//\n// Breakpoints are defined as a map of (name: minimum width), order from small to large:\n//\n//    (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1400px)\n//\n// The map defined in the `$grid-breakpoints` global variable is used as the `$breakpoints` argument by default.\n\n// Name of the next breakpoint, or null for the last breakpoint.\n//\n//    >> breakpoint-next(sm)\n//    md\n//    >> breakpoint-next(sm, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1400px))\n//    md\n//    >> breakpoint-next(sm, $breakpoint-names: (xs sm md lg xl xxl))\n//    md\n@function breakpoint-next($name, $breakpoints: $grid-breakpoints, $breakpoint-names: map-keys($breakpoints)) {\n  $n: index($breakpoint-names, $name);\n  @if not $n {\n    @error \"breakpoint `#{$name}` not found in `#{$breakpoints}`\";\n  }\n  @return if($n < length($breakpoint-names), nth($breakpoint-names, $n + 1), null);\n}\n\n// Minimum breakpoint width. Null for the smallest (first) breakpoint.\n//\n//    >> breakpoint-min(sm, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1400px))\n//    576px\n@function breakpoint-min($name, $breakpoints: $grid-breakpoints) {\n  $min: map-get($breakpoints, $name);\n  @return if($min != 0, $min, null);\n}\n\n// Maximum breakpoint width.\n// The maximum value is reduced by 0.02px to work around the limitations of\n// `min-` and `max-` prefixes and viewports with fractional widths.\n// See https://www.w3.org/TR/mediaqueries-4/#mq-min-max\n// Uses 0.02px rather than 0.01px to work around a current rounding bug in Safari.\n// See https://bugs.webkit.org/show_bug.cgi?id=178261\n//\n//    >> breakpoint-max(md, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1400px))\n//    767.98px\n@function breakpoint-max($name, $breakpoints: $grid-breakpoints) {\n  $max: map-get($breakpoints, $name);\n  @return if($max and $max > 0, $max - .02, null);\n}\n\n// Returns a blank string if smallest breakpoint, otherwise returns the name with a dash in front.\n// Useful for making responsive utilities.\n//\n//    >> breakpoint-infix(xs, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1400px))\n//    \"\"  (Returns a blank string)\n//    >> breakpoint-infix(sm, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1400px))\n//    \"-sm\"\n@function breakpoint-infix($name, $breakpoints: $grid-breakpoints) {\n  @return if(breakpoint-min($name, $breakpoints) == null, \"\", \"-#{$name}\");\n}\n\n// Media of at least the minimum breakpoint width. No query for the smallest breakpoint.\n// Makes the @content apply to the given breakpoint and wider.\n@mixin media-breakpoint-up($name, $breakpoints: $grid-breakpoints) {\n  $min: breakpoint-min($name, $breakpoints);\n  @if $min {\n    @media (min-width: $min) {\n      @content;\n    }\n  } @else {\n    @content;\n  }\n}\n\n// Media of at most the maximum breakpoint width. No query for the largest breakpoint.\n// Makes the @content apply to the given breakpoint and narrower.\n@mixin media-breakpoint-down($name, $breakpoints: $grid-breakpoints) {\n  $max: breakpoint-max($name, $breakpoints);\n  @if $max {\n    @media (max-width: $max) {\n      @content;\n    }\n  } @else {\n    @content;\n  }\n}\n\n// Media that spans multiple breakpoint widths.\n// Makes the @content apply between the min and max breakpoints\n@mixin media-breakpoint-between($lower, $upper, $breakpoints: $grid-breakpoints) {\n  $min: breakpoint-min($lower, $breakpoints);\n  $max: breakpoint-max($upper, $breakpoints);\n\n  @if $min != null and $max != null {\n    @media (min-width: $min) and (max-width: $max) {\n      @content;\n    }\n  } @else if $max == null {\n    @include media-breakpoint-up($lower, $breakpoints) {\n      @content;\n    }\n  } @else if $min == null {\n    @include media-breakpoint-down($upper, $breakpoints) {\n      @content;\n    }\n  }\n}\n\n// Media between the breakpoint's minimum and maximum widths.\n// No minimum for the smallest breakpoint, and no maximum for the largest one.\n// Makes the @content apply only to the given breakpoint, not viewports any wider or narrower.\n@mixin media-breakpoint-only($name, $breakpoints: $grid-breakpoints) {\n  $min:  breakpoint-min($name, $breakpoints);\n  $next: breakpoint-next($name, $breakpoints);\n  $max:  breakpoint-max($next, $breakpoints);\n\n  @if $min != null and $max != null {\n    @media (min-width: $min) and (max-width: $max) {\n      @content;\n    }\n  } @else if $max == null {\n    @include media-breakpoint-up($name, $breakpoints) {\n      @content;\n    }\n  } @else if $min == null {\n    @include media-breakpoint-down($next, $breakpoints) {\n      @content;\n    }\n  }\n}\n","// Row\n//\n// Rows contain your columns.\n\n@if $enable-grid-classes {\n  .row {\n    @include make-row();\n\n    > * {\n      @include make-col-ready();\n    }\n  }\n}\n\n@if $enable-cssgrid {\n  .grid {\n    display: grid;\n    grid-template-rows: repeat(var(--#{$prefix}rows, 1), 1fr);\n    grid-template-columns: repeat(var(--#{$prefix}columns, #{$grid-columns}), 1fr);\n    gap: var(--#{$prefix}gap, #{$grid-gutter-width});\n\n    @include make-cssgrid();\n  }\n}\n\n\n// Columns\n//\n// Common styles for small and large grid columns\n\n@if $enable-grid-classes {\n  @include make-grid-columns();\n}\n","// Grid system\n//\n// Generate semantic grid columns with these mixins.\n\n@mixin make-row($gutter: $grid-gutter-width) {\n  --#{$prefix}gutter-x: #{$gutter};\n  --#{$prefix}gutter-y: 0;\n  display: flex;\n  flex-wrap: wrap;\n  // TODO: Revisit calc order after https://github.com/react-bootstrap/react-bootstrap/issues/6039 is fixed\n  margin-top: calc(-1 * var(--#{$prefix}gutter-y)); // stylelint-disable-line function-disallowed-list\n  margin-right: calc(-.5 * var(--#{$prefix}gutter-x)); // stylelint-disable-line function-disallowed-list\n  margin-left: calc(-.5 * var(--#{$prefix}gutter-x)); // stylelint-disable-line function-disallowed-list\n}\n\n@mixin make-col-ready() {\n  // Add box sizing if only the grid is loaded\n  box-sizing: if(variable-exists(include-column-box-sizing) and $include-column-box-sizing, border-box, null);\n  // Prevent columns from becoming too narrow when at smaller grid tiers by\n  // always setting `width: 100%;`. This works because we set the width\n  // later on to override this initial width.\n  flex-shrink: 0;\n  width: 100%;\n  max-width: 100%; // Prevent `.col-auto`, `.col` (& responsive variants) from breaking out the grid\n  padding-right: calc(var(--#{$prefix}gutter-x) * .5); // stylelint-disable-line function-disallowed-list\n  padding-left: calc(var(--#{$prefix}gutter-x) * .5); // stylelint-disable-line function-disallowed-list\n  margin-top: var(--#{$prefix}gutter-y);\n}\n\n@mixin make-col($size: false, $columns: $grid-columns) {\n  @if $size {\n    flex: 0 0 auto;\n    width: percentage(divide($size, $columns));\n\n  } @else {\n    flex: 1 1 0;\n    max-width: 100%;\n  }\n}\n\n@mixin make-col-auto() {\n  flex: 0 0 auto;\n  width: auto;\n}\n\n@mixin make-col-offset($size, $columns: $grid-columns) {\n  $num: divide($size, $columns);\n  margin-left: if($num == 0, 0, percentage($num));\n}\n\n// Row columns\n//\n// Specify on a parent element(e.g., .row) to force immediate children into NN\n// number of columns. Supports wrapping to new lines, but does not do a Masonry\n// style grid.\n@mixin row-cols($count) {\n  > * {\n    flex: 0 0 auto;\n    width: divide(100%, $count);\n  }\n}\n\n// Framework grid generation\n//\n// Used only by Bootstrap to generate the correct number of grid classes given\n// any value of `$grid-columns`.\n\n@mixin make-grid-columns($columns: $grid-columns, $gutter: $grid-gutter-width, $breakpoints: $grid-breakpoints) {\n  @each $breakpoint in map-keys($breakpoints) {\n    $infix: breakpoint-infix($breakpoint, $breakpoints);\n\n    @include media-breakpoint-up($breakpoint, $breakpoints) {\n      // Provide basic `.col-{bp}` classes for equal-width flexbox columns\n      .col#{$infix} {\n        flex: 1 0 0%; // Flexbugs #4: https://github.com/philipwalton/flexbugs#flexbug-4\n      }\n\n      .row-cols#{$infix}-auto > * {\n        @include make-col-auto();\n      }\n\n      @if $grid-row-columns > 0 {\n        @for $i from 1 through $grid-row-columns {\n          .row-cols#{$infix}-#{$i} {\n            @include row-cols($i);\n          }\n        }\n      }\n\n      .col#{$infix}-auto {\n        @include make-col-auto();\n      }\n\n      @if $columns > 0 {\n        @for $i from 1 through $columns {\n          .col#{$infix}-#{$i} {\n            @include make-col($i, $columns);\n          }\n        }\n\n        // `$columns - 1` because offsetting by the width of an entire row isn't possible\n        @for $i from 0 through ($columns - 1) {\n          @if not ($infix == \"\" and $i == 0) { // Avoid emitting useless .offset-0\n            .offset#{$infix}-#{$i} {\n              @include make-col-offset($i, $columns);\n            }\n          }\n        }\n      }\n\n      // Gutters\n      //\n      // Make use of `.g-*`, `.gx-*` or `.gy-*` utilities to change spacing between the columns.\n      @each $key, $value in $gutters {\n        .g#{$infix}-#{$key},\n        .gx#{$infix}-#{$key} {\n          --#{$prefix}gutter-x: #{$value};\n        }\n\n        .g#{$infix}-#{$key},\n        .gy#{$infix}-#{$key} {\n          --#{$prefix}gutter-y: #{$value};\n        }\n      }\n    }\n  }\n}\n\n@mixin make-cssgrid($columns: $grid-columns, $breakpoints: $grid-breakpoints) {\n  @each $breakpoint in map-keys($breakpoints) {\n    $infix: breakpoint-infix($breakpoint, $breakpoints);\n\n    @include media-breakpoint-up($breakpoint, $breakpoints) {\n      @if $columns > 0 {\n        @for $i from 1 through $columns {\n          .g-col#{$infix}-#{$i} {\n            grid-column: auto / span $i;\n          }\n        }\n\n        // Start with `1` because `0` is and invalid value.\n        // Ends with `$columns - 1` because offsetting by the width of an entire row isn't possible.\n        @for $i from 1 through ($columns - 1) {\n          .g-start#{$infix}-#{$i} {\n            grid-column-start: $i;\n          }\n        }\n      }\n    }\n  }\n}\n","//\n// Basic Bootstrap table\n//\n\n.table {\n  --#{$prefix}table-color: #{$table-color};\n  --#{$prefix}table-bg: #{$table-bg};\n  --#{$prefix}table-border-color: #{$table-border-color};\n  --#{$prefix}table-accent-bg: #{$table-accent-bg};\n  --#{$prefix}table-striped-color: #{$table-striped-color};\n  --#{$prefix}table-striped-bg: #{$table-striped-bg};\n  --#{$prefix}table-active-color: #{$table-active-color};\n  --#{$prefix}table-active-bg: #{$table-active-bg};\n  --#{$prefix}table-hover-color: #{$table-hover-color};\n  --#{$prefix}table-hover-bg: #{$table-hover-bg};\n\n  width: 100%;\n  margin-bottom: $spacer;\n  color: var(--#{$prefix}table-color);\n  vertical-align: $table-cell-vertical-align;\n  border-color: var(--#{$prefix}table-border-color);\n\n  // Target th & td\n  // We need the child combinator to prevent styles leaking to nested tables which doesn't have a `.table` class.\n  // We use the universal selectors here to simplify the selector (else we would need 6 different selectors).\n  // Another advantage is that this generates less code and makes the selector less specific making it easier to override.\n  // stylelint-disable-next-line selector-max-universal\n  > :not(caption) > * > * {\n    padding: $table-cell-padding-y $table-cell-padding-x;\n    background-color: var(--#{$prefix}table-bg);\n    border-bottom-width: $table-border-width;\n    box-shadow: inset 0 0 0 9999px var(--#{$prefix}table-accent-bg);\n  }\n\n  > tbody {\n    vertical-align: inherit;\n  }\n\n  > thead {\n    vertical-align: bottom;\n  }\n}\n\n.table-group-divider {\n  border-top: ($table-border-width * 2) solid $table-group-separator-color;\n}\n\n//\n// Change placement of captions with a class\n//\n\n.caption-top {\n  caption-side: top;\n}\n\n\n//\n// Condensed table w/ half padding\n//\n\n.table-sm {\n  // stylelint-disable-next-line selector-max-universal\n  > :not(caption) > * > * {\n    padding: $table-cell-padding-y-sm $table-cell-padding-x-sm;\n  }\n}\n\n\n// Border versions\n//\n// Add or remove borders all around the table and between all the columns.\n//\n// When borders are added on all sides of the cells, the corners can render odd when\n// these borders do not have the same color or if they are semi-transparent.\n// Therefor we add top and border bottoms to the `tr`s and left and right borders\n// to the `td`s or `th`s\n\n.table-bordered {\n  > :not(caption) > * {\n    border-width: $table-border-width 0;\n\n    // stylelint-disable-next-line selector-max-universal\n    > * {\n      border-width: 0 $table-border-width;\n    }\n  }\n}\n\n.table-borderless {\n  // stylelint-disable-next-line selector-max-universal\n  > :not(caption) > * > * {\n    border-bottom-width: 0;\n  }\n\n  > :not(:first-child) {\n    border-top-width: 0;\n  }\n}\n\n// Zebra-striping\n//\n// Default zebra-stripe styles (alternating gray and transparent backgrounds)\n\n// For rows\n.table-striped {\n  > tbody > tr:nth-of-type(#{$table-striped-order}) > * {\n    --#{$prefix}table-accent-bg: var(--#{$prefix}table-striped-bg);\n    color: var(--#{$prefix}table-striped-color);\n  }\n}\n\n// For columns\n.table-striped-columns {\n  > :not(caption) > tr > :nth-child(#{$table-striped-columns-order}) {\n    --#{$prefix}table-accent-bg: var(--#{$prefix}table-striped-bg);\n    color: var(--#{$prefix}table-striped-color);\n  }\n}\n\n// Active table\n//\n// The `.table-active` class can be added to highlight rows or cells\n\n.table-active {\n  --#{$prefix}table-accent-bg: var(--#{$prefix}table-active-bg);\n  color: var(--#{$prefix}table-active-color);\n}\n\n// Hover effect\n//\n// Placed here since it has to come after the potential zebra striping\n\n.table-hover {\n  > tbody > tr:hover > * {\n    --#{$prefix}table-accent-bg: var(--#{$prefix}table-hover-bg);\n    color: var(--#{$prefix}table-hover-color);\n  }\n}\n\n\n// Table variants\n//\n// Table variants set the table cell backgrounds, border colors\n// and the colors of the striped, hovered & active tables\n\n@each $color, $value in $table-variants {\n  @include table-variant($color, $value);\n}\n\n// Responsive tables\n//\n// Generate series of `.table-responsive-*` classes for configuring the screen\n// size of where your table will overflow.\n\n@each $breakpoint in map-keys($grid-breakpoints) {\n  $infix: breakpoint-infix($breakpoint, $grid-breakpoints);\n\n  @include media-breakpoint-down($breakpoint) {\n    .table-responsive#{$infix} {\n      overflow-x: auto;\n      -webkit-overflow-scrolling: touch;\n    }\n  }\n}\n","// scss-docs-start table-variant\n@mixin table-variant($state, $background) {\n  .table-#{$state} {\n    $color: color-contrast(opaque($body-bg, $background));\n    $hover-bg: mix($color, $background, percentage($table-hover-bg-factor));\n    $striped-bg: mix($color, $background, percentage($table-striped-bg-factor));\n    $active-bg: mix($color, $background, percentage($table-active-bg-factor));\n    $table-border-color: mix($color, $background, percentage($table-border-factor));\n\n    --#{$prefix}table-color: #{$color};\n    --#{$prefix}table-bg: #{$background};\n    --#{$prefix}table-border-color: #{$table-border-color};\n    --#{$prefix}table-striped-bg: #{$striped-bg};\n    --#{$prefix}table-striped-color: #{color-contrast($striped-bg)};\n    --#{$prefix}table-active-bg: #{$active-bg};\n    --#{$prefix}table-active-color: #{color-contrast($active-bg)};\n    --#{$prefix}table-hover-bg: #{$hover-bg};\n    --#{$prefix}table-hover-color: #{color-contrast($hover-bg)};\n\n    color: var(--#{$prefix}table-color);\n    border-color: var(--#{$prefix}table-border-color);\n  }\n}\n// scss-docs-end table-variant\n","//\n// Labels\n//\n\n.form-label {\n  margin-bottom: $form-label-margin-bottom;\n  @include font-size($form-label-font-size);\n  font-style: $form-label-font-style;\n  font-weight: $form-label-font-weight;\n  color: $form-label-color;\n}\n\n// For use with horizontal and inline forms, when you need the label (or legend)\n// text to align with the form controls.\n.col-form-label {\n  padding-top: add($input-padding-y, $input-border-width);\n  padding-bottom: add($input-padding-y, $input-border-width);\n  margin-bottom: 0; // Override the `<legend>` default\n  @include font-size(inherit); // Override the `<legend>` default\n  font-style: $form-label-font-style;\n  font-weight: $form-label-font-weight;\n  line-height: $input-line-height;\n  color: $form-label-color;\n}\n\n.col-form-label-lg {\n  padding-top: add($input-padding-y-lg, $input-border-width);\n  padding-bottom: add($input-padding-y-lg, $input-border-width);\n  @include font-size($input-font-size-lg);\n}\n\n.col-form-label-sm {\n  padding-top: add($input-padding-y-sm, $input-border-width);\n  padding-bottom: add($input-padding-y-sm, $input-border-width);\n  @include font-size($input-font-size-sm);\n}\n","//\n// Form text\n//\n\n.form-text {\n  margin-top: $form-text-margin-top;\n  @include font-size($form-text-font-size);\n  font-style: $form-text-font-style;\n  font-weight: $form-text-font-weight;\n  color: $form-text-color;\n}\n","//\n// General form controls (plus a few specific high-level interventions)\n//\n\n.form-control {\n  display: block;\n  width: 100%;\n  padding: $input-padding-y $input-padding-x;\n  font-family: $input-font-family;\n  @include font-size($input-font-size);\n  font-weight: $input-font-weight;\n  line-height: $input-line-height;\n  color: $input-color;\n  background-color: $input-bg;\n  background-clip: padding-box;\n  border: $input-border-width solid $input-border-color;\n  appearance: none; // Fix appearance for date inputs in Safari\n\n  // Note: This has no effect on <select>s in some browsers, due to the limited stylability of `<select>`s in CSS.\n  @include border-radius($input-border-radius, 0);\n\n  @include box-shadow($input-box-shadow);\n  @include transition($input-transition);\n\n  &[type=\"file\"] {\n    overflow: hidden; // prevent pseudo element button overlap\n\n    &:not(:disabled):not([readonly]) {\n      cursor: pointer;\n    }\n  }\n\n  // Customize the `:focus` state to imitate native WebKit styles.\n  &:focus {\n    color: $input-focus-color;\n    background-color: $input-focus-bg;\n    border-color: $input-focus-border-color;\n    outline: 0;\n    @if $enable-shadows {\n      @include box-shadow($input-box-shadow, $input-focus-box-shadow);\n    } @else {\n      // Avoid using mixin so we can pass custom focus shadow properly\n      box-shadow: $input-focus-box-shadow;\n    }\n  }\n\n  // Add some height to date inputs on iOS\n  // https://github.com/twbs/bootstrap/issues/23307\n  // TODO: we can remove this workaround once https://bugs.webkit.org/show_bug.cgi?id=198959 is resolved\n  &::-webkit-date-and-time-value {\n    // Multiply line-height by 1em if it has no unit\n    height: if(unit($input-line-height) == \"\", $input-line-height * 1em, $input-line-height);\n  }\n\n  // Placeholder\n  &::placeholder {\n    color: $input-placeholder-color;\n    // Override Firefox's unusual default opacity; see https://github.com/twbs/bootstrap/pull/11526.\n    opacity: 1;\n  }\n\n  // Disabled inputs\n  //\n  // HTML5 says that controls under a fieldset > legend:first-child won't be\n  // disabled if the fieldset is disabled. Due to implementation difficulty, we\n  // don't honor that edge case; we style them as disabled anyway.\n  &:disabled {\n    color: $input-disabled-color;\n    background-color: $input-disabled-bg;\n    border-color: $input-disabled-border-color;\n    // iOS fix for unreadable disabled content; see https://github.com/twbs/bootstrap/issues/11655.\n    opacity: 1;\n  }\n\n  // File input buttons theming\n  &::file-selector-button {\n    padding: $input-padding-y $input-padding-x;\n    margin: (-$input-padding-y) (-$input-padding-x);\n    margin-inline-end: $input-padding-x;\n    color: $form-file-button-color;\n    @include gradient-bg($form-file-button-bg);\n    pointer-events: none;\n    border-color: inherit;\n    border-style: solid;\n    border-width: 0;\n    border-inline-end-width: $input-border-width;\n    border-radius: 0; // stylelint-disable-line property-disallowed-list\n    @include transition($btn-transition);\n  }\n\n  &:hover:not(:disabled):not([readonly])::file-selector-button {\n    background-color: $form-file-button-hover-bg;\n  }\n}\n\n// Readonly controls as plain text\n//\n// Apply class to a readonly input to make it appear like regular plain\n// text (without any border, background color, focus indicator)\n\n.form-control-plaintext {\n  display: block;\n  width: 100%;\n  padding: $input-padding-y 0;\n  margin-bottom: 0; // match inputs if this class comes on inputs with default margins\n  line-height: $input-line-height;\n  color: $input-plaintext-color;\n  background-color: transparent;\n  border: solid transparent;\n  border-width: $input-border-width 0;\n\n  &:focus {\n    outline: 0;\n  }\n\n  &.form-control-sm,\n  &.form-control-lg {\n    padding-right: 0;\n    padding-left: 0;\n  }\n}\n\n// Form control sizing\n//\n// Build on `.form-control` with modifier classes to decrease or increase the\n// height and font-size of form controls.\n//\n// Repeated in `_input_group.scss` to avoid Sass extend issues.\n\n.form-control-sm {\n  min-height: $input-height-sm;\n  padding: $input-padding-y-sm $input-padding-x-sm;\n  @include font-size($input-font-size-sm);\n  @include border-radius($input-border-radius-sm);\n\n  &::file-selector-button {\n    padding: $input-padding-y-sm $input-padding-x-sm;\n    margin: (-$input-padding-y-sm) (-$input-padding-x-sm);\n    margin-inline-end: $input-padding-x-sm;\n  }\n}\n\n.form-control-lg {\n  min-height: $input-height-lg;\n  padding: $input-padding-y-lg $input-padding-x-lg;\n  @include font-size($input-font-size-lg);\n  @include border-radius($input-border-radius-lg);\n\n  &::file-selector-button {\n    padding: $input-padding-y-lg $input-padding-x-lg;\n    margin: (-$input-padding-y-lg) (-$input-padding-x-lg);\n    margin-inline-end: $input-padding-x-lg;\n  }\n}\n\n// Make sure textareas don't shrink too much when resized\n// https://github.com/twbs/bootstrap/pull/29124\n// stylelint-disable selector-no-qualifying-type\ntextarea {\n  &.form-control {\n    min-height: $input-height;\n  }\n\n  &.form-control-sm {\n    min-height: $input-height-sm;\n  }\n\n  &.form-control-lg {\n    min-height: $input-height-lg;\n  }\n}\n// stylelint-enable selector-no-qualifying-type\n\n.form-control-color {\n  width: $form-color-width;\n  height: $input-height;\n  padding: $input-padding-y;\n\n  &:not(:disabled):not([readonly]) {\n    cursor: pointer;\n  }\n\n  &::-moz-color-swatch {\n    border: 0 !important; // stylelint-disable-line declaration-no-important\n    @include border-radius($input-border-radius);\n  }\n\n  &::-webkit-color-swatch {\n    @include border-radius($input-border-radius);\n  }\n\n  &.form-control-sm { height: $input-height-sm; }\n  &.form-control-lg { height: $input-height-lg; }\n}\n","// stylelint-disable property-disallowed-list\n@mixin transition($transition...) {\n  @if length($transition) == 0 {\n    $transition: $transition-base;\n  }\n\n  @if length($transition) > 1 {\n    @each $value in $transition {\n      @if $value == null or $value == none {\n        @warn \"The keyword 'none' or 'null' must be used as a single argument.\";\n      }\n    }\n  }\n\n  @if $enable-transitions {\n    @if nth($transition, 1) != null {\n      transition: $transition;\n    }\n\n    @if $enable-reduced-motion and nth($transition, 1) != null and nth($transition, 1) != none {\n      @media (prefers-reduced-motion: reduce) {\n        transition: none;\n      }\n    }\n  }\n}\n","// Gradients\n\n// scss-docs-start gradient-bg-mixin\n@mixin gradient-bg($color: null) {\n  background-color: $color;\n\n  @if $enable-gradients {\n    background-image: var(--#{$prefix}gradient);\n  }\n}\n// scss-docs-end gradient-bg-mixin\n\n// scss-docs-start gradient-mixins\n// Horizontal gradient, from left to right\n//\n// Creates two color stops, start and end, by specifying a color and position for each color stop.\n@mixin gradient-x($start-color: $gray-700, $end-color: $gray-800, $start-percent: 0%, $end-percent: 100%) {\n  background-image: linear-gradient(to right, $start-color $start-percent, $end-color $end-percent);\n}\n\n// Vertical gradient, from top to bottom\n//\n// Creates two color stops, start and end, by specifying a color and position for each color stop.\n@mixin gradient-y($start-color: $gray-700, $end-color: $gray-800, $start-percent: null, $end-percent: null) {\n  background-image: linear-gradient(to bottom, $start-color $start-percent, $end-color $end-percent);\n}\n\n@mixin gradient-directional($start-color: $gray-700, $end-color: $gray-800, $deg: 45deg) {\n  background-image: linear-gradient($deg, $start-color, $end-color);\n}\n\n@mixin gradient-x-three-colors($start-color: $blue, $mid-color: $purple, $color-stop: 50%, $end-color: $red) {\n  background-image: linear-gradient(to right, $start-color, $mid-color $color-stop, $end-color);\n}\n\n@mixin gradient-y-three-colors($start-color: $blue, $mid-color: $purple, $color-stop: 50%, $end-color: $red) {\n  background-image: linear-gradient($start-color, $mid-color $color-stop, $end-color);\n}\n\n@mixin gradient-radial($inner-color: $gray-700, $outer-color: $gray-800) {\n  background-image: radial-gradient(circle, $inner-color, $outer-color);\n}\n\n@mixin gradient-striped($color: rgba($white, .15), $angle: 45deg) {\n  background-image: linear-gradient($angle, $color 25%, transparent 25%, transparent 50%, $color 50%, $color 75%, transparent 75%, transparent);\n}\n// scss-docs-end gradient-mixins\n","// Select\n//\n// Replaces the browser default select with a custom one, mostly pulled from\n// https://primer.github.io/.\n\n.form-select {\n  display: block;\n  width: 100%;\n  padding: $form-select-padding-y $form-select-indicator-padding $form-select-padding-y $form-select-padding-x;\n  -moz-padding-start: subtract($form-select-padding-x, 3px); // See https://github.com/twbs/bootstrap/issues/32636\n  font-family: $form-select-font-family;\n  @include font-size($form-select-font-size);\n  font-weight: $form-select-font-weight;\n  line-height: $form-select-line-height;\n  color: $form-select-color;\n  background-color: $form-select-bg;\n  background-image: escape-svg($form-select-indicator);\n  background-repeat: no-repeat;\n  background-position: $form-select-bg-position;\n  background-size: $form-select-bg-size;\n  border: $form-select-border-width solid $form-select-border-color;\n  @include border-radius($form-select-border-radius, 0);\n  @include box-shadow($form-select-box-shadow);\n  @include transition($form-select-transition);\n  appearance: none;\n\n  &:focus {\n    border-color: $form-select-focus-border-color;\n    outline: 0;\n    @if $enable-shadows {\n      @include box-shadow($form-select-box-shadow, $form-select-focus-box-shadow);\n    } @else {\n      // Avoid using mixin so we can pass custom focus shadow properly\n      box-shadow: $form-select-focus-box-shadow;\n    }\n  }\n\n  &[multiple],\n  &[size]:not([size=\"1\"]) {\n    padding-right: $form-select-padding-x;\n    background-image: none;\n  }\n\n  &:disabled {\n    color: $form-select-disabled-color;\n    background-color: $form-select-disabled-bg;\n    border-color: $form-select-disabled-border-color;\n  }\n\n  // Remove outline from select box in FF\n  &:-moz-focusring {\n    color: transparent;\n    text-shadow: 0 0 0 $form-select-color;\n  }\n}\n\n.form-select-sm {\n  padding-top: $form-select-padding-y-sm;\n  padding-bottom: $form-select-padding-y-sm;\n  padding-left: $form-select-padding-x-sm;\n  @include font-size($form-select-font-size-sm);\n  @include border-radius($form-select-border-radius-sm);\n}\n\n.form-select-lg {\n  padding-top: $form-select-padding-y-lg;\n  padding-bottom: $form-select-padding-y-lg;\n  padding-left: $form-select-padding-x-lg;\n  @include font-size($form-select-font-size-lg);\n  @include border-radius($form-select-border-radius-lg);\n}\n","//\n// Check/radio\n//\n\n.form-check {\n  display: block;\n  min-height: $form-check-min-height;\n  padding-left: $form-check-padding-start;\n  margin-bottom: $form-check-margin-bottom;\n\n  .form-check-input {\n    float: left;\n    margin-left: $form-check-padding-start * -1;\n  }\n}\n\n.form-check-reverse {\n  padding-right: $form-check-padding-start;\n  padding-left: 0;\n  text-align: right;\n\n  .form-check-input {\n    float: right;\n    margin-right: $form-check-padding-start * -1;\n    margin-left: 0;\n  }\n}\n\n.form-check-input {\n  width: $form-check-input-width;\n  height: $form-check-input-width;\n  margin-top: ($line-height-base - $form-check-input-width) * .5; // line-height minus check height\n  vertical-align: top;\n  background-color: $form-check-input-bg;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: contain;\n  border: $form-check-input-border;\n  appearance: none;\n  print-color-adjust: exact; // Keep themed appearance for print\n  @include transition($form-check-transition);\n\n  &[type=\"checkbox\"] {\n    @include border-radius($form-check-input-border-radius);\n  }\n\n  &[type=\"radio\"] {\n    // stylelint-disable-next-line property-disallowed-list\n    border-radius: $form-check-radio-border-radius;\n  }\n\n  &:active {\n    filter: $form-check-input-active-filter;\n  }\n\n  &:focus {\n    border-color: $form-check-input-focus-border;\n    outline: 0;\n    box-shadow: $form-check-input-focus-box-shadow;\n  }\n\n  &:checked {\n    background-color: $form-check-input-checked-bg-color;\n    border-color: $form-check-input-checked-border-color;\n\n    &[type=\"checkbox\"] {\n      @if $enable-gradients {\n        background-image: escape-svg($form-check-input-checked-bg-image), var(--#{$prefix}gradient);\n      } @else {\n        background-image: escape-svg($form-check-input-checked-bg-image);\n      }\n    }\n\n    &[type=\"radio\"] {\n      @if $enable-gradients {\n        background-image: escape-svg($form-check-radio-checked-bg-image), var(--#{$prefix}gradient);\n      } @else {\n        background-image: escape-svg($form-check-radio-checked-bg-image);\n      }\n    }\n  }\n\n  &[type=\"checkbox\"]:indeterminate {\n    background-color: $form-check-input-indeterminate-bg-color;\n    border-color: $form-check-input-indeterminate-border-color;\n\n    @if $enable-gradients {\n      background-image: escape-svg($form-check-input-indeterminate-bg-image), var(--#{$prefix}gradient);\n    } @else {\n      background-image: escape-svg($form-check-input-indeterminate-bg-image);\n    }\n  }\n\n  &:disabled {\n    pointer-events: none;\n    filter: none;\n    opacity: $form-check-input-disabled-opacity;\n  }\n\n  // Use disabled attribute in addition of :disabled pseudo-class\n  // See: https://github.com/twbs/bootstrap/issues/28247\n  &[disabled],\n  &:disabled {\n    ~ .form-check-label {\n      cursor: default;\n      opacity: $form-check-label-disabled-opacity;\n    }\n  }\n}\n\n.form-check-label {\n  color: $form-check-label-color;\n  cursor: $form-check-label-cursor;\n}\n\n//\n// Switch\n//\n\n.form-switch {\n  padding-left: $form-switch-padding-start;\n\n  .form-check-input {\n    width: $form-switch-width;\n    margin-left: $form-switch-padding-start * -1;\n    background-image: escape-svg($form-switch-bg-image);\n    background-position: left center;\n    @include border-radius($form-switch-border-radius);\n    @include transition($form-switch-transition);\n\n    &:focus {\n      background-image: escape-svg($form-switch-focus-bg-image);\n    }\n\n    &:checked {\n      background-position: $form-switch-checked-bg-position;\n\n      @if $enable-gradients {\n        background-image: escape-svg($form-switch-checked-bg-image), var(--#{$prefix}gradient);\n      } @else {\n        background-image: escape-svg($form-switch-checked-bg-image);\n      }\n    }\n  }\n\n  &.form-check-reverse {\n    padding-right: $form-switch-padding-start;\n    padding-left: 0;\n\n    .form-check-input {\n      margin-right: $form-switch-padding-start * -1;\n      margin-left: 0;\n    }\n  }\n}\n\n.form-check-inline {\n  display: inline-block;\n  margin-right: $form-check-inline-margin-end;\n}\n\n.btn-check {\n  position: absolute;\n  clip: rect(0, 0, 0, 0);\n  pointer-events: none;\n\n  &[disabled],\n  &:disabled {\n    + .btn {\n      pointer-events: none;\n      filter: none;\n      opacity: $form-check-btn-check-disabled-opacity;\n    }\n  }\n}\n","// Range\n//\n// Style range inputs the same across browsers. Vendor-specific rules for pseudo\n// elements cannot be mixed. As such, there are no shared styles for focus or\n// active states on prefixed selectors.\n\n.form-range {\n  width: 100%;\n  height: add($form-range-thumb-height, $form-range-thumb-focus-box-shadow-width * 2);\n  padding: 0; // Need to reset padding\n  background-color: transparent;\n  appearance: none;\n\n  &:focus {\n    outline: 0;\n\n    // Pseudo-elements must be split across multiple rulesets to have an effect.\n    // No box-shadow() mixin for focus accessibility.\n    &::-webkit-slider-thumb { box-shadow: $form-range-thumb-focus-box-shadow; }\n    &::-moz-range-thumb     { box-shadow: $form-range-thumb-focus-box-shadow; }\n  }\n\n  &::-moz-focus-outer {\n    border: 0;\n  }\n\n  &::-webkit-slider-thumb {\n    width: $form-range-thumb-width;\n    height: $form-range-thumb-height;\n    margin-top: ($form-range-track-height - $form-range-thumb-height) * .5; // Webkit specific\n    @include gradient-bg($form-range-thumb-bg);\n    border: $form-range-thumb-border;\n    @include border-radius($form-range-thumb-border-radius);\n    @include box-shadow($form-range-thumb-box-shadow);\n    @include transition($form-range-thumb-transition);\n    appearance: none;\n\n    &:active {\n      @include gradient-bg($form-range-thumb-active-bg);\n    }\n  }\n\n  &::-webkit-slider-runnable-track {\n    width: $form-range-track-width;\n    height: $form-range-track-height;\n    color: transparent; // Why?\n    cursor: $form-range-track-cursor;\n    background-color: $form-range-track-bg;\n    border-color: transparent;\n    @include border-radius($form-range-track-border-radius);\n    @include box-shadow($form-range-track-box-shadow);\n  }\n\n  &::-moz-range-thumb {\n    width: $form-range-thumb-width;\n    height: $form-range-thumb-height;\n    @include gradient-bg($form-range-thumb-bg);\n    border: $form-range-thumb-border;\n    @include border-radius($form-range-thumb-border-radius);\n    @include box-shadow($form-range-thumb-box-shadow);\n    @include transition($form-range-thumb-transition);\n    appearance: none;\n\n    &:active {\n      @include gradient-bg($form-range-thumb-active-bg);\n    }\n  }\n\n  &::-moz-range-track {\n    width: $form-range-track-width;\n    height: $form-range-track-height;\n    color: transparent;\n    cursor: $form-range-track-cursor;\n    background-color: $form-range-track-bg;\n    border-color: transparent; // Firefox specific?\n    @include border-radius($form-range-track-border-radius);\n    @include box-shadow($form-range-track-box-shadow);\n  }\n\n  &:disabled {\n    pointer-events: none;\n\n    &::-webkit-slider-thumb {\n      background-color: $form-range-thumb-disabled-bg;\n    }\n\n    &::-moz-range-thumb {\n      background-color: $form-range-thumb-disabled-bg;\n    }\n  }\n}\n",".form-floating {\n  position: relative;\n\n  > .form-control,\n  > .form-control-plaintext,\n  > .form-select {\n    height: $form-floating-height;\n    line-height: $form-floating-line-height;\n  }\n\n  > label {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%; // allow textareas\n    padding: $form-floating-padding-y $form-floating-padding-x;\n    overflow: hidden;\n    text-align: start;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    pointer-events: none;\n    border: $input-border-width solid transparent; // Required for aligning label's text with the input as it affects inner box model\n    transform-origin: 0 0;\n    @include transition($form-floating-transition);\n  }\n\n  > .form-control,\n  > .form-control-plaintext {\n    padding: $form-floating-padding-y $form-floating-padding-x;\n\n    &::placeholder {\n      color: transparent;\n    }\n\n    &:focus,\n    &:not(:placeholder-shown) {\n      padding-top: $form-floating-input-padding-t;\n      padding-bottom: $form-floating-input-padding-b;\n    }\n    // Duplicated because `:-webkit-autofill` invalidates other selectors when grouped\n    &:-webkit-autofill {\n      padding-top: $form-floating-input-padding-t;\n      padding-bottom: $form-floating-input-padding-b;\n    }\n  }\n\n  > .form-select {\n    padding-top: $form-floating-input-padding-t;\n    padding-bottom: $form-floating-input-padding-b;\n  }\n\n  > .form-control:focus,\n  > .form-control:not(:placeholder-shown),\n  > .form-control-plaintext,\n  > .form-select {\n    ~ label {\n      opacity: $form-floating-label-opacity;\n      transform: $form-floating-label-transform;\n    }\n  }\n  // Duplicated because `:-webkit-autofill` invalidates other selectors when grouped\n  > .form-control:-webkit-autofill {\n    ~ label {\n      opacity: $form-floating-label-opacity;\n      transform: $form-floating-label-transform;\n    }\n  }\n\n  > .form-control-plaintext {\n    ~ label {\n      border-width: $input-border-width 0; // Required to properly position label text - as explained above\n    }\n  }\n}\n","//\n// Base styles\n//\n\n.input-group {\n  position: relative;\n  display: flex;\n  flex-wrap: wrap; // For form validation feedback\n  align-items: stretch;\n  width: 100%;\n\n  > .form-control,\n  > .form-select,\n  > .form-floating {\n    position: relative; // For focus state's z-index\n    flex: 1 1 auto;\n    width: 1%;\n    min-width: 0; // https://stackoverflow.com/questions/36247140/why-dont-flex-items-shrink-past-content-size\n  }\n\n  // Bring the \"active\" form control to the top of surrounding elements\n  > .form-control:focus,\n  > .form-select:focus,\n  > .form-floating:focus-within {\n    z-index: 5;\n  }\n\n  // Ensure buttons are always above inputs for more visually pleasing borders.\n  // This isn't needed for `.input-group-text` since it shares the same border-color\n  // as our inputs.\n  .btn {\n    position: relative;\n    z-index: 2;\n\n    &:focus {\n      z-index: 5;\n    }\n  }\n}\n\n\n// Textual addons\n//\n// Serves as a catch-all element for any text or radio/checkbox input you wish\n// to prepend or append to an input.\n\n.input-group-text {\n  display: flex;\n  align-items: center;\n  padding: $input-group-addon-padding-y $input-group-addon-padding-x;\n  @include font-size($input-font-size); // Match inputs\n  font-weight: $input-group-addon-font-weight;\n  line-height: $input-line-height;\n  color: $input-group-addon-color;\n  text-align: center;\n  white-space: nowrap;\n  background-color: $input-group-addon-bg;\n  border: $input-border-width solid $input-group-addon-border-color;\n  @include border-radius($input-border-radius);\n}\n\n\n// Sizing\n//\n// Remix the default form control sizing classes into new ones for easier\n// manipulation.\n\n.input-group-lg > .form-control,\n.input-group-lg > .form-select,\n.input-group-lg > .input-group-text,\n.input-group-lg > .btn {\n  padding: $input-padding-y-lg $input-padding-x-lg;\n  @include font-size($input-font-size-lg);\n  @include border-radius($input-border-radius-lg);\n}\n\n.input-group-sm > .form-control,\n.input-group-sm > .form-select,\n.input-group-sm > .input-group-text,\n.input-group-sm > .btn {\n  padding: $input-padding-y-sm $input-padding-x-sm;\n  @include font-size($input-font-size-sm);\n  @include border-radius($input-border-radius-sm);\n}\n\n.input-group-lg > .form-select,\n.input-group-sm > .form-select {\n  padding-right: $form-select-padding-x + $form-select-indicator-padding;\n}\n\n\n// Rounded corners\n//\n// These rulesets must come after the sizing ones to properly override sm and lg\n// border-radius values when extending. They're more specific than we'd like\n// with the `.input-group >` part, but without it, we cannot override the sizing.\n\n// stylelint-disable-next-line no-duplicate-selectors\n.input-group {\n  &:not(.has-validation) {\n    > :not(:last-child):not(.dropdown-toggle):not(.dropdown-menu):not(.form-floating),\n    > .dropdown-toggle:nth-last-child(n + 3),\n    > .form-floating:not(:last-child) > .form-control,\n    > .form-floating:not(:last-child) > .form-select {\n      @include border-end-radius(0);\n    }\n  }\n\n  &.has-validation {\n    > :nth-last-child(n + 3):not(.dropdown-toggle):not(.dropdown-menu):not(.form-floating),\n    > .dropdown-toggle:nth-last-child(n + 4),\n    > .form-floating:nth-last-child(n + 3) > .form-control,\n    > .form-floating:nth-last-child(n + 3) > .form-select {\n      @include border-end-radius(0);\n    }\n  }\n\n  $validation-messages: \"\";\n  @each $state in map-keys($form-validation-states) {\n    $validation-messages: $validation-messages + \":not(.\" + unquote($state) + \"-tooltip)\" + \":not(.\" + unquote($state) + \"-feedback)\";\n  }\n\n  > :not(:first-child):not(.dropdown-menu)#{$validation-messages} {\n    margin-left: -$input-border-width;\n    @include border-start-radius(0);\n  }\n\n  > .form-floating:not(:first-child) > .form-control,\n  > .form-floating:not(:first-child) > .form-select {\n    @include border-start-radius(0);\n  }\n}\n","// This mixin uses an `if()` technique to be compatible with Dart Sass\n// See https://github.com/sass/sass/issues/1873#issuecomment-152293725 for more details\n\n// scss-docs-start form-validation-mixins\n@mixin form-validation-state-selector($state) {\n  @if ($state == \"valid\" or $state == \"invalid\") {\n    .was-validated #{if(&, \"&\", \"\")}:#{$state},\n    #{if(&, \"&\", \"\")}.is-#{$state} {\n      @content;\n    }\n  } @else {\n    #{if(&, \"&\", \"\")}.is-#{$state} {\n      @content;\n    }\n  }\n}\n\n@mixin form-validation-state(\n  $state,\n  $color,\n  $icon,\n  $tooltip-color: color-contrast($color),\n  $tooltip-bg-color: rgba($color, $form-feedback-tooltip-opacity),\n  $focus-box-shadow: 0 0 $input-btn-focus-blur $input-focus-width rgba($color, $input-btn-focus-color-opacity)\n) {\n  .#{$state}-feedback {\n    display: none;\n    width: 100%;\n    margin-top: $form-feedback-margin-top;\n    @include font-size($form-feedback-font-size);\n    font-style: $form-feedback-font-style;\n    color: $color;\n  }\n\n  .#{$state}-tooltip {\n    position: absolute;\n    top: 100%;\n    z-index: 5;\n    display: none;\n    max-width: 100%; // Contain to parent when possible\n    padding: $form-feedback-tooltip-padding-y $form-feedback-tooltip-padding-x;\n    margin-top: .1rem;\n    @include font-size($form-feedback-tooltip-font-size);\n    line-height: $form-feedback-tooltip-line-height;\n    color: $tooltip-color;\n    background-color: $tooltip-bg-color;\n    @include border-radius($form-feedback-tooltip-border-radius);\n  }\n\n  @include form-validation-state-selector($state) {\n    ~ .#{$state}-feedback,\n    ~ .#{$state}-tooltip {\n      display: block;\n    }\n  }\n\n  .form-control {\n    @include form-validation-state-selector($state) {\n      border-color: $color;\n\n      @if $enable-validation-icons {\n        padding-right: $input-height-inner;\n        background-image: escape-svg($icon);\n        background-repeat: no-repeat;\n        background-position: right $input-height-inner-quarter center;\n        background-size: $input-height-inner-half $input-height-inner-half;\n      }\n\n      &:focus {\n        border-color: $color;\n        box-shadow: $focus-box-shadow;\n      }\n    }\n  }\n\n  // stylelint-disable-next-line selector-no-qualifying-type\n  textarea.form-control {\n    @include form-validation-state-selector($state) {\n      @if $enable-validation-icons {\n        padding-right: $input-height-inner;\n        background-position: top $input-height-inner-quarter right $input-height-inner-quarter;\n      }\n    }\n  }\n\n  .form-select {\n    @include form-validation-state-selector($state) {\n      border-color: $color;\n\n      @if $enable-validation-icons {\n        &:not([multiple]):not([size]),\n        &:not([multiple])[size=\"1\"] {\n          padding-right: $form-select-feedback-icon-padding-end;\n          background-image: escape-svg($form-select-indicator), escape-svg($icon);\n          background-position: $form-select-bg-position, $form-select-feedback-icon-position;\n          background-size: $form-select-bg-size, $form-select-feedback-icon-size;\n        }\n      }\n\n      &:focus {\n        border-color: $color;\n        box-shadow: $focus-box-shadow;\n      }\n    }\n  }\n\n  .form-control-color {\n    @include form-validation-state-selector($state) {\n      @if $enable-validation-icons {\n        width: add($form-color-width, $input-height-inner);\n      }\n    }\n  }\n\n  .form-check-input {\n    @include form-validation-state-selector($state) {\n      border-color: $color;\n\n      &:checked {\n        background-color: $color;\n      }\n\n      &:focus {\n        box-shadow: $focus-box-shadow;\n      }\n\n      ~ .form-check-label {\n        color: $color;\n      }\n    }\n  }\n  .form-check-inline .form-check-input {\n    ~ .#{$state}-feedback {\n      margin-left: .5em;\n    }\n  }\n\n  .input-group {\n    > .form-control:not(:focus),\n    > .form-select:not(:focus),\n    > .form-floating:not(:focus-within) {\n      @include form-validation-state-selector($state) {\n        @if $state == \"valid\" {\n          z-index: 3;\n        } @else if $state == \"invalid\" {\n          z-index: 4;\n        }\n      }\n    }\n  }\n}\n// scss-docs-end form-validation-mixins\n","//\n// Base styles\n//\n\n.btn {\n  // scss-docs-start btn-css-vars\n  --#{$prefix}btn-padding-x: #{$btn-padding-x};\n  --#{$prefix}btn-padding-y: #{$btn-padding-y};\n  --#{$prefix}btn-font-family: #{$btn-font-family};\n  @include rfs($btn-font-size, --#{$prefix}btn-font-size);\n  --#{$prefix}btn-font-weight: #{$btn-font-weight};\n  --#{$prefix}btn-line-height: #{$btn-line-height};\n  --#{$prefix}btn-color: #{$body-color};\n  --#{$prefix}btn-bg: transparent;\n  --#{$prefix}btn-border-width: #{$btn-border-width};\n  --#{$prefix}btn-border-color: transparent;\n  --#{$prefix}btn-border-radius: #{$btn-border-radius};\n  --#{$prefix}btn-hover-border-color: transparent;\n  --#{$prefix}btn-box-shadow: #{$btn-box-shadow};\n  --#{$prefix}btn-disabled-opacity: #{$btn-disabled-opacity};\n  --#{$prefix}btn-focus-box-shadow: 0 0 0 #{$btn-focus-width} rgba(var(--#{$prefix}btn-focus-shadow-rgb), .5);\n  // scss-docs-end btn-css-vars\n\n  display: inline-block;\n  padding: var(--#{$prefix}btn-padding-y) var(--#{$prefix}btn-padding-x);\n  font-family: var(--#{$prefix}btn-font-family);\n  @include font-size(var(--#{$prefix}btn-font-size));\n  font-weight: var(--#{$prefix}btn-font-weight);\n  line-height: var(--#{$prefix}btn-line-height);\n  color: var(--#{$prefix}btn-color);\n  text-align: center;\n  text-decoration: if($link-decoration == none, null, none);\n  white-space: $btn-white-space;\n  vertical-align: middle;\n  cursor: if($enable-button-pointers, pointer, null);\n  user-select: none;\n  border: var(--#{$prefix}btn-border-width) solid var(--#{$prefix}btn-border-color);\n  @include border-radius(var(--#{$prefix}btn-border-radius));\n  @include gradient-bg(var(--#{$prefix}btn-bg));\n  @include box-shadow(var(--#{$prefix}btn-box-shadow));\n  @include transition($btn-transition);\n\n  &:hover {\n    color: var(--#{$prefix}btn-hover-color);\n    text-decoration: if($link-hover-decoration == underline, none, null);\n    background-color: var(--#{$prefix}btn-hover-bg);\n    border-color: var(--#{$prefix}btn-hover-border-color);\n  }\n\n  .btn-check + &:hover {\n    // override for the checkbox/radio buttons\n    color: var(--#{$prefix}btn-color);\n    background-color: var(--#{$prefix}btn-bg);\n    border-color: var(--#{$prefix}btn-border-color);\n  }\n\n  &:focus-visible {\n    color: var(--#{$prefix}btn-hover-color);\n    @include gradient-bg(var(--#{$prefix}btn-hover-bg));\n    border-color: var(--#{$prefix}btn-hover-border-color);\n    outline: 0;\n    // Avoid using mixin so we can pass custom focus shadow properly\n    @if $enable-shadows {\n      box-shadow: var(--#{$prefix}btn-box-shadow), var(--#{$prefix}btn-focus-box-shadow);\n    } @else {\n      box-shadow: var(--#{$prefix}btn-focus-box-shadow);\n    }\n  }\n\n  .btn-check:focus-visible + & {\n    border-color: var(--#{$prefix}btn-hover-border-color);\n    outline: 0;\n    // Avoid using mixin so we can pass custom focus shadow properly\n    @if $enable-shadows {\n      box-shadow: var(--#{$prefix}btn-box-shadow), var(--#{$prefix}btn-focus-box-shadow);\n    } @else {\n      box-shadow: var(--#{$prefix}btn-focus-box-shadow);\n    }\n  }\n\n  .btn-check:checked + &,\n  :not(.btn-check) + &:active,\n  &:first-child:active,\n  &.active,\n  &.show {\n    color: var(--#{$prefix}btn-active-color);\n    background-color: var(--#{$prefix}btn-active-bg);\n    // Remove CSS gradients if they're enabled\n    background-image: if($enable-gradients, none, null);\n    border-color: var(--#{$prefix}btn-active-border-color);\n    @include box-shadow(var(--#{$prefix}btn-active-shadow));\n\n    &:focus-visible {\n      // Avoid using mixin so we can pass custom focus shadow properly\n      @if $enable-shadows {\n        box-shadow: var(--#{$prefix}btn-active-shadow), var(--#{$prefix}btn-focus-box-shadow);\n      } @else {\n        box-shadow: var(--#{$prefix}btn-focus-box-shadow);\n      }\n    }\n  }\n\n  &:disabled,\n  &.disabled,\n  fieldset:disabled & {\n    color: var(--#{$prefix}btn-disabled-color);\n    pointer-events: none;\n    background-color: var(--#{$prefix}btn-disabled-bg);\n    background-image: if($enable-gradients, none, null);\n    border-color: var(--#{$prefix}btn-disabled-border-color);\n    opacity: var(--#{$prefix}btn-disabled-opacity);\n    @include box-shadow(none);\n  }\n}\n\n\n//\n// Alternate buttons\n//\n\n// scss-docs-start btn-variant-loops\n@each $color, $value in $theme-colors {\n  .btn-#{$color} {\n    @if $color == \"light\" {\n      @include button-variant(\n        $value,\n        $value,\n        $hover-background: shade-color($value, $btn-hover-bg-shade-amount),\n        $hover-border: shade-color($value, $btn-hover-border-shade-amount),\n        $active-background: shade-color($value, $btn-active-bg-shade-amount),\n        $active-border: shade-color($value, $btn-active-border-shade-amount)\n      );\n    } @else if $color == \"dark\" {\n      @include button-variant(\n        $value,\n        $value,\n        $hover-background: tint-color($value, $btn-hover-bg-tint-amount),\n        $hover-border: tint-color($value, $btn-hover-border-tint-amount),\n        $active-background: tint-color($value, $btn-active-bg-tint-amount),\n        $active-border: tint-color($value, $btn-active-border-tint-amount)\n      );\n    } @else {\n      @include button-variant($value, $value);\n    }\n  }\n}\n\n@each $color, $value in $theme-colors {\n  .btn-outline-#{$color} {\n    @include button-outline-variant($value);\n  }\n}\n// scss-docs-end btn-variant-loops\n\n\n//\n// Link buttons\n//\n\n// Make a button look and behave like a link\n.btn-link {\n  --#{$prefix}btn-font-weight: #{$font-weight-normal};\n  --#{$prefix}btn-color: #{$btn-link-color};\n  --#{$prefix}btn-bg: transparent;\n  --#{$prefix}btn-border-color: transparent;\n  --#{$prefix}btn-hover-color: #{$btn-link-hover-color};\n  --#{$prefix}btn-hover-border-color: transparent;\n  --#{$prefix}btn-active-color: #{$btn-link-hover-color};\n  --#{$prefix}btn-active-border-color: transparent;\n  --#{$prefix}btn-disabled-color: #{$btn-link-disabled-color};\n  --#{$prefix}btn-disabled-border-color: transparent;\n  --#{$prefix}btn-box-shadow: none;\n  --#{$prefix}btn-focus-shadow-rgb: #{to-rgb(mix(color-contrast($primary), $primary, 15%))};\n\n  text-decoration: $link-decoration;\n  @if $enable-gradients {\n    background-image: none;\n  }\n\n  &:hover,\n  &:focus-visible {\n    text-decoration: $link-hover-decoration;\n  }\n\n  &:focus-visible {\n    color: var(--#{$prefix}btn-color);\n  }\n\n  &:hover {\n    color: var(--#{$prefix}btn-hover-color);\n  }\n\n  // No need for an active state here\n}\n\n\n//\n// Button Sizes\n//\n\n.btn-lg {\n  @include button-size($btn-padding-y-lg, $btn-padding-x-lg, $btn-font-size-lg, $btn-border-radius-lg);\n}\n\n.btn-sm {\n  @include button-size($btn-padding-y-sm, $btn-padding-x-sm, $btn-font-size-sm, $btn-border-radius-sm);\n}\n","// Button variants\n//\n// Easily pump out default styles, as well as :hover, :focus, :active,\n// and disabled options for all buttons\n\n// scss-docs-start btn-variant-mixin\n@mixin button-variant(\n  $background,\n  $border,\n  $color: color-contrast($background),\n  $hover-background: if($color == $color-contrast-light, shade-color($background, $btn-hover-bg-shade-amount), tint-color($background, $btn-hover-bg-tint-amount)),\n  $hover-border: if($color == $color-contrast-light, shade-color($border, $btn-hover-border-shade-amount), tint-color($border, $btn-hover-border-tint-amount)),\n  $hover-color: color-contrast($hover-background),\n  $active-background: if($color == $color-contrast-light, shade-color($background, $btn-active-bg-shade-amount), tint-color($background, $btn-active-bg-tint-amount)),\n  $active-border: if($color == $color-contrast-light, shade-color($border, $btn-active-border-shade-amount), tint-color($border, $btn-active-border-tint-amount)),\n  $active-color: color-contrast($active-background),\n  $disabled-background: $background,\n  $disabled-border: $border,\n  $disabled-color: color-contrast($disabled-background)\n) {\n  --#{$prefix}btn-color: #{$color};\n  --#{$prefix}btn-bg: #{$background};\n  --#{$prefix}btn-border-color: #{$border};\n  --#{$prefix}btn-hover-color: #{$hover-color};\n  --#{$prefix}btn-hover-bg: #{$hover-background};\n  --#{$prefix}btn-hover-border-color: #{$hover-border};\n  --#{$prefix}btn-focus-shadow-rgb: #{to-rgb(mix($color, $border, 15%))};\n  --#{$prefix}btn-active-color: #{$active-color};\n  --#{$prefix}btn-active-bg: #{$active-background};\n  --#{$prefix}btn-active-border-color: #{$active-border};\n  --#{$prefix}btn-active-shadow: #{$btn-active-box-shadow};\n  --#{$prefix}btn-disabled-color: #{$disabled-color};\n  --#{$prefix}btn-disabled-bg: #{$disabled-background};\n  --#{$prefix}btn-disabled-border-color: #{$disabled-border};\n}\n// scss-docs-end btn-variant-mixin\n\n// scss-docs-start btn-outline-variant-mixin\n@mixin button-outline-variant(\n  $color,\n  $color-hover: color-contrast($color),\n  $active-background: $color,\n  $active-border: $color,\n  $active-color: color-contrast($active-background)\n) {\n  --#{$prefix}btn-color: #{$color};\n  --#{$prefix}btn-border-color: #{$color};\n  --#{$prefix}btn-hover-color: #{$color-hover};\n  --#{$prefix}btn-hover-bg: #{$active-background};\n  --#{$prefix}btn-hover-border-color: #{$active-border};\n  --#{$prefix}btn-focus-shadow-rgb: #{to-rgb($color)};\n  --#{$prefix}btn-active-color: #{$active-color};\n  --#{$prefix}btn-active-bg: #{$active-background};\n  --#{$prefix}btn-active-border-color: #{$active-border};\n  --#{$prefix}btn-active-shadow: #{$btn-active-box-shadow};\n  --#{$prefix}btn-disabled-color: #{$color};\n  --#{$prefix}btn-disabled-bg: transparent;\n  --#{$prefix}btn-disabled-border-color: #{$color};\n  --#{$prefix}gradient: none;\n}\n// scss-docs-end btn-outline-variant-mixin\n\n// scss-docs-start btn-size-mixin\n@mixin button-size($padding-y, $padding-x, $font-size, $border-radius) {\n  --#{$prefix}btn-padding-y: #{$padding-y};\n  --#{$prefix}btn-padding-x: #{$padding-x};\n  @include rfs($font-size, --#{$prefix}btn-font-size);\n  --#{$prefix}btn-border-radius: #{$border-radius};\n}\n// scss-docs-end btn-size-mixin\n",".fade {\n  @include transition($transition-fade);\n\n  &:not(.show) {\n    opacity: 0;\n  }\n}\n\n// scss-docs-start collapse-classes\n.collapse {\n  &:not(.show) {\n    display: none;\n  }\n}\n\n.collapsing {\n  height: 0;\n  overflow: hidden;\n  @include transition($transition-collapse);\n\n  &.collapse-horizontal {\n    width: 0;\n    height: auto;\n    @include transition($transition-collapse-width);\n  }\n}\n// scss-docs-end collapse-classes\n","// The dropdown wrapper (`<div>`)\n.dropup,\n.dropend,\n.dropdown,\n.dropstart,\n.dropup-center,\n.dropdown-center {\n  position: relative;\n}\n\n.dropdown-toggle {\n  white-space: nowrap;\n\n  // Generate the caret automatically\n  @include caret();\n}\n\n// The dropdown menu\n.dropdown-menu {\n  // scss-docs-start dropdown-css-vars\n  --#{$prefix}dropdown-zindex: #{$zindex-dropdown};\n  --#{$prefix}dropdown-min-width: #{$dropdown-min-width};\n  --#{$prefix}dropdown-padding-x: #{$dropdown-padding-x};\n  --#{$prefix}dropdown-padding-y: #{$dropdown-padding-y};\n  --#{$prefix}dropdown-spacer: #{$dropdown-spacer};\n  @include rfs($dropdown-font-size, --#{$prefix}dropdown-font-size);\n  --#{$prefix}dropdown-color: #{$dropdown-color};\n  --#{$prefix}dropdown-bg: #{$dropdown-bg};\n  --#{$prefix}dropdown-border-color: #{$dropdown-border-color};\n  --#{$prefix}dropdown-border-radius: #{$dropdown-border-radius};\n  --#{$prefix}dropdown-border-width: #{$dropdown-border-width};\n  --#{$prefix}dropdown-inner-border-radius: #{$dropdown-inner-border-radius};\n  --#{$prefix}dropdown-divider-bg: #{$dropdown-divider-bg};\n  --#{$prefix}dropdown-divider-margin-y: #{$dropdown-divider-margin-y};\n  --#{$prefix}dropdown-box-shadow: #{$dropdown-box-shadow};\n  --#{$prefix}dropdown-link-color: #{$dropdown-link-color};\n  --#{$prefix}dropdown-link-hover-color: #{$dropdown-link-hover-color};\n  --#{$prefix}dropdown-link-hover-bg: #{$dropdown-link-hover-bg};\n  --#{$prefix}dropdown-link-active-color: #{$dropdown-link-active-color};\n  --#{$prefix}dropdown-link-active-bg: #{$dropdown-link-active-bg};\n  --#{$prefix}dropdown-link-disabled-color: #{$dropdown-link-disabled-color};\n  --#{$prefix}dropdown-item-padding-x: #{$dropdown-item-padding-x};\n  --#{$prefix}dropdown-item-padding-y: #{$dropdown-item-padding-y};\n  --#{$prefix}dropdown-header-color: #{$dropdown-header-color};\n  --#{$prefix}dropdown-header-padding-x: #{$dropdown-header-padding-x};\n  --#{$prefix}dropdown-header-padding-y: #{$dropdown-header-padding-y};\n  // scss-docs-end dropdown-css-vars\n\n  position: absolute;\n  z-index: var(--#{$prefix}dropdown-zindex);\n  display: none; // none by default, but block on \"open\" of the menu\n  min-width: var(--#{$prefix}dropdown-min-width);\n  padding: var(--#{$prefix}dropdown-padding-y) var(--#{$prefix}dropdown-padding-x);\n  margin: 0; // Override default margin of ul\n  @include font-size(var(--#{$prefix}dropdown-font-size));\n  color: var(--#{$prefix}dropdown-color);\n  text-align: left; // Ensures proper alignment if parent has it changed (e.g., modal footer)\n  list-style: none;\n  background-color: var(--#{$prefix}dropdown-bg);\n  background-clip: padding-box;\n  border: var(--#{$prefix}dropdown-border-width) solid var(--#{$prefix}dropdown-border-color);\n  @include border-radius(var(--#{$prefix}dropdown-border-radius));\n  @include box-shadow(var(--#{$prefix}dropdown-box-shadow));\n\n  &[data-bs-popper] {\n    top: 100%;\n    left: 0;\n    margin-top: var(--#{$prefix}dropdown-spacer);\n  }\n\n  @if $dropdown-padding-y == 0 {\n    > .dropdown-item:first-child,\n    > li:first-child .dropdown-item {\n      @include border-top-radius(var(--#{$prefix}dropdown-inner-border-radius));\n    }\n    > .dropdown-item:last-child,\n    > li:last-child .dropdown-item {\n      @include border-bottom-radius(var(--#{$prefix}dropdown-inner-border-radius));\n    }\n\n  }\n}\n\n// scss-docs-start responsive-breakpoints\n// We deliberately hardcode the `bs-` prefix because we check\n// this custom property in JS to determine Popper's positioning\n\n@each $breakpoint in map-keys($grid-breakpoints) {\n  @include media-breakpoint-up($breakpoint) {\n    $infix: breakpoint-infix($breakpoint, $grid-breakpoints);\n\n    .dropdown-menu#{$infix}-start {\n      --bs-position: start;\n\n      &[data-bs-popper] {\n        right: auto;\n        left: 0;\n      }\n    }\n\n    .dropdown-menu#{$infix}-end {\n      --bs-position: end;\n\n      &[data-bs-popper] {\n        right: 0;\n        left: auto;\n      }\n    }\n  }\n}\n// scss-docs-end responsive-breakpoints\n\n// Allow for dropdowns to go bottom up (aka, dropup-menu)\n// Just add .dropup after the standard .dropdown class and you're set.\n.dropup {\n  .dropdown-menu[data-bs-popper] {\n    top: auto;\n    bottom: 100%;\n    margin-top: 0;\n    margin-bottom: var(--#{$prefix}dropdown-spacer);\n  }\n\n  .dropdown-toggle {\n    @include caret(up);\n  }\n}\n\n.dropend {\n  .dropdown-menu[data-bs-popper] {\n    top: 0;\n    right: auto;\n    left: 100%;\n    margin-top: 0;\n    margin-left: var(--#{$prefix}dropdown-spacer);\n  }\n\n  .dropdown-toggle {\n    @include caret(end);\n    &::after {\n      vertical-align: 0;\n    }\n  }\n}\n\n.dropstart {\n  .dropdown-menu[data-bs-popper] {\n    top: 0;\n    right: 100%;\n    left: auto;\n    margin-top: 0;\n    margin-right: var(--#{$prefix}dropdown-spacer);\n  }\n\n  .dropdown-toggle {\n    @include caret(start);\n    &::before {\n      vertical-align: 0;\n    }\n  }\n}\n\n\n// Dividers (basically an `<hr>`) within the dropdown\n.dropdown-divider {\n  height: 0;\n  margin: var(--#{$prefix}dropdown-divider-margin-y) 0;\n  overflow: hidden;\n  border-top: 1px solid var(--#{$prefix}dropdown-divider-bg);\n  opacity: 1; // Revisit in v6 to de-dupe styles that conflict with <hr> element\n}\n\n// Links, buttons, and more within the dropdown menu\n//\n// `<button>`-specific styles are denoted with `// For <button>s`\n.dropdown-item {\n  display: block;\n  width: 100%; // For `<button>`s\n  padding: var(--#{$prefix}dropdown-item-padding-y) var(--#{$prefix}dropdown-item-padding-x);\n  clear: both;\n  font-weight: $font-weight-normal;\n  color: var(--#{$prefix}dropdown-link-color);\n  text-align: inherit; // For `<button>`s\n  text-decoration: if($link-decoration == none, null, none);\n  white-space: nowrap; // prevent links from randomly breaking onto new lines\n  background-color: transparent; // For `<button>`s\n  border: 0; // For `<button>`s\n\n  &:hover,\n  &:focus {\n    color: var(--#{$prefix}dropdown-link-hover-color);\n    text-decoration: if($link-hover-decoration == underline, none, null);\n    @include gradient-bg(var(--#{$prefix}dropdown-link-hover-bg));\n  }\n\n  &.active,\n  &:active {\n    color: var(--#{$prefix}dropdown-link-active-color);\n    text-decoration: none;\n    @include gradient-bg(var(--#{$prefix}dropdown-link-active-bg));\n  }\n\n  &.disabled,\n  &:disabled {\n    color: var(--#{$prefix}dropdown-link-disabled-color);\n    pointer-events: none;\n    background-color: transparent;\n    // Remove CSS gradients if they're enabled\n    background-image: if($enable-gradients, none, null);\n  }\n}\n\n.dropdown-menu.show {\n  display: block;\n}\n\n// Dropdown section headers\n.dropdown-header {\n  display: block;\n  padding: var(--#{$prefix}dropdown-header-padding-y) var(--#{$prefix}dropdown-header-padding-x);\n  margin-bottom: 0; // for use with heading elements\n  @include font-size($font-size-sm);\n  color: var(--#{$prefix}dropdown-header-color);\n  white-space: nowrap; // as with > li > a\n}\n\n// Dropdown text\n.dropdown-item-text {\n  display: block;\n  padding: var(--#{$prefix}dropdown-item-padding-y) var(--#{$prefix}dropdown-item-padding-x);\n  color: var(--#{$prefix}dropdown-link-color);\n}\n\n// Dark dropdowns\n.dropdown-menu-dark {\n  // scss-docs-start dropdown-dark-css-vars\n  --#{$prefix}dropdown-color: #{$dropdown-dark-color};\n  --#{$prefix}dropdown-bg: #{$dropdown-dark-bg};\n  --#{$prefix}dropdown-border-color: #{$dropdown-dark-border-color};\n  --#{$prefix}dropdown-box-shadow: #{$dropdown-dark-box-shadow};\n  --#{$prefix}dropdown-link-color: #{$dropdown-dark-link-color};\n  --#{$prefix}dropdown-link-hover-color: #{$dropdown-dark-link-hover-color};\n  --#{$prefix}dropdown-divider-bg: #{$dropdown-dark-divider-bg};\n  --#{$prefix}dropdown-link-hover-bg: #{$dropdown-dark-link-hover-bg};\n  --#{$prefix}dropdown-link-active-color: #{$dropdown-dark-link-active-color};\n  --#{$prefix}dropdown-link-active-bg: #{$dropdown-dark-link-active-bg};\n  --#{$prefix}dropdown-link-disabled-color: #{$dropdown-dark-link-disabled-color};\n  --#{$prefix}dropdown-header-color: #{$dropdown-dark-header-color};\n  // scss-docs-end dropdown-dark-css-vars\n}\n","// scss-docs-start caret-mixins\n@mixin caret-down {\n  border-top: $caret-width solid;\n  border-right: $caret-width solid transparent;\n  border-bottom: 0;\n  border-left: $caret-width solid transparent;\n}\n\n@mixin caret-up {\n  border-top: 0;\n  border-right: $caret-width solid transparent;\n  border-bottom: $caret-width solid;\n  border-left: $caret-width solid transparent;\n}\n\n@mixin caret-end {\n  border-top: $caret-width solid transparent;\n  border-right: 0;\n  border-bottom: $caret-width solid transparent;\n  border-left: $caret-width solid;\n}\n\n@mixin caret-start {\n  border-top: $caret-width solid transparent;\n  border-right: $caret-width solid;\n  border-bottom: $caret-width solid transparent;\n}\n\n@mixin caret($direction: down) {\n  @if $enable-caret {\n    &::after {\n      display: inline-block;\n      margin-left: $caret-spacing;\n      vertical-align: $caret-vertical-align;\n      content: \"\";\n      @if $direction == down {\n        @include caret-down();\n      } @else if $direction == up {\n        @include caret-up();\n      } @else if $direction == end {\n        @include caret-end();\n      }\n    }\n\n    @if $direction == start {\n      &::after {\n        display: none;\n      }\n\n      &::before {\n        display: inline-block;\n        margin-right: $caret-spacing;\n        vertical-align: $caret-vertical-align;\n        content: \"\";\n        @include caret-start();\n      }\n    }\n\n    &:empty::after {\n      margin-left: 0;\n    }\n  }\n}\n// scss-docs-end caret-mixins\n","// Make the div behave like a button\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-flex;\n  vertical-align: middle; // match .btn alignment given font-size hack above\n\n  > .btn {\n    position: relative;\n    flex: 1 1 auto;\n  }\n\n  // Bring the hover, focused, and \"active\" buttons to the front to overlay\n  // the borders properly\n  > .btn-check:checked + .btn,\n  > .btn-check:focus + .btn,\n  > .btn:hover,\n  > .btn:focus,\n  > .btn:active,\n  > .btn.active {\n    z-index: 1;\n  }\n}\n\n// Optional: Group multiple button groups together for a toolbar\n.btn-toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n\n  .input-group {\n    width: auto;\n  }\n}\n\n.btn-group {\n  @include border-radius($btn-border-radius);\n\n  // Prevent double borders when buttons are next to each other\n  > :not(.btn-check:first-child) + .btn,\n  > .btn-group:not(:first-child) {\n    margin-left: -$btn-border-width;\n  }\n\n  // Reset rounded corners\n  > .btn:not(:last-child):not(.dropdown-toggle),\n  > .btn.dropdown-toggle-split:first-child,\n  > .btn-group:not(:last-child) > .btn {\n    @include border-end-radius(0);\n  }\n\n  // The left radius should be 0 if the button is:\n  // - the \"third or more\" child\n  // - the second child and the previous element isn't `.btn-check` (making it the first child visually)\n  // - part of a btn-group which isn't the first child\n  > .btn:nth-child(n + 3),\n  > :not(.btn-check) + .btn,\n  > .btn-group:not(:first-child) > .btn {\n    @include border-start-radius(0);\n  }\n}\n\n// Sizing\n//\n// Remix the default button sizing classes into new ones for easier manipulation.\n\n.btn-group-sm > .btn { @extend .btn-sm; }\n.btn-group-lg > .btn { @extend .btn-lg; }\n\n\n//\n// Split button dropdowns\n//\n\n.dropdown-toggle-split {\n  padding-right: $btn-padding-x * .75;\n  padding-left: $btn-padding-x * .75;\n\n  &::after,\n  .dropup &::after,\n  .dropend &::after {\n    margin-left: 0;\n  }\n\n  .dropstart &::before {\n    margin-right: 0;\n  }\n}\n\n.btn-sm + .dropdown-toggle-split {\n  padding-right: $btn-padding-x-sm * .75;\n  padding-left: $btn-padding-x-sm * .75;\n}\n\n.btn-lg + .dropdown-toggle-split {\n  padding-right: $btn-padding-x-lg * .75;\n  padding-left: $btn-padding-x-lg * .75;\n}\n\n\n// The clickable button for toggling the menu\n// Set the same inset shadow as the :active state\n.btn-group.show .dropdown-toggle {\n  @include box-shadow($btn-active-box-shadow);\n\n  // Show no shadow for `.btn-link` since it has no other button styles.\n  &.btn-link {\n    @include box-shadow(none);\n  }\n}\n\n\n//\n// Vertical button groups\n//\n\n.btn-group-vertical {\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n\n  > .btn,\n  > .btn-group {\n    width: 100%;\n  }\n\n  > .btn:not(:first-child),\n  > .btn-group:not(:first-child) {\n    margin-top: -$btn-border-width;\n  }\n\n  // Reset rounded corners\n  > .btn:not(:last-child):not(.dropdown-toggle),\n  > .btn-group:not(:last-child) > .btn {\n    @include border-bottom-radius(0);\n  }\n\n  > .btn ~ .btn,\n  > .btn-group:not(:first-child) > .btn {\n    @include border-top-radius(0);\n  }\n}\n","// Base class\n//\n// Kickstart any navigation component with a set of style resets. Works with\n// `<nav>`s, `<ul>`s or `<ol>`s.\n\n.nav {\n  // scss-docs-start nav-css-vars\n  --#{$prefix}nav-link-padding-x: #{$nav-link-padding-x};\n  --#{$prefix}nav-link-padding-y: #{$nav-link-padding-y};\n  @include rfs($nav-link-font-size, --#{$prefix}nav-link-font-size);\n  --#{$prefix}nav-link-font-weight: #{$nav-link-font-weight};\n  --#{$prefix}nav-link-color: #{$nav-link-color};\n  --#{$prefix}nav-link-hover-color: #{$nav-link-hover-color};\n  --#{$prefix}nav-link-disabled-color: #{$nav-link-disabled-color};\n  // scss-docs-end nav-css-vars\n\n  display: flex;\n  flex-wrap: wrap;\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none;\n}\n\n.nav-link {\n  display: block;\n  padding: var(--#{$prefix}nav-link-padding-y) var(--#{$prefix}nav-link-padding-x);\n  @include font-size(var(--#{$prefix}nav-link-font-size));\n  font-weight: var(--#{$prefix}nav-link-font-weight);\n  color: var(--#{$prefix}nav-link-color);\n  text-decoration: if($link-decoration == none, null, none);\n  @include transition($nav-link-transition);\n\n  &:hover,\n  &:focus {\n    color: var(--#{$prefix}nav-link-hover-color);\n    text-decoration: if($link-hover-decoration == underline, none, null);\n  }\n\n  // Disabled state lightens text\n  &.disabled {\n    color: var(--#{$prefix}nav-link-disabled-color);\n    pointer-events: none;\n    cursor: default;\n  }\n}\n\n//\n// Tabs\n//\n\n.nav-tabs {\n  // scss-docs-start nav-tabs-css-vars\n  --#{$prefix}nav-tabs-border-width: #{$nav-tabs-border-width};\n  --#{$prefix}nav-tabs-border-color: #{$nav-tabs-border-color};\n  --#{$prefix}nav-tabs-border-radius: #{$nav-tabs-border-radius};\n  --#{$prefix}nav-tabs-link-hover-border-color: #{$nav-tabs-link-hover-border-color};\n  --#{$prefix}nav-tabs-link-active-color: #{$nav-tabs-link-active-color};\n  --#{$prefix}nav-tabs-link-active-bg: #{$nav-tabs-link-active-bg};\n  --#{$prefix}nav-tabs-link-active-border-color: #{$nav-tabs-link-active-border-color};\n  // scss-docs-end nav-tabs-css-vars\n\n  border-bottom: var(--#{$prefix}nav-tabs-border-width) solid var(--#{$prefix}nav-tabs-border-color);\n\n  .nav-link {\n    margin-bottom: calc(-1 * var(--#{$prefix}nav-tabs-border-width)); // stylelint-disable-line function-disallowed-list\n    background: none;\n    border: var(--#{$prefix}nav-tabs-border-width) solid transparent;\n    @include border-top-radius(var(--#{$prefix}nav-tabs-border-radius));\n\n    &:hover,\n    &:focus {\n      // Prevents active .nav-link tab overlapping focus outline of previous/next .nav-link\n      isolation: isolate;\n      border-color: var(--#{$prefix}nav-tabs-link-hover-border-color);\n    }\n\n    &.disabled,\n    &:disabled {\n      color: var(--#{$prefix}nav-link-disabled-color);\n      background-color: transparent;\n      border-color: transparent;\n    }\n  }\n\n  .nav-link.active,\n  .nav-item.show .nav-link {\n    color: var(--#{$prefix}nav-tabs-link-active-color);\n    background-color: var(--#{$prefix}nav-tabs-link-active-bg);\n    border-color: var(--#{$prefix}nav-tabs-link-active-border-color);\n  }\n\n  .dropdown-menu {\n    // Make dropdown border overlap tab border\n    margin-top: calc(-1 * var(--#{$prefix}nav-tabs-border-width)); // stylelint-disable-line function-disallowed-list\n    // Remove the top rounded corners here since there is a hard edge above the menu\n    @include border-top-radius(0);\n  }\n}\n\n\n//\n// Pills\n//\n\n.nav-pills {\n  // scss-docs-start nav-pills-css-vars\n  --#{$prefix}nav-pills-border-radius: #{$nav-pills-border-radius};\n  --#{$prefix}nav-pills-link-active-color: #{$nav-pills-link-active-color};\n  --#{$prefix}nav-pills-link-active-bg: #{$nav-pills-link-active-bg};\n  // scss-docs-end nav-pills-css-vars\n\n  .nav-link {\n    background: none;\n    border: 0;\n    @include border-radius(var(--#{$prefix}nav-pills-border-radius));\n\n    &:disabled {\n      color: var(--#{$prefix}nav-link-disabled-color);\n      background-color: transparent;\n      border-color: transparent;\n    }\n  }\n\n  .nav-link.active,\n  .show > .nav-link {\n    color: var(--#{$prefix}nav-pills-link-active-color);\n    @include gradient-bg(var(--#{$prefix}nav-pills-link-active-bg));\n  }\n}\n\n\n//\n// Justified variants\n//\n\n.nav-fill {\n  > .nav-link,\n  .nav-item {\n    flex: 1 1 auto;\n    text-align: center;\n  }\n}\n\n.nav-justified {\n  > .nav-link,\n  .nav-item {\n    flex-basis: 0;\n    flex-grow: 1;\n    text-align: center;\n  }\n}\n\n.nav-fill,\n.nav-justified {\n  .nav-item .nav-link {\n    width: 100%; // Make sure button will grow\n  }\n}\n\n\n// Tabbable tabs\n//\n// Hide tabbable panes to start, show them when `.active`\n\n.tab-content {\n  > .tab-pane {\n    display: none;\n  }\n  > .active {\n    display: block;\n  }\n}\n","// Navbar\n//\n// Provide a static navbar from which we expand to create full-width, fixed, and\n// other navbar variations.\n\n.navbar {\n  // scss-docs-start navbar-css-vars\n  --#{$prefix}navbar-padding-x: #{if($navbar-padding-x == null, 0, $navbar-padding-x)};\n  --#{$prefix}navbar-padding-y: #{$navbar-padding-y};\n  --#{$prefix}navbar-color: #{$navbar-light-color};\n  --#{$prefix}navbar-hover-color: #{$navbar-light-hover-color};\n  --#{$prefix}navbar-disabled-color: #{$navbar-light-disabled-color};\n  --#{$prefix}navbar-active-color: #{$navbar-light-active-color};\n  --#{$prefix}navbar-brand-padding-y: #{$navbar-brand-padding-y};\n  --#{$prefix}navbar-brand-margin-end: #{$navbar-brand-margin-end};\n  --#{$prefix}navbar-brand-font-size: #{$navbar-brand-font-size};\n  --#{$prefix}navbar-brand-color: #{$navbar-light-brand-color};\n  --#{$prefix}navbar-brand-hover-color: #{$navbar-light-brand-hover-color};\n  --#{$prefix}navbar-nav-link-padding-x: #{$navbar-nav-link-padding-x};\n  --#{$prefix}navbar-toggler-padding-y: #{$navbar-toggler-padding-y};\n  --#{$prefix}navbar-toggler-padding-x: #{$navbar-toggler-padding-x};\n  --#{$prefix}navbar-toggler-font-size: #{$navbar-toggler-font-size};\n  --#{$prefix}navbar-toggler-icon-bg: #{escape-svg($navbar-light-toggler-icon-bg)};\n  --#{$prefix}navbar-toggler-border-color: #{$navbar-light-toggler-border-color};\n  --#{$prefix}navbar-toggler-border-radius: #{$navbar-toggler-border-radius};\n  --#{$prefix}navbar-toggler-focus-width: #{$navbar-toggler-focus-width};\n  --#{$prefix}navbar-toggler-transition: #{$navbar-toggler-transition};\n  // scss-docs-end navbar-css-vars\n\n  position: relative;\n  display: flex;\n  flex-wrap: wrap; // allow us to do the line break for collapsing content\n  align-items: center;\n  justify-content: space-between; // space out brand from logo\n  padding: var(--#{$prefix}navbar-padding-y) var(--#{$prefix}navbar-padding-x);\n  @include gradient-bg();\n\n  // Because flex properties aren't inherited, we need to redeclare these first\n  // few properties so that content nested within behave properly.\n  // The `flex-wrap` property is inherited to simplify the expanded navbars\n  %container-flex-properties {\n    display: flex;\n    flex-wrap: inherit;\n    align-items: center;\n    justify-content: space-between;\n  }\n\n  > .container,\n  > .container-fluid {\n    @extend %container-flex-properties;\n  }\n\n  @each $breakpoint, $container-max-width in $container-max-widths {\n    > .container#{breakpoint-infix($breakpoint, $container-max-widths)} {\n      @extend %container-flex-properties;\n    }\n  }\n}\n\n\n// Navbar brand\n//\n// Used for brand, project, or site names.\n\n.navbar-brand {\n  padding-top: var(--#{$prefix}navbar-brand-padding-y);\n  padding-bottom: var(--#{$prefix}navbar-brand-padding-y);\n  margin-right: var(--#{$prefix}navbar-brand-margin-end);\n  @include font-size(var(--#{$prefix}navbar-brand-font-size));\n  color: var(--#{$prefix}navbar-brand-color);\n  text-decoration: if($link-decoration == none, null, none);\n  white-space: nowrap;\n\n  &:hover,\n  &:focus {\n    color: var(--#{$prefix}navbar-brand-hover-color);\n    text-decoration: if($link-hover-decoration == underline, none, null);\n  }\n}\n\n\n// Navbar nav\n//\n// Custom navbar navigation (doesn't require `.nav`, but does make use of `.nav-link`).\n\n.navbar-nav {\n  // scss-docs-start navbar-nav-css-vars\n  --#{$prefix}nav-link-padding-x: 0;\n  --#{$prefix}nav-link-padding-y: #{$nav-link-padding-y};\n  @include rfs($nav-link-font-size, --#{$prefix}nav-link-font-size);\n  --#{$prefix}nav-link-font-weight: #{$nav-link-font-weight};\n  --#{$prefix}nav-link-color: var(--#{$prefix}navbar-color);\n  --#{$prefix}nav-link-hover-color: var(--#{$prefix}navbar-hover-color);\n  --#{$prefix}nav-link-disabled-color: var(--#{$prefix}navbar-disabled-color);\n  // scss-docs-end navbar-nav-css-vars\n\n  display: flex;\n  flex-direction: column; // cannot use `inherit` to get the `.navbar`s value\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none;\n\n  .show > .nav-link,\n  .nav-link.active {\n    color: var(--#{$prefix}navbar-active-color);\n  }\n\n  .dropdown-menu {\n    position: static;\n  }\n}\n\n\n// Navbar text\n//\n//\n\n.navbar-text {\n  padding-top: $nav-link-padding-y;\n  padding-bottom: $nav-link-padding-y;\n  color: var(--#{$prefix}navbar-color);\n\n  a,\n  a:hover,\n  a:focus  {\n    color: var(--#{$prefix}navbar-active-color);\n  }\n}\n\n\n// Responsive navbar\n//\n// Custom styles for responsive collapsing and toggling of navbar contents.\n// Powered by the collapse Bootstrap JavaScript plugin.\n\n// When collapsed, prevent the toggleable navbar contents from appearing in\n// the default flexbox row orientation. Requires the use of `flex-wrap: wrap`\n// on the `.navbar` parent.\n.navbar-collapse {\n  flex-basis: 100%;\n  flex-grow: 1;\n  // For always expanded or extra full navbars, ensure content aligns itself\n  // properly vertically. Can be easily overridden with flex utilities.\n  align-items: center;\n}\n\n// Button for toggling the navbar when in its collapsed state\n.navbar-toggler {\n  padding: var(--#{$prefix}navbar-toggler-padding-y) var(--#{$prefix}navbar-toggler-padding-x);\n  @include font-size(var(--#{$prefix}navbar-toggler-font-size));\n  line-height: 1;\n  color: var(--#{$prefix}navbar-color);\n  background-color: transparent; // remove default button style\n  border: var(--#{$prefix}border-width) solid var(--#{$prefix}navbar-toggler-border-color); // remove default button style\n  @include border-radius(var(--#{$prefix}navbar-toggler-border-radius));\n  @include transition(var(--#{$prefix}navbar-toggler-transition));\n\n  &:hover {\n    text-decoration: none;\n  }\n\n  &:focus {\n    text-decoration: none;\n    outline: 0;\n    box-shadow: 0 0 0 var(--#{$prefix}navbar-toggler-focus-width);\n  }\n}\n\n// Keep as a separate element so folks can easily override it with another icon\n// or image file as needed.\n.navbar-toggler-icon {\n  display: inline-block;\n  width: 1.5em;\n  height: 1.5em;\n  vertical-align: middle;\n  background-image: var(--#{$prefix}navbar-toggler-icon-bg);\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 100%;\n}\n\n.navbar-nav-scroll {\n  max-height: var(--#{$prefix}scroll-height, 75vh);\n  overflow-y: auto;\n}\n\n// scss-docs-start navbar-expand-loop\n// Generate series of `.navbar-expand-*` responsive classes for configuring\n// where your navbar collapses.\n.navbar-expand {\n  @each $breakpoint in map-keys($grid-breakpoints) {\n    $next: breakpoint-next($breakpoint, $grid-breakpoints);\n    $infix: breakpoint-infix($next, $grid-breakpoints);\n\n    // stylelint-disable-next-line scss/selector-no-union-class-name\n    &#{$infix} {\n      @include media-breakpoint-up($next) {\n        flex-wrap: nowrap;\n        justify-content: flex-start;\n\n        .navbar-nav {\n          flex-direction: row;\n\n          .dropdown-menu {\n            position: absolute;\n          }\n\n          .nav-link {\n            padding-right: var(--#{$prefix}navbar-nav-link-padding-x);\n            padding-left: var(--#{$prefix}navbar-nav-link-padding-x);\n          }\n        }\n\n        .navbar-nav-scroll {\n          overflow: visible;\n        }\n\n        .navbar-collapse {\n          display: flex !important; // stylelint-disable-line declaration-no-important\n          flex-basis: auto;\n        }\n\n        .navbar-toggler {\n          display: none;\n        }\n\n        .offcanvas {\n          // stylelint-disable declaration-no-important\n          position: static;\n          z-index: auto;\n          flex-grow: 1;\n          width: auto !important;\n          height: auto !important;\n          visibility: visible !important;\n          background-color: transparent !important;\n          border: 0 !important;\n          transform: none !important;\n          @include box-shadow(none);\n          @include transition(none);\n          // stylelint-enable declaration-no-important\n\n          .offcanvas-header {\n            display: none;\n          }\n\n          .offcanvas-body {\n            display: flex;\n            flex-grow: 0;\n            padding: 0;\n            overflow-y: visible;\n          }\n        }\n      }\n    }\n  }\n}\n// scss-docs-end navbar-expand-loop\n\n// Navbar themes\n//\n// Styles for switching between navbars with light or dark background.\n\n.navbar-light {\n  @include deprecate(\"`.navbar-light`\", \"v5.2.0\", \"v6.0.0\", true);\n}\n\n.navbar-dark {\n  // scss-docs-start navbar-dark-css-vars\n  --#{$prefix}navbar-color: #{$navbar-dark-color};\n  --#{$prefix}navbar-hover-color: #{$navbar-dark-hover-color};\n  --#{$prefix}navbar-disabled-color: #{$navbar-dark-disabled-color};\n  --#{$prefix}navbar-active-color: #{$navbar-dark-active-color};\n  --#{$prefix}navbar-brand-color: #{$navbar-dark-brand-color};\n  --#{$prefix}navbar-brand-hover-color: #{$navbar-dark-brand-hover-color};\n  --#{$prefix}navbar-toggler-border-color: #{$navbar-dark-toggler-border-color};\n  --#{$prefix}navbar-toggler-icon-bg: #{escape-svg($navbar-dark-toggler-icon-bg)};\n  // scss-docs-end navbar-dark-css-vars\n}\n","//\n// Base styles\n//\n\n.card {\n  // scss-docs-start card-css-vars\n  --#{$prefix}card-spacer-y: #{$card-spacer-y};\n  --#{$prefix}card-spacer-x: #{$card-spacer-x};\n  --#{$prefix}card-title-spacer-y: #{$card-title-spacer-y};\n  --#{$prefix}card-border-width: #{$card-border-width};\n  --#{$prefix}card-border-color: #{$card-border-color};\n  --#{$prefix}card-border-radius: #{$card-border-radius};\n  --#{$prefix}card-box-shadow: #{$card-box-shadow};\n  --#{$prefix}card-inner-border-radius: #{$card-inner-border-radius};\n  --#{$prefix}card-cap-padding-y: #{$card-cap-padding-y};\n  --#{$prefix}card-cap-padding-x: #{$card-cap-padding-x};\n  --#{$prefix}card-cap-bg: #{$card-cap-bg};\n  --#{$prefix}card-cap-color: #{$card-cap-color};\n  --#{$prefix}card-height: #{$card-height};\n  --#{$prefix}card-color: #{$card-color};\n  --#{$prefix}card-bg: #{$card-bg};\n  --#{$prefix}card-img-overlay-padding: #{$card-img-overlay-padding};\n  --#{$prefix}card-group-margin: #{$card-group-margin};\n  // scss-docs-end card-css-vars\n\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  min-width: 0; // See https://github.com/twbs/bootstrap/pull/22740#issuecomment-305868106\n  height: var(--#{$prefix}card-height);\n  word-wrap: break-word;\n  background-color: var(--#{$prefix}card-bg);\n  background-clip: border-box;\n  border: var(--#{$prefix}card-border-width) solid var(--#{$prefix}card-border-color);\n  @include border-radius(var(--#{$prefix}card-border-radius));\n  @include box-shadow(var(--#{$prefix}card-box-shadow));\n\n  > hr {\n    margin-right: 0;\n    margin-left: 0;\n  }\n\n  > .list-group {\n    border-top: inherit;\n    border-bottom: inherit;\n\n    &:first-child {\n      border-top-width: 0;\n      @include border-top-radius(var(--#{$prefix}card-inner-border-radius));\n    }\n\n    &:last-child  {\n      border-bottom-width: 0;\n      @include border-bottom-radius(var(--#{$prefix}card-inner-border-radius));\n    }\n  }\n\n  // Due to specificity of the above selector (`.card > .list-group`), we must\n  // use a child selector here to prevent double borders.\n  > .card-header + .list-group,\n  > .list-group + .card-footer {\n    border-top: 0;\n  }\n}\n\n.card-body {\n  // Enable `flex-grow: 1` for decks and groups so that card blocks take up\n  // as much space as possible, ensuring footers are aligned to the bottom.\n  flex: 1 1 auto;\n  padding: var(--#{$prefix}card-spacer-y) var(--#{$prefix}card-spacer-x);\n  color: var(--#{$prefix}card-color);\n}\n\n.card-title {\n  margin-bottom: var(--#{$prefix}card-title-spacer-y);\n}\n\n.card-subtitle {\n  margin-top: calc(-.5 * var(--#{$prefix}card-title-spacer-y)); // stylelint-disable-line function-disallowed-list\n  margin-bottom: 0;\n}\n\n.card-text:last-child {\n  margin-bottom: 0;\n}\n\n.card-link {\n  &:hover {\n    text-decoration: if($link-hover-decoration == underline, none, null);\n  }\n\n  + .card-link {\n    margin-left: var(--#{$prefix}card-spacer-x);\n  }\n}\n\n//\n// Optional textual caps\n//\n\n.card-header {\n  padding: var(--#{$prefix}card-cap-padding-y) var(--#{$prefix}card-cap-padding-x);\n  margin-bottom: 0; // Removes the default margin-bottom of <hN>\n  color: var(--#{$prefix}card-cap-color);\n  background-color: var(--#{$prefix}card-cap-bg);\n  border-bottom: var(--#{$prefix}card-border-width) solid var(--#{$prefix}card-border-color);\n\n  &:first-child {\n    @include border-radius(var(--#{$prefix}card-inner-border-radius) var(--#{$prefix}card-inner-border-radius) 0 0);\n  }\n}\n\n.card-footer {\n  padding: var(--#{$prefix}card-cap-padding-y) var(--#{$prefix}card-cap-padding-x);\n  color: var(--#{$prefix}card-cap-color);\n  background-color: var(--#{$prefix}card-cap-bg);\n  border-top: var(--#{$prefix}card-border-width) solid var(--#{$prefix}card-border-color);\n\n  &:last-child {\n    @include border-radius(0 0 var(--#{$prefix}card-inner-border-radius) var(--#{$prefix}card-inner-border-radius));\n  }\n}\n\n\n//\n// Header navs\n//\n\n.card-header-tabs {\n  margin-right: calc(-.5 * var(--#{$prefix}card-cap-padding-x)); // stylelint-disable-line function-disallowed-list\n  margin-bottom: calc(-1 * var(--#{$prefix}card-cap-padding-y)); // stylelint-disable-line function-disallowed-list\n  margin-left: calc(-.5 * var(--#{$prefix}card-cap-padding-x)); // stylelint-disable-line function-disallowed-list\n  border-bottom: 0;\n\n  .nav-link.active {\n    background-color: var(--#{$prefix}card-bg);\n    border-bottom-color: var(--#{$prefix}card-bg);\n  }\n}\n\n.card-header-pills {\n  margin-right: calc(-.5 * var(--#{$prefix}card-cap-padding-x)); // stylelint-disable-line function-disallowed-list\n  margin-left: calc(-.5 * var(--#{$prefix}card-cap-padding-x)); // stylelint-disable-line function-disallowed-list\n}\n\n// Card image\n.card-img-overlay {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  padding: var(--#{$prefix}card-img-overlay-padding);\n  @include border-radius(var(--#{$prefix}card-inner-border-radius));\n}\n\n.card-img,\n.card-img-top,\n.card-img-bottom {\n  width: 100%; // Required because we use flexbox and this inherently applies align-self: stretch\n}\n\n.card-img,\n.card-img-top {\n  @include border-top-radius(var(--#{$prefix}card-inner-border-radius));\n}\n\n.card-img,\n.card-img-bottom {\n  @include border-bottom-radius(var(--#{$prefix}card-inner-border-radius));\n}\n\n\n//\n// Card groups\n//\n\n.card-group {\n  // The child selector allows nested `.card` within `.card-group`\n  // to display properly.\n  > .card {\n    margin-bottom: var(--#{$prefix}card-group-margin);\n  }\n\n  @include media-breakpoint-up(sm) {\n    display: flex;\n    flex-flow: row wrap;\n    // The child selector allows nested `.card` within `.card-group`\n    // to display properly.\n    > .card {\n      // Flexbugs #4: https://github.com/philipwalton/flexbugs#flexbug-4\n      flex: 1 0 0%;\n      margin-bottom: 0;\n\n      + .card {\n        margin-left: 0;\n        border-left: 0;\n      }\n\n      // Handle rounded corners\n      @if $enable-rounded {\n        &:not(:last-child) {\n          @include border-end-radius(0);\n\n          .card-img-top,\n          .card-header {\n            // stylelint-disable-next-line property-disallowed-list\n            border-top-right-radius: 0;\n          }\n          .card-img-bottom,\n          .card-footer {\n            // stylelint-disable-next-line property-disallowed-list\n            border-bottom-right-radius: 0;\n          }\n        }\n\n        &:not(:first-child) {\n          @include border-start-radius(0);\n\n          .card-img-top,\n          .card-header {\n            // stylelint-disable-next-line property-disallowed-list\n            border-top-left-radius: 0;\n          }\n          .card-img-bottom,\n          .card-footer {\n            // stylelint-disable-next-line property-disallowed-list\n            border-bottom-left-radius: 0;\n          }\n        }\n      }\n    }\n  }\n}\n","//\n// Base styles\n//\n\n.accordion {\n  // scss-docs-start accordion-css-vars\n  --#{$prefix}accordion-color: #{$accordion-color};\n  --#{$prefix}accordion-bg: #{$accordion-bg};\n  --#{$prefix}accordion-transition: #{$accordion-transition};\n  --#{$prefix}accordion-border-color: #{$accordion-border-color};\n  --#{$prefix}accordion-border-width: #{$accordion-border-width};\n  --#{$prefix}accordion-border-radius: #{$accordion-border-radius};\n  --#{$prefix}accordion-inner-border-radius: #{$accordion-inner-border-radius};\n  --#{$prefix}accordion-btn-padding-x: #{$accordion-button-padding-x};\n  --#{$prefix}accordion-btn-padding-y: #{$accordion-button-padding-y};\n  --#{$prefix}accordion-btn-color: #{$accordion-button-color};\n  --#{$prefix}accordion-btn-bg: #{$accordion-button-bg};\n  --#{$prefix}accordion-btn-icon: #{escape-svg($accordion-button-icon)};\n  --#{$prefix}accordion-btn-icon-width: #{$accordion-icon-width};\n  --#{$prefix}accordion-btn-icon-transform: #{$accordion-icon-transform};\n  --#{$prefix}accordion-btn-icon-transition: #{$accordion-icon-transition};\n  --#{$prefix}accordion-btn-active-icon: #{escape-svg($accordion-button-active-icon)};\n  --#{$prefix}accordion-btn-focus-border-color: #{$accordion-button-focus-border-color};\n  --#{$prefix}accordion-btn-focus-box-shadow: #{$accordion-button-focus-box-shadow};\n  --#{$prefix}accordion-body-padding-x: #{$accordion-body-padding-x};\n  --#{$prefix}accordion-body-padding-y: #{$accordion-body-padding-y};\n  --#{$prefix}accordion-active-color: #{$accordion-button-active-color};\n  --#{$prefix}accordion-active-bg: #{$accordion-button-active-bg};\n  // scss-docs-end accordion-css-vars\n}\n\n.accordion-button {\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n  padding: var(--#{$prefix}accordion-btn-padding-y) var(--#{$prefix}accordion-btn-padding-x);\n  @include font-size($font-size-base);\n  color: var(--#{$prefix}accordion-btn-color);\n  text-align: left; // Reset button style\n  background-color: var(--#{$prefix}accordion-btn-bg);\n  border: 0;\n  @include border-radius(0);\n  overflow-anchor: none;\n  @include transition(var(--#{$prefix}accordion-transition));\n\n  &:not(.collapsed) {\n    color: var(--#{$prefix}accordion-active-color);\n    background-color: var(--#{$prefix}accordion-active-bg);\n    box-shadow: inset 0 calc(-1 * var(--#{$prefix}accordion-border-width)) 0 var(--#{$prefix}accordion-border-color); // stylelint-disable-line function-disallowed-list\n\n    &::after {\n      background-image: var(--#{$prefix}accordion-btn-active-icon);\n      transform: var(--#{$prefix}accordion-btn-icon-transform);\n    }\n  }\n\n  // Accordion icon\n  &::after {\n    flex-shrink: 0;\n    width: var(--#{$prefix}accordion-btn-icon-width);\n    height: var(--#{$prefix}accordion-btn-icon-width);\n    margin-left: auto;\n    content: \"\";\n    background-image: var(--#{$prefix}accordion-btn-icon);\n    background-repeat: no-repeat;\n    background-size: var(--#{$prefix}accordion-btn-icon-width);\n    @include transition(var(--#{$prefix}accordion-btn-icon-transition));\n  }\n\n  &:hover {\n    z-index: 2;\n  }\n\n  &:focus {\n    z-index: 3;\n    border-color: var(--#{$prefix}accordion-btn-focus-border-color);\n    outline: 0;\n    box-shadow: var(--#{$prefix}accordion-btn-focus-box-shadow);\n  }\n}\n\n.accordion-header {\n  margin-bottom: 0;\n}\n\n.accordion-item {\n  color: var(--#{$prefix}accordion-color);\n  background-color: var(--#{$prefix}accordion-bg);\n  border: var(--#{$prefix}accordion-border-width) solid var(--#{$prefix}accordion-border-color);\n\n  &:first-of-type {\n    @include border-top-radius(var(--#{$prefix}accordion-border-radius));\n\n    .accordion-button {\n      @include border-top-radius(var(--#{$prefix}accordion-inner-border-radius));\n    }\n  }\n\n  &:not(:first-of-type) {\n    border-top: 0;\n  }\n\n  // Only set a border-radius on the last item if the accordion is collapsed\n  &:last-of-type {\n    @include border-bottom-radius(var(--#{$prefix}accordion-border-radius));\n\n    .accordion-button {\n      &.collapsed {\n        @include border-bottom-radius(var(--#{$prefix}accordion-inner-border-radius));\n      }\n    }\n\n    .accordion-collapse {\n      @include border-bottom-radius(var(--#{$prefix}accordion-border-radius));\n    }\n  }\n}\n\n.accordion-body {\n  padding: var(--#{$prefix}accordion-body-padding-y) var(--#{$prefix}accordion-body-padding-x);\n}\n\n\n// Flush accordion items\n//\n// Remove borders and border-radius to keep accordion items edge-to-edge.\n\n.accordion-flush {\n  .accordion-collapse {\n    border-width: 0;\n  }\n\n  .accordion-item {\n    border-right: 0;\n    border-left: 0;\n    @include border-radius(0);\n\n    &:first-child { border-top: 0; }\n    &:last-child { border-bottom: 0; }\n\n    .accordion-button {\n      &,\n      &.collapsed {\n        @include border-radius(0);\n      }\n    }\n  }\n}\n",".breadcrumb {\n  // scss-docs-start breadcrumb-css-vars\n  --#{$prefix}breadcrumb-padding-x: #{$breadcrumb-padding-x};\n  --#{$prefix}breadcrumb-padding-y: #{$breadcrumb-padding-y};\n  --#{$prefix}breadcrumb-margin-bottom: #{$breadcrumb-margin-bottom};\n  @include rfs($breadcrumb-font-size, --#{$prefix}breadcrumb-font-size);\n  --#{$prefix}breadcrumb-bg: #{$breadcrumb-bg};\n  --#{$prefix}breadcrumb-border-radius: #{$breadcrumb-border-radius};\n  --#{$prefix}breadcrumb-divider-color: #{$breadcrumb-divider-color};\n  --#{$prefix}breadcrumb-item-padding-x: #{$breadcrumb-item-padding-x};\n  --#{$prefix}breadcrumb-item-active-color: #{$breadcrumb-active-color};\n  // scss-docs-end breadcrumb-css-vars\n\n  display: flex;\n  flex-wrap: wrap;\n  padding: var(--#{$prefix}breadcrumb-padding-y) var(--#{$prefix}breadcrumb-padding-x);\n  margin-bottom: var(--#{$prefix}breadcrumb-margin-bottom);\n  @include font-size(var(--#{$prefix}breadcrumb-font-size));\n  list-style: none;\n  background-color: var(--#{$prefix}breadcrumb-bg);\n  @include border-radius(var(--#{$prefix}breadcrumb-border-radius));\n}\n\n.breadcrumb-item {\n  // The separator between breadcrumbs (by default, a forward-slash: \"/\")\n  + .breadcrumb-item {\n    padding-left: var(--#{$prefix}breadcrumb-item-padding-x);\n\n    &::before {\n      float: left; // Suppress inline spacings and underlining of the separator\n      padding-right: var(--#{$prefix}breadcrumb-item-padding-x);\n      color: var(--#{$prefix}breadcrumb-divider-color);\n      content: var(--#{$prefix}breadcrumb-divider, escape-svg($breadcrumb-divider)) #{\"/* rtl:\"} var(--#{$prefix}breadcrumb-divider, escape-svg($breadcrumb-divider-flipped)) #{\"*/\"};\n    }\n  }\n\n  &.active {\n    color: var(--#{$prefix}breadcrumb-item-active-color);\n  }\n}\n",".pagination {\n  // scss-docs-start pagination-css-vars\n  --#{$prefix}pagination-padding-x: #{$pagination-padding-x};\n  --#{$prefix}pagination-padding-y: #{$pagination-padding-y};\n  @include rfs($pagination-font-size, --#{$prefix}pagination-font-size);\n  --#{$prefix}pagination-color: #{$pagination-color};\n  --#{$prefix}pagination-bg: #{$pagination-bg};\n  --#{$prefix}pagination-border-width: #{$pagination-border-width};\n  --#{$prefix}pagination-border-color: #{$pagination-border-color};\n  --#{$prefix}pagination-border-radius: #{$pagination-border-radius};\n  --#{$prefix}pagination-hover-color: #{$pagination-hover-color};\n  --#{$prefix}pagination-hover-bg: #{$pagination-hover-bg};\n  --#{$prefix}pagination-hover-border-color: #{$pagination-hover-border-color};\n  --#{$prefix}pagination-focus-color: #{$pagination-focus-color};\n  --#{$prefix}pagination-focus-bg: #{$pagination-focus-bg};\n  --#{$prefix}pagination-focus-box-shadow: #{$pagination-focus-box-shadow};\n  --#{$prefix}pagination-active-color: #{$pagination-active-color};\n  --#{$prefix}pagination-active-bg: #{$pagination-active-bg};\n  --#{$prefix}pagination-active-border-color: #{$pagination-active-border-color};\n  --#{$prefix}pagination-disabled-color: #{$pagination-disabled-color};\n  --#{$prefix}pagination-disabled-bg: #{$pagination-disabled-bg};\n  --#{$prefix}pagination-disabled-border-color: #{$pagination-disabled-border-color};\n  // scss-docs-end pagination-css-vars\n\n  display: flex;\n  @include list-unstyled();\n}\n\n.page-link {\n  position: relative;\n  display: block;\n  padding: var(--#{$prefix}pagination-padding-y) var(--#{$prefix}pagination-padding-x);\n  @include font-size(var(--#{$prefix}pagination-font-size));\n  color: var(--#{$prefix}pagination-color);\n  text-decoration: if($link-decoration == none, null, none);\n  background-color: var(--#{$prefix}pagination-bg);\n  border: var(--#{$prefix}pagination-border-width) solid var(--#{$prefix}pagination-border-color);\n  @include transition($pagination-transition);\n\n  &:hover {\n    z-index: 2;\n    color: var(--#{$prefix}pagination-hover-color);\n    text-decoration: if($link-hover-decoration == underline, none, null);\n    background-color: var(--#{$prefix}pagination-hover-bg);\n    border-color: var(--#{$prefix}pagination-hover-border-color);\n  }\n\n  &:focus {\n    z-index: 3;\n    color: var(--#{$prefix}pagination-focus-color);\n    background-color: var(--#{$prefix}pagination-focus-bg);\n    outline: $pagination-focus-outline;\n    box-shadow: var(--#{$prefix}pagination-focus-box-shadow);\n  }\n\n  &.active,\n  .active > & {\n    z-index: 3;\n    color: var(--#{$prefix}pagination-active-color);\n    @include gradient-bg(var(--#{$prefix}pagination-active-bg));\n    border-color: var(--#{$prefix}pagination-active-border-color);\n  }\n\n  &.disabled,\n  .disabled > & {\n    color: var(--#{$prefix}pagination-disabled-color);\n    pointer-events: none;\n    background-color: var(--#{$prefix}pagination-disabled-bg);\n    border-color: var(--#{$prefix}pagination-disabled-border-color);\n  }\n}\n\n.page-item {\n  &:not(:first-child) .page-link {\n    margin-left: $pagination-margin-start;\n  }\n\n  @if $pagination-margin-start == ($pagination-border-width * -1) {\n    &:first-child {\n      .page-link {\n        @include border-start-radius(var(--#{$prefix}pagination-border-radius));\n      }\n    }\n\n    &:last-child {\n      .page-link {\n        @include border-end-radius(var(--#{$prefix}pagination-border-radius));\n      }\n    }\n  } @else {\n    // Add border-radius to all pageLinks in case they have left margin\n    .page-link {\n      @include border-radius(var(--#{$prefix}pagination-border-radius));\n    }\n  }\n}\n\n\n//\n// Sizing\n//\n\n.pagination-lg {\n  @include pagination-size($pagination-padding-y-lg, $pagination-padding-x-lg, $font-size-lg, $pagination-border-radius-lg);\n}\n\n.pagination-sm {\n  @include pagination-size($pagination-padding-y-sm, $pagination-padding-x-sm, $font-size-sm, $pagination-border-radius-sm);\n}\n","// Pagination\n\n// scss-docs-start pagination-mixin\n@mixin pagination-size($padding-y, $padding-x, $font-size, $border-radius) {\n  --#{$prefix}pagination-padding-x: #{$padding-x};\n  --#{$prefix}pagination-padding-y: #{$padding-y};\n  @include rfs($font-size, --#{$prefix}pagination-font-size);\n  --#{$prefix}pagination-border-radius: #{$border-radius};\n}\n// scss-docs-end pagination-mixin\n","// Base class\n//\n// Requires one of the contextual, color modifier classes for `color` and\n// `background-color`.\n\n.badge {\n  // scss-docs-start badge-css-vars\n  --#{$prefix}badge-padding-x: #{$badge-padding-x};\n  --#{$prefix}badge-padding-y: #{$badge-padding-y};\n  @include rfs($badge-font-size, --#{$prefix}badge-font-size);\n  --#{$prefix}badge-font-weight: #{$badge-font-weight};\n  --#{$prefix}badge-color: #{$badge-color};\n  --#{$prefix}badge-border-radius: #{$badge-border-radius};\n  // scss-docs-end badge-css-vars\n\n  display: inline-block;\n  padding: var(--#{$prefix}badge-padding-y) var(--#{$prefix}badge-padding-x);\n  @include font-size(var(--#{$prefix}badge-font-size));\n  font-weight: var(--#{$prefix}badge-font-weight);\n  line-height: 1;\n  color: var(--#{$prefix}badge-color);\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  @include border-radius(var(--#{$prefix}badge-border-radius));\n  @include gradient-bg();\n\n  // Empty badges collapse automatically\n  &:empty {\n    display: none;\n  }\n}\n\n// Quick fix for badges in buttons\n.btn .badge {\n  position: relative;\n  top: -1px;\n}\n","//\n// Base styles\n//\n\n.alert {\n  // scss-docs-start alert-css-vars\n  --#{$prefix}alert-bg: transparent;\n  --#{$prefix}alert-padding-x: #{$alert-padding-x};\n  --#{$prefix}alert-padding-y: #{$alert-padding-y};\n  --#{$prefix}alert-margin-bottom: #{$alert-margin-bottom};\n  --#{$prefix}alert-color: inherit;\n  --#{$prefix}alert-border-color: transparent;\n  --#{$prefix}alert-border: #{$alert-border-width} solid var(--#{$prefix}alert-border-color);\n  --#{$prefix}alert-border-radius: #{$alert-border-radius};\n  // scss-docs-end alert-css-vars\n\n  position: relative;\n  padding: var(--#{$prefix}alert-padding-y) var(--#{$prefix}alert-padding-x);\n  margin-bottom: var(--#{$prefix}alert-margin-bottom);\n  color: var(--#{$prefix}alert-color);\n  background-color: var(--#{$prefix}alert-bg);\n  border: var(--#{$prefix}alert-border);\n  @include border-radius(var(--#{$prefix}alert-border-radius));\n}\n\n// Headings for larger alerts\n.alert-heading {\n  // Specified to prevent conflicts of changing $headings-color\n  color: inherit;\n}\n\n// Provide class for links that match alerts\n.alert-link {\n  font-weight: $alert-link-font-weight;\n}\n\n\n// Dismissible alerts\n//\n// Expand the right padding and account for the close button's positioning.\n\n.alert-dismissible {\n  padding-right: $alert-dismissible-padding-r;\n\n  // Adjust close link position\n  .btn-close {\n    position: absolute;\n    top: 0;\n    right: 0;\n    z-index: $stretched-link-z-index + 1;\n    padding: $alert-padding-y * 1.25 $alert-padding-x;\n  }\n}\n\n\n// scss-docs-start alert-modifiers\n// Generate contextual modifier classes for colorizing the alert.\n\n@each $state, $value in $theme-colors {\n  $alert-background: shift-color($value, $alert-bg-scale);\n  $alert-border: shift-color($value, $alert-border-scale);\n  $alert-color: shift-color($value, $alert-color-scale);\n\n  @if (contrast-ratio($alert-background, $alert-color) < $min-contrast-ratio) {\n    $alert-color: mix($value, color-contrast($alert-background), abs($alert-color-scale));\n  }\n  .alert-#{$state} {\n    @include alert-variant($alert-background, $alert-border, $alert-color);\n  }\n}\n// scss-docs-end alert-modifiers\n","// scss-docs-start alert-variant-mixin\n@mixin alert-variant($background, $border, $color) {\n  --#{$prefix}alert-color: #{$color};\n  --#{$prefix}alert-bg: #{$background};\n  --#{$prefix}alert-border-color: #{$border};\n\n  @if $enable-gradients {\n    background-image: var(--#{$prefix}gradient);\n  }\n\n  .alert-link {\n    color: shade-color($color, 20%);\n  }\n}\n// scss-docs-end alert-variant-mixin\n","// Disable animation if transitions are disabled\n\n// scss-docs-start progress-keyframes\n@if $enable-transitions {\n  @keyframes progress-bar-stripes {\n    0% { background-position-x: $progress-height; }\n  }\n}\n// scss-docs-end progress-keyframes\n\n.progress {\n  // scss-docs-start progress-css-vars\n  --#{$prefix}progress-height: #{$progress-height};\n  @include rfs($progress-font-size, --#{$prefix}progress-font-size);\n  --#{$prefix}progress-bg: #{$progress-bg};\n  --#{$prefix}progress-border-radius: #{$progress-border-radius};\n  --#{$prefix}progress-box-shadow: #{$progress-box-shadow};\n  --#{$prefix}progress-bar-color: #{$progress-bar-color};\n  --#{$prefix}progress-bar-bg: #{$progress-bar-bg};\n  --#{$prefix}progress-bar-transition: #{$progress-bar-transition};\n  // scss-docs-end progress-css-vars\n\n  display: flex;\n  height: var(--#{$prefix}progress-height);\n  overflow: hidden; // force rounded corners by cropping it\n  @include font-size(var(--#{$prefix}progress-font-size));\n  background-color: var(--#{$prefix}progress-bg);\n  @include border-radius(var(--#{$prefix}progress-border-radius));\n  @include box-shadow(var(--#{$prefix}progress-box-shadow));\n}\n\n.progress-bar {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  overflow: hidden;\n  color: var(--#{$prefix}progress-bar-color);\n  text-align: center;\n  white-space: nowrap;\n  background-color: var(--#{$prefix}progress-bar-bg);\n  @include transition(var(--#{$prefix}progress-bar-transition));\n}\n\n.progress-bar-striped {\n  @include gradient-striped();\n  background-size: var(--#{$prefix}progress-height) var(--#{$prefix}progress-height);\n}\n\n@if $enable-transitions {\n  .progress-bar-animated {\n    animation: $progress-bar-animation-timing progress-bar-stripes;\n\n    @if $enable-reduced-motion {\n      @media (prefers-reduced-motion: reduce) {\n        animation: none;\n      }\n    }\n  }\n}\n","// Base class\n//\n// Easily usable on <ul>, <ol>, or <div>.\n\n.list-group {\n  // scss-docs-start list-group-css-vars\n  --#{$prefix}list-group-color: #{$list-group-color};\n  --#{$prefix}list-group-bg: #{$list-group-bg};\n  --#{$prefix}list-group-border-color: #{$list-group-border-color};\n  --#{$prefix}list-group-border-width: #{$list-group-border-width};\n  --#{$prefix}list-group-border-radius: #{$list-group-border-radius};\n  --#{$prefix}list-group-item-padding-x: #{$list-group-item-padding-x};\n  --#{$prefix}list-group-item-padding-y: #{$list-group-item-padding-y};\n  --#{$prefix}list-group-action-color: #{$list-group-action-color};\n  --#{$prefix}list-group-action-hover-color: #{$list-group-action-hover-color};\n  --#{$prefix}list-group-action-hover-bg: #{$list-group-hover-bg};\n  --#{$prefix}list-group-action-active-color: #{$list-group-action-active-color};\n  --#{$prefix}list-group-action-active-bg: #{$list-group-action-active-bg};\n  --#{$prefix}list-group-disabled-color: #{$list-group-disabled-color};\n  --#{$prefix}list-group-disabled-bg: #{$list-group-disabled-bg};\n  --#{$prefix}list-group-active-color: #{$list-group-active-color};\n  --#{$prefix}list-group-active-bg: #{$list-group-active-bg};\n  --#{$prefix}list-group-active-border-color: #{$list-group-active-border-color};\n  // scss-docs-end list-group-css-vars\n\n  display: flex;\n  flex-direction: column;\n\n  // No need to set list-style: none; since .list-group-item is block level\n  padding-left: 0; // reset padding because ul and ol\n  margin-bottom: 0;\n  @include border-radius(var(--#{$prefix}list-group-border-radius));\n}\n\n.list-group-numbered {\n  list-style-type: none;\n  counter-reset: section;\n\n  > .list-group-item::before {\n    // Increments only this instance of the section counter\n    content: counters(section, \".\") \". \";\n    counter-increment: section;\n  }\n}\n\n// Interactive list items\n//\n// Use anchor or button elements instead of `li`s or `div`s to create interactive\n// list items. Includes an extra `.active` modifier class for selected items.\n\n.list-group-item-action {\n  width: 100%; // For `<button>`s (anchors become 100% by default though)\n  color: var(--#{$prefix}list-group-action-color);\n  text-align: inherit; // For `<button>`s (anchors inherit)\n\n  // Hover state\n  &:hover,\n  &:focus {\n    z-index: 1; // Place hover/focus items above their siblings for proper border styling\n    color: var(--#{$prefix}list-group-action-hover-color);\n    text-decoration: none;\n    background-color: var(--#{$prefix}list-group-action-hover-bg);\n  }\n\n  &:active {\n    color: var(--#{$prefix}list-group-action-active-color);\n    background-color: var(--#{$prefix}list-group-action-active-bg);\n  }\n}\n\n// Individual list items\n//\n// Use on `li`s or `div`s within the `.list-group` parent.\n\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: var(--#{$prefix}list-group-item-padding-y) var(--#{$prefix}list-group-item-padding-x);\n  color: var(--#{$prefix}list-group-color);\n  text-decoration: if($link-decoration == none, null, none);\n  background-color: var(--#{$prefix}list-group-bg);\n  border: var(--#{$prefix}list-group-border-width) solid var(--#{$prefix}list-group-border-color);\n\n  &:first-child {\n    @include border-top-radius(inherit);\n  }\n\n  &:last-child {\n    @include border-bottom-radius(inherit);\n  }\n\n  &.disabled,\n  &:disabled {\n    color: var(--#{$prefix}list-group-disabled-color);\n    pointer-events: none;\n    background-color: var(--#{$prefix}list-group-disabled-bg);\n  }\n\n  // Include both here for `<a>`s and `<button>`s\n  &.active {\n    z-index: 2; // Place active items above their siblings for proper border styling\n    color: var(--#{$prefix}list-group-active-color);\n    background-color: var(--#{$prefix}list-group-active-bg);\n    border-color: var(--#{$prefix}list-group-active-border-color);\n  }\n\n  // stylelint-disable-next-line scss/selector-no-redundant-nesting-selector\n  & + .list-group-item {\n    border-top-width: 0;\n\n    &.active {\n      margin-top: calc(-1 * var(--#{$prefix}list-group-border-width)); // stylelint-disable-line function-disallowed-list\n      border-top-width: var(--#{$prefix}list-group-border-width);\n    }\n  }\n}\n\n// Horizontal\n//\n// Change the layout of list group items from vertical (default) to horizontal.\n\n@each $breakpoint in map-keys($grid-breakpoints) {\n  @include media-breakpoint-up($breakpoint) {\n    $infix: breakpoint-infix($breakpoint, $grid-breakpoints);\n\n    .list-group-horizontal#{$infix} {\n      flex-direction: row;\n\n      > .list-group-item {\n        &:first-child:not(:last-child) {\n          @include border-bottom-start-radius(var(--#{$prefix}list-group-border-radius));\n          @include border-top-end-radius(0);\n        }\n\n        &:last-child:not(:first-child) {\n          @include border-top-end-radius(var(--#{$prefix}list-group-border-radius));\n          @include border-bottom-start-radius(0);\n        }\n\n        &.active {\n          margin-top: 0;\n        }\n\n        + .list-group-item {\n          border-top-width: var(--#{$prefix}list-group-border-width);\n          border-left-width: 0;\n\n          &.active {\n            margin-left: calc(-1 * var(--#{$prefix}list-group-border-width)); // stylelint-disable-line function-disallowed-list\n            border-left-width: var(--#{$prefix}list-group-border-width);\n          }\n        }\n      }\n    }\n  }\n}\n\n\n// Flush list items\n//\n// Remove borders and border-radius to keep list group items edge-to-edge. Most\n// useful within other components (e.g., cards).\n\n.list-group-flush {\n  @include border-radius(0);\n\n  > .list-group-item {\n    border-width: 0 0 var(--#{$prefix}list-group-border-width);\n\n    &:last-child {\n      border-bottom-width: 0;\n    }\n  }\n}\n\n\n// scss-docs-start list-group-modifiers\n// List group contextual variants\n//\n// Add modifier classes to change text and background color on individual items.\n// Organizationally, this must come after the `:hover` states.\n\n@each $state, $value in $theme-colors {\n  $list-group-variant-bg: shift-color($value, $list-group-item-bg-scale);\n  $list-group-variant-color: shift-color($value, $list-group-item-color-scale);\n  @if (contrast-ratio($list-group-variant-bg, $list-group-variant-color) < $min-contrast-ratio) {\n    $list-group-variant-color: mix($value, color-contrast($list-group-variant-bg), abs($list-group-item-color-scale));\n  }\n\n  @include list-group-item-variant($state, $list-group-variant-bg, $list-group-variant-color);\n}\n// scss-docs-end list-group-modifiers\n","// List Groups\n\n// scss-docs-start list-group-mixin\n@mixin list-group-item-variant($state, $background, $color) {\n  .list-group-item-#{$state} {\n    color: $color;\n    background-color: $background;\n\n    &.list-group-item-action {\n      &:hover,\n      &:focus {\n        color: $color;\n        background-color: shade-color($background, 10%);\n      }\n\n      &.active {\n        color: $white;\n        background-color: $color;\n        border-color: $color;\n      }\n    }\n  }\n}\n// scss-docs-end list-group-mixin\n","// Transparent background and border properties included for button version.\n// iOS requires the button element instead of an anchor tag.\n// If you want the anchor version, it requires `href=\"#\"`.\n// See https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile\n\n.btn-close {\n  box-sizing: content-box;\n  width: $btn-close-width;\n  height: $btn-close-height;\n  padding: $btn-close-padding-y $btn-close-padding-x;\n  color: $btn-close-color;\n  background: transparent escape-svg($btn-close-bg) center / $btn-close-width auto no-repeat; // include transparent for button elements\n  border: 0; // for button elements\n  @include border-radius();\n  opacity: $btn-close-opacity;\n\n  // Override <a>'s hover style\n  &:hover {\n    color: $btn-close-color;\n    text-decoration: none;\n    opacity: $btn-close-hover-opacity;\n  }\n\n  &:focus {\n    outline: 0;\n    box-shadow: $btn-close-focus-shadow;\n    opacity: $btn-close-focus-opacity;\n  }\n\n  &:disabled,\n  &.disabled {\n    pointer-events: none;\n    user-select: none;\n    opacity: $btn-close-disabled-opacity;\n  }\n}\n\n.btn-close-white {\n  filter: $btn-close-white-filter;\n}\n",".toast {\n  // scss-docs-start toast-css-vars\n  --#{$prefix}toast-zindex: #{$zindex-toast};\n  --#{$prefix}toast-padding-x: #{$toast-padding-x};\n  --#{$prefix}toast-padding-y: #{$toast-padding-y};\n  --#{$prefix}toast-spacing: #{$toast-spacing};\n  --#{$prefix}toast-max-width: #{$toast-max-width};\n  @include rfs($toast-font-size, --#{$prefix}toast-font-size);\n  --#{$prefix}toast-color: #{$toast-color};\n  --#{$prefix}toast-bg: #{$toast-background-color};\n  --#{$prefix}toast-border-width: #{$toast-border-width};\n  --#{$prefix}toast-border-color: #{$toast-border-color};\n  --#{$prefix}toast-border-radius: #{$toast-border-radius};\n  --#{$prefix}toast-box-shadow: #{$toast-box-shadow};\n  --#{$prefix}toast-header-color: #{$toast-header-color};\n  --#{$prefix}toast-header-bg: #{$toast-header-background-color};\n  --#{$prefix}toast-header-border-color: #{$toast-header-border-color};\n  // scss-docs-end toast-css-vars\n\n  width: var(--#{$prefix}toast-max-width);\n  max-width: 100%;\n  @include font-size(var(--#{$prefix}toast-font-size));\n  color: var(--#{$prefix}toast-color);\n  pointer-events: auto;\n  background-color: var(--#{$prefix}toast-bg);\n  background-clip: padding-box;\n  border: var(--#{$prefix}toast-border-width) solid var(--#{$prefix}toast-border-color);\n  box-shadow: var(--#{$prefix}toast-box-shadow);\n  @include border-radius(var(--#{$prefix}toast-border-radius));\n\n  &.showing {\n    opacity: 0;\n  }\n\n  &:not(.show) {\n    display: none;\n  }\n}\n\n.toast-container {\n  --#{$prefix}toast-zindex: #{$zindex-toast};\n\n  position: absolute;\n  z-index: var(--#{$prefix}toast-zindex);\n  width: max-content;\n  max-width: 100%;\n  pointer-events: none;\n\n  > :not(:last-child) {\n    margin-bottom: var(--#{$prefix}toast-spacing);\n  }\n}\n\n.toast-header {\n  display: flex;\n  align-items: center;\n  padding: var(--#{$prefix}toast-padding-y) var(--#{$prefix}toast-padding-x);\n  color: var(--#{$prefix}toast-header-color);\n  background-color: var(--#{$prefix}toast-header-bg);\n  background-clip: padding-box;\n  border-bottom: var(--#{$prefix}toast-border-width) solid var(--#{$prefix}toast-header-border-color);\n  @include border-top-radius(calc(var(--#{$prefix}toast-border-radius) - var(--#{$prefix}toast-border-width)));\n\n  .btn-close {\n    margin-right: calc(-.5 * var(--#{$prefix}toast-padding-x)); // stylelint-disable-line function-disallowed-list\n    margin-left: var(--#{$prefix}toast-padding-x);\n  }\n}\n\n.toast-body {\n  padding: var(--#{$prefix}toast-padding-x);\n  word-wrap: break-word;\n}\n","// stylelint-disable function-disallowed-list\n\n// .modal-open      - body class for killing the scroll\n// .modal           - container to scroll within\n// .modal-dialog    - positioning shell for the actual modal\n// .modal-content   - actual modal w/ bg and corners and stuff\n\n\n// Container that the modal scrolls within\n.modal {\n  // scss-docs-start modal-css-vars\n  --#{$prefix}modal-zindex: #{$zindex-modal};\n  --#{$prefix}modal-width: #{$modal-md};\n  --#{$prefix}modal-padding: #{$modal-inner-padding};\n  --#{$prefix}modal-margin: #{$modal-dialog-margin};\n  --#{$prefix}modal-color: #{$modal-content-color};\n  --#{$prefix}modal-bg: #{$modal-content-bg};\n  --#{$prefix}modal-border-color: #{$modal-content-border-color};\n  --#{$prefix}modal-border-width: #{$modal-content-border-width};\n  --#{$prefix}modal-border-radius: #{$modal-content-border-radius};\n  --#{$prefix}modal-box-shadow: #{$modal-content-box-shadow-xs};\n  --#{$prefix}modal-inner-border-radius: #{$modal-content-inner-border-radius};\n  --#{$prefix}modal-header-padding-x: #{$modal-header-padding-x};\n  --#{$prefix}modal-header-padding-y: #{$modal-header-padding-y};\n  --#{$prefix}modal-header-padding: #{$modal-header-padding}; // Todo in v6: Split this padding into x and y\n  --#{$prefix}modal-header-border-color: #{$modal-header-border-color};\n  --#{$prefix}modal-header-border-width: #{$modal-header-border-width};\n  --#{$prefix}modal-title-line-height: #{$modal-title-line-height};\n  --#{$prefix}modal-footer-gap: #{$modal-footer-margin-between};\n  --#{$prefix}modal-footer-bg: #{$modal-footer-bg};\n  --#{$prefix}modal-footer-border-color: #{$modal-footer-border-color};\n  --#{$prefix}modal-footer-border-width: #{$modal-footer-border-width};\n  // scss-docs-end modal-css-vars\n\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: var(--#{$prefix}modal-zindex);\n  display: none;\n  width: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n  // Prevent Chrome on Windows from adding a focus outline. For details, see\n  // https://github.com/twbs/bootstrap/pull/10951.\n  outline: 0;\n  // We deliberately don't use `-webkit-overflow-scrolling: touch;` due to a\n  // gnarly iOS Safari bug: https://bugs.webkit.org/show_bug.cgi?id=158342\n  // See also https://github.com/twbs/bootstrap/issues/17695\n}\n\n// Shell div to position the modal with bottom padding\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: var(--#{$prefix}modal-margin);\n  // allow clicks to pass through for custom click handling to close modal\n  pointer-events: none;\n\n  // When fading in the modal, animate it to slide down\n  .modal.fade & {\n    @include transition($modal-transition);\n    transform: $modal-fade-transform;\n  }\n  .modal.show & {\n    transform: $modal-show-transform;\n  }\n\n  // When trying to close, animate focus to scale\n  .modal.modal-static & {\n    transform: $modal-scale-transform;\n  }\n}\n\n.modal-dialog-scrollable {\n  height: calc(100% - var(--#{$prefix}modal-margin) * 2);\n\n  .modal-content {\n    max-height: 100%;\n    overflow: hidden;\n  }\n\n  .modal-body {\n    overflow-y: auto;\n  }\n}\n\n.modal-dialog-centered {\n  display: flex;\n  align-items: center;\n  min-height: calc(100% - var(--#{$prefix}modal-margin) * 2);\n}\n\n// Actual modal\n.modal-content {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%; // Ensure `.modal-content` extends the full width of the parent `.modal-dialog`\n  // counteract the pointer-events: none; in the .modal-dialog\n  color: var(--#{$prefix}modal-color);\n  pointer-events: auto;\n  background-color: var(--#{$prefix}modal-bg);\n  background-clip: padding-box;\n  border: var(--#{$prefix}modal-border-width) solid var(--#{$prefix}modal-border-color);\n  @include border-radius(var(--#{$prefix}modal-border-radius));\n  @include box-shadow(var(--#{$prefix}modal-box-shadow));\n  // Remove focus outline from opened modal\n  outline: 0;\n}\n\n// Modal background\n.modal-backdrop {\n  // scss-docs-start modal-backdrop-css-vars\n  --#{$prefix}backdrop-zindex: #{$zindex-modal-backdrop};\n  --#{$prefix}backdrop-bg: #{$modal-backdrop-bg};\n  --#{$prefix}backdrop-opacity: #{$modal-backdrop-opacity};\n  // scss-docs-end modal-backdrop-css-vars\n\n  @include overlay-backdrop(var(--#{$prefix}backdrop-zindex), var(--#{$prefix}backdrop-bg), var(--#{$prefix}backdrop-opacity));\n}\n\n// Modal header\n// Top section of the modal w/ title and dismiss\n.modal-header {\n  display: flex;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: space-between; // Put modal header elements (title and dismiss) on opposite ends\n  padding: var(--#{$prefix}modal-header-padding);\n  border-bottom: var(--#{$prefix}modal-header-border-width) solid var(--#{$prefix}modal-header-border-color);\n  @include border-top-radius(var(--#{$prefix}modal-inner-border-radius));\n\n  .btn-close {\n    padding: calc(var(--#{$prefix}modal-header-padding-y) * .5) calc(var(--#{$prefix}modal-header-padding-x) * .5);\n    margin: calc(-.5 * var(--#{$prefix}modal-header-padding-y)) calc(-.5 * var(--#{$prefix}modal-header-padding-x)) calc(-.5 * var(--#{$prefix}modal-header-padding-y)) auto;\n  }\n}\n\n// Title text within header\n.modal-title {\n  margin-bottom: 0;\n  line-height: var(--#{$prefix}modal-title-line-height);\n}\n\n// Modal body\n// Where all modal content resides (sibling of .modal-header and .modal-footer)\n.modal-body {\n  position: relative;\n  // Enable `flex-grow: 1` so that the body take up as much space as possible\n  // when there should be a fixed height on `.modal-dialog`.\n  flex: 1 1 auto;\n  padding: var(--#{$prefix}modal-padding);\n}\n\n// Footer (for actions)\n.modal-footer {\n  display: flex;\n  flex-shrink: 0;\n  flex-wrap: wrap;\n  align-items: center; // vertically center\n  justify-content: flex-end; // Right align buttons with flex property because text-align doesn't work on flex items\n  padding: calc(var(--#{$prefix}modal-padding) - var(--#{$prefix}modal-footer-gap) * .5);\n  background-color: var(--#{$prefix}modal-footer-bg);\n  border-top: var(--#{$prefix}modal-footer-border-width) solid var(--#{$prefix}modal-footer-border-color);\n  @include border-bottom-radius(var(--#{$prefix}modal-inner-border-radius));\n\n  // Place margin between footer elements\n  // This solution is far from ideal because of the universal selector usage,\n  // but is needed to fix https://github.com/twbs/bootstrap/issues/24800\n  > * {\n    margin: calc(var(--#{$prefix}modal-footer-gap) * .5); // Todo in v6: replace with gap on parent class\n  }\n}\n\n// Scale up the modal\n@include media-breakpoint-up(sm) {\n  .modal {\n    --#{$prefix}modal-margin: #{$modal-dialog-margin-y-sm-up};\n    --#{$prefix}modal-box-shadow: #{$modal-content-box-shadow-sm-up};\n  }\n\n  // Automatically set modal's width for larger viewports\n  .modal-dialog {\n    max-width: var(--#{$prefix}modal-width);\n    margin-right: auto;\n    margin-left: auto;\n  }\n\n  .modal-sm {\n    --#{$prefix}modal-width: #{$modal-sm};\n  }\n}\n\n@include media-breakpoint-up(lg) {\n  .modal-lg,\n  .modal-xl {\n    --#{$prefix}modal-width: #{$modal-lg};\n  }\n}\n\n@include media-breakpoint-up(xl) {\n  .modal-xl {\n    --#{$prefix}modal-width: #{$modal-xl};\n  }\n}\n\n// scss-docs-start modal-fullscreen-loop\n@each $breakpoint in map-keys($grid-breakpoints) {\n  $infix: breakpoint-infix($breakpoint, $grid-breakpoints);\n  $postfix: if($infix != \"\", $infix + \"-down\", \"\");\n\n  @include media-breakpoint-down($breakpoint) {\n    .modal-fullscreen#{$postfix} {\n      width: 100vw;\n      max-width: none;\n      height: 100%;\n      margin: 0;\n\n      .modal-content {\n        height: 100%;\n        border: 0;\n        @include border-radius(0);\n      }\n\n      .modal-header,\n      .modal-footer {\n        @include border-radius(0);\n      }\n\n      .modal-body {\n        overflow-y: auto;\n      }\n    }\n  }\n}\n// scss-docs-end modal-fullscreen-loop\n","// Shared between modals and offcanvases\n@mixin overlay-backdrop($zindex, $backdrop-bg, $backdrop-opacity) {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: $zindex;\n  width: 100vw;\n  height: 100vh;\n  background-color: $backdrop-bg;\n\n  // Fade for backdrop\n  &.fade { opacity: 0; }\n  &.show { opacity: $backdrop-opacity; }\n}\n","// Base class\n.tooltip {\n  // scss-docs-start tooltip-css-vars\n  --#{$prefix}tooltip-zindex: #{$zindex-tooltip};\n  --#{$prefix}tooltip-max-width: #{$tooltip-max-width};\n  --#{$prefix}tooltip-padding-x: #{$tooltip-padding-x};\n  --#{$prefix}tooltip-padding-y: #{$tooltip-padding-y};\n  --#{$prefix}tooltip-margin: #{$tooltip-margin};\n  @include rfs($tooltip-font-size, --#{$prefix}tooltip-font-size);\n  --#{$prefix}tooltip-color: #{$tooltip-color};\n  --#{$prefix}tooltip-bg: #{$tooltip-bg};\n  --#{$prefix}tooltip-border-radius: #{$tooltip-border-radius};\n  --#{$prefix}tooltip-opacity: #{$tooltip-opacity};\n  --#{$prefix}tooltip-arrow-width: #{$tooltip-arrow-width};\n  --#{$prefix}tooltip-arrow-height: #{$tooltip-arrow-height};\n  // scss-docs-end tooltip-css-vars\n\n  z-index: var(--#{$prefix}tooltip-zindex);\n  display: block;\n  padding: var(--#{$prefix}tooltip-arrow-height);\n  margin: var(--#{$prefix}tooltip-margin);\n  @include deprecate(\"`$tooltip-margin`\", \"v5\", \"v5.x\", true);\n  // Our parent element can be arbitrary since tooltips are by default inserted as a sibling of their target element.\n  // So reset our font and text properties to avoid inheriting weird values.\n  @include reset-text();\n  @include font-size(var(--#{$prefix}tooltip-font-size));\n  // Allow breaking very long words so they don't overflow the tooltip's bounds\n  word-wrap: break-word;\n  opacity: 0;\n\n  &.show { opacity: var(--#{$prefix}tooltip-opacity); }\n\n  .tooltip-arrow {\n    display: block;\n    width: var(--#{$prefix}tooltip-arrow-width);\n    height: var(--#{$prefix}tooltip-arrow-height);\n\n    &::before {\n      position: absolute;\n      content: \"\";\n      border-color: transparent;\n      border-style: solid;\n    }\n  }\n}\n\n.bs-tooltip-top .tooltip-arrow {\n  bottom: 0;\n\n  &::before {\n    top: -1px;\n    border-width: var(--#{$prefix}tooltip-arrow-height) calc(var(--#{$prefix}tooltip-arrow-width) * .5) 0; // stylelint-disable-line function-disallowed-list\n    border-top-color: var(--#{$prefix}tooltip-bg);\n  }\n}\n\n/* rtl:begin:ignore */\n.bs-tooltip-end .tooltip-arrow {\n  left: 0;\n  width: var(--#{$prefix}tooltip-arrow-height);\n  height: var(--#{$prefix}tooltip-arrow-width);\n\n  &::before {\n    right: -1px;\n    border-width: calc(var(--#{$prefix}tooltip-arrow-width) * .5) var(--#{$prefix}tooltip-arrow-height) calc(var(--#{$prefix}tooltip-arrow-width) * .5) 0; // stylelint-disable-line function-disallowed-list\n    border-right-color: var(--#{$prefix}tooltip-bg);\n  }\n}\n\n/* rtl:end:ignore */\n\n.bs-tooltip-bottom .tooltip-arrow {\n  top: 0;\n\n  &::before {\n    bottom: -1px;\n    border-width: 0 calc(var(--#{$prefix}tooltip-arrow-width) * .5) var(--#{$prefix}tooltip-arrow-height); // stylelint-disable-line function-disallowed-list\n    border-bottom-color: var(--#{$prefix}tooltip-bg);\n  }\n}\n\n/* rtl:begin:ignore */\n.bs-tooltip-start .tooltip-arrow {\n  right: 0;\n  width: var(--#{$prefix}tooltip-arrow-height);\n  height: var(--#{$prefix}tooltip-arrow-width);\n\n  &::before {\n    left: -1px;\n    border-width: calc(var(--#{$prefix}tooltip-arrow-width) * .5) 0 calc(var(--#{$prefix}tooltip-arrow-width) * .5) var(--#{$prefix}tooltip-arrow-height); // stylelint-disable-line function-disallowed-list\n    border-left-color: var(--#{$prefix}tooltip-bg);\n  }\n}\n\n/* rtl:end:ignore */\n\n.bs-tooltip-auto {\n  &[data-popper-placement^=\"top\"] {\n    @extend .bs-tooltip-top;\n  }\n  &[data-popper-placement^=\"right\"] {\n    @extend .bs-tooltip-end;\n  }\n  &[data-popper-placement^=\"bottom\"] {\n    @extend .bs-tooltip-bottom;\n  }\n  &[data-popper-placement^=\"left\"] {\n    @extend .bs-tooltip-start;\n  }\n}\n\n// Wrapper for the tooltip content\n.tooltip-inner {\n  max-width: var(--#{$prefix}tooltip-max-width);\n  padding: var(--#{$prefix}tooltip-padding-y) var(--#{$prefix}tooltip-padding-x);\n  color: var(--#{$prefix}tooltip-color);\n  text-align: center;\n  background-color: var(--#{$prefix}tooltip-bg);\n  @include border-radius(var(--#{$prefix}tooltip-border-radius));\n}\n","@mixin reset-text {\n  font-family: $font-family-base;\n  // We deliberately do NOT reset font-size or overflow-wrap / word-wrap.\n  font-style: normal;\n  font-weight: $font-weight-normal;\n  line-height: $line-height-base;\n  text-align: left; // Fallback for where `start` is not supported\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  white-space: normal;\n  word-spacing: normal;\n  line-break: auto;\n}\n",".popover {\n  // scss-docs-start popover-css-vars\n  --#{$prefix}popover-zindex: #{$zindex-popover};\n  --#{$prefix}popover-max-width: #{$popover-max-width};\n  @include rfs($popover-font-size, --#{$prefix}popover-font-size);\n  --#{$prefix}popover-bg: #{$popover-bg};\n  --#{$prefix}popover-border-width: #{$popover-border-width};\n  --#{$prefix}popover-border-color: #{$popover-border-color};\n  --#{$prefix}popover-border-radius: #{$popover-border-radius};\n  --#{$prefix}popover-inner-border-radius: #{$popover-inner-border-radius};\n  --#{$prefix}popover-box-shadow: #{$popover-box-shadow};\n  --#{$prefix}popover-header-padding-x: #{$popover-header-padding-x};\n  --#{$prefix}popover-header-padding-y: #{$popover-header-padding-y};\n  @include rfs($popover-header-font-size, --#{$prefix}popover-header-font-size);\n  --#{$prefix}popover-header-color: #{$popover-header-color};\n  --#{$prefix}popover-header-bg: #{$popover-header-bg};\n  --#{$prefix}popover-body-padding-x: #{$popover-body-padding-x};\n  --#{$prefix}popover-body-padding-y: #{$popover-body-padding-y};\n  --#{$prefix}popover-body-color: #{$popover-body-color};\n  --#{$prefix}popover-arrow-width: #{$popover-arrow-width};\n  --#{$prefix}popover-arrow-height: #{$popover-arrow-height};\n  --#{$prefix}popover-arrow-border: var(--#{$prefix}popover-border-color);\n  // scss-docs-end popover-css-vars\n\n  z-index: var(--#{$prefix}popover-zindex);\n  display: block;\n  max-width: var(--#{$prefix}popover-max-width);\n  // Our parent element can be arbitrary since tooltips are by default inserted as a sibling of their target element.\n  // So reset our font and text properties to avoid inheriting weird values.\n  @include reset-text();\n  @include font-size(var(--#{$prefix}popover-font-size));\n  // Allow breaking very long words so they don't overflow the popover's bounds\n  word-wrap: break-word;\n  background-color: var(--#{$prefix}popover-bg);\n  background-clip: padding-box;\n  border: var(--#{$prefix}popover-border-width) solid var(--#{$prefix}popover-border-color);\n  @include border-radius(var(--#{$prefix}popover-border-radius));\n  @include box-shadow(var(--#{$prefix}popover-box-shadow));\n\n  .popover-arrow {\n    display: block;\n    width: var(--#{$prefix}popover-arrow-width);\n    height: var(--#{$prefix}popover-arrow-height);\n\n    &::before,\n    &::after {\n      position: absolute;\n      display: block;\n      content: \"\";\n      border-color: transparent;\n      border-style: solid;\n      border-width: 0;\n    }\n  }\n}\n\n.bs-popover-top {\n  > .popover-arrow {\n    bottom: calc(-1 * (var(--#{$prefix}popover-arrow-height)) - var(--#{$prefix}popover-border-width)); // stylelint-disable-line function-disallowed-list\n\n    &::before,\n    &::after {\n      border-width: var(--#{$prefix}popover-arrow-height) calc(var(--#{$prefix}popover-arrow-width) * .5) 0; // stylelint-disable-line function-disallowed-list\n    }\n\n    &::before {\n      bottom: 0;\n      border-top-color: var(--#{$prefix}popover-arrow-border);\n    }\n\n    &::after {\n      bottom: var(--#{$prefix}popover-border-width);\n      border-top-color: var(--#{$prefix}popover-bg);\n    }\n  }\n}\n\n/* rtl:begin:ignore */\n.bs-popover-end {\n  > .popover-arrow {\n    left: calc(-1 * (var(--#{$prefix}popover-arrow-height)) - var(--#{$prefix}popover-border-width)); // stylelint-disable-line function-disallowed-list\n    width: var(--#{$prefix}popover-arrow-height);\n    height: var(--#{$prefix}popover-arrow-width);\n\n    &::before,\n    &::after {\n      border-width: calc(var(--#{$prefix}popover-arrow-width) * .5) var(--#{$prefix}popover-arrow-height) calc(var(--#{$prefix}popover-arrow-width) * .5) 0; // stylelint-disable-line function-disallowed-list\n    }\n\n    &::before {\n      left: 0;\n      border-right-color: var(--#{$prefix}popover-arrow-border);\n    }\n\n    &::after {\n      left: var(--#{$prefix}popover-border-width);\n      border-right-color: var(--#{$prefix}popover-bg);\n    }\n  }\n}\n\n/* rtl:end:ignore */\n\n.bs-popover-bottom {\n  > .popover-arrow {\n    top: calc(-1 * (var(--#{$prefix}popover-arrow-height)) - var(--#{$prefix}popover-border-width)); // stylelint-disable-line function-disallowed-list\n\n    &::before,\n    &::after {\n      border-width: 0 calc(var(--#{$prefix}popover-arrow-width) * .5) var(--#{$prefix}popover-arrow-height); // stylelint-disable-line function-disallowed-list\n    }\n\n    &::before {\n      top: 0;\n      border-bottom-color: var(--#{$prefix}popover-arrow-border);\n    }\n\n    &::after {\n      top: var(--#{$prefix}popover-border-width);\n      border-bottom-color: var(--#{$prefix}popover-bg);\n    }\n  }\n\n  // This will remove the popover-header's border just below the arrow\n  .popover-header::before {\n    position: absolute;\n    top: 0;\n    left: 50%;\n    display: block;\n    width: var(--#{$prefix}popover-arrow-width);\n    margin-left: calc(-.5 * var(--#{$prefix}popover-arrow-width)); // stylelint-disable-line function-disallowed-list\n    content: \"\";\n    border-bottom: var(--#{$prefix}popover-border-width) solid var(--#{$prefix}popover-header-bg);\n  }\n}\n\n/* rtl:begin:ignore */\n.bs-popover-start {\n  > .popover-arrow {\n    right: calc(-1 * (var(--#{$prefix}popover-arrow-height)) - var(--#{$prefix}popover-border-width)); // stylelint-disable-line function-disallowed-list\n    width: var(--#{$prefix}popover-arrow-height);\n    height: var(--#{$prefix}popover-arrow-width);\n\n    &::before,\n    &::after {\n      border-width: calc(var(--#{$prefix}popover-arrow-width) * .5) 0 calc(var(--#{$prefix}popover-arrow-width) * .5) var(--#{$prefix}popover-arrow-height); // stylelint-disable-line function-disallowed-list\n    }\n\n    &::before {\n      right: 0;\n      border-left-color: var(--#{$prefix}popover-arrow-border);\n    }\n\n    &::after {\n      right: var(--#{$prefix}popover-border-width);\n      border-left-color: var(--#{$prefix}popover-bg);\n    }\n  }\n}\n\n/* rtl:end:ignore */\n\n.bs-popover-auto {\n  &[data-popper-placement^=\"top\"] {\n    @extend .bs-popover-top;\n  }\n  &[data-popper-placement^=\"right\"] {\n    @extend .bs-popover-end;\n  }\n  &[data-popper-placement^=\"bottom\"] {\n    @extend .bs-popover-bottom;\n  }\n  &[data-popper-placement^=\"left\"] {\n    @extend .bs-popover-start;\n  }\n}\n\n// Offset the popover to account for the popover arrow\n.popover-header {\n  padding: var(--#{$prefix}popover-header-padding-y) var(--#{$prefix}popover-header-padding-x);\n  margin-bottom: 0; // Reset the default from Reboot\n  @include font-size(var(--#{$prefix}popover-header-font-size));\n  color: var(--#{$prefix}popover-header-color);\n  background-color: var(--#{$prefix}popover-header-bg);\n  border-bottom: var(--#{$prefix}popover-border-width) solid var(--#{$prefix}popover-border-color);\n  @include border-top-radius(var(--#{$prefix}popover-inner-border-radius));\n\n  &:empty {\n    display: none;\n  }\n}\n\n.popover-body {\n  padding: var(--#{$prefix}popover-body-padding-y) var(--#{$prefix}popover-body-padding-x);\n  color: var(--#{$prefix}popover-body-color);\n}\n","// Notes on the classes:\n//\n// 1. .carousel.pointer-event should ideally be pan-y (to allow for users to scroll vertically)\n//    even when their scroll action started on a carousel, but for compatibility (with Firefox)\n//    we're preventing all actions instead\n// 2. The .carousel-item-start and .carousel-item-end is used to indicate where\n//    the active slide is heading.\n// 3. .active.carousel-item is the current slide.\n// 4. .active.carousel-item-start and .active.carousel-item-end is the current\n//    slide in its in-transition state. Only one of these occurs at a time.\n// 5. .carousel-item-next.carousel-item-start and .carousel-item-prev.carousel-item-end\n//    is the upcoming slide in transition.\n\n.carousel {\n  position: relative;\n}\n\n.carousel.pointer-event {\n  touch-action: pan-y;\n}\n\n.carousel-inner {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n  @include clearfix();\n}\n\n.carousel-item {\n  position: relative;\n  display: none;\n  float: left;\n  width: 100%;\n  margin-right: -100%;\n  backface-visibility: hidden;\n  @include transition($carousel-transition);\n}\n\n.carousel-item.active,\n.carousel-item-next,\n.carousel-item-prev {\n  display: block;\n}\n\n/* rtl:begin:ignore */\n.carousel-item-next:not(.carousel-item-start),\n.active.carousel-item-end {\n  transform: translateX(100%);\n}\n\n.carousel-item-prev:not(.carousel-item-end),\n.active.carousel-item-start {\n  transform: translateX(-100%);\n}\n\n/* rtl:end:ignore */\n\n\n//\n// Alternate transitions\n//\n\n.carousel-fade {\n  .carousel-item {\n    opacity: 0;\n    transition-property: opacity;\n    transform: none;\n  }\n\n  .carousel-item.active,\n  .carousel-item-next.carousel-item-start,\n  .carousel-item-prev.carousel-item-end {\n    z-index: 1;\n    opacity: 1;\n  }\n\n  .active.carousel-item-start,\n  .active.carousel-item-end {\n    z-index: 0;\n    opacity: 0;\n    @include transition(opacity 0s $carousel-transition-duration);\n  }\n}\n\n\n//\n// Left/right controls for nav\n//\n\n.carousel-control-prev,\n.carousel-control-next {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: 1;\n  // Use flex for alignment (1-3)\n  display: flex; // 1. allow flex styles\n  align-items: center; // 2. vertically center contents\n  justify-content: center; // 3. horizontally center contents\n  width: $carousel-control-width;\n  padding: 0;\n  color: $carousel-control-color;\n  text-align: center;\n  background: none;\n  border: 0;\n  opacity: $carousel-control-opacity;\n  @include transition($carousel-control-transition);\n\n  // Hover/focus state\n  &:hover,\n  &:focus {\n    color: $carousel-control-color;\n    text-decoration: none;\n    outline: 0;\n    opacity: $carousel-control-hover-opacity;\n  }\n}\n.carousel-control-prev {\n  left: 0;\n  background-image: if($enable-gradients, linear-gradient(90deg, rgba($black, .25), rgba($black, .001)), null);\n}\n.carousel-control-next {\n  right: 0;\n  background-image: if($enable-gradients, linear-gradient(270deg, rgba($black, .25), rgba($black, .001)), null);\n}\n\n// Icons for within\n.carousel-control-prev-icon,\n.carousel-control-next-icon {\n  display: inline-block;\n  width: $carousel-control-icon-width;\n  height: $carousel-control-icon-width;\n  background-repeat: no-repeat;\n  background-position: 50%;\n  background-size: 100% 100%;\n}\n\n/* rtl:options: {\n  \"autoRename\": true,\n  \"stringMap\":[ {\n    \"name\"    : \"prev-next\",\n    \"search\"  : \"prev\",\n    \"replace\" : \"next\"\n  } ]\n} */\n.carousel-control-prev-icon {\n  background-image: escape-svg($carousel-control-prev-icon-bg);\n}\n.carousel-control-next-icon {\n  background-image: escape-svg($carousel-control-next-icon-bg);\n}\n\n// Optional indicator pips/controls\n//\n// Add a container (such as a list) with the following class and add an item (ideally a focusable control,\n// like a button) with data-bs-target for each slide your carousel holds.\n\n.carousel-indicators {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 2;\n  display: flex;\n  justify-content: center;\n  padding: 0;\n  // Use the .carousel-control's width as margin so we don't overlay those\n  margin-right: $carousel-control-width;\n  margin-bottom: 1rem;\n  margin-left: $carousel-control-width;\n  list-style: none;\n\n  [data-bs-target] {\n    box-sizing: content-box;\n    flex: 0 1 auto;\n    width: $carousel-indicator-width;\n    height: $carousel-indicator-height;\n    padding: 0;\n    margin-right: $carousel-indicator-spacer;\n    margin-left: $carousel-indicator-spacer;\n    text-indent: -999px;\n    cursor: pointer;\n    background-color: $carousel-indicator-active-bg;\n    background-clip: padding-box;\n    border: 0;\n    // Use transparent borders to increase the hit area by 10px on top and bottom.\n    border-top: $carousel-indicator-hit-area-height solid transparent;\n    border-bottom: $carousel-indicator-hit-area-height solid transparent;\n    opacity: $carousel-indicator-opacity;\n    @include transition($carousel-indicator-transition);\n  }\n\n  .active {\n    opacity: $carousel-indicator-active-opacity;\n  }\n}\n\n\n// Optional captions\n//\n//\n\n.carousel-caption {\n  position: absolute;\n  right: (100% - $carousel-caption-width) * .5;\n  bottom: $carousel-caption-spacer;\n  left: (100% - $carousel-caption-width) * .5;\n  padding-top: $carousel-caption-padding-y;\n  padding-bottom: $carousel-caption-padding-y;\n  color: $carousel-caption-color;\n  text-align: center;\n}\n\n// Dark mode carousel\n\n.carousel-dark {\n  .carousel-control-prev-icon,\n  .carousel-control-next-icon {\n    filter: $carousel-dark-control-icon-filter;\n  }\n\n  .carousel-indicators [data-bs-target] {\n    background-color: $carousel-dark-indicator-active-bg;\n  }\n\n  .carousel-caption {\n    color: $carousel-dark-caption-color;\n  }\n}\n","// scss-docs-start clearfix\n@mixin clearfix() {\n  &::after {\n    display: block;\n    clear: both;\n    content: \"\";\n  }\n}\n// scss-docs-end clearfix\n","//\n// Rotating border\n//\n\n.spinner-grow,\n.spinner-border {\n  display: inline-block;\n  width: var(--#{$prefix}spinner-width);\n  height: var(--#{$prefix}spinner-height);\n  vertical-align: var(--#{$prefix}spinner-vertical-align);\n  // stylelint-disable-next-line property-disallowed-list\n  border-radius: 50%;\n  animation: var(--#{$prefix}spinner-animation-speed) linear infinite var(--#{$prefix}spinner-animation-name);\n}\n\n// scss-docs-start spinner-border-keyframes\n@keyframes spinner-border {\n  to { transform: rotate(360deg) #{\"/* rtl:ignore */\"}; }\n}\n// scss-docs-end spinner-border-keyframes\n\n.spinner-border {\n  // scss-docs-start spinner-border-css-vars\n  --#{$prefix}spinner-width: #{$spinner-width};\n  --#{$prefix}spinner-height: #{$spinner-height};\n  --#{$prefix}spinner-vertical-align: #{$spinner-vertical-align};\n  --#{$prefix}spinner-border-width: #{$spinner-border-width};\n  --#{$prefix}spinner-animation-speed: #{$spinner-animation-speed};\n  --#{$prefix}spinner-animation-name: spinner-border;\n  // scss-docs-end spinner-border-css-vars\n\n  border: var(--#{$prefix}spinner-border-width) solid currentcolor;\n  border-right-color: transparent;\n}\n\n.spinner-border-sm {\n  // scss-docs-start spinner-border-sm-css-vars\n  --#{$prefix}spinner-width: #{$spinner-width-sm};\n  --#{$prefix}spinner-height: #{$spinner-height-sm};\n  --#{$prefix}spinner-border-width: #{$spinner-border-width-sm};\n  // scss-docs-end spinner-border-sm-css-vars\n}\n\n//\n// Growing circle\n//\n\n// scss-docs-start spinner-grow-keyframes\n@keyframes spinner-grow {\n  0% {\n    transform: scale(0);\n  }\n  50% {\n    opacity: 1;\n    transform: none;\n  }\n}\n// scss-docs-end spinner-grow-keyframes\n\n.spinner-grow {\n  // scss-docs-start spinner-grow-css-vars\n  --#{$prefix}spinner-width: #{$spinner-width};\n  --#{$prefix}spinner-height: #{$spinner-height};\n  --#{$prefix}spinner-vertical-align: #{$spinner-vertical-align};\n  --#{$prefix}spinner-animation-speed: #{$spinner-animation-speed};\n  --#{$prefix}spinner-animation-name: spinner-grow;\n  // scss-docs-end spinner-grow-css-vars\n\n  background-color: currentcolor;\n  opacity: 0;\n}\n\n.spinner-grow-sm {\n  --#{$prefix}spinner-width: #{$spinner-width-sm};\n  --#{$prefix}spinner-height: #{$spinner-height-sm};\n}\n\n@if $enable-reduced-motion {\n  @media (prefers-reduced-motion: reduce) {\n    .spinner-border,\n    .spinner-grow {\n      --#{$prefix}spinner-animation-speed: #{$spinner-animation-speed * 2};\n    }\n  }\n}\n","// stylelint-disable function-disallowed-list\n\n%offcanvas-css-vars {\n  // scss-docs-start offcanvas-css-vars\n  --#{$prefix}offcanvas-zindex: #{$zindex-offcanvas};\n  --#{$prefix}offcanvas-width: #{$offcanvas-horizontal-width};\n  --#{$prefix}offcanvas-height: #{$offcanvas-vertical-height};\n  --#{$prefix}offcanvas-padding-x: #{$offcanvas-padding-x};\n  --#{$prefix}offcanvas-padding-y: #{$offcanvas-padding-y};\n  --#{$prefix}offcanvas-color: #{$offcanvas-color};\n  --#{$prefix}offcanvas-bg: #{$offcanvas-bg-color};\n  --#{$prefix}offcanvas-border-width: #{$offcanvas-border-width};\n  --#{$prefix}offcanvas-border-color: #{$offcanvas-border-color};\n  --#{$prefix}offcanvas-box-shadow: #{$offcanvas-box-shadow};\n  // scss-docs-end offcanvas-css-vars\n}\n\n@each $breakpoint in map-keys($grid-breakpoints) {\n  $next: breakpoint-next($breakpoint, $grid-breakpoints);\n  $infix: breakpoint-infix($next, $grid-breakpoints);\n\n  .offcanvas#{$infix} {\n    @extend %offcanvas-css-vars;\n  }\n}\n\n@each $breakpoint in map-keys($grid-breakpoints) {\n  $next: breakpoint-next($breakpoint, $grid-breakpoints);\n  $infix: breakpoint-infix($next, $grid-breakpoints);\n\n  .offcanvas#{$infix} {\n    @include media-breakpoint-down($next) {\n      position: fixed;\n      bottom: 0;\n      z-index: var(--#{$prefix}offcanvas-zindex);\n      display: flex;\n      flex-direction: column;\n      max-width: 100%;\n      color: var(--#{$prefix}offcanvas-color);\n      visibility: hidden;\n      background-color: var(--#{$prefix}offcanvas-bg);\n      background-clip: padding-box;\n      outline: 0;\n      @include box-shadow(var(--#{$prefix}offcanvas-box-shadow));\n      @include transition(transform $offcanvas-transition-duration ease-in-out);\n\n      &.offcanvas-start {\n        top: 0;\n        left: 0;\n        width: var(--#{$prefix}offcanvas-width);\n        border-right: var(--#{$prefix}offcanvas-border-width) solid var(--#{$prefix}offcanvas-border-color);\n        transform: translateX(-100%);\n      }\n\n      &.offcanvas-end {\n        top: 0;\n        right: 0;\n        width: var(--#{$prefix}offcanvas-width);\n        border-left: var(--#{$prefix}offcanvas-border-width) solid var(--#{$prefix}offcanvas-border-color);\n        transform: translateX(100%);\n      }\n\n      &.offcanvas-top {\n        top: 0;\n        right: 0;\n        left: 0;\n        height: var(--#{$prefix}offcanvas-height);\n        max-height: 100%;\n        border-bottom: var(--#{$prefix}offcanvas-border-width) solid var(--#{$prefix}offcanvas-border-color);\n        transform: translateY(-100%);\n      }\n\n      &.offcanvas-bottom {\n        right: 0;\n        left: 0;\n        height: var(--#{$prefix}offcanvas-height);\n        max-height: 100%;\n        border-top: var(--#{$prefix}offcanvas-border-width) solid var(--#{$prefix}offcanvas-border-color);\n        transform: translateY(100%);\n      }\n\n      &.showing,\n      &.show:not(.hiding) {\n        transform: none;\n      }\n\n      &.showing,\n      &.hiding,\n      &.show {\n        visibility: visible;\n      }\n    }\n\n    @if not ($infix == \"\") {\n      @include media-breakpoint-up($next) {\n        --#{$prefix}offcanvas-height: auto;\n        --#{$prefix}offcanvas-border-width: 0;\n        background-color: transparent !important; // stylelint-disable-line declaration-no-important\n\n        .offcanvas-header {\n          display: none;\n        }\n\n        .offcanvas-body {\n          display: flex;\n          flex-grow: 0;\n          padding: 0;\n          overflow-y: visible;\n          // Reset `background-color` in case `.bg-*` classes are used in offcanvas\n          background-color: transparent !important; // stylelint-disable-line declaration-no-important\n        }\n      }\n    }\n  }\n}\n\n.offcanvas-backdrop {\n  @include overlay-backdrop($zindex-offcanvas-backdrop, $offcanvas-backdrop-bg, $offcanvas-backdrop-opacity);\n}\n\n.offcanvas-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: var(--#{$prefix}offcanvas-padding-y) var(--#{$prefix}offcanvas-padding-x);\n\n  .btn-close {\n    padding: calc(var(--#{$prefix}offcanvas-padding-y) * .5) calc(var(--#{$prefix}offcanvas-padding-x) * .5);\n    margin-top: calc(-.5 * var(--#{$prefix}offcanvas-padding-y));\n    margin-right: calc(-.5 * var(--#{$prefix}offcanvas-padding-x));\n    margin-bottom: calc(-.5 * var(--#{$prefix}offcanvas-padding-y));\n  }\n}\n\n.offcanvas-title {\n  margin-bottom: 0;\n  line-height: $offcanvas-title-line-height;\n}\n\n.offcanvas-body {\n  flex-grow: 1;\n  padding: var(--#{$prefix}offcanvas-padding-y) var(--#{$prefix}offcanvas-padding-x);\n  overflow-y: auto;\n}\n",".placeholder {\n  display: inline-block;\n  min-height: 1em;\n  vertical-align: middle;\n  cursor: wait;\n  background-color: currentcolor;\n  opacity: $placeholder-opacity-max;\n\n  &.btn::before {\n    display: inline-block;\n    content: \"\";\n  }\n}\n\n// Sizing\n.placeholder-xs {\n  min-height: .6em;\n}\n\n.placeholder-sm {\n  min-height: .8em;\n}\n\n.placeholder-lg {\n  min-height: 1.2em;\n}\n\n// Animation\n.placeholder-glow {\n  .placeholder {\n    animation: placeholder-glow 2s ease-in-out infinite;\n  }\n}\n\n@keyframes placeholder-glow {\n  50% {\n    opacity: $placeholder-opacity-min;\n  }\n}\n\n.placeholder-wave {\n  mask-image: linear-gradient(130deg, $black 55%, rgba(0, 0, 0, (1 - $placeholder-opacity-min)) 75%, $black 95%);\n  mask-size: 200% 100%;\n  animation: placeholder-wave 2s linear infinite;\n}\n\n@keyframes placeholder-wave {\n  100% {\n    mask-position: -200% 0%;\n  }\n}\n","// stylelint-disable function-name-case\n\n// All-caps `RGBA()` function used because of this Sass bug: https://github.com/sass/node-sass/issues/2251\n@each $color, $value in $theme-colors {\n  $color-rgb: to-rgb($value);\n  .text-bg-#{$color} {\n    color: color-contrast($value) if($enable-important-utilities, !important, null);\n    background-color: RGBA($color-rgb, var(--#{$prefix}bg-opacity, 1)) if($enable-important-utilities, !important, null);\n  }\n}\n","@each $color, $value in $theme-colors {\n  .link-#{$color} {\n    color: $value !important; // stylelint-disable-line declaration-no-important\n\n    @if $link-shade-percentage != 0 {\n      &:hover,\n      &:focus {\n        color: if(color-contrast($value) == $color-contrast-light, shade-color($value, $link-shade-percentage), tint-color($value, $link-shade-percentage)) !important; // stylelint-disable-line declaration-no-important\n      }\n    }\n  }\n}\n","// Credit: Nicolas Gallagher and SUIT CSS.\n\n.ratio {\n  position: relative;\n  width: 100%;\n\n  &::before {\n    display: block;\n    padding-top: var(--#{$prefix}aspect-ratio);\n    content: \"\";\n  }\n\n  > * {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n  }\n}\n\n@each $key, $ratio in $aspect-ratios {\n  .ratio-#{$key} {\n    --#{$prefix}aspect-ratio: #{$ratio};\n  }\n}\n","// Shorthand\n\n.fixed-top {\n  position: fixed;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: $zindex-fixed;\n}\n\n.fixed-bottom {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: $zindex-fixed;\n}\n\n// Responsive sticky top and bottom\n@each $breakpoint in map-keys($grid-breakpoints) {\n  @include media-breakpoint-up($breakpoint) {\n    $infix: breakpoint-infix($breakpoint, $grid-breakpoints);\n\n    .sticky#{$infix}-top {\n      position: sticky;\n      top: 0;\n      z-index: $zindex-sticky;\n    }\n\n    .sticky#{$infix}-bottom {\n      position: sticky;\n      bottom: 0;\n      z-index: $zindex-sticky;\n    }\n  }\n}\n","// scss-docs-start stacks\n.hstack {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  align-self: stretch;\n}\n\n.vstack {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  align-self: stretch;\n}\n// scss-docs-end stacks\n","//\n// Visually hidden\n//\n\n.visually-hidden,\n.visually-hidden-focusable:not(:focus):not(:focus-within) {\n  @include visually-hidden();\n}\n","// stylelint-disable declaration-no-important\n\n// Hide content visually while keeping it accessible to assistive technologies\n//\n// See: https://www.a11yproject.com/posts/2013-01-11-how-to-hide-content/\n// See: https://kittygiraudel.com/2016/10/13/css-hide-and-seek/\n\n@mixin visually-hidden() {\n  position: absolute !important;\n  width: 1px !important;\n  height: 1px !important;\n  padding: 0 !important;\n  margin: -1px !important; // Fix for https://github.com/twbs/bootstrap/issues/25686\n  overflow: hidden !important;\n  clip: rect(0, 0, 0, 0) !important;\n  white-space: nowrap !important;\n  border: 0 !important;\n}\n\n// Use to only display content when it's focused, or one of its child elements is focused\n// (i.e. when focus is within the element/container that the class was applied to)\n//\n// Useful for \"Skip to main content\" links; see https://www.w3.org/TR/2013/NOTE-WCAG20-TECHS-20130905/G1\n\n@mixin visually-hidden-focusable() {\n  &:not(:focus):not(:focus-within) {\n    @include visually-hidden();\n  }\n}\n","//\n// Stretched link\n//\n\n.stretched-link {\n  &::#{$stretched-link-pseudo-element} {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    z-index: $stretched-link-z-index;\n    content: \"\";\n  }\n}\n","//\n// Text truncation\n//\n\n.text-truncate {\n  @include text-truncate();\n}\n","// Text truncate\n// Requires inline-block or block for proper styling\n\n@mixin text-truncate() {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n",".vr {\n  display: inline-block;\n  align-self: stretch;\n  width: 1px;\n  min-height: 1em;\n  background-color: currentcolor;\n  opacity: $hr-opacity;\n}\n","// Utility generator\n// Used to generate utilities & print utilities\n@mixin generate-utility($utility, $infix, $is-rfs-media-query: false) {\n  $values: map-get($utility, values);\n\n  // If the values are a list or string, convert it into a map\n  @if type-of($values) == \"string\" or type-of(nth($values, 1)) != \"list\" {\n    $values: zip($values, $values);\n  }\n\n  @each $key, $value in $values {\n    $properties: map-get($utility, property);\n\n    // Multiple properties are possible, for example with vertical or horizontal margins or paddings\n    @if type-of($properties) == \"string\" {\n      $properties: append((), $properties);\n    }\n\n    // Use custom class if present\n    $property-class: if(map-has-key($utility, class), map-get($utility, class), nth($properties, 1));\n    $property-class: if($property-class == null, \"\", $property-class);\n\n    // Use custom CSS variable name if present, otherwise default to `class`\n    $css-variable-name: if(map-has-key($utility, css-variable-name), map-get($utility, css-variable-name), map-get($utility, class));\n\n    // State params to generate pseudo-classes\n    $state: if(map-has-key($utility, state), map-get($utility, state), ());\n\n    $infix: if($property-class == \"\" and str-slice($infix, 1, 1) == \"-\", str-slice($infix, 2), $infix);\n\n    // Don't prefix if value key is null (e.g. with shadow class)\n    $property-class-modifier: if($key, if($property-class == \"\" and $infix == \"\", \"\", \"-\") + $key, \"\");\n\n    @if map-get($utility, rfs) {\n      // Inside the media query\n      @if $is-rfs-media-query {\n        $val: rfs-value($value);\n\n        // Do not render anything if fluid and non fluid values are the same\n        $value: if($val == rfs-fluid-value($value), null, $val);\n      }\n      @else {\n        $value: rfs-fluid-value($value);\n      }\n    }\n\n    $is-css-var: map-get($utility, css-var);\n    $is-local-vars: map-get($utility, local-vars);\n    $is-rtl: map-get($utility, rtl);\n\n    @if $value != null {\n      @if $is-rtl == false {\n        /* rtl:begin:remove */\n      }\n\n      @if $is-css-var {\n        .#{$property-class + $infix + $property-class-modifier} {\n          --#{$prefix}#{$css-variable-name}: #{$value};\n        }\n\n        @each $pseudo in $state {\n          .#{$property-class + $infix + $property-class-modifier}-#{$pseudo}:#{$pseudo} {\n            --#{$prefix}#{$css-variable-name}: #{$value};\n          }\n        }\n      } @else {\n        .#{$property-class + $infix + $property-class-modifier} {\n          @each $property in $properties {\n            @if $is-local-vars {\n              @each $local-var, $variable in $is-local-vars {\n                --#{$prefix}#{$local-var}: #{$variable};\n              }\n            }\n            #{$property}: $value if($enable-important-utilities, !important, null);\n          }\n        }\n\n        @each $pseudo in $state {\n          .#{$property-class + $infix + $property-class-modifier}-#{$pseudo}:#{$pseudo} {\n            @each $property in $properties {\n              @if $is-local-vars {\n                @each $local-var, $variable in $is-local-vars {\n                  --#{$prefix}#{$local-var}: #{$variable};\n                }\n              }\n              #{$property}: $value if($enable-important-utilities, !important, null);\n            }\n          }\n        }\n      }\n\n      @if $is-rtl == false {\n        /* rtl:end:remove */\n      }\n    }\n  }\n}\n","// Loop over each breakpoint\n@each $breakpoint in map-keys($grid-breakpoints) {\n\n  // Generate media query if needed\n  @include media-breakpoint-up($breakpoint) {\n    $infix: breakpoint-infix($breakpoint, $grid-breakpoints);\n\n    // Loop over each utility property\n    @each $key, $utility in $utilities {\n      // The utility can be disabled with `false`, thus check if the utility is a map first\n      // Only proceed if responsive media queries are enabled or if it's the base media query\n      @if type-of($utility) == \"map\" and (map-get($utility, responsive) or $infix == \"\") {\n        @include generate-utility($utility, $infix);\n      }\n    }\n  }\n}\n\n// RFS rescaling\n@media (min-width: $rfs-mq-value) {\n  @each $breakpoint in map-keys($grid-breakpoints) {\n    $infix: breakpoint-infix($breakpoint, $grid-breakpoints);\n\n    @if (map-get($grid-breakpoints, $breakpoint) < $rfs-breakpoint) {\n      // Loop over each utility property\n      @each $key, $utility in $utilities {\n        // The utility can be disabled with `false`, thus check if the utility is a map first\n        // Only proceed if responsive media queries are enabled or if it's the base media query\n        @if type-of($utility) == \"map\" and map-get($utility, rfs) and (map-get($utility, responsive) or $infix == \"\") {\n          @include generate-utility($utility, $infix, true);\n        }\n      }\n    }\n  }\n}\n\n\n// Print utilities\n@media print {\n  @each $key, $utility in $utilities {\n    // The utility can be disabled with `false`, thus check if the utility is a map first\n    // Then check if the utility needs print styles\n    @if type-of($utility) == \"map\" and map-get($utility, print) == true {\n      @include generate-utility($utility, \"-print\");\n    }\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }

  if (!url) {
    return url;
  }

  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them

  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }

  if (options.hash) {
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/scss/styles.scss":
/*!******************************!*\
  !*** ./src/scss/styles.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!../../node_modules/sass-loader/dist/cjs.js!./styles.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/scss/styles.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/js/about.js":
/*!*************************!*\
  !*** ./src/js/about.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const main = document.createElement('main');


const about = () => {
    main.innerHTML = '';
    console.log("About button clicked!");
    const copy = document.createElement('p');
    copy.setAttribute('id', 'copy');
    copy.innerHTML = 'Vana Eesti (<span id="translation">Old Estonia</span>) is a restaurant in the old town hall square: enjoy the beautiful view from our wide windows! Perfect place for whom likes high quality wines from all around the world and tasty estonian dishes. We can offer you medieval and romantic atmosphere, and great service. The restaurant seats up to 40 guests.<br><br>Our food comes straight from farmers. We are situated in Raekoja plats, with the best view to the square.';
    main.appendChild(copy);

};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (about);

/***/ }),

/***/ "./src/js/contact.js":
/*!***************************!*\
  !*** ./src/js/contact.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const main = document.createElement('main');

const contact = () => {
    main.innerHTML = '';
    console.log("Contact button clicked!");
    const contactcopy = document.createElement('p');
    contact.setAttribute('id', 'contact');
    contact.innerHTML = 'Contact content goes here';
    main.appendChild(contact);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (contact);

/***/ }),

/***/ "./src/js/menu.js":
/*!************************!*\
  !*** ./src/js/menu.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const main = document.createElement('main');

const menu = () => {
    main.innerHTML = '';
    console.log("Menu button clicked!");
    const menucopy = document.createElement('p');
    menucopy.setAttribute('id', 'menu');
    menucopy.innerHTML = 'Menu content goes here';
    main.appendChild(menucopy);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (menu);

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%272%27 fill=%27%23fff%27/%3e%3c/svg%3e":
/*!******************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%272%27 fill=%27%23fff%27/%3e%3c/svg%3e ***!
  \******************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%272%27 fill=%27%23fff%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%2386b7fe%27/%3e%3c/svg%3e":
/*!*********************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%2386b7fe%27/%3e%3c/svg%3e ***!
  \*********************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%2386b7fe%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%23fff%27/%3e%3c/svg%3e":
/*!******************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%23fff%27/%3e%3c/svg%3e ***!
  \******************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%23fff%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27rgba%280, 0, 0, 0.25%29%27/%3e%3c/svg%3e":
/*!***********************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27rgba%280, 0, 0, 0.25%29%27/%3e%3c/svg%3e ***!
  \***********************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27rgba%280, 0, 0, 0.25%29%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath d=%27M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z%27/%3e%3c/svg%3e":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath d=%27M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z%27/%3e%3c/svg%3e ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath d=%27M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%230c63e4%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%230c63e4%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%230c63e4%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23212529%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23212529%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23212529%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z%27/%3e%3c/svg%3e":
/*!************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z%27/%3e%3c/svg%3e ***!
  \************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e":
/*!*************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e ***!
  \*************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e":
/*!****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e ***!
  \****************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10h8%27/%3e%3c/svg%3e":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10h8%27/%3e%3c/svg%3e ***!
  \********************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10h8%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27m6 10 3 3 6-6%27/%3e%3c/svg%3e":
/*!**************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27m6 10 3 3 6-6%27/%3e%3c/svg%3e ***!
  \**************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27m6 10 3 3 6-6%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%280, 0, 0, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e":
/*!************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%280, 0, 0, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e ***!
  \************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%280, 0, 0, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%28255, 255, 255, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e":
/*!******************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%28255, 255, 255, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e ***!
  \******************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%28255, 255, 255, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%23198754%27 d=%27M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e":
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%23198754%27 d=%27M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%23198754%27 d=%27M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "./assets/street-front.jpg":
/*!*********************************!*\
  !*** ./assets/street-front.jpg ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "9878c880ace7f1a5afc2.jpg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/styles.scss */ "./src/scss/styles.scss");
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.esm.js");
/* harmony import */ var _about_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./about.js */ "./src/js/about.js");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./menu */ "./src/js/menu.js");
/* harmony import */ var _contact__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./contact */ "./src/js/contact.js");
/* harmony import */ var _assets_street_front_jpg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../../assets/street-front.jpg */ "./assets/street-front.jpg");
// get CSS stylesheet


// import Bootstrap JS


// import pages




// import img


// get the container
const container = document.getElementById('container');


// append header
const header = document.createElement('header');
header.style.background = `center / 100vw no-repeat url(${_assets_street_front_jpg__WEBPACK_IMPORTED_MODULE_5__})`;
container.appendChild(header);

// append h1 to header
const h1 = document.createElement('h1');
h1.innerText = 'Vana Eesti'
header.appendChild(h1);

// append subtitle to header
const subtitle = document.createElement('p');
subtitle.setAttribute('id', 'subtitle');
subtitle.innerText = 'Authentic Estonian cuisine'
header.appendChild(subtitle);


// nav bar
const nav = document.createElement('nav');
container.appendChild(nav);
const aboutLink = document.createElement('button');
aboutLink.setAttribute('id', 'about');
aboutLink.classList.add('btn-nav');
aboutLink.innerText = 'About';
nav.appendChild(aboutLink);
const menuLink = document.createElement('button');
menuLink.setAttribute('id', 'menu');
menuLink.classList.add('btn-nav');
menuLink.innerText = 'Menu';
nav.appendChild(menuLink);
const contactLink = document.createElement('button');
contactLink.setAttribute('id', 'contact');
contactLink.classList.add('btn-nav');
contactLink.innerText = 'Contact';
nav.appendChild(contactLink);


// append main
const main = document.createElement('main');
container.appendChild(main);

// ABOUT 
// append copy to main
const copy = document.createElement('p');
copy.setAttribute('id', 'copy');
copy.innerHTML = 'Vana Eesti (<span id="translation">Old Estonia</span>) is a restaurant in the old town hall square: enjoy the beautiful view from our wide windows! Perfect place for whom likes high quality wines from all around the world and tasty estonian dishes. We can offer you medieval and romantic atmosphere, and great service. The restaurant seats up to 40 guests.<br><br>Our food comes straight from farmers. We are situated in Raekoja plats, with the best view to the square.';
main.appendChild(copy);

// event lsiteneres on navlinks
aboutLink.addEventListener('click', _about_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
menuLink.addEventListener('click', _menu__WEBPACK_IMPORTED_MODULE_3__["default"]);
contactLink.addEventListener('click', _contact__WEBPACK_IMPORTED_MODULE_4__["default"]);

// append footer
const footer = document.createElement('footer');
container.appendChild(footer);
const footerText = `Copyright © Rachael Cole 2022. This project is&nbsp;<a href="https://github.com/jcrachael/restaurant/" target="_blank" alt="Vana Eesti Restaurant by jcrachael on Github">open source</a>.`
footer.innerHTML = footerText;




})();

/******/ })()
;
//# sourceMappingURL=main.js.map