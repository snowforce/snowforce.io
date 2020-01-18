const fs = require('fs');
const { setToProjectRootDirectory } = require('./updateDirectory.js');
let jsforce = require('jsforce');
require('dotenv').config();

function writeJson(dir, fileName, year, data) {
  let folderDir = `${dir}/src/server/data/${year}`;

  if (!fs.existsSync(folderDir)) {
    fs.mkdirSync(folderDir);
  }

  fs.writeFile(`${folderDir}/${fileName}.json`, data, err => {
    if (err) throw err;
    console.log('Data written ', fileName);
  });
}

const writeYearlyData = (dir, obj, name) => {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    writeJson(dir, name, keys[i], JSON.stringify([...obj[keys[i]]]));
  }
};

const writeConferenceData = (dir, data, fileName) => {
  let folderDir = `${dir}/src/server/data`;
  fs.writeFile(`${folderDir}/${fileName}.json`, JSON.stringify(data), err => {
    if (err) throw err;
    console.log('Data written ', fileName);
  });
};

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

const conferenceQuery =
  'SELECT Id, Name, Year__c, Start_Date__c, End_Date__c, Ramp_Up_Date__c FROM Conference__c';

const accountsQuery =
  'SELECT Id, Name, About_Us__c, Website, PhotoUrl, ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry, BillingStreet, BillingCity, BillingPostalCode, BillingCountry FROM Account';

const contactsQuery =
  'SELECT Id, FirstName, LastName, PhotoUrl, Salutation, Twitter__c, Facebook__c, Linkedin__c, Instagram__c, Trailhead__c, Blog__c, Podcast__c, Personal_Website__c FROM Contact';

const acceptedSessionsQuery =
  "SELECT Id, Year__c, Title__c, Abstract__c, Status__c, Room__c, Date__c, Start_Time__c, End_Time__c, Format__c, Track__c, Level__c, Audience__c FROM Session__c WHERE Status__c = 'Accepted'";

const speakersQuery =
  'SELECT Id, Title__c, Bio__c, Session__c, Contact__c FROM Speaker__c ORDER BY Contact__r.LastName, Contact__r.FirstName';

const demoJamQuery = 'SELECT Id, Year__c, Winner__c FROM Demo_Jam__c';

const confirmedSponsorsQuery =
  "SELECT Id, Year__c, Account__c, Status__c, Type__c, Demo_Jam_Participant__c FROM Sponsor__c WHERE Status__c = 'Confirmed'";

const sponsorTypesQuery = 'SELECT Id, Name FROM Sponsor_Type__c';

const conferenceWrapper = conference => {
  return {
    id: conference.Id,
    year: conference.Year__c,
    startDate: conference.Start_Date__c,
    endDate: conference.End_Date__c,
    rampUpDate: conference.Ramp_Up_Date__c
  };
};

const speakerWrapper = (speaker, contact, currentSession, allSessionIds) => {
  return {
    id: speaker.Id,
    personalTitle: contact.Salutation || '',
    firstName: contact.FirstName,
    lastName: contact.LastName,
    title: speaker.Title__c || '',
    link: `/speaker/${speaker.Id}`,
    year: currentSession.Year__c,
    isKeynote: currentSession.Type__c === 'Keynote',
    img: contact.PhotoUrl,
    imgAlt: [contact.FirstName, contact.LastName].join(' '),
    bio: speaker.Bio__c || '',
    social: {
      twitter: contact.Twitter__c || '',
      facebook: contact.Facebook__c || '',
      linkedin: contact.Linkedin__c || '',
      instagram: contact.Instagram__c || '',
      trailhead: contact.Trailhead__c || '',
      blog: contact.Blog__c || '',
      podcast: contact.Podcast__c || '',
      website: contact.Personal_Website__c || ''
    },
    sessions: allSessionIds
  };
};

const sponsorWrapper = (sponsor, account, sponsorType) => {
  return {
    id: sponsor.Id,
    name: account.Name,
    about_us: account.About_Us__c || '',
    year: sponsor.Year__c,
    level: sponsorType.Name,
    link: `/sponsor/${sponsor.Id}`,
    website: account.Website || '',
    logo: account.PhotoUrl,
    shipping_address: {
      street: account.ShippingStreet || '',
      city: account.ShippingCity || '',
      state: account.ShippingState || '',
      postalcode: account.ShippingPostalCode || '',
      country: account.ShippingCountry || ''
    },
    billing_address: {
      street: account.BillingStreet || '',
      city: account.BillingCity || '',
      state: account.BillingState || '',
      postalcode: account.BillingPostalCode || '',
      country: account.BillingCountry || ''
    }
  };
};

const sessionWrapper = (session, speakers) => {
  return {
    id: session.Id,
    year: session.Year__c,
    link: `/session/${session.Id}`,
    room: session.Room__c || '',
    date: session.Date__c || '',
    time: session.Start_Time__c || '',
    endTime: session.End_Time__c || '',
    type: session.Format__c || '',
    title: session.Title__c,
    abstract: session.Abstract__c,
    audience: session.Audience__c || '',
    audienceLevel: session.Level__c || '',
    track: session.Track__c || '',
    speakers: speakers.map(s => s.Id)
  };
};

const demoJamWrapper = (demoJam, sponsorsById) => {
  const demoWinner = sponsorsById[demoJam.Winner__c];
  return {
    id: demoJam.Id,
    year: demoJam.Year__c,
    winner_name: demoWinner ? demoWinner.Name : '',
    participants: Object.keys(sponsorsById)
  };
};

const conferenceReducer = async conferenceArray => {
  return conferenceArray.then(res => {
    return res.reduce((acc, c) => {
      acc = [...acc, conferenceWrapper(c)];
      return acc;
    }, []);
  });
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

const sortSpeakers = (a, b) => {
  return `${b.lastName}, ${b.firstName}` - `${a.lastName}, ${a.firstName}`;
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
  const dir = setToProjectRootDirectory();

  if (!dir) {
    console.error('Unable to set directory');
    return;
  }

  const conn = new jsforce.Connection();
  // eslint-disable-next-line no-undef
  await conn.login(process.env.sfUserName, process.env.sfUserPassword);
  const querySalesforce = getSalesforceRecords.bind(this, conn);

  const sfConferences = querySalesforce(conferenceQuery);
  const sfAccountsById = querySalesforce(accountsQuery, true);
  const sfContactsById = querySalesforce(contactsQuery, true);
  const sfSessionArray = querySalesforce(acceptedSessionsQuery);
  const sfSpeakerArray = querySalesforce(speakersQuery);
  const sfDemoJamArray = querySalesforce(demoJamQuery);
  const sfSponsorArray = querySalesforce(confirmedSponsorsQuery);
  const sfSponsorTypeArray = querySalesforce(sponsorTypesQuery);

  const conferences = await conferenceReducer(sfConferences);
  writeConferenceData(dir, conferences, 'conferences');

  const allSponsors = await sponsorReducer(
    sfSponsorArray,
    sfAccountsById,
    sfSponsorTypeArray
  );
  writeYearlyData(dir, allSponsors, 'sponsors');

  const allDemoJams = await demoJamReducer(sfDemoJamArray, sfSponsorArray);
  writeYearlyData(dir, allDemoJams, 'demoJams');

  const allSpeakers = await speakerReducer(
    sfSpeakerArray,
    sfContactsById,
    sfSessionArray
  );
  writeYearlyData(dir, allSpeakers, 'speakers', sortSpeakers);

  const allSessions = await sessionReducer(sfSessionArray, sfSpeakerArray);
  writeYearlyData(dir, allSessions, 'sessions');
};
compileResources();
