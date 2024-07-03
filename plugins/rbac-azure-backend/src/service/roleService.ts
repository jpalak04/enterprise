// plugins/rbac-azure-backend/src/services/roleService.ts
import axios from "axios";
import { Config } from '@backstage/config';
import { MsalClient } from "../lib/client";
import { Logger } from "winston";

const GRAPH_API_URL = "https://graph.microsoft.com/v1.0";

// Create a class for the GroupRoleService
export class GroupRoleService {
  private msalClient: MsalClient;
  private logger: Logger;
  private spId: string;

  constructor(config: Config, logger: Logger) {
    this.msalClient = new MsalClient(config);
    this.logger = logger;
    this.spId = "";

  }
  /**
   * Create a new role in Azure AD
   * @param roleName The name of the role
   * @param roleDescription The description of the role
   * @returns The role object
   *  
   */
  async createRole(roleName: string, roleDescription: string) {
    const token = await this.msalClient.getToken();
    try {
      const response = await axios.post(
        `${GRAPH_API_URL}/directoryRoles`,
        {
          displayName: roleName,
          description: roleDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

        })
      return response.data;

    } catch (error) {
      handleAxiosError(error, this.logger);
      throw error;
    }

  }
  /**
   * Get all roles in Azure AD
   *    
   *  @returns The list of roles
   */
  async getRoles() {
    const token = await this.msalClient.getToken();
    const servicePrincipalId = await this.getServicePrincipalId();

    this.logger.debug("Service Principal ID:", servicePrincipalId);
    try {
      const response = await axios.get(`${GRAPH_API_URL}/servicePrincipals/${servicePrincipalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.logger.debug("App Roles Response data:", response.data); // Log the response data

      return response.data.appRoles;
    } catch (error) {
      handleAxiosError(error, this.logger);
      throw error;
    }
  }

  /**
   * Add a user to a role in Azure AD
   * @param userId The object ID of the user
   * @param roleId The object ID of the role
   * @returns The response data
   */
  async addUserToRole(userId: string, roleId: string) {
    const token = await this.msalClient.getToken();
    try {
      const response = await axios.post(
        `${GRAPH_API_URL}/directoryRoles/${roleId}/members/$ref`,
        {
          "@odata.id": `${GRAPH_API_URL}/users/${userId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      return response.data;
    } catch (error) {
      handleAxiosError(error, this.logger);
      throw error;
    }
  }

  /**
   * Remove a user from a group in Azure AD
   * @param groupId The object ID of the group
   * @param userId The object ID of the user
   * @returns The response data
   */
  async removeUserFromGroup(groupId: string, userId: string) {
    const token = await this.msalClient.getToken();
    this.logger.info(`Using token: ${token}`); // Log the token

    try {
      const response = await axios.delete(
        `${GRAPH_API_URL}/groups/${groupId}/members/${userId}/$ref`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      this.logger.info(`Remove User Response data: ${JSON.stringify(response.data, null, 2)}`); // Log the response data
      return response.data;
    } catch (error) {
      handleAxiosError(error, this.logger);
      throw error;
    }
  }




  /**
   * Get the object ID of the service principal
   * @returns The object ID of the service principal
   */

  private async getServicePrincipalId() {
    if (this.spId) {
      return this.spId;
    }
    const token = await this.msalClient.getToken();
    const appId = await this.msalClient.getAppId();
    this.logger.debug(`Using token: ${token}`); // Log the token
    const response = await axios.get(`${GRAPH_API_URL}/servicePrincipals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        $filter: `appId eq '${appId}'`
      }
    });
    const servicePrincipal = response.data.value.find((sp: any) => sp.appId === appId);
    this.spId = servicePrincipal.id;
    return servicePrincipal.id;
  }

  /**
   * Get the object ID of a user by email
   * @param email The email of the user
   * @returns The object ID of the user
   */
  async getUserObjectByEmail(email: string) {
    const token = await this.msalClient.getToken();
    try {
      const response = await axios.get(`${GRAPH_API_URL}/users?$filter=userPrincipalName eq '${email}'`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.value.length === 0) {
        throw new Error(`User with email ${email} not found`);
      }
      return response.data.value;
    } catch (error) {
      handleAxiosError(error, this.logger);
      throw error;
    }
  }

  /**
   * Get the object ID of a group by name
   * @param group The name of the group
   * @returns The object ID of the group
   */
  async getGroupObjectIdByName(group: string): Promise<string> {
    const token = await this.msalClient.getToken();
    try {
      const response = await axios.get(`${GRAPH_API_URL}/group?$filter=groupName eq '${group}'`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.data.value.length === 0) {
        throw new Error(`User with email ${group} not found`);
      }
      return response.data.value[0].id;
    } catch (error) {
      handleAxiosError(error, this.logger);
      throw error;
    }
  }
  /**
   * Get a list of groups by prefix
   * @param prefix The prefix of the group name
   * @returns The list of groups
   */
  async getGroupsByPrefix(prefix: string) {
    const token = await this.msalClient.getToken();
    try {
      const response = await axios.get(`${GRAPH_API_URL}/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          $filter: `startswith(displayName, '${prefix}')`,
        },
      })
      return response.data.value;
    } catch (error) {
      handleAxiosError(error, this.logger);
      throw error;


    }
  }

