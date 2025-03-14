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
const VALID_FIRST = 0b0010_1110_1110; // 1,2,3,5,6,8
const VALID_4X = 0b0010_0000_0000; // Only 45 is valid
const VALID_7X = 0b0010_1010_111; // 70,71,72,74,75,77,79
const VALID_9X = 0b0011_0000_11; // 90,91,98,99

function validateNIFBitwiseShift(nif: string): boolean {
  if (nif.length !== 9) return false;

  const c0 = nif.charCodeAt(0);
  const c1 = nif.charCodeAt(1);

  if (c0 < 48 || c0 > 57 || c1 < 48 || c1 > 57) return false;

  // Optimize branching with lookup masks for first digit
  const d0 = c0 - 48;
  const isFirstDigitValid = ((1 << d0) & VALID_FIRST) !== 0;

  // If first digit isn't valid on its own, check two-digit patterns
  if (!isFirstDigitValid) {
    const d1 = c1 - 48;
    let valid = false;

    switch (d0) {
      case 4:
        valid = d1 === 5;
        break; // Only 45 is valid
      case 7:
        valid = ((1 << d1) & VALID_7X) !== 0;
        break; // 7 with 0,1,2,4,5,7,9
      case 9:
        valid = ((1 << d1) & VALID_9X) !== 0;
        break; // 9 with 0,1,8,9
      default:
        valid = false;
    }

    if (!valid) return false;
  }

  const c2 = nif.charCodeAt(2);
  const c3 = nif.charCodeAt(3);
  const c4 = nif.charCodeAt(4);
  const c5 = nif.charCodeAt(5);
  const c6 = nif.charCodeAt(6);
  const c7 = nif.charCodeAt(7);
  const c8 = nif.charCodeAt(8);

  if (
    c2 < 48 ||
    c2 > 57 ||
    c3 < 48 ||
    c3 > 57 ||
    c4 < 48 ||
    c4 > 57 ||
    c5 < 48 ||
    c5 > 57 ||
    c6 < 48 ||
    c6 > 57 ||
    c7 < 48 ||
    c7 > 57 ||
    c8 < 48 ||
    c8 > 57
  ) {
    return false;
  }

  const sum =
    (c0 - 48) * 9 +
    ((c1 - 48) << 3) + // x8 (bitwise shift)
    (c2 - 48) * 7 +
    (c3 - 48) * 6 +
    (c4 - 48) * 5 +
    (c5 - 48) * 4 +
    (c6 - 48) * 3 +
    ((c7 - 48) << 1); // x2 (bitwise shift)

  const remainder = sum % 11;
  return (remainder < 2 ? 0 : 11 - remainder) === c8 - 48;
}
```

This version is much faster than the original implementation, especially for invalid NIFs. It uses bit manipulation and direct character code comparisons to avoid unnecessary type conversions and string operations.

## Benchmark Results

Bun v1.2.5:

```bash
Running benchmark with 10000 NIFs, 1000 iterations each

--- BENCHMARK RESULTS ---
Original:             5.19ms (min: 5.04ms)
Set-based:            1.38ms (min: 1.34ms)
Direct comparison:    0.93ms (min: 0.90ms)
Fully optimized:      0.71ms (min: 0.68ms)
Bitwise optimized:    0.76ms (min: 0.72ms)
TypedArray version:   0.82ms (min: 0.77ms)
BitwiseShift version: 0.54ms (min: 0.51ms)

Fastest implementation: BitwiseShift version (0.54ms)

--- PERFORMANCE COMPARISON ---
BitwiseShift version 0.00% (fastest)
Fully optimized      31.93% slower
Bitwise optimized    42.72% slower
TypedArray version   52.68% slower
Direct comparison    74.26% slower
Set-based            158.43% slower
Original             869.02% slower
```

Node v22.14.0:

```bash
Running benchmark with 10000 NIFs, 1000 iterations each

--- BENCHMARK RESULTS ---
Original:             2.88ms (min: 2.75ms)
Set-based:            1.02ms (min: 0.98ms)
Direct comparison:    0.73ms (min: 0.70ms)
Fully optimized:      0.43ms (min: 0.41ms)
Bitwise optimized:    0.46ms (min: 0.43ms)
TypedArray version:   1.00ms (min: 0.92ms)
BitwiseShift version: 0.39ms (min: 0.37ms)

Fastest implementation: BitwiseShift version (0.39ms)

--- PERFORMANCE COMPARISON ---
BitwiseShift version 0.00% (fastest)
Fully optimized      10.81% slower
Bitwise optimized    17.34% slower
Direct comparison    86.67% slower
TypedArray version   156.58% slower
Set-based            162.72% slower
Original             640.39% slower
```
