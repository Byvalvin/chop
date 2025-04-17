export const capitalizeFirstLetter = (value) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

export const toTitleCase = (str) => str.replace(/\b\w/g, char => char.toUpperCase());
