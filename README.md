# Trello Clone – React + Firebase

A fully functional Trello-style task management application built using React and Firebase.

## 🚀 Features

### Authentication
- Google Sign-in using Firebase Authentication
- Secure logout
- Auth-protected routes

### Boards
- Create boards
- View user-specific boards
- Update board titles
- Delete boards

### Lists
- Create lists inside boards
- Update list titles
- Delete lists

### Cards
- Create cards inside lists
- Edit card titles
- Delete cards
- Add colored tags

### Drag & Drop
- Reorder cards within lists
- Move cards across lists
- Drop cards into empty lists
- Smooth drag overlay animation

### Multi-user Support
- Each user sees only their boards
- Lists & cards tied to user ownership
- Firestore security rules enforced

### Real-time Updates
- Firestore snapshot listeners
- Instant UI updates

---

## 🛠 Tech Stack

Frontend:
- React
- TypeScript
- Tailwind CSS
- DnD-kit

Backend:
- Firebase Authentication
- Firestore Database

Deployment:
- (Vercel / Firebase Hosting)

---

## 🔐 Security

Firestore rules ensure:
- Users can only access their own boards
- Lists and cards are user-scoped
- No cross-user data access possible

---

## 📂 Firestore Structure

boards
- id
- title
- userId
- createdAt

lists
- id
- title
- boardId
- userId
- order
- createdAt

cards
- id
- title
- listId
- boardId
- userId
- order
- tags
- createdAt

---

## 🧪 Running Locally

1. Clone repo (git clone)
2. Install dependencies

```bash
npm install
```

Add Firebase Config in:
src/services/firebase.ts

Start App:
npm run dev
