function buildMetadata(sample) {
    d3.json("/metadata/"+ sample).then(function(data) {
      var selector = d3.select("#sample-metadata").html("");
      selector.html("");
  
      for (i = 0; i < 5; i++) {
        selector.append("text").html("<font size='1'>" 
          + Object.entries(data)[i][0] + ": " 
          + Object.entries(data)[i][1] + "</font><br>");  
      };
  
      selector.append("text").html("<font size='1'>SAMPLEID: " + Object.entries(data)[6][1] + "</font><br>");
  
    });  
  }
  
  function buildCharts(sample) {
  
    d3.json("/samples/"+ sample).then(function(data) {
  
      var otu_ids = data.otu_ids;
      var otu_labels = data.otu_labels;
      var sample_values = data.sample_values;
  
      var trace1 = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids
        },
        text: otu_labels
      };
  
      var data1 = [trace1];
  
      var layout = {
        showlegend: false
      };
  
      Plotly.newPlot('bubble', data1, layout);
  
  
      var sample_data = otu_ids.map( (x, i) => {
        return {"otu_ids": x, "otu_labels": otu_labels[i], "sample_values": sample_values[i]}        
      });
  
      sample_data = sample_data.sort(function(a, b) {
        return b.sample_values - a.sample_values;
      });
  
      sample_data = sample_data.slice(0, 10);
  
      var trace2 = {
        labels: sample_data.map(row => row.otu_ids),
        values: sample_data.map(row => row.sample_values),
        hovertext: sample_data.map(row => row.otu_labels),
        type: 'pie'
      };
  
      var data2 = [trace2];
  
      Plotly.newPlot("pie", data2);
  
    });
  }
  
  function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text("BB_" + sample)
          .property("value", sample);
      });
  
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  init();