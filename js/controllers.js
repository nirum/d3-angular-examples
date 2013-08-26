/*
 * Controllers
 */

angular.module('d3-100.controllers', [], function () {})

  .controller('ListCtrl', function($scope) {
			$scope.visualizations = [
						"Linear Regression"
			];
	})

	.controller('Day1Ctrl', function($scope) {
			var par = d3.select("p");
			par.style("font-size","24px").transition().duration(500).style("font-size","30px").style("color","red");
			$scope.hello = 'Hi';
  });
