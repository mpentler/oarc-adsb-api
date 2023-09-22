import {BeastEntry, getIpData, MlatEntry} from '../src/IpStats';
import {describe} from "node:test";


describe('testing BeastEntry', () => {
    test('simple constructor of single entry maps values as expected', () => {
        const sampleBeastEntry = `[
    "6278da69-1787-4f4b-ac56-eb64ec3aa55e",
    "                       1.2.3.4 port 46358",
    15.36,
    1523,
    88.091,
    17.626,
    0,
    60,
    26844
  ]`;

        const beastEntry = BeastEntry.fromArray(JSON.parse(sampleBeastEntry));

        expect(beastEntry).not.toBeNull();
        expect(beastEntry.uuid).toBe("6278da69-1787-4f4b-ac56-eb64ec3aa55e");
        expect(beastEntry.ip).toBe("1.2.3.4");
        expect(beastEntry.port).toBe(46358);
        expect(beastEntry.bandwidthKbps).toBe(15.36);
        expect(beastEntry.unknownThing).toBe(1523);
        expect(beastEntry.messagesPerSecond).toBe(88.091);
        expect(beastEntry.positionsPerSecond).toBe(17.626);
        expect(beastEntry.latencyMs).toBe(0);
        expect(beastEntry.positionsTotal).toBe(60);
    })
});
describe('testing MlatEntry', () => {
    test('simple constructor of single entry maps values as expected', () => {

        const sampleMlatEntry = `{
    "user": "ARBITRARY_USER_DISPLAY_NAME",
    "uid": 243,
    "uuid": "6278da69-1787-4f4b-ac56-eb64ec3aa55e",
    "coords": "51.558320,-0.322240",
    "lat": 51.0,
    "lon": -0.0,
    "alt": 60.0,
    "privacy": false,
    "connection": "ARBITRARY_USER_DISPLAY_NAME v3 dump1090 0.4.2 tcp zlib2",
    "source_ip": "1.2.3.4",
    "source_port": "33418",
    "message_rate": 5,
    "peer_count": 16,
    "bad_sync_timeout": 0,
    "outlier_percent": 0.7,
    "bad_peer_list": "[]",
    "sync_interest": [
      "406696",
      "3c5432",
      "4ca892",
      "4ca935",
      "406540",
      "40773b"
    ],
    "mlat_interest": [
      "4cace0"
    ]
  }`;


        const mlatEntry = MlatEntry.fromObject((JSON.parse(sampleMlatEntry)));

        expect(mlatEntry).not.toBeNull();
        expect(mlatEntry.user).toBe("ARBITRARY_USER_DISPLAY_NAME");
        expect(mlatEntry.uid).toBe(243);
        expect(mlatEntry.uuid).toBe("6278da69-1787-4f4b-ac56-eb64ec3aa55e");
        expect(mlatEntry.coords).toBe("51.558320,-0.322240");
        expect(mlatEntry.lat).toBe(51.0);
        expect(mlatEntry.lon).toBe(-0.0);
        expect(mlatEntry.alt).toBe(60.0);
        expect(mlatEntry.privacy).toBe(false);
        expect(mlatEntry.connection).toBe("ARBITRARY_USER_DISPLAY_NAME v3 dump1090 0.4.2 tcp zlib2");
        expect(mlatEntry.source_ip).toBe("1.2.3.4");
        expect(mlatEntry.source_port).toBe("33418");
        expect(mlatEntry.message_rate).toBe(5);
        expect(mlatEntry.peer_count).toBe(16);
        expect(mlatEntry.bad_sync_timeout).toBe(0);
        expect(mlatEntry.outlier_percent).toBe(0.7);
        expect(mlatEntry.bad_peer_list).toBe("[]");
        expect(mlatEntry.sync_interest).toStrictEqual(["406696", "3c5432", "4ca892", "4ca935", "406540", "40773b"]);
        expect(mlatEntry.mlat_interest).toStrictEqual(["4cace0"]);
    })
});

