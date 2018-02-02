// You can write a call and import your functions in this file.
//
// This file will be compiled into app.js and will not be minified.
// Feel free with using ES6 here.

// import DE from './modules/helpers';
import main from './modules/main';
import customSelect from './modules/customSelect';
import calculator from './modules/calculator';

( ($) => {
  'use strict';

  // When DOM is ready
  $(() => {
    // DE.dotsEffect();
    customSelect.selectFunc();
    calculator.calc();
    main.mainFunc();
  });

})(jQuery);