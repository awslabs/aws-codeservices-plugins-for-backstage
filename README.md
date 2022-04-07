# Code-* Plugin for Backstage

## Setup

### Dev Environment Setup:

- Install [Local Package
  Publisher](https://www.npmjs.com/package/local-package-publisher)
- node version v14.3.0+
- npm  version 6.14.4+

build the plugin by running the following 

```bash
> yarn build # builds your plugin
> ./hack/build.sh # publishes the plugin to a local tmp folder on your machine
```

## Backstage Setup

- Clone Backstage to your machine.

- In your `app-conifg.yml` file, setup a proxy to your Spinnaker deployment:

```yaml
proxy:
  '/dummy':
     target: https://reqres.in
     allowedMethods: ['GET', 'POST', 'PUT']
```

- Update your `packages/app/src/components/catalog/EntityPage.tsx` with
information about the Plugin Card.

- Import the card at the top of the `EntityPage.tsx` file, where other
imports are located.

```tsx
import {
  EntityLatestEmployeeRunCard,
} from 'plugin-backstage-code-star';
```

- Next, find the section for `cicdCard` and in the `EntityPage.tsx` file. If it does not exist, find `errorContnet`
in the page and add the snippet below, right above it.

```tsx
...
const cicdCard = (
   <EntitySwitch>
        <EntitySwitch.Case if={isSpinnakerAvailable}>
               <Grid item sm={6}>
                   <EntityLatestSpinnakerRunCard variant="gridItem" />
                </Grid>
         </EntitySwitch.Case>
  </EntitySwitch>
);
```

Modify `package.json` in Backstage, and add the following snipper under
`devDependencies`:

```
"plugin-backstage-code-star": "file:[YOUR_LOCAL_NPM_PACKAGE_FOR_THE_PLUGIN]",
```

- the value for the local plugin NPM package should be extracted from running
`./hack/build.sh` in the plugin folder. The package is usually published to a
folder under `/var/...`, if you are Mac user. If you are a windows user, good
luck!


- Run `yarn install` the plugin in your backstage core app.

- If your setup is correct, your yarn.lock file should have the snippet for the
  plugin populated for it similar to the following:

```
"plugin-backstage-code-star@file:../../../../../var/folders/t1/kjjzqg156hn0s9yjf3gyvkmd86_67y/T/tmp-58393U5qA7OWKn1PU":
  version "0.0.1"
  dependencies:
    "@backstage/catalog-model" "^0.9.0"
    "@backstage/core-components" "^0.3.0"
    "@backstage/core-plugin-api" "^0.1.5"
    "@backstage/plugin-catalog-react" "^0.4.1"
    "@backstage/theme" "^0.2.9"
    "@material-ui/core" "^4.12.2"
    "@material-ui/icons" "^4.9.1"
    "@material-ui/lab" "4.0.0-alpha.45"
    luxon "^1.28.0"
    react "^16.13.1"
    react-dom "^16.13.1"
    react-router "6.0.0-beta.0"
    react-router-dom "6.0.0-beta.0"
    react-use "^17.2.4"
```

- At this point, you should be able to run `yarn dev` and the compilation of the
  plugin should succeed.

- Add a sample backstage component:
  - Navigate to the `Components` tab in backstage
  - click `Create Component`
  - click `Register Existing Component`
  - for the URL, use
    `https://github.com/nimakaviani/backstage-test/blob/master/component/artist-lookup.yaml`
  - click `Analyze`
  - then `Import`
  - if successful, you will see the link for `nk-artist-lookup-component`
  - Click on it and should navigate you to the first page of the component, with
    the card from the plugin popping up.




