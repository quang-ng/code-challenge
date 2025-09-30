### Problem 4 — Sum to n

This folder contains three unique TypeScript implementations of summing integers from 1 to `n`, plus unit tests.

#### Implementations
- **sum_to_n_a**: Closed-form Gauss formula `(n * (n + 1)) / 2`.
  - Complexity: Time O(1), Space O(1)
- **sum_to_n_b**: Iterative accumulation with a `for` loop.
  - Complexity: Time O(n), Space O(1)
- **sum_to_n_c**: Divide-and-conquer recursive sum over ranges.
  - Complexity: Time O(n), Space O(log n) due to recursion depth

All implementations return `0` for `n <= 0`, and otherwise assume results remain under `Number.MAX_SAFE_INTEGER`.

#### Files
- `sum_to_n.ts`: Exports the three implementations.
- `sum_to_n.test.ts`: Minimal test runner with assertions for correctness.

#### Run tests
You can run the tests without any global installs using `npx`:

```bash
npx -y ts-node --compiler-options '{"module":"CommonJS"}' src/problem4/sum_to_n.test.ts
```

Expected successful output shows checkmarks for each test suite.


