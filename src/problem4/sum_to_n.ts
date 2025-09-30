export function sum_to_n_a(n: number): number {
	// Closed-form (Gauss' formula)
	if (n <= 0) return 0;
	return (n * (n + 1)) / 2;
}

export function sum_to_n_b(n: number): number {
	// Iterative accumulation
	if (n <= 0) return 0;
	let sum = 0;
	for (let i = 1; i <= n; i++) {
		sum += i;
	}
	return sum;
}

export function sum_to_n_c(n: number): number {
	// Divide-and-conquer summation
	if (n <= 0) return 0;
	function sumRange(left: number, right: number): number {
		if (left > right) return 0;
		if (left === right) return left;
		const mid = (left + right) >>> 1;
		return sumRange(left, mid) + sumRange(mid + 1, right);
	}
	return sumRange(1, n);
}

export default { sum_to_n_a, sum_to_n_b, sum_to_n_c };


