"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Send, Loader2, Hash, Lock, Phone, Video, Mic, MicOff, VideoOff, X, Paperclip, FileText, Download, PlayCircle, Image } from "lucide-react";

const CHANNELS = [
    { id: "general", label: "general", emoji: "#" },
    { id: "iot-projects", label: "iot-projects", emoji: "#" },
    { id: "announcements", label: "announcements", emoji: "#" },
    { id: "off-topic", label: "off-topic", emoji: "#" },
];

interface Msg { _id?: string; user: { _id?: string; name: string; avatar?: string; role?: string }; content: string; createdAt: string; fileData?: string; fileName?: string; fileType?: string; }

export default function MeetingPage() {
    const { user, token, isMember } = useAuth();
    const [channel, setChannel] = useState("general");
    const [messages, setMessages] = useState<Msg[]>([]);
    const [input, setInput] = useState("");
    const [file, setFile] = useState<{ data: string; name: string; type: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [socketReady, setSocketReady] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFile({
                data: reader.result as string,
                name: selected.name,
                type: selected.type
            });
        };
        reader.readAsDataURL(selected);
    };

    const send = () => {
        if ((!input.trim() && !file) || !socketRef.current || !user) return;
        
        const payload = {
            channel,
            content: input.trim() || (file ? `Sent a file: ${file.name}` : ""),
            fileData: file?.data,
            fileName: file?.name,
            fileType: file?.type
        };

        socketRef.current.emit('send_message', payload);
        setInput("");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
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
                                
                                {msg.fileData && (
                                    <div className="mt-3 max-w-sm">
                                        {msg.fileType?.startsWith('image/') ? (
                                            <div className="rounded-xl overflow-hidden border border-accent/20 bg-accent/5">
                                                <img src={msg.fileData} className="w-full h-auto max-h-64 object-contain" alt={msg.fileName} />
                                            </div>
                                        ) : msg.fileType?.startsWith('video/') ? (
                                            <div className="rounded-xl overflow-hidden border border-accent/20 bg-black">
                                                <video controls src={msg.fileData} className="w-full h-auto max-h-64" />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 p-3 rounded-xl border border-accent/20 bg-accent/5">
                                                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-primary truncate">{msg.fileName}</p>
                                                    <p className="text-[10px] text-muted uppercase">{msg.fileType?.split('/')[1] || 'File'}</p>
                                                </div>
                                                <a href={msg.fileData} download={msg.fileName} className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-accent hover:bg-accent hover:text-dark-900 transition-all">
                                                    <Download size={14} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-6 py-4">
                    {file && (
                        <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20 animate-fade-up">
                            {file.type.startsWith('image/') ? <Image size={16} className="text-accent" /> : <FileText size={16} className="text-accent" />}
                            <span className="text-xs font-medium text-primary flex-1 truncate">{file.name}</span>
                            <button onClick={() => setFile(null)} className="text-muted hover:text-red-400">
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-3 glass-panel rounded-xl px-4 py-2">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-muted hover:text-accent transition-colors"
                        >
                            <Paperclip size={18} />
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileSelect} 
                                className="hidden" 
                            />
                        </button>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder={file ? "Add a caption..." : `Message #${channel}`}
                            className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted outline-none font-body"
                        />
                        <button onClick={send} disabled={!input.trim() && !file} className="text-accent disabled:opacity-30 hover:text-white transition-colors">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
