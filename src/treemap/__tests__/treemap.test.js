import React from 'react';
import { mount } from 'enzyme';
import Treemap from '../';

const asyncFetch = () => {
  return new Promise((resolve, reject) => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/be471bfc-b37f-407e-833b-0f489bd3fdb2.json')
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => {
        reject(error);
        console.log('fetch data failed', error);
      });
  });
};

// TODO: Treemap-spec
describe('Treemap plot', () => {
  it('初始化以及销毁', async () => {
    const data = await asyncFetch();
    const processData = (odata) => {
      let sumValue = 0;
      odata.forEach((d) => {
        sumValue += d.value;
      });
      return { name: 'root', value: sumValue, children: odata };
    };
    const mobileData = processData(data);
    const config = { data: mobileData, colorField: 'brand' };
    const ref = React.createRef();
    mount(<Treemap {...config} chartRef={ref} />);
    expect(ref.current).not.toBeNull();
    const canvas = ref.current.getCanvas();
    expect(canvas.destroyed).toBe(false);
    ref.current.destroy();
    expect(canvas.destroyed).toBe(true);
  });
});
