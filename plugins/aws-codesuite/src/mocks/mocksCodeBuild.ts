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
  BatchGetProjectsCommandOutput,
  Build,
} from "@aws-sdk/client-codebuild";
import { Entity } from "@backstage/catalog-model";
import { AwsCodeBuildApi } from "../api";

export class MockCodeBuildService implements AwsCodeBuildApi {
  async getProject({
    arn,
  }: {
    arn: string;
  }): Promise<BatchGetProjectsCommandOutput> {
    return {
      $metadata: {
        httpStatusCode: 200,
        requestId: "d764f56f-d4a4-4d99-964c-93befbdf51aa",
        attempts: 1,
        totalRetryDelay: 0,
      },
      projects: [
        {
          name: "Deploy2Project-KpLyLCIGYbKE",
          arn,
          source: {
            type: "CODEPIPELINE",
            buildspec:
              '{\n  "version": "0.2",\n  "phases": {\n    "build": {\n      "commands": [\n        "pip3 install --upgrade --user awscli",\n        "aws proton --region $AWS_DEFAULT_REGION update-service-instance --deployment-type CURRENT_VERSION --name $service_instance_name --service-name $service_name --spec file://rendered_service.yaml",\n        "aws proton --region $AWS_DEFAULT_REGION wait service-instance-deployed --name $service_instance_name --service-name $service_name"\n      ]\n    }\n  }\n}',
            insecureSsl: false,
          },
          artifacts: {
            type: "CODEPIPELINE",
            name: "Deploy2Project-KpLyLCIGYbKE",
            packaging: "NONE",
            encryptionDisabled: false,
          },
          cache: {
            type: "NO_CACHE",
          },
          environment: {
            type: "LINUX_CONTAINER",
            image: "aws/codebuild/amazonlinux2-x86_64-standard:3.0",
            computeType: "BUILD_GENERAL1_SMALL",
            environmentVariables: [
              {
                name: "service_name",
                value: "codepipeline-demo",
                type: "PLAINTEXT",
              },
              {
                name: "service_instance_name",
                value: "prod",
                type: "PLAINTEXT",
              },
            ],
            privilegedMode: false,
            imagePullCredentialsType: "CODEBUILD",
          },
          serviceRole:
            "arn:aws:iam::111111111111:role/AWSProton-codepipeline-de-cloudform-DeploymentRole-1P0MVDGMT0IGM",
          timeoutInMinutes: 60,
          queuedTimeoutInMinutes: 480,
          encryptionKey:
            "arn:aws:kms:us-west-2:111111111111:key/d37f7299-9412-485e-b467-33a05e8e9622",
          tags: [
            {
              key: "proton:service",
              value:
                "arn:aws:proton:us-west-2:111111111111:service/codepipeline-demo",
            },
            {
              key: "proton:account",
              value: "111111111111",
            },
            {
              key: "proton:template",
              value:
                "arn:aws:proton:us-west-2:111111111111:service-template/apprunner-image-buildpack",
            },
          ],
          created: new Date("2022-05-20T13:58:29.342000-06:00"),
          lastModified: new Date("2022-05-20T13:58:29.342000-06:00"),
          badge: {
            badgeEnabled: false,
          },
          projectVisibility: "PRIVATE",
        },
      ],
      projectsNotFound: [],
    };
  }

