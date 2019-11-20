import { buildCustomElementConstructor, register } from 'lwc';
import { registerWireService } from '@lwc/wire-service';
import AppContainer from 'app/container';

registerWireService(register);

customElements.define(
  'app-container',
  buildCustomElementConstructor(AppContainer)
);
