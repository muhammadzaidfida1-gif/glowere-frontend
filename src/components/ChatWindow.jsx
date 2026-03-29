import { useState, useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import QuickReplies from './QuickReplies'
import ImageUpload from './ImageUpload'
import { sendChat, trackOrder } from '../services/api'

const SESSION_ID = 'glowere_' + Math.random().toString(36).slice(2)

function WhatsAppBtn({ url }) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="whatsapp-cta">
            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            WhatsApp Our Team
        </a>
    )
}

function ProductCard({ product }) {
    return (
        <div className="product-card">
            <div className="product-card-name">🌿 {product.name}</div>
            {product.tagline && <div className="product-card-tagline">{product.tagline}</div>}
            {product.usage && <div className="product-card-usage">📌 {product.usage}</div>}
            {product.url && (
                <div style={{ marginTop: '10px' }}>
                    <a href={product.url} target="_blank" rel="noopener noreferrer" className="product-card-link">
                        View Product 🛍️
                    </a>
                </div>
            )}
        </div>
    )
}

function TypingIndicator() {
    return (
        <div className="msg-row bot">
            <div className="msg-avatar">🌿</div>
            <div className="msg-bubble" style={{ background: 'var(--bubble-bot)', padding: '10px 14px' }}>
                <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                </div>
            </div>
        </div>
    )
}

export default function ChatWindow({ onClose }) {
    const [messages, setMessages] = useState([])
    const [currentButtons, setCurrentButtons] = useState([])
    const [showImageUpload, setShowImageUpload] = useState(false)
    const [showWhatsapp, setShowWhatsapp] = useState(false)
    const [whatsappUrl, setWhatsappUrl] = useState('')
    const [currentProducts, setCurrentProducts] = useState([])
    const [isTyping, setIsTyping] = useState(false)
    const [inputText, setInputText] = useState('')
    const [awaitingOrderId, setAwaitingOrderId] = useState(false)
    const [orderInput, setOrderInput] = useState('')
    const bottomRef = useRef(null)

    // Load welcome message on mount
    useEffect(() => {
        callBot('welcome', null)
    }, [])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const addMsg = (role, text) => {
        setMessages(prev => [...prev, { id: Date.now() + Math.random(), role, text }])
    }

    const callBot = async (action, userLabel = null) => {
        if (userLabel) addMsg('user', userLabel)
        setCurrentButtons([])
        setShowImageUpload(false)
        setShowWhatsapp(false)
        setCurrentProducts([])
        setAwaitingOrderId(false)
        setIsTyping(true)

        try {
            const resp = await sendChat(SESSION_ID, action, null)
            setIsTyping(false)
            addMsg('bot', resp.reply)
            setCurrentButtons(resp.buttons || [])
            setShowImageUpload(resp.show_image_upload || false)
            setShowWhatsapp(resp.show_whatsapp || false)
            setWhatsappUrl(resp.whatsapp_url || '')
            setCurrentProducts(resp.products || [])
            if (action === 'track_order') setAwaitingOrderId(true)
        } catch {
            setIsTyping(false)
            addMsg('bot', '😕 Something went wrong. Please try again or WhatsApp us at wa.me/923048201937')
        }
    }

    const callBotText = async (text) => {
        if (!text.trim()) return
        addMsg('user', text)
        setInputText('')
        setCurrentButtons([])
        setShowImageUpload(false)
        setShowWhatsapp(false)
        setCurrentProducts([])
        setIsTyping(true)
        try {
            const resp = await sendChat(SESSION_ID, null, text)
            setIsTyping(false)
            addMsg('bot', resp.reply)
            setCurrentButtons(resp.buttons || [])
            setShowWhatsapp(resp.show_whatsapp || false)
            setWhatsappUrl(resp.whatsapp_url || '')
        } catch {
            setIsTyping(false)
            addMsg('bot', '😕 Something went wrong. Please try again.')
        }
    }

    const handleButtonAction = (action, label) => {
        callBot(action, label)
    }

    const handleOrderSubmit = async () => {
        if (!orderInput.trim()) return
        const orderId = orderInput.replace('#', '').trim()
        addMsg('user', `Order #${orderId}`)
        setOrderInput('')
        setAwaitingOrderId(false)
        setCurrentButtons([])
        setIsTyping(true)
        try {
            const resp = await trackOrder(orderId)
            setIsTyping(false)
            addMsg('bot', resp.reply)
            setCurrentButtons([
                { label: '🔙 Back to Menu', action: 'welcome' },
                { label: '💬 Talk to Human', action: 'human_support' },
            ])
        } catch {
            setIsTyping(false)
            addMsg('bot', '😕 Could not fetch order. WhatsApp us at wa.me/923048201937')
        }
    }

    const handleImageResult = (result) => {
        setShowImageUpload(false)
        if (result.error) {
            addMsg('bot', `❌ ${result.error}`)
            return
        }
        addMsg('bot', result.reply + (result.demo_mode ? '\n\n⚠️ *Demo mode* — upload a real model checkpoint for production accuracy.' : ''))
        setCurrentProducts(
            result.products?.map(name => ({ name, tagline: '', usage: '' })) || []
        )
        addMsg('bot', `🌿 *Routine*: ${result.routine}\n\n💬 Let me know if you want help placing the order or choosing the best option for your skin.`)
        setCurrentButtons([
            { label: '🛒 Place Order Help', action: 'order_help' },
            { label: '💬 Talk to Human', action: 'human_support' },
            { label: '🔙 Back to Menu', action: 'welcome' },
        ])
    }

    return (
        <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-header-avatar">🌿</div>
                <div className="chat-header-info">
                    <div className="chat-header-name">Glowere Assistant</div>
                    <div className="chat-header-status">
                        <span className="status-dot" /> Online
                    </div>
                </div>
                <button className="close-btn" onClick={onClose} title="Close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="messages-area">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} msg={msg} />
                ))}
                {isTyping && <TypingIndicator />}

                {/* Product cards below last bot message */}
                {!isTyping && currentProducts.length > 0 && (
                    <div className="product-cards">
                        {currentProducts.map((p, i) => <ProductCard key={i} product={p} />)}
                    </div>
                )}

                {/* Image upload */}
                {!isTyping && showImageUpload && (
                    <ImageUpload onResult={handleImageResult} />
                )}

                {/* WhatsApp CTA */}
                {!isTyping && showWhatsapp && whatsappUrl && (
                    <WhatsAppBtn url={whatsappUrl} />
                )}

                {/* Order ID inline input */}
                {!isTyping && awaitingOrderId && (
                    <div className="order-input-row">
                        <input
                            className="order-input"
                            placeholder="e.g. 1001"
                            value={orderInput}
                            onChange={e => setOrderInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleOrderSubmit()}
                        />
                        <button className="order-submit-btn" onClick={handleOrderSubmit}>Track</button>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            {!isTyping && currentButtons.length > 0 && (
                <QuickReplies buttons={currentButtons} onAction={handleButtonAction} />
            )}

            {/* Text input */}
            <div className="input-area">
                <input
                    className="text-input"
                    placeholder="Type a message or question..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && callBotText(inputText)}
                />
                <button className="send-btn" onClick={() => callBotText(inputText)}>
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </button>
            </div>
        </div>
    )
}
