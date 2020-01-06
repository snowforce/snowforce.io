const fs = require('fs');
const path = require('path');
let jsforce = require('jsforce');
require('dotenv').config();

let dir;

function writeJson(fileName, year, data) {
  // Set the current working directory to the root of the project
  if (!dir) {
    dir = path.dirname(__dirname);
    try {
      process.chdir(dir);
    } catch (err) {
      done(err);
      return;
    }
  }

  fs.writeFile(`${dir}/dist/data/${year}/${fileName}.json`, data, err => {
    if (err) throw err;
    console.log('Data written ', fileName);
  });
}

const writeObjects = (obj, name) => {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    writeJson(name, keys[i], JSON.stringify(obj[keys[i]]));
  }
};

// const sponsorKeys = Object.keys(allSponsors);
// for (let i = 0; i < sponsorKeys.length; i++) {
//   writeJson(
//     'sponsors',
//     sponsorKeys[i],
//     JSON.stringify(allSponsors[sponsorKeys[i]])
//   );
// }

const reduceById = res => {
  return res.reduce((acc, a) => {
    acc[a.Id] = a;
    return acc;
  }, {});
};

const resolveAll = promiseArray => {
  return Promise.all(promiseArray)
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    });
};

const getSalesforceRecords = async (
  sfConnection,
  soql,
  returnMapById = false
) => {
  const res = await sfConnection.query(soql);
  if (returnMapById) return reduceById(res.records);
  return res.records;
};

const accountsQuery =
  'SELECT Id, Name, About_Us__c, Website, PhotoUrl, ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry, BillingStreet, BillingCity, BillingPostalCode, BillingCountry FROM Account';

const contactsQuery =
  'SELECT Id, FirstName, LastName, PhotoUrl, Salutation, Twitter__c, Facebook__c, Linkedin__c, Instagram__c, Trailhead__c, Blog__c, Podcast__c, Personal_Website__c FROM Contact';

const acceptedSessionsQuery =
  "SELECT Id, Year__c, Status__c, Room__c, Date__c, Start_Time__c, End_Time__c, Format__c, Track__c, Level__c, Audience__c FROM Session__c WHERE Status__c = 'Accepted'";

const speakersQuery =
  'SELECT Id, Title__c, Bio__c, Session__c, Contact__c FROM Speaker__c';

const demoJamQuery = 'SELECT Id, Year__c, Winner__c FROM Demo_Jam__c';

const confirmedSponsorsQuery =
  "SELECT Id, Year__c, Account__c, Status__c, Type__c, Demo_Jam_Participant__c FROM Sponsor__c WHERE Status__c = 'Confirmed'";

const sponsorTypesQuery = 'SELECT Id, Name FROM Sponsor_Type__c';

const speakerWrapper = (speaker, contact, currentSession, allSessionIds) => {
  return {
    id: speaker.Id,
    first_name: contact.FirstName,
    last_name: contact.LastName,
    title: speaker.Title__c,
    link: `'/speaker/${speaker.Id}`,
    year: currentSession.Year__c,
    img: contact.PhotoUrl,
    img_alt: [
      speaker.Title__c,
      contact.Salutation,
      contact.FirstName,
      contact.LastName
    ].join(' '),
    bio: speaker.Bio__c,
    social: {
      twitter: contact.Twitter__c,
      facebook: contact.Facebook__c,
      linkedin: contact.Linkedin__c,
      instagram: contact.Instagram__c,
      trailhead: contact.Trailhead__c,
      blog: contact.Blog__c,
      podcast: contact.Podcast__c,
      website: contact.Personal_Website__c
    },
    sessions: allSessionIds
  };
};

const sponsorWrapper = (sponsor, account, sponsorType) => {
  return {
    id: sponsor.Id,
    name: account.Name,
    about_us: account.About_Us__c,
    year: sponsor.Year__c,
    level: sponsorType.Name,
    link: `/sponsor/${sponsor.Id}`,
    website: account.Website,
    logo: account.PhotoUrl,
    shipping_address: {
      street: account.ShippingStreet,
      city: account.ShippingCity,
      state: account.ShippingState,
      postalcode: account.ShippingPostalCode,
      country: account.ShippingCountry
    },
    billing_address: {
      street: account.BillingStreet,
      city: account.BillingCity,
      state: account.BillingState,
      postalcode: account.BillingPostalCode,
      country: account.BillingCountry
    }
  };
};

