/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const reverse = (list: any) => Array.prototype.slice.call(list, 0).reverse();

/**
 * Performs right-to-left function composition
 *
 * @param {...Function} fns functions
 * @returns {Compose} composed function
 */
const compose = function () {
  for (
    var _len = arguments.length, fns = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    fns[_key] = arguments[_key];
  }
  return function (value: any) {
    let result = value;
    const reversedFns = reverse(fns);
    for (
      var _len2 = arguments.length,
        args = new Array(_len2 > 1 ? _len2 - 1 : 0),
        _key2 = 1;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2 - 1] = arguments[_key2];
    }
    for (let i = 0; i < reversedFns.length; i += 1) {
      const fn = reversedFns[i];
      result = fn(result, ...args);
    }
    return result;
  };
};

const castArray = (value: any) => {
  return Array.isArray(value) ? value : [value];
};

/**
 * Remove nil values from array
 *
 * @template T
 * @param {(T | null | undefined)[]} array
 * @returns {T[]} array without nils
 */
const compact = (array: unknown[]) => array.filter(Boolean);

/**
 * Merges style objects array
 *
 * @param {Object[]} styles style objects array
 * @returns {Object} merged style object
 */
const mergeStyles = (styles: any) =>
  styles.reduce((acc: any, style: any) => {
    const s = Array.isArray(style) ? flatten(style) : style;
    Object.keys(s).forEach((key) => {
      if (s[key] !== null && s[key] !== undefined) {
        acc[key] = s[key];
      }
    });
    return acc;
  }, {});

/**
 * Flattens an array of style objects, into one aggregated style object.
 *
 * @param {Object[]} styles style objects array
 * @returns {Object} flattened style object
 */
// @ts-expect-error TODO FIX THIS
export const flatten = compose(mergeStyles, compact, castArray);
