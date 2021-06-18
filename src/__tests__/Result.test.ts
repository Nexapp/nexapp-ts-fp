import { failure, success } from '../Result';

describe('Testing Result behavior', () => {
  describe('Smart constructors', () => {
    it('expect .success() to create a success', () => {
      const actual = success(123);

      expect(actual.isSuccess()).toBe(true);
      expect(actual.isError()).toBe(false);
    });

    it('expect .failure() to create a failure', () => {
      const actual = failure(123);

      expect(actual.isSuccess()).toBe(false);
      expect(actual.isError()).toBe(true);
    });
  });

  describe('Given a success', () => {
    it('expects value to be available', () => {
      const actual = success(123);

      let unwrap;
      if (actual.isSuccess()) {
        unwrap = actual.value;
      }

      expect(unwrap).toBe(123);
    });

    it('expects isError to be false', () => {
      const actual = success(123);

      expect(actual.isError()).toBe(false);
    });

    it('expects isSuccess to be true', () => {
      const actual = success(123);

      expect(actual.isSuccess()).toBe(true);
    });

    it('expects map to apply the function on the success value', () => {
      const actual = success(2);

      const result = actual.map((element) => element * 2);

      let value;

      if (result.isSuccess()) {
        value = result.value;
      }

      expect(value).toBe(4);
    });

    it('expects mapError NOT to apply the function to the error', () => {
      const actual = success(2);
      const someFunction = jest.fn();

      actual.mapError(someFunction);

      expect(someFunction.mock.calls).toHaveLength(0);
    });

    it('expects andThen to apply the function on the success value', () => {
      const actual = success(2);

      const result = actual.andThen(() => success('win'));

      let value;

      if (result.isSuccess()) {
        value = result.value;
      }

      expect(value).toBe('win');
    });

    it('expects orElse NOT to apply the function on the success value', () => {
      const actual = success(2);
      const someFunction = jest.fn();

      actual.orElse(someFunction);

      expect(someFunction.mock.calls).toHaveLength(0);
    });

    it('expects withDefault to grab the value from the success', () => {
      const actual = success(2);

      const result = actual.withDefault(0);

      expect(result).toBe(2);
    });
  });

  describe('Given a failure', () => {
    it('expects error to be available', () => {
      const actual = failure(404);

      let error;

      if (actual.isError()) {
        error = actual.error;
      }

      expect(error).toBe(404);
    });
    it('expects isError to be true', () => {
      const actual = failure(404);

      expect(actual.isError()).toBe(true);
    });

    it('expects isSuccess to be false', () => {
      const actual = failure(404);

      expect(actual.isSuccess()).toBe(false);
    });

    it('expects map NOT to apply the function on the success value', () => {
      const actual = failure(404);
      const someFunction = jest.fn();

      actual.map(someFunction);

      expect(someFunction.mock.calls).toHaveLength(0);
    });

    it('expects mapError to apply the function to the error', () => {
      const actual = failure(404);

      const result = actual.mapError((element) => element * 2);

      let error;

      if (result.isError()) {
        error = result.error;
      }

      expect(error).toBe(808);
    });

    it('expects andThen NOT to apply the function on the success value', () => {
      const actual = failure(404);
      const someFunction = jest.fn();

      actual.andThen(someFunction);

      expect(someFunction.mock.calls).toHaveLength(0);
    });

    it('expects orElse to apply the function on the error value.', () => {
      const actual = failure(404);

      const result = actual.orElse((element) => failure(element * 2));

      let error;

      if (result.isError()) {
        error = result.error;
      }
      expect(error).toBe(808);
    });

    it('expects withDefault to return the default value', () => {
      const actual = failure(404);

      const error = actual.withDefault('fallback');

      expect(error).toBe('fallback');
    });
  });

  describe('Complex chaining', () => {
    it('expects everthing to chain nicely', () => {
      const result = success(2)
        .map((element) => element * 2)
        .mapError(() => 'actual Nice error message')
        .andThen((value) => {
          if (value === 4) {
            return failure('Value was 4');
          }
          return success('Random');
        });

      let error;

      if (result.isError()) {
        error = result.error;
      }

      expect(error).toBe('Value was 4');
    });

    it('expect success value to be accessible outside of type predicate branch', () => {
      const result = success(2);

      if (result.isSuccess()) {
        // The test is able to access value of result;
        result.value;
      } else {
        // The test is able to access error of result;
        result.error;
      }

      expect(true).toBe(true);
    });
  });
});
