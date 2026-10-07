export type Language = 'en' | 'te';

export interface Translations {
  // Brand & Nav
  appTitle: string;
  appSubtitle: string;
  home: string;
  dashboard: string;
  sos: string;
  reportEmergency: string;
  liveMap: string;
  alerts: string;
  hospitals: string;
  shelters: string;
  rescue: string;
  volunteers: string;
  resources: string;
  notifications: string;
  profile: string;
  settings: string;
  admin: string;
  searchPlaceholder: string;
  demoModeNotice: string;

  // Home Page
  sendSosBtn: string;
  reportEmergencyBtn: string;
  viewLiveMapBtn: string;
  systemOnline: string;
  rescueNetworkActive: string;
  communicationActive: string;
  emergencyCategories: string;

  // Categories
  flood: string;
  cyclone: string;
  fire: string;
  earthquake: string;
  landslide: string;
  medical: string;
  accident: string;
  trapped: string;
  missingPerson: string;
  other: string;

  // Dashboard
  activeEmergencies: string;
  criticalAlerts: string;
  nearbyHospitals: string;
  nearbyShelters: string;
  availableRescueTeams: string;
  currentLocation: string;
  viewAll: string;

  // SOS Page
  sosTitle: string;
  sosSubtitle: string;
  emergencyType: string;
  description: string;
  severity: string;
  low: string;
  medium: string;
  high: string;
  critical: string;
  requestingGps: string;
  sosSuccessTitle: string;
  sosSuccessMessage: string;
  emergencyId: string;
  status: string;
  time: string;
  location: string;
  active: string;

  // Timeline
  timelineActive: string;
  timelineAcknowledged: string;
  timelineAssigned: string;
  timelineInProgress: string;
  timelineResolved: string;

  // Hospitals & Shelters
  hospitalName: string;
  availableBeds: string;
  icuBeds: string;
  shelterName: string;
  capacity: string;
  occupancy: string;
  availableSpaces: string;
  food: string;
  water: string;
  medicalSupport: string;
  call: string;
  directions: string;

  // Volunteers & Resources
  skills: string;
  phone: string;
  availability: string;
  available: string;
  busy: string;
  offline: string;
  inUse: string;
  total: string;
  registerVolunteer: string;

  // Actions
  view: string;
  accept: string;
  assign: string;
  update: string;
  resolve: string;
  submitReport: string;
  enterLocationManually: string;
  locationDenied: string;
  demoDisclaimer: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Dynamic Disaster Communication Hub',
    appSubtitle: 'Faster communication. Smarter response. Safer communities.',
    home: 'Home',
    dashboard: 'Dashboard',
    sos: 'SOS',
    reportEmergency: 'Report Emergency',
    liveMap: 'Live Map',
    alerts: 'Alerts',
    hospitals: 'Hospitals',
    shelters: 'Shelters',
    rescue: 'Rescue',
    volunteers: 'Volunteers',
    resources: 'Resources',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    admin: 'Admin',
    searchPlaceholder: 'Search Emergency ID, Hospital, Shelter, Alert, Location...',
    demoModeNotice: 'DEMO MODE - Temporary LocalStorage Demo. Emergency services will not be dispatched in real life.',

    sendSosBtn: 'SEND SOS',
    reportEmergencyBtn: 'REPORT EMERGENCY',
    viewLiveMapBtn: 'VIEW LIVE MAP',
    systemOnline: 'Emergency System Online',
    rescueNetworkActive: 'Rescue Network Active',
    communicationActive: 'Communication Active',
    emergencyCategories: 'Emergency Categories',

    flood: 'Flood',
    cyclone: 'Cyclone',
    fire: 'Fire',
    earthquake: 'Earthquake',
    landslide: 'Landslide',
    medical: 'Medical',
    accident: 'Accident',
    trapped: 'Trapped',
    missingPerson: 'Missing Person',
    other: 'Other',

    activeEmergencies: 'Active Emergencies',
    criticalAlerts: 'Critical Alerts',
    nearbyHospitals: 'Nearby Hospitals',
    nearbyShelters: 'Safe Shelters',
    availableRescueTeams: 'Available Rescue Teams',
    currentLocation: 'Current Location',
    viewAll: 'View All',

