import { shallowMount, mount } from '@vue/test-utils/dist/vue-test-utils.js';
import { equal } from 'assert';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import AdminButtons from '../components/partials/AdminButtons.vue';

const expect = chai.expect;
let wrapper;

describe('AdminButtons Test', function () {
  beforeEach(() => {
    wrapper = null;
  });

  afterEach(() => {
    if ( wrapper ) {
    	wrapper.destroy();
    }
  });

  it('loads to shell', () => {
    wrapper = shallowMount(AdminButtons, {
    	mocks: {
    		$store: {state: {speedometer:{speedHistory: new Array() }}}
	    },
	});

    // Just testing that it mounts.
  });
});