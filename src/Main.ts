import axios from 'axios';
import * as CORS from 'cors';
import * as Express from 'express';
const requestIP = require('request-ip');
const fs = require('fs');

const server = Express.default();

server.use(CORS.default());

const readsb_api_host = process.env['READSB_API_HOST'] || '127.0.0.1';
const readsb_api_port = process.env['READSB_API_PORT'] || '35005';


// Get one or more aircraft based on Mode S hex code
server.get('/v2/hex/:hex', async (req: any, res) => {
    var hex = req.params.hex;
    
    var hexRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?find_hex=${hex}&jv2`);
    hexRes = JSON.stringify(hexRes.data);
    
    res.type('json');
    res.send(hexRes);
});

// Get one or more aircraft based on callsign
server.get('/v2/callsign/:callsign', async (req: any, res) => {
    var callsign = req.params.callsign;
    
    var callsignRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?find_callsign=${callsign}&jv2`);
    callsignRes = JSON.stringify(callsignRes.data);
    
    res.type('json');
    res.send(callsignRes);
});

// Get one or more aircraft based on registration
server.get('/v2/reg/:reg', async (req: any, res) => {
    var reg = req.params.reg;
    
    var regRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?find_reg=${reg}&jv2`);
    regRes = JSON.stringify(regRes.data);
    
    res.type('json');
    res.send(regRes);
});

// Get one or more aircraft based on ICAO type code
server.get('/v2/type/:type', async (req: any, res) => {
    var type = req.params.type;
    
    var typeRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?find_type=${type}&jv2`);
    typeRes = JSON.stringify(typeRes.data);
    
    res.type('json');
    res.send(typeRes);
});

// Get one or more aircraft based on squawk
server.get('/v2/squawk/:squawk', async (req: any, res) => {
    var squawk = req.params.squawk;
    
    var squawkRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?all&filter_squawk=${squawk}&jv2`);
    squawkRes = JSON.stringify(squawkRes.data);
    
    res.type('json');
    res.send(squawkRes);
});

// Get all currently tracked military aircraft
server.get('/v2/mil/', async (_req: any, res) => {
    var milRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?all&filter_mil&jv2`);
    milRes = JSON.stringify(milRes.data);
    
    res.type('json');
    res.send(milRes);
});

// Get all currently tracked LADD aircraft
server.get('/v2/ladd/', async (_req: any, res) => {
    var laddRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?all&filter_ladd&jv2`);
    laddRes = JSON.stringify(laddRes.data);
    
    res.type('json');
    res.send(laddRes);
});

// Get all currently tracked PIA aircraft
server.get('/v2/pia/', async (_req: any, res) => {
    var piaRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?all&filter_pia&jv2`);
    piaRes = JSON.stringify(piaRes.data);
    
    res.type('json');
    res.send(piaRes);
});

// Get all aircraft within a point in a certain radius
server.get('/v2/point/:lat/:lon/:rad', async (req: any, res) => {
    var lat = req.params.lat;
    var lon = req.params.lon;
    var rad = req.params.rad;
    rad > 250 ? rad = 250 : rad = rad;

    var pointRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?circle=${lat},${lon},${rad}&jv2`);
    pointRes = JSON.stringify(pointRes.data);
    
    res.type('json');
    res.send(pointRes);
});

// Get details of connecting IP's stats
server.get('/v3/myip/', async (req: any, res) => {
    const ipAddress = requestIP.getClientIp(req);
    var beastJSON = JSON.parse(fs.readFileSync('/run/readsb/clients.json'));
    var mlatJSON = JSON.parse(fs.readFileSync('/run/mlat-server/clients.json'));
    var beastclients = beastJSON[`clients`];
    var mlatclients = Object.keys(mlatJSON);
    var beastdata;
    var mlatdata;
    var myipRes = [];

    beastclients.forEach(function (client: any) {
        var splitted = client[1].trim().split(" ", 1)[0];
        if (splitted == ipAddress) {
            beastdata = client;
        }
    });

    mlatclients.forEach((client) => {
        var splitted = Object.values(mlatJSON[client]["source_ip"]).join("");
        if (splitted == ipAddress) {
            mlatdata = mlatJSON[client];
        }
    });

    if (beastdata) {
        myipRes[0] = beastdata;
    } else {
        myipRes[0] = "No match!";
    }

    if (mlatdata) {
        myipRes[1] = mlatdata;
    } else {
        myipRes[1] = "No match!";
    }

    res.type('json');
    res.send(myipRes);
});


class BeastEntry {
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

class MlatEntry {
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
// Get details of connecting IP's stats
server.get('/v4/myip/', async (req: any, res) => {
    const ipAddress = requestIP.getClientIp(req);

    const myIpResults: { mlatData: MlatEntry[]; beastData: BeastEntry[]; uuids: any[] } = {
        uuids: [],
        beastData: [],
        mlatData: [],
    };

    const beastJson = JSON.parse(fs.readFileSync('/run/readsb/clients.json'));
    const beastClients: BeastEntry[] = beastJson[`clients`].map(BeastEntry.fromArray);
    const matchingBeastEntries = beastClients.filter((entry:BeastEntry) => entry.ip === ipAddress);

    const matchingBeastUuids = matchingBeastEntries.map((entry:BeastEntry) =>  entry.uuid );

    const mlatJson = JSON.parse(fs.readFileSync('/run/mlat-server/clients.json'));
    const mlatClientEntries: MlatEntry[] = Object.values(mlatJson).map(MlatEntry.fromObject);
    const matchingMlatEntries = mlatClientEntries.filter((entry:MlatEntry) => entry.source_ip === ipAddress);

    const matchingMlatUuids = matchingMlatEntries.map((entry:MlatEntry) =>  entry.uuid );

    const matchingUuids : Set<string> = new Set();
    matchingBeastUuids.forEach((uuid:string) => matchingUuids.add(uuid));
    matchingMlatUuids.forEach((uuid:string) => matchingUuids.add(uuid));

    myIpResults.beastData = matchingBeastEntries;
    myIpResults.mlatData = matchingMlatEntries;
    myIpResults.uuids = [...matchingUuids];

    res.type('json');
    res.send(myIpResults);
});

// Returns current number of Beast and MLAT feeders
server.get('/v3/feedcount/', async (_req: any, res) => {
    var beastJSON = JSON.parse(fs.readFileSync('/run/readsb/clients.json'));
    var mlatJSON = JSON.parse(fs.readFileSync('/run/mlat-server/clients.json'));
    var beastclients = beastJSON[`clients`];
    var mlatclients = Object.keys(mlatJSON);
    var feedcountRes = [];

    feedcountRes[0] = beastclients.length-1; // Minus 1 for the MLAT feedback
    feedcountRes[1] = mlatclients.length;

    res.type('json');
    res.send(feedcountRes);
});

server.listen(3000, () => {
    console.info('OARC ADS-B API server started.')
});
