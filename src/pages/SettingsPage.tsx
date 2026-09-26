import { useMemo, useState } from 'react';
import { Bell, MoonStar, ShieldCheck, SlidersHorizontal, Globe } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const languageLabels = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  mr: 'मराठी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  or: 'ଓଡ଼ିଆ',
  gu: 'ગુજરાતી',
  as: 'অসমীয়া',
} as const;

const settingsLabels = {
  en: {
    title: 'Platform settings',
    section: 'Operational controls',
    preferences: 'Preferences',
    theme: 'Theme',
    language: 'Language',
    notifications: 'Notifications',
    display: 'Display',
    dark: 'Dark mode',
    light: 'Light mode',
    enabled: 'Enabled',
    muted: 'Muted',
    compact: 'Compact dashboard',
    expanded: 'Expanded dashboard',
    dataSync: 'Data sync & alerts',
    healthy: 'System healthy',
    edit: 'Edit',
  },
  hi: {
    title: 'प्लेटफ़ॉर्म सेटिंग्स',
    section: 'ऑपरेशनल नियंत्रण',
    preferences: 'प्राथमिकताएँ',
    theme: 'थीम',
    language: 'भाषा',
    notifications: 'सूचनाएँ',
    display: 'प्रदर्शन',
    dark: 'डार्क मोड',
    light: 'लाइट मोड',
    enabled: 'सक्षम',
    muted: 'म्यूट',
    compact: 'कॉम्पैक्ट डैशबोर्ड',
    expanded: 'विस्तृत डैशबोर्ड',
    dataSync: 'डेटा सिंक और अलर्ट',
    healthy: 'सिस्टम स्वस्थ है',
    edit: 'बदले',
  },
  bn: {
    title: 'প্ল্যাটফর্ম সেটিংস',
    section: 'অপারেশনাল নিয়ন্ত্রণ',
    preferences: 'পছন্দ',
    theme: 'থিম',
    language: 'ভাষা',
    notifications: 'নোটিফিকেশন',
    display: 'প্রদর্শন',
    dark: 'ডার্ক মোড',
    light: 'লাইট মোড',
    enabled: 'সক্রিয়',
    muted: 'নীরব',
    compact: 'কমপ্যাক্ট ড্যাশবোর্ড',
    expanded: 'বিস্তৃত ড্যাশবোর্ড',
    dataSync: 'ডেটা সিঙ্ক ও অ্যালার্ট',
    healthy: 'সিস্টেম স্বাস্থ্যময়',
    edit: 'সম্পাদনা',
  },
  mr: {
    title: 'प्लॅटफॉर्म सेटिंग्ज',
    section: 'ऑपरेशनल नियंत्रण',
    preferences: 'प्राधान्ये',
    theme: 'थीम',
    language: 'भाषा',
    notifications: 'सूचना',
    display: 'प्रदर्शन',
    dark: 'डार्क मोड',
    light: 'लाईट मोड',
    enabled: 'सक्षम',
    muted: 'म्यूट',
    compact: 'कॉम्पॅक्ट डॅशबोर्ड',
    expanded: 'विस्तृत डॅशबोर्ड',
    dataSync: 'डेटा सिंक आणि अलर्ट',
    healthy: 'सिस्टम निरोगी आहे',
    edit: 'सुधारा',
  },
  ta: {
    title: 'பிளாட்ஃபார்ம் அமைப்புகள்',
    section: 'செயல்பாட்டு கட்டுப்பாடுகள்',
    preferences: 'விருப்பங்கள்',
    theme: 'தீம்',
    language: 'மொழி',
    notifications: 'அறிவிப்புகள்',
    display: 'காட்சி',
    dark: 'டார்க் மோட்',
    light: 'லைட் மோட்',
    enabled: 'செயல்படுத்தப்பட்டது',
    muted: 'முடக்கப்பட்டது',
    compact: 'குறுகிய டாஷ்போர்டு',
    expanded: 'விரிவான டாஷ்போர்டு',
    dataSync: 'தரவு ஒத்திசைவு & எச்சரிக்கைகள்',
    healthy: 'சிஸ்டம் சீராக உள்ளது',
    edit: 'திருத்து',
  },
  te: {
    title: 'ప్లాట్‌ఫారమ్ సెట్టింగ్‌లు',
    section: 'ఆపరేషనల్ నియంత్రణలు',
    preferences: 'ప్రాధాన్యతలు',
    theme: 'థీమ్',
    language: 'భాష',
    notifications: 'నోటిఫికేషన్లు',
    display: 'డిస్ప్లే',
    dark: 'డార్క్ మోడ్',
    light: 'లైట్ మోడ్',
    enabled: 'చాలా',
    muted: 'మ్యూట్',
    compact: 'కాంపాక్ట్ డ్యాష్‌బోర్డ్',
    expanded: 'విస్తృత డ్యాష్‌బోర్డ్',
    dataSync: 'డేటా సింక్ & అల్‌ర్ట్స్',
    healthy: 'సిస్టమ్ ఆరోగ్యంగా ఉంది',
    edit: 'సవరించండి',
  },
  kn: {
    title: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    section: 'ಕಾರ್ಯಾಚರಣೆಯ ನಿಯಂತ್ರಣಗಳು',
    preferences: 'ಪ್ರಿಯತೆಗಳು',
    theme: 'ಥೀಮ್',
    language: 'ಭಾಷೆ',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    display: 'ಪ್ರದರ್ಶನ',
    dark: 'ಡಾರ್ಕ್ ಮೋಡ್',
    light: 'ಲೈಟ್ ಮೋಡ್',
    enabled: 'ಸಕ್ರಿಯ',
    muted: 'ಮ್ಯೂಟ್',
    compact: 'ಕಂಪ್ಯಾಕ್ಟ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    expanded: 'ವಿಸ್ತೃತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    dataSync: 'ಡೇಟಾ ಸಿಂಕ್ & ಅಲ್‌ರ್ಟ್‌ಗಳು',
    healthy: 'ಸಿಸ್ಟಂ ಸ್ವಸ್ಥವಾಗಿದೆ',
    edit: 'ಸಂಪಾದಿಸಿ',
  },
  ml: {
    title: 'പ്ലാറ്റ്ഫോം സെറ്റിംഗുകൾ',
    section: 'ഓപ്പറേഷണൽ നിയന്ത്രണങ്ങൾ',
    preferences: 'മുന്ഗണനകൾ',
    theme: 'തീം',
    language: 'ഭാഷ',
    notifications: 'അറിയിപ്പുകൾ',
    display: 'ഡിസ്പ്ലേ',
    dark: 'ഡാർക്ക് മോഡ്',
    light: 'ലൈറ്റ് മോഡ്',
    enabled: 'പ്രാപ്തമാക്കി',
    muted: 'മ്യൂട്ട്',
    compact: 'കമ്പാക്റ്റ് ഡാഷ്ബോർഡ്',
    expanded: 'വിപുലമായ ഡാഷ്ബോർഡ്',
    dataSync: 'ഡാറ്റാ സിന്‌ച്ച് & അലേർട്ട്',
    healthy: 'സിസ്റ്റം ആരോഗ്യം',
    edit: 'തിരുത്തുക',
  },
  or: {
    title: 'ପ୍ଲାଟଫର୍ମ ସେଟିଂସ୍',
    section: 'ଅପରେସନାଲ କଣ୍ଟ୍ରୋଲ୍',
    preferences: 'ପସନ୍ଦ',
    theme: 'ଥିମ୍',
    language: 'ଭାଷା',
    notifications: 'ନୋଟିଫିକେସନ୍',
    display: 'ଡିସପ୍ଲେ',
    dark: 'ଡାର୍କ ମୋଡ୍',
    light: 'ଲାଇଟ୍ ମୋଡ୍',
    enabled: 'ସକ୍ଷମ',
    muted: 'ମ୍ୟୁଟ୍',
    compact: 'କମ୍ପାକ୍ଟ୍ ଡ୍ୟାସ୍‌ବୋର୍ଡ',
    expanded: 'ବିସ୍ତୃତ ଡ୍ୟାସ୍‌ବୋର୍ଡ',
    dataSync: 'ଡାଟା ସିଙ୍କ୍ & ଆଲର୍ଟ',
    healthy: 'ସିଷ୍ଟମ୍ ସୁସ୍ଥ',
    edit: 'ସମ୍ପାଦନ',
  },
  gu: {
    title: 'પ્લેટફોર્મ સેટિંગ્સ',
    section: 'ઓપરેશનલ કંટ્રોલ',
    preferences: 'પસંદ',
    theme: 'થીમ',
    language: 'ભાષા',
    notifications: 'નોટીફિકેશનો',
    display: 'ડિસ્પ્લે',
    dark: 'ડાર્ક મોડ',
    light: 'લાઇટ મોડ',
    enabled: 'સક્ષમ',
    muted: 'મ્યૂટ',
    compact: 'કોમ્પેક્ટ ડૅશબોર્ડ',
    expanded: 'વિસ્તૃત ડૅશબોર્ડ',
    dataSync: 'ડેટા સિંક & અલર્ટ',
    healthy: 'સિસ્ટમ સારું છે',
    edit: 'સંস্কાર',
  },
  as: {
    title: 'প্লেটফৰ্ম ছেটিংছ',
    section: 'অপারেশনাল নিয়ন্ত্রণ',
    preferences: 'পছন্দ',
    theme: 'থিম',
    language: 'ভাষা',
    notifications: 'নোটিফিকেশ্বন',
    display: 'ডিসপ্লে',
    dark: 'ডাৰ্ক মোড',
    light: 'লাইট মোড',
    enabled: 'সক্ষম',
    muted: 'মিউট',
    compact: 'কমপেক্ট ডেশ্বব’ৰ্ড',
    expanded: 'বিস্তৃত ডেশ্বব’ৰ্ড',
    dataSync: 'ডাটা চিংক & এলাৰ্ট',
    healthy: 'সিস্টেম সুস্থ',
    edit: 'সম্পাদনা',
  },
} as const;

