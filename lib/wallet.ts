import { createWalletClient, http, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';
import { createTransaction } from './supabase';

// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// USDC ABI (simplified for transfer function)
const USDC_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];

// Initialize wallet client
export function initializeWalletClient(privateKey: string) {
  return createWalletClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    account: privateKey,
  });
}

// Get wallet balance
export async function getWalletBalance(address: string) {
  try {
    const client = createWalletClient({
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    });
    
    const balance = await client.getBalance({ address: address as `0x${string}` });
    return formatEther(balance);
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return '0';
  }
}

// Get USDC balance
export async function getUSDCBalance(address: string) {
  try {
    const client = createWalletClient({
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    });
    
    const balance = await client.readContract({
      address: USDC_CONTRACT_ADDRESS as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'balanceOf',
      args: [address],
    });
    
    // USDC has 6 decimals
    return Number(balance) / 1_000_000;
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    return 0;
  }
}

// Send USDC
export async function sendUSDC(
  fromAddress: string,
  toAddress: string,
  amount: number,
  privateKey: string,
  transactionType: string,
  relatedEntityType?: string,
  relatedEntityId?: string
) {
  try {
    const client = initializeWalletClient(privateKey);
    
    // USDC has 6 decimals
    const amountInWei = BigInt(Math.floor(amount * 1_000_000));
    
    // Send transaction
    const hash = await client.writeContract({
      address: USDC_CONTRACT_ADDRESS as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'transfer',
      args: [toAddress, amountInWei],
    });
    
    // Record transaction in database
    const transaction = await createTransaction({
      transaction_hash: hash,
      from_address: fromAddress,
      to_address: toAddress,
      amount: amount,
      currency: 'USDC',
      transaction_type: transactionType,
      status: 'pending',
      related_entity_type: relatedEntityType,
      related_entity_id: relatedEntityId,
    });
    
    return {
      success: true,
      hash,
      transaction,
    };
  } catch (error) {
    console.error('Error sending USDC:', error);
    return {
      success: false,
      error,
    };
  }
}

// Check transaction status
export async function checkTransactionStatus(hash: string) {
  try {
    const client = createWalletClient({
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    });
    
    const receipt = await client.getTransactionReceipt({
      hash: hash as `0x${string}`,
    });
    
    return {
      success: receipt.status === 'success',
      receipt,
    };
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return {
      success: false,
      error,
    };
  }
}

// Update transaction status in database
export async function updateTransactionStatus(hash: string, status: 'pending' | 'completed' | 'failed') {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('transaction_hash', hash)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating transaction status:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return null;
  }
}

// Import supabase at the top to avoid reference error
import { supabase } from './supabase';

