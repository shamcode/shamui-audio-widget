import "babel-polyfill";

import { default as ShamUI, DI } from 'sham-ui';
import bindings from './bindings';


DI.bind( 'widget-binder', bindings );

window.onload = () => {
    const UI = new ShamUI();
    UI.render.FORCE_ALL();
};