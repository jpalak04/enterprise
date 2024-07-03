import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  MenuItem,
  Select,
  Typography,
  Box,
  TextField,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { Table, TableColumn } from '@backstage/core-components';
import { useApi, discoveryApiRef } from '@backstage/core-plugin-api';

interface User {
  id: string;
  name: string;
  email: string;
}

export const AzureUserManagement = () => {
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string; mail: string }[]
  >([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [alreadyMember, setAlreadyMember] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string[]>([]);
  const discoveryApi = useApi(discoveryApiRef);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const baseUrl = await discoveryApi.getBaseUrl('rbac');
        const response = await fetch(`${baseUrl}/groups?prefix=devo.`);
        const data = await response.json();
        const groupValues = data.map(
          (group: { description: string }) => group.description,
        );
        const groupIds = data.map((group: { id: string }) => group.id);
        setGroups(groupValues);
        setGroupId(groupIds);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [discoveryApi]);

  const handleGroupChange = async (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const selectedGroupName = event.target.value as string;
    setSelectedGroup(selectedGroupName);

    const selectedGroupId = groupId[groups.indexOf(selectedGroupName)];

    try {
      const baseUrl = await discoveryApi.getBaseUrl('rbac');
      const response = await fetch(
        `${baseUrl}/groups/${selectedGroupId}/members`,
      );
      const data = await response.json();
      const userNames = data.map(
        (user: { id: string; displayName: string; mail: string }) => ({
          id: user.id,
          name: user.displayName,
          email: user.mail,
        }),
      );
      setAssignedUsers(userNames);
      setAlreadyMember(null);
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  };

  const fetchUsersByEmail = async (email: string) => {
    try {
      const baseUrl = await discoveryApi.getBaseUrl('rbac');
      const response = await fetch(`${baseUrl}/users?email=${email}`);
      if (!response.ok) {
        throw new Error('Error fetching users');
      }
      const data = await response.json();
      const userEmails = data.map(
        (user: { id: string; displayName: string; mail: string }) => ({
          id: user.id,
          name: user.displayName,
          mail: user.mail,
        }),
      );

      if (assignedUsers.find(user => user.email === email)) {
        setAlreadyMember('User is already a member of this group.');
        setSearchResults([]);
      } else {
        setSearchResults(userEmails);
        setAlreadyMember(null);
      }
    } catch (error) {
      console.error('Error fetching users by email:', error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const query = (event.target as HTMLInputElement).value;
    setSearchQuery(query);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (query) {
      searchTimeout.current = setTimeout(() => {
        fetchUsersByEmail(query);
      }, 1000);
    } else {
      setSearchResults([]);
      setAlreadyMember(null);
    }
  };

  const handleAddUser = async (user: {
    id: string;
    name: string;
    mail: string;
  }) => {
    const selectedGroupId = groupId[groups.indexOf(selectedGroup)];

    try {
      const baseUrl = await discoveryApi.getBaseUrl('rbac');
      const addUsersResponse = await fetch(
        `${baseUrl}/groups/${selectedGroupId}/member/${user.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (addUsersResponse.ok) {
        setAssignedUsers(prev => [
          ...prev,
          { id: user.id, name: user.name, email: user.mail },
        ]);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedUser(null);
      } else {
        throw new Error('Failed to add user to group');
      }
    } catch (error) {
      console.error('Error adding user to group:', error);
    }
  };

  const handleRemoveUsers = async (user: {
    id: string;
    name: string;
    email: string;
  }) => {
    const selectedGroupId = groupId[groups.indexOf(selectedGroup)];

    try {
      const baseUrl = await discoveryApi.getBaseUrl('rbac');
      const removeUsersResponse = await fetch(
        `${baseUrl}/groups/${selectedGroupId}/member/${user.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (removeUsersResponse.ok) {
        setAssignedUsers(prev => prev.filter(u => u.email !== user.email));
      } else {
        throw new Error('Failed to remove user from group');
      }
    } catch (error) {
      console.error('Error removing user from group:', error);
    }
  };

  const columns: TableColumn<{ id: string; name: string; email: string }>[] = [
    { title: 'Name', field: 'name' },
    { title: 'Email', field: 'email' },
    {
      title: 'Actions',
      render: (rowData: { id: string; name: string; email: string }) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleRemoveUsers(rowData)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Box p={1}>
      <Box display="flex" justifyContent="right" mb={1}>
        <Box mr={2}>
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
      <Box mb={3}>
        <Box display="flex" alignItems="center">
          <TextField
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by email ID"
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (searchResults.length > 0 && selectedUser) {
                const user = searchResults.find(
                  user => user.id === selectedUser,
                );
                if (user) handleAddUser(user);
              }
            }}
            style={{ marginLeft: 10 }}
            disabled={!selectedGroup || !selectedUser}
          >
            Add Member
          </Button>
        </Box>
        {alreadyMember && (
          <Typography color="error">{alreadyMember}</Typography>
        )}
        <List>
          {searchResults.map(user => (
            <ListItem key={user.id} button>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedUser === user.id}
                    onChange={e =>
                      setSelectedUser(e.target.checked ? user.id : null)
                    }
                  />
                }
                label={user.name}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Table
        title="Group Members"
        options={{ search: true, paging: true, padding: 'dense' }}
        columns={columns}
        data={assignedUsers}
      />
    </Box>
  );
};

export default AzureUserManagement;
