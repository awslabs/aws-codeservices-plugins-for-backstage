# AWS CodeSuite plugins for Backstage installation guide

This document covers the installation of the AWS CodeSuite plugins for Backstage into your Backstage application.

<!-- toc -->

- [AWS CodeSuite plugins for Backstage installation guide](#aws-codesuite-plugins-for-backstage-installation-guide)
  - [Prerequisites](#prerequisites)
  - [AWS credentials](#aws-credentials)
  - [IAM permissions](#iam-permissions)
  - [Install the backend plugin](#install-the-backend-plugin)
  - [Install the frontend UI plugin](#install-the-frontend-ui-plugin)

## Prerequisites

These instructions assume you already have a working Backstage application that you can install the plugins in. If this isn't the case, refer to the Backstage [Getting Started](https://backstage.io/docs/getting-started/) documentation.

## AWS credentials

By default, the AWS CodeSuite backend plugin relies on the [default behavior of the AWS SDK for Javascript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_credential_provider_node.html) to determine the AWS credentials that it uses to authenticate an identity to use with AWS APIs.

The AWS CodeSuite backend plugin that runs in your Backstage app searches for credentials in the following order:

1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
1. SSO credentials from the token cache
1. Web identity token credentials (including running in an Amazon EKS cluster using IAM roles for service accounts)
1. Shared credentials and config ini files (`~/.aws/credentials`, `~/.aws/config`)
1. Amazon Elastic Container Service (Amazon ECS) task metadata service
1. Amazon Elastic Compute Cloud (Amazon EC2) instance metadata service

We recommend that you don't hard-code long lived AWS credentials in your production Backstage application configuration. Hard-coding credentials is risky and might expose your access key ID and secret access key.

Instead, we recommend that you use short lived AWS credentials for your production Backstage application by deploying it to Amazon ECS, Amazon Elastic Kubernetes Service (Amazon EKS), or Amazon EC2. For more information about deploying Backstage to Amazon EKS using a Helm chart or to Amazon ECS on AWS Fargate using the AWS Cloud Development Kit (CDK), see [Deploying Backstage](https://backstage.io/docs/deployment/) in the Backstage documentation.

To use multiple AWS accounts with your Backstage app or to explicitly configure credentials for an AWS account, you can configure AWS accounts in your Backstage app's configuration. For example, to configure an AWS account to use with the AWS CodeSuite backend plugin which requires using an IAM role to retrieve credentials, add the following to your Backstage app-config.yaml file.

```yaml
aws:
  accounts:
    - accountId: "111111111111"
      roleName: "my-iam-role-name"
```

For more account configuration examples, see the [Backstage integration-aws-node package documentation](https://www.npmjs.com/package/@backstage/integration-aws-node).

## IAM permissions

The AWS CodeSuite backend plugin requires the AWS identity that it uses to have the following IAM permissions for populating the entity components:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "codepipeline:GetPipelineState",
        "codepipeline:ListPipelineExecutions",
        "codebuild:BatchGetProjects",
        "codebuild:BatchGetBuilds",
        "codebuild:ListBuildsForProject",
        "codedeploy:BatchGetDeploymentGroups",
        "codedeploy:ListDeployments",
        "codedeploy:BatchGetDeployments"
      ],
      "Resource": "*"
    }
  ]
}
```

## Install the backend plugin

Install the AWS CodeSuite backend plugin package in your Backstage app:

```shell
yarn workspace backend add @aws/aws-codesuite-backend-plugin-for-backstage
```

Create a file `packages/backend/src/plugins/awsCodeSuite.ts` with the following content:

```typescript
import { createRouter } from "@aws/aws-codesuite-backend-plugin-for-backstage";
import { PluginEnvironment } from "../types";

export default async function createPlugin(env: PluginEnvironment) {
  return await createRouter({
    logger: env.logger,
    config: env.config,
  });
}
```

Edit `packages/backend/src/index.ts` to register the backend plugin:

```diff
diff --git a/packages/backend/src/index.ts b/packages/backend/src/index.ts
index 70bc66b..1e624ae 100644
--- a/packages/backend/src/index.ts
+++ b/packages/backend/src/index.ts
@@ -28,6 +28,7 @@ import scaffolder from './plugins/scaffolder';
 import proxy from './plugins/proxy';
 import techdocs from './plugins/techdocs';
 import search from './plugins/search';
+import awsCodeSuite from './plugins/awsCodeSuite';
 import { PluginEnvironment } from './types';
 import { ServerPermissionClient } from '@backstage/plugin-permission-node';

@@ -79,6 +80,7 @@ async function main() {
   const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
   const searchEnv = useHotMemoize(module, () => createEnv('search'));
   const appEnv = useHotMemoize(module, () => createEnv('app'));
+  const awsCodeSuiteEnv = useHotMemoize(module, () => createEnv('aws-codesuite-backend'));

   const apiRouter = Router();
   apiRouter.use('/catalog', await catalog(catalogEnv));
@@ -87,6 +89,7 @@ async function main() {
   apiRouter.use('/techdocs', await techdocs(techdocsEnv));
   apiRouter.use('/proxy', await proxy(proxyEnv));
   apiRouter.use('/search', await search(searchEnv));
+  apiRouter.use('/aws-codesuite-backend', await awsCodeSuite(awsCodeSuiteEnv));

   // Add backends ABOVE this line; this 404 handler is the catch-all fallback
   apiRouter.use(notFoundHandler());
```

Verify that the backend plugin is running in your Backstage app. You should receive `{"status":"ok"}` when accessing this URL:
`https://<your backstage app>/api/aws-codesuite-backend/health`.

## Install the frontend UI plugin

Install the AWS CodeSuite frontend UI plugin package in your Backstage app:

```shell
yarn workspace app add @aws/aws-codesuite-plugin-for-backstage
```

To understand how to add the UI components to your Backstage app see [AWS CodeSuite plugins for Backstage reference](./reference.md).
