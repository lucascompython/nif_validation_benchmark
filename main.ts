const FIRST_DIGITS = new Set(["1", "2", "3", "5", "6", "8"]);
const FIRST_TWO_DIGITS = new Set([
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
]);

function validateNIF(nif: string): boolean {
  if (nif.length !== 9) return false;

  const firstDigit = nif[0];
  const firstTwoDigits = nif.substring(0, 2);

  if (!FIRST_DIGITS.has(firstDigit) && !FIRST_TWO_DIGITS.has(firstTwoDigits)) {
    return false;
  }

  for (let i = 0; i < 9; i++) {
    const char = nif.charCodeAt(i);
    if (char < 48 || char > 57) return false;
  }

  const total =
    (nif.charCodeAt(0) - 48) * 9 +
    (nif.charCodeAt(1) - 48) * 8 +
    (nif.charCodeAt(2) - 48) * 7 +
    (nif.charCodeAt(3) - 48) * 6 +
    (nif.charCodeAt(4) - 48) * 5 +
    (nif.charCodeAt(5) - 48) * 4 +
    (nif.charCodeAt(6) - 48) * 3 +
    (nif.charCodeAt(7) - 48) * 2;

  const modulo11 = total % 11;
  const checkDigit = modulo11 < 2 ? 0 : 11 - modulo11;

  return checkDigit === nif.charCodeAt(8) - 48;
}

function validateNIF2(nif: string): boolean {
  if (nif.length !== 9) return false;

  for (let i = 0; i < 9; i++) {
    const char = nif.charCodeAt(i);
    if (char < 48 || char > 57) return false; // Not a digit
  }

  // This avoids the Set overhead for these small lists
  const firstDigit = nif[0];
  const secondDigit = nif[1];

  if (
    firstDigit === "1" ||
    firstDigit === "2" ||
    firstDigit === "3" ||
    firstDigit === "5" ||
    firstDigit === "6" ||
    firstDigit === "8"
  ) {
  } else if (
    (firstDigit === "4" && secondDigit === "5") ||
    (firstDigit === "7" &&
      (secondDigit === "0" ||
        secondDigit === "1" ||
        secondDigit === "2" ||
        secondDigit === "4" ||
        secondDigit === "5" ||
        secondDigit === "7" ||
        secondDigit === "9")) ||
    (firstDigit === "9" &&
      (secondDigit === "0" ||
        secondDigit === "1" ||
        secondDigit === "8" ||
        secondDigit === "9"))
  ) {
  } else {
    return false;
  }

  const total =
    (nif.charCodeAt(0) - 48) * 9 +
    (nif.charCodeAt(1) - 48) * 8 +
    (nif.charCodeAt(2) - 48) * 7 +
    (nif.charCodeAt(3) - 48) * 6 +
    (nif.charCodeAt(4) - 48) * 5 +
    (nif.charCodeAt(5) - 48) * 4 +
    (nif.charCodeAt(6) - 48) * 3 +
    (nif.charCodeAt(7) - 48) * 2;

  const modulo11 = total % 11;
  const checkDigit = modulo11 < 2 ? 0 : 11 - modulo11;

  return checkDigit === nif.charCodeAt(8) - 48;
}

