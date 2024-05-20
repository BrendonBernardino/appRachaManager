import { SafeAreaView, StyleSheet, TouchableHighlight, TouchableOpacity, FlatList, Modal, TextInput, Button, Text, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconRestart from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwipeableRow from 'react-native-swipeable-row';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const STORAGE_KEY = '@player_list';

const initialData = [
];

// const fetchData = () => {
//   // Simulate a data fetching
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve([
//         { id: '1', name: 'Item 1' },
//         { id: '2', name: 'Item 2' },
//         { id: '3', name: 'Item 3' },
//         { id: '4', name: 'Item 4' },
//         { id: '5', name: 'Item 5' },
//         { id: '6', name: 'Item 6' },
//         { id: '7', name: 'Item 7' },
//       ]);
//     }, 1000);
//   });
// };

const renderItem = ({ item, onToggleActive, onDelete }) => (
  // <Swipeable>
  <TouchableOpacity
    style={styles.item}
    onPress={() => onToggleActive(item.id)}
    onLongPress={() => onDelete(item)}
    delayLongPress={1000}
  >
    <ThemedText type="subtitle" style={styles.itemText}>{item.name}</ThemedText>
    {item.active && <Icon name="soccer" style={styles.iconActive} />}
  </TouchableOpacity>
  // </Swipeable>
);

export default function HomeScreen() {
  const [numPlayers, setNumPlayers] = useState(0);
  const [listAtt, setListAtt] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    console.log("RENDERIZAÇÃO");
    const loadInitialData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData !== null) {
          setData(JSON.parse(storedData));
        } else {
          setData(initialData);
        }
      } catch (error) {
        console.error('Failed to load data from storage', error);
        setData(initialData);
      }
    };

    loadInitialData();
  }, [listAtt]);

  useEffect(() => {
    const countActiveUsers = () => {
      const activeUsers = data.filter(item => item.active).length;
      setNumPlayers(activeUsers);
    };

    countActiveUsers();
  }, [data]);

  const saveData = async (newData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
      setListAtt(!listAtt);
      console.log("Dados salvos");
    } catch (error) {
      console.error('Failed to save data to storage', error);
    }
  };

  const deleteData = async (id) => {
    try {
      const newData = data.filter(item => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
      setListAtt(!listAtt);
      console.log("Dados deletados");
    } catch (error) {
      console.error('Failed to delete data from storage', error);
    }
  };

  const toggleActive = (id) => {
    const newData = data.map(item => {
      if (item.id === id) {
        return { ...item, active: !item.active };
      }
      return item;
    });
    saveData(newData);
  };
  
  const addItem = () => {
    if (newItemName.trim()) {
      const newData = [...data, { id: (data.length + 1).toString(), name: newItemName }];
      saveData(newData);
      setNewItemName('');
      setModalVisibleAdd(false);
    }
  };

  const deleteItem = (id) => {
    setSelectedItem(id);
    setModalVisibleDelete(true);
  };

  const confirmDeleteItem = () => {
    const newData = data.filter(item => item.id !== selectedItem);
    deleteData(newData);
    setData(newData);
    setModalVisibleDelete(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.page}>
        <ThemedView style={styles.topModule}>
            <TouchableHighlight>
              <IconRestart name="restart" 
                size={45}
                style={styles.iconRestart}
              />
            </TouchableHighlight>
          <ThemedText type="title" style={styles.title}>Racha</ThemedText>
          <ThemedView style={styles.topsubModule}>
            <ThemedText type="subtitle" style={styles.subtitle}>Total Ativos: {numPlayers}</ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>Jogadores/Time: 5</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.botModule}>
          <FlatList
            data={data}
            renderItem={({ item }) => renderItem({ item, onToggleActive: toggleActive, onDelete: deleteItem })}
            keyExtractor={item => item.id}
            extraData={data}
          />
        </ThemedView>
        <TouchableHighlight style={styles.addButton} onPress={() => setModalVisibleAdd(true)}>
          <Icon name="plus" size={30} color="#fff" />
        </TouchableHighlight>
      </ThemedView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleAdd}
        onRequestClose={() => setModalVisibleAdd(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Adicionar novo jogador</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Usuário"
            value={newItemName}
            onChangeText={setNewItemName}
          />
          <Button title="Cadastrar" onPress={addItem} />
          <Button title="Cancelar" color="red" onPress={() => setModalVisibleAdd(false)} />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleDelete}
        onRequestClose={() => setModalVisibleDelete(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Tem certeza que deseja excluir {selectedItem?.name}?</Text>
          <Button title="Excluir" onPress={confirmDeleteItem} />
          <Button title="Cancelar" color="red" onPress={() => setModalVisibleDelete(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A291A",
  },
  page: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  topModule: {
    flex: 0.3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A291A',
    width:'100%',
  },
  iconRestart: {
    flex: 0.3,
    position: 'absolute',
    top: 75,
    // left: 30,
    right: 150,
    height: 50,
    width: 50,
    justifyContent: 'center',
    color: '#1A4D2E',
    // backgroundColor:'pink',
  },
  iconActive: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:'blue',
    color: '#4E9F3D',
    fontSize: 30,
  },
  topsubModule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A291A',
    width:'90%',
  },
  botModule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#191A19',
    gap: 8,
  },
  title: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 50,
    color: '#4E9F3D',
    fontSize: 70,
    // backgroundColor:'pink',
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#4E9F3D',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#283D27',
    borderRadius: 10,
  },
  itemText: {
    flex: 0.9,
    color: '#4E9F3D',
  },
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
});
