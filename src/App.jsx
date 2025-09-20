import * as React from 'react';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function FormBasic() {
  const [valor, setValor] = React.useState(0);

  return (
    <div>
      <div>
        <Typography variant="body1" gutterBottom>Salário bruto:</Typography>
        <TextField
          id="outlined-basic"
          label="Salário bruto"
          variant="outlined"
          type="number"
          onChange={(e) => setValor(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <Typography variant="body1" gutterBottom>
          Valor digitado: {valor || ""}
        </Typography>
      </div>

      <div>
        <TableINSS salario={valor} />
      </div>
    </div>
  );
}

function TableINSS({ salario }) {
  const moeda = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const pct = (v) => `${(v * 100).toFixed(1)}%`;

  function calculaINSS(valor) {
    // evita calcular para vazio/zero/NaN
    if (!valor || isNaN(valor) || valor <= 0) return [];

    const inss = [
      { id: 1, faixa: "até R$ 1518,00",               aliquota: 0.075, de: 0,        ate: 1518,    considerado: 0, contrib: 0 },
      { id: 2, faixa: "de R$ 1518,01 até R$ 2793,88", aliquota: 0.09,  de: 1518.01, ate: 2793.88, considerado: 0, contrib: 0 },
      { id: 3, faixa: "de R$ 2793,89 até R$ 4190,83", aliquota: 0.12,  de: 2793.89, ate: 4190.83, considerado: 0, contrib: 0 },
      { id: 4, faixa: "de R$ 4190,84 até R$ 8157,41", aliquota: 0.14,  de: 4190.84, ate: 8157.41, considerado: 0, contrib: 0 },
    ];

    inss.forEach((f) => {
      // quantidade da faixa efetivamente tributada
      const base = Math.max(0, Math.min(valor, f.ate) - f.de);
      f.considerado = base;
      f.contrib = base * f.aliquota;
    });

    return inss;
  }

  const rows = calculaINSS(salario);

  if (rows.length === 0) return null;

  return (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabela inss">
        <TableHead>
          <TableRow>
            <TableCell>Faixa</TableCell>
            <TableCell align="right">Alíquota</TableCell>
            <TableCell align="right">Valor considerado</TableCell>
            <TableCell align="right">Valor INSS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{row.faixa}</TableCell>
              <TableCell align="right">{pct(row.aliquota)}</TableCell>
              <TableCell align="right">{moeda(row.considerado)}</TableCell>
              <TableCell align="right">{moeda(row.contrib)}</TableCell>
            </TableRow>
          ))}
          {/* Total opcional */}
          <TableRow>
            <TableCell component="th" scope="row"><b>Total</b></TableCell>
            <TableCell />
            <TableCell />
            <TableCell align="right">
              <b>{moeda(rows.reduce((acc, r) => acc + r.contrib, 0))}</b>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function App() {
  return (
    <div>
      <FormBasic />
    </div>
  );
}

export default App;
