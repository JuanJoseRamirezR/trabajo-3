export function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

export function fechasDeLaSemana() {
  const hoy = new Date();
  const diaSemana = (hoy.getDay() + 6) % 7; // 0 = lunes
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - diaSemana);

  return Array.from({ length: 7 }).map((_, i) => {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    return fecha.toISOString().slice(0, 10);
  });
}
