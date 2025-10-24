function ConvertMoneyFormat(valor: number | undefined | null): string {
  if (typeof valor !== "number" || isNaN(valor)) {
    valor = 0;
  }

  try {
    return valor.toLocaleString("pt-AO", {
      style: "currency",
      currency: "AOA",
    });
  } catch (error) {
    console.warn("Fallback para AOA: ", error);
    return `AOA ${valor.toFixed(2).replace(".", ",")}`;
  }
}
export default ConvertMoneyFormat;
