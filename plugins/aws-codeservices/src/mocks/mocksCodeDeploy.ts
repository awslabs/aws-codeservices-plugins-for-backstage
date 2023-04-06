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
  BatchGetDeploymentGroupsCommandOutput,
  BatchGetDeploymentsCommandOutput,
} from "@aws-sdk/client-codedeploy";
import { Entity } from "@backstage/catalog-model";
import { AwsCodeDeployApi } from "../api";

export class MockCodeDeployService implements AwsCodeDeployApi {
  async getDeploymentGroup({
    arn: _arn,
  }: {
    arn: string;
  }): Promise<BatchGetDeploymentGroupsCommandOutput> {
    return {
      $metadata: {
        httpStatusCode: 200,
        requestId: "d764f56f-d4a4-4d99-964c-93befbdf51aa",
        attempts: 1,
        totalRetryDelay: 0,
      },
      deploymentGroupsInfo: [
        {
          applicationName: "AppECS-test-cluster-test-service",
          deploymentGroupId: "2ac1ab26-1ca9-48ca-a2ef-b6d9138c2ae6",
          deploymentGroupName: "DgpECS-test-cluster-test-service",
          deploymentConfigName: "CodeDeployDefault.ECSAllAtOnce",
          ec2TagFilters: [],
          onPremisesInstanceTagFilters: [],
          autoScalingGroups: [],
          serviceRoleArn: "arn:aws:iam::111111111111:role/codedeploy-ecs",
          triggerConfigurations: [],
          autoRollbackConfiguration: {
            enabled: true,
            events: ["DEPLOYMENT_STOP_ON_REQUEST", "DEPLOYMENT_FAILURE"],
          },
          deploymentStyle: {
            deploymentType: "BLUE_GREEN",
            deploymentOption: "WITH_TRAFFIC_CONTROL",
          },
          outdatedInstancesStrategy: "UPDATE",
          blueGreenDeploymentConfiguration: {
            terminateBlueInstancesOnDeploymentSuccess: {
              action: "TERMINATE",
              terminationWaitTimeInMinutes: 60,
            },
            deploymentReadyOption: {
              actionOnTimeout: "CONTINUE_DEPLOYMENT",
              waitTimeInMinutes: 0,
            },
          },
          loadBalancerInfo: {
            targetGroupPairInfoList: [
              {
                targetGroups: [
                  {
                    name: "tg-test-c-test-service-1",
                  },
                  {
                    name: "tg-test-c-test-service-2",
                  },
                ],
                prodTrafficRoute: {
                  listenerArns: [
                    "arn:aws:elasticloadbalancing:us-west-2:111111111111:listener/app/test-lb/ed4e449e173219d9/fc95e8f9f80ced8e",
                  ],
                },
                testTrafficRoute: {
                  listenerArns: [
                    "arn:aws:elasticloadbalancing:us-west-2:111111111111:listener/app/test-lb/ed4e449e173219d9/a59b4d24b6331feb",
                  ],
                },
              },
            ],
          },
          computePlatform: "ECS",
          ecsServices: [
            {
              serviceName: "test-service",
              clusterName: "test-cluster",
            },
          ],
        },
      ],
      errorMessage: "",
    };
  }

  async getDeployments({
    arn: _arn,
  }: {
    arn: string;
  }): Promise<BatchGetDeploymentsCommandOutput> {
    return {
      $metadata: {
        httpStatusCode: 200,
        requestId: "d886f56f-d4a4-4g99-964c-93befbdf51aa",
        attempts: 1,
        totalRetryDelay: 0,
      },
      deploymentsInfo: [
        {
          applicationName: "java-app-deploy",
          deploymentGroupName: "java-app-deploy",
          deploymentConfigName: "CodeDeployDefault.LambdaAllAtOnce",
          deploymentId: "2-3XYZ56D",
          revision: {
            revisionType: "S3",
            s3Location: {
              bucket: "bucket-name",
              key: "folder/object.json",
              bundleType: "JSON",
            },
          },
          status: "InProgress",
          createTime: subtractHours(1),
          creator: "user",
          ignoreApplicationStopFailures: false,
          updateOutdatedInstancesOnly: false,
          rollbackInfo: {},
          deploymentStyle: {
            deploymentType: "BLUE_GREEN",
            deploymentOption: "WITH_TRAFFIC_CONTROL",
          },
          instanceTerminationWaitTimeStarted: false,
          fileExistsBehavior: "DISALLOW",
          deploymentStatusMessages: [],
          computePlatform: "Lambda",
        },
        {
          applicationName: "java-app-deploy",
          deploymentGroupName: "java-app-deploy",
          deploymentConfigName: "CodeDeployDefault.LambdaAllAtOnce",
          deploymentId: "2-3XYZ56C",
          revision: {
            revisionType: "S3",
            s3Location: {
              bucket: "bucket-name",
              key: "folder/object.json",
              bundleType: "JSON",
            },
          },
          status: "Failed",
          errorInformation: {
            code: "INVALID_REVISION",
            message:
              "The AppSpec file cannot be located in the specified S3 bucket. Verify your AppSpec file is present and that the name and key value pair specified for your S3 bucket are correct. The S3 bucket must be in your current region",
          },
          createTime: new Date("2022-04-13T11:09:00.080000-05:00"),
          completeTime: new Date("2022-04-13T21:39:21.365Z"),
          creator: "user",
          ignoreApplicationStopFailures: false,
          updateOutdatedInstancesOnly: false,
          rollbackInfo: {},
          deploymentStyle: {
            deploymentType: "BLUE_GREEN",
            deploymentOption: "WITH_TRAFFIC_CONTROL",
          },
          instanceTerminationWaitTimeStarted: false,
          fileExistsBehavior: "DISALLOW",
          deploymentStatusMessages: [],
          computePlatform: "Lambda",
        },
      ],
    };
  }
}

export const mockCodeDeployEntity: Entity = {
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  metadata: {
    name: "backstage",
    description: "backstage.io",
    annotations: {
      "aws.amazon.com/aws-codedeploy-group":
        "arn:aws:codedeploy:us-west-2:11111111:deploymentgroup:hello-world/hello-world-group",
    },
  },
  spec: {
    lifecycle: "production",
    type: "service",
    owner: "user:guest",
  },
};

export const invalidCodeDeployEntity: Entity = {
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  metadata: {
    name: "backstage",
    description: "backstage.io",
    annotations: {
      "aws.amazon.com/aws-codedeploy-group": "bad-arn",
    },
  },
  spec: {
    lifecycle: "production",
    type: "service",
    owner: "user:guest",
  },
};

function subtractHours(numOfHours: number, date = new Date()) {
  const dateCopy = new Date(date.getTime());

  dateCopy.setHours(dateCopy.getHours() - numOfHours);

  return dateCopy;
}
