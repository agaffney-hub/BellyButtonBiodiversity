function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 

    var samplesArray = data.samples;
 
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = samplesArray.filter(sampleObj => sampleObj.id == sample);

    // DELIVERABLE 3 VARIABLE TO FILTER METADATA ARRAY WITH DESIRED SAMPLE NUMBER
    var metadataArray = data.metadata
    var resultMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultsArray[0];
// DELIVERABLE 3 SAMPLE VARIABLE
    var firstMetaData = resultMetadata[0];
    console.log(firstMetaData);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

// DELIVERABLE 3 WASHING FREQUENCY VARIABLE
    var washFreq = parseFloat(firstMetaData.wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0, 10).map(id => "OTU " + id + " ").reverse();

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: sampleValues.slice(0, 10).reverse(),
        colorscale: "Portland"
      }
    };
    var barData = [trace];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top Ten Bacterial Cultures",
        margin: {
          l: 100,
          r: 60,
          t: 100,
          b: 60
        }
      };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

//               DELIVERABLE TWO 

     // 1. Create the trace for the bubble chart.
     var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      type: "scatter",
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Jet"
      }
    }
   ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: { text: "<b>Bacteria Cultures Per Sample</b>", font: {size: 22} },
      xaxis: {title: "OTU ID"},
      margins: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
      
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    //         DELIVERABLE 3

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      title: {text: "Washes Weekly", font: {size: 20}},
      type: "indicator",
      mode: "gauge+number",
      value: washFreq,
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: 'black' },
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lime"},
          {range: [8, 10], color: "green"}
        ]
      }

    }
     
    ];
       
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "<b>Belly Button Washing Frequency</b>",
      font: { size: 18},
      width: 600,
      height: 500
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}


