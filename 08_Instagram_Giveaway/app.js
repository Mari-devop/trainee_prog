import fs from 'fs';
import path from 'path';

const filePaths = ['out0.txt', 'out1.txt', 'out2.txt', 'out3.txt', 'out4.txt', 
'out5.txt', 'out6.txt', 'out7.txt', 'out8.txt', 'out9.txt', 'out10.txt', 
'out11.txt', 'out12.txt', 'out13.txt', 'out14.txt', 'out15.txt', 'out16.txt',
'out17.txt', 'out18.txt', 'out19.txt']; 

const readLines = (filePath) => {  
    return new Promise((resolve, reject) => { 
        fs.readFile(filePath, 'utf8', (err, data) => { 
            if (err) {
                reject(err);
            }
            resolve(data.split('\n').map((line) => line.trim()).filter((line) => line.length > 0)); 
        });
    });
}

const countUniqueUsernames = async (filePaths) => {
    const uniqueUsernames = new Set();
    for (const filePath of filePaths) {
        const lines = await readLines(filePath);
        lines.forEach(line => uniqueUsernames.add(line));
    }
    return uniqueUsernames.size;
};

const countUsernamesInAllFiles = async (filePaths) => {
    const fileLines = await Promise.all(filePaths.map(readLines));
    const allUsernames = fileLines.reduce((acc, lines) => {
        if (acc === null) return new Set(lines);
        return new Set([...acc].filter((username) => lines.includes(username)));
    }, null);
    return allUsernames.size;
};

const countUsernamesInNFiles = async (filePaths, n) => {
    const usernameCount = new Map();
    for (const filePath of filePaths) {
        const lines = await readLines(filePath);
        const uniqueLines = new Set(lines);
        uniqueLines.forEach(line => {
            usernameCount.set(line, (usernameCount.get(line) || 0) + 1);
        });
    }
    let count = 0;
    usernameCount.forEach((value) => {
        if (value >= n) count++;
    });
    return count;
};

const main = async () => {
    const startTime = Date.now();
    const totalUniqueUsernames = await countUniqueUsernames(filePaths); 
    console.log(`Total unique usernames: ${totalUniqueUsernames}`);

    const allUsernames = await countUsernamesInAllFiles(filePaths);
    console.log(`Usernames that appear in all files: ${allUsernames}`);

    const usernameInNfiles = await countUsernamesInNFiles(filePaths, 10);
    console.log(`Usernames that appear in at least 10 files: ${usernameInNfiles}`);

    const endTime = Date.now();
    console.log(`Execution time: ${(endTime - startTime) / 1000} sec`);
}

main().catch(console.error);
