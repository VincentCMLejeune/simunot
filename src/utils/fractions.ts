export type Fraction = {
    numerator: number;
    denominator: number;
};

export const parseFraction = (value: string): Fraction | null => {
    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    const parts = trimmed.split('/');

    if (parts.length === 1) {
        const parsed = Number(parts[0]);
        return Number.isFinite(parsed) ? { numerator: parsed, denominator: 1 } : null;
    }

    if (parts.length === 2) {
        const numerator = Number(parts[0]);
        const denominator = Number(parts[1]);

        if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
            return null;
        }

        return { numerator, denominator };
    }

    return null;
};

export const greatestCommonDivisor = (left: number, right: number): number => {
    if (right === 0) {
        return left;
    }

    return greatestCommonDivisor(right, left % right);
};

export const simplifyFraction = (fraction: Fraction): Fraction => {
    const absoluteNumerator = Math.abs(fraction.numerator);
    const absoluteDenominator = Math.abs(fraction.denominator);
    const gcd = greatestCommonDivisor(absoluteNumerator, absoluteDenominator);

    return {
        numerator: fraction.numerator / gcd,
        denominator: fraction.denominator / gcd,
    };
};

export const addFractions = (left: Fraction, right: Fraction): Fraction => {
    const denominator = left.denominator * right.denominator;
    const numerator = left.numerator * right.denominator + right.numerator * left.denominator;
    return simplifyFraction({ numerator, denominator });
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

    return {
        numerator: fraction.denominator - fraction.numerator,
        denominator: fraction.denominator,
    };
};
