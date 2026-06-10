export type CryptoNetwork = 'ethereum' | 'bsc' | 'polygon' | 'bitcoin';

export interface VerifyResult {
  isValid: boolean;
  isPending: boolean;
  reason?: 'not_found' | 'wrong_address' | 'too_old' | 'error' | 'success';
}

/**
 * Verifies a crypto transaction using public RPCs.
 * Returns isValid: true if the transaction was found and sent to the expected address.
 * If there's a rate limit or network error, returns isPending: true so we don't punish the user.
 */
export async function verifyCryptoTransaction(
  txid: string,
  network: CryptoNetwork,
  expectedAddress: string
): Promise<VerifyResult> {
  // Clean inputs
  const cleanTxid = txid.trim();
  const cleanExpectedAddress = expectedAddress.trim().toLowerCase();

  // Basic validation
  if (!cleanTxid || cleanTxid.length < 10) {
    return { isValid: false, isPending: false, reason: 'not_found' };
  }

  try {
    // ── BITCOIN ──
    if (network === 'bitcoin') {
      const res = await fetch(`https://blockstream.info/api/tx/${cleanTxid}`);
      
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.log(`[ZIVOX] API Response for bitcoin (Error ${res.status}):`, errText);
        
        if (res.status === 404 || res.status === 400) {
          // Transaction not found or invalid format
          return { isValid: false, isPending: false, reason: 'not_found' };
        }
        // API rate limit or server error, don't penalize user
        return { isValid: false, isPending: true };
      }
      const data = await res.json();
      console.log(`[ZIVOX] API Response for ${network}:`, data);
      
      // Check outputs
      const hasOutput = data.vout?.some((out: any) => 
        out.scriptpubkey_address?.toLowerCase() === cleanExpectedAddress
      );
      
      if (!hasOutput) return { isValid: false, isPending: false, reason: 'wrong_address' };
      
      // Check timestamp (within last 31 days)
      const THIRTY_ONE_DAYS_SEC = 31 * 24 * 60 * 60;
      if (data.status?.confirmed && data.status?.block_time) {
        const nowSec = Math.floor(Date.now() / 1000);
        if (nowSec - data.status.block_time > THIRTY_ONE_DAYS_SEC) {
          // Transaction is too old
          return { isValid: false, isPending: false, reason: 'too_old' };
        }
      }
      
      return { isValid: true, isPending: false, reason: 'success' };
    }

    // ── EVM CHAINS (ETH, BSC, POLYGON) ──
    let rpcUrl = '';
    switch (network) {
      case 'ethereum': rpcUrl = 'https://ethereum-rpc.publicnode.com'; break;
      case 'bsc': rpcUrl = 'https://bsc-dataseed.binance.org'; break;
      case 'polygon': rpcUrl = 'https://polygon.drpc.org'; break;
      default: return { isValid: false, isPending: false, reason: 'not_found' };
    }

    // Ensure EVM txid has 0x prefix
    const evmTxid = cleanTxid.startsWith('0x') ? cleanTxid : `0x${cleanTxid}`;

    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionByHash',
        params: [evmTxid]
      })
    });

    if (!res.ok) {
       const errText = await res.text().catch(() => '');
       console.log(`[ZIVOX] API Response for ${network} (Error ${res.status}):`, errText);
       
       if (res.status === 400 || res.status === 404) {
         // User sent an invalid hex string or malformed request
         return { isValid: false, isPending: false, reason: 'not_found' };
       }
       // Other RPC errors (500, 429), treat as pending
       return { isValid: false, isPending: true };
    }

    const data = await res.json();
    console.log(`[ZIVOX] API Response for ${network}:`, data);
    
    if (data.error) {
      // e.g. "invalid argument 0: cannot unmarshal hex string"
      return { isValid: false, isPending: false, reason: 'not_found' };
    }
    
    if (!data.result) {
      // Transaction not found (or extremely fresh). We return false.
      // If it's a real tx, it should appear within seconds. If they typed garbage, it's false.
      return { isValid: false, isPending: false, reason: 'not_found' };
    }

    const tx = data.result;
    let isExpectedRecipient = false;
    
    // Case 1: Native Transfer (ETH, BNB, MATIC)
    if (tx.to?.toLowerCase() === cleanExpectedAddress) {
      isExpectedRecipient = true;
    } else {
      // Case 2: ERC20/BEP20 Token Transfer (USDT, USDC)
      const inputData = tx.input?.toLowerCase() || '';
      const cleanAddressWithoutPrefix = cleanExpectedAddress.replace(/^0x/, '');
      if (inputData.includes(cleanAddressWithoutPrefix)) {
        isExpectedRecipient = true;
      }
    }
    
    if (!isExpectedRecipient) {
      return { isValid: false, isPending: false, reason: 'wrong_address' };
    }

    // Now check the timestamp of the block
    if (tx.blockNumber) {
      const blockRes = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'eth_getBlockByNumber',
          params: [tx.blockNumber, false]
        })
      });
      if (blockRes.ok) {
        const blockData = await blockRes.json();
        if (blockData.result?.timestamp) {
          const blockTimestamp = parseInt(blockData.result.timestamp, 16);
          const nowSec = Math.floor(Date.now() / 1000);
          const THIRTY_ONE_DAYS_SEC = 31 * 24 * 60 * 60;
          if (nowSec - blockTimestamp > THIRTY_ONE_DAYS_SEC) {
            // Transaction is too old
            return { isValid: false, isPending: false, reason: 'too_old' };
          }
        }
      }
    }

    return { isValid: true, isPending: false, reason: 'success' };

  } catch (error) {
    console.warn(`[ZIVOX] Network error verifying tx on ${network}. Treating as pending.`);
    // On fetch error (e.g. CORS, network down), don't punish the user
    return { isValid: false, isPending: true };
  }
}
