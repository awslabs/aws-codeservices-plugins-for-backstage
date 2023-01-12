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

import { errorHandler } from "@backstage/backend-common";
import express from "express";
import Router from "express-promise-router";
import { Logger } from "winston";
import { AwsCodePipelineApi, AwsCodeBuildApi, AwsCodeDeployApi } from "../api";
import { DefaultAwsCredentialsManager } from "@backstage/integration-aws-node";
import { Config } from "@backstage/config";

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions
): Promise<express.Router> {
  const { logger, config } = options;

  const credsManager = DefaultAwsCredentialsManager.fromConfig(config);
  const awsCodePipelineApi = new AwsCodePipelineApi(credsManager);
  const awsCodeBuildApi = new AwsCodeBuildApi(credsManager);
  const awsCodeDeployApi = new AwsCodeDeployApi(credsManager);

  const router = Router();
  router.use(express.json());

  router.get("/health", (_, response) => {
    logger.info("PONG!");
    response.send({ status: "ok" });
  });

  router.get("/codepipeline/pipelineState", async (req, res) => {
    const arn = req.query.arn?.toString();
    const state = await awsCodePipelineApi.getPipelineState(arn || "");
    res.status(200).json(state);
  });

  router.get("/codepipeline/pipelineExecutions", async (req, res) => {
    const arn = req.query.arn?.toString();
    const executions = await awsCodePipelineApi.getPipelineExecutions(
      arn || ""
    );
    res.status(200).json(executions);
  });

  router.get("/codebuild/project", async (req, res) => {
    const arn = req.query.arn?.toString();
    const executions = await awsCodeBuildApi.getProject(arn || "");
    res.status(200).json(executions);
  });

  router.get("/codebuild/builds", async (req, res) => {
    const arn = req.query.arn?.toString();
    const executions = await awsCodeBuildApi.getBuilds(arn || "");
    res.status(200).json(executions);
  });

  router.get("/codedeploy/deploymentGroup", async (req, res) => {
    const arn = req.query.arn?.toString();
    const executions = await awsCodeDeployApi.getDeploymentGroup(arn || "");
    res.status(200).json(executions);
  });

  router.get("/codebuild/deployments", async (req, res) => {
    const arn = req.query.arn?.toString();
    const executions = await awsCodeDeployApi.getDeployments(arn || "");
    res.status(200).json(executions);
  });

  router.use(errorHandler());
  return router;
}
