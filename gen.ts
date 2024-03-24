import { readFileSync, writeFileSync, existsSync } from 'fs';
import util from 'util';
import { execSync } from 'child_process';
import { getRunOutput } from './utils';

const match = {
    "UserDefaults": 'NSPrivacyAccessedAPICategoryUserDefaults',
    "NSUserDefaults": 'NSPrivacyAccessedAPICategoryUserDefaults',
    "systemUptime": 'NSPrivacyAccessedAPICategorySystemBootTime',
    "mach_absolute_time()": 'NSPrivacyAccessedAPICategorySystemBootTime',

    "volumeAvailableCapacityKey": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "volumeAvailableCapacityForImportantUsageKey": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "volumeAvailableCapacityForOpportunisticUsageKey": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "volumeTotalCapacityKey": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "systemFreeSize": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "systemSize": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "statfs(": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "statvfs(": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "fstatfs(": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "fstatvfs(": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "getattrlist(": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "fgetattrlist(": 'NSPrivacyAccessedAPICategoryDiskSpace',
    "getattrlistat(": 'NSPrivacyAccessedAPICategoryDiskSpace',

    ".creationDate": "NSPrivacyAccessedAPICategoryFileTimestamp",
    ".creationDateKey": "NSPrivacyAccessedAPICategoryFileTimestamp",
    ".modificationDate": "NSPrivacyAccessedAPICategoryFileTimestamp",
    ".fileModificationDate": "NSPrivacyAccessedAPICategoryFileTimestamp",
    ".contentModificationDateKey": "NSPrivacyAccessedAPICategoryFileTimestamp",
    ".creationDateKey": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "getattrlist(": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "getattrlistbulk(": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "fgetattrlist(": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "stat.st_": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "fstat(": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "fstatat(": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "lstat(": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "getattrlistat(": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "NSFileCreationDate": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "NSFileModificationDate": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "NSFileSystemFreeSize": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "NSFileSystemSize": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "NSURLContentModificationDateKey": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "NSURLCreationDateKey": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "NSURLVolumeAvailableCapacityForImportantUsageKey": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "NSURLVolumeAvailableCapacityForOpportunisticUsageKey": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "NSURLVolumeAvailableCapacityKey": "NSPrivacyAccessedAPICategoryFileTimestamp",
    "NSURLVolumeTotalCapacityKey": "NSPrivacyAccessedAPICategoryFileTimestamp",

    "activeInputModes": "NSPrivacyAccessedAPICategoryActiveKeyboards"

};

const txt: string = readFileSync('./plugins.txt', 'utf-8');
let privacy = {};
const p = JSON.parse(readFileSync('./package.json', 'utf-8'));
p.dependencies = {};
if (existsSync('privacy.json')) {
    const txt = readFileSync('privacy.json', 'utf8');
    privacy = JSON.parse(txt);
}
for (const item of txt.split('\n')) {
    try {
        //console.log(item);
        await getRunOutput(`npm i ${item}`, '.');
        const t = await getRunOutput(`sh find.sh node_modules`, '.');
        if (t !== null) {
            for (const key of Object.keys(match)) {
                if (t.includes(key)) {
                    if (!privacy[match[key]]) {
                        privacy[match[key]] = [];
                    }
                    if (!privacy[match[key]].includes(item)) {
                        privacy[match[key]].push(item);
                    }
                    console.log(`${item}=${key}`);
                }
            }

            writeFileSync('privacy.json', JSON.stringify(privacy, null, 2));
            //console.log(t);
        }
        await getRunOutput(`npm uninstall ${item}`, '.');
    } catch (e) {
        console.error(`${item} error`, e);
    }
}

//writeFileSync('./package.json', JSON.stringify(p));

