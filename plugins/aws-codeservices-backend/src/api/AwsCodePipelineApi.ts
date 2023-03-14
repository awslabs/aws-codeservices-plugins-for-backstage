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

import {
  CodePipelineClient,
  PipelineExecutionSummary,
  paginateListPipelineExecutions,
  GetPipelineStateOutput,
  GetPipelineStateCommand,
} from "@aws-sdk/client-codepipeline";
import { parse } from "@aws-sdk/util-arn-parser";
import { AwsCredentialsManager } from "@backstage/integration-aws-node";

export class AwsCodePipelineApi {
  public constructor(
    private readonly awsCredentialsProvider: AwsCredentialsManager
  ) {}

  public async getPipelineExecutions(
    arn: string
  ): Promise<PipelineExecutionSummary[]> {
    const { region, resource } = parse(arn);

    const pipelineName = resource;

    const client = await this.getClient(region, arn);
    const paginatorConfig = {
      client,
      pageSize: 25,
    };
    const commandParams = {
      pipelineName,
    };
    const paginator = paginateListPipelineExecutions(
      paginatorConfig,
      commandParams
    );
    const executions = [];

    for await (const page of paginator) {
      executions.push(...(page.pipelineExecutionSummaries || []));
    }

    return executions;
  }

  public async getPipelineState(arn: string): Promise<GetPipelineStateOutput> {
    const { region, resource } = parse(arn);

    const name = resource;

    const client = await this.getClient(region, arn);

    return await client.send(
      new GetPipelineStateCommand({
        name,
      })
    );
  }

  private async getClient(
    region: string,
    arn: string
  ): Promise<CodePipelineClient> {
    const credentialProvider =
      await this.awsCredentialsProvider.getCredentialProvider({ arn });

    return new CodePipelineClient({
      region: region,
      customUserAgent: "aws-codeservices-plugin-for-backstage",
      credentialDefaultProvider: () => credentialProvider.sdkCredentialProvider,
    });
  }
}
