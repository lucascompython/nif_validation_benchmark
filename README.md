# Benchmarks for Portuguese NIF validation

This is the implementation from [Wikipedia](https://pt.wikipedia.org/wiki/N%C3%BAmero_de_identifica%C3%A7%C3%A3o_fiscal#Exemplo_de_valida%C3%A7%C3%A3o_em_TypeScript):

```typescript
function validateNIF(nif: string) {
  const validationSets = {
    one: ["1", "2", "3", "5", "6", "8"],
    two: [
      "45",
      "70",
      "71",
      "72",
      "74",
      "75",
      "77",
      "79",
      "90",
      "91",
      "98",
      "99",
    ],
  };
  if (nif.length !== 9) return false;
  if (
    !validationSets.one.includes(nif.substring(0, 1)) &&
    !validationSets.two.includes(nif.substring(0, 2))
  )
    return false;
  const nifNumbers = nif.split("").map((c) => Number.parseInt(c));
  const total =
    nifNumbers[0] * 9 +
    nifNumbers[1] * 8 +
    nifNumbers[2] * 7 +
    nifNumbers[3] * 6 +
    nifNumbers[4] * 5 +
    nifNumbers[5] * 4 +
    nifNumbers[6] * 3 +
    nifNumbers[7] * 2;
  const modulo11 = Number(total) % 11;
  const checkDigit = modulo11 < 2 ? 0 : 11 - modulo11;
  return checkDigit === Number(nif[8]);
}
```

As you can see, the function uses multiple type conversions and string operations. This is not the most efficient way to validate a NIF.  
From my testing this is what the fastest version looks like:

```typescript
function validateNIFBitwise(nif: string): boolean {
  // 1. Quick length check
  if (nif.length !== 9) return false;

  // 2. Check first digit patterns immediately (most common rejection point)
  const c0 = nif.charCodeAt(0);
  if (c0 < 48 || c0 > 57) return false; // Not a digit

  // 3. Use bit mask for first-digit pattern matching (faster than multiple comparisons)
  // Bitmap: positions 1,2,3,5,6,8 set to 1
  const firstDigitValid = ((1 << (c0 - 48)) & 0b0010_1110_1110) !== 0;

  // Initialize c1 outside the conditional logic
  let c1: number;

  // 4. Fast-path validation for valid first digits
  if (!firstDigitValid) {
    // 5. Check complex patterns for specific first digits
    c1 = nif.charCodeAt(1);
    if (c1 < 48 || c1 > 57) return false; // Not a digit

    // Optimized pattern matching using character codes directly
    if (c0 === 52) {
      // '4'
      if (c1 !== 53) return false; // Only '45' is valid
    } else if (c0 === 55) {
      // '7'
      // Bitmap for valid second digits after '7': 0,1,2,4,5,7,9
      if (((1 << (c1 - 48)) & 0b0010_1010_111) === 0) return false;
    } else if (c0 === 57) {
      // '9'
      // Bitmap for valid second digits after '9': 0,1,8,9
      if (((1 << (c1 - 48)) & 0b0011_0000_11) === 0) return false;
    } else {
      return false; // Any other digit is invalid
    }
  } else {
    // If we didn't check c1 yet, get it now
    c1 = nif.charCodeAt(1);
  }

  // 6. Get remaining character codes and validate
  const c2 = nif.charCodeAt(2);
  const c3 = nif.charCodeAt(3);
  const c4 = nif.charCodeAt(4);
  const c5 = nif.charCodeAt(5);
  const c6 = nif.charCodeAt(6);
  const c7 = nif.charCodeAt(7);
  const c8 = nif.charCodeAt(8);

  // 7. Combined digit validation for remaining digits (packed comparison)
  if (
    (c1 | c2 | c3 | c4 | c5 | c6 | c7 | c8) >>> 0 > 57 ||
    (c1 & c2 & c3 & c4 & c5 & c6 & c7 & c8) >>> 0 < 48
  ) {
    return false;
  }

  // 8. Calculate checksum directly without intermediate variables
  const checksum =
    (c0 - 48) * 9 +
    (c1 - 48) * 8 +
    (c2 - 48) * 7 +
    (c3 - 48) * 6 +
    (c4 - 48) * 5 +
    (c5 - 48) * 4 +
    (c6 - 48) * 3 +
    (c7 - 48) * 2;

  const checkDigit = checksum % 11 < 2 ? 0 : 11 - (checksum % 11);

  return checkDigit === c8 - 48;
}
```

This version is much faster than the original implementation, especially for invalid NIFs. It uses bit manipulation and direct character code comparisons to avoid unnecessary type conversions and string operations.

## Benchmark Results

Bun v1.2.5:

```bash
Running benchmark with 10000 NIFs, 1000 iterations each

--- BENCHMARK RESULTS ---
Original:             5.69ms (min: 5.52ms)
Set-based:            1.41ms (min: 1.35ms)
Direct comparison:    0.94ms (min: 0.90ms)
Fully optimized:      0.71ms (min: 0.68ms)
Bitwise optimized:    0.51ms (min: 0.47ms)
TypedArray version:   0.82ms (min: 0.77ms)
BitwiseShift version: 0.55ms (min: 0.51ms)

Fastest implementation: Bitwise optimized (0.51ms)

--- PERFORMANCE COMPARISON ---
Bitwise optimized    0.00% (fastest)
BitwiseShift version 8.83% slower
Fully optimized      39.34% slower
TypedArray version   60.73% slower
Direct comparison    85.05% slower
Set-based            176.63% slower
Original             1020.38% slower
```

Node v22.14.0:

```bash
Running benchmark with 10000 NIFs, 1000 iterations each

--- BENCHMARK RESULTS ---
Original:             2.85ms (min: 2.75ms)
Set-based:            1.02ms (min: 0.99ms)
Direct comparison:    0.72ms (min: 0.70ms)
Fully optimized:      0.43ms (min: 0.41ms)
Bitwise optimized:    0.33ms (min: 0.31ms)
TypedArray version:   0.99ms (min: 0.92ms)
BitwiseShift version: 0.39ms (min: 0.37ms)

Fastest implementation: Bitwise optimized (0.33ms)

--- PERFORMANCE COMPARISON ---
Bitwise optimized    0.00% (fastest)
BitwiseShift version 17.88% slower
Fully optimized      32.14% slower
Direct comparison    120.37% slower
TypedArray version   200.34% slower
Set-based            211.52% slower
Original             769.95% slower
```
