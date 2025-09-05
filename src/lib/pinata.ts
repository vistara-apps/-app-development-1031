import axios from 'axios';
import type { ShareableCard } from '@/types';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const PINATA_BASE_URL = 'https://api.pinata.cloud';

/**
 * Upload JSON data to IPFS via Pinata
 */
export async function uploadToIPFS(data: any, name: string): Promise<string> {
  try {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      throw new Error('Pinata API keys not configured');
    }

    const response = await axios.post(
      `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
      {
        pinataContent: data,
        pinataMetadata: {
          name: name,
          keyvalues: {
            app: 'legalshield-ai',
            type: 'incident-card',
            timestamp: new Date().toISOString(),
          },
        },
        pinataOptions: {
          cidVersion: 1,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  } catch (error) {
    console.error('Pinata upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Upload file to IPFS via Pinata
 */
export async function uploadFileToIPFS(file: File, name: string): Promise<string> {
  try {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      throw new Error('Pinata API keys not configured');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pinataMetadata', JSON.stringify({
      name: name,
      keyvalues: {
        app: 'legalshield-ai',
        type: 'recording',
        timestamp: new Date().toISOString(),
      },
    }));
    formData.append('pinataOptions', JSON.stringify({
      cidVersion: 1,
    }));

    const response = await axios.post(
      `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  } catch (error) {
    console.error('Pinata file upload error:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

/**
 * Create and upload shareable incident card to IPFS
 */
export async function createShareableCard(cardData: Omit<ShareableCard, 'id' | 'ipfsUrl'>): Promise<ShareableCard> {
  try {
    const card: ShareableCard = {
      ...cardData,
      id: crypto.randomUUID(),
      ipfsUrl: '',
    };

    // Upload card data to IPFS
    const ipfsUrl = await uploadToIPFS(card, `incident-card-${card.id}`);
    card.ipfsUrl = ipfsUrl;

    return card;
  } catch (error) {
    console.error('Error creating shareable card:', error);
    throw new Error('Failed to create shareable card');
  }
}

/**
 * Get pinned files from Pinata
 */
export async function getPinnedFiles(): Promise<any[]> {
  try {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      throw new Error('Pinata API keys not configured');
    }

    const response = await axios.get(
      `${PINATA_BASE_URL}/data/pinList?status=pinned&metadata[keyvalues][app]=legalshield-ai`,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );

    return response.data.rows || [];
  } catch (error) {
    console.error('Error fetching pinned files:', error);
    throw new Error('Failed to fetch pinned files');
  }
}

/**
 * Unpin file from IPFS
 */
export async function unpinFile(ipfsHash: string): Promise<void> {
  try {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      throw new Error('Pinata API keys not configured');
    }

    await axios.delete(
      `${PINATA_BASE_URL}/pinning/unpin/${ipfsHash}`,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );
  } catch (error) {
    console.error('Error unpinning file:', error);
    throw new Error('Failed to unpin file');
  }
}

/**
 * Health check for Pinata API
 */
export async function healthCheckPinata(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      return { success: false, error: 'API keys not configured' };
    }

    const response = await axios.get(
      `${PINATA_BASE_URL}/data/testAuthentication`,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );

    return { success: response.data.message === 'Congratulations! You are communicating with the Pinata API!' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
