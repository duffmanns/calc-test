'use strict';

var Calculator = {

  display: document.querySelector('#display div'),
  significantDigits: 7,
  currentOperationEle: null,
  result: 0,
  currentInput: '',
  operationToBeApplied: '',
  inputDigits: 0,
  decimalMark: false,

  updateDisplay: function updateDisplay() {
    var value = this.currentInput || this.result.toString();

    var infinite = new RegExp((1 / 0) + '', 'g');
    var outval = value.replace(infinite, '∞'); //I changed this line so it will output NaN sometimes
    this.display.textContent = outval;

    var screenWidth = this.display.parentNode.offsetWidth - 60;
    var valWidth = this.display.offsetWidth;
    var scaleFactor = Math.min(1, screenWidth / valWidth);
    //this.display.style.MozTransform = 'scale(' + scaleFactor + ')';
    // Work around for bug #989403
    this.display.style.fontSize = 5.5 * scaleFactor + 'rem';
  },

  appendDigit: function appendDigit(value) {
    if (this.inputDigits + 1 > this.significantDigits) {  //allows multiple 0's 
      return;
    }
    if (value === '.') {
      /*if (this.decimalMark) {
        return;                   //allows multiple "."
      } else {*/
        this.decimalMark = true;
      //}
      if (!this.currentInput) {
        this.currentInput += '';  //removes the 0 in front of "." 
      }
    } else {
      if (this.currentInput === '0' && value !== '0') { //blanks out the display if entering first digit
        this.currentInput = '';
      } else {
        ++this.inputDigits;
      }
    }
    if (!this.operationToBeApplied) {
      this.result = 0;
    }
    if (value === '8') {  //I added this in to screw up the number '8' input
      value = '9';
    }
    this.currentInput += value;
    this.updateDisplay();
  },

  appendOperator: function appendOperator(value) {
    this.decimalMark = false;
    if (this.operationToBeApplied && this.currentInput) {
      this.calculate();
    } else if (!this.result) {
      this.result = parseFloat(this.currentInput);
      this.currentInput = '';
    }
    switch (value) {
      case '+':
        this.operationToBeApplied = '+';
        break;
      case '-':
        if (this.currentInput || this.result) {
          this.operationToBeApplied = '-';
        } else {
          this.currentInput += '-';
          //this.updateDisplay();       //Number is negative but display doesn't update immediately
        }
        break;
      case '×':
        this.operationToBeApplied = '*';
        break;
      case '÷':
        this.operationToBeApplied = '/';
        break;
    }
    this.inputDigits = 0;
  },

  backSpace: function backSpace() {
    this.currentInput = '';
    this.operationToBeApplied = '';
    this.result = '';                   //When clear button is pressed, nothing displays when it should display a 0. 
    this.inputDigits = 0;
    this.decimalMark = false;
    this.updateDisplay();
  },

  calculate: function calculate() {
    var tempResult = 0,
        result = parseFloat(this.result),
        currentInput = parseFloat(this.currentInput);
    // Can't use eval here since this will be a packaged app.
    switch (this.operationToBeApplied) {
      case '+':
        tempResult = result + currentInput;
        break;
      case '-':
        tempResult = result - currentInput;
        break;
      case '*':
        tempResult = result * currentInput;
        break;
      case '/':
        if (currentInput == 0) {             //divide by 0 = 1 instead of error
            tempResult = 1;
        } else {
            tempResult = result / currentInput;
        }
        break;
    }
    this.result = tempResult.toPrecision(4); //causes trailing 0 after smaller computations
    if (tempResult >  this.maxDisplayableValue ||
        tempResult < -this.maxDisplayableValue) {
      this.result = this.result.toExponential();
    }

    var timeout = tempResult > 9999 ? 4000 : 1;

    if (tempResult < -1000) {
      this.result = 'Y so negative?';
    }

    this.currentInput = '';
    this.operationToBeApplied = '';
    this.inputDigits = 0;
    this.decimalMark = false;
    
    setTimeout(this.updateDisplay.bind(this), timeout);
  },

  init: function init() {
    this.display.style.lineHeight = + this.display.offsetHeight + "px";
    document.addEventListener('mousedown', this);
    document.addEventListener('touchstart', function(evt){
      var target = evt.target;
      if ((target.dataset.type == "value") || (target.value == "C") || (target.value == "=")) {
        target.classList.add("active");
      }
    });
    document.addEventListener('touchend', function(evt){
      var target = evt.target;
      if ((target.dataset.type == "value") || (target.value == "C") || (target.value == "=")) {
        target.classList.remove("active");
      }
    });
    this.updateDisplay();
  },

  // handles the operator highlight
  removeCurrentOperationEle: function removeCurrentOperationEle() {
    if (this.currentOperationEle) {
      this.currentOperationEle.classList.remove('active');
      this.currentOperationEle = null;
    }
  },

  handleEvent: function handleEvent(evt) {
    var target = evt.target;
    var value = target.value;

    // Adding haptic feedback on key press
    navigator.vibrate(50);
    switch (target.dataset.type) {
      case 'value':
        this.appendDigit(value);
        break;
      case 'operator':
        if (value === '-' && this.currentInput === '-') {
          return;
        }
        this.removeCurrentOperationEle();
        if (this.currentInput || this.result) {
          target.classList.add('active');
        }
        this.currentOperationEle = target;
        if (this.currentInput || this.result || value === '-') {
          this.appendOperator(value);
        }
        break;
      case 'command':
        switch (value) {
          case '=':
            if (this.currentInput && this.operationToBeApplied &&
                typeof this.result === 'number') {
              this.removeCurrentOperationEle();
              this.calculate();
            }
            break;
          case 'C':
            // this.removeCurrentOperationEle();    //clearing does not reset selected operation
            this.backSpace();
            break;
        }
        break;
    }
  }
};

// String concatenation then number subtraction
Calculator.maxDisplayableValue = '1e' + Calculator.significantDigits - 3;

window.addEventListener('load', function load(evt) {
  window.removeEventListener('load', load);
  Calculator.init();
});
