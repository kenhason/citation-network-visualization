import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceDirectedGraphExampleComponent } from './force-directed-graph-example.component';

describe('ForceDirectedGraphExampleComponent', () => {
  let component: ForceDirectedGraphExampleComponent;
  let fixture: ComponentFixture<ForceDirectedGraphExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceDirectedGraphExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceDirectedGraphExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
