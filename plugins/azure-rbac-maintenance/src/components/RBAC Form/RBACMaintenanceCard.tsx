import React, { useState } from 'react';
import { Grid, Button, makeStyles, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Header, Page, Content, HeaderLabel } from '@backstage/core-components';
import { AzureUserManagement } from '../User Management/AzureUserManagement';
import { RoleAssignment } from '../User Management/RoleAssignment';
import { useUserRoles } from 'app/src/components/auth';

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

export const RBACMaintenanceCard = () => {
  const { roles } = useUserRoles();
  const classes = useStyles();
  const [selectedView, setSelectedView] = useState<'group' | 'role'>('group');
  const [dialogOpen, setDialogOpen] = useState(false);

  const isAdmin = roles.includes('DEVO.Admin');

  if (!isAdmin) {
    return (
      <Page themeId="tool">
        <Header title="User Management">
          <HeaderLabel label="Owner" value="Team X" />
          <HeaderLabel label="Lifecycle" value="Alpha" />
        </Header>
        <Content>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography variant="h6" color="error">
              User Unauthorized
            </Typography>
          </Box>
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="tool">
      <Header title="User Groups and Roles Management">
        <HeaderLabel label="Owner" value="Cloud Engineering" />
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
                  onClick={() => setSelectedView('group')}
                  className={`${classes.button} ${
                    selectedView === 'group' ? classes.selectedButton : ''
                  }`}
                >
                  Group Assignment
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => setSelectedView('role')}
                  className={`${classes.button} ${
                    selectedView === 'role' ? classes.selectedButton : ''
                  }`}
                >
                  Role Assignment
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => setDialogOpen(true)}
                  className={classes.button}
                >
                  Show Roles
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            {selectedView === 'group' ? (
              <AzureUserManagement />
            ) : (
              <RoleAssignment />
            )}
          </Grid>
        </Grid>
      </Content>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>User Roles</DialogTitle>
        <DialogContent>
          {roles.length > 0 ? (
            roles.map((role, index) => (
              <Typography key={index}>{role}</Typography>
            ))
          ) : (
            <Typography>No roles assigned.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};
