import React from "react";
import type { DiagramData } from "../schemas/diagram";
import {
  TimelineDiagram,
  CycleDiagram,
  PieDiagram,
  MatrixDiagram,
  VennDiagram,
  FunnelDiagram,
  PyramidDiagram,
  BarChartDiagram,
  LineChartDiagram,
  FlowChartDiagram,
  TreeDiagram,
  RadarChartDiagram,
  GanttChartDiagram,
  AreaChartDiagram,
  NetworkDiagram,
} from "../components/diagrams";

type DiagramSelectorProps = {
  diagram: DiagramData;
};

export const DiagramSelector: React.FC<DiagramSelectorProps> = ({ diagram }) => {
  switch (diagram.type) {
    case "timeline":
      return <TimelineDiagram events={diagram.events} />;
    case "cycle":
      return <CycleDiagram steps={diagram.steps} />;
    case "pie":
      return <PieDiagram slices={diagram.slices} />;
    case "matrix":
      return (
        <MatrixDiagram
          axisX={diagram.axisX}
          axisY={diagram.axisY}
          quadrants={diagram.quadrants as [any, any, any, any]}
        />
      );
    case "venn":
      return <VennDiagram sets={diagram.sets} intersection={diagram.intersection} />;
    case "funnel":
      return <FunnelDiagram stages={diagram.stages} />;
    case "pyramid":
      return <PyramidDiagram levels={diagram.levels} />;
    case "bar":
      return <BarChartDiagram bars={diagram.bars} orientation={diagram.orientation} />;
    case "line":
      return <LineChartDiagram series={diagram.series} xLabels={diagram.xLabels} />;
    case "flow":
      return <FlowChartDiagram nodes={diagram.nodes} edges={diagram.edges} />;
    case "tree":
      return <TreeDiagram root={diagram.root} children={diagram.children} />;
    case "radar":
      return <RadarChartDiagram axes={diagram.axes} />;
    case "gantt":
      return <GanttChartDiagram tasks={diagram.tasks} />;
    case "area":
      return <AreaChartDiagram series={diagram.series} xLabels={diagram.xLabels} />;
    case "network":
      return <NetworkDiagram nodes={diagram.nodes} links={diagram.links} />;
    default:
      return null;
  }
};
