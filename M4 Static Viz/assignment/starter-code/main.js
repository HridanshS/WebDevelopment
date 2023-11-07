

let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2, 3, 4],
        svgUpdate: drawAQIValuesGraph1
    },
    {
        activeVerse: 2,
        activeLines: [1, 2, 3, 4],
        svgUpdate: drawAggFreqGraph2
    },
    {
        activeVerse: 3,
        activeLines: [1, 2, 3, 4],
        svgUpdate: drawAQIValuesGraph1
    },
    {
        activeVerse: 4,
        activeLines: [1, 2, 3, 4]
    },
    {
        activeVerse: 5,
        activeLines: [1, 2, 3, 4]
    },
    {
        activeVerse: 6,
        activeLines: [1, 2, 3, 4]
    }
]


let chart;
let chartWidth;
let chartHeight;

// Declare both scales too
let xScale;
let yScale;


const width = 600;
const height = 400;


let svg = d3.select("#svg");
let keyframeIndex = 0;

document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);



let Graph1Data;
let AggFreqData; //Graph2

async function loadData() {
    
    await d3.csv("../../data/pivoted_air_pollution_data.csv").then(data => { //the original dataset was pivoted to generate this dataset. It is a summarized version where each row represents one country
        Graph1Data = data;
        //console.log(Graph1Data);
        //console.log(typeof(Graph1Data[0].Num_Occurrences));
        //console.log(typeof(parseInt(Graph1Data[0].Num_Occurrences)));
    });

    await d3.csv("../../data/graph2_pivoted_air_pollution_data.csv").then(data => { //the original dataset was pivoted to generate this dataset. It is a summarized version where each row represents one country
        AggFreqData = data;
        //console.log(AggFreqData);
    });
}

/* Implementing filters:
1) Maintain two vars - Graph1Data, FilteredData
2) Function: When changes made to filter, FilteredData should be updated with Graph1Data, and then FilteredData should be filtered based on range selected
3) then plot the FilteredData
*/


function findMax(arg1, arg2, arg3) {
    return Math.max(arg1, arg2, arg3);
}

function initialiseSVG(){
    svg.attr("width",width);
    svg.attr("height",height);

    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;

    chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        xScale = d3.scaleBand()
        .domain([])
        .range([0, chartWidth])
        .padding(0.1);

    yScale = d3.scaleLinear()
        .domain([])
        .nice()
        .range([chartHeight, 0]);

    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "white")
        .text("");
}


function drawAQIValuesGraph1() {
    updateChart1(Graph1Data, "Various AQI Values by No. of Occurrences of Country in Dataset");
}

function drawAggFreqGraph2() {
    updateChart2(AggFreqData, "Aggregate Frequency of AQI Values in Cities");
}



/*function drawBarChart(data, title) {
    svg.selectAll("*").remove();

    // Define the margin so that there is space around the vis for axes and labels
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    let chartWidth = width - margin.left - margin.right;
    let chartHeight = height - margin.top - margin.bottom;

    // Create a 'group' variable to hold the chart, these are used to keep similar items together in d3/with svgs
    let chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define an x scale which will assign a spot on the x axis to each of the unique values of colour in the dataset
    let xScale = d3.scaleBand()
        .domain(data.map(d => d.colour))
        .range([0, chartWidth])
        .padding(0.1);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([chartHeight, 0]);

    // Create bars


    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "white")
        .text(title);
}*/




/*function updateBarChart(data, title = "") {
    xScale.domain(data.map(d => d.colour));
    yScale.domain([0, d3.max(data, d => d.count)]).nice();

    const bars = chart.selectAll(".bar")
        .data(data, d => d.colour);

    bars.exit()
        .remove();

    bars.attr("x", d => xScale(d.colour))
        .attr("y", d => yScale(d.count))
        .attr("height", d => chartHeight - yScale(d.count));

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.colour))
        .attr("y", chartHeight) // Set initial y position below the chart so we can't see it
        .attr("width", xScale.bandwidth())
        .attr("height", 0) // Set initial height to 0 so there is nothing to display
        .attr("fill", "#FFDAB9") //Changed colour to Peachpuff from 999
        .transition() // Declare we want to do a transition
        .duration(1000) // This one is going to last for one second
        .attr("y", d => yScale(d.count)) // Update the y value so that the bar is in the right location vertically
        .attr("height", d => chartHeight - yScale(d.count)); // Update the height value

    chart.select(".x-axis")
        .call(d3.axisBottom(xScale));

    chart.select(".y-axis")
        .call(d3.axisLeft(yScale));

    if (title.length > 0) {
        svg.select("#chart-title")
            .text(title);
    }
}*/

function forwardClicked() {
    // Make sure we don't let the keyframeIndex go out of range
  if (keyframeIndex < keyframes.length - 1) {
    keyframeIndex++;
    drawKeyframe(keyframeIndex);
  }
}

