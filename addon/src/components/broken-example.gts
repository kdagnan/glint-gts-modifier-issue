import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

const modifierExample = modifier((element: Element, [message]: [string]) => {
  console.log(message);
});

export default class BrokenExample extends Component {
  <template>
    <div {{modifierExample "Howy"}}>
      I can't invoke my modifier :(
    </div>
  </template>
}
