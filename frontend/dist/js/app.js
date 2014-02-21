/* Samsung App */

var samsungApp = angular.module('samsungApp', [
  'ngAnimate',
  'ngSanitize'
  ])

  // API Url
  .constant('apiUrl', 'http://localhost:1337')

  // Config App
  .config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

  // Controller
  .controller('MainCtrl', ['$scope', '$http', 'apiUrl',
    function($scope, $http, apiUrl) {

      // Define default scope variables
      $scope.showForm = false;
      $scope.sent = false;
      $scope.imeiMsg = 'Bekijk de voorwaarden';
      $scope.giftMsg = 'conceiled';
      $scope.imeiFormLoading = false;
      $scope.claimFormLoading = false;

      // Fetch Gift
      $http.get(apiUrl + '/gift')
        .success(function(data, status, headers, config) {
          $scope.product = data.gift;
          $scope.product.thumbnail = data.gift.thumbnail || 'img/gift-image.png';
        });

      // IMEI check
      $scope.submitImei = function () {
        if (/^[0-9a-zA-Z]{15}$/.test($scope.imei)) {
          $scope.imeiFormLoading = true;
          $http.get(apiUrl + '/imei/' + $scope.imei)
            .success(function(data, status, headers, config) {
              $scope.imeiId = data.id;
              $scope.imeiFormLoading = false;
            })
            .error(function (err) {
              console.log(err);
              $scope.imeiFormLoading = false;
              $scope.imeiMsg = 'IMEI not valid.';
              $scope.imei = '';
            })
        } else {
          $scope.imeiMsg = 'IMEI not valid.';
        }
      };

      // Manage message depending on form visibility
      $scope.$watch('showForm', function () {
        if (!$scope.sent) {
          if ($scope.showForm) {
            $scope.giftMsg = 'revealed';
          } else {
            $scope.giftMsg = 'conceiled';
          }
        }
      });

      // Submit Form
      $scope.submitForm = function () {
        $scope.giftMsg = 'thanks';

        // Submit data
        $scope.candidate.imeiId = $scope.imeiId;

        $scope.claimFormLoading = true;
        $http.post(apiUrl + '/candidate', $scope.candidate)
          .success(function(data, status, headers, config) {
            $scope.claimFormLoading = false;
            $scope.candidate = '';
            $scope.showForm = false;
            $scope.sent = true;
          })
          .error(function(data) {
            $scope.claimFormLoading = false;
          });
      }
    }
  ])

  // Drag
  .directive('draggable', function () {
    return {
      controller: 'MainCtrl',
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

  // Scrolling events
  .directive('nav', function ($window) {
    return {
      controller: 'MainCtrl',
      restrict: 'A',
      link: function(scope, el, attrs) {
        $($window).scroll(function () {
          $(el).css('top', $window.scrollY );

          // Define cursor position
          var pc = $window.scrollY / ($(document).height() - $(window).height());
          $(el).find('#progress-bar .cursor').css('bottom', Math.max((100 - $(el).find('#progress-bar').height() * pc).toFixed(2), 0) + '%');
        });

        $(el).find('a').click(function (e) {
          e.preventDefault();
          var position = $($(this).attr('href')).position();
          $('html, body').animate({ scrollTop: position.top + 'px' });
        });

        scope.$watch('imeiId', function () {
          if (scope.imeiId) {
            var position = $('#gift').position();
            $('html, body').animate({ scrollTop: position.top + 'px' });
          }
        });
      }
    }
  })

  // Section min height
  .directive('section', function ($window) {
    return {
      restrict: 'A',
      link: function(scope, el, attrs) {
        $($window).resize(function () {
          el.css('min-height', $window.innerHeight + 'px');
        });
        el.css('min-height', $window.innerHeight + 'px');
      }
    }
  });