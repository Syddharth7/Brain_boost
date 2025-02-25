import { supabase } from '../supabase'; // Ensure this is correctly imported

export const submitScores = async (userId, quizId, score) => {
  try {
    const { data, error } = await supabase.from('scores').insert([
      {
        user_id: userId,  // The user's unique ID
        quiz_id: quizId,  // The quiz that was taken
        score: score,     // The user's final score
      },
    ]);

    if (error) throw error;

    console.log('✅ Score saved successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error saving score:', err.message);
    return { success: false, error: err.message };
  }
};
