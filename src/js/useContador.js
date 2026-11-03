import { useState } from 'react';
//gestiona el estado del contador (cantidad de ramos para el carrito)
export function useContador({ inicial = 1, paso = 1, min = 1, max = 99 } = {}) {
  const [valor, setValor] = useState(inicial);

  const incrementar = () => setValor((v) => Math.min(v + paso, max));
  const decrementar = () => setValor((v) => Math.max(v - paso, min));
  const reiniciar = () => setValor(inicial);
  const establecer = (nuevoValor) => {
    const num = parseInt(nuevoValor, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      setValor(num);
    }
  };

  return { valor, incrementar, decrementar, reiniciar, establecer };
}