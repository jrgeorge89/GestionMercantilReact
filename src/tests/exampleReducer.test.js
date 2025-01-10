import exampleReducer from '../redux/reducers/exampleReducer';

test('should return the initial state', () => {
  expect(exampleReducer(undefined, {})).toEqual({ data: [] });
});

test('should handle SET_DATA', () => {
  const action = {
    type: 'SET_DATA',
    payload: [1, 2, 3],
  };

  expect(exampleReducer(undefined, action)).toEqual({ data: [1, 2, 3] });
});
