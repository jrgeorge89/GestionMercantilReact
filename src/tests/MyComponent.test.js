import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

test('renders Hello, World!', () => {
  render(<MyComponent />);
  const linkElement = screen.getByText(/Hello, World!/i);
  expect(linkElement).toBeInTheDocument();
});
