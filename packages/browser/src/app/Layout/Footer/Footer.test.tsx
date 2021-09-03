import React from 'react';
import { render } from '@testing-library/react';

import Footer from 'app/Layout/Footer';

describe('<Footer />', () => {
  test('should render', () => {
    const { getByText } = render(<Footer />);

    expect(getByText('© AppsFirst')).toBeInTheDocument();
  });
});
