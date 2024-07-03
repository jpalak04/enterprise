
# Authorization Concerns

Below is the basic outline on how to setup various auth providers for Backstage and for our 3rd Party solutions such as Gitlab, confluence and Jira

## Backstage Application

1. **Configure Azure AD:**
   You'll first need to set up an app registration in Azure AD for Backstage.

   - In the Azure portal, go to Azure Active Directory -> App registrations -> New registration.
   - Set a name for the app and choose the appropriate account types.
   - Add a redirect URI. This will be the URL where Azure AD will send the user back after they've signed in, for example: `https://<your-backstage-instance>/api/auth/saml/acs`.

   Note down the Application (client) ID, Directory (tenant) ID, and create a new client secret under Certificates & secrets tab. Make sure you save the value of the secret, as you will not be able to retrieve it later.

   Now go to the 'Enterprise applications' service from the Azure services, find the application you just created, and under the 'Single sign-on' menu, choose 'SAML'. Fill in the Basic SAML Configuration:

   - Identifier (Entity ID): `https://<your-backstage-instance>/api/auth/saml/metadata`
   - Reply URL (Assertion Consumer Service URL): `https://<your-backstage-instance>/api/auth/saml/acs`
   - Sign on URL: `https://<your-backstage-instance>`

   Download the Federation Metadata XML from the SAML Signing Certificate section and save it. It will be needed in the backstage configuration.

2. **Configure Backstage:**
   
   In your `app-config.yaml` file, add the following:

   ```yaml
   auth:
     providers:
       saml:
         development:
           entryPoint: 'https://login.microsoftonline.com/<TENANT_ID>/saml2'
           issuer: 'https://<your-backstage-instance>/api/auth/saml/metadata'
           path: '/api/auth/saml/acs'
           appOrigin: 'https://<your-backstage-instance>'
           authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows'
           identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
           cert: <INSERT CERTIFICATE HERE>
           decryptionPvk: <INSERT PRIVATE KEY HERE>
           signatureAlgorithm: 'sha256'
           acceptedClockSkewMs: 1000
   ```

   Replace `<your-backstage-instance>` with your Backstage app's URL, and `<TENANT_ID>` with your Azure AD tenant ID.

   The `<INSERT CERTIFICATE HERE>` and `<INSERT PRIVATE KEY HERE>` values are the certificate and private key that you obtained from the Federation Metadata XML you downloaded from Azure AD.

3. **Add Sign-In Options in Frontend:**
   
   In your Backstage frontend, you need to customize the `SignInPage` component to add a sign-in option for Azure AD. There should be a sign-in method for 'SAML'. This would require some UI development to create a button or some other clickable element that users can use to start the sign-in process.

4. **Handle User Tokens:**

   After a user signs in, the SAML provider will return a SAML assertion, which Backstage will convert into a Backstage Identity token. You can then use this token to authorize requests from the frontend to the backend.

### 2FA

Regarding the 2FA requirement, if it's managed on Azure AD side, once the user authenticates with 2FA on Azure AD's sign-in page, they should be able to access Backstage without needing to re-authenticate, as long as their session is still valid.

## 3rd Party Services

### Personal Access Tokens

To make authenticated API calls to GitLab, you'll typically need a GitLab Personal Access Token. The specific way to obtain this token varies depending on your setup. You could, for example, prompt the user to enter their Personal Access Token, or use an OAuth flow to get an access token on behalf of the user.

Backstage does provide a way to handle this kind of situation, through the concept of [Software Catalog Identity](https://backstage.io/docs/integrations/auth-and-identity/#software-catalog-identity), though this feature might not have been fully implemented as of my knowledge cutoff in September 2021.

Here's a general idea of how it might work:

1. **User Signs in to Backstage**: The user signs in to Backstage using their Azure AD credentials, as described in the previous steps.

2. **User Provides GitLab Credentials**: The user provides their GitLab Personal Access Token, which is securely stored and associated with their Backstage identity. This could be done via a custom UI in Backstage.

3. **Backstage Calls GitLab API**: When Backstage needs to call the GitLab API on behalf of the user, it retrieves the stored token and includes it in the API call.

4. **GitLab Checks the Token**: GitLab checks the token to ensure it's valid and belongs to the user that Backstage is acting on behalf of. If the token is valid, GitLab fulfills the API request.

Remember, storing and managing Personal Access Tokens is a security-sensitive operation, and should be done with great care. Make sure you follow best practices for storing secrets, such as encrypting the tokens at rest and only sending them over secure connections.

### OAuth Flow 

- **User Authentication (Azure AD)**: Users sign into Backstage using SAML, authenticating against your Azure AD. This is the flow we outlined before. It establishes the user's identity within Backstage.

- **Interacting with External Services (like GitLab)**: Once the user's identity is established, for certain actions like accessing GitLab, Backstage can use OAuth to get an access token that allows it to make requests to GitLab on behalf of the user.

Here's a high-level overview of the process:

1. User signs into Backstage using SAML, authenticating against your Azure AD.

2. When the user wants to perform an action that involves GitLab (like creating a new repository), Backstage initiates an OAuth flow with GitLab.

3. The user is redirected to GitLab's OAuth authorization page (potentially involving another SAML authentication if GitLab is also set up with Azure AD as its Identity Provider).

4. The user authorizes Backstage to access GitLab on their behalf.

5. GitLab redirects the user back to Backstage with an authorization code.

6. Backstage exchanges the authorization code for an access token.

7. Backstage can now make requests to GitLab on behalf of the user by including the access token in the API calls.

The key to this setup is configuring GitLab and potentially other services you want to integrate to accept OAuth and interact properly with Backstage. This would involve setting up an OAuth application in GitLab and providing the client ID and client secret to Backstage through its configuration. 

Remember that this setup involves managing a lot of sensitive tokens and secrets, and it's crucial to ensure that they are stored and handled securely to prevent unauthorized access. Always follow best practices for managing OAuth tokens and other credentials.