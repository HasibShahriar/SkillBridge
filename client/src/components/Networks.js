import React, { useState } from 'react';

// Sample user data
const userData = [
  {
    id: 1,
    name: "Auniruddho Halder",
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB"],
    connected: false
  },
  {
    id: 2,
    name: "Adnan Mia",
    role: "Data Scientist",
    skills: ["Python", "Machine Learning", "Pandas"],
    connected: false
  },
  {
    id: 3,
    name: "Hasib Shahriar",
    role: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "CSS"],
    connected: false
  },
  {
    id: 4,
    name: "Alice Johnson",
    role: "Backend Developer",
    skills: ["C#", "Javascript", "MySQL"],
    connected: false
  },
  {
    id: 5,
    name: "Jane Doe",
    role: "Frontend Developer",
    skills: ["React Js", "Angular Js"], 
    connected: false
  },
  {
    id: 6,
    name: "Jos Buttler",
    role: "Software Engineer",
    skills: ["DSA", "Python", "Rust"], 
    connected: true
  },
  {
    id: 7,
    name: "Sarah Wilson",
    role: "DevOps Engineer",
    skills: ["Docker", "Kubernetes", "AWS"],
    connected: false
  },
  {
    id: 8,
    name: "Mike Chen",
    role: "Android Developer",
    skills: ["React Native", "Swift", "Kotlin"],
    connected: false
  }
];

// UserCard Component
const UserCard = ({ user, onConnect }) => {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '24px',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      textAlign: 'center',
      width: '300px',
      margin: '16px'
    }}>
      {/* Avatar */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: user.connected ? '#D2691E' : '#4A90E2',
        margin: '0 auto 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        {user.name.split(' ').map(n => n[0]).join('')}
      </div>
      
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '20px',
        fontWeight: '600',
        color: '#333'
      }}>
        {user.name}
      </h3>
      
      <p style={{
        margin: '0 0 16px 0',
        fontSize: '16px',
        color: '#666'
      }}>
        {user.role}
      </p>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '24px'
      }}>
        {user.skills.filter(skill => skill).map((skill, index) => ( // Added filter to remove any undefined skills
          <span
            key={index}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '14px',
              color: '#555'
            }}
          >
            {skill}
          </span>
        ))}
      </div>
      
      <button
        onClick={() => onConnect(user.id)}
        style={{
          width: '100%',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: user.connected ? '#28a745' : '#4A90E2',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          cursor: user.connected ? 'default' : 'pointer',
          opacity: user.connected ? 0.8 : 1
        }}
      >
        {user.connected ? 'Connected ✓' : 'Connect'}
      </button>
    </div>
  );
};

// SearchBar Component
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto 40px',
      position: 'relative'
    }}>
      <input
        type="text"
        placeholder="Search by name or skill..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          width: '100%',
          padding: '16px 20px',
          fontSize: '16px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          outline: 'none',
          backgroundColor: '#f9f9f9'
        }}
      />
    </div>
  );
};

// Main App Component
function App() {
  const [users, setUsers] = useState(userData);
  const [searchTerm, setSearchTerm] = useState('');

  const handleConnect = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, connected: !user.connected } : user
      )
    );
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills.some(skill => skill && skill.toLowerCase().includes(searchTerm.toLowerCase())) // Added safety check for undefined skills
  );

  return (
    <div style={{
      padding: '40px 20px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <h1 style={{
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '40px',
        textAlign: 'left',
        maxWidth: '1200px',
        margin: '0 auto 40px'
      }}>
        Networks
      </h1>
      
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '0'
      }}>
        {filteredUsers.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onConnect={handleConnect}
          />
        ))}
      </div>
      
      {filteredUsers.length === 0 && (
        <div style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '18px',
          marginTop: '40px'
        }}>
          No users found matching your search.
        </div>
      )}
    </div>
  );
}

export default App;