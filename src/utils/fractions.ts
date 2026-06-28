export type Fraction = {
    readonly numerator: number;
    readonly denominator: number;
};

const FRACTION_REGEX = /^(\d+)(?:\/(\d+))?$/;

export const parseFraction = (value: string): Fraction | null => {
    const trimmed = value.trim();
    const match = FRACTION_REGEX.exec(trimmed);

    if (!match) {
        return null;
    }

    const numerator = parseInt(match[1], 10);

    if (!Number.isSafeInteger(numerator)) {
        return null;
    }

    if (match[2] === undefined) {
        return { numerator, denominator: 1 };
    }

    const denominator = parseInt(match[2], 10);

    if (!Number.isSafeInteger(denominator) || denominator === 0) {
        return null;
    }

    return { numerator, denominator };
};

export const greatestCommonDivisor = (left: number, right: number): number => {
    let a = Math.abs(left);
    let b = Math.abs(right);

    while (b !== 0) {
        const remainder = a % b;
        a = b;
        b = remainder;
    }

    return a;
};

export const simplifyFraction = (fraction: Fraction): Fraction => {
    if (fraction.numerator === 0) {
        return { numerator: 0, denominator: 1 };
    }

    const gcd = greatestCommonDivisor(
        Math.abs(fraction.numerator),
        Math.abs(fraction.denominator),
    );

    const sign = fraction.denominator < 0 ? -1 : 1;

    return {
        numerator: (sign * fraction.numerator) / gcd,
        denominator: (sign * fraction.denominator) / gcd,
    };
};

export const addFractions = (left: Fraction, right: Fraction): Fraction => {
    const gcd = greatestCommonDivisor(left.denominator, right.denominator);
    const lcm = (left.denominator / gcd) * right.denominator;

    const numerator =
        left.numerator * (lcm / left.denominator) +
        right.numerator * (lcm / right.denominator);

    return simplifyFraction({ numerator, denominator: lcm });
};

export const formatFraction = (fraction: Fraction): string => {
    if (fraction.denominator === 1) {
        return String(fraction.numerator);
    }

    return `${fraction.numerator}/${fraction.denominator}`;
};

export const getMissingFraction = (fraction: Fraction | null): Fraction | null => {
    if (!fraction || fraction.numerator >= fraction.denominator) {
        return null;
    }

    return simplifyFraction({
        numerator: fraction.denominator - fraction.numerator,
        denominator: fraction.denominator,
    });
};
