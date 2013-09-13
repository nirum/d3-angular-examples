/*
 * Controllers
 */

angular.module('d3-angular.controllers', [], function() {})

.controller('ListCtrl', function($scope) {
   $scope.visualizations = [
				"Linear Regression",
				"Moving Dots",
				"Sine Wave",
				"Stock Data",
        "Random Walk",
				"Pie Chart"
		];
})

.controller('Viz1Ctrl', function($scope) {

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

})

.controller('Viz2Ctrl', function($scope) {

		// svg parameters
		var width = 500, height = 500, margin = 10;

		// select our svg element, set up some properties
		var svg = d3.select("svg");
		svg.attr("width",width).attr("height",height);

		// parameters
		var numPts = 20;
		$scope.frequency = 1;
		$scope.radius = 8;
		$scope.fillColor = '#aaccff';
		var data = new Array(numPts);

		// build the scales
		var xScale = d3.scale.linear().domain([0,1]).range([margin,width-margin]);
		var yScale = d3.scale.linear().domain([0,1]).range([height-margin,margin]);

		// randomly generate a bunch of points
		for (var idx = 0; idx < numPts; idx++) {
				data[idx] = { x: Math.random(), y: Math.random() };
		}

		var update = function() {

				// join to data
				var circles = svg.selectAll("circle").data(data);

				// update
				circles
						.transition().duration(500)
						.attr("cx", function(d) { return xScale(d.x) })
						.attr("cy", function(d) { return yScale(d.y) })
						.attr("fill", $scope.fillColor);

				// enter
				circles.enter().append("circle")
						.attr("cx", function(d) { return xScale(d.x) })
						.attr("cy", function(d) { return yScale(d.y) })
						.attr("fill", $scope.fillColor);

				// update + enter
				circles.attr("r",$scope.radius);

				// exit
				circles.exit().remove();

		}

		// get a random integer that is within the size of the array
		function getRandomInt() {
				return Math.floor(Math.random() * numPts);
		}

		// refresh random data point
		var refresh = function() {
				for (var idx = 0; idx < $scope.frequency; idx++) {
						data[getRandomInt()] = { x: Math.random(), y: Math.random() };
				}
		}

		// initialize the plot
		update();

		// start the timer
		setInterval(function() {
				refresh();
				update();
		}, 500);

})

.controller('Viz3Ctrl', function($scope) {

		// svg parameters
		var width = 500, height = 500, margin = 25;

		// select our svg element, set up some properties
		var svg = d3.select("svg");
		svg.attr("width",width).attr("height",height);

		// build the scales
		var xScale = d3.scale.linear().domain([0,1]).range([margin,width-margin]);
		var yScale = d3.scale.linear().domain([-1,1]).range([height-margin,margin]);

		// generate the sine wave
		$scope.color = "red";
		var numPts = 100;
		var data = new Array(numPts);
		for (var idx = 0; idx < numPts; idx++) {
				data[idx] = {
						x: idx/numPts,
						y: Math.sin(2*Math.PI*idx/numPts)
				}
		}

		var update = function() {

				// advance the wave
				var temp = data[0].y;
				for (var idx = 1; idx < numPts; idx++) {
						data[idx-1].y = data[idx].y;
				}
				data[numPts-1].y = temp;

				// update the path
				svg.selectAll("path").data(data)
						.transition().duration(100)
						.attr("d", lineFunction(data))
						.attr("stroke", $scope.color);

		}

		// sine function
		var lineFunction = d3.svg.line()
				.x(function(d) { return xScale(d.x); })
				.y(function(d) { return yScale(d.y); })
				.interpolate("basis");

		// draw the path
		svg.append("path")
				.attr("d", lineFunction(data))
				.attr("stroke", $scope.color)
				.attr("stroke-width", 2)
				.attr("fill", "none");

		// start the timer
		setInterval(function() {
				update();
		}, 20);

})

