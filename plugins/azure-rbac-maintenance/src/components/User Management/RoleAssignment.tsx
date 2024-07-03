import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, MenuItem, Select, Typography, Box } from '@material-ui/core';

import { Table, TableColumn } from '@backstage/core-components';
import { useApi, discoveryApiRef } from '@backstage/core-plugin-api';

interface Role {
  roleName: string;
  id: string;
  appRoleId: string;
  displayName: string;
}

export const RoleAssignment = () => {
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [availableRole, setAvailableRole] = useState<Role[]>([]);
  const [assignedRole, setAssignedRole] = useState<Role[]>([]);
  // const [error, setError] = useState<string | null>(null);
  const discoveryApi = useApi(discoveryApiRef);
  const groupId = useRef<string[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const baseUrl = await discoveryApi.getBaseUrl('rbac');
        const response = await fetch(`${baseUrl}/groups?prefix=devo.`);
        const data = await response.json();

        const groupValues = data.map(
          (group: { description: string }) => group.description,
        );
        groupId.current = data.map((group: { id: string }) => group.id);
        setGroups(groupValues);
      } catch (error) {
        console.error('Error fetching groups:', error);
        // showError(error.message);
      }
    };

    fetchGroups();
  }, [discoveryApi]);

  const fetchAvailabeRoles = async () => {
    try {
      const baseUrl = await discoveryApi.getBaseUrl('rbac');
      const response1 = await fetch(`${baseUrl}/roles`);
      const data1 = await response1.json();
      const roles = data1.map(
        (role: { id: string; displayName: string; value: string }) => ({
          id: role.id,
          displayName: role.displayName,
          appRoleId: role.id,
        }),
      );
      setAvailableRole(roles);
    } catch (error) {
      console.error('Error fetching available roles:', error);
      // showError(error.message);
    }
  };

  const fetchAssignedRoles = useCallback(
    async (selectedGroupId: string) => {
      try {
        const baseUrl = await discoveryApi.getBaseUrl('rbac');
        const response = await fetch(
          `${baseUrl}/groups/${selectedGroupId}/roles`,
        );
        const data = await response.json();
        const roles = data.map(
          (role: { roleName: string; id: string; appRoleId: string }) => ({
            roleName: role.roleName,
            id: role.id,
            appRoleId: role.appRoleId,
          }),
        );
        setAssignedRole(roles);
      } catch (error) {
        console.error('Error fetching assigned roles:', error);
        // showError(error.message);
      }
    },
    [discoveryApi],
  );

  const updateRoles = async (selectedGroupId: string) => {
    await fetchAssignedRoles(selectedGroupId);
    await fetchAvailabeRoles();
  };

  const handleGroupChange = async (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const selectedGroupName = event.target.value as string;
    setSelectedGroup(selectedGroupName);

    const selectedGroupId = groupId.current[groups.indexOf(selectedGroupName)];
    await updateRoles(selectedGroupId);
  };

  const handleAddUser = async (role: { id: string; displayName: string }) => {
    const selectedGroupId = groupId.current[groups.indexOf(selectedGroup)];
    try {
      const baseUrl = await discoveryApi.getBaseUrl('rbac');
      const addUserResponse = await fetch(
        `${baseUrl}/groups/${selectedGroupId}/roles/${role.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (addUserResponse.ok) {
        await updateRoles(selectedGroupId);
      } else {
        const errorResponse = await addUserResponse.json();
        throw new Error(
          errorResponse.data.error.message || 'Failed to add user to group',
        );
      }
    } catch (error) {
      console.error('Error adding user to group:', error);
      // showError(error.message);
    }
  };

  const handleRemoveUsers = async (role: { roleName: string; id: string }) => {
    const selectedGroupId = groupId.current[groups.indexOf(selectedGroup)];
    try {
      const baseUrl = await discoveryApi.getBaseUrl('rbac');
      const removeRolesfromgroup = await fetch(
        `${baseUrl}/servicePrincipal/roleAssignment/${role.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (removeRolesfromgroup.ok) {
        await updateRoles(selectedGroupId);
      } else {
        const errorResponse = await removeRolesfromgroup.json();
        throw new Error(
          errorResponse.data.error.message ||
            'Failed to remove role from group',
        );
      }
    } catch (error) {
      console.error('Error removing role from group:', error);
      // showError(error.message);
    }
  };

  // const showError = (message: string) => {
  //   setError(message);
  //   setTimeout(() => {
  //     setError(null);
  //   }, 3000);
  // };

  const filterAvailableRoles = availableRole.filter(
    role =>
      !assignedRole.some(assignedRole => assignedRole.appRoleId === role.id),
  );

  const columns: TableColumn<{ displayName: string; id: string }>[] = [
    { title: 'RoleName', field: 'displayName' },
    {
      title: 'Actions',
      render: (rowData: { displayName: string; id: string }) => (
        <Button
          variant="contained"
          color="secondary"
          disabled={!selectedGroup}
          onClick={() => handleAddUser(rowData)}
        >
          Add to group
        </Button>
      ),
    },
  ];

  const columns1: TableColumn<{ roleName: string; id: string }>[] = [
    { title: 'RoleName', field: 'roleName' },
    {
      title: 'Actions',
      render: (rowData: { roleName: string; id: string }) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleRemoveUsers(rowData)}
        >
          Delete from group
        </Button>
      ),
    },
  ];

  return (
    <Box p={1}>
      <Box display="flex" justifyContent="right" mb={1}>
        <Box mr={1}>
          <Typography variant="h6">Select a Group</Typography>
        </Box>
        <Select value={selectedGroup} onChange={handleGroupChange} displayEmpty>
          <MenuItem value="" disabled>
            Select a Group
          </MenuItem>
          {groups.map(group => (
            <MenuItem key={group} value={group}>
              {group}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* {error && <ResponseErrorPanel error={error} />} */}

      <Box display="flex" justifyContent="space-between">
        <Box width="48%">
          <Table
            title="Available App Roles"
            options={{ search: false, paging: true, padding: 'dense' }}
            columns={columns}
            data={filterAvailableRoles}
          />
        </Box>
        <Box width="48%">
          <Table
            title="Assigned Roles to Group"
            options={{ search: false, paging: true, padding: 'dense' }}
            columns={columns1}
            data={assignedRole}
          />
        </Box>
      </Box>
    </Box>
  );
};
