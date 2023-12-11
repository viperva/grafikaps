import React from "react";
import Plot from "react-plotly.js";

type HistogramProps = {
  histogramData: number[];
  imageUrl?: string;
  small?: boolean;
  fill?: string;
};

function Histogram({ histogramData, small, fill, imageUrl }: HistogramProps) {
  return (
    <Plot
      data={[
        {
          type: "bar",
          y: histogramData,
          marker: {
            color: fill || "#23b7e5",
          },
        },
      ]}
      layout={{
        width: small ? 400 : 800,
        height: small ? 260 : 440,
        title: `histogram ${imageUrl}`,
        plot_bgcolor: "#242424",
        paper_bgcolor: "#242424",
        font: {
          family: "monospace",
          size: small ? 10 : 15,
          color: "rgba(255, 255, 255, 0.7)",
        },
        margin: {
          l: 80,
          r: 0,
          b: 60,
          t: 50,
          pad: 10,
        },
      }}
    />
  );
}

export default Histogram;
