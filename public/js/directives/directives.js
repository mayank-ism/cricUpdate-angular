var cricUpdateDirectives = angular.module('cricUpdateDirectives', []);

cricUpdateDirectives.directive('resize', function($window) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      var winHeight = $window.innerHeight;
      var headerHeight = attrs.resize ? attrs.resize : 0;
      elem.css('height', winHeight - headerHeight + 'px');
    }
  };
});