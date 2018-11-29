CKData.fetchData("MERGE Ponti").then((value) => {
    let jsonData = value;
    let data = getBridgeData(jsonData);

    var margin = {top: 10, right: 10, bottom: 100, left: 40},
        margin2 = {top: 430, right: 10, bottom: 20, left: 40},
        width = 750 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        height2 = 500 - margin2.top - margin2.bottom;

    var x = d3.scale.ordinal().rangeBands([0, width], .1),
        x2 = d3.scale.ordinal().rangeBands([0, width], .1),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom").tickValues([]),
        yAxis = d3.svg.axis().scale(y).orient("left");

    x.domain(data.map(function(d){ return d.Bridge}));
    y.domain([0, d3.max(data, function(d) { return d.Height;})]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    enter(data);
    updateScale(data);

    var subBars = context.selectAll('.subBar')
        .data(data);

    subBars.enter().append("rect")
        .classed('subBar', true)
        .attr(
            {
                height: function (d)
                {
                    return height2 - y2(d.Height);
                },
                width: function(d){ return x.rangeBand()},
                x: function(d) {

                    return x2(d.Bridge);
                },
                y: function(d)
                {
                    return y2(d.Height)
                }
            });

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);


    function brushed() {
        var selected = null;
        selected =  x2.domain()
            .filter(function(d){
                return (brush.extent()[0] <= x2(d)) && (x2(d) <= brush.extent()[1]);
            });

        var start;
        var end;

        if(brush.extent()[0] != brush.extent()[1])
        {
            start = selected[0];
            end = selected[selected.length - 1] + 1;
        } else {
            start = 0;
            end = data.length;
        }

        var updatedData = data.slice(start, end);

        update(updatedData);
        enter(updatedData);
        exit(updatedData);
        updateScale(updatedData)
    }

    function updateScale(data) {
        var tickScale = d3.scale.pow().range([data.length / 10, 0]).domain([data.length, 0]).exponent(.5);

        var brushValue = brush.extent()[1] - brush.extent()[0];
        if(brushValue === 0){
            brushValue = width;
        }

        var tickValueMultiplier = Math.ceil(Math.abs(tickScale(brushValue)));
        var filteredTickValues = data.filter(function(d, i){return i % tickValueMultiplier === 0}).map(function(d){ return d.Bridge});

        focus.select(".x.axis").call(xAxis.tickValues(filteredTickValues));
        focus.select(".y.axis").call(yAxis);
    }

    function update(data) {
        x.domain(data.map(function(d){ return d.Bridge}));
        y.domain([0, d3.max(data, function(d) { return d.Height;})]);

        var bars =  focus.selectAll('.bar')
            .data(data);
        bars
            .attr(
                {
                    height: function (d, i)
                    {
                        return height - y(d.Height);
                    },
                    width: function(d){
                        return x.rangeBand()
                    },
                    x: function(d) {

                        return x(d.Bridge);
                    },
                    y: function(d)
                    {
                        return y(d.Height)
                    }
                })

    }

    function exit(data) {
        var bars =  focus.selectAll('.bar').data(data);
        bars.exit().remove()
    }

    function enter(data) {
        x.domain(data.map(function(d){ return d.Bridge}));
        y.domain([0, d3.max(data, function(d) { return d.Height;})]);

        var bars =  focus.selectAll('.bar')
            .data(data);
        bars.enter().append("rect")
            .classed('bar', true)
            .attr(
                {
                    height: function (d, i)
                    {
                        return height - y(d.Height);
                    },
                    width: function(d){
                        return x.rangeBand()
                    },
                    x: function(d) {

                        return x(d.Bridge);
                    },
                    y: function(d)
                    {
                        return y(d.Height)
                    }
                })
    }

    /**
     * Parses through the jsonData and extracts bridge name and height
     * @param jsonData
     * @returns {*} An array of {Bridge name, Bridge height} objects
     */
    function getBridgeData(jsonData) {
        let data = [];
        let cumulativeHeight;

        for (var i = 0; i < jsonData.length; i++) {
            var datum = {};
            let height = parseFloat(jsonData[i]["Height Center (m)"]);

            // skip bridges with no height value and unreasonable heights
            if(height != 0 && height < 50) {

                if(i == 0) {
                    cumulativeHeight = height;
                } else {
                    cumulativeHeight += height;
                }

                datum.Bridge = i;
                datum.Height = cumulativeHeight;
                data.push(datum);
            }
        }
        return data;
    }


}, (reason) => {
    console.log(reason);
});
