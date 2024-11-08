import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Button, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebase from '../../../firebase';

const db = getFirestore(firebase);

const PersonalizedRecipesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(null); // Track options menu visibility for each collection
  const [collectionName, setCollectionName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null); // For editing collection details

  const auth = getAuth();
  const userEmail = auth.currentUser ? auth.currentUser.email : null;

  const fetchFavoritesFromFirestore = async () => {
    if (!userEmail) return;
    try {
      const favoritesQuery = query(collection(db, 'Favorites'), where("userEmail", "==", userEmail));
      const snapshot = await getDocs(favoritesQuery);
      const favoriteRecipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavorites(favoriteRecipes);
    } catch (error) {
      console.error("Error fetching favorite recipes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionsFromFirestore = async () => {
    if (!userEmail) return;
    try {
      const collectionsQuery = query(collection(db, 'Collections'), where("userEmail", "==", userEmail));
      const snapshot = await getDocs(collectionsQuery);
      const userCollections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCollections(userCollections);
    } catch (error) {
      console.error("Error fetching collections:", error.message);
    }
  };

  const handleCreateCollection = async () => {
    if (collectionName.trim()) {
      try {
        const newCollection = { userEmail, collectionName, description, createdAt: new Date() };
        const docRef = await addDoc(collection(db, 'Collections'), newCollection);
        setCollections([...collections, { id: docRef.id, ...newCollection }]);
        setModalVisible(false);
        setCollectionName('');
        setDescription('');
      } catch (error) {
        console.error("Error creating collection:", error.message);
      }
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    try {
      await deleteDoc(doc(db, 'Collections', collectionId));
      setCollections(collections.filter(collection => collection.id !== collectionId));
    } catch (error) {
      console.error("Error deleting collection:", error.message);
    }
  };

  const handleEditCollection = async () => {
    if (selectedCollection) {
      try {
        await updateDoc(doc(db, 'Collections', selectedCollection.id), {
          collectionName,
          description,
        });
        setCollections(collections.map(collection =>
          collection.id === selectedCollection.id
            ? { ...collection, collectionName, description }
            : collection
        ));
        setModalVisible(false);
        setSelectedCollection(null);
        setCollectionName('');
        setDescription('');
      } catch (error) {
        console.error("Error updating collection:", error.message);
      }
    }
  };

  const openEditModal = (collection) => {
    setSelectedCollection(collection);
    setCollectionName(collection.collectionName);
    setDescription(collection.description);
    setModalVisible(true);
  };

  const handleCollectionClick = (collectionName) => {
    navigation.navigate('CollectionDetails', { collectionName });
  };

  useEffect(() => {
    fetchFavoritesFromFirestore();
    fetchCollectionsFromFirestore();
  }, [userEmail]);

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Details', { recipeId: item.id })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Ionicons name="heart" size={24} color="red" />
      </View>
    </TouchableOpacity>
  );

  const renderCollectionCard = ({ item }) => (
    <View style={styles.collectionCard}>
      <TouchableOpacity onPress={() => handleCollectionClick(item.collectionName)}>
        <Text style={styles.collectionTitle}>{item.collectionName}</Text>
        <Text style={styles.collectionDescription}>{item.description}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setOptionsVisible(optionsVisible === item.id ? null : item.id)}>
        <Ionicons name="ellipsis-horizontal" size={24} color="black" />
      </TouchableOpacity>

      {optionsVisible === item.id && (
        <View style={styles.optionsMenu}>
          <TouchableOpacity onPress={() => openEditModal(item)}>
            <Text style={styles.optionText}>Edit Collection</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteCollection(item.id)}>
            <Text style={styles.optionText}>Delete Collection</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.headerText}>Savory Stories</Text>
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.headerText1}>Your Favorite Recipes</Text>
      <Button title="New Collection +" onPress={() => setModalVisible(true)} />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {/* Display two recipes in a row */}
          <View style={styles.recipeGrid}>
            {favorites.map((item, index) => {
              if (index % 2 === 0) {
                return (
                  <View style={styles.recipeRow} key={index}>
                    <View style={styles.recipeCardWrapper}>
                      {renderRecipeCard({ item })}
                    </View>
                    {favorites[index + 1] && (
                      <View style={styles.recipeCardWrapper}>
                        {renderRecipeCard({ item: favorites[index + 1] })}
                      </View>
                    )}
                  </View>
                );
              }
              return null;
            })}
          </View>

          <Text style={styles.subHeaderText}>Your Collections</Text>
          {/* Display collections two in a row */}
          <View style={styles.collectionGrid}>
            {collections.map((item, index) => {
              if (index % 2 === 0) {
                return (
                  <View style={styles.collectionRow} key={index}>
                    <View style={styles.collectionCardWrapper}>
                      {renderCollectionCard({ item })}
                    </View>
                    {collections[index + 1] && (
                      <View style={styles.collectionCardWrapper}>
                        {renderCollectionCard({ item: collections[index + 1] })}
                      </View>
                    )}
                  </View>
                );
              }
              return null;
            })}
          </View>
        </>
      )}

      {/* Modal for New/Edit Collection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCollection ? 'Edit Collection' : 'New Collection'}</Text>
            <TextInput
              placeholder="Collection Name"
              style={styles.input}
              value={collectionName}
              onChangeText={setCollectionName}
            />
            <TextInput
              placeholder="Description (optional)"
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              maxLength={120}
            />
            <Button
              title={selectedCollection ? 'Update' : 'Create'}
              onPress={selectedCollection ? handleEditCollection : handleCreateCollection}
            />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  headerText1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  recipeGrid: {
    flexDirection: 'column',
  },
  recipeRow: {
    flexDirection: 'row',
  },
  recipeCardWrapper: {
    flex: 1,
    margin: 5,
  },
  collectionGrid: {
    flexDirection: 'column',
  },
  collectionRow: {
    flexDirection: 'row',
  },
  collectionCardWrapper: {
    flex: 1,
    margin: 5,
  },
  card: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  cardContent: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  collectionCard: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  collectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  collectionDescription: {
    fontSize: 14,
  },
  optionsMenu: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  optionText: {
    paddingVertical: 5,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default PersonalizedRecipesScreen;
