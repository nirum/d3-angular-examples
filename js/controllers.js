/*
 * Controllers
 */

angular.module('d3-100.controllers', [], function() {})

.controller('ListCtrl', function($scope) {
   $scope.visualizations = ["Linear Regression"];
})

.controller('Day1Ctrl', function($scope) {

		// svg parameters
		var width = 500, height = 500, margin = 50;

		// line parameters (y = mx + b)
		$scope.b = 0.3;
		$scope.m = 2;
		$scope.numPts = 20;

		// generate data
		var data = new Array($scope.numPts);
		for (var idx = 0; idx < $scope.numPts; idx++) {
				data[idx] = {
						x: idx/$scope.numPts,
						y: $scope.m*idx/$scope.numPts + $scope.b + (Math.random()-0.5)
				}
		}

		// build the scales
		var xScale = d3.scale.linear().domain([0,1]).range([margin,width-margin]);
		var yScale = d3.scale.linear().domain([0,2.5]).range([height-margin,margin]);

		// select our svg element, set up some properties
		var svg = d3.select("svg");
		svg.attr("width",width).attr("height",height);

		// add the trendline
		var line = svg.selectAll("line").data([{'p1': [0, $scope.b], 'p2': [1, $scope.m+$scope.b]}]);
		line.enter().append("line").attr("stroke","red").attr("stroke-width",2)
				.attr("x1", function(d) { return xScale(d.p1[0]) })
				.attr("y1", function(d) { return yScale(d.p1[1]) })
				.attr("x2", function(d) { return xScale(d.p2[0]) })
				.attr("y2", function(d) { return yScale(d.p2[1]) })

		// join with our data
		var points = svg.selectAll("circle").data(data);

		// enter (add circles)
		points.enter().append("circle")
				.attr("cx", function(d) {
						return xScale(d.x);
				})
				.attr("cy", function(d) {
						return yScale(d.y);
				})
				.attr("r", 5);

		// add Axes
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickValues([0,1]);
		svg.append("g").attr("class","axis")
				.attr("transform", "translate(0," + (height-margin) + ")")
				.call(xAxis);
		var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);
		svg.append("g").attr("class","axis")
				.attr("transform", "translate(" + margin + ",0)")
				.call(yAxis);

});
