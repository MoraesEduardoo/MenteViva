import React from 'react';

export default function Institucional() {
  return (
    <div className="container">
      <section className="section hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>Mente Viva</h1>
            <p className="lead">
              Bem-vindo! Atividades leves e recursos simples para estimular memória,
              atenção e bem-estar de idosos.
            </p>
            <ul className="pill-list">
              <li>Empatia</li><li>Facilidade</li><li>Bem-estar</li>
            </ul>
          </div>
          <div className="hero-media">
            <img src="/imagens/img-mente-viva.jpg" alt="Idoso sorrindo com tranquilidade" />
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Quem Somos</h2>
        <p>
          A <strong>Mente Viva</strong> é uma iniciativa focada em oferecer exercícios cognitivos,
          diário de memória e acompanhamento simples para idosos e familiares.
        </p>
        <img src="/imagens/img-mente-viva-4.jpg" alt="Grupo de idosos em atividade" style={{marginTop:16}} />
      </section>
    </div>
  );
}
