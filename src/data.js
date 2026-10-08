// ALL DATA BELOW IS FICTIONAL SAMPLE DATA - not real vacancies.
const d = (n) => new Date(Date.now() + n * 864e5).toISOString()
export const OPPS = [
  { id: 1, company: 'NovaStack Labs', title: 'Software Engineering Intern', type: 'Internship', loc: 'Bengaluru', skills: ['Java', 'SQL', 'DSA'], branches: ['CSE', 'IT'], minCgpa: 7, maxBacklogs: 0, years: [2026, 2027], deadline: d(6), topics: ['Arrays & Strings', 'SQL', 'OOP', 'Project explanation'], process: 'Online test, 2 technical rounds, HR (illustrative)' },
  { id: 2, company: 'Orbitly Systems', title: 'Backend Developer (Full-time)', type: 'Full-time', loc: 'Remote', skills: ['Node.js', 'SQL', 'DSA'], branches: ['CSE', 'IT', 'ECE'], minCgpa: 6.5, years: [2026], deadline: d(14), topics: ['DSA', 'DBMS', 'APIs', 'Operating Systems'], process: 'Coding round, system design basics, HR (illustrative)' },
  { id: 3, company: 'PixelForge Studio', title: 'Frontend Engineer Intern', type: 'Internship', loc: 'Delhi', skills: ['React', 'JavaScript', 'CSS'], branches: [], minCgpa: null, maxBacklogs: null, years: [2027, 2028], deadline: d(21), topics: ['JavaScript', 'React', 'Portfolio review'], process: 'Portfolio review + live coding (illustrative)' },
  { id: 4, company: 'Lumen Analytics', title: 'Data Analyst Trainee', type: 'Full-time', loc: 'Hyderabad', skills: ['Python', 'SQL', 'Statistics'], branches: ['CSE', 'IT', 'MATH'], minCgpa: 7.5, maxBacklogs: 0, years: [2026], deadline: d(-3), topics: ['SQL', 'Statistics', 'Aptitude'], process: 'Aptitude, case study, interview (illustrative)' },
]
export const QUESTIONS = [
  { id: 1, topic: 'Aptitude', q: 'A train 100 m long passes a pole in 10 s. Its speed is?', o: ['5 m/s', '10 m/s', '20 m/s', '100 m/s'], a: 1, why: 'Speed = distance / time = 100 / 10.' },
  { id: 2, topic: 'DSA', q: 'Time complexity of binary search on a sorted array?', o: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], a: 1, why: 'The search space halves each step.' },
  { id: 3, topic: 'DSA', q: 'Which structure is LIFO?', o: ['Queue', 'Stack', 'Heap', 'Graph'], a: 1, why: 'A stack pops the most recently pushed item.' },
  { id: 4, topic: 'SQL', q: 'Which clause filters grouped rows?', o: ['WHERE', 'ORDER BY', 'HAVING', 'LIMIT'], a: 2, why: 'HAVING filters after GROUP BY; WHERE filters before.' },
  { id: 5, topic: 'OOP', q: 'Wrapping data and methods in one unit is called?', o: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'], a: 1, why: 'Encapsulation bundles state with behaviour.' },
  { id: 6, topic: 'Aptitude', q: 'What is 20% of 250?', o: ['25', '40', '50', '60'], a: 2, why: '250 x 0.2 = 50.' },
]
export const SAMPLE_REPORTS = [
  { id: 's1', company: 'NovaStack Labs', role: 'SDE Intern', round: 'Technical 1', topics: ['Arrays & Strings', 'SQL'], advice: 'Sample report: practise explaining your approach aloud.', sample: true },
]
