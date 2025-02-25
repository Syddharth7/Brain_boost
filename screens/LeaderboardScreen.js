import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from '../supabase';

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('scores')
        .select('user_id, score')
        .order('score', { ascending: false });

      if (data) {
        const usersData = await Promise.all(
          data.map(async (item) => {
            const { data: userData } = await supabase
              .from('users')
              .select('name')
              .eq('id', item.user_id)
              .single();
            return { name: userData.name, score: item.score };
          })
        );
        setLeaderboard(usersData);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <View>
      <Text>Leaderboard</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{item.name}: {item.score}</Text>
        )}
      />
    </View>
  );
};

export default LeaderboardScreen;
