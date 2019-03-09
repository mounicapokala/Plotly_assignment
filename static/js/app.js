function buildMetadata(sample) {
  var metaDataSelector = d3.select("#sample-metadata");
  metaDataSelector.html("");
  var metaDataRoute = "/metadata/"+ sample; 
  
  d3.json(metaDataRoute).then((metaDataSet) => {
    var array = d3.entries(metaDataSet)
    array.forEach((metaData) => {
      metaDataSelector
        .append("p")
        .text(metaData["key"]+" : "+metaData["value"])
        
    });
  });
}
   
function buildPieChart(sampleArrayList){
    var OTUIDS = []
    var OTULABELS = []
    var SAMPLEVALUES = []
    sampleArrayList.forEach((sampleArray) =>{
      if (sampleArray["key"] == "otu_ids"){
        OTUIDS = sampleArray["value"];
      }
      if (sampleArray["key"] == "otu_labels"){
        OTULABELS = sampleArray["value"];
      }
      if (sampleArray["key"] == "sample_values"){
        SAMPLEVALUES = sampleArray["value"];
      }
    });
    
    var pie_chart_data = [{
      values: SAMPLEVALUES.slice(0,9),
      labels: OTUIDS.slice(0,9),
      type: "pie"
    }];
    var layout = {
      height: 600,
      width: 800,
      title: "Pie chart for selected sample values"
    };
    var pie_div = document.getElementById('pie')
    Plotly.newPlot(pie_div,pie_chart_data,layout);
}

function buildBubbleChart(sampleArrayList){
    var OTUIDS = []
    var OTULABELS = []
    var SAMPLEVALUES = []
    sampleArrayList.forEach((sampleArray) =>{
      if (sampleArray["key"] == "otu_ids"){
        OTUIDS = sampleArray["value"];
      }
      if (sampleArray["key"] == "otu_labels"){
        OTULABELS = sampleArray["value"];
      }
      if (sampleArray["key"] == "sample_values"){
        SAMPLEVALUES = sampleArray["value"];
      }
    });
    var trace = {
      x: OTUIDS,
      y: SAMPLEVALUES,
      mode: 'markers',
      marker: {
        size: SAMPLEVALUES,
        color: OTUIDS,
        text: OTULABELS
      }
    };
    var bubble_chart_data = [trace];
    var layout = {
      title: 'Bubble chart for selected sample values',
      showlegend: false,
      height:600,
      width: 1200
    };
    var bubble_div = document.getElementById('bubble')
    Plotly.newPlot(bubble_div,bubble_chart_data,layout);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleRoute = "/samples/"+sample;
  d3.json(sampleRoute).then((sampleSet)=>{
    var sampleArrayList = d3.entries(sampleSet)
    buildPieChart(sampleArrayList);
    buildBubbleChart(sampleArrayList);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
  
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
