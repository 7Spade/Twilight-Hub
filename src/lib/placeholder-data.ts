export const users = [
  {
    id: 'user-1',
    name: 'Alice',
    username: 'alice',
    email: 'alice@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar1/200/200',
    role: 'Admin',
  },
  {
    id: 'user-2',
    name: 'Bob',
    username: 'bob',
    email: 'bob@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar2/200/200',
    role: 'Member',
  },
  {
    id: 'user-3',
    name: 'Charlie',
    username: 'charlie',
    email: 'charlie@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar3/200/200',
    role: 'Member',
  },
  {
    id: 'user-4',
    name: 'Diana',
    username: 'diana',
    email: 'diana@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar4/200/200',
    role: 'Admin',
  },
   {
    id: 'user-5',
    name: 'Eve',
    username: 'eve',
    email: 'eve@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar5/200/200',
    role: 'Member',
  },
   {
    id: 'user-6',
    name: 'Frank',
    username: 'frank',
    email: 'frank@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar6/200/200',
    role: 'Member',
  },
];

export const currentUser = {
  id: 'user-1',
  name: 'Alice',
  username: 'alice',
  email: 'alice@example.com',
  avatarUrl: 'https://picsum.photos/seed/avatar1/200/200',
  followers: 1256,
  following: 250,
  badges: [
    { name: 'Founder', date: 'Jan 2023' },
    { name: 'Top Contributor', date: 'Mar 2024' },
    { name: 'Beta Tester', date: 'Dec 2022' },
  ],
  inventory: ['module-1', 'module-3'],
};

export const organizations = [
  {
    id: 'org-1',
    name: 'Quantum Leap Inc.',
    logoUrl: 'https://picsum.photos/seed/logo1/200/200',
    memberCount: 12,
    members: users,
    groups: [
      { id: 'group-1', name: 'Frontend', memberCount: 3, members: [users[0], users[1], users[2]] },
      { id: 'group-2', name: 'Backend', memberCount: 2, members: [users[3], users[4]] },
    ],
  },
  {
    id: 'org-2',
    name: 'Stardust Collective',
    logoUrl: 'https://picsum.photos/seed/logo2/200/200',
    memberCount: 8,
    members: users.slice(0,8),
    groups: [
      { id: 'group-3', name: 'Research', memberCount: 4, members: [users[0], users[2], users[4], users[5]] },
      { id: 'group-4', name: 'Marketing', memberCount: 2, members: [users[1], users[3]] },
    ],
  },
  {
    id: 'org-3',
    name: 'Nebula Studios',
    logoUrl: 'https://picsum.photos/seed/logo3/200/200',
    memberCount: 23,
    members: users,
    groups: [],
  },
];

export const spaces = [
  {
    id: 'space-1',
    name: 'Project Phoenix',
    description: 'Planning and development for the next-gen app.',
    isPublic: false,
    isStarred: true,
  },
  {
    id: 'space-2',
    name: 'Community Hub',
    description: 'Public space for community discussions.',
    isPublic: true,
    isStarred: false,
  },
  {
    id: 'space-3',
    name: 'Design System',
    description: 'Internal library of UI components.',
    isPublic: false,
    isStarred: true,
  },
  {
    id: 'space-4',
    name: 'Marketing Campaigns',
    description: 'Coordination for Q3 marketing efforts.',
    isPublic: false,
    isStarred: false,
  },
    {
    id: 'space-5',
    name: 'Open Source Brainstorm',
    description: 'Ideas for new open source projects.',
    isPublic: true,
    isStarred: true,
  },
];

export const modules = [
  {
    id: 'module-1',
    name: 'Task Board',
    description: 'A Kanban-style board to manage tasks and workflows.',
    icon: 'default',
  },
  {
    id: 'module-2',
    name: 'Document Editor',
    description: 'Collaborative real-time document editing.',
    icon: 'default',
  },
  {
    id: 'module-3',
    name: 'Team Chat',
    description: 'A dedicated chat room for the space.',
    icon: 'default',
  },
  {
    id: 'module-4',
    name: 'Calendar',
    description: 'Schedule events and deadlines for the team.',
    icon: 'default',
  },
    {
    id: 'module-5',
    name: 'File Gallery',
    description: 'Upload and share images, videos, and other files.',
    icon: 'default',
  },
    {
    id: 'module-6',
    name: 'Voting System',
    description: 'Create polls to make collective decisions.',
    icon: 'default',
  },
];

export const notifications = [
  { id: 1, user: users[1], text: 'followed you.', time: '2m ago' },
  { id: 2, user: users[2], text: 'starred your space "Community Hub".', time: '1h ago' },
  { id: 3, user: users[3], text: 'invited you to join the "Stardust Collective" organization.', time: '3h ago' },
  { id: 4, user: users[4], text: 'mentioned you in "Project Phoenix".', time: '1d ago' },
  { id: 5, user: users[5], text: 'completed a task in the "Design System" space.', time: '2d ago' },
];

export const conversations = [
    {
        id: 1,
        user: users[1],
        lastMessage: "Yeah, I'll get that done by EOD.",
        time: "2m",
        messages: [
            { sender: users[1], text: "Hey, did you see the latest designs?" },
            { sender: currentUser, text: "Just saw them, they look great!" },
            { sender: users[1], text: "Awesome! Can you implement the new login modal?" },
            { sender: currentUser, text: "Yeah, I'll get that done by EOD." },
        ]
    },
    {
        id: 2,
        user: users[3],
        lastMessage: "Sounds good, let's sync up tomorrow.",
        time: "1h",
        messages: [
             { sender: currentUser, text: "Meeting at 3 PM?" },
             { sender: users[3], text: "Can we do 4 PM instead?" },
             { sender: currentUser, text: "Sure, 4 PM works." },
             { sender: users[3], text: "Sounds good, let's sync up tomorrow." },
        ]
    },
    {
        id: 3,
        user: users[4],
        lastMessage: "Got it, thanks!",
        time: "5h",
        messages: []
    }
]
