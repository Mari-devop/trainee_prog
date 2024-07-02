const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function sortWordsAlphabetically(words) {
    return words.sort();
}

function displayNumbersAscending(numbers) {
    return numbers.sort((a, b) => a - b);
}

function displayNumbersDescending(numbers) {
    return numbers.sort((a, b) => b - a);
}

function displayWordsAscendingByLength(words) {
    return words.sort((a, b) => a.length - b.length);
}

function showUniqueWords(words) {
    return [...new Set(words)];
}

function showUniqueValues(words, numbers) {
    return [...new Set([...words, ...numbers])];
}

function main() {
    rl.question('Enter 10 words and 10 numbers separated by spaces:\n', (data) => {
        let words = [];
        let numbers = [];
        
            data.split(' ').forEach(item => {
            if (!isNaN(Number(item))) {
                numbers.push(Number(item));
            } else {
                words.push(item);
            } 
        });
        

        rl.question(
            'Select the type of operation:\n' +
            '1. Sort words alphabetically\n' +
            '2. Display numbers in ascending order\n' +
            '3. Display numbers in descending order\n' +
            '4. Display words in ascending order based on length\n' +
            '5. Show only unique words\n' +
            '6. Show only unique values from entire set\n' +
            'Enter "exit" to quit\n',
            (operation) => {
                switch (operation.trim()) {
                    case '1':
                        console.log('Sorted words alphabetically:', sortWordsAlphabetically(words).join(', '));
                        break;
                    case '2':
                        console.log('Display numbers in ascending order:', displayNumbersAscending(numbers).join(', '));
                        break;
                    case '3':
                        console.log('Display numbers in descending order:', displayNumbersDescending(numbers).join(', '));
                        break;
                    case '4':
                        console.log('Display words in ascending order based on length:', displayWordsAscendingByLength(words).join(', '));
                        break;
                    case '5':
                        console.log('Show only unique words:', showUniqueWords(words).join(', '));
                        break;
                    case '6':
                        console.log('Show only unique values from entire set:', showUniqueValues(words, numbers).join(', '));
                        break;
                    case 'exit':
                        console.log('Exiting program.');
                        rl.close();
                        return;
                    default:
                        console.log('Invalid operation.');
                }
                
                main();
            }

            
        );
    });
}

main();
