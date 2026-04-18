"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Send, Loader2, Hash, Lock, Phone, Video, Mic, MicOff, VideoOff, X } from "lucide-react";

const CHANNELS = [
    { id: "general", label: "general", emoji: "#" },
    { id: "iot-projects", label: "iot-projects", emoji: "#" },
    { id: "announcements", label: "announcements", emoji: "#" },
    { id: "off-topic", label: "off-topic", emoji: "#" },
];

interface Msg { _id?: string; user: { _id?: string; name: string; avatar?: string; role?: string }; content: string; createdAt: string; }

export default function MeetingPage() {
    const { user, token, isMember } = useAuth();
    const [channel, setChannel] = useState("general");
    const [messages, setMessages] = useState<Msg[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [socketReady, setSocketReady] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    // Call state
    const [inCall, setInCall] = useState(false);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [callWith, setCallWith] = useState<string | null>(null);
    const [incomingCall, setIncomingCall] = useState<string | null>(null);
    
    // WebRTC refs
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    // Load history when channel changes
    useEffect(() => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        api.getMessages(channel)
            .then(d => setMessages(d.messages))
            .catch(() => setMessages([]))
            .finally(() => setLoading(false));
    }, [channel, user]);

    // Connect socket
    useEffect(() => {
        if (!token || !user) return;
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
            auth: { token }
        });
        socketRef.current = socket;
        socket.on('connect', () => { setSocketReady(true); socket.emit('join_channel', channel); });
        socket.on('receive_message', (msg: Msg) => {
            setMessages(prev => [...prev, msg]);
        });

        // Call signaling
        socket.on('incoming_call', (data: { from: string; fromName: string }) => {
            setIncomingCall(data.from);
        });

        socket.on('call_accepted', async (data: { from: string }) => {
            setCallWith(data.from);
            setInCall(true);
            if (peerConnectionRef.current) {
                const offer = await peerConnectionRef.current.createOffer();
                await peerConnectionRef.current.setLocalDescription(offer);
                socket.emit('offer', { to: data.from, offer });
            }
        });

        socket.on('offer', async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                socket.emit('answer', { to: data.from, answer });
            }
        });

        socket.on('answer', async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        });

        socket.on('ice_candidate', async (data: { from: string; candidate: RTCIceCandidateInit }) => {
            if (peerConnectionRef.current && data.candidate) {
                try {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                } catch (e) { console.log('ICE error:', e); }
            }
        });

        socket.on('call_ended', () => {
            endCall();
        });

        socket.on('disconnect', () => setSocketReady(false));
        return () => { socket.disconnect(); };
    }, [token, user, channel]);

    // Start call
    const startCall = async (userId: string) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const peerConnection = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }]
            });
            peerConnectionRef.current = peerConnection;

            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

            peerConnection.ontrack = (event) => {
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
            };

            peerConnection.onicecandidate = (event) => {
                if (event.candidate && socketRef.current) {
                    socketRef.current.emit('ice_candidate', { to: userId, candidate: event.candidate });
                }
            };

            setCallWith(userId);
            socketRef.current?.emit('call_user', { to: userId, fromName: user?.name });
        } catch (err) {
            console.error('Error accessing media:', err);
            alert('Could not access camera/microphone');
        }
    };

    // End call
    const endCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        setInCall(false);
        setCallWith(null);
        setIncomingCall(null);
        socketRef.current?.emit('end_call', { to: callWith });
    };

    // Accept incoming call
    const acceptCall = async () => {
        if (!incomingCall) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const peerConnection = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }]
            });
            peerConnectionRef.current = peerConnection;

            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

            peerConnection.ontrack = (event) => {
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
            };

            peerConnection.onicecandidate = (event) => {
                if (event.candidate && socketRef.current) {
                    socketRef.current.emit('ice_candidate', { to: incomingCall, candidate: event.candidate });
                }
            };

            setInCall(true);
            socketRef.current?.emit('accept_call', { to: incomingCall });
        } catch (err) {
            console.error('Error accepting call:', err);
        }
    };

    // Toggle audio
    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTracks = localStreamRef.current.getAudioTracks();
            audioTracks.forEach(track => track.enabled = !track.enabled);
            setIsAudioOn(!isAudioOn);
        }
    };

    // Toggle video
    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTracks = localStreamRef.current.getVideoTracks();
            videoTracks.forEach(track => track.enabled = !track.enabled);
            setIsVideoOn(!isVideoOn);
        }
    };

    // Re-join when channel changes
    useEffect(() => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('join_channel', channel);
        }
    }, [channel]);

    // Scroll to bottom
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const send = () => {
        if (!input.trim() || !socketRef.current || !user) return;
        socketRef.current.emit('send_message', { channel, content: input.trim() });
        setInput("");
    };

    const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

    if (!user) return (
        <main className="flex-1 flex items-center justify-center text-center px-6">
            <div className="glass-panel p-10 rounded-2xl max-w-md">
                <Lock className="text-accent mx-auto mb-3" size={32} />
                <h2 className="font-display font-bold text-xl text-primary mb-2">Sign In Required</h2>
                <p className="text-secondary text-sm">Please sign in to access the meeting room.</p>
            </div>
        </main>
    );

    if (!isMember) return (
        <main className="flex-1 flex items-center justify-center text-center px-6">
            <div className="glass-panel p-10 rounded-2xl max-w-md">
                <Lock className="text-accent mx-auto mb-3" size={32} />
                <h2 className="font-display font-bold text-xl text-primary mb-2">Members Only</h2>
                <p className="text-secondary text-sm mb-4">You must be an accepted member to access the meeting room.</p>
                <a href="/recruitment" className="inline-block px-6 py-2.5 rounded-xl font-bold text-dark-900 bg-accent hover:shadow-[0_0_15px_rgba(200,241,53,0.5)] transition-all">
                    Apply to Join
                </a>
            </div>
        </main>
    );

    return (
        <main className="flex overflow-hidden w-full fixed top-20 left-0 right-0 bottom-0 z-40">
            {/* Call Modal */}
            {inCall && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    {/* Video Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                        {/* Local Video */}
                        <div className="relative bg-black rounded-xl overflow-hidden">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-4 text-white text-sm font-bold bg-black/50 px-3 py-1 rounded">
                                {user?.name} (You)
                            </div>
                        </div>

                        {/* Remote Video */}
                        <div className="relative bg-black rounded-xl overflow-hidden">
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-4 text-white text-sm font-bold bg-black/50 px-3 py-1 rounded">
                                {callWith}
                            </div>
                        </div>
                    </div>

                    {/* Call Controls */}
                    <div className="bg-black/80 px-6 py-4 flex items-center justify-center gap-4">
                        <button
                            onClick={toggleAudio}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                isAudioOn ? 'bg-accent text-black' : 'bg-red-500 text-white'
                            }`}
                            title={isAudioOn ? 'Mute' : 'Unmute'}
                        >
                            {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
                        </button>

                        <button
                            onClick={toggleVideo}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                isVideoOn ? 'bg-accent text-black' : 'bg-red-500 text-white'
                            }`}
                            title={isVideoOn ? 'Turn off video' : 'Turn on video'}
                        >
                            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                        </button>

                        <button
                            onClick={endCall}
                            className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                            title="End call"
                        >
                            <Phone size={20} className="rotate-135" />
                        </button>
                    </div>
                </div>
            )}

            {/* Incoming Call Notification */}
            {incomingCall && !inCall && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="glass-panel rounded-2xl p-8 max-w-sm text-center">
                        <h2 className="font-display font-bold text-2xl text-primary mb-2">Incoming Call</h2>
                        <p className="text-secondary mb-6">from <span className="text-accent font-bold">{incomingCall}</span></p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={acceptCall}
                                className="px-6 py-3 rounded-full bg-accent text-black font-bold flex items-center gap-2 hover:bg-accent/90 transition-colors"
                            >
                                <Phone size={18} /> Accept
                            </button>
                            <button
                                onClick={() => {
                                    setIncomingCall(null);
                                    socketRef.current?.emit('reject_call', { to: incomingCall });
                                }}
                                className="px-6 py-3 rounded-full bg-red-500 text-white font-bold flex items-center gap-2 hover:bg-red-600 transition-colors"
                            >
                                <X size={18} /> Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Sidebar */}
            <aside className="w-56 flex-shrink-0 flex flex-col glass-panel rounded-none border-r" style={{ borderColor: 'var(--surface-border)' }}>
                <div className="px-4 py-4">
                    <p className="font-display font-bold text-sm text-primary">IoT4ALL</p>
                    <p className="text-xs text-muted mt-0.5">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${socketReady ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        {socketReady ? 'Connected' : 'Connecting...'}
                    </p>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <p className="text-xs text-muted uppercase tracking-widest px-4 py-2">Channels</p>
                    {CHANNELS.map(ch => (
                        <button key={ch.id} onClick={() => setChannel(ch.id)} className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-body rounded-lg mx-2 transition-colors ${channel === ch.id ? 'bg-accent/10 text-accent font-bold' : 'text-secondary hover:text-primary hover:bg-accent/5'}`} style={{ width: 'calc(100% - 1rem)' }}>
                            <Hash size={14} /> {ch.label}
                        </button>
                    ))}
                </div>
                {/* User info */}
                <div className="px-4 py-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                        {user.name[0]}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-primary truncate">{user.name}</p>
                        <p className="text-xs text-muted truncate">{user.role}</p>
                    </div>
                </div>
            </aside>

            {/* Chat area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--surface-border)', background: 'var(--surface)' }}>
                    <div className="flex items-center gap-2">
                        <Hash size={18} className="text-muted" />
                        <span className="font-display font-bold text-primary">{channel}</span>
                    </div>
                    <button
                        onClick={() => startCall(user?.id || 'public')}
                        disabled={inCall}
                        className="w-10 h-10 rounded-full bg-accent/20 text-accent hover:bg-accent/30 disabled:opacity-50 flex items-center justify-center transition-colors"
                        title="Start video call"
                    >
                        <Video size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                    {loading && <div className="flex items-center justify-center py-10"><Loader2 className="text-accent animate-spin" size={24} /></div>}
                    {!loading && messages.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-muted text-sm">No messages yet — be the first to say something!</div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={msg._id || i} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0 mt-0.5">
                                {msg.user?.avatar ? <img src={msg.user.avatar} className="w-full h-full object-cover rounded-full" /> : msg.user?.name?.[0] || '?'}
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-bold text-primary">{msg.user?.name}</span>
                                    {msg.user?.role && <span className="text-xs text-accent/70">{msg.user.role}</span>}
                                    <span className="text-xs text-muted">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-sm text-secondary mt-0.5 leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-6 py-4">
                    <div className="flex items-center gap-3 glass-panel rounded-xl px-4 py-2">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder={`Message #${channel}`}
                            className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted outline-none font-body"
                        />
                        <button onClick={send} disabled={!input.trim()} className="text-accent disabled:opacity-30 hover:text-white transition-colors">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
