export function formatPrice(value: string): string {
    if (value == '0') {
        return '0.00'
    } else if (!value) {
        return '';
    }

    let formattedValue = value.toString().replace(/^0+/, '');

    if (formattedValue == '' || formattedValue == '.') {
        return '0.00';
    }

    formattedValue = formattedValue.replace(',', '.');

    const number = parseFloat(formattedValue);

    if (isNaN(number)) {
        return '0.00';
    }

    return number.toFixed(2);
}