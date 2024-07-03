import { processProductTileNoop, validateAndProcessYAML } from './validator';
import * as yaml from 'yaml';
import { IConfigService } from './dbService';

jest.mock('fs');
jest.mock('knex')
jest.mock('yaml', () => ({
  parseAllDocuments: jest.fn().mockImplementation(() => [{ toJSON: () => ({
    productTiles: [
      {
        context: "ccoe",
        headerTitle: "Cloud Center of Excellence",
        headerSubtitle: "Cloud Standards Links",
        contentDescription: "Explore the following resources to align with our cloud best practices.",
        tiles: [
          {
            title: "Security Guidelines",
            subtitle: "Ensure your applications are secure",
            description: "Comprehensive guide on securing your cloud-hosted applications.",
            link: "https://axway.app.blackduck.com/",
            externalLink: true
          }
        ]
      }
    ]
  }) }]),
  parseDocument: jest.fn()
}));

describe('validateAndProcessYAML', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate and process YAML content', () => {
    const yamlContent = `
    productTiles:
      - context: "test"
        headerTitle: "Cloud Center of Excellence"
        headerSubtitle: "Cloud Standards Links"
        contentDescription: "Explore the following resources to align with our cloud best practices."
        tiles:
          - title: "Security Guidelines"
            subtitle: "Ensure your applications are secure"
            description: "Comprehensive guide on securing your cloud-hosted applications."
            link: "https://axway.app.blackduck.com/"
          - title: "Cost Optimization"
            subtitle: "Reduce your cloud spend"
            description: "Strategies for optimizing cloud costs without compromising on performance."
            link: "/docs/cost-optimization"
          - title: "GobblyGook"
            subtitle: "Reduce your cloud spend"
            description: "Strategies for optimizing cloud costs without compromising on performance."
            link: "/docs/cost-optimization"
    `;
    const mockConfigService: IConfigService = {
        createConfiguration: jest.fn(),
        getConfiguration: jest.fn(),
        updateConfiguration: jest.fn(),
        deleteConfiguration: jest.fn()
    };    
    // Add more tests for failure cases
    (mockConfigService.getConfiguration as jest.Mock).mockResolvedValueOnce('this');
    validateAndProcessYAML(yamlContent, "test", null, processProductTileNoop, mockConfigService);

    expect(yaml.parseAllDocuments).toHaveBeenCalledWith(yamlContent);

  });

});
