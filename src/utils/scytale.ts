export const defaultAlphabet = 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ ';

export const encryptScytale = (
    text: string,
    key: number,
    alphabet: string = defaultAlphabet
): string => {
    if (key <= 0) throw new Error("Ключ повинен бути додатнім числом.");

    const filteredText = text
        .split('')
        .filter(char => alphabet.includes(char))
        .join('');

    const length = filteredText.length;
    const columns = key;
    const rows = Math.ceil(length / columns);

    let cipherText = '';

    for (let col = 0; col < columns; col++) {
        for (let row = 0; row < rows; row++) {
            const index = row * columns + col;
            if (index < length) {
                cipherText += filteredText[index];
            }
        }
    }

    return cipherText;
};

export const decryptScytale = (
    cipherText: string,
    key: number,
    alphabet: string = defaultAlphabet
): string => {
    if (key <= 0) throw new Error("Ключ повинен бути додатнім числом.");

    const length = cipherText.length;
    const columns = key;
    const rows = Math.ceil(length / columns);

    const plainTextArray: string[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const index = col * rows + row;
            if (index < length) {
                plainTextArray.push(cipherText[index]);
            }
        }
    }

    return plainTextArray.join('');
};
