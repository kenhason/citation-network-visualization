import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../database.service";
import {RequestOptions, Headers} from "@angular/http";
// import * as d3 from 'd3-force';
declare var d3: any;

// import * as d3 from 'd3-selection';
// import * as d3Scale from "d3-scale";
// import * as d3Shape from "d3-shape";
// import * as d3Array from "d3-array";
// import * as d3Axis from "d3-axis";

@Component({
  selector: 'graph-display',
  templateUrl: './graph-display.component.html',
  styleUrls: ['./graph-display.component.css']
})
export class GraphDisplayComponent implements OnInit {

  private graph;

  constructor(private dbService: DatabaseService) { }

  ngOnInit() {
    let username = 'neo4j';
    let password = 'Neo4j';
    let auth = 'Basic ' + btoa(username + ':' + password);
    console.log(auth);
    let options = new RequestOptions({
      method: 'POST',
      url: 'http://localhost:7474/db/data/transaction/commit',
      body: {
        "statements":[
          {
            "statement":"MATCH path = (n)-[r]->(m) RETURN path LIMIT 2",
            "resultDataContents":["graph"]
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
      // console.log(jsonResults);
      this.graph = this.convertToGraphJSON(jsonResults);
      console.log(this.graph);
      this.renderGraph(this.graph);
    });
  }

  private convertToGraphJSON(data: JSON):JSON {
    var nodes=[], links=[];
    data['results'][0]['data'].forEach(row => {
      row.graph.nodes.forEach( n => {
        // console.log('node: ', n);
        if (this.idIndex(nodes,n.id) == null)
          nodes.push({id:n.id,label:n.labels[0],title:n.properties.name});
      });
      links = links.concat( row.graph.relationships.map(r => {
        return {start:this.idIndex(nodes,r.startNode),end:this.idIndex(nodes,r.endNode),type:r.type};
      }));
    });
    let graph = '{"nodes":' + JSON.stringify(nodes) + ', "link":' + JSON.stringify(links) + '}';
    console.log(graph);
    return JSON.parse(graph);
  }

  private idIndex(a,id): number {
    for (var i=0;i<a.length;i++) {
      if (a[i].id == id) return i;}
    return null;
  }

  private renderGraph(d3Result: any) {
    var force = d3.layout.force()
      .charge(-200).linkDistance(30).size([600, 800]);

    var svg = d3.select("#graph").append("svg")
      .attr("width", "100%").attr("height", "100%")
      .attr("pointer-events", "all");

    force.nodes(this.graph.nodes).links(this.graph.links).start();

    // render relationships as lines
    var link = svg.selectAll(".link")
      .data(this.graph.links).enter()
      .append("line").attr("class", "link");

    // render nodes as circles, css-class from label
    var node = svg.selectAll(".node")
      .data(this.graph.nodes).enter()
      .append("circle")
      .attr("class", d => { return "node "+d.label })
      .attr("r", 10)
      .call(force.drag);

    // html title attribute for title node-attribute
    node.append("title")
      .text(d => { return d.title; })

    // force feed algo ticks for coordinate computation
    force.on("tick", () => {
      link.attr("x1", d => { return d.source.x; })
        .attr("y1", d => { return d.source.y; })
        .attr("x2", d => { return d.target.x; })
        .attr("y2", d => { return d.target.y; });

      node.attr("cx", d => { return d.x; })
        .attr("cy", d => { return d.y; });
    });
  }

}
