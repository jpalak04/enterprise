import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Config } from '@backstage/config';
import { GroupRoleService } from './roleService'; // Adjust the path as necessary
import { Logger } from 'winston';

export interface RouterOptions {
  logger: Logger;
  config: Config
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {

  const { logger, config } = options;
  const roleService = new GroupRoleService(config, logger);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  //GROUP API's
  /**
   * Get all groups in Azure AD
   * @param prefix The prefix of the group
   * @returns The list of groups or 500 if an error occurs
   */
  router.get('/groups', async (req, res) => {
    try {
      const { prefix } = req.query;
      const groups = await roleService.getGroupsByPrefix(prefix as string);
      res.status(200).json(groups);
    } catch (error: any) {
      logger.error(`Error fetching groups: ${error}`);
      res.status(500).json({ error: error, data: error.response?.data });
    }
  });

  /**
   * Get all members of a group in Azure AD
   * @param groupId The object ID of the group
   * @returns The list of members or 500 if an error occurs
   * 
   */
  router.get('/groups/:groupId/members', async (req, res) => {
    const { groupId } = req.params;
    try {
      const members = await roleService.getGroupMembers(groupId);
      res.status(200).json(members);
    } catch (error: any) {
      logger.error(`Error fetching group members: ${error}`);
      res.status(500).json({ error: error, data: error.response?.data });
    }
  });
  /**
   * Get all members of a group in Azure AD
   * @param groupId The object ID of the group
   * @returns The list of members or 500 if an error occurs
   * 
   */
  router.get('/groups/:groupId/roles', async (req, res) => {
    const { groupId } = req.params;
    try {
      const members = await roleService.getRolesAssignedToGroup(groupId);
      res.status(200).json(members);
    } catch (error: any) {
      logger.error(`Error fetching group role assignment: ${error}`);
      res.status(500).json({ error: error, data: error.response?.data });
    }
  });

  //Add User to Group
  router.post('/groups/:groupId/member/:memberId', async (req, res) => {
    try {
      const { groupId, memberId } = req.params;
      const result = await roleService.addUserToGroup(groupId, memberId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error adding member to group: ${error}`);
      res.status(500).json({ error: error.message, data: error.response?.data });
    }
  });

  // Remove User from Group
  /**
   * Remove a user from a group in Azure AD
   * @param groupId The object ID of the group
   * @param memberId The object ID of the user
   * @returns The result of the operation or 500 if an error occurs
   */
  router.delete('/groups/:groupId/member/:memberId', async (req, res) => {
    try {
      const { groupId, memberId } = req.params;
      const result = await roleService.removeUserFromGroup(groupId, memberId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error removing member from group: ${error.message}`);
      res.status(500).json({ error: error.message, data: error.response?.data });
    }
  });

  //ROLE API's
  /**
   * Create a new role in Azure AD
   * @param roleName The name of the role
   * @param roleDescription The description of the role
   * @returns The created role or 500 if an error occurs
   * 
   */
  router.post('/roles', async (req, res) => {
    try {
      const { roleName, roleDescription } = req.body;
      const role = await roleService.createRole(roleName, roleDescription);
      res.status(201).json(role);
    } catch (error: any) {
      logger.error(`Error creating role: ${error.message}`);
      res.status(500).json({ error: error, data: error.response?.data });
    }
  });
  /**
   * Get all roles in Azure AD
   * @returns The list of roles or 500 if an error occurs
   */
  router.get('/roles', async (_req, res) => {
    try {
      const roles = await roleService.getRoles();
      res.status(200).json(roles);
    } catch (error: any) {
      logger.error(`Error fetching roles: ${error.message}`);
      res.status(500).json({ error: error, data: error.response?.data });
    }
  });

  /**
   * Get all users in a role in Azure AD
   * @param roleId The object ID of the role
   * @returns The list of users or 500 if an error occurs
   * 
   */
  router.get('/users', async (req, res) => {
    const { email } = req.query; // Extract email from query parameters
    if (!email) {
      res.status(400).json({ error: 'Email query parameter is required' });
    }
    try {
      const roles = await roleService.getUserObjectByEmail(email as string); // Cast email to string
      res.status(200).json(roles);
    } catch (error: any) {
      logger.error(`Error fetching roles for ${email}: ${error.message}`);
      res.status(500).json({ error: error.message, data: error.response?.data });
    }
  });
  /**
   * Get all users in a role in Azure AD
   * @param roleId The object ID of the role
   * @returns The list of users or 500 if an error occurs
   * 
   * Disbale for now
  router.post('/roles/:roleId/users/:userId', async (req, res) => {
    try {
      const { roleId, userId } = req.params;
      const result = await roleService.addUserToRole(userId, roleId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error adding user to role: ${error.message}`);
      res.status(500).json({ error: error, data: error.response?.data });
    }
  });
*/

  /**
   * Add a role to a group
   * @param roleId The object ID of the role
   * @param userId The object ID of the user
   * @returns The result of the operation or 500 if an error occurs
   * 
   */
  router.post('/groups/:groupId/roles/:roleId', async (req, res) => {
    try {
      const { groupId, roleId } = req.params;
      const result = await roleService.addRoleToGroup(groupId, roleId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error adding group to role: ${error.message}`);
      res.status(500).json({ error: error.message, data: error.response?.data });
    }
  });
  /**
   * Remove a user from a role in Azure AD
   * @param roleId The object ID of the role
   * @param userId The object ID of the user
   * @returns The result of the operation or 500 if an error occurs
   * 
   */
  router.delete('/servicePrincipal/roleAssignment/:roleAssignmentId', async (req, res) => {
    try {
      const { roleAssignmentId } = req.params;
      const result = await roleService.removeRoleFromGroup(roleAssignmentId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error removing group from role: ${error.message}`);
      res.status(500).json({ error: error.message, data: error.response?.data });
    }
  });
  

  router.use(errorHandler());
  return router;
}