  async listBuilds({ arn }: { arn: string }): Promise<Build[]> {
    return [
      {
        arn,
        artifacts: {
          encryptionDisabled: false,
          location: "arn:aws:s3:::nk-hello-artifact/hello-world",
          md5sum: "",
          overrideArtifactName: false,
          sha256sum: "",
        },
        buildComplete: true,
        buildNumber: 10,
        buildStatus: "SUCCEEDED",
        cache: {
          type: "NO_CACHE",
        },
        currentPhase: "COMPLETED",
        encryptionKey: "arn:aws:kms:us-west-2:461868971318:alias/aws/s3",
        endTime: new Date("2022-04-13T23:34:38.397Z"),
        environment: {
          computeType: "BUILD_GENERAL1_SMALL",
          environmentVariables: [],
          image: "aws/codebuild/standard:5.0",
          imagePullCredentialsType: "CODEBUILD",
          privilegedMode: false,
          type: "LINUX_CONTAINER",
        },
        id: "hello-world:792ebbad-1dbb-4594-8206-5a09ed4330b6",
        initiator: "nimak",
        logs: {
          cloudWatchLogs: {
            status: "ENABLED",
          },
          cloudWatchLogsArn:
            "arn:aws:logs:us-west-2:461868971318:log-group:/aws/codebuild/hello-world:log-stream:792ebbad-1dbb-4594-8206-5a09ed4330b6",
          deepLink:
            "https://console.aws.amazon.com/cloudwatch/home?region=us-west-2#logEvent:group=/aws/codebuild/hello-world;stream=792ebbad-1dbb-4594-8206-5a09ed4330b6",
          groupName: "/aws/codebuild/hello-world",
          s3Logs: {
            encryptionDisabled: false,
            status: "DISABLED",
          },
          streamName: "792ebbad-1dbb-4594-8206-5a09ed4330b6",
        },
        phases: [
          {
            durationInSeconds: 0,
            endTime: new Date("2022-04-13T23:31:26.165Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "SUBMITTED",
            startTime: new Date("2022-04-13T23:31:26.086Z"),
          },
          {
            durationInSeconds: 1,
            endTime: new Date("2022-04-13T23:31:28.022Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "QUEUED",
            startTime: new Date("2022-04-13T23:31:26.165Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 19,
            endTime: new Date("2022-04-13T23:31:47.454Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "PROVISIONING",
            startTime: new Date("2022-04-13T23:31:28.022Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 2,
            endTime: new Date("2022-04-13T23:31:50.437Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "DOWNLOAD_SOURCE",
            startTime: new Date("2022-04-13T23:31:47.454Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 4,
            endTime: new Date("2022-04-13T23:31:55.327Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "INSTALL",
            startTime: new Date("2022-04-13T23:31:50.437Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 7,
            endTime: new Date("2022-04-13T23:32:02.465Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "PRE_BUILD",
            startTime: new Date("2022-04-13T23:31:55.327Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 3,
            endTime: new Date("2022-04-13T23:32:05.531Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "BUILD",
            startTime: new Date("2022-04-13T23:32:02.465Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 0,
            endTime: new Date("2022-04-13T23:32:05.570Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "POST_BUILD",
            startTime: new Date("2022-04-13T23:32:05.531Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 0,
            endTime: new Date("2022-04-13T23:32:06.322Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "UPLOAD_ARTIFACTS",
            startTime: new Date("2022-04-13T23:32:05.570Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 2,
            endTime: new Date("2022-04-13T23:32:08.397Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "FINALIZING",
            startTime: new Date("2022-04-13T23:32:06.322Z"),
          },
          {
            phaseType: "COMPLETED",
            startTime: new Date("2022-04-13T23:32:08.397Z"),
          },
        ],
        projectName: "hello-world",
        queuedTimeoutInMinutes: 480,
        resolvedSourceVersion: "e37188da86d7b4c143238954f961b85d23f87678",
        secondaryArtifacts: [],
        secondarySourceVersions: [],
        secondarySources: [],
        serviceRole:
          "arn:aws:iam::461868971318:role/service-role/codebuild-hello-world-service-role",
        source: {
          buildspec:
            'version: 0.2\n\n#env:\n  #variables:\n     # key: "value"\n     # key: "value"\n  #parameter-store:\n     # key: "value"\n     # key: "value"\n  #secrets-manager:\n     # key: secret-id:json-key:version-stage:version-id\n     # key: secret-id:json-key:version-stage:version-id\n  #exported-variables:\n     # - variable\n     # - variable\n  #git-credential-helper: yes\n#batch:\n  #fast-fail: true\n  #build-list:\n  #build-matrix:\n  #build-graph:\nphases:\n  install:\n    #If you use the Ubuntu standard image 2.0 or later, you must specify runtime-versions.\n    #If you specify runtime-versions and use an image other than Ubuntu standard image 2.0, the build fails.\n    #runtime-versions:\n      # name: version\n      # name: version\n    commands:\n      - wget -c https://dl.google.com/go/go1.14.2.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local\n      - export PATH=$PATH:/usr/local/go/bin\n      - go version\n  pre_build:\n    commands:\n      - go get -u github.com/aws/aws-lambda-go/lambda\n  build:\n    commands:\n      - ./lambda-build.sh\n      - stat hello.zip\n  #post_build:\n    #commands:\n      # - command\n      # - command\n#reports:\n  #report-name-or-arn:\n    #files:\n      # - location\n      # - location\n    #base-directory: location\n    #discard-paths: yes\n    #file-format: JunitXml | CucumberJson\nartifacts:\n  files:\n    - hello.zip\n    # - location\n  #name: $(date +%Y-%m-%d)\n  #discard-paths: yes\n  #base-directory: location\n#cache:\n  #paths:\n    # - paths',
          gitCloneDepth: 1,
          gitSubmodulesConfig: {
            fetchSubmodules: false,
          },
          insecureSsl: false,
          location: "https://github.com/nimakaviani/helloworld-go",
          reportBuildStatus: false,
          type: "GITHUB",
        },
        startTime: new Date("2022-04-13T23:31:26.086Z"),
        timeoutInMinutes: 60,
      },
      {
        arn: "arn:aws:codebuild:us-west-2:461868971318:build/hello-world:a49641ce-3600-445f-a44b-4e870d07517a",
        artifacts: {
          encryptionDisabled: false,
          location: "arn:aws:s3:::nk-hello-artifact/hello-world",
          md5sum: "",
          overrideArtifactName: false,
          sha256sum: "",
        },
        buildComplete: true,
        buildNumber: 9,
        buildStatus: "SUCCEEDED",
        cache: {
          type: "NO_CACHE",
        },
        currentPhase: "COMPLETED",
        encryptionKey: "arn:aws:kms:us-west-2:461868971318:alias/aws/s3",
        endTime: new Date("2022-04-13T21:39:21.365Z"),
        environment: {
          computeType: "BUILD_GENERAL1_SMALL",
          environmentVariables: [],
          image: "aws/codebuild/standard:5.0",
          imagePullCredentialsType: "CODEBUILD",
          privilegedMode: false,
          type: "LINUX_CONTAINER",
        },
        id: "hello-world:a49641ce-3600-445f-a44b-4e870d07517a",
        initiator: "nimak",
        logs: {
          cloudWatchLogs: {
            status: "ENABLED",
          },
          cloudWatchLogsArn:
            "arn:aws:logs:us-west-2:461868971318:log-group:/aws/codebuild/hello-world:log-stream:a49641ce-3600-445f-a44b-4e870d07517a",
          deepLink:
            "https://console.aws.amazon.com/cloudwatch/home?region=us-west-2#logEvent:group=/aws/codebuild/hello-world;stream=a49641ce-3600-445f-a44b-4e870d07517a",
          groupName: "/aws/codebuild/hello-world",
          s3Logs: {
            encryptionDisabled: false,
            status: "DISABLED",
          },
          streamName: "a49641ce-3600-445f-a44b-4e870d07517a",
        },
        phases: [
          {
            durationInSeconds: 0,
            endTime: new Date("2022-04-13T21:38:38.483Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "SUBMITTED",
            startTime: new Date("2022-04-13T21:38:38.386Z"),
          },
          {
            durationInSeconds: 1,
            endTime: new Date("2022-04-13T21:38:40.290Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "QUEUED",
            startTime: new Date("2022-04-13T21:38:38.483Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 20,
            endTime: new Date("2022-04-13T21:39:00.450Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "PROVISIONING",
            startTime: new Date("2022-04-13T21:38:40.290Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 3,
            endTime: new Date("2022-04-13T21:39:03.486Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "DOWNLOAD_SOURCE",
            startTime: new Date("2022-04-13T21:39:00.450Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 5,
            endTime: new Date("2022-04-13T21:39:09.349Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "INSTALL",
            startTime: new Date("2022-04-13T21:39:03.486Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 6,
            endTime: new Date("2022-04-13T21:39:16.152Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "PRE_BUILD",
            startTime: new Date("2022-04-13T21:39:09.349Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 2,
            endTime: new Date("2022-04-13T21:39:18.832Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "BUILD",
            startTime: new Date("2022-04-13T21:39:16.152Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 0,
            endTime: new Date("2022-04-13T21:39:18.875Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "POST_BUILD",
            startTime: new Date("2022-04-13T21:39:18.832Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 0,
            endTime: new Date("2022-04-13T21:39:19.284Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "UPLOAD_ARTIFACTS",
            startTime: new Date("2022-04-13T21:39:18.875Z"),
          },
          {
            contexts: [
              {
                message: "",
                statusCode: "",
              },
            ],
            durationInSeconds: 2,
            endTime: new Date("2022-04-13T21:39:21.365Z"),
            phaseStatus: "SUCCEEDED",
            phaseType: "FINALIZING",
            startTime: new Date("2022-04-13T21:39:19.284Z"),
          },
          {
            phaseType: "COMPLETED",
            startTime: new Date("2022-04-13T21:39:21.365Z"),
          },
        ],
        projectName: "hello-world",
        queuedTimeoutInMinutes: 480,
        resolvedSourceVersion: "e37188da86d7b4c143238954f961b85d23f87678",
        secondaryArtifacts: [],
        secondarySourceVersions: [],
        secondarySources: [],
        serviceRole:
          "arn:aws:iam::461868971318:role/service-role/codebuild-hello-world-service-role",
        source: {
          buildspec:
            'version: 0.2\n\n#env:\n  #variables:\n     # key: "value"\n     # key: "value"\n  #parameter-store:\n     # key: "value"\n     # key: "value"\n  #secrets-manager:\n     # key: secret-id:json-key:version-stage:version-id\n     # key: secret-id:json-key:version-stage:version-id\n  #exported-variables:\n     # - variable\n     # - variable\n  #git-credential-helper: yes\n#batch:\n  #fast-fail: true\n  #build-list:\n  #build-matrix:\n  #build-graph:\nphases:\n  install:\n    #If you use the Ubuntu standard image 2.0 or later, you must specify runtime-versions.\n    #If you specify runtime-versions and use an image other than Ubuntu standard image 2.0, the build fails.\n    #runtime-versions:\n      # name: version\n      # name: version\n    commands:\n      - wget -c https://dl.google.com/go/go1.14.2.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local\n      - export PATH=$PATH:/usr/local/go/bin\n      - go version\n  pre_build:\n    commands:\n      - go get -u github.com/aws/aws-lambda-go/lambda\n  build:\n    commands:\n      - ./lambda-build.sh\n      - stat hello.zip\n  #post_build:\n    #commands:\n      # - command\n      # - command\n#reports:\n  #report-name-or-arn:\n    #files:\n      # - location\n      # - location\n    #base-directory: location\n    #discard-paths: yes\n    #file-format: JunitXml | CucumberJson\nartifacts:\n  files:\n    - hello.zip\n    # - location\n  #name: $(date +%Y-%m-%d)\n  #discard-paths: yes\n  #base-directory: location\n#cache:\n  #paths:\n    # - paths',
          gitCloneDepth: 1,
          gitSubmodulesConfig: {
            fetchSubmodules: false,
          },
          insecureSsl: false,
          location: "https://github.com/nimakaviani/helloworld-go",
          reportBuildStatus: false,
          type: "GITHUB",
        },
        startTime: new Date("2022-04-13T21:38:38.386Z"),
        timeoutInMinutes: 60,
      },
    ];
  }
}

export const mockCodeBuildEntity: Entity = {
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  metadata: {
    name: "backstage",
    description: "backstage.io",
    annotations: {
      "aws.amazon.com/aws-codebuild-project":
        "arn:aws:codebuild:us-west-2:11111111:project/hello-world",
    },
  },
  spec: {
    lifecycle: "production",
    type: "service",
    owner: "user:guest",
  },
};

export const invalidCodeBuildEntity: Entity = {
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  metadata: {
    name: "backstage",
    description: "backstage.io",
    annotations: {
      "aws.amazon.com/aws-codebuild-project": "bad-arn",
    },
  },
  spec: {
    lifecycle: "production",
    type: "service",
    owner: "user:guest",
  },
};