function backwardClicked() {

    if (keyframeIndex == keyframes.length - 1) {
        svg.selectAll("*").remove();//
        initialiseSVG();
        //updateBarChart(Graph1Data, "Distribution of Rose Colours");
      }
    if (keyframeIndex > 0) {
        keyframeIndex--;
        drawKeyframe(keyframeIndex);
      }

     
    
}


function drawKeyframe(kfi){
    // Get the current keyframe
    let kf = keyframes[kfi];
  
    // Reset any lines that are currently active
    resetActiveLines();
  
    // Update which verse is currently being displayed as active
    updateActiveVerse(kf.activeVerse);
  
    // Iterate over the active lines for this keyframe and update the active lines one by one
    for (line of kf.activeLines) {
          updateActiveLine(kf.activeVerse, line);
    }
    // We need to check if their is an svg update function defined or not
    if(kf.svgUpdate){
        // If there is we call it like this
        kf.svgUpdate();
    }
  }

function resetActiveLines() {
    // Reset the active-line class for all of the lines
  d3.selectAll(".line").classed("active-line", false);
}

function updateActiveVerse(id) {
    // Reset the current active verse - in some scenarios you may want to have more than one active verse, but I will leave that as an exercise for you to figure out
  d3.selectAll(".verse").classed("active-verse", false);

  // Update the class list of the desired verse so that it now includes the class "active-verse"
  d3.select("#verse" + id).classed("active-verse", true);

  // Scroll the column so the chosen verse is centred
  scrollLeftColumnToActiveVerse(id);

}

function updateActiveLine(vid, lid) {
    // Select the correct verse
  let thisVerse = d3.select("#verse" + vid);
  // Update the class list of the relevant lines
  thisVerse.select("#line" + lid).classed("active-line", true);
}


function scrollLeftColumnToActiveVerse(id) {
    // First we want to select the div that is displaying our text content
    var leftColumn = document.querySelector(".left-column-content");

    // Now we select the actual verse we would like to be centred, this will be the <ul> element containing the verse
    var activeVerse = document.getElementById("verse" + id);

    // The getBoundingClientRect() is a built in function that will return an object indicating the exact position
    // Of the relevant element relative to the current viewport.
    // To see a full breakdown of this read the documentation here: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    var verseRect = activeVerse.getBoundingClientRect();
    var leftColumnRect = leftColumn.getBoundingClientRect();

    // Now we calculate the exact location we would like to scroll to in order to centre the relevant verse
    // Take a moment to rationalise that this calculation does what you expect it to
    var desiredScrollTop = verseRect.top + leftColumn.scrollTop - leftColumnRect.top - (leftColumnRect.height - verseRect.height) / 2;

    // Finally we scroll to the right location using another built in function.
    // The 'smooth' value means that this is animated rather than happening instantly
    leftColumn.scrollTo({
        top: desiredScrollTop,
        behavior: 'smooth'
    })
}