export default function SettingsPage() {
  const { theme, language, setTheme, setLanguage } = useAppContext();
  const labels = settingsLabels[language] ?? settingsLabels.en;
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [compactDashboard, setCompactDashboard] = useState(true);

  const preferences = useMemo(
    () => [
      {
        label: labels.theme,
        value: theme === 'dark' ? labels.dark : labels.light,
        icon: <MoonStar size={16} className="text-sky-300" />,
        action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      },
      {
        label: labels.language,
        value: languageLabels[language],
        icon: <Globe size={16} className="text-sky-300" />,
        action: () => {
          const languages = Object.keys(languageLabels) as Array<keyof typeof languageLabels>;
          const currentIndex = languages.indexOf(language);
          const nextLanguage = languages[(currentIndex + 1) % languages.length];
          setLanguage(nextLanguage);
        },
      },
      {
        label: labels.notifications,
        value: notificationsEnabled ? labels.enabled : labels.muted,
        icon: <Bell size={16} className="text-sky-300" />,
        action: () => setNotificationsEnabled((enabled) => !enabled),
      },
      {
        label: labels.display,
        value: compactDashboard ? labels.compact : labels.expanded,
        icon: <SlidersHorizontal size={16} className="text-sky-300" />,
        action: () => setCompactDashboard((value) => !value),
      },
    ],
    [compactDashboard, labels, language, notificationsEnabled, setLanguage, setTheme, theme],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">{labels.section}</p>
            <h1 className="mt-2 text-3xl font-bold text-white">{labels.title}</h1>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
            <ShieldCheck size={15} className="text-emerald-300" />
            {labels.healthy}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="mb-4 text-xl font-semibold text-white">{labels.preferences}</h2>
          <div className="space-y-4">
            {preferences.map(({ label, value, icon, action }) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-slate-700 bg-slate-900 p-2">{icon}</div>
                  <div>
                    <div className="text-sm text-slate-400">{label}</div>
                    <div className="text-white">{value}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={action}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 transition hover:border-sky-500/50 hover:text-sky-200"
                >
                  {labels.edit}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="mb-4 text-xl font-semibold text-white">{labels.dataSync}</h2>
          <div className="space-y-4">
            {[
              ['Auto refresh', 'Every 5 minutes'],
              ['API sync', 'Connected to Open-Meteo live weather feed'],
              ['Emergency banner', 'Enabled'],
              ['Risk model', 'Decision-support estimate'],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <div className="text-sm text-slate-400">{String(label)}</div>
                <div className="mt-1 text-white">{String(value)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
