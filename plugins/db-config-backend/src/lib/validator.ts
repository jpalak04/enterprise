import * as yaml from 'yaml';
import Ajv from 'ajv';
import { IConfigService } from './dbService';


export function validateAndProcessYAML(
    yamlContent: string,
    context: string,
    schema: any,
    processDocument: (doc: any, context: string, svc: IConfigService) => void,
    svc: IConfigService
): void {
    const ajv = new Ajv();
    try {
        const documents = yaml.parseAllDocuments(yamlContent).map(doc => doc.toJSON());
        if (documents.length === 0) {
            throw new Error('No documents found in YAML content');
        }
        documents.forEach((doc, index) => {
            // Validate the doc against the schema
            if (ajv.validate(schema, doc)) {
                processDocument(doc, context, svc);
            } else {
                throw new Error(`Validation failed for document ${index}: ${ajv.errorsText()}`);
            }
        });
    } catch (error) {
        throw new Error(`Error parsing YAML: ${error}`);
    }

}
export const processProductTileNoop = (_doc: any, _context: string, _svc: IConfigService) => {

}

export const processProductTiles = (doc: any, context: string, svc: IConfigService) => {
    const d = doc as { productTiles: any[] };
    if (d && d.productTiles) {
        d.productTiles.forEach(tile => {
            if (tile.context.startsWith(context)) {
                console.log(`Processing tile for context ${tile.context}`);
                svc.getConfiguration(`productTiles.${tile.context}`)
                    .then(config => {
                        if (config) {
                            console.log(`Updating configuration for ${tile.context}...`);
                            svc.updateConfiguration(`productTiles.${tile.context}`, tile.context, JSON.stringify(tile));
                        } else {
                            console.log(`Creating configuration for ${tile.context}...`);
                            svc.createConfiguration(`productTiles.${tile.context}`, tile.context, JSON.stringify(tile));
                        }
                    })
                    .catch(error => {
                        console.error(`Error with configuration for ${tile.context}: ${error}`);
                    });
            } else {
                console.error(`Context mismatch for ${tile.context} (expected: ${context})`);
            }
        });
    }
};
