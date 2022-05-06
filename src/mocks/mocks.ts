export const entityBuildMock = {
  metadata: {
    namespace: 'default',
    annotations: {
      'code.aws.com/region': 'us-west-2',
      'code.aws.com/iam-role': 'some-arn',
      'code.aws.com/build-project': 'hello-world'
    },
    name: 'sample-service',
    generation: 1,
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  spec: {
    type: 'service',
    owner: 'david@roadie.io',
    lifecycle: 'experimental',
  },
};

export const entityDeployMock = {
  metadata: {
    namespace: 'default',
    annotations: {
      'code.aws.com/region': 'us-west-2',
      'code.aws.com/iam-role': 'some-arn',
      'code.aws.com/deploy-application': 'hello-world',
      'code.aws.com/deploy-group-name': 'hello-world'
    },
    name: 'sample-service',
    generation: 1,
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  spec: {
    type: 'service',
    owner: 'david@roadie.io',
    lifecycle: 'experimental',
  },
};

export const entityPipelineMock = {
  metadata: {
    namespace: 'default',
    annotations: {
      'code.aws.com/region': 'us-west-2',
      'code.aws.com/iam-role': 'some-arn',
      'code.aws.com/pipeline-name': 'hello-world'
    },
    name: 'sample-service',
    generation: 1,
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  spec: {
    type: 'service',
    owner: 'david@roadie.io',
    lifecycle: 'experimental',
  },
};

export const credsMock = {
  AccessKeyId: "some-key",
  SecretAccessKey: "some-secret",
  SessionToken: "some-token",
  Expiration: "some-expiration"
};

export const buildsResponseMock = {
  $metadata: {
    httpStatusCode: 200,
    requestId: "d764f56f-d4a4-4d99-964c-93befbdf51aa",
    attempts: 1,
    totalRetryDelay: 0
  },
  builds: [
    {
      arn: "arn:aws:codebuild:us-west-2:461868971318:build/hello-world:792ebbad-1dbb-4594-8206-5a09ed4330b6",
      artifacts: {
        encryptionDisabled: false,
        location: "arn:aws:s3:::nk-hello-artifact/hello-world",
        md5sum: "",
        overrideArtifactName: false,
        sha256sum: ""
      },
      buildComplete: true,
      buildNumber: 10,
      buildStatus: "SUCCEEDED",
      cache: {
        type: "NO_CACHE"
      },
      currentPhase: "COMPLETED",
      encryptionKey: "arn:aws:kms:us-west-2:461868971318:alias/aws/s3",
      endTime: new Date("2022-04-13T23:32:08.397Z"),
      environment: {
        computeType: "BUILD_GENERAL1_SMALL",
        environmentVariables: [],
        image: "aws/codebuild/standard:5.0",
        imagePullCredentialsType: "CODEBUILD",
        privilegedMode: false,
        type: "LINUX_CONTAINER"
      },
      id: "hello-world-792ebbad-1dbb-4594-8206-5a09ed4330b6",
      initiator: "nimak",
      logs: {
        cloudWatchLogs: {
          status: "ENABLED"
        },
        cloudWatchLogsArn: "arn:aws:logs:us-west-2:461868971318:log-group:/aws/codebuild/hello-world:log-stream:792ebbad-1dbb-4594-8206-5a09ed4330b6",
        deepLink: "https://console.aws.amazon.com/cloudwatch/home?region=us-west-2#logEvent:group=/aws/codebuild/hello-world;stream=792ebbad-1dbb-4594-8206-5a09ed4330b6",
        groupName: "/aws/codebuild/hello-world",
        s3Logs: {
          encryptionDisabled: false,
          status: "DISABLED"
        },
        streamName: "792ebbad-1dbb-4594-8206-5a09ed4330b6"
      },
      phases: [
        {
          durationInSeconds: 0,
          endTime: "2022-04-13T23:31:26.165Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "SUBMITTED",
          startTime: new Date("2022-04-13T23:31:26.086Z")
        },
        {
          durationInSeconds: 1,
          endTime: "2022-04-13T23:31:28.022Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "QUEUED",
          startTime: new Date("2022-04-13T23:31:26.165Z")
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 19,
          endTime: "2022-04-13T23:31:47.454Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "PROVISIONING",
          startTime: "2022-04-13T23:31:28.022Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 2,
          endTime: "2022-04-13T23:31:50.437Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "DOWNLOAD_SOURCE",
          startTime: "2022-04-13T23:31:47.454Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 4,
          endTime: "2022-04-13T23:31:55.327Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "INSTALL",
          startTime: "2022-04-13T23:31:50.437Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 7,
          endTime: "2022-04-13T23:32:02.465Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "PRE_BUILD",
          startTime: "2022-04-13T23:31:55.327Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 3,
          endTime: "2022-04-13T23:32:05.531Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "BUILD",
          startTime: "2022-04-13T23:32:02.465Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 0,
          endTime: "2022-04-13T23:32:05.570Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "POST_BUILD",
          startTime: "2022-04-13T23:32:05.531Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 0,
          endTime: "2022-04-13T23:32:06.322Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "UPLOAD_ARTIFACTS",
          startTime: "2022-04-13T23:32:05.570Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 2,
          endTime: "2022-04-13T23:32:08.397Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "FINALIZING",
          startTime: "2022-04-13T23:32:06.322Z"
        },
        {
          phaseType: "COMPLETED",
          startTime: "2022-04-13T23:32:08.397Z"
        }
      ],
      projectName: "hello-world",
      queuedTimeoutInMinutes: 480,
      resolvedSourceVersion: "e37188da86d7b4c143238954f961b85d23f87678",
      secondaryArtifacts: [],
      secondarySourceVersions: [],
      secondarySources: [],
      serviceRole: "arn:aws:iam::461868971318:role/service-role/codebuild-hello-world-service-role",
      source: {
        buildspec: "version: 0.2\n\n#env:\n  #variables:\n     # key: \"value\"\n     # key: \"value\"\n  #parameter-store:\n     # key: \"value\"\n     # key: \"value\"\n  #secrets-manager:\n     # key: secret-id:json-key:version-stage:version-id\n     # key: secret-id:json-key:version-stage:version-id\n  #exported-variables:\n     # - variable\n     # - variable\n  #git-credential-helper: yes\n#batch:\n  #fast-fail: true\n  #build-list:\n  #build-matrix:\n  #build-graph:\nphases:\n  install:\n    #If you use the Ubuntu standard image 2.0 or later, you must specify runtime-versions.\n    #If you specify runtime-versions and use an image other than Ubuntu standard image 2.0, the build fails.\n    #runtime-versions:\n      # name: version\n      # name: version\n    commands:\n      - wget -c https://dl.google.com/go/go1.14.2.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local\n      - export PATH=$PATH:/usr/local/go/bin\n      - go version\n  pre_build:\n    commands:\n      - go get -u github.com/aws/aws-lambda-go/lambda\n  build:\n    commands:\n      - ./lambda-build.sh\n      - stat hello.zip\n  #post_build:\n    #commands:\n      # - command\n      # - command\n#reports:\n  #report-name-or-arn:\n    #files:\n      # - location\n      # - location\n    #base-directory: location\n    #discard-paths: yes\n    #file-format: JunitXml | CucumberJson\nartifacts:\n  files:\n    - hello.zip\n    # - location\n  #name: $(date +%Y-%m-%d)\n  #discard-paths: yes\n  #base-directory: location\n#cache:\n  #paths:\n    # - paths",
        gitCloneDepth: 1,
        gitSubmodulesConfig: {
          fetchSubmodules: false
        },
        insecureSsl: false,
        location: "https://github.com/nimakaviani/helloworld-go",
        reportBuildStatus: false,
        type: "GITHUB"
      },
      startTime: new Date("2022-04-13T23:31:26.086Z"),
      timeoutInMinutes: 60
    },
    {
      arn: "arn:aws:codebuild:us-west-2:461868971318:build/hello-world:a49641ce-3600-445f-a44b-4e870d07517a",
      artifacts: {
        encryptionDisabled: false,
        location: "arn:aws:s3:::nk-hello-artifact/hello-world",
        md5sum: "",
        overrideArtifactName: false,
        sha256sum: ""
      },
      buildComplete: true,
      buildNumber: 9,
      buildStatus: "SUCCEEDED",
      cache: {
        type: "NO_CACHE"
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
        type: "LINUX_CONTAINER"
      },
      id: "hello-world:a49641ce-3600-445f-a44b-4e870d07517a",
      initiator: "nimak",
      logs: {
        cloudWatchLogs: {
          status: "ENABLED"
        },
        cloudWatchLogsArn: "arn:aws:logs:us-west-2:461868971318:log-group:/aws/codebuild/hello-world:log-stream:a49641ce-3600-445f-a44b-4e870d07517a",
        deepLink: "https://console.aws.amazon.com/cloudwatch/home?region=us-west-2#logEvent:group=/aws/codebuild/hello-world;stream=a49641ce-3600-445f-a44b-4e870d07517a",
        groupName: "/aws/codebuild/hello-world",
        s3Logs: {
          encryptionDisabled: false,
          status: "DISABLED"
        },
        streamName: "a49641ce-3600-445f-a44b-4e870d07517a"
      },
      phases: [
        {
          durationInSeconds: 0,
          endTime: "2022-04-13T21:38:38.483Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "SUBMITTED",
          startTime: "2022-04-13T21:38:38.386Z"
        },
        {
          durationInSeconds: 1,
          endTime: "2022-04-13T21:38:40.290Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "QUEUED",
          startTime: "2022-04-13T21:38:38.483Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 20,
          endTime: "2022-04-13T21:39:00.450Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "PROVISIONING",
          startTime: "2022-04-13T21:38:40.290Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 3,
          endTime: "2022-04-13T21:39:03.486Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "DOWNLOAD_SOURCE",
          startTime: "2022-04-13T21:39:00.450Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 5,
          endTime: "2022-04-13T21:39:09.349Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "INSTALL",
          startTime: "2022-04-13T21:39:03.486Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 6,
          endTime: "2022-04-13T21:39:16.152Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "PRE_BUILD",
          startTime: "2022-04-13T21:39:09.349Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 2,
          endTime: "2022-04-13T21:39:18.832Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "BUILD",
          startTime: "2022-04-13T21:39:16.152Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 0,
          endTime: "2022-04-13T21:39:18.875Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "POST_BUILD",
          startTime: "2022-04-13T21:39:18.832Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 0,
          endTime: "2022-04-13T21:39:19.284Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "UPLOAD_ARTIFACTS",
          startTime: "2022-04-13T21:39:18.875Z"
        },
        {
          contexts: [
            {
              message: "",
              statusCode: ""
            }
          ],
          durationInSeconds: 2,
          endTime: "2022-04-13T21:39:21.365Z",
          phaseStatus: "SUCCEEDED",
          phaseType: "FINALIZING",
          startTime: "2022-04-13T21:39:19.284Z"
        },
        {
          phaseType: "COMPLETED",
          startTime: "2022-04-13T21:39:21.365Z"
        }
      ],
      projectName: "hello-world",
      queuedTimeoutInMinutes: 480,
      resolvedSourceVersion: "e37188da86d7b4c143238954f961b85d23f87678",
      secondaryArtifacts: [],
      secondarySourceVersions: [],
      secondarySources: [],
      serviceRole: "arn:aws:iam::461868971318:role/service-role/codebuild-hello-world-service-role",
      source: {
        buildspec: "version: 0.2\n\n#env:\n  #variables:\n     # key: \"value\"\n     # key: \"value\"\n  #parameter-store:\n     # key: \"value\"\n     # key: \"value\"\n  #secrets-manager:\n     # key: secret-id:json-key:version-stage:version-id\n     # key: secret-id:json-key:version-stage:version-id\n  #exported-variables:\n     # - variable\n     # - variable\n  #git-credential-helper: yes\n#batch:\n  #fast-fail: true\n  #build-list:\n  #build-matrix:\n  #build-graph:\nphases:\n  install:\n    #If you use the Ubuntu standard image 2.0 or later, you must specify runtime-versions.\n    #If you specify runtime-versions and use an image other than Ubuntu standard image 2.0, the build fails.\n    #runtime-versions:\n      # name: version\n      # name: version\n    commands:\n      - wget -c https://dl.google.com/go/go1.14.2.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local\n      - export PATH=$PATH:/usr/local/go/bin\n      - go version\n  pre_build:\n    commands:\n      - go get -u github.com/aws/aws-lambda-go/lambda\n  build:\n    commands:\n      - ./lambda-build.sh\n      - stat hello.zip\n  #post_build:\n    #commands:\n      # - command\n      # - command\n#reports:\n  #report-name-or-arn:\n    #files:\n      # - location\n      # - location\n    #base-directory: location\n    #discard-paths: yes\n    #file-format: JunitXml | CucumberJson\nartifacts:\n  files:\n    - hello.zip\n    # - location\n  #name: $(date +%Y-%m-%d)\n  #discard-paths: yes\n  #base-directory: location\n#cache:\n  #paths:\n    # - paths",
        gitCloneDepth: 1,
        gitSubmodulesConfig: {
          fetchSubmodules: false
        },
        insecureSsl: false,
        location: "https://github.com/nimakaviani/helloworld-go",
        reportBuildStatus: false,
        type: "GITHUB"
      },
      startTime: new Date("2022-04-13T21:38:38.386Z"),
      timeoutInMinutes: 60
    },
  ],
  buildsNotFound: []
}


export const deployResponseMock = {
  $metadata: {
    httpStatusCode: 200,
    requestId: "d886f56f-d4a4-4g99-964c-93befbdf51aa",
    attempts: 1,
    totalRetryDelay: 0
  },
  deploymentsInfo: [
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
          bundleType: "JSON"
        }
      },
      status: "Failed",
      errorInformation: {
        code: "INVALID_REVISION",
        message: "The AppSpec file cannot be located in the specified S3 bucket. Verify your AppSpec file is present and that the name and key value pair specified for your S3 bucket are correct. The S3 bucket must be in your current region"
      },
      createTime: "2022-04-13T12:09:00.080000-05:00",
      completeTime: "2022-04-13T21:39:21.365Z",
      creator: "user",
      ignoreApplicationStopFailures: false,
      updateOutdatedInstancesOnly: false,
      rollbackInfo: {},
      deploymentStyle: {
        deploymentType: "BLUE_GREEN",
        deploymentOption: "WITH_TRAFFIC_CONTROL"
      },
      instanceTerminationWaitTimeStarted: false,
      fileExistsBehavior: "DISALLOW",
      deploymentStatusMessages: [],
      computePlatform: "Lambda"
    }
  ]
}

export const pipelineResponseMock = {
  created: 1446137312.204,
  pipelineName: "MyFirstPipeline",
  pipelineVersion: 1,
  stageStates: [
    {
      actionStates: [
        {
          actionName: "Source",
          entityUrl: "https://console.aws.amazon.com/s3/home?#",
          latestExecution: {
            lastStatusChange: 1446137358.328,
            status: "Succeeded"
          }
        }
      ],
      stageName: "Source"
    },
    {
      actionStates: [
        {
          actionName: "CodePipelineDemoFleet",
          entityUrl: "https://console.aws.amazon.com/codedeploy/home?#/applications/CodePipelineDemoApplication/deployment-groups/CodePipelineDemoFleet",
          latestExecution: {
            externalExecutionId: "d-EXAMPLE",
            externalExecutionUrl: "https://console.aws.amazon.com/codedeploy/home?#/deployments/d-EXAMPLE",
            lastStatusChange: 1446137493.131,
            status: "Succeeded",
            summary: "Deployment Succeeded"
          }
        }
      ],
      inboundTransitionState: {
        enabled: true
      },
      stageName: "Beta"
    }
  ],
  updated: 1446137312.204
}
