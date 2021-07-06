// eslint-disable-next-line max-len
const COOKIE = 'CONSENT=YES+ES.en+20550705-15-0; YSC=RVeWb8KzEXc; LOGIN_INFO=AFmmF2swRgIhALFkP9EgTxgWwh8_Dx3Fa2g-WN-K4umS1JQyzndTP5DLAiEAyHfgMQ2jMlNpvltT8LdxKqTle8a4ZSjODYq-svrKlVA:QUQ3MjNmemFvaS1aNkFXVURieUYtMUtWbnR5bFMzRnJfa21CUXdhSTV4QXNPVnNfQWlabDBUZU1qaC1oMnh1eVNwa2pxVWxkN3duYWdhbkk5aHM1ai1JNHFORy1ZVHNvMWw3X2RBdlhKMGZaamFaa3JfeUZzVmhqTnFLS1BETlJTOFRfTmZ6TVQyd0tfUktlcEQ5X1hiNmROcU5hSEt6NC13; VISITOR_INFO1_LIVE=Foji98RNGoc; HSID=AFT92MyweZvASBFc8; SSID=Adqw7Q8srjSE8qVwE; APISID=aS1BdrF_061pvnJi/AK-F-FrDdaxvZ2M9S; SAPISID=vziALsWDJB_bSEjT/A7-31kdejYhj8pFGi; __Secure-3PAPISID=vziALsWDJB_bSEjT/A7-31kdejYhj8pFGi; SID=7gd1s7_crFykFs0YacN6Na-duIl1hqXuQ1W1GFC3yPn-rdJQvrjB2Ws224CKFU_q-xDu6g.; __Secure-3PSID=7gd1s7_crFykFs0YacN6Na-duIl1hqXuQ1W1GFC3yPn-rdJQyzg_CthnHmIDweLdzl7x6w.; _gcl_au=1.1.1092345076.1615207146; PREF=tz=America.Bogota&f4=4000000&volume=100; SIDCC=AJi4QfHEidaBriNX7zfdqwhYttDNMZaRIs2EiVR8sxQEsgzh5tlYaBOoAUn9tNTUrmuHbD37LA; __Secure-3PSIDCC=AJi4QfHpDx-igRwtg57bWL78ZZK45bEB4srtDgZAfdcKm4cmO1a5l7jiJ0EVDsAKQlM_meAlN60';
const MAP_ERRORS = {
    SIGUSR1: 'server kill PID or nodemon restart.',
    SIGUSR2: 'server kill PID or nodemon restart.',
    SIGINT: 'CTRL + C was clicked and stopped the server.',
    uncaughtException: 'Unexpected Error Exception on Server.',
    unhandledRejection: 'Unhandled Promise on Server.',
    exit: 'Server was disconnected.'
};
const TTL = 60 * 60 * 1; // cache for 1 Hour ttl -> time to live
const FIVE_HOURS = TTL * 5;
const ONE_DAY = TTL * 24;
const THIRTY_DAYS = ONE_DAY * 30;
const ONE_YEAR = THIRTY_DAYS * 365;
const YOUTUBE_ROOT = 'https://www.youtube.com/watch?v=';

module.exports = {
    COOKIE,
    MAP_ERRORS,
    TTL,
    FIVE_HOURS,
    ONE_DAY,
    THIRTY_DAYS,
    ONE_YEAR,
    YOUTUBE_ROOT
};
