
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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

  // const handleSortear = () => {
  //   console.log(teamData.team1);
  //   const nomesSorteados = sortearNomes(nomes, 5);
  //   setTeamData({
  //     ...teamData,
  //     team1: nomesSorteados
  //   });
  //   console.log('Nomes sorteados:', nomesSorteados);
  //   console.log('team1:', teamData.team1);
  //   // Aqui você pode fazer qualquer ação com os nomes sorteados, como mostrá-los na interface ou salvá-los em algum lugar.
  // };

  const sortear = async () => {
    setSorteio(!sorteio);
    await loadData();
  };

  const handleSortear = () => {
    // loadData();
    const quantidadeNomesAtivos = nomes.length;
    console.log(`Quantidade de nomes ativos: ${quantidadeNomesAtivos}`);
    const quantidadeTimes = Math.min(4, quantidadeNomesAtivos / 5); // Max 4 teams
    console.log('Quantidade de times: ', quantidadeTimes);
  
    // if (quantidadeTimes < 1) {
    //   console.error('Nomes ativos insuficientes para formar um time completo.');
    //   return;
    // }

    setTeamData({
      team1: [],
      team2: [],
      team3: [],
      team4: [],
    });
  
    let nomesRestantes = [...nomes];
  
    if (quantidadeTimes > 0) {
      const nomesSorteadosTeam1 = sortearNomes(nomesRestantes, 5);
      // setTeamData({
      //   ...teamData,
      //   team1: nomesSorteadosTeam1
      // });
      teamData.team1 = nomesSorteadosTeam1;
      nomesRestantes = nomesRestantes.filter(nome => !nomesSorteadosTeam1.includes(nome));
    }
  
    if (quantidadeTimes > 1) {
      const nomesSorteadosTeam2 = sortearNomes(nomesRestantes, 5);
      // setTeamData({
      //   ...teamData,
      //   team2: nomesSorteadosTeam2
      // });
      teamData.team2 = nomesSorteadosTeam2;
      nomesRestantes = nomesRestantes.filter(nome => !nomesSorteadosTeam2.includes(nome));
    }
  
    if (quantidadeTimes > 2) {
      const nomesSorteadosTeam3 = sortearNomes(nomesRestantes, 5);
      // setTeamData({
      //   ...teamData,
      //   team3: nomesSorteadosTeam3
      // });
      teamData.team3 = nomesSorteadosTeam3;
      nomesRestantes = nomesRestantes.filter(nome => !nomesSorteadosTeam3.includes(nome));
    }
  
    if (quantidadeTimes > 3) {
      const nomesSorteadosTeam4 = sortearNomes(nomesRestantes, 5);
      // setTeamData({
      //   ...teamData,
      //   team4: nomesSorteadosTeam4
      // });
      teamData.team4 = nomesSorteadosTeam4;
      nomesRestantes = nomesRestantes.filter(nome => !nomesSorteadosTeam4.includes(nome));
    }
  
    setTeamData({ ...teamData }); // Atualizar o state com as alterações
    // setNomes(nomesRestantes);
  
    console.log('Nomes sorteados para team1:', teamData.team1);
    console.log('Nomes sorteados para team2:', teamData.team2);
    console.log('Nomes sorteados para team3:', teamData.team3);
    console.log('Nomes sorteados para team4:', teamData.team4);

    nomesRestantes = [];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.topModule}>
        <ThemedText type="title" style={styles.title}>Sorteio</ThemedText>
      </ThemedView>
      <ThemedView style={styles.botModule}>
        <View style={styles.botRow}>
            <ShirtIcon name="shirt" 
              size={70}
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
    // flex: 1,
    // width: '100%',
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
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
  button: {
    backgroundColor: '#1A4D2E',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
