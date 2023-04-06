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
  BatchGetBuildsCommand,
  BatchGetProjectsCommand,
  BatchGetProjectsCommandOutput,
  Build,
  CodeBuildClient,
  ListBuildsForProjectCommand,
} from "@aws-sdk/client-codebuild";
import { AwsCredentialsManager } from "@backstage/integration-aws-node";

export class AwsCodeBuildApi {
  public constructor(
    private readonly awsCredentialsProvider: AwsCredentialsManager
  ) {}

  public async getProject(arn: string): Promise<BatchGetProjectsCommandOutput> {
    const { region, projectName } = this.parseCodeBuildArn(arn);

    const client = await this.getClient(region, arn);

    return await client.send(
      new BatchGetProjectsCommand({
        names: [projectName],
      })
    );
  }

  public async getBuilds(arn: string): Promise<Build[]> {
    const { region, projectName } = this.parseCodeBuildArn(arn);

    const client = await this.getClient(region, arn);

    const buildIds = await client.send(
      new ListBuildsForProjectCommand({
        projectName,
      })
    );

    let builds: Build[] = [];

    if (buildIds.ids) {
      const output = await await client.send(
        new BatchGetBuildsCommand({
          ids: buildIds.ids,
        })
      );
      builds = output.builds ?? [];
    }

    return builds;
  }

  private parseCodeBuildArn(arn: string): {
    accountId: string;
    region: string;
    service: string;
    resource: string;
    projectName: string;
  } {
    const parsedArn = parse(arn);
    const resourceParts = parsedArn.resource.split("/");

    if (resourceParts.length !== 2) {
      throw new Error(`CodeBuild ARN not valid: ${arn}`);
    }

    return { projectName: resourceParts[1], ...parsedArn };
  }

  private async getClient(
    region: string,
    arn: string
  ): Promise<CodeBuildClient> {
    const credentialProvider =
      await this.awsCredentialsProvider.getCredentialProvider({ arn });

    return new CodeBuildClient({
      region: region,
      customUserAgent: "aws-codeservices-plugin-for-backstage",
      credentialDefaultProvider: () => credentialProvider.sdkCredentialProvider,
    });
  }
}
