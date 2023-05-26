/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const val = Object.values(obj);
  return new proto.constructor(...val);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit checks.
 */

class Builder {
  constructor(selector) {
    this.counter = {
      pseudo: 0,
      id: 0,
      el: 0,
      res: '',
    };
    this.selector = selector;
  }

  check(order, tag) {
    if (this.counter[tag] > 0) {
      const errStr = 'Element, id and pseudo-element should not occur more then one time inside the selector';
      throw new Error(errStr);
    }
    const last = this.counter.res[this.counter.res.length - 1];
    if (last > order) {
      const errStr = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
      throw new Error(errStr);
    }
    this.counter.res += order;
  }

  stringify() {
    return this.selector;
  }

  id(idName) {
    this.check(2, 'id');
    this.counter.id += 1;
    this.selector = `${this.selector}#${idName}`;
    return this;
  }

  element(tag) {
    this.check(1, 'el');
    this.counter.el += 1;
    this.selector = `${this.selector}${tag}`;
    return this;
  }

  attr(attribute) {
    this.check(4, false);
    this.selector = `${this.selector}[${attribute}]`;
    return this;
  }

  class(className) {
    this.check(3, false);
    this.selector = `${this.selector}.${className}`;
    return this;
  }

  pseudoClass(pseudoClass) {
    this.check(5, false);
    this.selector = `${this.selector}:${pseudoClass}`;
    return this;
  }

  pseudoElement(pseudoEl) {
    this.check(6, 'pseudo');
    this.counter.pseudo += 1;
    this.selector = `${this.selector}::${pseudoEl}`;
    return this;
  }

  combine(firstSel, combineElm, secondSel) {
    this.selector = `${firstSel.stringify()} ${combineElm} ${secondSel.stringify()}`;
    return this;
  }
}

const cssSelectorBuilder = {

  combine(firstSel, combineElm, secondSel) {
    const item = new Builder('');
    return item.combine(firstSel, combineElm, secondSel);
  },

  element(tag, type = 'element') {
    if (this.selector) return this[type](tag);
    if (!this.selector) return new Builder('')[type](tag);
    return 0;
  },

  id(idName) {
    return this.element(idName, 'id');
  },

  class(className) {
    return this.element(className, 'class');
  },

  pseudoClass(pseudo) {
    return this.element(pseudo, 'pseudoClass');
  },

  attr(attribute) {
    return this.element(attribute, 'attr');
  },

  pseudoElement(pseudoElm) {
    return this.element(pseudoElm, 'pseudoElement');
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
