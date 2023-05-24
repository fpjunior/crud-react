import React, { useState } from 'react';
import Badge from 'react-bootstrap/Badge';

function PillExample({ onClick }) {
  const [activeBadge, setActiveBadge] = useState('Todos');

  const handleBadgeClick = (badge) => {
    setActiveBadge(badge);
    onClick(badge); // Repasse o valor do badge clicado para a função de clique externa, se necessário
  };

  return (
    <div>
      <Badge
        onClick={() => handleBadgeClick('Todos')}
        pill
        bg={activeBadge === 'Todos' ? 'primary' : 'secondary'}
      >
        Todos
      </Badge>{' '}
      <Badge
        onClick={() => handleBadgeClick('Diariamente')}
        pill
        bg={activeBadge === 'Diariamente' ? 'primary' : 'secondary'}
      >
        Diariamente
      </Badge>{' '}
      <Badge
        onClick={() => handleBadgeClick('Semanal')}
        pill
        bg={activeBadge === 'Semanal' ? 'primary' : 'secondary'}
      >
        Semanal
      </Badge>{' '}
      <Badge
        onClick={() => handleBadgeClick('Mensal')}
        pill
        bg={activeBadge === 'Mensal' ? 'primary' : 'secondary'}
      >
        Mensal
      </Badge>{' '}
      <Badge
        onClick={() => handleBadgeClick('Anual')}
        pill
        bg={activeBadge === 'Anual' ? 'primary' : 'secondary'}
      >
        Anual
      </Badge>{' '}
    </div>
  );
}

export default PillExample;
