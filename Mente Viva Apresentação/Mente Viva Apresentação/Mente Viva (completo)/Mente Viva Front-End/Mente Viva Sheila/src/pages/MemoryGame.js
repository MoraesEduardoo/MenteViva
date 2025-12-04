import React, { useState, useEffect } from 'react';

const emojis = ['🐶', '🐱', '🐭', '🐹', '🦊', '🐻'];
const generateCards = () =>
  [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));

export default function MemoryGame() {
  const [cards, setCards] = useState(generateCards());
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const totalPairs = emojis.length;

  const handleClick = (index) => {
    if (selected.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setSelected([...selected, index]);
  };

  useEffect(() => {
    if (selected.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = selected;
      if (cards[first].emoji === cards[second].emoji) {
        const newCards = [...cards];
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setMatchedCount((prev) => prev + 1);
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
        }, 1000);
      }
      setSelected([]);
    }
  }, [selected, cards]);

  const resetGame = () => {
    setCards(generateCards());
    setSelected([]);
    setMoves(0);
    setMatchedCount(0);
  };

  return (
    <div className="container">
      <section className="section card-lg">
        <h1>🧠 Jogo de Memória</h1>
        <p className="lead">Encontre os pares iguais. Clique nas cartas para revelar.</p>

        <div className="stat" style={{ marginBottom: 12 }}>
          <span>Movimentos: <b>{moves}</b></span>
          <span> • </span>
          <span>Pares encontrados: <b>{matchedCount} / {totalPairs}</b></span>
        </div>

        <div className="btn-row" style={{ marginBottom: 20 }}>
          <button className="btn" onClick={resetGame}>🔄 Reiniciar Jogo</button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: '12px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleClick(index)}
              style={{
                width: '80px',
                height: '80px',
                fontSize: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: card.isMatched ? '#d4f8d4' : card.isFlipped ? '#ffffff' : '#d0dce5',
                border: '2px solid #0a4d6d',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, background-color 0.3s ease',
                boxShadow: card.isFlipped || card.isMatched ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </div>
          ))}
        </div>

        {matchedCount === totalPairs && (
          <div style={{
            marginTop: '2rem',
            padding: '16px',
            backgroundColor: '#e6ffed',
            border: '2px solid #37c978',
            borderRadius: '12px',
            color: '#22543d',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            textAlign: 'center',
            animation: 'fadeIn 0.6s ease-in-out'
          }}>
            🎉 Parabéns! Você encontrou todos os pares com {moves} movimentos!
          </div>
        )}
      </section>
    </div>
  );
}
