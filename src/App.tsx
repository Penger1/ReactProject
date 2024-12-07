import React, { useState } from 'react';

const App: React.FC = () => {
  const [users, setUsers] = useState([
    { server: 'survival', username: '' }
  ]);
  const [result, setResult] = useState<any[]>([]); // Store result as an array of items

  const servers = [
    'survival',
    'earth',
    'skyblock',
    'islands',
    'olympus',
    'factions',
    'kitpvp',
    'parkour',
  ];

  // Add a new user profile
  const handleAddUser = () => {
    setUsers([...users, { server: 'survival', username: '' }]);
  };

  const handleSearch = async () => {
    if (users.some(user => !user.username.trim())) {
      alert('Please enter a username for all users');
      return;
    }

    try {
      // Function to fetch Mojang data
      const fetchMojangData = async (username: string) => {
        const response = await fetch(`/mojang/users/profiles/minecraft/${username}`);
        if (!response.ok) {
          throw new Error('User not found in Mojang');
        }
        const data = await response.json();
        return data.id.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, '$1-$2-$3-$4-$5');
      };

      // Function to fetch Manacube data
      const fetchManacubeData = async (server: string, uuid: string) => {
        const response = await fetch(`/manacube/api/svas/${server}/${uuid}`);
        if (!response.ok) {
          throw new Error('Data not found in Manacube');
        }
        return response.json();
      };

      let allItems: any[] = [];

      // Fetch data for each user
      for (const user of users) {
        const uuid = await fetchMojangData(user.username);
        const manacubeData = await fetchManacubeData(user.server, uuid);

        // Condense data to include only id and itemType (name)
        const condensedData = manacubeData.map((item: any) => ({
          id: item.id,
          itemType: item.itemType,
        }));

        allItems = [...allItems, ...condensedData];
      }

      setResult(allItems);
    } catch (error: any) {
      setResult([{ id: 'Error', itemType: error.message }]);
    }
  };

  // Function to sort the result alphabetically by `itemType`
  const sortItems = () => {
    const sorted = [...result].sort((a, b) => a.itemType.localeCompare(b.itemType));
    setResult(sorted);
  };

  // Function to count total number of items
  const countTotalItems = () => {
    return result.length;
  };

  // Function to count unique item types
  const countUniqueItemTypes = () => {
    const uniqueItemTypes = new Set(result.map(item => item.itemType));
    return uniqueItemTypes.size;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Manacube Data Viewer</h1>
      <div style={{ marginBottom: '10px' }}>
        {users.map((user, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label>
              Select Server:{' '}
              <select
                value={user.server}
                onChange={(e) => {
                  const newUsers = [...users];
                  newUsers[index].server = e.target.value;
                  setUsers(newUsers);
                }}
                style={{ marginRight: '10px' }}
              >
                {servers.map((srv) => (
                  <option key={srv} value={srv}>
                    {srv.charAt(0).toUpperCase() + srv.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Enter Username:{' '}
              <input
                type="text"
                value={user.username}
                onChange={(e) => {
                  const newUsers = [...users];
                  newUsers[index].username = e.target.value;
                  setUsers(newUsers);
                }}
                style={{ marginRight: '10px' }}
              />
            </label>
          </div>
        ))}
        <button onClick={handleAddUser} style={{ marginRight: '10px' }}>
          Add User
        </button>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <h2>Result:</h2>
        {result.length > 0 && (
          <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
            Total Items: {countTotalItems()} | Unique Item Types: {countUniqueItemTypes()}
          </div>
        )}
        <button
          onClick={sortItems}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            marginBottom: '20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Sort Alphabetically by Item Name
        </button>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {result.length > 0 ? (
            result.map((item, index) => (
              <div
                key={index}
                style={{
                  background: '#f4f4f4',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  width: '150px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>ID:</div>
                <div>{item.id}</div>
                <div style={{ fontWeight: 'bold' }}>Item Name:</div>
                <div>{item.itemType}</div>
              </div>
            ))
          ) : (
            <div>No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
