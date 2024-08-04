import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { Snackbar, Alert } from '@mui/material';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUi7ASrqh1Inp6KKH-Dz1a_iOI1KRzMy0",
  authDomain: "pantry-tracker-7d60e.firebaseapp.com",
  projectId: "pantry-tracker-7d60e",
  storageBucket: "pantry-tracker-7d60e.appspot.com",
  messagingSenderId: "95186242630",
  appId: "1:95186242630:web:6917ff9d3ffde749308e47",
  measurementId: "G-8ZV7Z0QFJG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Styled components (same as your existing styles)
const Container = styled.div`
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-image: url('https://static.vecteezy.com/system/resources/previews/026/447/418/non_2x/organic-vegetable-collection-in-glass-jars-on-wooden-shelf-indoors-generated-by-ai-free-photo.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  margin: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #0056b3;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
`;

const ListItem = styled.li`
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const ItemName = styled.span`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  margin: 0 2px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #218838;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #c82333;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const Input = styled.input`
  padding: 10px;
  margin: 0 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SearchInput = styled(Input)`
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
`;

const TotalQuantity = styled.p`
  font-weight: bold;
  color: #fff;
  font-size: 1.2rem;
  margin-top: 20px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
`;

const App = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pantryItems'), (querySnapshot) => {
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(fetchedItems);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addItem = async () => {
    try {
      const newItem = { name: 'New Item', quantity: 1 };
      const docRef = await addDoc(collection(db, 'pantryItems'), newItem);
      setAlertMessage(`Document written with ID: ${docRef.id}`);
      setShowAlert(true);
    } catch (error) {
      setAlertMessage(`Error adding document: ${error.message}`);
      setShowAlert(true);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 0) return;
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
  };

  const deleteItem = (id) => {
    const filteredItems = items.filter((item) => item.id !== id);
    setItems(filteredItems);
  };

  const handleNameChange = (id, newName) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, name: newName } : item
    );
    setItems(updatedItems);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Container>
      <Title>Pantry Tracker</Title>
      <Button onClick={addItem}>Add Item</Button>
      <SearchInput
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TotalQuantity>Total Quantity: {totalQuantity}</TotalQuantity>
      <List>
        {filteredItems.map((item) => (
          <ListItem key={item.id}>
            <ItemName>
              <Input
                type="text"
                value={item.name}
                onChange={(e) => handleNameChange(item.id, e.target.value)}
              />
              <span style={{ marginLeft: '10px', fontSize: '1rem', color: '#333' }}>
                Quantity: {item.quantity}
              </span>
            </ItemName>
            <QuantityControls>
              <QuantityButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                +
              </QuantityButton>
              <QuantityButton onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                -
              </QuantityButton>
              <DeleteButton onClick={() => deleteItem(item.id)}>Delete</DeleteButton>
            </QuantityControls>
          </ListItem>
        ))}
      </List>

      <Snackbar open={showAlert} autoHideDuration={6000} onClose={() => setShowAlert(false)}>
        <Alert onClose={() => setShowAlert(false)} severity="info">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
