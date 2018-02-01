let calculator = {
  calc: function () {
    'use strict';

// Main App Example

    var App = function () {

      // Global variables
      var leagues = window.leagues,
        leaguesDefault = window.leaguesDefault;

      // Helpers
      var helpers = {

        /*
        * Gets a random Int
        * takes 2 int parameters (min and max)
        */
        getRandomInt: function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /*
        * Gets a random Int
        * takes 4 parameters (speed, jquery element selector, offset, callback)
        */
        scrollToEl: function scrollToEl(speed, $to, offset, callback) {

          if ($to) {

            var offset = isNaN(offset) ? 0 : offset,
              speed = isNaN(speed) ? 500 : speed;

            $('html,body').animate({
              scrollTop: $to.offset().top - offset
            }, speed, function () {
              if (callback) {
                callback();
              }
            });
          }
        }

        // Splash screen
      };var splash = {

        // Animate the icons
        animate: function animate() {

          this.init();
          $('.footy-splash-screen').fadeIn();

          $('.footy-splash-screen img').each(function () {

            var duration = helpers.getRandomInt(1000, 3000),
              marginLeft = helpers.getRandomInt(0, 50);

            $(this).animate({
              top: '-250px',
              marginLeft: marginLeft
            }, duration);

            setTimeout(function () {
              // Reset everything
              $('.footy-splash-screen').fadeOut();
              $('.footy-splash-screen img').remove();
            }, 2200);
          });
        },

        // Initiate
        init: function init() {

          var icons = '';

          // Total number of icons
          // Less balls for mobile and tablet
          var noOfIcons = $(window).width() > 768 ? 80 : 40;

          for (var i = 0; i <= noOfIcons; i++) {

            // Random settings for each ball
            var left = helpers.getRandomInt(-150, $(window).width() + 150),
              bottom = helpers.getRandomInt(-150, $(window).height() + 150),
              width = helpers.getRandomInt(60, 120),
              spinClass = helpers.getRandomInt(0, 1) == 1 ? 'spin-left' : 'spin-right';

            icons += '<img class="' + spinClass + '" src="' + window.settings.splash + '" style="left:' + left + 'px; width:' + width + 'px; bottom: ' + bottom + 'px;" />';
          }

          // Append the icons
          $('.footy-splash-screen').html(icons);
        }

        // Calculator
      };var calculator = {

        // Check if there is a team selected
        // Returns (bolean)
        checkIfTeamSelected: function checkIfTeamSelected() {

          if ($('.teams__dropdown').attr('team') == 'none') {
            alert(window.settings.errors.team);
            helpers.scrollToEl(500, $('.form-section').eq(1), 50);
            return false;
          }

          return true;
        },

        // Update checkbox (extras)
        updateCheckbox: function updateCheckbox($this) {
          $this.find('.counter-checkbox').toggleClass('active');

          $('.footy-calculator__recepit').trigger('updatePrices');
        },

        // Update input quantity
        // Plus and Minus + -
        updateQty: function updateQty($this) {

          // Gets the current Qty
          var qty = parseInt($this.parent('.counter-holder').find('.counter-qty').text()) || 0;

          // Updates the qty
          var new_qty = $this.hasClass('counter-plus') ? qty + 1 : qty - 1;

          if (new_qty >= 0) {
            $this.parent('.counter-holder').find('.counter-qty').text(new_qty);

            // Trigger update receipt
            // using new qtys
            $('.footy-calculator__recepit').trigger('updatePrices');
          }
        },

        events: function events() {

          // Input clicks (plus and minus)
          $('.counter-plus, .counter-minus').click(function () {
            if (calculator.checkIfTeamSelected()) {
              calculator.updateQty($(this));
            }
          });

          // Checkbox clicks
          $('.form-checkbox').click(function () {
            if (calculator.checkIfTeamSelected()) {
              calculator.updateCheckbox($(this));
            }
          });

          // Click on compare CTA
          $('.footy-compareCta').click(function () {
            if ($(this).hasClass('active')) {

              $('.footy-calculator__recepit, .footy-calculator__form').removeClass('toggle-receipt');

              $('.footy-compare').show();

              $('.footy-compare').trigger('updateChart');

              helpers.scrollToEl(500, $('.footy-compare'), 0);

              // Animate splash screen
              splash.animate();
            } else {

              // Please complete the form
              alert(window.settings.errors.form);
              helpers.scrollToEl(500, $('.form-section').eq(1), 50);
            }
          });

          // Clicks on veil (hides the receipt)
          $('.form-veil').click(function () {
            $('.footy-calculator__recepit, .footy-calculator__form').removeClass('toggle-receipt');
          });

          // Clicks on receipt title (hides the receipt)
          $('.receipt-title').click(function () {
            $('.footy-calculator__recepit, .footy-calculator__form').removeClass('toggle-receipt');
          });
        }

        // Compare
      };var compare = {

        //Generate compare teams
        generateTheTeams: function generateTheTeams() {

          var htmlLeagues = '';
          for (var leagueName in window.leagues) {
            if (window.leagues.hasOwnProperty(leagueName)) {

              htmlLeagues += '<div class="compare-table league-' + leagueName + '" compare-table-league="' + leagueName + '">';

              $(leagues[leagueName]).each(function (i, teamDetails) {

                htmlLeagues += '<div class="compare-team" compare-league="' + leagueName + '" compare-team="' + i + '">';
                htmlLeagues += '<div class="compare-team-left">';
                htmlLeagues += '<img src="' + teamDetails.icon + '" alt="' + teamDetails.name + '" />';
                htmlLeagues += '<div class="compare-team-name">' + teamDetails.name + '</div>';
                htmlLeagues += '</div>';
                htmlLeagues += '<div class="compare-team-right">';
                htmlLeagues += '<div class="compare-price-tickets"></div>';
                htmlLeagues += '<div class="compare-price-extras"></div>';
                htmlLeagues += '<div class="compare-tooltip"></div>';
                htmlLeagues += '</div>';
                htmlLeagues += '<div class="clearfix"></div>';
                htmlLeagues += '</div>';
              });

              // Add the line guides that slipts the compare table
              htmlLeagues += '<div class="line-guide line-guide1"></div><div class="line-guide line-guide2"></div><div class="line-guide line-guide3"></div><div class="line-guide line-guide4"></div>';
              htmlLeagues += '</div>';
            }
          }
          // Append html
          $('.generate-compare-teams').html(htmlLeagues);
        },

        events: function events() {

          // Show tooltip
          $('.compare-team').hover(function () {
            $(this).addClass('show-tooltip');
          }, function () {
            $(this).removeClass('show-tooltip');
          });

          // Update the compare chart
          $('.footy-compare').on('updateChart', function (event, compareLeague) {

            // Select the team on compare
            var selectedTeam = $('.teams__dropdown').first().attr('team');

            // All prices
            var pricesArray = [];

            // Reset width of the chart bars
            $('.compare-price-tickets, .compare-price-extras').css('width', '0%');

            if (compareLeague) {

              var league = compareLeague;
            } else {

              league = $('.leagues__dropdown').attr('league') == '' ? false : $('.leagues__dropdown').attr('league');

              var formSelectedLeague = $('.form-section-body .leagues__dropdown').attr('league'),
                formSelectedTeam = $('.form-section-body .teams__dropdown ').attr('team'),
                placeholderCopy = $('.form-section-body .leagues__dropdown .dropdown-placeholder-name').text(),
                badgeSoruce = $('.form-section-body .leagues__dropdown img').attr('src');

              $('.compare-team').removeClass('active');
              if (league == formSelectedLeague) {
                //$('.compare-team[compare-team="' + formSelectedTeam + '"]').addClass('active');
                $('.compare-table[compare-table-league="' + league + '"]').find('.compare-team[compare-team="' + formSelectedTeam + '"]').addClass('active').prependTo('.compare-table[compare-table-league="' + league + '"]');
              }

              $('.compare-table-select .leagues__dropdown .dropdown-placeholder-name').text(placeholderCopy);

              $('.compare-table-select .leagues__dropdown').attr('league', league);

              $('.compare-table-select .dropdown-placeholder img').attr('src', badgeSoruce);

              $('.compare-table').hide();
              $('.compare-table.league-' + league).show();
            }

            var curency = league == 'irish' ? '&euro;' : '&pound;';
            var checkIfNaN = function checkIfNaN(no) {
              if (isNaN(no)) {
                return 0;
              } else {
                return parseFloat(no);
              };
            };

            $(leagues[league]).each(function (teamId) {

              var totalPrice = 0,
                qty = 0,
                extrasTotalPrice = 0,
                ticketsTotalPrice = 0,
                costProps = [{
                  name: 'adult',
                  category: 'tickets'
                }, {
                  name: 'child',
                  category: 'tickets'
                }, {
                  name: 'concession',
                  category: 'tickets'
                }, {
                  name: 'burger',
                  category: 'food'
                }, {
                  name: 'chips',
                  category: 'food'
                }, {
                  name: 'hotdogs',
                  category: 'food'
                }, {
                  name: 'pie',
                  category: 'food'
                }, {
                  name: 'pint',
                  category: 'food'
                }, {
                  name: 'tea',
                  category: 'food'
                }, {
                  name: 'program',
                  category: 'merchandise'
                }, {
                  name: 'scarf',
                  category: 'merchandise'
                }, {
                  name: 'shirt',
                  category: 'merchandise'
                }],
                thisPrices = $(this)[0].prices;

              // Calculate prices * qty
              $(costProps).each(function (i, prop) {
                if ($('.inpt-' + prop.name).hasClass('showit')) {

                  // QTY to multiply with the price
                  qty = parseInt($('#inpt-' + prop.name + ' .counter-qty').text());

                  if (prop.category == 'tickets') {
                    ticketsTotalPrice += checkIfNaN(thisPrices[prop.category][prop.name]) * qty;
                  } else {
                    extrasTotalPrice += checkIfNaN(thisPrices[prop.category][prop.name]) * qty;
                  }
                }
              });

              // Parking extras
              if ($('.receipt-item-entry.parking').hasClass('showit')) {
                extrasTotalPrice += checkIfNaN($(this)[0].prices.extras.parking);
              }

              // The total price for tickets + extras
              totalPrice = parseFloat(ticketsTotalPrice) + parseFloat(extrasTotalPrice);

              // Add all the prices to array
              pricesArray.push({
                totalPrice: checkIfNaN(totalPrice),
                ticketsTotalPrice: parseFloat(checkIfNaN(ticketsTotalPrice)),
                extrasTotalPrice: parseFloat(checkIfNaN(extrasTotalPrice))
              });
            });

            if (pricesArray) {
              var parseNumber = function parseNumber(x) {
                return parseFloat(x).toFixed(0);
              };

              // Update the chart legend line quides


              // Get the max price to create the chart legends
              var max = Math.max.apply(Math, pricesArray.map(function (o) {
                return o.totalPrice;
              }));
              var maxPrice = max;

              $('.line-guide-legend1').html(curency + '0');
              $('.line-guide-legend2').html(curency + parseNumber(maxPrice / 3));
              $('.line-guide-legend3').html(curency + parseNumber(maxPrice / 2));
              $('.line-guide-legend4').html(curency + parseNumber(maxPrice));

              // Animate the chart
              $(pricesArray).each(function (teamId, prices) {

                var ticketsPercentage = parseFloat(prices.ticketsTotalPrice) / maxPrice * 100,
                  extrasPercentage = parseFloat(prices.extrasTotalPrice) / maxPrice * 100;

                if (!isNaN(ticketsPercentage) && !isNaN(extrasPercentage)) {

                  $('.compare-team[compare-team="' + teamId + '"][compare-league="' + league + '"]').show().find('.compare-price-tickets').width(parseFloat(ticketsPercentage).toFixed(2) + '%');

                  $('.compare-team[compare-team="' + teamId + '"][compare-league="' + league + '"]').show().find('.compare-price-extras').width(parseFloat(extrasPercentage).toFixed(2) + '%');

                  $('.compare-team[compare-team="' + teamId + '"][compare-league="' + league + '"]').find('.compare-tooltip').html('Tickets: <b>' + curency + parseFloat(prices.ticketsTotalPrice).toFixed(2) + '</b>&nbsp; Extras: <b>' + curency + parseFloat(prices.extrasTotalPrice).toFixed(2) + '</b>');
                }
              });
            }
          });
        }

        // Dropdowns
      };var dropdowns = {

        // Cache the teams dropdown placeholder
        // the icon and the 'Please select a team' copy
        cachePlaceholderTeam: $('.teams__dropdown .dropdown-placeholder-name').text(),
        cachePlaceholderTeamIcon: $('.teams__dropdown .dropdown-placeholder img').attr('src'),

        // Generate the leagues dropdowns
        generateLeaguesOptions: function generateLeaguesOptions() {

          var html = '';
          html += '<div class="dropdown-placeholder footy-placeholder">';
          html += '<img src="' + leaguesDefault.english.icon + '"><span class="dropdown-placeholder-name">' + leaguesDefault.english.name + '</span>';
          html += '</div>';
          html += '<div class="dropdown-main-options footy-options">';

          // TODO: Loop here so that is less verbose
          html += '<span league="english" badge="' + leaguesDefault.english.icon + '" class="calculator-options-leagues">';
          html += '<img src="' + leaguesDefault.english.icon + '">' + leaguesDefault.english.name + '';
          html += '</span>';
          html += '<span league="irish" badge="' + leaguesDefault.irish.icon + '" class="calculator-options-leagues">';
          html += '<img src="' + leaguesDefault.irish.icon + '">' + leaguesDefault.irish.name + '';
          html += '</span>';
          html += '<span league="scottish" badge="' + leaguesDefault.scottish.icon + '" class="calculator-options-leagues">';
          html += '<img src="' + leaguesDefault.scottish.icon + '">' + leaguesDefault.scottish.name + '';
          html += '</span>';
          // html += '<span league="wales" badge="' + leaguesDefault.wales.icon + '" class="calculator-options-leagues">';
          // html += '<img src="' + leaguesDefault.wales.icon + '">' + leaguesDefault.wales.name + '';
          html += '</span>';

          html += '</div>';

          // Add the html .leagues__dropdown
          $('.leagues__dropdown').html(html);
        },

        // Generate the teams dropdowns
        // on DOM load and also everytime the league is changed
        generateTeamsOptions: function generateTeamsOptions(selectedLeague, callback) {

          var that = this;
          var teamDropdowns = '<div class="dropdown-main-options footy-options">';

          $(leagues[selectedLeague]).each(function (i, data) {
            teamDropdowns += '<span team="' + i + '" badge="' + $(this)[0].icon + '" class="calculator-options-teams">';
            teamDropdowns += '<img src="' + $(this)[0].icon + '" /> ' + $(this)[0].name + '</span>';
          });

          teamDropdowns += '</div>';

          $('.teams__dropdown').attr('team', 'none');

          $('.teams__dropdown .dinamic-dropdown').html(teamDropdowns);

          // Default placeholder
          // for the teams dropdowns
          // 'Please select..' dropdown
          $('.teams__dropdown .dropdown-placeholder-name').text(that.cachePlaceholderTeam);

          $('.teams__dropdown .dropdown-placeholder img').attr('src', that.cachePlaceholderTeamIcon);

          if (callback) {
            // Callback
            callback();
          }
        },

        events: function events() {

          var that = this;

          $(document)

          // Close dropdowns on clicks outside
            .on('click', function (event) {

              $('.footy-dropdown').removeClass('show');
            })

            // Click on the dropdown to toggle options
            .on('click', '.footy-placeholder', function (event) {

              // Important to stop propagation
              // A bit risky - needs testing in older browsers
              event.preventDefault();
              event.stopPropagation();

              if ($(this).closest('.footy-dropdown').hasClass('show')) {

                $(this).closest('.footy-dropdown').removeClass('show');
              } else {

                // If there are more than two open
                if ($('.footy-dropdown').length > 1) {
                  $('.footy-dropdown').removeClass('show');
                }

                $(this).closest('.footy-dropdown').toggleClass('show');
              }
            })

            // Click on a dropdown option
            .on('click', '.footy-options span', function () {

              var selectedLeague = $(this).attr('league') || false,
                selectedTeam = $(this).attr('team') || false,
                placeholderCopy = $(this).text(),
                badgeSoruce = $(this).attr('badge') || false;

              $(this).closest('.footy-dropdown').removeClass('show');

              // Calculator dropdowns (TEAMS)
              // Teams dropdown
              if ($(this).hasClass('calculator-options-teams')) {

                $(this).closest('.footy-dropdown').find('.dropdown-placeholder-name').text(placeholderCopy);

                $(this).closest('.footy-dropdown').attr('team', selectedTeam);

                $(this).closest('.footy-dropdown').find('.footy-placeholder img').attr('src', badgeSoruce);
              }

              // Selected using the compare form
              // Its important that this function exists at the end (return;)
              // So that the next procedure wont trigger
              if ($(this).closest('.leagues__dropdown').parent('.compare-table-select').length > 0) {

                // The form selected League and Team
                var formSelectedLeague = $('.form-section-body .leagues__dropdown').attr('league');
                var formSelectedTeam = $('.form-section-body .teams__dropdown ').attr('team');

                $('.compare-team').removeClass('active');
                if (selectedLeague == formSelectedLeague) {
                  $('.compare-team[compare-team="' + formSelectedTeam + '"]').addClass('active');
                }

                $(this).closest('.leagues__dropdown').find('.dropdown-placeholder-name').text(placeholderCopy);

                $(this).closest('.leagues__dropdown').attr('league', selectedLeague);

                $(this).closest('.leagues__dropdown').find('.footy-placeholder img').attr('src', badgeSoruce);

                $('.compare-table').hide();
                $('.compare-table.league-' + selectedLeague).show();

                $('.footy-compare').trigger('updateChart', selectedLeague);

                // IMPORTANT
                // EXIT fN
                return;
              }

              // League dropdown
              if ($(this).hasClass('calculator-options-leagues')) {

                $('.box-select, .leagues__dropdown').find('.dropdown-placeholder-name').text(placeholderCopy);

                $('.box-select, .leagues__dropdown').attr('league', selectedLeague);

                $('.box-select, .leagues__dropdown').find('.footy-placeholder img').attr('src', badgeSoruce);

                $('.footy-hero__box .league, .compare-table').hide();
                $('.footy-hero__box .league-' + selectedLeague + ', .compare-table.league-' + selectedLeague).show();

                // Create the teams dropdown again
                dropdowns.generateTeamsOptions(selectedLeague);
                // Generate new pins again
                hero.generatePins(selectedLeague);
                // Animate the teams boxes
                hero.animateBoxesChange(selectedLeague);
              }

              // Update Receipt
              $('.footy-calculator__recepit').trigger('updatePrices');
            });
        }

        // Hero
      };var hero = {

        // Animate team boxes
        animateBoxesChange: function animateBoxesChange(league) {

          // Remove the active class
          $('.league__team').removeClass('show');

          // Decide if we need to animate all the leagues or just the selected one
          // If no parameter is set thi this Fn (animateBoxesChange()) then it will just animate all the teams
          // if we give it a league string parameter, then it will just animate that one.
          // This is because of the setTimeout function that might take a while to animate all the
          // teams until it reaches the last one..
          var $currentLeagues = league ? $('.league.league-' + league + ' .league__team') : $('.league__team');

          // Animate the teams inside the box
          $currentLeagues.each(function (i) {
            var $this = $(this);


            setTimeout(function () {
              $this.addClass('show');

            }, i * 25);
          });

          $('.generate-the-leagues').scrollTop(0);

        },

        // Add the pins on the map
        generatePins: function generatePins(league) {
          var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


          // Remove all pins (if existent)
          $('.team-map-pin').remove();

          // Generate new pins and append them to the map
          for (var leagueName in window.leagues) {
            if (window.leagues.hasOwnProperty(leagueName)) {
              $(leagues[leagueName]).each(function (i, pins) {

                var showClass = animate ? '' : 'show',
                  pin = '<div class="team-map-pin ' + showClass + '" team="' + i + '" league="' + leagueName + '"';
                pin += 'data-tooltip-content="#' + leagueName + i + '"';
                pin += 'style="left:' + pins.pointer.left + '%; top:' + pins.pointer.top + '%;">';

                if (leagueName == league) {
                  pin += '<img src="' + window.settings.pins.orange + '" />';
                } else {
                  pin += '<img src="' + window.settings.pins.grey + '" />';
                }

                // Generate tooltip content
                // for tooltipster to use
                pin += '<div class="tooltip_templates">';
                pin += '<div id="' + leagueName + i + '">';
                pin += '<div class="tooltip-pin-content">';
                pin += '<span><img src="' + pins.icon + '" />';
                pin += pins.name + '</span>';
                pin += '<div class="calculateMatchCta">CALCULATE YOUR<br />MATCH DAY</div>';
                pin += '</div>';
                pin += '</div>';
                pin += '</div>';

                pin += '</div>';

                // Append pin
                $('.footy-hero__map').append(pin);
              });
            }
          }

          // Init tooltipster
          $('.team-map-pin').tooltipster({
            trigger: 'custom',
            interactive: true,
            timer: 0
          });

          if (animate) {
            // Animate the teams inside the box
            $('.team-map-pin').each(function (i) {
              var $this = $(this);
              setTimeout(function () {
                $this.addClass('show');
              }, i * 10);
            });
          }
        },

        //Generate hero box teams
        generateTheTeams: function generateTheTeams() {

          var htmlLeagues = '';
          for (var leagueName in window.leagues) {
            if (window.leagues.hasOwnProperty(leagueName)) {

              htmlLeagues += '<div class="league league-' + leagueName + '" league="' + leagueName + '">';

              $(leagues[leagueName]).each(function (i, teamDetails) {
                htmlLeagues += '<div class="league__team" team="' + i + '">';
                htmlLeagues += '<div class="team-inner">';
                htmlLeagues += '<img src="' + teamDetails.icon + '" alt="' + teamDetails.name + '" />' + teamDetails.name + '';
                htmlLeagues += '</div>';
                htmlLeagues += '</div>';
              });

              htmlLeagues += '<div class="clearfix"></div>';
              htmlLeagues += '</div>';
            }
          }

          // Append the html
          $('.generate-the-leagues').html(htmlLeagues);

          // Animate the teams inside the box
          this.animateBoxesChange();
        },

        events: function events() {

          var that = this;

          // Create pins
          that.generatePins('english');

          // Clicks on scroll to form orange bar
          $('.footy-scrollsection').click(function () {
            helpers.scrollToEl(300, $('.footy-calculator__holder'));
          });

          // Clicks on teams box
          $('.footy-hero__box .league__team').click(function () {

            var selectedLeague = $('.footy-hero__box .footy-dropdown').attr('league'),
              selectedTeam = $(this).attr('team'),
              selectedTeamText = $(this).text().trim(),
              selectedTeamAttr = $(this).find('img').attr('src');

            dropdowns.generateTeamsOptions(selectedLeague, function () {

              // Show to map on desktops
              $('.footy-hero__map').show();

              $('.teams__dropdown').attr('team', selectedTeam);
              $('.teams__dropdown .footy-placeholder .dropdown-placeholder-name').text(selectedTeamText);
              $('.teams__dropdown .footy-placeholder img').attr('src', selectedTeamAttr);

              // Generate a fresh view of pins
              hero.generatePins(selectedLeague, false);

              // The current team selected (pin)
              var $teamPin = $('.team-map-pin[team="' + selectedTeam + '"][league="' + selectedLeague + '"]');

              // Remove the selected pin's show class
              // add the purple (selected) pin icon
              // and add z-index 99 so that it shows on top of the other ones
              $teamPin
              // trigger tooltipster show the pin
                .tooltipster('show')
                // remove the class 'show' to create a css animation
                // we will add it back a bit later bellow
                .removeClass('show')
                // z-index to show the pin on top of other ones
                // see London example - a lot of pins there...
                .css('z-index', '99')
                // find and select the img
                .find('img')
                // change the src to the active state icon
                .attr('src', window.settings.pins.purple);

              // Scroll to the middle of the screen
              // where the team pin is on the map
              var elOffset = $teamPin.offset().top,
                elHeight = $teamPin.height(),
                windowHeight = $(window).height(),
                offset = elHeight < windowHeight ? elOffset - (windowHeight / 2 - elHeight / 2) : elOffset;

              // Animate to the visible tooltip
              $('html,body').animate({ scrollTop: offset }, 500);

              // After 150ms animate in
              // the new active tooltip
              setTimeout(function () {
                $teamPin.addClass('show');
              }, 150);

              // Update the prices
              $('.footy-calculator__recepit').trigger('updatePrices');
            });
          });

          // Click on tooltip CTA
          $(document).on('click', '.calculateMatchCta', function () {
            helpers.scrollToEl(500, $('.footy-calculator__form'));
          });
        }

        // Receipt
      };var receipt = {

        initSticky: function initSticky() {

          // Sticks the receipt when scrolling up or down
          $('.footy-calculator__recepit').fixTo('.footy-calculator__holder', {
            className: 'isFixed',
            useNativeSticky: true,
            top: 0
          });

          // On resize
          // Remove the sticky
          $(window).resize(function () {

            if ($('body').innerWidth() <= 980) {

              $('.footy-calculator__recepit').addClass('footy-calculator__recepit-fixed').fixTo('stop').attr('style', '');

              $('.footy-calculator__holder').css('overflow', 'hidden');

              $('.footy-calculator__form').addClass('full-width');
            } else {

              $('.footy-calculator__recepit').removeClass('footy-calculator__recepit-fixed').fixTo('start');

              $('.footy-calculator__holder').attr('style', '');

              $('.footy-calculator__form').removeClass('full-width');
            }
          })

          // Trigger resize
            .resize();
        },

        events: function events() {

          // Update the prices
          // Inside the receipt
          $('.footy-calculator__recepit').on('updatePrices', function () {

            var total = 0,
              league = $('.leagues__dropdown').attr('league') == '' ? false : $('.leagues__dropdown').attr('league'),
              team = $('.teams__dropdown').attr('team') == 'none' ? false : $('.teams__dropdown').attr('team'),
              selectedTeam = leagues[league][team],
              selectedLeague = $('.leagues__dropdown .dropdown-placeholder-name').first().text(),
              selectedLeagueBadge = $('.leagues__dropdown .footy-placeholder img').first().attr('src'),
              curency = league == 'irish' ? '&euro;' : '&pound;';

            if (league) {

              $('.receipt-league img').attr('src', selectedLeagueBadge);
              $('.receipt-league-copy').text(selectedLeague);

              if ($('.teams__dropdown').attr('team') != 'none') {

                $('.receipt-item-team').show();
                $('.receipt-item-team-name').html('<img src="' + selectedTeam.icon + '" /> ' + selectedTeam.name);
              } else {

                $('.receipt-item-team').hide();
                $('.receipt-item').hide();

                // Reset curency and price if no team is selected
                $('.cost-total').html(curency + '0.00');
              }
            }

            if (team) {

              // Loop trought all the inputs
              // and set availability for each input
              $('.form-input').each(function () {

                var mainKey = $(this).closest('.form-section').attr('key'),
                  settingKey = $(this).attr('id').replace('inpt-', ''),
                  price = leagues[league][team].prices[mainKey][settingKey];

                if (isNaN(price)) {
                  $('#inpt-' + settingKey).addClass('notavailable');
                } else {
                  $('#inpt-' + settingKey).removeClass('notavailable');
                }
              });
            }

            if (team && league) {

              // Show the selected options in the receipt
              $('.form-input').each(function () {

                var qty = parseInt($(this).find('.counter-qty').text()),
                  id = $(this).attr('id'),
                  mainKey = $(this).closest('.form-section').attr('key'),
                  settingKey = $(this).attr('id').replace('inpt-', '');

                // for extras dropdowns
                if (mainKey == 'extras') {
                  if ($(this).find('.counter-checkbox').hasClass('active')) {
                    qty = 1;
                  } else {
                    qty = 0;
                  }
                }

                if (qty > 0) {

                  var price = selectedTeam.prices[mainKey][settingKey] * qty;

                  if (price >= 0) {

                    $('.' + id).addClass('showit');

                    $('.' + id).find('.receipt-item-price').html(curency + parseFloat(price).toFixed(2));

                    total += price;
                  } else {

                    $('.' + id).removeClass('showit');
                  }
                } else {

                  $('.' + id).removeClass('showit');
                }
              });

              // Show main option section
              $('.receipt-item').each(function () {

                // Except the team on the receipt
                if (!$(this).hasClass('receipt-item-team')) {

                  var count = 0;

                  $(this).find('.receipt-item-entry').each(function () {
                    if ($(this).hasClass('showit')) {
                      count++;
                    }
                  });

                  if (count > 0) {
                    $(this).show();
                  } else {
                    $(this).hide();
                  }
                }
              });

              // Calculate total
              $('.cost-total').html(curency + parseFloat(total).toFixed(2));
            }

            // If the GRAND total is more than 0
            // then highlight the main CTA to allow compare chart
            if (total > 0) {
              $('.footy-compareCta, .footy-receiptCta').addClass('active');
              // Update Chart
              $('.footy-compare').trigger('updateChart');
            } else {
              $('.footy-compareCta, .footy-receiptCta').removeClass('active');
              $('.footy-compare').hide();
            }
          });

          // Click on receipt CTA
          $('.footy-receiptCta').click(function () {

            if ($(this).hasClass('active')) {

              $('.footy-calculator__recepit, .footy-calculator__form').addClass('toggle-receipt');

              helpers.scrollToEl(500, $('.footy-calculator__recepit'));
            } else {

              alert(window.settings.errors.team);
              helpers.scrollToEl(500, $('.form-section').eq(1));
            }
          });
        }

        /*
        /*
        ** Init App
        */

        // Add teams (preselect to english)
      };dropdowns.generateTeamsOptions('english');

      // Add leagues options
      dropdowns.generateLeaguesOptions();

      // generate the teams inside the compare section
      compare.generateTheTeams();

      // generate the teams inside the hero
      hero.generateTheTeams();

      // Init sticky receipt
      receipt.initSticky();

      // Generate icons for splash
      splash.init();

      // BIND EVENTS
      hero.events();
      dropdowns.events();
      calculator.events();
      receipt.events();
      compare.events();
    }();
  }
};