

let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2, 3, 4],
        svgUpdate: drawAirColours
    },
    {
        activeVerse: 2,
        activeLines: [1, 2, 3, 4]
    },
    {
        activeVerse: 3,
        activeLines: [1, 2, 3, 4],
        svgUpdate: drawAirColours
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


const width = 500;
const height = 400;


let svg = d3.select("#svg");
let keyframeIndex = 0;

document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);



let AirData;


async function loadData() {
    
    await d3.csv("../../data/pivoted_air_pollution_data.csv").then(data => { //the original dataset was pivoted to generate this dataset. It is a summarized version where each row represents one country
        AirData = data;
        //console.log(AirData);
    });
}

function findMax(arg1, arg2, arg3) {
    // console.log(arg1);
    // console.log(arg2);
    // console.log(arg3);
    /*if (arg1 >= arg2) {
        if (arg1 >= arg3) {
            console.log(arg1);
            return arg1;
        }
    } else if (arg1 >= arg3) {
        console.log(arg2);
        return arg2;
    } else return arg3;*/
    //console.log(Math.max(arg1, arg2, arg3));
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

    var xScale = d3.scaleLinear()
    .domain([0, d3.max(AirData, d => d.AQI_Value)])//findMax(d3.max(AirData, d => d.Ozone_AQI_Value), d3.max(AirData, d => d.AQI_Value), d3.max(AirData, d => d.PM2_5_AQI_Value))])//[0,200])//[d3.min(AirData, d => d.AQI_Value), d3.max(AirData, d => d.Ozone_AQI_Value)])
    .range([0, width-80]);

    //console.log(d3.max(AirData, d => d.Num_Occurrences));
    var yScale = d3.scaleLinear()
    .domain([0, 2872])//d3.max(AirData, d => d.Num_Occurrences)]) //2872 is Num_Occurrences for USA
    .range([height-80, 0]);

    const symbolType = {
        AQI_Value: d3.symbolSquare,
        Ozone_AQI_Value: d3.symbolTriangle,
        PM2_5_AQI_Value: d3.symbolCircle
    };

    /*svg.selectAll("path")
    .data(AirData)
    .enter()
    .append("path")
    .attr("transform", d => `translate(${xScale(d.AQI_Value)}, ${yScale(d.Num_Occurrences)})`)
    .attr("d", d => symbolType[d.SymbolType])
    .attr("fill", d => d.Color)
    .attr("stroke", "black")
    .attr("stroke-width", 1);*/

    svg.append('g')
        .selectAll("dot")
        .data(AirData)
        .enter()
        .append("circle")
        .attr("cy", function (d) { return yScale(d["Num_Occurrences"]); } )
        .attr("cx", function (d) { return xScale(d["AQI_Value"]); } )
        .attr("r", 2)
        .attr("transform", "translate(" + -10 + "," + 30 + ")")
        .style("fill", "#CC0000");
        
    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

        //No. of Occurrences of Country in Dataset
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
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "black")
        .text("No. of Occurrences of Country in Dataset");

    svg.append("text")
        .attr("id", "x-axis-title")
        .attr("x", width / 2)
        .attr("y", 385)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "black")
        .text("Average Value");
}


function drawAirColours() {
    return 0;
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
        //updateBarChart(AirData, "Distribution of Rose Colours");
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


async function initialise() {
// Now that we are calling an asynchronous function in our initialise function this function also now becomes async
    await loadData();
        //drawAirColours();
        initialiseSVG();
    drawKeyframe(keyframeIndex);

}

initialise();
