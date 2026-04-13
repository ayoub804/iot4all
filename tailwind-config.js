tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { display: ['Syne','sans-serif'], body: ['DM Sans','sans-serif'] },
      colors: {
        accent: '#C8F135',
        dark: { 900:'#0A0A0A', 800:'#111111', 700:'#1A1A1A', 600:'#222222', 500:'#2E2E2E' },
        light: { 50:'#FAFAFA', 100:'#F5F5F5', 200:'#EBEBEB', 300:'#D9D9D9' }
      },
      animation: {
        'fade-up': 'fadeUp .6s ease forwards',
        'fade-in': 'fadeIn .4s ease forwards',
        'slide-right': 'slideRight .5s ease forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'car-move': 'carMove 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:{ '0%':{opacity:0,transform:'translateY(24px)'},'100%':{opacity:1,transform:'translateY(0)'} },
        fadeIn:{ '0%':{opacity:0},'100%':{opacity:1} },
        slideRight:{ '0%':{opacity:0,transform:'translateX(-20px)'},'100%':{opacity:1,transform:'translateX(0)'} },
        pulseDot:{ '0%,100%':{transform:'scale(1)',opacity:1},'50%':{transform:'scale(1.5)',opacity:.5} },
        carMove:{ '0%,100%':{transform:'translateX(0)'},'50%':{transform:'translateX(8px)'} },
      }
    }
  }
}