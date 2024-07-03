/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Define an array of product tile configurations
  const productTileConfigs =
    [
      {
        "context": "bshome",
        "headerTitle": "DEVO- Home",
        "headerSubtitle": "DevOps Portal Home Navigation Page",
        "contentDescription": "The tiles below will take you to other aggregator pages",
        "tiles": [
          {
            "title": "Cloud Engineering",
            "subtitle": " ",
            "link": "/product-tiles/ce",
            "styleName": "greenBlue",
            "description": "Quick Links for Cloud Engineering Areas"
          },
          {
            "title": "Cloud Operations",
            "subtitle": " ",
            "link": "/product-tiles/cloudops",
            "styleName": "greenBlue",
            "description": "Quick Links for Cloud Operations Areas"
          },
          {
            "title": "Cloud Center of Excellence",
            "subtitle": " ",
            "description": "Comprehensive pages on Axway Cloud Best Practices",
            "styleName": "greenBlue",
            "link": "/product-tiles/ccoe"
          },
          {
            "title": "Software Catalog",
            "subtitle": " ",
            "styleName": "orangeYellow",
            "description": "Review Axway Software Ecosystem",
            "link": "/catalog"
          },
          {
            "title": "Products Home",
            "subtitle": " ",
            "description": "Comprehensive pages on Axway Products",
            "styleName": "orangeYellow",
            "link": "/product-tiles/axway-products"
          },
          {
            "title": "Axway Anywhere",
            "subtitle": " ",
            "description": "IT Service Requests for Axway Anywhere",
            "styleName": "blueViolet",
            "link": "https://eu8-smax.saas.microfocus.com/saw/ess?TENANTID=223939732",
            "externalLink": "true"
          },
          {
            "title": "Axway Self Service Portal",
            "subtitle": " ",
            "description": "Create Service Requests for RDTools",
            "styleName": "blueViolet",
            "link": "https://service-portal.axway.int/home",
            "externalLink": "true"
          },
          {
            "title": "Axway Security",
            "subtitle": " ",
            "description": "IT Service Requests for Axway Anywhere",
            "styleName": "blueViolet",
            "link": "https://confluence.axway.com/display/ACS/Axway+Software+Security+Group+%28SSG%29+-+formerly+PSG",
            "externalLink": "true"
          }
        ]
      },
      {
        "context": "axway-products",
        "headerTitle": "Axway Products",
        "headerSubtitle": "Axway Product Navigation Page",
        "contentDescription": "The tiles below will take you to other product pages",
        "tiles": [
          {
            "title": "B2Bi",
            "subtitle": " ",
            "link": "/product-tiles/b2bi",
            "description": "Quick Links for AFAH Areas"
          },
          {
            "title": "AFAH",
            "subtitle": " ",
            "link": "/product-tiles/afah",
            "description": "Quick Links for AFAH Areas"
          },
          {
            "title": "Amplify Integration",
            "subtitle": " ",
            "link": "/product-tiles/ampint",
            "description": "Quick Links for Amplify Integration Areas"
          },
          {
            "title": "API Gateway",
            "subtitle": " ",
            "link": "/product-tiles/b2bi",
            "description": "Quick Links for API Gateway Areas"
          },
          {
            "title": "API Manager",
            "subtitle": " ",
            "link": "/product-tiles/b2bi",
            "description": "Quick Links for API Manager Areas"
          },
          {
            "title": "MFT",
            "subtitle": " ",
            "link": "/product-tiles/mft",
            "description": "Quick Links for MFT Areas"
          },
          {
            "title": "Secure Transport",
            "subtitle": " ",
            "link": "/product-tiles/st",
            "description": "Quick Links for Secure Transport Areas"
          }
        ]
      },
        {
            "context": "ce",
            "headerTitle": "Cloud Engineering",
            "headerSubtitle": "Cloud Engineering Navigation Page",
            "contentDescription": "The tiles below will take you to other aggregator pages",
            "tiles": [
                {
                    "title": "Cloud Standards",
                    "subtitle": "Aggregator for CE",
                    "link": "/product-tiles/ce",
                    "description": "Quick Links for Cloud Engineering Areas"
                },
                {
                    "title": "Cloud Guidelines",
                    "subtitle": "Aggregator Page for CCoE",
                    "link": "/product-tiles/ccoe",
                    "description": "Comprehensive pages on Axway Cloud Best Practices"
                },
                {
                    "title": "Software Catalog",
                    "subtitle": "Axway Catalog for Software",
                    "link": "/catalog",
                    "description": "Review various Software offerings within the Axway ecosystem"
                }
            ]
        }
    
    ];
  // Clear existing entries and reseed
  await knex.transaction(async trx => {
    await trx('dbconfig')
      .where('key', 'like', 'productTiles.%')
      .del();

    await trx('dbconfig').insert(productTileConfigs.map(config => ({
      key: `productTiles.${config.context}`,
      value: config.context,
      json_value: JSON.stringify(config)
    })));
  });

};
