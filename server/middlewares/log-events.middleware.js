import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';

import fs from 'fs';
import fsPromises from 'fs/promises'; // Use fs/promises for promise-based methods
import path from 'path';

export const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        const logsDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(logsDir)) {
            await fsPromises.mkdir(logsDir);
        }

        await fsPromises.appendFile(path.join(logsDir, logName), logItem);
    } catch (err) {
        console.log(err);
    }
};

export const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
};

