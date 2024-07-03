import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ExtensionIcon from '@material-ui/icons/Extension';
//import MapIcon from '@material-ui/icons/MyLocation';
//import BuildRoundedIcon from '@material-ui/icons/BuildRounded';
import Book from '@material-ui/icons/Book';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import {
  DashboardIcon,
  SidebarScrollWrapper,
  //DashboardIcon,
//  DocsIcon,
  SidebarSubmenu,
  SidebarSubmenuItem,
} from '@backstage/core-components';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
//  SidebarScrollWrapper,
  SidebarSpace,
  useSidebarOpenState,
  Link,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { LogoFullGriffin, LogoSmallGriffin } from './LogoFullGriffin';
import { useUserRoles } from '../auth';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? <LogoFullGriffin /> : <LogoSmallGriffin />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => {
  const { roles } = useUserRoles();

  const isAdmin = roles.includes('DEVO.Admin');

  return (
    <SidebarPage>
      <Sidebar>
        <SidebarLogo />
        <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
          <SidebarSearchModal />
        </SidebarGroup>
        <SidebarDivider />
        <SidebarGroup label="Menu" icon={<MenuIcon />}>
          {/* Global nav, not org-specific */}
          <SidebarItem icon={HomeIcon} to="product-tiles/bshome" text="Home" />
          <SidebarItem icon={CloudQueueIcon} text="Cloud Engineering">
            <SidebarSubmenu title="Cloud Engineering">
              <SidebarSubmenuItem
                title="CCoE"
                to="/product-tiles/ccoe"
                icon={Book}
              />
            </SidebarSubmenu>
          </SidebarItem>
          <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
          <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
          <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
          {isAdmin && (
            <SidebarItem
              icon={VerifiedUserIcon}
              to="azure-rbac-maintenance"
              text="RBAC Maintenance..."
            />
          )}
          {/* End global nav */}
          <SidebarDivider />
          <SidebarScrollWrapper>
          <SidebarItem icon={DashboardIcon} to="axway-grafana-plugin" text="MFT Deployment" />
          </SidebarScrollWrapper>
        </SidebarGroup>
        <SidebarSpace />
        <SidebarDivider />
        <SidebarGroup
          label="Settings"
          icon={<UserSettingsSignInAvatar />}
          to="/settings"
        >
          <SidebarSettings />
        </SidebarGroup>
      </Sidebar>
      {children}
    </SidebarPage>
  );
};

export default Root;

