// config.d.ts
// Define the configuration schema directly without referencing external or additional TypeScript interfaces

/**
 * @visibility frontend
 */
export interface Config {
  /** Configuration for product tiles, directly incorporating necessary properties */
  productTiles?: Array<{
    /** @visibility frontend */
    context: string;
    /** @visibility frontend */
    headerTitle: string;
    /** @visibility frontend */
    headerSubtitle: string;
    /** @visibility frontend */
    contentDescription: string;
    /** @visibility frontend */
    color?: string;
    /** @visibility frontend */
    tiles: Array<{
      /** @visibility frontend */
      title: string;
      /** @visibility frontend */
      subtitle: string;
      /** @visibility frontend */
      description: string;
      /** @visibility frontend */
      styleName?: string;
      /** @visibility frontend */
      link: string;
      /** @visibility frontend */
      externalLink?: boolean;
    }>;
  }>;
}