describe('testing multiple values', () => {
    test('multiple entries are parsed as expected', () => {
        const sampleBeastFile = `{
  "clients": [
    [
      "d4ca9fce-dfd2-afae-0000-000000000000",
      "                                   ::1 port 37540",
      1.26,
      510348,
      1.359,
      0.731,
      0,
      -1,
      372939
    ],
    [
      "6278da69-1787-4f4b-ac56-eb64ec3aa55e",
      "                       1.2.3.4 port 46358",
      15.36,
      1523,
      88.091,
      17.626,
      0,
      60,
      26844
    ],
    [
      "12108031-f8f1-454f-9274-5dabfea5f7b6",
      "                       1.2.3.4 port 46358",
      15.36,
      1523,
      88.091,
      17.626,
      0,
      60,
      26844
    ],
    [
      "69ce7f6f-cacf-4723-93ed-af306c0752c9",
      "                       1.2.3.4 port 46358",
      15.36,
      1523,
      88.091,
      17.626,
      0,
      60,
      26844
    ],
    [
      "33ee1ef3-cf8c-4a09-9d4c-b3f02065d5af",
      "                       1.2.3.4 port 46358",
      15.36,
      1523,
      88.091,
      17.626,
      0,
      60,
      26844
    ]
  ]
}`;

        const sampleMlatFile = `{
  "ARBITRARY_USER_DISPLAY_NAME": {
    "user": "ARBITRARY_USER_DISPLAY_NAME",
    "uid": 243,
    "uuid": "6278da69-1787-4f4b-ac56-eb64ec3aa55e",
    "coords": "51.0,-0.0",
    "lat": 51.0,
    "lon": -0.0,
    "alt": 60.0,
    "privacy": false,
    "connection": "ARBITRARY_USER_DISPLAY_NAME v3 dump1090 0.4.2 tcp zlib2",
    "source_ip": "1.2.3.4",
    "source_port": "33418",
    "message_rate": 5,
    "peer_count": 16,
    "bad_sync_timeout": 0,
    "outlier_percent": 0.7,
    "bad_peer_list": "[]",
    "sync_interest": [
      "406696",
      "3c5432",
      "4ca892",
      "4ca935",
      "406540",
      "40773b"
    ],
    "mlat_interest": [
      "4cace0"
    ]
  },
  "ARBITRARY_USER_DISPLAY_NAME_2": {
    "user": "ARBITRARY_USER_DISPLAY_NAME_2",
    "uid": 243,
    "uuid": "faaf8e48-e691-447b-aa57-e4196d4952e2",
    "coords": "51.0,-0.0",
    "lat": 51.0,
    "lon": -0.0,
    "alt": 60.0,
    "privacy": false,
    "connection": "ARBITRARY_USER_DISPLAY_NAME_2 v3 dump1090 0.4.2 tcp zlib2",
    "source_ip": "1.2.3.4",
    "source_port": "33418",
    "message_rate": 5,
    "peer_count": 16,
    "bad_sync_timeout": 0,
    "outlier_percent": 0.7,
    "bad_peer_list": "[]",
    "sync_interest": [
      "406696",
      "3c5432",
      "4ca892",
      "4ca935",
      "406540",
      "40773b"
    ],
    "mlat_interest": [
      "4cace0"
    ]
  },
  "ARBITRARY_USER_DISPLAY_NAME_3": {
    "user": "ARBITRARY_USER_DISPLAY_NAME_3",
    "uid": 243,
    "uuid": "6278da69-1787-4f4b-ac56-eb64ec3aa55e",
    "coords": "51.0,-0.0",
    "lat": 51.0,
    "lon": -0.0,
    "alt": 60.0,
    "privacy": false,
    "connection": "ARBITRARY_USER_DISPLAY_NAME_3 v3 dump1090 0.4.2 tcp zlib2",
    "source_ip": "9.8.7.6",
    "source_port": "33418",
    "message_rate": 5,
    "peer_count": 16,
    "bad_sync_timeout": 0,
    "outlier_percent": 0.7,
    "bad_peer_list": "[]",
    "sync_interest": [
      "406696",
      "3c5432",
      "4ca892",
      "4ca935",
      "406540",
      "40773b"
    ],
    "mlat_interest": [
      "4cace0"
    ]
  }
}`;

        const ipAddress = '1.2.3.4';
        const ipStats = getIpData(ipAddress, sampleBeastFile, sampleMlatFile);

        expect(ipStats).not.toBeNull();

        // Only 4 of the 5 beast entries match the given IP address
        expect(ipStats.beastData.length).toBe(4);

        // Only 2 of the 3 mlat entries match the given IP address
        expect(ipStats.mlatData.length).toBe(2);

        // Each of the 4 beast entries has a unique UUID
        // Each of the 2 mlat entries has a unique UUID
        // There is one overlap in UUID between Beast and MLAT
        // Therefore the expected total number of unique UUIDs is 5
        expect(ipStats.uuids.length).toBe(5);
    })
});