    sosTitle: 'EMERGENCY SOS BROADCAST',
    sosSubtitle: 'Tap below to broadcast immediate distress coordinates to all active rescue units.',
    emergencyType: 'Emergency Type',
    description: 'Description of Emergency',
    severity: 'Severity Level',
    low: 'LOW',
    medium: 'MEDIUM',
    high: 'HIGH',
    critical: 'CRITICAL',
    requestingGps: 'Acquiring GPS coordinates from browser...',
    sosSuccessTitle: 'SOS REQUEST BROADCASTED',
    sosSuccessMessage: 'Your emergency coordinates and details have been logged in the dispatch queue.',
    emergencyId: 'Emergency ID',
    status: 'Status',
    time: 'Time',
    location: 'Location',
    active: 'ACTIVE',

    timelineActive: 'ACTIVE',
    timelineAcknowledged: 'ACKNOWLEDGED',
    timelineAssigned: 'ASSIGNED',
    timelineInProgress: 'RESCUE IN PROGRESS',
    timelineResolved: 'RESOLVED',

    hospitalName: 'Hospital Name',
    availableBeds: 'Available Beds',
    icuBeds: 'ICU Beds',
    shelterName: 'Shelter Name',
    capacity: 'Capacity',
    occupancy: 'Current Occupancy',
    availableSpaces: 'Available Spaces',
    food: 'Food Supply',
    water: 'Water Supply',
    medicalSupport: 'Medical Support',
    call: 'Call',
    directions: 'Directions',

    skills: 'Skills',
    phone: 'Phone',
    availability: 'Availability',
    available: 'AVAILABLE',
    busy: 'BUSY',
    offline: 'OFFLINE',
    inUse: 'In Use',
    total: 'Total',
    registerVolunteer: 'Register as Volunteer',

