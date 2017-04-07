import { CitationNetworkVisualizationPage } from './app.po';

describe('citation-network-visualization App', () => {
  let page: CitationNetworkVisualizationPage;

  beforeEach(() => {
    page = new CitationNetworkVisualizationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
