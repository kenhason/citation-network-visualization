import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {NEO4J_PASSWORD, NEO4J_USERNAME} from "../data/database-auth-info.constant";

@Injectable()
export class DatabaseService {
  private BASE_URL: string = 'http://localhost:7474/db/data/transaction/commit';
  constructor(private http: Http) { }

  public get(query: string): Observable<any> {
    return this.http.request(this.BASE_URL, DatabaseService.getDefaultRequestOptions(query));
  }

  private static getDefaultRequestOptions(query: string) {
      return new RequestOptions({
      method: 'POST',
      url: 'http://localhost:7474/db/data/transaction/commit',
      body: {
        "statements": [
          {
            "statement": query,
            "resultDataContents": ["graph"]
          }
        ]
      },
      headers: new Headers({
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': 'Basic ' + btoa(NEO4J_USERNAME + ':' + NEO4J_PASSWORD)
      })
    });
  }

  public convertToGraphJSON(data: JSON): JSON {
    let nodes = [], links = [];
    data['results'][0]['data'].forEach(row => {
      row.graph.nodes.forEach(n => {
        if (DatabaseService.idIndex(nodes, n.id) == null) {
          let groupNo = Math.round(Math.random()*10);
          nodes.push({id: n.id, label: n.labels[0], title: n.properties.name, group: groupNo});
        }
      });

      links = links.concat(row.graph.relationships.map(r => {
        return {source: r.startNode, target: r.endNode, type: r.type, value: 5};
      }));
    });
    let graph = '{"nodes":' + JSON.stringify(nodes) + ', "links":' + JSON.stringify(links) + '}';
    return JSON.parse(graph);
  }

  private static idIndex(a, id): number {
    for (let i = 0; i < a.length; i++) {
      if (a[i].id == id) return i;
    }
    return null;
  }
}