function updateChart1(data, title = "") { //3 different columns shown on same graph
    //xScale.domain(data.map(d => d.colour));
    //yScale.domain([0, d3.max(data, d => d.count)]).nice();

    var xScale = d3.scaleLinear()
    .domain([0, d3.max(Graph1Data, d => parseFloat(d.AQI_Value))])//findMax(d3.max(Graph1Data, d => d.Ozone_AQI_Value), d3.max(Graph1Data, d => d.AQI_Value), d3.max(Graph1Data, d => d.PM2_5_AQI_Value))])//[0,200])//[d3.min(Graph1Data, d => d.AQI_Value), d3.max(Graph1Data, d => d.Ozone_AQI_Value)])
    .range([0, width-80]);

    var yScale = d3.scaleLinear()
    .domain([0, d3.max(Graph1Data, d => parseInt(d.Num_Occurrences))]) //2872 is Num_Occurrences for USA //2872])
    .range([height-80, 0]);

    const symbolType = {
        AQI_Value: d3.symbolSquare,
        Ozone_AQI_Value: d3.symbolTriangle,
        PM2_5_AQI_Value: d3.symbolCircle
    };



    // const bars = chart.selectAll(".bar")
    //     .data(data, d => d.colour);

    //NEED TO REMOVE ALL THE DATA THAT IS CURRENTLY ON THE GRAPH
    svg.selectAll(".data-line").remove();
    svg.select("#x-axis-title").remove();
    svg.select("#y-axis-title").remove();
    svg.select("#chart-title").remove();


    svg.append('g')
        .selectAll("dot")
        .data(Graph1Data)
        .enter()
        .append("rect")
        .attr("class", "data-point")
        .attr("y", function (d) { return yScale(d["Num_Occurrences"]); } ) //not sure why I had to go from cy -> y
        .attr("x", function (d) { return xScale(d["AQI_Value"]); } ) //not sure why I had to go from cx -> x
        //.attr("r", 2) //for circle
        .attr("width", 4) 
        .attr("height", 4) 
        .attr("transform",  "translate(" + 50 + "," + 26 + ")")//"translate(" + -10 + "," + 30 + ")")
        //how to automate this? Why put manual values
        .style("fill", "#CC0000");

    svg.append('g')
        .selectAll("dot")
        .data(Graph1Data)
        .enter()
        .append("polygon")
        .attr("class", "data-point")
        //.attr("cy", function (d) { return yScale(d["Num_Occurrences"]); } )
        //.attr("cx", function (d) { return xScale(d["Ozone_AQI_Value"]); } ) 
        .attr("points", "0,-4 2,4 -2,4") //coordinates for triangle
        .attr("transform",  "translate(" + 50 + "," + 26 + ")")//"translate(" + -10 + "," + 30 + ")")
        .attr("transform", function(d) {
            const x = xScale(parseFloat(d["Ozone_AQI_Value"])) + 50;
            const y = yScale(parseInt(d["Num_Occurrences"])) + 26;
            return "translate(" + x + "," + y + ")";
        })
        //how to automate this? Why put manual values
        .style("fill", "#000000")

    svg.append('g')
        .selectAll("dot")
        .data(Graph1Data)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cy", function (d) { return yScale(d["Num_Occurrences"]); } )
        .attr("cx", function (d) { return xScale(d["PM2_5_AQI_Value"]); } )
        .attr("r", 2)
        .attr("transform",  "translate(" + 50 + "," + 26 + ")")//"translate(" + -10 + "," + 30 + ")")
        //how to automate this? Why put manual values
        .style("fill", "#FFFFFF");

    //shapes: AQI value (Square); Ozone AQI (Triangle); PM2.5 AQI (Circle)
    
    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "black")
        .text("Various AQI Values by No. of Occurrences of Country in Dataset");
    
    svg.append("text")
        .attr("id", "y-axis-title")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height/2)+10)//width / 2)
        .attr("y", 14)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "black")
        .text("No. of Occurrences of Country in Dataset");

    svg.append("text")
        .attr("id", "x-axis-title")
        .attr("x", width / 2)
        .attr("y", 385)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "black")
        .text("Average Value");

    /*chart.select(".x-axis")
        .call(d3.axisBottom(xScale));

    chart.select(".y-axis")
        .call(d3.axisLeft(yScale));*/

    if (title.length > 0) {
        svg.select("#chart-title")
            .text(title);
    }
}


function updateChart2(data, title = "") { //3 different columns shown on same graph
    var xScale = d3.scaleLinear()
    .domain([0, d3.max(AggFreqData, d => parseFloat(d.AQI_Value))])//findMax(d3.max(Graph1Data, d => d.Ozone_AQI_Value), d3.max(Graph1Data, d => d.AQI_Value), d3.max(Graph1Data, d => d.PM2_5_AQI_Value))])//[0,200])//[d3.min(Graph1Data, d => d.AQI_Value), d3.max(Graph1Data, d => d.Ozone_AQI_Value)])
    .range([0, width-80]);

    var yScale = d3.scaleLinear()
    .domain([0, d3.max(AggFreqData, d => parseInt(d.Num_Occurrences))]) //2872 is Num_Occurrences for USA //2872])
    .range([height-80, 0]);

    //NEED TO REMOVE ALL THE DATA THAT IS CURRENTLY ON THE GRAPH
    //svg.selectAll("*").remove();
    svg.selectAll(".data-point").remove();
    svg.select("#x-axis-title").remove();
    svg.select("#y-axis-title").remove();
    svg.select("#chart-title").remove();

    // Create a line generator function
    var lineGenerator = d3.line()
        .x(function (d) { return xScale(parseFloat(d.AQI_Value)); })
        .y(function (d) { return yScale(parseInt(d.Num_Occurrences)); });

    // Create the line graph
    svg.append("path")
        .datum(AggFreqData)
        .attr("fill", "none")
        .attr("stroke", "#CC0000")
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);
    
    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "black");
    
    svg.append("text")
        .attr("id", "y-axis-title")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height/2)+10)//width / 2)
        .attr("y", 14)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "black")
        .text("Occurrence Frequency");

    svg.append("text")
        .attr("id", "x-axis-title")
        .attr("x", width / 2)
        .attr("y", 385)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "black")
        .text("AQI Value");

    /*chart.select(".x-axis")
        .call(d3.axisBottom(xScale));

    chart.select(".y-axis")
        .call(d3.axisLeft(yScale));*/

    if (title.length > 0) {
        svg.select("#chart-title")
            .text(title);
    }
}

async function initialise() {
// Now that we are calling an asynchronous function in our initialise function this function also now becomes async
    await loadData();
        //drawAQIValuesGraph1();
        initialiseSVG();
        /*Plot.dot(Graph1Data, {x: "AQI_Value", y: "Num_Occurrences", fill: "Country", symbol: "Country"})
        .plot({nice: true, grid: true, symbol: {legend: true}})*/
    drawKeyframe(keyframeIndex);

}

initialise();
