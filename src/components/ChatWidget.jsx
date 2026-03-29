import { useState } from 'react'
import ChatWindow from './ChatWindow'

export default function ChatWidget() {
    const [open, setOpen] = useState(false)

    return (
        <div className="chat-launcher">
            {open && <ChatWindow onClose={() => setOpen(false)} />}
            <button
                className="launcher-btn"
                onClick={() => setOpen(o => !o)}
                title="Chat with Glowere"
                aria-label="Open Glowere chatbot"
            >
                {open ? (
                    /* Close icon */
                    <svg viewBox="0 0 24 24">
                        <path stroke="#fff" strokeWidth="2.5" strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    /* Chat bubble icon */
                    <svg viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                    </svg>
                )}
            </button>
            {!open && <span className="launcher-pulse" />}
        </div>
    )
}
