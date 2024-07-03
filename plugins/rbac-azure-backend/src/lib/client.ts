// plugins/rbac-azure-backend/src/clients/msalClient.ts
import { ConfidentialClientApplication } from "@azure/msal-node";
import { Config } from '@backstage/config';
import { getMsalConfig, tokenRequest } from "./config";

export class MsalClient {
    private msalClient: ConfidentialClientApplication;

    private appId: string;
    constructor(config: Config) {
        const msalConfig = getMsalConfig(config);
        this.appId = msalConfig.auth.clientId;
        this.msalClient = new ConfidentialClientApplication(msalConfig);
    }

    getAppId() {
        return this.appId;
    }
    async getToken() {
        // Check for token in the environment variables
        const envToken = process.env.AZURE_ACCESS_TOKEN;
        if (envToken) {
            console.log("Using ENV TOKEN");
            return envToken;
        }
        const response = await this.msalClient.acquireTokenByClientCredential(tokenRequest);
        return response?.accessToken;
    }
}