  /**
   * Get a list of members of a group
   * @param groupId The object ID of the group
   * @returns The list of members
   */
  async getGroupMembers(groupId: string) {
    const token = await this.msalClient.getToken();

    try {
      const response = await axios.get(`${GRAPH_API_URL}/groups/${groupId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      )
      return response.data.value;

    } catch (error) {
      handleAxiosError(error, this.logger);
      throw error;
    }

  }

  /**
   * Add a group to a role in Azure AD
   * @param groupId The object ID of the group
   * @param roleId The object ID of the role
   * @returns The response data
   */
  async addRoleToGroup(groupId: string, roleId: string) {
    const token = await this.msalClient.getToken();
    const servicePrincipalId = await this.getServicePrincipalId();

    const payload = {
      principalId: groupId,
      resourceId: servicePrincipalId,
      appRoleId: roleId
    };    try {
      const response = await axios.post(
        `${GRAPH_API_URL}/groups/${groupId}/appRoleAssignments`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      this.logger.debug(`Add Group to Role Response data: ${JSON.stringify(response.data, null, 2)}`); // Log the response data
      return response.data;
    } catch (error) {
      handleAxiosError(error, this.logger);
      throw error;
    }

  }

  /**
   * Remove a group from a role in Azure AD
   * @param groupId The object ID of the group
   * @param roleId The object ID of the role
   * @returns The response data
   */
  async removeRoleFromGroup (appRoleId: string) {
    const token = await this.msalClient.getToken();
    this.logger.info(`Using token: ${token}`); // Log the token
    const servicePrincipalId=await this.getServicePrincipalId();

    try {
      const response = await axios.delete(
        `${GRAPH_API_URL}/servicePrincipals/${servicePrincipalId}/appRoleAssignedTo/${appRoleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      this.logger.debug(`Remove Group from Role Response data: ${JSON.stringify(response.data, null, 2)}`); // Log the response data
      return response.data;
    } catch (error) {
      handleAxiosError(error, this.logger);
      throw error;
    }
  }

  /**
   * Get roles assigned to a group in Azure AD
   * @param groupId The object ID of the group
   * @returns The list of roles assigned to the group
   */
  async getRolesAssignedToGroup(groupId: string) {
    const token = await this.msalClient.getToken();

    try {
      const response = await axios.get(`${GRAPH_API_URL}/groups/${groupId}/appRoleAssignments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      this.logger.debug(`Roles Assigned to Group Response data: ${JSON.stringify(response.data, null, 2)}`); // Log the response data

      const appRoleAssignments = response.data.value;

      // Fetch role names for each appRoleAssignment
      const rolesWithNames = await Promise.all(appRoleAssignments.map(async (assignment: any) => {
        const appRoles = await this.getAppRoles(assignment.resourceId);
        const role = appRoles.find((r: any) => r.id === assignment.appRoleId);
        return {
          ...assignment,
          roleName: role ? role.displayName : 'Unknown Role',
        };
      }));

      return rolesWithNames;
    } catch (error: any) {
      handleAxiosError(error, this.logger);
      throw error;
    }
  }

  async addUserToGroup(groupId: string, userId: string) {
        const token = await this.msalClient.getToken();
      
        const payload = {
          "@odata.id": `https://graph.microsoft.com/v1.0/directoryObjects/${userId}`
        };
      
        const requestConfig = {
          method: 'post',
          url: `${GRAPH_API_URL}/groups/${groupId}/members/$ref`,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: payload
        };
      
        try {
          const response = await axios(requestConfig);
          this.logger.info("Add User Response data:", response.data); // Log the response data
      
          return response.data;
        }
        catch (error) {
          handleAxiosError(error, this.logger);
          throw error;
        }
      
      
      }
      
    

  /**
   * Get app roles for a given resource ID
   * @param resourceId The resource ID
   * @returns The list of app roles
   */
  private async getAppRoles(resourceId: string) {
    const token = await this.msalClient.getToken();
    const response = await axios.get(`${GRAPH_API_URL}/servicePrincipals/${resourceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.appRoles;
  }
}

function handleAxiosError(error: any, logger: Logger): void {
  if (error.response) {

    logger.error(`Error response data: ${JSON.stringify(error.response.data.error)}`);
    logger.error(`Error status: ${error.response.status}`);
  } else if (error.request) {
    logger.error(`Error request: ${error.request}`);
  } else {
    logger.error(`Error message: ${error.message}`);
  }
}

