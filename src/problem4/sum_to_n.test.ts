import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './sum_to_n';

function assertEqual(actual: unknown, expected: unknown, message?: string): void {
	if (actual !== expected) {
		throw new Error(message ?? `Assertion failed: expected ${String(expected)}, got ${String(actual)}`);
	}
}

function run(name: string, fn: () => void): void {
	try {
		fn();
		console.log(`✓ ${name}`);
	} catch (err) {
		console.error(`✗ ${name}`);
		throw err;
	}
}

run('sum_to_n_a basic cases', () => {
	assertEqual(sum_to_n_a(0), 0);
	assertEqual(sum_to_n_a(1), 1);
	assertEqual(sum_to_n_a(5), 15);
	assertEqual(sum_to_n_a(10), 55);
});

run('sum_to_n_b basic cases', () => {
	assertEqual(sum_to_n_b(0), 0);
	assertEqual(sum_to_n_b(1), 1);
	assertEqual(sum_to_n_b(5), 15);
	assertEqual(sum_to_n_b(10), 55);
});

run('sum_to_n_c basic cases', () => {
	assertEqual(sum_to_n_c(0), 0);
	assertEqual(sum_to_n_c(1), 1);
	assertEqual(sum_to_n_c(5), 15);
	assertEqual(sum_to_n_c(10), 55);
});

run('all implementations agree for a range of n', () => {
	for (let n = 0; n <= 1000; n++) {
		const a = sum_to_n_a(n);
		const b = sum_to_n_b(n);
		const c = sum_to_n_c(n);
		assertEqual(a, b);
		assertEqual(b, c);
	}
});

run('handles negative inputs by returning 0', () => {
	assertEqual(sum_to_n_a(-1), 0);
	assertEqual(sum_to_n_b(-10), 0);
	assertEqual(sum_to_n_c(-123), 0);
});

run('large n within safe integer range', () => {
	// Choose values that keep the sum < Number.MAX_SAFE_INTEGER
	const inputs = [10000, 50000, 65535, 100000];
	for (const n of inputs) {
		const a = sum_to_n_a(n);
		const b = sum_to_n_b(n);
		const c = sum_to_n_c(n);
		assertEqual(a, (n * (n + 1)) / 2);
		assertEqual(a, b);
		assertEqual(b, c);
	}
});

run('monotonic increase: sum(n) > sum(n-1) for n >= 2', () => {
	for (let n = 2; n <= 100; n++) {
		assertEqual(sum_to_n_a(n) > sum_to_n_a(n - 1), true);
		assertEqual(sum_to_n_b(n) > sum_to_n_b(n - 1), true);
		assertEqual(sum_to_n_c(n) > sum_to_n_c(n - 1), true);
	}
});

run('consistency on repeated calls', () => {
	const n = 1234;
	const r1 = sum_to_n_a(n);
	const r2 = sum_to_n_a(n);
	assertEqual(r1, r2);
	const r3 = sum_to_n_b(n);
	const r4 = sum_to_n_b(n);
	assertEqual(r3, r4);
	const r5 = sum_to_n_c(n);
	const r6 = sum_to_n_c(n);
	assertEqual(r5, r6);
});


