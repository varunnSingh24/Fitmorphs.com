tailwind.config = {
    theme: {
        extend: {
            colors: {
                gold: { deep: '#b8860b', mid: '#d4a017', bright: '#f0c040', light: '#f0d060', pale: '#faf0d0' },
                dark: { DEFAULT: '#0f0f0c', deep: '#0c0a06', card: '#1a1610', surface: '#221e16' },
                charcoal: '#1a1a18', cream: '#f5efe3', 'off-white': '#fafaf7', ivory: '#fdfbf6',
            },
            fontFamily: { 
                display: ['Playfair Display', 'serif'], 
                body: ['DM Sans', 'sans-serif'], 
                accent: ['Instrument Serif', 'serif'] 
            },
        },
    },
};
