import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Force from 'd3-force';
import {DatabaseService} from "../database.service";
import {RequestOptions, Headers} from "@angular/http";

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
  private cypherStatement = "MATCH path = (n)-[r]->(m) RETURN path LIMIT 100";

  constructor(private elementRef: ElementRef,
              private dbService: DatabaseService) {
  }

  private loadGraphDB() {
    let username = 'neo4j';
    let password = 'Neo4j';
    let auth = 'Basic ' + btoa(username + ':' + password);
    console.log(auth);
    let options = new RequestOptions({
      method: 'POST',
      url: 'http://localhost:7474/db/data/transaction/commit',
      body: {
        "statements": [
          {
            "statement": this.cypherStatement,
            "resultDataContents": ["graph"]
          }
        ]
      },
      headers: new Headers({
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': auth
      })
    });
    this.dbService.get(options).subscribe(data => {
      let jsonResults = JSON.parse(data._body);
      this.graph = this.convertToGraphJSON(jsonResults);
      // console.log(this.graph);
      // console.log(this.graph['nodes']);
      this.renderGraph();
    });
  }

  ngAfterViewInit() {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.loadGraphDB();
  }

  private renderGraph() {
    // d3.select(this.elementRef.nativeElement).select("h1").style("background-color", "yellow");
    // console.log(this.canvas);
    // console.log(this.context);
    // console.log(this.width);
    // console.log(this.height);

    var simulation = d3Force.forceSimulation()
      .force("link", d3Force.forceLink())
      .force("charge", d3Force.forceManyBody())
      .force("center", d3Force.forceCenter());
    // console.log(simulation);


    simulation
      .nodes(this.graph["nodes"])
      .on("tick", () => {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.save();
        this.context.translate(this.width / 2, this.height / 2 + 40);

        this.context.beginPath();
        // console.log(this.graph['link']);
        this.graph['link'].forEach(link => {
          this.drawLink(link);
        });
        // for(var link in this.graph["link"]) {
        //   // console.log(link);
        //   this.drawLink(link);
        // }
        // this.graph.links.forEach(this.drawLink);
        this.context.strokeStyle = "#aaa";
        this.context.stroke();

        this.context.beginPath();
        this.graph['nodes'].forEach(node => {

          this.drawNode(node);
        });

        // for(var node in this.graph["nodes"]) {
        //   // console.log(node);
        //   this.drawNode(node);
        // }
        // this.graph["nodes"].forEach(this.drawNode);
        this.context.fill();
        this.context.strokeStyle = "#fff";
        this.context.stroke();

        this.context.restore();
      });

    simulation.force("link", this.graph["links"]);
  }

  private ticked() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.save();
    this.context.translate(this.width / 2, this.height / 2 + 40);

    this.context.beginPath();
    this.graph.links.forEach(this.drawLink);
    this.context.strokeStyle = "#aaa";
    this.context.stroke();

    this.context.beginPath();
    this.graph["nodes"].forEach(this.drawNode);
    this.context.fill();
    this.context.strokeStyle = "#fff";
    this.context.stroke();

    this.context.restore();
  }

  drawLink(d) {
    this.context.moveTo(d.source, d.start);
    this.context.lineTo(d.end, d.end);
  }

  drawNode(d) {
    this.context.moveTo(d.x + 3, d.y);
    this.context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
  }

  convertToGraphJSON(data: JSON): JSON {
    var nodes = [], links = [];
    data['results'][0]['data'].forEach(row => {
      row.graph.nodes.forEach(n => {
        // console.log('node: ', n);
        if (this.idIndex(nodes, n.id) == null)
          nodes.push({id: n.id, label: n.labels[0], title: n.properties.name});
      });
      links = links.concat(row.graph.relationships.map(r => {
        return {start: this.idIndex(nodes, r.startNode), end: this.idIndex(nodes, r.endNode), type: r.type};
      }));
    });
    let graph = '{"nodes":' + JSON.stringify(nodes) + ', "link":' + JSON.stringify(links) + '}';
    return JSON.parse(graph);
  }

  idIndex(a, id): number {
    for (var i = 0; i < a.length; i++) {
      if (a[i].id == id) return i;
    }
    return null;
  }
}
