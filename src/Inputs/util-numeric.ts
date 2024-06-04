/* eslint-disable require-unicode-regexp */

const
  floatToLocalComma = (raw: any) => String(raw).replace(".", ",");

export const
  floatToEnglishComma = (raw: any) => String(raw).replace(",", "."),
  isFloat = (raw: string) => {
    const floatRegex = /^-?\d+(?:[.]\d*?)?$/;

    return floatRegex.test(raw);
  },
  getFloatValueToStore = (raw: any) => {
    const
      parsedFloat = floatToEnglishComma(raw),
      parsedValue = parseFloat(parsedFloat),
      canGetNumericValue = isFloat(parsedFloat) && !isNaN(parsedValue);

    if (canGetNumericValue) {
      return parsedValue;
    }

    return 0;
  },
  clearFloatOnBlur = (value: any, precision : number) : string  => {
    const
      parts = floatToLocalComma(value).split(","),
      shouldRemoveComma = parts.length === 2 && (parts[1] === "" || Number(parts[1]) === 0),
      shouldCutToPrecision = parts.length === 2 && parts[1].length > precision;

    if (shouldRemoveComma) {
      return parts[0];
    }

    if (shouldCutToPrecision) {
      const
        [beforeDot] = parts,
        afterDot = parts[1].substring(0, precision);

      return `${beforeDot},${afterDot}`;
    }

    return value;
  };
