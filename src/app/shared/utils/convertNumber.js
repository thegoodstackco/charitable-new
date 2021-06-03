/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
export function convertNumber(labelValue, toFix = 2) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? `${(Math.abs(Number(labelValue)) / 1.0e9)
        .toFixed(toFix)
        .replace('.00', '')}B`
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? `${(Math.abs(Number(labelValue)) / 1.0e6).toFixed(2).replace('.00', '')}M`
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? `${(Math.abs(Number(labelValue)) / 1.0e3)
        .toFixed(toFix)
        .replace('.00', '')}K`
    : Math.round(Math.abs(Number(labelValue)))
        .toFixed(toFix)
        .replace('.00', '');
}
