export function formatToINROnBlur(inputElement: HTMLInputElement) {
  let value = inputElement.value;

  // Remove all non-numeric characters except for the decimal point
  value = value.replace(/[^\d.]/g, '');

  if (!value) {
    inputElement.value = ''; // If the field is cleared, leave it empty
    return;
  }

  // Format the number as Indian currency
  const formattedValue = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(value));

  // Add the rupee symbol and suffix
  inputElement.value = `₹ ${formattedValue}/-`;
}

export function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  // Allow numbers, one decimal point, backspace, arrows, and delete
  if (
    !(
      (
        /[0-9.]/.test(e.key) || // Allow numbers and decimal points
        e.key === 'Backspace' || // Allow Backspace
        e.key === 'ArrowLeft' || // Allow Left Arrow
        e.key === 'ArrowRight' || // Allow Right Arrow
        e.key === 'Delete'
      ) // Allow Delete
    )
  ) {
    e.preventDefault();
  }
}
export const formatRupee = (amount: number) => {
  return `₹.${amount.toLocaleString('en-IN')}/-`;
};
