
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ShirtIcon from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const STORAGE_KEY = '@player_list';

type TeamData = {
  team1: string[];
  team2: string[];
  team3: string[];
  team4: string[];
};

type Player = {
  name: string;
  active: boolean;
};

function sortearNomes(lista: string[], quantidade: number): string[] {
  const nomesSorteados = new Set<string>();

  while (nomesSorteados.size < quantidade && nomesSorteados.size < lista.length) {
    const indiceSorteado = Math.floor(Math.random() * lista.length);
    const nomeSorteado = lista[indiceSorteado];
    nomesSorteados.add(nomeSorteado);
  }

  return Array.from(nomesSorteados);
}

export default function TabTwoScreen() {
  const [teamData, setTeamData] = useState<TeamData>({
    team1: [],
    team2: [],
    team3: [],
    team4: [],
  });
  const [nomes, setNomes] = useState<string[]>([]);
  const [sorteio, setSorteio] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jogadoresPorTime, setJogadoresPorTime] = useState<number>(5);


  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (nomes.length > 0) {
      handleSortear();
    }
  }, [sorteio]);

  const loadData = async () => {
    try {
      const teamDataFromStorage = await AsyncStorage.getItem(STORAGE_KEY);//STORAGE_KEY
      if (teamDataFromStorage !== null) {
        const parsedData: Player[] = JSON.parse(teamDataFromStorage);
        // setTeamData(parsedData);
        const nomesAtivos = parsedData
                          .filter(item => item.active === true)
                          .map(item => item.name);
        console.log(nomesAtivos);
        setNomes(nomesAtivos);
        console.log("Carregado jogadores ativos: ", nomes);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do AsyncStorage', error);
    }
  };

  const sortear = async () => {
    setSorteio(!sorteio);
    await loadData();
  };

  const handleSortear = () => {
    const quantidadeNomesAtivos = nomes.length;
    const quantidadeTimes = Math.min(4, quantidadeNomesAtivos / jogadoresPorTime);
    // console.log('quantidade de times: ', quantidadeTimes)

    const novoTeamData: TeamData = {
      team1: [],
      team2: [],
      team3: [],
      team4: [],
    };
  
    let nomesRestantes = [...nomes];
  
    if (quantidadeTimes > 0) {
      const nomesSorteadosTeam1 = sortearNomes(nomesRestantes, jogadoresPorTime);
      novoTeamData.team1 = nomesSorteadosTeam1;
      nomesRestantes = nomesRestantes.filter(nome => !nomesSorteadosTeam1.includes(nome));
    }
  
    if (quantidadeTimes > 1) {
      const nomesSorteadosTeam2 = sortearNomes(nomesRestantes, jogadoresPorTime);
      novoTeamData.team2 = nomesSorteadosTeam2;
      nomesRestantes = nomesRestantes.filter(nome => !nomesSorteadosTeam2.includes(nome));
    }
  
    if (quantidadeTimes > 2) {
      const nomesSorteadosTeam3 = sortearNomes(nomesRestantes, jogadoresPorTime);
      novoTeamData.team3 = nomesSorteadosTeam3;
      nomesRestantes = nomesRestantes.filter(nome => !nomesSorteadosTeam3.includes(nome));
    }
  
    if (quantidadeTimes > 3) {
      const nomesSorteadosTeam4 = sortearNomes(nomesRestantes, jogadoresPorTime);
      novoTeamData.team4 = nomesSorteadosTeam4;
      nomesRestantes = nomesRestantes.filter(nome => !nomesSorteadosTeam4.includes(nome));
    }

    setTeamData(novoTeamData);
    console.log('Nomes sorteados para team1:', novoTeamData.team1);
    console.log('Nomes sorteados para team2:', novoTeamData.team2);
    console.log('Nomes sorteados para team3:', novoTeamData.team3);
    console.log('Nomes sorteados para team4:', novoTeamData.team4);
    // console.log('Restantes:', nomesRestantes);
  
    nomesRestantes = [];
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSelectJogadores = (num: number) => {
    setJogadoresPorTime(num);
    toggleModal();
  };

  // const renderJogadoresOption = ({ item }) => (
  //   <TouchableOpacity style={styles.modalOption} onPress={() => handleSelectJogadores(item)}>
  //     <Text style={styles.modalOptionText}>{item}</Text>
  //   </TouchableOpacity>
  // );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.topModule}>
        <ThemedText type="title" style={styles.title}>Sorteio</ThemedText>
        <View style={styles.row}>
          <ThemedText type="subtitle" style={[styles.subtitle, {fontWeight: 'bold'}]}>Jogadores/Time: {
          <TouchableOpacity style={styles.button2} onPress={() => setIsModalVisible(true)}>
            <Text style={styles.buttonText}>{jogadoresPorTime}</Text>
          </TouchableOpacity>
          }</ThemedText>
        </View>
        {/* <ThemedText type="subtitle" style={[styles.subtitle, {fontWeight: 'bold'}]}>Jogadores/Time: 5</ThemedText> */}
      </ThemedView>
      <ThemedView style={styles.botModule}>
        <View style={styles.botRow}>
            <ShirtIcon name="shirt" 
              size={70}
              color={'#363333'}
              // style={styles.iconRestart}
            />
          <View>
            <ThemedText type="subtitle" style={[styles.subtitle, {fontWeight: 'bold'}]}>Time 1:</ThemedText>
            {teamData.team1.map((user, index) => (
              <ThemedText key={index} style={styles.subtitle}>
                {user}
              </ThemedText>
            ))}
          </View>
          <ShirtIcon name="shirt" 
            size={70}
            color={'red'}
            // style={styles.iconRestart}
          />
          <View>
            <ThemedText type="subtitle" style={[styles.subtitle, {fontWeight: 'bold'}]}>Time 2:</ThemedText>
            {teamData.team2.map((user, index) => (
              <ThemedText key={index} style={styles.subtitle}>
                {user}
              </ThemedText>
            ))}
          </View>
        </View>
        <View style={styles.botRow}>
          <ShirtIcon name="shirt" 
            size={70}
            color={'#0B96B5'}
            // style={styles.iconRestart}
          />
          <View>
            <ThemedText type="subtitle" style={[styles.subtitle, {fontWeight: 'bold'}]}>Time 3:</ThemedText>
            {teamData.team3.map((user, index) => (
              <ThemedText key={index} style={styles.subtitle}>
                {user}
              </ThemedText>
            ))}
          </View>
          <ShirtIcon name="shirt" 
            size={70}
            color={'#4E9F3D'}
            // style={styles.iconRestart}
          />
          <View>
            <ThemedText type="subtitle" style={[styles.subtitle, {fontWeight: 'bold'}]}>Time 4:</ThemedText>
            {teamData.team4.map((user, index) => (
              <ThemedText key={index} style={styles.subtitle}>
                {user}
              </ThemedText>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => sortear()}>
          <Text style={styles.buttonText}>Sortear</Text>
        </TouchableOpacity>
      </ThemedView>
      <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ThemedText type="title" style={styles.modalTitle}>Selecione o número de jogadores por time</ThemedText>
              <FlatList
                data={[3, 4, 5, 6, 7, 8, 9]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      // setJogadoresPorTime(item);
                      // setIsModalVisible(false);
                      handleSelectJogadores(item);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.toString()}
              />
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
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
  topModule: {
    flex: 0.23,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A291A',
    width:'100%',
  },
  botModule: {
    flex: 1,
    // width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    // paddingTop: 20,
    // paddingLeft: 20,
    backgroundColor: '#191A19',
  },
  botRow: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 20,
    paddingLeft: 20,
    backgroundColor: '#191A19',
    // backgroundColor: 'pink',
  },
  row: {
    flex: 1,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingTop: 20,
    // paddingLeft: 20,
    // backgroundColor: '#191A19',
    // backgroundColor: 'pink',
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
  selectButton: {
    backgroundColor: '#1A4D2E',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#1A4D2E',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  button2: {
    backgroundColor: '#1A4D2E',
    padding: 10,
    borderRadius: 15,
    marginLeft: 20,
    marginBottom: 20,
    alignSelf: 'center',
    fontSize: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  jogadoresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 350,
    padding: 20,
    backgroundColor: '#191A19',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#E8DFCA',
    fontSize: 20,
    marginBottom: 20,
  },
  modalItem: {
    padding: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalItemText: {
    color: '#E8DFCA',
    fontSize: 18,
  },
  modalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4E9F3D',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
