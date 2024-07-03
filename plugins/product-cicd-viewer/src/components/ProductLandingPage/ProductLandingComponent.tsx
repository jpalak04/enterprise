import React, { useState } from 'react';
import { Grid, Button, makeStyles } from '@material-ui/core';
import { Header, Page, Content, HeaderLabel } from '@backstage/core-components';
import { ExampleFetchComponent } from '../ProductPipelineView';

const useStyles = makeStyles(theme => ({
  button: {
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  selectedButton: {
    border: `0.1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export const ExampleComponent = () => {
  const classes = useStyles();
  const [selectedTable, setSelectedTable] = useState<'jenkins' | 'gitlab'>(
    'jenkins',
  );

  return (
    <Page themeId="tool">
      <Header title="View your Pipeline Status">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <Grid container spacing={4} direction="column">
          <Grid item>
            <Grid container spacing={3}>
              <Grid item>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => setSelectedTable('jenkins')}
                  className={`${classes.button} ${
                    selectedTable === 'jenkins' ? classes.selectedButton : ''
                  }`}
                >
                  Jenkins
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => setSelectedTable('gitlab')}
                  className={`${classes.button} ${
                    selectedTable === 'gitlab' ? classes.selectedButton : ''
                  }`}
                >
                  Gitlab
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <ExampleFetchComponent selectedTable={selectedTable} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
