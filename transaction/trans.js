window.onload = () => {
    let buyerPublicKey;
    let connection;
    const sellerPublicKey = new solanaWeb3.PublicKey('MCTLS8wbB3ztnWHutN1v6vmcG22dNx4x45JJkYBRzRF');

    const tokensPerSol = 1_000_000; // 1,000,000 tokens = 1 SOL

    // Ensure Solana Web3 library is loaded
    if (typeof solanaWeb3 === 'undefined') {
        console.error('❌ Solana Web3 library not loaded! Make sure to include @solana/web3.js in your HTML.');
        return;
    }

    // Define the connect button
    const connectButton = document.getElementById('connect-button');
    if (!connectButton) {
        console.error('❌ Connect button for Phantom wallet not found!');
        return;
    }

    // Define the buy button
    const buyButton = document.getElementById('buy-button');
    if (!buyButton) {
        console.warn('⚠️ Buy button not found');
    } else {
        // Disable the buy button by default
        buyButton.disabled = true;
        buyButton.classList.add('disabled-button');
    }

    // Connect to Phantom wallet
    const connectToWallet = async () => {
        if (!window.solana || !window.solana.isPhantom) {
            alert('❌ Phantom wallet not installed!');
            return;
        }

        try {
            const provider = window.solana;
            await provider.connect();
            console.log('✅ Connected');
            buyerPublicKey = provider.publicKey;

            const walletStatus = document.getElementById('wallet-status');
            walletStatus.textContent = `Connected to: ${buyerPublicKey.toString()}`;
            walletStatus.style.backgroundColor = 'green'; // Set background color to green
            walletStatus.style.color = 'white'; // Set text color to white
            walletStatus.style.padding = '10px 20px';
            walletStatus.style.borderRadius = '5px';
            walletStatus.style.position = 'fixed';
            walletStatus.style.top = '50%';
            walletStatus.style.left = '50%';
            walletStatus.style.transform = 'translate(-50%, -50%)';
            walletStatus.style.zIndex = '9999';

            // Hide the status after 2 seconds
            setTimeout(() => {
                walletStatus.style.display = 'none';
            }, 2000);

            connectButton.textContent = 'Connected';
            connectButton.classList.add('connected'); // Add new CSS class
            connectButton.classList.remove('btn-secondary'); // Remove old style if needed

            // Enable the buy button after successful connection
            if (buyButton) {
                buyButton.disabled = false;
                buyButton.classList.remove('disabled-button');
            }

            // Create connection to network using an alternative endpoint
            connection = new solanaWeb3.Connection("https://indulgent-stylish-spring.solana-mainnet.quiknode.pro/5914beaf73f1d5827a99c4787a245abf7e2d2050", 'confirmed');
        } catch (error) {
            console.error('❌ Error connecting to Phantom wallet:', error);
        }
    };

    // Process purchase transaction
    const processPurchase = async () => {
        if (!buyerPublicKey) {
            alert('❌ You must connect your wallet first');
            return;
        }

        try {
            if (!connection) {
                connection = new solanaWeb3.Connection("https://indulgent-stylish-spring.solana-mainnet.quiknode.pro/5914beaf73f1d5827a99c4787a245abf7e2d2050", 'confirmed');
            }

            // Get the latest blockhash
            const { blockhash } = await connection.getLatestBlockhash();

            // Read the number of tokens entered
            const tokens = parseInt(tokensInput.value, 10);
            if (isNaN(tokens) || tokens < 1000) {
                alert('❌ Invalid token value entered!');
                return;
            }

            // Convert tokens to SOL based on the rule (1,000,000 tokens = 1 SOL)
            const solValue = tokens / tokensPerSol;

            // Convert SOL to lamports
            const lamports = solValue * 1_000_000_000;

            // Create transfer transaction
            const transaction = new solanaWeb3.Transaction({
                recentBlockhash: blockhash,
                feePayer: buyerPublicKey,
            }).add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: buyerPublicKey,
                    toPubkey: sellerPublicKey,
                    lamports: lamports, // Transfer the value in lamports
                })
            );

            // Sign the transaction
            const provider = window.solana;
            const signedTransaction = await provider.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            console.log('✅ Transaction successful! Signature:', signature);
            document.getElementById('wallet-status').textContent = `Transaction successful! Signature: ${signature}`;
        } catch (error) {
            console.error('❌ Error during the transaction:', error);
            document.getElementById('transaction-status').textContent = `❌ Error: ${error.message}`;
        }
    };

    // Update SOL equivalent when entering token amount
    const tokensInput = document.getElementById('tokens');
    const solEquivalent = document.getElementById('sol-equivalent');

    tokensInput.addEventListener('input', () => {
        const tokens = parseInt(tokensInput.value, 10);

        if (!isNaN(tokens) && tokens >= 1000) {
            // Convert tokens to SOL using the formula 1,000,000 tokens = 1 SOL
            const solValue = tokens / tokensPerSol;
            solEquivalent.textContent = `Equivalent in SOL: ${(solValue).toFixed(4)} SOL`;  // Display value in SOL
        } else {
            solEquivalent.textContent = `Equivalent in SOL: 0.00 SOL`;
        }
    });

    // Attach functions to buttons
    connectButton.onclick = connectToWallet;

    if (buyButton) {
        buyButton.onclick = processPurchase;
    }
};
