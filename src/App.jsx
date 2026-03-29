import './index.css'
import ChatWidget from './components/ChatWidget'

function App() {
  return (
    <>
      {/* 
        This is the standalone chatbot demo page.
        When embedded in Shopify, only ChatWidget is injected — not this App wrapper.
      */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #0f2117 0%, #060e08 100%)',
        fontFamily: 'Inter, sans-serif',
        color: '#f0f7f2',
        textAlign: 'center',
        padding: '40px 20px',
      }}>
        <div style={{ marginBottom: 12, fontSize: 52 }}>🌿</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10, color: '#4ecb75' }}>
          Glowere Chatbot
        </h1>
        <p style={{ color: 'rgba(240,247,242,0.6)', maxWidth: 380, lineHeight: 1.6 }}>
          Your AI skincare assistant. Click the chat button in the bottom-right corner to start!
        </p>
        <div style={{ marginTop: 32, fontSize: 13, color: 'rgba(240,247,242,0.35)' }}>
          Powered by Glowere · Pakistan's skincare brand
        </div>
      </div>
      <ChatWidget />
    </>
  )
}

export default App
