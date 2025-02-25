import { supabase } from '../supabase';

// Get all subjects
export const getSubjects = async () => {
  const { data, error } = await supabase.from('subjects').select('*').order('id');
  return { data, error };
};

// Get quizzes for a subject
export const getQuizzes = async (subjectId) => {
  const { data, error } = await supabase.from('quizzes').select('*').eq('subject_id', subjectId).order('id');
  return { data, error };
};

// Get quiz questions
export const getQuestions = async (quizId) => {
  const { data, error } = await supabase.from('questions').select('*').eq('quiz_id', quizId);
  return { data, error };
};

// Save user score
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


// Check if subject is unlocked
export const isSubjectUnlocked = async (userId, subjectId) => {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .eq('subject_id', subjectId - 1); // Check if the previous subject is completed
    return { unlocked: data.length > 0, error };
  };
  
  // Check if quiz is unlocked
  export const isQuizUnlocked = async (userId, quizId) => {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .eq('quiz_id', quizId - 1); // Check if the previous quiz is completed
    return { unlocked: data.length > 0, error };
  };
  
  export const getQuizScore = async (userId, quizId) => {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .eq('quiz_id', quizId)
      .single();
  
    if (error) {
      console.error('❌ Error fetching quiz score:', error);
      return { data: null, error };
    }
  
    return { data, error };
  };
  