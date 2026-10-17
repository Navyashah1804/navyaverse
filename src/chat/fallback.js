// Pre-recorded answers for when AI-Navya can't reach the server, so the chat never looks broken.
const POEM = `"Wanderlust whispers, the journey's near,
pack your bags, no doubt, no fear.
through alpine mountains and breezy beaches,
every journey has something it preaches…"
The full poem unrolls right after London. ✿`;

const RULES = [
  [/\b(poem|poems|poetry|wanderlust|write|writing)\b/, POEM],
  [/\b(study|studying|degree|college|course|courses|nmims|mpstme|year|cgpa|gpa|grades?)\b/, "I'm in year 5 of 6 of a B.Tech (Integrated) in Data Science at SVKM's NMIMS MPSTME, Mumbai, with a 3.7/4 CGPA. Hot girls study data science 💅"],
  [/\b(desserts?|sweet|chocolate|cakes?|strawberr\w*)\b/, 'Strawberries and chocolate, forever number one. Honestly, anything chocolate. 🍫'],
  [/\b(cafe|cafes|café|cafés|food|eat|eating|coffee)\b/, 'My Mumbai favourites are Chantilly, Bougee Cafe and Benne Dosa. Window seat, please ✿'],
  [/\b(travel\w*|trips?|countr\w*|visit\w*|places?)\b/, "I've been to South Africa, Australia, the USA, Vietnam, the UAE and the UK. Next stop? Still deciding ✈"],
  [/\b(music|songs?|singers?|listen\w*|arijit|elvis)\b/, "Arijit Singh, always. And Can't Help Falling in Love by Elvis on repeat ♡"],
  [/\b(badminton|sports?|trophy|trophies)\b/, 'Badminton is my sport. There is a whole shelf of trophies to prove it, and it taught me how I like to work. 🏸'],
  [/\b(events?|clubs?|conclave|iete|committee|guests?|lead\w*)\b/, "I head Artist & Guest Management at Social Conclave, was Sub-Head of AGM at IETE-SF and an Executive on the Sports Committee. Events are my love language."],
  [/\b(projects?|built|github|code|churn|bitcoin|edux|hackathons?)\b/, "My favourites: a Markov-chain churn simulator for a streaming platform, a Bitcoin Fear & Greed vs. profitability analysis, and EduX from the OpenAI × NxtWave Buildathon. Scroll to The Court!"],
  [/\b(intern\w*|work|working|jobs?|experience|ruvision|synoptics)\b/, "I'm an AI & Data Science intern at RuVision Thinking Labs (since June 2026), and I interned in cyber security at Synoptics Technologies in 2025."],
  [/\b(skills?|python|sql|tools?|stack)\b/, 'Python, SQL, Pandas, scikit-learn, Streamlit, Power BI and a lot of statistics. Plus legendary-tier event planning ✧'],
  [/\b(fashion|outfits?|dress\w*|style|wear)\b/, 'I love dressing up. A theme, a mood and one statement piece. Try the mirror in London! 👗'],
  [/\b(contact|email|reach|linkedin|hire|mail)\b/, 'Email me at 123navyashah@gmail.com or find me on LinkedIn. Links are at the very bottom ✉'],
  [/\b(goals?|career|future|dreams?|plans?)\b/, 'Main quest: make my business take off so it can fund my expensive lifestyle 💅'],
  [/\b(are you (an )?ai|real navya|bot|human)\b/, "I'm AI-Navya, a pixel version running on notes the real Navya wrote. The real her is at 123navyashah@gmail.com ✿"],
  [/^\s*(hi+|hello|hey+|hiya)\b/, "Hi hi! Ask me about my projects, desserts, travels, or why I'm obsessed with academic validation ✿"],
];

// The quick-question chips answer from here instantly, without calling Gemini.
export const CHIP_ANSWERS = {
  'What do you study?': "I'm in year 5 of 6 of an Integrated B.Tech in Data Science at SVKM's NMIMS MPSTME, Mumbai, with a 3.7/4 CGPA. Hot girls study data science 💅 Peek into the Study Room ♡",
  'Best dessert?': 'Strawberries and chocolate, forever number one. Honestly, anything chocolate. My Mumbai go-tos are Chantilly and Bougee Cafe 🍫',
  'Tell me about your events': "I head Artist & Guest Management at Social Conclave, was Sub-Head of AGM at IETE-SF, and an Executive on the Sports Committee. Turning chaos into a run-of-show is my favourite sport ✧",
  'Where have you travelled?': "South Africa, Australia, the USA, Vietnam, the UAE and the UK so far. The next passport stamp is still loading ✈",
  'Read me a poem': POEM,
  'How do I reach you?': 'Email me at 123navyashah@gmail.com, or find me on LinkedIn and GitHub. The stamps are at the very bottom ✉',
};

export function fallbackAnswer(q) {
  const text = q.toLowerCase();
  for (const [re, answer] of RULES) if (re.test(text)) return answer;
  return "Ooh, I haven't shared that one here yet. Email me at 123navyashah@gmail.com and the real me will answer ✿";
}
