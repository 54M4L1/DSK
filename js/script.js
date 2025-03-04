window.onload = () => {
    let buyerPublicKey;
    let connection;

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
            if (walletStatus) {
                walletStatus.innerHTML = `Connected to:<br>• ${buyerPublicKey.toString()}<br><br>• Your wallet address has been saved in our databases.<br><br>• Once you have $DSK in your wallet:<br><br>• you will earn 10 Points = 0.001 DSK for every hour of activity on our website, It will be sent to your wallet every weekend<br>• and 0.1% of your DSK a Day if you train or build using our free JS packages.`;
                walletStatus.style.display = 'block';
                walletStatus.style.backgroundColor = 'green';
                walletStatus.style.color = 'white';
                walletStatus.style.padding = '10px 20px';
                walletStatus.style.borderRadius = '5px';
                walletStatus.style.position = 'fixed';
                walletStatus.style.top = '50%';
                walletStatus.style.left = '50%';
                walletStatus.style.transform = 'translate(-50%, -50%)';
                walletStatus.style.zIndex = '9999';                  
                walletStatus.style.fontFamily = 'Poppins, sans-serif'; 
                
  setTimeout(function() {
        walletStatus.style.display = 'none';
    }, 20000); // إخفاء العنصر بعد 5 ثوانٍ

    // إخفاء العنصر عند الضغط خارج الصندوق
    document.addEventListener('click', function(event) {
        if (!walletStatus.contains(event.target)) {
            walletStatus.style.display = 'none';
        }
    });
}

            connectButton.textContent = 'Connected';
            connectButton.classList.add('connected');
            connectButton.classList.remove('btn-secondary');

            // Create connection to network using an alternative endpoint
            connection = new solanaWeb3.Connection("https://indulgent-stylish-spring.solana-mainnet.quiknode.pro/5914beaf73f1d5827a99c4787a245abf7e2d2050", 'confirmed');
        } catch (error) {
            console.error('❌ Error connecting to Phantom wallet:', error);
        }
    };
let previousHeight = window.innerHeight;

function updateVh() {
    let currentHeight = window.innerHeight;

    // إذا كان الفرق كبيرًا، فالمشكلة بسبب لوحة المفاتيح
    let isKeyboardOpen = previousHeight - currentHeight > 150; // 150px هو متوسط ارتفاع شريط الأدوات

    if (!isKeyboardOpen) {
        let vh = currentHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}rem`);
    }

    previousHeight = currentHeight;
}

// تحديث `vh` عند تغيير حجم الشاشة
window.addEventListener('resize', updateVh);
updateVh();



    // Attach function to connect button
    connectButton.onclick = connectToWallet;
};
