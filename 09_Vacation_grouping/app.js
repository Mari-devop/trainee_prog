import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, 'vacations.json');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const vacations = JSON.parse(data);

    const transformed = vacations.reduce((acc, curr) => {
        const { user, startDate, endDate } = curr;
        const userId = user._id;
        const userName = user.name;

        if (!acc[userId]) {
            acc[userId] = {
                userId: userId,
                name: userName,
                weekendDates: []
            };
        }

        acc[userId].weekendDates.push({ startDate, endDate });

        return acc;
    }, {});

    const result = Object.values(transformed);
    console.log(JSON.stringify(result, null, 2));
});
