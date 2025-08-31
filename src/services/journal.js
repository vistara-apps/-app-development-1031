import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { transcribeAudio } from './openai';

// Save voice journal
export const saveVoiceJournal = async (userId, audioBlob) => {
  try {
    // Upload audio to Firebase Storage
    const audioRef = ref(storage, `journals/${userId}/${Date.now()}.webm`);
    await uploadBytes(audioRef, audioBlob);
    
    // Get download URL
    const audioUrl = await getDownloadURL(audioRef);
    
    // Transcribe audio using OpenAI
    const transcription = await transcribeAudio(audioBlob);
    
    // Save journal entry to Firestore
    const journalRef = collection(db, 'journals');
    
    const docRef = await addDoc(journalRef, {
      userId,
      audioUrl,
      text: transcription.text,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      audioUrl,
      text: transcription.text,
      timestamp: { toDate: () => new Date() }
    };
  } catch (error) {
    console.error("Error saving voice journal:", error);
    throw error;
  }
};

// Get journal history
export const getJournalHistory = async (userId, limit = 10) => {
  try {
    const journalRef = collection(db, 'journals');
    const q = query(
      journalRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    
    const journals = [];
    querySnapshot.forEach((doc) => {
      journals.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return journals;
  } catch (error) {
    console.error("Error getting journal history:", error);
    throw error;
  }
};

