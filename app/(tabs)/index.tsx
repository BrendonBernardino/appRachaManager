import { SafeAreaView, StyleSheet, TouchableHighlight, TouchableOpacity, FlatList, Modal, TextInput, Button, Text, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import uuid from 'react-native-uuid';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconRestart from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwipeableRow from 'react-native-swipeable-row';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const STORAGE_KEY = '@player_list';
const initialData = [];

const PaymentModal = ({ visible, onClose }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ThemedText style={styles.modalTitle}>Escolha o método de pagamento</ThemedText>
        <TouchableOpacity style={styles.paymentOption} onPress={() => console.log('Dinheiro')}>
          <ThemedText style={styles.paymentOptionText}>Dinheiro</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption} onPress={() => console.log('Pix')}>
          <ThemedText style={styles.paymentOptionText}>Pix</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <ThemedText style={styles.closeButtonText}>Fechar</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const sortByName = (data) => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
};

const RenderItemButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.itemButton}>
    <ThemedText type="subtitle" style={styles.itemTextPay}>Pago?</ThemedText>
  </TouchableOpacity>
);

const renderItem = ({ item, onPayment, onToggleActive, onDelete }) => (
  // <Swipeable>
  <TouchableOpacity
    style={styles.item}
    onPress={() => onToggleActive(item.id)}
    onLongPress={() => onDelete(item)}
    delayLongPress={500}
  >
    <ThemedText type="subtitle" style={styles.itemText}>{item.name}</ThemedText>
    <RenderItemButton 
      onPress={() => onPayment(true)}
    />
    <View style={styles.iconActive}>
    {item.active && <Icon name="soccer" size={30} color={'#4E9F3D'}/>}
    </View>
  </TouchableOpacity>
  // </Swipeable>
);

export default function HomeScreen() {
  const [numPlayers, setNumPlayers] = useState(0);
  const [listAtt, setListAtt] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    console.log("RENDERIZAÇÃO");
    const loadInitialData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          setData(sortByName(parsedData));
          console.log("Loaded data from storage:", parsedData);
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
      const sortedData = sortByName(newData);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sortedData));
      setData(sortedData);
      setListAtt(!listAtt);
      console.log("Saved data to storage.");
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
      console.log("Deleted item from storage.");
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
      const newData = [...data, { id: uuid.v4(), name: newItemName, active: false }];
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
    // const newData = data.filter(item => item.id !== selectedItem);
    // deleteData(newData);
    // setData(newData);
    // setModalVisibleDelete(false);
    if (selectedItem) {
      deleteData(selectedItem.id);
      setSelectedItem(null);
      setModalVisibleDelete(false);
    }
  };

  const payment = (boole) => {
    setPaymentModalVisible(boole);
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
            <ThemedText type="subtitle" style={[styles.subtitle, {fontWeight: 'bold'}]}>Total Ativos: {numPlayers}</ThemedText>
            <ThemedText type="subtitle" style={[styles.subtitle, {fontWeight: 'bold'}]}>Jogadores/Time: 5</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.middleModule}>
          <ThemedText type="subtitle" style={styles.subtitle}>Nome</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>Pagamento</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>Ativo</ThemedText>
        </ThemedView>
        <ThemedView style={styles.botModule}>
          <FlatList
            data={data}
            renderItem={({ item }) => renderItem({ item, onPayment: payment, onToggleActive: toggleActive, onDelete: deleteItem })}
            keyExtractor={item => item.id}
            extraData={data}
          />
        </ThemedView>
        <TouchableHighlight style={styles.addButton} onPress={() => setModalVisibleAdd(true)}>
          <Icon name="plus" size={30} color="#fff" />
        </TouchableHighlight>
        <PaymentModal visible={paymentModalVisible} onClose={() => setPaymentModalVisible(false)} />
      </ThemedView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleAdd}
        onRequestClose={() => setModalVisibleAdd(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Adicionar novo jogador</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Jogador"
              placeholderTextColor={'#6B6B6B'}
              cursorColor={'#1A4D2E'}
              value={newItemName}
              onChangeText={setNewItemName}
            />
            <View style={styles.modalButtons}>
              <Button title="Cadastrar" onPress={addItem} />
              <Button title="Cancelar" color="#6B6B6B" onPress={() => setModalVisibleAdd(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleDelete}
        onRequestClose={() => setModalVisibleDelete(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Tem certeza que deseja excluir {selectedItem?.name}?</Text>
            <View style={styles.modalButtons}>
              <Button title="Excluir" color="red" onPress={confirmDeleteItem} />
              <Button title="Cancelar" color="#6B6B6B" onPress={() => setModalVisibleDelete(false)} />
            </View>
          </View>
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
    flex: 0.25,
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
    flex: 0.35,
    alignItems: 'flex-end',
    justifyContent: 'center',
    // backgroundColor:'blue',
    // color: '#4E9F3D',
    // fontSize: 30,
  },
  topsubModule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A291A',
    width:'90%',
  },
  middleModule: {
    flex: 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#191A19',
  },
  botModule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#191A19',
  },
  title: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 70,
    color: '#4E9F3D',
    fontSize: 50,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 20,
    marginVertical: 8,
    // backgroundColor: '#283D27',
    borderRadius: 25,
    borderBottomWidth: 1,
    borderColor: '#878484',
  },
  itemText: {
    flex: 0.40,
    width: '100%',
    color: '#E8DFCA',
    justifyContent: 'center',
    alignItems: 'center',
    // fontSize: 15,
    // backgroundColor:'pink',
  },
  itemButton: {
    flex: 0.2,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6B6B6B',
    // backgroundColor:'blue',
  },
  itemTextPay: {
    flex: 1,
    color: '#6B6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    // fontSize: 15,
    // backgroundColor:'pink',
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    // flex: 1,
    width: '80%',
    margin: 20,
    // backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#191A19',
  },
  modalText: {
    color:'#E8DFCA',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtons: {
    // flex: 0.5,
    // width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    color: '#E8DFCA',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#191A19',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'#E8DFCA',
  },
  paymentOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  paymentOptionText: {
    color:'#E8DFCA',
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
