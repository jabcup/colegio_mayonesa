"use client";

import { MenuItem, TextField } from "@mui/material";

interface Props {
  gestion: number;
  gestiones: number[];
  onChange: (gestion: number) => void;
}

export default function SelectorGestion({
  gestion,
  gestiones,
  onChange,
}: Props) {
  return (
    <TextField
      select
      label="Gestión"
      value={gestion}
      onChange={(e) => onChange(Number(e.target.value))}
      sx={{ mb: 2, minWidth: 150 }}
    >
      <MenuItem value={0}>Todas</MenuItem>
      {gestiones.map((g) => (
        <MenuItem key={g} value={g}>
          {g}
        </MenuItem>
      ))}
    </TextField>
  );
}
