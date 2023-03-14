# AWS Code Services plugins for Backstage

[![CI](https://github.com/awslabs/aws-codeservices-plugins-for-backstage/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/awslabs/aws-codeservices-plugins-for-backstage/actions/workflows/ci.yml)

This repository contains a set of Backstage plugins for interacting with the AWS Code Services suite of services, which includes:

- [AWS CodePipeline](https://aws.amazon.com/codepipeline/)
- [AWS CodeBuild](https://aws.amazon.com/codebuild/)
- [AWS CodeDeploy](https://aws.amazon.com/codedeploy/)

The plugins provide:

- Entity cards to display the status of the various related services
- Entity CI/CD pages to show recent execution and build history

![AWS CodePipeline CICD tab](/docs/images/codepipeline-tab.png "AWS CodePipeline CICD tab")

## Installation

See [AWS Code Services plugins for Backstage installation guide](./docs/install.md).

## Usage

For information about using the Code Services plugins, see the following documents:

- [AWS Code Services plugins for Backstage reference](./docs/reference.md)

## Development

For information about developing the Code Services plugins locally, see [Developing the AWS Code Services plugins for Backstage](./docs/developing.md).

## Security

For information about contributing and reporting security issues, see [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications).

## License

This project is licensed under the Apache-2.0 License.

N.B.: Although this repository is released under the Apache-2.0 license, its test dependencies include the third party rollup-plugin-dts project. The rollup-plugin-dts project's licensing includes the LGPL-3.0 license.
