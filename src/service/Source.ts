import {SOURCE_FNDDS, SOURCE_SRLEGACY} from "../config/Constants";

export function getSourceId(source: string) {
    switch(source) {
        case SOURCE_FNDDS:
            return 1;
        default:
        case SOURCE_SRLEGACY:
            return 0;
    }
}