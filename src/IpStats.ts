export class BeastEntry {
    uuid: string;
    ip: string;
    port: number;
    bandwidthKbps: number;
    unknownThing: number;
    messagesPerSecond: number;
    positionsPerSecond: number;
    latencyMs: number;
    positionsTotal: number;

    constructor(uuid: string, ip: string, port: number, bandwidthKbps: number, unknownThing: number, messagesPerSecond: number, positionsPerSecond: number, latencyMs: number, positionsTotal: number) {
        this.uuid = uuid;
        this.ip = ip;
        this.port = port;
        this.bandwidthKbps = bandwidthKbps;
        this.unknownThing = unknownThing;
        this.messagesPerSecond = messagesPerSecond;
        this.positionsPerSecond = positionsPerSecond;
        this.latencyMs = latencyMs;
        this.positionsTotal = positionsTotal;
    }

    static fromArray(arr: any[]): BeastEntry {
        const uuid = arr[0];
        const ip = arr[1].split("port")[0].trim() || null;
        const port = parseInt(arr[1].trim().split('port')[1].trim());
        const bandwidthKbps = arr[2];
        const unknownThing = arr[3];
        const messagesPerSecond = arr[4];
        const positionsPerSecond = arr[5];
        const latencyMs = arr[6];
        const positionsTotal = arr[7];

        return new BeastEntry(
            uuid,
            ip,
            port,
            bandwidthKbps,
            unknownThing,
            messagesPerSecond,
            positionsPerSecond,
            latencyMs,
            positionsTotal
        );
    }
}

export class MlatEntry {
    user: string;
    uid: number;
    uuid: string;
    coords: string;
    lat: number;
    lon: number;
    alt: number;
    privacy: boolean;
    connection: string;
    source_ip: string;
    source_port: string;
    message_rate: number;
    peer_count: number;
    bad_sync_timeout: number;
    outlier_percent: number;
    bad_peer_list: string;
    sync_interest: string[];
    mlat_interest: string[];

    constructor(user: string, uid: number, uuid: string, coords: string, lat: number, lon: number, alt: number, privacy: boolean, connection: string, source_ip: string, source_port: string, message_rate: number, peer_count: number, bad_sync_timeout: number, outlier_percent: number, bad_peer_list: string, sync_interest: string[], mlat_interest: string[]) {
        this.user = user;
        this.uid = uid;
        this.uuid = uuid;
        this.coords = coords;
        this.lat = lat;
        this.lon = lon;
        this.alt = alt;
        this.privacy = privacy;
        this.connection = connection;
        this.source_ip = source_ip;
        this.source_port = source_port;
        this.message_rate = message_rate;
        this.peer_count = peer_count;
        this.bad_sync_timeout = bad_sync_timeout;
        this.outlier_percent = outlier_percent;
        this.bad_peer_list = bad_peer_list;
        this.sync_interest = sync_interest;
        this.mlat_interest = mlat_interest;
    }

    static fromObject(obj: any): MlatEntry {
        return new MlatEntry(
            obj.user,
            obj.uid,
            obj.uuid,
            obj.coords,
            obj.lat,
            obj.lon,
            obj.alt,
            obj.privacy,
            obj.connection,
            obj.source_ip,
            obj.source_port,
            obj.message_rate,
            obj.peer_count,
            obj.bad_sync_timeout,
            obj.outlier_percent,
            obj.bad_peer_list,
            obj.sync_interest,
            obj.mlat_interest
        );
    }

}


export function getIpData(ipAddress: string, beastJsonFileContent: string, mlatFileContentFileContent: string) {

    const myIpResults: { mlatData: MlatEntry[]; beastData: BeastEntry[]; uuids: any[] } = {
        uuids: [],
        beastData: [],
        mlatData: [],
    };

    const beastJson = JSON.parse(beastJsonFileContent);
    const beastClients: BeastEntry[] = beastJson[`clients`].map(BeastEntry.fromArray);
    const matchingBeastEntries = beastClients.filter((entry: BeastEntry) => entry.ip === ipAddress);

    const matchingBeastUuids = matchingBeastEntries.map((entry: BeastEntry) => entry.uuid);

    const mlatJson = JSON.parse(mlatFileContentFileContent);
    const mlatClientEntries: MlatEntry[] = Object.values(mlatJson).map(MlatEntry.fromObject);
    const matchingMlatEntries = mlatClientEntries.filter((entry: MlatEntry) => entry.source_ip === ipAddress);

    const matchingMlatUuids = matchingMlatEntries.map((entry: MlatEntry) => entry.uuid);

    const matchingUuids: Set<string> = new Set();
    matchingBeastUuids.forEach((uuid: string) => matchingUuids.add(uuid));
    matchingMlatUuids.forEach((uuid: string) => matchingUuids.add(uuid));

    myIpResults.beastData = matchingBeastEntries;
    myIpResults.mlatData = matchingMlatEntries;
    myIpResults.uuids = [...matchingUuids];

    return myIpResults;
}
