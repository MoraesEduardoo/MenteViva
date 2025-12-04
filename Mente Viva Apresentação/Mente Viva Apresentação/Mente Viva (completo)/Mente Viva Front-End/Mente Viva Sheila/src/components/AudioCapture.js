import React, { useState, useRef } from 'react';
import recognition from '../utils/Speech';

function AudioCapture({ onTranscript }) {
  const [listening, setListening] = useState(false);
  const [canStart, setCanStart] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('🔇 Inativo');
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  const startListening = () => {
    if (!canStart || listening) {
      setError('⚠️ Aguarde o reconhecimento encerrar antes de reiniciar.');
      return;
    }

    try {
      recognition.start();
      setListening(true);
      setStatus('🎙️ Ouvindo...');
      setError(null);
      setCanStart(false);

      timeoutRef.current = setTimeout(() => {
        recognition.stop();
        setStatus('⏳ Tempo esgotado');
      }, 10000); // 10 segundos
    } catch (err) {
      setError('Erro ao iniciar reconhecimento: ' + err.message);
    }
  };

  const stopListening = () => {
    recognition.stop();
    clearTimeout(timeoutRef.current);
    setListening(false);
    setStatus('🛑 Parado');
  };

  recognition.onstart = () => setStatus('🎙️ Ouvindo...');
  recognition.onend = () => {
    setStatus('🔇 Inativo');
    setListening(false);
    setCanStart(true);
    clearTimeout(timeoutRef.current);
  };

  recognition.onresult = (event) => {
    let text = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      text += event.results[i][0].transcript;
    }
    setTranscript(text);
    if (onTranscript) {
      onTranscript(text);
    }
  };

  recognition.onerror = (event) => {
    setError('Erro: ' + event.error);
    setStatus('⚠️ Erro');
    setListening(false);
    setCanStart(true);
    clearTimeout(timeoutRef.current);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI', textAlign: 'center' }}>
      <p><strong>Status:</strong> {status}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ margin: '20px 0' }}>
        <button className="botao-acao botao-acao1" onClick={startListening} disabled={listening || !canStart}>
          🎙️ Começar a ouvir
        </button>
        <button className="botao-acao botao-acao2" onClick={stopListening} disabled={!listening}>
          🛑 Parar
        </button>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #d0dce5',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
      }}>
        <p><strong>Texto capturado:</strong></p>
        <p style={{ fontSize: '1.1rem', color: '#03293e' }}>{transcript}</p>
      </div>
    </div>
  );
}

export default AudioCapture;
