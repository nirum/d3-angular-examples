/*
 * 100 d3 visualizations in 100 days
 */

angular.module('d3-100', ['d3-100.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/list.html', controller: 'ListCtrl'});

		for (var i = 1; i <= 1; i++) {
				$routeProvider.when('/day' + i, {templateUrl: 'partials/day' + i + '.html', controller: 'Day' + i + 'Ctrl'});
		}

    $routeProvider.otherwise({redirectTo: '/'});
  }]);
