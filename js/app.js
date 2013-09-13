/*
 * 100 d3 visualizations in 100 days
 */

angular.module('d3-angular', ['d3-angular.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/list.html', controller: 'ListCtrl'});

		for (var i = 1; i <= 7; i++) {
				$routeProvider.when('/viz' + i, {templateUrl: 'partials/viz' + i + '.html', controller: 'Viz' + i + 'Ctrl'});
		}

    $routeProvider.otherwise({redirectTo: '/'});
  }]);
