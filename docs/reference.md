# AWS Code Services plugins for Backstage reference

This document covers the configuration options for the AWS Code Services plugins for Backstage. To install the Code Services plugins into your Backstage application, see the [AWS Code Services plugins for Backstage installation guide](install.md).

## AWS CodePipeline CI/CD content

This entity content is designed to provide content for the `CI/CD` tab of an entity and displays recent AWS CodePipeline executions.

![AWS CodePipeline CICD tab](/docs/images/codepipeline-tab.png "AWS CodePipeline CICD tab")

To add this component to the entity page of your application make the following modifications:

```jsx
// In packages/app/src/components/catalog/EntityPage.tsx
import {
  EntityAWSCodePipelineContent,
  isAWSCodePipelineAvailable,
} from '@aws/aws-codeservices-plugin-for-backstage';

// For example in the CI/CD section
const cicdContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isAWSCodePipelineAvailable}>
      <EntityAWSCodePipelineContent />
    </EntitySwitch.Case>
```

Add an annotation to the respective `catalog-info.yaml` files with the format `aws.amazon.com/aws-codepipeline: <arn>`.

```yaml
# Example catalog-info.yaml entity definition file
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    aws.amazon.com/aws-codepipeline: arn:aws:codepipeline:us-west-2:111111111:example-pipeline
spec:
  type: service
  # ...
```

## AWS CodePipeline entity card

This entity card is designed to an overview of an AWS CodePipeline pipeline on the `Overview` tab.

![AWS CodePipeline entity card](/docs/images/codepipeline-entity-card.png "AWS CodePipeline entity card")

To add this component to the entity page of your application make the following modifications:

```jsx
// In packages/app/src/components/catalog/EntityPage.tsx
import {
  EntityAWSCodePipelineOverviewCard,
  isAWSCodePipelineAvailable,
} from "@aws/aws-codeservices-plugin-for-backstage";

const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {/* ... */}
      <EntitySwitch>
        <EntitySwitch.Case if={isAWSCodePipelineAvailable}>
          <Grid item sm={6}>
            <EntityAWSCodePipelineOverviewCard />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>
      {/* ... */}
    </EntityLayout.Route>
  </EntityLayout>
);
```

Add an annotation to the respective `catalog-info.yaml` files with the format `aws.amazon.com/aws-codepipeline: <arn>`.

```yaml
# Example catalog-info.yaml entity definition file
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    aws.amazon.com/aws-codepipeline: arn:aws:codepipeline:us-west-2:111111111:example-pipeline
spec:
  type: service
  # ...
```

## AWS CodeBuild entity card

This entity card is designed to an overview of an AWS CodeBuild project on the `Overview` tab.

![AWS CodeBuild entity card](/docs/images/codebuild-entity-card.png "AWS CodeBuild entity card")

To add this component to the entity page of your application make the following modifications:

```jsx
// In packages/app/src/components/catalog/EntityPage.tsx
import {
  EntityAWSCodeBuildOverviewCard,
  isAWSCodeBuildProjectAvailable,
} from "@aws/aws-codeservices-plugin-for-backstage";

const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {/* ... */}
      <EntitySwitch>
        <EntitySwitch.Case if={isAWSCodeBuildProjectAvailable}>
          <Grid item sm={6}>
            <EntityAWSCodeBuildProjectOverviewCard />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>
      {/* ... */}
    </EntityLayout.Route>
  </EntityLayout>
);
```

Add an annotation to the respective `catalog-info.yaml` files with the format `aws.amazon.com/aws-codebuild-project: <arn>`.

```yaml
# Example catalog-info.yaml entity definition file
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    aws.amazon.com/aws-codebuild-project: arn:aws:codebuild:us-west-2:1111111111:project/example-project
spec:
  type: service
  # ...
```

## AWS CodeDeploy entity card

This entity card is designed to an overview of an AWS CodeDeploy deployment group on the `Overview` tab.

![AWS CodeDeploy entity card](/docs/images/codedeploy-entity-card.png "AWS CodeDeploy entity card")

To add this component to the entity page of your application make the following modifications:

```jsx
// In packages/app/src/components/catalog/EntityPage.tsx
import {
  EntityAWSCodeDeployOverviewCard,
  isAWSCodeDeployDeploymentGroupAvailable,
} from "@aws/aws-codeservices-plugin-for-backstage";

const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {/* ... */}
      <EntitySwitch>
        <EntitySwitch.Case if={isAWSCodeDeployDeploymentGroupAvailable}>
          <Grid item sm={6}>
            <EntityAWSCodeDeployDeploymentGroupOverviewCard />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>
      {/* ... */}
    </EntityLayout.Route>
  </EntityLayout>
);
```

Add an annotation to the respective `catalog-info.yaml` files with the format `aws.amazon.com/aws-codedeploy-group: <arn>`.

```yaml
# Example catalog-info.yaml entity definition file
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    aws.amazon.com/aws-codedeploy-group: arn:aws:codedeploy:us-west-2:1111111111:deploymentgroup:example/example-group
spec:
  type: service
  # ...
```
