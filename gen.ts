import { readFileSync, writeFileSync } from 'fs';
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

interface Privacy {
    plugin: string;
    category: string;
}
const txt: string = readFileSync('./plugins.txt', 'utf-8');
const privacy: Privacy[] = [];
const p = JSON.parse(readFileSync('./package.json', 'utf-8'));
p.dependencies = {};
for (const item of txt.split('\n')) {
    try {
        //console.log(item);
        execSync(`npm i ${item}`);
        const t = await getRunOutput(`sh find.sh node_modules`, '.');
        if (t !== null) {
            for (const key of Object.keys(match)) {
                if (t.includes(key)) {
                    privacy.push({ plugin: item, category: match[key] });
                    console.log(`${item}=${key}`);
                }
            }

            writeFileSync('privacy.json', JSON.stringify(privacy, null, 2));
            //console.log(t);
        }
    } finally {
        execSync(`npm uninstall ${item}`);
    }
}

//writeFileSync('./package.json', JSON.stringify(p));

