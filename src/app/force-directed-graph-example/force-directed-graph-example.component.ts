import { AfterViewInit, Component } from '@angular/core';
import * as d3Force from 'd3-force';
import { DatabaseService } from '../database.service';
import {StylingService} from "../styling.service";

@Component({
  selector: 'app-force-directed-graph-example',
  templateUrl: './force-directed-graph-example.component.html',
  styleUrls: ['./force-directed-graph-example.component.css']
})
export class ForceDirectedGraphExampleComponent implements AfterViewInit {

  private graph;
  private canvas;
  private context;
  private width;
  private height;
  private simulation;
  private cypherStatement = "MATCH path = (n)-[r]->(m) RETURN path limit 50";

  constructor(private dbService: DatabaseService,
              private stylingService: StylingService) { }

  private loadGraphDB() {
    this.dbService.get(this.cypherStatement).subscribe(data => {
      let jsonResults = JSON.parse(data._body);
      this.graph = this.dbService.convertToGraphJSON(jsonResults);
      this.renderGraph();
    });
  }

  ngAfterViewInit() {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.stylingService.setCanvasWindowSize(this.context);
    this.stylingService.turnOnAutoResizeCanvas(this.context);
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.loadGraphDB();
  }

  private renderGraph() {
    this.getDefaultSimulation();
    this.simulateNodesAndLinks();
  }

  private getDefaultSimulation() {
    this.simulation = d3Force.forceSimulation()
      .force("link", d3Force.forceLink())
      .force("charge", d3Force.forceManyBody())
      .force("center", d3Force.forceCenter());
  }

  drawLink(source, target) {
    this.context.moveTo(source.x, source.y);
    this.context.lineTo(target.x, target.y);
  }

  drawNode(d) {
    this.context.moveTo(d.x + 3, d.y);
    this.context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
  }

  private getCoordinatesByNodeId(nodeID) {
    let node = this.graph["nodes"].find(x => x.id === nodeID);
    return {x: node.x, y: node.y};
  }

  private simulateNodesAndLinks() {
    this.simulation.nodes(this.graph["nodes"]).on("tick", () => {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.save();
        this.context.translate(this.width / 2, this.height / 2 + 40);
        this.context.beginPath();
        this.graph['links'].forEach(link => {
          this.drawLink(this.getCoordinatesByNodeId(link.source), this.getCoordinatesByNodeId(link.target));
        });
        this.context.strokeStyle = "#96d7ff";
        this.context.stroke();
        this.context.beginPath();
        this.graph['nodes'].forEach(node => {
          this.drawNode(node);
        });
        this.context.fill();
        this.context.strokeStyle = "#1a3375";
        this.context.stroke();
        this.context.restore();
      });
  }
}