function generateTestNIFs(count: number): string[] {
  const results: string[] = [];

  const validFirstDigits = ["1", "2", "3", "5", "6", "8"];
  const validFirstTwoDigits = [
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
  ];

  for (let i = 0; i < count; i++) {
    let nif = "";

    // 70% valid, 30% invalid
    if (Math.random() < 0.7) {
      // Generate potentially valid NIF
      if (Math.random() < 0.6) {
        // Use valid first digit
        nif +=
          validFirstDigits[Math.floor(Math.random() * validFirstDigits.length)];
      } else {
        // Use valid first two digits
        nif +=
          validFirstTwoDigits[
            Math.floor(Math.random() * validFirstTwoDigits.length)
          ];
      }

      // Generate remaining digits (except check digit)
      const remainingDigits = nif.length === 1 ? 7 : 6;
      for (let j = 0; j < remainingDigits; j++) {
        nif += Math.floor(Math.random() * 10).toString();
      }

      // Calculate correct check digit
      const total = Array.from(nif).reduce((sum, digit, index) => {
        return sum + parseInt(digit) * (9 - index);
      }, 0);

      const modulo11 = total % 11;
      const checkDigit = modulo11 < 2 ? 0 : 11 - modulo11;

      nif += checkDigit.toString();
    } else {
      const invalidType = Math.floor(Math.random() * 3);

      if (invalidType === 0) {
        // Invalid length
        const length = Math.random() < 0.5 ? 8 : 10;
        for (let j = 0; j < length; j++) {
          nif += Math.floor(Math.random() * 10).toString();
        }
      } else if (invalidType === 1) {
        // Invalid first digits
        nif = "4" + (Math.random() < 0.5 ? "0" : "1");
        for (let j = 0; j < 7; j++) {
          nif += Math.floor(Math.random() * 10).toString();
        }
      } else {
        // Invalid check digit
        if (Math.random() < 0.6) {
          nif +=
            validFirstDigits[
              Math.floor(Math.random() * validFirstDigits.length)
            ];
        } else {
          nif +=
            validFirstTwoDigits[
              Math.floor(Math.random() * validFirstTwoDigits.length)
            ];
        }

        const remainingDigits = nif.length === 1 ? 8 : 7;
        for (let j = 0; j < remainingDigits; j++) {
          nif += Math.floor(Math.random() * 10).toString();
        }
      }
    }

    results.push(nif);
  }

  return results;
}
function validateNIF3(nif: string): boolean {
  if (nif.length !== 9) return false;

  const c0 = nif.charCodeAt(0);
  const c1 = nif.charCodeAt(1);
  const c2 = nif.charCodeAt(2);
  const c3 = nif.charCodeAt(3);
  const c4 = nif.charCodeAt(4);
  const c5 = nif.charCodeAt(5);
  const c6 = nif.charCodeAt(6);
  const c7 = nif.charCodeAt(7);
  const c8 = nif.charCodeAt(8);

  // unrolled loop
  if (
    c0 < 48 ||
    c0 > 57 ||
    c1 < 48 ||
    c1 > 57 ||
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

  // First digit validation using direct character code comparisons
  // ASCII: "1"=49, "2"=50, "3"=51, "5"=53, "6"=54, "8"=56
  if (
    c0 === 49 ||
    c0 === 50 ||
    c0 === 51 ||
    c0 === 53 ||
    c0 === 54 ||
    c0 === 56
  ) {
    // Valid first digit, continue
  }
  // First two digits validation using character codes
  // ASCII: "4"=52, "7"=55, "9"=57
  else if (
    (c0 === 52 && c1 === 53) || // "45"
    (c0 === 55 &&
      (c1 === 48 ||
        c1 === 49 ||
        c1 === 50 ||
        c1 === 52 ||
        c1 === 53 ||
        c1 === 55 ||
        c1 === 57)) || // "7" + valid second digit
    (c0 === 57 && (c1 === 48 || c1 === 49 || c1 === 56 || c1 === 57))
  ) {
    // "9" + valid second digit
    // Valid first two digits, continue
  } else {
    return false;
  }

  const d0 = c0 - 48;
  const d1 = c1 - 48;
  const d2 = c2 - 48;
  const d3 = c3 - 48;
  const d4 = c4 - 48;
  const d5 = c5 - 48;
  const d6 = c6 - 48;
  const d7 = c7 - 48;
  const d8 = c8 - 48;

  const total =
    d0 * 9 + d1 * 8 + d2 * 7 + d3 * 6 + d4 * 5 + d5 * 4 + d6 * 3 + d7 * 2;
  const modulo11 = total % 11;
  const checkDigit = modulo11 < 2 ? 0 : 11 - modulo11;

  return checkDigit === d8;
}

// Original implementation with arrays and conversions from https://pt.wikipedia.org/wiki/N%C3%BAmero_de_identifica%C3%A7%C3%A3o_fiscal#Exemplo_de_valida%C3%A7%C3%A3o_em_JavaScript
const validationSets = {
  one: ["1", "2", "3", "5", "6", "8"],
  two: ["45", "70", "71", "72", "74", "75", "77", "79", "90", "91", "98", "99"],
};

function validateNIFOriginal(value: string | number): boolean {
  const nif = typeof value === "string" ? value : value.toString();
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

function validateNIF4(nif: string): boolean {
  // 1. Quick length check
  if (nif.length !== 9) return false;

  // 2. Check first digit patterns immediately (most common rejection point)
  const c0 = nif.charCodeAt(0);
  if (c0 < 48 || c0 > 57) return false; // Not a digit

  // 3 .Correct bit mask for first-digit pattern matching
  // Bitmap for digits 1,2,3,5,6,8 (positions 0-indexed)
  const VALID_FIRST_DIGITS =
    (1 << 1) | (1 << 2) | (1 << 3) | (1 << 5) | (1 << 6) | (1 << 8);
  const firstDigitValid = ((1 << (c0 - 48)) & VALID_FIRST_DIGITS) !== 0;

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
      const VALID_AFTER_7 =
        (1 << 0) |
        (1 << 1) |
        (1 << 2) |
        (1 << 4) |
        (1 << 5) |
        (1 << 7) |
        (1 << 9);
      if (((1 << (c1 - 48)) & VALID_AFTER_7) === 0) return false;
    } else if (c0 === 57) {
      // '9'
      // Bitmap for valid second digits after '9': 0,1,8,9
      const VALID_AFTER_9 = (1 << 0) | (1 << 1) | (1 << 8) | (1 << 9);
      if (((1 << (c1 - 48)) & VALID_AFTER_9) === 0) return false;
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

  // 7. Individual digit validation instead of combined checks
  if (
    c1 < 48 ||
    c1 > 57 ||
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

const VALID_FIRST_DIGITS_BITS = 0b0010_1110_1110; // Bit flags for digits 1,2,3,5,6,8
const VALID_AFTER_7_BITS = 0b0010_1010_111; // Bit flags for 0,1,2,4,5,7,9 after '7'
const VALID_AFTER_9_BITS = 0b0011_0000_11; // Bit flags for 0,1,8,9 after '9'

const ASCII_0 = 48;
const ASCII_4 = 52; // '4'
const ASCII_5 = 53; // '5'
const ASCII_7 = 55; // '7'
const ASCII_9 = 57; // '9'

function validateNIF5(nif: string): boolean {
  if (nif.length !== 9) return false;

  const codes = new Uint8Array(9);
  for (let i = 0; i < 9; i++) {
    codes[i] = nif.charCodeAt(i);
    if (codes[i] < ASCII_0 || codes[i] > ASCII_0 + 9) return false;
  }

  const d0 = codes[0] - ASCII_0;
  const firstDigitValid = ((1 << d0) & VALID_FIRST_DIGITS_BITS) !== 0;

  // Fast-path pattern validation with switch
  if (!firstDigitValid) {
    switch (codes[0]) {
      case ASCII_4:
        if (codes[1] !== ASCII_5) return false;
        break;
      case ASCII_7:
        if (((1 << (codes[1] - ASCII_0)) & VALID_AFTER_7_BITS) === 0)
          return false;
        break;
      case ASCII_9:
        if (((1 << (codes[1] - ASCII_0)) & VALID_AFTER_9_BITS) === 0)
          return false;
        break;
      default:
        return false;
    }
  }

  const sum =
    (codes[0] - ASCII_0) * 9 +
    (codes[1] - ASCII_0) * 8 +
    (codes[2] - ASCII_0) * 7 +
    (codes[3] - ASCII_0) * 6 +
    (codes[4] - ASCII_0) * 5 +
    (codes[5] - ASCII_0) * 4 +
    (codes[6] - ASCII_0) * 3 +
    (codes[7] - ASCII_0) * 2;

  const mod11 = sum % 11;
  return (mod11 < 2 ? 0 : 11 - mod11) === codes[8] - ASCII_0;
}

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

function runBenchmark() {
  const testCases = generateTestNIFs(10000);
  const iterations = 1000;

  console.log(
    `Running benchmark with ${testCases.length} NIFs, ${iterations} iterations each`
  );

  const results = {
    original: [] as number[],
    set: [] as number[],
    direct: [] as number[],
    fullopt: [] as number[],
    bitwise: [] as number[],
    typedArray: [] as number[],
    bitwiseShift: [] as number[],
  };

  for (let i = 0; i < iterations; i++) {
    const startOriginal = performance.now();
    for (const nif of testCases) {
      validateNIFOriginal(nif);
    }
    const endOriginal = performance.now();
    results.original.push(endOriginal - startOriginal);

    const startSet = performance.now();
    for (const nif of testCases) {
      validateNIF(nif);
    }
    const endSet = performance.now();
    results.set.push(endSet - startSet);

    const startDirect = performance.now();
    for (const nif of testCases) {
      validateNIF2(nif);
    }
    const endDirect = performance.now();
    results.direct.push(endDirect - startDirect);

    const startFullOpt = performance.now();
    for (const nif of testCases) {
      validateNIF3(nif);
    }
    const endFullOpt = performance.now();
    results.fullopt.push(endFullOpt - startFullOpt);

    const startBitwise = performance.now();
    for (const nif of testCases) {
      validateNIF4(nif);
    }
    const endBitwise = performance.now();
    results.bitwise.push(endBitwise - startBitwise);

    const startTypedArray = performance.now();
    for (const nif of testCases) {
      validateNIF5(nif);
    }
    const endTypedArray = performance.now();
    results.typedArray.push(endTypedArray - startTypedArray);

    const startBitwiseShift = performance.now();
    for (const nif of testCases) {
      validateNIFBitwiseShift(nif);
    }
    const endBitwiseShift = performance.now();
    results.bitwiseShift.push(endBitwiseShift - startBitwiseShift);
  }

  const avgOriginal =
    results.original.reduce((sum, time) => sum + time, 0) /
    results.original.length;
  const avgSet =
    results.set.reduce((sum, time) => sum + time, 0) / results.set.length;
  const avgDirect =
    results.direct.reduce((sum, time) => sum + time, 0) / results.direct.length;
  const avgFullOpt =
    results.fullopt.reduce((sum, time) => sum + time, 0) /
    results.fullopt.length;
  const avgBitwise =
    results.bitwise.reduce((sum, time) => sum + time, 0) /
    results.bitwise.length;
  const avgTypedArray =
    results.typedArray.reduce((sum, time) => sum + time, 0) /
    results.typedArray.length;
  const avgBitwiseShift =
    results.bitwiseShift.reduce((sum, time) => sum + time, 0) /
    results.bitwiseShift.length;

  const minOriginal = Math.min(...results.original);
  const minSet = Math.min(...results.set);
  const minDirect = Math.min(...results.direct);
  const minFullOpt = Math.min(...results.fullopt);
  const minBitwise = Math.min(...results.bitwise);
  const minTypedArray = Math.min(...results.typedArray);
  const minBitwiseShift = Math.min(...results.bitwiseShift);

  console.log("\n--- BENCHMARK RESULTS ---");
  console.log(
    `Original:             ${avgOriginal.toFixed(
      2
    )}ms (min: ${minOriginal.toFixed(2)}ms)`
  );
  console.log(
    `Set-based:            ${avgSet.toFixed(2)}ms (min: ${minSet.toFixed(2)}ms)`
  );
  console.log(
    `Direct comparison:    ${avgDirect.toFixed(2)}ms (min: ${minDirect.toFixed(
      2
    )}ms)`
  );
  console.log(
    `Fully optimized:      ${avgFullOpt.toFixed(
      2
    )}ms (min: ${minFullOpt.toFixed(2)}ms)`
  );
  console.log(
    `Bitwise optimized:    ${avgBitwise.toFixed(
      2
    )}ms (min: ${minBitwise.toFixed(2)}ms)`
  );
  console.log(
    `TypedArray version:   ${avgTypedArray.toFixed(
      2
    )}ms (min: ${minTypedArray.toFixed(2)}ms)`
  );
  console.log(
    `BitwiseShift version: ${avgBitwiseShift.toFixed(
      2
    )}ms (min: ${minBitwiseShift.toFixed(2)}ms)`
  );

  const implementations = [
    { name: "Original", avg: avgOriginal },
    { name: "Set-based", avg: avgSet },
    { name: "Direct comparison", avg: avgDirect },
    { name: "Fully optimized", avg: avgFullOpt },
    { name: "Bitwise optimized", avg: avgBitwise },
    { name: "TypedArray version", avg: avgTypedArray },
    { name: "BitwiseShift version", avg: avgBitwiseShift },
  ];

  implementations.sort((a, b) => a.avg - b.avg);
  const fastest = implementations[0];

  console.log(
    `\nFastest implementation: ${fastest.name} (${fastest.avg.toFixed(2)}ms)`
  );

  console.log("\n--- PERFORMANCE COMPARISON ---");
  implementations.forEach((impl) => {
    const speedup = (impl.avg / fastest.avg - 1) * 100;
    console.log(
      `${impl.name.padEnd(20)} ${speedup.toFixed(2)}% ${
        speedup === 0 ? "(fastest)" : "slower"
      }`
    );
  });
}
runBenchmark();
