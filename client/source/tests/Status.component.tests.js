import { shallowMount, mount } from '@vue/test-utils/dist/vue-test-utils.js';
import { equal } from 'assert';
import sinon from 'sinon';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import Status from '../components/Status.vue';

const expect = chai.expect;

describe('Status Test', function () {
  const VIDEO_WARNING = `Your browser does not support the video tag.`;

  const cleanText = function ( text ) {
    return text.replaceAll("\t",'').replaceAll("\r",'').replaceAll("\n",'').replaceAll("  ",'').replaceAll("  ",'');
  };

  it('play without data', () => {
    const wrapper = shallowMount(Status, {propsData: { timerRemaining: null, activity: null, speed: null}});

    expect(cleanText(wrapper.text())).contains("Speed - Time Remaining - Activity -");

    expect(wrapper.text()).contains("-");
    expect(wrapper.text()).not.contains("undefined");
    expect(wrapper.text()).not.contains("null");
  });

  it('play with data', () => {
    const wrapper = shallowMount(Status, {propsData: { timeRemaining: 10, activity: "Nonsense", speed: 30}});

    expect(wrapper.text()).contains("30 RPMs");
    expect(wrapper.text()).contains("Nonsense");
    expect(wrapper.text()).contains("10");

    expect(wrapper.text()).not.contains("undefined");
    expect(wrapper.text()).not.contains("null");
  });

  it('play with zero as data', () => {
    const wrapper = shallowMount(Status, {propsData: { timeRemaining: 0, activity: "Some Text", speed: 0}});

    expect(wrapper.text()).contains("0 RPMs");
    expect(wrapper.text()).contains("Some Text");
    expect(wrapper.text()).contains(":00");

    expect(wrapper.text()).not.contains("undefined");
    expect(wrapper.text()).not.contains("null");
  });

  it('play with blank text as data', () => {
    const wrapper = shallowMount(Status, {propsData: { timeRemaining: -3, activity: "", speed: 5}});

    expect(cleanText(wrapper.text()).replace(VIDEO_WARNING, "").trim()).equal(`Speed 5 RPMs Time Remaining - Activity`);

    expect(wrapper.text()).contains("5 RPMs");

    expect(wrapper.text()).not.contains("undefined");
    expect(wrapper.text()).not.contains("null");
  });
});