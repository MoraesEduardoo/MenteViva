export function aplicarMascaraCelular(valor) {
  valor = valor.replace(/\D/g, '');
  if (valor.length > 11) valor = valor.slice(0, 11);
  if (valor.length > 6) return `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
  if (valor.length > 2) return `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  return valor;
}
