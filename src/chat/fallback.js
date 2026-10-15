// Pre-recorded answers for when AI-Navya can't reach the server, so the chat never looks broken.
const POEM = `"Wanderlust whispers, the journey's near,
pack your bags, no doubt, no fear.
through alpine mountains and breezy beaches,
every journey has something it preaches…"
The full poem unrolls right after London. ✿`;

const RULES = [
  [/poem|poetry|wanderlust|write/, POEM],
  [/study|degree|college|course|nmims|mpstme|year|cgpa|gpa|grade/, "I'm in year 5 of 6 of a B.Tech (Integrated) in Data Science at SVKM's NMIMS MPSTME, Mumbai, with a 3.7/4 CGPA. Hot girls study data science 💅"],
  [/dessert|sweet|chocolate|cake|strawberr/, 'Strawberries and chocolate, forever number one. Honestly, anything chocolate. 🍫'],
  [/caf|food|eat|coffee/, 'My Mumbai favourites are Chantilly, Bougee Cafe and Benne Dosa. Window seat, please ✿'],
  [/travel|trip|countr|visit|been|place/, "I've been to South Africa, Australia, the USA, Vietnam, the UAE and the UK. Next stop? Still deciding ✈"],
  [/music|song|singer|listen|arijit|elvis/, "Arijit Singh, always. And Can't Help Falling in Love by Elvis on repeat ♡"],
  [/badminton|sport|trophy|trophies/, 'Badminton is my sport. There is a whole shelf of trophies to prove it, and it taught me how I like to work. 🏸'],
  [/event|club|conclave|iete|committee|guest|lead/, "I head Artist & Guest Management at Social Conclave, was Sub-Head of AGM at IETE-SF and an Executive on the Sports Committee. Events are my love language."],
  [/project|built|github|code|churn|bitcoin|edux|hackathon/, "My favourites: a Markov-chain churn simulator for a streaming platform, a Bitcoin Fear & Greed vs. profitability analysis, and EduX from the OpenAI × NxtWave Buildathon. Scroll to The Court!"],
  [/intern|work|job|experience|ruvision|synoptics/, "I'm an AI & Data Science intern at RuVision Thinking Labs (since June 2026), and I interned in cyber security at Synoptics Technologies in 2025."],
  [/skill|python|sql|tool|stack/, 'Python, SQL, Pandas, scikit-learn, Streamlit, Power BI and a lot of statistics. Plus legendary-tier event planning ✧'],
  [/fashion|outfit|dress|style|wear/, 'I love dressing up. A theme, a mood and one statement piece. Try the mirror in London! 👗'],
  [/contact|email|reach|linkedin|hire|mail/, 'Email me at 123navyashah@gmail.com or find me on LinkedIn. Links are at the very bottom ✉'],
  [/goal|career|future|dream|plan/, 'Main quest: make my business take off so it can fund my expensive lifestyle 💅'],
  [/are you (an )?ai|real|bot|human/, "I'm AI-Navya, a pixel version running on notes the real Navya wrote. The real her is at 123navyashah@gmail.com ✿"],
  [/hi|hello|hey|hii/, "Hi hi! Ask me about my projects, desserts, travels, or why I'm obsessed with academic validation ✿"],
];

export function fallbackAnswer(q) {
  const text = q.toLowerCase();
  for (const [re, answer] of RULES) if (re.test(text)) return answer;
  return "Ooh, I haven't shared that one here yet. Email me at 123navyashah@gmail.com and the real me will answer ✿";
}
