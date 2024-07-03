# rbac-azure

Welcome to the rbac-azure backend plugin!

_This plugin was created through the Backstage CLI_

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn
start` in the root directory, and then navigating to [/rbacAzurePlugin/health](http://localhost:7007/api/rbacAzurePlugin/health).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](/dev) directory.

### API Guide

#### SEQUENCE
[Sequence Diagram](./sequence.png)

The following API endpoints are provided to manage users, groups and roles within DEVO. This guide clarifies how these APIs are related and can be used together.

#### 1. Find User By Email
Fetch a user's information using their email address. This is typically the first step to obtain the user's object ID, which is required for adding or removing them from groups.

```sh
curl "http://localhost:8008/api/rbac/users?email=rsah@axway.com"
```

- **Response**: This will return the user's details, including their object ID.

**Example Response**:
```json
{
  "id": "c367deac-8d14-443b-b906-6ab67a362522",
  "email": "rsah@axway.com",
  "displayName": "Rajdeep Sah"
}
```

#### 2. Get Groups
Fetch groups that have a specific prefix. This helps in identifying the groups you want to manage.

```sh
curl "http://localhost:8008/api/rbac/groups?prefix=devo."
```

- **Response**: This will return a list of groups with their details, scoped to the "devo." prefix

**Example Response**:
```json
[
  {
    "id": "9b4c19d1-4bae-4ba2-aaac-ea748d5b0eb9",
    "displayName": "devo.product.foo"
  },
  {
    "id": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
    "displayName": "devo.component.bar"
  }
]
```

#### 3. Add Member to a Group
Add a user to a specified group using the user's object ID obtained from the "Find User By Email" endpoint.

```sh
curl -X POST "http://localhost:8008/api/rbac/groups/9b4c19d1-4bae-4ba2-aaac-ea748d5b0eb9/member/c367deac-8d14-443b-b906-6ab67a362522"
```

- **Request Parameters**:
  - `groupId`: The object ID of the group.
  - `memberId`: The object ID of the user to be added.

**Example**:
```sh
curl -X POST "http://localhost:8008/api/rbac/groups/9b4c19d1-4bae-4ba2-aaac-ea748d5b0eb9/member/c367deac-8d14-443b-b906-6ab67a362522"
```

#### 4. Remove a Member from the Group
Remove a user from a specified group using their object ID.

```sh
curl -X DELETE "http://localhost:8008/api/rbac/groups/9b4c19d1-4bae-4ba2-aaac-ea748d5b0eb9/member/c367deac-8d14-443b-b906-6ab67a362522"
```

- **Request Parameters**:
  - `groupId`: The object ID of the group.
  - `memberId`: The object ID of the user to be removed.

**Example**:
```sh
curl -X DELETE "http://localhost:8008/api/rbac/groups/9b4c19d1-4bae-4ba2-aaac-ea748d5b0eb9/member/c367deac-8d14-443b-b906-6ab67a362522"
```

#### 5. List All Members in a Group
List all members of a specified group.

```sh
curl "http://localhost:8008/api/rbac/groups/9b4c19d1-4bae-4ba2-aaac-ea748d5b0eb9/members"
```

- **Response**: This will return a list of members in the specified group.

**Example Response**:
```json
[
  {
    "id": "c367deac-8d14-443b-b906-6ab67a362522",
    "email": "rsah@axway.com",
    "displayName": "Rajdeep Sah"
  },
  ...
]
```

#### Assign a Role to Group

```sh
curl -X POST "http://localhost:8008/api/rbac/groups/9b4c19d1-4bae-4ba2-aaac-ea748d5b0eb9/roles/43eca184-12d7-465a-8d11-484ec4a1b287"
```

- **Description**: This API endpoint assigns a role to a specified group.
- **Parameters**:
  - `groupId`: The ID of the group to which the role will be assigned.
  - `roleId`: The ID of the role to be assigned. This value can be obtained from the `api/rbac/roles` route.

#### Remove a Role from Group

```sh
curl -X DELETE "http://localhost:8008/api/rbac/servicePrincipal/roleAssignment/0RlMm65LokuqrOp0jVsOuehYeQjj4OBEjduUOHAkvuo"
```

- **Description**: This API endpoint removes a role from a specified group.
- **Parameters**:
  - `roleAssignmentId`: The ID of the role assignment to be removed. This value can be obtained from the `api/rbac/group/<groupId>/roles` API call.


### Summary

The API endpoints provided are related and can be used in sequence to manage users and groups effectively:

1. **Find User By Email**: Obtain the user’s object ID.
2. **Get Groups**: Identify the groups you want to manage.
3. **Add Member to a Group**: Use the user’s object ID and group ID to add the user to the group.
4. **Remove a Member from the Group**: Use the user’s object ID and group ID to remove the user from the group.
5. **List All Members in a Group**: Verify the members of a group by listing them.
6. **Assign a Role to Group**: Use the `POST` method to assign a role to a group. Ensure you have the `groupId` and `roleId` from the respective API calls.
7. **Remove a Role from Group**: Use the `DELETE` method to remove a role assignment from a group. Ensure you have the `roleAssignmentId` from the `api/rbac/group/<groupId>/roles` API call.

This sequence ensures that you can manage user memberships within groups efficiently using the provided API endpoints.