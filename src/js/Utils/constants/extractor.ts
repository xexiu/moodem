import { getFirefoxUserAgent, makeRandomChars } from '../common/generators';

export const COOKIE = `CONSENT=YES+ES.en+20550705-15-0; YSC=RVeWb8KzEXc; DOMAIN=${makeRandomChars(6)}.com; REFERRER=${makeRandomChars(6)}.com; LOGIN_INFO=AFmmF2swRgIhALFkP9EgTxgWwh8_Dx3Fa2g-WN-K4umS1JQyzndTP5DLAiEAyHfgMQ2jMlNpvltT8LdxKqTle8a4ZSjODYq-svrKlVA:QUQ3MjNmemFvaS1aNkFXVURieUYtMUtWbnR5bFMzRnJfa21CUXdhSTV4QXNPVnNfQWlabDBUZU1qaC1oMnh1eVNwa2pxVWxkN3duYWdhbkk5aHM1ai1JNHFORy1ZVHNvMWw3X2RBdlhKMGZaamFaa3JfeUZzVmhqTnFLS1BETlJTOFRfTmZ6TVQyd0tfUktlcEQ5X1hiNmROcU5hSEt6NC13; VISITOR_INFO1_LIVE=Foji98RNGoc; SID=-gd1sxxbEVq8dKuh38fcE2L05m61_kP3jA1TL17AkdIuOZF7zzjVv987_cKLK84ArH9_qA.; __Secure-3PSID=-gd1sxxbEVq8dKuh38fcE2L05m61_kP3jA1TL17AkdIuOZF7HnhPuBTzxSTGeDxEAKPCNg.; HSID=A6fqV8FuiHFhJcWl0; SSID=AYt2XL8PHZERVOAXN; APISID=inRo7-o_LZnfjBPr/AZVvFSHhuOiqo-pwE; SAPISID=SddX0sVlozD0JJTx/AK1WngcPSFTLva70H; __Secure-3PAPISID=SddX0sVlozD0JJTx/AK1WngcPSFTLva70H; SIDCC=AJi4QfG-lbIoDvzhyxohPDRt0gCfFugnuj0F09ScWGZ9ASC2Mw84X60mMkFKONh3vsJjroOwcQ; __Secure-3PSIDCC=AJi4QfEtg5vDtknOsL6nKk7MqtSXkwzRRe3N70K03XlnfnbGxLRh3kb7qvwUGAWsn8ZndfJhwGo`;

export const HEADERS = {
    Cookie: COOKIE,
    'x-youtube-client-version': '2.20191008.04.01',
    'x-youtube-client-name': '1',
    'x-client-data': '',
    'x-youtube-identity-token': 'QUFFLUhqbWtBX080QlRLNkQ3R2E2RXBWZGtXZFVjd1JuZ3w\u003d',
    'Accept-Encoding': 'identity;q=1, *;q=0',
    'User-Agent': getFirefoxUserAgent(),
    referer: `https://${makeRandomChars(6)}.com`
};

export const OPTIONS = {
    requestOptions: {
        headers: HEADERS
    }
};
