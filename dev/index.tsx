import { createDevApp } from '@backstage/dev-utils';
import { codeStarPlugin } from '../src/plugin';

createDevApp().registerPlugin(codeStarPlugin).render();
