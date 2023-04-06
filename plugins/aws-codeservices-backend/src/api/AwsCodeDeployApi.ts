/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { parse } from "@aws-sdk/util-arn-parser";
import {
  BatchGetDeploymentGroupsCommand,
  BatchGetDeploymentGroupsCommandOutput,
  BatchGetDeploymentsCommand,
  BatchGetDeploymentsCommandOutput,
  CodeDeployClient,
  ListDeploymentsCommand,
} from "@aws-sdk/client-codedeploy";
import { AwsCredentialsManager } from "@backstage/integration-aws-node";

export class AwsCodeDeployApi {
  public constructor(
    private readonly awsCredentialsProvider: AwsCredentialsManager
  ) {}

  public async getDeploymentGroup(
    arn: string
  ): Promise<BatchGetDeploymentGroupsCommandOutput> {
    const { region, applicationName, deploymentGroupName } =
      this.parseDeploymentGroupArn(arn);

    const client = await this.getClient(region, arn);

    return await client.send(
      new BatchGetDeploymentGroupsCommand({
        applicationName,
        deploymentGroupNames: [deploymentGroupName],
      })
    );
  }

  public async getDeployments(
    arn: string
  ): Promise<BatchGetDeploymentsCommandOutput> {
    const { region, applicationName, deploymentGroupName } =
      this.parseDeploymentGroupArn(arn);

    const client = await this.getClient(region, arn);

    const deploymentIds = await client.send(
      new ListDeploymentsCommand({
        applicationName,
        deploymentGroupName,
      })
    );

    return await client.send(
      new BatchGetDeploymentsCommand({
        deploymentIds: deploymentIds.deployments,
      })
    );
  }

  private parseDeploymentGroupArn(arn: string): {
    accountId: string;
    region: string;
    service: string;
    resource: string;
    deploymentGroupName: string;
    applicationName: string;
  } {
    const parsedArn = parse(arn);

    const resourceParts = parsedArn.resource.split(":");

    if (resourceParts.length !== 2) {
      throw new Error(`CodeDeploy ARN not valid: ${arn}`);
    }

    const resourceNameParts = resourceParts[1].split("/");

    if (resourceNameParts.length !== 2) {
      throw new Error(`CodeDeploy ARN not valid: ${arn}`);
    }

    return {
      applicationName: resourceNameParts[0],
      deploymentGroupName: resourceNameParts[1],
      ...parsedArn,
    };
  }

  private async getClient(
    region: string,
    arn: string
  ): Promise<CodeDeployClient> {
    const credentialProvider =
      await this.awsCredentialsProvider.getCredentialProvider({ arn });

    return new CodeDeployClient({
      region: region,
      customUserAgent: "aws-codeservices-plugin-for-backstage",
      credentialDefaultProvider: () => credentialProvider.sdkCredentialProvider,
    });
  }
}
