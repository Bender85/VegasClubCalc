// 'use strict';

var main = {
  mainFunc: function () {
  //   trigger showHide
    $('.openTrigger').on('click', function () {
      $('.expandBox').toggleClass('expandBoxActive');
    });

    $('.compareListItem').tooltipster({
      animation: 'fade',
      delay: 200,
      theme: 'tooltipster-light',
      side: ['right']
    });

    // $('.flex__container--item-right').fixTo('.flex__container', {
    //   className: 'isFixed',
    //   useNativeSticky: true,
    //   top: 0
    // });
    // $('.flex__container--item-right').fixTo('refresh');
  }
};

export default main;