.controller('Viz4Ctrl', function($scope) {

		// parameters
		$scope.loading = true;
		var width = 500, height = 500, margin = 50;
		var barWidth = 90;
		var xScale, yScale;
		var symbols = new Array(4);

		// data properties
		$scope.properties = [
				{ name: "Price", slug: "price" },
				{ name: "Year High", slug: "yearHigh" },
				{ name: "Year Low", slug: "yearLow" },
				{ name: "Previous Close", slug: "previousClose" }
		];
		$scope.property = $scope.properties[0];
		$scope.change = function(option) {
				$scope.property = option;
				redraw();
		}

		// select our svg element, set up some properties
		var svg = d3.select("svg");
		svg.attr("width",width).attr("height",height);

		// get data
		var data = new Array(4);
		d3.json("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22YHOO%22%2C%22FB%22%2C%22YELP%22%2C%22MSFT%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json", function(error, json) {
				if(error) {
						return console.warn(error);
				}

				// format the data
				var json = json.query.results.quote;
				for (var idx = 0; idx < data.length; idx++) {
						data[idx] = {
								symbol: json[idx].Symbol,
								yearHigh: json[idx].YearHigh,
								yearLow: json[idx].YearLow,
								price: json[idx].AskRealtime,
								previousClose: json[idx].PreviousClose
						}
						symbols[idx] = json[idx].Symbol;
				}

				// get rid of the loading bar
				$scope.$apply(function() {
						$scope.loading = false;
				});

				// plot the data
				draw();
		});

		// plots data for the first time
		var draw = function() {

				// update scales
				var maxVal = Math.ceil(d3.max(data, function(d) { return d["yearHigh"] }));
				xScale = d3.scale.ordinal().domain(data.map(function(d) { return d.symbol; })).rangeRoundBands([width-0.1*margin,1.7*margin,1.7*margin]);

				yScale = d3.scale.linear().domain([0,maxVal]).range([height-margin,margin]);
				y			 = d3.scale.linear().domain([maxVal,0]).range([height-margin,margin]);

				// plot bars
				svg.selectAll("rect").data(data)
						.enter().append("rect")
						.attr("stroke", "black")
						.attr("stroke-width", 3)
						.attr("fill", "steelblue")
						.attr("x", function(d) { return xScale(d["symbol"]); })
						.attr("y", function(d) { return yScale(d[$scope.property.slug]) })
						.attr("width", barWidth)
						.attr("height", function(d) {return y(d[$scope.property.slug])-margin-3 });

				// add values
				svg.selectAll("text").data(data)
						.enter().append("text")
						.style("font-size", "22px")
						.attr("x", function(d) { return xScale(d["symbol"]); })
						.attr("y", function(d) { return yScale(d[$scope.property.slug])-10 } )
						.attr("dx", "0.7em")
						.text(function(d) { return d[$scope.property.slug]+"" });

				// Axes
				var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
				svg.append("g").attr("class","axis")
						.attr("transform", "translate(-8," + (height-margin) + ")")
						.call(xAxis);
				var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);
				svg.append("g").attr("class","axis")
						.attr("transform", "translate(" + 1.5*margin + ",0)")
						.call(yAxis);

				// Labels
				svg.append("text")
						.attr("x", width/2)
						.attr("y", height-5)
						.style("font-size", "22px")
						.attr("fill", "steelblue")
						.text("Company");
				svg.append("text")
						.attr("x",20)
						.attr("y", height/2)
						.style("font-size", "22px")
						.attr("fill", "steelblue")
						.text("$");

		}

		// redraws data
		var redraw = function() {

				// update bars
				svg.selectAll("rect").data(data)
						.transition()
						.duration(1000)
						.attr("y", function(d) { return yScale(d[$scope.property.slug]) })
						.attr("height", function(d) {return y(d[$scope.property.slug])-margin-3 });

				// update text
				svg.selectAll("text").data(data)
						.transition()
						.duration(1000)
						.attr("y", function(d) { return yScale(d[$scope.property.slug])-10 } )
						.text(function(d) { return d[$scope.property.slug] });

		}
})

.controller('Viz5Ctrl', function($scope) {

		// svg parameters
		var width = 500, height = 500, margin = 25;

		// select our svg element, set up some properties
		var svg = d3.select("svg");
		svg.attr("width",width).attr("height",height);

		// build the scales
		var xScale = d3.scale.linear().domain([0,1]).range([margin,width-margin]);
		var yScale = d3.scale.linear().domain([-20,20]).range([height-margin,margin]);

        // generate a random walk
        $scope.numTimesteps = 100;
        $scope.variance = 1;
        $scope.color = "#2ea";
        var data;
        var genWalk = function() {

            data = new Array($scope.numTimesteps);
            data[0] = { x: 0, y: 0 };

            for (var idx = 1; idx < $scope.numTimesteps; idx++) {
                data[idx] = {
                    x: idx/$scope.numTimesteps,
                    y: data[idx-1].y + d3.random.normal(0,$scope.variance)()
                }
            }
        }

		// line function
    var lineFunction = d3.svg.line()
				.x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); })
        .interpolate("basis");

    // control flow
    $scope.run = true;
    $scope.clear = function() {
				svg.selectAll("path").remove();
    }

		// start the timer
		setInterval(function() {

            if ($scope.run) {
                // generate data
                genWalk();

                // make old path gray
                svg.selectAll("path").transition().duration(500).attr("stroke","#ddd");

								// draw the new path
                svg.append("path")
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0)
                    .transition().duration(500)
                    .attr("d", lineFunction(data))
                    .attr("stroke", $scope.color)
                    .attr("stroke-opacity", 1)
                    .attr("stroke-width", 2);
            }

		}, 1000);
})

.controller('Viz6Ctrl', function($scope) {

		// svg parameters
		var width = 500, height = 500, margin = 25, radius = Math.min(width, height) / 2;
    var color = d3.scale.category20c();     //builtin range of colors

		// select our svg element, set up some properties
		var svg = d3.select("svg")
				.attr("width",width).attr("height",height)
				.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		// set up the data
		data = [ { name: "Lenna", value: 24 }, { name: "Ada", value: 47 }, { name: "Julia", value: 78 } ];

		// build the arc
		var arc = d3.svg.arc()
				.outerRadius(radius - 10)
				.innerRadius(0);

		// and the pie
		var pie = d3.layout.pie()
				.sort(null)
				.value(function(d) { return d.value; });

		var g = svg.selectAll(".arc")
				.data(pie(data))
				.enter().append("g")
				.attr("class", "arc");

		g.append("path")
				.attr("d", arc)
				.style("fill", function(d) { return color(d.data.name); });

		g.append("text")
				.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.style("font-size", "28px")
				.attr("fill", "#222")
				.text(function(d) { return d.data.name; });
})

.controller('Viz7Ctrl', function($scope) {

		// svg parameters
		var width = 500, height = 500, margin = 25;

		// select our svg element, set up some properties
		var svg = d3.select("svg");
		svg.attr("width",width).attr("height",height);

		// build the scales
		var xScale = d3.scale.linear().domain([0,10]).range([margin,width-margin]);
		var yScale = d3.scale.linear().domain([-20,20]).range([height-margin,margin]);

});
