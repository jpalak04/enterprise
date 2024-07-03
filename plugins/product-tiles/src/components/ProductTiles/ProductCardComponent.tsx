import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, CardContent, CardMedia, Typography } from '@material-ui/core';
import { Content, Header, LinkButton, Page, ItemCardGrid, ItemCardHeader } from '@backstage/core-components';
import { useApi, discoveryApiRef } from '@backstage/core-plugin-api';

// Define the keys for your known styles
type StyleKey = 'grid' | 'blueViolet' | 'violetBlue' | 'orangeYellow' | 'greenBlue' | 'cloudBackground' | 'bookBackground';

interface PluginTile {
    title: string;
    subtitle: string;
    description: string;
    styleName?: StyleKey; // Ensure this matches your defined style keys
    link: string;
    externalLink: string;
    target: string;
}

interface ProductTilesConfig {
    context: string;
    headerTitle: string;
    headerSubtitle: string;
    contentDescription: string;
    tiles: PluginTile[];
}

// Adjusted useStyles to include a type assertion for safe indexing
const useStyles = makeStyles({
    grid: {
        gridTemplateColumns: 'repeat(auto-fill, 12em)',
    },
    header: {
        // Assuming these styles are meant to be applied to every item card header
        color: 'black',
        backgroundImage: 'linear-gradient(to bottom right, blue, yellow)',
    },
    // Define color scheme styles as before, which will be combined with the header style
    blueViolet: {
        backgroundImage: 'linear-gradient(to bottom right, blue, violet)',
    },
    violetBlue: {
        backgroundImage: 'linear-gradient(to bottom right, violet, blue)',
    },
    orangeYellow: {
        backgroundImage: 'linear-gradient(to bottom right, orange, yellow)',
    },
    greenBlue: {
        backgroundImage: 'linear-gradient(to bottom right, green, blue)',
    },
    cloudBackground: {
        backgroundImage: 'url("https://cdn-icons-png.flaticon.com/512/252/252035.png")', // Adjust the path as necessary
        backgroundSize: 'cover', // Cover the entire area
        backgroundPosition: 'center', // Center the background image
    },
    bookBackground: {
        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYWZG3ed78T3i_MTR6kBGPfxqRrGLsQvvdxYwlmHDPPw&s")', // Adjust the path as necessary
        backgroundSize: 'cover', // Cover the entire area
        backgroundPosition: 'center', // Center the background image
    },
    // Other color schemes...
});

export const ProductCard = () => {
    const classes = useStyles();
    const { context } = useParams<{ context: string }>();
    const [config, setConfig] = useState<ProductTilesConfig | undefined>(undefined);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const discoveryApi = useApi(discoveryApiRef);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const baseUrl = await discoveryApi.getBaseUrl('db-config'); // Ensure this is awaited
                const data = await fetchProductTilesConfig(baseUrl, context);
                setConfig(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to load product tiles config:', err);
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(errorMessage);
                setLoading(false);
            }
        };

        loadData();
    }, [context, discoveryApi]); // Include discoveryApi in dependency array if it might change, though it typically wouldn't

    if (isLoading) {
        return <div>Loading configuration for context '{context}'...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!config) {
        return <div>No configuration found for context '{context}'.</div>;
    }

    return (
        <Page themeId="tool">
            <Header title={config.headerTitle} subtitle={config.headerSubtitle} />
            <Content>
                <Typography paragraph>{config.contentDescription}</Typography>
                <ItemCardGrid classes={{ root: classes.grid }}>
                    {config.tiles.map((tile, index) => {
                        // Safely access the style class based on tile.styleName
                        const tileClass = tile.styleName && classes[tile.styleName] ? classes[tile.styleName] : '';

                        return (
                            <Card key={index}>
                                <CardMedia>
                                    <ItemCardHeader
                                        title={tile.title}
                                        subtitle={tile.subtitle}
                                        // Apply the dynamically determined class, or default if undefined
                                        classes={{ root: `${classes.header} ${tileClass}` }} />
                                </CardMedia>
                                <CardContent>{tile.description}</CardContent>
                                <CardActions>
                                    <LinkButton color="primary" to={tile.link} target={tile.target ? '_blank' : undefined}>
                                        Go There!
                                    </LinkButton>
                                </CardActions>
                            </Card>
                        );
                    })}
                </ItemCardGrid>
            </Content>
        </Page>
    );
};

async function fetchProductTilesConfig(baseUrl: string, context: string | undefined) {
    const fullUrl = `${baseUrl}/config/productTiles.${context}`;
    console.log(`Fetching product tiles config from ${fullUrl}`);
    const response = await fetch(fullUrl);
    if (!response.ok) {
        console.log(`Failed to fetch product tiles config from ${fullUrl}: ${response.statusText}`);
        throw new Error(`Failed to fetch product tiles config from ${fullUrl}: ${response.statusText}`);
    }
    const result = await response.json(); // Get the JSON response
    if (result && result.json_value) {
        try {
            if (typeof result.json_value === 'string') {
                console.log(JSON.parse(result.json_value));
                return JSON.parse(result.json_value); // Parse the json_value field to get the actual object
            } else if (typeof result.json_value === 'object') {
                console.log(result.json_value);
                return result.json_value; // Directly return the object
            } else {
                throw new Error("json_value field is not in a valid format");
            }
        } catch (error) {
            throw new Error(`Error parsing json_value: ${error}`);
        }
    } else {
        throw new Error("json_value field is missing in the response");
    }
}
