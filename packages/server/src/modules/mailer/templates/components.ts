import { createElement, ReactNode, ExoticComponent, Fragment } from 'react';

const element =
  (name: string | ExoticComponent) =>
  (props?: {} | null) =>
  (...children: ReactNode[]) =>
    createElement(name, props, ...children);

export const Cell = element('td');
export const Row = element('tr');
export const Body = element('body');
export const Table = element('table');
export const Image = element('img');
export const Paragraph = element('p');
export const Link = element('a');
export const Heading = element('h1');
export const Wrapper = element(Fragment);
export const Div = element('div');
