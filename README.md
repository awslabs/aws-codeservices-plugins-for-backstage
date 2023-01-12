# AWS CodeSuite plugins for Backstage

[![CI](https://github.com/awslabs/aws-codesuite-plugins-for-backstage/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/awslabs/aws-codesuite-plugins-for-backstage/actions/workflows/ci.yml)

This repository contains a set of Backstage plugins for interacting with AWS CodeSuite services, which includes:

- [AWS CodePipeline](https://aws.amazon.com/codepipeline/)
- [AWS CodeBuild](https://aws.amazon.com/codebuild/)
- [AWS CodeDeploy](https://aws.amazon.com/codedeploy/)

The plugins provide:

- Entity cards to display the status of the various related services
- Entity CI/CD pages to show recent execution and build history

![AWS CodePipeline CICD tab](/docs/images/codepipeline-tab.png "AWS CodePipeline CICD tab")

## Installation

See [AWS CodeSuite plugins for Backstage installation guide](./docs/install.md).

## Usage

For information about using the CodeSuite plugins, see the following documents:

- [AWS CodeSuite plugins for Backstage reference](./docs/reference.md)

## Development

For information about developing the CodeSuite plugins locally, see [Developing the AWS CodeSuite plugins for Backstage](./docs/developing.md).

## Security

For information about contributing and reporting security issues, see [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications).

## License

This project is licensed under the Apache-2.0 License.

N.B.: Although this repository is released under the Apache-2.0 license, its test dependencies include the third party rollup-plugin-dts project. The rollup-plugin-dts project's licensing includes the LGPL-3.0 license.
