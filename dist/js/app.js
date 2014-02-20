var samsungApp = angular.module('samsungApp', [
  'ngAnimate',
  'ngSanitize'
  ])

  .controller('ImeiCtrl', ['$scope', '$http',
    function($scope, $http) {

      $scope.msg = 'Bekijk de voorwaarden';

      // Fetch data
      $http.get('api/')
        .success(function(data, status, headers, config) {
          // $scope.cities = data;
        })
        .error(function(data) {
          // console.error('Error fetching datas:', data);
        });

      $scope.submit = function () {
        if (/^[0-9a-zA-Z]{15}$/.test($scope.imei)) {
          $scope.msg = 'IMEI valid!';
        } else {
          $scope.msg = 'IMEI not valid.';
        }
      };
    }
  ])

  .controller('GiftCtrl', ['$scope', '$http',
    function($scope, $http) {

      // Define default scope variables
      $scope.showForm = false;
      $scope.loading = true;
      $scope.sent = false;

      var defaultMessage = 'Gebruik je muis of vinger om de bovenkant van de doos eraf te tillen.<br /> Hieronder zit jouw cadeau!';
      $scope.message = defaultMessage;

      $scope.$watch('showForm', function () {
        var product = 'product';
        if (!$scope.sent) {
          if ($scope.showForm) {
            $scope.message = 'Bedankt! Je hebt ' + product + ' geclaimed.<br /> Houd je mail in de gaten voor een bevestiging!';
          } else {
            $scope.message = defaultMessage;
          }
        }
      });

      $scope.submit = function () {
        var product = 'product';
        $scope.message = 'Bedankt! Je hebt ' + product + ' geclaimed.<br /> Houd je mail in de gaten voor een bevestiging! <br /><br /> Je hebt gekregen een ' + product + '!<br /> Vul je gegevens in om de prijs te ontvangen.'
        $scope.sent = true;
        $scope.showForm = false;
      }

      // Fetch data
      // $http.post($scope.user)
      //   .success(function(data, status, headers, config) {
      //     $scope.message = 'Success.';
      //   })
      //   .error(function(data) {
      //     $scope.message = 'Something goes wrong.'
      //   });
    }
  ])

  .directive('draggable', function () {
    return {
      controller: 'GiftCtrl',
      restrict: 'A',
      link: function(scope, el, attrs) {
        var draggie = new Draggabilly(el[0]);

        draggie.on( 'dragMove', function (instance, event, pointer) {
          if (!scope.sent) {
            if (instance.position.x > 50) {
              scope.showForm = true;
            } else {
              scope.showForm = false;
            }
            scope.$apply();
          }
        });
      }
    }
  })

  .directive('nav', function ($window) {
    return {
      restrict: 'A',
      link: function(scope, el, attrs) {
        $($window).scroll(function () {
          $(el).css('top', $window.scrollY );

          // Cursor
          var pc = $window.scrollY / ($(document).height() - $(window).height());
          $(el).find('#progress-bar .cursor').css('bottom', Math.max((100 - $(el).find('#progress-bar').height() * pc).toFixed(2), 0) + '%');
        });

        $(el).find('a').click(function (e) {
          e.preventDefault();
          var position = $($(this).attr('href')).position();
          $('html, body').animate({ scrollTop: position.top + 'px' });
        });
      }
    }
  })

  .directive('section', function ($window) {
    return {
      restrict: 'A',
      link: function(scope, el, attrs) {
        $($window).resize(function () {
          el.css('height', $window.innerHeight + 'px');
        });
        el.css('height', $window.innerHeight + 'px');
      }
    }
  })

  // .directive('scrollSpy', function($window) {
  //   return {
  //     restrict: 'A',
  //     controller: function($scope) {
  //       $scope.spies = [];
  //       $scope.test = 0;
  //       setTimeout(function(){console.log('$scope.test changed');$scope.test = 8}, 1000)
  //       this.addSpy = function(spyObj) {
  //         console.log('scroll added');
  //         $scope.spies.push(spyObj);
  //       };
  //     },
  //     link: function(scope, elem, attrs) {
  //       var spyElems = [];
  //       console.log(scope);
  //       scope.$watch('spies', function(spies) {
  //         console.log('$watch', spies);
  //         for (var _i = 0; _i < spies.length; _i++) {
  //           var spy = spies[_i];
  //           if (spyElems[spy.id] == null) {
  //             spyElems[spy.id] = (elem.find('#' + spy.id));
  //           }
  //         }
  //       }, true);

  //       $($window).scroll(function() {
  //         console.log(spyElems);
  //         var highlightSpy, pos, spy, _i, _len, _ref;
  //         highlightSpy = null;
  //         _ref = scope.spies;

  //         for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  //           spy = _ref[_i];
  //           spy.out();
  //           console.log('spy',spy);
  //           spyElems[spy.id] = spyElems[spy.id].length === 0 ? elem.find('#' + spy.id) : spyElems[spy.id];
  //           if (spyElems[spy.id].length !== 0) {
  //             if ((pos = spyElems[spy.id].offset().top) - $window.scrollY <= 0) {
  //               spy.pos = pos;
  //               if (highlightSpy == null) {
  //                 highlightSpy = spy;
  //               }
  //               if (highlightSpy.pos < spy.pos) {
  //                 highlightSpy = spy;
  //               }
  //             }
  //           }
  //         }
  //         return highlightSpy != null ? highlightSpy["in"]() : void 0;
  //       });
  //     }
  //   };
  // })

  // .directive('spy', function() {
  //   return {
  //     restrict: "A",
  //     require: "^scrollSpy",
  //     link: function(scope, elem, attrs, scrollSpy) {
  //       console.log("scrollSpy," , scrollSpy);
  //       if (attrs.spyClass == null) {
  //         attrs.spyClass = "active";
  //       }
  //       // elem.click(function() {
  //       //   scope.$apply(function() {
  //       //     // $location.hash(attrs.spy);
  //       //   });
  //       // });
  //       scrollSpy.addSpy({
  //         id: attrs.spy,
  //         in: function() {
  //           elem.addClass(attrs.spyClass);
  //         },
  //         out: function() {
  //           elem.removeClass(attrs.spyClass);
  //         }
  //       });
  //     }
  //   };
  // });

    // .animation('.animate',
    //   function () {
    //     return {
    //       enter: function(element, done) {
    //         console.log('show');
    //         done();
    //       }
    //     }
    //   });