const sessionWrapper = (session, speakers) => {
  return {
    id: session.Id,
    year: session.Year__c,
    link: `/session/${session.Id}`,
    room: session.Room__c,
    date: session.Date__c,
    start_time: session.Start_Time__c,
    end_time: session.End_Time__c,
    type: session.Format__c,
    audience: session.Audience__c,
    audience_level: session.Level__c,
    speakers: speakers.map(s => s.Id)
  };
};

const demoJamWrapper = (demoJam, sponsorsById) => {
  const demoWinner = sponsorsById[demoJam.Winner__c];
  return {
    id: demoJam.Id,
    year: demoJam.Year__c,
    winner_name: demoWinner ? demoWinner.Name : null,
    participants: Object.keys(sponsorsById)
  };
};

const sponsorReducer = async (sponsorArray, accountArray, sponsorTypeArray) => {
  return resolveAll([sponsorArray, accountArray, sponsorTypeArray]).then(
    res => {
      return res[0].reduce((sponsors, s) => {
        const a = res[1][s.Account__c];
        const t = res[2][s.Type__c];
        if (a && t) {
          if (!sponsors[s.Year__c]) {
            sponsors[s.Year__c] = [];
          }
          sponsors[s.Year__c].push(sponsorWrapper(s, a, t));
        }
        return sponsors;
      }, {});
    }
  );
};

const demoJamReducer = async (demoJamArray, sponsorArray) => {
  return resolveAll([demoJamArray, sponsorArray]).then(res => {
    return res[0].reduce((jams, j) => {
      const sponsors = res[1].filter(sp => sp.Demo_Jam_Participant__c === j.Id);
      if (sponsors) {
        if (!jams[j.Year__c]) {
          jams[j.Year__c] = [];
        }
        jams[j.Year__c].push(demoJamWrapper(j, reduceById(sponsors)));
      }
      return jams;
    }, {});
  });
};

const speakerReducer = async (speakerArray, contactsById, sessionArray) => {
  return resolveAll([speakerArray, contactsById, sessionArray]).then(res => {
    return res[0].reduce((speakers, s) => {
      const contact = res[1][s.Contact__c];
      const session = res[2].filter(se => se.Id === s.Session__c)[0];
      const sessionIds = res[0]
        .filter(sp => sp.Contact__c === s.Contact__c)
        .map(sp => sp.Session__c);
      if (contact && session) {
        if (!speakers[session.Year__c]) {
          speakers[session.Year__c] = [];
        }
        speakers[session.Year__c].push(
          speakerWrapper(s, contact, session, sessionIds)
        );
      }
      return speakers;
    }, {});
  });
};

const sessionReducer = async (sessionArray, speakerArray) => {
  return resolveAll([sessionArray, speakerArray]).then(res => {
    return res[0].reduce((sessions, s) => {
      const speakers = res[1].filter(sp => sp.Session__c === s.Id);
      if (speakers) {
        if (!sessions[s.Year__c]) {
          sessions[s.Year__c] = [];
        }
        sessions[s.Year__c].push(sessionWrapper(s, speakers));
      }
      return sessions;
    }, {});
  });
};

const compileResources = async () => {
  const conn = new jsforce.Connection();
  // eslint-disable-next-line no-undef
  await conn.login(process.env.sfUserName, process.env.sfUserPassword);
  const querySalesforce = getSalesforceRecords.bind(this, conn);

  const sfAccountsById = querySalesforce(accountsQuery, true);
  const sfContactsById = querySalesforce(contactsQuery, true);
  const sfSessionArray = querySalesforce(acceptedSessionsQuery);
  const sfSpeakerArray = querySalesforce(speakersQuery);
  const sfDemoJamArray = querySalesforce(demoJamQuery);
  const sfSponsorArray = querySalesforce(confirmedSponsorsQuery);
  const sfSponsorTypeArray = querySalesforce(sponsorTypesQuery);

  const allSponsors = await sponsorReducer(
    sfSponsorArray,
    sfAccountsById,
    sfSponsorTypeArray
  );

  const allDemoJams = await demoJamReducer(sfDemoJamArray, sfSponsorArray);

  const allSpeakers = await speakerReducer(
    sfSpeakerArray,
    sfContactsById,
    sfSessionArray
  );

  const allSessions = await sessionReducer(sfSessionArray, sfSpeakerArray);

  debugger;

  writeObjects(allSponsors, 'sponsors');
  writeObjects(allDemoJams, 'demoJams');
  writeObjects(allSpeakers, 'speakers');
  writeObjects(allSessions, 'sessions');
};
compileResources();