    view: 'VIEW',
    accept: 'ACCEPT',
    assign: 'ASSIGN',
    update: 'UPDATE',
    resolve: 'RESOLVE',
    submitReport: 'REPORT EMERGENCY',
    enterLocationManually: 'ENTER LOCATION MANUALLY',
    locationDenied: 'Location permission denied.',
    demoDisclaimer: 'Demo data only. In actual emergency dial 112 / 911 immediately.',
  },
  te: {
    appTitle: 'డైనమిక్ విపత్తు కమ్యూనికేషన్ హబ్',
    appSubtitle: 'వేగవంతమైన సమాచారం. చురుకైన స్పందన. సురక్షితమైన సమాజం.',
    home: 'హోమ్',
    dashboard: 'డాష్‌బోర్డ్',
    sos: 'అత్యవసర SOS',
    reportEmergency: 'విపత్తు నివేదిక',
    liveMap: 'లైవ్ మ్యాప్',
    alerts: 'అత్యవసర హెచ్చరికలు',
    hospitals: 'సమీప ఆసుపత్రులు',
    shelters: 'సురక్షిత ఆశ్రయాలు',
    rescue: 'రెస్క్యూ కమాండ్',
    volunteers: 'వాలంటీర్లు',
    resources: 'వనరులు',
    notifications: 'నోటిఫికేషన్లు',
    profile: 'ప్రొఫైల్',
    settings: 'సెట్టింగ్‌లు',
    admin: 'అడ్మిన్',
    searchPlaceholder: 'ఎమర్జెన్సీ ID, ఆసుపత్రి, ఆశ్రయం, హెచ్చరిక లేదా ప్రాంతం వెతకండి...',
    demoModeNotice: 'డెమో మోడ్ - తాత్కాలిక లోకల్ స్టోరేజ్ నమూనా. నిజమైన రెస్క్యూ బృందాలకు ఇది చేరదు.',

    sendSosBtn: 'అత్యవసర సహాయం పంపండి',
    reportEmergencyBtn: 'విపత్తును నివేదించండి',
    viewLiveMapBtn: 'లైవ్ మ్యాప్ చూడండి',
    systemOnline: 'ఎమర్జెన్సీ సిస్టమ్ ఆన్‌లైన్',
    rescueNetworkActive: 'రెస్క్యూ నెట్‌వర్క్ క్రియాశీలం',
    communicationActive: 'కమ్యూనికేషన్ యాక్టివ్',
    emergencyCategories: 'విపత్తు రకాలు',

    flood: 'వరదలు',
    cyclone: 'తుఫాను',
    fire: 'అగ్నిప్రమాదం',
    earthquake: 'భూకంపం',
    landslide: 'కొండచరియలు',
    medical: 'వైద్య అత్యవసరం',
    accident: 'ప్రమాదం',
    trapped: 'చిక్కుకుపోయినవారు',
    missingPerson: 'గల్లంతైన వ్యక్తి',
    other: 'ఇతరాలు',

    activeEmergencies: 'క్రియాశీల అత్యవసరాలు',
    criticalAlerts: 'తీవ్రమైన హెచ్చరికలు',
    nearbyHospitals: 'సమీప ఆసుపత్రులు',
    nearbyShelters: 'సురక్షిత ఆశ్రయ కేంద్రాలు',
    availableRescueTeams: 'అందుబాటులో ఉన్న రెస్క్యూ బృందాలు',
    currentLocation: 'ప్రస్తుత స్థానం',
    viewAll: 'అన్నీ చూడండి',

    sosTitle: 'అత్యవసర SOS బ్రాడ్‌కాస్ట్',
    sosSubtitle: 'రెస్క్యూ టీమ్‌లకు తక్షణ స్థాన వివరాలను పంపడానికి క్రింద క్లిక్ చేయండి.',
    emergencyType: 'అత్యవసర రకం',
    description: 'వివరాలు',
    severity: 'తీవ్రత స్థాయి',
    low: 'తక్కువ',
    medium: 'మధ్యస్థం',
    high: 'ఎక్కువ',
    critical: 'అత్యంత ప్రమాదకరం',
    requestingGps: 'బ్రౌజర్ నుండి GPS స్థానాన్ని పొందుతున్నాము...',
    sosSuccessTitle: 'SOS అభ్యర్థన పంపబడింది',
    sosSuccessMessage: 'మీ ఎమర్జెన్సీ కోఆర్డినేట్‌లు మరియు వివరాలు నమోదయ్యాయి.',
    emergencyId: 'ఎమర్జెన్సీ ID',
    status: 'స్థితి',
    time: 'సమయం',
    location: 'ప్రాంతం',
    active: 'యాక్టివ్',

    timelineActive: 'యాక్టివ్',
    timelineAcknowledged: 'గుర్తించబడింది',
    timelineAssigned: 'కేటాయించబడింది',
    timelineInProgress: 'రెస్క్యూ కొనసాగుతోంది',
    timelineResolved: 'పరిష్కరించబడింది',

    hospitalName: 'ఆసుపత్రి పేరు',
    availableBeds: 'అందుబాటులో ఉన్న బెడ్లు',
    icuBeds: 'ICU బెడ్లు',
    shelterName: 'ఆశ్రయం పేరు',
    capacity: 'సామర్థ్యం',
    occupancy: 'ప్రస్తుత జనాభా',
    availableSpaces: 'ఖాళీ స్థలాలు',
    food: 'ఆహార నిల్వలు',
    water: 'మంచినీరు',
    medicalSupport: 'వైద్య మద్దతు',
    call: 'కాల్ చేయండి',
    directions: 'దారి చూపించు',

    skills: 'నైపుణ్యాలు',
    phone: 'ఫోన్ నంబర్',
    availability: 'లభ్యత',
    available: 'అందుబాటులో ఉంది',
    busy: 'బిజీగా ఉన్నారు',
    offline: 'ఆఫ్‌లైన్',
    inUse: 'వాడుకలో ఉంది',
    total: 'మొత్తం',
    registerVolunteer: 'వాలంటీర్‌గా నమోదు చేసుకోండి',

    view: 'చూడండి',
    accept: 'స్వీకరించు',
    assign: 'కేటాయించు',
    update: 'నవీకరించు',
    resolve: 'పరిష్కరించు',
    submitReport: 'నివేదిక సమర్పించండి',
    enterLocationManually: 'మాన్యువల్‌గా స్థానాన్ని నమోదు చేయండి',
    locationDenied: 'లొకేషన్ అనుమతి తిరస్కరించబడింది.',
    demoDisclaimer: 'ఇది కేవలం డెమో డేటా. అత్యవసరంలో వెంటనే 112 నంబర్‌కు కాల్ చేయండి.',
  },
};
